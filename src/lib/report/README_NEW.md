# Personality Report PDF Generation - New System

## Overview

The report generation system has been refactored to use **Puppeteer with HTML/CSS rendering**, producing professional, perfectly aligned 15-page PDF reports. This replaces the old jsPDF-based system that caused overlapping text and layout issues.

## Architecture

### 1. HTML/CSS Rendering
- **ReportPage.tsx**: React component that renders the full 15-page report as HTML
- **report-styles.css**: Print-optimized CSS with A4 page layout and proper page breaks
- All content is rendered as semantic HTML with clean, professional styling

### 2. PDF Generation Server
- **server/pdf-server.js**: Express server that uses Puppeteer to generate PDFs
- Navigates to the report preview page and exports it as PDF
- Runs on port 3001 by default

### 3. Client Integration
- **exportToPDF.ts**: Client-side functions for API integration
- **ReportPreview.tsx**: Page component that renders reports from URL parameters
- **TestPersonnalite.tsx**: Updated to use the new API-based PDF generation

## Setup

### 1. Install Dependencies

```bash
npm install
```

Dependencies include:
- `puppeteer`: PDF generation from HTML
- `express`: PDF server
- `cors`: CORS support for API

### 2. Start Development Servers

**Option 1: Run servers separately**

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - PDF Server:
```bash
npm run pdf-server
```

**Option 2: Run both servers concurrently**

```bash
npm install -g concurrently
npm run dev:all
```

### 3. Environment Variables

Create a `.env` file (optional):

```env
VITE_PDF_API_URL=http://localhost:3001/api/generate-pdf
PDF_SERVER_PORT=3001
FRONTEND_URL=http://localhost:8080
```

## Usage

### Generating PDFs from the Frontend

The PDF generation is integrated into the personality test flow. When users complete the test and click "Download PDF", the system:

1. Sends answers to the PDF server API
2. Server loads the report preview page with the answers
3. Puppeteer renders the page and generates PDF
4. PDF is returned as a blob and downloaded

### Manual PDF Generation

You can also generate PDFs programmatically:

```typescript
import { generatePDFViaAPI } from "@/lib/report/pdfClient";

const answers = {
  step1: { Q1: 4, Q2: 5, ... },
  step2: { Q6: 3, Q7: 4, ... },
  // ... etc
};

const pdfBlob = await generatePDFViaAPI(answers);
// Download or use the blob
```

### Previewing Reports

Reports can be previewed in the browser at:
```
http://localhost:8080/report/preview?answers=<encoded_answers>
```

## Report Structure (15 Pages)

1. **Cover Page** - Title, subtitle, date, branding
2. **Executive Summary** - Dominant traits, overview, charts
3-8. **Trait Deep Dives** - One trait per page with:
   - Gauge charts
   - Comparison charts
   - Strengths and growth areas
   - Work examples
   - Career recommendations
9. **Strengths & Growth Areas** - Overview with charts
10. **Work Examples** - Realistic scenarios and behaviors
11. **Ideal Work & Learning Paths** - Career recommendations
12. **Relationships & Communication** - Communication style and tips
13. **3-Week Development Plan** - Structured development tasks
14. **Resources & Next Steps** - Platform features and access
15. **Footer & Credits** - Charts, branding, legal information

## Styling

### A4 Page Layout

- Page size: 210mm × 297mm (A4)
- Margins: 25mm top/bottom, 20mm left/right
- Page breaks: Automatic via CSS `page-break-after: always`
- Print background: Enabled for colors and images

### Brand Colors

- Background: `#FAF9F6` (beige)
- Primary: `#3C8C76` (green)
- Text: `#1E2A38` (dark gray)
- Accents: `#F3C567` (orange), `#E76E6E` (red)

### Typography

- Fonts: Inter, Nunito, system sans-serif
- Headings: 20pt (H1), 16pt (H2), 14pt (H3)
- Body: 10.75pt with 1.6 line height
- Print-optimized spacing and margins

## Charts

Charts are generated using HTML5 Canvas and embedded as base64 images:
- Radar charts
- Bar charts
- Gauge charts
- Comparison charts
- Communication style charts
- Career match charts

All charts use the brand color scheme and are optimized for PDF rendering.

## Migration from Old System

### What Changed

- **Removed**: jsPDF and manual canvas layout
- **Removed**: Manual position calculations (x, y coordinates)
- **Added**: HTML/CSS rendering with Puppeteer
- **Added**: Server-side PDF generation
- **Added**: Print-optimized CSS

### Old Code

The old `generateReportPDF.ts` is still in the codebase but deprecated. It's no longer used by the frontend. You can remove it after confirming the new system works correctly.

## Troubleshooting

### PDF Server Not Starting

1. Check if port 3001 is available
2. Ensure Puppeteer is installed correctly
3. Check browser dependencies (Chromium)

### Charts Not Loading

1. Ensure the frontend server is running
2. Check browser console for errors
3. Verify chart generation functions are working

### PDF Generation Fails

1. Check PDF server logs
2. Verify the frontend URL is correct
3. Ensure answers are properly encoded
4. Check Puppeteer browser launch settings

### Layout Issues

1. Verify CSS is loaded correctly
2. Check page break rules
3. Ensure A4 dimensions are correct
4. Test in browser preview first

## Production Deployment

### Server Setup

1. Deploy the PDF server as a separate service
2. Set environment variables for production URLs
3. Configure CORS for your frontend domain
4. Set up proper error handling and logging

### Frontend Configuration

1. Set `VITE_PDF_API_URL` to your production PDF server
2. Ensure the report preview route is accessible
3. Test PDF generation in production environment

### Performance

- PDF generation takes 5-15 seconds depending on charts
- Consider adding caching for frequently generated reports
- Use CDN for static assets (charts, images)
- Optimize chart generation for faster rendering

## Future Improvements

- [ ] Add progress tracking for PDF generation
- [ ] Implement PDF caching
- [ ] Add support for custom branding
- [ ] Optimize chart rendering performance
- [ ] Add PDF compression options
- [ ] Support for multiple languages
- [ ] Add watermarks for premium reports

## Support

For issues or questions, please check:
- Server logs: `server/pdf-server.js` console output
- Browser console: Frontend errors
- Network tab: API request/response details

