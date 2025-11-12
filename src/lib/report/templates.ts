/**
 * Report Model Builder
 * 
 * This module builds the report model from calculated scores.
 * All text content is now loaded from templates via templateLoader.
 */

import {
  getTraitDescription,
  getTraitStrengths,
  getTraitGrowthAreas,
  getTraitWorkExamples,
} from './templateLoader';

// Define TRAITS locally to avoid circular dependencies
export const TRAITS = [
  "Precision & Organization",
  "Empathy & Altruism",
  "Creativity & Expression",
  "Logic & Reflection",
  "Leadership & Confidence",
  "Harmony & Cooperation"
] as const;

export interface TraitScore {
  name: string;
  score: number;
}

export interface ReportModel {
  scores: Record<string, number>;
  dominantTraits: string[];
  topStrengths: string[];
  areasForGrowth: string[];
  recommendedPaths: Array<{ title: string; reason: string }>;
  dailyChallenges: Array<{ week: number; task: string; explanation: string; outcome: string }>;
}

/**
 * Build report model from scores
 */
export function buildReportModel(scores: Record<string, number>): ReportModel {
  // Validate TRAITS is defined
  if (!TRAITS || TRAITS.length === 0) {
    console.error("TRAITS is not defined or empty");
    return {
      scores,
      dominantTraits: [],
      topStrengths: [],
      areasForGrowth: [],
      recommendedPaths: [],
      dailyChallenges: [],
    };
  }

  // Sort traits by score
  const sortedTraits: TraitScore[] = TRAITS.map(trait => ({
    name: trait,
    score: scores[trait] || 0,
  })).filter(t => t && t.name).sort((a, b) => b.score - a.score);

  // Get dominant traits (top 2)
  const dominantTraits = sortedTraits.slice(0, 2).filter(t => t && t.name).map(t => t.name);

  // Build top strengths (from top 3 traits)
  const topStrengths: string[] = [];
  sortedTraits.slice(0, 3).forEach(trait => {
    if (trait && trait.name) {
      const strengths = getTraitStrengths(trait.name, trait.score);
      topStrengths.push(...strengths.slice(0, 2));
    }
  });
  // Ensure we have at least 6 strengths
  let strengthAttempts = 0;
  while (topStrengths.length < 6 && sortedTraits.length > 0 && strengthAttempts < 20) {
    const index = Math.min(sortedTraits.length - 1, Math.floor(topStrengths.length / 2));
    const trait = sortedTraits[index];
    if (trait && trait.name) {
      const strengths = getTraitStrengths(trait.name, trait.score);
      if (strengths.length > 0) {
        topStrengths.push(strengths[0]);
      }
    }
    strengthAttempts++;
  }

  // Build areas for growth (from bottom 3 traits)
  const areasForGrowth: string[] = [];
  sortedTraits.slice(-3).reverse().forEach(trait => {
    if (trait && trait.name) {
      const areas = getTraitGrowthAreas(trait.name, trait.score);
      areasForGrowth.push(...areas.slice(0, 2));
    }
  });
  // Ensure we have at least 6 areas
  let attempts = 0;
  while (areasForGrowth.length < 6 && sortedTraits.length > 0 && attempts < 20) {
    const index = Math.max(0, Math.min(sortedTraits.length - 1, sortedTraits.length - Math.ceil(areasForGrowth.length / 2)));
    const trait = sortedTraits[index];
    if (trait && trait.name) {
      const areas = getTraitGrowthAreas(trait.name, trait.score);
      if (areas.length > 0) {
        areasForGrowth.push(areas[0]);
      }
    }
    attempts++;
  }

  // Build recommended paths based on dominant traits
  const recommendedPaths = buildRecommendedPaths(dominantTraits, scores);

  // Build daily challenges based on lowest traits
  const lowestTraits = sortedTraits.slice(-2).filter(t => t && t.name).map(t => t.name);
  const dailyChallenges = buildDailyChallenges(lowestTraits, scores);

  return {
    scores,
    dominantTraits,
    topStrengths: topStrengths.slice(0, 6),
    areasForGrowth: areasForGrowth.slice(0, 6),
    recommendedPaths,
    dailyChallenges,
  };
}

