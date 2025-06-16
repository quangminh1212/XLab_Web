# XLab Web Localization System

This directory contains the modular localization system for the XLab Web application. The system is designed to be easy to maintain and extend with new languages and translations.

## Structure

```
src/locales/
├── index.ts            # Main export for all translations
├── examples.tsx        # Usage examples and error handling patterns
├── vi/                 # Vietnamese translations
│   ├── index.ts        # Combines all Vietnamese translation files
│   ├── common.ts       # Common UI elements (navigation, buttons, etc.)
│   ├── home.ts         # Home page translations
│   ├── about.ts        # About page translations
│   ├── product.ts      # Product related translations
│   └── ...             # Other section-specific translations
├── en/                 # English translations
│   ├── index.ts        # Combines all English translation files
│   ├── common.ts       # Common UI elements
│   ├── home.ts         # Home page translations
│   ├── about.ts        # About page translations
│   ├── product.ts      # Product related translations
│   └── ...             # Other section-specific translations
└── [lang]/             # Other language translations follow the same pattern
```

## Adding New Translations

### Adding a New Language

1. Create a new directory with the language code (e.g., `fr` for French)
2. Create an `index.ts` file in that directory to combine all translations
3. Add translation files for different sections (common, home, etc.)
4. Update the main `index.ts` file to export the new language

### Adding New Translation Keys

1. Identify the appropriate file for your translation based on where it will be used
2. Add the new key-value pair to the corresponding files in all supported languages
3. Follow the established naming conventions for keys (e.g., 'section.subsection.key')

## Usage

To use translations in components:

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { t } = useLanguage();
  
  return <h1>{t('home.title')}</h1>;
}
```

To use translations with parameters:

```tsx
<p>{t('product.purchasesPerWeek', { count: product.weeklyPurchases })}</p>
```

## Error Handling

The translation system includes built-in error handling to prevent crashes:

### 1. Safe Translation Access

When a translation key doesn't exist, the system returns the key itself as a fallback:

```tsx
// If 'missing.key' doesn't exist, "missing.key" will be displayed
<p>{t('missing.key')}</p>

// You can provide your own fallback
<p>{t('missing.key') || 'Default text'}</p>
```

### 2. Safe Parameter Replacement

Parameter replacement is wrapped in try-catch to prevent errors:

```tsx
// Even if the count parameter causes an issue, the app won't crash
<p>{t('product.count', { count: someComplexExpression })}</p>
```

### 3. Using Outside Provider

When using the `useLanguage()` hook outside the provider, wrap in try-catch:

```tsx
function SafeComponent() {
  try {
    const { t } = useLanguage();
    return <div>{t('some.key')}</div>;
  } catch (error) {
    return <div>Translation error</div>;
  }
}
```

See `examples.tsx` for more error handling patterns and best practices.

## Best Practices

1. **Organization**: Keep translations grouped by page/feature to make them easy to find
2. **Naming**: Use descriptive key names in the format `section.subsection.elementName`
3. **Completeness**: Always add translations for all supported languages when adding a new key
4. **Comments**: Add comments to group related translations for easier navigation
5. **Error Handling**: Use the provided error handling patterns to ensure robustness
6. **Validation**: Validate dynamic translation keys before using them

## Adding New Translation Files

When adding a new feature or page that requires many translations:

1. Create a new file in each language directory (e.g., `cart.ts`)
2. Update each language's `index.ts` file to import and include the new translations
