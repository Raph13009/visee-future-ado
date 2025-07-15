// Types pour les nouvelles colonnes coaching dans la table leads

export interface CoachingData {
  coaching_objectives?: string;
  coaching_availability?: string;
  coaching_price?: number;
  coaching_type?: 'single' | 'monthly';
  coaching_status?: 'pending' | 'confirmed' | 'completed';
  coaching_session_date?: string;
}

export interface LeadWithCoaching {
  id: string;
  name: string;
  email: string;
  current_filiere: string;
  key_answers: any;
  payment?: string | null;
  include_monthly_coaching?: boolean;
  total_price?: number;
  created_at: string;
  updated_at: string;
  // Nouvelles colonnes coaching
  coaching_objectives?: string;
  coaching_availability?: string;
  coaching_price?: number;
  coaching_type?: 'single' | 'monthly';
  coaching_status?: 'pending' | 'confirmed' | 'completed';
  coaching_session_date?: string;
}

export const AvailabilityOptions = {
  weekend: 'Ce week-end',
  'monday-tuesday': 'Lundi ou mardi',
  'wednesday-thursday': 'Mercredi ou jeudi',
  other: 'Me proposer une autre dispo'
} as const;

export type AvailabilityOption = keyof typeof AvailabilityOptions; 