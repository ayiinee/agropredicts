import { RoleBasedLayout } from "@/components/RoleBasedLayout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { CheckCircle, Clock, AlertCircle, XCircle, Search, Filter } from "lucide-react";

const mockProducts = [
  { id: "HP-01", farmer: "Budi Santoso", product: "Padi", quantity: "1.200 kg", price: 5500, status: "tertunda" },
  { id: "HP-02", farmer: "Siti Aminah", product: "Cabe Merah", quantity: "300 kg", price: 28000, status: "negosiasi" },
  { id: "HP-03", farmer: "Andi Pratama", product: "Jagung", quantity: "800 kg", price: 6500, status: "diterima" },
  { id: "HP-04", farmer: "Rina Kartika", product: "Tomat", quantity: "450 kg", price: 12000, status: "tertunda" },
  { id: "HP-05", farmer: "Ahmad Fauzi", product: "Bawang Merah", quantity: "250 kg", price: 35000, status: "ditolak" },
  { id: "HP-06", farmer: "Wulan Sari", product: "Kacang Hijau", quantity: "500 kg", price: 22000, status: "diterima" },
  { id: "HP-07", farmer: "Hendra Wijaya", product: "Kopi Robusta", quantity: "200 kg", price: 48000, status: "negosiasi" },
  { id: "HP-08", farmer: "Dewi Lestari", product: "Ubi Jalar", quantity: "600 kg", price: 9000, status: "tertunda" },
  { id: "HP-09", farmer: "Rahmat Hidayat", product: "Kedelai", quantity: "400 kg", price: 12000, status: "diterima" },
  { id: "HP-10", farmer: "Sri Wahyuni", product: "Teh Hijau", quantity: "350 kg", price: 42000, status: "tertunda" }
];

export default function FarmerProducts() {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");

  const filtered = useMemo(() => {
    return products.filter(p => {
      const byStatus = statusFilter === "semua" || p.status === statusFilter;
      const bySearch = p.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.farmer.toLowerCase().includes(searchQuery.toLowerCase());
      return byStatus && bySearch;
    });
  }, [products, searchQuery, statusFilter]);

  const handleAction = (id: string, action: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, status: action } : p));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "tertunda":
        return <Clock className="h-4 w-4" />;
      case "negosiasi":
        return <AlertCircle className="h-4 w-4" />;
      case "diterima":
        return <CheckCircle className="h-4 w-4" />;
      case "ditolak":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "tertunda":
        return "bg-yellow-100 text-yellow-800";
      case "negosiasi":
        return "bg-blue-100 text-blue-800";
      case "diterima":
        return "bg-green-100 text-green-800";
      case "ditolak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = {
    tertunda: products.filter(p => p.status === "tertunda").length,
    negosiasi: products.filter(p => p.status === "negosiasi").length,
    diterima: products.filter(p => p.status === "diterima").length,
    ditolak: products.filter(p => p.status === "ditolak").length,
  };

  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Produk Panen Masuk</h1>
          <p className="text-muted-foreground">Kelola dan setujui produk panen dari petani</p>
        </div>

        {/* Stats Overview */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">{stats.tertunda}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Menunggu</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{stats.negosiasi}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Negosiasi</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{stats.diterima}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Diterima</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{stats.ditolak}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Ditolak</p>
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari produk atau petani..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="tertunda">Menunggu</SelectItem>
                  <SelectItem value="negosiasi">Negosiasi</SelectItem>
                  <SelectItem value="diterima">Diterima</SelectItem>
                  <SelectItem value="ditolak">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products List - Desktop Table */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">ID</th>
                      <th className="text-left py-3 px-4 font-semibold">Petani</th>
                      <th className="text-left py-3 px-4 font-semibold">Produk</th>
                      <th className="text-left py-3 px-4 font-semibold">Kuantitas</th>
                      <th className="text-left py-3 px-4 font-semibold">Harga/Unit</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-right py-3 px-4 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900">{product.id}</td>
                        <td className="py-3 px-4">{product.farmer}</td>
                        <td className="py-3 px-4 font-medium">{product.product}</td>
                        <td className="py-3 px-4">{product.quantity}</td>
                        <td className="py-3 px-4 font-medium text-green-600">
                          Rp {product.price.toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={`gap-1 ${getStatusColor(product.status)}`}>
                            {getStatusIcon(product.status)}
                            {product.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            {product.status === "tertunda" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAction(product.id, "negosiasi")}
                                >
                                  Negosiasi
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleAction(product.id, "diterima")}
                                >
                                  Terima
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleAction(product.id, "ditolak")}
                                >
                                  Tolak
                                </Button>
                              </>
                            )}
                            {product.status === "negosiasi" && (
                              <Button
                                size="sm"
                                onClick={() => handleAction(product.id, "diterima")}
                              >
                                Setujui Harga
                              </Button>
                            )}
                            {product.status === "diterima" && (
                              <Badge className="bg-green-100 text-green-800">✓ Diterima</Badge>
                            )}
                            {product.status === "ditolak" && (
                              <Badge className="bg-red-100 text-red-800">✗ Ditolak</Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products List - Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                Tidak ada produk yang sesuai
              </CardContent>
            </Card>
          ) : (
            filtered.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">{product.id}</p>
                        <h3 className="font-bold text-lg">{product.product}</h3>
                        <p className="text-sm text-gray-600">{product.farmer}</p>
                      </div>
                      <Badge className={`flex-shrink-0 gap-1 ${getStatusColor(product.status)}`}>
                        {getStatusIcon(product.status)}
                        {product.status}
                      </Badge>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-200">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Kuantitas</p>
                        <p className="font-semibold">{product.quantity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Harga/Unit</p>
                        <p className="font-semibold text-green-600">
                          Rp {product.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {product.status === "tertunda" && (
                        <>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => handleAction(product.id, "diterima")}
                          >
                            Terima
                          </Button>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleAction(product.id, "negosiasi")}
                            >
                              Negosiasi
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1"
                              onClick={() => handleAction(product.id, "ditolak")}
                            >
                              Tolak
                            </Button>
                          </div>
                        </>
                      )}
                      {product.status === "negosiasi" && (
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleAction(product.id, "diterima")}
                        >
                          Setujui Harga
                        </Button>
                      )}
                      {product.status === "diterima" && (
                        <div className="py-2 text-center text-green-600 font-semibold">
                          ✓ Sudah Diterima
                        </div>
                      )}
                      {product.status === "ditolak" && (
                        <div className="py-2 text-center text-red-600 font-semibold">
                          ✗ Ditolak
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Results Count */}
        <div className="text-center text-sm text-muted-foreground">
          Menampilkan {filtered.length} dari {products.length} produk
        </div>
      </div>
    </RoleBasedLayout>
  );
}