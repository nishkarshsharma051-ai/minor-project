# ScholarMetrics API

A Python-based analytics engine for predicting student performance and inferring skills. It uses a Random Forest model to provide data-driven insights and automated reports.

## Quick Start

### 1. Environment Setup
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Model Training
```bash
python models/train_model.py
```
This script generates synthetic training data (if missing) and trains the predictive pipeline saved to `models/model.pkl`.

### 3. Start Server
```bash
python app.py
```
The API will be available at `http://localhost:5000`.

For production deployment:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
```

## Tech Stack
- **Framework**: Flask (Application Factory pattern)
- **ML**: scikit-learn (Random Forest), pandas, numpy
- **Reporting**: ReportLab (PDF), pandas (CSV)
- **Server**: Gunicorn

## Project Structure
```
backend/
├── app.py                # Main entry point
├── requirements.txt      # Dependencies
├── data/
│   ├── data_generator.py # Synthetic data utility
│   └── students.csv      # Training dataset
├── models/
│   ├── train_model.py    # Training logic
│   └── model.pkl         # Serialized model
├── routes/               # API endpoints
├── services/             # Core business logic
└── utils/                # Helper functions
```

## API Endpoints

### `GET /health`
Returns basic server status.

### `POST /predict`
Generates predictions and skill analysis for a student.
**Payload:**
```json
{
  "marks": 85,
  "attendance": 90,
  "assignment_completion": 80,
  "participation": 75,
  "coding_score": 88,
  "communication_score": 70
}
```

### `GET /download-report`
Exports a PDF or CSV report based on provided student metrics.
- Query params: `format` (pdf/csv) + student metrics.

### `POST /train`
Retrains the model with new samples without requiring a restart.

## Features
- **Multi-output ML**: Predicts performance, behavior, and risk in one pass.
- **Skill Inference**: Derives soft/hard skills from raw academic data.
- **Automated Reporting**: Dynamic PDF generation via ReportLab.
- **Hot-swapping**: In-memory model updates via the `/train` endpoint.

## Configuration & Performance
- The model uses `n_jobs=-1` to leverage all CPU cores during training.
- Use `gunicorn` with multiple workers for concurrent request handling.
- The model is cached in memory at startup for low-latency predictions.
 