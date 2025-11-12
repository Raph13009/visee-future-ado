import { buildReportModel, getTraitDescriptionForPDF, type ReportModel } from "./templates";
import { 
  generateRadarChart, 
  generateBarChart,
  generateGaugeChart,
  generateTraitComparisonChart,
  generateStrengthsGrowthChart,
  generateCommunicationStyleChart,
  generateCareerMatchChart,
} from "./charts";
import { TRAITS } from "./templates";
import type { AnswersState } from "@/pages/TestPersonnalite";
import { calculateTraitScores } from "@/pages/TestPersonnalite";
import {
  generateRelationshipDescription,
  generateCommunicationTips,
  getCoverPageText,
  getTraitQuote,
  getTraitCareers,
  getTraitActions,
  calculatePercentile,
  getProfileType,
  generateComparisonInsight,
  calculateCareerMatch,
} from "./templateLoader";
import coverTemplate from "./content-templates/cover.md?raw";
import executiveSummaryTemplate from "./content-templates/executive_summary.md?raw";

/**
 * @deprecated This file uses the old jsPDF-based PDF generation system.
 * 
 * The new system uses Puppeteer with HTML/CSS rendering for better layout and quality.
 * See README_NEW.md for documentation on the new system.
 * 
 * This file is kept for reference but is no longer used by the frontend.
 * To generate PDFs, use the new system:
 * - Frontend: Use generatePDFViaAPI from pdfClient.ts
 * - Server: Use the PDF server at server/pdf-server.js
 */

// Import jsPDF dynamically to avoid Vite optimization issues
// Type will be resolved when jsPDF is imported
type JsPDFDoc = any; // Will be properly typed when jsPDF is imported

// Brand colors
const BRAND_BEIGE = "#f7f4ef";
const BRAND_GREEN = "#117B4D";
const BRAND_DARK = "#374151";
const BRAND_LIGHT_GRAY = "#E5E7EB";

// ============================================================================
// LAYOUT CONSTANTS - Compact Professional Spacing System
// ============================================================================

// Page margins and padding (40px = ~10.6mm, but we use mm directly)
const PAGE_PADDING_TOP = 40; // mm - consistent top margin
const PAGE_PADDING_BOTTOM = 40; // mm - consistent bottom margin
const PAGE_PADDING_LEFT = 15; // mm - left margin (reduced from 50 for more content width)
const PAGE_PADDING_RIGHT = 15; // mm - right margin
const PAGE_NUMBER_BOTTOM_MARGIN = 10; // mm from bottom

// Section container settings
const SECTION_MARGIN_TOP = 15; // mm - space above each section
const SECTION_MARGIN_BOTTOM = 15; // mm - space below each section
const SECTION_PADDING = 10; // mm - inner padding for sections (8-12px range)
const SECTION_WIDTH_PERCENT = 87.5; // % of page width (85-90% range, centered)
const MAJOR_SECTION_SPACING = 25; // mm - between major sections (25-30px range)

// Vertical spacing between elements (aliases for compatibility)
const SECTION_SPACING = MAJOR_SECTION_SPACING; // mm - between major sections
const SUBSECTION_SPACING = 12; // mm - between subsections (compact)
const ELEMENT_SPACING = 8; // mm - between related elements (compact)

// Vertical spacing between elements
const TITLE_PARAGRAPH_SPACING = 7; // mm - between section title and first paragraph (6-8px)
const PARAGRAPH_SPACING = 6; // mm - between paragraphs (5-8px)
const PARAGRAPH_CHART_SPACING = 12; // mm - between paragraph and chart (10-15px)
const BOX_SPACING = 17; // mm - between boxes (15-20px)
const CHART_MARGIN_BOTTOM = 17; // mm - below chart (15-20px)

// Typography (compact sizes)
const FONT_SIZE_H1 = 17; // pt - Title (16-18pt range)
const FONT_SIZE_H2 = 13.5; // pt - Subtitle (13-14pt range)
const FONT_SIZE_H3 = 12; // pt - Section titles
const FONT_SIZE_BODY = 10.75; // pt - Paragraph (10.5-11pt range)
const FONT_SIZE_SMALL = 10; // pt - Small text
const FONT_SIZE_TINY = 9; // pt - Page numbers, notes

// Heading margins (compact)
const H1_MARGIN_TOP = 0; // mm - controlled by section spacing
const H1_MARGIN_BOTTOM = 6; // mm - space after H1 (6-8px)
const H2_MARGIN_TOP = 0; // mm
const H2_MARGIN_BOTTOM = 5; // mm - space after H2 (5px)

// Paragraph spacing
const PARAGRAPH_MARGIN_TOP = 0; // mm - controlled by spacing constants
const PARAGRAPH_MARGIN_BOTTOM = 0; // mm - controlled by spacing constants
const PARAGRAPH_LINE_HEIGHT = 1.4; // Slightly tighter for compact layout

// List spacing
const LIST_MARGIN_TOP = 0; // mm
const LIST_MARGIN_BOTTOM = 0; // mm
const LIST_ITEM_SPACING = 4; // mm - between list items (compact)
const LIST_INDENT = 6; // mm - for bullet points (slightly indented)

// Chart spacing (block-level, centered)
const CHART_MARGIN_TOP = 0; // mm - controlled by PARAGRAPH_CHART_SPACING
const CHART_WIDTH_PERCENT = 80; // % of page width (max 80%)
const CHART_TITLE_MARGIN_BOTTOM = 8; // mm - between title and chart

// Quote box styling (compact)
const QUOTE_BOX_PADDING = 10; // mm - internal padding (10-12px range)
const QUOTE_BOX_MARGIN_TOP = 15; // mm - above box (15px)
const QUOTE_BOX_MARGIN_BOTTOM = 15; // mm - below box (15px)
const QUOTE_BOX_BORDER_WIDTH = 0.5; // mm
const QUOTE_BOX_BORDER_COLOR = "#E5E5E5";
const QUOTE_FONT_SIZE = 10; // pt - italic, light gray

// Table styling (compact)
const TABLE_MARGIN_TOP = 0; // mm - controlled by spacing
const TABLE_MARGIN_BOTTOM = 0; // mm
const TABLE_CELL_PADDING = 6; // mm - inside cells (6px)
const TABLE_ROW_HEIGHT = 5; // mm per row (compact)

// Colored box styling (compact)
const BOX_PADDING = 11; // mm - internal padding (10-12px)
const BOX_TITLE_MARGIN_TOP = 8; // mm - top margin for box title (8px)
const BOX_TITLE_MARGIN_BOTTOM = 5; // mm - bottom margin for box title (5px)
const BOX_MARGIN_TOP = 0; // mm - controlled by BOX_SPACING
const BOX_MARGIN_BOTTOM = 0; // mm - controlled by BOX_SPACING
const BOX_BORDER_WIDTH = 0.3; // mm
const BOX_SPACING_VERTICAL = 15; // mm - between boxes (10-15px)

// Text colors
const COLOR_TEXT_PRIMARY = "#000000"; // Black for titles
const COLOR_TEXT_SECONDARY = "#333333"; // Dark gray for subtitles
const COLOR_TEXT_BODY = "#222222"; // Dark grey for body
const COLOR_TEXT_MUTED = "#666666"; // Medium grey for quotes, notes

// Helper: Convert pt to mm (1pt = 0.352778mm)
const ptToMm = (pt: number) => pt * 0.352778;

/**
 * @deprecated Use generatePDFViaAPI from pdfClient.ts instead.
 * 
 * Generate a 15-page PDF report from answers
 * @param answers - User answers from the questionnaire
 * @param onProgress - Optional callback to report progress (0-100)
 */
