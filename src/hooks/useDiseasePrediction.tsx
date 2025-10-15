import { useState, useEffect, useCallback } from 'react';
import { 
  diseasePredictionApi, 
  SensorData, 
  PredictionResponse 
} from '@/services/diseasePredictionApi';

interface UseDiseasePredictionReturn {
  prediction: PredictionResponse | null;
  loading: boolean;
  error: string | null;
  isApiAvailable: boolean;
  predictDisease: (sensorData: SensorData) => Promise<void>;
  refreshPrediction: () => Promise<void>;
}

export function useDiseasePrediction(initialSensorData?: SensorData): UseDiseasePredictionReturn {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiAvailable, setIsApiAvailable] = useState(false);
  const [currentSensorData, setCurrentSensorData] = useState<SensorData | null>(initialSensorData || null);

  // Check API health on mount
  useEffect(() => {
    checkApiHealth();
  }, []);

  // Auto-predict if initial sensor data is provided
  useEffect(() => {
    if (initialSensorData && !prediction && !loading) {
      predictDisease(initialSensorData);
    }
  }, [initialSensorData]);

  const checkApiHealth = useCallback(async () => {
    try {
      const health = await diseasePredictionApi.healthCheck();
      setIsApiAvailable(health.model_loaded);
      setError(null);
    } catch (err) {
      setIsApiAvailable(false);
      console.warn('ML API not available, using mock data:', err);
    }
  }, []);

  const predictDisease = useCallback(async (sensorData: SensorData) => {
    setLoading(true);
    setError(null);
    setCurrentSensorData(sensorData);

    try {
      let result: PredictionResponse;

      if (isApiAvailable) {
        // Use real ML API
        result = await diseasePredictionApi.predictDisease(sensorData);
      } else {
        // Use mock data
        result = diseasePredictionApi.getMockPrediction(sensorData);
      }

      setPrediction(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Prediction failed';
      setError(errorMessage);
      
      // Fallback to mock data on error
      try {
        const mockResult = diseasePredictionApi.getMockPrediction(sensorData);
        setPrediction(mockResult);
        setError('Using offline prediction (API unavailable)');
      } catch (mockErr) {
        setError('Unable to generate prediction');
      }
    } finally {
      setLoading(false);
    }
  }, [isApiAvailable]);

  const refreshPrediction = useCallback(async () => {
    if (currentSensorData) {
      await predictDisease(currentSensorData);
    }
  }, [currentSensorData, predictDisease]);

  return {
    prediction,
    loading,
    error,
    isApiAvailable,
    predictDisease,
    refreshPrediction,
  };
}
