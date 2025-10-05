-- Create the user_role enum type
CREATE TYPE user_role AS ENUM ('farmer', 'distributor', 'cooperative');

-- Recreate the trigger function with the correct enum type
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'User'),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'farmer'::user_role)
  );
  RETURN NEW;
END;
$$;