import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { generateProfessionalPDF } from "@/lib/report/professionalPDF";

type Stage = "selection" | "loading" | "guidelines" | "questionnaire" | "complete" | "analyzing" | "results";

// GENDER_STORAGE_KEY removed - no localStorage/cookies for this page

const QUESTIONS_DATA = [
  {
    step: 1,
    questions: [
      "I strive for accuracy and precision in all my tasks.",
      "I notice even the smallest inconsistencies and errors in my work.",
      "I am able to maintain high standards even under tight deadlines.",
      "I frequently check my work to ensure it meets the required standards.",
      "Improving and refining systems or processes is a priority for me."
    ]
  },
  {
    step: 2,
    questions: [
      "I can become critical of myself or others when mistakes are made.",
      "Ensuring that every detail is correct before completing a task is important to me.",
      "I often find ways to improve methods that are already considered efficient.",
      "When given feedback, I focus on the details to understand how to improve.",
      "My work environment is organized, and everything has a specific place."
    ]
  },
  {
    step: 3,
    questions: [
      "I feel a strong sense of responsibility to correct inaccuracies for the benefit of others.",
      "I am often the person who others rely on to find and fix mistakes.",
      "I naturally sense when someone needs emotional support.",
      "I take active steps to help others without expecting anything in return.",
      "Making sure others feel cared for is a priority in my relationships."
    ]
  },
  {
    step: 4,
    questions: [
      "I find it easy to build and maintain close, personal relationships.",
      "I often put the needs of others before my own.",
      "I am comfortable expressing affection and care towards others.",
      "My happiness is closely linked to the well-being of the people I care about.",
      "I am often approached by people who seek comfort or advice."
    ]
  },
  {
    step: 5,
    questions: [
      "Helping others makes me feel valued and fulfilled.",
      "Being appreciated for my contributions is important to me.",
      "Setting and achieving goals is a fundamental part of how I define success.",
      "I am driven by my ambition and the desire to be successful.",
      "I enjoy being recognized for my accomplishments."
    ]
  },
  {
    step: 6,
    questions: [
      "I am adaptable and excel in a variety of tasks and roles.",
      "I constantly look for ways to improve my efficiency and productivity.",
      "Being seen as successful by my peers is an important motivator for me.",
      "I actively create and pursue new goals once current ones are achieved.",
      "I adapt my approach if it means accomplishing a goal more effectively."
    ]
  },
  {
    step: 7,
    questions: [
      "My creativity is often sparked by my emotional experiences.",
      "I need to express my individuality in my work or artistic endeavors.",
      "I am drawn to aesthetics and surround myself with beauty that inspires me.",
      "I feel most alive when I am creating something new and original.",
      "My personal style is a true reflection of my unique identity."
    ]
  },
  {
    step: 8,
    questions: [
      "I often find creative inspiration in places others might overlook.",
      "I am confident in my creative abilities and trust my unique vision.",
      "I actively seek feedback to refine and enhance my creative projects.",
      "I prefer to observe and analyze before getting involved in a situation.",
      "I collect and analyze data to make informed decisions."
    ]
  },
  {
    step: 9,
    questions: [
      "I enjoy solving complex problems with thorough analysis and research.",
      "I am cautious about sharing my insights until I have fully examined an issue.",
      "I value depth and complexity in my areas of interest or expertise.",
      "I can be detached when analyzing situations or problems.",
      "I often look for underlying principles or patterns to understand how things work."
    ]
  },
  {
    step: 10,
    questions: [
      "Privacy and time alone to think are essential to me.",
      "I am more interested in ideas and concepts than in social interaction.",
      "I am vigilant about potential risks and always plan for contingencies.",
      "I seek security and stability in my environment and relationships.",
      "I am loyal and committed, especially to those I trust."
    ]
  },
  {
    step: 11,
    questions: [
      "Before making decisions, I consider all the possible outcomes and risks.",
      "I prefer clear guidelines and expectations to feel secure in my role.",
      "I sometimes hesitate to take action due to fear of making the wrong choice.",
      "I value predictability and routine as they provide a sense of stability.",
      "I often seek advice or reassurance from others before proceeding."
    ]
  },
  {
    step: 12,
    questions: [
      "I embrace change and adapt easily to new situations.",
      "I often seek out new and exciting experiences to keep life interesting.",
      "Routine tasks are an opportunity for me to find creative ways to engage.",
      "I quickly become bored with the status quo and look for ways to innovate.",
      "Planning too far ahead feels restrictive to me; I prefer spontaneity."
    ]
  },
  {
    step: 13,
    questions: [
      "I am optimistic and can usually find the silver lining in difficult situations.",
      "I thrive in environments that allow me freedom and the ability to choose.",
      "I am skilled at thinking on my feet and making the best of unexpected changes.",
      "New ideas and projects excite me more than the implementation or follow-through.",
      "I prefer to keep my options open rather than commit to one course of action."
    ]
  },
  {
    step: 14,
    questions: [
      "Exploring and experiencing the world is a top priority for me.",
      "I take charge of situations and am confident in making decisions.",
      "I am assertive in expressing my opinions and taking a stand.",
      "Protecting those I care about is just as important as standing up for myself.",
      "I am not afraid of confrontation and will face conflicts head-on."
    ]
  },
  {
    step: 15,
    questions: [
      "I naturally take on leadership roles in group settings.",
      "Injustice or unfairness prompts me to action; I must speak up.",
      "I respect strength in others and am drawn to people who are also assertive.",
      "I am self-reliant and prefer to depend on my own abilities.",
      "I am comfortable with power and using it to effect change."
    ]
  },
  {
    step: 16,
    questions: [
      "I strive to maintain harmony in my relationships and environment.",
      "I often see multiple sides of an issue and try to mediate disagreements.",
      "Avoiding tension and conflict is often more comfortable for me than addressing problems.",
      "I work to ensure that everyone feels heard and included in discussions.",
      "I am good at helping others find common ground and compromise."
    ]
  },
  {
    step: 17,
    questions: [
      "Peaceful resolutions are more important to me than winning an argument.",
      "I am often the peacemaker in my group of friends or at work.",
      "I prefer to listen and understand all viewpoints before expressing my own.",
      "I find it challenging to make decisions when there is a potential for conflict.",
      "I often go with the flow to avoid rocking the boat."
    ]
  },
  {
    step: 18,
    questions: [
      "I value a calm and tranquil environment where conflicts are minimal.",
      "I am willing to compromise my own preferences for the sake of group harmony.",
      "It's important for me that conflicts are resolved amicably and without resentment.",
      "I sometimes downplay my own needs to keep peace in my relationships.",
      "I approach disagreements with the goal of finding a solution that satisfies everyone."
    ]
  },
  {
    step: 19,
    questions: [
      "I believe maintaining a relationship is more important than winning an argument.",
      "I actively look for ways to support and encourage others.",
      "It's important to me that others see me as helpful and kind.",
      "I often offer help before being asked.",
      "My own mood is affected by the emotional states of those around me."
    ]
  },
  {
    step: 20,
    questions: [
      "I feel a strong sense of satisfaction when I can make someone's life easier.",
      "Being needed by others gives me a sense of purpose.",
      "I prioritize relationships where I can be of service and make a difference.",
      "I am quick to respond to the needs of my friends and family.",
      "I often put others' well-being ahead of my own."
    ]
  }
] as const;

