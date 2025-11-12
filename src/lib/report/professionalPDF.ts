/**
 * Professional 15-Page PDF Generator - Refactored
 * 
 * Elegant, visually professional report with:
 * - Clean typography (no Markdown symbols)
 * - Styled info boxes with rounded corners
 * - Charts and visualizations
 * - Professional spacing and layout
 * - Logo integration
 */

import { calculateTraitScores } from "@/pages/TestPersonnalite";
import { buildReportModel, TRAITS, type ReportModel } from "./templates";
import {
  getTraitDescription,
  getTraitStrengths,
  getTraitGrowthAreas,
  getTraitWorkExamples,
  getTraitQuote,
  getTraitCareers,
  generateRelationshipDescription,
  generateCommunicationTips,
  calculatePercentile,
  getProfileType,
} from "./templateLoader";
import { generateRadarChart, generateBarChart, generateCommunicationStyleChart } from "./charts";
import type { AnswersState } from "@/pages/TestPersonnalite";

// Import templates
import coverTemplate from "./content-templates/cover.md?raw";
import executiveSummaryTemplate from "./content-templates/executive_summary.md?raw";
import strengthsGrowthTemplate from "./content-templates/strengths_and_growth.md?raw";
import pathsCareersTemplate from "./content-templates/paths_and_careers.md?raw";
import relationshipsTemplate from "./content-templates/relationships.md?raw";
import developmentPlanTemplate from "./content-templates/development_plan.md?raw";
import resourcesTemplate from "./content-templates/resources.md?raw";
import footerTemplate from "./content-templates/footer.md?raw";

// Brand colors
const BRAND_GREEN = "#3C8C76";
const BRAND_DARK = "#1E2A38";
const BRAND_GREY = "#6B7280";
const BRAND_BEIGE = "#FAF9F6";
const BRAND_LIGHT_GREY = "#F3F4F6";

// Box colors
const BOX_STRENGTHS_BG = "#E9F7EF"; // Light green
const BOX_STRENGTHS_BORDER = BRAND_GREEN;
const BOX_GROWTH_BG = "#FDEDEC"; // Light red
const BOX_GROWTH_BORDER = "#E57373";
const BOX_DEVELOPMENT_BG = "#FFF4E5"; // Light orange
const BOX_DEVELOPMENT_BORDER = "#F5B971";

/**
 * Remove Markdown syntax and return clean text
 */