export async function generateReportPDF(
  answers: AnswersState,
  onProgress?: (progress: number, message: string) => void
): Promise<Blob> {
  console.warn(
    "[DEPRECATED] generateReportPDF is deprecated. Use generatePDFViaAPI from pdfClient.ts instead."
  );
  const log = (message: string, progress?: number) => {
    console.log(`[PDF Generation] ${message}`);
    if (onProgress && progress !== undefined) {
      onProgress(progress, message);
    }
  };

  try {
    log("Starting PDF generation...", 0);

    // Step 1: Import jsPDF
    log("Loading jsPDF library...", 5);
    let jsPDF;
    try {
      const jsPDFModule = await import("jspdf");
      jsPDF = jsPDFModule.default;
      log("jsPDF loaded successfully", 10);
    } catch (error) {
      console.error("[PDF Generation] Error loading jsPDF:", error);
      throw new Error("Failed to load PDF library. Please refresh the page and try again.");
    }

    // Step 2: Calculate trait scores
    log("Calculating trait scores...", 15);
    let scores: Record<string, number>;
    try {
      scores = calculateTraitScores(answers);
      log(`Trait scores calculated: ${JSON.stringify(scores)}`, 20);
    } catch (error) {
      console.error("[PDF Generation] Error calculating scores:", error);
      throw new Error("Failed to calculate personality scores. Please check your answers.");
    }

    // Step 3: Build report model
    log("Building report model...", 25);
    let reportModel: ReportModel;
    try {
      reportModel = buildReportModel(scores);
      log("Report model built successfully", 30);
    } catch (error) {
      console.error("[PDF Generation] Error building report model:", error);
      throw new Error("Failed to build report content.");
    }

    // Step 4: Generate charts
    log("Generating charts...", 35);
    let radarChartDataUrl: string;
    let barChartDataUrl: string;
    
    try {
      log("Generating radar chart...", 40);
      radarChartDataUrl = await generateRadarChart(scores);
      log("Radar chart generated successfully", 45);
    } catch (error) {
      console.error("[PDF Generation] Error generating radar chart:", error);
      log("Using placeholder for radar chart", 45);
      // Create a placeholder if chart generation fails
      radarChartDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
    }
    
    try {
      log("Generating bar chart...", 50);
      barChartDataUrl = await generateBarChart(scores);
      log("Bar chart generated successfully", 55);
    } catch (error) {
      console.error("[PDF Generation] Error generating bar chart:", error);
      log("Using placeholder for bar chart", 55);
      // Create a placeholder if chart generation fails
      barChartDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
    }

    // Step 5: Create PDF document
    log("Creating PDF document...", 60);
    let doc: JsPDFDoc;
    try {
      doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      log("PDF document created", 65);
    } catch (error) {
      console.error("[PDF Generation] Error creating PDF:", error);
      throw new Error("Failed to create PDF document.");
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Use consistent padding system
    const margin = PAGE_PADDING_LEFT; // Left/right margin
    const topMargin = PAGE_PADDING_TOP;
    const bottomMargin = PAGE_PADDING_BOTTOM;
    
    // Calculate content area (centered, 87.5% width)
    const contentWidth = (pageWidth * SECTION_WIDTH_PERCENT) / 100;
    const contentStartX = (pageWidth - contentWidth) / 2; // Center the content
    
    // Calculate total number of pages for pagination
    const totalPages = 15; // Cover + Executive Summary + 6 Traits + Strengths + Work + Paths + Relationships + Development + Resources + Footer
    
    // Helper function to add page numbers to all pages
    const addPageNumbers = () => {
      const pageCount = doc.internal.pages.length - 1; // jsPDF uses 1-based indexing
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(FONT_SIZE_TINY);
        doc.setTextColor(156, 163, 175); // Light grey
        doc.setFont("helvetica", "normal");
        const pageText = `Page ${i} of ${totalPages}`;
        doc.text(pageText, pageWidth - PAGE_PADDING_RIGHT, pageHeight - PAGE_NUMBER_BOTTOM_MARGIN, { align: "right" });
      }
    };
    
    // Helper function to calculate section width and X position (centered)
    const getSectionDimensions = () => ({
      width: contentWidth,
      x: contentStartX,
      maxY: pageHeight - bottomMargin - PAGE_NUMBER_BOTTOM_MARGIN - 5
    });

    // Step 6: Generate pages
    log("Generating PDF pages...", 70);
    try {
      // Page 1: Cover
      log("Adding cover page...", 72);
      drawCoverPage(doc, pageWidth, pageHeight, contentStartX, contentWidth, topMargin, bottomMargin, coverTemplate);
      
      // Page 2: Executive Summary with Charts - NEW PAGE
      doc.addPage();
      log("Adding executive summary...", 74);
      drawExecutiveSummary(doc, pageWidth, pageHeight, contentStartX, contentWidth, topMargin, bottomMargin, reportModel, radarChartDataUrl, barChartDataUrl, executiveSummaryTemplate);
      
      // Pages 3-8: Trait deep dives - EACH ON NEW PAGE
      log("Adding trait pages...", 76);
      for (let index = 0; index < TRAITS.length; index++) {
        doc.addPage(); // Each trait gets its own page
        const trait = TRAITS[index];
        const progress = 76 + Math.floor((index / TRAITS.length) * 10);
        log(`Adding trait page: ${trait}...`, progress);
        
        // Generate charts for this trait
        let gaugeChartUrl: string = "";
        let comparisonChartUrl: string = "";
        try {
          gaugeChartUrl = await generateGaugeChart(scores[trait] || 0, trait);
          comparisonChartUrl = await generateTraitComparisonChart(trait, scores[trait] || 0, scores);
        } catch (error) {
          console.warn(`Failed to generate charts for trait ${trait}:`, error);
        }
        
        drawTraitPage(
          doc, 
          pageWidth, 
          pageHeight, 
          contentStartX,
          contentWidth,
          topMargin,
          bottomMargin,
          trait, 
          scores[trait] || 0, 
          index + 3,
          scores,
          gaugeChartUrl,
          comparisonChartUrl
        );
      }
      
      // Page 9: Strengths & Growth Areas - NEW PAGE
      log("Adding strengths and growth page...", 86);
      doc.addPage();
      let strengthsGrowthChartUrl: string = "";
      try {
        strengthsGrowthChartUrl = await generateStrengthsGrowthChart(
          reportModel.topStrengths,
          reportModel.areasForGrowth,
          scores
        );
      } catch (error) {
        console.warn("Failed to generate strengths vs growth chart:", error);
      }
      drawStrengthsAndGrowthPage(doc, pageWidth, pageHeight, contentStartX, contentWidth, topMargin, bottomMargin, reportModel, strengthsGrowthChartUrl);
      
      // Page 10: Work Examples - NEW PAGE
      log("Adding work examples page...", 88);
      doc.addPage();
      drawWorkExamplesPage(doc, pageWidth, pageHeight, contentStartX, contentWidth, topMargin, bottomMargin, reportModel, scores);
      
      // Page 11: Ideal Work & Learning Paths - NEW PAGE
      log("Adding recommended paths page...", 90);
      doc.addPage();
      // Generate career matches for chart
      const careerMatches = reportModel.recommendedPaths.map((path, index) => {
        // Calculate match based on dominant traits and path relevance
        // Higher match for paths that align with top traits
        const trait1Score = scores[reportModel.dominantTraits[0]] || 0;
        const trait2Score = scores[reportModel.dominantTraits[1]] || 0;
        const avgDominantScore = (trait1Score + trait2Score) / 2;
        // Base match from dominant traits, with variation
        const baseMatch = Math.min(95, Math.max(60, avgDominantScore - 10 + (index * 3)));
        return {
          career: path.title,
          match: Math.round(baseMatch),
          traits: { [reportModel.dominantTraits[0]]: trait1Score, [reportModel.dominantTraits[1]]: trait2Score }
        };
      });
      let careerMatchChartUrl: string = "";
      try {
        careerMatchChartUrl = await generateCareerMatchChart(careerMatches);
      } catch (error) {
        console.warn("Failed to generate career match chart:", error);
      }
      drawRecommendedPathsPage(doc, pageWidth, pageHeight, contentStartX, contentWidth, topMargin, bottomMargin, reportModel, careerMatchChartUrl, careerMatches);
      
      // Page 12: Relationships & Communication - NEW PAGE
      log("Adding relationships page...", 92);
      doc.addPage();
      let communicationChartUrl: string = "";
      try {
        communicationChartUrl = await generateCommunicationStyleChart(
          scores["Empathy & Altruism"] || 0,
          scores["Harmony & Cooperation"] || 0,
          scores["Leadership & Confidence"] || 0
        );
      } catch (error) {
        console.warn("Failed to generate communication style chart:", error);
      }
      drawRelationshipsPage(doc, pageWidth, pageHeight, contentStartX, contentWidth, topMargin, bottomMargin, reportModel, scores, communicationChartUrl);
      
      // Page 13: 3-week Personal Development Plan - NEW PAGE
      log("Adding development plan page...", 94);
      doc.addPage();
      drawDevelopmentPlanPage(doc, pageWidth, pageHeight, contentStartX, contentWidth, topMargin, bottomMargin, reportModel);
      
      // Page 14: Resources & Next Steps - NEW PAGE
      log("Adding resources page...", 96);
      doc.addPage();
      drawResourcesPage(doc, pageWidth, pageHeight, contentStartX, contentWidth, topMargin, bottomMargin);
      
      // Page 15: Footer & Credits - NEW PAGE
      log("Adding footer page with charts...", 98);
      doc.addPage();
      drawFooterPage(doc, pageWidth, pageHeight, contentStartX, contentWidth, topMargin, bottomMargin, radarChartDataUrl, barChartDataUrl);
      
      log("All pages generated successfully", 99);
      
      // Add page numbers to all pages
      log("Adding page numbers...", 99);
      addPageNumbers();
    } catch (error) {
      console.error("[PDF Generation] Error generating pages:", error);
      throw new Error("Failed to generate PDF pages. Please try again.");
    }

    // Step 7: Export PDF as Blob
    log("Exporting PDF...", 100);
    let pdfBlob: Blob;
    try {
      pdfBlob = doc.output("blob");
      const sizeInMB = (pdfBlob.size / (1024 * 1024)).toFixed(2);
      log(`PDF exported successfully (${sizeInMB} MB)`, 100);
    } catch (error) {
      console.error("[PDF Generation] Error exporting PDF:", error);
      throw new Error("Failed to export PDF. Please try again.");
    }

    return pdfBlob;
  } catch (error) {
    console.error("[PDF Generation] Fatal error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while generating the PDF.");
  }
}

/**
 * Parse markdown cover template and render it
 */
function parseMarkdownCover(template: string, date: string): {
  title: string;
  subtitle: string;
  description: string;
  date: string;
  footer: string;
} {
  // Replace placeholders
  let content = template.replace(/\{\{date\}\}/g, date);
  
  // Extract title (first # line, remove ** markers)
  const titleMatch = content.match(/^#\s*\*\*(.*?)\*\*/m);
  const title = titleMatch ? titleMatch[1].trim() : "Avenirea Personality Report";
  
  // Extract subtitle (### line with italic)
  const subtitleMatch = content.match(/^###\s*\*(.*?)\*/m);
  const subtitle = subtitleMatch ? subtitleMatch[1].trim() : "Comprehensive Analysis of Your Personality Profile";
  
  // Extract description paragraphs (between second and third ---)
  const sections = content.split(/^---$/m);
  let description = "";
  
  // Description should be in the section after "Date:" line (section index 2, 0-indexed from 3rd section)
  if (sections.length >= 3) {
    // Get the section after date (usually index 2)
    const descSection = sections[2] || sections[1];
    description = descSection
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('**Date:') && !line.includes('Confidential'))
      .map(line => line.replace(/\*\*/g, '').trim())
      .filter(line => line)
      .join(' ');
  }
  
  // Extract footer (last section after last ---)
  let footer = "Confidential Document – For personal use only\n© Avenirea. All rights reserved.";
  if (sections.length >= 4) {
    const footerSection = sections[sections.length - 1];
    const footerLines = footerSection
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .map(line => line.replace(/\*\*/g, '').trim());
    if (footerLines.length > 0) {
      footer = footerLines.join('\n');
    }
  }
  
  return { title, subtitle, description, date, footer };
}

/**
 * Helper function to draw H1 heading with compact spacing
 */
function drawH1(
  doc: JsPDFDoc,
  text: string,
  x: number,
  y: number,
  color: string = COLOR_TEXT_PRIMARY
): number {
  doc.setFontSize(FONT_SIZE_H1);
  doc.setFont("helvetica", "bold");
  const rgb = hexToRgb(color);
  if (rgb) {
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
  } else {
    doc.setTextColor(0, 0, 0); // Black
  }
  doc.text(text, x, y);
  // Return Y position after heading
  const headingHeight = ptToMm(FONT_SIZE_H1);
  return y + headingHeight + H1_MARGIN_BOTTOM;
}

/**
 * Helper function to draw H2 heading with compact spacing
 */
function drawH2(
  doc: JsPDFDoc,
  text: string,
  x: number,
  y: number,
  color: string = COLOR_TEXT_SECONDARY
): number {
  doc.setFontSize(FONT_SIZE_H2);
  doc.setFont("helvetica", "bold");
  const rgb = hexToRgb(color);
  if (rgb) {
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
  } else {
    doc.setTextColor(51, 51, 51); // Dark gray
  }
  doc.text(text, x, y);
  const headingHeight = ptToMm(FONT_SIZE_H2);
  return y + headingHeight + H2_MARGIN_BOTTOM;
}

/**
 * Helper function to draw paragraph with compact spacing and line height
 */
function drawParagraph(
  doc: JsPDFDoc,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  align: "left" | "center" | "right" | "justify" = "justify"
): number {
  doc.setFontSize(FONT_SIZE_BODY);
  doc.setFont("helvetica", "normal");
  const rgb = hexToRgb(COLOR_TEXT_BODY);
  if (rgb) {
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
  }
  
  const lineHeight = ptToMm(FONT_SIZE_BODY * PARAGRAPH_LINE_HEIGHT);
  let currentY = y;
  
  if (align === "justify") {
    // Use justified text function
    currentY = drawJustifiedText(doc, text, x, currentY, maxWidth, FONT_SIZE_BODY, { align: "justify" });
  } else {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, currentY, { align });
    currentY += lines.length * lineHeight;
  }
  
  return currentY;
}

