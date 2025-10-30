import { useState, useEffect, useRef } from 'react';

interface ReportPreviewSlideshowProps {
  onProceedToPayment?: () => void;
}

const ReportPreviewSlideshow = ({ onProceedToPayment }: ReportPreviewSlideshowProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const slideBaseNames = Array.from({ length: 12 }, (_, i) => 
    `Presentation - Votre Avenir Commence Ici-${String(i + 1).padStart(2, '0')}`
  );
  // Slides are in /images/Presentation-Votre-Avenir as AVIF/WEBP
  const slidesAvif = slideBaseNames.map((name) => `/images/Presentation-Votre-Avenir/${name}.avif`);
  const slidesWebp = slideBaseNames.map((name) => `/images/Presentation-Votre-Avenir/${name}.webp`);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    
    if (distance > minSwipeDistance && currentSlide < slideBaseNames.length - 1) {
      goToSlide(currentSlide + 1);
    }
    if (distance < -minSwipeDistance && currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    if (index < 0 || index >= slideBaseNames.length || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handlePrevSlide = () => {
    goToSlide(currentSlide - 1);
  };

  const handleNextSlide = () => {
    goToSlide(currentSlide + 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToSlide(currentSlide - 1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToSlide(currentSlide + 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide, isTransitioning]);

  return (
    <div
      ref={containerRef}
      className="py-12 md:py-16 px-4 md:px-6"
      style={{ background: '#FFFFFF' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with selling message */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block px-4 py-2 rounded-lg mb-4" style={{
            background: '#FFF4E6',
            border: '2px solid #E96A3C',
            boxShadow: '3px 3px 0 rgba(233, 106, 60, 0.2)',
          }}>
            <p className="text-sm md:text-base font-bold" style={{ color: '#E96A3C' }}>
              ✨ Inclus dans votre bilan à 18 €
            </p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
            Votre rapport personnalisé de 12 pages
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez un aperçu de votre bilan complet : analyse détaillée de votre profil, métiers adaptés, formations recommandées et plan d'action personnalisé.
          </p>
        </div>

        {/* Slideshow Container - Desktop with arrows outside */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Left Arrow - Desktop Only */}
          <button
            onClick={handlePrevSlide}
            disabled={currentSlide === 0}
            className="hidden md:flex flex-shrink-0 w-14 h-14 items-center justify-center rounded-xl transition-all duration-300 hover:translate-x-[-3px] disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: '#FFFFFF',
              border: '3px solid #1A1A1A',
              boxShadow: '5px 5px 0 #1A1A1A',
              color: '#1A1A1A',
            }}
            aria-label="Slide précédent"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Slide Container */}
          <div className="flex-1 relative">
            {/* Slide Image with tight frame */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: '4px solid #1A1A1A',
                boxShadow: '8px 8px 0 #1A1A1A',
                background: '#FFFFFF',
                display: 'inline-block',
                width: '100%',
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div style={{ position: 'relative', width: '100%', background: '#FFFFFF' }}>
                {slideBaseNames.map((name, index) => (
                  <picture
                    key={`${name}-picture`}
                    className={`${index === currentSlide ? 'relative opacity-100' : 'absolute inset-0 opacity-0'} transition-opacity duration-300`}
                  >
                    <source srcSet={slidesAvif[index]} type="image/avif" />
                    <source srcSet={slidesWebp[index]} type="image/webp" />
                    <img
                      src={slidesWebp[index]}
                      alt={`Page ${index + 1} de votre rapport Avenirea`}
                      className={`w-full h-auto`}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  </picture>
                ))}
              </div>

              {/* Page Indicator - Bottom Center */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                <div
                  className="px-4 py-2 rounded-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '2px solid #1A1A1A',
                    boxShadow: '3px 3px 0 rgba(0,0,0,0.1)',
                  }}
                >
                  <p className="text-sm font-semibold" style={{ color: '#6B7280' }}>
                    Page {currentSlide + 1} / {slideBaseNames.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Dots and Arrows */}
            <div className="md:hidden mt-6">
              {/* Progress dots */}
              <div className="flex justify-center gap-2 mb-4">
                {slideBaseNames.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all rounded-full ${
                      index === currentSlide ? 'w-3 h-3' : 'w-2 h-2 opacity-40'
                    }`}
                    style={{
                      background: index === currentSlide ? '#E96A3C' : '#9CA3AF',
                      border: index === currentSlide ? '2px solid #1A1A1A' : 'none',
                    }}
                    aria-label={`Aller à la page ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Mobile Arrows */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={handlePrevSlide}
                  disabled={currentSlide === 0}
                  className="flex w-12 h-12 items-center justify-center rounded-xl transition-all duration-300 active:translate-x-[-2px] disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: '#FFFFFF',
                    border: '3px solid #1A1A1A',
                    boxShadow: '4px 4px 0 #1A1A1A',
                    color: '#1A1A1A',
                  }}
                  aria-label="Slide précédent"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={handleNextSlide}
                  disabled={currentSlide === slideBaseNames.length - 1}
                  className="flex w-12 h-12 items-center justify-center rounded-xl transition-all duration-300 active:translate-x-[2px] disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: '#FFFFFF',
                    border: '3px solid #1A1A1A',
                    boxShadow: '4px 4px 0 #1A1A1A',
                    color: '#1A1A1A',
                  }}
                  aria-label="Slide suivant"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Arrow - Desktop Only */}
          <button
            onClick={handleNextSlide}
            disabled={currentSlide === slideBaseNames.length - 1}
            className="hidden md:flex flex-shrink-0 w-14 h-14 items-center justify-center rounded-xl transition-all duration-300 hover:translate-x-[3px] disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: '#FFFFFF',
              border: '3px solid #1A1A1A',
              boxShadow: '5px 5px 0 #1A1A1A',
              color: '#1A1A1A',
            }}
            aria-label="Slide suivant"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* CTA Section - Below Slideshow */}
        {onProceedToPayment && (
          <div className="mt-12 text-center">
            <button
              onClick={onProceedToPayment}
              className="px-10 py-4 font-bold text-base md:text-lg rounded-xl transition-all duration-300 hover:translate-y-[-2px] text-white"
              style={{ 
                background: '#E96A3C',
                border: '3px solid #1A1A1A',
                boxShadow: '6px 6px 0 #1A1A1A'
              }}
              aria-label="Télécharger mon rapport"
            >
              Recevoir mon rapport de 12 pages
            </button>
            <p className="text-sm mt-4 text-gray-600 font-medium">
            Ton rapport arrive sous 48h • Paiement sécurisé
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPreviewSlideshow;

