import chatgpt from './chatgpt.json';
import grok from './grok.json';
import canva from './canva.json';

// Collection of all products
const products = {
  chatgpt,
  grok,
  canva
};

// Export individual products
export { chatgpt, grok, canva };

// Export all products as an array
export const getAllProducts = () => {
  return Object.values(products);
};

// Get a specific product by ID
export const getProductById = (id: string) => {
  return products[id as keyof typeof products] || null;
};

export default products; 