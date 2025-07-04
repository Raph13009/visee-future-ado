import { useState } from "react";
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

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentFiliere: ""
  });
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [includeMonthlyCoaching, setIncludeMonthlyCoaching] = useState(false);

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

  const handlePayment = async () => {
    console.log('Starting payment process...', { formData, totalPrice, includeMonthlyCoaching });
    
    setIsProcessing(true);

    try {
      // Get test answers from localStorage
      const testAnswers = localStorage.getItem('testAnswers');
      const parsedAnswers = testAnswers ? JSON.parse(testAnswers) : {};

      // Store lead in Supabase before payment (only if data is provided)
      if (formData.name || formData.email) {
        const leadData = {
          name: formData.name || "Non renseigné",
          email: formData.email || "Non renseigné",
          current_filiere: formData.currentFiliere || "Non spécifié",
          key_answers: parsedAnswers,
          include_monthly_coaching: includeMonthlyCoaching,
          total_price: totalPrice,
          payment: "paye"
        };
        console.log('[SUPABASE] Inserting lead:', leadData);
        const { error, data } = await supabase
          .from('leads')
          .insert([leadData]);
        console.log('[SUPABASE] Insert result:', { error, data });
        if (error) {
          alert('Erreur lors de l’enregistrement dans la base : ' + error.message);
          console.error('Error storing lead:', error);
        } else {
          console.log('Lead stored successfully', data);
        }
      }

      // The actual payment will be handled by the CheckoutButton component
      // which will redirect to Stripe
    } catch (error) {
      console.error('Error storing lead data:', error);
      // Continue with payment even if lead storage fails
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <Header />
      
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

          <PricingCard totalPrice={totalPrice} />

          <MonthlyCoachingUpsell 
            includeMonthlyCoaching={includeMonthlyCoaching}
            onToggleCoaching={setIncludeMonthlyCoaching}
          />

          <CheckoutButton
            isProcessing={isProcessing}
            totalPrice={totalPrice}
            isDisabled={false}
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
