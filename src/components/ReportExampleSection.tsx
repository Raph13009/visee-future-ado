import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer?: Array<any>;
  }
}

const ReportExampleSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const slides = Array.from({ length: 12 }, (_, i) => 
    `/Presentation-Votre-Avenir/Presentation - Votre Avenir Commence Ici-${String(i + 1).padStart(2, '0')}.png`
  );

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
    
    if (distance > minSwipeDistance && currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    }
    if (distance < -minSwipeDistance && currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    if (index < 0 || index >= slides.length || isTransitioning) return;
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

  const handleOpenPriceModal = () => {
    setShowPriceModal(true);
    // DataLayer event
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'open_price_modal'
      });
    }
  };

  const handleStartBilanWithPrice = () => {
    // DataLayer event
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'click_start_bilan_with_price'
      });
    }
    navigate('/bilan-competences-tous-publics');
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
    <section
      id="exemple-rapport"
      ref={containerRef}
      className="py-16 md:py-24 px-4 md:px-6"
      style={{ background: '#FAF8F4' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
            Voici un exemple de rapport complet Avenirea
          </h2>
          <p 
            className="text-base md:text-lg text-gray-700 font-medium mb-2 cursor-pointer hover:underline"
            onClick={handleOpenPriceModal}
          >
            Le rapport complet (12 pages) est inclus dans la version Premium — 18 €
          </p>
        </div>

        {/* Slideshow Container - Desktop with arrows outside */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Left Arrow - Desktop Only - Always visible but disabled on first slide */}
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
            {/* Slide Image with tight frame - adapts to image size */}
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
              <div style={{ position: 'relative' }}>
                {slides.map((src, index) => (
                  <img
                    key={src}
                    src={src}
                    alt={`Slide ${index + 1} du rapport Avenirea`}
                    className={`${index === currentSlide ? 'block' : 'hidden'} w-full h-auto`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    style={{ display: index === currentSlide ? 'block' : 'none' }}
                  />
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
                    Page {currentSlide + 1} / {slides.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Navigation Dots and Arrows */}
            <div className="md:hidden mt-6">
              {/* Progress dots */}
              <div className="flex justify-center gap-2 mb-4">
                {slides.map((_, index) => (
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
              
              {/* Mobile Arrows - Always visible but disabled when needed */}
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
                  disabled={currentSlide === slides.length - 1}
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

          {/* Right Arrow - Desktop Only - Always visible but disabled on last slide */}
          <button
            onClick={handleNextSlide}
            disabled={currentSlide === slides.length - 1}
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
        <div className="mt-16 text-center py-4" style={{ background: '#FAF8F4' }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6" style={{ color: '#1A1A1A' }}>
            Prêt à découvrir ton profil ?
          </h2>
          
          <button
            onClick={handleStartBilanWithPrice}
            className="w-full md:w-auto px-10 py-4 font-bold text-base md:text-lg rounded-xl transition-all duration-300 hover:translate-y-[-2px] text-white"
            style={{ 
              background: '#E96A3C',
              border: '3px solid #1A1A1A',
              boxShadow: '6px 6px 0 #1A1A1A'
            }}
            aria-label="Commencer mon bilan d'orientation"
          >
            Commencer mon bilan
          </button>
          
          <p className="text-xs md:text-sm mt-3 text-gray-500 font-medium">
            Test gratuit — paiement uniquement si vous débloquez le rapport complet
          </p>
        </div>

        {/* Price Modal */}
        {showPriceModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => setShowPriceModal(false)}
          >
            <div 
              className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full"
              style={{
                border: '4px solid #1A1A1A',
                boxShadow: '8px 8px 0 #1A1A1A',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Rapport Premium — 18 €
                </h3>
                <button
                  onClick={() => setShowPriceModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                  style={{
                    background: '#F5F1E8',
                    border: '2px solid #1A1A1A',
                  }}
                  aria-label="Fermer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Profil complet</p>
                    <p className="text-sm text-gray-600">Analyse détaillée de votre personnalité professionnelle</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">6 métiers</p>
                    <p className="text-sm text-gray-600">Les professions les plus adaptées à votre profil</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Plan d'action</p>
                    <p className="text-sm text-gray-600">Les étapes concrètes pour avancer dans votre projet</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartBilanWithPrice}
                className="w-full py-4 font-bold text-base rounded-xl transition-all duration-300 hover:translate-y-[-2px] text-white"
                style={{ 
                  background: '#E96A3C',
                  border: '3px solid #1A1A1A',
                  boxShadow: '6px 6px 0 #1A1A1A'
                }}
              >
                Commencer mon bilan
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReportExampleSection;

