-- Ajouter la colonne type à la table riasec_results
ALTER TABLE public.riasec_results 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'general';

-- Mettre à jour les lignes existantes qui viennent de l'orientation scolaire
UPDATE public.riasec_results 
SET type = 'scolaire' 
WHERE detailed_answers::jsonb @> '{"type": "orientation_scolaire"}'::jsonb
   OR dominant_profile = 'ORIENTATION_SCOLAIRE';

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN public.riasec_results.type IS 'Type de bilan: scolaire, reconversion, public, ou general';

-- Créer un index pour améliorer les performances des requêtes filtrées par type
CREATE INDEX IF NOT EXISTS idx_riasec_results_type ON public.riasec_results(type);

