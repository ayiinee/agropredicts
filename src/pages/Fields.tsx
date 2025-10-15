import { useNavigate } from "react-router-dom";
import { RoleBasedLayout } from "@/components/RoleBasedLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sprout, TrendingUp, Calendar, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
export default function Fields() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  // Mock data - in real app, this would come from API
  const fields = [
    {
      id: 1,
      name: "Ladang A - Jagung",
      area: "520 m²",
      growth: 75,
      harvestDate: "2024-09-15",
      estimatedYield: "2,400 kg",
      alerts: 1,
    },
    {
      id: 2,
      name: "Ladang B - Padi",
      area: "380 m²",
      growth: 45,
      harvestDate: "2024-08-20",
      estimatedYield: "1,800 kg",
      alerts: 2,
    },
    {
      id: 3,
      name: "Ladang C - Padi",
      area: "410 m²",
      growth: 30,
      harvestDate: "2024-10-05",
      estimatedYield: "1,600 kg",
      alerts: 0,
    },
    {
      id: 1,
      name: "Field A - Corn",
      area: "520 m²",
      growth: 75,
      harvestDate: "2024-09-15",
      estimatedYield: "2,400 kg",
      alerts: 1,
      cropType: "corn",
      plantingDate: "2024-03-15",
    },
    {
      id: 2,
      name: "Field B - Wheat",
      area: "380 m²",
      growth: 45,
      harvestDate: "2024-08-20",
      estimatedYield: "1,800 kg",
      alerts: 2,
      cropType: "wheat",
      plantingDate: "2024-04-01",
    },
    {
      id: 3,
      name: "Field C - Soybeans",
      area: "410 m²",
      growth: 30,
      harvestDate: "2024-10-05",
      estimatedYield: "1,600 kg",
      alerts: 0,
      cropType: "soybeans",
      plantingDate: "2024-05-10",
    },
  ];
  const handleViewDetails = (fieldId: number) => {
    navigate(`/field/${fieldId}`);
  };

  const getGrowthStage = (growth: number) => {
    if (growth < 25) return "Vegetatif";
    if (growth < 60) return "Generatif";
    if (growth < 85) return "Pematangan";
    return "Senesens";
  };

  const getStageDescription = (growth: number) => {
    const stage = getGrowthStage(growth);
    switch (stage) {
      case "Vegetatif":
        return "Tanaman masih kecil, baru tumbuh daun dan batang";
      case "Generatif":
        return "Tanaman mulai berbunga dan berbuah";
      case "Pematangan":
        return "Buah atau biji sedang mengisi dan membesar";
      case "Senesens":
        return "Tanaman sudah tua, siap untuk dipanen";
      default:
        return "";
    }
  };
  return (
    <RoleBasedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Lahan Saya</h1>
            <p className="text-muted-foreground">
              Kelola dan pantau semua lahan pertanian Anda
            </p>
          </div>
        </div>

        {/* Add Field Button */}
        <div className="flex justify-end">
          <Button variant="outline">
            <Sprout className="h-4 w-4 mr-2" />
            Tambah Lahan Baru
          </Button>
        </div>

        {/* Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field) => (
            <div
              key={field.id}
              className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 card-hover space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="icon-container">
                      <Sprout className="h-4 w-4 text-[#31B57F]" />
                    </div>
                    <p className="font-semibold text-lg">{field.name}</p>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {field.area}
                  </p>
                </div>
                {field.alerts > 0 && (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1">
                    {field.alerts} Alert
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Pertumbuhan</span>
                  <span className="font-bold text-[#31B57F]">
                    {field.growth}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${field.growth}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="font-medium text-gray-600">Tahap</div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-800">
                      {getGrowthStage(field.growth)}
                    </span>
                    <div className="group relative">
                      <Info className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-normal max-w-xs z-10">
                        {getStageDescription(field.growth)}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-[#31B57F] hover:bg-[#27A06F] text-white"
                size="sm"
                onClick={() => handleViewDetails(field.id)}
              >
                Lihat Detail
              </Button>
            </div>
          ))}
        </div>
      </div>
    </RoleBasedLayout>
  );
}
