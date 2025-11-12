# PDF Generation Setup Guide

## Quick Start

### 1. Install Dependencies

All dependencies are already installed via `npm install`. The key packages are:
- `puppeteer`: For PDF generation
- `express`: For the PDF server
- `cors`: For CORS support

### 2. Start the Servers

You need to run two servers:

**Terminal 1 - Frontend (Vite):**
```bash
npm run dev
```
This starts the frontend on `http://localhost:8080`

**Terminal 2 - PDF Server:**
```bash
npm run pdf-server
```
This starts the PDF server on `http://localhost:3001`

### 3. Test PDF Generation

1. Complete the personality test at `/test-personnalite`
2. Click "Download PDF" on the results page
3. The PDF will be generated and downloaded automatically

## How It Works

### Architecture

1. **Frontend (React)**: User completes test → clicks "Download PDF"
2. **API Call**: Frontend sends answers to PDF server API
3. **PDF Server**: Loads report preview page with answers → Puppeteer renders → Generates PDF
4. **Download**: PDF is returned as blob and downloaded

### File Structure

```
src/
  lib/report/
    ReportPage.tsx          # Main report component (15 pages)
    report-styles.css       # Print-optimized CSS
    exportToPDF.ts          # Client-side PDF API functions
    generateReportPDF.ts    # Old jsPDF code (deprecated)
  
  pages/
    ReportPreview.tsx       # Report preview page (reads answers from URL)
    TestPersonnalite.tsx    # Test page (calls PDF API)

server/
  pdf-server.js            # Express server for PDF generation
```

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# PDF Server Configuration
VITE_PDF_API_URL=http://localhost:3001/api/generate-pdf
PDF_SERVER_PORT=3001
FRONTEND_URL=http://localhost:8080
```

### Production Setup

For production, update the environment variables:

```env
VITE_PDF_API_URL=https://your-pdf-server.com/api/generate-pdf
FRONTEND_URL=https://your-frontend.com
```

## Troubleshooting

### PDF Server Won't Start

1. **Port already in use**: Change `PDF_SERVER_PORT` in `.env` or `pdf-server.js`
2. **Puppeteer not installed**: Run `npm install puppeteer`
3. **Chromium dependencies**: On Linux, you may need to install Chromium dependencies:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install -y chromium-browser
   ```

### PDF Generation Fails

1. **Check server logs**: Look at the PDF server console output
2. **Check frontend URL**: Ensure `FRONTEND_URL` matches your frontend URL
3. **Check CORS**: Ensure CORS is enabled on the PDF server
4. **Check answers format**: Verify answers are properly encoded

### Charts Not Showing

1. **Wait for charts**: The server waits for `[data-charts-ready="true"]` attribute
2. **Check chart generation**: Verify charts are generated correctly in browser
3. **Check image loading**: Ensure all chart images are loaded before PDF generation

### Layout Issues

1. **Test in browser**: Preview the report at `/report/preview?answers=...`
2. **Check CSS**: Ensure `report-styles.css` is loaded
3. **Check page breaks**: Verify `page-break-after: always` is applied
4. **Check A4 dimensions**: Ensure pages are 210mm × 297mm

## Development

### Preview Report in Browser

You can preview the report in the browser by:

1. Encoding your answers:
```javascript
const answers = { step1: { Q1: 4, ... }, ... };
const encoded = btoa(encodeURIComponent(JSON.stringify(answers)));
```

2. Navigate to:
```
http://localhost:8080/report/preview?answers=<encoded>
```

### Manual PDF Generation

You can test PDF generation manually:

```bash
curl -X POST http://localhost:3001/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"answers": {"step1": {"Q1": 4, "Q2": 5, ...}}}' \
  --output report.pdf
```

## Performance

- **PDF generation time**: 5-15 seconds (depending on charts)
- **PDF size**: ~2-5 MB (depending on charts and content)
- **Memory usage**: ~200-500 MB (Puppeteer + Chromium)

## Security

- **CORS**: Configure CORS to only allow your frontend domain
- **Rate limiting**: Consider adding rate limiting to prevent abuse
- **Authentication**: Add authentication if needed for production
- **Input validation**: Validate answers before PDF generation

## Next Steps

1. **Test the system**: Complete a test and generate a PDF
2. **Review the PDF**: Check all 15 pages render correctly
3. **Optimize**: Adjust CSS or layout as needed
4. **Deploy**: Set up production servers and environment variables

## Support

For issues or questions:
- Check server logs: `server/pdf-server.js` console output
- Check browser console: Frontend errors
- Check network tab: API request/response details
- Review documentation: `src/lib/report/README_NEW.md`

