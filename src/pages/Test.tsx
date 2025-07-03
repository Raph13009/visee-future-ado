import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";

const Test = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isAnimating, setIsAnimating] = useState(false);

  const questions = [
    {
      id: 0,
      title: "Si tu pouvais passer une journée dans la peau de n'importe quel professionnel, qui choisirais-tu et pourquoi ?",
      type: "single" as const,
      options: [
        "Un(e) scientifique ou ingénieur(e)",
        "Un(e) entrepreneur(e) ou chef(fe) d'entreprise",
        "Un(e) artiste ou créateur(trice)",
        "Un(e) professionnel(le) de la santé ou du social",
        "Un(e) enseignant(e) ou chercheur(se)",
        "Autre (précise)"
      ]
    },
    {
      id: 1,
      title: "Parmi ces situations, laquelle te motive le plus ?",
      type: "single" as const,
      options: [
        "Résoudre un problème complexe en équipe",
        "Créer un projet de A à Z",
        "Aider concrètement des personnes",
        "Apprendre et transmettre des connaissances",
        "Organiser et gérer des événements ou des ressources"
      ]
    },
    {
      id: 2,
      title: "Comment te vois-tu évoluer dans 10 ans ?",
      type: "single" as const,
      options: [
        "À la tête d'une équipe ou d'une entreprise",
        "Expert(e) dans un domaine pointu",
        "Polyvalent(e), avec plusieurs expériences variées",
        "Engagé(e) dans une cause ou un projet à impact",
        "Je ne sais pas encore, mais je veux garder des portes ouvertes"
      ]
    },
    {
      id: 3,
      title: "Quelles sont les valeurs qui comptent le plus pour toi dans ton futur métier ?",
      type: "single" as const,
      options: [
        "Innovation et créativité",
        "Sécurité et stabilité",
        "Utilité sociale",
        "Liberté et autonomie",
        "Reconnaissance et prestige"
      ]
    },
    {
      id: 4,
      title: "Quel environnement de travail t'attire le plus ?",
      type: "single" as const,
      options: [
        "Bureau dynamique et collaboratif",
        "Lieux variés, déplacements fréquents",
        "Travail à distance ou indépendant",
        "Contact direct avec le public",
        "Laboratoire ou environnement technique"
      ]
    },
    {
      id: 5,
      title: "Face à un nouvel apprentissage, tu préfères :",
      type: "single" as const,
      options: [
        "Expérimenter par toi-même, quitte à faire des erreurs",
        "Être guidé(e) étape par étape",
        "Travailler en groupe pour échanger des idées",
        "Suivre des cours structurés et approfondis"
      ]
    },
    {
      id: 6,
      title: "Quelle place accordes-tu à l'équilibre vie pro/vie perso ?",
      type: "single" as const,
      options: [
        "Priorité à l'équilibre, je veux du temps pour moi",
        "Je suis prêt(e) à m'investir beaucoup pour réussir",
        "Je cherche un compromis selon les périodes",
        "Je ne sais pas encore, cela dépendra du projet"
      ]
    },
    {
      id: 7,
      title: "As-tu déjà identifié des freins ou des peurs concernant ton orientation ?",
      type: "single" as const,
      options: [
        "Oui, j'ai peur de me tromper de voie",
        "Oui, je crains de ne pas être à la hauteur",
        "Oui, j'ai des contraintes familiales ou financières",
        "Non, je me sens confiant(e)",
        "Autre (précise)"
      ]
    },
    {
      id: 8,
      title: "Quelle importance accordes-tu à l'international dans ton parcours ?",
      type: "single" as const,
      options: [
        "Je veux absolument partir à l'étranger",
        "J'aimerais avoir des opportunités internationales",
        "Je préfère rester en France",
        "Je n'y ai pas encore réfléchi"
      ]
    },
    {
      id: 9,
      title: "Pour finir, quel serait ton rêve professionnel si tout était possible ?",
      type: "text" as const,
      options: []
    }
  ];

  // Messages d'encouragement différents pour chaque question
  const encouragementMessages = [
    "Excellente première question ! Continuons ensemble 🚀",
    "Tu prends forme ! Encore quelques questions 💪",
    "C'est parfait ! On avance bien 🎯",
    "Super ! Tu es à mi-parcours 🌟",
    "Génial ! On progresse 🔥",
    "Très bien ! Plus que quelques questions 💫",
    "Excellent ! Tu touches au but 🎊",
    "Parfait ! Dernière ligne droite 🏁",
    "Bravo ! Une dernière question 🎉",
    "Dernière question, tu y es presque ! 🎁"
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
    newAnswers[currentStep] = option;
    setAnswers(newAnswers);
  };

  const handleTextAnswer = (value: string) => {
    const newAnswers = { ...answers };
    newAnswers[currentStep] = value;
    setAnswers(newAnswers);
  };

  const isAnswerSelected = (option: string) => {
    const currentAnswer = answers[currentStep];
    if (!currentAnswer) return false;
    return currentAnswer === option;
  };

  const canProceed = () => {
    return answers[currentStep] && answers[currentStep].trim() !== "";
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Test completed, store answers and go to checkout
      handleTestCompletion();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTestCompletion = async () => {
    try {
      // Store test answers in localStorage for checkout
      localStorage.setItem('testAnswers', JSON.stringify(answers));
      
      // Navigate to checkout
      navigate('/checkout');
    } catch (error) {
      console.error('Error storing test data:', error);
      // Still navigate to checkout even if storage fails
      navigate('/checkout');
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
              {currentQuestion.type === "text" && (
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  Réponse libre
                </p>
              )}
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              {currentQuestion.type === "text" ? (
                <textarea
                  value={answers[currentStep] || ""}
                  onChange={(e) => handleTextAnswer(e.target.value)}
                  placeholder="Partage ton rêve professionnel..."
                  className="w-full p-4 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 min-h-[120px] resize-none text-sm sm:text-base"
                />
              ) : (
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
              )}
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
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50"
            >
              {currentStep === questions.length - 1 ? "Obtenir mes résultats" : "Suivant"}
            </Button>
          </div>

          {/* Encouragement */}
          <div className="text-center">
            <p className="text-gray-600 text-sm animate-fade-in">
              {encouragementMessages[currentStep]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
