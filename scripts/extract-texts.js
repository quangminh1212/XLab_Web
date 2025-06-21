const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Define the features for organizing translations
const FEATURES = [
  'admin',
  'terms',
  'navigation',
  'auth',
  'home',
  'product',
  'about',
  'common' // For strings that don't fit in other categories
];

// Load existing translations from features
const loadTranslations = (language) => {
  const translations = {};
  
  FEATURES.forEach(feature => {
    const featureFilePath = path.join(__dirname, '../locales', language, 'features', `${feature}.json`);
    if (fs.existsSync(featureFilePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(featureFilePath, 'utf8'));
        // Add feature prefix to keys
        Object.keys(content).forEach(key => {
          const prefixedKey = `${feature}.${key}`;
          translations[prefixedKey] = content[key];
        });
      } catch (error) {
        console.error(`Error loading ${language}/${feature}.json:`, error);
      }
    }
  });
  
  return translations;
};

// Load existing locale files
const viTranslations = loadTranslations('vi');
const enTranslations = loadTranslations('en');

// Define exclusion patterns
const excludePatterns = [
  /node_modules/,
  /.next/,
  /.git/,
  /locales/,
  /dist/,
];

// Define text extraction regex patterns
const extractionPatterns = [
  // JSX text content
  { regex: />([^<>{}]+?)</g, format: text => text.trim() },
  // String literals in component props
  { regex: /(?:title|label|placeholder|alt|description|text)=[\"']([^\"']+)[\"']/g, format: text => text },
  // aria-label attributes
  { regex: /aria-label=[\"']([^\"']+)[\"']/g, format: text => text },
];

// Find all TSX/JSX files
const findAllComponentFiles = () => {
  return glob.sync('src/**/*.@(tsx|jsx|ts|js)', {
    ignore: ['**/node_modules/**', '**/.next/**', '**/locales/**']
  });
};

// Extract potential translation texts from a file
const extractTextsFromFile = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const texts = new Set();
  
  extractionPatterns.forEach(({ regex, format }) => {
    let match;
    while ((match = regex.exec(fileContent)) !== null) {
      const extractedText = match[1].trim();
      if (extractedText && extractedText.length > 1) {
        texts.add(format(extractedText));
      }
    }
  });
  
  return Array.from(texts);
};

// Determine which feature a text likely belongs to
const categorizeText = (text, filePath) => {
  const lowerText = text.toLowerCase();
  const pathSegments = filePath.toLowerCase().split(path.sep);
  
  // Try to determine feature from file path
  for (const feature of FEATURES) {
    if (pathSegments.includes(feature)) {
      return feature;
    }
  }
  
  // Try to determine feature from text content
  if (lowerText.includes('admin') || lowerText.includes('manage')) {
    return 'admin';
  } else if (lowerText.includes('terms') || lowerText.includes('privacy')) {
    return 'terms';
  } else if (lowerText.includes('login') || lowerText.includes('sign in') || lowerText.includes('register')) {
    return 'auth';
  } else if (pathSegments.includes('product') || lowerText.includes('cart')) {
    return 'product';
  } else if (pathSegments.includes('home') || pathSegments.includes('index.tsx')) {
    return 'home';
  } else if (pathSegments.includes('about')) {
    return 'about';
  } else if (pathSegments.includes('nav') || lowerText.includes('menu')) {
    return 'navigation';
  }
  
  // Default to common if no specific feature identified
  return 'common';
};

// Process all components and extract texts
const processComponents = () => {
  const componentFiles = findAllComponentFiles();
  const allTexts = {};
  
  // Initialize with empty arrays for each feature
  FEATURES.forEach(feature => {
    allTexts[feature] = [];
  });
  
  componentFiles.forEach(filePath => {
    if (excludePatterns.some(pattern => pattern.test(filePath))) {
      return;
    }
    
    try {
      const extractedTexts = extractTextsFromFile(filePath);
      extractedTexts.forEach(text => {
        // Skip if already in translations
        const isInTranslations = Object.values(viTranslations).includes(text) || 
                               Object.values(enTranslations).includes(text);
        
        if (!isInTranslations) {
          const feature = categorizeText(text, filePath);
          allTexts[feature].push(text);
        }
      });
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error);
    }
  });
  
  return allTexts;
};

// Generate suggestions for new translations
const generateSuggestions = (extractedTexts) => {
  // Create feature-based suggestions directories
  const viSuggestionDir = path.join(__dirname, '../locales/vi/suggestions');
  const enSuggestionDir = path.join(__dirname, '../locales/en/suggestions');
  
  if (!fs.existsSync(viSuggestionDir)) {
    fs.mkdirSync(viSuggestionDir, { recursive: true });
  }
  
  if (!fs.existsSync(enSuggestionDir)) {
    fs.mkdirSync(enSuggestionDir, { recursive: true });
  }
  
  // Write suggestion files for each feature
  FEATURES.forEach(feature => {
    const texts = extractedTexts[feature];
    if (texts.length === 0) return;
    
    const viSuggestionFile = path.join(viSuggestionDir, `${feature}.json`);
    const enSuggestionFile = path.join(enSuggestionDir, `${feature}.json`);
    
    const viContent = {};
    const enContent = {};
    
    texts.forEach((text, index) => {
      const key = `suggestion${index + 1}`;
      viContent[key] = text; // Vietnamese placeholder same as text
      enContent[key] = text; // English text
    });
    
    fs.writeFileSync(viSuggestionFile, JSON.stringify(viContent, null, 2), 'utf8');
    fs.writeFileSync(enSuggestionFile, JSON.stringify(enContent, null, 2), 'utf8');
  });
  
  // Count total suggestions
  let totalSuggestions = 0;
  Object.values(extractedTexts).forEach(texts => {
    totalSuggestions += texts.length;
  });
  
  return totalSuggestions;
};

// Main execution
console.log('Analyzing component files for potential translations...');
const extractedTexts = processComponents();
const totalSuggestions = generateSuggestions(extractedTexts);

console.log(`Found ${totalSuggestions} potential new translations`);
console.log('Suggestions have been saved to:');
console.log('- locales/vi/suggestions/');
console.log('- locales/en/suggestions/');
console.log('\nReview these files and add appropriate translations to the corresponding feature files.'); 