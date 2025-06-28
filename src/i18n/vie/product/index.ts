import chatgpt from './chatgpt.json';
import grok from './grok.json';

// Collection of all products
const products = {
  chatgpt,
  grok
};

// Export individual products
export { chatgpt, grok };

// Export all products as an array
export const getAllProducts = () => {
  return Object.values(products);
};

// Get a specific product by ID
export const getProductById = (id: string) => {
  return products[id as keyof typeof products] || null;
};

export default products; 