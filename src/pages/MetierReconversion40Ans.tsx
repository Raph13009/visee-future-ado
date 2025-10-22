import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MetierReconversion40Ans = () => {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#F5F1E8' }}>
      <Header />
      
      <main className="pt-24 pb-16">
        
        {/* Bouton Retour */}
        <div className="max-w-4xl mx-auto px-6 mb-4">
          <button
            onClick={() => {
              navigate('/ressources');
              window.scrollTo(0, 0);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-sm rounded-lg transition-all hover:translate-x-[-2px]"
            style={{
              background: '#FFFFFF',
              color: '#2C2C2C',
              border: '2px solid #1A1A1A',
              boxShadow: '3px 3px 0 #1A1A1A'
            }}
          >
            <span>←</span>
            <span>Retour</span>
          </button>
        </div>
        
        {/* 1️⃣ Hero Section */}
        <section className="py-8 px-6" style={{ background: '#F5F1E8' }}>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6" style={{ color: '#1A1A1A' }}>
              Métier reconversion 40 ans : quel métier choisir après 40 ans ?
            </h1>
            
            <p className="text-lg sm:text-xl mb-12 leading-relaxed" style={{ color: '#6B7280' }}>
              À 40 ans, peut-on encore changer de métier sans tout recommencer ? Découvrez les pistes concrètes pour réussir votre reconversion professionnelle.
            </p>

            {/* Hero Image */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '8px 8px 0 rgba(0,0,0,0.1)' }}>
                <img 
                  src="/worker-aged-40.jpg" 
                  alt="Professionnel de 40 ans réfléchissant à sa reconversion"
                  className="w-full h-80 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"%3E%3Crect fill="%236B8E9E" width="1200" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="28" fill="%23ffffff"%3EReconversion %C3%A0 40 ans%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2️⃣ Introduction - La réalité de la reconversion à 40 ans */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-8">
              Pourquoi la reconversion à 40 ans est une opportunité
            </h2>
            
            <div className="section-content mb-8">
              <p className="section-text">
                À 40 ans, vous avez accumulé de l'expérience, développé des compétences transférables et une meilleure connaissance de vous-même. C'est un atout majeur pour une <strong>reconversion professionnelle</strong> réussie.
              </p>
              <p className="section-text">
                Contrairement aux idées reçues, <strong>changer de métier à 40 ans</strong> n'est pas un recommencement à zéro. C'est une réorientation intelligente qui s'appuie sur ce que vous avez déjà construit. De nombreux adultes font ce choix chaque année, et avec les bonnes méthodes, ils y arrivent.
              </p>
              <p className="section-text">
                La question n'est donc pas "est-ce possible ?" mais plutôt "<strong>quel métier après 40 ans</strong> correspond vraiment à mes envies et mes compétences ?"
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2">
                <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                  <img 
                    src="/woman-working.jpg" 
                    alt="Femme professionnelle en reconversion"
                    className="w-full h-72 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%236B8E9E" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3EReconversion r%C3%A9ussie%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="p-6 rounded-xl" style={{ background: '#D9D2B6', border: '2px solid #1A1A1A', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                  <h3 className="font-bold text-xl mb-4" style={{ color: '#1A1A1A' }}>
                    Le bon moment, c'est maintenant
                  </h3>
                  <ul className="space-y-3 text-sm" style={{ color: '#2C2C2C' }}>
                    <li className="flex items-start gap-2">
                      <span className="text-lg">✓</span>
                      <span>Vous connaissez mieux vos forces et vos limites</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lg">✓</span>
                      <span>Vous avez un réseau professionnel établi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lg">✓</span>
                      <span>Vous savez ce que vous ne voulez plus</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-lg">✓</span>
                      <span>Vous êtes plus réaliste et pragmatique</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3️⃣ Métiers adaptés à une reconversion à 40 ans */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-8">
              Quels métiers pour une reconversion à 40 ans ?
            </h2>
            
            <div className="section-content mb-8">
              <p className="section-text">
                Le choix du <strong>métier reconversion 40 ans</strong> dépend de vos compétences actuelles, de vos aspirations et du marché du travail. Voici quelques pistes qui fonctionnent bien pour les adultes en reconversion :
              </p>
            </div>

            {/* Grille de métiers */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">💼</span>
                  <div>
                    <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>
                      Métiers du conseil et de l'accompagnement
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                      Coach, consultant RH, formateur professionnel, conseiller en insertion
                    </p>
                    <p className="text-xs text-gray-600">
                      ✓ Valorise votre expérience | ✓ Contact humain | ✓ Autonomie
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🏡</span>
                  <div>
                    <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>
                      Métiers de l'immobilier et de la gestion
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                      Agent immobilier, syndic de copropriété, gestionnaire de patrimoine
                    </p>
                    <p className="text-xs text-gray-600">
                      ✓ Formation courte | ✓ Indépendance | ✓ Revenus évolutifs
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🌿</span>
                  <div>
                    <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>
                      Métiers du bien-être et de la santé
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                      Sophrologue, naturopathe, ergonome, diététicien
                    </p>
                    <p className="text-xs text-gray-600">
                      ✓ Sens et utilité | ✓ Flexibilité horaire | ✓ Secteur porteur
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">💻</span>
                  <div>
                    <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>
                      Métiers du digital et de la communication
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                      Community manager, rédacteur web, chef de projet digital
                    </p>
                    <p className="text-xs text-gray-600">
                      ✓ Télétravail possible | ✓ Évolution rapide | ✓ Créativité
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🎓</span>
                  <div>
                    <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>
                      Métiers de la formation et de l'éducation
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                      Formateur indépendant, enseignant spécialisé, tuteur en ligne
                    </p>
                    <p className="text-xs text-gray-600">
                      ✓ Transmission de savoir | ✓ Stabilité | ✓ Impact social
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🛠️</span>
                  <div>
                    <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>
                      Métiers techniques et artisanaux
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                      Électricien, plombier, menuisier, boulanger
                    </p>
                    <p className="text-xs text-gray-600">
                      ✓ Métier concret | ✓ Forte demande | ✓ Indépendance possible
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                <img 
                  src="/group-working.jpg" 
                  alt="Équipe professionnelle en reconversion"
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="500"%3E%3Crect fill="%236B8E9E" width="800" height="500"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3ENouvelle carri%C3%A8re%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4️⃣ Les étapes concrètes pour réussir sa reconversion à 40 ans */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-8">
              Comment réussir sa reconversion professionnelle à 40 ans ?
            </h2>
            
            <div className="section-content mb-8">
              <p className="section-text">
                Une <strong>reconversion professionnelle</strong> réussie ne s'improvise pas, surtout à 40 ans. Voici les étapes clés pour maximiser vos chances de succès :
              </p>
            </div>

            {/* 5 étapes visuelles */}
            <div className="space-y-6 mb-8">
              <div className="flex gap-4 p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 4px 0 rgba(0,0,0,0.08)' }}>
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl" style={{ background: '#E96A3C', color: '#FFFFFF' }}>
                  1
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>
                    Faire un bilan de compétences approfondi
                  </h3>
                  <p className="text-sm text-gray-700">
                    Identifiez vos compétences transférables, vos motivations profondes et vos valeurs professionnelles. Un <strong>bilan de compétences</strong> structuré vous aide à clarifier ce qui compte vraiment pour vous.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 4px 0 rgba(0,0,0,0.08)' }}>
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl" style={{ background: '#E96A3C', color: '#FFFFFF' }}>
                  2
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>
                    Explorer les métiers porteurs et réalistes
                  </h3>
                  <p className="text-sm text-gray-700">
                    Renseignez-vous sur les secteurs qui recrutent, les formations courtes et les métiers compatibles avec votre situation personnelle (famille, contraintes financières, mobilité).
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 4px 0 rgba(0,0,0,0.08)' }}>
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl" style={{ background: '#E96A3C', color: '#FFFFFF' }}>
                  3
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>
                    Tester avant de vous engager
                  </h3>
                  <p className="text-sm text-gray-700">
                    Faites des immersions, du bénévolat ou des missions courtes pour valider que le métier vous correspond réellement. C'est crucial pour éviter une seconde déception.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 4px 0 rgba(0,0,0,0.08)' }}>
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl" style={{ background: '#E96A3C', color: '#FFFFFF' }}>
                  4
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>
                    Se former de manière ciblée
                  </h3>
                  <p className="text-sm text-gray-700">
                    Privilégiez des formations professionnalisantes, reconnues et financées (CPF, Pôle Emploi, transitions collectives). À 40 ans, visez l'efficacité plutôt que les diplômes longs.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 4px 0 rgba(0,0,0,0.08)' }}>
                <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl" style={{ background: '#E96A3C', color: '#FFFFFF' }}>
                  5
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>
                    Construire un réseau dans votre nouveau secteur
                  </h3>
                  <p className="text-sm text-gray-700">
                    Participez à des événements professionnels, rejoignez des groupes LinkedIn, échangez avec des personnes qui ont réussi leur reconversion. Le réseau est souvent la clé.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5️⃣ Reconversion à 40 ans vs 50 ans */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-8">
              Métier reconversion 40 ans ou 50 ans : quelle différence ?
            </h2>
            
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex-1 p-6 rounded-xl" style={{ background: '#D9D2B6', border: '2px solid #1A1A1A', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                <h3 className="font-bold text-xl mb-4" style={{ color: '#1A1A1A' }}>
                  À 40 ans
                </h3>
                <ul className="space-y-3 text-sm" style={{ color: '#2C2C2C' }}>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">→</span>
                    <span>Encore 20-25 ans de carrière devant vous</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">→</span>
                    <span>Possibilité de se former sur 1 à 2 ans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">→</span>
                    <span>Souplesse pour tester plusieurs pistes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">→</span>
                    <span>Énergie pour repartir de zéro si besoin</span>
                  </li>
                </ul>
              </div>

              <div className="flex-1 p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                <h3 className="font-bold text-xl mb-4" style={{ color: '#1A1A1A' }}>
                  À 50 ans et +
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-lg">→</span>
                    <span>Focus sur l'expérience et le conseil</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">→</span>
                    <span>Formations plus courtes et ciblées</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">→</span>
                    <span>Valorisation maximale des acquis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-lg">→</span>
                    <span>Préférence pour l'indépendance ou le temps partiel</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="section-content mt-8">
              <p className="section-text">
                Que vous envisagiez un <strong>métier reconversion 40 ans</strong> ou un <strong>métier reconversion 50 ans</strong>, l'important est d'adapter votre stratégie à votre situation personnelle. L'âge n'est pas un frein, c'est un contexte.
              </p>
            </div>
          </div>
        </section>

        {/* 6️⃣ L'importance du bilan de compétences pour l'orientation professionnelle adulte */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-8">
              Pourquoi un bilan de compétences est essentiel à 40 ans ?
            </h2>
            
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 mb-8">
              <div className="w-full md:w-1/2">
                <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                  <img 
                    src="/man-working.jpg" 
                    alt="Professionnel faisant un bilan de compétences"
                    className="w-full h-72 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%236B8E9E" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3EBilan de comp%C3%A9tences%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/2 section-content">
                <p className="section-text">
                  À 40 ans, un <strong>bilan de compétences</strong> n'est pas un luxe, c'est un outil stratégique. Il vous permet de :
                </p>
                <ul className="space-y-3 mt-4">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span className="section-text">Identifier vos compétences cachées ou sous-exploitées</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span className="section-text">Clarifier vos motivations et vos priorités de vie</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span className="section-text">Éviter les reconversions inadaptées ou précipitées</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span className="section-text">Obtenir un plan d'action réaliste et personnalisé</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-8 rounded-xl text-center" style={{ background: '#D9D2B6', border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
              <p className="text-lg font-semibold mb-4" style={{ color: '#1A1A1A' }}>
                Chez Avenirea, notre test d'<strong>orientation professionnelle adulte</strong> est conçu pour vous donner des résultats concrets et actionnables en quelques minutes.
              </p>
              <p className="text-base" style={{ color: '#6B7280' }}>
                Basé sur la méthode RIASEC et enrichi des retours de milliers d'adultes en reconversion, il vous aide à y voir plus clair sur vos prochaines étapes.
              </p>
            </div>
          </div>
        </section>

        {/* 7️⃣ Conseils pratiques pour adultes en reconversion */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-8 text-center">
              Nos meilleurs conseils pour réussir votre reconversion à 40 ans
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🎯</span>
                  <div>
                    <p className="font-bold mb-2" style={{ color: '#1A1A1A' }}>
                      Soyez réaliste sur le timing
                    </p>
                    <p className="text-sm text-gray-700">
                      Une reconversion prend en moyenne 12 à 18 mois. Anticipez financièrement et psychologiquement cette période de transition.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">💰</span>
                  <div>
                    <p className="font-bold mb-2" style={{ color: '#1A1A1A' }}>
                      Mobilisez vos droits à la formation
                    </p>
                    <p className="text-sm text-gray-700">
                      CPF, Pôle Emploi, OPCO, transitions professionnelles : de nombreux dispositifs existent pour financer votre projet.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">👥</span>
                  <div>
                    <p className="font-bold mb-2" style={{ color: '#1A1A1A' }}>
                      Ne faites pas cavalier seul
                    </p>
                    <p className="text-sm text-gray-700">
                      Entourez-vous de personnes qui ont réussi leur reconversion. Leur expérience vous évitera de nombreuses erreurs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🧘</span>
                  <div>
                    <p className="font-bold mb-2" style={{ color: '#1A1A1A' }}>
                      Acceptez le doute comme une étape normale
                    </p>
                    <p className="text-sm text-gray-700">
                      Il est normal d'hésiter. Le doute fait partie du processus. L'important est d'avancer malgré lui.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8️⃣ Section finale - Passez à l'action */}
        <section className="py-16 text-center" style={{ background: '#FAFAF8' }}>
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
              Prêt à trouver votre nouveau métier à 40 ans ?
            </h2>
            
            <p className="text-lg mb-8" style={{ color: '#6B7280' }}>
              Commencez par notre test d'orientation professionnelle adulte et découvrez les métiers qui vous correspondent vraiment.
            </p>
            
            <button
              onClick={() => {
                navigate('/bilan-reconversion-professionnelle');
                window.scrollTo(0, 0);
              }}
              className="px-10 py-4 font-bold text-lg rounded-xl transition-all hover:translate-y-[-2px] mb-6"
              style={{
                background: '#E96A3C',
                color: '#FFFFFF',
                border: '3px solid #1A1A1A',
                boxShadow: '6px 6px 0 #1A1A1A'
              }}
            >
              Faire le test d'orientation
            </button>

            <p className="text-sm mb-8" style={{ color: '#6B7280' }}>
              Test rapide, gratuit, conçu spécifiquement pour les adultes en reconversion professionnelle.
            </p>

            {/* Liens internes SEO */}
            <div className="mt-8 pt-8" style={{ borderTop: '2px solid #E6DCCC' }}>
              <p className="text-sm text-gray-600">
                Découvrez aussi :{' '}
                <a 
                  href="/conseils-reconversion-professionnelle" 
                  className="font-semibold hover:underline"
                  style={{ color: '#4F8A8B' }}
                >
                  Nos conseils pour réussir sa reconversion professionnelle
                </a>
                {' '}|{' '}
                <a 
                  href="/bilan-reconversion-professionnelle" 
                  className="font-semibold hover:underline"
                  style={{ color: '#4F8A8B' }}
                >
                  Bilan de compétences en ligne
                </a>
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default MetierReconversion40Ans;

