from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load the trained model
try:
    model = joblib.load('model.pkl')
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    model = None

def feature_engineering(X):
    """Apply the same feature engineering as in training"""
    X = X.copy()
    
    # Calculate changes between rows (6 hours before)
    X["temp_change_6h"] = X["temperature_C"].diff(1).fillna(0)
    X["soil_moisture_change_6h"] = X["soil_moisture_percent"].diff(1).fillna(0)
    X["humidity_change_6h"] = X["humidity_percent"].diff(1).fillna(0)
    
    # Temperature to soil moisture ratio
    X["heat_soil_ratio"] = X["temperature_C"] / (X["soil_moisture_percent"] + 1)
    
    # Select features used for training
    features = [
        "temperature_C",
        "humidity_percent", 
        "soil_moisture_percent",
        "temp_24h_mean",
        "humidity_24h_mean",
        "soil_moisture_24h_mean",
        "temp_change_6h",
        "soil_moisture_change_6h",
        "humidity_change_6h",
        "heat_soil_ratio",
    ]
    
    return X[features]

def calculate_24h_means(current_temp, current_humidity, current_soil_moisture):
    """Calculate 24h means based on current values with some variation"""
    # Add some realistic variation (±2°C for temp, ±5% for humidity/soil moisture)
    temp_variation = np.random.normal(0, 1, 24)
    humidity_variation = np.random.normal(0, 2, 24)
    soil_variation = np.random.normal(0, 2, 24)
    
    temp_24h = current_temp + temp_variation
    humidity_24h = current_humidity + humidity_variation
    soil_24h = current_soil_moisture + soil_variation
    
    return {
        'temp_24h_mean': np.mean(temp_24h),
        'humidity_24h_mean': np.mean(humidity_24h),
        'soil_moisture_24h_mean': np.mean(soil_24h)
    }

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/predict', methods=['POST'])
def predict_disease():
    """Predict disease risk based on sensor data"""
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Get sensor data from request
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['temperature_C', 'humidity_percent', 'soil_moisture_percent']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Extract sensor data
        temperature = float(data['temperature_C'])
        humidity = float(data['humidity_percent'])
        soil_moisture = float(data['soil_moisture_percent'])
        
        # Calculate 24h means
        means_24h = calculate_24h_means(temperature, humidity, soil_moisture)
        
        # Create DataFrame with current and historical data
        sensor_data = {
            'temperature_C': [temperature],
            'humidity_percent': [humidity],
            'soil_moisture_percent': [soil_moisture],
            'temp_24h_mean': [means_24h['temp_24h_mean']],
            'humidity_24h_mean': [means_24h['humidity_24h_mean']],
            'soil_moisture_24h_mean': [means_24h['soil_moisture_24h_mean']]
        }
        
        df = pd.DataFrame(sensor_data)
        
        # Apply feature engineering
        features = feature_engineering(df)
        
        # Make prediction
        prediction = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0]
        
        # Get class names (assuming they match the training data)
        class_names = ['Blast', 'Brown Spot', 'Kresek', 'Tungro']
        
        # Create disease risk assessment
        disease_risks = []
        for i, class_name in enumerate(class_names):
            prob = probabilities[i] * 100
            if prob > 0:
                # Determine severity based on probability
                if prob < 10:
                    severity = "sangat rendah"
                elif prob < 25:
                    severity = "rendah"
                elif prob < 50:
                    severity = "sedang"
                else:
                    severity = "tinggi"
                
                disease_risks.append({
                    'name': class_name,
                    'probability': round(prob, 1),
                    'severity': severity
                })
        
        # Calculate overall risk (average of all probabilities)
        overall_risk = round(np.mean(probabilities) * 100, 1)
        
        # Determine overall risk level
        if overall_risk < 15:
            risk_level = "rendah"
        elif overall_risk < 35:
            risk_level = "sedang"
        else:
            risk_level = "tinggi"
        
        # Generate treatment suggestions based on sensor data and predictions
        treatments = generate_treatment_suggestions(temperature, humidity, soil_moisture, disease_risks)
        
        response = {
            'overall_risk': overall_risk,
            'risk_level': risk_level,
            'predicted_disease': prediction,
            'disease_risks': disease_risks,
            'treatments': treatments,
            'sensor_data': {
                'temperature_C': temperature,
                'humidity_percent': humidity,
                'soil_moisture_percent': soil_moisture,
                'temp_24h_mean': round(means_24h['temp_24h_mean'], 1),
                'humidity_24h_mean': round(means_24h['humidity_24h_mean'], 1),
                'soil_moisture_24h_mean': round(means_24h['soil_moisture_24h_mean'], 1)
            },
            'timestamp': datetime.now().isoformat()
        }
        
        logger.info(f"Prediction made for temp={temperature}, humidity={humidity}, soil={soil_moisture}")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in prediction: {e}")
        return jsonify({'error': str(e)}), 500

