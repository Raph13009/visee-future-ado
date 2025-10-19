interface FooterProps {
  onOpenCgvModal?: () => void;
}

const Footer = ({ onOpenCgvModal }: FooterProps) => {
  return (
    <footer className="neo-section" style={{ background: 'var(--neo-bg)', borderTop: '3px solid var(--neo-line)' }}>
      <div className="neo-container">
        <div className="neo-grid neo-grid-3">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img 
                  src="/lovable-uploads/d90e4f60-4ab5-48a0-9e2f-ba4658dc9b54.png" 
                  alt="Avenirea Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg font-bold" style={{ color: 'var(--neo-ink)' }}>Avenirea</span>
            </div>
            <p className="neo-text-muted text-sm leading-relaxed">
              Trouver sa voie n'a jamais été aussi simple.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold" style={{ color: 'var(--neo-ink)' }}>Légal</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block neo-link" onClick={e => { e.preventDefault(); onOpenCgvModal && onOpenCgvModal(); }}>Mentions légales</a>
              <a href="#" className="block neo-link" onClick={e => { e.preventDefault(); onOpenCgvModal && onOpenCgvModal(); }}>CGV</a>
              <a href="#" className="block neo-link" onClick={e => { e.preventDefault(); onOpenCgvModal && onOpenCgvModal(); }}>Politique de confidentialité</a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold" style={{ color: 'var(--neo-ink)' }}>Confiance</h4>
            <div className="space-y-2 text-sm">
              <p className="neo-text-muted cursor-pointer hover:underline" onClick={onOpenCgvModal}>✅ Paiement sécurisé</p>
              <p className="neo-text-muted cursor-pointer hover:underline" onClick={onOpenCgvModal}>✅ Données protégées</p>
              <p className="neo-text-muted cursor-pointer hover:underline" onClick={onOpenCgvModal}>✅ Coaching certifié</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 text-center text-sm" style={{ borderTop: '2px solid var(--neo-line)', color: 'var(--neo-accent)' }}>
          <p>&copy; {new Date().getFullYear()} Avenirea. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
