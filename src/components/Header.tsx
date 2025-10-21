import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface HeaderProps {
  hideTestCTA?: boolean;
}

const Header = ({ hideTestCTA }: HeaderProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Bloquer le scroll quand le menu est ouvert
  if (menuOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50" style={{ background: 'var(--neo-bg)', borderBottom: '3px solid var(--neo-line)' }}>
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
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
          
          {/* Spacer */}
          <div className="flex-1"></div>
          
          {/* Burger Menu Icon - Plus à gauche */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-3 rounded-lg transition-all hover:translate-y-[-2px] mr-4"
            style={{
              background: '#FFFFFF',
              border: '2px solid #1A1A1A',
              boxShadow: '3px 3px 0 rgba(0,0,0,0.1)'
            }}
            aria-label="Menu de navigation"
          >
            <div className="space-y-1.5">
              <div className="w-6 h-0.5" style={{ background: '#1A1A1A' }}></div>
              <div className="w-6 h-0.5" style={{ background: '#1A1A1A' }}></div>
              <div className="w-6 h-0.5" style={{ background: '#1A1A1A' }}></div>
            </div>
          </button>
          
        </div>
      </header>

      {/* Dropdown Menu */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-40"
            onClick={() => setMenuOpen(false)}
          ></div>
          
          {/* Menu Drawer */}
          <div 
            className="fixed top-20 right-4 z-50 rounded-xl overflow-hidden animate-fade-in"
            style={{
              background: '#FFFFFF',
              border: '3px solid #1A1A1A',
              boxShadow: '6px 6px 0 #1A1A1A',
              minWidth: '250px'
            }}
          >
            <nav className="py-4">
              <button
                onClick={() => {
                  navigate('/');
                  setMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
                className="w-full px-6 py-3 text-left font-semibold hover:bg-gray-50 transition-colors"
                style={{ color: '#1A1A1A' }}
              >
                Accueil
              </button>
              <button
                onClick={() => {
                  navigate('/qui-sommes-nous');
                  setMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
                className="w-full px-6 py-3 text-left font-semibold hover:bg-gray-50 transition-colors"
                style={{ color: '#1A1A1A' }}
              >
                Qui sommes-nous
              </button>
              
              <button
                onClick={() => {
                  navigate('/ressources');
                  setMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
                className="w-full px-6 py-3 text-left font-semibold hover:bg-gray-50 transition-colors"
                style={{ color: '#1A1A1A' }}
              >
                Nos conseils sur l'orientation
              </button>
              <button
                onClick={() => {
                  navigate('/acces-resultats');
                  setMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
                className="w-full px-6 py-3 text-left font-semibold hover:bg-gray-50 transition-colors"
                style={{ color: '#1A1A1A' }}
              >
                Accès à mes résultats
              </button>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
