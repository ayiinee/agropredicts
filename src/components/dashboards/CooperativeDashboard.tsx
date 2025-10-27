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
  ChevronRight,
  AlertCircle,
  Wheat,
  Flame,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const CooperativeDashboard = () => {
  const { profile } = useAuth();

  // Mock data
  const stats = {
    totalFarmers: 247,
    pendingDeliveries: 3,
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
      deliveryDate: "7 Oktober 2025",
      status: "tertunda",
    },
    {
      id: "DEL-002",
      farmer: "Siti Aminah",
      product: "Cabai Rawit",
      quantity: "300 kg",
      quality: "Grade B",
      pricePerKg: 25000,
      totalValue: 7500000,
      deliveryDate: "12 Oktober 2025",
      status: "negosiasi",
    },
    {
      id: "DEL-003",
      farmer: "Agus Saputra",
      product: "Jagung",
      quantity: "800 kg",
      quality: "Grade A",
      pricePerKg: 6500,
      totalValue: 5200000,
      deliveryDate: "19 Oktober 2025",
      status: "diterima",
    },
  ];
const getProductIcon = (productName: string) => {
  if (productName.toLowerCase().includes("padi")) return Wheat;
  if (productName.toLowerCase().includes("cabai")) return Flame;
  if (productName.toLowerCase().includes("jagung")) return Leaf;
  return Package; // default
};

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
      title: "Kenaikan Harga Gabah dan Jagung Musim Panen 2025",
      date: "18 Oktober 2025",
      priority: "high",
    },
    {
      id: 2,
      title: "Rapat Evaluasi Produksi Cabai dan Padi",
      date: "17 Oktober 2025",
      priority: "medium",
    },
    {
      id: 3,
      title: "Pembaruan Standar Mutu Komoditas Koperasi",
      date: "15 Oktober 2025",
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
      case "tertunda":
        return "bg-yellow-100 text-yellow-700";
      case "negosiasi":
        return "bg-blue-100 text-blue-700";
      case "diterima":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "tertunda":
        return Clock;
      case "negosiasi":
        return AlertCircle;
      case "diterima":
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
            Halo, {profile?.full_name}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Kelola operasi koperasi dan jaringan petani Anda
          </p>
        </div>
        {/* <Button className="btn-primary">
          <MessageCircle className="h-5 w-5 mr-2" />
          Kirim Pengumuman
        </Button> */}
      </div>

      {/* Modern Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* <Card className="unified-card card-hover">
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
        </Card> */}

        <Card className="unified-card card-hover">
          <CardContent className="card-spacing">
            <div className="flex items-center gap-4">
              <div className="icon-container bg-gradient-to-br from-orange-100 to-yellow-100">
                <Package className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-orange-600">{stats.pendingDeliveries}</p>
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
                <p className="text-xl font-bold text-green-600">
                  {formatRupiah(stats.monthlyRevenue)}
                </p>
                <p className="text-sm text-muted-foreground font-medium">
                  Pendapatan Bulanan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="unified-card card-hover">
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
        </Card> */}
      </div>

      {/* Redesigned Pending Farmer Shipments - Compact List */}
      <Card className="unified-card card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="icon-container-primary">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Pengiriman Petani Tertunda</h2>
              <p className="text-sm text-muted-foreground font-normal">
                {pendingProducts.length} pengiriman menunggu persetujuan Anda
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {pendingProducts.map((product, idx) => {
  const StatusIcon = getStatusIcon(product.status);
  const ProductIcon = getProductIcon(product.product);

  return (
    <div
      key={product.id}
      className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer group ${
        idx !== pendingProducts.length - 1 ? "border-b border-gray-200" : ""
      }`}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="icon-container mt-1 flex-shrink-0">
          <ProductIcon className="h-5 w-5 text-[#31B57F]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {product.product}
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-1">
            {product.farmer} • {product.quantity} • {product.quality}
          </p>
          <p className="text-sm font-medium text-green-600">
            {formatRupiah(product.totalValue)}{" "}
            <span className="text-gray-500">
              ({formatRupiah(product.pricePerKg)}/kg)
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
        <Badge
          className={`${getStatusColor(product.status)} px-2.5 py-1 text-xs font-medium gap-1.5`}
        >
          <StatusIcon className="h-3 w-3" />
          {product.status}
        </Badge>
        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </div>
    </div>
  );
})}

          </div>

          {/* View All Button */}
            <Button
            variant="ghost"
            className="w-full mt-4 text-[#31B57F] hover:bg-green-50"
            asChild
            >
            <a href="/farmer-products">
              Lihat Semua Pengiriman
              <ChevronRight className="h-4 w-4 ml-2" />
            </a>
            </Button>
        </CardContent>
      </Card>

      {/* Groups & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        <h3 className="font-semibold text-md">
                          {announcement.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 font-medium">
                        {announcement.date}
                      </p>
                    </div>
                    {/* <Badge
                      className={`px-3 py-1 ${
                        announcement.priority === "high"
                          ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                          : announcement.priority === "medium"
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                          : "bg-gradient-to-r from-gray-500 to-slate-500 text-white"
                      }`}
                    >
                      {announcement.priority}
                    </Badge> */}
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