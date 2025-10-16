import { useState, useEffect } from "react";

export interface Warning {
  id: number;
  type: "alert" | "warning" | "info";
  title: string;
  message: string;
  field: string;
  severity: "low" | "medium" | "high" | "critical";
  time: string;
  timestamp: Date;
  isRead: boolean;
  action?: string;
}

export const useWarnings = () => {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data untuk warnings
  const mockWarnings: Warning[] = [
    {
      id: 1,
      type: "alert",
      title: "Kelembaban Tanah Rendah",
      message:
        "Kelembaban tanah di Ladang Jagung telah turun di bawah 30%. Disarankan untuk melakukan penyiraman segera.",
      field: "Ladang Jagung",
      severity: "high",
      time: "2 jam yang lalu",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      action: "Lakukan penyiraman",
    },
    {
      id: 2,
      type: "warning",
      title: "Tingkat pH Tidak Optimal",
      message:
        "Tingkat pH tanah di Ladang Padi menunjukkan nilai 5.2, di bawah kisaran optimal 6.0-7.0.",
      field: "Ladang Padi",
      severity: "medium",
      time: "3 hari yang lalu",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isRead: false,
      action: "Tambahkan kapur pertanian",
    },
    {
      id: 3,
      type: "alert",
      title: "Prediksi Hama Ulat Grayak",
      message:
        "Berdasarkan kondisi cuaca dan data historis, kemungkinan serangan ulat grayak tinggi dalam 3-5 hari ke depan.",
      field: "Ladang Jagung",
      severity: "critical",
      time: "1 hari yang lalu",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isRead: true,
      action: "Siapkan pestisida organik",
    },
    {
      id: 4,
      type: "info",
      title: "Waktu Panen Optimal",
      message:
        "Ladang Tomat sudah mencapai tingkat kematangan optimal dan siap untuk dipanen.",
      field: "Ladang Tomat",
      severity: "low",
      time: "5 hari yang lalu",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      isRead: true,
      action: "Jadwalkan panen",
    },
    {
      id: 5,
      type: "warning",
      title: "Kekurangan Nutrisi",
      message:
        "Analisis daun menunjukkan kekurangan nitrogen pada tanaman di Ladang Cabai.",
      field: "Ladang Cabai",
      severity: "medium",
      time: "4 hari yang lalu",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      isRead: false,
      action: "Berikan pupuk nitrogen",
    },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setWarnings(mockWarnings);
      setLoading(false);
    }, 1000);
  }, []);

  const markAsRead = (id: number) => {
    setWarnings((prev) =>
      prev.map((warning) =>
        warning.id === id ? { ...warning, isRead: true } : warning
      )
    );
  };

  const markAllAsRead = () => {
    setWarnings((prev) =>
      prev.map((warning) => ({ ...warning, isRead: true }))
    );
  };

  const unreadCount = warnings.filter((w) => !w.isRead).length;
  const criticalCount = warnings.filter(
    (w) => w.severity === "critical" && !w.isRead
  ).length;

  return {
    warnings,
    loading,
    unreadCount,
    criticalCount,
    markAsRead,
    markAllAsRead,
  };
};

