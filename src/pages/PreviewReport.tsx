import { useMemo, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  getTraitDescription,
  getTraitStrengths,
  getTraitGrowthAreas,
  getTraitWorkExamples,
  generateRelationshipDescription,
  generateCommunicationTips,
  formatBulletList,
  generateStrengthsAndGrowthText,
  generateRecommendedPathsText,
  generateDevelopmentPlanText,
  getTraitQuote,
  getTraitCareers,
  getTraitActions,
  calculatePercentile,
  getProfileType,
  generateComparisonInsight,
} from "@/lib/report/templateLoader";
import { buildReportModel, TRAITS } from "@/lib/report/templates";
import {
  generateRadarChart,
  generateBarChart,
  generateGaugeChart,
  generateTraitComparisonChart,
  generateStrengthsGrowthChart,
  generateCommunicationStyleChart,
  generateCareerMatchChart,
} from "@/lib/report/charts";

// Import markdown templates as raw text using Vite's ?raw suffix
import coverTemplate from "@/lib/report/content-templates/cover.md?raw";
import executiveSummaryTemplate from "@/lib/report/content-templates/executive_summary.md?raw";
import strengthsAndGrowthTemplate from "@/lib/report/content-templates/strengths_and_growth.md?raw";
import pathsAndCareersTemplate from "@/lib/report/content-templates/paths_and_careers.md?raw";
import relationshipsTemplate from "@/lib/report/content-templates/relationships.md?raw";
import developmentPlanTemplate from "@/lib/report/content-templates/development_plan.md?raw";
import resourcesTemplate from "@/lib/report/content-templates/resources.md?raw";
import footerTemplate from "@/lib/report/content-templates/footer.md?raw";

// Demo data for preview (simulated scores)
const DEMO_SCORES: Record<string, number> = {
  "Precision & Organization": 85,
  "Empathy & Altruism": 72,
  "Creativity & Expression": 65,
  "Logic & Reflection": 78,
  "Leadership & Confidence": 70,
  "Harmony & Cooperation": 68,
};

