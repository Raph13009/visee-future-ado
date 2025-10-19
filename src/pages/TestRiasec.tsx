import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ProgressBar from "@/components/test/ProgressBar";
import QuestionCard from "@/components/test/QuestionCard";
import NavigationButtons from "@/components/test/NavigationButtons";
import EncouragementMessage from "@/components/test/EncouragementMessage";
import { Helmet } from 'react-helmet-async';
import { supabase } from "@/integrations/supabase/client";

interface RiasecAnswer {
  option: string;
  letter: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
}

const TestRiasec = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, RiasecAnswer>>({});
  const [isAnimating, setIsAnimating] = useState(false);

  // Récupérer le type de bilan depuis localStorage
  const bilanType = localStorage.getItem('bilanType') || 'scolaire';

  // Questions pour l'orientation scolaire (jeunes)
  const questionsJeunes = [
    {
      id: 0,
      title: "Tu préfères...",
      type: "single" as const,
      options: [
        { text: "Construire ou réparer quelque chose 🔧", letter: 'R' as const },
        { text: "Résoudre une énigme ou analyser une situation 🧠", letter: 'I' as const },
        { text: "Imaginer un logo ou créer un montage 🎨", letter: 'A' as const },
        { text: "Aider quelqu'un ou écouter ses problèmes 🧍", letter: 'S' as const },
        { text: "Prendre des décisions ou convaincre 💼", letter: 'E' as const },
        { text: "Organiser un planning ou classer des infos 📁", letter: 'C' as const }
      ]
    },
    {
      id: 1,
      title: "Quand t'as un moment libre, tu aimes...",
      type: "single" as const,
      options: [
        { text: "Toucher, bricoler, bidouiller 🪚", letter: 'R' as const },
        { text: "Chercher des infos par toi-même 🔍", letter: 'I' as const },
        { text: "Écrire, chanter, filmer, dessiner 🖋️", letter: 'A' as const },
        { text: "Discuter avec un ami ou aider à réviser 🤝", letter: 'S' as const },
        { text: "Monter un projet ou lancer une idée 🚀", letter: 'E' as const },
        { text: "Ranger ta chambre ou faire des listes 🗂️", letter: 'C' as const }
      ]
    },
    {
      id: 2,
      title: "À l'école, tu préférais...",
      type: "single" as const,
      options: [
        { text: "Les TP, la techno, la SVT 🔬", letter: 'R' as const },
        { text: "Les maths ou la philo 📐", letter: 'I' as const },
        { text: "L'art plastique ou la musique 🎭", letter: 'A' as const },
        { text: "L'EMC ou aider les autres à comprendre 📚", letter: 'S' as const },
        { text: "Les exposés ou les débats 🗣️", letter: 'E' as const },
        { text: "Les exercices organisés et bien expliqués 📊", letter: 'C' as const }
      ]
    },
    {
      id: 3,
      title: "Ce qui t'ennuie le plus, c'est...",
      type: "single" as const,
      options: [
        { text: "Ne rien faire de tes mains ⛔🔧", letter: 'R' as const },
        { text: "Devoir suivre sans comprendre ⛔🧠", letter: 'I' as const },
        { text: "Manquer de liberté créative ⛔🎨", letter: 'A' as const },
        { text: "Voir quelqu'un galérer seul ⛔🤝", letter: 'S' as const },
        { text: "Devoir attendre ou suivre des règles ⛔📏", letter: 'E' as const },
        { text: "Travailler dans le flou ⛔📂", letter: 'C' as const }
      ]
    },
    {
      id: 4,
      title: "Tu rêves d'un métier où tu pourrais...",
      type: "single" as const,
      options: [
        { text: "Être sur le terrain, actif 👷", letter: 'R' as const },
        { text: "Comprendre le \"pourquoi du comment\" 🔬", letter: 'I' as const },
        { text: "Créer, inventer, proposer 🎨", letter: 'A' as const },
        { text: "Être utile à quelqu'un ❤️", letter: 'S' as const },
        { text: "Influencer, diriger ou gérer 📈", letter: 'E' as const },
        { text: "Tout organiser, planifier, structurer 📅", letter: 'C' as const }
      ]
    },
    {
      id: 5,
      title: "On te décrit souvent comme...",
      type: "single" as const,
      options: [
        { text: "Pratique et débrouillard 🧰", letter: 'R' as const },
        { text: "Curieux et logique 🧠", letter: 'I' as const },
        { text: "Créatif et original 🎭", letter: 'A' as const },
        { text: "Gentil et à l'écoute 💬", letter: 'S' as const },
        { text: "Charismatique et motivant 🔥", letter: 'E' as const },
        { text: "Rigoureux et organisé 📋", letter: 'C' as const }
      ]
    },
    {
      id: 6,
      title: "Dans un groupe, tu es plutôt...",
      type: "single" as const,
      options: [
        { text: "Celui qui trouve des solutions pratiques 🔧", letter: 'R' as const },
        { text: "Celui qui analyse et réfléchit 🤔", letter: 'I' as const },
        { text: "Celui qui propose des idées créatives 💡", letter: 'A' as const },
        { text: "Celui qui écoute et rassemble 🤗", letter: 'S' as const },
        { text: "Celui qui prend les initiatives 🚀", letter: 'E' as const },
        { text: "Celui qui organise et planifie 📋", letter: 'C' as const }
      ]
    },
    {
      id: 7,
      title: "Ton environnement de travail idéal serait...",
      type: "single" as const,
      options: [
        { text: "Un atelier ou un terrain 🏗️", letter: 'R' as const },
        { text: "Un laboratoire ou une bibliothèque 📚", letter: 'I' as const },
        { text: "Un studio ou un espace créatif 🎨", letter: 'A' as const },
        { text: "Un lieu d'échange et de rencontre 👥", letter: 'S' as const },
        { text: "Un bureau de direction ou de négociation 💼", letter: 'E' as const },
        { text: "Un bureau organisé et structuré 🗃️", letter: 'C' as const }
      ]
    },
    {
      id: 8,
      title: "Face à un problème, tu...",
      type: "single" as const,
      options: [
        { text: "Tu agis directement pour le résoudre 🔨", letter: 'R' as const },
        { text: "Tu cherches à comprendre les causes 🔍", letter: 'I' as const },
        { text: "Tu imagines des solutions originales 🌟", letter: 'A' as const },
        { text: "Tu demandes l'avis d'autres personnes 💬", letter: 'S' as const },
        { text: "Tu prends rapidement une décision 📊", letter: 'E' as const },
        { text: "Tu fais un plan méthodique 📝", letter: 'C' as const }
      ]
    },
    {
      id: 9,
      title: "Ce qui te motive le plus, c'est...",
      type: "single" as const,
      options: [
        { text: "Voir un résultat concret 🏗️", letter: 'R' as const },
        { text: "Comprendre comment ça marche 🔬", letter: 'I' as const },
        { text: "Créer quelque chose d'unique 🎭", letter: 'A' as const },
        { text: "Aider quelqu'un à progresser 🌱", letter: 'S' as const },
        { text: "Atteindre un objectif ambitieux 🎯", letter: 'E' as const },
        { text: "Avoir un travail bien fait 📊", letter: 'C' as const }
      ]
    },
    {
      id: 10,
      title: "Dans tes loisirs, tu préfères...",
      type: "single" as const,
      options: [
        { text: "Faire du sport ou du bricolage 🏃", letter: 'R' as const },
        { text: "Lire, regarder des documentaires 📖", letter: 'I' as const },
        { text: "Faire de l'art, de la musique 🎵", letter: 'A' as const },
        { text: "Passer du temps avec des amis 👫", letter: 'S' as const },
        { text: "Organiser des événements 🎉", letter: 'E' as const },
        { text: "Collectionner, ranger, classer 📚", letter: 'C' as const }
      ]
    },
    {
      id: 11,
      title: "Pour finir, tu te vois plutôt...",
      type: "single" as const,
      options: [
        { text: "Travailler avec tes mains 👷", letter: 'R' as const },
        { text: "Faire de la recherche ou analyser 🔬", letter: 'I' as const },
        { text: "Créer et innover 🎨", letter: 'A' as const },
        { text: "Accompagner et former 👨‍🏫", letter: 'S' as const },
        { text: "Diriger et entreprendre 📈", letter: 'E' as const },
        { text: "Administrer et gérer 📋", letter: 'C' as const }
      ]
    }
  ];

  // Questions pour la reconversion professionnelle et tous publics (adultes)
  const questionsAdultes = [
    {
      id: 0,
      title: "Quand tu imagines ton futur métier, tu te vois plutôt...",
      type: "single" as const,
      options: [
        { text: "Fabriquer, réparer ou manipuler du concret", letter: 'R' as const },
        { text: "Observer, comprendre ou résoudre des problèmes complexes", letter: 'I' as const },
        { text: "Concevoir, imaginer ou exprimer des idées créatives", letter: 'A' as const },
        { text: "Aider, accompagner ou former d'autres personnes", letter: 'S' as const },
        { text: "Diriger, décider ou lancer des projets ambitieux", letter: 'E' as const },
        { text: "Structurer, planifier ou gérer l'administratif", letter: 'C' as const }
      ]
    },
    {
      id: 1,
      title: "Dans ton travail idéal, tu préfères...",
      type: "single" as const,
      options: [
        { text: "Travailler avec tes mains et voir un résultat concret", letter: 'R' as const },
        { text: "Faire des recherches ou analyser des données", letter: 'I' as const },
        { text: "Créer des visuels, écrire ou inventer des concepts", letter: 'A' as const },
        { text: "Être au contact des gens, écouter et conseiller", letter: 'S' as const },
        { text: "Motiver une équipe et prendre des décisions", letter: 'E' as const },
        { text: "Organiser, classer ou rendre les choses plus efficaces", letter: 'C' as const }
      ]
    },
    {
      id: 2,
      title: "Ce qui te donne le plus d'énergie, c'est...",
      type: "single" as const,
      options: [
        { text: "Résoudre un problème technique ou pratique", letter: 'R' as const },
        { text: "Trouver la logique cachée derrière un sujet", letter: 'I' as const },
        { text: "Imaginer quelque chose de nouveau ou d'original", letter: 'A' as const },
        { text: "Sentir que tu aides ou soutiens quelqu'un", letter: 'S' as const },
        { text: "Défendre une idée et convaincre ton entourage", letter: 'E' as const },
        { text: "Mettre de l'ordre et clarifier une situation", letter: 'C' as const }
      ]
    },
    {
      id: 3,
      title: "Quand tu apprends quelque chose, tu préfères...",
      type: "single" as const,
      options: [
        { text: "Faire toi-même, expérimenter", letter: 'R' as const },
        { text: "Comprendre en profondeur le pourquoi du comment", letter: 'I' as const },
        { text: "Visualiser ou créer à partir de ton imagination", letter: 'A' as const },
        { text: "En discuter avec d'autres et échanger", letter: 'S' as const },
        { text: "Te projeter sur comment l'utiliser pour atteindre un but", letter: 'E' as const },
        { text: "Suivre une méthode claire et bien structurée", letter: 'C' as const }
      ]
    },
    {
      id: 4,
      title: "Dans un projet d'équipe, ton rôle naturel, c'est...",
      type: "single" as const,
      options: [
        { text: "Le bricoleur ou le technicien, celui qui fait fonctionner les choses", letter: 'R' as const },
        { text: "Le cerveau analytique, celui qui cherche des solutions", letter: 'I' as const },
        { text: "Le créatif, celui qui donne l'idée originale", letter: 'A' as const },
        { text: "Le lien humain, celui qui comprend les autres", letter: 'S' as const },
        { text: "Le leader, celui qui donne la direction", letter: 'E' as const },
        { text: "L'organisateur, celui qui garde le cap et les délais", letter: 'C' as const }
      ]
    },
    {
      id: 5,
      title: "Ce qui t'ennuie le plus dans un travail, c'est...",
      type: "single" as const,
      options: [
        { text: "Rester trop longtemps assis sans rien manipuler", letter: 'R' as const },
        { text: "Faire sans comprendre le sens ou la logique", letter: 'I' as const },
        { text: "Devoir suivre des consignes rigides sans liberté", letter: 'A' as const },
        { text: "Être isolé ou sans contact humain", letter: 'S' as const },
        { text: "Ne pas pouvoir décider ou avancer", letter: 'E' as const },
        { text: "Le désordre, les imprévus, l'improvisation", letter: 'C' as const }
      ]
    },
    {
      id: 6,
      title: "Tu te sens le plus à l'aise quand tu...",
      type: "single" as const,
      options: [
        { text: "Utilises tes mains, outils ou machines", letter: 'R' as const },
        { text: "Observes, analyses et tires des conclusions", letter: 'I' as const },
        { text: "Exprimes des émotions ou une idée personnelle", letter: 'A' as const },
        { text: "Soutiens quelqu'un dans sa progression", letter: 'S' as const },
        { text: "Motives ou influences un groupe", letter: 'E' as const },
        { text: "Organises un système ou une méthode efficace", letter: 'C' as const }
      ]
    },
    {
      id: 7,
      title: "Si tu devais changer de métier demain, tu choisirais...",
      type: "single" as const,
      options: [
        { text: "Un métier manuel ou technique", letter: 'R' as const },
        { text: "Un métier de recherche ou d'analyse", letter: 'I' as const },
        { text: "Un métier artistique ou créatif", letter: 'A' as const },
        { text: "Un métier d'accompagnement humain", letter: 'S' as const },
        { text: "Un métier de gestion ou de direction d'équipe", letter: 'E' as const },
        { text: "Un métier d'organisation, de gestion ou de support", letter: 'C' as const }
      ]
    },
    {
      id: 8,
      title: "Ce que tu valorises le plus dans ton travail, c'est...",
      type: "single" as const,
      options: [
        { text: "La concrétisation, voir le résultat de mes efforts", letter: 'R' as const },
        { text: "La compréhension, apprendre en continu", letter: 'I' as const },
        { text: "L'expression personnelle et la liberté de créer", letter: 'A' as const },
        { text: "L'utilité sociale et la reconnaissance des autres", letter: 'S' as const },
        { text: "L'impact, la réussite, la progression", letter: 'E' as const },
        { text: "La rigueur, la stabilité, la fiabilité", letter: 'C' as const }
      ]
    },
    {
      id: 9,
      title: "Quand tu es face à un défi, tu as tendance à...",
      type: "single" as const,
      options: [
        { text: "Passer directement à l'action", letter: 'R' as const },
        { text: "Analyser calmement avant d'agir", letter: 'I' as const },
        { text: "Chercher une idée originale pour contourner l'obstacle", letter: 'A' as const },
        { text: "En parler avec d'autres pour trouver une solution", letter: 'S' as const },
        { text: "Prendre les devants et organiser les troupes", letter: 'E' as const },
        { text: "Chercher à structurer le problème pour mieux le résoudre", letter: 'C' as const }
      ]
    },
    {
      id: 10,
      title: "Le type d'environnement où tu t'épanouis le plus, c'est...",
      type: "single" as const,
      options: [
        { text: "Pratique, concret, sur le terrain", letter: 'R' as const },
        { text: "Calme, intellectuel, tourné vers la réflexion", letter: 'I' as const },
        { text: "Libre, expressif et stimulant", letter: 'A' as const },
        { text: "Chaleureux, collaboratif et humain", letter: 'S' as const },
        { text: "Dynamique, ambitieux, orienté résultats", letter: 'E' as const },
        { text: "Ordonné, stable et bien organisé", letter: 'C' as const }
      ]
    },
    {
      id: 11,
      title: "Quand tu réussis quelque chose, tu ressens le plus de fierté à...",
      type: "single" as const,
      options: [
        { text: "Avoir construit ou réparé quelque chose de tangible", letter: 'R' as const },
        { text: "Avoir compris un concept difficile", letter: 'I' as const },
        { text: "Avoir créé quelque chose d'unique", letter: 'A' as const },
        { text: "Avoir aidé quelqu'un à progresser", letter: 'S' as const },
        { text: "Avoir dirigé une initiative ou atteint un objectif collectif", letter: 'E' as const },
        { text: "Avoir mis de l'ordre dans le chaos et tout rendu plus clair", letter: 'C' as const }
      ]
    }
  ];

  // Sélectionner le bon set de questions selon le type de bilan
  const questions = bilanType === 'scolaire' ? questionsJeunes : questionsAdultes;

  const currentQuestion = questions[currentStep];

  // Animation effect when changing questions
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleAnswer = (option: string) => {
    const selectedOption = currentQuestion.options.find(opt => opt.text === option);
    if (selectedOption) {
      const newAnswers = { ...answers };
      newAnswers[currentStep] = {
        option: selectedOption.text,
        letter: selectedOption.letter
      };
      setAnswers(newAnswers);
    }
  };

  const canProceed = () => {
    return answers[currentStep] !== undefined;
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

  const calculateRiasecProfile = () => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    
    // Compter les réponses par lettre
    Object.values(answers).forEach(answer => {
      scores[answer.letter]++;
    });

    // Trouver les 2 lettres dominantes
    const sortedScores = Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2);

    let dominantProfile = sortedScores.map(([letter]) => letter).join('');
    
    // Normaliser le profil : convertir les codes inversés vers les codes standards
    const normalizeProfile = (profile: string): string => {
      const profileMappings: Record<string, string> = {
        // Codes inversés → codes standards
        'AI': 'IA', // Artistique + Investigateur → Innovateur Créatif
        'AR': 'RA', // Artistique + Réaliste → Artisan Créatif
        'AS': 'AS', // Déjà correct
        'AE': 'AE', // Déjà correct
        'AC': 'AC', // Déjà correct
        'IR': 'RI', // Investigateur + Réaliste → Pratique Curieux
        'IS': 'IS', // Déjà correct
        'IE': 'IE', // Déjà correct
        'IC': 'IC', // Déjà correct
        'SR': 'RS', // Social + Réaliste → Pratique Solidaire
        'SA': 'AS', // Social + Artistique → Créatif Humain
        'SI': 'IS', // Social + Investigateur → Chercheur Humaniste
        'SE': 'SE', // Déjà correct
        'SC': 'SC', // Déjà correct
        'ER': 'RE', // Entreprenant + Réaliste → Entrepreneur Pratique
        'EA': 'AE', // Entreprenant + Artistique → Visionnaire Charismatique
        'EI': 'IE', // Entreprenant + Investigateur → Expert Influent
        'ES': 'SE', // Entreprenant + Social → Leader Bienveillant
        'EC': 'EC', // Déjà correct
        'CR': 'RC', // Conventionnel + Réaliste → Technicien Rigoureux
        'CA': 'AC', // Conventionnel + Artistique → Artiste Méthodique
        'CI': 'IC', // Conventionnel + Investigateur → Analyste Méthodique
        'CS': 'SC', // Conventionnel + Social → Accompagnateur Structuré
        'CE': 'EC'  // Conventionnel + Entreprenant → Manager Organisé
      };
      
      return profileMappings[profile] || profile;
    };
    
    dominantProfile = normalizeProfile(dominantProfile);
    
    return { scores, dominantProfile };
  };

  const handleTestCompletion = async () => {
    const { scores, dominantProfile } = calculateRiasecProfile();
    

    
    try {
      // Stocker les résultats dans localStorage
      const riasecResults = {
        answers,
        scores,
        dominantProfile
      };
      localStorage.setItem('riasecResults', JSON.stringify(riasecResults));
      
      // Insérer dans Supabase
      try {
        const profileNames: Record<string, string> = {
          'R': 'Le Pratique',
          'I': 'Le Curieux', 
          'A': 'Le Créatif',
          'S': 'L\'Humain',
          'E': 'Le Leader',
          'C': 'L\'Organisateur',
          'RI': 'Le Pratique Curieux',
          'RA': 'L\'Artisan Créatif',
          'RS': 'Le Pratique Solidaire',
          'RE': 'L\'Entrepreneur Pratique',
          'RC': 'Le Technicien Rigoureux',
          'IA': 'L\'Innovateur Créatif',
          'IS': 'Le Chercheur Humaniste',
          'IE': 'L\'Expert Influent',
          'IC': 'L\'Analyste Méthodique',
          'AS': 'Le Créatif Humain',
          'AE': 'Le Visionnaire Charismatique',
          'AC': 'L\'Artiste Méthodique',
          'SE': 'Le Leader Bienveillant',
          'SC': 'L\'Accompagnateur Structuré',
          'EC': 'Le Manager Organisé'
        };

        const profileName = profileNames[dominantProfile] || 'Profil Unique';

        // Récupérer le nom, l'email et le type depuis localStorage
        const userName = localStorage.getItem('userName') || "Non renseigné";
        const userEmail = localStorage.getItem('userEmail') || "Non renseigné";
        const bilanType = localStorage.getItem('bilanType') || "scolaire"; // scolaire par défaut

        const resultData = {
          name: userName,
          email: userEmail,
          r_score: scores.R,
          i_score: scores.I,
          a_score: scores.A,
          s_score: scores.S,
          e_score: scores.E,
          c_score: scores.C,
          dominant_profile: dominantProfile,
          profile_name: profileName,
          detailed_answers: answers as any,
          payment: null,
          total_price: 0,
          include_monthly_coaching: false,
          type: bilanType
        };

        console.log('[SUPABASE][RIASEC] Inserting result:', resultData);
        const { error, data } = await supabase.from('riasec_results').insert([resultData]).select('id');
        if (error) {
          console.error('[SUPABASE][RIASEC] Insert error:', error);
        } else {
          console.log('[SUPABASE][RIASEC] Insert success:', data);
          // Stocker l'ID pour la mise à jour ultérieure lors du paiement
          if (data && data[0] && data[0].id) {
            localStorage.setItem('riasecResultId', data[0].id);
          }
        }
      } catch (err) {
        console.error('[SUPABASE][RIASEC] General error:', err);
      }
      
      navigate(`/resultats-riasec?profile=${dominantProfile}`);
    } catch (error) {
      console.error('Error storing RIASEC test data:', error);
      navigate(`/resultats-riasec?profile=${dominantProfile}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>Test RIASEC Avenirea | Découvre ton profil professionnel</title>
        <meta name="description" content="Passe le test RIASEC et découvre ton profil professionnel parmi 15 combinaisons possibles. Test rapide basé sur le modèle scientifique de Holland." />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <Header hideTestCTA={true} />
        
        <div className="pt-20 pb-8 px-3 sm:px-4">
          <div className="container mx-auto max-w-lg">
            <ProgressBar 
              currentStep={currentStep} 
              totalSteps={questions.length} 
            />

            <QuestionCard
              question={{
                id: currentQuestion.id,
                title: currentQuestion.title,
                type: currentQuestion.type,
                options: currentQuestion.options.map(opt => opt.text)
              }}
              currentAnswer={answers[currentStep]?.option}
              isAnimating={isAnimating}
              onAnswer={handleAnswer}
              onTextAnswer={() => {}} // Pas utilisé pour RIASEC
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
    </>
  );
};

export default TestRiasec; 