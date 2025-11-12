/**
 * Simple PDF Generator - Client-side only
 * Uses jsPDF with a simple Markdown template
 */

import { calculateTraitScores } from "@/pages/TestPersonnalite";
import type { AnswersState } from "@/pages/TestPersonnalite";

const TRAITS = [
  "Precision & Organization",
  "Empathy & Altruism",
  "Leadership & Confidence",
  "Creativity & Expression",
  "Logic & Reflection",
  "Harmony & Cooperation"
];

/**
 * Simple PDF generation from answers
 */
export async function generateSimplePDF(
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
    log("Chargement de jsPDF...", 10);
    const jsPDF = (await import("jspdf")).default;
    
    log("Calcul des scores...", 20);
    const scores = calculateTraitScores(answers);
    
    log("Création du PDF...", 30);
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

    // Helper to add text with word wrap
    const addText = (text: string, fontSize: number, isBold = false, color = "#1E2A38") => {
      doc.setFontSize(fontSize);
      doc.setTextColor(color);
      if (isBold) {
        doc.setFont(undefined, "bold");
      } else {
        doc.setFont(undefined, "normal");
      }
      
      const lines = doc.splitTextToSize(text, contentWidth);
      const lineHeight = fontSize * 0.4;
      
      // Check if we need a new page
      if (y + (lines.length * lineHeight) > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      
      lines.forEach((line: string) => {
        doc.text(line, margin, y);
        y += lineHeight;
      });
      
      y += 5;
    };

    // Title
    doc.setTextColor("#3C8C76");
    doc.setFontSize(24);
    doc.setFont(undefined, "bold");
    doc.text("Avenirea Personality Report", pageWidth / 2, y, { align: "center" });
    y += 15;

    doc.setTextColor("#6B7280");
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(`Generated: ${new Date().toISOString().split("T")[0]}`, pageWidth / 2, y, { align: "center" });
    y += 20;

    // Executive Summary
    addText("Executive Summary", 18, true, "#3C8C76");
    
    const sortedTraits = TRAITS.map(t => ({ name: t, score: scores[t] || 0 }))
      .sort((a, b) => b.score - a.score);
    
    const dominant1 = sortedTraits[0]?.name || "";
    const dominant2 = sortedTraits[1]?.name || "";
    
    addText(
      `Your dominant traits are ${dominant1} and ${dominant2}. ` +
      `These traits significantly influence your decision-making, relationships, and career choices.`,
      11
    );
    y += 10;

    // Trait Scores
    addText("Trait Scores Overview", 18, true, "#3C8C76");
    
    sortedTraits.forEach(({ name, score }) => {
      const scoreColor = score >= 70 ? "#3C8C76" : score >= 40 ? "#F3C567" : "#E76E6E";
      addText(`${name}: ${Math.round(score)}%`, 14, true, scoreColor);
      
      // Simple bar representation
      const barWidth = (score / 100) * contentWidth;
      doc.setFillColor(scoreColor);
      doc.rect(margin, y - 3, barWidth, 5, "F");
      y += 10;
    });
    
    y += 10;

    // Top Strengths
    addText("Top Strengths", 18, true, "#3C8C76");
    const topStrengths = sortedTraits.slice(0, 3).flatMap(t => {
      if (t.score >= 50) {
        return [
          `Strong ${t.name.toLowerCase()}`,
          `Excellent performance in related areas`
        ];
      }
      return [];
    });
    
    topStrengths.slice(0, 6).forEach(strength => {
      addText(`• ${strength}`, 11);
    });
    y += 10;

    // Areas for Growth
    addText("Areas for Growth", 18, true, "#3C8C76");
    const growthAreas = sortedTraits.slice(-3).reverse().flatMap(t => {
      if (t.score < 50) {
        return [
          `Develop ${t.name.toLowerCase()}`,
          `Focus on related skills and behaviors`
        ];
      }
      return [];
    });
    
    growthAreas.slice(0, 6).forEach(area => {
      addText(`• ${area}`, 11);
    });
    y += 10;

    // Trait Analysis
    addText("Detailed Trait Analysis", 18, true, "#3C8C76");
    
    sortedTraits.slice(0, 3).forEach(({ name, score }) => {
      addText(`${name} (${Math.round(score)}%)`, 16, true, "#3C8C76");
      
      let description = "";
      if (score >= 70) {
        description = `You have exceptional abilities in ${name.toLowerCase()}. This is one of your strongest traits.`;
      } else if (score >= 40) {
        description = `You have moderate abilities in ${name.toLowerCase()}. There is room for growth.`;
      } else {
        description = `Your ${name.toLowerCase()} score is lower, indicating an area for development.`;
      }
      
      addText(description, 11);
      y += 5;
    });
    y += 10;

    // Recommended Paths
    addText("Recommended Career Paths", 18, true, "#3C8C76");
    
    const paths = [];
    if (dominant1.includes("Precision")) paths.push("Quality Assurance & Process Management");
    if (dominant1.includes("Empathy")) paths.push("Human Services & Counseling");
    if (dominant1.includes("Creativity")) paths.push("Design & Creative Industries");
    if (dominant1.includes("Logic")) paths.push("Research & Analysis");
    if (dominant1.includes("Leadership")) paths.push("Management & Entrepreneurship");
    if (dominant1.includes("Harmony")) paths.push("Mediation & Team Coordination");
    
    paths.slice(0, 4).forEach(path => {
      addText(`• ${path}`, 11);
    });
    y += 10;

    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor("#6B7280");
      doc.text(
        `© Avenirea - Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    }

    log("PDF généré avec succès!", 100);
    
    return doc.output("blob");
  } catch (error) {
    console.error("[PDF] Error:", error);
    throw new Error(`Erreur lors de la génération du PDF: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
  }
}

