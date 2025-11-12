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
import type { AnswersState } from "@/pages/TestPersonnalite";
import { calculateTraitScores } from "@/pages/TestPersonnalite";
import "./report-styles.css";

// Import markdown templates
import coverTemplate from "@/lib/report/content-templates/cover.md?raw";
import executiveSummaryTemplate from "@/lib/report/content-templates/executive_summary.md?raw";
import strengthsAndGrowthTemplate from "@/lib/report/content-templates/strengths_and_growth.md?raw";
import pathsAndCareersTemplate from "@/lib/report/content-templates/paths_and_careers.md?raw";
import relationshipsTemplate from "@/lib/report/content-templates/relationships.md?raw";
import developmentPlanTemplate from "@/lib/report/content-templates/development_plan.md?raw";
import resourcesTemplate from "@/lib/report/content-templates/resources.md?raw";
import footerTemplate from "@/lib/report/content-templates/footer.md?raw";

interface ReportPageProps {
  answers: AnswersState;
}

const ReportPage = ({ answers }: ReportPageProps) => {
  // Calculate trait scores from answers
  const scores = useMemo(() => calculateTraitScores(answers), [answers]);
  const reportModel = useMemo(() => buildReportModel(scores), [scores]);

  // State for charts
  const [radarChartUrl, setRadarChartUrl] = useState<string>("");
  const [barChartUrl, setBarChartUrl] = useState<string>("");
  const [gaugeCharts, setGaugeCharts] = useState<Record<string, string>>({});
  const [comparisonCharts, setComparisonCharts] = useState<Record<string, string>>({});
  const [strengthsGrowthChartUrl, setStrengthsGrowthChartUrl] = useState<string>("");
  const [communicationChartUrl, setCommunicationChartUrl] = useState<string>("");
  const [careerMatchChartUrl, setCareerMatchChartUrl] = useState<string>("");
  const [chartsReady, setChartsReady] = useState(false);

  // Generate all charts with timeout protection
  useEffect(() => {
    const generateAllCharts = async () => {
      const MAX_CHART_TIME = 10000; // 10 seconds per chart max
      const MAX_TOTAL_TIME = 30000; // 30 seconds total max
      const startTime = Date.now();
      
      console.log("[ReportPage] ========================================");
      console.log("[ReportPage] CHART GENERATION STARTED");
      console.log("[ReportPage] Max chart time:", MAX_CHART_TIME, "ms");
      console.log("[ReportPage] Max total time:", MAX_TOTAL_TIME, "ms");
      console.log("[ReportPage] ========================================");
      
      // Helper function to generate chart with timeout
      const generateChartWithTimeout = async <T,>(
        chartName: string,
        generator: () => Promise<T>,
        defaultValue: T
      ): Promise<T> => {
        try {
          const timeoutPromise = new Promise<T>((_, reject) => 
            setTimeout(() => reject(new Error(`Timeout: ${chartName}`)), MAX_CHART_TIME)
          );
          const result = await Promise.race([generator(), timeoutPromise]);
          console.log(`[ReportPage] ${chartName} generated`);
          return result;
        } catch (error) {
          console.warn(`[ReportPage] ${chartName} failed or timed out:`, error);
          return defaultValue;
        }
      };

      try {
        const gaugeChartsData: Record<string, string> = {};
        const comparisonChartsData: Record<string, string> = {};
        
        // Generate charts in parallel with individual timeouts
        const chartPromises: Promise<void>[] = [];

        // Generate main charts
        console.log("[ReportPage] Starting main charts generation...");
        chartPromises.push(
          generateChartWithTimeout(
            "Radar chart",
            () => {
              console.log("[ReportPage] Calling generateRadarChart...");
              return generateRadarChart(scores);
            },
            ""
          ).then(url => {
            if (url) {
              console.log("[ReportPage] Radar chart URL received, length:", url.length);
              setRadarChartUrl(url);
            } else {
              console.warn("[ReportPage] Radar chart URL is empty");
            }
          }).catch(err => {
            console.error("[ReportPage] Error setting radar chart URL:", err);
          })
        );
        
        chartPromises.push(
          generateChartWithTimeout(
            "Bar chart",
            () => {
              console.log("[ReportPage] Calling generateBarChart...");
              return generateBarChart(scores);
            },
            ""
          ).then(url => {
            if (url) {
              console.log("[ReportPage] Bar chart URL received, length:", url.length);
              setBarChartUrl(url);
            } else {
              console.warn("[ReportPage] Bar chart URL is empty");
            }
          }).catch(err => {
            console.error("[ReportPage] Error setting bar chart URL:", err);
          })
        );

        // Generate trait charts (only essential ones for PDF)
        // Limit to top 3 traits to reduce generation time
        const sortedTraits = TRAITS.map(trait => ({ trait, score: scores[trait] || 0 }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map(item => item.trait);
        
        sortedTraits.forEach(trait => {
          chartPromises.push(
            generateChartWithTimeout(
              `Gauge chart for ${trait}`,
              () => generateGaugeChart(scores[trait] || 0, trait),
              ""
            ).then(url => url && (gaugeChartsData[trait] = url))
          );
          
          chartPromises.push(
            generateChartWithTimeout(
              `Comparison chart for ${trait}`,
              () => generateTraitComparisonChart(trait, scores[trait] || 0, scores),
              ""
            ).then(url => url && (comparisonChartsData[trait] = url))
          );
        });

        // Generate other essential charts
        chartPromises.push(
          generateChartWithTimeout(
            "Strengths growth chart",
            () => generateStrengthsGrowthChart(
              reportModel.topStrengths,
              reportModel.areasForGrowth,
              scores
            ),
            ""
          ).then(url => url && setStrengthsGrowthChartUrl(url))
        );

        chartPromises.push(
          generateChartWithTimeout(
            "Communication chart",
            () => generateCommunicationStyleChart(
              scores["Empathy & Altruism"] || 0,
              scores["Harmony & Cooperation"] || 0,
              scores["Leadership & Confidence"] || 0
            ),
            ""
          ).then(url => url && setCommunicationChartUrl(url))
        );

        // Generate career match chart
        const careerMatches = reportModel.recommendedPaths.map((path, index) => {
          const trait1Score = scores[reportModel.dominantTraits[0]] || 0;
          const trait2Score = scores[reportModel.dominantTraits[1]] || 0;
          const avgDominantScore = (trait1Score + trait2Score) / 2;
          const baseMatch = Math.min(95, Math.max(60, avgDominantScore - 10 + (index * 3)));
          return {
            career: path.title,
            match: Math.round(baseMatch),
            traits: { [reportModel.dominantTraits[0]]: trait1Score, [reportModel.dominantTraits[1]]: trait2Score }
          };
        });
        
        chartPromises.push(
          generateChartWithTimeout(
            "Career match chart",
            () => generateCareerMatchChart(careerMatches),
            ""
          ).then(url => url && setCareerMatchChartUrl(url))
        );

        // Wait for charts with overall timeout
        const overallTimeout = new Promise<void>((resolve) => {
          setTimeout(() => {
            console.log("[ReportPage] Overall timeout reached, marking as ready");
            resolve();
          }, MAX_TOTAL_TIME);
        });

        // Race between charts completion and overall timeout
        console.log("[ReportPage] Waiting for charts or timeout...");
        const raceResult = await Promise.race([
          Promise.allSettled(chartPromises).then((results) => {
            const successCount = results.filter(r => r.status === 'fulfilled').length;
            const failureCount = results.filter(r => r.status === 'rejected').length;
            console.log(`[ReportPage] All chart promises settled: ${successCount} success, ${failureCount} failed`);
            return { type: 'completed', results };
          }),
          overallTimeout.then(() => {
            console.log("[ReportPage] Overall timeout reached");
            return { type: 'timeout' };
          })
        ]);
        
        const elapsed = Date.now() - startTime;
        console.log(`[ReportPage] Race result: ${raceResult.type} after ${elapsed}ms`);
        
        // Set the chart data
        setGaugeCharts(gaugeChartsData);
        setComparisonCharts(comparisonChartsData);
        
        console.log(`[ReportPage] Gauge charts generated:`, Object.keys(gaugeChartsData).length);
        console.log(`[ReportPage] Comparison charts generated:`, Object.keys(comparisonChartsData).length);
        console.log(`[ReportPage] Radar chart:`, !!radarChartUrl);
        console.log(`[ReportPage] Bar chart:`, !!barChartUrl);
        
        console.log("[ReportPage] ========================================");
        console.log("[ReportPage] MARKING CHARTS AS READY");
        console.log("[ReportPage] Total time:", elapsed, "ms");
        console.log("[ReportPage] ========================================");
        
        setChartsReady(true);
        
        // Also set the attribute on the container for Puppeteer to detect
        setTimeout(() => {
          const container = document.querySelector('.report-container');
          if (container) {
            container.setAttribute('data-charts-ready', 'true');
            console.log("[ReportPage] Set data-charts-ready attribute on container");
          } else {
            console.warn("[ReportPage] Container not found, cannot set data-charts-ready attribute");
          }
        }, 100);
      } catch (error) {
        console.error("[ReportPage] Error in chart generation:", error);
        // Always mark as ready to avoid infinite loading
        setChartsReady(true);
      }
    };

    generateAllCharts();
  }, [scores, reportModel]);

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

    if (scores["Harmony & Cooperation"] >= 70) {
      scenarios.push({
        situation: "Team members disagree on project approach",
        likelyResponse: "You actively seek to understand both perspectives and find a compromise that addresses everyone's concerns",
        recommendation: "Continue using your mediation skills while ensuring your own needs are also met",
        trait: "Harmony & Cooperation"
      });
    } else if (scores["Leadership & Confidence"] >= 70) {
      scenarios.push({
        situation: "Team members disagree on project approach",
        likelyResponse: "You assert your perspective and propose a clear direction based on your analysis",
        recommendation: "Balance your assertiveness with active listening to incorporate others' valuable insights",
        trait: "Leadership & Confidence"
      });
    }

    if (scores["Logic & Reflection"] >= 70) {
      scenarios.push({
        situation: "Facing a complex technical challenge with multiple variables",
        likelyResponse: "You systematically break down the problem, research solutions, and analyze options before deciding",
        recommendation: "Leverage your analytical strength while also considering intuitive insights and team input",
        trait: "Logic & Reflection"
      });
    }

    if (scores["Precision & Organization"] >= 70) {
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
    scores["Empathy & Altruism"] || 0,
    scores["Harmony & Cooperation"] || 0,
    scores["Leadership & Confidence"] || 0
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
    const score = scores[trait] || 0;
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

  // Markdown components for consistent styling
  const markdownComponents = {
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="report-h1">{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="report-h2">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="report-h3">{children}</h3>
    ),
    h4: ({ children }: { children: React.ReactNode }) => (
      <h4 className="report-h4">{children}</h4>
    ),
    p: ({ children }: { children: React.ReactNode }) => (
      <p className="report-p">{children}</p>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="report-ul">{children}</ul>
    ),
    li: ({ children }: { children: React.ReactNode }) => (
      <li className="report-li">{children}</li>
    ),
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="report-strong">{children}</strong>
    ),
    hr: () => <hr className="report-hr" />,
  };

  // Show loading state if charts aren't ready
  // But still render the container so Puppeteer can see it
  if (!chartsReady) {
    return (
      <div className="report-container" data-charts-ready="false">
        <div className="report-loading" style={{ 
          padding: "40px", 
          textAlign: "center",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div>
            <div style={{ fontSize: "18px", marginBottom: "10px" }}>Generating report charts...</div>
            <div style={{ fontSize: "14px", color: "#666" }}>This may take up to 30 seconds</div>
          </div>
        </div>
      </div>
    );
  }

  // Set data-charts-ready attribute when charts are ready
  useEffect(() => {
    if (chartsReady) {
      const container = document.querySelector('.report-container');
      if (container) {
        container.setAttribute('data-charts-ready', 'true');
        console.log("[ReportPage] Container marked as ready for PDF generation");
      }
    }
  }, [chartsReady]);

  return (
    <div className="report-container" data-charts-ready={chartsReady ? "true" : "false"}>
      {/* Page 1: Cover */}
      <section className="report-page report-cover">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="report-cover-title">{children}</h1>,
            h3: ({ children }) => <h3 className="report-cover-subtitle">{children}</h3>,
            p: ({ children }) => <p className="report-cover-text">{children}</p>,
            strong: ({ children }) => <strong className="report-strong">{children}</strong>,
            hr: () => <hr className="report-hr" />,
          }}
        >
          {coverContent}
        </ReactMarkdown>
      </section>

      {/* Page 2: Executive Summary */}
      <section className="report-page">
        <ReactMarkdown components={markdownComponents}>
          {executiveSummaryContent}
        </ReactMarkdown>

        <div className="report-profile-type">{profileType}</div>

        {/* Trait Scores Overview Table */}
        <div className="report-scores-table">
          <div className="report-table-header">
            <div>Trait</div>
            <div className="text-right">Score</div>
          </div>
          {TRAITS.map(trait => {
            const score = scores[trait] || 0;
            return { trait, score };
          })
            .sort((a, b) => b.score - a.score)
            .map(({ trait, score }) => {
              const percentile = calculatePercentile(score);
              const scoreColor = score >= 70 ? "#3C8C76" : score >= 40 ? "#F3C567" : "#E76E6E";
              return (
                <div key={trait} className="report-table-row">
                  <div>{trait}</div>
                  <div className="report-score-cell">
                    <div className="report-score-bar-container">
                      <div
                        className="report-score-bar"
                        style={{
                          width: `${score}%`,
                          backgroundColor: scoreColor
                        }}
                      />
                    </div>
                    <span className="report-score-value" style={{ color: scoreColor }}>
                      {Math.round(score)}%
                    </span>
                    <span className="report-score-percentile">({percentile}%)</span>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Charts */}
        <div className="report-charts-grid">
          {radarChartUrl && (
            <img src={radarChartUrl} alt="Radar Chart" className="report-chart" />
          )}
          {barChartUrl && (
            <img src={barChartUrl} alt="Bar Chart" className="report-chart" />
          )}
        </div>
      </section>

      {/* Pages 3-8: Trait Deep Dives */}
      {traitPagesContent.map((traitPage, index) => {
        const quote = getTraitQuote(traitPage.trait, traitPage.score);
        const careers = getTraitCareers(traitPage.trait, traitPage.score);
        const actions = getTraitActions(traitPage.score);
        const percentile = calculatePercentile(traitPage.score);
        const scoreColor = traitPage.score >= 70 ? "#3C8C76" : traitPage.score >= 40 ? "#F3C567" : "#E76E6E";

        // Get comparison insight
        const sortedTraits = TRAITS.map(t => ({ name: t, score: scores[t] || 0 }))
          .sort((a, b) => b.score - a.score);
        const secondTrait = sortedTraits.find(t => t.name !== traitPage.trait);
        const comparisonInsight = secondTrait
          ? generateComparisonInsight(traitPage.trait, traitPage.score, secondTrait.name, secondTrait.score)
          : "";

        return (
          <section key={traitPage.trait} className="report-page">
            <div className="report-page-header">
              <p className="report-page-number">Page {traitPage.pageNumber}</p>
              <h2 className="report-trait-title">{traitPage.trait}</h2>
              <p className="report-trait-subtitle">Above {percentile}% of respondents</p>
            </div>

            {/* Two-column layout */}
            <div className="report-trait-layout">
              {/* Left column: Gauge chart and quote */}
              <div className="report-trait-left">
                {gaugeCharts[traitPage.trait] && (
                  <div className="report-chart-container">
                    <img src={gaugeCharts[traitPage.trait]} alt={`${traitPage.trait} Gauge`} className="report-chart" />
                  </div>
                )}
                {quote && (
                  <div className="report-quote-box" style={{ borderColor: scoreColor, backgroundColor: `${scoreColor}20` }}>
                    <p className="report-quote">"{quote}"</p>
                  </div>
                )}
                <div className="report-trait-description">
                  {traitPage.description}
                </div>
              </div>

              {/* Right column: Comparison chart */}
              <div className="report-trait-right">
                {comparisonCharts[traitPage.trait] && (
                  <div className="report-chart-container">
                    <img src={comparisonCharts[traitPage.trait]} alt={`${traitPage.trait} Comparison`} className="report-chart" />
                  </div>
                )}
                {comparisonInsight && (
                  <div className="report-insight-box">
                    {comparisonInsight}
                  </div>
                )}
              </div>
            </div>

            {/* Full-width sections */}
            <div className="report-trait-sections">
              {/* Strengths */}
              {traitPage.strengths.length > 0 && (
                <div className="report-strength-box">
                  <h3 className="report-section-title">Strengths</h3>
                  <ul className="report-list">
                    {traitPage.strengths.map((strength, i) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Growth areas */}
              {traitPage.growthAreas.length > 0 && traitPage.score < 50 && (
                <div className="report-growth-box">
                  <h3 className="report-section-title">Areas for Growth</h3>
                  <ul className="report-list">
                    {traitPage.growthAreas.slice(0, 3).map((area, i) => (
                      <li key={i}>{area}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action recommendations */}
              {actions.actions.length > 0 && (
                <div className="report-action-box" style={{ borderColor: scoreColor, backgroundColor: `${scoreColor}20` }}>
                  <h3 className="report-section-title" style={{ color: scoreColor }}>
                    {actions.title}
                  </h3>
                  <ul className="report-list">
                    {actions.actions.slice(0, 3).map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Career recommendations */}
              {careers.length > 0 && (
                <div className="report-careers-section">
                  <h3 className="report-section-title">Recommended Careers & Studies</h3>
                  <ul className="report-list">
                    {careers.slice(0, 4).map((career, i) => (
                      <li key={i}>{career}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Work examples */}
              <div className="report-work-examples">
                <h3 className="report-section-title">At Work/Study:</h3>
                {traitPage.workExamples.strengths.length > 0 && (
                  <ul className="report-list">
                    {traitPage.workExamples.strengths.slice(0, 2).map((example, i) => (
                      <li key={i}>{example}</li>
                    ))}
                  </ul>
                )}
                {traitPage.workExamples.caveats.length > 0 && (
                  <ul className="report-list">
                    {traitPage.workExamples.caveats.slice(0, 1).map((example, i) => (
                      <li key={i}>{example}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* Page 9: Strengths & Growth Areas */}
      <section className="report-page">
        <h2 className="report-page-title">Strengths & Growth Areas</h2>

        {/* Chart */}
        {strengthsGrowthChartUrl && (
          <div className="report-chart-container-full">
            <img src={strengthsGrowthChartUrl} alt="Strengths vs Growth Chart" className="report-chart" />
          </div>
        )}

        <div className="report-strengths-growth-layout">
          {/* Strengths */}
          <div className="report-strength-box">
            <h3 className="report-section-title-large">Top Strengths</h3>
            <ul className="report-list">
              {reportModel.topStrengths.map((strength, i) => (
                <li key={i}>{strength}</li>
              ))}
            </ul>
          </div>

          {/* Growth Areas */}
          <div className="report-growth-box">
            <h3 className="report-section-title-large">Areas for Growth</h3>
            <ul className="report-list">
              {reportModel.areasForGrowth.map((area, i) => (
                <li key={i}>{area}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Prioritized Action Plan */}
        <div className="report-action-plan">
          <h3 className="report-section-title">Prioritized Action Plan</h3>
          <div className="report-action-plan-grid">
            <div>
              <h4 className="report-subsection-title">Leverage These Strengths:</h4>
              <ol className="report-ordered-list">
                {reportModel.topStrengths.slice(0, 3).map((strength, i) => (
                  <li key={i}>{strength}</li>
                ))}
              </ol>
            </div>
            <div>
              <h4 className="report-subsection-title">Focus on These Growth Areas:</h4>
              <ol className="report-ordered-list">
                {reportModel.areasForGrowth.slice(0, 3).map((area, i) => (
                  <li key={i}>{area}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Page 10: Work Examples */}
      <section className="report-page">
        <h2 className="report-page-title">Work & Study Applications</h2>

        {/* Realistic Scenarios */}
        <div className="report-scenarios">
          {workScenarios.map((scenario, index) => (
            <div key={index} className="report-scenario-box">
              <p className="report-scenario-label">
                Scenario {index + 1}: {scenario.trait}
              </p>
              <div className="report-scenario-content">
                <div>
                  <span className="report-scenario-bold">Situation:</span> {scenario.situation}
                </div>
                <div>
                  <span className="report-scenario-bold">Likely Response:</span> {scenario.likelyResponse}
                </div>
                <div>
                  <span className="report-scenario-bold-accent">Recommended Adjustment:</span> {scenario.recommendation}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key Work Behaviors */}
        <div className="report-work-behaviors">
          <h3 className="report-section-title">Key Work Behaviors</h3>
          <div className="report-behaviors-list">
            {traitPagesContent.slice(0, 2).map((traitPage) => (
              <div key={traitPage.trait} className="report-behavior-item">
                <h4 className="report-subsection-title">{traitPage.trait}</h4>
                {traitPage.workExamples.strengths.length > 0 && (
                  <ul className="report-list">
                    {traitPage.workExamples.strengths.slice(0, 2).map((example, i) => (
                      <li key={i}>{example}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Page 11: Ideal Work & Learning Paths */}
      <section className="report-page">
        <h2 className="report-page-title">Ideal Work & Learning Paths</h2>

        {/* Career Match Chart */}
        {careerMatchChartUrl && (
          <div className="report-chart-container-full">
            <img src={careerMatchChartUrl} alt="Career Match Chart" className="report-chart" />
          </div>
        )}

        {/* Recommended Paths */}
        <div className="report-paths">
          {reportModel.recommendedPaths.map((path, index) => {
            const trait1Score = scores[reportModel.dominantTraits[0]] || 0;
            const trait2Score = scores[reportModel.dominantTraits[1]] || 0;
            const avgDominantScore = (trait1Score + trait2Score) / 2;
            const match = Math.min(95, Math.max(60, avgDominantScore - 10 + (index * 3)));
            const boxColor = match >= 80 ? "#3C8C76" : match >= 60 ? "#F3C567" : "#6B7280";

            return (
              <div
                key={index}
                className="report-path-box"
                style={{ borderColor: boxColor, backgroundColor: `${boxColor}20` }}
              >
                <div className="report-path-header">
                  <h3 className="report-section-title" style={{ color: boxColor }}>
                    {path.title}
                  </h3>
                  <span className="report-match-percentage">{Math.round(match)}% match</span>
                </div>
                <p className="report-path-reason">{path.reason}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Page 12: Relationships & Communication */}
      <section className="report-page">
        <h2 className="report-page-title">Relationships & Communication</h2>

        {/* Communication Style Chart */}
        {communicationChartUrl && (
          <div className="report-chart-container-small">
            <img src={communicationChartUrl} alt="Communication Style Chart" className="report-chart" />
          </div>
        )}

        {/* Relationship Description */}
        <div className="report-relationship-description">
          {relationshipDescription}
        </div>

        {/* Communication Tips */}
        <div className="report-communication-tips">
          <h3 className="report-section-title">Communication Tips</h3>
          <ul className="report-list">
            {communicationTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
            {/* Add tailored tips */}
            {scores["Empathy & Altruism"] >= 70 && (
              <li>Your high empathy allows you to understand others deeply - use this to build trust and connection</li>
            )}
            {scores["Harmony & Cooperation"] >= 70 && (
              <li>Your ability to maintain harmony makes you an excellent mediator in conflicts</li>
            )}
            {scores["Leadership & Confidence"] >= 70 && (
              <li>Your confidence in expressing opinions is valuable - balance it with active listening</li>
            )}
          </ul>
        </div>
      </section>

      {/* Page 13: 3-Week Personal Development Plan */}
      <section className="report-page">
        <h2 className="report-page-title">3-Week Personal Development Plan</h2>

        <div className="report-development-plan">
          {reportModel.dailyChallenges.map((challenge, index) => (
            <div key={index} className="report-challenge-box">
              <h3 className="report-challenge-title">
                Week {challenge.week}: {challenge.task}
              </h3>
              <div className="report-challenge-content">
                <div>
                  <span className="report-scenario-bold">Why:</span> <span>{challenge.explanation}</span>
                </div>
                <div>
                  <span className="report-scenario-bold-accent">Expected Outcome:</span> <span>{challenge.outcome}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Page 14: Resources & Next Steps */}
      <section className="report-page">
        <ReactMarkdown components={markdownComponents}>{resourcesContent}</ReactMarkdown>
      </section>

      {/* Page 15: Footer & Credits */}
      <section className="report-page">
        <ReactMarkdown components={markdownComponents}>{footerContent}</ReactMarkdown>
      </section>
    </div>
  );
};

export default ReportPage;

