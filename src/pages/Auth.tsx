import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { Leaf, Users, Truck, MapPin, AlertTriangle, Loader2 } from 'lucide-react';

export default function Auth() {
  const { user, signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [loading, setLoading] = useState(false);
  
  // State untuk lokasi
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    locationName: string;
  } | null>(null);

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
              errorMessage = 'Akses lokasi ditolak';
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

  // Fungsi untuk meminta akses lokasi
  const requestLocationPermission = async () => {
    try {
      setLocationLoading(true);
      setLocationError(null);

      const position = await getUserLocation();
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      
      // Dapatkan nama lokasi
      const locationName = await getLocationName(latitude, longitude);
      
      const location = {
        latitude,
        longitude,
        locationName
      };
      
      setUserLocation(location);
      setLocationPermission('granted');
      
      // Simpan lokasi ke localStorage
      localStorage.setItem('userLocation', JSON.stringify(location));
      
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError(error instanceof Error ? error.message : 'Gagal mendapatkan lokasi');
      setLocationPermission('denied');
    } finally {
      setLocationLoading(false);
    }
  };

  // Cek apakah sudah ada lokasi tersimpan
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      const location = JSON.parse(savedLocation);
      setUserLocation(location);
      setLocationPermission('granted');
    }
  }, []);

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, fullName, role);
      } else {
        const { error } = await signIn(email, password);
        if (!error) {
          // Navigation will happen automatically via auth state change
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const roleIcons = {
    farmer: Leaf,
    distributor: Truck,
    cooperative: Users
  };

  const roleColors = {
    farmer: 'text-green-600',
    distributor: 'text-orange-600',
    cooperative: 'text-blue-600'
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
<img src="/Agropredict.png" alt="Logo Agropredict" className="h-12 w-auto" />          </div>
          <CardDescription>
            {isSignUp 
              ? 'Buat akun Anda dan bergabunglah dalam revolusi pertanian'
              : 'Masuk ke platform pertanian Anda'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Peran Anda</Label>
                  <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farmer">
                        <div className="flex items-center gap-2">
                          <Leaf className={`h-4 w-4 ${roleColors.farmer}`} />
                            <div className="font-medium">Petani</div>
                          
                        </div>
                      </SelectItem>
                      <SelectItem value="distributor">
                        <div className="flex items-center gap-2">
                          <Truck className={`h-4 w-4 ${roleColors.distributor}`} />
                            <div className="font-medium">Distributor</div>
                          
                        </div>
                      </SelectItem>
                      <SelectItem value="cooperative">
                        <div className="flex items-center gap-2">
                          <Users className={`h-4 w-4 ${roleColors.cooperative}`} />
                            <div className="font-medium">Koperasi</div>
                          
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Masukkan email Anda"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Masukkan kata sandi"
                minLength={6}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading 
                ? (isSignUp ? 'Membuat Akun...' : 'Masuk...') 
                : (isSignUp ? 'Buat Akun' : 'Masuk')
              }
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp 
                ? 'Sudah punya akun? Masuk' 
                : 'Belum punya akun? Daftar'
              }
            </button>
          </div>

          {/* Location Permission Section */}
          {locationPermission === 'pending' && (
            <div className="mt-6 p-4 border rounded-lg bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Akses Lokasi</h3>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Untuk memberikan data cuaca yang akurat, aplikasi memerlukan akses ke lokasi Anda.
              </p>
              <Button 
                onClick={requestLocationPermission}
                disabled={locationLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {locationLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Mendeteksi lokasi...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    Izinkan Akses Lokasi
                  </>
                )}
              </Button>
            </div>
          )}

          {locationPermission === 'granted' && userLocation && (
            <div className="mt-6 p-4 border rounded-lg bg-green-50 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Lokasi Terdeteksi</h3>
              </div>
              <p className="text-sm text-green-700">
                {userLocation.locationName}
              </p>
            </div>
          )}

          {locationPermission === 'denied' && (
            <div className="mt-6 p-4 border rounded-lg bg-orange-50 border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-orange-800">Akses Lokasi Ditolak</h3>
              </div>
              <p className="text-sm text-orange-700 mb-3">
                {locationError || 'Aplikasi akan menggunakan lokasi default untuk data cuaca.'}
              </p>
              <Button 
                onClick={requestLocationPermission}
                variant="outline"
                className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                Coba Lagi
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}