import axios from 'axios';
import { ROBOFLOW_CONFIG } from '@/config/roboflow';

// Types for API response
export interface RoboflowPrediction {
  class: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
  class_id: number;
  detection_id: string;
}

export interface RoboflowResponse {
  predictions: RoboflowPrediction[];
}

export interface PestDetectionResult {
  name: string;
  probability: number;
  severity: 'rendah' | 'sedang' | 'tinggi';
  confidence: number;
  classId: number;
  detectionId: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Helper function to load image as base64 (for reference)
const loadImageBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Convert Roboflow prediction to our format
const convertPredictionToResult = (prediction: RoboflowPrediction): PestDetectionResult => {
  const confidence = Math.round(prediction.confidence * 100);
  
  // Determine severity based on confidence
  let severity: 'rendah' | 'sedang' | 'tinggi';
  if (confidence >= 70) {
    severity = 'tinggi';
  } else if (confidence >= 40) {
    severity = 'sedang';
  } else {
    severity = 'rendah';
  }

  return {
    name: prediction.class,
    probability: confidence,
    severity,
    confidence: prediction.confidence,
    classId: prediction.class_id,
    detectionId: prediction.detection_id,
    boundingBox: {
      x: prediction.x,
      y: prediction.y,
      width: prediction.width,
      height: prediction.height,
    },
  };
};

// Main API function to detect pests
export const detectPest = async (imageBase64: string): Promise<PestDetectionResult[]> => {
  try {
    // Send base64 image data directly as per Roboflow documentation
    const response = await axios.post<RoboflowResponse>(
      ROBOFLOW_CONFIG.MODEL_URL,
      imageBase64, // Send base64 string directly
      {
        params: {
          api_key: ROBOFLOW_CONFIG.API_KEY,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: ROBOFLOW_CONFIG.TIMEOUT,
      }
    );

    // Debug: Log the full response
    console.log('Roboflow API Response:', response.data);

    // Check if predictions exist
    if (!response.data || !response.data.predictions) {
      console.warn('No predictions in API response');
      return [];
    }

    // Convert predictions to our format
    const results = response.data.predictions.map(convertPredictionToResult);
    
    // Debug: Log converted results
    console.log('Converted Results:', results);
    
    // Sort by confidence (highest first)
    return results.sort((a, b) => b.confidence - a.confidence);
    
  } catch (error) {
    console.error('Roboflow API Error:', error);
    
    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Network Error: Unable to connect to pest detection service');
      }
    }
    
    // Generic error fallback
    throw new Error('Failed to analyze image. Please try again.');
  }
};

// Alternative method using image URL (if you have images hosted somewhere)
export const detectPestFromUrl = async (imageUrl: string): Promise<PestDetectionResult[]> => {
  try {
    const response = await axios.post<RoboflowResponse>(
      ROBOFLOW_CONFIG.MODEL_URL,
      null,
      {
        params: {
          api_key: ROBOFLOW_CONFIG.API_KEY,
          image: imageUrl,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: ROBOFLOW_CONFIG.TIMEOUT,
      }
    );

    // Debug: Log the full response
    console.log('Roboflow API Response (URL):', response.data);

    // Check if predictions exist
    if (!response.data || !response.data.predictions) {
      console.warn('No predictions in API response');
      return [];
    }

    const results = response.data.predictions.map(convertPredictionToResult);
    return results.sort((a, b) => b.confidence - a.confidence);
    
  } catch (error) {
    console.error('Roboflow API Error:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
      } else if (error.request) {
        throw new Error('Network Error: Unable to connect to pest detection service');
      }
    }
    
    throw new Error('Failed to analyze image. Please try again.');
  }
};
