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
            <h4 className="font-bold" style={{ color: 'var(--neo-ink)' }}>Ressources</h4>
            <div className="space-y-2 text-sm">
              <a href="/ressources" className="block neo-link">Nos conseils sur l'orientation</a>
              <a href="/qui-sommes-nous" className="block neo-link">Qui sommes-nous</a>
              <a href="/acces-resultats" className="block neo-link">Accès à mes résultats</a>
            </div>
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

        {/* Réseaux Sociaux */}
        <div className="mt-8 pt-8 flex flex-col items-center gap-4" style={{ borderTop: '2px solid var(--neo-line)' }}>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/avenirea/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 rounded-lg transition-all hover:translate-y-[-2px]"
              style={{
                background: 'linear-gradient(135deg, #E4405F 0%, #C13584 100%)',
                color: '#FFFFFF',
                border: '2px solid #1A1A1A',
                boxShadow: '3px 3px 0 rgba(0,0,0,0.1)'
              }}
              aria-label="Instagram Avenirea"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            
            <a
              href="https://www.tiktok.com/@avenirea"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-12 h-12 rounded-lg transition-all hover:translate-y-[-2px]"
              style={{
                background: '#000000',
                color: '#FFFFFF',
                border: '2px solid #1A1A1A',
                boxShadow: '3px 3px 0 rgba(0,0,0,0.1)'
              }}
              aria-label="TikTok Avenirea"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-sm" style={{ color: 'var(--neo-accent)' }}>
          <p>&copy; {new Date().getFullYear()} Avenirea. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
