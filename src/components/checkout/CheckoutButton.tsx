import { Button } from "@/components/ui/button";

interface CheckoutButtonProps {
  isProcessing: boolean;
  totalPrice: number;
  isDisabled: boolean;
  onPayment: () => void;
  includeMonthlyCoaching: boolean;
}

const CheckoutButton = ({ isProcessing, totalPrice, isDisabled, onPayment, includeMonthlyCoaching }: CheckoutButtonProps) => {
  const handleStripePayment = async () => {
    console.log('Button clicked!', { isDisabled, isProcessing, totalPrice });
    
    if (isProcessing) {
      console.log('Button is processing');
      return;
    }
    
    try {
      // Call onPayment first to store lead data
      await onPayment();
      
      // Determine which Stripe link to use based on total price
      // 18€ for base product, 67€ for product with monthly coaching
      const stripeUrl = totalPrice === 67 
        ? "https://buy.stripe.com/3cI3cwdrS6yJazGc6G7IY01"  // 67€ product
        : "https://buy.stripe.com/9B6dRaevWbT3bDK0nY7IY00"; // 18€ product
      
      console.log('Redirecting to Stripe:', stripeUrl);
      
      // Add success URL parameter to redirect to /results after payment
      const successUrl = encodeURIComponent(`${window.location.origin}/results`);
      const finalUrl = `${stripeUrl}?success_url=${successUrl}`;
      
      // Open Stripe checkout in the same tab
      window.location.href = finalUrl;
    } catch (error) {
      console.error('Error in payment process:', error);
      // Continue with payment even if there's an error
      const stripeUrl = totalPrice === 67 
        ? "https://buy.stripe.com/3cI3cwdrS6yJazGc6G7IY01"
        : "https://buy.stripe.com/9B6dRaevWbT3bDK0nY7IY00";
      
      const successUrl = encodeURIComponent(`${window.location.origin}/results`);
      const finalUrl = `${stripeUrl}?success_url=${successUrl}`;
      
      window.location.href = finalUrl;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Button clicked with event:', e);
    handleStripePayment();
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleClick}
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-4 px-6 rounded-xl font-bold text-base transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:hover:scale-100 disabled:opacity-50 shadow-lg cursor-pointer"
        type="button"
        style={{ pointerEvents: isProcessing ? 'none' : 'auto' }}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Traitement sécurisé...</span>
          </div>
        ) : (
          <span>👉 Commencer maintenant ({totalPrice}€)</span>
        )}
      </Button>
      
      {!isProcessing && (
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-gray-600">
              🟢 {totalPrice}€ – analyse + appel inclus
            </span>
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              -79%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutButton;