/**
 * Helper function to draw a list with compact spacing
 */
function drawList(
  doc: JsPDFDoc,
  items: string[],
  x: number,
  y: number,
  maxWidth: number
): number {
  doc.setFontSize(FONT_SIZE_BODY);
  doc.setFont("helvetica", "normal");
  const rgb = hexToRgb(COLOR_TEXT_BODY);
  if (rgb) {
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
  }
  
  let currentY = y;
  const lineHeight = ptToMm(FONT_SIZE_BODY * PARAGRAPH_LINE_HEIGHT);
  
  items.forEach((item, index) => {
    const lines = doc.splitTextToSize(`• ${item}`, maxWidth - LIST_INDENT);
    doc.text(lines, x + LIST_INDENT, currentY);
    currentY += lines.length * lineHeight;
    if (index < items.length - 1) {
      currentY += LIST_ITEM_SPACING;
    }
  });
  
  return currentY;
}

/**
 * Helper function to draw a quote box with compact styling
 */
function drawQuoteBox(
  doc: JsPDFDoc,
  text: string,
  x: number,
  y: number,
  width: number,
  backgroundColor: string,
  borderColor: string = QUOTE_BOX_BORDER_COLOR
): number {
  const textWidth = width - QUOTE_BOX_PADDING * 2;
  doc.setFontSize(QUOTE_FONT_SIZE);
  const lines = doc.splitTextToSize(`"${text}"`, textWidth);
  const lineHeight = ptToMm(QUOTE_FONT_SIZE * PARAGRAPH_LINE_HEIGHT);
  const boxHeight = QUOTE_BOX_PADDING * 2 + lines.length * lineHeight;
  
  // Draw background (lightened)
  const rgb = hexToRgb(backgroundColor);
  if (rgb) {
    const lightR = Math.min(255, rgb.r + (255 - rgb.r) * 0.95);
    const lightG = Math.min(255, rgb.g + (255 - rgb.g) * 0.95);
    const lightB = Math.min(255, rgb.b + (255 - rgb.b) * 0.95);
    doc.setFillColor(lightR, lightG, lightB);
    doc.rect(x, y, width, boxHeight, "F");
  }
  
  // Draw border
  const borderRgb = hexToRgb(borderColor);
  if (borderRgb) {
    doc.setDrawColor(borderRgb.r, borderRgb.g, borderRgb.b);
    doc.setLineWidth(QUOTE_BOX_BORDER_WIDTH);
    doc.rect(x, y, width, boxHeight, "S");
  }
  
  // Draw text (italic, light gray)
  doc.setFontSize(QUOTE_FONT_SIZE);
  doc.setFont("helvetica", "italic");
  const mutedRgb = hexToRgb(COLOR_TEXT_MUTED);
  if (mutedRgb) {
    doc.setTextColor(mutedRgb.r, mutedRgb.g, mutedRgb.b);
  }
  doc.text(lines, x + QUOTE_BOX_PADDING, y + QUOTE_BOX_PADDING + ptToMm(QUOTE_FONT_SIZE) / 2);
  
  return y + boxHeight;
}

/**
 * Helper function to justify text by adjusting word spacing
 * Note: jsPDF doesn't support true justification natively, so we manually justify
 */
function drawJustifiedText(
  doc: JsPDFDoc,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  options: { align?: "left" | "center" | "right" | "justify" } = {}
): number {
  const align = options.align || "left";
  
  if (align === "justify") {
    // Split text into lines that fit the width using jsPDF's splitTextToSize
    const lines = doc.splitTextToSize(text, maxWidth);
    let currentY = y;
    const lineHeight = ptToMm(fontSize * PARAGRAPH_LINE_HEIGHT); // Use consistent line height
    
    lines.forEach((line: string, index: number) => {
      const isLastLine = index === lines.length - 1;
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        currentY += lineHeight * 0.3; // Small space for empty lines
        return;
      }
      
      const words = trimmedLine.split(/\s+/).filter(w => w.length > 0);
      
      if (!isLastLine && words.length > 1) {
        // Justify all lines except the last one
        const wordWidths = words.map(word => doc.getTextWidth(word));
        const totalWordsWidth = wordWidths.reduce((sum, width) => sum + width, 0);
        const spaceCount = words.length - 1;
        
        if (spaceCount > 0) {
          const baseSpaceWidth = doc.getTextWidth(' ');
          const totalBaseSpacesWidth = spaceCount * baseSpaceWidth;
          const currentLineWidth = totalWordsWidth + totalBaseSpacesWidth;
          const extraSpaceNeeded = Math.max(0, maxWidth - currentLineWidth);
          const extraSpacePerGap = extraSpaceNeeded / spaceCount;
          
          // Draw words with adjusted spacing
          let currentX = x;
          words.forEach((word, wordIndex) => {
            doc.text(word, currentX, currentY);
            if (wordIndex < words.length - 1) {
              const wordWidth = wordWidths[wordIndex];
              currentX += wordWidth + baseSpaceWidth + extraSpacePerGap;
            }
          });
        } else {
          // Single word - left align
          doc.text(trimmedLine, x, currentY, { align: "left" });
        }
      } else {
        // Last line or single word - left align
        doc.text(trimmedLine, x, currentY, { align: "left" });
      }
      currentY += lineHeight;
    });
    
    return currentY;
  } else {
    // Use standard alignment
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y, { align });
    return y + lines.length * ptToMm(fontSize * PARAGRAPH_LINE_HEIGHT);
  }
}

/**
 * Helper function to draw a block-level chart (centered, fixed width)
 */
function drawBlockChart(
  doc: JsPDFDoc,
  chartUrl: string,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number,
  title?: string
): number {
  if (!chartUrl) return y;
  
  let currentY = y;
  
  // Draw chart title if provided
  if (title) {
    doc.setFontSize(FONT_SIZE_H3);
    doc.setFont("helvetica", "bold");
    const textRgb = hexToRgb(COLOR_TEXT_PRIMARY);
    if (textRgb) {
      doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
    }
    doc.text(title, x + maxWidth / 2, currentY, { align: "center" });
    currentY += ptToMm(FONT_SIZE_H3) + CHART_TITLE_MARGIN_BOTTOM;
  }
  
  // Calculate chart dimensions (80% of max width, maintain aspect ratio)
  const chartWidth = Math.min(maxWidth * (CHART_WIDTH_PERCENT / 100), maxWidth);
  const chartHeight = Math.min(maxHeight, chartWidth * 0.75); // Maintain aspect ratio
  const chartX = x + (maxWidth - chartWidth) / 2; // Center the chart
  
  try {
    doc.addImage(chartUrl, "PNG", chartX, currentY, chartWidth, chartHeight);
    currentY += chartHeight + CHART_MARGIN_BOTTOM;
  } catch (error) {
    console.warn("Failed to add chart:", error);
  }
  
  return currentY;
}

