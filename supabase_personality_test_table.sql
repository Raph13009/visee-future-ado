-- Table pour stocker les résultats des tests de personnalité
CREATE TABLE IF NOT EXISTS personality_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Informations utilisateur
  name TEXT,
  email TEXT,
  gender TEXT, -- 'male' or 'female'
  
  -- Scores des 6 traits de personnalité (0-100)
  precision_organization_score INTEGER,
  empathy_altruism_score INTEGER,
  creativity_expression_score INTEGER,
  logic_reflection_score INTEGER,
  leadership_confidence_score INTEGER,
  harmony_cooperation_score INTEGER,
  
  -- Réponses détaillées (JSONB pour stocker toutes les réponses)
  detailed_answers JSONB,
  
  -- Statut de paiement (pour génération PDF plus tard)
  payment TEXT DEFAULT NULL, -- 'pending', 'completed', 'failed', NULL
  total_price INTEGER DEFAULT 0, -- Prix en centimes
  
  -- Type de test (pour évolutions futures)
  test_type TEXT DEFAULT 'personality',
  
  -- Métadonnées
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_personality_test_results_email ON personality_test_results(email);
CREATE INDEX IF NOT EXISTS idx_personality_test_results_created_at ON personality_test_results(created_at);
CREATE INDEX IF NOT EXISTS idx_personality_test_results_payment ON personality_test_results(payment);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_personality_test_results_updated_at 
  BEFORE UPDATE ON personality_test_results 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Optionnel, à activer si nécessaire
-- ALTER TABLE personality_test_results ENABLE ROW LEVEL SECURITY;

-- Policy pour permettre l'insertion (à ajuster selon vos besoins de sécurité)
-- CREATE POLICY "Allow insert for authenticated users" ON personality_test_results
--   FOR INSERT
--   WITH CHECK (true);

-- Policy pour permettre la lecture (à ajuster selon vos besoins)
-- CREATE POLICY "Allow read for authenticated users" ON personality_test_results
--   FOR SELECT
--   USING (true);

COMMENT ON TABLE personality_test_results IS 'Stocks les résultats des tests de personnalité avec les scores des 6 traits';
COMMENT ON COLUMN personality_test_results.precision_organization_score IS 'Score pour le trait Precision & Organization (0-100)';
COMMENT ON COLUMN personality_test_results.empathy_altruism_score IS 'Score pour le trait Empathy & Altruism (0-100)';
COMMENT ON COLUMN personality_test_results.creativity_expression_score IS 'Score pour le trait Creativity & Expression (0-100)';
COMMENT ON COLUMN personality_test_results.logic_reflection_score IS 'Score pour le trait Logic & Reflection (0-100)';
COMMENT ON COLUMN personality_test_results.leadership_confidence_score IS 'Score pour le trait Leadership & Confidence (0-100)';
COMMENT ON COLUMN personality_test_results.harmony_cooperation_score IS 'Score pour le trait Harmony & Cooperation (0-100)';
COMMENT ON COLUMN personality_test_results.detailed_answers IS 'Réponses détaillées au format JSONB: { step1: { Q1: 4, Q2: 5, ... }, step2: { Q6: 3, ... } }';

