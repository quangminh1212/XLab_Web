import fs from 'fs/promises';
import path from 'path';
import { Product } from '@/types';

const PRODUCT_DIR = path.join(process.cwd(), 'i8n/eng/product');

/**
 * Get all products from the i18n English product files
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    // Read the product directory
    const files = await fs.readdir(PRODUCT_DIR)
      .then(dirs => dirs.filter(file => file.endsWith('.json')))
      .catch(() => []);

    // Read each product file
    const productsPromises = files.map(async (file) => {
      const filePath = path.join(PRODUCT_DIR, file);
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content) as Product;
    });

    const products = await Promise.all(productsPromises);
    console.log(`Retrieved ${products.length} products from English files`);
    
    return products;
  } catch (error) {
    console.error('Error reading English product files:', error);
    return [];
  }
}

/**
 * Get a product by ID from the i18n English product files
 */
export function getProductById(id: string): Product | null {
  try {
    const filePath = path.join(PRODUCT_DIR, `${id}.json`);
    const content = require(filePath);
    return content as Product;
  } catch (error) {
    console.error(`Error reading English product file for ID ${id}:`, error);
    return null;
  }
}

/**
 * Get published products from the i18n English product files
 */
export async function getPublishedProducts(): Promise<Product[]> {
  const allProducts = await getAllProducts();
  const publishedProducts = allProducts.filter(product => product.isPublished);
  console.log(`Found ${publishedProducts.length} published products in English`);
  return publishedProducts;
} 