# Internationalization (i18n) Structure

This directory contains the internationalized data for the application. The structure is organized by language and data type.

## Directory Structure

```
i8n/
├── eng/                # English data
│   └── product/        # English product data
│       ├── index.ts    # Export functions for accessing products
│       ├── chatgpt.json # Individual product file
│       └── grok.json    # Individual product file
│
├── vie/                # Vietnamese data
│   └── product/        # Vietnamese product data
│       ├── index.ts    # Export functions for accessing products
│       ├── chatgpt.json # Individual product file
│       └── grok.json    # Individual product file
│
└── README.md           # This file
```

## How to Use

### API Routes

The API routes in `src/app/api/products` and `src/app/api/products/[id]` are set up to handle language selection. You can specify the language by adding a `lang` query parameter:

```
/api/products?lang=eng  # Get English products
/api/products?lang=vie  # Get Vietnamese products (default)
```

### Adding New Products

To add a new product:

1. Create a JSON file in both language directories (`i8n/eng/product/` and `i8n/vie/product/`)
2. Name the file using the product ID (e.g., `new-product.json`)
3. Follow the existing product schema structure

### Language Switching

The application includes a language switcher component that can be used to toggle between languages. It sets the `lang` parameter in the URL and stores the user's preference in localStorage.

## Testing

You can test the language functionality by visiting the `/language-test` page, which shows products in both languages with a simple language switcher. 