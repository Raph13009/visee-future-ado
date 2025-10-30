import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReportPreviewSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleViewReport = () => {
    document.querySelector('#exemple-rapport')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      className="pt-4 pb-16 md:pt-6 md:pb-24 px-6"
      style={{ background: '#F5F1E8' }}
    >
      {/* Text element above report - Centered independently like the main title */}
      <div className={`w-full mb-8 md:mb-12 text-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div
          className="inline-block px-6 py-4 md:px-8 md:py-5 rounded-xl"
          style={{
            background: '#FFFFFF',
            border: '3px solid #1A1A1A',
            boxShadow: '6px 6px 0 #1A1A1A',
          }}
        >
          <p
            className="text-lg md:text-xl font-bold leading-tight"
            style={{ color: '#1A1A1A' }}
          >
            Comme Eva, <span style={{ color: '#E96A3C' }}>débloque ton rapport</span> de{' '}
            <strong>12 pages</strong> sur ta{' '}
            <strong>personnalité</strong> et tes{' '}
            <strong>compétences</strong>
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">

        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 items-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Left Column - Report Mockup */}
          <div className="order-1 md:order-1 flex flex-col justify-center md:justify-start relative">
            <div
              className="relative"
              style={{
                transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
                transition: 'transform 0.7s ease-out 0.2s',
              }}
            >
              {/* Report Container with 3D tilt effect */}
              <div
                className="relative"
                style={{
                  transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div
                  className="rounded-2xl overflow-hidden relative"
                  style={{
                    border: '4px solid #1A1A1A',
                    boxShadow: '12px 12px 0 rgba(0,0,0,0.15), 0 20px 40px rgba(0,0,0,0.1)',
                    background: '#FFFFFF',
                    padding: '12px',
                    transform: 'translateZ(20px)',
                    maxWidth: '85%',
                    margin: '0 auto',
                  }}
                >
                  {/* Page indicator - discreet - top right */}
                  <div
                    className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-md bg-white bg-opacity-90"
                    style={{
                      border: '1px solid rgba(0,0,0,0.1)',
                    }}
                  >
                    <p className="text-xs font-medium text-gray-600">
                      Page 1 sur 12
                    </p>
                  </div>

                  {/* Report Image */}
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{
                      border: '2px solid #D9D2B6',
                    }}
                  >
                    <picture>
                      <source srcSet="/images/report-av.avif" type="image/avif" />
                      <source srcSet="/images/report-av.webp" type="image/webp" />
                      <img
                        src="/images/report-av.webp"
                        alt="Exemple de rapport Avenirea"
                        className="w-full h-auto"
                        width={550}
                        height={733}
                        loading="eager"
                        decoding="async"
                      />
                    </picture>
                  </div>
                </div>

                {/* Shadow effect behind */}
                <div
                  className="absolute inset-0 rounded-2xl -z-10"
                  style={{
                    background: 'rgba(0,0,0,0.1)',
                    transform: 'translate(15px, 15px)',
                    filter: 'blur(10px)',
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Mobile: Portrait of woman superposed on bottom right */}
              <div className="md:hidden absolute bottom-0 right-0 z-20" style={{ transform: 'translate(20px, 20px)' }}>
                <picture>
                  <source srcSet="/images/woman-lp.avif" type="image/avif" />
                  <source srcSet="/images/woman-lp.webp" type="image/webp" />
                  <img
                    src="/images/woman-lp.webp"
                    alt="Professionnelle en réflexion sur son avenir"
                    className="w-40 h-auto"
                    width={160}
                    height={200}
                    loading="eager"
                    decoding="async"
                    style={{
                      filter: 'drop-shadow(4px 4px 0 rgba(0,0,0,0.15))',
                      transform: 'rotate(5deg)',
                    }}
                  />
                </picture>
              </div>
            </div>
          </div>

          {/* Right Column - Portrait of woman (desktop only) */}
          <div className="hidden md:flex order-2 md:order-2 justify-center md:justify-end">
            <div
              className="relative"
              style={{
                transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
                transition: 'transform 0.7s ease-out 0.2s',
              }}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  border: '4px solid #1A1A1A',
                  boxShadow: '8px 8px 0 #1A1A1A',
                  transform: 'rotate(2deg)',
                  background: '#FFFFFF',
                  padding: '8px',
                }}
              >
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    border: '2px solid #1A1A1A',
                  }}
                >
                  <picture>
                    <source srcSet="/images/woman-lp.avif" type="image/avif" />
                    <source srcSet="/images/woman-lp.webp" type="image/webp" />
                    <img
                      src="/images/woman-lp.webp"
                      alt="Professionnelle en réflexion sur son avenir"
                      className="w-full h-auto"
                      width={600}
                      height={750}
                      loading="eager"
                      decoding="async"
                    />
                  </picture>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Version info - Professional and reassuring */}
        <div
          className={`mt-10 mb-8 text-center transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="inline-flex flex-col gap-1.5 items-center max-w-md">
            {/* Free version */}
            <div className="flex items-center gap-2.5">
              <svg 
                className="w-4 h-4 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ color: '#9CA3AF' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs md:text-sm font-normal leading-relaxed" style={{ color: '#6B7280' }}>
                Gratuit – aperçu de ton profil
              </p>
            </div>

            {/* Full version */}
            <div className="flex items-center gap-2.5">
              <svg 
                className="w-4 h-4 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ color: '#9CA3AF' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xs md:text-sm font-normal leading-relaxed" style={{ color: '#6B7280' }}>
                Premium – 12 pages personnalisées{' '}
                <span className="ml-1" style={{ color: '#4B5563' }}>(18 €)</span>
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button - Centered below */}
        <div
          className={`mt-6 text-center transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={handleViewReport}
            className="inline-flex items-center gap-2 px-8 py-4 font-semibold text-base rounded-xl transition-all"
            style={{
              background: 'transparent',
              border: '2px solid #E6DCCC',
              color: '#2C2C2C',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#4F8A8B';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#2C2C2C';
            }}
            aria-label="Consulter un exemple de rapport"
          >
            Consulter un exemple de rapport
          </button>
        </div>

        {/* CTA Orange - Main action */}
        <div
          className={`mt-8 text-center transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={() => navigate('/bilan-competences-tous-publics')}
            className="px-10 py-4 font-bold text-base md:text-lg rounded-xl transition-all duration-300 hover:translate-y-[-2px] text-white"
            style={{ 
              background: '#E96A3C',
              border: '3px solid #1A1A1A',
              boxShadow: '6px 6px 0 #1A1A1A'
            }}
            aria-label="Commencer mon bilan d'orientation"
          >
            Commencer mon bilan d'orientation
          </button>
        </div>

        {/* Reassurance text */}
        <div
          className={`mt-6 text-center transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-sm" style={{ color: '#9CA3AF' }}>
            1 actif sur 3 souhaite changer de métier selon France Compétences
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReportPreviewSection;

