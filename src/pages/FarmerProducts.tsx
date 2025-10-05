import { RoleBasedLayout } from "@/components/RoleBasedLayout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { useState } from "react";

const mockProducts = [
    { id: "HP-01", farmer: "Budi Santoso", product: "Padi", quantity: "1.200 kg", price: 5500, status: "pending" },
  { id: "HP-02", farmer: "Siti Aminah", product: "Cabe Merah", quantity: "300 kg", price: 28000, status: "negotiating" },
  { id: "HP-03", farmer: "Andi Pratama", product: "Jagung", quantity: "800 kg", price: 6500, status: "accepted" },
  { id: "HP-04", farmer: "Rina Kartika", product: "Tomat", quantity: "450 kg", price: 12000, status: "pending" },
  { id: "HP-05", farmer: "Ahmad Fauzi", product: "Bawang Merah", quantity: "250 kg", price: 35000, status: "rejected" },
  { id: "HP-06", farmer: "Wulan Sari", product: "Kacang Hijau", quantity: "500 kg", price: 22000, status: "accepted" },
  { id: "HP-07", farmer: "Hendra Wijaya", product: "Kopi Robusta", quantity: "200 kg", price: 48000, status: "negotiating" },
  { id: "HP-08", farmer: "Dewi Lestari", product: "Ubi Jalar", quantity: "600 kg", price: 9000, status: "pending" },
  { id: "HP-09", farmer: "Rahmat Hidayat", product: "Kedelai", quantity: "400 kg", price: 12000, status: "accepted" },
  { id: "HP-10", farmer: "Sri Wahyuni", product: "Teh Hijau", quantity: "350 kg", price: 42000, status: "pending" }

];

export default function FarmerProducts() {
  const [products, setProducts] = useState(mockProducts);

  const handleAction = (id: string, action: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, status: action } : p));
  };

  return (
    <RoleBasedLayout>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Produk Panen Masuk</CardTitle>
            <CardDescription>Daftar produk panen dari petani</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Petani</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead>Kuantitas</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell className="whitespace-nowrap">{product.id}</TableCell>
                    <TableCell className="whitespace-nowrap">{product.farmer}</TableCell>
                    <TableCell>{product.product}</TableCell>
                    <TableCell className="whitespace-nowrap">{product.quantity}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      Rp {product.price.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === "accepted"
                            ? "secondary"
                            : product.status === "negotiating"
                            ? "default"
                            : "outline"
                        }
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {product.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(product.id, "negotiating")}
                          >
                            Negosiasi
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAction(product.id, "accepted")}
                          >
                            Terima
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleAction(product.id, "rejected")}
                          >
                            Tolak
                          </Button>
                        </>
                      )}
                      {product.status === "negotiating" && (
                        <Button
                          size="sm"
                          onClick={() => handleAction(product.id, "accepted")}
                        >
                          Setujui Harga
                        </Button>
                      )}
                      {product.status === "accepted" && <span>✓</span>}
                      {product.status === "rejected" && <span>Ditolak</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </RoleBasedLayout>
  );
}
