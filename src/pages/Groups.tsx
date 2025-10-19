import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RoleBasedLayout } from "@/components/RoleBasedLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MapWithAlerts from "@/components/MapWithAlerts";
import { Users, MapPin, Bug, AlertTriangle, Share2, Send, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PestAlert {
  id: string;
  pestName: string;
  probability: number;
  severity: string;
  location: string;
  timestamp: string;
  description: string;
  reporter: string;
}

export default function Groups() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [pestAlerts, setPestAlerts] = useState<PestAlert[]>([
    {
      id: "1",
      pestName: "Blast",
      probability: 85,
      severity: "tinggi",
      location: "Ladang A - Jagung",
      timestamp: "2 jam yang lalu",
      description: "Hama blast terdeteksi dengan tingkat keparahan tinggi. Segera lakukan tindakan pencegahan.",
      reporter: "Budi Santoso"
    },
    {
      id: "2", 
      pestName: "Brown Spot",
      probability: 65,
      severity: "sedang",
      location: "Ladang B - Padi",
      timestamp: "4 jam yang lalu",
      description: "Brown spot terdeteksi pada tanaman padi. Perlu monitoring lebih lanjut.",
      reporter: "Sari Wijaya"
    }
  ]);

  // Check if coming from pest detection
  const pestDetectionData = location.state?.pestDetectionData;

  useEffect(() => {
    document.title = "Kelompok Tani | AgroPredict";
    
    // If coming from pest detection, show share modal
    if (pestDetectionData) {
      setShowShareModal(true);
      setShareMessage(`${pestDetectionData.probability}% ${pestDetectionData.name} terdeteksi pada tanaman. Tingkat keparahan: ${pestDetectionData.severity}. Segera lakukan tindakan pencegahan.`);
    }
  }, [pestDetectionData]);

  const handleShareAlert = () => {
    if (!shareMessage.trim()) {
      toast({
        title: "Error",
        description: "Pesan tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    // Add new alert to the list
    const newAlert: PestAlert = {
      id: Date.now().toString(),
      pestName: pestDetectionData?.name || "Hama",
      probability: pestDetectionData?.probability || 0,
      severity: pestDetectionData?.severity || "sedang",
      location: "Ladang Saya",
      timestamp: "Baru saja",
      description: shareMessage,
      reporter: "Anda"
    };

    setPestAlerts([newAlert, ...pestAlerts]);
    setShowShareModal(false);
    setShareMessage("");

    toast({
      title: "Berhasil",
      description: "Peringatan hama telah dibagikan ke kelompok tani",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "tinggi":
        return "bg-red-100 text-red-800 border-red-200";
      case "sedang":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rendah":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Kelompok Tani</h1>
          <p className="text-muted-foreground">
            Daftar petani terdekat, berbagi peringatan hama, dan obrolan lokal
          </p>
        </div>

        {/* Peringatan Hama Terkini */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Peringatan Hama Terkini
            </CardTitle>
            <CardDescription>
              Peringatan hama dari petani di sekitar Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pestAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bug className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Tidak ada peringatan hama terkini</p>
                <p className="text-sm">Bagikan peringatan hama untuk membantu petani lain</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pestAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${
                      alert.severity === "tinggi"
                        ? "bg-red-50 border-red-200"
                        : alert.severity === "sedang"
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-green-50 border-green-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <div>
                          <h4 className="font-semibold">{alert.pestName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {alert.probability}% terdeteksi • {alert.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {alert.timestamp}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm mb-2">{alert.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Dilaporkan oleh: {alert.reporter}</span>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-3 w-3 mr-1" />
                        Bagikan
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Peta Peringatan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Peta Peringatan Hama
            </CardTitle>
            <CardDescription>
              Lihat lokasi peringatan hama di peta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-lg border bg-muted overflow-hidden z-0">
              <div className="relative z-0">
                <MapWithAlerts
                  heightClass="h-72"
                  fullscreenTopOffsetClass="top-16 left-0 right-0 bottom-0 z-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Petani Terdekat */}
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

        {/* Share Alert Modal */}
        <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Bagikan Peringatan Hama
              </DialogTitle>
              <DialogDescription>
                Bagikan informasi hama yang terdeteksi ke kelompok tani
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {pestDetectionData && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Hasil Deteksi</AlertTitle>
                  <AlertDescription>
                    {pestDetectionData.probability}% {pestDetectionData.name} terdeteksi
                    <br />
                    Tingkat keparahan: {pestDetectionData.severity}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="message">Pesan Peringatan</Label>
                <Textarea
                  id="message"
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  placeholder="Tulis pesan peringatan untuk petani lain..."
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowShareModal(false)}
              >
                Batal
              </Button>
              <Button
                onClick={handleShareAlert}
                className="bg-[#31B57F] hover:bg-[#27A06F]"
              >
                <Send className="h-4 w-4 mr-2" />
                Bagikan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleBasedLayout>
  );
}
