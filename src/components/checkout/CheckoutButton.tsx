
import { Button } from "@/components/ui/button";

interface CheckoutButtonProps {
  isProcessing: boolean;
  totalPrice: number;
  isDisabled: boolean;
  onPayment: () => void;
}

const CheckoutButton = ({ isProcessing, totalPrice, isDisabled, onPayment }: CheckoutButtonProps) => {
  return (
    <Button
      onClick={onPayment}
      disabled={isDisabled}
      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-5 sm:py-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 mb-4 shadow-lg"
    >
      {isProcessing ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span className="text-sm sm:text-base">Traitement sécurisé...</span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-1">
          <span className="text-sm sm:text-base">🚀 Accéder au coaching</span>
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-bold">{totalPrice}€</span>
            <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
              -79% 🔥
            </div>
          </div>
        </div>
      )}
    </Button>
  );
};

export default CheckoutButton;
