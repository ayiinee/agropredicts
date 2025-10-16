import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LogOut,
  Home,
  Sprout,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  BarChart3,
  Leaf,
  Truck,
  Building2,
  Camera,
  Bell,
} from "lucide-react";
import { useWarnings } from "@/hooks/useWarnings";

// Safe warnings button with fallback to avoid breaking the header if warnings hook fails
const WarningsButton = () => {
  const navigate = useNavigate();
  let unread = 0;
  try {
    const data = useWarnings();
    unread = Number(data?.unreadCount) || 0;
  } catch (_) {
    unread = 0;
  }
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate("/warnings")}
      className="relative"
      aria-label="Peringatan"
    >
      <Bell className="h-4 w-4" />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 min-w-[18px] h-[18px] rounded-full text-[10px] font-semibold bg-red-500 text-white">
          {unread}
        </span>
      )}
    </Button>
  );
};

interface RoleBasedLayoutProps {
  children: ReactNode;
}

export const RoleBasedLayout = ({ children }: RoleBasedLayoutProps) => {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const roleConfig = {
    farmer: {
      icon: Leaf,
      color: "bg-green-500",
      navigation: [
        { label: "Dashboard", icon: Home, path: "/" },
        { label: "Lahan", icon: Sprout, path: "/fields" },
        { label: "Deteksi Hama", icon: Camera, path: "/pest-detection" },
        { label: "Belanja", icon: ShoppingCart, path: "/marketplace" },
        { label: "Kelompok Tani", icon: Users, path: "/groups" },
      ],
    },
    distributor: {
      icon: Truck,
      color: "bg-orange-500",
      navigation: [
        { label: "Dashboard", icon: Home, path: "/" },
        { label: "Produk", icon: Package, path: "/products" },
        { label: "Pesanan", icon: ShoppingCart, path: "/orders" },
        { label: "Analitik", icon: BarChart3, path: "/analytics" },
      ],
    },
    cooperative: {
      icon: Building2,
      color: "bg-blue-500",
      navigation: [
        { label: "Dashboard", icon: Home, path: "/" },
        { label: "Produk Petani", icon: Package, path: "/farmer-products" },
        { label: "Manajemen Kelompok", icon: Users, path: "/group" },
        { label: "Analitik", icon: BarChart3, path: "/analytics" },
      ],
    },
  };

  const config = roleConfig[profile.role];
  const RoleIcon = config.icon;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-first header */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {/* <div className={`p-2 rounded-lg ${config.color} text-white`}>
              <RoleIcon className="h-6 w-6" />
            </div> */}
            <div>
              <img
                src="/Agropredict.png"
                alt="Logo Agropredict"
                className="h-8 w-auto"
              />

              {/* <Badge variant="secondary" className="text-xs">
                {profile.role === 'farmer' ? 'Petani' : profile.role === 'distributor' ? 'Distributor' : 'Koperasi'}
              </Badge> */}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {profile.full_name}
            </span>
            <WarningsButton />
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="container mx-auto p-4 max-w-7xl mb-20 lg:mb-0">
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-50 lg:hidden">
        <ScrollArea className="w-full">
          <div className="flex items-center p-2 shadow-sm w-full">
            {config.navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex-1 flex flex-col items-center gap-1 h-auto py-2 mobile-nav-item ${
                    isActive ? "mobile-nav-item-active" : ""
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isActive ? "text-white" : "text-muted-foreground"
                    }`}
                  />
                  <span className="text-xs mt-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </nav>

      {/* Desktop sidebar - hidden on mobile */}
      <aside className="hidden lg:fixed lg:left-0 lg:top-16 lg:h-[calc(100vh-4rem)] lg:w-64 lg:bg-card lg:border-r lg:flex lg:flex-col">
        <div className="p-4">
          <nav className="space-y-2">
            {config.navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={`nav-item w-full justify-start gap-3 ${
                    isActive
                      ? "nav-item-active"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => (window.location.href = item.path)}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? "text-primary-foreground" : ""
                    }`}
                  />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
      </aside>
    </div>
  );
};
