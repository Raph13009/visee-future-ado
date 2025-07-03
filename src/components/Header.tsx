
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center">
            <img 
              src="/lovable-uploads/d90e4f60-4ab5-48a0-9e2f-ba4658dc9b54.png" 
              alt="Avenirea Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-semibold text-primary tracking-tight">Avenirea</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#benefices" className="text-gray-600 hover:text-primary transition-colors">Avantages</a>
          <a href="#temoignages" className="text-gray-600 hover:text-primary transition-colors">Témoignages</a>
          <a href="#faq" className="text-gray-600 hover:text-primary transition-colors">FAQ</a>
        </nav>

        <Button 
          onClick={() => navigate('/test')}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-2xl font-medium transition-all hover:scale-105"
        >
          Commencer le test
        </Button>
      </div>
    </header>
  );
};

export default Header;
