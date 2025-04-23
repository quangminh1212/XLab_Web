'use client';

/**
 * Safe wrapper for web3 that ensures it only runs on the client side
 * and handles the 'call of undefined' error case
 */

// Safe get web3 from window
export function getWeb3() {
  if (typeof window === 'undefined') return null;
  
  // Monkey patch Function.prototype.call to handle undefined calls
  if (!window._web3PatchApplied) {
    const originalCall = Function.prototype.call;
    
    Function.prototype.call = function(...args) {
      if (this === undefined || this === null) {
        console.warn('Web3 fix: Caught call on undefined function');
        return function() { return {}; };
      }
      return originalCall.apply(this, args);
    };
    
    window._web3PatchApplied = true;
    console.log('Web3 patch for "call of undefined" applied');
  }
  
  return window.Web3 ? new window.Web3(window.Web3.givenProvider || 'http://localhost:8545') : null;
}

// Create a promise that resolves when web3 is available
let web3ReadyPromise;

export function waitForWeb3() {
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }
  
  if (!web3ReadyPromise) {
    web3ReadyPromise = new Promise((resolve) => {
      // If already available
      if (window.Web3) {
        resolve(getWeb3());
        return;
      }
      
      // Poll for web3
      const interval = setInterval(() => {
        if (window.Web3) {
          clearInterval(interval);
          resolve(getWeb3());
        }
      }, 100);
      
      // Safety timeout after 5 seconds
      setTimeout(() => {
        clearInterval(interval);
        console.warn('Web3 not available after timeout');
        resolve(null);
      }, 5000);
    });
  }
  
  return web3ReadyPromise;
}

// Add this global type definition
if (typeof window !== 'undefined') {
  window._web3PatchApplied = window._web3PatchApplied || false;
} 