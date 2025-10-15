import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  AlertTriangle,
} from "lucide-react";
import { detectPest, PestDetectionResult } from "@/services/roboflowApi";

export default function PestDetection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Keep a ref to the active MediaStream so we can stop it reliably
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  // overlay analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const analysisTimerRef = useRef<number | null>(null);
  // API analysis results
  const [analysisResults, setAnalysisResults] = useState<PestDetectionResult[]>([]);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Ref untuk input file
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Handler untuk upload gambar
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCapturedImage(ev.target?.result as string);
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
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    setAnalysisResults([]);
    setAnalysisError(null);
    if (analysisTimerRef.current) {
      window.clearInterval(analysisTimerRef.current);
      analysisTimerRef.current = null;
    }
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

  // Auto-start analysis when image is captured
  useEffect(() => {
    if (capturedImage && !isAnalyzing && !showAnalysis) {
      console.log('Image captured, starting analysis automatically');
      startOverlayAnalysis();
    }
  }, [capturedImage, isAnalyzing, showAnalysis]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      // store stream in ref so other functions can stop it
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        // assign stream and play
        videoRef.current.srcObject = stream;
        // ensure any previous playback is reset
        try {
          await videoRef.current.play();
        } catch (err) {
          // play can fail if not in user gesture; still treat as streaming available
          console.warn("video play() failed", err);
        }
        setStreaming(true);
      }
    } catch (e) {
      console.error("Camera access denied or unavailable", e);
      setStreaming(false);
    }
  };

  const stopCamera = () => {
    // Prefer stopping the stored stream. This handles the case where the
    // video element may have been removed from the DOM but the tracks still run.
    const stream =
      mediaStreamRef.current ??
      (videoRef.current?.srcObject as MediaStream | null);
    if (stream) {
      try {
        stream.getTracks().forEach((t) => {
          try {
            t.stop();
          } catch (err) {
            console.warn("Failed to stop track", err);
          }
        });
      } catch (err) {
        console.warn("Error while stopping media stream", err);
      }
    }

    // Clear refs and video element
    mediaStreamRef.current = null;
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch (err) {
        // ignore
      }
      try {
        // detach stream from video element
        videoRef.current.srcObject = null;
      } catch (err) {
        console.warn("Failed to clear video srcObject", err);
      }
    }
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
        // Stop camera right after capturing
        stopCamera();
      }
    }
  };

  const startOverlayAnalysis = async () => {
    if (!capturedImage) return;
    
    setShowAnalysis(false);
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisError(null);
    
    // Simulate progress updates while API call is in progress
    let progress = 0;
    setAnalysisProgress(0);
    const progressInterval = setInterval(() => {
      progress += 2; // increase by 2% every 100ms (adjust as needed)
      if (progress >= 90) {
        progress = 90;
        setAnalysisProgress(progress);
        clearInterval(progressInterval);
      } else {
        setAnalysisProgress(progress);
      }
    }, 100);

    try {
      // Call the Roboflow API
      console.log('Starting API call with image:', capturedImage ? 'Image present' : 'No image');
      const results = await detectPest(capturedImage);
      
      // Debug: Log results in component
      console.log('Analysis Results in Component:', results);
      console.log('Results length:', results.length);
      
      // Clear progress interval
      // clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      // Set results and show analysis
      setAnalysisResults(results);
      setIsAnalyzing(false);
      setShowAnalysis(true);
      
      console.log('Analysis completed, showAnalysis set to true');
      
    } catch (error) {
      // Clear progress interval
      // clearInterval(progressInterval);
      
      // Handle error
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze image';
      console.error('Pest detection error:', error);
      console.log('Setting error message:', errorMessage);
      
      setAnalysisError(errorMessage);
      setIsAnalyzing(false);
      setShowAnalysis(true);
      
      console.log('Error handled, showAnalysis set to true');
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
                {/* Show camera-inactive instruction centered over the media area when camera is off */}
                {!streaming && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md shadow text-center w-3/4 max-w-sm">
                      <div className="text-sm font-semibold">
                        Kamera belum aktif
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        Tekan "Mulai Kamera" untuk menyalakan kamera dan ambil
                        foto
                      </div>
                      <div>
                        <Button size="sm" onClick={startCamera}>
                          <Camera className="h-4 w-4" /> Mulai Kamera
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
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

                {/* Overlay during analysis when capturing from camera */}
                {isAnalyzing && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 text-white rounded-md p-4 w-3/4 max-w-sm text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="text-lg font-semibold">
                          Analisis Gambar
                        </div>
                        <div className="w-full bg-white bg-opacity-20 h-2 rounded overflow-hidden">
                          <div
                            className="h-full bg-white transition-all"
                            style={{ width: `${analysisProgress}%` }}
                          />
                        </div>
                        <div className="text-xs opacity-80">
                          {analysisProgress}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden relative">
                <img
                  src={capturedImage}
                  alt="Hasil Foto"
                  className="w-full h-full object-cover"
                />

                {/* Overlay during analysis when using uploaded or captured image */}
                {isAnalyzing && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 text-white rounded-md p-4 w-3/4 max-w-sm text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="text-lg font-semibold">
                          Analisis Gambar
                        </div>
                        <div className="w-full bg-white bg-opacity-20 h-2 rounded overflow-hidden">
                          <div
                            className="h-full bg-white transition-all"
                            style={{ width: `${analysisProgress}%` }}
                          />
                        </div>
                        <div className="text-xs opacity-80">
                          {analysisProgress}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex flex-row gap-2 items-center">
              <div className="flex gap-2">
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

        {showAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle>Hasil Analisis Foto</CardTitle>
              <CardDescription>
                Analisis berdasarkan foto yang diambil menggunakan AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">

              {/* Error display */}
              {analysisError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{analysisError}</AlertDescription>
                </Alert>
              )}

              {/* Results display */}
              {analysisResults.length > 0 ? (
                <>
                  {/* Summary + action buttons */}
                  <div className="mb-3">
                    {(() => {
                      const top = analysisResults[0]; // Already sorted by confidence
                      const isCritical =
                        top.severity === "tinggi" || top.probability >= 80;
                      return (
                        <div
                          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-md border ${
                            isCritical
                              ? "bg-red-50 border-red-300 text-red-800"
                              : "bg-white border-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {isCritical && (
                              <AlertTriangle className="h-6 w-6 text-red-600 animate-pulse" />
                            )}
                            <div>
                              <div className="text-sm text-muted-foreground">
                                Deteksi teratas
                              </div>
                              <div className="text-lg font-semibold">
                                {top.probability}% {top.name} terdeteksi
                              </div>
                              {isCritical ? (
                                <div className="text-sm font-medium">
                                  Segera ambil tindakan untuk mencegah penyebaran.
                                </div>
                              ) : (
                                <div className="text-xs text-muted-foreground">
                                  Periksa rincian hasil dan bagikan ke kelompok tani
                                  jika perlu.
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={async () => {
                                const shareText = `${top.probability}% ${top.name} terdeteksi pada tanaman. Lihat di AgroPredict.`;
                                if ((navigator as any).share) {
                                  try {
                                    await (navigator as any).share({
                                      title: "Peringatan Hama",
                                      text: shareText,
                                      url: window.location.href,
                                    });
                                    return;
                                  } catch (err) {
                                    console.warn("Share failed", err);
                                  }
                                }
                                navigate("/groups");
                              }}
                            >
                              Bagikan ke Kelompok
                            </Button>

                            <Button onClick={() => navigate("/treatment")}>
                              Cara Mengatasi
                            </Button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Detailed results */}
                  <div className="space-y-2">
                    {analysisResults.map((item, idx) => (
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
                          {item.boundingBox && (
                            <p className="text-xs text-muted-foreground">
                              Lokasi: ({Math.round(item.boundingBox.x)}, {Math.round(item.boundingBox.y)}) | 
                              Ukuran: {Math.round(item.boundingBox.width)}×{Math.round(item.boundingBox.height)}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            ID Deteksi: {item.detectionId} | Class ID: {item.classId}
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
              ) : !analysisError && (
                <div className="text-center py-8 text-muted-foreground">
                  <Info className="h-8 w-8 mx-auto mb-2" />
                  <p>Tidak ada hama terdeteksi dalam gambar ini.</p>
                  <p className="text-sm">Coba ambil foto dengan pencahayaan yang lebih baik atau fokus pada area yang dicurigai.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </RoleBasedLayout>
  );
}
