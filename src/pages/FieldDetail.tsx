import { useParams, useNavigate } from "react-router-dom";
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
} from "lucide-react";

export default function FieldDetail() {
  const { fieldId } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, this would come from API based on fieldId
  const fieldData = {
    id: Number(fieldId),
    name: 'Ladang A - Jagung',
      area: '5.2 hektar',
      growth: 75,
      harvestDate: '2024-09-15',
      estimatedYield: '2,400 kg',
    cropType: "corn",
    plantingDate: "2024-03-15",
    alerts: 1,
  };

  // Mock sensor data
  const sensorData = {
    temperature: { current: 24.5, status: "optimal", unit: "°C" },
    humidity: { current: 68, status: "good", unit: "%" },
    soilMoisture: { current: 45, status: "low", unit: "%" },
    soilPH: { current: 6.8, status: "optimal", unit: "pH" },
    // lightIntensity: { current: 850, status: "good", unit: "lux" },
  };

  // Disease prediction data
  const diseaseRisk = {
    overall: 23,
    risks: [
      { name: "Hawar Daun", probability: 15, severity: "rendah" },
      { name: "Tungro", probability: 8, severity: "sangat rendah" },
      { name: "Akar Busuk", probability: 12, severity: "rendah" },
    ],
  };

  // Treatment suggestions
  const treatments = [
    {
      id: 1,
      title: "Irigasi Diperlukan",
      description:
        "Kelembapan tanah berada di bawah tingkat optimal. Jadwalkan irigasi dalam 24 jam.",
      priority: "high",
      action: "Tingkatkan penyiraman sebesar 20%",
    },
    {
      id: 2,
      title: "Pengendalian Hama Preventif",
      description:
        "Terapkan langkah pencegahan untuk hama penggerek jagung berdasarkan pola musiman.",
      priority: "medium",
      action: "Gunakan pestisida organik",
    },
    {
      id: 3,
      title: "Pemantauan Nutrisi",
      description:
        "Tingkat pH berada pada kondisi optimal. Lanjutkan jadwal pemupukan saat ini.",
      priority: "low",
      action: "Pertahankan jadwal saat ini",
    },
  ];

  const getSensorIcon = (type: string) => {
    switch (type) {
      case "temperature":
        return Thermometer;
      case "humidity":
        return Droplets;
      case "soilMoisture":
        return Droplets;
      case "soilPH":
        return Beaker;
      case "lightIntensity":
        return Sun;
      default:
        return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "low":
        return "text-orange-600";
      case "high":
        return "text-red-600";
      default:
        return "text-gray-600";
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
        {fieldData.alerts > 0 && (
          <Badge variant="destructive">{fieldData.alerts} peringatan</Badge>
        )}
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
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Data Sensor Real-time
          </CardTitle>
          <CardDescription>
            Pemantauan lingkungan secara langsung dari sensor lapangan
          </CardDescription>
        </CardHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(sensorData).map(([key, data]) => {
            const Icon = getSensorIcon(key);
            // Choose color based on status
            let bgColor = "bg-primary/10";
            let iconColor = "text-primary";
            if (data.status === "optimal") {
              bgColor = "bg-green-500/10";
              iconColor = "text-green-500";
            } else if (data.status === "good") {
              bgColor = "bg-blue-500/10";
              iconColor = "text-blue-500";
            } else if (data.status === "low") {
              bgColor = "bg-orange-500/10";
              iconColor = "text-orange-500";
            } else if (data.status === "high") {
              bgColor = "bg-red-500/10";
              iconColor = "text-red-500";
            }

            return (
              <Card key={key}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${bgColor}`}>
                      <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <div>
                      <p className="text-l font-bold">{data.current}{data.unit}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className={`text-xs capitalize ${getStatusColor(data.status)}`}>
                        {data.status}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
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
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall Risk */}
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Risiko Penyakit Keseluruhan</span>
                <span className="text-2xl font-bold text-orange-600">
                  {diseaseRisk.overall}%
                </span>
              </div>
              <Progress value={diseaseRisk.overall} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                Risiko sedang - pantau dengan seksama dan terapkan tindakan
                pencegahan
              </p>
            </div>

            {/* Individual Risks */}
            <div className="space-y-3">
              <h4 className="font-medium">Risiko Penyakit Spesifik</h4>
              {diseaseRisk.risks.map((risk, index) => (
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
          </div>
        </CardContent>
      </Card>

      {/* Treatment Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Saran Penanganan
          </CardTitle>
          <CardDescription>
            Tindakan yang direkomendasikan berdasarkan kondisi lahan saat ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {treatments.map((treatment) => (
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
        </CardContent>
      </Card>
    </div>
  );
}
