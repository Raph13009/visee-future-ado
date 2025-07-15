-- Add coaching columns to leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS payment TEXT,
ADD COLUMN IF NOT EXISTS include_monthly_coaching BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS total_price INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS coaching_objectives TEXT,
ADD COLUMN IF NOT EXISTS coaching_availability TEXT,
ADD COLUMN IF NOT EXISTS coaching_price INTEGER,
ADD COLUMN IF NOT EXISTS coaching_type TEXT CHECK (coaching_type IN ('single', 'monthly')),
ADD COLUMN IF NOT EXISTS coaching_status TEXT CHECK (coaching_status IN ('pending', 'confirmed', 'completed')),
ADD COLUMN IF NOT EXISTS coaching_session_date TIMESTAMP WITH TIME ZONE; 