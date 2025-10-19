import { useEffect, useMemo, useState } from "react";
import { RoleBasedLayout } from "@/components/RoleBasedLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Images } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  is_active: boolean;
  images: string[];
}

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Pupuk SP 18",
    category: "Pupuk",
    price: 105000,
    stock: 120,
    unit: "sak",
    is_active: true,
    images: ["/sp18.jpg"],
  },
  {
    id: "2",
    name: "Pupuk MKP",
    category: "Pupuk",
    price: 425300,
    stock: 42,
    unit: "sak",
    is_active: true,
    images: ["/mkp.webp"],
  },
  {
    id: "3",
    name: "NPK Phonska",
    category: "Pupuk",
    price: 210000,
    stock: 80,
    unit: "sak",
    is_active: true,
    images: ["/npk.webp"],
  },
  {
    id: "4",
    name: "Alat Penyemprot",
    category: "Alat",
    price: 150000,
    stock: 50,
    unit: "unit",
    is_active: true,
    images: ["/semprot.jpg"],
  },
  {
    id: "5",
    name: "Benih Padi IR64",
    category: "Benih",
    price: 50000,
    stock: 200,
    unit: "kg",
    is_active: true,
    images: ["/padi.webp"],
  },

  {
    id: "6",
    name: "Sidabas 500 EC | Insektisida berbahan aktif BPMC",
    category: "Obat",
    price: 89000,
    stock: 75,
    unit: "botol",
    is_active: true,
    images: [
      "https://www.petrosida-gresik.com/sites/default/files/sidabas_3.jpg",
    ],
  },
  {
    id: "7",
    name: "HOPPER 500 EC | Insektisida berbahan aktif BPMC",
    category: "Obat",
    price: 76000,
    stock: 60,
    unit: "botol",
    is_active: true,
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFDDWFC0fvKmymktI2tMuv6XEORClQhZeung&s",
    ],
  },
];

export default function Products() {
  useEffect(() => {
    document.title = "Manajemen Produk | AgroPredict";
    const meta = document.querySelector('meta[name="description"]') || document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute("content", "Manajemen Produk: tambah, ubah, hapus, kategori, dan galeri produk");
    document.head.appendChild(meta);
  }, []);

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filter, setFilter] = useState<string>("semua");
  const [query, setQuery] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const byCat = filter === "semua" || p.category === filter;
      const byQuery = p.name.toLowerCase().includes(query.toLowerCase());
      return byCat && byQuery;
    });
  }, [products, filter, query]);

  const openCreate = () => {
    setEditing({
      id: crypto.randomUUID(),
      name: "",
      category: "Pupuk",
      price: 0,
      stock: 0,
      unit: "sak",
      is_active: true,
      images: [],
    });
    setEditOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing({ ...p });
    setEditOpen(true);
  };

  const saveProduct = () => {
    if (!editing) return;
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === editing.id);
      return exists ? prev.map((p) => (p.id === editing.id ? editing : p)) : [editing, ...prev];
    });
    toast({ title: "Berhasil", description: "Produk disimpan." });
    setEditOpen(false);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Dihapus", description: "Produk telah dihapus." });
  };

  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Manajemen Produk</h1>
          <p className="text-muted-foreground">Kelola katalog: tambah, ubah, hapus, kategori, dan galeri.</p>
        </header>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Katalog Produk</CardTitle>
              <CardDescription>Tambahkan atau ubah produk Anda</CardDescription>
            </div>
          </CardHeader>
          <CardHeader>

            <div className="flex gap-2">
              <Input placeholder="Cari produk..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-20" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Filter</SelectItem>
                  <SelectItem value="Pupuk">Pupuk</SelectItem>
                  <SelectItem value="Benih">Benih</SelectItem>
                  <SelectItem value="Alat">Alat</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={openCreate} className="gap-2">
                <Plus className="h-4 w-4" /> 
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Galeri</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 overflow-x-auto max-w-[200px]">
                        {p.images.length === 0 && (
                          <Badge variant="secondary" className="gap-1"><Images className="h-3 w-3" />Tidak ada</Badge>
                        )}
                        {p.images.map((src, idx) => (
                          <img key={idx} src={src} alt={`Foto ${p.name}`} loading="lazy" className="h-10 w-10 rounded object-cover" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>Rp {new Intl.NumberFormat("id-ID").format(p.price)}</TableCell>
                    <TableCell>{p.stock} {p.unit}</TableCell>
                    <TableCell>
                      {p.is_active ? <Badge>Aktif</Badge> : <Badge variant="outline">Nonaktif</Badge>}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus produk?</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteProduct(p.id)}>Hapus</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing && initialProducts.find(x=>x.id===editing.id) ? "Ubah Produk" : "Tambah Produk"}</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nama</Label>
                  <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select value={editing.category} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pupuk">Pupuk</SelectItem>
                      <SelectItem value="Benih">Benih</SelectItem>
                      <SelectItem value="Alat">Alat</SelectItem>
                      <SelectItem value="Obat">Obat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Harga (Rp)</Label>
                  <Input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Stok</Label>
                  <Input type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Satuan</Label>
                  <Input value={editing.unit} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Galeri (URL, pisahkan koma)</Label>
                  <Input
                    placeholder="https://..., https://..."
                    value={editing.images.join(", ")}
                    onChange={(e) => setEditing({ ...editing, images: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>Batal</Button>
              <Button onClick={saveProduct}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleBasedLayout>
  );
}
