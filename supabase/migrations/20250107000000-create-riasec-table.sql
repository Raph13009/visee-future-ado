-- Create a table for storing RIASEC test results
CREATE TABLE public.riasec_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT,
  r_score INTEGER DEFAULT 0, -- Score Réaliste
  i_score INTEGER DEFAULT 0, -- Score Investigateur  
  a_score INTEGER DEFAULT 0, -- Score Artistique
  s_score INTEGER DEFAULT 0, -- Score Social
  e_score INTEGER DEFAULT 0, -- Score Entreprenant
  c_score INTEGER DEFAULT 0, -- Score Conventionnel
  dominant_profile TEXT NOT NULL, -- Ex: "RI", "AS", "EC"
  profile_name TEXT NOT NULL, -- Ex: "Le Pratique Curieux"
  detailed_answers JSONB, -- Toutes les réponses détaillées
  payment TEXT, -- null ou "paye"
  total_price INTEGER DEFAULT 0,
  include_monthly_coaching BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.riasec_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can create riasec_results" 
  ON public.riasec_results 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can view riasec_results" 
  ON public.riasec_results 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can update riasec_results"
  ON public.riasec_results
  FOR UPDATE
  USING (true); 