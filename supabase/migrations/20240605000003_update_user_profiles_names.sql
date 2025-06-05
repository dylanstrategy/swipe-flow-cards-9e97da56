
-- Update user_profiles table to use separate first_name and last_name
ALTER TABLE public.user_profiles 
ADD COLUMN first_name VARCHAR(255),
ADD COLUMN last_name VARCHAR(255);

-- Migrate existing name data (split on first space)
UPDATE public.user_profiles 
SET 
  first_name = SPLIT_PART(name, ' ', 1),
  last_name = CASE 
    WHEN POSITION(' ' IN name) > 0 
    THEN SUBSTRING(name FROM POSITION(' ' IN name) + 1)
    ELSE ''
  END
WHERE name IS NOT NULL;

-- Make first_name required after migration
ALTER TABLE public.user_profiles 
ALTER COLUMN first_name SET NOT NULL;

-- Drop the old name column
ALTER TABLE public.user_profiles 
DROP COLUMN name;

-- Update the trigger function to handle new structure
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'New'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'prospect')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
