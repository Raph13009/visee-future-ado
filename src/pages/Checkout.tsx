
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
  const totalPrice = includeMonthlyCoaching ? basePrice + monthlyCoachingPrice : basePrice;

  const handlePayment = async () => {
    if (!formData.name || !formData.email) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsProcessing(true);

    try {
      // Get test answers from localStorage
      const testAnswers = localStorage.getItem('testAnswers');
      const parsedAnswers = testAnswers ? JSON.parse(testAnswers) : {};

      // Store lead in Supabase
      const leadData = {
        name: formData.name,
        email: formData.email,
        current_filiere: formData.currentFiliere || "Non spécifié",
        key_answers: parsedAnswers
      };

      const { error } = await supabase
        .from('leads')
        .insert([leadData]);

      if (error) {
        console.error('Error storing lead:', error);
      } else {
        console.log('Lead stored successfully');
      }

      // Simulate payment processing delay
      setTimeout(() => {
        setIsProcessing(false);
        setShowPaymentSuccess(true);
      }, 2000);
    } catch (error) {
      console.error('Payment simulation error:', error);
      // Still show success for simulation purposes
      setTimeout(() => {
        setIsProcessing(false);
        setShowPaymentSuccess(true);
      }, 2000);
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
            isDisabled={isProcessing || !formData.name || !formData.email}
            onPayment={handlePayment}
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
