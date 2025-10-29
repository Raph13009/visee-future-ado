import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CgvModal from '@/components/checkout/CgvModal';
import OptimizedImage from '@/components/OptimizedImage';

const Ressources = () => {
  const navigate = useNavigate();
  const [isCgvModalOpen, setIsCgvModalOpen] = useState(false);

  // Liste des articles de blog
  const blogPosts = [
    {
      slug: '5-metiers-reconversion-40-ans-sans-diplome',
      title: '5 métiers pour une reconversion à 40 ans sans diplôme',
      excerpt: 'Découvrez 5 idées de métiers accessibles sans diplôme pour réussir votre reconversion à 40 ans, avec des conseils concrets.',
      image: '/seo/group-working.jpg',
      link: '/5-metiers-reconversion-40-ans-sans-diplome'
    },
    {
      slug: 'bilan-orientation-professionnelle-adulte',
      title: 'Bilan d\'orientation professionnelle adulte : comment faire le point sur sa carrière ?',
      excerpt: 'Vous sentez que votre travail ne vous correspond plus ? Découvrez comment un bilan d\'orientation professionnelle peut vous aider à clarifier votre avenir.',
      image: '/group-working.jpg',
      link: '/bilan-orientation-professionnelle-adulte'
    },
    {
      slug: 'test-orientation-professionnelle-adulte',
      title: 'Test orientation professionnelle adulte : retrouvez votre voie',
      excerpt: 'Comment savoir si vous êtes encore fait pour votre métier actuel ? Découvrez comment un test d\'orientation professionnelle peut vous aider à clarifier vos envies.',
      image: '/seo/orientation.jpg',
      link: '/test-orientation-professionnelle-adulte'
    },
    {
      slug: 'metier-reconversion-40-ans',
      title: 'Métier reconversion 40 ans : quel métier choisir après 40 ans ?',
      excerpt: 'À 40 ans, peut-on encore changer de métier ? Découvrez les métiers adaptés, les étapes concrètes et nos conseils pour réussir votre reconversion.',
      image: '/worker-aged-40.jpg',
      link: '/metier-reconversion-40-ans'
    },
    {
      slug: 'conseils-reconversion-professionnelle',
      title: 'Conseils pour une reconversion professionnelle réussie',
      excerpt: 'Découvrez les étapes clés pour réussir votre reconversion professionnelle, du bilan de compétences à la mise en action.',
      image: '/conseils/hero.jpg',
      link: '/conseils-reconversion-professionnelle'
    }
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen" style={{ background: 'var(--neo-bg)' }}>
      {/* Hero Section */}
      <section className="text-center px-6 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <span 
              className="inline-block text-xs font-semibold px-4 py-2 rounded-full"
              style={{ 
                background: '#D9D2B6', 
                border: '2px solid #1A1A1A',
                boxShadow: '0 3px 0 rgba(0,0,0,0.1)',
                letterSpacing: '0.5px',
                color: '#2C2C2C'
              }}
            >
              Ressources & Conseils
            </span>
          </div>
          
          {/* H1 Title */}
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6 max-w-3xl mx-auto" style={{ color: '#1A1A1A' }}>
            Nos conseils sur l'orientation
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
            Guides, conseils et ressources pour vous accompagner dans votre réorientation professionnelle ou scolaire.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="rounded-2xl overflow-hidden transition-all hover:translate-y-[-4px] flex flex-col h-full"
                style={{
                  background: '#FFFFFF',
                  border: '3px solid #1A1A1A',
                  boxShadow: '6px 6px 0 #1A1A1A'
                }}
              >
                {/* Image de couverture */}
                <div className="w-full h-56 overflow-hidden flex-shrink-0" style={{ background: '#D9D2B6' }}>
                  <OptimizedImage
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full"
                    width={600}
                    height={224}
                    priority={false}
                  />
                </div>

                {/* Contenu de la carte */}
                <div className="p-6 flex flex-col flex-grow">
                  <h2 
                    className="text-xl font-bold mb-3 leading-tight"
                    style={{ color: '#1A1A1A' }}
                  >
                    {post.title}
                  </h2>
                  
                  <p 
                    className="text-base mb-6 leading-relaxed flex-grow"
                    style={{ color: '#6B7280' }}
                  >
                    {post.excerpt}
                  </p>

                  {/* CTA Button */}
                  <button
                    onClick={() => {
                      navigate(post.link);
                      window.scrollTo(0, 0);
                    }}
                    className="w-full px-6 py-3 font-bold text-base rounded-xl transition-all hover:translate-y-[-2px] mt-auto"
                    style={{
                      background: '#E96A3C',
                      color: '#FFFFFF',
                      border: '3px solid #1A1A1A',
                      boxShadow: '4px 4px 0 #1A1A1A'
                    }}
                  >
                    En savoir plus
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Message si aucun article (pour plus tard) */}
          {blogPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg" style={{ color: '#6B7280' }}>
                Nos premiers articles arrivent bientôt !
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Redirection vers le test */}
      <section className="px-6 pb-24">
        <div 
          className="max-w-4xl mx-auto text-center p-12 rounded-2xl"
          style={{
            background: '#D9D2B6',
            border: '3px solid #1A1A1A',
            boxShadow: '8px 8px 0 #1A1A1A'
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
            Prêt à passer à l'action ?
          </h2>
          
          <p className="text-lg mb-8" style={{ color: '#6B7280' }}>
            Découvrez votre profil et vos pistes d'orientation dès maintenant.
          </p>
          
          <button
            onClick={() => {
              navigate('/bilan-reconversion-professionnelle');
              window.scrollTo(0, 0);
            }}
            className="px-10 py-4 font-bold text-lg rounded-xl transition-all hover:translate-y-[-2px]"
            style={{
              background: '#E96A3C',
              color: '#FFFFFF',
              border: '3px solid #1A1A1A',
              boxShadow: '6px 6px 0 #1A1A1A'
            }}
          >
            Faire le test maintenant
          </button>
        </div>
      </section>
      </div>

      <Footer onOpenCgvModal={() => setIsCgvModalOpen(true)} />
      <CgvModal 
        isOpen={isCgvModalOpen} 
        onClose={() => setIsCgvModalOpen(false)} 
      />
    </>
  );
};

export default Ressources;

