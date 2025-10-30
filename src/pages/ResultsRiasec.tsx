import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LockedSection from "@/components/LockedSection";
import PromoModal from "@/components/PromoModal";
import PaymentModal from "@/components/PaymentModal";
import { supabase } from "@/integrations/supabase/client";
import CoachingCTA from "@/components/coaching/CoachingCTA";
import OptimizedImage from "@/components/OptimizedImage";

// Déclaration TypeScript pour gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

interface RiasecProfile {
  code: string;
  name: string;
  description: string;
  traits: Array<{emoji: string, label: string}>;
  radarScores: {
    ponctualite: number;
    resolutionProblemes: number;
    resistanceStress: number;
    connaissanceMarche: number;
    competencesInterpersonnelles: number;
  };
  formations: Array<{name: string, duration: string, level: string, levelCode?: string, pitch?: string, icon?: string}>;
  careers: Array<{name: string, level: string, pathway?: string, description?: string, icon?: string, tag?: string}>;
  environment: string;
  advice: string;
  strengths?: string[]; // Pour les profils adultes
}

// Profils pour l'orientation scolaire (jeunes)
const riasecProfilesJeunes: RiasecProfile[] = [
  {
    code: "RI",
    name: "Le Pratique Curieux",
    description: "Tu aimes comprendre comment les choses fonctionnent pour mieux les manipuler et les améliorer.",
    traits: [
      {emoji: "🔬", label: "Curieux"},
      {emoji: "👁️", label: "Observateur"},
      {emoji: "🔧", label: "Pratique"},
      {emoji: "📊", label: "Méthodique"}
    ],
    radarScores: {ponctualite: 3, resolutionProblemes: 5, resistanceStress: 3, connaissanceMarche: 2, competencesInterpersonnelles: 3},
    formations: [
      {name: "BUT Génie mécanique", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour apprendre à concevoir, tester et produire des systèmes mécaniques", icon: "⚙️"},
      {name: "Licence Sciences pour l'ingénieur", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour ceux qui veulent comprendre les lois physiques derrière les objets", icon: "🔬"},
      {name: "Classe prépa TSI", duration: "2 ans", level: "Niveau 5", levelCode: "BTS", pitch: "Pour intégrer une école d'ingénieur en venant d'un bac techno", icon: "🏗️"},
      {name: "BTS Électrotechnique", duration: "2 ans", level: "Niveau 5", levelCode: "BTS", pitch: "Pour travailler dans l'installation et la maintenance de systèmes électriques", icon: "🔌"}
    ],
    careers: [
      {name: "Technicien en robotique", level: "BTS / BUT", pathway: "Formation technique + stage", description: "Tu montes, programmes ou entretiens des robots dans l'industrie", icon: "🤖", tag: "🎯"},
      {name: "Ingénieur mécanique", level: "École d'ingénieur", pathway: "Prépa ou BUT puis concours", description: "Tu conçois des objets techniques de A à Z", icon: "⚙️", tag: "🧑‍🤝‍🧑"},
      {name: "Électrotechnicien", level: "Bac +2", pathway: "BTS électrotechnique", description: "Tu interviens sur les installations électriques complexes", icon: "🔌", tag: "🎯"},
      {name: "Chargé d'essais", level: "BUT ou Licence", pathway: "Stage en labo ou usine", description: "Tu vérifies que les produits techniques fonctionnent avant leur sortie", icon: "🧪", tag: "👤"},
      {name: "Technicien en bureau d'études", level: "BTS / BUT", pathway: "Formation technique", description: "Tu dessines et conçois des plans techniques pour des projets industriels", icon: "📐", tag: "👤"},
      {name: "Technicien de maintenance", level: "CAP / Bac pro / BTS", pathway: "Formation + alternance", description: "Tu garantis le bon fonctionnement des machines ou équipements", icon: "🔧", tag: "🎯"}
    ],
    environment: "Un cadre concret, technique, où tu peux manipuler, tester, observer. Idéalement dans un atelier, un labo ou sur le terrain.",
    advice: "Explore les domaines où tu peux expérimenter tout en comprenant ce que tu fais. Le génie, la tech, ou les systèmes te donneront une grande satisfaction."
  },
  {
    code: "RS",
    name: "Le Pratique Solidaire",
    description: "Tu es quelqu'un de concret, patient, avec une vraie envie d'aider les autres. Tu préfères agir sur le terrain, là où ça compte.",
    traits: [
      {emoji: "🤝", label: "Altruiste"},
      {emoji: "🧩", label: "Patient"},
      {emoji: "💪", label: "Dévoué"},
      {emoji: "🛠", label: "Concret"}
    ],
    radarScores: {ponctualite: 4, resolutionProblemes: 3, resistanceStress: 4, connaissanceMarche: 2, competencesInterpersonnelles: 5},
    formations: [
      {name: "DE Aide-soignant", duration: "1 an", level: "Niveau 4", levelCode: "CAP", pitch: "Pour accompagner les personnes en perte d'autonomie", icon: "🩺"},
      {name: "BTS Services et prestations sociales", duration: "2 ans", level: "Niveau 5", levelCode: "BTS", pitch: "Pour accompagner des publics fragiles dans leurs démarches", icon: "🤝"},
      {name: "BUT Carrières sociales", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour travailler dans l'action sociale, éducative ou culturelle", icon: "🏥"},
      {name: "CAP Petite Enfance", duration: "2 ans", level: "Niveau 3", levelCode: "CAP", pitch: "Pour accompagner les tout-petits en crèche, école ou à domicile", icon: "👶"}
    ],
    careers: [
      {name: "Aide-soignant", level: "Diplôme d'État (DE)", pathway: "Formation 1 an", description: "Tu accompagnes les malades ou personnes âgées au quotidien", icon: "👨‍⚕️", tag: "🧑‍🤝‍🧑"},
      {name: "Éducateur spécialisé", level: "Bac +3 (DEES)", pathway: "Institut spécialisé", description: "Tu aides des enfants, jeunes ou adultes en difficulté", icon: "🧑‍🏫", tag: "🧑‍🤝‍🧑"},
      {name: "Auxiliaire de puériculture", level: "CAP ou concours", pathway: "Centre de formation", description: "Tu prends soin des jeunes enfants dans des structures d'accueil", icon: "🍼", tag: "👤"},
      {name: "Conseiller social", level: "BTS / BUT", pathway: "École sociale", description: "Tu aides les familles à accéder à leurs droits", icon: "🧾", tag: "🧑‍🤝‍🧑"},
      {name: "Animateur socioculturel", level: "BAFA ou BUT", pathway: "Expérience + formation", description: "Tu organises des activités dans un centre social ou quartier", icon: "🎨", tag: "🧑‍🤝‍🧑"},
      {name: "Moniteur-éducateur", level: "Bac +2", pathway: "Institut de formation", description: "Tu accompagnes au quotidien des personnes en insertion", icon: "🧑‍🎓", tag: "🧑‍🤝‍🧑"}
    ],
    environment: "Un cadre humain, structuré mais pas rigide : centre social, école, crèche, maison de retraite, foyer d'accueil. Tu as besoin de contact et d'utilité concrète.",
    advice: "Tu as un vrai cœur d'accompagnant. Tu ne brilles pas par des discours mais par tes actions. Oriente-toi vers un métier où tu es utile et valorisé, au contact direct des gens."
  },
  {
    code: "RE",
    name: "L'Entrepreneur Pratique",
    description: "Tu aimes entreprendre et agir concrètement pour développer des projets ambitieux dans le monde réel.",
    traits: [
      {emoji: "🚀", label: "Ambitieux"},
      {emoji: "🔧", label: "Concret"},
      {emoji: "🎯", label: "Autonome"},
      {emoji: "💬", label: "Persuasif"}
    ],
    radarScores: {ponctualite: 4, resolutionProblemes: 4, resistanceStress: 4, connaissanceMarche: 5, competencesInterpersonnelles: 4},
    formations: [
      {name: "BUT Techniques de Commercialisation", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour apprendre à vendre, négocier et gérer une activité commerciale", icon: "💼"},
      {name: "BTS Gestion de la PME", duration: "2 ans", level: "Niveau 5", levelCode: "BTS", pitch: "Pour gérer une petite entreprise ou créer la tienne", icon: "🏢"},
      {name: "Licence Pro Entrepreneuriat", duration: "1 an", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour apprendre à monter un projet d'entreprise viable", icon: "🚀"},
      {name: "Bachelor Business Development", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour devenir un expert en croissance commerciale et en gestion client", icon: "📈"}
    ],
    careers: [
      {name: "Créateur d'entreprise", level: "Tout niveau", pathway: "Formation + accompagnement", description: "Tu montes ta boîte et développes un projet qui te ressemble", icon: "🚀", tag: "🎯"},
      {name: "Commercial terrain", level: "BTS / BUT", pathway: "Alternance ou école de commerce", description: "Tu proposes et vends des solutions à des entreprises ou des particuliers", icon: "💼", tag: "🧑‍🤝‍🧑"},
      {name: "Responsable de magasin", level: "BTS / Licence pro", pathway: "Expérience + formation managériale", description: "Tu gères une équipe, un stock, des objectifs et un lieu de vente", icon: "🏪", tag: "🧑‍🤝‍🧑"},
      {name: "Chargé de développement", level: "Bachelor / Master", pathway: "École de commerce", description: "Tu développes de nouvelles opportunités pour ton entreprise", icon: "📈", tag: "🎯"},
      {name: "Auto-entrepreneur services", level: "Variable", pathway: "Formations courtes / CPF", description: "Tu proposes tes services directement à des clients (freelance, microservice…)", icon: "💻", tag: "👤"},
      {name: "Gestionnaire de projet", level: "Bac +3 à Bac +5", pathway: "Licence + expérience", description: "Tu pilotes une activité de A à Z : budget, planning, humains", icon: "📋", tag: "🧑‍🤝‍🧑"}
    ],
    environment: "Un environnement dynamique, concret, où tu peux tester, agir, convaincre, vendre. Tu es fait pour entreprendre ou gérer une activité.",
    advice: "Fais confiance à ton énergie et à ton côté concret. Tu n'attends pas que les choses se fassent : tu les lances. Cherche à créer ton cadre ou à intégrer une structure flexible."
  },
  {
    code: "RA",
    name: "L'Artisan Créatif",
    description: "Tu aimes créer de tes mains des objets beaux et utiles, en alliant savoir-faire technique et vision artistique.",
    traits: [
      {emoji: "🎨", label: "Créatif"},
      {emoji: "🔨", label: "Manuel"},
      {emoji: "💡", label: "Inventif"},
      {emoji: "🎯", label: "Autonome"}
    ],
    radarScores: {ponctualite: 3, resolutionProblemes: 3, resistanceStress: 4, connaissanceMarche: 2, competencesInterpersonnelles: 3},
    formations: [
      {name: "CAP Arts du bois", duration: "2 ans", level: "Niveau 3", levelCode: "CAP", pitch: "Pour apprendre la fabrication artisanale d'objets ou de meubles", icon: "🪵"},
      {name: "DNMADE Objet", duration: "3 ans", level: "Niveau 6", levelCode: "DNMADE", pitch: "Design d'objets, de mobilier, de produits innovants", icon: "🎨"},
      {name: "BTS Métiers de la mode", duration: "2 ans", level: "Niveau 5", levelCode: "BTS", pitch: "Pour concevoir et produire des vêtements ou accessoires", icon: "👗"},
      {name: "Bachelor Design Produit", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Tu imagines des objets utiles, esthétiques et fonctionnels", icon: "🧰"}
    ],
    careers: [
      {name: "Ébéniste", level: "CAP / Bac pro", pathway: "Formation artisanale", description: "Tu fabriques et répares des meubles sur mesure", icon: "🪵", tag: "👤"},
      {name: "Designer produit", level: "DNMADE / Bachelor", pathway: "École d'art appliqué", description: "Tu conçois des objets du quotidien, pratiques et esthétiques", icon: "🧰", tag: "🎯"},
      {name: "Styliste-modéliste", level: "BTS / école de mode", pathway: "École spécialisée", description: "Tu dessines et développes des collections de vêtements", icon: "👗", tag: "🎯"},
      {name: "Bijoutier-joaillier", level: "CAP / Mention complémentaire", pathway: "Formation pro + atelier", description: "Tu crées des bijoux à la main, pièce par pièce", icon: "💎", tag: "👤"},
      {name: "Tapissier décorateur", level: "CAP / Bac pro", pathway: "Formation technique", description: "Tu rénoves ou crées des sièges, rideaux et tentures", icon: "🪑", tag: "👤"},
      {name: "Céramiste", level: "DNMADE / CAP", pathway: "Formation artistique", description: "Tu travailles la terre, crées des objets en argile ou porcelaine", icon: "🏺", tag: "👤"}
    ],
    environment: "Un atelier, un espace pratique, créatif et calme où tu peux manipuler, tester et laisser parler tes mains.",
    advice: "Tu n'as pas besoin d'un bureau, mais d'un espace pour fabriquer, créer, construire. L'artisanat moderne et les métiers d'art sont faits pour toi."
  },
  {
    code: "RC",
    name: "Le Technicien Rigoureux",
    description: "Tu excelles dans la technique avec méthode et précision. Tu aimes que tout soit organisé et fonctionne parfaitement.",
    traits: [
      {emoji: "🎯", label: "Précis"},
      {emoji: "📋", label: "Structuré"},
      {emoji: "✅", label: "Fiable"},
      {emoji: "👁️", label: "Observateur"}
    ],
    radarScores: {ponctualite: 5, resolutionProblemes: 4, resistanceStress: 3, connaissanceMarche: 3, competencesInterpersonnelles: 2},
    formations: [
      {name: "Bac Pro Maintenance des équipements industriels", duration: "3 ans", level: "Niveau 4", levelCode: "CAP", pitch: "Pour apprendre à réparer, entretenir et fiabiliser les machines", icon: "🔧"},
      {name: "BTS Électrotechnique", duration: "2 ans", level: "Niveau 5", levelCode: "BTS", pitch: "Pour maîtriser les systèmes électriques industriels et automatisés", icon: "⚡"},
      {name: "BUT Génie Électrique et Informatique Industrielle", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour concevoir, piloter et maintenir des installations complexes", icon: "💡"},
      {name: "Licence Pro Maintenance industrielle", duration: "1 an", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour te spécialiser dans les technologies de maintenance avancées", icon: "🛠️"}
    ],
    careers: [
      {name: "Technicien de maintenance", level: "Bac pro / BTS", pathway: "Lycée technique ou CFA", description: "Tu assures le bon fonctionnement des équipements et machines", icon: "🔧", tag: "🎯"},
      {name: "Électrotechnicien", level: "BTS / BUT", pathway: "Formation spécialisée", description: "Tu interviens sur des systèmes électriques automatisés complexes", icon: "⚡", tag: "🎯"},
      {name: "Technicien de contrôle qualité", level: "Bac +2", pathway: "BTS + expérience", description: "Tu vérifies que les produits fabriqués respectent les normes", icon: "🔍", tag: "👤"},
      {name: "Dessinateur industriel", level: "BTS / BUT", pathway: "École technique ou design industriel", description: "Tu réalises les plans nécessaires à la fabrication de pièces ou machines", icon: "📐", tag: "👤"},
      {name: "Opérateur sur machine numérique", level: "CAP / Bac pro", pathway: "Formation en alternance", description: "Tu programmes et surveilles les machines-outils dans l'industrie", icon: "🖥️", tag: "🎯"},
      {name: "Technicien méthode", level: "Licence pro / BUT", pathway: "Spécialisation après BTS", description: "Tu optimises les processus de fabrication ou de maintenance", icon: "📊", tag: "👤"}
    ],
    environment: "Un lieu calme, organisé, structuré : atelier technique, usine moderne, entreprise industrielle où tout est bien défini.",
    advice: "Ton sens du détail est ta plus grande force. Dirige-toi vers des métiers où la rigueur est valorisée et où ton calme améliore la fiabilité des systèmes."
  },
  {
    code: "IA",
    name: "L'Innovateur Créatif",
    description: "Tu combines curiosité intellectuelle et créativité pour inventer des solutions innovantes et originales.",
    traits: [
      {emoji: "🔬", label: "Curieux"},
      {emoji: "💡", label: "Ingénieux"},
      {emoji: "🧠", label: "Analytique"},
      {emoji: "✨", label: "Imaginatif"}
    ],
    radarScores: {ponctualite: 3, resolutionProblemes: 5, resistanceStress: 3, connaissanceMarche: 3, competencesInterpersonnelles: 3},
    formations: [
      {name: "Licence Informatique", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour apprendre les bases du code, de la logique et de l'innovation numérique", icon: "💻"},
      {name: "BUT Métiers du Multimédia et de l'Internet", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour devenir créatif et technicien dans le numérique (web, vidéo, design, UX)", icon: "🧠"},
      {name: "Bachelor Design Tech", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Tu explores l'interface entre créativité, technologie et innovation", icon: "🔧"},
      {name: "École d'ingénieur Informatique & IA", duration: "5 ans", level: "Niveau 7", levelCode: "Master", pitch: "Pour devenir un expert des systèmes intelligents et de la data", icon: "🤖"}
    ],
    careers: [
      {name: "Développeur Web / App", level: "Bac +2 à Bac +5", pathway: "BUT, école ou bootcamp", description: "Tu conçois des sites ou applications utiles, intuitives et élégantes", icon: "💻", tag: "🎯"},
      {name: "UX Designer", level: "Bachelor / BUT / Master", pathway: "Design ou numérique", description: "Tu améliores l'expérience utilisateur sur des produits digitaux", icon: "🎨", tag: "🎯"},
      {name: "Ingénieur en IA", level: "École d'ingé / Master", pathway: "Formation spécialisée", description: "Tu conçois des systèmes intelligents capables d'apprendre et s'adapter", icon: "🤖", tag: "🎯"},
      {name: "Data analyst", level: "Bac +3 à +5", pathway: "BUT / école d'ingé / école de commerce", description: "Tu analyses les données pour en extraire des décisions stratégiques", icon: "📊", tag: "👤"},
      {name: "Designer d'interaction", level: "Bac +3", pathway: "BUT / Bachelor / DNMADE", description: "Tu imagines des interfaces interactives innovantes", icon: "🖱️", tag: "🎯"},
      {name: "Concepteur de produits tech", level: "Master / école d'ingé", pathway: "Design ou tech", description: "Tu développes des objets ou services connectés utiles et créatifs", icon: "📱", tag: "🎯"}
    ],
    environment: "Un espace libre, connecté, avec du matériel moderne, du prototypage, du code, de la créativité collective.",
    advice: "Tu penses différemment et tu vois des solutions là où d'autres voient des limites. Oriente-toi vers des domaines où on te laissera expérimenter, créer, modéliser."
  },
  {
    code: "IS",
    name: "Le Chercheur Humaniste",
    description: "Tu combines rigueur intellectuelle et empathie pour comprendre et accompagner l'humain dans sa complexité.",
    traits: [
      {emoji: "🤔", label: "Réfléchi"},
      {emoji: "❤️", label: "Empathique"},
      {emoji: "🧠", label: "Analytique"},
      {emoji: "👁️", label: "Observateur"}
    ],
    radarScores: {ponctualite: 3, resolutionProblemes: 4, resistanceStress: 3, connaissanceMarche: 2, competencesInterpersonnelles: 5},
    formations: [
      {name: "Licence Psychologie", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour étudier le comportement humain et comprendre les mécanismes psychiques", icon: "🧠"},
      {name: "BUT Carrières sociales – Education spécialisée", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour accompagner des publics fragiles avec une approche éducative et sociale", icon: "🧒"},
      {name: "Bachelor RH & Comportement", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour explorer le lien entre relations humaines et développement organisationnel", icon: "👥"},
      {name: "École de travail social", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour se former à l'accompagnement social, éducatif ou thérapeutique", icon: "🤲"}
    ],
    careers: [
      {name: "Psychologue", level: "Master", pathway: "Licence + Master pro", description: "Tu aides les gens à mieux se comprendre, à aller mieux ou à surmonter des blocages", icon: "🧠", tag: "🧑‍🤝‍🧑"},
      {name: "Conseiller d'orientation", level: "Master MEEF", pathway: "Concours de la fonction publique", description: "Tu aides les jeunes à faire des choix d'avenir adaptés à leur profil", icon: "🧭", tag: "🧑‍🤝‍🧑"},
      {name: "Chargé de mission RH", level: "Bac +3/+5", pathway: "Bachelor ou Master RH", description: "Tu gères le bien-être, le recrutement ou la montée en compétences dans une entreprise", icon: "👥", tag: "🧑‍🤝‍🧑"},
      {name: "Travailleur social", level: "DEES / DEASS", pathway: "École spécialisée", description: "Tu accompagnes des personnes vulnérables dans leurs démarches de vie", icon: "🤲", tag: "🧑‍🤝‍🧑"},
      {name: "Neuropsychologue", level: "Master pro + stage", pathway: "Université + spécialisation", description: "Tu analyses les liens entre cerveau, comportement et cognition", icon: "🧠", tag: "👤"},
      {name: "Formateur en insertion", level: "Bac +2/3", pathway: "Expérience + pédagogie", description: "Tu aides des personnes à retrouver un emploi ou une voie de formation", icon: "🎓", tag: "🧑‍🤝‍🧑"}
    ],
    environment: "Un cadre calme, centré sur l'humain, où tu peux prendre le temps de réfléchir, observer et agir avec justesse.",
    advice: "Tu comprends les gens, tu analyses finement, tu n'as pas besoin de crier pour aider. Les métiers de l'accompagnement ou de l'analyse comportementale te correspondent parfaitement."
  },
  {
    code: "IE",
    name: "L'Expert Influent",
    description: "Tu combines expertise analytique et capacité d'influence pour prendre des décisions stratégiques impactantes.",
    traits: [
      {emoji: "🎯", label: "Stratégique"},
      {emoji: "🧠", label: "Analytique"},
      {emoji: "💬", label: "Persuasif"},
      {emoji: "🚀", label: "Ambitieux"}
    ],
    radarScores: {ponctualite: 4, resolutionProblemes: 5, resistanceStress: 4, connaissanceMarche: 5, competencesInterpersonnelles: 4},
    formations: [
      {name: "Licence Économie & Gestion", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour comprendre les mécanismes économiques, financiers et managériaux", icon: "📊"},
      {name: "Classe prépa ECG", duration: "2 ans", level: "Niveau 5", levelCode: "BTS", pitch: "Pour accéder aux meilleures écoles de commerce et se spécialiser en stratégie", icon: "🏛️"},
      {name: "Bachelor Business Analytics", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour devenir expert de la donnée appliquée au business", icon: "📈"},
      {name: "École de commerce", duration: "3 à 5 ans", level: "Niveau 7", levelCode: "Master", pitch: "Pour se former en stratégie, finance, conseil, et devenir un leader éclairé", icon: "🎓"}
    ],
    careers: [
      {name: "Consultant en stratégie", level: "Grande école / Master", pathway: "Prépa ou admission parallèle", description: "Tu aides les entreprises à prendre des décisions majeures grâce à ton analyse", icon: "🎯", tag: "🧑‍🤝‍🧑"},
      {name: "Analyste financier", level: "Licence / Master", pathway: "Université ou école de commerce", description: "Tu évalues la santé financière d'une entreprise et proposes des axes d'investissement", icon: "📊", tag: "👤"},
      {name: "Chef de projet digital", level: "Bachelor / Master", pathway: "École de commerce ou web", description: "Tu pilotes la création de produits numériques performants", icon: "💻", tag: "🧑‍🤝‍🧑"},
      {name: "Responsable marketing stratégique", level: "Master", pathway: "École de commerce", description: "Tu analyses les marchés et proposes des orientations pour l'entreprise", icon: "📈", tag: "🎯"},
      {name: "Chargé d'études économiques", level: "Master", pathway: "Université ou concours", description: "Tu analyses des données pour éclairer les décisions des institutions ou entreprises", icon: "📊", tag: "👤"},
      {name: "Entrepreneur tech", level: "Variable", pathway: "Formation + expérience terrain", description: "Tu crées un projet innovant en t'appuyant sur l'analyse et le digital", icon: "🚀", tag: "🎯"}
    ],
    environment: "Un cadre stimulant, analytique, où les décisions se prennent à partir de données et où tu peux avoir de l'impact.",
    advice: "Tu combines vision, logique et persuasion. Oriente-toi vers les métiers qui demandent des décisions stratégiques, des analyses fines et de la prise de hauteur."
  },
  {
    code: "AC",
    name: "L'Artiste Méthodique",
    description: "Tu crées avec structure et méthode pour produire des œuvres abouties.",
    traits: [
      {emoji: "🎨", label: "Créatif"},
      {emoji: "🧩", label: "Méthodique"},
      {emoji: "💎", label: "Perfectionniste"},
      {emoji: "🧱", label: "Structuré"}
    ],
    radarScores: {ponctualite: 4, resolutionProblemes: 4, resistanceStress: 4, connaissanceMarche: 2, competencesInterpersonnelles: 3},
    formations: [
      {name: "BTS Design Graphique", duration: "2 ans", level: "Niveau 5", levelCode: "BTS", pitch: "Pour travailler en design visuel, pub, UI, print…", icon: "🖌️"},
      {name: "Bachelor Architecture", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour ceux qui aiment dessiner et concevoir des espaces", icon: "🏗️"},
      {name: "CAP Cuisine", duration: "2 ans", level: "Niveau 3", levelCode: "CAP", pitch: "Pour apprendre la pratique de la cuisine en école pro", icon: "👨‍🍳"},
      {name: "DNMADE (design)", duration: "3 ans", level: "Niveau 6", levelCode: "DNMADE", pitch: "Pour devenir créatif polyvalent (produit, espace, graphisme)", icon: "🎨"}
    ],
    careers: [
      {name: "Architecte", level: "Master (5 ans)", pathway: "École d'archi", description: "Tu conçois des bâtiments beaux et fonctionnels", icon: "🧱", tag: "🧑‍🤝‍🧑"},
      {name: "Designer graphique", level: "BTS ou DNMADE", pathway: "École spécialisée", description: "Tu crées des visuels pour des marques, produits ou sites", icon: "🖌️", tag: "👤"},
      {name: "Monteur vidéo", level: "BTS Audiovisuel", pathway: "École ou alternance", description: "Tu racontes une histoire avec des images et du rythme", icon: "🎬", tag: "🎯"},
      {name: "Chef cuisinier", level: "CAP + expérience", pathway: "CFA ou lycée pro", description: "Tu diriges une cuisine et inventes tes propres plats", icon: "👨‍🍳", tag: "🧑‍🤝‍🧑"},
      {name: "UX Designer", level: "Master / école", pathway: "Design ou Web UX", description: "Tu rends les apps + intuitives pour les utilisateurs", icon: "🖥", tag: "🎯"},
      {name: "Décorateur / Scénographe", level: "BTS / DNMADE", pathway: "École design ou arts appliqués", description: "Tu crées des ambiances visuelles pour des espaces ou des scènes", icon: "🎨", tag: "👤"}
    ],
    environment: "Tu travailles mieux dans un environnement calme, visuel, où tu peux aller au bout des choses à ton rythme.",
    advice: "Tu as besoin d'un cadre clair pour laisser ta créativité s'exprimer. Privilégie les projets où tu peux poser une vision visuelle structurée."
  },
  {
    code: "IC",
    name: "L'Analyste Méthodique",
    description: "Tu combines curiosité intellectuelle et rigueur pour analyser des données et résoudre des problèmes complexes.",
    traits: [
      {emoji: "🧠", label: "Logique"},
      {emoji: "🎯", label: "Précis"},
      {emoji: "📋", label: "Structuré"},
      {emoji: "👁️", label: "Observateur"}
    ],
    radarScores: {ponctualite: 5, resolutionProblemes: 4, resistanceStress: 3, connaissanceMarche: 4, competencesInterpersonnelles: 2},
    formations: [
      {name: "BUT Informatique", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour développer des logiciels, bases de données et systèmes automatisés.", icon: "💻"},
      {name: "BTS Comptabilité et gestion", duration: "2 ans", level: "Niveau 5", levelCode: "BTS", pitch: "Pour apprendre la gestion comptable, fiscale et analytique d'une entreprise.", icon: "📒"},
      {name: "Licence Mathématiques appliquées", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour se spécialiser dans les statistiques, modélisations et datas.", icon: "📐"},
      {name: "Licence Pro Gestion des données", duration: "1 an", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour devenir spécialiste de la donnée dans une organisation.", icon: "🧮"}
    ],
    careers: [
      {name: "Data analyst", level: "Bac +3/+5", pathway: "BUT / Licence / école", description: "Tu analyses des données pour aider à la prise de décisions stratégiques.", icon: "📊", tag: "🎯"},
      {name: "Développeur logiciel", level: "BUT / École d'ingé", pathway: "Informatique ou coding school", description: "Tu conçois des programmes informatiques robustes et fiables.", icon: "💻", tag: "🎯"},
      {name: "Contrôleur de gestion", level: "Licence / Master", pathway: "Comptabilité / gestion", description: "Tu suis les performances d'une entreprise et aides à optimiser les budgets.", icon: "📈", tag: "👤"},
      {name: "Statisticien", level: "Licence / Master", pathway: "Maths / économie", description: "Tu modèles et interprètes des données chiffrées pour comprendre le réel.", icon: "📐", tag: "👤"},
      {name: "Auditeur", level: "Master", pathway: "École de commerce ou expertise comptable", description: "Tu vérifies la bonne gestion et les comptes d'organisations.", icon: "🔍", tag: "👤"},
      {name: "Technicien en bases de données", level: "BTS / BUT", pathway: "Informatique ou systèmes d'info", description: "Tu assures la gestion, la sécurité et la structuration des données.", icon: "🗃️", tag: "🎯"}
    ],
    environment: "Un bureau calme, des outils numériques avancés, une organisation carrée et des missions bien définies.",
    advice: "Tu excelles dans ce qui demande de la rigueur, de la logique et de la discrétion. Oriente-toi vers des métiers d'analyse où ton esprit structuré fera toute la différence."
  },
  {
    code: "AS",
    name: "Le Créatif Humain",
    description: "Tu combines créativité artistique et sens du contact pour transmettre, sensibiliser et créer du lien social.",
    traits: [
      {emoji: "🎭", label: "Expressif"},
      {emoji: "❤️", label: "Empathique"},
      {emoji: "💡", label: "Inventif"},
      {emoji: "🤝", label: "Sociable"}
    ],
    radarScores: {ponctualite: 3, resolutionProblemes: 3, resistanceStress: 4, connaissanceMarche: 2, competencesInterpersonnelles: 5},
    formations: [
      {name: "BTS Communication", duration: "2 ans", level: "Niveau 5", levelCode: "BTS", pitch: "Pour apprendre à concevoir et diffuser des messages impactants.", icon: "📣"},
      {name: "BUT Information-Communication", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour devenir un professionnel de la communication, du journalisme ou de la médiation.", icon: "🗞️"},
      {name: "Licence Arts du spectacle", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour explorer l'expression artistique à travers le théâtre, la mise en scène ou le cinéma.", icon: "🎭"},
      {name: "Bachelor Animation / Médiation culturelle", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour animer des projets culturels et éducatifs accessibles à tous.", icon: "🎨"}
    ],
    careers: [
      {name: "Animateur socioculturel", level: "BAFA / BUT / Licence", pathway: "Formation animation ou sociale", description: "Tu conçois et animes des activités pour des publics variés.", icon: "🎪", tag: "🧑‍🤝‍🧑"},
      {name: "Chargé de communication", level: "BTS / Licence", pathway: "Communication ou marketing", description: "Tu gères l'image, les messages et la présence publique d'une structure.", icon: "📣", tag: "🧑‍🤝‍🧑"},
      {name: "Comédien / Intervenant artistique", level: "Variable", pathway: "Formation artistique + pratique", description: "Tu utilises ton art pour transmettre, sensibiliser ou divertir.", icon: "🎭", tag: "🎯"},
      {name: "Médiateur culturel", level: "Licence / Master", pathway: "Culture / patrimoine / éducation", description: "Tu rends la culture accessible à tous les publics.", icon: "🏛️", tag: "🧑‍🤝‍🧑"},
      {name: "Coach vocal / théâtre / expression", level: "Expérience artistique + pédagogie", pathway: "Formations ou pratique professionnelle", description: "Tu aides les autres à développer leur aisance et leur voix.", icon: "🎤", tag: "🧑‍🤝‍🧑"},
      {name: "Responsable événementiel", level: "Licence / Master", pathway: "Com / événementiel / gestion de projet", description: "Tu organises des événements de A à Z, en lien avec le public.", icon: "🎉", tag: "🧑‍🤝‍🧑"}
    ],
    environment: "Un lieu vivant, avec du lien humain, de la liberté d'expression, des projets variés et du sens.",
    advice: "Tu veux transmettre, créer du lien, faire vibrer les autres. Oriente-toi vers les métiers où ta créativité sert une cause, une équipe ou un public."
  },
  {
    code: "SE",
    name: "Le Leader Bienveillant",
    description: "Tu combines sens du relationnel et capacité de leadership pour guider et accompagner les équipes vers leurs objectifs.",
    traits: [
      {emoji: "❤️", label: "Empathique"},
      {emoji: "⚡", label: "Dynamique"},
      {emoji: "🛡️", label: "Responsable"},
      {emoji: "📋", label: "Organisateur"}
    ],
    radarScores: {ponctualite: 4, resolutionProblemes: 4, resistanceStress: 4, connaissanceMarche: 4, competencesInterpersonnelles: 5},
    formations: [
      {name: "Bachelor Management & Leadership", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour apprendre à gérer des équipes, des projets et des relations humaines.", icon: "👔"},
      {name: "BUT Gestion des entreprises et des administrations", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour devenir un professionnel polyvalent de la gestion et de l'encadrement.", icon: "📚"},
      {name: "Licence Pro Coordination de projets sociaux", duration: "1 an", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour coordonner des projets à fort impact humain.", icon: "🤝"},
      {name: "École de commerce – parcours management", duration: "3 à 5 ans", level: "Niveau 7", levelCode: "Master", pitch: "Pour devenir un manager humain, structuré et inspirant.", icon: "🏢"}
    ],
    careers: [
      {name: "Manager d'équipe", level: "Bac +3/+5", pathway: "Gestion / école de commerce", description: "Tu accompagnes ton équipe vers ses objectifs avec bienveillance et méthode.", icon: "👥", tag: "🧑‍🤝‍🧑"},
      {name: "Chef de service social", level: "DE + spécialisation", pathway: "Formation sociale + expérience", description: "Tu pilotes une structure sociale avec une attention forte à l'humain.", icon: "🏥", tag: "🧑‍🤝‍🧑"},
      {name: "Responsable associatif", level: "Licence / Master", pathway: "Formation ou engagement terrain", description: "Tu diriges des projets solidaires ou culturels au service des autres.", icon: "🤝", tag: "🧑‍🤝‍🧑"},
      {name: "Coach ou mentor", level: "Expérience + formation courte", pathway: "Coaching, psychologie, RH", description: "Tu aides les gens à progresser et à se sentir mieux dans leur environnement.", icon: "🧭", tag: "🧑‍🤝‍🧑"},
      {name: "Chargé de mission RH", level: "Bachelor / Master", pathway: "RH ou management", description: "Tu assures le lien humain et stratégique entre salariés et direction.", icon: "👔", tag: "🧑‍🤝‍🧑"},
      {name: "Directeur d'établissement scolaire ou social", level: "Master ou concours", pathway: "Carrière publique ou associative", description: "Tu coordonnes des équipes et garantis le bon fonctionnement d'un lieu de vie.", icon: "🏫", tag: "🧑‍🤝‍🧑"}
    ],
    environment: "Un cadre structuré, humain, où tu peux guider les autres, poser un cadre clair et accompagner des transformations positives.",
    advice: "Tu es un pilier pour les autres. Tu sais motiver, rassurer, structurer. Dirige-toi vers des fonctions d'encadrement où tu peux mettre ton leadership au service d'un collectif."
  },
  {
    code: "SC",
    name: "L'Accompagnateur Structuré",
    description: "Tu combines sens du service et rigueur méthodologique pour accompagner les autres dans un cadre clair et sécurisant.",
    traits: [
      {emoji: "📋", label: "Organisé"},
      {emoji: "✅", label: "Fiable"},
      {emoji: "👁️", label: "Attentif"},
      {emoji: "🎯", label: "Méthodique"}
    ],
    radarScores: {ponctualite: 5, resolutionProblemes: 3, resistanceStress: 4, connaissanceMarche: 3, competencesInterpersonnelles: 4},
    formations: [
      {name: "DE Educateur spécialisé", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour accompagner des personnes en difficulté de façon rigoureuse et humaine.", icon: "🧑‍🏫"},
      {name: "BTS Services et prestations des secteurs sanitaire et social", duration: "2 ans", level: "Niveau 5", levelCode: "BTS", pitch: "Pour devenir un relais fiable entre les institutions et les usagers.", icon: "🏥"},
      {name: "Licence Psychologie", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour mieux comprendre les individus, les comportements et les aider.", icon: "🧠"},
      {name: "Licence Pro Intervention sociale", duration: "1 an", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour agir concrètement dans les structures sociales ou éducatives.", icon: "🤲"}
    ],
    careers: [
      {name: "Éducateur spécialisé", level: "DE", pathway: "Formation en 3 ans après bac", description: "Tu aides des jeunes, familles ou adultes à retrouver une place dans la société.", icon: "🧑‍🏫", tag: "🧑‍🤝‍🧑"},
      {name: "Conseiller d'orientation", level: "Master", pathway: "Psychologie + concours", description: "Tu accompagnes les jeunes dans leurs choix scolaires et pro.", icon: "🧭", tag: "🧑‍🤝‍🧑"},
      {name: "Assistant de service social", level: "DE", pathway: "Formation sociale", description: "Tu aides les personnes à surmonter des difficultés (logement, santé, etc.).", icon: "🤲", tag: "🧑‍🤝‍🧑"},
      {name: "Coordinateur médico-social", level: "Licence / Master", pathway: "Santé, social ou gestion", description: "Tu assures la coordination entre les patients, familles et professionnels.", icon: "🏥", tag: "👤"},
      {name: "Accompagnant d'élèves en situation de handicap (AESH)", level: "Bac + formation", pathway: "Candidature via rectorat", description: "Tu soutiens les élèves avec des besoins particuliers dans leur scolarité.", icon: "🎓", tag: "🧑‍🤝‍🧑"},
      {name: "Agent d'accueil social", level: "Bac / BTS", pathway: "Formation ou concours", description: "Tu es le premier contact et le soutien administratif des publics fragiles.", icon: "🏢", tag: "🧑‍🤝‍🧑"}
    ],
    environment: "Un cadre clair, stable, avec une vraie mission humaine et des outils pour structurer l'accompagnement des autres.",
    advice: "Tu combines rigueur et bienveillance. Tu es fait pour guider les autres dans un cadre posé, sécurisant et utile. Oriente-toi vers les métiers d'accompagnement ou d'interface humaine."
  },
  {
    code: "EC",
    name: "Le Manager Organisé",
    description: "Tu combines leadership et rigueur méthodologique pour piloter des projets et optimiser l'efficacité des organisations.",
    traits: [
      {emoji: "📋", label: "Structuré"},
      {emoji: "🛡️", label: "Responsable"},
      {emoji: "🧠", label: "Rationnel"},
      {emoji: "⚡", label: "Décisif"}
    ],
    radarScores: {ponctualite: 5, resolutionProblemes: 5, resistanceStress: 4, connaissanceMarche: 4, competencesInterpersonnelles: 3},
    formations: [
      {name: "BUT Gestion des entreprises et des administrations", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour gérer efficacement une organisation dans toutes ses dimensions.", icon: "📊"},
      {name: "Licence Économie et gestion", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour comprendre les rouages d'une entreprise et les leviers de performance.", icon: "💼"},
      {name: "École de commerce", duration: "3 à 5 ans", level: "Niveau 7", levelCode: "Master", pitch: "Pour piloter des projets, des équipes ou des structures à haut niveau.", icon: "🏢"},
      {name: "Licence Pro Management des organisations", duration: "1 an", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour se spécialiser dans la gestion opérationnelle et stratégique.", icon: "🧭"}
    ],
    careers: [
      {name: "Responsable logistique", level: "Licence / Master", pathway: "BUT / école / Licence Pro", description: "Tu coordonnes les flux, les ressources et les délais dans une entreprise.", icon: "📦", tag: "🎯"},
      {name: "Chef de projet", level: "Bac +3/+5", pathway: "Gestion / ingénierie / business", description: "Tu pilotes des projets complexes de manière structurée et efficace.", icon: "🎯", tag: "🎯"},
      {name: "Manager opérationnel", level: "Licence / école", pathway: "Management / gestion / école", description: "Tu encadres une équipe et assures l'atteinte des objectifs.", icon: "👥", tag: "🧑‍🤝‍🧑"},
      {name: "Gestionnaire administratif", level: "BTS / Licence", pathway: "Administration / gestion", description: "Tu assures le bon fonctionnement des services internes.", icon: "📋", tag: "👤"},
      {name: "Consultant en organisation", level: "Master", pathway: "École de commerce / ingénierie", description: "Tu aides les entreprises à optimiser leur fonctionnement.", icon: "🧭", tag: "🎯"},
      {name: "Responsable qualité", level: "Licence / Master", pathway: "Gestion / ingénierie / qualité", description: "Tu garantis le respect des normes et l'amélioration continue.", icon: "✅", tag: "👤"}
    ],
         environment: "Un cadre clair, structuré, où les objectifs sont concrets et les responsabilités bien réparties.",
     advice: "Tu sais organiser, décider, structurer. Dirige-toi vers les métiers où ton sens de l'efficacité et de la méthode pourra faire décoller des projets."
   },
   {
     code: "AE",
     name: "Le Visionnaire Charismatique",
     description: "Tu combines créativité visionnaire et capacité d'influence pour porter des projets ambitieux et inspirer les autres.",
     traits: [
       {emoji: "🎭", label: "Expressif"},
       {emoji: "🚀", label: "Ambitieux"},
       {emoji: "💬", label: "Convaincant"},
       {emoji: "💡", label: "Créatif"}
     ],
     radarScores: {ponctualite: 3, resolutionProblemes: 4, resistanceStress: 4, connaissanceMarche: 5, competencesInterpersonnelles: 5},
     formations: [
       {name: "BTS Communication", duration: "2 ans", level: "Niveau 5", levelCode: "BTS", pitch: "Pour apprendre à transmettre des idées fortes et à piloter des campagnes de com.", icon: "📢"},
       {name: "Bachelor Marketing & Influence", duration: "3 ans", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour apprendre à faire rayonner une marque, un projet ou une cause.", icon: "📱"},
       {name: "École de commerce / management", duration: "3 à 5 ans", level: "Niveau 7", levelCode: "Master", pitch: "Pour devenir un leader créatif, entrepreneurial ou stratégique.", icon: "🏫"},
       {name: "Licence Pro Gestion de projet événementiel", duration: "1 an", level: "Niveau 6", levelCode: "Bachelor", pitch: "Pour concevoir, planifier et gérer des événements avec impact.", icon: "🎤"}
     ],
     careers: [
       {name: "Responsable communication", level: "Licence / Master", pathway: "Com / école de commerce", description: "Tu définis et pilotes la stratégie d'image d'une marque ou d'un projet.", icon: "📢", tag: "🧑‍🤝‍🧑"},
       {name: "Influenceur / créateur de contenu", level: "Variable", pathway: "Auto-formation + réseau", description: "Tu fédères une communauté autour de ton univers ou d'une thématique forte.", icon: "📱", tag: "🎯"},
       {name: "Chef de projet événementiel", level: "Licence / Master", pathway: "Com / événementiel / business school", description: "Tu organises des événements de A à Z en lien avec des objectifs de communication.", icon: "🎉", tag: "🧑‍🤝‍🧑"},
       {name: "Attaché de presse", level: "Bac +3/+5", pathway: "École de com / IEP", description: "Tu fais le lien entre une structure et les médias pour la faire rayonner.", icon: "📰", tag: "🧑‍🤝‍🧑"},
       {name: "Brand manager", level: "École de commerce / Master", pathway: "Parcours marketing", description: "Tu développes l'image, le message et la notoriété d'une marque.", icon: "🏷️", tag: "🎯"},
       {name: "Porte-parole / communicant politique", level: "Sciences Po / Master com", pathway: "Parcours stratégie / politique / oratoire", description: "Tu représentes une idée ou une organisation avec impact et clarté.", icon: "🎤", tag: "🧑‍🤝‍🧑"}
     ],
     environment: "Un cadre stimulant, où l'on te donne la parole, du leadership, des projets ambitieux et de la marge de manœuvre.",
     advice: "Tu sais parler, porter une vision, inspirer. Choisis des métiers où ton énergie fait bouger les lignes, où ton charisme ouvre des portes."
   }
 ];

// Profils pour la reconversion professionnelle et tous publics (adultes)
const riasecProfilesAdultes: RiasecProfile[] = [
  // Profils simples (R, I, A, S, E, C)
  {
    code: "R",
    name: "Le Réaliste / Le Concret",
    description: "Tu aimes le concret, l'action, les résultats visibles. Tu apprends en faisant, tu aimes résoudre des problèmes pratiques et voir l'impact immédiat de ton travail.",
    traits: [
      {emoji: "🔧", label: "Pratique"},
      {emoji: "💪", label: "Résistant"},
      {emoji: "🎯", label: "Efficace"},
      {emoji: "⚡", label: "Action"}
    ],
    radarScores: {ponctualite: 5, resolutionProblemes: 4, resistanceStress: 5, connaissanceMarche: 3, competencesInterpersonnelles: 2},
    strengths: [
      "Excellente coordination entre la tête et les mains",
      "Goût pour la précision, la fiabilité, le travail bien fait",
      "Résistance au stress et efficacité sur le terrain"
    ],
    formations: [
      {name: "CAP / Titre pro en maintenance, artisanat, bâtiment ou mécanique", duration: "6-12 mois", level: "Niveau 3-4"},
      {name: "Formation courte en logistique, énergie, ou technicien spécialisé", duration: "3-6 mois", level: "Niveau 4-5"}
    ],
    careers: [
      {name: "Technicien(ne) de maintenance", level: "CAP/Titre pro", description: "Assurer le bon fonctionnement des équipements et machines"},
      {name: "Électricien(ne) / Installateur(trice)", level: "CAP/BP", description: "Installer et maintenir des systèmes électriques"},
      {name: "Mécanicien(ne) auto ou moto", level: "CAP/BEP", description: "Réparer et entretenir des véhicules"},
      {name: "Logisticien(ne)", level: "Titre pro", description: "Gérer les flux de marchandises et l'approvisionnement"},
      {name: "Monteur(se) audiovisuel(le) technique", level: "Formation courte", description: "Assembler et installer du matériel audiovisuel"},
      {name: "Chef(fe) d'équipe sur chantier", level: "Expérience + formation", description: "Coordonner les équipes et superviser les travaux"}
    ],
    environment: "Un environnement pratique, sur le terrain, où tu peux manipuler, construire et voir des résultats concrets.",
    advice: "Privilégie les métiers où ton action a un impact visible immédiat. Le travail manuel et technique te donnera satisfaction."
  },
  {
    code: "I",
    name: "L'Investigateur / L'Analytique",
    description: "Tu es curieux, méthodique et passionné par la compréhension du monde. Tu aimes observer, analyser, apprendre en profondeur et résoudre des problèmes complexes.",
    traits: [
      {emoji: "🧠", label: "Logique"},
      {emoji: "🔍", label: "Analytique"},
      {emoji: "📚", label: "Rigoureux"},
      {emoji: "🎓", label: "Autonome"}
    ],
    radarScores: {ponctualite: 4, resolutionProblemes: 5, resistanceStress: 3, connaissanceMarche: 3, competencesInterpersonnelles: 2},
    strengths: [
      "Esprit logique et structuré",
      "Capacité à rester concentré sur un sujet exigeant",
      "Rigueur et autonomie dans le travail intellectuel"
    ],
    formations: [
      {name: "Formation en data, cybersécurité ou systèmes informatiques", duration: "3-12 mois", level: "BTS/Bootcamp/Titre pro"},
      {name: "Certification en recherche UX, veille technologique, ou analyse métier", duration: "2-6 mois", level: "Certification"}
    ],
    careers: [
      {name: "Analyste data / Data technician", level: "Formation courte", description: "Analyser des données pour en tirer des insights"},
      {name: "Technicien(ne) informatique", level: "BTS/Titre pro", description: "Maintenir et dépanner les systèmes informatiques"},
      {name: "UX researcher junior", level: "Bootcamp/Formation", description: "Étudier les comportements utilisateurs pour améliorer les produits"},
      {name: "Assistant(e) ingénieur", level: "BTS/DUT", description: "Soutenir les équipes techniques dans leurs projets"},
      {name: "Technicien(ne) de laboratoire", level: "BTS/DUT", description: "Réaliser des analyses et expérimentations"},
      {name: "Contrôleur(se) qualité", level: "Formation courte", description: "Vérifier la conformité des produits et processus"}
    ],
    environment: "Un cadre calme, intellectuel, propice à la réflexion et à l'analyse approfondie.",
    advice: "Cherche des environnements où tu peux creuser, comprendre et résoudre des problèmes complexes. La tech et l'analyse sont faits pour toi."
  },
  {
    code: "A",
    name: "L'Artistique / Le Créatif",
    description: "Tu as besoin de liberté, d'expression et d'originalité dans ton travail. Tu aimes créer, concevoir, produire des choses uniques et donner du sens à ce que tu fais.",
    traits: [
      {emoji: "🎨", label: "Créatif"},
      {emoji: "💡", label: "Original"},
      {emoji: "✨", label: "Expressif"},
      {emoji: "🎭", label: "Sensible"}
    ],
    radarScores: {ponctualite: 3, resolutionProblemes: 4, resistanceStress: 3, connaissanceMarche: 3, competencesInterpersonnelles: 4},
    strengths: [
      "Grande imagination et sens esthétique",
      "Capacité à innover et à proposer des idées originales",
      "Sensibilité à l'émotion, à la communication visuelle ou verbale"
    ],
    formations: [
      {name: "Formation courte en design graphique, audiovisuel, photographie ou web design", duration: "3-9 mois", level: "Certification"},
      {name: "Bootcamp ou formation certifiante en création de contenu / UX design", duration: "2-6 mois", level: "Bootcamp"}
    ],
    careers: [
      {name: "Graphiste / Web designer", level: "Formation courte", description: "Créer des visuels et interfaces pour le web et print"},
      {name: "Créateur(trice) de contenu digital", level: "Auto-formation", description: "Produire du contenu créatif pour les réseaux sociaux"},
      {name: "Photographe / Vidéaste", level: "Formation/Portfolio", description: "Capturer et créer des images et vidéos"},
      {name: "Designer d'intérieur", level: "Formation spécialisée", description: "Concevoir et aménager des espaces de vie"},
      {name: "Illustrateur(trice) / Motion designer", level: "Formation/Portfolio", description: "Créer des illustrations et animations"},
      {name: "Rédacteur(trice) créatif(ve)", level: "Expérience/Formation", description: "Écrire des contenus originaux et engageants"}
    ],
    environment: "Un cadre libre, expressif et stimulant où tu peux exprimer ta créativité.",
    advice: "Privilégie les environnements qui valorisent l'originalité et la création. Les métiers du design et de la création sont ta voie."
  },
  {
    code: "S",
    name: "Le Social / L'Humain",
    description: "Tu aimes comprendre, écouter et aider les autres à progresser. Tu t'épanouis dans la relation, l'échange, le service ou l'enseignement.",
    traits: [
      {emoji: "🤝", label: "Empathique"},
      {emoji: "💬", label: "À l'écoute"},
      {emoji: "❤️", label: "Bienveillant"},
      {emoji: "👥", label: "Pédagogue"}
    ],
    radarScores: {ponctualite: 4, resolutionProblemes: 4, resistanceStress: 3, connaissanceMarche: 3, competencesInterpersonnelles: 5},
    strengths: [
      "Empathie et patience naturelle",
      "Bonne communication et écoute active",
      "Sens du collectif et de la pédagogie"
    ],
    formations: [
      {name: "Formation en coaching, accompagnement ou aide à la personne", duration: "3-12 mois", level: "Titre pro/Certif/DU"},
      {name: "Diplôme d'État ou formation privée en médiation, insertion ou animation sociale", duration: "6-24 mois", level: "DE/Formation"}
    ],
    careers: [
      {name: "Coach en évolution professionnelle", level: "Certification coaching", description: "Accompagner les personnes dans leur transition de carrière"},
      {name: "Conseiller(ère) en insertion", level: "Titre pro/DE", description: "Aider les personnes en difficulté à retrouver un emploi"},
      {name: "Formateur(trice) ou tuteur", level: "Titre pro/Expérience", description: "Transmettre des compétences et former des adultes"},
      {name: "Assistant(e) social(e) / éducateur(trice)", level: "DE", description: "Accompagner des personnes vulnérables"},
      {name: "Infirmier(ère) / aide médico-psychologique", level: "DE/Diplôme", description: "Soigner et accompagner les patients"},
      {name: "Médiateur(trice) ou accompagnant(e) social(e)", level: "Formation spécialisée", description: "Faciliter les relations et résoudre les conflits"}
    ],
    environment: "Un cadre chaleureux, humain et collaboratif où tu peux créer du lien.",
    advice: "Les métiers de l'accompagnement, du soin et de la formation sont faits pour toi. Ton empathie est une force."
  },
  {
    code: "E",
    name: "L'Entreprenant / Le Leader",
    description: "Tu aimes les défis, les responsabilités et l'action. Tu es à l'aise pour convaincre, vendre, motiver et prendre des décisions.",
    traits: [
      {emoji: "🚀", label: "Ambitieux"},
      {emoji: "💼", label: "Leader"},
      {emoji: "🎯", label: "Décideur"},
      {emoji: "💬", label: "Persuasif"}
    ],
    radarScores: {ponctualite: 4, resolutionProblemes: 4, resistanceStress: 5, connaissanceMarche: 5, competencesInterpersonnelles: 5},
    strengths: [
      "Leadership et aisance à fédérer",
      "Goût du risque et du résultat",
      "Excellente communication orale"
    ],
    formations: [
      {name: "Formation courte en gestion de projet, commerce digital ou entrepreneuriat", duration: "2-6 mois", level: "Certification"},
      {name: "Programme certifiant en marketing digital ou management d'équipe", duration: "3-9 mois", level: "Certification"}
    ],
    careers: [
      {name: "Entrepreneur / Créateur d'entreprise", level: "Formation/Expérience", description: "Créer et développer sa propre activité"},
      {name: "Responsable commercial", level: "Formation/Expérience", description: "Développer les ventes et gérer une équipe commerciale"},
      {name: "Chef(fe) de projet digital", level: "Formation/Expérience", description: "Piloter des projets digitaux de A à Z"},
      {name: "Community manager stratégique", level: "Formation courte", description: "Développer et animer une communauté en ligne"},
      {name: "Recruteur / Talent acquisition", level: "Formation/Expérience", description: "Identifier et recruter les meilleurs talents"},
      {name: "Consultant(e) indépendant(e)", level: "Expertise métier", description: "Conseiller les entreprises dans ton domaine"}
    ],
    environment: "Un cadre dynamique, ambitieux et orienté résultats où tu peux prendre des initiatives.",
    advice: "Les métiers du commerce, de l'entrepreneuriat et du management sont ta zone de confort. Ton énergie est contagieuse."
  },
  {
    code: "C",
    name: "Le Conventionnel / L'Organisé",
    description: "Tu aimes l'ordre, la méthode et les systèmes bien huilés. Tu trouves de la satisfaction à rendre les choses claires, fiables et structurées.",
    traits: [
      {emoji: "📋", label: "Organisé"},
      {emoji: "🗂️", label: "Méthodique"},
      {emoji: "✅", label: "Rigoureux"},
      {emoji: "📊", label: "Fiable"}
    ],
    radarScores: {ponctualite: 5, resolutionProblemes: 4, resistanceStress: 4, connaissanceMarche: 3, competencesInterpersonnelles: 3},
    strengths: [
      "Sens du détail et de la rigueur",
      "Patience et fiabilité dans les tâches répétitives",
      "Capacité à suivre et améliorer des processus"
    ],
    formations: [
      {name: "Formation en comptabilité, gestion administrative ou assistanat", duration: "6-12 mois", level: "Titre pro/BTS"},
      {name: "Certification en gestion de données, bureautique ou secrétariat numérique", duration: "3-6 mois", level: "Certification"}
    ],
    careers: [
      {name: "Assistant(e) administratif(ve)", level: "Titre pro/BTS", description: "Gérer les tâches administratives d'une organisation"},
      {name: "Comptable / gestionnaire paie", level: "BTS/DCG", description: "Tenir la comptabilité et gérer les salaires"},
      {name: "Secrétaire indépendant(e)", level: "Formation/Expérience", description: "Offrir des services administratifs en freelance"},
      {name: "Assistant(e) RH", level: "Formation/Expérience", description: "Soutenir la gestion des ressources humaines"},
      {name: "Technicien(ne) de gestion documentaire", level: "Formation spécialisée", description: "Organiser et archiver les documents"},
      {name: "Gestionnaire de base de données", level: "Formation technique", description: "Maintenir et organiser les données d'entreprise"}
    ],
    environment: "Un cadre ordonné, stable et bien organisé où les processus sont clairs.",
    advice: "Les métiers de l'administration, de la gestion et de l'organisation sont parfaits pour toi. Ta rigueur est précieuse."
  },
  // Profils combinés
  {
    code: "RI",
    name: "Le Technicien Curieux",
    description: "Tu aimes comprendre comment les choses fonctionnent et les faire fonctionner mieux. Curieux, logique et concret.",
    traits: [
      {emoji: "🔧", label: "Pratique"},
      {emoji: "🧠", label: "Analytique"},
      {emoji: "⚙️", label: "Technique"},
      {emoji: "🎯", label: "Efficace"}
    ],
    radarScores: {ponctualite: 5, resolutionProblemes: 5, resistanceStress: 4, connaissanceMarche: 3, competencesInterpersonnelles: 2},
    strengths: [
      "Sens pratique + logique d'analyse",
      "Capacité à apprendre vite, seul",
      "Persévérance et fiabilité"
    ],
    formations: [
      {name: "Formation en maintenance industrielle / automatisme / énergie", duration: "6-12 mois", level: "Titre pro"},
      {name: "Bootcamp en data, cybersécurité ou développement web", duration: "3-6 mois", level: "Bootcamp"}
    ],
    careers: [
      {name: "Technicien(ne) systèmes & réseaux", level: "Formation technique", description: "Installer et maintenir les infrastructures informatiques"},
      {name: "Développeur(se) web junior", level: "Bootcamp/Formation", description: "Créer des sites et applications web"},
      {name: "Data technician", level: "Formation courte", description: "Analyser et gérer des données"},
      {name: "Électronicien(ne) / roboticien(ne)", level: "BTS/Titre pro", description: "Travailler sur des systèmes électroniques complexes"},
      {name: "Technicien(ne) énergie / bâtiment intelligent", level: "Formation spécialisée", description: "Gérer les systèmes énergétiques des bâtiments"},
      {name: "Analyste support technique", level: "Formation/Expérience", description: "Résoudre les problèmes techniques des utilisateurs"}
    ],
    environment: "Un environnement technique où tu peux manipuler, analyser et optimiser.",
    advice: "Les métiers techniques qui allient réflexion et pratique sont parfaits pour toi."
  },
  {
    code: "IS",
    name: "L'Analytique Humaniste",
    description: "Tu combines la logique et l'envie d'aider. Tu cherches à comprendre le monde, mais aussi à avoir un impact humain réel.",
    traits: [
      {emoji: "🧠", label: "Analytique"},
      {emoji: "🤝", label: "Bienveillant"},
      {emoji: "📚", label: "Pédagogue"},
      {emoji: "💬", label: "Transmetteur"}
    ],
    radarScores: {ponctualite: 4, resolutionProblemes: 5, resistanceStress: 3, connaissanceMarche: 3, competencesInterpersonnelles: 4},
    strengths: [
      "Capacité à expliquer des sujets complexes simplement",
      "Esprit rationnel et bienveillant",
      "Goût du savoir et de la transmission"
    ],
    formations: [
      {name: "Formation de coach professionnel / formateur", duration: "6-12 mois", level: "Certification"},
      {name: "Formation en analyse de données ou psychologie appliquée", duration: "6-18 mois", level: "Formation/DU"}
    ],
    careers: [
      {name: "Formateur(trice) en entreprise", level: "Titre pro/Certification", description: "Former les salariés aux compétences métier"},
      {name: "Coach en transition de carrière", level: "Certification coaching", description: "Accompagner les reconversions professionnelles"},
      {name: "Consultant(e) en RH ou mobilité", level: "Formation/Expérience", description: "Conseiller sur la gestion des talents"},
      {name: "Psychopraticien(ne) / accompagnant(e)", level: "Formation spécialisée", description: "Accompagner les personnes en questionnement"},
      {name: "Conseiller(ère) en orientation", level: "Master/Certification", description: "Guider les choix de carrière et formation"},
      {name: "Analyste en formation / e-learning", level: "Formation/Expérience", description: "Concevoir et analyser des parcours de formation"}
    ],
    environment: "Un cadre intellectuel et humain où tu peux transmettre et accompagner.",
    advice: "Les métiers du conseil, de la formation et de l'accompagnement sont faits pour toi."
  },
  {
    code: "AE",
    name: "Le Créatif Ambitieux",
    description: "Tu veux créer, innover, convaincre. Tu cherches la liberté d'entreprendre ou de donner forme à tes idées.",
    traits: [
      {emoji: "🎨", label: "Créatif"},
      {emoji: "🚀", label: "Ambitieux"},
      {emoji: "💡", label: "Visionnaire"},
      {emoji: "💼", label: "Entrepreneur"}
    ],
    radarScores: {ponctualite: 3, resolutionProblemes: 4, resistanceStress: 4, connaissanceMarche: 5, competencesInterpersonnelles: 5},
    strengths: [
      "Créativité pragmatique (tu crées pour impacter)",
      "Leadership naturel",
      "Vision claire et goût du risque mesuré"
    ],
    formations: [
      {name: "Formation courte en design / branding / marketing digital", duration: "3-6 mois", level: "Certification"},
      {name: "Programme entrepreneuriat ou création d'activité", duration: "2-6 mois", level: "Formation"}
    ],
    careers: [
      {name: "Créateur(trice) de contenu ou studio freelance", level: "Auto-formation/Portfolio", description: "Créer et vendre du contenu créatif"},
      {name: "Designer de marque / UX designer", level: "Formation/Portfolio", description: "Concevoir l'identité et l'expérience de marque"},
      {name: "Chef(fe) de projet créatif", level: "Expérience/Formation", description: "Diriger des projets créatifs de A à Z"},
      {name: "Entrepreneur digital", level: "Expérience/Formation", description: "Créer et développer un business en ligne"},
      {name: "Community builder", level: "Expérience/Formation", description: "Créer et animer des communautés engagées"},
      {name: "Consultant(e) en communication visuelle", level: "Expertise/Portfolio", description: "Conseiller sur la stratégie visuelle"}
    ],
    environment: "Un cadre libre et dynamique où tu peux entreprendre et créer.",
    advice: "L'entrepreneuriat créatif et le marketing sont ta zone d'excellence."
  },
  {
    code: "SE",
    name: "Le Communicant Engagé",
    description: "Tu comprends les gens et tu sais les convaincre. Tu veux un métier de contact, d'influence, ou de relation client.",
    traits: [
      {emoji: "💬", label: "Communicant"},
      {emoji: "🤝", label: "Empathique"},
      {emoji: "🎯", label: "Persuasif"},
      {emoji: "👥", label: "Fédérateur"}
    ],
    radarScores: {ponctualite: 4, resolutionProblemes: 4, resistanceStress: 4, connaissanceMarche: 4, competencesInterpersonnelles: 5},
    strengths: [
      "Empathie + charisme naturel",
      "Communication fluide et persuasive",
      "Sens du collectif et de la motivation"
    ],
    formations: [
      {name: "Formation en vente, marketing ou accompagnement commercial", duration: "3-6 mois", level: "Titre pro/Certification"},
      {name: "Certification en communication interpersonnelle ou management d'équipe", duration: "2-6 mois", level: "Certification"}
    ],
    careers: [
      {name: "Recruteur / chargé(e) de relations humaines", level: "Formation/Expérience", description: "Identifier et attirer les talents"},
      {name: "Responsable commercial / business developer", level: "Formation/Expérience", description: "Développer les ventes et le portefeuille client"},
      {name: "Community manager", level: "Formation courte", description: "Animer et développer une communauté en ligne"},
      {name: "Manager d'équipe terrain", level: "Expérience/Formation", description: "Diriger et motiver une équipe opérationnelle"},
      {name: "Conseiller(ère) client premium", level: "Formation/Expérience", description: "Accompagner les clients à haute valeur"},
      {name: "Formateur(trice) en communication", level: "Certification/Expérience", description: "Former aux techniques de communication"}
    ],
    environment: "Un cadre relationnel et dynamique où tu peux échanger et influencer.",
    advice: "Les métiers de la relation client, de la vente et du management sont faits pour toi."
  },
  {
    code: "CE",
    name: "L'Organisé Stratège",
    description: "Tu aimes planifier, gérer, optimiser. Tu préfères la stabilité, mais avec un vrai sens de la performance.",
    traits: [
      {emoji: "📋", label: "Organisé"},
      {emoji: "🎯", label: "Stratège"},
      {emoji: "💼", label: "Gestionnaire"},
      {emoji: "📊", label: "Performant"}
    ],
    radarScores: {ponctualite: 5, resolutionProblemes: 4, resistanceStress: 4, connaissanceMarche: 4, competencesInterpersonnelles: 3},
    strengths: [
      "Vision claire des priorités",
      "Rigueur et gestion du temps",
      "Fiabilité et constance"
    ],
    formations: [
      {name: "Formation en gestion / comptabilité / administration d'entreprise", duration: "6-12 mois", level: "Titre pro/BTS"},
      {name: "Certification en gestion de projet (Agile, PMP)", duration: "3-6 mois", level: "Certification"}
    ],
    careers: [
      {name: "Assistant(e) de direction", level: "BTS/Titre pro", description: "Assister la direction dans ses missions stratégiques"},
      {name: "Gestionnaire administratif(ve)", level: "Titre pro/BTS", description: "Gérer les opérations administratives"},
      {name: "Responsable logistique / opérations", level: "Formation/Expérience", description: "Optimiser les flux et opérations"},
      {name: "Chef(fe) de projet back-office", level: "Formation/Expérience", description: "Piloter des projets de support"},
      {name: "Office manager", level: "Formation/Expérience", description: "Gérer le fonctionnement global d'un bureau"},
      {name: "Contrôleur(se) de gestion", level: "BTS/DCG", description: "Analyser et optimiser les coûts"}
    ],
    environment: "Un cadre structuré et performant où tu peux optimiser les processus.",
    advice: "Les métiers de la gestion, du pilotage et de l'optimisation sont ta force."
  },
  {
    code: "RA",
    name: "L'Artisan Créatif",
    description: "Tu aimes créer de tes mains et donner vie à des idées concrètes. Tu es à la fois manuel et inventif.",
    traits: [
      {emoji: "🔨", label: "Manuel"},
      {emoji: "🎨", label: "Créatif"},
      {emoji: "✨", label: "Inventif"},
      {emoji: "🎯", label: "Précis"}
    ],
    radarScores: {ponctualite: 4, resolutionProblemes: 4, resistanceStress: 4, connaissanceMarche: 3, competencesInterpersonnelles: 3},
    strengths: [
      "Sens esthétique + précision du geste",
      "Patience et exigence de qualité",
      "Créativité ancrée dans le réel"
    ],
    formations: [
      {name: "CAP / formation artisanat design (ébénisterie, déco, fabrication)", duration: "6-24 mois", level: "CAP/Formation"},
      {name: "Formation courte en design produit / impression 3D / prototypage", duration: "3-6 mois", level: "Formation"}
    ],
    careers: [
      {name: "Artisan designer / créateur indépendant", level: "CAP/Portfolio", description: "Créer et vendre des objets artisanaux"},
      {name: "Décorateur(trice) d'intérieur", level: "Formation spécialisée", description: "Aménager et décorer des espaces"},
      {name: "Technicien(ne) fabrication / maquette", level: "Formation technique", description: "Fabriquer des prototypes et maquettes"},
      {name: "Tapissier / menuisier moderne", level: "CAP/BP", description: "Créer et restaurer du mobilier"},
      {name: "Modéliste ou styliste accessoire", level: "Formation mode", description: "Concevoir des accessoires et vêtements"},
      {name: "Fab manager en atelier partagé", level: "Formation/Expérience", description: "Gérer un atelier de fabrication partagé"}
    ],
    environment: "Un atelier créatif où tu peux manipuler, créer et concrétiser tes idées.",
    advice: "L'artisanat créatif et le design manuel sont parfaits pour toi."
  },
  {
    code: "SC",
    name: "Le Soutien Structuré",
    description: "Tu aimes aider les autres, mais dans un cadre clair. Tu rends les organisations plus humaines et plus efficaces.",
    traits: [
      {emoji: "🤝", label: "Aidant"},
      {emoji: "📋", label: "Organisé"},
      {emoji: "💬", label: "Diplomate"},
      {emoji: "🎯", label: "Efficace"}
    ],
    radarScores: {ponctualite: 5, resolutionProblemes: 4, resistanceStress: 4, connaissanceMarche: 3, competencesInterpersonnelles: 5},
    strengths: [
      "Empathie organisée (tu aides sans te disperser)",
      "Bon sens et diplomatie",
      "Respect des process, sens du service"
    ],
    formations: [
      {name: "Formation en ressources humaines / paie / gestion", duration: "6-12 mois", level: "Titre pro/BTS"},
      {name: "Certification assistante RH ou coordination de projet social", duration: "3-6 mois", level: "Certification"}
    ],
    careers: [
      {name: "Assistant(e) RH", level: "BTS/Titre pro", description: "Soutenir la gestion des ressources humaines"},
      {name: "Gestionnaire administratif(ve) social", level: "Titre pro", description: "Gérer les aspects administratifs du social"},
      {name: "Chargé(e) d'accueil / relations salariés", level: "Formation/Expérience", description: "Accueillir et accompagner les salariés"},
      {name: "Coordinateur(trice) d'équipe", level: "Formation/Expérience", description: "Coordonner les activités d'une équipe"},
      {name: "Assistant(e) en cabinet de recrutement", level: "Formation/Expérience", description: "Assister dans les processus de recrutement"},
      {name: "Support client / support interne", level: "Formation courte", description: "Assister les clients ou équipes internes"}
    ],
    environment: "Un cadre structuré et humain où tu peux aider et organiser.",
    advice: "Les métiers du support RH et de la coordination sont parfaits pour toi."
  },
  {
    code: "IA",
    name: "Le Stratège Créatif",
    description: "Tu analyses avant d'imaginer. Tes idées sont solides, construites, réfléchies. Tu cherches à innover avec sens.",
    traits: [
      {emoji: "🧠", label: "Analytique"},
      {emoji: "🎨", label: "Créatif"},
      {emoji: "💡", label: "Innovant"},
      {emoji: "📊", label: "Structuré"}
    ],
    radarScores: {ponctualite: 4, resolutionProblemes: 5, resistanceStress: 3, connaissanceMarche: 4, competencesInterpersonnelles: 3},
    strengths: [
      "Créativité cadrée et structurée",
      "Esprit critique et réflexion profonde",
      "Capacité à relier analyse et intuition"
    ],
    formations: [
      {name: "Formation courte en UX design / stratégie digitale", duration: "3-6 mois", level: "Bootcamp/Formation"},
      {name: "Certification data storytelling / recherche utilisateur", duration: "2-4 mois", level: "Certification"}
    ],
    careers: [
      {name: "UX/UI designer", level: "Bootcamp/Portfolio", description: "Concevoir des expériences utilisateur optimales"},
      {name: "Stratégiste contenu digital", level: "Formation/Expérience", description: "Définir la stratégie de contenu en ligne"},
      {name: "Data visualisation designer", level: "Formation spécialisée", description: "Créer des visualisations de données"},
      {name: "Chef(fe) de projet innovation", level: "Formation/Expérience", description: "Piloter des projets d'innovation"},
      {name: "Rédacteur(trice) spécialisé(e)", level: "Expérience/Portfolio", description: "Rédiger du contenu technique ou spécialisé"},
      {name: "Consultant(e) innovation / produit", level: "Expertise", description: "Conseiller sur l'innovation produit"}
    ],
    environment: "Un cadre intellectuel et créatif où tu peux innover avec méthode.",
    advice: "L'UX design et la stratégie digitale sont faits pour toi."
  },
  {
    code: "RE",
    name: "Le Bâtisseur d'Équipe",
    description: "Tu aimes l'action, le concret et la réussite collective. Tu veux bouger, décider et voir le résultat de ton travail.",
    traits: [
      {emoji: "🔨", label: "Action"},
      {emoji: "👥", label: "Leader"},
      {emoji: "🎯", label: "Résultat"},
      {emoji: "⚡", label: "Dynamique"}
    ],
    radarScores: {ponctualite: 5, resolutionProblemes: 4, resistanceStress: 5, connaissanceMarche: 4, competencesInterpersonnelles: 4},
    strengths: [
      "Esprit d'initiative fort",
      "Goût du terrain et du leadership",
      "Sens du résultat et de l'efficacité"
    ],
    formations: [
      {name: "Formation en management opérationnel / logistique / commerce terrain", duration: "3-6 mois", level: "Titre pro/Formation"},
      {name: "Certif en leadership ou supervision d'équipe", duration: "2-4 mois", level: "Certification"}
    ],
    careers: [
      {name: "Chef(fe) d'équipe terrain", level: "Expérience/Formation", description: "Diriger une équipe opérationnelle sur le terrain"},
      {name: "Responsable logistique", level: "Formation/Expérience", description: "Gérer les flux et optimiser la logistique"},
      {name: "Entrepreneur artisanal", level: "CAP/Expérience", description: "Créer et développer son activité artisanale"},
      {name: "Responsable d'exploitation", level: "Formation/Expérience", description: "Superviser les opérations d'un site"},
      {name: "Manager de production", level: "Formation/Expérience", description: "Gérer la production et les équipes"},
      {name: "Coordinateur(trice) de chantier", level: "Formation technique", description: "Coordonner les différents corps de métier sur un chantier"}
    ],
    environment: "Un environnement terrain, dynamique et orienté résultats.",
    advice: "Le management opérationnel et la gestion terrain sont ta force."
  },
  {
    code: "AS",
    name: "Le Créatif Humain",
    description: "Tu combines créativité et empathie. Tu cherches à créer pour toucher, émouvoir et accompagner les autres.",
    traits: [
      {emoji: "🎨", label: "Créatif"},
      {emoji: "💖", label: "Empathique"},
      {emoji: "✨", label: "Expressif"},
      {emoji: "🤝", label: "Accompagnant"}
    ],
    radarScores: {ponctualite: 3, resolutionProblemes: 4, resistanceStress: 3, connaissanceMarche: 3, competencesInterpersonnelles: 5},
    strengths: [
      "Créativité au service de l'humain",
      "Grande sensibilité et écoute",
      "Capacité à créer du lien par l'art"
    ],
    formations: [
      {name: "Formation en art-thérapie ou médiation culturelle", duration: "6-18 mois", level: "DU/Formation"},
      {name: "Formation courte en animation ou création de contenu social", duration: "3-6 mois", level: "Formation"}
    ],
    careers: [
      {name: "Art-thérapeute", level: "DU/Master", description: "Utiliser l'art pour accompagner et soigner"},
      {name: "Animateur(trice) socioculturel", level: "BPJEPS/Formation", description: "Animer des activités créatives et sociales"},
      {name: "Médiateur(trice) culturel", level: "Licence/Master", description: "Rendre la culture accessible à tous"},
      {name: "Créateur(trice) de contenu à impact social", level: "Auto-formation", description: "Créer du contenu pour sensibiliser"},
      {name: "Coach créatif", level: "Certification", description: "Accompagner par la créativité"},
      {name: "Designer social", level: "Formation spécialisée", description: "Concevoir des solutions pour l'impact social"}
    ],
    environment: "Un cadre créatif et humain où tu peux créer du lien.",
    advice: "Les métiers qui allient création et accompagnement sont faits pour toi."
  },
  {
    code: "IC",
    name: "L'Analyste Méthodique",
    description: "Tu combines logique et structure. Tu aimes analyser avec rigueur et créer des systèmes fiables.",
    traits: [
      {emoji: "🧠", label: "Analytique"},
      {emoji: "📊", label: "Méthodique"},
      {emoji: "🔍", label: "Rigoureux"},
      {emoji: "📋", label: "Structuré"}
    ],
    radarScores: {ponctualite: 5, resolutionProblemes: 5, resistanceStress: 4, connaissanceMarche: 3, competencesInterpersonnelles: 2},
    strengths: [
      "Rigueur intellectuelle et méthodologie",
      "Capacité d'analyse approfondie",
      "Sens de l'organisation des données"
    ],
    formations: [
      {name: "Formation en data analysis / business intelligence", duration: "3-9 mois", level: "Bootcamp/Formation"},
      {name: "Certification en audit ou contrôle qualité", duration: "3-6 mois", level: "Certification"}
    ],
    careers: [
      {name: "Analyste de données", level: "Formation/Expérience", description: "Analyser et interpréter des données complexes"},
      {name: "Consultant(e) en organisation", level: "Formation/Expérience", description: "Optimiser les processus d'entreprise"},
      {name: "Auditeur(trice) interne", level: "Formation comptable", description: "Contrôler et auditer les procédures"},
      {name: "Business analyst", level: "Formation/Expérience", description: "Analyser les besoins métier et proposer des solutions"},
      {name: "Responsable qualité", level: "Formation spécialisée", description: "Garantir la qualité des processus et produits"},
      {name: "Gestionnaire de base de données", level: "Formation technique", description: "Structurer et optimiser les bases de données"}
    ],
    environment: "Un cadre analytique et structuré où tu peux optimiser les systèmes.",
    advice: "L'analyse de données et l'optimisation des processus sont ta voie."
  },
  {
    code: "AC",
    name: "L'Artiste Méthodique",
    description: "Tu combines créativité et organisation. Tu veux créer mais avec une méthode et une structure claire.",
    traits: [
      {emoji: "🎨", label: "Créatif"},
      {emoji: "📋", label: "Organisé"},
      {emoji: "✨", label: "Précis"},
      {emoji: "🎯", label: "Structuré"}
    ],
    radarScores: {ponctualite: 4, resolutionProblemes: 4, resistanceStress: 3, connaissanceMarche: 3, competencesInterpersonnelles: 3},
    strengths: [
      "Créativité organisée et structurée",
      "Sens du détail et de la qualité",
      "Capacité à gérer des projets créatifs"
    ],
    formations: [
      {name: "Formation en design graphique / direction artistique", duration: "6-12 mois", level: "Formation/Bootcamp"},
      {name: "Certification en gestion de projet créatif", duration: "3-6 mois", level: "Certification"}
    ],
    careers: [
      {name: "Directeur(trice) artistique junior", level: "Formation/Portfolio", description: "Superviser la création visuelle de projets"},
      {name: "Designer éditorial", level: "Formation spécialisée", description: "Concevoir la mise en page de publications"},
      {name: "Chef(fe) de projet web", level: "Formation/Expérience", description: "Piloter la création de sites web"},
      {name: "Graphiste indépendant organisé", level: "Portfolio/Formation", description: "Créer et gérer ses projets graphiques"},
      {name: "Coordinateur(trice) de production créative", level: "Formation/Expérience", description: "Coordonner la production de contenus créatifs"},
      {name: "Designer de marque", level: "Formation/Portfolio", description: "Créer des identités visuelles cohérentes"}
    ],
    environment: "Un cadre créatif et structuré où tu peux allier art et méthode.",
    advice: "La direction artistique et le design structuré sont faits pour toi."
  },
  {
    code: "RS",
    name: "Le Pratique Solidaire",
    description: "Tu aimes aider concrètement. Tu veux être utile avec tes mains et ton cœur.",
    traits: [
      {emoji: "🔧", label: "Pratique"},
      {emoji: "🤝", label: "Solidaire"},
      {emoji: "💪", label: "Concret"},
      {emoji: "❤️", label: "Aidant"}
    ],
    radarScores: {ponctualite: 5, resolutionProblemes: 4, resistanceStress: 4, connaissanceMarche: 3, competencesInterpersonnelles: 4},
    strengths: [
      "Action concrète au service des autres",
      "Fiabilité et dévouement",
      "Sens pratique et empathie"
    ],
    formations: [
      {name: "Formation en aide à la personne / services à domicile", duration: "6-12 mois", level: "Titre pro/CAP"},
      {name: "Formation courte en maintenance ou réparation solidaire", duration: "3-6 mois", level: "Formation"}
    ],
    careers: [
      {name: "Aide à domicile", level: "Titre pro/CAP", description: "Accompagner les personnes dépendantes chez elles"},
      {name: "Auxiliaire de vie", level: "Titre pro", description: "Aider les personnes dans les actes de la vie quotidienne"},
      {name: "Technicien(ne) en économie sociale et solidaire", level: "Formation spécialisée", description: "Réparer et maintenir dans un cadre solidaire"},
      {name: "Agent de service hospitalier", level: "Formation courte", description: "Assurer l'hygiène et le confort dans les hôpitaux"},
      {name: "Animateur(trice) en EHPAD", level: "Formation/BPJEPS", description: "Animer des activités pour les personnes âgées"},
      {name: "Mécanicien solidaire", level: "CAP/Formation", description: "Réparer des véhicules dans un cadre associatif"}
    ],
    environment: "Un cadre concret et humain où tu peux aider activement.",
    advice: "Les métiers de l'aide à la personne et du service solidaire sont faits pour toi."
  },
  {
    code: "RC",
    name: "Le Technicien Rigoureux",
    description: "Tu aimes la précision technique et la méthode. Tu veux que tout fonctionne parfaitement.",
    traits: [
      {emoji: "🔧", label: "Technique"},
      {emoji: "📋", label: "Rigoureux"},
      {emoji: "🎯", label: "Précis"},
      {emoji: "⚙️", label: "Méthodique"}
    ],
    radarScores: {ponctualite: 5, resolutionProblemes: 5, resistanceStress: 4, connaissanceMarche: 3, competencesInterpersonnelles: 2},
    strengths: [
      "Précision technique et rigueur",
      "Sens de la méthode et de la qualité",
      "Fiabilité et constance"
    ],
    formations: [
      {name: "Formation en maintenance industrielle / contrôle qualité", duration: "6-12 mois", level: "Titre pro/BTS"},
      {name: "Certification en métrologie ou instrumentation", duration: "3-6 mois", level: "Certification"}
    ],
    careers: [
      {name: "Technicien(ne) de maintenance préventive", level: "BTS/Titre pro", description: "Planifier et réaliser la maintenance des équipements"},
      {name: "Contrôleur(se) qualité industriel", level: "BTS/Formation", description: "Vérifier la conformité des produits"},
      {name: "Mécanicien(ne) de précision", level: "CAP/BP", description: "Réaliser des pièces et assemblages précis"},
      {name: "Technicien(ne) métrologie", level: "BTS/Formation", description: "Mesurer et contrôler avec précision"},
      {name: "Agent de maîtrise en production", level: "BTS/Expérience", description: "Superviser la production avec rigueur"},
      {name: "Technicien(ne) méthodes", level: "BTS/Formation", description: "Optimiser les processus de fabrication"}
    ],
    environment: "Un cadre technique et structuré où la précision est essentielle.",
    advice: "La maintenance de précision et le contrôle qualité sont ta force."
  },
  {
    code: "IE",
    name: "L'Expert Influent",
    description: "Tu combines expertise et leadership. Tu veux être reconnu pour ton savoir et ton influence.",
    traits: [
      {emoji: "🧠", label: "Expert"},
      {emoji: "💼", label: "Leader"},
      {emoji: "🎯", label: "Stratège"},
      {emoji: "💬", label: "Influent"}
    ],
    radarScores: {ponctualite: 4, resolutionProblemes: 5, resistanceStress: 4, connaissanceMarche: 5, competencesInterpersonnelles: 4},
    strengths: [
      "Expertise technique + charisme",
      "Capacité à vulgariser et convaincre",
      "Vision stratégique et leadership"
    ],
    formations: [
      {name: "Formation en management de l'innovation / transformation digitale", duration: "6-12 mois", level: "Formation/Executive"},
      {name: "Certification en conseil stratégique ou consulting", duration: "3-6 mois", level: "Certification"}
    ],
    careers: [
      {name: "Consultant(e) expert", level: "Expertise métier", description: "Conseiller les entreprises dans ton domaine d'expertise"},
      {name: "Chef(fe) de projet technique", level: "Formation/Expérience", description: "Piloter des projets complexes"},
      {name: "Responsable R&D", level: "Formation/Expérience", description: "Diriger la recherche et le développement"},
      {name: "Formateur(trice) technique expert", level: "Expertise/Certification", description: "Former sur des sujets techniques pointus"},
      {name: "Architecte solution", level: "Expertise technique", description: "Concevoir des architectures techniques complexes"},
      {name: "Product owner technique", level: "Formation/Expérience", description: "Définir la vision produit technique"}
    ],
    environment: "Un cadre stratégique et technique où ton expertise est valorisée.",
    advice: "Le consulting expert et le management technique sont ta voie."
  },
  {
    code: "EA",
    name: "Le Visionnaire Charismatique",
    description: "Tu combines ambition et créativité. Tu veux innover, porter une vision et inspirer.",
    traits: [
      {emoji: "🚀", label: "Visionnaire"},
      {emoji: "🎨", label: "Créatif"},
      {emoji: "💫", label: "Inspirant"},
      {emoji: "💼", label: "Entrepreneur"}
    ],
    radarScores: {ponctualite: 3, resolutionProblemes: 4, resistanceStress: 5, connaissanceMarche: 5, competencesInterpersonnelles: 5},
    strengths: [
      "Vision innovante et audacieuse",
      "Charisme et capacité d'inspiration",
      "Créativité au service de l'impact"
    ],
    formations: [
      {name: "Programme entrepreneuriat créatif / innovation", duration: "3-6 mois", level: "Formation/Incubateur"},
      {name: "Formation en personal branding / influence", duration: "2-4 mois", level: "Formation"}
    ],
    careers: [
      {name: "Fondateur(trice) de startup créative", level: "Expérience/Formation", description: "Créer et développer une entreprise innovante"},
      {name: "Directeur(trice) créatif(ve)", level: "Expérience/Portfolio", description: "Définir et porter la vision créative"},
      {name: "Influenceur(se) / créateur(trice) de marque personnelle", level: "Auto-formation", description: "Construire et monétiser son influence"},
      {name: "Entrepreneur créatif", level: "Portfolio/Expérience", description: "Créer et vendre des services créatifs"},
      {name: "Consultant(e) en innovation", level: "Expertise/Expérience", description: "Accompagner l'innovation en entreprise"},
      {name: "Chef(fe) de projet transformation", level: "Formation/Expérience", description: "Piloter des projets de transformation"}
    ],
    environment: "Un cadre libre et ambitieux où tu peux innover et inspirer.",
    advice: "L'entrepreneuriat créatif et l'innovation sont faits pour toi."
  },
  {
    code: "EC",
    name: "Le Manager Organisé",
    description: "Tu combines leadership et rigueur. Tu veux diriger avec méthode et performance.",
    traits: [
      {emoji: "💼", label: "Manager"},
      {emoji: "📊", label: "Organisé"},
      {emoji: "🎯", label: "Performant"},
      {emoji: "⚡", label: "Leader"}
    ],
    radarScores: {ponctualite: 5, resolutionProblemes: 4, resistanceStress: 5, connaissanceMarche: 5, competencesInterpersonnelles: 4},
    strengths: [
      "Leadership structuré et méthodique",
      "Sens de la performance et des résultats",
      "Capacité à organiser et motiver"
    ],
    formations: [
      {name: "Formation en management / gestion d'équipe", duration: "3-6 mois", level: "Formation/Certification"},
      {name: "MBA ou executive program", duration: "12-24 mois", level: "Executive"}
    ],
    careers: [
      {name: "Manager opérationnel", level: "Formation/Expérience", description: "Diriger une équipe et atteindre les objectifs"},
      {name: "Responsable de centre de profit", level: "Formation/Expérience", description: "Gérer une unité avec responsabilité financière"},
      {name: "Chef(fe) de projet PMO", level: "Certification/Expérience", description: "Piloter le portefeuille de projets"},
      {name: "Directeur(trice) des opérations", level: "Expérience/MBA", description: "Superviser l'ensemble des opérations"},
      {name: "Manager de transition", level: "Expertise/Expérience", description: "Prendre en charge des situations de crise ou transformation"},
      {name: "Entrepreneur organisé", level: "Expérience/Formation", description: "Créer et structurer une entreprise performante"}
    ],
    environment: "Un cadre performant et structuré où tu peux diriger avec méthode.",
    advice: "Le management opérationnel et la direction sont ta force."
   }
 ];

function ResultsRiasec() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<RiasecProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [bilanType, setBilanType] = useState<string>('scolaire');
  
  // États pour la version freemium
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // États pour le slideshow du rapport
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  
  const slideBaseNames = Array.from({ length: 12 }, (_, i) => 
    `Presentation - Votre Avenir Commence Ici-${String(i + 1).padStart(2, '0')}`
  );
  // Slides are in /images/Presentation-Votre-Avenir as AVIF/WEBP
  const slidesAvif = slideBaseNames.map((name) => `/images/Presentation-Votre-Avenir/${name}.avif`);
  const slidesWebp = slideBaseNames.map((name) => `/images/Presentation-Votre-Avenir/${name}.webp`);
  
  const minSwipeDistance = 50;
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance && currentSlide < slideBaseNames.length - 1) {
      goToSlide(currentSlide + 1);
    }
    if (distance < -minSwipeDistance && currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  };
  
  const goToSlide = (index: number) => {
    if (index < 0 || index >= slideBaseNames.length || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  
  const handlePrevSlide = () => goToSlide(currentSlide - 1);
  const handleNextSlide = () => goToSlide(currentSlide + 1);
  
  // Keyboard navigation for slideshow
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToSlide(currentSlide - 1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToSlide(currentSlide + 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide, isTransitioning]);
  
  // Vérifier si l'utilisateur revient d'un paiement réussi
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      setIsUnlocked(true);
      
      // Google Analytics - Track purchase event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'purchase', {
          transaction_id: urlParams.get('profile') + '_' + Date.now(),
          value: 18.00,
          currency: 'EUR',
          items: [{
            item_id: 'bilan-orientation-avenirea',
            item_name: 'Bilan d\'orientation complet Avenirea',
            category: 'Orientation professionnelle',
            quantity: 1,
            price: 18.00
          }]
        });
      }
      
      // Mettre à jour le statut de paiement en base
      const updatePaymentStatus = async () => {
        const riasecResultId = localStorage.getItem('riasecResultId');
        if (riasecResultId) {
          try {
            const { error } = await supabase
              .from('riasec_results')
              .update({ payment: 'completed' })
              .eq('id', riasecResultId);
            
            if (error) {
              console.error('Erreur mise à jour statut paiement:', error);
            } else {
              console.log('Statut de paiement mis à jour avec succès');
            }
          } catch (err) {
            console.error('Erreur lors de la mise à jour du paiement:', err);
          }
        }
      };
      
      updatePaymentStatus();
      
      // Optionnel: supprimer le paramètre de l'URL
      const newUrl = window.location.pathname + '?profile=' + urlParams.get('profile');
      window.history.replaceState({}, '', newUrl);
    }
  }, []);
  
  // Easter egg: compteur de clics sur le texte "Visualise tes points forts"
  const handleClickCounterText = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount === 5) {
      setShowPromoModal(true);
    }
  };
  
  // Fonction pour débloquer toutes les sections
  const handleUnlock = () => {
    setIsUnlocked(true);
  };
  
  // Fonction pour naviguer vers le coaching
  const handleDiscoverCoaching = () => {
    navigate('/coaching');
  };

  // Fonction pour enregistrer en base et rediriger vers Stripe
  const handleProceedToPayment = async () => {
    try {
      // Récupérer les données depuis localStorage
      const userName = localStorage.getItem('userName') || null;
      const userEmail = localStorage.getItem('userEmail') || null;
      
      // Récupérer l'ID de la ligne créée lors du test RIASEC
      const riasecResultId = localStorage.getItem('riasecResultId');
      
      if (riasecResultId) {
        // Mettre à jour la ligne existante
        const { error } = await supabase
          .from('riasec_results')
          .update({
            name: userName,
            email: userEmail,
            total_price: 1800, // Prix en centimes (18€ = 1800 centimes)
            payment: 'pending'
          })
          .eq('id', riasecResultId);

        if (error) {
          console.error('Erreur lors de la mise à jour:', error);
          throw error;
        }
        
        console.log('Mise à jour réussie pour l\'ID:', riasecResultId);
      } else {
        // Fallback : créer une nouvelle ligne si pas d'ID trouvé
        console.warn('Aucun ID de résultat RIASEC trouvé, création d\'une nouvelle ligne');
        const { error } = await supabase
          .from('riasec_results')
          .insert({
            name: userName,
            email: userEmail,
            dominant_profile: profile?.code || '',
            profile_name: profile?.name || '',
            r_score: 0,
            i_score: 0,
            a_score: 0,
            s_score: 0,
            e_score: 0,
            c_score: 0,
            total_price: 1800, // Prix en centimes (18€ = 1800 centimes)
            include_monthly_coaching: false,
            payment: 'pending'
          });

        if (error) {
          console.error('Erreur lors de l\'insertion fallback:', error);
          throw error;
        }
      }

      // Construire l'URL de retour vers les résultats avec paiement success
      const currentProfile = new URLSearchParams(window.location.search).get('profile');
      const returnUrl = `${window.location.origin}/resultats-riasec?payment=success&profile=${currentProfile}`;
      
      // Rediriger vers Stripe (lien 18€) avec l'URL de retour
      window.location.href = `https://buy.stripe.com/9B6dRaevWbT3bDK0nY7IY00?success_url=${encodeURIComponent(returnUrl)}`;
      
    } catch (error) {
      console.error('Erreur:', error);
      // Vous pouvez ajouter ici une notification d'erreur pour l'utilisateur
    }
  };

  useEffect(() => {
    const profileCode = searchParams.get('profile');
    
    if (!profileCode) {
      navigate('/');
      return;
    }

    // Récupérer le type de bilan depuis localStorage
    const currentBilanType = localStorage.getItem('bilanType') || 'scolaire';
    setBilanType(currentBilanType);
    
    // Sélectionner le bon tableau de profils selon le type
    const riasecProfiles = currentBilanType === 'scolaire' ? riasecProfilesJeunes : riasecProfilesAdultes;

    const foundProfile = riasecProfiles.find(p => p.code === profileCode);
    
    if (foundProfile) {
      setProfile(foundProfile);
    } else {
      navigate('/');
      return;
    }
    
    setLoading(false);
  }, [searchParams, navigate]);

  const RadarChart = ({ scores }: { scores: any }) => {
    const radarData = [
      { label: "Ponctualité", value: scores.ponctualite },
      { label: "Résolution\nde problèmes", value: scores.resolutionProblemes },
      { label: "Résistance\nau stress", value: scores.resistanceStress },
      { label: "Connaissance\ndu marché", value: scores.connaissanceMarche },
      { label: "Compétences\ninterpersonnelles", value: scores.competencesInterpersonnelles }
    ];

    // Calcul des points du pentagone (chart moderne)
    const centerX = 140;
    const centerY = 130;
    const radius = 75;
    const maxScore = 5;

    const getPointPosition = (index: number, value: number) => {
      const angle = (index * 72 - 90) * Math.PI / 180; // -90 pour commencer en haut
      const distance = (value / maxScore) * radius;
      return {
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance
      };
    };

    const getLabelPosition = (index: number) => {
      const angle = (index * 72 - 90) * Math.PI / 180;
      let distance = radius + 50; // Labels bien à l'extérieur de la toile
      
      // Pour le label du haut (Ponctualité - index 0), on le rapproche maintenant que le titre est remonté
      if (index === 0) {
        distance = radius + 35; // Plus proche de la toile maintenant que le titre est remonté
      }
      
      return {
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance
      };
    };

    // Points de la grille du pentagone (pour les cercles concentriques)
    const gridLevels = [1, 2, 3, 4, 5];
    const gridPoints = gridLevels.map(level => 
      Array.from({ length: 5 }, (_, i) => {
        const angle = (i * 72 - 90) * Math.PI / 180;
        const distance = (level / maxScore) * radius;
        return {
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance
        };
      })
    );

    // Points des données
    const dataPoints = radarData.map((item, index) => getPointPosition(index, item.value));
    const pathData = `M ${dataPoints[0].x} ${dataPoints[0].y} ` + 
      dataPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') + ' Z';

    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <h3 className="text-base font-bold text-center text-gray-800 absolute top-2 sm:top-8">📈 Compétences</h3>
        <svg width="320" height="340" viewBox="-40 -50 360 350">
          {/* Grille de fond */}
          {gridPoints.map((levelPoints, levelIndex) => (
            <polygon
              key={levelIndex}
              points={levelPoints.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Lignes radiales */}
          {radarData.map((_, index) => {
            const angle = (index * 72 - 90) * Math.PI / 180;
            const endX = centerX + Math.cos(angle) * radius;
            const endY = centerY + Math.sin(angle) * radius;
            return (
              <line
                key={index}
                x1={centerX}
                y1={centerY}
                x2={endX}
                y2={endY}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}

          {/* Zone de données */}
          <path
            d={pathData}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3b82f6"
            strokeWidth="2"
          />

          {/* Points de données */}
          {dataPoints.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
            />
          ))}

          {/* Labels */}
          {radarData.map((item, index) => {
            const labelPos = getLabelPosition(index);
            return (
              <text
                key={index}
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm font-medium fill-gray-600"
                style={{ whiteSpace: 'pre-line' }}
              >
                {item.label.split('\n').map((line, lineIndex) => (
                  <tspan key={lineIndex} x={labelPos.x} dy={lineIndex === 0 ? 0 : 12}>
                    {line}
                  </tspan>
                ))}
              </text>
            );
          })}

          {/* Scores numériques */}
          {radarData.map((item, index) => {
            const scorePos = getPointPosition(index, item.value);
            return (
              <text
                key={index}
                x={scorePos.x}
                y={scorePos.y - 10}
                textAnchor="middle"
                className="text-xs font-bold fill-blue-600"
              >
                {item.value}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header hideTestCTA />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement de tes résultats...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Déterminer si c'est un profil pro (reconversion ou public)
  const isPro = bilanType === 'reconversion' || bilanType === 'public';

  return (
    <div className="min-h-screen" style={{ background: isPro ? 'linear-gradient(to bottom right, #F5F1E8, #E8E5DC)' : 'linear-gradient(to bottom right, rgb(239 246 255), rgb(224 231 255))' }}>
      <Header hideTestCTA />
      
      <main className="max-w-5xl mx-auto px-6 pt-20 pb-12">
        {/* Hero Section - Version PRO ou Jeune */}
        {isPro ? (
          // VERSION PROFESSIONNELLE POUR RECONVERSION/PUBLIC
          <div className="mb-16">
            {/* Image hero sobre - Format petit et compact */}
            <div className="relative mb-8 rounded-lg overflow-hidden neo-border max-w-xs mx-auto" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0px #1A1A1A' }}>
              <picture>
                <source srcSet="/images/worker.avif" type="image/avif" />
                <source srcSet="/images/worker.webp" type="image/webp" />
                <img 
                  src="/images/worker.webp" 
                alt="Professionnel en réflexion"
                className="w-full aspect-square object-cover object-center"
                loading="eager"
                  fetchpriority="high"
                decoding="async"
                width={400}
                height={400}
                onError={(e) => {
                  // Fallback si l'image n'existe pas encore
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%236B8E9E" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3EVotre profil%3C/text%3E%3C/svg%3E';
                }}
                />
              </picture>
            </div>

            {/* Titre principal */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ color: '#1A1A1A' }}>
                Votre profil de personnalité professionnelle
              </h1>
              <p className="text-xl text-gray-700 font-medium mb-6 max-w-3xl mx-auto">
                Basé sur la méthode RIASEC, reconnue dans les bilans de compétences.
              </p>
            </div>

            {/* Badge certification */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 neo-border" style={{ background: '#E8F5F0', border: '3px solid #1A1A1A', boxShadow: '4px 4px 0px #1A1A1A' }}>
                <span className="text-2xl">🔍</span>
                <p className="text-sm font-bold text-gray-800">
                  Analyse réalisée selon la méthode RIASEC + validation par un expert Avenirea
                </p>
              </div>
            </div>
          </div>
        ) : (
          // VERSION JEUNE POUR ORIENTATION SCOLAIRE
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Test RIASEC terminé !
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-5xl animate-bounce drop-shadow-lg">
              {(() => {
                const emojiMap: Record<string, string> = {
                    'RI': '🔬', 'RA': '🎨', 'RS': '🤝', 'RE': '🚀', 'RC': '⚙️',
                    'IA': '💡', 'IS': '🧠', 'IE': '🎯', 'IC': '📊',
                    'AS': '🎭', 'AE': '📢', 'AC': '🧑‍🎨',
                    'SE': '👥', 'SC': '🛡️', 'EC': '📋'
                };
                return emojiMap[profile.code] || '🎯';
              })()}
            </div>
            <div className="text-left">
              <div className="mb-2"></div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                {profile.name}
              </h1>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
            {profile.description}
          </p>
        </div>
        )}

        {/* Section Exemple de rapport - Version PRO uniquement */}
        {isPro && (
          <Card className="mb-12" style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF4E6 100%)', border: '3px solid #1A1A1A', boxShadow: '8px 8px 0px #1A1A1A' }}>
            <CardContent className="p-6 md:p-8">
              <div className="text-center mb-8">
                <div className="inline-block px-4 py-2 rounded-lg mb-4" style={{
                  background: '#F5F1E8',
                  border: '2px solid #1A1A1A',
                  boxShadow: '3px 3px 0 #1A1A1A',
                }}>
                  <p className="text-gray-900 font-bold text-sm md:text-base">
                    🎯 Bilan complet à 18 €
                  </p>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
                  Exemple de rapport complet inclus
                </h2>
              </div>

            {/* Slideshow Container - Version légère */}
            <div className="mb-8">
              <div className="flex items-center gap-3 md:gap-4">
                {/* Left Arrow - Desktop Only */}
                <button
                  onClick={handlePrevSlide}
                  disabled={currentSlide === 0}
                  className="hidden md:flex flex-shrink-0 w-12 h-12 items-center justify-center rounded-xl transition-all duration-300 hover:translate-x-[-3px] disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: '#FFFFFF',
                    border: '3px solid #1A1A1A',
                    boxShadow: '5px 5px 0 #1A1A1A',
                    color: '#1A1A1A',
                  }}
                  aria-label="Slide précédent"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Slide Container */}
                <div className="flex-1 relative">
                  <div
                    className="relative rounded-xl overflow-hidden"
                    style={{
                      border: '4px solid #1A1A1A',
                      boxShadow: '8px 8px 0 #1A1A1A',
                      background: '#FFFFFF',
                      display: 'inline-block',
                      width: '100%',
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div style={{ position: 'relative' }}>
                      {slideBaseNames.map((name, index) => (
                        <picture key={`${name}-picture`} style={{ display: index === currentSlide ? 'block' : 'none' }} className={`${index === currentSlide ? 'block' : 'hidden'}`}>
                          <source srcSet={slidesAvif[index]} type="image/avif" />
                          <source srcSet={slidesWebp[index]} type="image/webp" />
                          <img
                            src={slidesWebp[index]}
                            alt={`Page ${index + 1} de votre rapport Avenirea`}
                            className={`w-full h-auto`}
                            loading={index === 0 ? 'eager' : 'lazy'}
                            decoding="async"
                            style={{ display: 'block' }}
                          />
                        </picture>
                      ))}
                    </div>

                    {/* Page Indicator */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
                      <div
                        className="px-3 py-1.5 rounded-lg"
                        style={{
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: '2px solid #1A1A1A',
                          boxShadow: '3px 3px 0 rgba(0,0,0,0.1)',
                        }}
                      >
                        <p className="text-xs font-semibold" style={{ color: '#6B7280' }}>
                          Page {currentSlide + 1} / {slideBaseNames.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="md:hidden mt-4">
                    <div className="flex justify-center gap-2 mb-3">
                      {slideBaseNames.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`transition-all rounded-full ${
                            index === currentSlide ? 'w-2.5 h-2.5' : 'w-2 h-2 opacity-40'
                          }`}
                          style={{
                            background: index === currentSlide ? '#E96A3C' : '#9CA3AF',
                            border: index === currentSlide ? '2px solid #1A1A1A' : 'none',
                          }}
                          aria-label={`Aller à la page ${index + 1}`}
                        />
                      ))}
                    </div>
                    
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={handlePrevSlide}
                        disabled={currentSlide === 0}
                        className="flex w-10 h-10 items-center justify-center rounded-xl transition-all duration-300 active:translate-x-[-2px] disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                          background: '#FFFFFF',
                          border: '3px solid #1A1A1A',
                          boxShadow: '4px 4px 0 #1A1A1A',
                          color: '#1A1A1A',
                        }}
                        aria-label="Slide précédent"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={handleNextSlide}
            disabled={currentSlide === slideBaseNames.length - 1}
                        className="flex w-10 h-10 items-center justify-center rounded-xl transition-all duration-300 active:translate-x-[2px] disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                          background: '#FFFFFF',
                          border: '3px solid #1A1A1A',
                          boxShadow: '4px 4px 0 #1A1A1A',
                          color: '#1A1A1A',
                        }}
                        aria-label="Slide suivant"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Arrow - Desktop Only */}
                <button
                  onClick={handleNextSlide}
                  disabled={currentSlide === slideBaseNames.length - 1}
                  className="hidden md:flex flex-shrink-0 w-12 h-12 items-center justify-center rounded-xl transition-all duration-300 hover:translate-x-[3px] disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: '#FFFFFF',
                    border: '3px solid #1A1A1A',
                    boxShadow: '5px 5px 0 #1A1A1A',
                    color: '#1A1A1A',
                  }}
                  aria-label="Slide suivant"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* CTA Button - Identique à celui de la case bleue */}
            <div className="text-center">
              <Button 
                onClick={handleProceedToPayment}
                className="w-full sm:w-auto px-12 py-6 text-xl font-black transition-all duration-300 hover:translate-y-[-2px]"
                style={{ background: '#E96A3C', color: '#FFFFFF', border: '3px solid #1A1A1A', boxShadow: '6px 6px 0px #1A1A1A' }}
              >
                Télécharger mon rapport
              </Button>
              <p className="text-sm mt-4 font-semibold text-gray-600">
                Paiement sécurisé • Accès immédiat • Satisfait ou remboursé
              </p>
            </div>
            </CardContent>
          </Card>
        )}

        {/* Section Synthèse du profil - Version PRO ou Jeune */}
        <div className="mb-8">
          <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
            {!isPro && <span className="text-2xl">🧠</span>}
            {isPro ? 'Vos atouts naturels' : 'Tes traits de personnalité'}
          </h2>
          {isPro && (
            <p className="text-gray-600 mb-6 text-sm italic">
              Ce qui vous distingue dans votre manière de travailler et d'interagir.
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            {/* Afficher les 2 premiers traits en clair */}
            {profile.traits?.slice(0, 2).map((trait, index) => (
              <span 
                key={index} 
                className={isPro 
                  ? "px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-all duration-300" 
                  : "bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"}
                style={isPro ? { background: '#E8F5F0', border: '2px solid #1A1A1A', boxShadow: '3px 3px 0px #1A1A1A' } : {}}
              >
                {!isPro && <span className="text-base">{trait.emoji}</span>}
                <span>{trait.label}</span>
              </span>
            ))}
            
            {/* Afficher les 2 derniers traits floutés si non débloqué */}
            {profile.traits?.slice(2).map((trait, index) => (
              <LockedSection key={index + 2} isUnlocked={isUnlocked} showOnlyIcon={true} onClick={() => setShowPaymentModal(true)}>
                <span 
                  className={isPro 
                    ? "px-4 py-2 text-sm font-semibold flex items-center gap-2 transition-all duration-300" 
                    : "bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"}
                  style={isPro ? { background: '#E8F5F0', border: '2px solid #1A1A1A', boxShadow: '3px 3px 0px #1A1A1A' } : {}}
                >
                  {!isPro && <span className="text-base">{trait.emoji}</span>}
                  <span>{trait.label}</span>
                </span>
              </LockedSection>
            ))}
          </div>
        </div>

        {/* Section graphique radar - Version PRO ou Jeune */}
        <div className="mb-12 px-2">
          {/* Titre adapté selon le profil */}
          <div className="text-center mb-10">
            {isPro ? (
              <div className="mb-6">
                <h2 className="text-2xl font-black text-gray-900 mb-4">Votre profil de compétences professionnelles</h2>
                <div className="max-w-2xl mx-auto px-6 py-4" style={{ background: '#F5F1E8', border: '2px solid #1A1A1A', boxShadow: '4px 4px 0px #1A1A1A' }}>
                  <p className="text-sm text-gray-700 font-medium">
                    Ce profil reflète votre style professionnel dominant. Il peut être approfondi lors du bilan complet.
                  </p>
                </div>
              </div>
            ) : (
              <>
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg mb-4">
              <span className="text-2xl">📊</span>
              <h2 className="text-xl font-black">Ton profil de compétences</h2>
            </div>
            <p 
              className="text-gray-600 font-medium text-base cursor-pointer hover:text-gray-800 transition-colors"
              onClick={handleClickCounterText}
              title="Cliquez plusieurs fois..."
            >
              Visualise tes points forts pour faire les bons choix.
            </p>
              </>
            )}
          </div>

          <div className="flex flex-col xl:flex-row items-start gap-10">
            {/* 2. Bloc radar à gauche - Grande carte avec dégradé */}
            <div className="flex-shrink-0 mx-auto xl:mx-0">
              <Card 
                className="rounded-2xl shadow-lg w-80 h-80 md:w-96 md:h-96 flex items-center justify-center relative"
                style={isPro ? { background: '#F5F1E8', border: '2px solid #1A1A1A', boxShadow: '4px 4px 0px #1A1A1A' } : {}}
                {...(!isPro && { className: "bg-gradient-to-br from-sky-50 to-white rounded-2xl shadow-lg border border-sky-100 w-80 h-80 md:w-96 md:h-96 flex items-center justify-center relative" })}
              >
                <RadarChart scores={profile.radarScores} />
              </Card>
            </div>

            {/* 3. Bloc interprétation/forces/potentiel à droite */}
            <div className="flex-1 space-y-6 xl:ml-4">
              {/* Titre visible uniquement quand le contenu est verrouillé */}
              {!isUnlocked && (
                <div className="text-center mb-6">
                  <h3 
                    className="text-lg font-bold text-gray-700 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-xl shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={handleClickCounterText}
                    title="Cliquez plusieurs fois..."
                  >
                    💎 Interprétation • Forces • Potentiel
                  </h3>
                </div>
              )}
              
              <LockedSection isUnlocked={isUnlocked} onClick={() => setShowPaymentModal(true)}>
                {/* 🎯 INTERPRÉTATION */}
                <Card className="border-l-4 border-l-blue-500 p-4 md:p-5 rounded-xl shadow-sm" style={isPro ? { background: '#E8F5F0' } : { background: 'rgb(239 246 255)' }}>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full shadow-sm p-2 flex-shrink-0" style={{ background: isPro ? '#F5F1E8' : 'white' }}>
                      <span className="text-lg">🎯</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-blue-600 font-black text-sm uppercase tracking-wide mb-2">
                        INTERPRÉTATION
                      </h3>
                      <p className="text-gray-700 font-medium leading-relaxed text-base">
                        Tu excelles dans les <span className="font-bold text-blue-700">domaines créatifs structurés</span>
                      </p>
                    </div>
                  </div>
                </Card>
              </LockedSection>

              <LockedSection isUnlocked={isUnlocked} onClick={() => setShowPaymentModal(true)}>
                {/* 💪 FORCES */}
                <Card className="border-l-4 border-l-green-500 p-4 md:p-5 rounded-xl shadow-sm" style={isPro ? { background: '#E8F5F0' } : { background: 'rgb(240 253 244)' }}>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full shadow-sm p-2 flex-shrink-0" style={{ background: isPro ? '#F5F1E8' : 'white' }}>
                      <span className="text-lg">💪</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-green-600 font-black text-sm uppercase tracking-wide mb-2">
                        FORCES
                      </h3>
                      <p className="text-gray-700 font-medium leading-relaxed text-base">
                        <span className="font-bold text-green-700">Créativité</span> + <span className="font-bold text-green-700">Organisation</span> = Projets aboutis
                      </p>
                    </div>
                  </div>
                </Card>
              </LockedSection>

              <LockedSection isUnlocked={isUnlocked} onClick={() => setShowPaymentModal(true)}>
                {/* 🚀 POTENTIEL */}
                <Card className="border-l-4 border-l-purple-500 p-4 md:p-5 rounded-xl shadow-sm" style={isPro ? { background: '#E8F5F0' } : { background: 'rgb(250 245 255)' }}>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full shadow-sm p-2 flex-shrink-0" style={{ background: isPro ? '#F5F1E8' : 'white' }}>
                      <span className="text-lg">🚀</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-purple-600 font-black text-sm uppercase tracking-wide mb-2">
                        POTENTIEL
                      </h3>
                      <p className="text-gray-700 font-medium leading-relaxed text-base">
                        Secteurs <span className="font-bold text-purple-700">design, architecture, communication visuelle</span>
                      </p>
                    </div>
                  </div>
                </Card>
              </LockedSection>
            </div>
          </div>

          {/* 4. Ligne de synthèse "profil combiné" */}
          <div className="mt-10">
            <Card className="p-6 rounded-2xl shadow-sm border border-gray-200" style={{ background: isPro ? '#F5F1E8' : 'rgb(249 250 251)' }}>
              <div className="flex items-center justify-center gap-4 text-center">
                <div className="rounded-full shadow-sm p-3" style={{ background: isPro ? '#E8F5F0' : 'white' }}>
                  <span className="text-2xl">🧩</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 font-medium text-lg leading-relaxed">
                    <span className="inline-flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold text-sm hover:bg-blue-200 transition-colors cursor-pointer">Créatif</span>
                      <span className="text-gray-500">+</span>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold text-sm hover:bg-blue-200 transition-colors cursor-pointer">Méthodique</span>
                    </span>
                    <span className="mx-3 text-gray-500">→</span>
                    <span className="font-bold text-gray-800">Tu as 3 compétences fortes alignées avec des métiers visuels.</span>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* 📚 Formations - Version PRO ou Jeune */}
        <div className="mb-8">
          <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-3">
            {!isPro && <span className="text-2xl text-blue-600">📚</span>}
            {isPro ? 'Formations et reconversions recommandées' : 'Formations recommandées'}
          </h2>
          {isPro && (
            <p className="text-gray-600 mb-6 text-sm">
              Ces pistes sont sélectionnées pour les adultes en reconversion, selon votre profil et vos motivations.
              <span className="block mt-2 font-semibold text-gray-700">Aperçu : 2 formations visibles sur {profile.formations?.length || 4}</span>
            </p>
          )}
          
          <div className="grid md:grid-cols-2 gap-4">
            {profile.formations?.map((formation, index) => {
              const getLevelColor = (levelCode: string) => {
                switch(levelCode) {
                  case 'CAP': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
                  case 'BTS': return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200';
                  case 'Bachelor': case 'DNMADE': return 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200';
                  default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
                }
              };
              
              const formationCard = (
                <Card 
                  key={index} 
                  className="p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-blue-500"
                  style={isPro ? { background: '#F5F1E8' } : { background: 'linear-gradient(to bottom right, white, rgb(239 246 255))' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-2xl drop-shadow-sm">{formation.icon || "📚"}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-base font-bold text-gray-900">{formation.name}</h3>
                        <Badge className={`text-xs px-3 py-1 font-semibold shadow-sm border ${getLevelColor(formation.levelCode || "")}`}>
                          {formation.level}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-2 font-medium">
                        <span>⏱️</span>
                        <span>{formation.duration}</span>
                      </div>
                      
                      <p className="text-gray-700 text-sm leading-relaxed font-medium">
                        → {formation.pitch || "Formation recommandée pour ce profil"}
                      </p>
                    </div>
                  </div>
                </Card>
              );
              
              // Afficher la première formation en clair, les autres verrouillées
              if (index === 0) {
                return formationCard;
              } else {
                return (
                  <LockedSection key={index} isUnlocked={isUnlocked} onClick={() => setShowPaymentModal(true)}>
                    {formationCard}
                  </LockedSection>
                );
              }
            })}
          </div>
        </div>

        {/* 💼 Métiers - Version PRO ou Jeune */}
        <div className="mb-8">
          <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-3">
            {!isPro && <span className="text-2xl text-green-600">💼</span>}
            {isPro ? 'Pistes de métiers et évolutions de carrière' : 'Métiers qui te correspondent'}
          </h2>
          {isPro && (
            <p className="text-gray-600 mb-6 text-sm">
              <span className="block mb-2">🔸 Formation : durée moyenne / niveau d'accès</span>
              <span className="block mb-2">🔸 Perspective : Métiers en tension / fort potentiel d'emploi</span>
              <span className="block mt-3 font-semibold text-gray-700">Aperçu : 2 métiers visibles sur {profile.careers?.length || 6}</span>
            </p>
          )}
          
          <div className="grid md:grid-cols-2 gap-4">
            {profile.careers?.map((career, index) => {
              const careerCard = (
                <Card 
                  key={index} 
                  className="p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-green-500"
                  style={isPro ? { background: '#F5F1E8' } : { background: 'linear-gradient(to bottom right, white, rgb(240 253 244))' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-2xl drop-shadow-sm">{career.icon || "💼"}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-base font-bold text-gray-900">{career.name}</h3>
                        <Badge variant="outline" className="text-xs px-2 py-1 font-semibold shadow-sm border-gray-300">
                          {career.tag || "🎯"}
                        </Badge>
                      </div>
                      <div className="space-y-1 mb-3">
                        <p className="text-sm text-gray-600 font-medium">
                          <span className="font-semibold">🎓 Requis :</span> {career.level}
                        </p>
                        <p className="text-sm text-gray-600 font-medium">
                          <span className="font-semibold">📍 Par voie :</span> {career.pathway || "Formation spécialisée"}
                        </p>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed font-medium">
                        <span className="text-base">✨</span> {career.description || "Métier passionnant qui correspond à ton profil"}
                      </p>
                    </div>
                  </div>
                </Card>
              );
              
              // Afficher le premier métier en clair, les autres verrouillés
              if (index === 0) {
                return careerCard;
              } else {
                return (
                  <LockedSection key={index} isUnlocked={isUnlocked} onClick={() => setShowPaymentModal(true)}>
                    {careerCard}
                  </LockedSection>
                );
              }
            })}
          </div>
        </div>

        {/* 📍 Environnement idéal (zone verte) */}
        <div className="mb-6">
          <Card className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 border-emerald-300 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <span className="text-2xl">📍</span>
                Ton environnement idéal
              </h2>
              <p className="text-gray-700 leading-relaxed text-base font-medium">
                {profile.environment}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 🧭 Conseil personnalisé (zone jaune) avec émotions */}
        <div className="mb-8">
          <LockedSection isUnlocked={isUnlocked} onClick={() => setShowPaymentModal(true)}>
            <Card className="bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 border-amber-300 shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                  <span className="text-2xl">🧭</span>
                  Nos conseils pour toi
                </h2>
                               <div className="space-y-3 text-base leading-relaxed">
                 {profile.code === 'RI' ? (
                   <>
                     <p className="text-gray-700"><span className="text-base">🔬</span> Tu es quelqu'un qui aime comprendre le "pourquoi" avant d'agir avec tes mains.</p>
                     <p className="text-gray-700"><span className="text-base">⚙️</span> Ton superpouvoir ? Allier la théorie et la pratique pour résoudre des problèmes techniques.</p>
                     <p className="text-gray-700"><span className="text-base">🛠️</span> On te conseille : des métiers d'ingénierie, robotique ou maintenance où tu peux expérimenter.</p>
                   </>
                 ) : profile.code === 'RS' ? (
                   <>
                     <p className="text-gray-700"><span className="text-base">🤝</span> Tu as un vrai cœur d'accompagnant et tu préfères agir plutôt que parler.</p>
                     <p className="text-gray-700"><span className="text-base">💪</span> Ton superpouvoir ? Être utile concrètement aux personnes qui en ont besoin.</p>
                     <p className="text-gray-700"><span className="text-base">🏥</span> On te conseille : des métiers du soin, de l'éducation ou du social où ton empathie fait la différence.</p>
                   </>
                 ) : profile.code === 'RE' ? (
                   <>
                     <p className="text-gray-700"><span className="text-base">🚀</span> Tu es quelqu'un qui n'attend pas que les choses se fassent : tu les lances.</p>
                     <p className="text-gray-700"><span className="text-base">💼</span> Ton superpouvoir ? Allier ambition et pragmatisme pour développer des projets concrets.</p>
                     <p className="text-gray-700"><span className="text-base">🎯</span> On te conseille : des métiers d'entrepreneuriat, de commerce ou de gestion où tu peux créer et diriger.</p>
                   </>
                 ) : profile.code === 'RA' ? (
                   <>
                     <p className="text-gray-700"><span className="text-base">🔨</span> Tu as besoin de créer avec tes mains, de voir naître un objet concret de ton travail.</p>
                     <p className="text-gray-700"><span className="text-base">🎨</span> Ton superpouvoir ? Allier créativité artistique et savoir-faire technique pour créer du beau et de l'utile.</p>
                     <p className="text-gray-700"><span className="text-base">🏺</span> On te conseille : des métiers d'artisanat d'art, de design produit ou de fabrication où tes mains donnent vie à tes idées.</p>
                   </>
                 ) : profile.code === 'RC' ? (
                   <>
                     <p className="text-gray-700"><span className="text-base">🎯</span> Tu es quelqu'un de précis qui aime que tout fonctionne parfaitement et dans les règles.</p>
                     <p className="text-gray-700"><span className="text-base">🔧</span> Ton superpouvoir ? Allier compétences techniques et rigueur méthodologique pour maintenir des systèmes fiables.</p>
                     <p className="text-gray-700"><span className="text-base">⚡</span> On te conseille : des métiers techniques industriels où ta précision et ton sens de l'organisation sont indispensables.</p>
                   </>
                 ) : profile.code === 'IA' ? (
                   <>
                     <p className="text-gray-700"><span className="text-base">💡</span> Tu es quelqu'un qui pense différemment et voit des solutions là où d'autres voient des limites.</p>
                     <p className="text-gray-700"><span className="text-base">🔬</span> Ton superpouvoir ? Combiner curiosité intellectuelle et créativité pour innover et inventer.</p>
                     <p className="text-gray-700"><span className="text-base">🤖</span> On te conseille : des métiers tech créatifs comme le développement, l'IA ou l'UX où tu peux expérimenter.</p>
                   </>
                 ) : profile.code === 'IS' ? (
                   <>
                     <p className="text-gray-700"><span className="text-base">🤔</span> Tu comprends les gens et tu analyses finement, sans avoir besoin de crier pour aider.</p>
                     <p className="text-gray-700"><span className="text-base">❤️</span> Ton superpouvoir ? Combiner rigueur intellectuelle et empathie pour accompagner l'humain.</p>
                     <p className="text-gray-700"><span className="text-base">🧠</span> On te conseille : des métiers de psychologie, de conseil ou d'accompagnement où ton analyse et ton empathie font la différence.</p>
                   </>
                 ) : profile.code === 'IE' ? (
                   <>
                     <p className="text-gray-700"><span className="text-base">🎯</span> Tu combines vision stratégique, logique et capacité de persuasion pour prendre de la hauteur.</p>
                     <p className="text-gray-700"><span className="text-base">📊</span> Ton superpouvoir ? Analyser finement pour prendre des décisions stratégiques impactantes.</p>
                     <p className="text-gray-700"><span className="text-base">🚀</span> On te conseille : des métiers de conseil, finance ou entrepreneuriat où ton expertise et ton influence sont valorisées.</p>
                   </>
                 ) : profile.code === 'AC' ? (
                   <>
                     <p className="text-gray-700"><span className="text-base">🌱</span> Tu es une personne créative, mais tu as besoin d'un cadre pour donner le meilleur de toi-même.</p>
                     <p className="text-gray-700"><span className="text-base">🌟</span> Ton superpouvoir ? Transformer une idée en projet fini, sans partir dans tous les sens.</p>
                     <p className="text-gray-700"><span className="text-base">🛠</span> On te conseille : des projets visuels cadrés (UX, design, archi) où ton côté méthodique devient un atout.</p>
                   </>
                 ) : profile.code === 'IC' ? (
                   <>
                     <p className="text-gray-700"><span className="text-base">🧠</span> Tu es quelqu'un qui aime analyser en profondeur avec méthode et précision.</p>
                     <p className="text-gray-700"><span className="text-base">🎯</span> Ton superpouvoir ? Combiner logique rigoureuse et curiosité intellectuelle pour résoudre des problèmes complexes.</p>
                     <p className="text-gray-700"><span className="text-base">📊</span> On te conseille : des métiers d'analyse de données, de développement ou de gestion où ton esprit structuré fait la différence.</p>
                   </>
                 ) : profile.code === 'AS' ? (
                   <>
                     <p className="text-gray-700"><span className="text-base">🎭</span> Tu as une âme d'artiste mais tu ne peux pas créer sans les autres : tu veux transmettre, partager, faire vibrer.</p>
                     <p className="text-gray-700"><span className="text-base">❤️</span> Ton superpouvoir ? Combiner créativité artistique et empathie pour toucher et rassembler les gens.</p>
                     <p className="text-gray-700"><span className="text-base">🎪</span> On te conseille : des métiers d'animation, communication ou médiation où ta créativité sert une cause humaine.</p>
                   </>
                 ) : profile.code === 'SE' ? (
                   <>
                     <p className="text-gray-700"><span className="text-base">👥</span> Tu es un pilier pour les autres : tu sais motiver, rassurer et structurer avec bienveillance.</p>
                     <p className="text-gray-700"><span className="text-base">⚡</span> Ton superpouvoir ? Combiner empathie naturelle et capacité de leadership pour accompagner les équipes.</p>
                     <p className="text-gray-700"><span className="text-base">🧭</span> On te conseille : des fonctions d'encadrement, management ou coordination où ton leadership sert un collectif.</p>
                   </>
                 ) : profile.code === 'SC' ? (
                   <>
                     <p className="text-gray-700"><span className="text-base">📋</span> Tu es quelqu'un sur qui on peut compter : tu combines rigueur et bienveillance naturellement.</p>
                     <p className="text-gray-700"><span className="text-base">✅</span> Ton superpouvoir ? Créer un cadre clair et sécurisant pour accompagner les autres dans leurs difficultés.</p>
                     <p className="text-gray-700"><span className="text-base">🤲</span> On te conseille : des métiers d'accompagnement social, éducation ou interface humaine où ton organisation sert les autres.</p>
                   </>
                 ) : profile.code === 'EC' ? (
                   <>
                     <p className="text-gray-700"><span className="text-base">⚡</span> Tu es quelqu'un qui sait organiser, décider et structurer avec efficacité et méthode.</p>
                     <p className="text-gray-700"><span className="text-base">🎯</span> Ton superpouvoir ? Combiner leadership naturel et rigueur organisationnelle pour faire décoller des projets.</p>
                     <p className="text-gray-700"><span className="text-base">📊</span> On te conseille : des métiers de management, gestion de projet ou conseil où ton sens de l'efficacité optimise les résultats.</p>
                   </>
                 ) : profile.code === 'AE' ? (
                   <>
                     <p className="text-gray-700"><span className="text-base">🎭</span> Tu es quelqu'un qui sait parler, porter une vision et inspirer les autres avec ton charisme naturel.</p>
                     <p className="text-gray-700"><span className="text-base">🚀</span> Ton superpouvoir ? Combiner créativité visionnaire et capacité d'influence pour faire bouger les lignes.</p>
                     <p className="text-gray-700"><span className="text-base">📢</span> On te conseille : des métiers de communication, influence ou leadership où ton énergie et ton charisme ouvrent des portes.</p>
                   </>
                 ) : (
                   <p className="text-gray-700">{profile.advice}</p>
                 )}
               </div>
            </CardContent>
          </Card>
          </LockedSection>
        </div>

        {/* Section Offre Premium - Version PRO ou Jeune */}
        {isPro ? (
          // VERSION PROFESSIONNELLE - 19€
          <>
            {/* Section preuve humaine */}
            <div className="mb-12 text-center">
              <div className="inline-block px-6 py-4" style={{ background: '#F5F1E8', border: '2px solid #1A1A1A', boxShadow: '4px 4px 0px #1A1A1A' }}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-2xl">
                    👩‍💼
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900">Analyse réalisée par Julie</p>
                    <p className="text-xs text-gray-600">Consultante en orientation et reconversion (certifiée RNCP)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Offre premium pro */}
            <Card className="mb-8" style={{ background: 'linear-gradient(135deg, #6B8E9E 0%, #5A7A8A 100%)', border: '3px solid #1A1A1A', boxShadow: '8px 8px 0px #1A1A1A' }}>
              <CardContent className="p-8 text-center text-white">
                <h2 className="text-3xl font-black mb-6">
                  Recevez votre bilan complet Avenirea
                </h2>
                
                <div className="mb-6 inline-block px-8 py-4 bg-white text-gray-900 font-black text-4xl" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0px rgba(0,0,0,0.3)' }}>
                  18 €
                </div>
                
                <p className="text-lg mb-8 font-medium">
                  Un rapport personnalisé de <strong>12 pages</strong> + un retour personnalisé d'un conseiller certifié
                </p>

                <div className="text-left max-w-lg mx-auto mb-8 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-green-300 font-bold mt-1">✓</span>
                    <span className="font-medium">Un rapport personnalisé de <strong>12 pages</strong> sur votre profil et votre avenir professionnel</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-300 font-bold mt-1">✓</span>
                    <span className="font-medium">Votre profil complet RIASEC et ses interprétations détaillées</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-300 font-bold mt-1">✓</span>
                    <span className="font-medium">Les 6 métiers et formations les plus adaptés à votre profil</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-300 font-bold mt-1">✓</span>
                    <span className="font-medium">Un expert vous contacte par mail avec des conseils personnalisés sur votre situation</span>
                  </div>
                </div>

                {/* Témoignage Claire - Version compacte */}
                <div 
                  className="mb-8 p-6 rounded-xl text-left"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '4px 4px 0 rgba(0,0,0,0.2)'
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div 
                        className="rounded-full overflow-hidden"
                        style={{
                          width: '60px',
                          height: '60px',
                          border: '2px solid rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        <picture>
                          <source srcSet="/images/woman-working-suit.avif" type="image/avif" />
                          <source srcSet="/images/woman-working-suit.webp" type="image/webp" />
                          <img
                            src="/images/woman-working-suit.webp"
                            alt="Jennifer"
                            className="w-full h-full object-cover"
                            width={60}
                            height={60}
                            loading="lazy"
                            decoding="async"
                          />
                        </picture>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm leading-relaxed mb-2 italic">
                        "Le test Avenirea m'a permis de découvrir mes forces et de voir des métiers auxquels je n'aurais jamais pensé. Grâce au rapport et aux conseils d'un expert, j'ai changé de voie et décroché un emploi de professeure documentaliste qui me passionne."
                      </p>
                      <p className="text-white text-xs font-semibold">
                        — Jennifer, ex-UX designer devenue professeure documentaliste
                      </p>
                    </div>
                  </div>
                </div>

                {/* Slideshow Preview - Intégré dans la carte */}
                <div className="mb-8">
                  {/* Header du slideshow */}
                  <div className="text-center mb-6">
                    <div className="inline-block px-4 py-2 rounded-lg mb-3" style={{
                      background: 'rgba(255, 255, 255, 0.25)',
                      border: '2px solid rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(10px)',
                    }}>
                      <p className="text-sm md:text-base font-bold text-white">
                        📄 Exemple d'un rapport complet de 12 pages
                      </p>
                    </div>
                    <p className="text-white text-sm font-medium opacity-90">
                      Découvrez le format et la qualité du rapport personnalisé que vous recevrez
                    </p>
                  </div>

                  {/* Slideshow Container */}
                  <div className="flex items-center gap-3 md:gap-4">
                    {/* Left Arrow - Desktop Only */}
                    <button
                      onClick={handlePrevSlide}
                      disabled={currentSlide === 0}
                      className="hidden md:flex flex-shrink-0 w-12 h-12 items-center justify-center rounded-xl transition-all duration-300 hover:translate-x-[-3px] disabled:opacity-20 disabled:cursor-not-allowed"
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                        boxShadow: '4px 4px 0 rgba(0,0,0,0.2)',
                        color: '#1A1A1A',
                      }}
                      aria-label="Slide précédent"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {/* Slide Container */}
                    <div className="flex-1 relative">
                      <div
                        className="relative rounded-xl overflow-hidden"
                        style={{
                          border: '3px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: '6px 6px 0 rgba(0,0,0,0.2)',
                          background: '#FFFFFF',
                          display: 'inline-block',
                          width: '100%',
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                      >
                        <picture>
                          <source srcSet={slidesAvif[currentSlide]} type="image/avif" />
                          <source srcSet={slidesWebp[currentSlide]} type="image/webp" />
                          <img
                            src={slidesWebp[currentSlide]}
                            alt={`Page ${currentSlide + 1} de votre rapport Avenirea`}
                            className={`w-full h-auto block transition-opacity duration-300 ${
                              isTransitioning ? 'opacity-70' : 'opacity-100'
                            }`}
                            loading={currentSlide === 0 ? 'eager' : 'lazy'}
                            decoding="async"
                            style={{ display: 'block' }}
                          />
                        </picture>

                        {/* Page Indicator */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
                          <div
                            className="px-3 py-1.5 rounded-lg"
                            style={{
                              background: 'rgba(255, 255, 255, 0.95)',
                              border: '2px solid #1A1A1A',
                              boxShadow: '2px 2px 0 rgba(0,0,0,0.1)',
                            }}
                          >
                        <p className="text-xs font-semibold" style={{ color: '#6B7280' }}>
                          Page {currentSlide + 1} / {slideBaseNames.length}
                        </p>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Navigation */}
                      <div className="md:hidden mt-4">
                        <div className="flex justify-center gap-2 mb-3">
                      {slideBaseNames.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => goToSlide(index)}
                              className={`transition-all rounded-full ${
                                index === currentSlide ? 'w-2.5 h-2.5' : 'w-2 h-2 opacity-40'
                              }`}
                              style={{
                                background: index === currentSlide ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
                                border: index === currentSlide ? '2px solid rgba(255, 255, 255, 0.8)' : 'none',
                              }}
                              aria-label={`Aller à la page ${index + 1}`}
                            />
                          ))}
                        </div>
                        
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={handlePrevSlide}
                            disabled={currentSlide === 0}
                            className="flex w-10 h-10 items-center justify-center rounded-xl transition-all duration-300 active:translate-x-[-2px] disabled:opacity-20 disabled:cursor-not-allowed"
                            style={{
                              background: 'rgba(255, 255, 255, 0.9)',
                              border: '2px solid rgba(255, 255, 255, 0.5)',
                              boxShadow: '3px 3px 0 rgba(0,0,0,0.2)',
                              color: '#1A1A1A',
                            }}
                            aria-label="Slide précédent"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          
                          <button
                            onClick={handleNextSlide}
                        disabled={currentSlide === slideBaseNames.length - 1}
                            className="flex w-10 h-10 items-center justify-center rounded-xl transition-all duration-300 active:translate-x-[2px] disabled:opacity-20 disabled:cursor-not-allowed"
                            style={{
                              background: 'rgba(255, 255, 255, 0.9)',
                              border: '2px solid rgba(255, 255, 255, 0.5)',
                              boxShadow: '3px 3px 0 rgba(0,0,0,0.2)',
                              color: '#1A1A1A',
                            }}
                            aria-label="Slide suivant"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Arrow - Desktop Only */}
                    <button
                      onClick={handleNextSlide}
            disabled={currentSlide === slideBaseNames.length - 1}
                      className="hidden md:flex flex-shrink-0 w-12 h-12 items-center justify-center rounded-xl transition-all duration-300 hover:translate-x-[3px] disabled:opacity-20 disabled:cursor-not-allowed"
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                        boxShadow: '4px 4px 0 rgba(0,0,0,0.2)',
                        color: '#1A1A1A',
                      }}
                      aria-label="Slide suivant"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <Button 
                  onClick={handleProceedToPayment}
                  className="w-full sm:w-auto px-12 py-6 text-xl font-black transition-all duration-300 hover:translate-y-[-2px]"
                  style={{ background: '#E96A3C', color: '#FFFFFF', border: '3px solid #1A1A1A', boxShadow: '6px 6px 0px #1A1A1A' }}
                >
                  Télécharger mon rapport
                </Button>
                
                <p className="text-sm mt-4 font-semibold text-green-200">
                  Paiement sécurisé • Accès immédiat • Satisfait ou remboursé
                </p>
              </CardContent>
            </Card>

            {/* Accompagnement premium */}
            <Card className="mb-8" style={{ background: '#F5F1E8', border: '2px solid #1A1A1A', boxShadow: '6px 6px 0px #1A1A1A' }}>
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-black mb-4 text-gray-900">
                  💼 Accompagnement premium
                </h2>
                
                <p className="text-3xl font-black mb-6" style={{ color: '#6B8E9E' }}>
                  59 € <span className="text-sm font-normal text-gray-600">(rapport inclus)</span>
                </p>

                <div className="text-left max-w-lg mx-auto mb-8 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span className="font-medium text-gray-700">1 à 2 sessions de coaching individuel (30 à 45 min chacune) pour clarifier ton projet et lever tes blocages</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 font-bold mt-1">✓</span>
                    <span className="font-medium text-gray-700">Un suivi personnalisé pendant 1 mois, avec conseils, objectifs et retours concrets sur ton évolution</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    window.location.href = 'https://buy.stripe.com/4gMaEYcnO5uFazGc6G7IY03';
                  }}
                  className="px-8 py-4 text-lg font-bold transition-all"
                  style={{ background: '#E96A3C', color: '#FFFFFF', border: '3px solid #1A1A1A', boxShadow: '6px 6px 0px #1A1A1A' }}
                >
                  Démarrer l'accompagnement
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          // VERSION JEUNE - 1,90€
          <>
        <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl border-0">
          <CardContent className="p-4 sm:p-6 md:p-8 text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-black mb-3 md:mb-4 tracking-tight leading-tight">
              👀 Tu veux accéder à tous tes résultats ?
            </h2>
            
            <div className="mb-4 md:mb-6">
              <p className="text-blue-100 text-xs sm:text-sm md:text-base font-medium mb-3">
                👉 Débloque ton bilan complet pour :
              </p>
              <div className="inline-block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black">18€</span>
                  <div className="text-xs font-bold uppercase tracking-wide opacity-90">
                    <div>💎 Premium</div>
                  </div>
                </div>
              </div>
              <p className="text-emerald-200 text-xs mt-2 font-semibold animate-pulse">
                ⚡ Accès instantané • Prix de lancement
              </p>
            </div>
            
            <div className="text-left max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-6 space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3 text-blue-100">
                <span className="text-green-400 font-bold text-sm">✓</span>
                <span className="text-xs sm:text-sm md:text-base font-medium">Les 4 traits de ta personnalité</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-blue-100">
                <span className="text-green-400 font-bold text-sm">✓</span>
                <span className="text-xs sm:text-sm md:text-base font-medium">Toutes les formations et métiers faits pour toi</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-blue-100">
                <span className="text-green-400 font-bold text-sm">✓</span>
                <span className="text-xs sm:text-sm md:text-base font-medium">Ton plan d'action et des conseils concrets</span>
              </div>
            </div>
            
            <Button 
              onClick={() => setShowPaymentModal(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white px-4 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 text-base sm:text-lg md:text-xl font-black transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-emerald-400/25 border-2 border-white/20 rounded-2xl"
            >
              <span className="flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">🔓</span>
                <span className="text-sm sm:text-base md:text-lg">DÉBLOQUER MAINTENANT</span>
                <span className="text-xl sm:text-2xl animate-bounce">💎</span>
              </span>
            </Button>
            
            <p className="text-emerald-200 text-xs sm:text-sm mt-3 font-semibold">
              ⚡ Paiement sécurisé • Accès immédiat • Satisfait ou remboursé
            </p>
          </CardContent>
        </Card>

            {/* Coaching CTA - pour les jeunes */}
        <div className="max-w-2xl mx-auto">
          <CoachingCTA onDiscover={handleDiscoverCoaching} />
        </div>
          </>
        )}
      </main>

      <Footer />
      
      {/* Modal PromoCode pour l'easter egg */}
      <PromoModal 
        isOpen={showPromoModal}
        onClose={() => setShowPromoModal(false)}
        onUnlock={handleUnlock}
      />
      
      {/* Modal de paiement pour collecter nom/email */}
      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onProceedToPayment={handleProceedToPayment}
      />
    </div>
  );
}

export default ResultsRiasec; 