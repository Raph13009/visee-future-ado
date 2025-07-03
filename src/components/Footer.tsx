
const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center">
                <img 
                  src="/lovable-uploads/d90e4f60-4ab5-48a0-9e2f-ba4658dc9b54.png" 
                  alt="Avenirea Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg font-semibold text-primary">Avenirea</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Trouver sa voie n'a jamais été aussi simple.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-primary">Légal</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <a href="#" className="block hover:text-primary transition-colors">Mentions légales</a>
              <a href="#" className="block hover:text-primary transition-colors">CGV</a>
              <a href="#" className="block hover:text-primary transition-colors">Politique de confidentialité</a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-primary">Confiance</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>✅ Paiement sécurisé</p>
              <p>✅ Données protégées</p>
              <p>✅ Coaching certifié</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Avenirea. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
