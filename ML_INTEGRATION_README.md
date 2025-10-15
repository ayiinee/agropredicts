# ML Disease Prediction Integration

This document explains how to integrate the Random Forest disease prediction model into your React application.

## Overview

The integration consists of:
1. **Python Flask API** (`ml_api.py`) - Serves the ML model predictions
2. **React Service** (`src/services/diseasePredictionApi.ts`) - Handles API communication
3. **Custom Hook** (`src/hooks/useDiseasePrediction.tsx`) - Manages prediction state
4. **Updated Component** (`src/pages/FieldDetail.tsx`) - Displays real-time predictions

## Setup Instructions

### 1. Python API Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Ensure your model file is in the root directory:**
   - Make sure `model.pkl` is in the same directory as `ml_api.py`

3. **Start the Flask API:**
   ```bash
   python ml_api.py
   ```
   The API will run on `http://localhost:5000`

### 2. React Application Setup

1. **Environment Variables (Optional):**
   Create a `.env` file in your React app root:
   ```env
   VITE_ML_API_URL=http://localhost:5000
   ```

2. **The integration is already complete!** The app will:
   - Try to connect to the ML API first
   - Fall back to mock data if the API is unavailable
   - Show online/offline status in the UI

## Features

### Real-time Disease Prediction
- **Temperature, Humidity, Soil Moisture** monitoring
- **AI-powered disease risk assessment** for:
  - Blast
  - Brown Spot  
  - Kresek
  - Tungro
- **Overall risk percentage** with severity levels
- **Individual disease probabilities**

### Smart Treatment Suggestions
- **Automated recommendations** based on:
  - Current sensor readings
  - Predicted disease risks
  - Environmental conditions
- **Priority-based actions** (High/Medium/Low)
- **Specific treatment protocols**

### User Experience
- **Real-time updates** every 30 seconds
- **Loading states** during prediction
- **Error handling** with fallback to mock data
- **Online/Offline status** indicators
- **Manual refresh** capability

## API Endpoints

### Health Check
```
GET /health
```
Returns API status and model availability.

### Disease Prediction
```
POST /predict
Content-Type: application/json

{
  "temperature_C": 24.5,
  "humidity_percent": 68,
  "soil_moisture_percent": 45
}
```

Response:
```json
{
  "overall_risk": 23.5,
  "risk_level": "sedang",
  "predicted_disease": "Blast",
  "disease_risks": [
    {
      "name": "Blast",
      "probability": 15.2,
      "severity": "rendah"
    }
  ],
  "treatments": [
    {
      "id": 1,
      "title": "Irigasi Diperlukan",
      "description": "Kelembapan tanah berada di bawah tingkat optimal.",
      "priority": "high",
      "action": "Tingkatkan penyiraman sebesar 20%"
    }
  ],
  "sensor_data": {
    "temperature_C": 24.5,
    "humidity_percent": 68,
    "soil_moisture_percent": 45,
    "temp_24h_mean": 24.2,
    "humidity_24h_mean": 67.8,
    "soil_moisture_24h_mean": 44.9
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Model Details

The Random Forest model was trained on:
- **900 samples** of rice disease data
- **Features:** Temperature, humidity, soil moisture (current + 24h means)
- **Feature Engineering:** Temperature changes, soil ratios, temporal patterns
- **Classes:** Blast, Brown Spot, Kresek, Tungro
- **Accuracy:** ~93% on test data

## Troubleshooting

### API Not Starting
- Check if `model.pkl` exists in the same directory
- Verify all Python dependencies are installed
- Check if port 5000 is available

### React App Not Connecting
- Verify the API is running on `http://localhost:5000`
- Check browser console for CORS errors
- The app will automatically fall back to mock data

### Predictions Not Updating
- Check the browser network tab for API calls
- Verify sensor data is being generated
- Use the manual refresh button

## Development Notes

- The app simulates real-time sensor data changes
- Mock data is used when the API is unavailable
- All predictions include confidence scores and severity levels
- Treatment suggestions are dynamically generated based on conditions

## Future Enhancements

- Add more sensor types (pH, light intensity, etc.)
- Implement historical data tracking
- Add notification system for high-risk alerts
- Integrate with real IoT sensors
- Add more crop types beyond rice
