import { useEffect, useMemo, useState } from "react";
import { RoleBasedLayout } from "@/components/RoleBasedLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Truck, ArrowRightLeft } from "lucide-react";

interface OrderItem {
  id: string;
  date: string;
  product: string;
  quantity: number;
  unitPrice: number;
  buyer: string;
  location: string;
  status: "pending" | "diproses" | "dikirim";
}

const initialOrders: OrderItem[] = [
  { id: "PO-1021", date: "2025-08-01", product: "Pupuk SP 18", quantity: 20, unitPrice: 105000, buyer: "Koperasi Tani Makmur", location: "Malang", status: "pending" },
  { id: "PO-1022", date: "2025-08-03", product: "NPK Phonska", quantity: 15, unitPrice: 210000, buyer: "Gapoktan Sejahtera", location: "Blitar", status: "diproses" },
  { id: "PO-1023", date: "2025-08-05", product: "Pupuk MKP", quantity: 10, unitPrice: 425300, buyer: "Petani Mandiri", location: "Kediri", status: "dikirim" },
  { id: "PO-1024", date: "2025-08-06", product: "Benih Padi IR64", quantity: 50, unitPrice: 65000, buyer: "Kelompok Tani Subur", location: "Pasuruan", status: "pending" },
  { id: "PO-1025", date: "2025-08-07", product: "Alat Semprot Elektrik", quantity: 5, unitPrice: 850000, buyer: "Koperasi Agro Lestari", location: "Probolinggo", status: "diproses" },
  { id: "PO-1026", date: "2025-08-08", product: "Pupuk Organik Granul", quantity: 30, unitPrice: 95000, buyer: "Petani Mandiri", location: "Batu", status: "dikirim" },
];


export default function Orders() {
  useEffect(() => {
    document.title = "Pesanan | AgroPredict";
    const meta = document.querySelector('meta[name="description"]') || document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute("content", "Pesanan: lacak pesanan petani, ubah status (Pending → Dikirim), lihat detail pembeli");
    document.head.appendChild(meta);
  }, []);

  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [filter, setFilter] = useState<"semua" | OrderItem["status"]>("semua");

  const visible = useMemo(() => orders.filter(o => filter === "semua" ? true : o.status === filter), [orders, filter]);

  const nextStatus = (s: OrderItem["status"]) => (s === "pending" ? "diproses" : s === "diproses" ? "dikirim" : "dikirim");

  const bumpStatus = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus(o.status) } : o));
    toast({ title: "Status diperbarui", description: "Status pesanan telah diubah." });
  };

  const statusBadge = (s: OrderItem["status"]) => (
    s === "pending" ? <Badge variant="outline">Pending</Badge>
    : s === "diproses" ? <Badge>Diproses</Badge>
    : <Badge className="bg-green-600 text-white hover:bg-green-600/90">Dikirim</Badge>
  );

  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Pesanan</h1>
          <p className="text-muted-foreground">Lacak pesanan dari petani dan ubah status pengiriman.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Pesanan</CardTitle>
            <CardDescription>Kelola dan perbarui status pesanan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 pb-4 overflow-x-auto whitespace-nowrap">
              <Button variant={filter === "semua" ? "default" : "outline"} onClick={() => setFilter("semua")}>Semua</Button>
              <Button variant={filter === "pending" ? "default" : "outline"} onClick={() => setFilter("pending")}>Pending</Button>
              <Button variant={filter === "diproses" ? "default" : "outline"} onClick={() => setFilter("diproses")}>Diproses</Button>
              <Button variant={filter === "dikirim" ? "default" : "outline"} onClick={() => setFilter("dikirim")}>Dikirim</Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Pembeli</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>{new Date(o.date).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell>{o.product}</TableCell>
                    <TableCell>{o.quantity}</TableCell>
                    <TableCell>Rp {new Intl.NumberFormat("id-ID").format(o.quantity * o.unitPrice)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{o.buyer}</span>
                        <span className="text-xs text-muted-foreground">{o.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>{statusBadge(o.status)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      {o.status !== "dikirim" && (
                        <Button size="sm" onClick={() => bumpStatus(o.id)} className="gap-2"><ArrowRightLeft className="h-4 w-4" /> Ubah Status</Button>
                      )}
                      {o.status === "dikirim" && (
                        <Button size="sm" variant="outline" className="gap-2"><Truck className="h-4 w-4" /> Lacak</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </RoleBasedLayout>
  );
}
