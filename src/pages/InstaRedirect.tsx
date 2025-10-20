import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InstaRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect immediately on component mount
    navigate('/?utm_source=instagram&utm_medium=bio', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F9F8F4' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-lg font-medium" style={{ color: 'var(--neo-ink)' }}>
          Redirection en cours...
        </p>
        <noscript>
          <div className="mt-4">
            <p className="mb-2">JavaScript est désactivé.</p>
            <a 
              href="/?utm_source=instagram&utm_medium=bio"
              className="neo-button inline-block px-6 py-3"
            >
              Cliquez ici pour continuer
            </a>
          </div>
        </noscript>
      </div>
    </div>
  );
};

export default InstaRedirect;

