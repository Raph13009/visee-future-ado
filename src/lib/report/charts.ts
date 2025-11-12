import { TRAITS } from "./templates";

export interface ChartData {
  trait: string;
  score: number;
}

/**
 * Generate radar chart data URL as base64
 * This creates a simple radar chart using canvas
 */
export async function generateRadarChart(scores: Record<string, number>): Promise<string> {
  const startTime = Date.now();
  console.log("[Charts] ========================================");
  console.log("[Charts] Generating radar chart");
  console.log("[Charts] Scores:", JSON.stringify(scores));
  
  try {
    console.log("[Charts] Step 1: Creating canvas...");
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 600;
    console.log("[Charts] Step 2: Getting context...");
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }
    console.log("[Charts] Step 3: Canvas context obtained");

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 200;
    const numTraits = TRAITS.length;
    const angleStep = (2 * Math.PI) / numTraits;

    // Clear canvas with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid circles
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      const r = (radius * i) / 5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = "#D1D5DB";
    ctx.lineWidth = 1;
    TRAITS.forEach((_, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    // Draw data polygon
    ctx.fillStyle = "rgba(17, 123, 77, 0.2)";
    ctx.strokeStyle = "#117B4D";
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    TRAITS.forEach((trait, index) => {
      const score = scores[trait] || 0;
      const normalizedRadius = (radius * score) / 100;
      const angle = index * angleStep - Math.PI / 2;
      const x = centerX + normalizedRadius * Math.cos(angle);
      const y = centerY + normalizedRadius * Math.sin(angle);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw points
    ctx.fillStyle = "#117B4D";
    TRAITS.forEach((trait, index) => {
      const score = scores[trait] || 0;
      const normalizedRadius = (radius * score) / 100;
      const angle = index * angleStep - Math.PI / 2;
      const x = centerX + normalizedRadius * Math.cos(angle);
      const y = centerY + normalizedRadius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = "#374151";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    TRAITS.forEach((trait, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const labelRadius = radius + 30;
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);
      
      // Shorten trait names for better display
      const shortName = trait.split(" & ")[0].substring(0, 12);
      ctx.fillText(shortName, x, y);
    });

    // Draw center labels (0, 25, 50, 75, 100)
    ctx.fillStyle = "#9CA3AF";
    ctx.font = "10px sans-serif";
    for (let i = 0; i <= 4; i++) {
      const label = (i * 25).toString();
      const r = (radius * i) / 4;
      ctx.fillText(label, centerX, centerY - r - 10);
    }

    console.log("[Charts] Step 4: Converting canvas to data URL...");
    const dataUrl = canvas.toDataURL("image/png");
    const elapsed = Date.now() - startTime;
    console.log(`[Charts] ✅ Radar chart generated in ${elapsed}ms`);
    console.log(`[Charts] Data URL length: ${dataUrl.length} characters`);
    console.log("[Charts] ========================================");
    return dataUrl;
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[Charts] ❌ Error generating radar chart after ${elapsed}ms:`, error);
    console.error("[Charts] Error stack:", error instanceof Error ? error.stack : 'No stack');
    console.log("[Charts] ========================================");
    throw error;
  }
}

/**
 * Generate horizontal bar chart as base64
 */
export async function generateBarChart(scores: Record<string, number>): Promise<string> {
  console.log("[Charts] Generating bar chart with scores:", scores);
  
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Clear canvas with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barHeight = 40;
    const barSpacing = 10;
    const chartWidth = canvas.width - 200;
    const chartHeight = (barHeight + barSpacing) * TRAITS.length;
    const startY = (canvas.height - chartHeight) / 2;
    const startX = 180;

    // Colors for each trait
    const colors = [
      "#2196F3", // Blue - Precision
      "#4CAF50", // Green - Empathy
      "#E91E63", // Pink - Creativity
      "#9C27B0", // Purple - Logic
      "#FF9800", // Orange - Leadership
      "#00BCD4", // Cyan - Harmony
    ];

    // Sort traits by score (descending)
    const sortedTraits = TRAITS.map((trait, index) => ({
      trait,
      score: scores[trait] || 0,
      color: colors[index],
    })).sort((a, b) => b.score - a.score);

    // Draw bars
    sortedTraits.forEach((item, index) => {
      const y = startY + index * (barHeight + barSpacing);
      const barWidth = (chartWidth * item.score) / 100;

      // Draw bar background
      ctx.fillStyle = "#F3F4F6";
      ctx.fillRect(startX, y, chartWidth, barHeight);

      // Draw bar
      ctx.fillStyle = item.color;
      ctx.fillRect(startX, y, barWidth, barHeight);

      // Draw score text on bar
      if (barWidth > 50) {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillText(`${item.score}%`, startX + barWidth - 10, y + barHeight / 2);
      }

      // Draw trait name
      ctx.fillStyle = "#374151";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      const shortName = item.trait.length > 20 ? item.trait.substring(0, 17) + "..." : item.trait;
      ctx.fillText(shortName, startX - 10, y + barHeight / 2);

      // Draw score text outside bar if bar is too small
      if (barWidth <= 50) {
        ctx.fillStyle = "#6B7280";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`${item.score}%`, startX + barWidth + 10, y + barHeight / 2);
      }
    });

    // Draw title
    ctx.fillStyle = "#111827";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("Trait Scores", canvas.width / 2, 20);

    const dataUrl = canvas.toDataURL("image/png");
    console.log("[Charts] Bar chart generated successfully, size:", dataUrl.length, "chars");
    return dataUrl;
  } catch (error) {
    console.error("[Charts] Error generating bar chart:", error);
    throw error;
  }
}

/**
 * Generate circular progress indicator (gauge) for a single trait score
 */
export async function generateGaugeChart(score: number, traitName: string): Promise<string> {
  console.log("[Charts] Generating gauge chart for", traitName, "score:", score);
  
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Clear canvas with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;
    const lineWidth = 20;

    // Determine color based on score
    let color: string;
    if (score >= 70) {
      color = "#117B4D"; // Green - high
    } else if (score >= 40) {
      color = "#F59E0B"; // Orange - moderate
    } else {
      color = "#EF4444"; // Red - low
    }

    // Draw background arc (gray)
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI * 2.25);
    ctx.stroke();

    // Draw score arc (colored)
    const startAngle = Math.PI * 0.75;
    const endAngle = startAngle + (Math.PI * 1.5 * score / 100);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.stroke();

    // Draw score text
    ctx.fillStyle = "#374151";
    ctx.font = "bold 36px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${Math.round(score)}%`, centerX, centerY - 10);

    // Draw trait name (shortened)
    ctx.fillStyle = "#6B7280";
    ctx.font = "14px sans-serif";
    const shortName = traitName.length > 20 ? traitName.substring(0, 17) + "..." : traitName;
    ctx.fillText(shortName, centerX, centerY + 30);

    const dataUrl = canvas.toDataURL("image/png");
    console.log("[Charts] Gauge chart generated successfully");
    return dataUrl;
  } catch (error) {
    console.error("[Charts] Error generating gauge chart:", error);
    throw error;
  }
}

/**
 * Generate horizontal comparison chart showing one trait vs all others
 */
export async function generateTraitComparisonChart(
  currentTrait: string,
  currentScore: number,
  allScores: Record<string, number>
): Promise<string> {
  console.log("[Charts] Generating trait comparison chart for", currentTrait);
  
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 250;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Clear canvas with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barHeight = 25;
    const barSpacing = 8;
    const chartWidth = canvas.width - 150;
    const startX = 140;
    const startY = 30;
    const maxScore = Math.max(...Object.values(allScores), 100);

    // Calculate average score for reference line
    const avgScore = Object.values(allScores).reduce((sum, s) => sum + s, 0) / Object.values(allScores).length;

    // Sort traits by score, but highlight current trait
    const sortedTraits = TRAITS.map(trait => ({
      trait,
      score: allScores[trait] || 0,
      isCurrent: trait === currentTrait,
    })).sort((a, b) => b.score - a.score);

    // Draw bars
    sortedTraits.forEach((item, index) => {
      const y = startY + index * (barHeight + barSpacing);
      const barWidth = (chartWidth * item.score) / maxScore;

      // Draw bar background
      ctx.fillStyle = "#F3F4F6";
      ctx.fillRect(startX, y, chartWidth, barHeight);

      // Draw bar (highlighted if current trait)
      if (item.isCurrent) {
        ctx.fillStyle = "#117B4D";
        ctx.strokeStyle = "#0F5D3F";
        ctx.lineWidth = 2;
      } else {
        ctx.fillStyle = "#9CA3AF";
        ctx.strokeStyle = "#6B7280";
        ctx.lineWidth = 1;
      }
      ctx.fillRect(startX, y, barWidth, barHeight);
      ctx.strokeRect(startX, y, barWidth, barHeight);

      // Draw trait name
      ctx.fillStyle = item.isCurrent ? "#117B4D" : "#374151";
      ctx.font = item.isCurrent ? "bold 12px sans-serif" : "12px sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      const shortName = item.trait.length > 18 ? item.trait.substring(0, 15) + "..." : item.trait;
      ctx.fillText(shortName, startX - 10, y + barHeight / 2);

      // Draw score
      ctx.fillStyle = item.isCurrent ? "#117B4D" : "#6B7280";
      ctx.font = item.isCurrent ? "bold 11px sans-serif" : "11px sans-serif";
      ctx.textAlign = "left";
      if (barWidth > 40) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(`${Math.round(item.score)}%`, startX + barWidth - 35, y + barHeight / 2);
      } else {
        ctx.fillStyle = "#374151";
        ctx.fillText(`${Math.round(item.score)}%`, startX + barWidth + 5, y + barHeight / 2);
      }
    });

    // Draw average reference line
    const avgX = startX + (chartWidth * avgScore) / maxScore;
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(avgX, startY - 5);
    ctx.lineTo(avgX, startY + sortedTraits.length * (barHeight + barSpacing) - barSpacing);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw average label
    ctx.fillStyle = "#F59E0B";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Avg: ${Math.round(avgScore)}%`, avgX + 5, startY - 8);

    const dataUrl = canvas.toDataURL("image/png");
    console.log("[Charts] Trait comparison chart generated successfully");
    return dataUrl;
  } catch (error) {
    console.error("[Charts] Error generating trait comparison chart:", error);
    throw error;
  }
}

/**
 * Generate dual-axis chart comparing strengths vs growth areas
 */
export async function generateStrengthsGrowthChart(
  strengths: string[],
  growthAreas: string[],
  scores: Record<string, number>
): Promise<string> {
  console.log("[Charts] Generating strengths vs growth chart");
  
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Clear canvas with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sort traits by score to identify strengths (high) vs growth (low)
    const sortedTraits = TRAITS.map(trait => ({
      trait,
      score: scores[trait] || 0,
    })).sort((a, b) => b.score - a.score);

    const top3 = sortedTraits.slice(0, 3);
    const bottom3 = sortedTraits.slice(-3).reverse();

    const barWidth = 60;
    const barSpacing = 20;
    const chartHeight = 250;
    const startY = 80;
    const strengthsStartX = 100;
    const growthStartX = 350;

    // Draw title
    ctx.fillStyle = "#374151";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Strengths vs Growth Areas", canvas.width / 2, 30);

    // Draw strengths (left side - green)
    ctx.fillStyle = "#117B4D";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Strengths", strengthsStartX + (barWidth + barSpacing) * 1.5, startY - 20);

    top3.forEach((item, index) => {
      const x = strengthsStartX + index * (barWidth + barSpacing);
      const barHeight = (chartHeight * item.score) / 100;
      const y = startY + chartHeight - barHeight;

      // Draw bar
      ctx.fillStyle = "#117B4D";
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw score
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${Math.round(item.score)}%`, x + barWidth / 2, y + barHeight / 2);

      // Draw trait name (rotated)
      ctx.save();
      ctx.translate(x + barWidth / 2, startY + chartHeight + 15);
      ctx.rotate(-Math.PI / 4);
      ctx.fillStyle = "#374151";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      const shortName = item.trait.split(" & ")[0].substring(0, 10);
      ctx.fillText(shortName, 0, 0);
      ctx.restore();
    });

    // Draw growth areas (right side - orange/red)
    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Growth Areas", growthStartX + (barWidth + barSpacing) * 1.5, startY - 20);

    bottom3.forEach((item, index) => {
      const x = growthStartX + index * (barWidth + barSpacing);
      const barHeight = (chartHeight * item.score) / 100;
      const y = startY + chartHeight - barHeight;

      // Draw bar (orange for moderate, red for low)
      ctx.fillStyle = item.score < 40 ? "#EF4444" : "#F59E0B";
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw score
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${Math.round(item.score)}%`, x + barWidth / 2, y + barHeight / 2);

      // Draw trait name (rotated)
      ctx.save();
      ctx.translate(x + barWidth / 2, startY + chartHeight + 15);
      ctx.rotate(-Math.PI / 4);
      ctx.fillStyle = "#374151";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      const shortName = item.trait.split(" & ")[0].substring(0, 10);
      ctx.fillText(shortName, 0, 0);
      ctx.restore();
    });

    const dataUrl = canvas.toDataURL("image/png");
    console.log("[Charts] Strengths vs growth chart generated successfully");
    return dataUrl;
  } catch (error) {
    console.error("[Charts] Error generating strengths vs growth chart:", error);
    throw error;
  }
}

/**
 * Generate communication style diagram (empathy vs assertiveness)
 */
export async function generateCommunicationStyleChart(
  empathyScore: number,
  harmonyScore: number,
  leadershipScore: number
): Promise<string> {
  console.log("[Charts] Generating communication style chart");
  
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Clear canvas with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const axisLength = 150;

    // Calculate assertiveness from leadership score
    const assertiveness = leadershipScore;
    const empathy = (empathyScore + harmonyScore) / 2;

    // Draw axes
    ctx.strokeStyle = "#D1D5DB";
    ctx.lineWidth = 2;
    // Horizontal axis (Assertiveness)
    ctx.beginPath();
    ctx.moveTo(centerX - axisLength, centerY);
    ctx.lineTo(centerX + axisLength, centerY);
    ctx.stroke();
    // Vertical axis (Empathy)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - axisLength);
    ctx.lineTo(centerX, centerY + axisLength);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = "#6B7280";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Low Assertiveness", centerX - axisLength, centerY + 25);
    ctx.fillText("High Assertiveness", centerX + axisLength, centerY + 25);
    ctx.save();
    ctx.translate(centerX - 30, centerY - axisLength);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("High Empathy", 0, 0);
    ctx.restore();
    ctx.save();
    ctx.translate(centerX - 30, centerY + axisLength);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Low Empathy", 0, 0);
    ctx.restore();

    // Draw quadrant labels
    ctx.fillStyle = "#9CA3AF";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Supportive", centerX - axisLength / 2, centerY - axisLength / 2);
    ctx.fillText("Directive", centerX + axisLength / 2, centerY - axisLength / 2);
    ctx.fillText("Collaborative", centerX - axisLength / 2, centerY + axisLength / 2);
    ctx.fillText("Analytical", centerX + axisLength / 2, centerY + axisLength / 2);

    // Draw data point
    const x = centerX + (axisLength * (assertiveness - 50) / 50);
    const y = centerY - (axisLength * (empathy - 50) / 50);

    // Draw point
    ctx.fillStyle = "#117B4D";
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw title
    ctx.fillStyle = "#374151";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Communication Style", centerX, 30);

    const dataUrl = canvas.toDataURL("image/png");
    console.log("[Charts] Communication style chart generated successfully");
    return dataUrl;
  } catch (error) {
    console.error("[Charts] Error generating communication style chart:", error);
    throw error;
  }
}

/**
 * Generate career match chart (radar style for career-to-trait matching)
 */
export async function generateCareerMatchChart(
  careerMatches: Array<{ career: string; match: number; traits: Record<string, number> }>
): Promise<string> {
  console.log("[Charts] Generating career match chart");
  
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }

    // Clear canvas with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barHeight = 35;
    const barSpacing = 10;
    const chartWidth = canvas.width - 250;
    const startX = 200;
    const startY = 50;

    // Sort by match percentage
    const sorted = careerMatches.sort((a, b) => b.match - a.match).slice(0, 5);

    // Draw title
    ctx.fillStyle = "#374151";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Career Match Analysis", canvas.width / 2, 25);

    // Draw bars
    sorted.forEach((item, index) => {
      const y = startY + index * (barHeight + barSpacing);
      const barWidth = (chartWidth * item.match) / 100;

      // Draw bar background
      ctx.fillStyle = "#F3F4F6";
      ctx.fillRect(startX, y, chartWidth, barHeight);

      // Draw bar (color based on match)
      let color: string;
      if (item.match >= 80) {
        color = "#117B4D"; // Green - excellent match
      } else if (item.match >= 60) {
        color = "#F59E0B"; // Orange - good match
      } else {
        color = "#6B7280"; // Gray - moderate match
      }
      ctx.fillStyle = color;
      ctx.fillRect(startX, y, barWidth, barHeight);

      // Draw career name
      ctx.fillStyle = "#374151";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      const shortName = item.career.length > 25 ? item.career.substring(0, 22) + "..." : item.career;
      ctx.fillText(shortName, startX - 10, y + barHeight / 2);

      // Draw match percentage
      if (barWidth > 60) {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`${Math.round(item.match)}%`, startX + 5, y + barHeight / 2);
      } else {
        ctx.fillStyle = "#374151";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`${Math.round(item.match)}%`, startX + barWidth + 5, y + barHeight / 2);
      }
    });

    const dataUrl = canvas.toDataURL("image/png");
    console.log("[Charts] Career match chart generated successfully");
    return dataUrl;
  } catch (error) {
    console.error("[Charts] Error generating career match chart:", error);
    throw error;
  }
}

