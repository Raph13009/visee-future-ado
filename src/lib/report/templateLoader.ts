/**
 * Template Loader and Engine
 * 
 * This module loads content templates and replaces placeholders with actual data.
 * Templates can be in Markdown (.md) or JSON format.
 */

import traitDescriptions from './content-templates/trait_descriptions.json';
import traitStrengths from './content-templates/trait_strengths.json';
import traitGrowthAreas from './content-templates/trait_growth_areas.json';
import traitWorkExamples from './content-templates/trait_work_examples.json';
import traitQuotes from './content-templates/trait_quotes.json';
import traitCareers from './content-templates/trait_careers.json';
import traitActions from './content-templates/trait_actions.json';
import type { ReportModel } from './templates';

// Template data types
interface TraitDescriptions {
  [trait: string]: {
    very_high: string;
    high: string;
    moderate: string;
    low: string;
    very_low: string;
  };
}

interface TraitStrengthsData {
  [trait: string]: {
    high?: string[];
    moderate?: string[];
  };
}

interface TraitGrowthAreasData {
  [trait: string]: string[];
}

interface TraitWorkExamplesData {
  [trait: string]: {
    high_strengths?: string[];
    high_caveats?: string[];
    moderate_strengths?: string[];
    low_caveats?: string[];
  };
}

interface TraitQuotesData {
  [trait: string]: {
    high?: string[];
    moderate?: string[];
    low?: string[];
  };
}

interface TraitCareersData {
  [trait: string]: {
    high?: string[];
    moderate?: string[];
    low?: string[];
  };
}

interface TraitActionsData {
  high: { title: string; actions: string[] };
  moderate: { title: string; actions: string[] };
  low: { title: string; actions: string[] };
}

/**
 * Replace placeholders in a template string with actual values
 */
function replacePlaceholders(template: string, data: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(placeholder, String(value));
  }
  return result;
}

/**
 * Get trait description based on score range
 */
export function getTraitDescription(trait: string, score: number): string {
  const descriptions = traitDescriptions as TraitDescriptions;
  const traitData = descriptions[trait];
  
  if (!traitData) {
    return `No description available for ${trait}.`;
  }

  if (score >= 90) {
    return traitData.very_high;
  } else if (score >= 70) {
    return traitData.high;
  } else if (score >= 50) {
    return traitData.moderate;
  } else if (score >= 30) {
    return traitData.low;
  } else {
    return traitData.very_low;
  }
}

/**
 * Get trait strengths based on score
 */
export function getTraitStrengths(trait: string, score: number): string[] {
  const strengthsData = traitStrengths as TraitStrengthsData;
  const traitData = strengthsData[trait];
  
  if (!traitData) {
    return [];
  }

  if (score >= 70 && traitData.high) {
    return traitData.high;
  } else if (score >= 50 && traitData.moderate) {
    return traitData.moderate;
  }
  
  return [];
}

/**
 * Get growth areas for a trait
 */
export function getTraitGrowthAreas(trait: string, score: number): string[] {
  const growthData = traitGrowthAreas as TraitGrowthAreasData;
  const traitData = growthData[trait];
  
  if (!traitData) {
    return [];
  }

  // Return growth areas if score is below 50
  if (score < 50) {
    return traitData;
  }
  
  return [];
}

/**
 * Get work examples for a trait
 */
export function getTraitWorkExamples(trait: string, score: number): {
  strengths: string[];
  caveats: string[];
} {
  const workExamplesData = traitWorkExamples as TraitWorkExamplesData;
  const traitData = workExamplesData[trait];
  
  if (!traitData) {
    return { strengths: [], caveats: [] };
  }

  if (score >= 70) {
    return {
      strengths: traitData.high_strengths || [],
      caveats: traitData.high_caveats || [],
    };
  } else if (score >= 50) {
    return {
      strengths: traitData.moderate_strengths || [],
      caveats: [],
    };
  } else {
    return {
      strengths: [],
      caveats: traitData.low_caveats || [],
    };
  }
}

/**
 * Generate executive summary text
 */
export function generateExecutiveSummary(reportModel: ReportModel): string {
  const [trait1, trait2] = reportModel.dominantTraits;
  return replacePlaceholders(
    "This report reveals a personality profile characterized by strong {{trait1}} and {{trait2}} traits. The respondent demonstrates a unique combination of these qualities, which shapes their approach to work, relationships, and personal growth. This assessment provides insights into how these traits manifest in daily life and offers actionable recommendations for leveraging strengths and addressing areas for development.",
    { trait1, trait2 }
  );
}

