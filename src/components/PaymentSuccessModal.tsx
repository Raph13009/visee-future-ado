
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentSuccessModal = ({ isOpen, onClose }: PaymentSuccessModalProps) => {
  const handleBookCall = () => {
    // In a real app, this would redirect to Calendly or booking system
    alert("Redirection vers le système de réservation d'appel...");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 rounded-2xl border-0 shadow-2xl">
        <div className="text-center py-6 px-4">
          <div className="space-y-6">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🎉</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-primary">
                Bravo ! 🎉
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Tu viens de débloquer ton coaching personnalisé !
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <Button
                onClick={handleBookCall}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-medium transition-colors"
              >
                Réserve ton appel maintenant
              </Button>
              
              <Button
                variant="ghost"
                onClick={onClose}
                className="w-full text-gray-500 hover:text-gray-700 transition-colors"
              >
                Plus tard
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccessModal;
