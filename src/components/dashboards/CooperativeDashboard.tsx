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
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Selamat datang kembali, {profile?.full_name}!
          </h1>
          <p className="text-muted-foreground">
            Kelola operasi koperasi dan jaringan petani Anda
          </p>
        </div>
        <Button className="w-fit">
          <MessageCircle className="h-4 w-4 mr-2" />
          Kirim Pengumuman
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-l font-bold">{stats.totalFarmers}</p>
                <p className="text-sm text-muted-foreground">Total Petani</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Package className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-l font-bold">{stats.pendingDeliveries}</p>
                <p className="text-sm text-muted-foreground">
                  Pengiriman Tertunda
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-l font-bold">
                  {formatRupiah(stats.monthlyRevenue)}
                </p>
                <p className="text-sm text-muted-foreground wra">
                  Pendapatan Bulanan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-l font-bold">{stats.activeGroups}</p>
                <p className="text-sm text-muted-foreground">Kelompok Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Farmer Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Pengiriman Petani Tertunda
          </CardTitle>
          <CardDescription>
            Tinjau dan setujui hasil panen yang masuk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingProducts.map((product) => {
              const StatusIcon = getStatusIcon(product.status);
              return (
                <div key={product.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{product.product}</h3>
                        <Badge className={getStatusColor(product.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {product.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Dari: {product.farmer}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {formatRupiah(product.totalValue)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatRupiah(product.pricePerKg)}/kg
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">Kuantitas</p>
                      <p className="font-medium">{product.quantity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Kualitas</p>
                      <p className="font-medium">{product.quality}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        Tanggal Pengiriman
                      </p>
                      <p className="font-medium">{product.deliveryDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ID Pesanan</p>
                      <p className="font-medium">{product.id}</p>
                    </div>
                  </div>

                  {product.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Negosiasi Harga
                      </Button>
                      <Button size="sm">Terima</Button>
                      <Button size="sm" variant="destructive">
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
        

        {/* Recent Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Pengumuman Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">
                        {announcement.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {announcement.date}
                      </p>
                    </div>
                    <Badge
                      variant={
                        announcement.priority === "high"
                          ? "destructive"
                          : announcement.priority === "medium"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {announcement.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Lihat Semua Pengumuman
            </Button>
          </CardContent>
        </Card>
      </div>

     
    </div>
  );
};
