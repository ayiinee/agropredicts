import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Thermometer,
  Droplets,
  Sun,
  AlertTriangle,
  TrendingUp,
  Sprout,
  MapPin,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const FarmerDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  // Mock data - in real app, this would come from API
  const weatherData = {
    current: { temp: 24, humidity: 65, condition: "Cerah Berawan" },
    forecast: [
      { day: "Hari ini", temp: 24, condition: "Cerah" },
      { day: "Besok", temp: 26, condition: "Berawan" },
      { day: "Sab", temp: 22, condition: "Hujan" },
      { day: "Min", temp: 25, condition: "Cerah" },
      { day: "Sen", temp: 23, condition: "Berawan" },
    ],
  };

  const alerts = [
    {
      id: 1,
      type: "alert",
      message: "Kelembaban tanah rendah - Ladang A",
      time: "2 jam yang lalu",
    },
    {
      id: 3,
      type: "alert",
      message: "Tingkat pH perlu perhatian di Ladang B",
      time: "3 hari yang lalu",
    },
  ];

  const fields = [
    {
      id: 1,
      name: "Ladang A - Jagung",
      area: "5.2 hektar",
      growth: 75,
      harvestDate: "2024-09-15",
      estimatedYield: "2,400 kg",
      alerts: 1,
    },
    {
      id: 2,
      name: "Ladang B - Padi",
      area: "3.8 hektar",
      growth: 45,
      harvestDate: "2024-08-20",
      estimatedYield: "1,800 kg",
      alerts: 2,
    },
    {
      id: 3,
      name: "Ladang C - Padi",
      area: "4.1 hektar",
      growth: 30,
      harvestDate: "2024-10-05",
      estimatedYield: "1,600 kg",
      alerts: 0,
    },
  ];

  // Rekomendasi tanaman (mock AI)
  const recommendations = [
    {
      crop: "Padi",
      season: "Musim Hujan",
      success: 0.82,
      inputs: ["Benih varietas IR64", "Urea", "NPK"],
    },
    {
      crop: "Jagung",
      season: "Peralihan",
      success: 0.74,
      inputs: ["Benih hibrida", "KCl", "Pestisida"],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Selamat datang kembali, {profile?.full_name}!
          </h1>
          <p className="text-muted-foreground">
            Berikut ini yang terjadi di pertanian Anda hari ini
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {profile?.location || "Karangploso, Malang"}
        </div>
      </div>

      {/* Weather Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Perkiraan Cuaca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Weather */}
            <div className="space-y-2">
              <h3 className="font-semibold">Kondisi Saat Ini</h3>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold">
                  {weatherData.current.temp}°C
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    {weatherData.current.condition}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    {weatherData.current.humidity}% kelembapan
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="space-y-2">
              <h3 className="font-semibold">Prakiraan 5 Hari</h3>
              <div className="grid grid-cols-5 gap-2">
                {weatherData.forecast.map((day, index) => (
                  <div
                    key={index}
                    className="text-center p-2 rounded-lg bg-muted/50"
                  >
                    <div className="text-xs font-medium">{day.day}</div>
                    <div className="text-sm font-bold">{day.temp}°</div>
                    <div className="text-xs text-muted-foreground">
                      {day.condition}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rekomendasi Tanaman (AI) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Rekomendasi Tanaman
          </CardTitle>
          <CardDescription>
            Saran musim tanam berbasis data dengan estimasi keberhasilan dan
            tautan belanja
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border bg-card space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{rec.crop}</div>
                  <Badge variant="secondary">
                    {Math.round(rec.success * 100)}% sukses
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Kesesuaian musim: {rec.season}
                </div>
                <div className="text-sm">
                  Kebutuhan input:
                  <ul className="list-disc list-inside text-muted-foreground">
                    {rec.inputs.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/marketplace")}
                >
                  Beli
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Peringatan Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg border"
              >
                <AlertTriangle
                  className={`h-4 w-4 mt-0.5 ${
                    alert.type === "warning"
                      ? "text-orange-500"
                      : alert.type === "alert"
                      ? "text-red-500"
                      : "text-blue-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Fields Overview */}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5" />
                Lahan Saya
              </CardTitle>
              <CardDescription>
                Ringkasan cepat lahan pertanian Anda
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fields.slice(0, 3).map((field) => (
              <div
                key={field.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{field.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {field.area}
                    </p>
                  </div>
                  {field.alerts > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {field.alerts}
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pertumbuhan</span>
                    <span className="font-medium">{field.growth}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="bg-primary rounded-full h-1.5 transition-all duration-300"
                      style={{ width: `${field.growth}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={() => navigate("/fields")}>
            Lihat Semua Lahan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
