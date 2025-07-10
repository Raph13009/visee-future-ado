import { useEffect, useState } from "react";
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
}

const riasecProfiles: RiasecProfile[] = [
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

function ResultsRiasec() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<RiasecProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // États pour la version freemium
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Vérifier si l'utilisateur revient d'un paiement réussi
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      setIsUnlocked(true);
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
  
  // Fonction pour enregistrer en base et rediriger vers Stripe
  const handleProceedToPayment = async (name: string, email: string) => {
    try {
      // Traiter les champs vides avec des valeurs par défaut
      const finalName = name.trim() || null;
      const finalEmail = email.trim() || null;
      
      // Enregistrer les données utilisateur et le profil RIASEC en base
      const { error } = await supabase
        .from('riasec_results')
        .insert({
          name: finalName,
          email: finalEmail,
          dominant_profile: profile?.code || '',
          profile_name: profile?.name || '',
          r_score: 0,
          i_score: 0,
          a_score: 0,
          s_score: 0,
          e_score: 0,
          c_score: 0,
          total_price: 190, // Prix en centimes (1.90€ = 190 centimes)
          include_monthly_coaching: false,
          payment: 'pending'
        });

      if (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        console.error('Détails de l\'erreur:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      // Fermer le modal
      setShowPaymentModal(false);

      // Construire l'URL de retour avec le profil actuel et le paramètre de succès
      const currentProfile = new URLSearchParams(window.location.search).get('profile');
      const returnUrl = `${window.location.origin}/resultats-riasec?profile=${currentProfile}&payment=success`;
      
      // Rediriger vers Stripe avec l'URL de retour
      window.location.href = `https://buy.stripe.com/dRm28safGcX7fU00nY7IY02?success_url=${encodeURIComponent(returnUrl)}`;
      
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header hideTestCTA />
      
      <main className="max-w-5xl mx-auto px-6 pt-20 pb-12">
        {/* 👤 Titre + Sous-titre + 🧑‍🎨 Illustration dynamique */}
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
                  'RI': '🔬', // Le Pratique Curieux - scientifique
                  'RA': '🎨', // L'Artisan Créatif - artistique
                  'RS': '🤝', // Le Pratique Solidaire - social
                  'RE': '🚀', // L'Entrepreneur Pratique - entrepreneurial
                  'RC': '⚙️', // Le Technicien Rigoureux - technique
                  'IA': '💡', // L'Innovateur Créatif - innovation
                  'IS': '🧠', // Le Chercheur Humaniste - intellectuel humain
                  'IE': '🎯', // L'Expert Influent - stratégique
                  'IC': '📊', // L'Analyste Méthodique - analytique
                  'AS': '🎭', // Le Créatif Humain - expressif
                  'AE': '📢', // Le Visionnaire Charismatique - communicant
                  'AC': '🧑‍🎨', // L'Artiste Méthodique - artiste structuré
                  'SE': '👥', // Le Leader Bienveillant - leadership humain
                  'SC': '🛡️', // L'Accompagnateur Structuré - protecteur
                  'EC': '📋'  // Le Manager Organisé - gestionnaire
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

        {/* 🧠 Traits de personnalité (pills visuels) */}
        <div className="mb-8">
          <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
            <span className="text-2xl">🧠</span>
            Tes traits de personnalité
          </h2>
          <div className="flex flex-wrap gap-3">
            {/* Afficher les 2 premiers traits en clair */}
            {profile.traits?.slice(0, 2).map((trait, index) => (
              <span key={index} className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <span className="text-base">{trait.emoji}</span>
                <span>{trait.label}</span>
              </span>
            ))}
            
            {/* Afficher les 2 derniers traits floutés si non débloqué */}
            {profile.traits?.slice(2).map((trait, index) => (
              <LockedSection key={index + 2} isUnlocked={isUnlocked} showOnlyIcon={true}>
                <span className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <span className="text-base">{trait.emoji}</span>
                  <span>{trait.label}</span>
                </span>
              </LockedSection>
            ))}
          </div>
        </div>

        {/* 📊 Ton profil de compétences - Section moderne */}
        <div className="mb-12 px-2">
          {/* 1. Section titre avec baseline inspirante */}
          <div className="text-center mb-10">
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
          </div>

          <div className="flex flex-col xl:flex-row items-start gap-10">
            {/* 2. Bloc radar à gauche - Grande carte avec dégradé */}
            <div className="flex-shrink-0 mx-auto xl:mx-0">
              <Card className="bg-gradient-to-br from-sky-50 to-white rounded-2xl shadow-lg border border-sky-100 w-80 h-80 md:w-96 md:h-96 flex items-center justify-center relative">
                <RadarChart scores={profile.radarScores} />
              </Card>
            </div>

            {/* 3. Bloc interprétation/forces/potentiel à droite */}
            <div className="flex-1 space-y-6 xl:ml-4">
              {/* Titre visible uniquement quand le contenu est verrouillé */}
              {!isUnlocked && (
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-gray-700 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-xl shadow-sm">
                    💎 Interprétation • Forces • Potentiel
                  </h3>
                </div>
              )}
              
              <LockedSection isUnlocked={isUnlocked} onClick={() => setShowPaymentModal(true)}>
                {/* 🎯 INTERPRÉTATION */}
                <Card className="bg-blue-50 border-l-4 border-l-blue-500 p-4 md:p-5 rounded-xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-white shadow-sm p-2 flex-shrink-0">
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
                <Card className="bg-green-50 border-l-4 border-l-green-500 p-4 md:p-5 rounded-xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-white shadow-sm p-2 flex-shrink-0">
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
                <Card className="bg-purple-50 border-l-4 border-l-purple-500 p-4 md:p-5 rounded-xl shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-white shadow-sm p-2 flex-shrink-0">
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
            <Card className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-center gap-4 text-center">
                <div className="rounded-full bg-white shadow-sm p-3">
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

        {/* 📚 Formations (cards visuelles avec durée, niveau, voie) */}
        <div className="mb-8">
          <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-3">
            <span className="text-2xl text-blue-600">📚</span>
            Formations recommandées
          </h2>
          
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
                <Card key={index} className="p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50">
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

        {/* 💼 Métiers (cards visuelles avec voie + phrase d'accroche) */}
        <div className="mb-8">
          <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-3">
            <span className="text-2xl text-green-600">💼</span>
            Métiers qui te correspondent
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {profile.careers?.map((career, index) => {
              const careerCard = (
                <Card key={index} className="p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-green-500 bg-gradient-to-br from-white to-green-50">
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

        {/* 🔥 Bloc final = Call-to-action + bénéfices du test complet */}
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
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black">1,90€</span>
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