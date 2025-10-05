
import { RoleBasedLayout } from "@/components/RoleBasedLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const mockTrends = [
  { month: "Jan", harvest: 12000, value: 24000 },
  { month: "Feb", harvest: 15000, value: 30000 },
  { month: "Mar", harvest: 18000, value: 36000 },
  { month: "Apr", harvest: 16000, value: 32000 },
  { month: "May", harvest: 20000, value: 40000 },
  { month: "Jun", harvest: 22000, value: 44000 },
  { month: "Jul", harvest: 25000, value: 50000 },
  { month: "Aug", harvest: 23000, value: 46000 },
  { month: "Sep", harvest: 21000, value: 42000 },
  { month: "Oct", harvest: 24000, value: 48000 },
  { month: "Nov", harvest: 26000, value: 52000 },
  { month: "Dec", harvest: 28000, value: 56000 },
];

const CooperativeAnalytics = () => {
  return (
    <RoleBasedLayout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analitik Koperasi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-4">Prediksi Musiman & Tren</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockTrends.map(trend => (
              <div key={trend.month} className="border rounded-lg p-4">
                <p className="font-medium">{trend.month}</p>
                <p className="text-sm text-muted-foreground">Panen: {trend.harvest.toLocaleString()} kg</p>
                <p className="text-sm text-muted-foreground">Nilai: Rp {trend.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
          {/* You can add chart components here for more advanced analytics */}
        </CardContent>
      </Card>
    </RoleBasedLayout>
  );
};

export default CooperativeAnalytics;
