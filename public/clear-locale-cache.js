/**
 * This script can be run from the browser console to clear any 
 * translation-related caches that might be causing issues.
 * Just copy and paste this entire script into the browser console.
 */

(function() {
  // Clear language setting
  localStorage.removeItem('language');
  
  // Clear any keys that might be related to translations
  const keysToDelete = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.includes('lang') || 
      key.includes('locale') || 
      key.includes('i18n') || 
      key.includes('translation')
    )) {
      keysToDelete.push(key);
    }
  }
  
  // Delete collected keys
  keysToDelete.forEach(key => {
    localStorage.removeItem(key);
    console.log('Deleted:', key);
  });
  
  console.log('Translation cache cleared!');
  console.log('Please refresh the page to load fresh translations.');
  
  // Add a button to refresh the page
  const refreshButton = document.createElement('button');
  refreshButton.innerText = 'Refresh Page';
  refreshButton.style.position = 'fixed';
  refreshButton.style.top = '10px';
  refreshButton.style.right = '10px';
  refreshButton.style.zIndex = '9999';
  refreshButton.style.padding = '10px 15px';
  refreshButton.style.backgroundColor = '#4299e1';
  refreshButton.style.color = 'white';
  refreshButton.style.border = 'none';
  refreshButton.style.borderRadius = '5px';
  refreshButton.style.cursor = 'pointer';
  refreshButton.onclick = function() {
    window.location.reload();
  };
  
  document.body.appendChild(refreshButton);
})(); 