from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Load the Random Forest model
model_path = 'model.pkl'
if os.path.exists(model_path):
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    print(f"Model loaded successfully from {model_path}")
else:
    print(f"Model file {model_path} not found!")
    model = None

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/predict-disease-risk', methods=['POST'])
def predict_disease_risk():
    try:
        if model is None:
            return jsonify({
                'error': 'Model not loaded',
                'risk_level': 'unknown',
                'risk_score': 0.0,
                'recommendations': ['Model not available']
            }), 500

        data = request.get_json()
        
        # Extract features from the request
        # Adjust these feature names based on your model's training data
        features = [
            data.get('temperature', 25.0),
            data.get('humidity', 60.0),
            data.get('soil_moisture', 50.0),
            data.get('soil_ph', 6.5),
            data.get('rainfall', 0.0),
            data.get('growth_stage', 50.0),
            data.get('crop_age_days', 30.0),
            data.get('field_size', 1.0),
            data.get('previous_disease', 0.0),
            data.get('fertilizer_applied', 1.0)
        ]
        
        # Convert to numpy array and reshape for prediction
        features_array = np.array(features).reshape(1, -1)
        
        # Make prediction
        prediction = model.predict(features_array)[0]
        prediction_proba = model.predict_proba(features_array)[0]
        
        # Determine risk level based on prediction
        if prediction == 0:  # No disease
            risk_level = 'low'
            risk_score = prediction_proba[0] if len(prediction_proba) > 0 else 0.1
        elif prediction == 1:  # Disease present
            risk_level = 'high'
            risk_score = prediction_proba[1] if len(prediction_proba) > 1 else 0.9
        else:
            risk_level = 'medium'
            risk_score = 0.5
        
        # Generate recommendations based on risk level
        recommendations = generate_recommendations(risk_level, data)
        
        return jsonify({
            'risk_level': risk_level,
            'risk_score': float(risk_score),
            'prediction': int(prediction),
            'recommendations': recommendations,
            'features_used': features,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'risk_level': 'unknown',
            'risk_score': 0.0,
            'recommendations': ['Error in prediction']
        }), 500

def generate_recommendations(risk_level, data):
    recommendations = []
    
    if risk_level == 'low':
        recommendations.extend([
            'Continue current farming practices',
            'Monitor field conditions regularly',
            'Maintain optimal irrigation schedule'
        ])
    elif risk_level == 'medium':
        recommendations.extend([
            'Increase monitoring frequency',
            'Check for early disease symptoms',
            'Consider preventive fungicide application',
            'Improve field drainage if needed'
        ])
    else:  # high risk
        recommendations.extend([
            'Immediate field inspection required',
            'Apply appropriate fungicide/pesticide',
            'Isolate affected areas if possible',
            'Consult with agricultural expert',
            'Consider crop rotation for next season'
        ])
    
    # Add specific recommendations based on environmental conditions
    if data.get('humidity', 0) > 80:
        recommendations.append('High humidity detected - improve ventilation')
    
    if data.get('soil_moisture', 0) > 80:
        recommendations.append('Excessive soil moisture - check drainage')
    
    if data.get('temperature', 0) > 30:
        recommendations.append('High temperature - ensure adequate irrigation')
    
    return recommendations

@app.route('/api/batch-predict', methods=['POST'])
def batch_predict():
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        data = request.get_json()
        fields = data.get('fields', [])
        
        results = []
        for field in fields:
            features = [
                field.get('temperature', 25.0),
                field.get('humidity', 60.0),
                field.get('soil_moisture', 50.0),
                field.get('soil_ph', 6.5),
                field.get('rainfall', 0.0),
                field.get('growth_stage', 50.0),
                field.get('crop_age_days', 30.0),
                field.get('field_size', 1.0),
                field.get('previous_disease', 0.0),
                field.get('fertilizer_applied', 1.0)
            ]
            
            features_array = np.array(features).reshape(1, -1)
            prediction = model.predict(features_array)[0]
            prediction_proba = model.predict_proba(features_array)[0]
            
            risk_level = 'low' if prediction == 0 else 'high'
            risk_score = prediction_proba[0] if prediction == 0 else prediction_proba[1]
            
            results.append({
                'field_id': field.get('id'),
                'field_name': field.get('name'),
                'risk_level': risk_level,
                'risk_score': float(risk_score),
                'prediction': int(prediction)
            })
        
        return jsonify({
            'results': results,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting ML API server...")
    print(f"Model loaded: {model is not None}")
    app.run(host='0.0.0.0', port=5000, debug=True)
