# XLab Web Localization

This directory contains all localization files for the XLab Web application. The application supports multiple languages, with each language having its own subdirectory.

## Structure

- `/eng` - English translations
- `/vie` - Vietnamese translations
- `/spa` - Spanish translations

Each language directory contains multiple TypeScript files, organized by feature or section of the application. For example:
- `common.ts` - Common UI elements and shared texts
- `home.ts` - Home page content
- `product.ts` - Product-related content
- etc.

## Adding New Translations

When adding new translations:

1. Add the translation key and text to the appropriate file in each language directory.
2. If adding a new feature, create the corresponding file in each language directory.
3. Ensure the structure and keys are identical across all language files.

## Integration

Translations are integrated through the main `src/locales/index.ts` file, which exports:
- All language packs
- Helper functions for retrieving translations
- TypeScript types for type safety

## Default Language

The default language is set to Vietnamese (`vie`). When a translation is missing in a language, the system will fall back to the English version.

## Verifying Translations

A verification script is available to ensure all localization files use their correct language:

```bash
node scripts/verify-locales.js
```

This script checks each file to verify that:
- English files contain English text
- Vietnamese files contain Vietnamese text 
- Spanish files contain Spanish text

If any issues are found, the script will report them along with samples of the problematic content.

## Adding a New Language

To add a new language:

1. Create a new directory with the language code (e.g., `/fra` for French)
2. Copy the structure and files from an existing language directory
3. Translate all the text values while preserving the keys
4. Update `src/locales/index.ts` to include the new language
5. Update the language selection UI components 