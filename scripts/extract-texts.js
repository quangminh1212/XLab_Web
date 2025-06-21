const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Load existing locale files
const viTranslations = require('../locales/vi/translations.json');
const enTranslations = require('../locales/en/translations.json');

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
  { regex: /(?:title|label|placeholder|alt|description|text)=["']([^"']+)["']/g, format: text => text },
  // aria-label attributes
  { regex: /aria-label=["']([^"']+)["']/g, format: text => text },
];

// Find all TSX/JSX files
const findAllComponentFiles = () => {
  return glob.sync('**/*.{tsx,jsx}', {
    ignore: ['node_modules/**', '.next/**', '.git/**', 'locales/**', 'dist/**']
  });
};

// Extract potential text strings from a file
const extractTextsFromFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const texts = new Set();

  extractionPatterns.forEach(({ regex, format }) => {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const text = format(match[1]);
      
      // Skip if the text is already in translations
      if (
        text && 
        text.length > 2 &&
        !text.startsWith('{') && 
        !text.includes('${') &&
        !text.match(/^\d+$/) &&
        !Object.values(viTranslations).includes(text) &&
        !isAlreadyLocalized(content, text)
      ) {
        texts.add(text);
      }
    }
  });

  return Array.from(texts);
};

// Check if this text is already using the t() function
const isAlreadyLocalized = (content, text) => {
  const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const localizationCheck = new RegExp(`t\\(['"]([^'"]+)['"]\\)[^}]*?${escapedText}`, 'g');
  return localizationCheck.test(content);
};

// Generate a suitable translation key for a text string
const generateTranslationKey = (text, namespace = 'ui') => {
  // Create a key based on the text content
  const baseKey = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '.')
    .substring(0, 30);
  
  return `${namespace}.${baseKey}`;
};

// Process files and generate translation entries
const processFiles = () => {
  const files = findAllComponentFiles();
  const newTranslations = {};
  
  files.forEach(file => {
    const relativePath = path.relative(process.cwd(), file);
    console.log(`Processing ${relativePath}`);
    
    const texts = extractTextsFromFile(file);
    
    texts.forEach(text => {
      // Generate a namespace from the file path
      const pathParts = relativePath.split(path.sep);
      const namespace = pathParts[1] || 'common';
      
      const key = generateTranslationKey(text, namespace);
      
      // Add to new translations object
      if (!viTranslations[key] && !enTranslations[key]) {
        newTranslations[key] = text;
      }
    });
  });
  
  return newTranslations;
};

// Save new translations to separate files
const saveNewTranslations = (newTranslations) => {
  const newKeys = Object.keys(newTranslations);
  
  if (newKeys.length === 0) {
    console.log('No new translations found.');
    return;
  }
  
  console.log(`Found ${newKeys.length} new potential translations.`);
  
  // Create a file with suggested translations
  const viSuggestions = {};
  const enSuggestions = {};
  
  newKeys.forEach(key => {
    const text = newTranslations[key];
    viSuggestions[key] = text;
    enSuggestions[key] = text; // For English, we keep the text as is, since it needs manual translation
  });
  
  // Write to suggestion files
  fs.writeFileSync(
    path.join(process.cwd(), 'locales', 'vi', 'suggestions.json'),
    JSON.stringify(viSuggestions, null, 2)
  );
  
  fs.writeFileSync(
    path.join(process.cwd(), 'locales', 'en', 'suggestions.json'),
    JSON.stringify(enSuggestions, null, 2)
  );
  
  console.log('Wrote suggestions to:');
  console.log('- locales/vi/suggestions.json');
  console.log('- locales/en/suggestions.json');
  console.log('Please review these files and manually add translations to the main translations.json files.');
};

// Main execution
console.log('Extracting texts from components...');
const newTranslations = processFiles();
saveNewTranslations(newTranslations); 