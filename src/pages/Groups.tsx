import { useEffect } from "react";
import { RoleBasedLayout } from "@/components/RoleBasedLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MapWithAlerts from "@/components/MapWithAlerts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, MapPin, Bug } from "lucide-react";

export default function Groups() {
  useEffect(() => {
    document.title = "Kelompok Tani | AgroPredict";
  }, []);

  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Kelompok Tani</h1>
          <p className="text-muted-foreground">
            Daftar petani terdekat, berbagi peringatan hama, dan obrolan lokal
          </p>
        </div>

        {/* Peringatan Hama */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" /> Berbagi Peringatan Hama
            </CardTitle>
            <CardDescription>
              Bagikan lokasi dan deskripsi singkat
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="rounded-lg border bg-muted overflow-hidden">
                <MapWithAlerts
                  heightClass="h-72"
                  fullscreenTopOffsetClass="top-16 left-0 right-0 bottom-0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Petani terdekat */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Petani Terdekat
            </CardTitle>
            <CardDescription>Berbasis lokasi</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Budi", distance: "1.2 km", crops: "Padi" },
              { name: "Sari", distance: "2.5 km", crops: "Jagung" },
              { name: "Wawan", distance: "3.1 km", crops: "Kedelai" },
            ].map((f) => (
              <div key={f.name} className="p-4 rounded-lg border bg-card">
                <div className="font-medium">{f.name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {f.distance}
                </div>
                <div className="text-sm">Komoditas: {f.crops}</div>
                <Button variant="outline" size="sm" className="mt-3">
                  Hubungi
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </RoleBasedLayout>
  );
}
