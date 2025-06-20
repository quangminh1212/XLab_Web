export const product = {
  // General product UI elements
  'product.details': 'Product Details',
  'product.description': 'Description',
  'product.specifications': 'Specifications',
  'product.reviews': 'Reviews',
  'product.relatedProducts': 'Related Products',
  'product.relatedProductsSubtitle': 'Similar products you might be interested in',
  'product.addToCart': 'Add to Cart',
  'product.buyNow': 'Buy Now',
  'product.outOfStock': 'Out of Stock',
  'product.inStock': 'In Stock',
  'product.warranty': 'Warranty Policy',
  'product.warranty.days': '30-day Warranty',
  'product.warranty.description': 'Money back or product replacement if not satisfied within 30 days',
  'product.support': '24/7 Support',
  'product.support.description': 'Our technical support team is always ready to help you',
  'product.documentation': 'Complete Documentation',
  'product.documentation.description': 'Detailed user guides and reference materials',
  'product.needHelp': 'Need more help with this product?',
  'product.supportDescription': 'Our team of experts is always ready to assist you',
  'product.supportEmail': 'Support Email',
  'product.emailResponse': 'Response within 24 hours',
  'product.supportPhone': 'Hotline',
  'product.phoneHours': 'Support from 8am-10pm daily',
  'product.liveChat': 'Live Chat',
  'product.chatDescription': 'Chat directly with our support staff',
  'product.startChat': 'Start chat',
  'product.purchasesPerWeek': '{count}/week',
  'product.totalSold': '{count} sold',

  // Product status
  'product.status.draft': 'Draft',
  'product.status.public': 'Public',
  
  // Product specific descriptions
  products: {
    // ChatGPT product
    chatgpt: {
      'description': 'ChatGPT is an extremely powerful chatbot in today\'s world. It can answer a wide variety of questions in both English and Vietnamese. It can provide support for programming from Front-end to Back-end. Additionally, the ChatGPT account has the ability to answer many different types of questions, including those related to knowledge, culture, society, and other fields. ChatGPT is a language model trained with transformer technology and developed by OpenAI. It has the ability to learn from large text datasets and automatically generate relevant answers to the questions asked. The ChatGPT account can be used in chatbot applications, automated conversations, and other advisory systems. It also has the ability to automate tasks such as text translation, form auto-completion, and other language-related tasks.',
      'shortDescription': 'ChatGPT is an extremely powerful chatbot in today\'s world. It can answer a wide variety of questions in both English and Vietnamese. It can provide support for programming from Front-end to Back-end.'
    },
    
    // Grok product
    grok: {
      'description': 'Grok AI helps automatically analyze and process large datasets quickly, supporting accurate decision-making and saving time. Widely applicable across many fields.',
      'shortDescription': 'Grok AI helps automatically analyze and process data quickly.'
    }
  }
}; 

// Legacy format for backward compatibility
export const legacyProductTranslations = {
  'product.chatgpt.description': product.products.chatgpt.description,
  'product.chatgpt.shortDescription': product.products.chatgpt.shortDescription,
  'product.grok.description': product.products.grok.description,
  'product.grok.shortDescription': product.products.grok.shortDescription
};