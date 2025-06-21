# XLab Web Localization

This folder contains translation files for the XLab Web application. The application supports the following languages:

- English (`eng`)
- Vietnamese (`vie`)

## Structure

Each language folder contains JSON files for different parts of the application:

- `common.json` - Common strings used throughout the application
- `home.json` - Homepage-specific translations
- `products.json` - Product listings and detail page translations
- `auth.json` - Authentication-related translations (login, register, etc.)
- `checkout.json` - Checkout process translations
- `errors.json` - Error messages and validation translations

## Usage

When adding new text to the application, make sure to add the corresponding translation keys to the appropriate JSON files in all language folders.

### Format

The translation files follow a nested JSON structure for better organization:

```json
{
  "section": {
    "subsection": {
      "key": "Translation value"
    }
  }
}
```

### Variables

For dynamic content, use the double curly braces syntax: 

```json
{
  "welcome": "Hello, {{name}}!"
}
```

## Adding New Languages

To add a new language:

1. Create a new folder with the language code
2. Copy all JSON files from an existing language folder
3. Translate the values in each file
4. Update the language configuration in the application

## Contributing to Translations

When contributing translations:

1. Ensure all keys exist in all language files
2. Maintain the same structure across all language files
3. Preserve any variables in the translations
4. Be consistent with terminology 