function buildRecommendedPaths(dominantTraits: string[], scores: Record<string, number>): Array<{ title: string; reason: string }> {
  const paths: Array<{ title: string; reason: string }> = [];

  // Career paths based on dominant traits
  if (dominantTraits.includes("Precision & Organization")) {
    paths.push({
      title: "Quality Assurance & Process Management",
      reason: "Your attention to detail and systematic approach make you ideal for roles ensuring quality and efficiency.",
    });
  }
  if (dominantTraits.includes("Empathy & Altruism")) {
    paths.push({
      title: "Human Services & Counseling",
      reason: "Your strong empathy and care for others make you excellent at supporting and helping people.",
    });
  }
  if (dominantTraits.includes("Creativity & Expression")) {
    paths.push({
      title: "Design & Creative Industries",
      reason: "Your creative vision and innovative thinking are perfect for roles that require originality and aesthetics.",
    });
  }
  if (dominantTraits.includes("Logic & Reflection")) {
    paths.push({
      title: "Research & Analysis",
      reason: "Your analytical skills and deep thinking make you well-suited for research and data-driven roles.",
    });
  }
  if (dominantTraits.includes("Leadership & Confidence")) {
    paths.push({
      title: "Management & Entrepreneurship",
      reason: "Your natural leadership and confidence make you ideal for leading teams and driving initiatives.",
    });
  }
  if (dominantTraits.includes("Harmony & Cooperation")) {
    paths.push({
      title: "Mediation & Team Coordination",
      reason: "Your diplomatic skills and ability to maintain harmony are perfect for roles requiring collaboration.",
    });
  }

  // Study/skill areas
  if (scores["Logic & Reflection"] >= 70) {
    paths.push({
      title: "Data Science & Analytics",
      reason: "Develop your analytical capabilities through courses in statistics, programming, and data analysis.",
    });
  }
  if (scores["Creativity & Expression"] >= 70) {
    paths.push({
      title: "Creative Writing & Visual Arts",
      reason: "Enhance your creative expression through courses in writing, design, or visual arts.",
    });
  }
  if (scores["Leadership & Confidence"] >= 70) {
    paths.push({
      title: "Business Strategy & Leadership",
      reason: "Strengthen your leadership skills through courses in management, strategy, and organizational behavior.",
    });
  }

  // Ensure we have at least 4 paths
  while (paths.length < 4) {
    paths.push({
      title: "Personal Development & Skill Building",
      reason: "Continue developing your strengths through targeted learning and practice.",
    });
  }

  return paths.slice(0, 4);
}

