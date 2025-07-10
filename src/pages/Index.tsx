import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CgvModal from "@/components/checkout/CgvModal";

const Index = () => {
  const navigate = useNavigate();
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null);
  const [showCgvModal, setShowCgvModal] = useState(false);

  const benefits = [
    {
      icon: "🎯",
      title: "Un test clair et intelligent",
      description: "Conçu spécialement pour les ados, sans jargon compliqué"
    },
    {
      icon: "📋",
      title: "Un rapport personnalisé",
      description: "Agréable à lire, avec des pistes concrètes pour votre avenir"
    },
    {
      icon: "🗣️",
      title: "Un appel humain en français",
      description: "30 minutes avec un vrai coach pour affiner vos options"
    },
    {
      icon: "💰",
      title: "Prix mini, impact maxi",
      description: "18€ seulement pour débloquer votre orientation"
    }
  ];

  const testimonials = [
    {
      text: "Je me sentais perdu, j'ai adoré recevoir un plan concret après l'appel.",
      author: "Lucas, 17 ans",
      emoji: "😊"
    },
    {
      text: "Enfin un truc qui parle à mon fils et l'aide sans prise de tête.",
      author: "Delphine, maman d'Emma",
      emoji: "👩‍👧"
    }
  ];

  const faqs = [
    {
      question: "Combien de temps dure le test ?",
      answer: "Le questionnaire prend environ 10-15 minutes. Vous pouvez le faire à votre rythme et même le mettre en pause si besoin."
    },
    {
      question: "Qui sont les coachs ?",
      answer: "Nos coachs sont des professionnels certifiés en orientation scolaire et professionnelle, avec une expérience auprès des jeunes."
    },
    {
      question: "Que contient le rapport personnalisé ?",
      answer: "Votre rapport inclut vos points forts, des suggestions de filières, des métiers qui vous correspondent, et des prochaines étapes concrètes."
    },
    {
      question: "Comment se passe l'appel coaching ?",
      answer: "Un appel de 30 minutes par téléphone ou visio, où le coach reprend votre rapport avec vous et répond à toutes vos questions."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CgvModal open={showCgvModal} onClose={() => setShowCgvModal(false)} />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 mb-6 tracking-tight leading-tight">
            Enfin un test qui t'aide à trouver ta voie sans te perdre
            </h1>
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl px-6 py-4 shadow-sm max-w-2xl mx-auto">
                <span className="text-2xl">🎓</span>
                <span className="text-sm md:text-base text-purple-900 font-medium leading-relaxed">
                  Méthode inspirée de <span className="font-bold">Stanford & Harvard</span>, conçue pour t'aider à choisir une voie alignée avec ta personnalité.
                </span>
              </div>
            </div>
            
            {/* CTA principal - Test RIASEC mis en avant */}
            <div className="space-y-6">
              {/* Bouton principal RIASEC */}
              <div>
                <Button 
                  onClick={() => navigate('/test-riasec')}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-8 sm:px-12 py-6 text-lg sm:text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 border-2 border-white/20 w-full sm:w-auto max-w-sm sm:max-w-none mx-auto"
                >
                  <span className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl">👉</span>
                    <span>Commence le test gratuit</span>
                  </span>
                </Button>
              </div>
              
              {/* Sous-titre encourageant */}
              <p className="text-gray-600 text-lg font-medium max-w-lg mx-auto">
                <span className="text-emerald-600 font-semibold">Gratuit</span> • 
                <span className="text-blue-600 font-semibold"> 10 minutes</span> • 
                <span className="text-purple-600 font-semibold"> Résultats immédiats</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Ce que tu vas découvrir
            </h2>
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl px-6 py-3 shadow-sm">
              <span className="text-2xl">📊</span>
              <p className="text-blue-900 font-medium">
                <span className="font-bold">1 jeune sur 2</span> change d'orientation après le bac - 
                <span className="text-blue-700"> évite cette erreur coûteuse !</span>
              </p>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto space-y-20">
            {/* Capture 1 - Profil RIASEC - Image à gauche */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Titre mobile uniquement */}
              <div className="lg:hidden w-full text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
                  <span className="text-4xl mb-2 sm:mb-0">🧠</span>
                  <h3 className="font-bold text-lg sm:text-xl text-gray-800 leading-tight">
                    Le profil RIASEC + Traits de&nbsp;personnalité
                  </h3>
                </div>
              </div>
              
              <div className="flex-1 lg:max-w-lg">
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 p-6 shadow-lg">
                  <img 
                    src="/result1.png" 
                    alt="Profil RIASEC et traits de personnalité"
                    className="w-full h-auto rounded-xl shadow-sm"
                  />
                </div>
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                {/* Titre desktop uniquement */}
                <div className="hidden lg:flex items-center justify-start gap-3 mb-6">
                  <span className="text-3xl">🧠</span>
                  <h3 className="font-bold text-2xl text-gray-800">
                    Le profil RIASEC + Traits de personnalité
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <p className="font-bold text-xl text-primary">Découvre ton profil unique</p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Une combinaison de traits qui révèle ton potentiel et ta manière de penser. 
                    Fini les tests génériques - obtiens un profil détaillé qui te ressemble vraiment.
                  </p>
                </div>
              </div>
            </div>

            {/* Capture 2 - Compétences - Image à droite */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              {/* Titre mobile uniquement */}
              <div className="lg:hidden w-full text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-3xl">📊</span>
                  <h3 className="font-bold text-xl text-gray-800">
                    Compétences + Reco formations
                  </h3>
                </div>
              </div>
              
              <div className="flex-1 lg:max-w-lg">
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 p-6 shadow-lg">
                  <img 
                    src="/result2.png" 
                    alt="Radar des compétences et recommandations formations"
                    className="w-full h-auto rounded-xl shadow-sm"
                  />
                </div>
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                {/* Titre desktop uniquement */}
                <div className="hidden lg:flex items-center justify-start gap-3 mb-6">
                  <span className="text-3xl">📊</span>
                  <h3 className="font-bold text-2xl text-gray-800">
                    Compétences + Reco formations
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <p className="font-bold text-xl text-primary">Visualise tes points forts</p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Un radar clair qui met en lumière tes compétences naturelles + des pistes de formation 
                    adaptées à tes talents. Plus de doutes sur tes capacités !
                  </p>
                </div>
              </div>
            </div>

            {/* Capture 3 - Métiers - Image à gauche */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Titre mobile uniquement */}
              <div className="lg:hidden w-full text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-3xl">🧑‍💼</span>
                  <h3 className="font-bold text-xl text-gray-800">
                    Métiers qui te correspondent
                  </h3>
                </div>
              </div>
              
              <div className="flex-1 lg:max-w-lg">
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 p-6 shadow-lg">
                  <img 
                    src="/result3.png" 
                    alt="Métiers correspondant au profil"
                    className="w-full h-auto rounded-xl shadow-sm"
                  />
                </div>
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                {/* Titre desktop uniquement */}
                <div className="hidden lg:flex items-center justify-start gap-3 mb-6">
                  <span className="text-3xl">🧑‍💼</span>
                  <h3 className="font-bold text-2xl text-gray-800">
                    Métiers qui te correspondent
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <p className="font-bold text-xl text-primary">Des métiers concrets pour toi</p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Pas de théorie : découvre les jobs alignés avec qui tu es vraiment. 
                    Des suggestions précises avec les débouchés et salaires moyens.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefices" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Pourquoi choisir Avenirea ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une approche unique qui combine technologie et accompagnement humain
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card 
                key={index}
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 shadow-sm"
                onMouseEnter={() => setHoveredBenefit(index)}
                onMouseLeave={() => setHoveredBenefit(null)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`text-4xl mb-4 transition-transform duration-300 ${hoveredBenefit === index ? 'scale-110' : ''}`}>
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold text-primary mb-2 text-lg">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="temoignages" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600">
              Des témoignages authentiques de nos utilisateurs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-8">
                  <div className="text-3xl mb-4">{testimonial.emoji}</div>
                  <blockquote className="text-lg text-gray-700 mb-4 italic leading-relaxed">
                    "{testimonial.text}"
                  </blockquote>
                  <cite className="text-primary font-medium">
                    {testimonial.author}
                  </cite>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Tout ce que vous devez savoir sur Avenirea
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-white rounded-2xl border-0 shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium text-primary hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Prêt à découvrir ton profil professionnel&nbsp;?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Rejoins les centaines d'étudiants qui ont déjà clarifié leur avenir avec le test RIASEC
            </p>
            
            <Button 
              onClick={() => navigate('/test-riasec')}
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-10 py-5 text-lg rounded-2xl font-bold transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center gap-2">
                <span>Commencer mon test</span>
                <span className="text-xl">🚀</span>
              </span>
            </Button>
          </div>
        </div>
      </section>

      <Footer onOpenCgvModal={() => setShowCgvModal(true)} />
    </div>
  );
};

export default Index;
