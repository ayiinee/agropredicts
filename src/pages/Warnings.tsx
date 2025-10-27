import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoleBasedLayout } from "@/components/RoleBasedLayout";
import { useWarnings } from "@/hooks/useWarnings";
import { Clock, MapPin, AlertTriangle, Info, OctagonAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Warnings() {
  const { warnings, loading, markAsRead } = useWarnings();
  const navigate = useNavigate();
  const sorted = [...warnings].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  if (loading) {
    return (
      <RoleBasedLayout>
        <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg font-medium">Memuat peringatan...</p>
        </div>
      </div>
      </RoleBasedLayout>
    );
  }

  return (
    <RoleBasedLayout>
      <div className="space-y-">
        <h1 className="text-2xl font-bold">Peringatan Terbaru</h1>
        <Card className="unified-card">
          <CardContent>
            {sorted.length === 0 ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <p className="text-sm text-muted-foreground text-center">
                  Tidak ada peringatan.
                </p>
              </div>
            ) : (
              <ul className="divide-y">
                {sorted.map((w) => (
                  <li
                    key={w.id}
                    className={`py-3 flex items-start justify-between gap-4 ${
                      !w.isRead ? "bg-orange-50/60" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 p-1.5 rounded-md ${
                          w.type === "info"
                            ? "bg-blue-100 text-blue-600"
                            : w.severity === "critical" || w.severity === "high"
                            ? "bg-red-100 text-red-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {w.type === "info" ? (
                          <Info className="h-4 w-4" />
                        ) : w.severity === "critical" ||
                          w.severity === "high" ? (
                          <OctagonAlert className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${
                              !w.isRead ? "font-semibold" : ""
                            }`}
                          >
                            {w.title}
                          </span>
                          {/* Removed 'Belum dibaca' tag per request */}
                          {/* severity text badges removed */}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {w.message}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {w.field}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {w.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          markAsRead(w.id);
                          navigate("/groups");
                        }}
                      >
                        Detail
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleBasedLayout>
  );
}
