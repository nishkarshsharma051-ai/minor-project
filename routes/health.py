"""
health.py
---------
Blueprint for GET /health — simple server liveness check.
"""

from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__)


@health_bp.get("/health")
def health_check():
    """
    Returns server status.

    Response 200:
        { "status": "ok", "message": "Server is running" }
    """
    return jsonify({"status": "ok", "message": "Server is running"}), 200
