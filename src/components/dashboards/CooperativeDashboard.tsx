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
  Users,
  Package,
  TrendingUp,
  Calendar,
  DollarSign,
  Truck,
  BarChart3,
  MessageCircle,
  CheckCircle,
  Clock,
  Eye,
  Target,
  Shield,
  Zap,
  Leaf,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const CooperativeDashboard = () => {
  const { profile } = useAuth();

  // Mock data
  const stats = {
    totalFarmers: 247,
    pendingDeliveries: 18,
    monthlyRevenue: 1250000, // Rupiah
    activeGroups: 12,
  };

  const formatRupiah = (value: number) => {
    return value.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
  };

  const pendingProducts = [
    {
      id: "DEL-001",
      farmer: "Budi Santoso",
      product: "Padi IR64",
      quantity: "500 kg",
      quality: "Grade A",
      pricePerKg: 7500,
      totalValue: 3750000,
      deliveryDate: "16 Januari 2024",
      status: "pending",
    },
    {
      id: "DEL-002",
      farmer: "Siti Aminah",
      product: "Cabai Rawit",
      quantity: "300 kg",
      quality: "Grade B",
      pricePerKg: 25000,
      totalValue: 7500000,
      deliveryDate: "15 Januari 2024",
      status: "reviewing",
    },
    {
      id: "DEL-003",
      farmer: "Agus Saputra",
      product: "Kopi Robusta",
      quantity: "800 kg",
      quality: "Grade A",
      pricePerKg: 35000,
      totalValue: 28000000,
      deliveryDate: "17 Januari 2024",
      status: "accepted",
    },
  ];

  const farmerGroups = [
    {
      id: 1,
      name: "Kelompok Tani Sumber Makmur",
      memberCount: 45,
      totalFields: 187,
      expectedProduction: "15.000 kg",
      location: "Kecamatan Dau, Malang",
    },
    {
      id: 2,
      name: "Kelompok Tani Tunas Organik",
      memberCount: 32,
      totalFields: 98,
      expectedProduction: "8.500 kg",
      location: "Kecamatan Pujon, Malang",
    },
    {
      id: 3,
      name: "Koperasi Tani Subur Abadi",
      memberCount: 67,
      totalFields: 234,
      expectedProduction: "22.000 kg",
      location: "Kecamatan Kepanjen, Malang",
    },
  ];

  const recentAnnouncements = [
    {
      id: 1,
      title: "Harga Gabah Musim Panen 2024",
      date: "15 Januari 2024",
      priority: "high",
    },
    {
      id: 2,
      title: "Rapat Bulanan Koperasi",
      date: "14 Januari 2024",
      priority: "medium",
    },
    {
      id: 3,
      title: "Pembaruan Standar Mutu Gabah",
      date: "12 Januari 2024",
      priority: "low",
    },
  ];

  const harvestTrends = [
    { month: "Jan", harvest: 12000, value: 24000000 },
    { month: "Feb", harvest: 15000, value: 30000000 },
    { month: "Mar", harvest: 18000, value: 36000000 },
    { month: "Apr", harvest: 16000, value: 32000000 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "reviewing":
        return "text-blue-600 bg-blue-100";
      case "accepted":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Clock;
      case "reviewing":
        return BarChart3;
      case "accepted":
        return CheckCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="section-spacing">
      {/* Modern Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold gradient-text">
            Halo, {profile?.full_name}! 🌾
          </h1>
          <p className="text-lg text-muted-foreground">
            Kelola operasi koperasi dan jaringan petani Anda
          </p>
        </div>
        <Button className="btn-primary">
          <MessageCircle className="h-5 w-5 mr-2" />
          Kirim Pengumuman
        </Button>
      </div>

      {/* Modern Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="unified-card card-hover">
          <CardContent className="card-spacing">
            <div className="flex items-center gap-4">
              <div className="icon-container-primary">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold gradient-text">{stats.totalFarmers}</p>
                <p className="text-sm text-muted-foreground font-medium">Total Petani</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="unified-card card-hover">
          <CardContent className="card-spacing">
            <div className="flex items-center gap-4">
              <div className="icon-container bg-gradient-to-br from-orange-100 to-yellow-100">
                <Package className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingDeliveries}</p>
                <p className="text-sm text-muted-foreground font-medium">
                  Pengiriman Tertunda
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="unified-card card-hover">
          <CardContent className="card-spacing">
            <div className="flex items-center gap-4">
              <div className="icon-container bg-gradient-to-br from-green-100 to-emerald-100">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {formatRupiah(stats.monthlyRevenue)}
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  Pendapatan Bulanan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="unified-card card-hover">
          <CardContent className="card-spacing">
            <div className="flex items-center gap-4">
              <div className="icon-container bg-gradient-to-br from-purple-100 to-violet-100">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{stats.activeGroups}</p>
                <p className="text-sm text-muted-foreground font-medium">Kelompok Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modern Pending Farmer Products */}
      <Card className="unified-card card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="icon-container-primary">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Pengiriman Petani Tertunda</h2>
              <p className="text-sm text-muted-foreground font-normal">
                Tinjau dan setujui hasil panen yang masuk
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {pendingProducts.map((product) => {
              const StatusIcon = getStatusIcon(product.status);
              return (
                <div key={product.id} className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="icon-container">
                          <Leaf className="h-5 w-5 text-[#31B57F]" />
                        </div>
                        <h3 className="font-semibold text-lg">{product.product}</h3>
                        <Badge className={`${getStatusColor(product.status)} px-3 py-1`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {product.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">
                        Dari: {product.farmer}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold text-xl text-green-600">
                        {formatRupiah(product.totalValue)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatRupiah(product.pricePerKg)}/kg
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
                    <div className="p-3 bg-white/60 rounded-lg">
                      <p className="text-gray-600 font-medium">Kuantitas</p>
                      <p className="font-bold text-gray-800">{product.quantity}</p>
                    </div>
                    <div className="p-3 bg-white/60 rounded-lg">
                      <p className="text-gray-600 font-medium">Kualitas</p>
                      <p className="font-bold text-gray-800">{product.quality}</p>
                    </div>
                    <div className="p-3 bg-white/60 rounded-lg">
                      <p className="text-gray-600 font-medium">Tanggal Pengiriman</p>
                      <p className="font-bold text-gray-800">{product.deliveryDate}</p>
                    </div>
                    <div className="p-3 bg-white/60 rounded-lg">
                      <p className="text-gray-600 font-medium">ID Pesanan</p>
                      <p className="font-bold text-gray-800">{product.id}</p>
                    </div>
                  </div>

                  {product.status === "pending" && (
                    <div className="flex gap-3">
                      <Button size="sm" variant="outline" className="btn-secondary">
                        <Target className="h-4 w-4 mr-2" />
                        Negosiasi Harga
                      </Button>
                      <Button size="sm" className="btn-primary">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Terima
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Shield className="h-4 w-4 mr-2" />
                        Tolak
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Groups & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Farmer Groups */}
        

        {/* Modern Recent Announcements */}
        <Card className="unified-card card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="icon-container-primary">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Pengumuman Terbaru</h2>
                <p className="text-sm text-muted-foreground font-normal">
                  Informasi penting untuk anggota koperasi
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 card-hover">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="icon-container">
                          <Zap className="h-4 w-4 text-[#31B57F]" />
                        </div>
                        <h3 className="font-semibold text-lg">
                          {announcement.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">
                        {announcement.date}
                      </p>
                    </div>
                    <Badge
                      className={`px-3 py-1 ${
                        announcement.priority === "high"
                          ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                          : announcement.priority === "medium"
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                          : "bg-gradient-to-r from-gray-500 to-slate-500 text-white"
                      }`}
                    >
                      {announcement.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button className="btn-primary w-full mt-6">
              <Eye className="h-5 w-5 mr-2" />
              Lihat Semua Pengumuman
            </Button>
          </CardContent>
        </Card>
      </div>

     
    </div>
  );
};
