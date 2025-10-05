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
    <div className="space-y-6">
      {/* Header Selamat Datang */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Selamat datang kembali, {profile?.full_name}!
          </h1>
          <p className="text-muted-foreground">
            Kelola bisnis pasokan pertanian Anda
          </p>
        </div>
        <Button className="w-fit">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Produk
        </Button>
      </div>

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-l font-bold">{stats.totalProducts}</p>
                <p className="text-sm text-muted-foreground">Total Produk</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-l font-bold">{stats.activeOrders}</p>
                <p className="text-sm text-muted-foreground">Pesanan Aktif</p>
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
                  Rp{stats.monthlyRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Pendapatan Bulanan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-l font-bold">{stats.lowStockItems}</p>
                <p className="text-sm text-muted-foreground">Rendah</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Peringatan Stok Rendah */}
      {lowStockProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Peringatan Stok Rendah
            </CardTitle>
            <CardDescription>Produk yang perlu diisi ulang</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.stock} {product.unit} tersisa (min:{" "}
                      {product.minStock})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Rendah</Badge>
                    <Button size="sm" variant="outline">
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
        {/* Pesanan Terbaru */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Pesanan Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{order.id}</p>
                      <div
                        className={`w-2 h-2 rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.farmer}
                    </p>
                    <p className="text-sm">
                      {order.product} - {order.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      Rp{order.total.toLocaleString()}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Lihat Semua Pesanan
            </Button>
          </CardContent>
        </Card>

        {/* Produk Terlaris */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Produk Terlaris
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.sales} unit terjual
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      Rp{product.revenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Pendapatan</p>
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
