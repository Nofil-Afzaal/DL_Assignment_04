# Action Caption (Stanford40)

A small demo app that:
- takes a **single image**,
- predicts the most likely **action** (Stanford40-style classes),
- generates a simple **caption** based on the predicted class.

The project has two parts:
- **Frontend**: Next.js UI (upload image → predict → show result)
- **Backend**: Flask API that loads the trained models and returns `{ action, caption }`

## Quick Start

### 1) Start the backend (Flask)

From the project root:

```bash
cd backend

# Create venv (recommended)
python -m venv .venv

# Activate (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# Install dependencies
python -m pip install flask flask-cors tensorflow opencv-python numpy

# Run server
python app.py
```

Backend runs at: `http://127.0.0.1:5000`

### 2) Start the frontend (Next.js)

From the project root:

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

## Models

The trained weights are included in:
- `backend/models/cnn_feature_extractor.h5`
- `backend/models/lstm_action_model.h5`

## Training Notebook

The training / preprocessing notebook is in:
- `TFiles/DataPreprocessing_Training.ipynb`

## Notes

- This is a development/demo setup (Flask dev server).
- If the frontend says “Backend not responding”, make sure the Flask server is running on `http://127.0.0.1:5000`.
