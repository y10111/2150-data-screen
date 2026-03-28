"""Flask CORS，供大屏前端跨域调用（开发时 Vue 代理或直接请求）。"""
from flask_cors import CORS


def setup_cors(app):
    CORS(app)