/**
 * Format a list of items as bullet points (Markdown format)
 */
export function formatBulletList(items: string[]): string {
  return items.map(item => `- ${item}`).join('\n');
}

/**
 * Generate strengths and growth areas text
 */
export function generateStrengthsAndGrowthText(
  strengths: string[],
  growthAreas: string[]
): { strengthsText: string; growthText: string } {
  return {
    strengthsText: formatBulletList(strengths),
    growthText: formatBulletList(growthAreas),
  };
}

/**
 * Generate recommended paths text
 */
export function generateRecommendedPathsText(
  paths: Array<{ title: string; reason: string }>
): string {
  return paths
    .map(path => `**${path.title}**\n${path.reason}`)
    .join('\n\n');
}

/**
 * Generate relationship description based on scores
 */
export function generateRelationshipDescription(
  empathyScore: number,
  harmonyScore: number,
  leadershipScore: number
): string {
  if (empathyScore >= 70 && harmonyScore >= 70) {
    return "The respondent is highly attuned to others' emotions and works actively to maintain harmonious relationships. They are naturally supportive and prioritize the well-being of those around them, making them excellent partners, friends, and team members.";
  } else if (empathyScore >= 70) {
    return "The respondent has strong emotional intelligence and cares deeply about others. They are supportive and understanding, though they may benefit from developing conflict resolution skills to handle disagreements more effectively.";
  } else if (harmonyScore >= 70) {
    return "The respondent values peace and works to maintain harmonious relationships. They are skilled at mediation and collaboration, though they may benefit from developing deeper emotional connections with others.";
  } else if (leadershipScore >= 70) {
    return "The respondent is confident and assertive in relationships. They take initiative and express their opinions clearly, though they may benefit from developing active listening skills and emotional awareness.";
  } else {
    return "The respondent approaches relationships with a balanced perspective. They can be supportive when needed while also maintaining healthy boundaries. Developing emotional intelligence and communication skills can help strengthen their relationships.";
  }
}

/**
 * Generate communication tips
 */
export function generateCommunicationTips(): string[] {
  return [
    "Practice active listening by focusing fully on the speaker and asking clarifying questions",
    "Express your needs and boundaries clearly while also being open to others' perspectives",
  ];
}

/**
 * Generate development plan text
 */
export function generateDevelopmentPlanText(
  challenges: Array<{ week: number; task: string; explanation: string; outcome: string }>
): string {
  return challenges
    .map(challenge => `**Week ${challenge.week}: ${challenge.task}**\nWhy: ${challenge.explanation}\nOutcome: ${challenge.outcome}`)
    .join('\n\n');
}

/**
 * Get cover page text
 */
export function getCoverPageText(date: string): {
  title: string;
  subtitle: string;
  respondent: string;
  description: string;
  reportDate: string;
} {
  return {
    title: "Avenirea",
    subtitle: "Personality Report",
    respondent: "(Anonymous Respondent)",
    description: "Generated from your answers to the Avenirea Assessment",
    reportDate: `Report snapshot: ${date}`,
  };
}

/**
 * Get inspirational quote for a trait based on score
 */
export function getTraitQuote(trait: string, score: number): string {
  const quotesData = traitQuotes as TraitQuotesData;
  const traitData = quotesData[trait];
  
  if (!traitData) {
    return "";
  }

  let quotes: string[] = [];
  if (score >= 70 && traitData.high) {
    quotes = traitData.high;
  } else if (score >= 40 && traitData.moderate) {
    quotes = traitData.moderate;
  } else if (traitData.low) {
    quotes = traitData.low;
  }

  if (quotes.length === 0) {
    return "";
  }

  // Return a random quote from the appropriate category
  return quotes[Math.floor(Math.random() * quotes.length)];
}

/**
 * Get career recommendations for a trait based on score
 */