const TOTAL_STEPS = QUESTIONS_DATA.length;

// Personality traits
// Import TRAITS from templates to avoid duplication
import { TRAITS } from "@/lib/report/templates";
// Re-export for backward compatibility
export { TRAITS };

// Mapping of each question (1-100) to personality traits
export const questionTraitMap: Record<number, string> = {
  // Step 1 (Q1-Q5): Precision & Organization
  1: "Precision & Organization",
  2: "Precision & Organization",
  3: "Precision & Organization",
  4: "Precision & Organization",
  5: "Precision & Organization",
  
  // Step 2 (Q6-Q10): Precision & Organization
  6: "Precision & Organization",
  7: "Precision & Organization",
  8: "Precision & Organization",
  9: "Precision & Organization",
  10: "Precision & Organization",
  
  // Step 3 (Q11-Q15): Mix
  11: "Precision & Organization", // correct inaccuracies for others
  12: "Precision & Organization", // rely on to find mistakes
  13: "Empathy & Altruism", // sense emotional support
  14: "Empathy & Altruism", // help others
  15: "Empathy & Altruism", // making sure others feel cared for
  
  // Step 4 (Q16-Q20): Empathy & Altruism
  16: "Empathy & Altruism",
  17: "Empathy & Altruism",
  18: "Empathy & Altruism",
  19: "Empathy & Altruism",
  20: "Empathy & Altruism",
  
  // Step 5 (Q21-Q25): Mix
  21: "Empathy & Altruism", // helping others
  22: "Leadership & Confidence", // being appreciated
  23: "Leadership & Confidence", // setting goals
  24: "Leadership & Confidence", // ambition
  25: "Leadership & Confidence", // recognized for accomplishments
  
  // Step 6 (Q26-Q30): Leadership & Confidence
  26: "Leadership & Confidence",
  27: "Leadership & Confidence",
  28: "Leadership & Confidence",
  29: "Leadership & Confidence",
  30: "Leadership & Confidence",
  
  // Step 7 (Q31-Q35): Creativity & Expression
  31: "Creativity & Expression",
  32: "Creativity & Expression",
  33: "Creativity & Expression",
  34: "Creativity & Expression",
  35: "Creativity & Expression",
  
  // Step 8 (Q36-Q40): Mix
  36: "Creativity & Expression", // creative inspiration
  37: "Creativity & Expression", // confident in creative abilities
  38: "Creativity & Expression", // seek feedback on creative projects
  39: "Logic & Reflection", // observe and analyze
  40: "Logic & Reflection", // collect and analyze data
  
  // Step 9 (Q41-Q45): Logic & Reflection
  41: "Logic & Reflection",
  42: "Logic & Reflection",
  43: "Logic & Reflection",
  44: "Logic & Reflection",
  45: "Logic & Reflection",
  
  // Step 10 (Q46-Q50): Mix
  46: "Logic & Reflection", // privacy, alone to think
  47: "Logic & Reflection", // ideas over social interaction
  48: "Harmony & Cooperation", // vigilant about risks (security)
  49: "Harmony & Cooperation", // seek security and stability
  50: "Harmony & Cooperation", // loyal and committed
  
  // Step 11 (Q51-Q55): Mix
  51: "Harmony & Cooperation", // consider outcomes and risks
  52: "Harmony & Cooperation", // clear guidelines (security)
  53: "Harmony & Cooperation", // hesitate due to fear (security)
  54: "Harmony & Cooperation", // predictability and routine
  55: "Harmony & Cooperation", // seek advice (security)
  
  // Step 12 (Q56-Q60): Mix
  56: "Creativity & Expression", // embrace change (flexibility/creativity)
  57: "Creativity & Expression", // new experiences (creativity)
  58: "Creativity & Expression", // creative ways to engage
  59: "Creativity & Expression", // innovate
  60: "Creativity & Expression", // spontaneity (creativity)
  
  // Step 13 (Q61-Q65): Mix
  61: "Harmony & Cooperation", // optimistic (harmony)
  62: "Creativity & Expression", // freedom (creativity)
  63: "Creativity & Expression", // thinking on feet (creativity)
  64: "Creativity & Expression", // new ideas excite (creativity)
  65: "Creativity & Expression", // keep options open (creativity)
  
  // Step 14 (Q66-Q70): Leadership & Confidence
  66: "Leadership & Confidence",
  67: "Leadership & Confidence",
  68: "Leadership & Confidence",
  69: "Leadership & Confidence",
  70: "Leadership & Confidence",
  
  // Step 15 (Q71-Q75): Leadership & Confidence
  71: "Leadership & Confidence",
  72: "Leadership & Confidence",
  73: "Leadership & Confidence",
  74: "Leadership & Confidence",
  75: "Leadership & Confidence",
  
  // Step 16 (Q76-Q80): Harmony & Cooperation
  76: "Harmony & Cooperation",
  77: "Harmony & Cooperation",
  78: "Harmony & Cooperation",
  79: "Harmony & Cooperation",
  80: "Harmony & Cooperation",
  
  // Step 17 (Q81-Q85): Harmony & Cooperation
  81: "Harmony & Cooperation",
  82: "Harmony & Cooperation",
  83: "Harmony & Cooperation",
  84: "Harmony & Cooperation",
  85: "Harmony & Cooperation",
  
  // Step 18 (Q86-Q90): Harmony & Cooperation
  86: "Harmony & Cooperation",
  87: "Harmony & Cooperation",
  88: "Harmony & Cooperation",
  89: "Harmony & Cooperation",
  90: "Harmony & Cooperation",
  
  // Step 19 (Q91-Q95): Empathy & Altruism
  91: "Empathy & Altruism", // maintaining relationship
  92: "Empathy & Altruism", // support and encourage
  93: "Empathy & Altruism", // helpful and kind
  94: "Empathy & Altruism", // offer help
  95: "Empathy & Altruism", // mood affected by others
  
  // Step 20 (Q96-Q100): Empathy & Altruism
  96: "Empathy & Altruism",
  97: "Empathy & Altruism",
  98: "Empathy & Altruism",
  99: "Empathy & Altruism",
  100: "Empathy & Altruism"
};

