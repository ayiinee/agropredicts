import React from "react";
import { useNavigate } from "react-router-dom";
import { RoleBasedLayout } from "@/components/RoleBasedLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const treatments = [
  {
    id: "penggerek-batang",
    title: "Penggerek Batang",
    severity: "tinggi",
    steps: [
      "Isolasi lahan yang terinfeksi",
      "Semprot dengan pestisida yang direkomendasikan (ikuti label)",
      "Buang bagian yang terinfeksi dan pantau selama 7 hari",
    ],
  },
  {
    id: "wereng-cokelat",
    title: "Wereng Cokelat",
    severity: "sedang",
    steps: [
      "Pasang perangkap kuning untuk monitoring",
      "Gunakan insektisida kontak jika populasi tinggi",
      "Pertimbangkan rotasi tanaman untuk mengurangi serangan",
    ],
  },
];

export default function Treatment() {
  const navigate = useNavigate();
  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Cara Penanganan Hama (Dummy)</h1>
          <p className="text-muted-foreground">
            Panduan singkat untuk menanggapi hama yang terdeteksi.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {treatments.map((t) => {
            const color =
              t.severity === "tinggi"
                ? "bg-red-50 border-red-300"
                : t.severity === "sedang"
                ? "bg-yellow-50 border-yellow-300"
                : "bg-white border-slate-200";
            return (
              <Card key={t.id} className={`${color}`}>
                <CardHeader>
                  <CardTitle>{t.title}</CardTitle>
                  <CardDescription>Prioritas: {t.severity}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2">
                    {t.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/treatment/${t.id}`)}
                    >
                      Lihat selengkapnya
                    </Button>
                    <Button onClick={() => navigate("/marketplace")}>
                      Beli obat di sini
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </RoleBasedLayout>
  );
}
