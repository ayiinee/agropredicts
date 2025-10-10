import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { fetchWeatherApi } from 'openmeteo';


export const FarmerDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  // State untuk weather data
  const [weatherData, setWeatherData] = useState({
    current: { temp: 0, humidity: 0, condition: "Loading..." },
    forecast: []
  });
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  
  // State untuk location
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    locationName: string;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Fungsi untuk mendapatkan kondisi cuaca berdasarkan weather code
  const getWeatherCondition = (code: number) => {
    const conditions: { [key: number]: string } = {
      0: "Cerah",
      1: "Sebagian Cerah",
      2: "Sebagian Berawan",
      3: "Berawan",
      45: "Kabut",
      48: "Kabut Beku",
      51: "Gerimis Ringan",
      53: "Gerimis Sedang",
      55: "Gerimis Kuat",
      56: "Gerimis Beku Ringan",
      57: "Gerimis Beku Kuat",
      61: "Hujan Ringan",
      63: "Hujan Sedang",
      65: "Hujan Kuat",
      66: "Hujan Beku Ringan",
      67: "Hujan Beku Kuat",
      71: "Salju Ringan",
      73: "Salju Sedang",
      75: "Salju Kuat",
      77: "Butiran Salju",
      80: "Hujan Lebat Ringan",
      81: "Hujan Lebat Sedang",
      82: "Hujan Lebat Kuat",
      85: "Hujan Salju Ringan",
      86: "Hujan Salju Kuat",
      95: "Badai Petir",
      96: "Badai Petir dengan Hujan Es Ringan",
      99: "Badai Petir dengan Hujan Es Kuat"
    };
    return conditions[code] || "Tidak Diketahui";
  };

  // Fungsi untuk mendapatkan lokasi user
  const getUserLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation tidak didukung oleh browser ini'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => {
          let errorMessage = 'Gagal mendapatkan lokasi';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Akses lokasi ditolak. Menggunakan lokasi default.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Informasi lokasi tidak tersedia';
              break;
            case error.TIMEOUT:
              errorMessage = 'Permintaan lokasi timeout';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  // Fungsi untuk mendapatkan nama lokasi dari koordinat
  const getLocationName = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`
      );
      const data = await response.json();
      
      if (data.city && data.principalSubdivision) {
        return `${data.city}, ${data.principalSubdivision}`;
      } else if (data.locality) {
        return data.locality;
      } else {
        return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      }
    } catch (error) {
      console.error('Error getting location name:', error);
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  // Fungsi untuk fetch weather data
  const fetchWeatherData = async (latitude?: number, longitude?: number) => {
    try {
      setWeatherLoading(true);
      setWeatherError(null);

      // Gunakan koordinat user jika tersedia, atau fallback ke default
      const lat = latitude || userLocation?.latitude || -7.9797;
      const lon = longitude || userLocation?.longitude || 112.6304;

      const params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": ["temperature_2m", "relative_humidity_2m", "weather_code"],
        "daily": ["weather_code", "temperature_2m_max", "temperature_2m_min"],
        "timezone": "Asia/Jakarta"
      };
      
      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);
      const response = responses[0];

      // Attributes for timezone and location
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const hourly = response.hourly();
      const daily = response.daily();

      // Helper function to form time ranges
      const range = (start: number, stop: number, step: number) =>
        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

      // Process hourly data
      const hourlyData = {
        time: range(Number(hourly.time()), Number(hourly.timeEnd()), Number(hourly.interval())).map(
          (t) => new Date((t + utcOffsetSeconds) * 1000)
        ),
        temperature2m: hourly.variables(0)!.valuesArray()!,
        relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
        weatherCode: hourly.variables(2)!.valuesArray()!,
      };

      // Process daily data
      const dailyData = {
        time: range(Number(daily.time()), Number(daily.timeEnd()), Number(daily.interval())).map(
          (t) => new Date((t + utcOffsetSeconds) * 1000)
        ),
        weatherCode: daily.variables(0)!.valuesArray()!,
        temperature2mMax: daily.variables(1)!.valuesArray()!,
        temperature2mMin: daily.variables(2)!.valuesArray()!,
      };

      // Get current weather (first hour of today)
      const currentHour = hourlyData.time[0];
      const currentTemp = Math.round(hourlyData.temperature2m[0]);
      const currentHumidity = Math.round(hourlyData.relativeHumidity2m[0]);
      const currentWeatherCode = hourlyData.weatherCode[0];

      // Create forecast for next 5 days
      const forecast = dailyData.time.slice(0, 5).map((date, index) => {
        const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const dayName = index === 0 ? 'Hari ini' : 
                      index === 1 ? 'Besok' : 
                      dayNames[date.getDay()];
        
        return {
          day: dayName,
          temp: Math.round((dailyData.temperature2mMax[index] + dailyData.temperature2mMin[index]) / 2),
          condition: getWeatherCondition(dailyData.weatherCode[index])
        };
      });

      setWeatherData({
        current: {
          temp: currentTemp,
          humidity: currentHumidity,
          condition: getWeatherCondition(currentWeatherCode)
        },
        forecast: forecast
      });

    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherError('Gagal mengambil data cuaca');
      // Fallback data
      setWeatherData({
        current: { temp: 24, humidity: 65, condition: "Cerah Berawan" },
        forecast: [
          { day: "Hari ini", temp: 24, condition: "Cerah" },
          { day: "Besok", temp: 26, condition: "Berawan" },
          { day: "Sab", temp: 22, condition: "Hujan" },
          { day: "Min", temp: 25, condition: "Cerah" },
          { day: "Sen", temp: 23, condition: "Berawan" },
        ]
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  // Fungsi untuk menginisialisasi lokasi user dari localStorage
  const initializeLocation = async () => {
    try {
      setLocationLoading(true);
      setLocationError(null);

      // Cek apakah ada lokasi tersimpan di localStorage
      const savedLocation = localStorage.getItem('userLocation');
      
      if (savedLocation) {
        const location = JSON.parse(savedLocation);
        setUserLocation(location);
        await fetchWeatherData(location.latitude, location.longitude);
      } else {
        // Jika tidak ada lokasi tersimpan, gunakan lokasi default
        setUserLocation({
          latitude: -7.9797,
          longitude: 112.6304,
          locationName: "Karangploso, Malang"
        });
        await fetchWeatherData(-7.9797, 112.6304);
      }
      
    } catch (error) {
      console.error('Error initializing location:', error);
      setLocationError('Gagal memuat lokasi');
      
      // Fallback ke lokasi default
      setUserLocation({
        latitude: -7.9797,
        longitude: 112.6304,
        locationName: "Karangploso, Malang"
      });
      await fetchWeatherData(-7.9797, 112.6304);
    } finally {
      setLocationLoading(false);
    }
  };

  // Fetch weather data on component mount
  useEffect(() => {
    initializeLocation();
  }, []);
  

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
          {locationLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              Mendeteksi lokasi...
            </div>
          ) : locationError ? (
            <div className="flex items-center gap-2 text-orange-500">
              <AlertTriangle className="h-3 w-3" />
              {userLocation?.locationName || "Karangploso, Malang"}
            </div>
          ) : (
            userLocation?.locationName || profile?.location || "Karangploso, Malang"
          )}
        </div>
      </div>

      {/* Weather Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Perkiraan Cuaca
            {weatherLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            {userLocation?.locationName || "Lokasi tidak tersedia"}
            {locationError && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={initializeLocation}
                className="ml-2"
              >
                Coba Lagi
              </Button>
            )}
          </CardDescription>
          {weatherError && (
            <div className="text-sm text-red-500 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {weatherError}
            </div>
          )}
          {locationError && (
            <div className="text-sm text-orange-500 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {locationError}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {weatherLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Memuat data cuaca...</span>
            </div>
          ) : (
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fetchWeatherData(userLocation?.latitude, userLocation?.longitude)}
                  className="mt-4"
                >
                  Refresh Data
                </Button>
              </div>
            </div>
          )}
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