function cleanMarkdown(text: string): string {
  return text
    .replace(/^#+\s+/gm, "") // Remove # headers
    .replace(/\*\*(.+?)\*\*/g, "$1") // Remove **bold**
    .replace(/\*(.+?)\*/g, "$1") // Remove *italic*
    .replace(/---+/g, "") // Remove horizontal rules
    .replace(/\[(.+?)\]\(.+?\)/g, "$1") // Remove links, keep text
    .replace(/`(.+?)`/g, "$1") // Remove code blocks
    .trim();
}

/**
 * Parse Markdown list to array of items
 */
function parseMarkdownList(text: string): string[] {
  return text
    .split("\n")
    .filter(line => line.trim().startsWith("-") || line.trim().startsWith("*"))
    .map(line => line.replace(/^[-*]\s+/, "").trim())
    .filter(item => item.length > 0);
}

/**
 * Replace placeholders in template
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
 * Convert RGB hex to RGB array for jsPDF
 */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

/**
 * Generate professional 15-page PDF
 */
export async function generateProfessionalPDF(
  answers: AnswersState,
  onProgress?: (progress: number, message: string) => void
): Promise<Blob> {
  const log = (msg: string, progress?: number) => {
    console.log(`[PDF] ${msg}`);
    if (onProgress && progress !== undefined) {
      onProgress(progress, msg);
    }
  };

  try {
    log("Chargement de jsPDF...", 5);
    const jsPDF = (await import("jspdf")).default;
    
    log("Calcul des scores...", 10);
    const scores = calculateTraitScores(answers);
    
    log("Construction du modèle de rapport...", 15);
    const reportModel = buildReportModel(scores);
    
    log("Génération des graphiques...", 18);
    let radarChartDataUrl: string = "";
    let barChartDataUrl: string = "";
    let communicationChartDataUrl: string = "";
    
    try {
      radarChartDataUrl = await generateRadarChart(scores);
      log("Graphique radar généré", 19);
    } catch (error) {
      console.warn("Erreur génération radar chart:", error);
    }
    
    try {
      barChartDataUrl = await generateBarChart(scores);
      log("Graphique barres généré", 20);
    } catch (error) {
      console.warn("Erreur génération bar chart:", error);
    }
    
    try {
      communicationChartDataUrl = await generateCommunicationStyleChart(
        scores["Empathy & Altruism"] || 0,
        scores["Harmony & Cooperation"] || 0,
        scores["Leadership & Confidence"] || 0
      );
      log("Graphique communication généré", 21);
    } catch (error) {
      console.warn("Erreur génération communication chart:", error);
    }
    
    log("Création du PDF...", 22);
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let y = margin;
    let currentPage = 1;
    const totalPages = 14; // Removed Resources page

    // Helper to add text with word wrap and page breaks
    const addText = (
      text: string,
      fontSize: number,
      isBold = false,
      color = BRAND_DARK,
      align: "left" | "center" | "right" = "left",
      lineHeightMultiplier = 1.4
    ) => {
      const cleanText = cleanMarkdown(text);
      doc.setFontSize(fontSize);
      doc.setTextColor(color);
      doc.setFont(undefined, isBold ? "bold" : "normal");
      
      const lines = doc.splitTextToSize(cleanText, contentWidth);
      const lineHeight = fontSize * lineHeightMultiplier * 0.4;
      
      // Check if we need a new page
      if (y + (lines.length * lineHeight) > pageHeight - margin - 15) {
        addPageNumber();
        doc.addPage();
        currentPage++;
        y = margin;
      }
      
      lines.forEach((line: string) => {
        doc.text(line, align === "center" ? pageWidth / 2 : margin, y, {
          align,
          maxWidth: contentWidth,
        });
        y += lineHeight;
      });
      
      y += 3;
    };

    // Helper to add page number
    const addPageNumber = () => {
      doc.setFontSize(9);
      doc.setTextColor(BRAND_GREY);
      doc.setFont(undefined, "normal");
      doc.text(
        `Page ${currentPage} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 10,
        { align: "right" }
      );
    };

    // Helper to add section title with underline
    const addSectionTitle = (title: string) => {
      if (y > margin + 30) {
        y += 15;
      }
      
      // Title
      doc.setFontSize(22);
      doc.setTextColor(BRAND_GREEN);
      doc.setFont(undefined, "bold");
      doc.text(title, pageWidth / 2, y, { align: "center" });
      y += 8;
      
      // Decorative underline (80px width, centered)
      const lineWidth = 30; // mm
      const lineX = (pageWidth - lineWidth) / 2;
      doc.setDrawColor(...hexToRgb(BRAND_GREEN));
      doc.setLineWidth(2);
      doc.line(lineX, y, lineX + lineWidth, y);
      y += 12;
    };

    // Helper to add styled info box
    const addStyledBox = (
      title: string,
      content: string[],
      bgColor: string,
      borderColor: string,
      titleColor = BRAND_DARK,
      minHeight?: number // Optional minimum height for boxes that need more space
    ) => {
      const boxPadding = 8;
      const boxMargin = 5;
      const titleHeight = 8;
      const itemHeight = 6;
      
      // Calculate content height
      let contentTextHeight = 0;
      content.forEach((item) => {
        const cleanItem = cleanMarkdown(item);
        const lines = doc.splitTextToSize(`• ${cleanItem}`, contentWidth - (boxPadding * 2) - 5);
        contentTextHeight += lines.length * itemHeight;
      });
      
      let contentHeight = titleHeight + contentTextHeight + (boxPadding * 2);
      
      // Apply minimum height if specified (for Week 2 box)
      if (minHeight && contentHeight < minHeight) {
        contentHeight = minHeight;
      }
      
      // Check if box fits on page
      if (y + contentHeight > pageHeight - margin - 15) {
        addPageNumber();
        doc.addPage();
        currentPage++;
        y = margin;
      }
      
      const boxY = y;
      
      // Box background
      const [r, g, b] = hexToRgb(bgColor);
      doc.setFillColor(r, g, b);
      doc.roundedRect(margin, boxY, contentWidth, contentHeight, 4, 4, "F");
      
      // Box border
      const [br, bg, bb] = hexToRgb(borderColor);
      doc.setDrawColor(br, bg, bb);
      doc.setLineWidth(1);
      doc.roundedRect(margin, boxY, contentWidth, contentHeight, 4, 4, "S");
      
      // Title
      y += boxPadding + 2;
      doc.setFontSize(13);
      doc.setTextColor(titleColor);
      doc.setFont(undefined, "bold");
      doc.text(title, margin + boxPadding, y);
      y += titleHeight;
      
      // Content items
      doc.setFontSize(10);
      doc.setTextColor(BRAND_DARK);
      doc.setFont(undefined, "normal");
      content.forEach((item) => {
        const cleanItem = cleanMarkdown(item);
        const lines = doc.splitTextToSize(`• ${cleanItem}`, contentWidth - (boxPadding * 2) - 5);
        lines.forEach((line: string) => {
          doc.text(line, margin + boxPadding + 3, y);
          y += itemHeight;
        });
      });
      
      y += boxPadding + boxMargin;
    };

    // Helper to add trait score box (enhanced)
    const addTraitScoreBox = (trait: string, score: number) => {
      const percentile = calculatePercentile(score);
      const scoreColor = score >= 70 ? BRAND_GREEN : score >= 40 ? "#F3C567" : "#E76E6E";
      const boxHeight = 28;
      
      if (y + boxHeight > pageHeight - margin - 15) {
        addPageNumber();
        doc.addPage();
        currentPage++;
        y = margin;
      }
      
      // Box background
      doc.setFillColor(250, 250, 250);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 4, 4, "F");
      
      // Left border accent
      const [r, g, b] = hexToRgb(scoreColor);
      doc.setFillColor(r, g, b);
      doc.rect(margin, y, 3, boxHeight, "F");
      
      // Trait name
      doc.setFontSize(13);
      doc.setTextColor(BRAND_DARK);
      doc.setFont(undefined, "bold");
      doc.text(trait, margin + 8, y + 10);
      
      // Score (large)
      doc.setFontSize(20);
      doc.setTextColor(scoreColor);
      doc.text(`${Math.round(score)}%`, pageWidth - margin - 5, y + 10, { align: "right" });
      
      // Percentile
      doc.setFontSize(9);
      doc.setTextColor(BRAND_GREY);
      doc.setFont(undefined, "normal");
      doc.text(`Above ${percentile}% of respondents`, margin + 8, y + 18);
      
      // Progress bar
      const barWidth = (score / 100) * (contentWidth - 16);
      doc.setFillColor(r, g, b);
      doc.roundedRect(margin + 8, y + 22, barWidth, 3, 1.5, 1.5, "F");
      
      y += boxHeight + 8;
    };

    // Helper to add image (logo)
    const addImage = async (imagePath: string, x: number, y: number, width: number, height: number) => {
      try {
        // Try to load image from public folder
        const img = new Image();
        img.crossOrigin = "anonymous";
        
        return new Promise<void>((resolve, reject) => {
          img.onload = () => {
            try {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL("image/png");
                doc.addImage(dataUrl, "PNG", x, y, width, height);
                resolve();
              } else {
                reject(new Error("Could not get canvas context"));
              }
            } catch (error) {
              reject(error);
            }
          };
          img.onerror = () => resolve(); // Silently fail if image doesn't load
          img.src = imagePath;
        });
      } catch (error) {
        console.warn("Could not add image:", error);
      }
    };

    // ============================================
    // PAGE 1: COVER
    // ============================================
    log("Page 1: Couverture...", 25);
    y = 50;
    
    // Logo (if available) - much higher on page
    try {
      await addImage("/lovable-uploads/d90e4f60-4ab5-48a0-9e2f-ba4658dc9b54.png", pageWidth / 2 - 15, 30, 30, 30);
      y = 100; // Start text much lower after logo - more space
    } catch (error) {
      // Logo not found, continue without it
      y = 50;
    }
    
    // Title
    doc.setFontSize(32);
    doc.setTextColor(BRAND_GREEN);
    doc.setFont(undefined, "bold");
    doc.text("Avenirea", pageWidth / 2, y, { align: "center" });
    y += 12;
    
    doc.setFontSize(24);
    doc.text("Personality Report", pageWidth / 2, y, { align: "center" });
    y += 25;
    
    // Subtitle
    doc.setFontSize(14);
    doc.setTextColor(BRAND_GREY);
    doc.setFont(undefined, "normal");
    doc.text("Comprehensive Analysis of Your Personality Profile", pageWidth / 2, y, { align: "center" });
    y += 20;
    
    // Date
    const date = new Date().toISOString().split("T")[0];
    doc.setFontSize(11);
    doc.text(`Generated: ${date}`, pageWidth / 2, y, { align: "center" });
    y += 30;
    
    // Description
    const coverText = cleanMarkdown(coverTemplate);
    addText(coverText, 11, false, BRAND_GREY, "center", 1.6);
    
    addPageNumber();
    doc.addPage();
    currentPage++;

    // ============================================
    // PAGE 2: EXECUTIVE SUMMARY
    // ============================================
    log("Page 2: Résumé exécutif...", 30);
    y = margin;
    addSectionTitle("Executive Summary");
    
    const execText = replacePlaceholders(executiveSummaryTemplate, {
      dominantTrait1: reportModel.dominantTraits[0] || "",
      dominantTrait2: reportModel.dominantTraits[1] || "",
    });
    
    addText(cleanMarkdown(execText), 11, false, BRAND_DARK, "left", 1.6);
    y += 10;

    // Charts if available
    if (radarChartDataUrl && barChartDataUrl) {
      const chartHeight = 50;
      const chartWidth = (contentWidth - 10) / 2;
      
      if (y + chartHeight < pageHeight - margin - 15) {
        try {
          doc.addImage(radarChartDataUrl, "PNG", margin, y, chartWidth, chartHeight);
          doc.addImage(barChartDataUrl, "PNG", margin + chartWidth + 10, y, chartWidth, chartHeight);
          y += chartHeight + 15;
        } catch (error) {
          console.warn("Could not add charts:", error);
        }
      }
    }
    
    // Trait scores overview
    addText("Trait Scores Overview", 16, true, BRAND_GREEN);
    const sortedTraits = TRAITS.map(t => ({ name: t, score: scores[t] || 0 }))
      .sort((a, b) => b.score - a.score);
    
    sortedTraits.forEach(({ name, score }) => {
      addTraitScoreBox(name, score);
    });
    
    addPageNumber();
    doc.addPage();
    currentPage++;

    // ============================================
    // PAGES 3-8: TRAIT DEEP DIVES
    // ============================================
    for (let i = 0; i < TRAITS.length; i++) {
      const trait = TRAITS[i];
      const score = scores[trait] || 0;
      const progress = 35 + Math.floor((i / TRAITS.length) * 30);
      log(`Page ${currentPage}: ${trait}...`, progress);
      
      y = margin;
      addSectionTitle(trait);
      
      // Score box
      addTraitScoreBox(trait, score);
      y += 5;
      
      // Quote
      const quote = getTraitQuote(trait, score);
      if (quote) {
        doc.setFontSize(12);
        doc.setTextColor(BRAND_GREEN);
        doc.setFont(undefined, "italic");
        const quoteLines = doc.splitTextToSize(`"${quote}"`, contentWidth - 20);
        quoteLines.forEach((line: string) => {
          doc.text(line, pageWidth / 2, y, { align: "center" });
          y += 7;
        });
        y += 15;
      }
      
      // Description - REMOVED: No description after quote as requested
      // Skip the description entirely - go directly to strengths
      
      // Strengths box
      const strengths = getTraitStrengths(trait, score);
      if (strengths.length > 0) {
        addStyledBox(
          "Key Strengths",
          strengths.slice(0, 4),
          BOX_STRENGTHS_BG,
          BOX_STRENGTHS_BORDER,
          BRAND_GREEN
        );
      }
      
      // Growth areas box (if score < 50)
      const growthAreas = getTraitGrowthAreas(trait, score);
      if (growthAreas.length > 0) {
        addStyledBox(
          "Areas for Growth",
          growthAreas.slice(0, 3),
          BOX_GROWTH_BG,
          BOX_GROWTH_BORDER,
          "#E57373"
        );
      }
      
      // Careers - with more space and detailed info
      const careers = getTraitCareers(trait, score);
      if (careers.length > 0) {
        y += 10; // Add 2 lines of space before Recommended Careers
        addText("Recommended Careers", 14, true, BRAND_GREEN);
        y += 3;
        
        careers.slice(0, 4).forEach(career => {
          // Career title
          addText(career, 11, true, BRAND_DARK);
          y += 1;
          
          // Career description based on trait and score
          let careerDesc = "";
          if (score >= 70) {
            careerDesc = `Your strong ${trait.toLowerCase()} makes you well-suited for this career path. You'll excel in roles that require these skills and can take on leadership positions.`;
          } else if (score >= 40) {
            careerDesc = `Your moderate ${trait.toLowerCase()} suggests potential in this field. With focused development, you can build the necessary skills for success.`;
          } else {
            careerDesc = `While this may not be your primary strength, exploring this field can help you develop complementary skills and broaden your career options.`;
          }
          
          addText(careerDesc, 9, false, BRAND_GREY, "left", 1.4);
          y += 5;
        });
        y += 5;
      }
      
      addPageNumber();
      if (i < TRAITS.length - 1) {
        doc.addPage();
        currentPage++;
      }
    }

    // ============================================
    // PAGE 9: STRENGTHS & GROWTH
    // ============================================
    log("Page 9: Forces et croissance...", 65);
    doc.addPage();
    currentPage++;
    y = margin;
    addSectionTitle("Strengths & Growth Areas");
    
    // Strengths box
    addStyledBox(
      "Top Strengths",
      reportModel.topStrengths,
      BOX_STRENGTHS_BG,
      BOX_STRENGTHS_BORDER,
      BRAND_GREEN
    );
    
    // Growth areas box
    addStyledBox(
      "Areas for Growth",
      reportModel.areasForGrowth,
      BOX_GROWTH_BG,
      BOX_GROWTH_BORDER,
      "#E57373"
    );
    
    addPageNumber();
    doc.addPage();
    currentPage++;

    // ============================================
    // PAGE 10: WORK EXAMPLES
    // ============================================
    log("Page 10: Exemples de travail...", 70);
    y = margin;
    addSectionTitle("Work & Study Examples");
    
    sortedTraits.slice(0, 3).forEach(({ name, score }) => {
      const workExamples = getTraitWorkExamples(name, score);
      
      addText(name, 14, true, BRAND_GREEN);
      y += 3;
      
      if (workExamples.strengths.length > 0) {
        addStyledBox(
          "Strengths in Work/Study",
          workExamples.strengths.slice(0, 3),
          BOX_STRENGTHS_BG,
          BOX_STRENGTHS_BORDER,
          BRAND_GREEN
        );
      }
      
      if (workExamples.caveats.length > 0) {
        addStyledBox(
          "Areas to Watch",
          workExamples.caveats.slice(0, 2),
          BOX_DEVELOPMENT_BG,
          BOX_DEVELOPMENT_BORDER,
          "#F5B971"
        );
      }
      
      y += 5;
    });
    
    addPageNumber();
    doc.addPage();
    currentPage++;

    // ============================================
    // PAGE 11: CAREER PATHS
    // ============================================
    log("Page 11: Chemins de carrière...", 75);
    y = margin;
    addSectionTitle("Recommended Career Paths");
    
    reportModel.recommendedPaths.forEach((path) => {
      addText(path.title, 14, true, BRAND_GREEN);
      y += 2;
      addText(path.reason, 10, false, BRAND_DARK, "left", 1.5);
      y += 3;
      
      // Add additional context based on path type
      let additionalText = "";
      if (path.title.includes("Quality Assurance") || path.title.includes("Process Management")) {
        additionalText = "This path offers stability and clear progression opportunities. You'll work in environments that value precision and systematic approaches, which aligns perfectly with your organizational strengths.";
      } else if (path.title.includes("Human Services") || path.title.includes("Counseling")) {
        additionalText = "This field allows you to make a meaningful impact on others' lives. Your natural empathy and care for people will be highly valued, and you'll find deep satisfaction in helping others grow and overcome challenges.";
      } else if (path.title.includes("Design") || path.title.includes("Creative")) {
        additionalText = "Creative industries thrive on innovation and fresh perspectives. Your ability to think outside the box will be your greatest asset, and you'll have opportunities to express your unique vision in various projects.";
      } else if (path.title.includes("Research") || path.title.includes("Analysis")) {
        additionalText = "This path rewards deep thinking and analytical skills. You'll work on complex problems that require careful research and systematic approaches, allowing you to contribute meaningful insights to your field.";
      } else if (path.title.includes("Management") || path.title.includes("Entrepreneurship")) {
        additionalText = "Leadership roles offer opportunities to drive change and inspire others. Your confidence and ability to make decisions will help you excel in positions where you can set direction and build successful teams.";
      } else if (path.title.includes("Mediation") || path.title.includes("Team Coordination")) {
        additionalText = "These roles require excellent interpersonal skills and the ability to find common ground. Your diplomatic approach and focus on harmony will make you effective at resolving conflicts and fostering collaboration.";
      } else {
        additionalText = "This career path offers opportunities to leverage your unique combination of strengths. With dedication and continued development, you can build a successful and fulfilling career in this field.";
      }
      
      addText(additionalText, 9, false, BRAND_GREY, "left", 1.4);
      y += 8;
    });
    
    addPageNumber();
    doc.addPage();
    currentPage++;

    // ============================================
    // PAGE 12: RELATIONSHIPS
    // ============================================
    log("Page 12: Relations...", 80);
    y = margin;
    addSectionTitle("Relationships & Communication");
    
    const relDesc = generateRelationshipDescription(
      scores["Empathy & Altruism"] || 0,
      scores["Harmony & Cooperation"] || 0,
      scores["Leadership & Confidence"] || 0
    );
    
    addText(relDesc, 11, false, BRAND_DARK, "left", 1.6);
    y += 8;
    
    // Additional generic content about relationships
    addText(
      "Understanding your communication style is essential for building strong relationships both personally and professionally. " +
      "Research shows that effective communication is one of the top predictors of relationship satisfaction and career success. " +
      "By being aware of your natural tendencies, you can adapt your approach to different situations and connect more meaningfully with others.",
      10,
      false,
      BRAND_DARK,
      "left",
      1.5
    );
    y += 8;
    
    // Communication style chart if available
    if (communicationChartDataUrl) {
      const chartHeight = 60;
      const chartWidth = 60;
      const chartX = (pageWidth - chartWidth) / 2; // Center the chart
      
      if (y + chartHeight < pageHeight - margin - 15) {
        try {
          doc.addImage(communicationChartDataUrl, "PNG", chartX, y, chartWidth, chartHeight);
          y += chartHeight + 10;
          
          // Chart caption
          doc.setFontSize(9);
          doc.setTextColor(BRAND_GREY);
          doc.setFont(undefined, "italic");
          doc.text(
            "Your communication style is positioned based on empathy and assertiveness levels",
            pageWidth / 2,
            y,
            { align: "center" }
          );
          y += 8;
        } catch (error) {
          console.warn("Could not add communication chart:", error);
        }
      }
    }
    
    // Communication tips box
    const commTips = generateCommunicationTips();
    // Add more tips
    const additionalTips = [
      "Pay attention to non-verbal cues - body language often speaks louder than words",
      "Practice empathy by putting yourself in others' shoes before responding",
      "Use 'I' statements to express your feelings without blaming others",
      "Ask open-ended questions to encourage deeper conversations",
      "Give your full attention when others are speaking - avoid distractions"
    ];
    const allCommTips = [...commTips, ...additionalTips].slice(0, 8);
    
    addStyledBox(
      "Communication Tips",
      allCommTips,
      BOX_STRENGTHS_BG,
      BOX_STRENGTHS_BORDER,
      BRAND_GREEN
    );
    
    addPageNumber();
    doc.addPage();
    currentPage++;

    // ============================================
    // PAGE 13: DEVELOPMENT PLAN (now page 13, was 13)
    // ============================================
    log("Page 13: Plan de développement...", 85);
    y = margin;
    addSectionTitle("3-Week Development Plan");
    
    reportModel.dailyChallenges.forEach((challenge, index) => {
      // Check if we need a new page before adding the box
      const estimatedBoxHeight = challenge.week === 2 ? 50 : 35;
      if (y + estimatedBoxHeight > pageHeight - margin - 15) {
        addPageNumber();
        doc.addPage();
        currentPage++;
        y = margin;
      }
      
      // Week 2 needs a larger box
      const minHeight = challenge.week === 2 ? 50 : 35;
      
      // Store current Y before box
      const boxStartY = y;
      
      addStyledBox(
        `Week ${challenge.week}: ${challenge.task}`,
        [
          `Why: ${challenge.explanation}`,
          `Expected Outcome: ${challenge.outcome}`,
        ],
        BOX_DEVELOPMENT_BG,
        BOX_DEVELOPMENT_BORDER,
        "#F5B971",
        minHeight
      );
      
      // Add extra spacing between boxes
      y += 5;
    });
    
    addPageNumber();
    doc.addPage();
    currentPage++;

    // ============================================
    // PAGE 14: FOOTER (Resources page removed)
    // ============================================
    log("Page 14: Footer...", 95);
    y = margin;
    addSectionTitle("About This Report");
    
    // Center the footer text
    const footerText = cleanMarkdown(footerTemplate);
    const footerLines = doc.splitTextToSize(footerText, contentWidth);
    const lineHeight = 11 * 1.6 * 0.4;
    const totalTextHeight = footerLines.length * lineHeight;
    const startY = (pageHeight - totalTextHeight) / 2; // Center vertically
    
    doc.setFontSize(11);
    doc.setTextColor(BRAND_DARK);
    doc.setFont(undefined, "normal");
    footerLines.forEach((line: string) => {
      doc.text(line, pageWidth / 2, startY + (footerLines.indexOf(line) * lineHeight), { align: "center" });
    });
    
    addPageNumber();

    // Add page numbers to all pages
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(BRAND_GREY);
      doc.setFont(undefined, "normal");
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 10,
        { align: "right" }
      );
    }

    log("PDF généré avec succès!", 100);
    
    return doc.output("blob");
  } catch (error) {
    console.error("[PDF] Error:", error);
    throw new Error(`Erreur lors de la génération du PDF: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
  }
}
