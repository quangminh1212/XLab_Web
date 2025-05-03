// Polyfill for missing globals that can cause "Cannot read properties of undefined (reading 'call')" errors
if (typeof window !== 'undefined') {
  // Ensure JSON.parse is safe
  const originalJSONParse = JSON.parse;
  JSON.parse = function safeJSONParse(text, reviver) {
    try {
      return originalJSONParse(text, reviver);
    } catch (error) {
      console.error('JSON parse error:', error);
      return {};
    }
  };

  // Make sure global objects exist
  if (!window.process) {
    window.process = { 
      env: { 
        NODE_ENV: process.env.NODE_ENV || 'development' 
      },
      browser: true,
      version: '',
      cwd: function() { return '/' },
    };
  }

  // Ensure Buffer exists
  if (!window.Buffer) {
    window.Buffer = {
      isBuffer: function() { return false; },
      from: function(data) { return data; },
    };
  }

  // Safe function call helper
  window.safeFunctionCall = function(obj, fnName, ...args) {
    if (obj && typeof obj[fnName] === 'function') {
      return obj[fnName](...args);
    }
    return undefined;
  };
} 