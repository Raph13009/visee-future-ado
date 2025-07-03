import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, TestTube } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-white shadow-lg">
            <img 
              src="/lovable-uploads/d90e4f60-4ab5-48a0-9e2f-ba4658dc9b54.png" 
              alt="Avenirea Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>

        {/* 404 Number */}
        <div className="mb-6">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Oups ! Page introuvable
          </h2>
          <p className="text-gray-600 leading-relaxed">
            La page que vous recherchez n'existe pas ou a été déplacée. 
            Pas de panique, retrouvez votre chemin vers l'orientation !
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/test')}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg"
          >
            <TestTube className="w-5 h-5 mr-2" />
            Retourner au test d'orientation
          </Button>
          
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-xl font-medium transition-all duration-200"
          >
            <Home className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
