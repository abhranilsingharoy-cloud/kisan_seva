# KisanSeva ML Service

## Setup
`ash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
`

## Production: Replace mock inference
In main.py, replace the mock in diagnose_crop() with:
`python
import tensorflow as tf
model = tf.keras.models.load_model('models/mobilenetv2_plantvillage_v2.h5')
# Preprocess image ? run model.predict() ? return top class
`

## Endpoints
- GET  /health         — Service health
- POST /v1/diagnose    — Diagnose crop image (multipart/form-data)  
- GET  /v1/diseases    — List all detectable diseases