export function getTraitCareers(trait: string, score: number): string[] {
  const careersData = traitCareers as TraitCareersData;
  const traitData = careersData[trait];
  
  if (!traitData) {
    return [];
  }

  if (score >= 70 && traitData.high) {
    return traitData.high.slice(0, 4); // Return top 4 careers
  } else if (score >= 40 && traitData.moderate) {
    return traitData.moderate.slice(0, 3); // Return top 3 careers
  } else if (traitData.low) {
    return traitData.low.slice(0, 2); // Return top 2 careers
  }

  return [];
}

/**
 * Get action recommendations for a trait based on score
 */
export function getTraitActions(score: number): { title: string; actions: string[] } {
  const actionsData = traitActions as TraitActionsData;

  if (score >= 80) {
    return actionsData.high;
  } else if (score >= 50) {
    return actionsData.moderate;
  } else {
    return actionsData.low;
  }
}

/**
 * Get score level category
 */
export function getScoreLevel(score: number): "high" | "moderate" | "low" {
  if (score >= 80) {
    return "high";
  } else if (score >= 50) {
    return "moderate";
  } else {
    return "low";
  }
}

/**
 * Calculate percentile for a score (simplified - would need actual data for real percentiles)
 */
export function calculatePercentile(score: number): number {
  // Simplified percentile calculation
  // In a real system, this would compare against a database of scores
  if (score >= 90) return 95;
  if (score >= 80) return 85;
  if (score >= 70) return 70;
  if (score >= 60) return 55;
  if (score >= 50) return 40;
  if (score >= 40) return 25;
  if (score >= 30) return 15;
  return 5;
}

/**
 * Get profile type from dominant traits
 */
export function getProfileType(dominantTraits: string[]): string {
  if (dominantTraits.length < 2) {
    return "Balanced Profile";
  }

  const trait1 = dominantTraits[0];
  const trait2 = dominantTraits[1];

  // Map trait combinations to profile types
  const profileMap: Record<string, string> = {
    "Precision & Organization + Logic & Reflection": "Analytical-Organized Profile",
    "Empathy & Altruism + Harmony & Cooperation": "Empathic-Collaborative Profile",
    "Creativity & Expression + Leadership & Confidence": "Creative-Leadership Profile",
    "Precision & Organization + Empathy & Altruism": "Organized-Empathic Profile",
    "Logic & Reflection + Leadership & Confidence": "Analytical-Leadership Profile",
    "Creativity & Expression + Harmony & Cooperation": "Creative-Collaborative Profile",
  };

  const key1 = `${trait1} + ${trait2}`;
  const key2 = `${trait2} + ${trait1}`;

  return profileMap[key1] || profileMap[key2] || `${trait1.split(" & ")[0]}-${trait2.split(" & ")[0]} Profile`;
}

/**
 * Generate comparison insight between two traits
 */
export function generateComparisonInsight(trait1: string, score1: number, trait2: string, score2: number): string {
  const diff = score1 - score2;
  const trait1Short = trait1.split(" & ")[0];
  const trait2Short = trait2.split(" & ")[0];

  if (Math.abs(diff) < 10) {
    return `Your ${trait1Short} and ${trait2Short} scores are balanced, indicating a well-rounded approach.`;
  } else if (diff > 20) {
    return `Compared to your ${trait2Short} score, your ${trait1Short} score is significantly higher, suggesting a more ${trait1Short.toLowerCase()}-oriented approach.`;
  } else if (diff < -20) {
    return `Compared to your ${trait1Short} score, your ${trait2Short} score is significantly higher, suggesting a more ${trait2Short.toLowerCase()}-oriented approach.`;
  } else if (diff > 0) {
    return `Your ${trait1Short} score is higher than your ${trait2Short} score, indicating a preference for ${trait1Short.toLowerCase()}-focused activities.`;
  } else {
    return `Your ${trait2Short} score is higher than your ${trait1Short} score, indicating a preference for ${trait2Short.toLowerCase()}-focused activities.`;
  }
}

/**
 * Calculate career match percentage based on trait scores
 */
export function calculateCareerMatch(
  careerTraits: Record<string, number>,
  userScores: Record<string, number>
): number {
  let totalMatch = 0;
  let totalWeight = 0;

  for (const [trait, weight] of Object.entries(careerTraits)) {
    const userScore = userScores[trait] || 0;
    const match = Math.min(100, userScore * (weight / 100));
    totalMatch += match;
    totalWeight += weight;
  }

  return totalWeight > 0 ? Math.round((totalMatch / totalWeight) * 100) : 0;
}

