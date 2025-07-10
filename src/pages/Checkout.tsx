import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import Header from "@/components/Header";
import PaymentSuccessModal from "@/components/PaymentSuccessModal";
import CheckoutHero from "@/components/checkout/CheckoutHero";
import CheckoutTestimonial from "@/components/checkout/CheckoutTestimonial";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import PricingCard from "@/components/checkout/PricingCard";
import MonthlyCoachingUpsell from "@/components/checkout/MonthlyCoachingUpsell";
import CheckoutButton from "@/components/checkout/CheckoutButton";
import { supabase } from "@/integrations/supabase/client";
import CgvModal from "@/components/checkout/CgvModal";

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentFiliere: ""
  });
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [includeMonthlyCoaching, setIncludeMonthlyCoaching] = useState(false);
  const [acceptCgv, setAcceptCgv] = useState(false);
  const [showCgvModal, setShowCgvModal] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const basePrice = 18;
  const monthlyCoachingPrice = 49;
  // Total price should be 67€ when coaching is included (not 18 + 49)
  const totalPrice = includeMonthlyCoaching ? 67 : basePrice;

  // Check if form is valid - no longer required
  const isFormValid = true; // Always true since fields are not required

  useEffect(() => {
    // Si on a déjà un leadId, ne rien faire
    if (typeof window !== 'undefined' && !localStorage.getItem('leadId') && (formData.name || formData.email)) {
      // Récupère les réponses du test
      const testAnswers = localStorage.getItem('testAnswers');
      const parsedAnswers = testAnswers ? JSON.parse(testAnswers) : {};
      const leadData = {
        name: formData.name || "Non renseigné",
        email: formData.email || "Non renseigné",
        current_filiere: formData.currentFiliere || "Non spécifié",
        key_answers: parsedAnswers,
        include_monthly_coaching: includeMonthlyCoaching,
        total_price: 0,
        payment: null
      };
      supabase.from('leads').insert([leadData]).select('id').then(({ data, error }) => {
        if (data && data[0] && data[0].id) {
          localStorage.setItem('leadId', data[0].id);
        }
      });
    }
  }, [formData, includeMonthlyCoaching]);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Récupère l'id du lead
      const leadId = typeof window !== 'undefined' ? localStorage.getItem('leadId') : null;
      if (leadId) {
        // Met à jour la ligne avec payment et total_price
        const { error } = await supabase.from('leads').update({
          payment: 'paye',
          total_price: totalPrice
        }).eq('id', leadId);
        if (error) {
          alert('Erreur lors de la mise à jour du paiement : ' + error.message);
          console.error('Error updating lead:', error);
        }
      } else {
        // Fallback : si pas d'id, insère une nouvelle ligne (rare)
      const testAnswers = localStorage.getItem('testAnswers');
      const parsedAnswers = testAnswers ? JSON.parse(testAnswers) : {};
        const leadData = {
          name: formData.name || "Non renseigné",
          email: formData.email || "Non renseigné",
          current_filiere: formData.currentFiliere || "Non spécifié",
          key_answers: parsedAnswers,
          include_monthly_coaching: includeMonthlyCoaching,
          total_price: totalPrice,
          payment: 'paye'
        };
        await supabase.from('leads').insert([leadData]);
      }
    } catch (error) {
      console.error('Error storing lead data:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <Header />
      <CgvModal open={showCgvModal} onClose={() => setShowCgvModal(false)} />
      <div className="pt-20 pb-8 px-3 sm:px-4">
        <div className="container mx-auto max-w-lg">
          <CheckoutHero />

          {/* Trust Badge */}
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              <Shield className="w-3 h-3 mr-1" />
              Paiement 100% sécurisé
            </Badge>
          </div>

          <CheckoutTestimonial />
          
          <CheckoutForm 
            formData={formData}
            onInputChange={handleInputChange}
          />

          {/* CGV Checkbox */}
          <div className="flex items-center mb-4 mt-2">
            <input
              id="accept-cgv"
              type="checkbox"
              checked={acceptCgv}
              onChange={e => setAcceptCgv(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 focus:ring-primary mr-2"
              required
            />
            <label htmlFor="accept-cgv" className="text-sm text-gray-700 select-none">
              J'accepte les 
              <button
                type="button"
                className="underline text-primary ml-1 hover:text-primary/80"
                onClick={() => setShowCgvModal(true)}
              >
                conditions de vente
              </button>
              .
            </label>
          </div>

          <PricingCard totalPrice={totalPrice} />

          <MonthlyCoachingUpsell 
            includeMonthlyCoaching={includeMonthlyCoaching}
            onToggleCoaching={setIncludeMonthlyCoaching}
          />

          <CheckoutButton
            isProcessing={isProcessing}
            totalPrice={totalPrice}
            isDisabled={!acceptCgv}
            onPayment={handlePayment}
            includeMonthlyCoaching={includeMonthlyCoaching}
          />
        </div>
      </div>

      <PaymentSuccessModal 
        isOpen={showPaymentSuccess}
        onClose={() => setShowPaymentSuccess(false)}
      />
    </div>
  );
};

export default Checkout;
