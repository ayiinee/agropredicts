-- Add missing RLS policies for cooperatives
CREATE POLICY "Cooperative admins can manage their cooperatives" ON public.cooperatives
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = cooperatives.admin_id 
      AND profiles.user_id = auth.uid()
      AND profiles.role = 'cooperative'
    )
  );

CREATE POLICY "Users can view cooperatives" ON public.cooperatives
  FOR SELECT USING (true);

-- Add missing RLS policies for farmer_groups
CREATE POLICY "Group admins can manage their groups" ON public.farmer_groups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = farmer_groups.admin_id 
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view farmer groups" ON public.farmer_groups
  FOR SELECT USING (true);

-- Add missing RLS policies for crop_recommendations
CREATE POLICY "Farmers can view their crop recommendations" ON public.crop_recommendations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = crop_recommendations.farmer_id 
      AND profiles.user_id = auth.uid()
      AND profiles.role = 'farmer'
    )
  );

CREATE POLICY "System can insert crop recommendations" ON public.crop_recommendations
  FOR INSERT WITH CHECK (true);

-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;