/**
 * Debug Translations Script
 * This script helps identify translation keys being displayed directly on the page.
 * Copy and paste into the browser console to run.
 */

(function() {
  console.log('🔍 Translation Debugger Started');
  
  // Known translation key patterns
  const translationKeyPatterns = [
    /^nav\.[a-z]+$/,
    /^home\.[a-z]+$/,
    /^footer\.[a-z]+$/,
    /^product\.[a-z]+$/,
    /^common\.[a-z]+$/,
    /^system\.[a-z]+$/,
    /^ui\.[a-z]+$/
  ];
  
  // Function to check if a string is likely a translation key
  function isLikelyTranslationKey(text) {
    if (!text || typeof text !== 'string') return false;
    text = text.trim();
    return translationKeyPatterns.some(pattern => pattern.test(text));
  }
  
  // Find all text nodes in the document
  function findTextNodes() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const translationNodes = [];
    const suspiciousElements = [];
    
    let node;
    while ((node = walker.nextNode())) {
      const text = node.nodeValue.trim();
      if (text && isLikelyTranslationKey(text)) {
        translationNodes.push({
          node,
          text,
          element: node.parentElement
        });
        
        // Highlight the element containing the translation key
        const parent = node.parentElement;
        if (parent) {
          parent.style.outline = '2px solid red';
          parent.style.position = 'relative';
          
          // Create a tooltip with debugging information
          const tooltip = document.createElement('div');
          tooltip.style.position = 'absolute';
          tooltip.style.top = '0';
          tooltip.style.left = '0';
          tooltip.style.transform = 'translateY(-100%)';
          tooltip.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
          tooltip.style.color = 'white';
          tooltip.style.padding = '4px 8px';
          tooltip.style.borderRadius = '4px';
          tooltip.style.fontSize = '12px';
          tooltip.style.fontFamily = 'monospace';
          tooltip.style.zIndex = '9999';
          tooltip.style.whiteSpace = 'nowrap';
          tooltip.textContent = `Translation Key: ${text}`;
          
          parent.appendChild(tooltip);
          suspiciousElements.push(parent);
        }
      }
    }
    
    console.log('Found translation keys:', translationNodes.map(n => n.text));
    console.log('Suspicious elements:', suspiciousElements);
    
    // Show count in the UI
    const count = translationNodes.length;
    const resultDiv = document.createElement('div');
    resultDiv.style.position = 'fixed';
    resultDiv.style.bottom = '70px';
    resultDiv.style.right = '10px';
    resultDiv.style.padding = '10px 15px';
    resultDiv.style.backgroundColor = count > 0 ? 'rgba(220, 38, 38, 0.9)' : 'rgba(22, 163, 74, 0.9)';
    resultDiv.style.color = 'white';
    resultDiv.style.fontWeight = 'bold';
    resultDiv.style.borderRadius = '4px';
    resultDiv.style.zIndex = '10000';
    resultDiv.style.fontSize = '14px';
    resultDiv.textContent = count > 0 
      ? `⚠️ Found ${count} untranslated keys` 
      : '✅ No untranslated keys found';
    document.body.appendChild(resultDiv);
    
    // Add button to clear highlights
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear Highlights';
    clearButton.style.position = 'fixed';
    clearButton.style.bottom = '10px';
    clearButton.style.right = '10px';
    clearButton.style.padding = '8px 16px';
    clearButton.style.backgroundColor = '#2563eb';
    clearButton.style.color = 'white';
    clearButton.style.border = 'none';
    clearButton.style.borderRadius = '4px';
    clearButton.style.zIndex = '10000';
    clearButton.style.cursor = 'pointer';
    clearButton.style.fontSize = '14px';
    
    clearButton.onclick = function() {
      suspiciousElements.forEach(el => {
        el.style.outline = '';
        
        // Remove any tooltips we added
        Array.from(el.children).forEach(child => {
          if (child.tagName === 'DIV' && child.textContent.includes('Translation Key:')) {
            el.removeChild(child);
          }
        });
      });
      document.body.removeChild(clearButton);
      document.body.removeChild(resultDiv);
    };
    
    document.body.appendChild(clearButton);
    
    return count;
  }
  
  // Run the search
  const count = findTextNodes();
  if (count > 0) {
    console.error(`⚠️ Found ${count} untranslated keys on the page`);
  } else {
    console.log(`✅ No untranslated keys found on the page`);
  }
})(); 