# Personality Report PDF Generation

## Overview

This module generates a comprehensive 15-page PDF report from personality test answers. The report includes trait scores, analysis, recommendations, and visual charts.

## Architecture

The system is designed with **separation of concerns**:
- **Content Templates** (`content-templates/`) - All text content in JSON/Markdown files
- **Template Loader** (`templateLoader.ts`) - Loads and processes templates
- **Report Logic** (`templates.ts`) - Business logic for building report models
- **PDF Generator** (`generateReportPDF.ts`) - Renders PDF using templates and logic
- **Charts** (`charts.ts`) - Chart generation (radar and bar charts)

## Files Structure

- `templates.ts` - Report model building logic
- `templateLoader.ts` - Template loading and processing
- `charts.ts` - Chart generation (radar and bar charts)
- `generateReportPDF.ts` - Main PDF generation function
- `content-templates/` - Directory containing all text content templates
  - `trait_descriptions.json` - Trait descriptions by score range
  - `trait_strengths.json` - Trait strengths by score range
  - `trait_growth_areas.json` - Growth area suggestions
  - `trait_work_examples.json` - Work/study examples
  - `*.md` - Markdown templates for various sections

## Usage

```typescript
import { generateReportPDF } from "@/lib/report/generateReportPDF";
import type { AnswersState } from "@/pages/TestPersonnalite";

// Generate PDF from answers
const answers: AnswersState = {
  step1: { Q1: 4, Q2: 5, Q3: 3, Q4: 4, Q5: 5 },
  step2: { Q6: 3, Q7: 4, Q8: 5, Q9: 3, Q10: 4 },
  // ... etc
};

const pdfBlob = await generateReportPDF(answers);

// Download the PDF
const url = URL.createObjectURL(pdfBlob);
const link = document.createElement("a");
link.href = url;
link.download = "personality_report.pdf";
link.click();
URL.revokeObjectURL(url);
```

## PDF Structure (15 pages)

1. **Cover** - Title, subtitle, date
2. **Executive Summary** - Dominant traits and overview
3-8. **Trait Deep Dives** - One trait per page with scores, descriptions, strengths, and work examples
9. **Strengths & Growth Areas** - Top strengths and improvement areas
10. **Work Examples** - How traits manifest in work/study contexts
11. **Ideal Work & Learning Paths** - Career and study recommendations
12. **Relationships & Communication** - Interaction patterns and communication tips
13. **3-Week Personal Development Plan** - Daily challenges and outcomes
14. **Resources & Next Steps** - Premium features and platform access
15. **Footer & Credits** - Charts, branding, and legal information

## Trait Scoring

- Each question (1-100) is mapped to one of 6 traits using `questionTraitMap`
- Answers (1-5 Likert scale) are normalized to 0-100 scale
- Average scores are calculated for each trait
- Traits are sorted by score to identify dominant traits

## Chart Generation

- **Radar Chart**: 6-axis chart showing all trait scores
- **Bar Chart**: Horizontal bars sorted by score (descending)

Charts are generated using HTML5 Canvas and converted to base64 images for PDF embedding.

## Customization

### Editing Content (Templates)

**All text content is now in template files** - no code changes needed!

1. **Edit JSON templates** (`content-templates/*.json`):
   - `trait_descriptions.json` - Trait descriptions by score range
   - `trait_strengths.json` - Trait strengths
   - `trait_growth_areas.json` - Growth areas
   - `trait_work_examples.json` - Work examples

2. **Edit Markdown templates** (`content-templates/*.md`):
   - `cover.md` - Cover page text
   - `executive_summary.md` - Executive summary
   - `strengths_and_growth.md` - Strengths and growth sections
   - `paths_and_careers.md` - Career recommendations
   - `relationships.md` - Relationships section
   - `development_plan.md` - Development plan
   - `resources.md` - Resources section
   - `footer.md` - Footer content

See `content-templates/README.md` for detailed documentation on editing templates.

### Modifying PDF Layout (Code)

Edit `generateReportPDF.ts` to adjust:
- Page layouts
- Text positioning
- Colors and styling
- Chart placement

**Note**: Layout changes require code modifications, but text content can be edited in templates without touching code.

## Dependencies

- `jspdf` - PDF generation
- HTML5 Canvas API - Chart generation
- React/TypeScript - Type safety

## Notes

- PDF generation happens entirely client-side
- No personal information is required (uses "Respondent" / "Anonymous")
- Charts are embedded as PNG images
- PDF size is optimized to be under 5MB

