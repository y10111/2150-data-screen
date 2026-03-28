"""
2150 数据大屏 — 本地 LLM 预警生成服务（原 RAG 已移除）

- 仅使用本地 Qwen2.5-Instruct，不依赖向量库 / 文档解析
- 读取仓库内 src/mock/data 下 JSON（只读，不修改前端与其它代码）
- 提供与 Mock 前端兼容的 GET /dashboard/ai/alerts
"""

import copy
import json
import logging
import os
import re
import threading
import time

os.environ.setdefault("HF_HUB_OFFLINE", "1")
os.environ.setdefault("TRANSFORMERS_OFFLINE", "1")
os.environ.setdefault("KMP_DUPLICATE_LIB_OK", "TRUE")
os.environ.setdefault("PYTORCH_ENABLE_MPS_FALLBACK", "1")

import torch
from flask import Flask, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer

from config import setup_cors

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("screen_ai")

app = Flask(__name__)
setup_cors(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# 2150-data-screen 根目录（screen_ai_service 的上一级）
REPO_ROOT = os.path.normpath(os.path.join(BASE_DIR, ".."))
MOCK_DATA_DIR = os.path.join(REPO_ROOT, "src", "mock", "data")

LLM_MODEL_PATH = os.path.join(BASE_DIR, "models", "Qwen2.5-1.5B-Instruct")

GEN_CONFIG = {
    "max_new_tokens": 1024,
    # 贪婪解码：不传 temperature/top_p/top_k，避免与 do_sample=False 冲突刷屏告警
    "do_sample": False,
}

# 同一进程内串行推理，避免刷新/并发请求在 MPS 上叠两次 generate 导致异常
_llm_generate_lock = threading.Lock()

log.info("=" * 50)
log.info("2150 screen_ai_service（本地 Qwen，Mock→预警 JSON）")
log.info("模型路径: %s", LLM_MODEL_PATH)
log.info("Mock 目录: %s", MOCK_DATA_DIR)
log.info("=" * 50)

llm = None
llm_tokenizer = None
_device = None


def _pick_device():
    if torch.backends.mps.is_available():
        return "mps"
    return "cpu"


def load_llm():
    global llm, llm_tokenizer, _device
    if llm is not None:
        log.debug("步骤: 模型已在内存中，跳过重复加载")
        return
    _device = _pick_device()
    log.info("步骤 [1/2]: 开始加载 tokenizer / 模型（设备=%s，首次较慢）…", _device)
    t0 = time.perf_counter()
    llm_tokenizer = AutoTokenizer.from_pretrained(
        LLM_MODEL_PATH, trust_remote_code=True, local_files_only=True
    )
    if llm_tokenizer.pad_token is None:
        llm_tokenizer.pad_token = llm_tokenizer.eos_token
    llm = AutoModelForCausalLM.from_pretrained(
        LLM_MODEL_PATH,
        trust_remote_code=True,
        local_files_only=True,
        device_map=_device,
        torch_dtype=torch.float16 if _device != "cpu" else torch.float32,
        low_cpu_mem_usage=True,
    ).eval()
    log.info(
        "步骤 [2/2]: Qwen 加载完成，耗时 %.1f 秒，可接收 /api/dashboard/ai/alerts",
        time.perf_counter() - t0,
    )


def _read_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _rows_from_mock_file(filename):
    path = os.path.join(MOCK_DATA_DIR, filename)
    if not os.path.isfile(path):
        return None
    raw = _read_json(path)
    rows = raw.get("data", raw) if isinstance(raw, dict) else raw
    if not isinstance(rows, list) or not rows:
        return None
    return rows


def load_daily_operations_tail(n=7):
    """读取 dailyOperations.json 中最近 n 条（含 KPI 字段）。"""
    rows = _rows_from_mock_file("dailyOperations.json")
    if not rows:
        return [], None
    tail = rows[-n:]
    latest_date = tail[-1].get("date") if tail else None
    return tail, latest_date


def load_defect_last_json():
    """最近一条缺陷分布（与质量模块同源）。"""
    rows = _rows_from_mock_file("qualityDefects.json")
    if not rows:
        return None
    return json.dumps(rows[-1], ensure_ascii=False, indent=2)


def load_device_health_last_json():
    """最近一条设备健康快照。"""
    rows = _rows_from_mock_file("deviceHealthTimeline.json")
    if not rows:
        return None
    return json.dumps(rows[-1], ensure_ascii=False, indent=2)


def load_inventory_tail_json(n=5):
    """最近 n 条钢坯库存（万吨）。"""
    rows = _rows_from_mock_file("inventoryTimeline.json")
    if not rows:
        return None
    tail = rows[-n:]
    return json.dumps(tail, ensure_ascii=False, indent=2)


def fallback_from_static_timeline():
    """LLM 失败时：沿用 aiAlertTimeline.json 最后一天。"""
    path = os.path.join(MOCK_DATA_DIR, "aiAlertTimeline.json")
    if not os.path.isfile(path):
        return {"code": 200, "data": []}
    raw = _read_json(path)
    data = raw.get("data", raw) if isinstance(raw, dict) else raw
    if not data:
        return {"code": 200, "data": []}
    last = data[-1]
    return {"code": 200, "data": [last]}


def extract_json_object(text: str):
    """从模型输出中解析第一个 JSON 对象。"""
    text = text.strip()
    m = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if m:
        text = m.group(1).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    start = text.find("{")
    end = text.rfind("}")
    if start >= 0 and end > start:
        try:
            return json.loads(text[start : end + 1])
        except json.JSONDecodeError:
            pass
    return None


def generate_alerts_from_context(context_json: str, latest_date: str, extras=None):
    """extras: 附加说明段落（缺陷 / 设备健康 / 库存走势等），全部为 Mock 只读数据。"""
    log.info(
        "步骤: 组装提示词（数据日=%s，附加片段=%s）",
        latest_date,
        "有" if extras else "无",
    )
    load_llm()
    system = (
        "你是鞍钢热轧2150产线的运营分析助手。"
        "只根据用户给出的「演示用 JSON」撰写预警与建议，不要编造数据中不存在的数字。"
        "可综合 KPI、缺陷分布、设备健康、库存时间序列之间的关联写建议，但仍须以给定数字为准。"
        "type 只能是: info, warning, alert 之一（小写）。"
        "输出必须是单个 JSON 对象，不要其它说明文字，格式严格为:\n"
        '{"alerts":[{"id":1,"type":"warning","title":"不超过20字的标题","message":"一句话说明"}]}\n'
        "请生成 4 到 6 条 alerts（覆盖产量/质量/设备/库存/能耗等不同角度若数据支持），id 从 1 递增。"
    )
    parts = [
        f"数据日期（最近一条）: {latest_date}",
        "",
        "【最近若干日运营 KPI】（dailyOperations）",
        context_json,
    ]
    if extras:
        parts.extend(extras)
    user = "\n".join(parts)
    messages = [
        {"role": "system", "content": system},
        {"role": "user", "content": user},
    ]
    prompt = llm_tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True
    )
    inputs = llm_tokenizer(prompt, return_tensors="pt").to(llm.device)
    in_len = int(inputs.input_ids.shape[1])
    log.info(
        "步骤: 开始模型推理（输入约 %d token，max_new_tokens=%d；MPS/CPU 可能需数十秒至数分钟）",
        in_len,
        GEN_CONFIG["max_new_tokens"],
    )
    log.info(
        "提示: 若此处长时间无下一条日志，说明仍在 generate；并发请求会排队等待推理锁"
    )
    gen_cfg = copy.deepcopy(llm.generation_config)
    gen_cfg.max_new_tokens = GEN_CONFIG["max_new_tokens"]
    gen_cfg.do_sample = GEN_CONFIG["do_sample"]
    gen_cfg.pad_token_id = llm_tokenizer.pad_token_id
    # 与贪婪解码一致的「中性」采样参数，消除 model 内置 top_p/top_k/temperature 的告警
    gen_cfg.temperature = 1.0
    gen_cfg.top_p = 1.0
    gen_cfg.top_k = 50
    t_gen = time.perf_counter()
    with _llm_generate_lock:
        log.info("步骤: 已持有推理锁，正在 generate…")
        with torch.no_grad():
            outputs = llm.generate(
                inputs.input_ids,
                attention_mask=inputs.attention_mask,
                generation_config=gen_cfg,
            )
    gen = outputs[0][inputs.input_ids.shape[1] :]
    answer = llm_tokenizer.decode(gen, skip_special_tokens=True).strip()
    new_tokens = int(gen.shape[0])
    log.info(
        "步骤: 推理结束，耗时 %.1f 秒（新生成约 %d token，解码后约 %d 字符）",
        time.perf_counter() - t_gen,
        new_tokens,
        len(answer),
    )
    if torch.backends.mps.is_available():
        torch.mps.empty_cache()

    parsed = extract_json_object(answer)
    if not parsed or "alerts" not in parsed:
        log.warning(
            "步骤: 解析模型输出失败（非合法 JSON 或缺少 alerts），原始输出前 200 字: %s",
            (answer[:200] + "…") if len(answer) > 200 else answer,
        )
        return None
    alerts = parsed["alerts"]
    if not isinstance(alerts, list):
        return None
    # 规范化 id 与字段
    out = []
    for i, a in enumerate(alerts):
        if not isinstance(a, dict):
            continue
        t = str(a.get("type", "info")).lower()
        if t not in ("info", "warning", "alert"):
            t = "info"
        out.append(
            {
                "id": int(a.get("id", i + 1)),
                "type": t,
                "title": str(a.get("title", ""))[:80],
                "message": str(a.get("message", ""))[:500],
            }
        )
    if not out:
        log.warning("步骤: JSON 内 alerts 规范化后为空")
        return None
    log.info("步骤: 解析成功，有效预警条数=%d", len(out))
    return {"date": latest_date, "alerts": out}


