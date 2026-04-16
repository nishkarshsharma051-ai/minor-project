# EduSetu Monorepo

Unified student analytics system with a Flask ML backend and React frontend.

## Deployment Guide

### 1. Installation
Run the following from the root directory to install both frontend and backend dependencies:
```bash
npm run install-all
```

### 2. Environment Variables
Ensure you have a `.env` file in the `backend/` directory with the following keys:
- `DATABASE_URL`: Your Supabase connection string.
- `FIREBASE_SERVICE_ACCOUNT`: Path to your Firebase service account JSON (e.g., `serviceAccountKey.json`).
- `PORT`: (Optional) Port numbers (default: 5001).

On the frontend, add your Firebase keys to `frontend/src/utils/firebase.js`.

### 3. Production Start (Single Command)
To build the frontend and start the backend server for production:
```bash
npm start
```
This command builds the React app and starts the Flask server using **Gunicorn**. The backend automatically serves the frontend static files.

### 4. Development
To run both services in development mode with hot-reload:
```bash
npm run dev
```

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Firebase Auth
- **Backend**: Flask, scikit-learn, SQLAlchemy (Supabase), Firebase Admin SDK
- **Database**: PostgreSQL (via Supabase)
- **Deployment**: Gunicorn (WSGI Server)

## Project Structure
```
.                   # Root Directory
├── backend/        # Flask ML Backend
├── frontend/       # React Vite Frontend
├── package.json    # Root scripts for deployment
└── run.sh          # Legacy dev script
```

---

## Backend Details (Legacy Readme)

A Python-based analytics engine for predicting student performance and inferring skills. It uses a Random Forest model to provide data-driven insights and automated reports.

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
 