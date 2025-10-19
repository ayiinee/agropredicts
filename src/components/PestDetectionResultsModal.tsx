import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  Share2,
  Info,
  MapPin,
  Calendar,
  Bug,
  TrendingUp,
} from "lucide-react";
import { PestDetectionResult } from "@/services/roboflowApi";
import { useNavigate } from "react-router-dom";

interface PestDetectionResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: PestDetectionResult[];
  error: string | null;
  onShareToGroups: () => void;
  onViewTreatment: () => void;
}

export default function PestDetectionResultsModal({
  isOpen,
  onClose,
  results,
  error,
  onShareToGroups,
  onViewTreatment,
}: PestDetectionResultsModalProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Map model labels to user-friendly Indonesian names
  const pestNameMap: Record<string, string> = {
    "brown planthopper": "Wereng Coklat",
    "brown-planthopper": "Wereng Coklat",
    brown_planthopper: "Wereng Coklat",
    armyworm: "Ulat Grayak",
    leafhopper: "Wereng",
    "rice stem borer": "Penggerek Batang Padi",
    "rice-stem-borer": "Penggerek Batang Padi",
    "stem borer": "Penggerek Batang Padi",
    whitefly: "Kutu Putih",
    aphid: "Aphid / Kutu Daun",
    mite: "Kutu Tungau",
  };

  const translatePestName = (name?: string) => {
    if (!name) return "Unknown";
    const key = name
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
    if (pestNameMap[key]) return pestNameMap[key];
    // Fallback: replace separators and capitalize words
    return name
      .toString()
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const topResult = results.length > 0 ? results[0] : null;
  const isCritical =
    topResult &&
    (topResult.severity === "tinggi" || topResult.probability >= 80);

  const navigate = useNavigate();

  const handleViewTreatmentClick = () => {
    if (topResult) {
      const translated = translatePestName(topResult.name);
      if (translated === "Wereng Coklat") {
        navigate("/treatment/wereng-coklat");
        return;
      }
    }

    onViewTreatment();
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "tinggi":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "sedang":
        return <TrendingUp className="h-4 w-4 text-yellow-600" />;
      case "rendah":
        return <Info className="h-4 w-4 text-green-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[325px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Hasil Deteksi Hama
          </DialogTitle>
          {/* <DialogDescription>
            Analisis berdasarkan foto yang diambil menggunakan AI
          </DialogDescription> */}
        </DialogHeader>

        <div className="space-y-4">
          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* No Results */}
          {!error && results.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Info className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">
                Tidak Ada Hama Terdeteksi
              </h3>
              <p className="text-sm">
                Coba ambil foto dengan pencahayaan yang lebih baik atau fokus
                pada area yang dicurigai.
              </p>
            </div>
          )}

          {/* Results Display */}
          {!error && results.length > 0 && (
            <>
              {/* Critical Alert */}
              {isCritical && (
                <Alert className="border-red-300 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800">
                    Peringatan Kritis!
                  </AlertTitle>
                  <AlertDescription className="text-red-700">
                    Hama dengan tingkat keparahan tinggi terdeteksi. Segera
                    ambil tindakan untuk mencegah penyebaran.
                  </AlertDescription>
                </Alert>
              )}

              {/* Top Detection Summary */}
              {topResult && (
                <div
                  className={`p-4 rounded-lg border ${
                    isCritical
                      ? "bg-red-50 border-red-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getSeverityIcon(topResult.severity)}
                      <div>
                        <h3 className="text-lg font-semibold">
                          {topResult.probability}%{" "}
                          {translatePestName(topResult.name)} terdeteksi
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Tingkat keparahan: {topResult.severity}
                        </p>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(topResult.severity)}>
                      {topResult.severity}
                    </Badge>
                  </div>

                  {topResult.boundingBox && (
                    <div className="text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Lokasi: ({Math.round(topResult.boundingBox.x)},{" "}
                        {Math.round(topResult.boundingBox.y)})
                      </div>
                      <div className="flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Ukuran: {Math.round(topResult.boundingBox.width)}×
                        {Math.round(topResult.boundingBox.height)} px
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={onShareToGroups}
                      className="flex-1 bg-[#31B57F] hover:bg-[#27A06F]"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Bagikan
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleViewTreatmentClick}
                      className="flex-1"
                    >
                      Cara Mengatasi
                    </Button>
                  </div>
                </div>
              )}

              <Separator />

              {/* Detailed Results
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Detail Deteksi</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    {showDetails ? "Sembunyikan" : "Tampilkan"} Detail
                  </Button>
                </div>

                {showDetails && (
                  <div className="space-y-2">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getSeverityIcon(result.severity)}
                            <span className="font-medium">{translatePestName(result.name)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">
                              {result.probability}%
                            </span>
                            <Badge className={getSeverityColor(result.severity)}>
                              {result.severity}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>ID Deteksi: {result.detectionId}</div>
                          <div>Class ID: {result.classId}</div>
                          {result.boundingBox && (
                            <div>
                              Lokasi: ({Math.round(result.boundingBox.x)}, {Math.round(result.boundingBox.y)}) | 
                              Ukuran: {Math.round(result.boundingBox.width)}×{Math.round(result.boundingBox.height)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div> */}

              {/* Action Buttons */}
              {/* <div className="flex gap-2 pt-4">
                <Button
                  onClick={onShareToGroups}
                  className="flex-1 bg-[#31B57F] hover:bg-[#27A06F]"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Bagikan ke Kelompok Tani
                </Button>
                <Button
                  variant="outline"
                  onClick={onViewTreatment}
                  className="flex-1"
                >
                  Lihat Cara Mengatasi
                </Button>
              </div> */}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
