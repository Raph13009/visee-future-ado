import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PseudoModal from "@/components/PseudoModal";

interface HeaderProps {
  hideTestCTA?: boolean;
}

const Header = ({ hideTestCTA }: HeaderProps) => {
  const navigate = useNavigate();
  const [showPseudoModal, setShowPseudoModal] = useState(false);

  const handleStartTest = () => {
    setShowPseudoModal(true);
  };

  const handleContinueToTest = (pseudo: string) => {
    setShowPseudoModal(false);
    navigate('/test-riasec');
  };

  const handleClosePseudoModal = () => {
    setShowPseudoModal(false);
  };

  return (
    <>
      <PseudoModal 
        isOpen={showPseudoModal}
        onClose={handleClosePseudoModal}
        onContinue={handleContinueToTest}
      />
      <header className="fixed top-0 left-0 right-0 z-50" style={{ background: 'var(--neo-bg)', borderBottom: '3px solid var(--neo-line)' }}>
        <div className="neo-container py-4 flex items-center justify-between">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
            <img 
              src="/lovable-uploads/d90e4f60-4ab5-48a0-9e2f-ba4658dc9b54.png" 
              alt="Avenirea Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-bold" style={{ color: 'var(--neo-ink)' }}>Avenirea</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#benefices" className="neo-link">Avantages</a>
          <a href="#temoignages" className="neo-link">Témoignages</a>
          <a href="#faq" className="neo-link">FAQ</a>
        </nav>

        {!hideTestCTA && (
        <button 
          onClick={handleStartTest}
          className="neo-button px-6 py-2"
        >
          Commencer le test
        </button>
        )}
        </div>
      </header>
    </>
  );
};

export default Header;
