import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Rediriger vers les résultats après 1 seconde
    const timer = setTimeout(() => {
      // Récupérer le profil depuis l'URL ou depuis le localStorage
      let profile = searchParams.get('profile');
      
      if (!profile) {
        // Fallback: essayer de récupérer depuis localStorage
        const riasecResults = localStorage.getItem('riasecResults');
        if (riasecResults) {
          try {
            const parsedResults = JSON.parse(riasecResults);
            profile = parsedResults.dominantProfile;
          } catch (error) {
            console.error('Erreur parsing riasecResults:', error);
          }
        }
      }
      
      // Si toujours pas de profil, utiliser un défaut
      profile = profile || 'RI';
      
      console.log('Redirection vers profil:', profile);
      navigate(`/resultats-riasec?profile=${profile}&payment=success`);
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center overflow-hidden relative">
      {/* Particules animées en arrière-plan */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-70 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Cercles décoratifs animés */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />

      {/* Contenu principal */}
      <div className="text-center text-white z-10 px-4">
        {/* Icône de succès avec animation */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            {/* Cercle de fond avec pulsation */}
            <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-ping" />
            <div className="absolute inset-4 bg-white rounded-full opacity-30 animate-ping" style={{ animationDelay: '0.5s' }} />
            
            {/* Icône centrale */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl animate-bounce">
                ✨
              </div>
            </div>
          </div>
          
          {/* Checkmark animé */}
          <div className="absolute -top-2 -right-2 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Titre principal */}
        <h1 className="text-4xl md:text-6xl font-black mb-4 animate-fade-in-up tracking-tight">
          Merci pour votre paiement !
        </h1>

        {/* Sous-titre */}
        <p className="text-xl md:text-2xl font-medium opacity-90 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          🎉 Votre profil complet est maintenant débloqué
        </p>

        {/* Message de redirection */}
        <div className="inline-flex items-center gap-3 bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-lg font-medium">Redirection en cours...</span>
        </div>
      </div>

      {/* Confettis animés */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <div 
              className="w-3 h-3 transform rotate-45"
              style={{
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)]
              }}
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }

        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess; 