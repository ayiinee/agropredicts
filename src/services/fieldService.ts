import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Field = Tables<"fields">;
export type FieldInsert = TablesInsert<"fields">;
export type FieldUpdate = TablesUpdate<"fields">;

export interface FieldWithFarm extends Field {
  farm: {
    id: string;
    name: string;
    location: string;
  };
}

export interface CreateFieldData {
  name: string;
  cropType: string;
  plantingDate: Date;
  deviceNumber: string;
  area?: number;
  farmId: string;
}

export interface UpdateFieldData {
  name?: string;
  cropType?: string;
  plantingDate?: Date;
  deviceNumber?: string;
  area?: number;
}

export class FieldService {
  /**
   * Get all fields for a specific farm
   */
  async getFieldsByFarm(farmId: string): Promise<FieldWithFarm[]> {
    try {
      const { data, error } = await supabase
        .from("fields")
        .select(`
          *,
          farm: farms(id, name, location)
        `)
        .eq("farm_id", farmId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch fields: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching fields:", error);
      throw error;
    }
  }

  /**
   * Get all fields for a farmer (across all their farms)
   */
  async getFieldsByFarmer(farmerId: string): Promise<FieldWithFarm[]> {
    try {
      const { data, error } = await supabase
        .from("fields")
        .select(`
          *,
          farm: farms(id, name, location)
        `)
        .eq("farm.farmer_id", farmerId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch fields: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching fields:", error);
      throw error;
    }
  }

  /**
   * Get a single field by ID
   */
  async getFieldById(fieldId: string): Promise<FieldWithFarm | null> {
    try {
      const { data, error } = await supabase
        .from("fields")
        .select(`
          *,
          farm: farms(id, name, location)
        `)
        .eq("id", fieldId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Field not found
        }
        throw new Error(`Failed to fetch field: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Error fetching field:", error);
      throw error;
    }
  }

  /**
   * Create a new field
   */
  async createField(fieldData: CreateFieldData): Promise<Field> {
    try {
      const { data, error } = await supabase
        .from("fields")
        .insert({
          name: fieldData.name,
          crop_type: fieldData.cropType,
          planting_date: fieldData.plantingDate.toISOString(),
          farm_id: fieldData.farmId,
          area_hectares: fieldData.area || null,
          growth_percentage: 0,
          harvest_estimate_kg: null,
          expected_harvest_date: null,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create field: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Error creating field:", error);
      throw error;
    }
  }

  /**
   * Update a field
   */
  async updateField(fieldId: string, fieldData: UpdateFieldData): Promise<Field> {
    try {
      const updateData: FieldUpdate = {};
      
      if (fieldData.name !== undefined) updateData.name = fieldData.name;
      if (fieldData.cropType !== undefined) updateData.crop_type = fieldData.cropType;
      if (fieldData.plantingDate !== undefined) updateData.planting_date = fieldData.plantingDate.toISOString();
      if (fieldData.area !== undefined) updateData.area_hectares = fieldData.area;

      const { data, error } = await supabase
        .from("fields")
        .update(updateData)
        .eq("id", fieldId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update field: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Error updating field:", error);
      throw error;
    }
  }

  /**
   * Delete a field
   */
  async deleteField(fieldId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("fields")
        .delete()
        .eq("id", fieldId);

      if (error) {
        throw new Error(`Failed to delete field: ${error.message}`);
      }
    } catch (error) {
      console.error("Error deleting field:", error);
      throw error;
    }
  }

  /**
   * Update field growth percentage
   */
  async updateFieldGrowth(fieldId: string, growthPercentage: number): Promise<void> {
    try {
      const { error } = await supabase
        .from("fields")
        .update({ growth_percentage: growthPercentage })
        .eq("id", fieldId);

      if (error) {
        throw new Error(`Failed to update field growth: ${error.message}`);
      }
    } catch (error) {
      console.error("Error updating field growth:", error);
      throw error;
    }
  }

  /**
   * Get farms for a farmer
   */
  async getFarmsByFarmer(farmerId: string): Promise<Tables<"farms">[]> {
    try {
      const { data, error } = await supabase
        .from("farms")
        .select("*")
        .eq("farmer_id", farmerId)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch farms: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching farms:", error);
      throw error;
    }
  }

  /**
   * Create a default farm if none exists
   */
  async createDefaultFarm(farmerId: string, location: string = "Default Location"): Promise<Tables<"farms">> {
    try {
      const { data, error } = await supabase
        .from("farms")
        .insert({
          name: "Ladang Utama",
          location: location,
          farmer_id: farmerId,
          area_hectares: null,
          soil_type: null,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create default farm: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Error creating default farm:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const fieldService = new FieldService();