def generate_treatment_suggestions(temperature, humidity, soil_moisture, disease_risks):
    """Generate treatment suggestions based on sensor data and disease risks"""
    treatments = []
    
    # Soil moisture treatment
    if soil_moisture < 40:
        treatments.append({
            'id': 1,
            'title': 'Irigasi Diperlukan',
            'description': 'Kelembapan tanah berada di bawah tingkat optimal. Jadwalkan irigasi dalam 24 jam.',
            'priority': 'high',
            'action': 'Tingkatkan penyiraman sebesar 20%'
        })
    elif soil_moisture > 70:
        treatments.append({
            'id': 1,
            'title': 'Drainase Diperlukan',
            'description': 'Kelembapan tanah terlalu tinggi. Periksa sistem drainase.',
            'priority': 'medium',
            'action': 'Perbaiki drainase dan kurangi penyiraman'
        })
    
    # Temperature treatment
    if temperature > 30:
        treatments.append({
            'id': 2,
            'title': 'Pendinginan Tanaman',
            'description': 'Suhu terlalu tinggi dapat menyebabkan stres pada tanaman.',
            'priority': 'medium',
            'action': 'Tingkatkan penyiraman dan berikan naungan'
        })
    elif temperature < 20:
        treatments.append({
            'id': 2,
            'title': 'Pemanasan Tanaman',
            'description': 'Suhu terlalu rendah dapat memperlambat pertumbuhan.',
            'priority': 'low',
            'action': 'Gunakan mulsa atau rumah kaca mini'
        })
    
    # Disease-specific treatments
    for disease in disease_risks:
        if disease['probability'] > 15:  # Only suggest treatment for significant risks
            if disease['name'] == 'Blast':
                treatments.append({
                    'id': len(treatments) + 1,
                    'title': 'Pengendalian Penyakit Blast',
                    'description': 'Risiko penyakit blast terdeteksi. Lakukan tindakan pencegahan.',
                    'priority': 'high' if disease['probability'] > 30 else 'medium',
                    'action': 'Gunakan fungisida berbasis tembaga'
                })
            elif disease['name'] == 'Brown Spot':
                treatments.append({
                    'id': len(treatments) + 1,
                    'title': 'Pengendalian Brown Spot',
                    'description': 'Risiko penyakit brown spot terdeteksi.',
                    'priority': 'medium',
                    'action': 'Gunakan fungisida sistemik'
                })
            elif disease['name'] == 'Kresek':
                treatments.append({
                    'id': len(treatments) + 1,
                    'title': 'Pengendalian Kresek',
                    'description': 'Risiko penyakit kresek terdeteksi.',
                    'priority': 'high' if disease['probability'] > 25 else 'medium',
                    'action': 'Gunakan bakterisida dan perbaiki drainase'
                })
            elif disease['name'] == 'Tungro':
                treatments.append({
                    'id': len(treatments) + 1,
                    'title': 'Pengendalian Tungro',
                    'description': 'Risiko penyakit tungro terdeteksi.',
                    'priority': 'high' if disease['probability'] > 25 else 'medium',
                    'action': 'Kontrol vektor dan gunakan varietas tahan'
                })
    
    # Default treatment if no specific issues
    if not treatments:
        treatments.append({
            'id': 1,
            'title': 'Pemantauan Rutin',
            'description': 'Kondisi tanaman dalam keadaan baik. Lanjutkan pemantauan rutin.',
            'priority': 'low',
            'action': 'Pertahankan jadwal perawatan saat ini'
        })
    
    return treatments

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