function drawCoverPage(
  doc: JsPDFDoc,
  pageWidth: number,
  pageHeight: number,
  contentStartX: number,
  contentWidth: number,
  topMargin: number,
  bottomMargin: number,
  coverTemplate: string
) {
  // Background
  doc.setFillColor(247, 244, 239);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  
  // Parse markdown template
  const date = new Date().toISOString().split("T")[0];
  const coverData = parseMarkdownCover(coverTemplate, date);
  
  // Start from top margin
  let currentY = topMargin;
  const maxY = pageHeight - bottomMargin - PAGE_NUMBER_BOTTOM_MARGIN - 10;
  
  // Title - centered, H1 style (larger for cover)
  doc.setFontSize(FONT_SIZE_H1 + 4);
  doc.setFont("helvetica", "bold");
  const titleRgb = hexToRgb(COLOR_TEXT_PRIMARY);
  if (titleRgb) {
    doc.setTextColor(titleRgb.r, titleRgb.g, titleRgb.b);
  }
  doc.text(coverData.title, pageWidth / 2, currentY, { align: "center" });
  currentY += ptToMm(FONT_SIZE_H1 + 4) + MAJOR_SECTION_SPACING;
  
  // Subtitle - H2 style
  doc.setFontSize(FONT_SIZE_H2);
  doc.setFont("helvetica", "italic");
  doc.text(coverData.subtitle, pageWidth / 2, currentY, { align: "center" });
  currentY += ptToMm(FONT_SIZE_H2) + MAJOR_SECTION_SPACING;
  
  // Date line
  doc.setFontSize(FONT_SIZE_SMALL);
  doc.setFont("helvetica", "normal");
  const mutedRgb = hexToRgb(COLOR_TEXT_MUTED);
  if (mutedRgb) {
    doc.setTextColor(mutedRgb.r, mutedRgb.g, mutedRgb.b);
  }
  doc.text("Generated from your responses to the Avenirea Personality Assessment", pageWidth / 2, currentY, { align: "center" });
  currentY += ptToMm(FONT_SIZE_SMALL) + ELEMENT_SPACING;
  doc.text(`Date: ${coverData.date}`, pageWidth / 2, currentY, { align: "center" });
  currentY += ptToMm(FONT_SIZE_SMALL) + MAJOR_SECTION_SPACING;
  
  // Description paragraphs (justified) - centered content area
  const descriptionText = coverData.description.trim();
  if (descriptionText) {
    // Split by periods to get sentences, then group into paragraphs
    const sentences = descriptionText.split(/\.\s+/).filter(s => s.trim().length > 0);
    
    // Group into paragraphs (2-3 sentences each)
    let paragraphText = "";
    let sentenceCount = 0;
    
    for (let i = 0; i < sentences.length && currentY < maxY - 30; i++) {
      const sentence = sentences[i].trim();
      if (!sentence) continue;
      
      paragraphText += (paragraphText ? ". " : "") + sentence;
      sentenceCount++;
      
      // Create paragraph every 2-3 sentences
      if (sentenceCount >= 2 || i === sentences.length - 1) {
        const paragraph = paragraphText + (paragraphText.endsWith(".") ? "" : ".");
        currentY = drawParagraph(doc, paragraph, contentStartX, currentY, contentWidth, "justify");
        currentY += PARAGRAPH_SPACING;
        paragraphText = "";
        sentenceCount = 0;
      }
    }
    
    // Draw any remaining text
    if (paragraphText && currentY < maxY - 20) {
      const paragraph = paragraphText + (paragraphText.endsWith(".") ? "" : ".");
      drawParagraph(doc, paragraph, contentStartX, currentY, contentWidth, "justify");
    }
  }
  
  // Footer - at bottom with proper margin
  doc.setFontSize(FONT_SIZE_TINY);
  const footerRgb = hexToRgb(COLOR_TEXT_MUTED);
  if (footerRgb) {
    doc.setTextColor(footerRgb.r, footerRgb.g, footerRgb.b);
  }
  const footerLines = coverData.footer.split('\n').filter(line => line.trim());
  const footerStartY = pageHeight - bottomMargin - (footerLines.length * ptToMm(FONT_SIZE_TINY + 2)) - 5;
  footerLines.forEach((line: string, index: number) => {
    doc.text(line.trim(), pageWidth / 2, footerStartY + (index * ptToMm(FONT_SIZE_TINY + 2)), { align: "center" });
  });
}

/**
 * Parse markdown executive summary template
 */
function parseExecutiveSummaryTemplate(template: string, dominantTrait1: string, dominantTrait2: string): {
  title: string;
  subtitle: string;
  paragraphs: string[];
  bulletPoints: string[];
  note: string;
} {
  // Replace placeholders
  let content = template
    .replace(/\{\{dominantTrait1\}\}/g, dominantTrait1)
    .replace(/\{\{dominantTrait2\}\}/g, dominantTrait2);
  
  const lines = content.split('\n');
  const result = {
    title: "",
    subtitle: "",
    paragraphs: [] as string[],
    bulletPoints: [] as string[],
    note: "",
  };
  
  let inBullets = false;
  let inNote = false;
  let currentParagraph = "";
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed.startsWith('# **')) {
      result.title = trimmed.replace(/^# \*\*|\*\*$/g, '');
    } else if (trimmed.startsWith('## ')) {
      result.subtitle = trimmed.replace(/^## /, '');
    } else if (trimmed.startsWith('- ')) {
      inBullets = true;
      inNote = false;
      if (currentParagraph) {
        result.paragraphs.push(currentParagraph.trim());
        currentParagraph = "";
      }
      result.bulletPoints.push(trimmed.replace(/^- /, '').replace(/\*\*/g, ''));
    } else if (trimmed.startsWith('**Interpretation Note:**') || trimmed.startsWith('Interpretation Note:')) {
      inNote = true;
      inBullets = false;
      if (currentParagraph) {
        result.paragraphs.push(currentParagraph.trim());
        currentParagraph = "";
      }
      // Start note with text after "Interpretation Note:"
      const noteText = trimmed.replace(/\*\*Interpretation Note:\*\*/g, '').replace(/Interpretation Note:/g, '').trim();
      if (noteText) {
        result.note = noteText.replace(/\*\*/g, '');
      }
    } else if (trimmed && !trimmed.startsWith('---')) {
      if (inNote) {
        result.note += (result.note ? ' ' : '') + trimmed.replace(/\*\*/g, '');
      } else if (!inBullets) {
        // Add to current paragraph
        if (currentParagraph && !currentParagraph.endsWith(' ')) {
          currentParagraph += ' ';
        }
        currentParagraph += trimmed.replace(/\*\*/g, '');
      }
    } else if (!trimmed) {
      // Empty line - end current paragraph if exists
      if (currentParagraph && !inBullets && !inNote) {
        result.paragraphs.push(currentParagraph.trim());
        currentParagraph = "";
      }
    }
  }
  
  // Add last paragraph if exists
  if (currentParagraph && !inBullets && !inNote) {
    result.paragraphs.push(currentParagraph.trim());
  }
  
  // Clean up note
  if (result.note) {
    result.note = result.note.trim();
  }
  
  return result;
}

function drawExecutiveSummary(
  doc: JsPDFDoc,
  pageWidth: number,
  pageHeight: number,
  contentStartX: number,
  contentWidth: number,
  topMargin: number,
  bottomMargin: number,
  reportModel: ReportModel,
  radarChartDataUrl: string,
  barChartDataUrl: string,
  executiveSummaryTemplate: string
) {
  // Reset at start of new page
  const textRgb = hexToRgb(COLOR_TEXT_PRIMARY);
  if (textRgb) {
    doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
  }
  doc.setFont("helvetica", "normal");
  
  // Parse template
  const templateData = parseExecutiveSummaryTemplate(
    executiveSummaryTemplate,
    reportModel.dominantTraits[0] || "Precision & Organization",
    reportModel.dominantTraits[1] || "Empathy & Altruism"
  );
  
  // Get profile type
  const profileType = getProfileType(reportModel.dominantTraits);
  
  // Start Y position - from top margin with section spacing
  let currentY = topMargin + SECTION_MARGIN_TOP;
  const maxY = pageHeight - bottomMargin - PAGE_NUMBER_BOTTOM_MARGIN - 5;
  
  // H1 Title - use helper
  currentY = drawH1(doc, templateData.title || "Executive Summary", contentStartX, currentY);
  currentY += TITLE_PARAGRAPH_SPACING;
  
  // Profile type - H2 style
  currentY = drawH2(doc, profileType, contentStartX, currentY, BRAND_GREEN);
  currentY += SUBSECTION_SPACING;
  
  // Subtitle (dominant traits) - H3 style
  doc.setFontSize(FONT_SIZE_H3);
  doc.setFont("helvetica", "bold");
  const subtitleText = templateData.subtitle || reportModel.dominantTraits.join(" + ");
  const subtitleRgb = hexToRgb(BRAND_GREEN);
  if (subtitleRgb) {
    doc.setTextColor(subtitleRgb.r, subtitleRgb.g, subtitleRgb.b);
  }
  doc.text(subtitleText, contentStartX, currentY);
  currentY += ptToMm(FONT_SIZE_H3) + SUBSECTION_SPACING;
  
  // Summary paragraphs (justified) - use paragraph helper
  const maxParagraphs = Math.min(3, templateData.paragraphs.length);
  for (let i = 0; i < maxParagraphs && currentY < maxY - 120; i++) {
    currentY = drawParagraph(doc, templateData.paragraphs[i], contentStartX, currentY, contentWidth, "justify");
    if (i < maxParagraphs - 1) {
      currentY += PARAGRAPH_SPACING;
    }
  }
  
  // Bullet points - use list helper
  if (templateData.bulletPoints.length > 0 && currentY < maxY - 100) {
    currentY += PARAGRAPH_SPACING;
    const maxBullets = Math.min(4, templateData.bulletPoints.length);
    currentY = drawList(doc, templateData.bulletPoints.slice(0, maxBullets), contentStartX, currentY, contentWidth);
  }
  
  // Interpretation note - if space
  if (templateData.note && currentY < maxY - 80) {
    currentY += SUBSECTION_SPACING;
    doc.setFontSize(FONT_SIZE_SMALL);
    doc.setFont("helvetica", "italic");
    const mutedRgb = hexToRgb(COLOR_TEXT_MUTED);
    if (mutedRgb) {
      doc.setTextColor(mutedRgb.r, mutedRgb.g, mutedRgb.b);
    }
    const noteLines = doc.splitTextToSize(templateData.note, contentWidth);
    const noteHeight = noteLines.length * ptToMm(FONT_SIZE_SMALL * PARAGRAPH_LINE_HEIGHT);
    if (currentY + noteHeight < maxY - 70) {
      doc.text(noteLines, contentStartX, currentY);
      currentY += noteHeight;
    }
  }
  
  // Trait Scores Overview Table - with proper spacing
  if (currentY < maxY - 100) {
    currentY += SECTION_MARGIN_TOP;
    
    // Table title
    doc.setFontSize(FONT_SIZE_H3);
    doc.setFont("helvetica", "bold");
    if (textRgb) {
      doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
    }
    doc.text("Trait Scores Overview", contentStartX, currentY);
    currentY += ptToMm(FONT_SIZE_H3) + CHART_TITLE_MARGIN_BOTTOM;
    
    // Calculate table dimensions
    const tableWidth = contentWidth;
    const headerHeight = ptToMm(FONT_SIZE_SMALL) + TABLE_CELL_PADDING * 2;
    const rowHeight = ptToMm(FONT_SIZE_SMALL) + TABLE_CELL_PADDING * 2;
    const sortedTraits = TRAITS.map(t => ({ trait: t, score: reportModel.scores[t] || 0 }))
      .sort((a, b) => b.score - a.score);
    const tableHeight = headerHeight + (sortedTraits.length * rowHeight);
    
    // Check if table fits
    if (currentY + tableHeight < maxY - 120) {
      // Draw table header
      drawColoredBox(doc, contentStartX, currentY, tableWidth, headerHeight, BRAND_LIGHT_GRAY, 0.3);
      doc.setFontSize(FONT_SIZE_SMALL);
      doc.setFont("helvetica", "bold");
      if (textRgb) {
        doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
      }
      doc.text("Trait", contentStartX + TABLE_CELL_PADDING, currentY + headerHeight / 2 + ptToMm(FONT_SIZE_SMALL) / 2);
      doc.text("Score", contentStartX + tableWidth - TABLE_CELL_PADDING - 15, currentY + headerHeight / 2 + ptToMm(FONT_SIZE_SMALL) / 2, { align: "right" });
      currentY += headerHeight;
      
      // Draw trait rows
      sortedTraits.forEach((item) => {
        if (currentY + rowHeight > maxY - 120) return;
        
        const scoreColor = getScoreColor(item.score);
        const scoreRgb = hexToRgb(scoreColor);
        
        // Draw row background (subtle alternating)
        const rowIndex = sortedTraits.indexOf(item);
        if (rowIndex % 2 === 0) {
          drawColoredBox(doc, contentStartX, currentY, tableWidth, rowHeight, BRAND_LIGHT_GRAY, 0.05);
        }
        
        // Trait name
        doc.setFontSize(FONT_SIZE_SMALL);
  doc.setFont("helvetica", "normal");
        if (textRgb) {
          doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
        }
        const shortName = item.trait.length > 35 ? item.trait.substring(0, 32) + "..." : item.trait;
        doc.text(shortName, contentStartX + TABLE_CELL_PADDING, currentY + rowHeight / 2 + ptToMm(FONT_SIZE_SMALL) / 2);
        
        // Score with color
        if (scoreRgb) {
          doc.setTextColor(scoreRgb.r, scoreRgb.g, scoreRgb.b);
        }
        doc.setFont("helvetica", "bold");
        doc.text(`${Math.round(item.score)}%`, contentStartX + tableWidth - TABLE_CELL_PADDING - 15, currentY + rowHeight / 2 + ptToMm(FONT_SIZE_SMALL) / 2, { align: "right" });
        
        currentY += rowHeight;
      });
      
      currentY += SECTION_MARGIN_BOTTOM;
    }
  }
  
  // Charts - block-level, centered, side-by-side if space allows
  const availableHeight = maxY - currentY;
  if (availableHeight >= 60 && radarChartDataUrl && barChartDataUrl) {
    currentY += PARAGRAPH_CHART_SPACING;
    
    // Calculate chart dimensions - two charts side by side
    const chartContainerWidth = contentWidth;
    const chartWidth = (chartContainerWidth - 10) / 2; // Two charts with spacing
    const chartHeight = Math.min(55, availableHeight - 15);
    const chartX1 = contentStartX;
    const chartX2 = contentStartX + chartWidth + 10;
    
    // Radar chart (left) - block-level
    try {
      doc.addImage(radarChartDataUrl, "PNG", chartX1, currentY, chartWidth, chartHeight);
    } catch (error) {
      console.warn("Failed to add radar chart:", error);
    }
    
    // Bar chart (right) - block-level
    try {
      doc.addImage(barChartDataUrl, "PNG", chartX2, currentY, chartWidth, chartHeight);
    } catch (error) {
      console.warn("Failed to add bar chart:", error);
    }
    
    currentY += chartHeight + CHART_MARGIN_BOTTOM;
  }
}

