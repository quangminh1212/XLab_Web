import fs from 'fs';
import path from 'path';
import { Product } from '@/models/ProductModel';

/**
 * Normalizes language code from Accept-Language header 
 * @param lang Language code from header (e.g., 'vi-VN,vi;q=0.7', 'en-US', etc.)
 * @returns Normalized language code ('vie' or 'eng')
 */
export function normalizeLanguageCode(lang: string): string {
  // If empty, default to Vietnamese
  if (!lang) return 'vie';

  try {
    // Extract the primary language code
    const primaryLang = lang.split(',')[0].split('-')[0].toLowerCase().trim();
    
    // Map to our directory structure
    if (primaryLang === 'en') return 'eng';
    if (primaryLang === 'vi') return 'vie';
    
    // Default to 'vie' if unknown
    console.log(`Unrecognized language code "${primaryLang}", defaulting to 'vie'`);
    return 'vie';
  } catch (error) {
    console.error(`Error normalizing language code "${lang}":`, error);
    return 'vie'; // Default to Vietnamese on any error
  }
}

/**
 * Ensures the product directory exists for the given language
 * @param lang Language code
 */
function ensureProductDirectory(lang: string): void {
  const normalizedLang = normalizeLanguageCode(lang);
  const productDir = path.join(process.cwd(), `src/i18n/${normalizedLang}/product`);
  if (!fs.existsSync(productDir)) {
    fs.mkdirSync(productDir, { recursive: true });
    console.log(`Created product directory for language: ${normalizedLang}`);
  }
}

/**
 * Saves a product to the i18n product directory
 * @param product Product object to save
 * @param lang Language code
 */
export async function saveProduct(product: Product, lang = 'vie'): Promise<boolean> {
  try {
    const normalizedLang = normalizeLanguageCode(lang);
    ensureProductDirectory(normalizedLang);
    const productFilePath = path.join(process.cwd(), `src/i18n/${normalizedLang}/product/${product.id}.json`);
    fs.writeFileSync(productFilePath, JSON.stringify(product, null, 2), 'utf-8');
    console.log(`Product ${product.id} saved for language ${normalizedLang}`);
    return true;
  } catch (error) {
    console.error(`Error saving product ${product.id} for language ${lang}:`, error);
    return false;
  }
}

/**
 * Retrieves a product by ID from the i18n product files
 * @param id The product ID to find
 * @param lang Optional language code (defaults to 'vie')
 * @returns The product object if found, or null if not found
 */
export async function getProductById(id: string, lang = 'vie'): Promise<Product | null> {
  try {
    // Normalize the language code
    const normalizedLang = normalizeLanguageCode(lang);
    console.log(`Getting product ${id} with normalized language: ${normalizedLang}`);
    
    // Get product file path based on ID and language
    const productFilePath = path.join(process.cwd(), `src/i18n/${normalizedLang}/product/${id}.json`);
    
    let product: Product | null = null;
    
    try {
      // Check if file exists
      if (fs.existsSync(productFilePath)) {
        const fileContent = fs.readFileSync(productFilePath, 'utf-8');
        product = JSON.parse(fileContent) as Product;
        return product;
      }
    } catch (error) {
      console.error(`Error reading product file for ${id}:`, error);
      return null;
    }
    
    // If product not found, return null
    console.warn(`Product ${id} not found for language ${normalizedLang}`);
    return null;
  } catch (error) {
    console.error(`Error in getProductById for ${id}:`, error);
    return null;
  }
}

/**
 * Delete a product by ID from the i18n product files
 * @param id The product ID to delete
 * @param lang Optional language code (defaults to both 'vie' and 'eng')
 * @returns True if deleted successfully, false otherwise
 */
export async function deleteProduct(id: string, lang?: string): Promise<boolean> {
  try {
    // If specific language provided, only delete that language version
    // Otherwise, delete from all languages
    const languages = lang ? [normalizeLanguageCode(lang)] : ['vie', 'eng'];
    let success = false;
    
    for (const language of languages) {
      const productFilePath = path.join(process.cwd(), `src/i18n/${language}/product/${id}.json`);
      
      if (fs.existsSync(productFilePath)) {
        fs.unlinkSync(productFilePath);
        console.log(`Product ${id} deleted for language ${language}`);
        success = true;
      }
    }
    
    return success;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    return false;
  }
}

/**
 * Retrieves all products from the i18n product files
 * @param lang Optional language code (defaults to 'vie')
 * @returns Array of product objects
 */
export async function getAllProducts(lang = 'vie'): Promise<Product[]> {
  try {
    // Normalize the language code
    const normalizedLang = normalizeLanguageCode(lang);
    console.log(`Getting all products with normalized language: ${normalizedLang}`);
    
    const products: Product[] = [];
    
    // Get products from i18n directory
    const productsDir = path.join(process.cwd(), `src/i18n/${normalizedLang}/product`);
    
    if (fs.existsSync(productsDir)) {
      const files = fs.readdirSync(productsDir);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      for (const file of jsonFiles) {
        try {
          const filePath = path.join(productsDir, file);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const productData = JSON.parse(fileContent) as Product;
          products.push(productData);
        } catch (error) {
          console.error(`Error reading product file ${file}:`, error);
        }
      }
    } else {
      console.warn(`Products directory for language ${normalizedLang} does not exist`);
    }
    
    return products;
  } catch (error) {
    console.error(`Error in getAllProducts:`, error);
    return [];
  }
}

/**
 * Updates a product in the i18n directory
 * @param product The updated product data
 * @param lang Optional language code (defaults to 'vie')
 * @returns True if updated successfully, false otherwise
 */
export async function updateProduct(product: Product, lang = 'vie'): Promise<boolean> {
  try {
    const normalizedLang = normalizeLanguageCode(lang);
    return await saveProduct(product, normalizedLang);
  } catch (error) {
    console.error(`Error updating product ${product.id}:`, error);
    return false;
  }
}

/**
 * Synchronize products between languages or from products.json to i18n structure
 * @param sourceFile Optional path to source JSON file (if not specified, copies from one language to another)
 * @param sourceLang Source language (defaults to 'vie')
 * @param targetLang Target language (defaults to 'eng')
 */
export async function synchronizeProducts(
  sourceFile?: string,
  sourceLang = 'vie',
  targetLang = 'eng'
): Promise<void> {
  try {
    // Normalize language codes
    const normalizedSourceLang = normalizeLanguageCode(sourceLang);
    const normalizedTargetLang = normalizeLanguageCode(targetLang);
    
    // Ensure product directories exist
    ensureProductDirectory(normalizedSourceLang);
    ensureProductDirectory(normalizedTargetLang);
    
    let sourceProducts: Product[] = [];
    
    // If source file is provided, read from it
    if (sourceFile && fs.existsSync(sourceFile)) {
      const fileContent = fs.readFileSync(sourceFile, 'utf-8');
      sourceProducts = JSON.parse(fileContent) as Product[];
      console.log(`Read ${sourceProducts.length} products from source file`);
    } else {
      // Otherwise, get products from source language
      sourceProducts = await getAllProducts(normalizedSourceLang);
      console.log(`Read ${sourceProducts.length} products from ${normalizedSourceLang} directory`);
    }
    
    // Save each product to the target language directory
    let successCount = 0;
    for (const product of sourceProducts) {
      if (await saveProduct(product, normalizedTargetLang)) {
        successCount++;
      }
    }
    
    console.log(`Successfully synchronized ${successCount} of ${sourceProducts.length} products to ${normalizedTargetLang}`);
  } catch (error) {
    console.error('Error synchronizing products:', error);
  }
} 