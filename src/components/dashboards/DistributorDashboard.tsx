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
  ChevronRight,
  Clock,
  Truck,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const DistributorDashboard = () => {
  const { profile } = useAuth();

  // Data contoh
  const stats = {
    totalProducts: 156,
    activeOrders: 23,
    monthlyRevenue: 12500000,
    lowStockItems: 2,
  };

  const recentOrders = [
    {
      id: "ORD-001",
      farmer: "Budi Santoso",
      product: "Pupuk NPK Mutiara",
      quantity: "50 karung",
      total: 11000000,
      status: "pending",
      date: "2025-08-05",
    },
    {
      id: "ORD-002",
      farmer: "Siti Aminah",
      product: "Benih Padi Ciherang",
      quantity: "25 paket",
      total: 2500000,
      status: "shipped",
      date: "2025-08-04",
    },
    {
      id: "ORD-003",
      farmer: "Andi Wijaya",
      product: "Pompa Irigasi Portable",
      quantity: "1 unit",
      total: 3500000,
      status: "delivered",
      date: "2025-08-03",
    },
  ];

  const lowStockProducts = [
    { name: "Pupuk Urea", stock: 15, minStock: 50, unit: "karung" },
    { name: "Benih Jagung Bisi-2", stock: 8, minStock: 25, unit: "paket" },
  ];

  const topProducts = [
    { name: "Pupuk NPK Mutiara", sales: 145, revenue: 31900000 },
    { name: "Benih Padi Ciherang", sales: 89, revenue: 8900000 },
    { name: "Pompa Irigasi Portable", sales: 34, revenue: 119000000 },
    { name: "Pestisida Decis", sales: 67, revenue: 3350000 },
  ];

  const formatRupiah = (value: number) => {
    return value.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Modern Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold gradient-text">
            Halo, {profile?.full_name}!
          </h1>
          <p className="text-base text-muted-foreground">
            Kelola bisnis pasokan pertanian Anda
          </p>
        </div>
        {/* <Button className="btn-primary w-full sm:w-auto">
          <Plus className="h-5 w-5 mr-2" />
          Tambah Produk
        </Button> */}
      </div>

      {/* Modern Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* <Card className="unified-card card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="icon-container-primary">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xl md:text-xl font-bold gradient-text">{stats.totalProducts}</p>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">Total Produk</p>
              </div>
            </div>
          </CardContent>
        </Card> */}

        <Card className="unified-card card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="icon-container bg-gradient-to-br from-blue-100 to-cyan-100">
                <ShoppingCart className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xl md:text-xl font-bold text-blue-600">
                  {stats.activeOrders}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">
                  Pesanan Aktif
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="unified-card card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="icon-container bg-gradient-to-br from-green-100 to-emerald-100">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xl md:text-xl font-bold text-green-600">
                  {formatRupiah(stats.monthlyRevenue)}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">
                  Pendapatan Bulanan
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}

        <Card className="unified-card card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="icon-container bg-gradient-to-br from-orange-100 to-yellow-100">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xl md:text-xl font-bold text-orange-600">
                  {stats.lowStockItems}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">
                  Stok Rendah
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modern Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="unified-card card-hover">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center gap-2 md:gap-3">
              <div className="icon-container-primary">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold">
                  Peringatan Stok Rendah
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground font-normal">
                  {lowStockProducts.length} produk perlu diisi ulang
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-2 md:space-y-3">
              {lowStockProducts.slice(0, 3).map((product, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm md:text-base text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-xs md:text-sm text-orange-700 font-medium mt-1">
                      {product.stock} {product.unit} tersisa{" "}
                      <span className="text-gray-600">
                        (min: {product.minStock})
                      </span>
                    </p>
                  </div>
                  {/* <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Pesan
                    </Button>
                  </div> */}
                </div>
              ))}
            </div>
            {lowStockProducts.length > 3 && (
              <Button
                variant="ghost"
                className="w-full mt-3 text-orange-600 hover:bg-orange-50 text-sm"
              >
                Lihat Semua Alert ({lowStockProducts.length})
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Modern Recent Orders */}
        <Card className="unified-card card-hover">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center gap-2 md:gap-3">
              <div className="icon-container-primary">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold">
                  Pesanan Terbaru
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground font-normal">
                  {recentOrders.length} pesanan terakhir
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-2 md:space-y-3">
              {recentOrders.map((order, idx) => (
                <div
                  key={order.id}
                  className={`flex items-start justify-between gap-3 p-3 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 hover:shadow-md transition-shadow ${
                    idx !== recentOrders.length - 1 ? "" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm md:text-base text-gray-900">
                        {order.id}
                      </p>
                      <Badge
                        className={`${getStatusBgColor(
                          order.status
                        )} text-xs px-2 py-0.5 flex-shrink-0 gap-1`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="hidden xs:inline">{order.status}</span>
                      </Badge>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 font-medium truncate">
                      {order.farmer}
                    </p>
                    <p className="text-xs md:text-sm text-gray-700 mt-1">
                      {order.product} • {order.quantity}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm md:text-base text-green-600">
                      {formatRupiah(order.total)}
                    </p>
                    {/* <ChevronRight className="h-4 w-4 text-gray-400 mt-2" /> */}
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4 text-green-600 hover:bg-green-50 text-sm md:text-base"
            >
              {/* <Eye className="h-4 md:h-5 w-4 md:w-5 mr-2" /> */}
              Lihat Semua Pesanan
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Modern Top Products */}
        <Card className="unified-card card-hover">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center gap-2 md:gap-3">
              <div className="icon-container-primary">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold">
                  Produk Terlaris
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground font-normal">
                  Penjualan tertinggi bulan ini
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-2 md:space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between gap-3 p-3 md:p-4 rounded-lg md:rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <p className="font-semibold text-sm md:text-base text-gray-900 truncate">
                        {product.name}
                      </p>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 font-medium">
                      {product.sales} unit terjual
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm md:text-base text-green-600">
                      {formatRupiah(product.revenue)}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                      Pendapatan
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4 text-green-600 hover:bg-green-50 text-sm md:text-base"
              onClick={() => (window.location.href = "/analytics")}
            >
              {/* <TrendingUp className="h-4 w-4 mr-2" /> */}
              Lihat Laporan Penjualan
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
