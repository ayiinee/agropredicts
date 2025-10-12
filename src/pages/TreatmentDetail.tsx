import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RoleBasedLayout } from "@/components/RoleBasedLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const details: Record<
  string,
  { title: string; severity: string; content: string[] }
> = {
  "penggerek-batang": {
    title: "Penggerek Batang",
    severity: "tinggi",
    content: [
      "Identifikasi gejala awal: lubang pada batang dan tanaman layu.",
      "Gunakan pestisida selektif yang disarankan dan ikuti label pemakaian.",
      "Pantau setiap 3 hari setelah aplikasi.",
    ],
  },
  "wereng-cokelat": {
    title: "Wereng Cokelat",
    severity: "sedang",
    content: [
      "Pasang perangkap kuning untuk monitoring populasi.",
      "Pertimbangkan tindakan kimia jika ambang ekonomi terlampaui.",
    ],
  },
};

export default function TreatmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const info = id ? details[id] : undefined;

  if (!info) {
    return (
      <RoleBasedLayout>
        <div className="p-6">Data panduan tidak ditemukan.</div>
      </RoleBasedLayout>
    );
  }

  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{info.title}</CardTitle>
            <CardDescription>Prioritas: {info.severity}</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              {info.content.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ol>
            <div className="mt-4">
              <Button onClick={() => navigate("/marketplace")}>
                Beli obat di sini
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleBasedLayout>
  );
}