function buildDailyChallenges(lowestTraits: string[], scores: Record<string, number>): Array<{ week: number; task: string; explanation: string; outcome: string }> {
  const challenges: Array<{ week: number; task: string; explanation: string; outcome: string }> = [];

  const challengeTemplates: Record<string, Array<{ task: string; explanation: string; outcome: string }>> = {
    "Precision & Organization": [
      {
        task: "Create a daily checklist for your top 3 priorities",
        explanation: "Building organizational habits starts with small, consistent actions. A daily checklist helps you track important tasks and maintain focus.",
        outcome: "You'll develop a systematic approach to managing tasks and improve your attention to detail.",
      },
      {
        task: "Review and organize one area of your workspace",
        explanation: "Physical organization supports mental clarity. Regularly organizing your space reinforces systematic thinking.",
        outcome: "You'll create a more efficient work environment and develop organizational habits.",
      },
      {
        task: "Double-check one important document or project",
        explanation: "Practice attention to detail by carefully reviewing your work before considering it complete.",
        outcome: "You'll catch errors early and develop a quality-focused mindset.",
      },
    ],
    "Empathy & Altruism": [
      {
        task: "Ask one person how they're feeling and listen actively",
        explanation: "Developing empathy requires practice in understanding others' emotions. Active listening helps you connect more deeply.",
        outcome: "You'll build stronger relationships and improve your emotional intelligence.",
      },
      {
        task: "Offer help to someone without being asked",
        explanation: "Practicing altruism helps you become more aware of others' needs and build supportive relationships.",
        outcome: "You'll develop a habit of caring for others and create positive connections.",
      },
      {
        task: "Reflect on someone else's perspective in a recent situation",
        explanation: "Understanding different viewpoints helps you develop empathy and improve your relationships.",
        outcome: "You'll become more emotionally aware and better at resolving conflicts.",
      },
    ],
    "Creativity & Expression": [
      {
        task: "Brainstorm 10 creative solutions to a everyday problem",
        explanation: "Creative thinking is a skill that improves with practice. Regular brainstorming exercises your imagination.",
        outcome: "You'll develop more innovative thinking and find creative approaches to challenges.",
      },
      {
        task: "Engage in a creative activity for 30 minutes",
        explanation: "Whether it's drawing, writing, or crafting, creative activities help you express yourself and think differently.",
        outcome: "You'll develop your creative skills and find new ways to express your ideas.",
      },
      {
        task: "Try a new approach to a routine task",
        explanation: "Breaking out of routines encourages creative thinking and helps you see new possibilities.",
        outcome: "You'll develop flexibility and creative problem-solving skills.",
      },
    ],
    "Logic & Reflection": [
      {
        task: "Research a topic you're curious about for 20 minutes",
        explanation: "Deep thinking requires information. Regular research helps you develop analytical skills and understanding.",
        outcome: "You'll improve your knowledge base and develop better analytical thinking.",
      },
      {
        task: "Break down a complex problem into smaller parts",
        explanation: "Systematic problem-solving starts with understanding the components of a challenge.",
        outcome: "You'll develop better analytical skills and improve your problem-solving approach.",
      },
      {
        task: "Reflect on a decision you made and its outcomes",
        explanation: "Reflection helps you learn from experience and improve your decision-making process.",
        outcome: "You'll develop better judgment and learn from your experiences.",
      },
    ],
    "Leadership & Confidence": [
      {
        task: "Express your opinion in a group setting",
        explanation: "Building confidence starts with small steps. Speaking up in groups helps you practice leadership.",
        outcome: "You'll develop confidence in expressing your ideas and become more comfortable leading.",
      },
      {
        task: "Take initiative on a small project or task",
        explanation: "Leadership involves taking action. Starting with small initiatives helps you build leadership skills.",
        outcome: "You'll develop initiative and become more comfortable taking charge.",
      },
      {
        task: "Provide constructive feedback to someone",
        explanation: "Leadership involves guiding others. Practicing giving feedback helps you develop leadership communication.",
        outcome: "You'll improve your ability to influence and guide others positively.",
      },
    ],
    "Harmony & Cooperation": [
      {
        task: "Practice active listening in a conversation",
        explanation: "Harmony requires understanding. Active listening helps you see different perspectives and find common ground.",
        outcome: "You'll improve your relationships and become better at resolving conflicts.",
      },
      {
        task: "Mediate a small disagreement or find a compromise",
        explanation: "Conflict resolution is a skill that improves with practice. Finding compromises helps maintain harmony.",
        outcome: "You'll develop diplomatic skills and become better at creating collaborative environments.",
      },
      {
        task: "Seek to understand someone else's viewpoint",
        explanation: "Understanding different perspectives is key to maintaining harmony and resolving conflicts.",
        outcome: "You'll improve your relationships and become more effective at collaboration.",
      },
    ],
  };

  lowestTraits.forEach((trait, index) => {
    const templates = challengeTemplates[trait] || challengeTemplates["Precision & Organization"];
    const template = templates[index % templates.length];
    if (template) {
      challenges.push({
        week: index + 1,
        ...template,
      });
    }
  });

  // Ensure we have 3 challenges
  while (challenges.length < 3) {
    challenges.push({
      week: challenges.length + 1,
      task: "Practice self-reflection and identify one area for growth",
      explanation: "Regular self-reflection helps you understand yourself better and identify opportunities for development.",
      outcome: "You'll develop self-awareness and create a path for personal growth.",
    });
  }

  return challenges.slice(0, 3);
}

/**
 * Get trait description for PDF
 */
export function getTraitDescriptionForPDF(trait: string, score: number): {
  description: string;
  strengths: string[];
  caveats: string[];
  workExamples: { strengths: string[]; caveats: string[] };
} {
  return {
    description: getTraitDescription(trait, score),
    strengths: getTraitStrengths(trait, score),
    caveats: getTraitGrowthAreas(trait, score),
    workExamples: getTraitWorkExamples(trait, score),
  };
}

