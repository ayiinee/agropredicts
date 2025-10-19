import { useState } from "react";
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

interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fieldData: FieldData) => void;
}

export interface FieldData {
  name: string;
  cropType: string;
  plantingDate: Date;
  deviceNumber: string;
}

export default function AddFieldModal({ isOpen, onClose, onSubmit }: AddFieldModalProps) {
  const [formData, setFormData] = useState<FieldData>({
    name: "",
    cropType: "",
    plantingDate: new Date(),
    deviceNumber: "",
  });

  const [errors, setErrors] = useState<Partial<FieldData>>({});

  const cropTypes = [
    { value: "padi", label: "Padi" },
    { value: "jagung", label: "Jagung" },
    { value: "cabai", label: "Cabai" },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<FieldData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama ladang harus diisi";
    }

    if (!formData.cropType) {
      newErrors.cropType = "Jenis tanaman harus dipilih";
    }

    if (!formData.deviceNumber.trim()) {
      newErrors.deviceNumber = "Nomor alat harus diisi";
    }

    // if (formData.plantingDate > new Date()) {
    //   newErrors.plantingDate = "Tanggal tanam tidak boleh di masa depan";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        name: "",
        cropType: "",
        plantingDate: new Date(),
        deviceNumber: "",
      });
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
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Lahan Baru</DialogTitle>
          <DialogDescription>
            Isi informasi lahan pertanian Anda untuk memulai monitoring.
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
            {/* {errors.plantingDate && (
              <p className="text-sm text-red-500">{errors.plantingDate}</p>
            )} */}
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Batal
            </Button>
            <Button type="submit" className="bg-[#31B57F] hover:bg-[#27A06F]">
              Tambah Lahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
