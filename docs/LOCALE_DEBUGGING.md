# Localization Debugging Guide

## Overview

This document provides a guide for debugging locale/internationalization issues in the XLab Web application. The application has comprehensive debugging capabilities to help identify and resolve issues with translations and language switching.

## Debug Levels

The system supports multiple debug levels to control how much information is logged:

- **NONE (0)**: No debugging information
- **ERROR (1)**: Only error messages (default in production)
- **WARN (2)**: Errors and warnings (including missing translations)
- **INFO (3)**: General information, warnings, and errors (default in development)
- **VERBOSE (4)**: All debug information including translation resolution

## Setting Debug Level

### Option 1: Using the Debug Tool

We've provided a command-line tool to help you set up debugging:

```bash
npm run locale-debug
```

This interactive tool allows you to:
- Set the debug level
- Generate a missing translations report
- Clear missing translations logs
- View your current debug configuration

### Option 2: Environment Variable

You can also set the debug level directly using an environment variable:

```bash
# Set maximum debug verbosity
LOCALE_DEBUG_LEVEL=4 npm run dev

# Or use our custom script
npm run dev:debug-locales
```

### Option 3: Browser Console

When the application is running in development mode, you can access debug functions directly in the browser console:

```javascript
// Set debug level
window.__LOCALE_DEBUG.setLocaleDebugLevel(4); // VERBOSE

// Generate a report of missing translations
window.__LOCALE_DEBUG.generateMissingTranslationsReport();

// Clear missing translations tracking
window.__LOCALE_DEBUG.clearMissingTranslations();
```

## Tracking Missing Translations

The system automatically tracks missing translations in development mode. This helps identify keys that need to be added to your language files.

To view a summary of missing translations:

```javascript
// In browser console
window.__LOCALE_DEBUG.generateMissingTranslationsReport();
```

## Debug Information in Console

With debugging enabled, you'll see various messages in the console:

- **Language initialization**: When and how languages are loaded
- **Language switches**: When the user changes languages
- **Missing translations**: Warnings for missing translation keys
- **API requests**: Locale-related API calls and responses

## Troubleshooting Common Issues

### Missing Translations

If a translation isn't appearing correctly, check for:

1. Console warnings about missing keys
2. Generate a missing translations report
3. Verify the key exists in the proper language file
4. Check for typos in the key being used

### Language Not Switching

If the language isn't switching properly:

1. Check console logs for initialization source (localStorage, default, etc.)
2. Verify the browser localStorage has the correct language key
3. Ensure the language is in the supported languages list

### API Locale Problems

For API-related locale issues:

1. Set debug level to VERBOSE (4)
2. Check API endpoints like `/api/products/language` for detailed logging
3. Verify language parameters being passed to the API

## Implementing Debug Logging in New Code

To add logging to new code that handles localization:

```typescript
import * as localeDebug from '@/utils/localeDebug';

// Log basic info
localeDebug.logDebug('Loading translations', { language: 'vie' }, 'INFO');

// Log missing translations
localeDebug.logMissingTranslation('some.key', 'vie', 'HomePage');

// Log language changes
localeDebug.logLanguageSwitch('eng', 'vie', 'user-selection');
```