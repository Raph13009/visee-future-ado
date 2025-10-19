# Neobrutalism UI Theme

This landing page has been refactored with a neobrutalism design system while maintaining all existing functionality, copy, and component structure.

## Color Tokens

The neobrutalism theme uses these CSS variables defined in `src/index.css`:

```css
:root {
  --neo-bg: #FFFFFF;        /* Clean white background */
  --neo-ink: #000000;       /* Pure black text */
  --neo-accent: #FF6B35;    /* Orange accent color */
  --neo-accent-2: #00D4AA;  /* Teal secondary accent */
  --neo-line: #000000;      /* Black borders */
}
```

## Component Classes

### Cards & Surfaces
- `.neo-card` - Standard card with thick black border and hover offset effect
- `.neo-badge` - Badge component with accent background and border

### Buttons
- `.neo-button` - Primary button with orange background and black border
- `.neo-button-secondary` - Secondary button with white background and black border

### Typography
- `.neo-heading-xl` - Extra large heading (clamp(3rem, 8vw, 6rem))
- `.neo-heading-lg` - Large heading (clamp(2rem, 5vw, 3rem))
- `.neo-heading-md` - Medium heading (clamp(1.5rem, 4vw, 2rem))
- `.neo-text` - Standard text color
- `.neo-text-muted` - Muted text color (#666666)

### Links
- `.neo-link` - Styled links with accent color and hover effects

### Layout
- `.neo-section` - Standard section with generous padding
- `.neo-container` - Centered container with max-width
- `.neo-grid` - Base grid system
- `.neo-grid-2`, `.neo-grid-3`, `.neo-grid-4` - Grid variants

### Form Elements
- `.neo-input` - Input fields with thick borders and focus states

## Design Principles

1. **Bold, chunky visuals** - Thick borders (3px), high contrast
2. **Flat solid fills** - No gradients, solid colors only
3. **Hard outlines** - Sharp, defined borders instead of shadows
4. **Offset effects** - Hover states with translate transforms and box-shadows
5. **Generous spacing** - Large padding and margins
6. **Oversized elements** - Big buttons, large typography
7. **Square/rounded corners** - 8px border-radius for modern feel

## Accessibility

- High contrast ratios (4.5:1+) for text readability
- Visible focus rings on interactive elements
- Maintained responsive behavior across all screen sizes
- Preserved all existing ARIA attributes and semantic HTML

## How to Extend

To add new neobrutalism components:

1. **Use existing utility classes** when possible
2. **Follow the color token system** - use CSS variables instead of hardcoded colors
3. **Maintain thick borders** - 3px for main elements, 2px for smaller ones
4. **Add hover effects** - Use translate transforms and box-shadows for offset effects
5. **Keep generous spacing** - Use the clamp() function for responsive spacing
6. **Preserve accessibility** - Ensure proper contrast ratios and focus states

## Example Usage

```jsx
// Card component
<div className="neo-card">
  <h3 className="neo-heading neo-heading-md">Title</h3>
  <p className="neo-text-muted">Description text</p>
  <button className="neo-button">Action</button>
</div>

// Custom styled element
<div 
  className="neo-section"
  style={{ background: 'var(--neo-bg)' }}
>
  <div className="neo-container">
    <h2 className="neo-heading neo-heading-lg">Section Title</h2>
  </div>
</div>
```

## Files Modified

- `src/index.css` - Added neobrutalism theme variables and utility classes
- `src/pages/Index.tsx` - Applied neobrutalism styling to all sections
- `src/components/Header.tsx` - Updated header with neobrutalism design
- `src/components/Footer.tsx` - Updated footer with neobrutalism design
- `src/components/coaching/CoachingCTA.tsx` - Updated coaching CTA component

All existing functionality, routing, data bindings, and copy remain unchanged.
