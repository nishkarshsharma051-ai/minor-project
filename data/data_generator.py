import numpy as np
import pandas as pd
import os

# Configuration
SEED = 42
rng = np.random.default_rng(SEED)
N = 5000 

# Feature generation
marks = rng.integers(30, 100, N).astype(float)
attendance = rng.integers(40, 100, N).astype(float)
assignment_completion = rng.integers(30, 100, N).astype(float)
participation = rng.integers(20, 100, N).astype(float)
coding_score = rng.integers(20, 100, N).astype(float)
communication_score = rng.integers(20, 100, N).astype(float)

composite = (
    0.30 * marks +
    0.20 * attendance +
    0.20 * assignment_completion +
    0.10 * participation +
    0.10 * coding_score +
    0.10 * communication_score
)
composite += rng.normal(0, 2, N)

def label_perf(score):
    if score >= 70: return "high"
    if score >= 50: return "medium"
    return "low"

def label_behavior(part, att):
    score = 0.6 * part + 0.4 * att
    if score >= 75: return "good"
    if score >= 50: return "average"
    return "poor"

def label_dropout(att, mks):
    score = 0.7 * (100 - att) + 0.3 * (100 - mks)
    if score >= 50: return "high"
    if score >= 25: return "medium"
    return "low"

def label_attendance(part, mks, att):
    score = 0.4 * part + 0.2 * mks + 0.4 * att
    if score >= 75: return "high"
    if score >= 50: return "moderate"
    return "low"

performance_label = np.vectorize(label_perf)(composite)
behavior_label = np.vectorize(label_behavior)(participation, attendance)
dropout_risk = np.vectorize(label_dropout)(attendance, marks)
attendance_pred = np.vectorize(label_attendance)(participation, marks, attendance)

# Assemble and save
df = pd.DataFrame({
    "marks": marks,
    "attendance": attendance,
    "assignment_completion": assignment_completion,
    "participation": participation,
    "coding_score": coding_score,
    "communication_score": communication_score,
    "performance_label": performance_label,
    "behavior_label": behavior_label,
    "dropout_risk": dropout_risk,
    "attendance_prediction": attendance_pred,
})

out_path = os.path.join(os.path.dirname(__file__), "students.csv")
df.to_csv(out_path, index=False)
print(f"Generated {N} rows -> {out_path}")