const PreviewReport = () => {
  // Build report model with demo data
  const reportModel = useMemo(() => buildReportModel(DEMO_SCORES), []);
  
  // State for charts
  const [radarChartUrl, setRadarChartUrl] = useState<string>("");
  const [barChartUrl, setBarChartUrl] = useState<string>("");
  const [gaugeCharts, setGaugeCharts] = useState<Record<string, string>>({});
  const [comparisonCharts, setComparisonCharts] = useState<Record<string, string>>({});
  const [strengthsGrowthChartUrl, setStrengthsGrowthChartUrl] = useState<string>("");
  const [communicationChartUrl, setCommunicationChartUrl] = useState<string>("");
  const [careerMatchChartUrl, setCareerMatchChartUrl] = useState<string>("");

  // Generate charts on mount
  useEffect(() => {
    const generateAllCharts = async () => {
      try {
        // Generate main charts
        const radar = await generateRadarChart(DEMO_SCORES);
        const bar = await generateBarChart(DEMO_SCORES);
        setRadarChartUrl(radar);
        setBarChartUrl(bar);

        // Generate trait charts
        const gaugeChartsData: Record<string, string> = {};
        const comparisonChartsData: Record<string, string> = {};
        for (const trait of TRAITS) {
          const gauge = await generateGaugeChart(DEMO_SCORES[trait] || 0, trait);
          const comparison = await generateTraitComparisonChart(trait, DEMO_SCORES[trait] || 0, DEMO_SCORES);
          gaugeChartsData[trait] = gauge;
          comparisonChartsData[trait] = comparison;
        }
        setGaugeCharts(gaugeChartsData);
        setComparisonCharts(comparisonChartsData);

        // Generate strengths vs growth chart
        const sgChart = await generateStrengthsGrowthChart(
          reportModel.topStrengths,
          reportModel.areasForGrowth,
          DEMO_SCORES
        );
        setStrengthsGrowthChartUrl(sgChart);

        // Generate communication style chart
        const commChart = await generateCommunicationStyleChart(
          DEMO_SCORES["Empathy & Altruism"] || 0,
          DEMO_SCORES["Harmony & Cooperation"] || 0,
          DEMO_SCORES["Leadership & Confidence"] || 0
        );
        setCommunicationChartUrl(commChart);

        // Generate career match chart
        const careerMatches = reportModel.recommendedPaths.map((path, index) => {
          const trait1Score = DEMO_SCORES[reportModel.dominantTraits[0]] || 0;
          const trait2Score = DEMO_SCORES[reportModel.dominantTraits[1]] || 0;
          const avgDominantScore = (trait1Score + trait2Score) / 2;
          const baseMatch = Math.min(95, Math.max(60, avgDominantScore - 10 + (index * 3)));
          return {
            career: path.title,
            match: Math.round(baseMatch),
            traits: { [reportModel.dominantTraits[0]]: trait1Score, [reportModel.dominantTraits[1]]: trait2Score }
          };
        });
        const careerChart = await generateCareerMatchChart(careerMatches);
        setCareerMatchChartUrl(careerChart);
      } catch (error) {
        console.error("Error generating charts:", error);
      }
    };

    generateAllCharts();
  }, [reportModel]);

  // Replace placeholders in templates
  const processTemplate = (template: string, data: Record<string, string | number>): string => {
    let result = template;
    for (const [key, value] of Object.entries(data)) {
      const placeholder = new RegExp(`{{${key}}}`, "g");
      result = result.replace(placeholder, String(value));
    }
    return result;
  };

  // Get profile type
  const profileType = getProfileType(reportModel.dominantTraits);
  
  // Generate work scenarios
  const generateWorkScenarios = () => {
    const scenarios: Array<{ situation: string; likelyResponse: string; recommendation: string; trait: string }> = [];
    
    if (DEMO_SCORES["Harmony & Cooperation"] >= 70) {
      scenarios.push({
        situation: "Team members disagree on project approach",
        likelyResponse: "You actively seek to understand both perspectives and find a compromise that addresses everyone's concerns",
        recommendation: "Continue using your mediation skills while ensuring your own needs are also met",
        trait: "Harmony & Cooperation"
      });
    } else if (DEMO_SCORES["Leadership & Confidence"] >= 70) {
      scenarios.push({
        situation: "Team members disagree on project approach",
        likelyResponse: "You assert your perspective and propose a clear direction based on your analysis",
        recommendation: "Balance your assertiveness with active listening to incorporate others' valuable insights",
        trait: "Leadership & Confidence"
      });
    }
    
    if (DEMO_SCORES["Logic & Reflection"] >= 70) {
      scenarios.push({
        situation: "Facing a complex technical challenge with multiple variables",
        likelyResponse: "You systematically break down the problem, research solutions, and analyze options before deciding",
        recommendation: "Leverage your analytical strength while also considering intuitive insights and team input",
        trait: "Logic & Reflection"
      });
    }
    
    if (DEMO_SCORES["Precision & Organization"] >= 70) {
      scenarios.push({
        situation: "Tight deadline with multiple deliverables",
        likelyResponse: "You create a detailed plan, prioritize tasks, and systematically work through each item",
        recommendation: "Your organization is valuable - share your planning methods with the team to improve efficiency",
        trait: "Precision & Organization"
      });
    }
    
    return scenarios.slice(0, 3);
  };

  const workScenarios = generateWorkScenarios();

  // Process templates with data
  const date = new Date().toISOString().split("T")[0];
  const coverContent = processTemplate(coverTemplate, { date });

  const executiveSummaryContent = processTemplate(executiveSummaryTemplate, {
    dominantTrait1: reportModel.dominantTraits[0] || "Precision & Organization",
    dominantTrait2: reportModel.dominantTraits[1] || "Empathy & Altruism",
  });

  const { strengthsText, growthText } = generateStrengthsAndGrowthText(
    reportModel.topStrengths,
    reportModel.areasForGrowth
  );
  const strengthsAndGrowthContent = processTemplate(strengthsAndGrowthTemplate, {
    strengthsList: strengthsText,
    growthAreasList: growthText,
  });

  const pathsText = generateRecommendedPathsText(reportModel.recommendedPaths);
  const pathsAndCareersContent = processTemplate(pathsAndCareersTemplate, {
    recommendedPathsList: pathsText,
  });

  const relationshipDescription = generateRelationshipDescription(
    DEMO_SCORES["Empathy & Altruism"] || 0,
    DEMO_SCORES["Harmony & Cooperation"] || 0,
    DEMO_SCORES["Leadership & Confidence"] || 0
  );
  const communicationTips = generateCommunicationTips();
  const relationshipsContent = processTemplate(relationshipsTemplate, {
    relationshipDescription,
    communicationTipsList: formatBulletList(communicationTips),
  });

  const developmentPlanText = generateDevelopmentPlanText(reportModel.dailyChallenges);
  const developmentPlanContent = processTemplate(developmentPlanTemplate, {
    developmentChallengesList: developmentPlanText,
  });

  const resourcesContent = resourcesTemplate;
  const footerContent = footerTemplate;

  // Generate trait pages content
  const traitPagesContent = TRAITS.map((trait, index) => {
    const score = DEMO_SCORES[trait] || 0;
    const description = getTraitDescription(trait, score);
    const strengths = getTraitStrengths(trait, score);
    const growthAreas = getTraitGrowthAreas(trait, score);
    const workExamples = getTraitWorkExamples(trait, score);
    
    return {
      trait,
      score,
      description,
      strengths,
      growthAreas,
      workExamples,
      pageNumber: index + 3,
    };
  });

  // Custom components for react-markdown to match PDF styles
  // PDF uses: text color #374151 (slate-700), accent #117B4D (emerald-600)
  // A4 dimensions: 210mm x 297mm - scaling text sizes proportionally for web preview
  // PDF font sizes scaled up: 20px (title), 16px (section), 14px (body)
  const markdownComponents = {
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="text-2xl font-bold text-[#374151] mb-4 mt-6 leading-tight">{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-xl font-bold text-[#117B4D] mb-3 mt-5 leading-tight">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="text-lg font-semibold text-[#6B7280] mb-2 mt-4 leading-tight">{children}</h3>
    ),
    h4: ({ children }: { children: React.ReactNode }) => (
      <h4 className="text-base font-semibold text-[#374151] mb-2 mt-3 leading-tight">{children}</h4>
    ),
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="text-sm text-[#374151] leading-relaxed mb-3 text-justify">{children}</p>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-disc list-inside text-sm text-[#374151] mb-4 space-y-1 ml-4">
        {children}
      </ul>
    ),
    li: ({ children }: { children: React.ReactNode }) => (
      <li className="text-sm text-[#374151] leading-relaxed">{children}</li>
    ),
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="font-semibold text-[#374151]">{children}</strong>
    ),
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef] py-8">
      <div className="mx-auto" style={{ maxWidth: '210mm', padding: '0 1rem' }}>
        {/* Header */}
        <div className="mb-8 text-center bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-[#374151] mb-2">
            Avenirea Report Live Preview
          </h1>
          <p className="text-sm text-[#6B7280]">
            Edit markdown templates in <code className="bg-[#f7f4ef] px-2 py-1 rounded text-xs font-mono">src/lib/report/content-templates/</code> to see changes
          </p>
        </div>

        {/* Cover Page - matches PDF background color and dimensions (A4: 210mm x 297mm, ~794px x 1123px at 96dpi) */}
        <div 
          className="bg-[#f7f4ef] rounded-lg shadow-sm mb-8 text-center flex flex-col justify-center items-center"
          style={{ 
            width: '210mm', 
            minHeight: '297mm',
            padding: '20mm',
            margin: '0 auto'
          }}
        >
          <ReactMarkdown 
            components={{
              h1: ({ children }) => (
                <h1 className="text-4xl font-bold text-[#374151] mb-6 mt-8">{children}</h1>
              ),
              h3: ({ children }) => (
                <h3 className="text-2xl font-normal italic text-[#374151] mb-6">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-base text-[#374151] mb-4 text-justify leading-relaxed">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-[#374151]">{children}</strong>
              ),
              hr: () => <hr className="my-6 border-gray-300" />,
            }}
          >
            {coverContent}
          </ReactMarkdown>
        </div>

        {/* Page Break */}
        <hr className="my-8 border-gray-300" />

        {/* Executive Summary */}
        <div 
          className="bg-white rounded-lg shadow-sm mb-8 p-8"
          style={{ width: '210mm', minHeight: '297mm', margin: '0 auto', padding: '20mm' }}
        >
          <ReactMarkdown components={markdownComponents}>
            {executiveSummaryContent}
          </ReactMarkdown>
          
          {/* Profile Type */}
          <div className="mt-4 mb-6">
            <p className="text-lg font-bold text-[#117B4D]">{profileType}</p>
          </div>
          
          {/* Trait Scores Overview Table */}
          <div className="mt-6 mb-8">
            <h3 className="text-base font-bold text-[#374151] mb-3">Trait Scores Overview</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-100 grid grid-cols-2 gap-4 p-2 font-bold text-sm">
                <div>Trait</div>
                <div className="text-right">Score</div>
              </div>
              {TRAITS.map(trait => {
                const score = DEMO_SCORES[trait] || 0;
                return { trait, score };
              })
              .sort((a, b) => b.score - a.score)
              .map(({ trait, score }) => {
                const percentile = calculatePercentile(score);
                const scoreColor = score >= 70 ? "#117B4D" : score >= 40 ? "#F59E0B" : "#EF4444";
                return (
                  <div key={trait} className="grid grid-cols-2 gap-4 p-2 border-t border-gray-200">
                    <div className="text-sm text-[#374151]">{trait}</div>
                    <div className="text-right flex items-center justify-end gap-2">
                      <div 
                        className="w-16 h-2 rounded-full bg-gray-200 overflow-hidden"
                        style={{ backgroundColor: "#E5E7EB" }}
                      >
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${score}%`,
                            backgroundColor: scoreColor
                          }}
                        />
                      </div>
                      <span className="font-bold text-sm" style={{ color: scoreColor, minWidth: "45px" }}>
                        {Math.round(score)}%
                      </span>
                      <span className="text-xs text-gray-500">({percentile}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {radarChartUrl ? (
              <img src={radarChartUrl} alt="Radar Chart" className="w-full h-auto" />
            ) : (
              <div className="bg-gray-100 p-4 rounded text-center text-sm text-gray-500">
                Loading Radar Chart...
              </div>
            )}
            {barChartUrl ? (
              <img src={barChartUrl} alt="Bar Chart" className="w-full h-auto" />
            ) : (
              <div className="bg-gray-100 p-4 rounded text-center text-sm text-gray-500">
                Loading Bar Chart...
              </div>
            )}
          </div>
        </div>

        {/* Page Break */}
        <hr className="my-8 border-gray-300" />

        {/* Trait Pages */}
        {traitPagesContent.map((traitPage, index) => {
          const quote = getTraitQuote(traitPage.trait, traitPage.score);
          const careers = getTraitCareers(traitPage.trait, traitPage.score);
          const actions = getTraitActions(traitPage.score);
          const percentile = calculatePercentile(traitPage.score);
          const scoreColor = traitPage.score >= 70 ? "#117B4D" : traitPage.score >= 40 ? "#F59E0B" : "#EF4444";
          
          // Get comparison insight
          const sortedTraits = TRAITS.map(t => ({ name: t, score: DEMO_SCORES[t] || 0 }))
            .sort((a, b) => b.score - a.score);
          const secondTrait = sortedTraits.find(t => t.name !== traitPage.trait);
          const comparisonInsight = secondTrait 
            ? generateComparisonInsight(traitPage.trait, traitPage.score, secondTrait.name, secondTrait.score)
            : "";
          
          return (
            <div key={traitPage.trait}>
              <div 
                className="bg-white rounded-lg shadow-sm mb-8 p-8"
                style={{ width: '210mm', minHeight: '297mm', margin: '0 auto', padding: '20mm' }}
              >
                <div className="mb-4">
                  <p className="text-xs text-[#9CA3AF] text-right mb-2">Page {traitPage.pageNumber}</p>
                  <h2 className="text-xl font-bold text-[#374151] mb-1">{traitPage.trait}</h2>
                  <p className="text-xs text-[#6B7280] mb-3">Above {percentile}% of respondents</p>
                </div>
                
                {/* Two-column layout */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Left column: Gauge chart and quote */}
                  <div>
                    {gaugeCharts[traitPage.trait] && (
                      <div className="mb-4">
                        <img src={gaugeCharts[traitPage.trait]} alt={`${traitPage.trait} Gauge`} className="w-full h-auto" />
                      </div>
                    )}
                    {quote && (
                      <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: `${scoreColor}20`, border: `1px solid ${scoreColor}` }}>
                        <p className="text-xs italic text-[#374151]">"{quote}"</p>
                      </div>
                    )}
                    <div className="text-sm text-[#374151] leading-relaxed text-justify">
                      {traitPage.description}
                    </div>
                  </div>
                  
                  {/* Right column: Comparison chart */}
                  <div>
                    {comparisonCharts[traitPage.trait] && (
                      <div className="mb-4">
                        <img src={comparisonCharts[traitPage.trait]} alt={`${traitPage.trait} Comparison`} className="w-full h-auto" />
                      </div>
                    )}
                    {comparisonInsight && (
                      <div className="text-xs text-[#6B7280] p-2 bg-gray-50 rounded">
                        {comparisonInsight}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Full-width sections */}
                <div className="space-y-4">
                  {/* Strengths with colored box */}
                  {traitPage.strengths.length > 0 && (
                    <div className="p-4 rounded-lg" style={{ backgroundColor: "#117B4D20", border: "1px solid #117B4D" }}>
                      <h3 className="text-base font-bold text-[#117B4D] mb-2">Strengths</h3>
                      <ul className="list-disc list-inside text-sm text-[#374151] space-y-1 ml-4">
                        {traitPage.strengths.map((strength, i) => (
                          <li key={i}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Growth areas (if applicable) */}
                  {traitPage.growthAreas.length > 0 && traitPage.score < 50 && (
                    <div className="p-4 rounded-lg" style={{ backgroundColor: "#F59E0B20", border: "1px solid #F59E0B" }}>
                      <h3 className="text-base font-bold text-[#F59E0B] mb-2">Areas for Growth</h3>
                      <ul className="list-disc list-inside text-sm text-[#374151] space-y-1 ml-4">
                        {traitPage.growthAreas.slice(0, 3).map((area, i) => (
                          <li key={i}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Action recommendations */}
                  {actions.actions.length > 0 && (
                    <div className="p-4 rounded-lg" style={{ backgroundColor: `${scoreColor}20`, border: `1px solid ${scoreColor}` }}>
                      <h3 className="text-base font-bold mb-2" style={{ color: scoreColor }}>
                        {actions.title}
                      </h3>
                      <ul className="list-disc list-inside text-sm text-[#374151] space-y-1 ml-4">
                        {actions.actions.slice(0, 3).map((action, i) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Career recommendations */}
                  {careers.length > 0 && (
                    <div>
                      <h3 className="text-base font-bold text-[#374151] mb-2">Recommended Careers & Studies</h3>
                      <ul className="list-disc list-inside text-sm text-[#374151] space-y-1 ml-4">
                        {careers.slice(0, 4).map((career, i) => (
                          <li key={i}>{career}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Work examples */}
                  <div>
                    <h3 className="text-base font-bold text-[#374151] mb-2">At Work/Study:</h3>
                    {traitPage.workExamples.strengths.length > 0 && (
                      <ul className="list-disc list-inside text-sm text-[#374151] space-y-1 ml-4 mb-2">
                        {traitPage.workExamples.strengths.slice(0, 2).map((example, i) => (
                          <li key={i}>{example}</li>
                        ))}
                      </ul>
                    )}
                    {traitPage.workExamples.caveats.length > 0 && (
                      <ul className="list-disc list-inside text-sm text-[#374151] space-y-1 ml-4">
                        {traitPage.workExamples.caveats.slice(0, 1).map((example, i) => (
                          <li key={i}>{example}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              {index < traitPagesContent.length - 1 && <hr className="my-8 border-gray-300" />}
            </div>
          );
        })}

        {/* Page Break */}
        <hr className="my-8 border-gray-300" />

        {/* Strengths & Growth Areas */}
        <div 
          className="bg-white rounded-lg shadow-sm mb-8 p-8"
          style={{ width: '210mm', minHeight: '297mm', margin: '0 auto', padding: '20mm' }}
        >
          <h2 className="text-2xl font-bold text-[#374151] mb-6">Strengths & Growth Areas</h2>
          
          {/* Chart */}
          {strengthsGrowthChartUrl && (
            <div className="mb-8">
              <img src={strengthsGrowthChartUrl} alt="Strengths vs Growth Chart" className="w-full h-auto" />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: "#117B4D20", border: "1px solid #117B4D" }}>
              <h3 className="text-lg font-bold text-[#117B4D] mb-3">Top Strengths</h3>
              <ul className="list-disc list-inside text-sm text-[#374151] space-y-2 ml-4">
                {reportModel.topStrengths.map((strength, i) => (
                  <li key={i}>{strength}</li>
                ))}
              </ul>
            </div>
            
            {/* Growth Areas */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: "#F59E0B20", border: "1px solid #F59E0B" }}>
              <h3 className="text-lg font-bold text-[#F59E0B] mb-3">Areas for Growth</h3>
              <ul className="list-disc list-inside text-sm text-[#374151] space-y-2 ml-4">
                {reportModel.areasForGrowth.map((area, i) => (
                  <li key={i}>{area}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Prioritized Action Plan */}
          <div className="mt-8">
            <h3 className="text-base font-bold text-[#374151] mb-4">Prioritized Action Plan</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-bold text-[#117B4D] mb-2">Leverage These Strengths:</h4>
                <ol className="list-decimal list-inside text-sm text-[#374151] space-y-1 ml-2">
                  {reportModel.topStrengths.slice(0, 3).map((strength, i) => (
                    <li key={i}>{strength}</li>
                  ))}
                </ol>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F59E0B] mb-2">Focus on These Growth Areas:</h4>
                <ol className="list-decimal list-inside text-sm text-[#374151] space-y-1 ml-2">
                  {reportModel.areasForGrowth.slice(0, 3).map((area, i) => (
                    <li key={i}>{area}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Page Break */}
        <hr className="my-8 border-gray-300" />

        {/* Work Examples Page */}
        <div 
          className="bg-white rounded-lg shadow-sm mb-8 p-8"
          style={{ width: '210mm', minHeight: '297mm', margin: '0 auto', padding: '20mm' }}
        >
          <h2 className="text-2xl font-bold text-[#374151] mb-6">Work & Study Applications</h2>
          
          {/* Realistic Scenarios */}
          <div className="space-y-6 mb-8">
            {workScenarios.map((scenario, index) => (
              <div 
                key={index} 
                className="p-4 rounded-lg" 
                style={{ backgroundColor: "#117B4D20", border: "1px solid #117B4D" }}
              >
                <p className="text-xs font-bold text-[#117B4D] mb-2">
                  Scenario {index + 1}: {scenario.trait}
                </p>
                <div className="space-y-2 text-sm text-[#374151]">
                  <div>
                    <span className="font-bold">Situation:</span> {scenario.situation}
                  </div>
                  <div>
                    <span className="font-bold">Likely Response:</span> {scenario.likelyResponse}
                  </div>
                  <div>
                    <span className="font-bold text-[#117B4D]">Recommended Adjustment:</span> {scenario.recommendation}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Key Work Behaviors */}
          <div>
            <h3 className="text-base font-bold text-[#374151] mb-4">Key Work Behaviors</h3>
            <div className="space-y-4">
              {traitPagesContent.slice(0, 2).map((traitPage) => (
                <div key={traitPage.trait}>
                  <h4 className="text-sm font-bold text-[#117B4D] mb-2">{traitPage.trait}</h4>
                  {traitPage.workExamples.strengths.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-[#374151] space-y-1 ml-4">
                      {traitPage.workExamples.strengths.slice(0, 2).map((example, i) => (
                        <li key={i}>{example}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Page Break */}
        <hr className="my-8 border-gray-300" />

        {/* Ideal Work & Learning Paths */}
        <div 
          className="bg-white rounded-lg shadow-sm mb-8 p-8"
          style={{ width: '210mm', minHeight: '297mm', margin: '0 auto', padding: '20mm' }}
        >
          <h2 className="text-2xl font-bold text-[#374151] mb-6">Ideal Work & Learning Paths</h2>
          
          {/* Career Match Chart */}
          {careerMatchChartUrl && (
            <div className="mb-8">
              <img src={careerMatchChartUrl} alt="Career Match Chart" className="w-full h-auto" />
            </div>
          )}
          
          {/* Recommended Paths */}
          <div className="space-y-4">
            {reportModel.recommendedPaths.map((path, index) => {
              const trait1Score = DEMO_SCORES[reportModel.dominantTraits[0]] || 0;
              const trait2Score = DEMO_SCORES[reportModel.dominantTraits[1]] || 0;
              const avgDominantScore = (trait1Score + trait2Score) / 2;
              const match = Math.min(95, Math.max(60, avgDominantScore - 10 + (index * 3)));
              const boxColor = match >= 80 ? "#117B4D" : match >= 60 ? "#F59E0B" : "#6B7280";
              
              return (
                <div 
                  key={index}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: `${boxColor}20`, border: `1px solid ${boxColor}` }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-bold" style={{ color: boxColor }}>
                      {path.title}
                    </h3>
                    <span className="text-sm font-bold text-[#374151]">{Math.round(match)}% match</span>
                  </div>
                  <p className="text-sm text-[#374151] text-justify">{path.reason}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Page Break */}
        <hr className="my-8 border-gray-300" />

        {/* Relationships & Communication */}
        <div 
          className="bg-white rounded-lg shadow-sm mb-8 p-8"
          style={{ width: '210mm', minHeight: '297mm', margin: '0 auto', padding: '20mm' }}
        >
          <h2 className="text-2xl font-bold text-[#374151] mb-6">Relationships & Communication</h2>
          
          {/* Communication Style Chart */}
          {communicationChartUrl && (
            <div className="mb-6" style={{ maxWidth: '200px' }}>
              <img src={communicationChartUrl} alt="Communication Style Chart" className="w-full h-auto" />
            </div>
          )}
          
          {/* Relationship Description */}
          <div className="mb-6 text-sm text-[#374151] leading-relaxed text-justify">
            {relationshipDescription}
          </div>
          
          {/* Communication Tips */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: "#117B4D20", border: "1px solid #117B4D" }}>
            <h3 className="text-base font-bold text-[#117B4D] mb-3">Communication Tips</h3>
            <ul className="list-disc list-inside text-sm text-[#374151] space-y-2 ml-4">
              {communicationTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
              {/* Add tailored tips */}
              {DEMO_SCORES["Empathy & Altruism"] >= 70 && (
                <li>Your high empathy allows you to understand others deeply - use this to build trust and connection</li>
              )}
              {DEMO_SCORES["Harmony & Cooperation"] >= 70 && (
                <li>Your ability to maintain harmony makes you an excellent mediator in conflicts</li>
              )}
              {DEMO_SCORES["Leadership & Confidence"] >= 70 && (
                <li>Your confidence in expressing opinions is valuable - balance it with active listening</li>
              )}
            </ul>
          </div>
        </div>

        {/* Page Break */}
        <hr className="my-8 border-gray-300" />

        {/* 3-Week Personal Development Plan */}
        <div 
          className="bg-white rounded-lg shadow-sm mb-8 p-8"
          style={{ width: '210mm', minHeight: '297mm', margin: '0 auto', padding: '20mm' }}
        >
          <h2 className="text-2xl font-bold text-[#374151] mb-6">3-Week Personal Development Plan</h2>
          
          <div className="space-y-4">
            {reportModel.dailyChallenges.map((challenge, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg"
                style={{ backgroundColor: "#117B4D20", border: "1px solid #117B4D" }}
              >
                <h3 className="text-base font-bold text-[#117B4D] mb-2">
                  Week {challenge.week}: {challenge.task}
                </h3>
                <div className="text-sm text-[#374151] space-y-2">
                  <div>
                    <span className="font-bold">Why:</span> <span className="text-justify">{challenge.explanation}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#117B4D]">Expected Outcome:</span> <span className="text-justify">{challenge.outcome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Page Break */}
        <hr className="my-8 border-gray-300" />

        {/* Resources & Next Steps */}
        <div 
          className="bg-white rounded-lg shadow-sm mb-8 p-8"
          style={{ width: '210mm', minHeight: '297mm', margin: '0 auto', padding: '20mm' }}
        >
          <ReactMarkdown components={markdownComponents}>{resourcesContent}</ReactMarkdown>
        </div>

        {/* Page Break */}
        <hr className="my-8 border-gray-300" />

        {/* Footer & Credits */}
        <div 
          className="bg-white rounded-lg shadow-sm mb-8 p-8"
          style={{ width: '210mm', minHeight: '297mm', margin: '0 auto', padding: '20mm' }}
        >
          <ReactMarkdown components={markdownComponents}>{footerContent}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default PreviewReport;

