
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const NavigationButtons = ({ 
  currentStep, 
  totalSteps, 
  canProceed, 
  onPrevious, 
  onNext 
}: NavigationButtonsProps) => {
  return (
    <div className="flex justify-between items-center gap-2 mb-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0}
        className="px-4 sm:px-6 py-2 rounded-xl text-sm transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
      >
        Précédent
      </Button>

      <Button
        onClick={onNext}
        disabled={!canProceed}
        className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50"
      >
        {currentStep === totalSteps - 1 ? "Obtenir mes résultats" : "Suivant"}
      </Button>
    </div>
  );
};

export default NavigationButtons;
