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
      id: 100,
      type: "alert",
      title: "Wereng Cokelat Terdeteksi",
      message:
        "Wereng cokelat terdeteksi sekitar 250 m dari lahan Anda. Disarankan untuk memeriksa tanaman dan mengambil tindakan pencegahan.",
      field: "Lahan Anda",
      severity: "high",
      time: "Baru saja",
      timestamp: new Date(),
      isRead: false,
      action: "Lihat cara penanganan",
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
