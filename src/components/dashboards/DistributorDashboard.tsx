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
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Plus,
  BarChart3,
  DollarSign,
  Users,
  Eye,
  Target,
  Shield,
  Zap,
  Leaf,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const DistributorDashboard = () => {
  const { profile } = useAuth();

  // Data contoh
  const stats = {
    totalProducts: 156,
    activeOrders: 23,
    monthlyRevenue: 6390390, // Rp125 juta
    lowStockItems: 8,
  };

  const recentOrders = [
    {
      id: "ORD-001",
      farmer: "Budi Santoso",
      product: "Pupuk NPK Mutiara",
      quantity: "50 karung",
      total: 11000000, // Rp220.000 x 50
      status: "pending",
      date: "2025-08-05",
    },
    {
      id: "ORD-002",
      farmer: "Siti Aminah",
      product: "Benih Padi Ciherang",
      quantity: "25 paket",
      total: 2500000, // Rp100.000 x 25
      status: "shipped",
      date: "2025-08-04",
    },
    {
      id: "ORD-003",
      farmer: "Andi Wijaya",
      product: "Pompa Irigasi Portable",
      quantity: "1 unit",
      total: 3500000, // Rp3,5 juta
      status: "delivered",
      date: "2025-08-03",
    },
  ];

  const lowStockProducts = [
    { name: "Pupuk Urea", stock: 15, minStock: 50, unit: "karung" },
    { name: "Benih Jagung Bisi-2", stock: 8, minStock: 25, unit: "paket" },
    { name: "Pestisida Decis", stock: 12, minStock: 30, unit: "botol" },
    { name: "Cangkul Baja", stock: 5, minStock: 20, unit: "buah" },
  ];

  const topProducts = [
    { name: "Pupuk NPK Mutiara", sales: 145, revenue: 31900000 }, // Rp220.000 x 145
    { name: "Benih Padi Ciherang", sales: 89, revenue: 8900000 }, // Rp100.000 x 89
    { name: "Pompa Irigasi Portable", sales: 34, revenue: 119000000 }, // Rp3,5 juta x 34
    { name: "Pestisida Decis", sales: 67, revenue: 3350000 }, // Rp50.000 x 67
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "shipped":
        return "bg-blue-500";
      case "delivered":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="section-spacing">
      {/* Modern Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold gradient-text">
            Halo, {profile?.full_name}! 🚚
          </h1>
          <p className="text-lg text-muted-foreground">
            Kelola bisnis pasokan pertanian Anda
          </p>
        </div>
        <Button className="btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          Tambah Produk
        </Button>
      </div>

      {/* Modern Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="unified-card card-hover">
          <CardContent className="card-spacing">
            <div className="flex items-center gap-4">
              <div className="icon-container-primary">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold gradient-text">{stats.totalProducts}</p>
                <p className="text-sm text-muted-foreground font-medium">Total Produk</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="unified-card card-hover">
          <CardContent className="card-spacing">
            <div className="flex items-center gap-4">
              <div className="icon-container bg-gradient-to-br from-blue-100 to-cyan-100">
                <ShoppingCart className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.activeOrders}</p>
                <p className="text-sm text-muted-foreground font-medium">Pesanan Aktif</p>
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
                  Rp{stats.monthlyRevenue.toLocaleString()}
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
              <div className="icon-container bg-gradient-to-br from-orange-100 to-yellow-100">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{stats.lowStockItems}</p>
                <p className="text-sm text-muted-foreground font-medium">Stok Rendah</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modern Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="unified-card card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="icon-container bg-gradient-to-br from-orange-100 to-yellow-100">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Peringatan Stok Rendah</h2>
                <p className="text-sm text-muted-foreground font-normal">Produk yang perlu diisi ulang</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 alert-warning"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="icon-container">
                        <Package className="h-4 w-4 text-[#31B57F]" />
                      </div>
                      <p className="font-semibold text-lg">{product.name}</p>
                    </div>
                    <p className="text-sm text-orange-700 font-medium">
                      {product.stock} {product.unit} tersisa (min: {product.minStock})
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1">
                      Rendah
                    </Badge>
                    <Button size="sm" className="btn-secondary">
                      <Zap className="h-4 w-4 mr-2" />
                      Pesan Ulang
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Modern Recent Orders */}
        <Card className="unified-card card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="icon-container-primary">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Pesanan Terbaru</h2>
                <p className="text-sm text-muted-foreground font-normal">
                  Daftar pesanan terbaru dari petani
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 card-hover"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="icon-container">
                        <Leaf className="h-4 w-4 text-[#31B57F]" />
                      </div>
                      <p className="font-semibold text-lg">{order.id}</p>
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {order.farmer}
                    </p>
                    <p className="text-sm text-gray-700">
                      {order.product} - {order.quantity}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="font-bold text-lg text-green-600">
                      Rp{order.total.toLocaleString()}
                    </p>
                    <Badge className="bg-gradient-to-r from-[#31B57F] to-[#27A06F] text-white px-3 py-1">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button className="btn-primary w-full mt-6">
              <Eye className="h-5 w-5 mr-2" />
              Lihat Semua Pesanan
            </Button>
          </CardContent>
        </Card>

        {/* Modern Top Products */}
        <Card className="unified-card card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="icon-container-primary">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Produk Terlaris</h2>
                <p className="text-sm text-muted-foreground font-normal">
                  Produk dengan penjualan tertinggi
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 card-hover">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="icon-container">
                        <Target className="h-4 w-4 text-[#31B57F]" />
                      </div>
                      <p className="font-semibold text-lg">{product.name}</p>
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {product.sales} unit terjual
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-bold text-lg text-green-600">
                      Rp{product.revenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">Pendapatan</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aksi Cepat */}
 
    </div>
  );
};
