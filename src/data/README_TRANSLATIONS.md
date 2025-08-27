# Product Translations Migration

## Important Notice

The file `product_translations.json` is now **deprecated** and should no longer be used for new development. All product translations have been migrated to the new i18n structure.

## New Structure

Product translations are now stored in individual JSON files in the following directories:

- Vietnamese translations: `src/i18n/vie/product/`
- English translations: `src/i18n/eng/product/`

Each product has its own file named after its ID (e.g., `chatgpt.json`, `grok.json`, `canva.json`).

## API Changes

The `/api/product-translations` endpoint is now removed and returns HTTP 410 Gone.

Please use the `/api/products/[id]` endpoint with the `lang` query parameter instead, or set the `Accept-Language` header.

Example:
```
GET /api/products/chatgpt?lang=eng
```

For client-side code, prefer the new helper that automatically appends `lang` and sets `Accept-Language`:

```ts
import { useLangFetch } from '@/lib/langFetch';

const lfetch = useLangFetch(language); // language is 'eng' | 'vie'
const result = await lfetch('/api/products');
if (result.success) {
  // result.data is your products array
}
```


## Migration Process

1. All product data from `product_translations.json` has been migrated to individual files
2. The `index.ts` files in both language directories have been updated to include all products
3. The API endpoint has been updated to use the new structure

## Benefits of the New Structure

- Better organization of product data
- Easier to add new products or update existing ones
- Consistent structure across the application
- Better support for additional languages in the future
- Improved performance by loading only the required product data

## Contact

If you have any questions about this migration, please contact the development team. 