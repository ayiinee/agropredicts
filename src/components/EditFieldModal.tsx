import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Field } from "@/services/fieldService";

interface EditFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fieldData: UpdateFieldData) => void;
  field: Field | null;
}

export interface UpdateFieldData {
  name: string;
  cropType: string;
  plantingDate: Date;
  deviceNumber: string;
  area?: number;
}

export default function EditFieldModal({ isOpen, onClose, onSubmit, field }: EditFieldModalProps) {
  const [formData, setFormData] = useState<UpdateFieldData>({
    name: "",
    cropType: "",
    plantingDate: new Date(),
    deviceNumber: "",
    area: 0,
  });

  const [errors, setErrors] = useState<Partial<UpdateFieldData>>({});

  const cropTypes = [
    { value: "padi", label: "Padi" },
    { value: "jagung", label: "Jagung" },
    { value: "cabai", label: "Cabai" },
  ];

  // Populate form when field data is available
  useEffect(() => {
    if (field) {
      setFormData({
        name: field.name,
        cropType: field.crop_type || "",
        plantingDate: field.planting_date ? new Date(field.planting_date) : new Date(),
        deviceNumber: "", // Device number is not stored in the database yet
        area: field.area_hectares || 0,
      });
    }
  }, [field]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UpdateFieldData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama ladang harus diisi";
    }

    if (!formData.cropType) {
      newErrors.cropType = "Jenis tanaman harus dipilih";
    }

    if (!formData.deviceNumber.trim()) {
      newErrors.deviceNumber = "Nomor alat harus diisi";
    }

    if (formData.plantingDate > new Date()) {
      newErrors.plantingDate = "Tanggal tanam tidak boleh di masa depan";
    }

    if (formData.area !== undefined && formData.area < 0) {
      newErrors.area = "Luas lahan tidak boleh negatif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      cropType: "",
      plantingDate: new Date(),
      deviceNumber: "",
      area: 0,
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Lahan</DialogTitle>
          <DialogDescription>
            Ubah informasi lahan pertanian Anda.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fieldName">Nama Ladang</Label>
            <Input
              id="fieldName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masukkan nama ladang"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cropType">Jenis Tanaman</Label>
            <Select
              value={formData.cropType}
              onValueChange={(value) => setFormData({ ...formData, cropType: value })}
            >
              <SelectTrigger className={errors.cropType ? "border-red-500" : ""}>
                <SelectValue placeholder="Pilih jenis tanaman" />
              </SelectTrigger>
              <SelectContent>
                {cropTypes.map((crop) => (
                  <SelectItem key={crop.value} value={crop.value}>
                    {crop.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.cropType && (
              <p className="text-sm text-red-500">{errors.cropType}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tanggal Tanam</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.plantingDate && "text-muted-foreground",
                    errors.plantingDate && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.plantingDate ? (
                    format(formData.plantingDate, "dd/MM/yyyy")
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.plantingDate}
                  onSelect={(date) => 
                    setFormData({ ...formData, plantingDate: date || new Date() })
                  }
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.plantingDate && (
              <p className="text-sm text-red-500">{errors.plantingDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deviceNumber">Nomor Alat</Label>
            <Input
              id="deviceNumber"
              value={formData.deviceNumber}
              onChange={(e) => setFormData({ ...formData, deviceNumber: e.target.value })}
              placeholder="Masukkan nomor alat sensor"
              className={errors.deviceNumber ? "border-red-500" : ""}
            />
            {errors.deviceNumber && (
              <p className="text-sm text-red-500">{errors.deviceNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Luas Lahan (hektar)</Label>
            <Input
              id="area"
              type="number"
              step="0.1"
              min="0"
              value={formData.area || ""}
              onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) || 0 })}
              placeholder="Masukkan luas lahan"
              className={errors.area ? "border-red-500" : ""}
            />
            {errors.area && (
              <p className="text-sm text-red-500">{errors.area}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Batal
            </Button>
            <Button type="submit" className="bg-[#31B57F] hover:bg-[#27A06F]">
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
