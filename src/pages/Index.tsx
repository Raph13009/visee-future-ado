import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Index = () => {
  const navigate = useNavigate();
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null);

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
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 tracking-tight leading-tight">
              Trouver sa voie n'a jamais été aussi simple
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Un test rapide + un coach humain = une orientation plus claire
            </p>
            
            <Button 
              onClick={() => navigate('/test')}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg rounded-2xl font-medium transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Commencer le test 🚀
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefices" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Pourquoi choisir Orienteo ?
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
              Tout ce que vous devez savoir sur Orienteo
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
              Prêt à découvrir votre voie ?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Rejoignez les centaines d'étudiants qui ont déjà clarifié leur avenir
            </p>
            
            <Button 
              onClick={() => navigate('/test')}
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 text-lg rounded-2xl font-medium transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Commencer maintenant ✨
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
