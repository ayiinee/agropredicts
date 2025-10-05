import { useEffect } from "react";
import { RoleBasedLayout } from "@/components/RoleBasedLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, ResponsiveContainer } from "recharts";

const salesBySeason = [
  { musim: "Hujan", penjualan: 420 },
  { musim: "Kemarau", penjualan: 310 },
];

const demandForecast = [
  { bulan: "Jan", aktual: 90 },
  { bulan: "Feb", aktual: 110 },
  { bulan: "Mar", aktual: 150 },
  { bulan: "Apr", aktual: 140 },
  { bulan: "Mei", aktual: 160 },
  { bulan: "Jun", aktual: 170, prakiraan: 180 },
  { bulan: "Jul", prakiraan: 200 },
  { bulan: "Agu", prakiraan: 210 },
];

const topLocations = [
  { kota: "Malang", penjualan: 220 },
  { kota: "Kediri", penjualan: 180 },
  { kota: "Blitar", penjualan: 160 },
  { kota: "Pasuruan", penjualan: 130 },
];

export default function Analytics() {
  useEffect(() => {
    document.title = "Analitik | AgroPredict";
    const meta = document.querySelector('meta[name="description"]') || document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute("content", "Analitik: tren penjualan per musim, prakiraan permintaan, lokasi teratas");
    document.head.appendChild(meta);
  }, []);

  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Analitik</h1>
          <p className="text-muted-foreground">Tren penjualan, prakiraan permintaan, dan lokasi teratas.</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tren Penjualan per Musim</CardTitle>
              <CardDescription>Perbandingan Hujan vs Kemarau</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ penjualan: { label: "Penjualan", color: "hsl(var(--primary))" } }}
                className="h-64 w-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesBySeason}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="musim" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="penjualan" fill="var(--color-penjualan)" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prakiraan Permintaan</CardTitle>
              <CardDescription>Per bulan (aktual vs prakiraan)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ aktual: { label: "Aktual", color: "hsl(var(--primary))" }, prakiraan: { label: "Prakiraan", color: "hsl(var(--muted-foreground))" } }}
                className="h-64 w-72"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={demandForecast}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bulan" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line type="monotone" dataKey="aktual" stroke="var(--color-aktual)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="prakiraan" stroke="var(--color-prakiraan)" strokeDasharray="4 4" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lokasi Teratas</CardTitle>
            <CardDescription>Wilayah dengan penjualan tertinggi</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ penjualan: { label: "Penjualan", color: "hsl(var(--primary))" } }}
              className="h-72 w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topLocations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="kota" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="penjualan" fill="var(--color-penjualan)" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </RoleBasedLayout>
  );
}
