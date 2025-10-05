import { useEffect, useState } from 'react'
import { RoleBasedLayout } from '@/components/RoleBasedLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Users, MapPin, Bug, Send } from 'lucide-react'

interface Message { id: number; text: string; author: string; time: string }

export default function Groups() {
  useEffect(() => {
    document.title = 'Kelompok Tani | AgroPredict'
  }, [])

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Halo semua, ada serangan ulat grayak di blok C.', author: 'Budi', time: '09:10' },
    { id: 2, text: 'Siap, saya sarankan monitoring 2x sehari.', author: 'Sari', time: '09:22' },
  ])
  const [chatInput, setChatInput] = useState('')

  const sendMessage = () => {
    if (!chatInput.trim()) return
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: chatInput.trim(), author: 'Anda', time: new Date().toLocaleTimeString().slice(0,5) }
    ])
    setChatInput('')
  }

  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Kelompok Tani</h1>
          <p className="text-muted-foreground">Daftar petani terdekat, berbagi peringatan hama, dan obrolan lokal</p>
        </div>

        {/* Obrolan Lokal */}
        <Card>
          <CardHeader>
            <CardTitle>Obrolan Lokal</CardTitle>
            <CardDescription>Koordinasi cepat antar petani</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="max-h-60 overflow-y-auto space-y-2 p-2 rounded-md border bg-background">
                {messages.map((m) => (
                  <div key={m.id} className="text-sm">
                    <span className="font-medium">{m.author}</span>
                    <span className="text-muted-foreground"> • {m.time}</span>
                    <div>{m.text}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input placeholder="Tulis pesan..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' ? sendMessage() : undefined} />
                <Button onClick={sendMessage}><Send className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peringatan Hama */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bug className="h-5 w-5" /> Berbagi Peringatan Hama</CardTitle>
            <CardDescription>Bagikan lokasi dan deskripsi singkat</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="h-48 rounded-lg border bg-muted overflow-hidden">
                <iframe
                  title="Peta Malang, Indonesia"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=112.56%2C-8.15%2C112.75%2C-7.90&layer=mapnik&marker=-7.9839%2C112.6214"
                  className="w-full h-full"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Input placeholder="cth. Wereng di sawah blok B" />
              <Button className="w-full">Kirim Peringatan</Button>
            </div>
          </CardContent>
        </Card>

        {/* Petani terdekat */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Petani Terdekat</CardTitle>
            <CardDescription>Berbasis lokasi</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Budi', distance: '1.2 km', crops: 'Padi' },
              { name: 'Sari', distance: '2.5 km', crops: 'Jagung' },
              { name: 'Wawan', distance: '3.1 km', crops: 'Kedelai' },
            ].map((f) => (
              <div key={f.name} className="p-4 rounded-lg border bg-card">
                <div className="font-medium">{f.name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {f.distance}
                </div>
                <div className="text-sm">Komoditas: {f.crops}</div>
                <Button variant="outline" size="sm" className="mt-3">Hubungi</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </RoleBasedLayout>
  )
}