/**
 * Draw a colored box/panel
 */
function drawColoredBox(
  doc: JsPDFDoc,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  alpha: number = 0.1
) {
  const rgb = hexToRgb(color);
  if (rgb) {
    // Lighten color for background (simple approach)
    const lightR = Math.min(255, rgb.r + (255 - rgb.r) * 0.9);
    const lightG = Math.min(255, rgb.g + (255 - rgb.g) * 0.9);
    const lightB = Math.min(255, rgb.b + (255 - rgb.b) * 0.9);
    
    doc.setFillColor(lightR, lightG, lightB);
    doc.rect(x, y, width, height, "F");
    
    // Draw border
    doc.setDrawColor(rgb.r, rgb.g, rgb.b);
    doc.setLineWidth(0.3);
    doc.rect(x, y, width, height, "S");
  }
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Get color based on score
 */
function getScoreColor(score: number): string {
  if (score >= 70) {
    return "#117B4D"; // Green - high
  } else if (score >= 40) {
    return "#F59E0B"; // Orange - moderate
  } else {
    return "#EF4444"; // Red - low
  }
}

/**
 * Helper function to draw a compact colored content box with title and list
 */
function drawContentBox(
  doc: JsPDFDoc,
  title: string,
  items: string[],
  x: number,
  y: number,
  width: number,
  backgroundColor: string,
  titleColor: string
): number {
  if (items.length === 0) return y;
  
  const textRgb = hexToRgb(COLOR_TEXT_BODY);
  const titleRgb = hexToRgb(titleColor);
  
  // Calculate box height
  doc.setFontSize(FONT_SIZE_H3);
  const titleHeight = ptToMm(FONT_SIZE_H3);
  doc.setFontSize(FONT_SIZE_BODY);
  const itemHeight = ptToMm(FONT_SIZE_BODY * PARAGRAPH_LINE_HEIGHT);
  const boxHeight = BOX_PADDING * 2 + BOX_TITLE_MARGIN_TOP + titleHeight + BOX_TITLE_MARGIN_BOTTOM + 
    (items.length * itemHeight) + ((items.length - 1) * LIST_ITEM_SPACING);
  
  // Draw box background and border
  drawColoredBox(doc, x, y, width, boxHeight, backgroundColor, 0.1);
  
  // Draw title
  let currentY = y + BOX_PADDING + BOX_TITLE_MARGIN_TOP;
  doc.setFontSize(FONT_SIZE_H3);
  doc.setFont("helvetica", "bold");
  if (titleRgb) {
    doc.setTextColor(titleRgb.r, titleRgb.g, titleRgb.b);
  }
  doc.text(title, x + BOX_PADDING, currentY);
  currentY += titleHeight + BOX_TITLE_MARGIN_BOTTOM;
  
  // Draw list items
  doc.setFontSize(FONT_SIZE_BODY);
  doc.setFont("helvetica", "normal");
  if (textRgb) {
    doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
  }
  items.forEach((item, index) => {
    const lines = doc.splitTextToSize(`• ${item}`, width - BOX_PADDING * 2 - LIST_INDENT);
    doc.text(lines, x + BOX_PADDING + LIST_INDENT, currentY);
    currentY += lines.length * itemHeight;
    if (index < items.length - 1) {
      currentY += LIST_ITEM_SPACING;
    }
  });
  
  return y + boxHeight;
}

function drawTraitPage(
  doc: JsPDFDoc,
  pageWidth: number,
  pageHeight: number,
  contentStartX: number,
  contentWidth: number,
  topMargin: number,
  bottomMargin: number,
  trait: string,
  score: number,
  pageNum: number,
  allScores: Record<string, number>,
  gaugeChartUrl: string,
  comparisonChartUrl: string
) {
  // Reset at start of page
  const textRgb = hexToRgb(COLOR_TEXT_PRIMARY);
  if (textRgb) {
    doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
  }
  doc.setFont("helvetica", "normal");
  
  // Start Y position - from top margin with section spacing
  let currentY = topMargin + SECTION_MARGIN_TOP;
  const maxY = pageHeight - bottomMargin - PAGE_NUMBER_BOTTOM_MARGIN - 5;
  
  // H1 Trait name - use helper
  currentY = drawH1(doc, trait, contentStartX, currentY);
  currentY += TITLE_PARAGRAPH_SPACING;
  
  // Percentile
  const percentile = calculatePercentile(score);
  doc.setFontSize(FONT_SIZE_SMALL);
  doc.setFont("helvetica", "normal");
  const mutedRgb = hexToRgb(COLOR_TEXT_MUTED);
  if (mutedRgb) {
    doc.setTextColor(mutedRgb.r, mutedRgb.g, mutedRgb.b);
  }
  doc.text(`Above ${percentile}% of respondents`, contentStartX, currentY);
  currentY += ptToMm(FONT_SIZE_SMALL) + SECTION_MARGIN_TOP;
  
  // Get trait data
  const traitData = getTraitDescriptionForPDF(trait, score);
  const quote = getTraitQuote(trait, score);
  const careers = getTraitCareers(trait, score);
  const actions = getTraitActions(score);
  const scoreColor = getScoreColor(score);
  
  // Charts section - block-level, side by side
  if ((gaugeChartUrl || comparisonChartUrl) && currentY < maxY - 180) {
    const chartContainerWidth = contentWidth;
    const chartWidth = (chartContainerWidth - 10) / 2; // Two charts with spacing
    const chartHeight = 50; // Fixed compact height
    const chartY = currentY;
    
    // Left: Gauge chart
    if (gaugeChartUrl) {
      try {
        doc.addImage(gaugeChartUrl, "PNG", contentStartX, chartY, chartWidth, chartHeight);
      } catch (error) {
        console.warn("Failed to add gauge chart:", error);
      }
    }
    
    // Right: Comparison chart
    if (comparisonChartUrl) {
      try {
        doc.addImage(comparisonChartUrl, "PNG", contentStartX + chartWidth + 10, chartY, chartWidth, chartHeight);
      } catch (error) {
        console.warn("Failed to add comparison chart:", error);
      }
    }
    
    currentY += chartHeight + CHART_MARGIN_BOTTOM;
  }
  
  // Inspirational quote in quote box - use helper
  if (quote && currentY < maxY - 140) {
    currentY += QUOTE_BOX_MARGIN_TOP;
    currentY = drawQuoteBox(
      doc,
      quote,
      contentStartX,
      currentY,
      contentWidth,
      scoreColor,
      QUOTE_BOX_BORDER_COLOR
    );
    currentY += QUOTE_BOX_MARGIN_BOTTOM;
  }
  
  // Description (justified) - use paragraph helper
  if (currentY < maxY - 120) {
    currentY = drawParagraph(doc, traitData.description, contentStartX, currentY, contentWidth, "justify");
    currentY += PARAGRAPH_SPACING;
  }
  
  // Comparison insight - if space
  const sortedTraits = TRAITS.map(t => ({ name: t, score: allScores[t] || 0 }))
    .sort((a, b) => b.score - a.score);
  const secondTrait = sortedTraits.find(t => t.name !== trait);
  if (secondTrait && currentY < maxY - 100) {
    currentY += SUBSECTION_SPACING;
    const insight = generateComparisonInsight(trait, score, secondTrait.name, secondTrait.score);
    doc.setFontSize(FONT_SIZE_SMALL);
    doc.setFont("helvetica", "normal");
    if (mutedRgb) {
      doc.setTextColor(mutedRgb.r, mutedRgb.g, mutedRgb.b);
    }
    const insightLines = doc.splitTextToSize(insight, contentWidth);
    const insightHeight = insightLines.length * ptToMm(FONT_SIZE_SMALL * PARAGRAPH_LINE_HEIGHT);
    if (currentY + insightHeight < maxY - 90) {
      doc.text(insightLines, contentStartX, currentY);
      currentY += insightHeight;
    }
  }
  
  // Strengths section - use content box helper
  if (traitData.strengths.length > 0 && currentY < maxY - 80) {
    currentY += BOX_SPACING_VERTICAL;
    const strengthsList = traitData.strengths.slice(0, 3);
    currentY = drawContentBox(
      doc,
      "Strengths",
      strengthsList,
      contentStartX,
      currentY,
      contentWidth,
      BRAND_GREEN,
      BRAND_GREEN
    );
  }
  
  // Growth areas section (if applicable) - use content box
  if (traitData.caveats.length > 0 && score < 50 && currentY < maxY - 60) {
    currentY += BOX_SPACING_VERTICAL;
    const caveatsList = traitData.caveats.slice(0, 2);
    currentY = drawContentBox(
      doc,
      "Areas for Growth",
      caveatsList,
      contentStartX,
      currentY,
      contentWidth,
      "#F59E0B",
      "#F59E0B"
    );
  }
  
  // Action recommendations section - use content box
  if (actions.actions.length > 0 && currentY < maxY - 50) {
    currentY += BOX_SPACING_VERTICAL;
    const actionsList = actions.actions.slice(0, 2);
    currentY = drawContentBox(
      doc,
      actions.title,
      actionsList,
      contentStartX,
      currentY,
      contentWidth,
      scoreColor,
      scoreColor
    );
  }
  
  // Career recommendations - use list helper
  if (careers.length > 0 && currentY < maxY - 40) {
    currentY += SECTION_MARGIN_TOP;
    doc.setFontSize(FONT_SIZE_H3);
    doc.setFont("helvetica", "bold");
    if (textRgb) {
      doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
    }
    doc.text("Recommended Careers & Studies", contentStartX, currentY);
    currentY += ptToMm(FONT_SIZE_H3) + LIST_ITEM_SPACING;
    
    const maxCareers = Math.min(3, careers.length);
    currentY = drawList(doc, careers.slice(0, maxCareers), contentStartX, currentY, contentWidth);
  }
  
  // Work examples (if space allows)
  if (currentY < maxY - 30) {
    const workExamples = [...(traitData.workExamples.strengths || []), ...(traitData.workExamples.caveats || [])];
    if (workExamples.length > 0) {
      currentY += SECTION_MARGIN_TOP;
      doc.setFontSize(FONT_SIZE_H3);
  doc.setFont("helvetica", "bold");
      if (textRgb) {
        doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
      }
      doc.text("At Work/Study", contentStartX, currentY);
      currentY += ptToMm(FONT_SIZE_H3) + LIST_ITEM_SPACING;
      
      const maxExamples = Math.min(2, workExamples.length);
      currentY = drawList(doc, workExamples.slice(0, maxExamples), contentStartX, currentY, contentWidth);
    }
  }
}

function drawStrengthsAndGrowthPage(
  doc: JsPDFDoc,
  pageWidth: number,
  pageHeight: number,
  contentStartX: number,
  contentWidth: number,
  topMargin: number,
  bottomMargin: number,
  reportModel: ReportModel,
  strengthsGrowthChartUrl: string
) {
  // Reset at start
  const textRgb = hexToRgb(COLOR_TEXT_PRIMARY);
  if (textRgb) {
    doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
  }
  doc.setFont("helvetica", "normal");
  
  // Start Y position - from top margin with section spacing
  let currentY = topMargin + SECTION_MARGIN_TOP;
  const maxY = pageHeight - bottomMargin - PAGE_NUMBER_BOTTOM_MARGIN - 5;
  
  // H1 Title - use helper
  currentY = drawH1(doc, "Strengths & Growth Areas", contentStartX, currentY);
  currentY += PARAGRAPH_CHART_SPACING;
  
  // Add chart at the top - block-level, centered
  if (strengthsGrowthChartUrl && currentY < maxY - 150) {
    const chartWidth = contentWidth;
    const chartHeight = Math.min(65, maxY - currentY - 150);
    try {
      doc.addImage(strengthsGrowthChartUrl, "PNG", contentStartX, currentY, chartWidth, chartHeight);
      currentY += chartHeight + CHART_MARGIN_BOTTOM;
    } catch (error) {
      console.warn("Failed to add strengths vs growth chart:", error);
    }
  }
  
  // Two columns layout for strengths and growth
  const colWidth = (contentWidth - 10) / 2;
  const leftX = contentStartX;
  const rightX = contentStartX + colWidth + 10;
  const columnsStartY = currentY;
  
  // Left column: Strengths
  const strengthsList = reportModel.topStrengths.slice(0, 5);
  if (columnsStartY < maxY - 100) {
    currentY = drawContentBox(
      doc,
      "Top Strengths",
      strengthsList,
      leftX,
      columnsStartY,
      colWidth,
      BRAND_GREEN,
      BRAND_GREEN
    );
  }
  
  // Right column: Growth Areas
  const growthList = reportModel.areasForGrowth.slice(0, 5);
  if (columnsStartY < maxY - 100) {
    const growthY = drawContentBox(
      doc,
      "Areas for Growth",
      growthList,
      rightX,
      columnsStartY,
      colWidth,
      "#F59E0B",
      "#F59E0B"
    );
    currentY = Math.max(currentY, growthY);
  }
  
  // Prioritized Action Plan section - below columns
  if (currentY < maxY - 80) {
    currentY += SECTION_MARGIN_TOP;
    currentY = drawH2(doc, "Prioritized Action Plan", contentStartX, currentY);
    currentY += SUBSECTION_SPACING;
    
    // Leverage strengths
    doc.setFontSize(FONT_SIZE_H3);
  doc.setFont("helvetica", "bold");
    const greenRgb = hexToRgb(BRAND_GREEN);
    if (greenRgb) {
      doc.setTextColor(greenRgb.r, greenRgb.g, greenRgb.b);
    }
    doc.text("Leverage These Strengths:", contentStartX, currentY);
    currentY += ptToMm(FONT_SIZE_H3) + LIST_ITEM_SPACING;
    
    const leverageItems = reportModel.topStrengths.slice(0, 3).map((s, i) => `${i + 1}. ${s}`);
    currentY = drawList(doc, leverageItems, contentStartX, currentY, contentWidth);
    currentY += SUBSECTION_SPACING;
    
    // Focus on growth areas
    doc.setFontSize(FONT_SIZE_H3);
  doc.setFont("helvetica", "bold");
    const orangeRgb = hexToRgb("#F59E0B");
    if (orangeRgb) {
      doc.setTextColor(orangeRgb.r, orangeRgb.g, orangeRgb.b);
    }
    doc.text("Focus on These Growth Areas:", contentStartX, currentY);
    currentY += ptToMm(FONT_SIZE_H3) + LIST_ITEM_SPACING;
    
    const growthItems = reportModel.areasForGrowth.slice(0, 3).map((a, i) => `${i + 1}. ${a}`);
    currentY = drawList(doc, growthItems, contentStartX, currentY, contentWidth);
  }
}

function drawWorkExamplesPage(
  doc: JsPDFDoc,
  pageWidth: number,
  pageHeight: number,
  contentStartX: number,
  contentWidth: number,
  topMargin: number,
  bottomMargin: number,
  reportModel: ReportModel,
  scores: Record<string, number>
) {
  // Reset at start
  const textRgb = hexToRgb(COLOR_TEXT_PRIMARY);
  if (textRgb) {
    doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
  }
  doc.setFont("helvetica", "normal");
  
  // Start Y position - from top margin with section spacing
  let currentY = topMargin + SECTION_MARGIN_TOP;
  const maxY = pageHeight - bottomMargin - PAGE_NUMBER_BOTTOM_MARGIN - 5;
  
  // H1 Title - use helper
  currentY = drawH1(doc, "Work & Study Applications", contentStartX, currentY);
  currentY += SECTION_MARGIN_TOP;
  
  // Generate realistic scenarios
  const scenarios = generateWorkScenarios(scores);
  
  // Display scenarios - limit to 2-3 max, compact spacing
  const maxScenarios = Math.min(3, scenarios.length);
  for (let index = 0; index < maxScenarios && currentY < maxY - 80; index++) {
    const scenario = scenarios[index];
    
    // Calculate scenario box height based on content
    doc.setFontSize(FONT_SIZE_SMALL);
    const textWidth = contentWidth - BOX_PADDING * 2;
    const situationLines = doc.splitTextToSize(scenario.situation, textWidth);
    const responseLines = doc.splitTextToSize(scenario.likelyResponse, textWidth);
    const recommendationLines = doc.splitTextToSize(scenario.recommendation, textWidth);
    
    const titleHeight = ptToMm(FONT_SIZE_H3);
    const lineHeight = ptToMm(FONT_SIZE_SMALL * PARAGRAPH_LINE_HEIGHT);
    const scenarioBoxHeight = BOX_PADDING * 2 + BOX_TITLE_MARGIN_TOP + titleHeight + BOX_TITLE_MARGIN_BOTTOM +
      (situationLines.length * lineHeight) + SUBSECTION_SPACING +
      (responseLines.length * lineHeight) + SUBSECTION_SPACING +
      (recommendationLines.length * lineHeight);
    
    if (currentY + scenarioBoxHeight > maxY - 40) break;
    
    // Draw colored box for scenario
    drawColoredBox(doc, contentStartX, currentY, contentWidth, scenarioBoxHeight, BRAND_GREEN, 0.1);
    
    let boxY = currentY + BOX_PADDING + BOX_TITLE_MARGIN_TOP;
    
    // Scenario number and trait
    doc.setFontSize(FONT_SIZE_H3);
  doc.setFont("helvetica", "bold");
    const greenRgb = hexToRgb(BRAND_GREEN);
    if (greenRgb) {
      doc.setTextColor(greenRgb.r, greenRgb.g, greenRgb.b);
    }
    doc.text(`Scenario ${index + 1}: ${scenario.trait}`, contentStartX + BOX_PADDING, boxY);
    boxY += titleHeight + BOX_TITLE_MARGIN_BOTTOM;
    
    // Situation
    doc.setFontSize(FONT_SIZE_SMALL);
    doc.setFont("helvetica", "bold");
    if (textRgb) {
      doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
    }
    doc.text("Situation:", contentStartX + BOX_PADDING, boxY);
    boxY += ptToMm(FONT_SIZE_SMALL) + 3;
    
  doc.setFont("helvetica", "normal");
    doc.text(situationLines, contentStartX + BOX_PADDING, boxY);
    boxY += situationLines.length * lineHeight + SUBSECTION_SPACING;
    
    // Likely response
    doc.setFont("helvetica", "bold");
    doc.text("Likely Response:", contentStartX + BOX_PADDING, boxY);
    boxY += ptToMm(FONT_SIZE_SMALL) + 3;
    
    doc.setFont("helvetica", "normal");
    doc.text(responseLines, contentStartX + BOX_PADDING, boxY);
    boxY += responseLines.length * lineHeight + SUBSECTION_SPACING;
    
    // Recommendation
    doc.setFont("helvetica", "bold");
    if (greenRgb) {
      doc.setTextColor(greenRgb.r, greenRgb.g, greenRgb.b);
    }
    doc.text("Recommended Adjustment:", contentStartX + BOX_PADDING, boxY);
    boxY += ptToMm(FONT_SIZE_SMALL) + 3;
    
    doc.setFont("helvetica", "normal");
    if (textRgb) {
      doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
    }
    doc.text(recommendationLines, contentStartX + BOX_PADDING, boxY);
    
    currentY += scenarioBoxHeight + BOX_SPACING_VERTICAL;
  }
  
  // Add work examples for top traits if space allows
  if (currentY < maxY - 60) {
    currentY += SECTION_MARGIN_TOP;
    currentY = drawH2(doc, "Key Work Behaviors", contentStartX, currentY);
    currentY += SUBSECTION_SPACING;
    
    // Show work examples for top 2 traits
  const sortedTraits = TRAITS.map(t => ({ trait: t, score: scores[t] || 0 }))
    .sort((a, b) => b.score - a.score)
      .slice(0, 2);
  
  sortedTraits.forEach(({ trait, score }) => {
      if (currentY > maxY - 40) return;
      
    const traitData = getTraitDescriptionForPDF(trait, score);
      const greenRgb = hexToRgb(BRAND_GREEN);
    
      doc.setFontSize(FONT_SIZE_H3);
    doc.setFont("helvetica", "bold");
      if (greenRgb) {
        doc.setTextColor(greenRgb.r, greenRgb.g, greenRgb.b);
      }
      doc.text(trait, contentStartX, currentY);
      currentY += ptToMm(FONT_SIZE_H3) + LIST_ITEM_SPACING;
      
    if (traitData.workExamples.strengths.length > 0) {
        const examples = traitData.workExamples.strengths.slice(0, 2);
        currentY = drawList(doc, examples, contentStartX, currentY, contentWidth);
        currentY += SUBSECTION_SPACING;
      }
    });
  }
}

/**
 * Generate realistic work scenarios based on trait scores
 */
function generateWorkScenarios(scores: Record<string, number>): Array<{
  situation: string;
  likelyResponse: string;
  recommendation: string;
  trait: string;
}> {
  const scenarios: Array<{ situation: string; likelyResponse: string; recommendation: string; trait: string }> = [];
  
  // Scenario 1: Team conflict
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
  
  // Scenario 2: Complex problem solving
  if (scores["Logic & Reflection"] >= 70) {
    scenarios.push({
      situation: "Facing a complex technical challenge with multiple variables",
      likelyResponse: "You systematically break down the problem, research solutions, and analyze options before deciding",
      recommendation: "Leverage your analytical strength while also considering intuitive insights and team input",
      trait: "Logic & Reflection"
    });
  } else if (scores["Creativity & Expression"] >= 70) {
    scenarios.push({
      situation: "Facing a complex technical challenge with multiple variables",
      likelyResponse: "You brainstorm creative solutions and think outside the box to find innovative approaches",
      recommendation: "Combine your creativity with structured problem-solving methods for more robust solutions",
      trait: "Creativity & Expression"
    });
  }
  
  // Scenario 3: Deadline pressure
  if (scores["Precision & Organization"] >= 70) {
    scenarios.push({
      situation: "Tight deadline with multiple deliverables",
      likelyResponse: "You create a detailed plan, prioritize tasks, and systematically work through each item",
      recommendation: "Your organization is valuable - share your planning methods with the team to improve efficiency",
      trait: "Precision & Organization"
    });
  } else if (scores["Empathy & Altruism"] >= 70) {
    scenarios.push({
      situation: "Tight deadline with multiple deliverables",
      likelyResponse: "You check in with team members to ensure everyone is supported and has what they need",
      recommendation: "While supporting others is important, also ensure you're managing your own workload effectively",
      trait: "Empathy & Altruism"
    });
  }
  
  return scenarios.slice(0, 3);
}

function drawRecommendedPathsPage(
  doc: JsPDFDoc,
  pageWidth: number,
  pageHeight: number,
  contentStartX: number,
  contentWidth: number,
  topMargin: number,
  bottomMargin: number,
  reportModel: ReportModel,
  careerMatchChartUrl: string,
  careerMatches: Array<{ career: string; match: number; traits: Record<string, number> }>
) {
  // Reset at start
  const textRgb = hexToRgb(COLOR_TEXT_PRIMARY);
  if (textRgb) {
    doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
  }
  doc.setFont("helvetica", "normal");
  
  // Start Y position - from top margin with section spacing
  let currentY = topMargin + SECTION_MARGIN_TOP;
  const maxY = pageHeight - bottomMargin - PAGE_NUMBER_BOTTOM_MARGIN - 5;
  
  // H1 Title - use helper
  currentY = drawH1(doc, "Ideal Work & Learning Paths", contentStartX, currentY);
  currentY += PARAGRAPH_CHART_SPACING;
  
  // Add career match chart at the top - block-level, centered
  if (careerMatchChartUrl && currentY < maxY - 120) {
    const chartWidth = contentWidth;
    const chartHeight = Math.min(60, maxY - currentY - 120);
    try {
      doc.addImage(careerMatchChartUrl, "PNG", contentStartX, currentY, chartWidth, chartHeight);
      currentY += chartHeight + CHART_MARGIN_BOTTOM;
    } catch (error) {
      console.warn("Failed to add career match chart:", error);
    }
  }
  
  // Display recommended paths with match percentages - compact spacing
  reportModel.recommendedPaths.forEach((path, index) => {
    if (currentY > maxY - 60) return;
    
    const match = careerMatches[index]?.match || 0;
    const boxColor = match >= 80 ? BRAND_GREEN : match >= 60 ? "#F59E0B" : "#6B7280";
    
    // Calculate box height based on content
    doc.setFontSize(FONT_SIZE_SMALL);
    const textWidth = contentWidth - BOX_PADDING * 2 - 50; // Leave space for match %
    const reasonLines = doc.splitTextToSize(path.reason, textWidth);
    const titleHeight = ptToMm(FONT_SIZE_H3);
    const lineHeight = ptToMm(FONT_SIZE_SMALL * PARAGRAPH_LINE_HEIGHT);
    const pathBoxHeight = BOX_PADDING * 2 + BOX_TITLE_MARGIN_TOP + titleHeight + BOX_TITLE_MARGIN_BOTTOM +
      (reasonLines.length * lineHeight);
    
    if (currentY + pathBoxHeight > maxY - 30) return;
    
    // Draw colored box for each path
    drawColoredBox(doc, contentStartX, currentY, contentWidth, pathBoxHeight, boxColor, 0.1);
    
    let boxY = currentY + BOX_PADDING + BOX_TITLE_MARGIN_TOP;
    
    // Path title with match percentage
    doc.setFontSize(FONT_SIZE_H3);
    doc.setFont("helvetica", "bold");
    const rgb = hexToRgb(boxColor);
    if (rgb) {
      doc.setTextColor(rgb.r, rgb.g, rgb.b);
    }
    const titleLines = doc.splitTextToSize(path.title, textWidth);
    doc.text(titleLines, contentStartX + BOX_PADDING, boxY);
    
    // Match percentage - aligned right
    doc.setFontSize(FONT_SIZE_SMALL);
    doc.setFont("helvetica", "bold");
    if (textRgb) {
      doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
    }
    doc.text(`${match}% match`, contentStartX + contentWidth - BOX_PADDING - 45, boxY, { align: "right" });
    boxY += titleHeight + BOX_TITLE_MARGIN_BOTTOM;
    
    // Reason (justified)
    doc.setFontSize(FONT_SIZE_SMALL);
    doc.setFont("helvetica", "normal");
    currentY = drawJustifiedText(doc, path.reason, contentStartX + BOX_PADDING, boxY, textWidth, FONT_SIZE_SMALL, { align: "justify" });
    currentY += BOX_SPACING_VERTICAL;
  });
}

function drawRelationshipsPage(
  doc: JsPDFDoc,
  pageWidth: number,
  pageHeight: number,
  contentStartX: number,
  contentWidth: number,
  topMargin: number,
  bottomMargin: number,
  reportModel: ReportModel,
  scores: Record<string, number>,
  communicationChartUrl: string
) {
  // Reset at start
  const textRgb = hexToRgb(COLOR_TEXT_PRIMARY);
  if (textRgb) {
    doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
  }
  doc.setFont("helvetica", "normal");
  
  // Start Y position - from top margin with section spacing
  let currentY = topMargin + SECTION_MARGIN_TOP;
  const maxY = pageHeight - bottomMargin - PAGE_NUMBER_BOTTOM_MARGIN - 5;
  
  // H1 Title - use helper
  currentY = drawH1(doc, "Relationships & Communication", contentStartX, currentY);
  currentY += PARAGRAPH_CHART_SPACING;
  
  // Load relationship description from template
  const empathyScore = scores["Empathy & Altruism"] || 0;
  const harmonyScore = scores["Harmony & Cooperation"] || 0;
  const leadershipScore = scores["Leadership & Confidence"] || 0;
  
  const relationshipText = generateRelationshipDescription(empathyScore, harmonyScore, leadershipScore);
  
  // Draw relationship description - full width, justified
  currentY = drawParagraph(doc, relationshipText, contentStartX, currentY, contentWidth, "justify");
  currentY += PARAGRAPH_SPACING;
  
  // Communication tips with colored box - compact spacing
  if (currentY < maxY - 80) {
  const tips = generateCommunicationTips();
    const tailoredTips = generateTailoredCommunicationTips(empathyScore, harmonyScore, leadershipScore);
    const allTips = [...tips, ...tailoredTips].slice(0, 4);
    
    currentY += BOX_SPACING_VERTICAL;
    currentY = drawContentBox(
      doc,
      "Communication Tips",
      allTips,
      contentStartX,
      currentY,
      contentWidth,
      BRAND_GREEN,
      BRAND_GREEN
    );
  }
  
  // Add communication style chart - compact, at bottom if space
  if (communicationChartUrl && currentY < maxY - 70) {
    currentY += SECTION_MARGIN_TOP;
    const chartWidth = Math.min(60, contentWidth * 0.4);
    const chartHeight = Math.min(60, maxY - currentY - 10);
    const chartX = contentStartX + (contentWidth - chartWidth) / 2; // Center the chart
    try {
      doc.addImage(communicationChartUrl, "PNG", chartX, currentY, chartWidth, chartHeight);
    } catch (error) {
      console.warn("Failed to add communication style chart:", error);
    }
  }
}

/**
 * Generate tailored communication tips based on trait scores
 */
function generateTailoredCommunicationTips(
  empathyScore: number,
  harmonyScore: number,
  leadershipScore: number
): string[] {
  const tips: string[] = [];
  
  if (empathyScore >= 70) {
    tips.push("Your high empathy allows you to understand others deeply - use this to build trust and connection");
  } else if (empathyScore < 50) {
    tips.push("Practice asking 'How does this person feel?' to develop your emotional awareness");
  }
  
  if (harmonyScore >= 70) {
    tips.push("Your ability to maintain harmony makes you an excellent mediator in conflicts");
  } else if (harmonyScore < 50) {
    tips.push("Focus on finding common ground and compromise to improve relationship harmony");
  }
  
  if (leadershipScore >= 70) {
    tips.push("Your confidence in expressing opinions is valuable - balance it with active listening");
  } else if (leadershipScore < 50) {
    tips.push("Practice speaking up in group settings to build confidence in communication");
  }
  
  return tips;
}

function drawDevelopmentPlanPage(
  doc: JsPDFDoc,
  pageWidth: number,
  pageHeight: number,
  contentStartX: number,
  contentWidth: number,
  topMargin: number,
  bottomMargin: number,
  reportModel: ReportModel
) {
  // Reset at start
  const textRgb = hexToRgb(COLOR_TEXT_PRIMARY);
  if (textRgb) {
    doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
  }
  doc.setFont("helvetica", "normal");
  
  // Start Y position - from top margin with section spacing
  let currentY = topMargin + SECTION_MARGIN_TOP;
  const maxY = pageHeight - bottomMargin - PAGE_NUMBER_BOTTOM_MARGIN - 5;
  
  // H1 Title - use helper
  currentY = drawH1(doc, "3-Week Personal Development Plan", contentStartX, currentY);
  currentY += SECTION_MARGIN_TOP;
  
  reportModel.dailyChallenges.forEach((challenge, index) => {
    if (currentY > maxY - 70) return;
    
    // Calculate box height based on content
    doc.setFontSize(FONT_SIZE_SMALL);
    const textWidth = contentWidth - BOX_PADDING * 2;
    const explanationLines = doc.splitTextToSize(challenge.explanation, textWidth);
    const outcomeLines = doc.splitTextToSize(challenge.outcome, textWidth);
    
    const titleHeight = ptToMm(FONT_SIZE_H3);
    const lineHeight = ptToMm(FONT_SIZE_SMALL * PARAGRAPH_LINE_HEIGHT);
    const weekBoxHeight = BOX_PADDING * 2 + BOX_TITLE_MARGIN_TOP + titleHeight + BOX_TITLE_MARGIN_BOTTOM +
      ptToMm(FONT_SIZE_SMALL) + 3 + (explanationLines.length * lineHeight) + SUBSECTION_SPACING +
      ptToMm(FONT_SIZE_SMALL) + 3 + (outcomeLines.length * lineHeight);
    
    if (currentY + weekBoxHeight > maxY - 20) return;
    
    // Draw colored box for each week
    drawColoredBox(doc, contentStartX, currentY, contentWidth, weekBoxHeight, BRAND_GREEN, 0.1);
    
    let boxY = currentY + BOX_PADDING + BOX_TITLE_MARGIN_TOP;
    
    // Week title
    doc.setFontSize(FONT_SIZE_H3);
  doc.setFont("helvetica", "bold");
    const greenRgb = hexToRgb(BRAND_GREEN);
    if (greenRgb) {
      doc.setTextColor(greenRgb.r, greenRgb.g, greenRgb.b);
    }
    doc.text(`Week ${challenge.week}: ${challenge.task}`, contentStartX + BOX_PADDING, boxY);
    boxY += titleHeight + BOX_TITLE_MARGIN_BOTTOM;
    
    // Why
    doc.setFontSize(FONT_SIZE_SMALL);
    doc.setFont("helvetica", "bold");
    if (textRgb) {
      doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
    }
    doc.text("Why:", contentStartX + BOX_PADDING, boxY);
    boxY += ptToMm(FONT_SIZE_SMALL) + 3;
    
  doc.setFont("helvetica", "normal");
    boxY = drawJustifiedText(doc, challenge.explanation, contentStartX + BOX_PADDING, boxY, textWidth, FONT_SIZE_SMALL, { align: "justify" });
    boxY += SUBSECTION_SPACING;
  
    // Expected Outcome
    doc.setFont("helvetica", "bold");
    if (greenRgb) {
      doc.setTextColor(greenRgb.r, greenRgb.g, greenRgb.b);
    }
    doc.text("Expected Outcome:", contentStartX + BOX_PADDING, boxY);
    boxY += ptToMm(FONT_SIZE_SMALL) + 3;
    
    doc.setFont("helvetica", "normal");
    if (textRgb) {
      doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
    }
    boxY = drawJustifiedText(doc, challenge.outcome, contentStartX + BOX_PADDING, boxY, textWidth, FONT_SIZE_SMALL, { align: "justify" });
    
    currentY += weekBoxHeight + BOX_SPACING_VERTICAL;
  });
}

function drawResourcesPage(
  doc: JsPDFDoc,
  pageWidth: number,
  pageHeight: number,
  contentStartX: number,
  contentWidth: number,
  topMargin: number,
  bottomMargin: number
) {
  const textRgb = hexToRgb(COLOR_TEXT_PRIMARY);
  if (textRgb) {
    doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
  }
  doc.setFont("helvetica", "normal");
  
  // Start Y position - from top margin with section spacing
  let currentY = topMargin + SECTION_MARGIN_TOP;
  const maxY = pageHeight - bottomMargin - PAGE_NUMBER_BOTTOM_MARGIN - 5;
  
  // H1 Title - use helper
  currentY = drawH1(doc, "Resources & Next Steps", contentStartX, currentY);
  currentY += SECTION_MARGIN_TOP;
  
  const resources = [
    "15-page comprehensive personality report (this document)",
    "Access to 20+ diverse personality tests",
    "20+ essential skills courses with professional certifications",
    "Daily personalized development challenges",
  ];
  
  // Draw resources list
  currentY = drawList(doc, resources, contentStartX, currentY, contentWidth);
  currentY += SECTION_MARGIN_TOP;
  
  // Unlock Full Platform section
  doc.setFontSize(FONT_SIZE_H3);
  doc.setFont("helvetica", "bold");
  const greenRgb = hexToRgb(BRAND_GREEN);
  if (greenRgb) {
    doc.setTextColor(greenRgb.r, greenRgb.g, greenRgb.b);
  }
  doc.text("Unlock Full Platform", contentStartX, currentY);
  currentY += ptToMm(FONT_SIZE_H3) + SUBSECTION_SPACING;
  
  doc.setFontSize(FONT_SIZE_SMALL);
  doc.setFont("helvetica", "normal");
  const mutedRgb = hexToRgb(COLOR_TEXT_MUTED);
  if (mutedRgb) {
    doc.setTextColor(mutedRgb.r, mutedRgb.g, mutedRgb.b);
  }
  doc.text("Visit avenirea.com to access all premium features and resources", contentStartX, currentY);
}

function drawFooterPage(
  doc: JsPDFDoc,
  pageWidth: number,
  pageHeight: number,
  contentStartX: number,
  contentWidth: number,
  topMargin: number,
  bottomMargin: number,
  radarChartDataUrl: string,
  barChartDataUrl: string
) {
  const textRgb = hexToRgb(COLOR_TEXT_PRIMARY);
  if (textRgb) {
    doc.setTextColor(textRgb.r, textRgb.g, textRgb.b);
  }
  doc.setFont("helvetica", "normal");
  
  // Start Y position - from top margin with section spacing
  let currentY = topMargin + SECTION_MARGIN_TOP;
  const maxY = pageHeight - bottomMargin - PAGE_NUMBER_BOTTOM_MARGIN - 5;
  
  // H1 Title - use helper
  currentY = drawH1(doc, "Visual Summary", contentStartX, currentY);
  currentY += PARAGRAPH_CHART_SPACING;
  
  // Add charts - block-level, side by side, centered
  if (radarChartDataUrl && barChartDataUrl && currentY < maxY - 100) {
    const chartContainerWidth = contentWidth;
    const chartWidth = (chartContainerWidth - 10) / 2; // Two charts with spacing
    const chartHeight = Math.min(75, maxY - currentY - 15);
    const chartX1 = contentStartX;
    const chartX2 = contentStartX + chartWidth + 10;
    
    // Radar chart (left)
    try {
      doc.addImage(radarChartDataUrl, "PNG", chartX1, currentY, chartWidth, chartHeight);
    } catch (error) {
      console.warn("Failed to add radar chart:", error);
    }
    
    // Bar chart (right)
    try {
      doc.addImage(barChartDataUrl, "PNG", chartX2, currentY, chartWidth, chartHeight);
    } catch (error) {
      console.warn("Failed to add bar chart:", error);
    }
  }
}

