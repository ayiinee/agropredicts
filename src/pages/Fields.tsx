import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
import AddFieldModal, { FieldData } from "@/components/AddFieldModal";
import EditFieldModal, { UpdateFieldData } from "@/components/EditFieldModal";
import FieldCardMenu from "@/components/FieldCardMenu";
import { calculateGrowthProgress } from "@/utils/growthCalculation";
import { SensorData } from "@/services/diseasePredictionApi";
import { fieldService, FieldWithFarm, CreateFieldData } from "@/services/fieldService";
import { useToast } from "@/hooks/use-toast";
export default function Fields() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<FieldWithFarm | null>(null);
  const [fields, setFields] = useState<FieldWithFarm[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock sensor data - in real app, this would come from API
  const mockSensorData: Record<string, SensorData> = {
    "device001": {
      temperature_C: 28.5,
      humidity_percent: 65,
      soil_moisture_percent: 55,
      temp_24h_mean: 27.8,
      humidity_24h_mean: 62,
      soil_moisture_24h_mean: 58,
      temp_change_6h: 0.5,
      soil_moisture_change_6h: -2,
      humidity_change_6h: 3,
      heat_soil_ratio: 0.52
    },
    "device002": {
      temperature_C: 26.2,
      humidity_percent: 70,
      soil_moisture_percent: 48,
      temp_24h_mean: 25.9,
      humidity_24h_mean: 68,
      soil_moisture_24h_mean: 52,
      temp_change_6h: -0.3,
      soil_moisture_change_6h: -4,
      humidity_change_6h: 2,
      heat_soil_ratio: 0.55
    }
  };

  // Load fields from database
  useEffect(() => {
    const loadFields = async () => {
      if (!profile?.id) return;
      
      try {
        setLoading(true);
        const farmerFields = await fieldService.getFieldsByFarmer(profile.id);
        setFields(farmerFields);
      } catch (error) {
        console.error("Error loading fields:", error);
        toast({
          title: "Error",
          description: "Failed to load fields. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadFields();
  }, [profile?.id, toast]);
  const handleViewDetails = (fieldId: string) => {
    navigate(`/field/${fieldId}`);
  };

  const handleAddField = async (fieldData: FieldData) => {
    if (!profile?.id) return;

    try {
      // Get or create a default farm for the farmer
      let farms = await fieldService.getFarmsByFarmer(profile.id);
      let farmId: string;

      if (farms.length === 0) {
        const defaultFarm = await fieldService.createDefaultFarm(profile.id);
        farmId = defaultFarm.id;
      } else {
        farmId = farms[0].id;
      }

      const createFieldData: CreateFieldData = {
        name: fieldData.name,
        cropType: fieldData.cropType,
        plantingDate: fieldData.plantingDate,
        deviceNumber: fieldData.deviceNumber,
        farmId: farmId,
      };

      const newField = await fieldService.createField(createFieldData);
      
      // Reload fields to get the updated list
      const updatedFields = await fieldService.getFieldsByFarmer(profile.id);
      setFields(updatedFields);

      toast({
        title: "Berhasil",
        description: "Lahan berhasil didaftarkan!",
      });
    } catch (error) {
      console.error("Error creating field:", error);
      toast({
        title: "Error",
        description: "Failed to create field. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditField = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      setSelectedField(field);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateField = async (fieldData: UpdateFieldData) => {
    if (!selectedField) return;

    try {
      await fieldService.updateField(selectedField.id, fieldData);
      
      // Reload fields to get the updated list
      const updatedFields = await fieldService.getFieldsByFarmer(profile?.id || "");
      setFields(updatedFields);

      toast({
        title: "Success",
        description: "Field updated successfully!",
      });
    } catch (error) {
      console.error("Error updating field:", error);
      toast({
        title: "Error",
        description: "Failed to update field. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    try {
      await fieldService.deleteField(fieldId);
      
      // Reload fields to get the updated list
      const updatedFields = await fieldService.getFieldsByFarmer(profile?.id || "");
      setFields(updatedFields);

      toast({
        title: "Success",
        description: "Field deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting field:", error);
      toast({
        title: "Error",
        description: "Failed to delete field. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getFieldGrowthData = (field: FieldWithFarm) => {
    // For now, use mock sensor data. In real app, this would come from sensor_data table
    const sensorData = mockSensorData["device001"]; // Default device
    const plantingDate = field.planting_date ? new Date(field.planting_date) : new Date();
    return calculateGrowthProgress(plantingDate, field.crop_type || "padi", sensorData);
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
        <div className="flex justify-end ">
          <Button 
            variant="outline" className="bg-[#31B57F] hover:bg-[#27A06F] text-white"
            onClick={() => setIsModalOpen(true)}
          >
            <Sprout className="h-4 w-4 mr-2" />
            Tambah Lahan Baru
          </Button>
        </div>

        {/* Fields Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className=" animate-spin rounded-full h-8 w-8 border-b-2 border-[#31B57F] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading fields...</p>
            </div>
          </div>
        ) : fields.length === 0 ? (
          <div className="text-center py-12">
            <Sprout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada lahan terdaftar</h3>
            <p className="text-gray-600 mb-4">Mulaillah dengan menambahkan lahan pertama Anda</p>
            {/* <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#31B57F] hover:bg-[#27A06F]"
            >
              <Sprout className="h-4 w-4 mr-2" />
              Add Your First Field
            </Button> */}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => {
              const growthData = getFieldGrowthData(field);
              // const areaText = field.area_hectares ? `${field.area_hectares} ha` : "Area not set";
              const alerts = 0; // TODO: Calculate alerts based on sensor data
              
              return (
                <div
                  key={field.id}
                  className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 card-hover space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="icon-container">
                          <Sprout className="h-4 w-4 text-[#31B57F]" />
                        </div>
                        <p className="font-semibold text-lg">{field.name}</p>
                      </div>
                      {/* <p className="text-sm text-gray-600 font-medium">
                        {areaText}
                      </p> */}
                      <p className="text-xs text-gray-500">
                        {field.crop_type?.charAt(0).toUpperCase() + field.crop_type?.slice(1)} • {growthData.daysSincePlanting} hari
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {alerts > 0 && (
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1">
                          {alerts} Alert
                        </Badge>
                      )}
                      <FieldCardMenu
                        fieldId={field.id}
                        fieldName={field.name}
                        onEdit={handleEditField}
                        onDelete={handleDeleteField}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">Pertumbuhan</span>
                      <span className="font-bold text-[#31B57F]">
                        {growthData.growthPercentage}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${growthData.growthPercentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-medium text-gray-600">Tahap</div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-800">
                          {growthData.growthStage}
                        </span>
                        <div className="group relative">
                          <Info className="h-3 w-3 text-gray-400 hover:text-gray-600 cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-normal max-w-xs z-10">
                            {growthData.stageDescription}
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
              );
            })}
          </div>
        )}

        {/* Add Field Modal */}
        <AddFieldModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddField}
        />

        {/* Edit Field Modal */}
        <EditFieldModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedField(null);
          }}
          onSubmit={handleUpdateField}
          field={selectedField}
        />
      </div>
    </RoleBasedLayout>
  );
}
