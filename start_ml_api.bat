@echo off
echo 🌱 ML Disease Prediction API Startup
echo ================================================

REM Check if model.pkl exists
if not exist "model.pkl" (
    echo ❌ Error: model.pkl not found!
    echo Please ensure your trained model file is in the current directory.
    echo You can generate it by running your Jupyter notebook (Untitled16.ipynb)
    pause
    exit /b 1
)

echo ✅ Model file found: model.pkl

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found! Please install Python first.
    pause
    exit /b 1
)

echo ✅ Python is available

REM Install requirements if needed
echo 📦 Checking dependencies...
pip install -r requirements.txt

echo 🚀 Starting ML Disease Prediction API...
echo 📍 API will be available at: http://localhost:5000
echo 🔍 Health check: http://localhost:5000/health
echo 📊 Prediction endpoint: http://localhost:5000/predict
echo.
echo ================================================

REM Start the Flask app
python ml_api.py

pause
