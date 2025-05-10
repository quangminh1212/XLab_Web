/**
 * Script to handle 404 errors for static files with timestamp query parameters
 * This script is loaded in the main HTML document
 */

(function() {
  // Watch for resource load errors
  window.addEventListener('error', function(e) {
    // Check if this is a resource loading error
    if (e.target && (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK') && e.target.src) {
      const url = e.target.src || e.target.href;
      
      // Check if the URL contains a timestamp parameter
      if (url && url.includes('?v=')) {
        console.log('Caught 404 error for versioned file:', url);
        
        // Extract the base URL without query parameters
        const baseUrl = url.split('?')[0];
        
        // Create a new element to replace the failed one
        const newElement = document.createElement(e.target.tagName);
        
        // Copy attributes from old element to new one
        Array.from(e.target.attributes).forEach(attr => {
          if (attr.name !== 'src' && attr.name !== 'href') {
            newElement.setAttribute(attr.name, attr.value);
          }
        });
        
        // Set the URL without timestamp
        if (e.target.tagName === 'SCRIPT') {
          newElement.src = baseUrl;
        } else if (e.target.tagName === 'LINK') {
          newElement.href = baseUrl;
        }
        
        // Replace the old element if possible
        if (e.target.parentNode) {
          e.target.parentNode.replaceChild(newElement, e.target);
          console.log('Replaced with non-versioned URL:', baseUrl);
        }
        
        // Prevent the default error handler
        e.preventDefault();
        return false;
      }
    }
  }, true);
  
  console.log('Timestamp handler initialized for static file versioning');
})();