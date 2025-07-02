
-- Create a table for storing leads from the orientation test
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  current_filiere TEXT NOT NULL,
  key_answers JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) but make it permissive for this use case
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert leads (public form)
CREATE POLICY "Anyone can create leads" 
  ON public.leads 
  FOR INSERT 
  WITH CHECK (true);

-- Create a policy for reading leads (you can restrict this later)
CREATE POLICY "Anyone can view leads" 
  ON public.leads 
  FOR SELECT 
  USING (true);
