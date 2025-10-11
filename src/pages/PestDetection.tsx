import { useEffect, useRef, useState } from "react";
import { RoleBasedLayout } from "@/components/RoleBasedLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Info,
  CameraIcon,
  StopCircle,
  UploadCloud,
} from "lucide-react";

// Data dummy hasil analisis
const dummyAnalysis = [
  { name: "Penggerek Batang", probability: 68, severity: "tinggi" },
  { name: "Wereng Cokelat", probability: 42, severity: "sedang" },
  { name: "Hawar Daun Bakteri", probability: 15, severity: "rendah" },
];

export default function PestDetection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Ref untuk input file
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Handler untuk upload gambar
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCapturedImage(ev.target?.result as string);
        setShowAnalysis(true);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };
  // Handler klik button upload
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handler untuk reset
  const handleReset = () => {
    setCapturedImage(null);
    setShowAnalysis(false);
    stopCamera();
  };

  useEffect(() => {
    document.title = "Deteksi Hama | AgroPredict";
    const meta =
      document.querySelector('meta[name="description"]') ||
      document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute(
      "content",
      "Deteksi serangan hama menggunakan kamera. Lihat hasil analisis berdasarkan foto yang diambil."
    );
    document.head.appendChild(meta);

    let link = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = `${window.location.origin}/pest-detection`;

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
      }
    } catch (e) {
      console.error("Camera access denied or unavailable", e);
      setStreaming(false);
    }
  };

  const stopCamera = () => {
    const mediaStream = videoRef.current?.srcObject as MediaStream | null;
    mediaStream?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setStreaming(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL("image/png");
        setCapturedImage(imageData);
        setShowAnalysis(true);
      }
    }
  };

  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Deteksi Serangan Hama</h1>
          <p className="text-muted-foreground">
            Gunakan kamera untuk memotret daun/tanaman yang dicurigai terkena
            hama, lalu lihat hasil analisis.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Kamera</CardTitle>
            <CardDescription>
              Aktifkan kamera dan ambil foto untuk analisis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!capturedImage ? (
              <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden flex items-center justify-center relative">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />
                {streaming && (
                  <button
                    onClick={stopCamera}
                    type="button"
                    className="absolute top-2 right-2 bg-red-600 bg-opacity-80 hover:bg-opacity-100 text-white rounded-full p-2 shadow-md transition-all duration-200 z-10"
                    style={{ width: 36, height: 36, opacity: 0.8 }}
                    title="Matikan Kamera"
                  >
                    <StopCircle className="h-5 w-5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
                <img
                  src={capturedImage}
                  alt="Hasil Foto"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex flex-row gap-2 items-center">
              <div className="flex gap-2">
                {!streaming && !capturedImage ? (
                  <Button
                    onClick={startCamera}
                    className="gap-2"
                    disabled={!!capturedImage}
                  >
                    <Camera className="h-4 w-4" /> Mulai Kamera
                  </Button>
                ) : null}
                {streaming && !capturedImage && (
                  <Button onClick={capturePhoto} className="gap-2">
                    <CameraIcon className="h-4 w-4" /> Ambil Foto
                  </Button>
                )}
                {capturedImage && (
                  <Button
                    variant="destructive"
                    onClick={handleReset}
                    className="gap-2"
                  >
                    Reset
                  </Button>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={!!capturedImage}
                  style={{ display: "none" }}
                />
                <Button
                  type="button"
                  onClick={handleUploadButtonClick}
                  className="gap-2"
                  disabled={!!capturedImage}
                >
                  <UploadCloud className="h-4 w-4" /> Upload Gambar
                </Button>
          
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hasil Analisis Foto</CardTitle>
            <CardDescription>
              Analisis berdasarkan foto yang diambil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Kondisi alert */}
            {!showAnalysis ? (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Status</AlertTitle>
                <AlertDescription>
                  {streaming
                    ? "Kamera aktif. Arahkan ke daun/area yang dicurigai untuk inspeksi visual."
                    : "Kamera belum aktif. Tekan Mulai Kamera untuk memulai."}
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Status</AlertTitle>
                  <AlertDescription>
                    Foto berhasil diambil. Berikut adalah analisis hama
                    berdasarkan gambar.
                  </AlertDescription>
                </Alert>

                <Separator />

                {/* Dummy analisis hanya muncul kalau showAnalysis true */}
                <div className="space-y-2">
                  {dummyAnalysis.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center border p-2 rounded-md"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Kemungkinan: {item.probability}% | Keparahan:{" "}
                          {item.severity}
                        </p>
                      </div>
                      <Badge
                        variant={
                          item.severity === "tinggi"
                            ? "destructive"
                            : item.severity === "sedang"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {item.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleBasedLayout>
  );
}
