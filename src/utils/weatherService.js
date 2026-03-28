/**
 * 实时天气：Open-Meteo（无需 key，商用需遵守其条款）
 * https://open-meteo.com/
 */

/** 鞍山市中心附近 WGS84，与 open-meteo 网格对齐 */
export const DEFAULT_ANSHAN_COORDS = { latitude: 41.1089, longitude: 122.9946 };

/**
 * WMO Weather interpretation codes → 中文简述 + 展示用符号
 * @see https://open-meteo.com/en/docs
 */
export function wmoCodeToZhEmoji(code) {
  const c = Number(code);
  const map = {
    0: { text: "晴", emoji: "☀️" },
    1: { text: "晴间多云", emoji: "🌤️" },
    2: { text: "多云", emoji: "⛅" },
    3: { text: "阴", emoji: "☁️" },
    45: { text: "雾", emoji: "🌫️" },
    48: { text: "雾", emoji: "🌫️" },
    51: { text: "小毛毛雨", emoji: "🌦️" },
    53: { text: "毛毛雨", emoji: "🌦️" },
    55: { text: "大毛毛雨", emoji: "🌧️" },
    56: { text: "冻毛毛雨", emoji: "🌧️" },
    57: { text: "强冻毛毛雨", emoji: "🌧️" },
    61: { text: "小雨", emoji: "🌧️" },
    63: { text: "中雨", emoji: "🌧️" },
    65: { text: "大雨", emoji: "🌧️" },
    66: { text: "冻雨", emoji: "🌨️" },
    67: { text: "强冻雨", emoji: "🌨️" },
    71: { text: "小雪", emoji: "❄️" },
    73: { text: "中雪", emoji: "❄️" },
    75: { text: "大雪", emoji: "❄️" },
    77: { text: "雪粒", emoji: "❄️" },
    80: { text: "小阵雨", emoji: "🌦️" },
    81: { text: "阵雨", emoji: "🌧️" },
    82: { text: "强降雨", emoji: "⛈️" },
    85: { text: "小阵雪", emoji: "🌨️" },
    86: { text: "阵雪", emoji: "🌨️" },
    95: { text: "雷阵雨", emoji: "⛈️" },
    96: { text: "雷阵雨伴冰雹", emoji: "⛈️" },
    99: { text: "强雷暴", emoji: "⛈️" },
  };
  return map[c] || { text: "未知", emoji: "🌡️" };
}

/**
 * @param {{ latitude: number, longitude: number }} coords
 * @returns {Promise<{ description: string, emoji: string, tempRangeText: string, temperatureC: number, line: string }>}
 */
export async function fetchOpenMeteoCurrent(coords) {
  const { latitude, longitude } = coords;
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", "temperature_2m,weather_code");
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min");
  url.searchParams.set("forecast_days", "1");
  url.searchParams.set("timezone", "Asia/Shanghai");
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Open-Meteo HTTP ${res.status}`);
  }
  const data = await res.json();
  const cur = data.current;
  if (!cur || typeof cur.temperature_2m !== "number") {
    throw new Error("Open-Meteo: 无 current 温度数据");
  }
  const { text, emoji } = wmoCodeToZhEmoji(cur.weather_code);

  const daily = data.daily;
  let tempRangeText;
  if (
    daily &&
    typeof daily.temperature_2m_min?.[0] === "number" &&
    typeof daily.temperature_2m_max?.[0] === "number"
  ) {
    const lo = Math.round(
      Math.min(daily.temperature_2m_min[0], daily.temperature_2m_max[0])
    );
    const hi = Math.round(
      Math.max(daily.temperature_2m_min[0], daily.temperature_2m_max[0])
    );
    tempRangeText = lo === hi ? `${lo}°C` : `${lo}-${hi}°C`;
  } else {
    tempRangeText = `${Math.round(cur.temperature_2m)}°C`;
  }

  return {
    description: text,
    emoji,
    temperatureC: cur.temperature_2m,
    tempRangeText,
    /** 例：晴 4-20°C */
    line: `${text} ${tempRangeText}`,
  };
}
