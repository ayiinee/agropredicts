import { SensorData } from "@/services/diseasePredictionApi";

export interface GrowthCalculationResult {
  growthPercentage: number;
  growthStage: string;
  stageDescription: string;
  daysSincePlanting: number;
  estimatedHarvestDate: Date;
}

export interface CropGrowthData {
  name: string;
  totalDays: number;
  stages: {
    vegetative: { start: number; end: number; description: string };
    generative: { start: number; end: number; description: string };
    maturation: { start: number; end: number; description: string };
    senescence: { start: number; end: number; description: string };
  };
}

// Crop growth data based on typical Indonesian farming practices
const CROP_GROWTH_DATA: Record<string, CropGrowthData> = {
  padi: {
    name: "Padi",
    totalDays: 120,
    stages: {
      vegetative: { start: 0, end: 30, description: "Tanaman masih kecil, baru tumbuh daun dan batang" },
      generative: { start: 30, end: 60, description: "Tanaman mulai berbunga dan berbuah" },
      maturation: { start: 60, end: 90, description: "Buah atau biji sedang mengisi dan membesar" },
      senescence: { start: 90, end: 120, description: "Tanaman sudah tua, siap untuk dipanen" }
    }
  },
  jagung: {
    name: "Jagung",
    totalDays: 100,
    stages: {
      vegetative: { start: 0, end: 25, description: "Tanaman masih kecil, baru tumbuh daun dan batang" },
      generative: { start: 25, end: 50, description: "Tanaman mulai berbunga dan berbuah" },
      maturation: { start: 50, end: 75, description: "Buah atau biji sedang mengisi dan membesar" },
      senescence: { start: 75, end: 100, description: "Tanaman sudah tua, siap untuk dipanen" }
    }
  },
  cabai: {
    name: "Cabai",
    totalDays: 90,
    stages: {
      vegetative: { start: 0, end: 20, description: "Tanaman masih kecil, baru tumbuh daun dan batang" },
      generative: { start: 20, end: 40, description: "Tanaman mulai berbunga dan berbuah" },
      maturation: { start: 40, end: 65, description: "Buah atau biji sedang mengisi dan membesar" },
      senescence: { start: 65, end: 90, description: "Tanaman sudah tua, siap untuk dipanen" }
    }
  }
};

export function calculateGrowthProgress(
  plantingDate: Date,
  cropType: string,
  sensorData?: SensorData
): GrowthCalculationResult {
  const now = new Date();
  const daysSincePlanting = Math.floor((now.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const cropData = CROP_GROWTH_DATA[cropType.toLowerCase()] || CROP_GROWTH_DATA.padi;
  
  // Base growth calculation based on time
  let baseGrowthPercentage = Math.min((daysSincePlanting / cropData.totalDays) * 100, 100);
  
  // Apply sensor-based adjustments
  if (sensorData) {
    const adjustment = calculateSensorBasedAdjustment(sensorData, cropType);
    baseGrowthPercentage = Math.max(0, Math.min(100, baseGrowthPercentage + adjustment));
  }
  
  // Determine growth stage
  const { growthStage, stageDescription } = determineGrowthStage(baseGrowthPercentage, cropData);
  
  // Calculate estimated harvest date
  const estimatedHarvestDate = new Date(plantingDate);
  estimatedHarvestDate.setDate(estimatedHarvestDate.getDate() + cropData.totalDays);
  
  return {
    growthPercentage: Math.round(baseGrowthPercentage),
    growthStage,
    stageDescription,
    daysSincePlanting,
    estimatedHarvestDate
  };
}

function calculateSensorBasedAdjustment(sensorData: SensorData, cropType: string): number {
  let adjustment = 0;
  
  // Temperature impact on growth
  const optimalTemp = getOptimalTemperature(cropType);
  const tempDeviation = Math.abs(sensorData.temperature_C - optimalTemp);
  if (tempDeviation > 5) {
    adjustment -= (tempDeviation - 5) * 0.5; // Reduce growth for temperature stress
  } else {
    adjustment += 2; // Boost growth for optimal temperature
  }
  
  // Soil moisture impact
  const optimalMoisture = getOptimalMoisture(cropType);
  const moistureDeviation = Math.abs(sensorData.soil_moisture_percent - optimalMoisture);
  if (moistureDeviation > 10) {
    adjustment -= (moistureDeviation - 10) * 0.3; // Reduce growth for moisture stress
  } else {
    adjustment += 1; // Boost growth for optimal moisture
  }
  
  // Humidity impact
  if (sensorData.humidity_percent < 40 || sensorData.humidity_percent > 80) {
    adjustment -= 1; // Reduce growth for extreme humidity
  } else if (sensorData.humidity_percent >= 50 && sensorData.humidity_percent <= 70) {
    adjustment += 0.5; // Slight boost for optimal humidity
  }
  
  // Heat-soil ratio impact (from ML model)
  if (sensorData.heat_soil_ratio > 1.5) {
    adjustment -= 1; // Reduce growth for high heat-soil ratio
  }
  
  return Math.max(-10, Math.min(10, adjustment)); // Limit adjustment to ±10%
}

function getOptimalTemperature(cropType: string): number {
  switch (cropType.toLowerCase()) {
    case 'padi': return 28;
    case 'jagung': return 25;
    case 'cabai': return 30;
    default: return 26;
  }
}

function getOptimalMoisture(cropType: string): number {
  switch (cropType.toLowerCase()) {
    case 'padi': return 60;
    case 'jagung': return 50;
    case 'cabai': return 55;
    default: return 55;
  }
}

function determineGrowthStage(percentage: number, cropData: CropGrowthData): { growthStage: string; stageDescription: string } {
  if (percentage < 25) {
    return {
      growthStage: "Vegetatif",
      stageDescription: cropData.stages.vegetative.description
    };
  } else if (percentage < 60) {
    return {
      growthStage: "Generatif",
      stageDescription: cropData.stages.generative.description
    };
  } else if (percentage < 85) {
    return {
      growthStage: "Pematangan",
      stageDescription: cropData.stages.maturation.description
    };
  } else {
    return {
      growthStage: "Senesens",
      stageDescription: cropData.stages.senescence.description
    };
  }
}

export function getGrowthStage(percentage: number): string {
  if (percentage < 25) return "Vegetatif";
  if (percentage < 60) return "Generatif";
  if (percentage < 85) return "Pematangan";
  return "Senesens";
}

export function getStageDescription(percentage: number): string {
  const stage = getGrowthStage(percentage);
  switch (stage) {
    case "Vegetatif":
      return "Tanaman masih kecil, baru tumbuh daun dan batang";
    case "Generatif":
      return "Tanaman mulai berbunga dan berbuah";
    case "Pematangan":
      return "Buah atau biji sedang mengisi dan membesar";
    case "Senesens":
      return "Tanaman sudah tua, siap untuk dipanen";
    default:
      return "";
  }
}
