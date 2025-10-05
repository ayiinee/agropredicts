import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { Leaf, Users, Truck } from 'lucide-react';

export default function Auth() {
  const { user, signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [loading, setLoading] = useState(false);

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
        </CardContent>
      </Card>
    </div>
  );
}