#!/usr/bin/env python3
"""
Startup script for the ML Disease Prediction API
"""

import os
import sys
import subprocess
import time

def check_model_file():
    """Check if model.pkl exists"""
    if not os.path.exists('model.pkl'):
        print("❌ Error: model.pkl not found!")
        print("Please ensure your trained model file is in the current directory.")
        print("You can generate it by running your Jupyter notebook (Untitled16.ipynb)")
        return False
    return True

def check_dependencies():
    """Check if required packages are installed"""
    try:
        import flask
        import pandas
        import numpy
        import sklearn
        import joblib
        print("✅ All required packages are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please install requirements: pip install -r requirements.txt")
        return False

def start_api():
    """Start the Flask API"""
    print("🚀 Starting ML Disease Prediction API...")
    print("📍 API will be available at: http://localhost:5000")
    print("🔍 Health check: http://localhost:5000/health")
    print("📊 Prediction endpoint: http://localhost:5000/predict")
    print("\n" + "="*50)
    
    try:
        # Start the Flask app
        subprocess.run([sys.executable, 'ml_api.py'], check=True)
    except KeyboardInterrupt:
        print("\n👋 API stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error starting API: {e}")
        return False
    
    return True

def main():
    """Main startup function"""
    print("🌱 ML Disease Prediction API Startup")
    print("="*50)
    
    # Check prerequisites
    if not check_model_file():
        sys.exit(1)
    
    if not check_dependencies():
        sys.exit(1)
    
    # Start the API
    start_api()

if __name__ == "__main__":
    main()
