import { useState } from "react";
import CoachingCTA from "./CoachingCTA";
import CoachingPresentation from "./CoachingPresentation";
import CoachingBooking from "./CoachingBooking";

type CoachingStep = 'cta' | 'presentation' | 'booking';

interface CoachingFlowProps {
  initialStep?: CoachingStep;
  showCTA?: boolean;
}

const CoachingFlow = ({ initialStep = 'cta', showCTA = true }: CoachingFlowProps) => {
  const [currentStep, setCurrentStep] = useState<CoachingStep>(initialStep);
  const [selectedPrice, setSelectedPrice] = useState<18 | 67 | null>(null);

  const handleDiscover = () => {
    setCurrentStep('presentation');
  };

  const handleBook = (price: 18 | 67) => {
    setSelectedPrice(price);
    setCurrentStep('booking');
  };

  const handleBackToPresentation = () => {
    setCurrentStep('presentation');
    setSelectedPrice(null); // Reset price selection when going back
  };

  const handleBackToCTA = () => {
    setCurrentStep('cta');
    setSelectedPrice(null);
  };

  // Si on ne veut pas afficher le CTA, on commence directement à la présentation
  if (!showCTA && currentStep === 'cta') {
    setCurrentStep('presentation');
  }

  switch (currentStep) {
    case 'cta':
      return <CoachingCTA onDiscover={handleDiscover} />;
    
    case 'presentation':
      return (
        <CoachingPresentation 
          onBook={handleBook} 
          onBack={showCTA ? handleBackToCTA : () => window.history.back()}
        />
      );
    
    case 'booking':
      return (
        <CoachingBooking 
          onBack={handleBackToPresentation}
          selectedPrice={selectedPrice}
        />
      );
    
    default:
      return <CoachingCTA onDiscover={handleDiscover} />;
  }
};

export default CoachingFlow; 