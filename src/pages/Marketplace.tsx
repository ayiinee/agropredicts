import { useEffect, useState } from 'react'
import { RoleBasedLayout } from '@/components/RoleBasedLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShoppingCart, Store } from 'lucide-react'

export default function Marketplace() {
  useEffect(() => {
    document.title = 'Belanja | AgroPredict'
  }, [])

  const [sellForm, setSellForm] = useState({ komoditas: '', kualitas: '', kuantitas: '', harga: '' })
  const products = [
    { id: 1, name: 'Pupuk SP 18', price: 105000, rating: 4.6, reviews: 135, image: '/sp18.jpg', discount: 0 },
    { id: 2, name: 'Pupuk MKP', price: 425300, rating: 4.6, reviews: 135, image: '/mkp.webp', discount: 15 },
    { id: 3, name: 'Pupuk NPK Phonka', price: 105000, rating: 4.6, reviews: 135, image: '/shopping.webp', discount: 0 },
    { id: 4, name: 'Pupuk NPK', price: 425300, rating: 4.6, reviews: 135, image: '/npk.webp', discount: 0 },
  ]

  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Belanja</h1>
          <p className="text-muted-foreground">Beli input pertanian dari distributor atau jual hasil panen ke koperasi</p>
        </div>

        <Tabs defaultValue="buy" className="w-full">
          <TabsList>
            <TabsTrigger value="buy" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" /> Beli
            </TabsTrigger>
            <TabsTrigger value="sell" className="flex items-center gap-2">
              <Store className="h-4 w-4" /> Jual Hasil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy">
            <Card>
              <CardHeader>
                <CardTitle>Belanja Produk Pertanian</CardTitle>
                <CardDescription>Pilih dari katalog produk berikut</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="rounded-lg border bg-card">
                      <div className="relative p-4">
                        {p.discount > 0 && (
                          <span className="absolute left-3 top-3 rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">Disc. {p.discount}%</span>
                        )}
                        <img
                          src={p.image}
                          alt={`Foto ${p.name}`}
                          loading="lazy"
                          className="mx-auto h-32 object-contain"
                        />
                      </div>
                      <div className="px-4 pb-4">
                        <div className="font-medium">{p.name}</div>
                        <div className="text-sm text-muted-foreground">{p.rating}/5 • {p.reviews} ulasan</div>
                        <div className="mt-1 text-lg font-semibold text-destructive">{new Intl.NumberFormat('id-ID').format(p.price)}</div>
                        <Button className="mt-3 w-full">Pesan</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sell">
            <Card>
              <CardHeader>
                <CardTitle>Jual Hasil Panen</CardTitle>
                <CardDescription>Isi detail kualitas, kuantitas, dan harga</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Komoditas</Label>
                  <Input placeholder="cth. Padi, Jagung" onChange={(e) => setSellForm((s) => ({ ...s, komoditas: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Kualitas</Label>
                  <Select onValueChange={(v) => setSellForm((s) => ({ ...s, kualitas: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kualitas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="baik">Baik</SelectItem>
                      <SelectItem value="standar">Standar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Kuantitas (kg)</Label>
                  <Input type="number" placeholder="cth. 1000" onChange={(e) => setSellForm((s) => ({ ...s, kuantitas: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Harga (per kg)</Label>
                  <Input type="number" placeholder="cth. 12000" onChange={(e) => setSellForm((s) => ({ ...s, harga: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <Button className="w-full md:w-auto">Ajukan Penawaran</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </RoleBasedLayout>
  )
}
