-- Update RLS policies to be user-specific for authenticated users
DROP POLICY IF EXISTS "Anyone can view time entries" ON public.time_entries;
DROP POLICY IF EXISTS "Anyone can create time entries" ON public.time_entries;
DROP POLICY IF EXISTS "Anyone can update time entries" ON public.time_entries;
DROP POLICY IF EXISTS "Anyone can delete time entries" ON public.time_entries;

-- Create user-specific policies
CREATE POLICY "Users can view their own time entries" 
ON public.time_entries 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own time entries" 
ON public.time_entries 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own time entries" 
ON public.time_entries 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own time entries" 
ON public.time_entries 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);