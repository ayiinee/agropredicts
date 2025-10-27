// Disease Prediction API Service
const API_BASE_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:5000';

export interface SensorData {
  temperature_C: number;
  humidity_percent: number;
  soil_moisture_percent: number;
  temp_24h_mean?: number;
  humidity_24h_mean?: number;
  soil_moisture_24h_mean?: number;
  temp_change_6h?: number;
  soil_moisture_change_6h?: number;
  humidity_change_6h?: number;
  heat_soil_ratio?: number;
}

export interface DiseaseRisk {
  name: string;
  probability: number;
  severity: string;
}

export interface Treatment {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  action: string;
}

export interface PredictionResponse {
  overall_risk: number;
  risk_level: string;
  predicted_disease: string;
  disease_risks: DiseaseRisk[];
  treatments: Treatment[];
  sensor_data: {
    temperature_C: number;
    humidity_percent: number;
    soil_moisture_percent: number;
    temp_24h_mean: number;
    humidity_24h_mean: number;
    soil_moisture_24h_mean: number;
  };
  timestamp: string;
}

export interface ApiError {
  error: string;
}

class DiseasePredictionApi {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Check if the ML API is healthy and model is loaded
   */
  async healthCheck(): Promise<{ status: string; model_loaded: boolean; timestamp: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw new Error('Unable to connect to ML API service');
    }
  }

  /**
   * Predict disease risk based on sensor data
   */
  async predictDisease(sensorData: SensorData): Promise<PredictionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sensorData),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.error || `Prediction failed: ${response.statusText}`);
      }

      const result: PredictionResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  }

  /**
   * Get mock sensor data for testing (when API is not available)
   */
  getMockSensorData(): SensorData {
    return {
      temperature_C: 24.5 + (Math.random() - 0.5) * 4, // 22.5 - 26.5
      humidity_percent: 68 + (Math.random() - 0.5) * 20, // 58 - 78
      soil_moisture_percent: 45 + (Math.random() - 0.5) * 20, // 35 - 55
    };
  }

  /**
   * Get mock prediction data for testing (when API is not available)
   */
  getMockPrediction(sensorData: SensorData): PredictionResponse {
    // Simulate some realistic disease risks based on sensor data
    const risks: DiseaseRisk[] = [];
    
    // Blast risk increases with high humidity and temperature
    if (sensorData.humidity_percent > 70 && sensorData.temperature_C > 25) {
      risks.push({
        name: 'Blast',
        probability: Math.min(35, (sensorData.humidity_percent - 70) * 2),
        severity: 'sedang'
      });
    }

    // Brown Spot risk with high humidity
    if (sensorData.humidity_percent > 75) {
      risks.push({
        name: 'Brown Spot',
        probability: Math.min(25, (sensorData.humidity_percent - 75) * 1.5),
        severity: 'rendah'
      });
    }

    // Kresek risk with low soil moisture
    if (sensorData.soil_moisture_percent < 40) {
      risks.push({
        name: 'Kresek',
        probability: Math.min(30, (40 - sensorData.soil_moisture_percent) * 1.2),
        severity: 'sedang'
      });
    }

    // Tungro risk with high temperature
    if (sensorData.temperature_C > 28) {
      risks.push({
        name: 'Tungro',
        probability: Math.min(20, (sensorData.temperature_C - 28) * 2),
        severity: 'rendah'
      });
    }

    // If no specific risks, add a low general risk
    if (risks.length === 0) {
      risks.push({
        name: 'Blast',
        probability: 8,
        severity: 'sangat rendah'
      });
    }

    const overall_risk = risks.reduce((sum, risk) => sum + risk.probability, 0) / risks.length;
    
    const treatments: Treatment[] = [];
    
    // Generate treatments based on sensor data
    if (sensorData.soil_moisture_percent < 40) {
      treatments.push({
        id: 1,
        title: 'Irigasi Diperlukan',
        description: 'Kelembapan tanah berada di bawah tingkat optimal. Jadwalkan irigasi dalam 24 jam.',
        priority: 'high',
        action: 'Tingkatkan penyiraman sebesar 20%'
      });
    }

    if (sensorData.temperature_C > 30) {
      treatments.push({
        id: 2,
        title: 'Pendinginan Tanaman',
        description: 'Suhu terlalu tinggi dapat menyebabkan stres pada tanaman.',
        priority: 'medium',
        action: 'Tingkatkan penyiraman dan berikan naungan'
      });
    }

    // Add disease-specific treatments
    risks.forEach((risk, index) => {
      if (risk.probability > 15) {
        treatments.push({
          id: treatments.length + 1,
          title: `Pengendalian ${risk.name}`,
          description: `Risiko penyakit ${risk.name} terdeteksi. Lakukan tindakan pencegahan.`,
          priority: risk.probability > 25 ? 'high' : 'medium',
          action: `Gunakan fungisida untuk ${risk.name}`
        });
      }
    });

    if (treatments.length === 0) {
      treatments.push({
        id: 1,
        title: 'Pemantauan Rutin',
        description: '',
        priority: 'low',
        action: 'Pertahankan jadwal perawatan saat ini'
      });
    }

    return {
      overall_risk: Math.round(overall_risk * 10) / 10,
      risk_level: overall_risk < 15 ? 'rendah' : overall_risk < 35 ? 'sedang' : 'tinggi',
      predicted_disease: risks[0]?.name || 'Blast',
      disease_risks: risks,
      treatments,
      sensor_data: {
        ...sensorData,
        temp_24h_mean: sensorData.temperature_C + (Math.random() - 0.5) * 2,
        humidity_24h_mean: sensorData.humidity_percent + (Math.random() - 0.5) * 4,
        soil_moisture_24h_mean: sensorData.soil_moisture_percent + (Math.random() - 0.5) * 3,
      },
      timestamp: new Date().toISOString()
    };
  }
}

// Create and export a singleton instance
export const diseasePredictionApi = new DiseasePredictionApi();

// Export the class for testing
export default DiseasePredictionApi;
