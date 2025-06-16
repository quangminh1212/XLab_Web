# XLab Symbols System

This directory contains a comprehensive symbols system for the XLab web application. The symbols system is designed to provide a consistent and maintainable way to handle icons, characters, typography, colors, and other visual elements across the application.

## Structure

The symbols system is organized into several modules:

- **Icons**: SVG icons used throughout the application
- **Characters**: Special characters and symbols
- **Typography**: Font families, weights, and text formatting utilities
- **Colors**: Color palette for the application
- **Layout**: Spacing, sizing, and layout constants
- **Patterns**: Common UI patterns and decorative elements

## Usage

### Icons

Icons are React components that can be easily customized with props:

```tsx
import { Icons } from '@/shared/symbols';

// Basic usage
<Icons.Search />

// With custom size and color
<Icons.Search size={24} color="blue" />

// With custom class
<Icons.Search className="text-blue-500 h-8 w-8" />
```

### Characters

Special characters can be used directly in your components:

```tsx
import { Characters } from '@/shared/symbols';

// Currency symbols
<p>{Characters.CURRENCY.VND} 1,000,000</p>

// Special symbols
<p>{Characters.SPECIAL.COPYRIGHT} 2023 XLab</p>

// Arrows
<button>Next {Characters.ARROWS.RIGHT}</button>
```

### Typography

Typography utilities help maintain consistent text formatting:

```tsx
import { TextFormatters, FontFamilies } from '@/shared/symbols';

// Format prices
<p>{TextFormatters.formatPrice(1250000)}</p>  // ₫1,250,000

// Format dates
<p>{TextFormatters.formatDate(new Date())}</p>  // 16 tháng 6, 2023

// Apply font families
<p style={{ fontFamily: FontFamilies.PRIMARY }}>Primary font</p>
```

### Colors

The color system provides a consistent palette:

```tsx
import { Colors } from '@/shared/symbols';

// Brand primary color
<div style={{ backgroundColor: Colors.BRAND.PRIMARY[500] }}>Primary</div>

// Semantic colors
<div style={{ color: Colors.SEMANTIC.SUCCESS[500] }}>Success message</div>
```

### Layout

Layout constants help maintain consistent spacing and sizing:

```tsx
import { Layout } from '@/shared/symbols';

// Apply spacing
<div style={{ margin: Layout.SPACING.MD }}>Spaced content</div>

// Use z-index
<div style={{ zIndex: Layout.Z_INDEX.MODAL }}>Modal</div>

// Apply border radius
<div style={{ borderRadius: Layout.BORDER_RADIUS.MD }}>Rounded corners</div>
```

## Demo

To see all symbols in action, visit the symbols demo page at `/symbols` in the application.

## Maintenance

When adding new symbols, make sure to:

1. Add them to the appropriate file based on the symbol type
2. Export them from the index.ts file
3. Add documentation for the new symbols
4. Update the demo page if applicable

This will help maintain the consistency and usability of the symbols system. 