/**
 * Converts answers from step-based structure to flat question-based structure
 * @param answers - Answers in format { step1: { Q1: 4, Q2: 5, ... }, step2: { Q6: 3, ... } }
 * @returns Flat object { 1: 4, 2: 5, 3: 3, ... } where keys are question numbers (1-100)
 */
function flattenAnswers(answers: AnswersState): Record<number, number> {
  const flattened: Record<number, number> = {};
  
  for (const stepKey in answers) {
    const stepAnswers = answers[stepKey];
    for (const questionId in stepAnswers) {
      // Extract question number from "Q1", "Q2", etc.
      const questionNum = parseInt(questionId.replace("Q", ""), 10);
      if (!isNaN(questionNum) && questionNum >= 1 && questionNum <= 100) {
        flattened[questionNum] = stepAnswers[questionId];
      }
    }
  }
  
  return flattened;
}

/**
 * Normalizes a Likert scale answer (1-5) to a 0-100 scale
 * 1 → 0, 2 → 25, 3 → 50, 4 → 75, 5 → 100
 * @param value - Likert scale value (1-5)
 * @returns Normalized value (0-100)
 */
function normalizeScore(value: number): number {
  return (value - 1) * 25;
}

/**
 * Calculates personality trait scores from user answers
 * @param answers - Answers in format { step1: { Q1: 4, Q2: 5, ... }, step2: { Q6: 3, ... } }
 * @returns Object with trait names as keys and average scores (0-100) as values
 */
export function calculateTraitScores(answers: AnswersState): Record<string, number> {
  const flattened = flattenAnswers(answers);
  const traitScores: Record<string, number[]> = {};
  
  // Initialize trait arrays
  TRAITS.forEach(trait => {
    traitScores[trait] = [];
  });
  
  // Group answers by trait
  for (const questionNum in flattened) {
    const questionNumber = parseInt(questionNum, 10);
    const answer = flattened[questionNumber];
    const trait = questionTraitMap[questionNumber];
    
    if (trait && answer >= 1 && answer <= 5) {
      const normalizedScore = normalizeScore(answer);
      traitScores[trait].push(normalizedScore);
    }
  }
  
  // Calculate average for each trait
  const result: Record<string, number> = {};
  TRAITS.forEach(trait => {
    const scores = traitScores[trait];
    if (scores.length > 0) {
      const sum = scores.reduce((acc, score) => acc + score, 0);
      result[trait] = Math.round(sum / scores.length);
    } else {
      result[trait] = 0;
    }
  });
  
  return result;
}

const likertScale = [
  {
    value: 1,
    label: "Strongly Disagree",
    baseBg: "#FADBD8",
    baseBorder: "#F5B7B1",
    accentBg: "#E74C3C",
    accentBorder: "#CB4335",
    textColor: "#C0392B"
  },
  {
    value: 2,
    label: "Disagree",
    baseBg: "#FAE5D3",
    baseBorder: "#F5CBA7",
    accentBg: "#EB984E",
    accentBorder: "#D35400",
    textColor: "#CD5C00"
  },
  {
    value: 3,
    label: "Neutral",
    baseBg: "#E5E8E8",
    baseBorder: "#CCD1D1",
    accentBg: "#AAB7B8",
    accentBorder: "#95A5A6",
    textColor: "#7F8C8D"
  },
  {
    value: 4,
    label: "Agree",
    baseBg: "#D5F5E3",
    baseBorder: "#ABEBC6",
    accentBg: "#27AE60",
    accentBorder: "#1E8449",
    textColor: "#1E8449"
  },
  {
    value: 5,
    label: "Strongly Agree",
    baseBg: "#ABEBC6",
    baseBorder: "#82E0AA",
    accentBg: "#1ABC9C",
    accentBorder: "#148F77",
    textColor: "#148F77"
  }
] as const;

const getStepKey = (index: number) => `step${index + 1}`;
const getQuestionId = (stepIndex: number, questionIndex: number) =>
  `Q${stepIndex * 5 + questionIndex + 1}`;

export type AnswersState = Record<string, Record<string, number>>;

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = 75;
    const duration = 2000;
    const stepTime = 40;
    const increment = (target / duration) * stepTime;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= target) {
          clearInterval(interval);
          onComplete();
          return target;
        }
        return next;
      });
    }, stepTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 text-center">
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white text-2xl shadow-lg">
            ☀️
          </div>
        </div>
        <div className="w-72 max-w-full">
          <div className="h-2 rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <p className="text-lg font-semibold text-slate-800">Your test is being prepared...</p>
      </div>
    </div>
  );
};

const GuidelinesScreen = ({ gender }: { gender: string | null }) => {
  return (
    <div className="mx-auto max-w-xl space-y-10 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl">
          📝
        </div>
        <h2 className="text-3xl font-semibold text-slate-900">Test guidelines</h2>
        <p className="text-base text-slate-600">
          Answer each statement based on your personal opinion. {gender ? `You selected "${gender}".` : ""}
        </p>
      </div>
      <div className="space-y-4 rounded-3xl bg-white/60 p-6 text-left shadow-md backdrop-blur">
        <div className="flex items-start gap-3 text-slate-700">
          <span className="mt-1 text-base text-emerald-500">✓</span>
          <p className="text-base leading-relaxed">
            Answer each statement based on your personal opinion
          </p>
        </div>
        <div className="flex items-start gap-3 text-slate-700">
          <span className="mt-1 text-base text-emerald-500">✓</span>
          <p className="text-base leading-relaxed">
            You cannot skip questions, but you can return to them later
          </p>
        </div>
      </div>
    </div>
  );
};

const AnalysisScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Transition to results after animation completes
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  // 9 nodes avec leurs positions et couleurs (angles ajustés pour une distribution équilibrée)
  const nodes = [
    { id: 1, color: "#FDD835", angle: 40 },   // Yellow - top right
    { id: 2, color: "#FF9800", angle: 80 },   // Orange - middle right
    { id: 3, color: "#F44336", angle: 120 },  // Red - bottom right
    { id: 4, color: "#E91E63", angle: 150 },  // Pink - bottom right center
    { id: 5, color: "#9C27B0", angle: 180 },  // Purple - bottom center
    { id: 6, color: "#3F51B5", angle: 220 },  // Dark Blue - bottom left
    { id: 7, color: "#2196F3", angle: 260 },  // Light Blue - middle left
    { id: 8, color: "#4CAF50", angle: 300 },  // Green - top left
    { id: 9, color: "#8BC34A", angle: 340 },  // Light Green - top center
  ];

  const radius = 140;
  const centerX = 180;
  const centerY = 180;

  const getNodePosition = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad),
    };
  };

  return (
    <div className="mx-auto flex min-h-screen w-full flex-col items-center justify-center space-y-10 px-4 py-12 text-center sm:px-6">
      <div className="relative flex h-[400px] w-full max-w-lg items-center justify-center">
        {/* SVG pour le diagramme circulaire */}
        <svg width="360" height="360" className="absolute inset-0 mx-auto">
          {/* Lignes de connexion */}
          {nodes.map((node) => {
            const pos = getNodePosition(node.angle);
            return (
              <line
                key={`line-${node.id}`}
                x1={centerX}
                y1={centerY}
                x2={pos.x}
                y2={pos.y}
                stroke="#E5E7EB"
                strokeWidth="1.5"
              />
            );
          })}
          
          {/* Nœuds */}
          {nodes.map((node) => {
            const pos = getNodePosition(node.angle);
            return (
              <g key={`node-${node.id}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="18"
                  fill={node.color}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-bold"
                  fill="#FFFFFF"
                  style={{ fontSize: "14px", fontWeight: "600" }}
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Carte centrale Motivators */}
        <div className="relative z-10 rounded-3xl bg-white p-7 shadow-xl" style={{ width: "220px" }}>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#4CAF50]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3 17L9 11L13 15L21 7"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Motivators</h3>
          </div>
          <div className="space-y-3">
            <div className="h-2.5 w-full rounded-full bg-slate-200"></div>
            <div className="h-2.5 w-3/4 rounded-full bg-slate-200"></div>
            <div className="h-2.5 w-5/6 rounded-full bg-slate-200"></div>
            <div className="h-2.5 w-2/3 rounded-full bg-slate-200"></div>
            <div className="h-2.5 w-4/5 rounded-full bg-slate-200"></div>
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="w-full max-w-md space-y-5">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-[#117B4D] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-lg font-medium text-slate-600">
          We are analysing your answers and preparing your personality type report...
        </p>
      </div>
    </div>
  );
};

// Couleurs pour les 6 traits de personnalité
const traitColors = [
  { name: "Precision & Organization", color: "#2196F3", lightColor: "#E3F2FD" }, // Blue
  { name: "Empathy & Altruism", color: "#4CAF50", lightColor: "#E8F5E9" }, // Green
  { name: "Creativity & Expression", color: "#E91E63", lightColor: "#FCE4EC" }, // Pink
  { name: "Logic & Reflection", color: "#9C27B0", lightColor: "#F3E5F5" }, // Purple
  { name: "Leadership & Confidence", color: "#FF9800", lightColor: "#FFF3E0" }, // Orange
  { name: "Harmony & Cooperation", color: "#00BCD4", lightColor: "#E0F7FA" }, // Cyan
];

const PaymentScreen = ({ 
  traitScores, 
  answers 
}: { 
  traitScores: Record<string, number> | null;
  answers: AnswersState;
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationMessage, setGenerationMessage] = useState("Preparing...");
  const [error, setError] = useState<string | null>(null);

  // Scroll to top when PaymentScreen mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  // Base count - repart à ce chiffre à minuit
  const BASE_COUNT = 103000;
  
  // Compteur qui augmente progressivement pendant la journée
  const [reportsCount, setReportsCount] = useState(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    // Calculer les secondes écoulées depuis minuit
    const secondsSinceMidnight = hours * 3600 + minutes * 60 + seconds;
    // Nombre de cycles de 3 secondes depuis minuit
    const cyclesSinceMidnight = Math.floor(secondsSinceMidnight / 3);
    // Moyenne d'incrément par cycle: avec 40% de 0, 30% de 1, 20% de 2, 10% de 3
    // Moyenne = 0*0.4 + 1*0.3 + 2*0.2 + 3*0.1 = 0.3 + 0.4 + 0.3 = 1.0
    // Estimation basée sur la moyenne
    const estimatedIncrement = cyclesSinceMidnight * 1.0;
    // Ajouter une petite variation aléatoire (-10 à +10) pour éviter d'être trop prévisible
    const randomVariation = Math.floor(Math.random() * 21) - 10;
    return BASE_COUNT + Math.floor(estimatedIncrement) + randomVariation;
  });

  // Latest results avec rotation
  const [latestResultsIndex, setLatestResultsIndex] = useState(0);
  
  const allLatestResults = [
    [
      { name: "Noah", country: "🇩🇪", type: "Individualist" },
      { name: "Ella", country: "🇦🇺", type: "Peacemaker" },
      { name: "Jacob", country: "🇨🇦", type: "Challenger" },
    ],
    [
      { name: "Emma", country: "🇬🇧", type: "Analyst" },
      { name: "Lucas", country: "🇫🇷", type: "Mediator" },
      { name: "Sophia", country: "🇺🇸", type: "Commander" },
    ],
    [
      { name: "Oliver", country: "🇪🇸", type: "Adventurer" },
      { name: "Isabella", country: "🇮🇹", type: "Advocate" },
      { name: "Mason", country: "🇳🇱", type: "Protagonist" },
    ],
    [
      { name: "Ava", country: "🇸🇪", type: "Campaigner" },
      { name: "William", country: "🇳🇴", type: "Logician" },
      { name: "Mia", country: "🇩🇰", type: "Consul" },
    ],
  ];

  const latestResults = allLatestResults[latestResultsIndex];

  // Logique pour augmenter le compteur progressivement toutes les 3 secondes
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let lastSecondsSinceMidnight = (() => {
      const now = new Date();
      return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    })();
    
    const getRandomIncrement = () => {
      // Probabilités: 40% de 0, 30% de 1, 20% de 2, 10% de 3
      const random = Math.random();
      if (random < 0.4) return 0;      // 40%
      if (random < 0.7) return 1;      // 30%
      if (random < 0.9) return 2;      // 20%
      return 3;                        // 10%
    };

    const updateCounter = () => {
      const now = new Date();
      const currentSecondsSinceMidnight = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      
      // Si on passe minuit (secondes depuis minuit < dernières secondes), réinitialiser
      if (currentSecondsSinceMidnight < lastSecondsSinceMidnight) {
        setReportsCount(BASE_COUNT);
        lastSecondsSinceMidnight = currentSecondsSinceMidnight;
        return;
      }
      
      lastSecondsSinceMidnight = currentSecondsSinceMidnight;
      
      setReportsCount((prevCount) => {
        const increment = getRandomIncrement();
        return prevCount + increment;
      });
    };

    // Mettre à jour toutes les 3 secondes
    intervalId = setInterval(updateCounter, 3000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Rotation des latest results toutes les 30-60 secondes
  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = [];
    
    const scheduleNextRotation = () => {
      // Délai aléatoire entre 30 et 60 secondes
      const delay = 30000 + Math.random() * 30000;
      const timeoutId = setTimeout(() => {
        setLatestResultsIndex((prev) => (prev + 1) % allLatestResults.length);
        // Retirer le timeout de la liste puisqu'il est terminé
        const index = timeoutIds.indexOf(timeoutId);
        if (index > -1) timeoutIds.splice(index, 1);
        scheduleNextRotation();
      }, delay);
      timeoutIds.push(timeoutId);
    };

    // Démarrer la première rotation après un délai aléatoire
    scheduleNextRotation();

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, []);

  // Handle PDF generation and download
  const handleDownloadPDF = async () => {
    try {
      console.log("[PaymentScreen] Starting PDF generation...");
      setIsGenerating(true);
      setGenerationProgress(0);
      setGenerationMessage("Initialisation...");
      setError(null);
      
      // Validate answers
      const answerCount = Object.values(answers).reduce((acc, step) => acc + Object.keys(step).length, 0);
      console.log(`[PaymentScreen] Answer count: ${answerCount}`);
      
      if (answerCount < 100) {
        throw new Error(`Réponses incomplètes: ${answerCount}/100 questions. Veuillez compléter le questionnaire.`);
      }
      
      // Generate PDF directly (client-side)
      const pdfBlob = await generateProfessionalPDF(answers, (progress, message) => {
        setGenerationProgress(progress);
        setGenerationMessage(message);
      });
      
      console.log(`[PaymentScreen] PDF generated successfully. Size: ${(pdfBlob.size / 1024).toFixed(2)} KB`);
      
      // Create download link
      setGenerationMessage("Téléchargement...");
      const fileName = `Avenirea_Report_${new Date().toISOString().split("T")[0]}.pdf`;
      const url = URL.createObjectURL(pdfBlob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setGenerationMessage("Téléchargement terminé!");
        setGenerationProgress(100);
        setTimeout(() => {
          setIsGenerating(false);
          setGenerationProgress(0);
          setGenerationMessage("Prêt...");
        }, 2000);
      }, 100);
      
    } catch (error) {
      console.error("[PaymentScreen] Error generating PDF:", error);
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la génération du PDF.";
      setError(errorMessage);
      setIsGenerating(false);
      setGenerationProgress(0);
      setGenerationMessage("Erreur");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        
        {/* Section du haut : Titre et Benefits */}
        <div className="mb-12 space-y-8">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            Your Personality type report is ready!
          </h1>

          {/* 3 Benefits */}
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Find Out Who You Really Are
                </h3>
                <p className="mt-1 text-sm text-slate-600 sm:text-base">
                  Dive deep into your core identity and uncover aspects of yourself you've never known.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Explore Your Strengths and Weaknesses
                </h3>
                <p className="mt-1 text-sm text-slate-600 sm:text-base">
                  Gain a clear understanding of what you excel at and where you can grow.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Improve Your Relationship with Others
                </h3>
                <p className="mt-1 text-sm text-slate-600 sm:text-base">
                  Learn how to connect more deeply and effectively with the people in your life.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Image du rapport */}
        <div className="mb-12 flex justify-center">
          <img 
            src="/yy.png" 
            alt="Personality Report" 
            className="w-full max-w-md md:max-w-xs lg:max-w-sm"
          />
        </div>

        {/* Encart sur les frais d'évaluation */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
              <svg className="h-3.5 w-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="font-bold text-slate-900 sm:text-lg">
                An assessment fee is required for our cutting-edge personality test.
              </h4>
              <p className="text-sm text-slate-600 sm:text-base">
                Finding out your exact type of personality and assessing your strengths & weaknesses requires additional processing which is supported by this assessment fee.
              </p>
            </div>
          </div>
        </div>

        {/* Titre principal et compteur */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            Uncover your Personality type!
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              {reportsCount.toString().split('').map((digit, idx) => (
                <div
                  key={idx}
                  className="flex h-8 w-6 items-center justify-center rounded border border-slate-200 bg-slate-100 text-sm font-bold text-slate-700 sm:h-10 sm:w-8 sm:text-base"
                >
                  {digit}
                </div>
              ))}
            </div>
            <span className="text-sm text-slate-600 sm:text-base">reports ordered!</span>
          </div>
        </div>

        {/* Carte principale - Download */}
        <div className="mb-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Your Personality Report is Ready
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Download your comprehensive 15-page personality report with detailed insights about your traits, strengths, and areas for growth.
            </p>
          </div>
          
          {/* Error message */}
          {error && !isGenerating && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Error generating report</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Progress indicator */}
          {isGenerating && (
            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{generationMessage}</span>
                <span className="text-slate-500">{generationProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[#117B4D] h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={async () => {
              try {
                // Validate answers before proceeding
                const answerCount = Object.values(answers).reduce((acc, step) => acc + Object.keys(step).length, 0);
                console.log('[PaymentScreen] Answer count:', answerCount);
                
                if (answerCount === 0) {
                  alert('No answers found. Please complete the test first.');
                  return;
                }
                
                // Save answers to localStorage (persists across tabs/windows) before redirecting to Stripe
                // This ensures we can retrieve them even if URL parameters are lost
                localStorage.setItem('personalityTestAnswers', JSON.stringify(answers));
                if (traitScores) {
                  localStorage.setItem('personalityTestScores', JSON.stringify(traitScores));
                }
                console.log('[PaymentScreen] Saved answers to localStorage:', Object.keys(answers).length, 'steps');
                
                // Also save to Supabase as backup
                try {
                  const scores = traitScores || calculateTraitScores(answers);
                  await saveTestResults(scores);
                  console.log('[PaymentScreen] Saved answers to Supabase as backup');
                } catch (e) {
                  console.error('[PaymentScreen] Error saving to Supabase (non-blocking):', e);
                }
                
                // Encode answers to pass them to payment success page (fallback)
                const encodedAnswers = btoa(JSON.stringify(answers));
                
                // Always redirect to quiz.avenirea.com (fixed domain for consistency)
                const successUrl = `https://quiz.avenirea.com/personality-payment-success?answers=${encodeURIComponent(encodedAnswers)}`;
                const stripeUrl = `https://buy.stripe.com/dRm28safGcX7fU00nY7IY02?success_url=${encodeURIComponent(successUrl)}`;
                console.log('[PaymentScreen] Redirecting to Stripe with success URL:', successUrl);
                window.location.href = stripeUrl;
              } catch (e) {
                console.error('[PaymentScreen] Error in payment flow:', e);
                alert('An error occurred. Please try again.');
              }
            }}
            className="w-full rounded-xl bg-[#117B4D] px-6 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-[#0d5f3a] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#117B4D] focus:ring-offset-2"
          >
            Get My Report - $1.99 USD
          </button>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 mt-6">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>30-day satisfaction guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>100% Secure</span>
            </div>
          </div>
        </div>

        {/* Section "Here's what you'll get:" */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">
            Here's what you'll get:
          </h2>
          <div className="space-y-4">
            {/* Benefit 1 */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#117B4D]">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-slate-900 sm:text-lg">
                  15-page comprehensive personality report
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#117B4D]">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-slate-900 sm:text-lg">
                  Access to 20+ diverse personality tests
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#117B4D]">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-slate-900 sm:text-lg">
                  20+ essential skills courses with professional certifications
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#117B4D]">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-slate-900 sm:text-lg">
                  Daily personalized development challenges
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section "As seen on" */}
        <div className="mb-12">
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-slate-500">As seen on</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-slate-900">FOX</div>
            <div className="flex items-center gap-1 text-lg font-semibold text-slate-900">
              <span className="text-xs">USA</span>
              <span className="text-base">TODAY</span>
            </div>
            <div className="text-xl font-serif text-slate-900">Forbes</div>
            <div className="text-2xl font-bold text-slate-900">CNN</div>
          </div>
        </div>

        {/* Section Ratings & Testimonials */}
        <div className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 sm:text-3xl">
            Rated 4.8/5 by our customers
          </h2>
          <div className="mb-4 flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          
          {/* Testimonial Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-base italic text-slate-700 sm:text-lg">
              "The test nailed my personality! It's like having a guide to understanding myself better."
            </p>
          </div>
        </div>

        {/* Section "Trusted by over 100 thousand people worldwide" */}
        <div className="mb-8">
          <h2 className="mb-6 text-2xl font-bold text-slate-900 sm:text-3xl">
            Trusted by over 100 thousand people worldwide
          </h2>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Latest results</p>
          
          {/* Latest Results Cards */}
          <div className="space-y-3">
            {latestResults.map((result, idx) => (
              <div key={idx} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-opacity duration-500">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-lg">
                  {result.country}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">{result.name}</span> just ordered. Personality type: <span className="font-bold text-slate-900">{result.type}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Testimonials */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-3 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-base text-slate-700">
              "Skeptical at first, but the accuracy amazed me. It's helped me grow personally and professionally."
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-3 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-base text-slate-700">
              "The results have boosted my confidence and decision-making. A true asset in my development."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestPersonnalite = () => {
  const [stage, setStage] = useState<Stage>("selection");
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [traitScores, setTraitScores] = useState<Record<string, number> | null>(null);

  const handleGenderSelection = (gender: "male" | "female") => {
    setSelectedGender(gender);
    // localStorage removed - no cookies/tracking for this page
    setStage("loading");
  };

  const currentStep = useMemo(() => QUESTIONS_DATA[currentStepIndex], [currentStepIndex]);
  const currentStepKey = getStepKey(currentStepIndex);

  const handleSelectAnswer = (questionIndex: number, value: number) => {
    const questionId = getQuestionId(currentStepIndex, questionIndex);
    setAnswers((prev) => {
      const stepAnswers = prev[currentStepKey] ?? {};
      return {
        ...prev,
        [currentStepKey]: {
          ...stepAnswers,
          [questionId]: value
        }
      };
    });
  };

  const currentStepAnswers = answers[currentStepKey] ?? {};

  const isStepComplete = currentStep.questions.every((_, idx) => {
    const questionId = getQuestionId(currentStepIndex, idx);
    return currentStepAnswers[questionId] !== undefined;
  });

  const saveTestResults = async (scores: Record<string, number>) => {
    try {
      // localStorage removed - no cookies/tracking for this page
      const userName = null;
      const userEmail = null;
      
      // Préparer les données pour l'insertion
      const resultData = {
        name: userName,
        email: userEmail,
        gender: selectedGender,
        precision_organization_score: scores["Precision & Organization"] || 0,
        empathy_altruism_score: scores["Empathy & Altruism"] || 0,
        creativity_expression_score: scores["Creativity & Expression"] || 0,
        logic_reflection_score: scores["Logic & Reflection"] || 0,
        leadership_confidence_score: scores["Leadership & Confidence"] || 0,
        harmony_cooperation_score: scores["Harmony & Cooperation"] || 0,
        detailed_answers: answers as any,
        payment: null,
        total_price: 0,
        test_type: 'personality',
        completed_at: new Date().toISOString()
      };

      console.log('[SUPABASE][PERSONALITY] Inserting result:', resultData);
      const { error, data } = await supabase
        .from('personality_test_results')
        .insert([resultData])
        .select('id')
        .single();

      if (error) {
        console.error('[SUPABASE][PERSONALITY] Insert error:', error);
        // Ne pas bloquer l'utilisateur si l'enregistrement échoue
      } else if (data) {
        console.log('[SUPABASE][PERSONALITY] Insert success:', data);
        // localStorage removed - no cookies/tracking for this page
        // ID is not stored locally
      }
    } catch (err) {
      console.error('[SUPABASE][PERSONALITY] General error:', err);
      // Ne pas bloquer l'utilisateur si l'enregistrement échoue
    }
  };

  const handleNext = async () => {
    if (!isStepComplete) return;
    if (currentStepIndex < TOTAL_STEPS - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Calculate trait scores when finishing the questionnaire
      const scores = calculateTraitScores(answers);
      setTraitScores(scores);
      
      // Log formatted results to console
      console.log("Collected answers:", answers);
      console.log("\n" + "=".repeat(50));
      console.log("Your personality profile:");
      console.log("=".repeat(50));
      TRAITS.forEach(trait => {
        const score = scores[trait] || 0;
        console.log(`- ${trait}: ${score}%`);
      });
      console.log("=".repeat(50) + "\n");
      
      // Save results to Supabase
      await saveTestResults(scores);
      
      setStage("complete");
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleExpressTest = () => {
    // Générer des réponses aléatoires (1-5) pour toutes les questions
    const randomAnswers: AnswersState = {};
    
    QUESTIONS_DATA.forEach((step, stepIndex) => {
      const stepKey = getStepKey(stepIndex);
      const stepAnswers: Record<string, number> = {};
      
      step.questions.forEach((_, questionIndex) => {
        const questionId = getQuestionId(stepIndex, questionIndex);
        // Générer une réponse aléatoire entre 1 et 5
        const randomAnswer = Math.floor(Math.random() * 5) + 1;
        stepAnswers[questionId] = randomAnswer;
      });
      
      randomAnswers[stepKey] = stepAnswers;
    });
    
    // Remplir l'état avec les réponses aléatoires
    setAnswers(randomAnswers);
    
    // Aller directement à la dernière étape
    setCurrentStepIndex(TOTAL_STEPS - 1);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  useEffect(() => {
    if (stage === "questionnaire" || stage === "complete" || stage === "analyzing" || stage === "results") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [stage, currentStepIndex]);

  const progressPercentage = ((currentStepIndex + 1) / TOTAL_STEPS) * 100;

  return (
    <>
      <Helmet>
        <title>Personality Test | Avenirea - Discover Your True Self</title>
        <meta name="description" content="Take the Avenirea personality test and discover your personality type. Get a comprehensive 14-page personalized report with insights about your strengths, career paths, and development plan." />
        <link rel="canonical" href="https://www.avenirea.com/quiz" />
        <meta property="og:title" content="Personality Test | Avenirea" />
        <meta property="og:description" content="Take the Avenirea personality test and discover your personality type. Get a comprehensive 14-page personalized report." />
        <meta property="og:url" content="https://www.avenirea.com/quiz" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.avenirea.com/lovable-uploads/d90e4f60-4ab5-48a0-9e2f-ba4658dc9b54.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Personality Test | Avenirea" />
        <meta name="twitter:description" content="Take the Avenirea personality test and discover your personality type." />
        <meta name="twitter:image" content="https://www.avenirea.com/lovable-uploads/d90e4f60-4ab5-48a0-9e2f-ba4658dc9b54.png" />
      </Helmet>
      <div className={`min-h-screen text-slate-900 ${stage === "analyzing" ? "bg-white" : stage === "results" ? "" : "bg-[#f7f4ef]"}`}>
        {stage === "analyzing" ? (
        <AnalysisScreen onComplete={() => setStage("results")} />
      ) : stage === "results" ? (
        <PaymentScreen traitScores={traitScores} answers={answers} />
      ) : (
        <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {stage === "selection" && (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full bg-white/70 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-emerald-600 shadow-sm">
                avenirea.com
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                Discover <span className="text-emerald-600">who you truly are</span> with the Personality test
              </h1>
              <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
                With this test, you will find out your exact personality type. Answer a few simple questions and get tailored insights instantly.
              </p>
              <div className="space-y-5">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Start by selecting your gender
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => handleGenderSelection("male")}
                    className="w-full rounded-2xl border border-emerald-600 bg-emerald-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    ♂ Male
                  </button>
                  <button
                    onClick={() => handleGenderSelection("female")}
                    className="w-full rounded-2xl border border-rose-500 bg-rose-400 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-rose-400/25 transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                  >
                    ♀ Female
                  </button>
                </div>
              </div>
            </div>
            <div className="mx-auto w-full max-w-sm">
              <div className="relative">
                <div className="absolute inset-0 rounded-[2.75rem] bg-slate-900/5 blur-2xl" aria-hidden="true" />
                <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-600">
                        P
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-slate-900">avenirea.com</p>
                        <p className="text-xs text-slate-500">Created by experts</p>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-slate-400">Step 6 of 12</div>
                  </div>

                  <div className="space-y-6 px-6 py-5">
                    <div>
                      <div className="h-2 w-full rounded-full bg-slate-100">
                        <div className="h-full w-[48%] rounded-full bg-emerald-500" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm font-medium text-slate-800">
                        Choose how accurately each statement reflects you.
                      </p>
                      <div className="grid grid-cols-5 gap-3 text-center text-[11px] font-medium text-slate-400">
                        {["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"].map((label, index) => (
                          <div key={label} className="space-y-2">
                            <div
                              className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white"
                            />
                            <span>{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-800">
                          You have a strong moral compass.
                        </p>
                        <div className="flex justify-between gap-2">
                          {[0, 1, 2, 3, 4].map((index) => (
                            <button
                              key={index}
                              className={`h-8 w-8 rounded-full border border-slate-200 ${
                                index === 3 ? "bg-emerald-500 border-emerald-600" : "bg-white"
                              }`}
                              aria-label={`Response option ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 opacity-70">
                        <p className="text-sm font-medium text-slate-800">
                          You have trouble accepting your flaws and thus can be highly critical of yourself.
                        </p>
                        <div className="flex justify-between gap-2">
                          {[0, 1, 2, 3, 4].map((index) => (
                            <div
                              key={index}
                              className={`h-8 w-8 rounded-full border border-slate-200 ${
                                index === 0 ? "bg-emerald-500 border-emerald-600" : "bg-white"
                              }`}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-[#0A7C51]/10" aria-hidden="true" />
              </div>
            </div>
          </div>
        )}

        {stage === "loading" && (
          <LoadingScreen onComplete={() => setStage("guidelines")} />
        )}

        {stage === "guidelines" && (
          <div className="space-y-10">
            <GuidelinesScreen gender={selectedGender} />
            <div className="flex justify-center">
              <button
                className="w-full max-w-xs rounded-2xl border border-emerald-600 bg-emerald-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                onClick={() => {
                  setStage("questionnaire");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Start test
              </button>
            </div>
          </div>
        )}

        {stage === "questionnaire" && (
          <div className="space-y-8">
            <header className="space-y-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevious}
                  disabled={currentStepIndex === 0}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-slate-400 transition hover:text-slate-600 ${
                    currentStepIndex === 0 ? "opacity-30" : "hover:border-slate-300 hover:bg-white"
                  }`}
                  aria-label="Previous step"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    <span>Step {currentStepIndex + 1} of {TOTAL_STEPS}</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-300 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Bouton Test Express - visible uniquement sur la première page */}
              {currentStepIndex === 0 && (
                <div className="flex justify-end">
                  <button
                    onClick={handleExpressTest}
                    className="group flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50/50 px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition-all hover:border-emerald-400 hover:bg-emerald-100 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 active:translate-y-0"
                    title="Fill all answers automatically and go directly to the last page"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12"
                    >
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    <span>Test Express</span>
                  </button>
                </div>
              )}
              
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                  Choose how accurately each statement reflects you.
                </h2>
                <div className="flex w-full items-center justify-between gap-2 text-[11px] font-semibold text-slate-500 sm:gap-4 sm:text-sm">
                  {likertScale.map((option) => {
                    return (
                      <div
                        key={`legend-${option.value}`}
                        className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl bg-white/70 px-2 py-2 shadow-sm backdrop-blur"
                        style={{ color: option.textColor }}
                      >
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-full border-2 sm:h-10 sm:w-10"
                          style={{ backgroundColor: option.baseBg, borderColor: option.baseBorder }}
                        />
                        <span className="text-center leading-tight">{option.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </header>

            <div className="space-y-5 pb-32">
              {currentStep.questions.map((question, questionIndex) => {
                const questionId = getQuestionId(currentStepIndex, questionIndex);
                const selectedValue = currentStepAnswers[questionId];

                return (
                  <section
                    key={questionId}
                    className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-lg shadow-slate-900/3 backdrop-blur transition hover:shadow-xl"
                  >
                    <p className="mb-5 text-base font-semibold text-slate-800 sm:text-lg">
                      {question}
                    </p>
                    <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
                      {likertScale.map((option) => {
                        const isSelected = selectedValue === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSelectAnswer(questionIndex, option.value)}
                            className="group flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-1 transition-transform duration-200 focus:outline-none hover:-translate-y-0.5 active:scale-95"
                            style={{
                              color: option.textColor
                            }}
                          >
                            <span
                              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-transform duration-200 ease-out sm:h-11 sm:w-11 ${isSelected ? "scale-110 shadow-lg" : "group-hover:scale-105 group-active:scale-95"}`}
                              style={{
                                backgroundColor: isSelected ? option.accentBg : option.baseBg,
                                borderColor: isSelected ? option.accentBorder : option.baseBorder,
                                boxShadow: isSelected ? `0 6px 14px ${option.accentBg}44` : undefined,
                                color: isSelected ? "#FFFFFF" : option.textColor
                              }}
                            >
                              {isSelected ? "✓" : ""}
                            </span>
                            <span className="text-center text-[10px] font-semibold leading-tight sm:text-xs">
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>

            <div className="fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#f7f4ef] via-[#f7f4ef]/95 to-[#f7f4ef]/0 px-4 pb-5 pt-6 sm:relative sm:bg-transparent sm:px-0 sm:py-0">
              <div className="mx-auto flex max-w-5xl flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStepIndex === 0}
                  className={`rounded-2xl border px-6 py-3 text-base font-semibold transition ${
                    currentStepIndex === 0
                      ? "cursor-not-allowed border-slate-200 text-slate-300"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:-translate-y-0.5"
                  }`}
                >
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={!isStepComplete}
                  className={`rounded-2xl px-8 py-3 text-base font-semibold text-white transition ${
                    isStepComplete
                      ? "bg-emerald-500 shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5"
                      : "cursor-not-allowed bg-slate-300"
                  }`}
                >
                  {currentStepIndex === TOTAL_STEPS - 1 ? "Finish" : "Next"}
                </button>
              </div>
            </div>
          </div>
        )}

        {stage === "complete" && (
          <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-8 text-center">
            <div className="relative flex items-center justify-center">
              {/* Fond peach arrondi */}
              <div className="absolute -bottom-2 -right-2 h-32 w-32 rounded-full bg-[#FFEEDF] opacity-80 blur-xl"></div>
              {/* Document avec checkmark */}
              <div className="relative">
                <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Document */}
                  <rect x="15" y="10" width="50" height="70" rx="4" fill="white" stroke="#171F3F" strokeWidth="2.5"/>
                  {/* Lignes de texte */}
                  <line x1="25" y1="25" x2="55" y2="25" stroke="#171F3F" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="25" y1="35" x2="50" y2="35" stroke="#171F3F" strokeWidth="2" strokeLinecap="round"/>
                  {/* Cercle avec checkmark */}
                  <circle cx="40" cy="55" r="12" fill="#FF9800" stroke="#FF9800" strokeWidth="1"/>
                  <path d="M35 55L38 58L45 51" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-semibold text-[#171F3F]">Congratulations!</h2>
              <p className="text-lg text-[#4A4E69]">
                You&apos;ve completed the personality test.
              </p>
            </div>
            <button
              onClick={() => {
                console.log("Collected answers:", answers);
                setStage("analyzing");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-full max-w-sm rounded-xl bg-[#117B4D] px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#117B4D]"
            >
              Get My Results
            </button>
          </div>
        )}
        </div>
      )}
      </div>
    </>
  );
};

export default TestPersonnalite;

