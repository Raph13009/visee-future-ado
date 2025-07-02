
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const Test = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const questions = [
    {
      id: 0,
      title: "Qu'est-ce qui te motive le plus ?",
      type: "single",
      options: [
        "Aider les autres et avoir un impact positif",
        "Créer, innover et exprimer ma créativité",
        "Résoudre des problèmes complexes",
        "Diriger et prendre des décisions importantes",
        "Travailler avec mes mains et créer du concret"
      ]
    },
    {
      id: 1,
      title: "Dans quel environnement te sens-tu le mieux ?",
      type: "single",
      options: [
        "En équipe, avec beaucoup d'interactions",
        "Seul(e), dans le calme pour me concentrer",
        "Dans un mix équilibré selon les projets",
        "En mouvement, pas toujours au même endroit",
        "Dans un cadre structuré avec des règles claires"
      ]
    },
    {
      id: 2,
      title: "Quelles matières t'intéressent le plus ?",
      type: "multiple",
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
      id: 3,
      title: "Comment vois-tu ton équilibre vie pro/perso ?",
      type: "single",
      options: [
        "Je veux une carrière intense, je suis ambitieux",
        "L'équilibre est crucial, pas de stress excessif",
        "Ça dépendra de ma passion pour le métier",
        "Je préfère plus de temps libre quitte à gagner moins",
        "Je veux de la flexibilité pour voyager/bouger"
      ]
    },
    {
      id: 4,
      title: "Quel est ton plus grand talent ?",
      type: "single",
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-primary">
                Question {currentStep + 1} sur {questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progress)}% complété
              </span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-200" />
          </div>

          {/* Question Card */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-primary leading-tight">
                {currentQuestion.title}
              </CardTitle>
              {currentQuestion.type === "multiple" && (
                <p className="text-sm text-gray-500 mt-2">
                  Plusieurs réponses possibles
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-4 text-left rounded-2xl border transition-all hover:shadow-md ${
                      isAnswerSelected(option)
                        ? "bg-primary/10 border-primary text-primary font-medium"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex-shrink-0 ${
                        isAnswerSelected(option)
                          ? "bg-primary border-primary"
                          : "border-gray-300"
                      }`}>
                        {isAnswerSelected(option) && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
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
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-6 py-2 rounded-2xl"
            >
              Précédent
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-primary"
              >
                Sauvegarder et continuer plus tard
              </Button>
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-2xl transition-all hover:scale-105"
            >
              {currentStep === questions.length - 1 ? "Terminer" : "Suivant"}
            </Button>
          </div>

          {/* Encouragement */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              {currentStep < questions.length - 1 
                ? "Courage, vous y êtes presque ! 💪"
                : "Dernière question, vous touchez au but ! 🎯"
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
