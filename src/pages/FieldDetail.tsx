import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContentGrid,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Thermometer,
  Droplets,
  Sun,
  AlertTriangle,
  TrendingUp,
  Activity,
  Beaker,
  Lightbulb,
  Sprout,
  Calendar,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useDiseasePrediction } from "@/hooks/useDiseasePrediction";
import { SensorData } from "@/services/diseasePredictionApi";

export default function FieldDetail() {
  const { fieldId } = useParams();
  const navigate = useNavigate();

  // Mock field data - in real app, this would come from API based on fieldId
  const fieldData = {
    id: Number(fieldId),
    name: "Ladang A - Padi",
    area: "500 m²",
    growth: 19,
    harvestDate: "2026-02-01",
    estimatedYield: "2,400 kg",
    cropType: "padi",
    plantingDate: "2025-10-01",
    alerts: 1,
  };

  // Initialize sensor data with some realistic values
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature_C: 24.5,
    humidity_percent: 78,
    soil_moisture_percent: 75,
  });

  // Use the disease prediction hook
  const {
    prediction,
    loading,
    error,
    isApiAvailable,
    predictDisease,
    refreshPrediction,
  } = useDiseasePrediction(sensorData);

  // Simulate real-time sensor data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate sensor data changes
      setSensorData((prev) => ({
        temperature_C: prev.temperature_C + (Math.random() - 0.5) * 2,
        humidity_percent: Math.max(
          30,
          Math.min(95, prev.humidity_percent + (Math.random() - 0.5) * 4)
        ),
        soil_moisture_percent: Math.max(
          20,
          Math.min(80, prev.soil_moisture_percent + (Math.random() - 0.5) * 3)
        ),
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Update prediction when sensor data changes
  useEffect(() => {
    if (sensorData) {
      predictDisease(sensorData);
    }
  }, [sensorData, predictDisease]);

  const getRiskDescription = (risk: number) => {
    if (risk < 15) {
      return "kondisi tanaman sehat, lanjutkan pemantauan rutin";
    } else if (risk < 35) {
      return "pantau dengan seksama dan terapkan tindakan pencegahan";
    } else {
      return "perlu tindakan segera untuk mencegah kerusakan tanaman";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/fields")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{fieldData.name}</h1>
          <p className="text-muted-foreground">
            {fieldData.area} • Ditanam {fieldData.plantingDate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isApiAvailable ? (
            <Badge variant="outline" className="text-green-600">
              <Wifi className="h-3 w-3 mr-1" />
              ML API Online
            </Badge>
          ) : (
            <Badge variant="outline" className="text-orange-600">
              <WifiOff className="h-3 w-3 mr-1" />
              Offline Mode
            </Badge>
          )}
          {/* {fieldData.alerts > 0 && (
            <Badge variant="destructive">{fieldData.alerts} peringatan</Badge>
          )} */}
        </div>
      </div>

      {/* Field Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="h-5 w-5" />
            Informasi Lahan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Perkembangan Pertumbuhan
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{fieldData.growth}%</span>
                  <span className="text-sm text-muted-foreground">Selesai</span>
                </div>
                <Progress value={fieldData.growth} className="h-2" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Perkiraan Panen</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{fieldData.harvestDate}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sensor Data */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Data Sensor Lahan
              </CardTitle>
              <CardDescription>
                Pemantauan lingkungan secara langsung dari sensor lapangan
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshPrediction}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Memperbarui data sensor...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Temperature */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Thermometer className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-l font-bold">
                        {sensorData.temperature_C.toFixed(1)}°C
                      </p>
                      <p className="text-sm text-muted-foreground">Suhu</p>
                      <p className="text-xs text-blue-600">
                        {sensorData.temperature_C > 30
                          ? "Tinggi"
                          : sensorData.temperature_C < 20
                          ? "Rendah"
                          : "Optimal"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Humidity */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Droplets className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-l font-bold">
                        {sensorData.humidity_percent.toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Kelembapan
                      </p>
                      <p className="text-xs text-green-600">
                        {sensorData.humidity_percent > 80
                          ? "Tinggi"
                          : sensorData.humidity_percent < 50
                          ? "Rendah"
                          : "Optimal"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Soil Moisture */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <Droplets className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-l font-bold">
                        {sensorData.soil_moisture_percent.toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Kelembapan Tanah
                      </p>
                      <p className="text-xs text-orange-600">
                        {sensorData.soil_moisture_percent > 70
                          ? "Tinggi"
                          : sensorData.soil_moisture_percent < 40
                          ? "Rendah"
                          : "Optimal"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Soil pH */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Beaker className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-l font-bold">5.6 pH</p>
                      <p className="text-sm text-muted-foreground">pH Tanah</p>
                      <p className="text-xs text-purple-600">Optimal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                {error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disease Prediction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Prediksi Risiko Penyakit
          </CardTitle>
          <CardDescription>
            Analisis berbasis AI untuk potensi penyakit tanaman
            {prediction && (
              <span className="ml-2 text-xs text-muted-foreground">
                • Terakhir diperbarui:{" "}
                {new Date(prediction.timestamp).toLocaleTimeString()}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Menganalisis risiko penyakit...</span>
            </div>
          ) : prediction ? (
            <div className="space-y-4">
              {/* Overall Risk */}
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">
                    Risiko Penyakit Keseluruhan
                  </span>
                  <span
                    className={`text-2xl font-bold ${
                      prediction.overall_risk < 15
                        ? "text-green-600"
                        : prediction.overall_risk < 35
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  >
                    {prediction.overall_risk}%
                  </span>
                </div>
                <Progress value={prediction.overall_risk} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  Risiko {prediction.risk_level} -{" "}
                  {getRiskDescription(prediction.overall_risk)}
                </p>
              </div>

              {/* Individual Risks
              {prediction.disease_risks.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Risiko Penyakit Spesifik</h4>
                  {prediction.disease_risks.map((risk, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">{risk.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          tingkat {risk.severity}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{risk.probability}%</span>
                        <p className="text-xs text-muted-foreground">
                          probabilitas
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )} */}

              {/* Predicted Disease
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    Penyakit yang Diprediksi: {prediction.predicted_disease}
                  </span>
                </div>
              </div> */}
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-600">Gagal memuat prediksi penyakit</p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">
                Tidak ada data prediksi tersedia
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Treatment Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Saran Penanganan
          </CardTitle>
          {/* <CardDescription>
            Tindakan yang direkomendasikan berdasarkan kondisi lahan saat ini
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Menganalisis saran penanganan...</span>
            </div>
          ) : prediction && prediction.treatments ? (
            <div className="space-y-4">
              {prediction.treatments.map((treatment) => (
                <div key={treatment.id} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{treatment.title}</h4>
                    <Badge variant={getPriorityColor(treatment.priority)}>
                      prioritas {treatment.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {treatment.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Aksi yang Disarankan:
                    </span>
                    <span className="text-sm">{treatment.action}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">
                Tidak ada saran penanganan tersedia
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
