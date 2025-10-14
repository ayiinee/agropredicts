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
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Eye,
  Leaf,
  Zap,
  Shield,
  Target,
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
          maximumAge: 300000
        }
      );
    });
  };

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

  const fetchWeatherData = async (latitude?: number, longitude?: number) => {
    try {
      setWeatherLoading(true);
      setWeatherError(null);

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
      message: "Kelembaban tanah rendah - Ladang Jagung",
      time: "2 jam yang lalu",
    },
    {
      id: 3,
      type: "alert",
      message: "Tingkat pH perlu perhatian di Ladang Padi",
      time: "3 hari yang lalu",
    },
  ];

  const fields = [
    {
      id: 1,
      name: "Ladang Jagung",
      area: "5.2 hektar",
      growth: 75,
      harvestDate: "2024-09-15",
      estimatedYield: "2,400 kg",
      alerts: 1,
    },
    {
      id: 2,
      name: "Ladang Padi",
      area: "3.8 hektar",
      growth: 45,
      harvestDate: "2024-08-20",
      estimatedYield: "1,800 kg",
      alerts: 2,
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

  // Helper function to get weather icon
  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('cerah') || conditionLower.includes('sunny')) {
      return <Sun className="h-6 w-6 text-yellow-500" />;
    } else if (conditionLower.includes('hujan') || conditionLower.includes('rain')) {
      return <CloudRain className="h-6 w-6 text-blue-500" />;
    } else if (conditionLower.includes('berawan') || conditionLower.includes('cloud')) {
      return <Cloud className="h-6 w-6 text-gray-500" />;
    } else if (conditionLower.includes('salju') || conditionLower.includes('snow')) {
      return <CloudSnow className="h-6 w-6 text-blue-300" />;
    } else {
      return <Cloud className="h-6 w-6 text-gray-500" />;
    }
  };

  // Helper function to get weather card class
  const getWeatherCardClass = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('cerah') || conditionLower.includes('sunny')) {
      return 'weather-sunny';
    } else if (conditionLower.includes('hujan') || conditionLower.includes('rain')) {
      return 'weather-rainy';
    } else {
      return 'weather-cloudy';
    }
  };

  return (
    <div className="section-spacing animate-fade-in">
      {/* Modern Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 animate-slide-up">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold gradient-text">
            Halo, {profile?.full_name}! 🌱
          </h1>
          <p className="text-lg text-muted-foreground">
            Dashboard pertanian cerdas Anda untuk hasil panen yang optimal
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
          <div className="icon-container">
            <MapPin className="h-5 w-5 text-[#31B57F]" />
          </div>
          {locationLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#31B57F]" />
              <span className="text-sm font-medium">Mendeteksi lokasi...</span>
            </div>
          ) : locationError ? (
            <div className="flex items-center gap-2 text-orange-500">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">{userLocation?.locationName || "Karangploso, Malang"}</span>
            </div>
          ) : (
            <span className="text-sm font-medium text-gray-700">
              {userLocation?.locationName || profile?.location || "Karangploso, Malang"}
            </span>
          )}
        </div>
      </div>

      {/* Modern Weather Card */}
      <Card className={`unified-card card-hover card-entrance ${getWeatherCardClass(weatherData.current.condition)}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="icon-container-primary">
              {getWeatherIcon(weatherData.current.condition)}
            </div>
            <div>
              <h2 className="text-xl font-bold">Perkiraan Cuaca</h2>
              <p className="text-sm text-muted-foreground font-normal">
                {userLocation?.locationName || "Lokasi tidak tersedia"}
              </p>
            </div>
            {weatherLoading && <Loader2 className="h-5 w-5 animate-spin text-[#31B57F]" />}
          </CardTitle>
          {weatherError && (
            <div className="alert-danger p-3 rounded-xl flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">{weatherError}</span>
            </div>
          )}
          {locationError && (
            <div className="alert-warning p-3 rounded-xl flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">{locationError}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={initializeLocation}
                className="ml-auto"
              >
                Coba Lagi
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {weatherLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-[#31B57F] mx-auto" />
                <p className="text-lg font-medium">Memuat data cuaca...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current Weather */}
              <div className="space-y-6">
                {/* <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Eye className="h-5 w-5 text-[#31B57F]" />
                  Kondisi Saat Ini
                </h3> */}
                <div className="flex items-center gap-6">
                  <div className="text-6xl font-bold gradient-text">
                    {weatherData.current.temp}°C
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {getWeatherIcon(weatherData.current.condition)}
                      <span className="text-lg font-medium">{weatherData.current.condition}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{weatherData.current.humidity}% kelembapan</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Wind className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Angin sedang</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast */}
              {/* <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#31B57F]" />
                  Prakiraan 5 Hari
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  {weatherData.forecast.map((day, index) => (
                    <div
                      key={index}
                      className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className="text-xs font-semibold text-gray-600 mb-2">{day.day}</div>
                      <div className="mb-2 weather-icon">{getWeatherIcon(day.condition)}</div>
                      <div className="text-lg font-bold text-gray-800">{day.temp}°</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {day.condition}
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fetchWeatherData(userLocation?.latitude, userLocation?.longitude)}
                  className="btn-secondary"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div> */}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modern AI Recommendations */}
      <Card className="unified-card card-hover card-entrance">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="icon-container-primary">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Rekomendasi Tanaman</h2>
              <p className="text-sm text-muted-foreground font-normal">
                Saran musim tanam berbasis data dengan estimasi keberhasilan
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 space-y-4 card-hover"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="icon-container">
                      <Leaf className="h-5 w-5 text-[#31B57F]" />
                    </div>
                    <div className="font-semibold text-lg">{rec.crop}</div>
                  </div>
                  <Badge className="bg-gradient-to-r from-[#31B57F] to-[#27A06F] text-white px-3 py-1">
                    {Math.round(rec.success * 100)}% sukses
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="h-4 w-4 text-[#31B57F]" />
                  <span className="font-medium">Kesesuaian musim: {rec.season}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Kebutuhan input:</p>
                  <div className="flex flex-wrap gap-2">
                    {rec.inputs.map((input, inputIdx) => (
                      <Badge key={inputIdx} variant="outline" className="text-xs">
                        {input}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  className="btn-primary w-full"
                  onClick={() => navigate("/marketplace")}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Beli Sekarang
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modern Alerts */}
      {alerts.length > 0 && (
        <Card className="unified-card card-hover card-entrance">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="icon-container bg-gradient-to-br from-orange-100 to-yellow-100">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Peringatan Terbaru</h2>
                <p className="text-sm text-muted-foreground font-normal">
                  Notifikasi penting untuk lahan Anda
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 alert-warning"
              >
                <div className="icon-container bg-gradient-to-br from-orange-100 to-yellow-100">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-orange-600 font-medium">{alert.time}</p>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  Lihat Detail
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Modern Fields Overview */}
      <Card className="unified-card card-hover card-entrance">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="icon-container-primary">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Lahan Saya</CardTitle>
                <CardDescription className="text-sm">
                  Ringkasan cepat lahan pertanian Anda
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fields.slice(0, 3).map((field) => (
              <div
                key={field.id}
                className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 card-hover space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="icon-container">
                        <Leaf className="h-4 w-4 text-[#31B57F]" />
                      </div>
                      <p className="font-semibold text-lg">{field.name}</p>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {field.area}
                    </p>
                  </div>
                  {field.alerts > 0 && (
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1">
                      {field.alerts} Alert
                    </Badge>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">Pertumbuhan</span>
                    <span className="font-bold text-[#31B57F]">{field.growth}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${field.growth}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="text-center p-2 bg-white/60 rounded-lg">
                      <p className="font-medium text-gray-600">Panen</p>
                      <p className="font-bold text-gray-800">{field.harvestDate}</p>
                    </div>
                    <div className="text-center p-2 bg-white/60 rounded-lg">
                      <p className="font-medium text-gray-600">Estimasi</p>
                      <p className="font-bold text-gray-800">{field.estimatedYield}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Button 
              className="btn-primary px-8 py-3" 
              onClick={() => navigate("/fields")}
            >
              <Eye className="h-5 w-5 mr-2" />
              Lihat Semua Lahan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
