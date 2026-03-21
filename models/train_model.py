import os
import sys
import logging
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.model_utils import save_model

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "students.csv")

FEATURE_COLS = [
    "marks", "attendance", "assignment_completion",
    "participation", "coding_score", "communication_score"
]
TARGET_COLS = [
    "performance_label", "behavior_label", "dropout_risk", "attendance_prediction"
]

def load_data(path: str):
    """Loads and validates the training CSV."""
    logger.info(f"Reading data from {path}")
    df = pd.read_csv(path)

    missing = set(FEATURE_COLS + TARGET_COLS) - set(df.columns)
    if missing:
        raise ValueError(f"Missing columns: {missing}")

    return df[FEATURE_COLS], df[TARGET_COLS]

def build_pipeline():
    """Returns a fresh Random Forest pipeline."""
    return Pipeline([
        ("scaler", StandardScaler()),
        ("clf", RandomForestClassifier(
            n_estimators=300,
            min_samples_split=4,
            min_samples_leaf=2,
            class_weight="balanced",
            random_state=42,
            n_jobs=-1
        )),
    ])

def train(data_path=DATA_PATH):
    """Execution loop for model training and evaluation."""
    X, y = load_data(data_path)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    pipeline = build_pipeline()
    logger.info("Training multi-output forest...")
    pipeline.fit(X_train, y_train)

    # Evaluation
    preds = pipeline.predict(X_test)
    print("\n--- Model Evaluation ---")
    for i, col in enumerate(TARGET_COLS):
        actual = y_test[col]
        predicted = preds[:, i]
        acc = accuracy_score(actual, predicted)
        print(f"Target: {col:20} | Accuracy: {acc:.4f}")
    
    return pipeline

def main():
    if not os.path.exists(DATA_PATH):
        logger.warning("Dataset missing, generating synthetic data...")
        import subprocess
        gen_script = os.path.join(BASE_DIR, "data", "data_generator.py")
        subprocess.run([sys.executable, gen_script], check=True)

    model = train()
    save_model(model)
    logger.info("Done. Model saved to models/model.pkl")

if __name__ == "__main__":
    main()
