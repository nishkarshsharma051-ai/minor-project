"""
model_utils.py
--------------
Centralised helpers for model persistence (joblib).
All routes and services use these functions so the path is never hardcoded twice.
"""

import os
import joblib
import logging
from typing import Any

logger = logging.getLogger(__name__)

# ── Path constants ────────────────────────────────────────────────────────────
_BASE_DIR  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(_BASE_DIR, "models", "model.pkl")


def load_model() -> Any:
    """
    Load the trained scikit-learn pipeline from disk.

    Returns
    -------
    sklearn Pipeline
        The loaded model pipeline.

    Raises
    ------
    FileNotFoundError
        If model.pkl does not exist (user must run train_model.py first).
    """
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"Model not found at '{MODEL_PATH}'. "
            "Run `python models/train_model.py` first."
        )
    logger.info("Loading model from %s", MODEL_PATH)
    return joblib.load(MODEL_PATH)


def save_model(model: Any) -> None:
    """
    Persist a scikit-learn object to MODEL_PATH using joblib compression.

    Parameters
    ----------
    model : Any
        Fitted scikit-learn estimator or Pipeline to save.
    """
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH, compress=3)
    logger.info("Model saved to %s", MODEL_PATH)