@app.route("/health", methods=["GET"])
def health():
    log.info("HTTP GET /health")
    load_llm()
    return jsonify(
        {
            "status": "ok",
            "service": "screen_ai_service",
            "model": "Qwen2.5-1.5B-Instruct",
            "device": str(llm.device),
        }
    )


def _dashboard_ai_alerts_impl():
    """
    与前端 Mock 路径一致：返回 { code, data: [ { date, alerts: [...] } ] }
    仅包含「最新数据日」的一条记录，便于 Dashboard 取最后一天。
    """
    req_id = hex(int(time.time() * 1000) % 0xFFFFFF)[2:].zfill(6)
    log.info("[%s] 收到预警请求：开始读 Mock KPI（dailyOperations 最近 7 日）", req_id)
    tail, latest_date = load_daily_operations_tail(n=7)
    if not tail or not latest_date:
        log.warning(
            "[%s] dailyOperations 无数据或缺日期 → 直接返回静态 aiAlertTimeline fallback",
            req_id,
        )
        return jsonify(fallback_from_static_timeline())

    log.info(
        "[%s] Mock 读取成功：KPI 条数=%d，最新日期=%s",
        req_id,
        len(tail),
        latest_date,
    )
    try:
        context_json = json.dumps(tail, ensure_ascii=False, indent=2)
        extras = []
        d = load_defect_last_json()
        if d:
            extras.extend(["", "【缺陷分布（最近一条）】", d])
        h = load_device_health_last_json()
        if h:
            extras.extend(["", "【设备健康（最近一条）】", h])
        inv = load_inventory_tail_json(5)
        if inv:
            extras.extend(["", "【钢坯库存最近5日】（万吨）", inv])
        log.info(
            "[%s] 附加上下文：缺陷=%s 设备健康=%s 库存序列=%s",
            req_id,
            "是" if d else "否",
            "是" if h else "否",
            "是" if inv else "否",
        )
        pack = generate_alerts_from_context(
            context_json, latest_date, extras=extras or None
        )
    except Exception:
        log.exception("[%s] LLM 流程异常 → 使用静态 fallback", req_id)
        return jsonify(fallback_from_static_timeline())

    if pack is None:
        log.warning("[%s] 模型输出不可用 → 使用静态 aiAlertTimeline fallback", req_id)
        return jsonify(fallback_from_static_timeline())

    log.info("[%s] 请求完成：返回模型生成的 %d 条预警", req_id, len(pack.get("alerts", [])))
    return jsonify({"code": 200, "data": [pack]})


@app.route("/dashboard/ai/alerts", methods=["GET"])
def dashboard_ai_alerts():
    return _dashboard_ai_alerts_impl()


@app.route("/api/dashboard/ai/alerts", methods=["GET"])
def dashboard_ai_alerts_api():
    """与 Vue axios baseURL `/api` 一致，便于直连本服务联调。"""
    return _dashboard_ai_alerts_impl()


if __name__ == "__main__":
    port = int(os.environ.get("SCREEN_AI_PORT", "5001"))
    load_llm()
    log.info("Flask 监听 0.0.0.0:%s（/api/dashboard/ai/alerts、/health）", port)
    # threaded=True：长推理时其它连接仍可建立（如健康检查）
    app.run(host="0.0.0.0", port=port, debug=False, threaded=True)
