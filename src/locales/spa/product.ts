export const product = {
  // Common product UI elements
  'product.details': 'Detalles del producto',
  'product.description': 'Descripción',
  'product.specifications': 'Especificaciones',
  'product.reviews': 'Reseñas',
  'product.relatedProducts': 'Productos relacionados',
  'product.relatedProductsSubtitle': 'Productos similares que podrían interesarte',
  'product.addToCart': 'Añadir al carrito',
  'product.buyNow': 'Comprar ahora',
  'product.outOfStock': 'Agotado',
  'product.inStock': 'En stock',
  'product.warranty': 'Garantía',
  'product.warranty.days': 'Garantía de 30 días',
  'product.warranty.description': 'Devolución del dinero o reemplazo del producto si no está satisfecho en 30 días',
  'product.support': 'Soporte 24/7',
  'product.support.description': 'Nuestro equipo de soporte técnico siempre está listo para ayudarte',
  'product.documentation': 'Documentación completa',
  'product.documentation.description': 'Guías de usuario detalladas y materiales de referencia',
  'product.needHelp': '¿Necesitas más ayuda con este producto?',
  'product.supportDescription': 'Nuestro equipo de expertos siempre está listo para ayudarte',
  'product.supportEmail': 'Email de soporte',
  'product.emailResponse': 'Respuesta en 24 horas',
  'product.supportPhone': 'Línea directa',
  'product.phoneHours': 'Soporte de 8am-10pm todos los días',
  'product.liveChat': 'Chat en vivo',
  'product.chatDescription': 'Chatea directamente con nuestro personal de soporte',
  'product.startChat': 'Iniciar chat',
  'product.quantity': 'Cantidad',
  'product.options': 'Opciones',
  'product.purchasesPerWeek': '{count}/semana',
  'product.totalSold': '{count} vendidos',
  
  // Product status
  'product.status.draft': 'Borrador',
  'product.status.public': 'Público',
  
  // Product specific descriptions
  products: {
    // ChatGPT product
    chatgpt: {
      'description': 'ChatGPT es un chatbot extremadamente potente en la actualidad. Puede responder a una gran variedad de preguntas tanto en inglés como en vietnamita. Puede proporcionar soporte para programación desde Front-end hasta Back-end. Además, la cuenta ChatGPT tiene la capacidad de responder a muchos tipos diferentes de preguntas, incluyendo aquellas relacionadas con conocimientos, cultura, sociedad y otros campos. ChatGPT es un modelo de lenguaje entrenado con tecnología transformer y desarrollado por OpenAI. Tiene la capacidad de aprender de grandes conjuntos de datos textuales y generar automáticamente respuestas relevantes a las preguntas planteadas. La cuenta ChatGPT se puede utilizar en aplicaciones de chatbot, conversaciones automatizadas y otros sistemas de asesoramiento. También tiene capacidad para automatizar tareas como traducción de texto, autocompletado de formularios y otras tareas relacionadas con el lenguaje.',
      'shortDescription': 'ChatGPT es un chatbot extremadamente potente en la actualidad. Puede responder a una gran variedad de preguntas tanto en inglés como en vietnamita. Puede proporcionar soporte para programación desde Front-end hasta Back-end.'
    },
    
    // Grok product
    grok: {
      'description': 'Grok AI ayuda a analizar y procesar automáticamente grandes conjuntos de datos de manera rápida, apoyando la toma de decisiones precisas y ahorrando tiempo. Ampliamente aplicable en muchos campos.',
      'shortDescription': 'Grok AI ayuda a analizar y procesar datos rápidamente.'
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