# Content Templates Documentation

## Overview

This directory contains all text content templates for the personality report PDF generation. The templates are separated from the code logic to make it easy to edit content without touching the codebase.

## Architecture

- **Templates** (`content-templates/`) - All human-readable text content
- **Template Loader** (`templateLoader.ts`) - Loads and processes templates
- **Report Generator** (`generateReportPDF.ts`) - Uses templates to generate PDF
- **Logic** (`templates.ts`) - Business logic for building report models

## Template Files

### JSON Templates (Structured Data)

#### `trait_descriptions.json`
Contains descriptions for each trait based on score ranges:
- `very_high` (90-100%)
- `high` (70-89%)
- `moderate` (50-69%)
- `low` (30-49%)
- `very_low` (0-29%)

**Structure:**
```json
{
  "Trait Name": {
    "very_high": "Description text...",
    "high": "Description text...",
    ...
  }
}
```

#### `trait_strengths.json`
Contains strength lists for each trait based on score ranges:
- `high` - Strengths for scores >= 70
- `moderate` - Strengths for scores 50-69

#### `trait_growth_areas.json`
Contains growth area suggestions for each trait (used when score < 50).

#### `trait_work_examples.json`
Contains work/study examples for each trait:
- `high_strengths` - Work examples for high scores
- `high_caveats` - Areas to watch for high scores
- `moderate_strengths` - Work examples for moderate scores
- `low_caveats` - Improvement suggestions for low scores

### Markdown Templates (Text Content)

#### `cover.md`
Cover page content with placeholders:
- `{{date}}` - Report generation date

#### `executive_summary.md`
Executive summary template with placeholders:
- `{{dominantTrait1}}` - First dominant trait
- `{{dominantTrait2}}` - Second dominant trait

#### `strengths_and_growth.md`
Template for strengths and growth areas:
- `{{strengthsList}}` - Formatted list of strengths
- `{{growthAreasList}}` - Formatted list of growth areas

#### `paths_and_careers.md`
Template for recommended career paths:
- `{{recommendedPathsList}}` - Formatted list of paths

#### `relationships.md`
Template for relationships section:
- `{{relationshipDescription}}` - Dynamic description based on scores
- `{{communicationTipsList}}` - List of communication tips

#### `development_plan.md`
Template for 3-week development plan:
- `{{developmentChallengesList}}` - List of weekly challenges

#### `resources.md`
Resources and next steps section (static content).

#### `footer.md`
Footer and credits section (static content).

## How to Edit Templates

### Editing JSON Templates

1. Open the JSON file (e.g., `trait_descriptions.json`)
2. Find the trait you want to edit
3. Modify the text for the desired score range
4. Save the file
5. The changes will be reflected in the next PDF generation

### Editing Markdown Templates

1. Open the Markdown file (e.g., `executive_summary.md`)
2. Edit the text content
3. Use placeholders like `{{placeholderName}}` for dynamic content
4. Save the file
5. The changes will be reflected in the next PDF generation

### Adding New Traits

If you need to add a new trait:

1. Add the trait name to `TRAITS` array in `src/pages/TestPersonnalite.tsx`
2. Add trait descriptions to `trait_descriptions.json`
3. Add trait strengths to `trait_strengths.json`
4. Add growth areas to `trait_growth_areas.json`
5. Add work examples to `trait_work_examples.json`
6. Update `questionTraitMap` in `TestPersonnalite.tsx` to map questions to the new trait

## Placeholder System

### Available Placeholders

- `{{traitName}}` - Name of the trait
- `{{score}}` - Trait score (0-100)
- `{{date}}` - Report generation date
- `{{dominantTrait1}}` - First dominant trait
- `{{dominantTrait2}}` - Second dominant trait
- `{{strengthsList}}` - Formatted list of strengths
- `{{growthAreasList}}` - Formatted list of growth areas
- `{{recommendedPathsList}}` - Formatted list of recommended paths
- `{{relationshipDescription}}` - Dynamic relationship description
- `{{communicationTipsList}}` - List of communication tips
- `{{developmentChallengesList}}` - List of development challenges

### Adding New Placeholders

1. Add the placeholder to the template file: `{{newPlaceholder}}`
2. Update `templateLoader.ts` to provide the value for the placeholder
3. Update the function that uses the template to pass the placeholder value

## Best Practices

1. **Keep text concise** - PDFs have limited space
2. **Use consistent tone** - Maintain professional, supportive language
3. **Test after changes** - Generate a PDF to verify formatting
4. **Backup before major changes** - Keep a backup of working templates
5. **Use placeholders** - Don't hardcode values that should be dynamic
6. **Follow JSON syntax** - Ensure valid JSON in JSON template files
7. **Escape special characters** - Use proper escaping in JSON strings

## Translation Support

The template system is designed to support multiple languages:

1. Create language-specific template directories (e.g., `content-templates/fr/`)
2. Update `templateLoader.ts` to load templates based on language preference
3. Translate all template files to the target language
4. Update placeholder names if needed for different languages

## Troubleshooting

### Template not loading
- Check file path is correct
- Verify JSON syntax is valid (use a JSON validator)
- Check console for error messages

### Placeholders not replacing
- Verify placeholder name matches exactly (case-sensitive)
- Check that the placeholder is provided in the template loader
- Ensure the template function is called with the correct data

### Text not appearing in PDF
- Check that the template file is saved
- Verify the template is being loaded correctly
- Check console logs for errors
- Ensure text fits within PDF page boundaries

## File Structure

```
content-templates/
├── README.md (this file)
├── cover.md
├── executive_summary.md
├── trait_descriptions.json
├── trait_strengths.json
├── trait_growth_areas.json
├── trait_work_examples.json
├── strengths_and_growth.md
├── paths_and_careers.md
├── relationships.md
├── development_plan.md
├── resources.md
└── footer.md
```

## Support

For questions or issues with templates, please check:
1. Console logs for error messages
2. Template file syntax
3. Placeholder names and values
4. Code comments in `templateLoader.ts`

