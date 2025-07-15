import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface CoachingBookingProps {
  onBack: () => void;
  selectedPrice: 18 | 67 | null;
}

const CoachingBooking = ({ onBack, selectedPrice }: CoachingBookingProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    objectives: '',
    availability: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const availabilityOptions = [
    { id: 'weekend', label: 'Ce week-end', icon: '🌅' },
    { id: 'monday-tuesday', label: 'Lundi ou mardi', icon: '📅' },
    { id: 'wednesday-thursday', label: 'Mercredi ou jeudi', icon: '📋' },
    { id: 'other', label: 'Me proposer une autre dispo', icon: '💬' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvailabilitySelect = (availability: string) => {
    setFormData(prev => ({
      ...prev,
      availability
    }));
  };

  const handleSubmit = async () => {
    console.log('🚀 [COACHING] Début de handleSubmit');
    console.log('📝 [COACHING] FormData:', formData);
    console.log('💰 [COACHING] SelectedPrice:', selectedPrice);
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.availability) {
      console.log('❌ [COACHING] Champs manquants:', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        availability: formData.availability
      });
      alert('Merci de remplir tous les champs obligatoires');
      return;
    }

    if (!selectedPrice) {
      console.log('❌ [COACHING] Prix non sélectionné');
      alert('Erreur: Prix non sélectionné');
      return;
    }

    setIsLoading(true);
    console.log('⏳ [COACHING] Loading démarré');
    
    try {
      // Sauvegarder en base de données - test avec structure minimale
      const leadData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        key_answers: {
          type: 'coaching',
          coaching_objectives: formData.objectives.trim(),
          coaching_availability: formData.availability,
          coaching_price: selectedPrice,
          coaching_type: selectedPrice === 18 ? 'single' : 'monthly',
          coaching_status: 'pending',
          created_for: 'coaching_booking',
          filiere_info: `Coaching ${selectedPrice}€`
        } // Stocke TOUT dans key_answers, même l'info de filière
      };

      console.log('📊 [COACHING] LeadData à envoyer:', JSON.stringify(leadData, null, 2));
      console.log('🔗 [COACHING] Tentative d\'insertion dans Supabase...');
      console.log('🏗️ [COACHING] Colonnes utilisées: name, email, current_filiere, key_answers (structure de base uniquement)');
      
      // TEST: Essayons d'utiliser la table riasec_results qui fonctionne
      const riasecData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        dominant_profile: `COACHING_${selectedPrice}`,
        profile_name: `Coaching ${selectedPrice}€`,
        detailed_answers: {
          type: 'coaching',
          coaching_objectives: formData.objectives.trim(),
          coaching_availability: formData.availability,
          coaching_price: selectedPrice,
          coaching_type: selectedPrice === 18 ? 'single' : 'monthly',
          coaching_status: 'pending',
          created_for: 'coaching_booking'
        },
        total_price: selectedPrice * 100, // Prix en centimes
        payment: 'pending'
      };

      console.log('🧪 [COACHING] Test avec table riasec_results:', JSON.stringify(riasecData, null, 2));
      const { data, error } = await supabase.from('riasec_results').insert([riasecData]);
      
      console.log('📋 [COACHING] Réponse Supabase - Data:', data);
      console.log('📋 [COACHING] Réponse Supabase - Error:', error);
      
      if (error) {
        console.error('❌ [COACHING] Erreur lors de l\'enregistrement:', error);
        console.error('❌ [COACHING] Détails de l\'erreur:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        alert(`Erreur lors de l\'enregistrement: ${error.message}. Veuillez réessayer.`);
        return;
      }

      console.log('✅ [COACHING] Données insérées avec succès:', data);

      // Rediriger vers Stripe selon le prix
      const successUrl = encodeURIComponent(`${window.location.origin}/coaching-success`);
      const stripeUrl = selectedPrice === 18 
        ? `https://buy.stripe.com/9B6dRaevWbT3bDK0nY7IY00?success_url=${successUrl}`
        : `https://buy.stripe.com/3cI3cwdrS6yJazGc6G7IY01?success_url=${successUrl}`;
      
      console.log('🔗 [COACHING] URL de redirection Stripe:', stripeUrl);
      console.log('🚀 [COACHING] Redirection vers Stripe...');
      
      window.location.href = stripeUrl;
      
    } catch (error) {
      console.error('❌ [COACHING] Erreur générale:', error);
      console.error('❌ [COACHING] Stack trace:', error.stack);
      alert(`Une erreur est survenue: ${error.message || error}. Veuillez réessayer.`);
    } finally {
      console.log('🔄 [COACHING] Loading terminé');
      setIsLoading(false);
    }
  };

  const isFormValid = formData.name.trim() && formData.email.trim() && formData.availability;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          ← Retour
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📅</div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            Finalise ta réservation
          </h1>
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-bold text-lg">
            💳 {selectedPrice}€ • {selectedPrice === 18 ? 'Séance unique' : 'Suivi 1 mois'}
          </div>
        </div>

        {/* Form */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left column - Form */}
          <div className="space-y-6">
            {/* Prénom */}
            <div>
              <Label htmlFor="name" className="text-base font-semibold text-gray-700 mb-2 block">
                👤 Prénom *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="h-12 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500 text-base"
                placeholder="Ton prénom"
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-base font-semibold text-gray-700 mb-2 block">
                📧 Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="h-12 rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500 text-base"
                placeholder="ton.email@exemple.com"
                required
              />
            </div>

            {/* Objectifs */}
            <div>
              <Label htmlFor="objectives" className="text-base font-semibold text-gray-700 mb-2 block">
                💭 Quels sont tes objectifs ou questions ?
              </Label>
              <Textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                className="rounded-xl border-gray-200 focus:border-orange-500 focus:ring-orange-500 min-h-[120px] text-base"
                placeholder="Ex: Je ne sais pas quelle formation choisir après le bac, j'hésite entre plusieurs voies..."
              />
            </div>
          </div>

          {/* Right column - Availability & CTA */}
          <div className="space-y-6">
            {/* Disponibilités */}
            <div>
              <Label className="text-base font-semibold text-gray-700 mb-3 block">
                🗓️ Quand es-tu disponible ? *
              </Label>
              <div className="space-y-3">
                {availabilityOptions.map((option) => (
                  <Button
                    key={option.id}
                    type="button"
                    variant={formData.availability === option.id ? "default" : "outline"}
                    onClick={() => handleAvailabilitySelect(option.id)}
                    className={`w-full justify-start p-4 h-auto rounded-xl transition-all text-base ${
                      formData.availability === option.id 
                        ? 'bg-orange-500 text-white border-orange-500' 
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <span className="text-xl mr-3">{option.icon}</span>
                    <span>{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Info rassurante */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">✅</span>
                <div>
                  <p className="text-green-800 font-medium text-sm">
                    Tu recevras un email dans les 24h avec la confirmation
                  </p>
                </div>
              </div>
            </div>

            {/* Bouton de paiement */}
            <Button 
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-4 text-lg font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '...' : `💳 Payer ${selectedPrice}€`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachingBooking; 