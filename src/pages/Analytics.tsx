import { useEffect, useState } from "react";
import { RoleBasedLayout } from "@/components/RoleBasedLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, DollarSign, Package, Target, Download, Filter } from "lucide-react";

const salesData = [
  { name: "Pupuk NPK Mutiara", sales: 145, revenue: 3190000, unit: "karung", growth: 12 },
  { name: "Benih Padi Ciherang", sales: 89, revenue: 890000, unit: "paket", growth: 8 },
  { name: "Pompa Irigasi Portable", sales: 34, revenue: 11900000, unit: "unit", growth: 25 },
  { name: "Pestisida Decis", sales: 67, revenue: 335000, unit: "botol", growth: -5 },
  { name: "Pupuk Urea", sales: 112, revenue: 1680000, unit: "karung", growth: 15 },
  { name: "Benih Jagung Bisi-2", sales: 78, revenue: 1950000, unit: "paket", growth: 10 },
];

const monthlySales = [
  { bulan: "Jan", penjualan: 45, revenue: 18000000 },
  { bulan: "Feb", penjualan: 52, revenue: 19500000 },
  { bulan: "Mar", penjualan: 68, revenue: 24000000 },
  { bulan: "Apr", penjualan: 71, revenue: 25500000 },
  { bulan: "Mei", penjualan: 78, revenue: 27000000 },
  { bulan: "Jun", penjualan: 89, revenue: 31000000 },
];

const categoryDistribution = [
  { name: "Pupuk", value: 320000000, color: "#31B57F" },
  { name: "Benih", value: 145000000, color: "#3B82F6" },
  { name: "Alat", value: 119000000, color: "#F59E0B" },
  { name: "Obat", value: 65000000, color: "#EF4444" },
];

const formatRupiah = (value: number) => {
  return value.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
};

const COLORS = ["#31B57F", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

export default function Analytics() {
  const [period, setPeriod] = useState("6months");
  
  useEffect(() => {
    document.title = "Laporan Penjualan | AgroPredict";
    const meta = document.querySelector('meta[name="description"]') || document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute("content", "Laporan Penjualan: analisis produk terlaris, tren penjualan bulanan, dan distribusi kategori");
    document.head.appendChild(meta);
  }, []);

  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
  const avgGrowth = (salesData.reduce((sum, item) => sum + item.growth, 0) / salesData.length).toFixed(1);

  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Laporan Penjualan</h1>
            <p className="text-muted-foreground">Analisis mendalam tentang performa produk dan tren penjualan</p>
          </div>
          <div className="flex gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32 bg-white">
              <SelectValue placeholder="Periode" />
              </SelectTrigger>
              <SelectContent className="bg-white">
              <SelectItem value="1month">1 Bulan</SelectItem>
              <SelectItem value="3months">3 Bulan</SelectItem>
              <SelectItem value="6months">6 Bulan</SelectItem>
              <SelectItem value="1year">1 Tahun</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="bg-green-600 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card className="unified-card border border-gray-200/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="icon-container-primary">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">Total Revenue</p>
                  <p className="text-lg md:text-xl font-bold text-green-600">
                    {formatRupiah(totalRevenue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="unified-card border border-gray-200/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="icon-container bg-gradient-to-br from-blue-100 to-cyan-100">
                  <Package className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">Total Penjualan</p>
                  <p className="text-lg md:text-xl font-bold text-blue-600">{totalSales} unit</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="unified-card border border-gray-200/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="icon-container bg-gradient-to-br from-purple-100 to-violet-100">
                  <Target className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">Rata-rata Pertumbuhan</p>
                  <p className="text-lg md:text-xl font-bold text-purple-600">{avgGrowth}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="unified-card border border-gray-200/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="icon-container bg-gradient-to-br from-orange-100 to-yellow-100">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">Jumlah Produk</p>
                  <p className="text-lg md:text-xl font-bold text-orange-600">{salesData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Monthly Sales Chart */}
          <Card className="unified-card border border-gray-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Tren Penjualan Bulanan
              </CardTitle>
              <CardDescription>Revenue dan unit terjual per bulan</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  penjualan: { label: "Unit Terjual", color: "#31B57F" },
                  revenue: { label: "Revenue", color: "#3B82F6" },
                }}
                className="h-64 w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bulan" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="penjualan"
                      stroke="#31B57F"
                      strokeWidth={2}
                      dot={{ fill: "#31B57F", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="unified-card border border-gray-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Distribusi Kategori
              </CardTitle>
              <CardDescription>Persentase penjualan per kategori produk</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  pupuk: { label: "Pupuk", color: "#31B57F" },
                  benih: { label: "Benih", color: "#3B82F6" },
                  alat: { label: "Alat", color: "#F59E0B" },
                  obat: { label: "Obat", color: "#EF4444" },
                }}
                className="h-64 w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      formatter={(value) => formatRupiah(value as number)}
                      content={<ChartTooltipContent />}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Products Detailed Table */}
        <Card className="unified-card border border-gray-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Produk Terlaris
            </CardTitle>
            <CardDescription>Performa lengkap setiap produk</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Produk</th>
                    <th className="text-center py-3 px-4 font-semibold">Unit Terjual</th>
                    <th className="text-right py-3 px-4 font-semibold">Revenue</th>
                    <th className="text-center py-3 px-4 font-semibold">Pertumbuhan</th>
                    <th className="text-right py-3 px-4 font-semibold">Satuan</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.map((product, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <p className="font-medium text-gray-900">{product.name}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <p className="font-semibold text-gray-900">{product.sales}</p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <p className="font-bold text-green-600">{formatRupiah(product.revenue)}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                          className={`${
                            product.growth > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.growth > 0 ? "+" : ""}{product.growth}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">{product.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Products Performance Cards */}
        {/* <div className="space-y-3">
          <h3 className="text-lg font-bold">Performa Produk</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {salesData.map((product, index) => (
              <Card key={index} className="unified-card">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg"
                      style={{ backgroundColor: COLORS[index % COLORS.length] + "20", borderLeft: `4px solid ${COLORS[index % COLORS.length]}` }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{product.sales} unit • {product.unit}</p>
                      <p className="text-sm font-bold text-green-600 mt-2">{formatRupiah(product.revenue)}</p>
                      <div className="mt-2">
                        <Badge
                          className={`text-xs ${
                            product.growth > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.growth > 0 ? "↑" : "↓"} {Math.abs(product.growth)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div> */}
      </div>
    </RoleBasedLayout>
  );
}