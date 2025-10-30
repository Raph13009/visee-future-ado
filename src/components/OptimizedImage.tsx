import { useState, useEffect, useRef } from 'react';
import blurPlaceholders from '../data/blur-placeholders.json';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean; // Pour les images hero/critical
  lazy?: boolean; // Force lazy même si priority=true
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string; // Base64 blur placeholder (optionnel, sera chargé depuis JSON si disponible)
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  style?: React.CSSProperties;
}

/**
 * Composant d'image optimisé avec:
 * - Lazy loading intelligent (uniquement hors écran)
 * - Support WebP/AVIF avec fallback
 * - Blur placeholder (LQIP)
 * - Dimensions fixes pour éviter CLS
 * - Priority loading pour hero images
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  lazy: forceLazy = false,
  placeholder = 'blur',
  blurDataURL,
  onError,
  style,
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Hero images sont "in view" par défaut
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer pour lazy loading intelligent
  useEffect(() => {
    // Si priority est vrai, charger immédiatement
    if (priority) {
      setIsInView(true);
      return;
    }

    // Si lazy est explicitement désactivé, charger immédiatement
    if (forceLazy === false) {
      setIsInView(true);
      return;
    }

    // Sinon, utiliser lazy loading avec Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Commence le chargement 50px avant d'entrer dans la vue
      }
    );

    // Observer le conteneur directement
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority, forceLazy]);

  // Générer les sources WebP et AVIF avec fallback
  const getOptimizedSrc = (originalSrc: string) => {
    // Si l'image est déjà optimisée, retourner tel quel
    if (originalSrc.includes('/images/optimised/')) {
      return originalSrc;
    }

    // Sinon, retourner l'original (sera remplacé par les versions optimisées)
    return originalSrc;
  };

  // Charger blur placeholder depuis JSON ou utiliser celui fourni
  const getBlurPlaceholder = (): string => {
    if (blurDataURL) return blurDataURL;
    // Chercher dans le JSON des placeholders générés
    const placeholderKey = Object.keys(blurPlaceholders).find(key => 
      src.includes(key.replace(/^\//, '')) || key.includes(src.replace(/^\//, ''))
    );
    if (placeholderKey && blurPlaceholders[placeholderKey as keyof typeof blurPlaceholders]) {
      return blurPlaceholders[placeholderKey as keyof typeof blurPlaceholders];
    }
    // Fallback SVG générique
    return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"%3E%3Crect fill="%23D9D2B6" width="${width}" height="${height}"/%3E%3C/svg%3E`;
  };

  const defaultBlurDataURL = getBlurPlaceholder();

  const loading = priority || !forceLazy ? 'eager' : 'lazy';
  const fetchpriority = priority ? 'high' : 'auto';

  // Construire les sources optimisées
  const getOptimizedSources = () => {
    const basePath = getOptimizedSrc(imageSrc);
    const nameWithoutExt = basePath.replace(/\.(jpg|jpeg|png)$/i, '');
    const fileName = nameWithoutExt.split('/').pop() || nameWithoutExt;
    
    // Si l'image est déjà optimisée, retourner directement
    if (basePath.includes('/images/optimised/')) {
      return {
        avif: basePath,
        webp: basePath.replace(/\.avif$/i, '.webp'),
        original: basePath.replace(/\.(avif|webp)$/i, '.jpg'),
      };
    }

    // Construire les chemins vers les versions optimisées
    // Les images optimisées sont dans /images/optimised/ avec le même nom de base
    return {
      avif: `/images/optimised/${fileName}.avif`,
      webp: `/images/optimised/${fileName}.webp`,
      original: basePath, // Fallback vers original si optimisées non disponibles
    };
  };

  const sources = getOptimizedSources();

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        ...(style || {}),
      }}
    >
      {/* Blur placeholder */}
      {placeholder === 'blur' && !isLoaded && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: defaultBlurDataURL.startsWith('data:') 
              ? `url("${defaultBlurDataURL}")` 
              : `url(${defaultBlurDataURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
            opacity: isLoaded ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
          }}
          aria-hidden="true"
        />
      )}

      {/* Image principale */}
      {isInView && (
        <picture>
          {/* AVIF si supporté */}
          <source
            srcSet={sources.avif}
            type="image/avif"
          />
          {/* WebP si supporté */}
          <source
            srcSet={sources.webp}
            type="image/webp"
          />
          {/* Fallback original */}
          <img
            src={sources.original}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            fetchpriority={fetchpriority}
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsLoaded(true)}
            onError={(e) => {
              // Si les versions optimisées échouent, essayer l'original
              const target = e.target as HTMLImageElement;
              if (target.src !== sources.original && !sources.original.includes('/images/optimised/')) {
                target.src = sources.original;
                return;
              }
              // Sinon, utiliser le fallback SVG
              if (onError) {
                onError(e);
              } else {
                target.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"%3E%3Crect fill="%236B8E9E" width="${width}" height="${height}"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3E${encodeURIComponent(alt)}%3C/text%3E%3C/svg%3E`;
              }
            }}
          />
        </picture>
      )}
    </div>
  );
};

export default OptimizedImage;

