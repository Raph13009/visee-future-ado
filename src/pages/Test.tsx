
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import PaymentSuccessModal from "@/components/PaymentSuccessModal";

const Test = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const questions = [
    {
      id: 0,
      title: "Tu es dans quelle filière actuellement ?",
      type: "single" as const,
      options: [
        "Bac général (Scientifique / Littéraire / Éco)",
        "Bac pro",
        "Bac techno",
        "Autre"
      ]
    },
    {
      id: 1,
      title: "Qu'est-ce qui te motive le plus ?",
      type: "single" as const,
      options: [
        "Aider les autres et avoir un impact positif",
        "Créer, innover et exprimer ma créativité",
        "Résoudre des problèmes complexes",
        "Diriger et prendre des décisions importantes",
        "Travailler avec mes mains et créer du concret"
      ]
    },
    {
      id: 2,
      title: "Dans quel environnement te sens-tu le mieux ?",
      type: "single" as const,
      options: [
        "En équipe, avec beaucoup d'interactions",
        "Seul(e), dans le calme pour me concentrer",
        "Dans un mix équilibré selon les projets",
        "En mouvement, pas toujours au même endroit",
        "Dans un cadre structuré avec des règles claires"
      ]
    },
    {
      id: 3,
      title: "Quelles matières t'intéressent le plus ?",
      type: "multiple" as const,
      options: [
        "Sciences (maths, physique, SVT)",
        "Langues et littérature",
        "Histoire et géographie",
        "Arts et design",
        "Sport et bien-être",
        "Économie et gestion"
      ]
    },
    {
      id: 4,
      title: "Comment vois-tu ton équilibre vie pro/perso ?",
      type: "single" as const,
      options: [
        "Je veux une carrière intense, je suis ambitieux",
        "L'équilibre est crucial, pas de stress excessif",
        "Ça dépendra de ma passion pour le métier",
        "Je préfère plus de temps libre quitte à gagner moins",
        "Je veux de la flexibilité pour voyager/bouger"
      ]
    },
    {
      id: 5,
      title: "Quel est ton plus grand talent ?",
      type: "single" as const,
      options: [
        "Je communique facilement avec tout le monde",
        "Je suis très organisé(e) et méthodique",
        "J'ai une grande créativité et imagination",
        "Je résous les problèmes rapidement",
        "Je suis empathique et à l'écoute des autres"
      ]
    }
  ];

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  // Animation effect when changing questions
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleAnswer = (option: string) => {
    const newAnswers = { ...answers };
    
    if (currentQuestion.type === "multiple") {
      const currentAnswers = newAnswers[currentStep]?.split(",") || [];
      if (currentAnswers.includes(option)) {
        const filtered = currentAnswers.filter(a => a !== option);
        newAnswers[currentStep] = filtered.join(",");
      } else {
        newAnswers[currentStep] = [...currentAnswers, option].join(",");
      }
    } else {
      newAnswers[currentStep] = option;
    }
    
    setAnswers(newAnswers);
  };

  const isAnswerSelected = (option: string) => {
    const currentAnswer = answers[currentStep];
    if (!currentAnswer) return false;
    
    if (currentQuestion.type === "multiple") {
      return currentAnswer.split(",").includes(option);
    }
    
    return currentAnswer === option;
  };

  const canProceed = () => {
    return answers[currentStep] && answers[currentStep].trim() !== "";
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Test completed, go to checkout
      navigate('/checkout');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePayment = async () => {
    // Simulate payment processing
    try {
      // Store lead in Supabase
      const leadData = {
        name: "Test User", // In a real app, this would come from a form
        email: "test@example.com", // In a real app, this would come from a form
        current_filiere: answers[0] || "Non spécifié",
        key_answers: answers
      };

      const { error } = await supabase
        .from('leads')
        .insert([leadData]);

      if (error) {
        console.error('Error storing lead:', error);
      } else {
        console.log('Lead stored successfully');
      }

      // Show success modal after a short delay (simulating payment processing)
      setTimeout(() => {
        setShowPaymentSuccess(true);
      }, 1500);
    } catch (error) {
      console.error('Payment simulation error:', error);
      // Still show success for simulation purposes
      setTimeout(() => {
        setShowPaymentSuccess(true);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-8 px-3 sm:px-4">
        <div className="container mx-auto max-w-lg">
          {/* Progress Bar */}
          <div className="mb-6 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm font-medium text-primary">
                Question {currentStep + 1} sur {questions.length}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress 
              value={progress} 
              className="h-2 bg-gray-200 transition-all duration-500 ease-out" 
            />
          </div>

          {/* Question Card */}
          <Card className={`mb-6 border-0 shadow-lg transition-all duration-300 ${
            isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            <CardHeader className="pb-3 px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl text-primary leading-tight">
                {currentQuestion.title}
              </CardTitle>
              {currentQuestion.type === "multiple" && (
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  Plusieurs réponses possibles
                </p>
              )}
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-2.5">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-3 sm:p-4 text-left text-sm sm:text-base rounded-xl border transition-all duration-200 hover:shadow-md transform hover:scale-[1.02] ${
                      isAnswerSelected(option)
                        ? "bg-primary/10 border-primary text-primary font-medium shadow-sm"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 mr-3 flex-shrink-0 mt-0.5 transition-all duration-200 ${
                        isAnswerSelected(option)
                          ? "bg-primary border-primary scale-110"
                          : "border-gray-300"
                      }`}>
                        {isAnswerSelected(option) && (
                          <div className="w-full h-full rounded-full bg-white scale-50 transition-transform duration-200"></div>
                        )}
                      </div>
                      <span className="leading-relaxed">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-2 mb-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-4 sm:px-6 py-2 rounded-xl text-sm transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            >
              Précédent
            </Button>

            <Button
              onClick={currentStep === questions.length - 1 ? handlePayment : handleNext}
              disabled={!canProceed()}
              className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50"
            >
              {currentStep === questions.length - 1 ? "Obtenir mes résultats" : "Suivant"}
            </Button>
          </div>

          {/* Encouragement */}
          <div className="text-center">
            <p className="text-gray-600 text-sm animate-fade-in">
              {currentStep < questions.length - 1 
                ? "Courage, vous y êtes presque ! 💪"
                : "Dernière question, vous touchez au but ! 🎯"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Payment Success Modal */}
      <PaymentSuccessModal 
        isOpen={showPaymentSuccess}
        onClose={() => setShowPaymentSuccess(false)}
      />
    </div>
  );
};

export default Test;
