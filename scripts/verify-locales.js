const fs = require('fs');
const path = require('path');

// Language codes and their language names
const languages = {
  eng: 'English',
  vie: 'Vietnamese',
  spa: 'Spanish'
};

// This function checks if text is likely a specific language
function detectLanguage(text) {
  // Simple language detection based on character patterns and common words
  
  // Vietnamese-specific characters
  const vieChars = 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ';
  // Spanish-specific characters
  const spaChars = 'áéíóúüñ¿¡';

  // Common words unique to each language
  const vieWords = ['của', 'và', 'các', 'những', 'trong', 'không', 'chúng', 'với', 'được', 'để', 'tôi', 'bạn', 'cái', 'này', 'là', 'có'];
  const spaWords = ['el', 'la', 'los', 'las', 'de', 'en', 'con', 'por', 'para', 'es', 'son', 'está', 'y', 'o', 'pero', 'como', 'qué', 'su', 'sus', 'mi', 'mis'];
  const engWords = ['the', 'of', 'and', 'to', 'in', 'is', 'are', 'with', 'for', 'your', 'our', 'that', 'this'];

  // Count characters unique to specific languages
  let vieCharCount = 0;
  let spaCharCount = 0;
  let vieWordCount = 0;
  let spaWordCount = 0;
  let engWordCount = 0;

  // Convert to lowercase for better matching
  const lowercaseText = text.toLowerCase();

  // Count occurrences of language-specific characters
  for (const char of lowercaseText) {
    if (vieChars.includes(char)) {
      vieCharCount++;
    } else if (spaChars.includes(char)) {
      spaCharCount++;
    }
  }

  // Count occurrences of language-specific words
  const words = lowercaseText.split(/\s+/);
  for (const word of words) {
    const cleanWord = word.replace(/[^\p{L}\p{N}]+/gu, ''); // Remove punctuation
    if (vieWords.includes(cleanWord)) {
      vieWordCount++;
    }
    if (spaWords.includes(cleanWord)) {
      spaWordCount++;
    }
    if (engWords.includes(cleanWord)) {
      engWordCount++;
    }
  }

  // Weighted scoring for language detection
  const vieScore = vieCharCount * 2 + vieWordCount * 5;
  const spaScore = spaCharCount * 2 + spaWordCount * 5;
  const engScore = engWordCount * 5;

  // Detect language based on scores
  if (vieScore > spaScore && vieScore > engScore && vieScore > 10) {
    return 'vie';
  }
  if (spaScore > vieScore && spaScore > engScore && spaScore > 10) {
    return 'spa';
  }
  if (engScore > vieScore && engScore > spaScore && engScore > 10) {
    return 'eng';
  }
  
  // Fallback to character-based detection if word detection isn't conclusive
  if (vieCharCount > spaCharCount * 3 && vieCharCount > 5) {
    return 'vie';
  }
  if (spaCharCount > vieCharCount * 3 && spaCharCount > 5) {
    return 'spa';
  }
  
  return 'unknown'; // Unable to determine
}

// Main verification function
async function verifyLocales() {
  const localesDir = path.join(__dirname, '../src/locales');
  const results = {
    total: 0,
    correct: 0,
    incorrect: 0,
    issues: []
  };

  // Process each language directory
  for (const langCode of Object.keys(languages)) {
    const langDir = path.join(localesDir, langCode);
    
    if (!fs.existsSync(langDir)) {
      console.log(`Warning: Directory does not exist: ${langDir}`);
      continue;
    }
    
    // Get all .ts files in the language directory
    const files = fs.readdirSync(langDir).filter(file => file.endsWith('.ts'));
    
    for (const file of files) {
      // Skip index.ts as it doesn't contain actual translations
      if (file === 'index.ts') continue;
      
      // Skip productsData.ts as it contains data rather than translations
      if (file === 'productsData.ts') continue;
      
      const filePath = path.join(langDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Extract the actual translation text
      const contentMatches = fileContent.match(/'[^']*'/g);
      if (!contentMatches) continue;
      
      // Combine all translation values to detect language
      const translationValues = contentMatches
        .map(match => match.substring(1, match.length - 1))
        .filter(value => value.length > 3) // Skip very short values
        .join(' ');
      
      const detectedLanguage = detectLanguage(translationValues);
      results.total++;
      
      // Check if the detected language matches the directory language
      if (detectedLanguage === 'unknown' || detectedLanguage === langCode) {
        results.correct++;
      } else {
        results.incorrect++;
        results.issues.push({
          file: path.relative(localesDir, filePath),
          expected: langCode,
          detected: detectedLanguage,
          // Include a sample of the content for review
          sample: translationValues.substring(0, 100) + '...'
        });
      }
    }
  }
  
  // Print results
  console.log('\nLocale Verification Results:');
  console.log(`Total files checked: ${results.total}`);
  console.log(`Correct language: ${results.correct}`);
  console.log(`Potential issues: ${results.incorrect}`);
  
  if (results.issues.length > 0) {
    console.log('\nFiles with potential language mismatch:');
    results.issues.forEach(issue => {
      console.log(`- ${issue.file}: Expected ${languages[issue.expected]}, detected ${languages[issue.detected] || 'unknown'}`);
      console.log(`  Sample: "${issue.sample}"`);
    });
  } else {
    console.log('\nAll locale files appear to be using the correct language!');
  }
}

// Run the verification
verifyLocales().catch(console.error); 