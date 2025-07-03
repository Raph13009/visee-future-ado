
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ProgressBar from "@/components/test/ProgressBar";
import QuestionCard from "@/components/test/QuestionCard";
import NavigationButtons from "@/components/test/NavigationButtons";
import EncouragementMessage from "@/components/test/EncouragementMessage";

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

  const currentQuestion = questions[currentStep];

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

  const canProceed = () => {
    return answers[currentStep] && answers[currentStep].trim() !== "";
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
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
      localStorage.setItem('testAnswers', JSON.stringify(answers));
      navigate('/checkout');
    } catch (error) {
      console.error('Error storing test data:', error);
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-8 px-3 sm:px-4">
        <div className="container mx-auto max-w-lg">
          <ProgressBar 
            currentStep={currentStep} 
            totalSteps={questions.length} 
          />

          <QuestionCard
            question={currentQuestion}
            currentAnswer={answers[currentStep]}
            isAnimating={isAnimating}
            onAnswer={handleAnswer}
            onTextAnswer={handleTextAnswer}
          />

          <NavigationButtons
            currentStep={currentStep}
            totalSteps={questions.length}
            canProceed={canProceed()}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />

          <EncouragementMessage currentStep={currentStep} />
        </div>
      </div>
    </div>
  );
};

export default Test;
