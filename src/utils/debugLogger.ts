/**
 * Debug Logging Utility
 * 
 * A simple utility to help track application initialization and component mounting
 * with sequential step numbering, timestamps, and structured logging.
 */

// Track the sequence of events
let stepCounter = 0;

// Store logs for inspection in browser
const logHistory: LogEntry[] = [];

interface LogEntry {
  step: number;
  timestamp: string;
  type: 'info' | 'warn' | 'error' | 'success';
  component: string;
  message: string;
  data?: any;
}

/**
 * Log a debug message with step tracking
 */
export function debugLog(
  component: string, 
  message: string, 
  data?: any, 
  type: 'info' | 'warn' | 'error' | 'success' = 'info'
) {
  stepCounter++;
  const timestamp = new Date().toISOString();
  
  const entry: LogEntry = {
    step: stepCounter,
    timestamp,
    type,
    component,
    message,
    data
  };
  
  // Store in history
  logHistory.push(entry);
  
  // Format console output with emoji indicators and step numbers
  const emoji = type === 'info' ? 'ℹ️' : 
                type === 'warn' ? '⚠️' : 
                type === 'error' ? '❌' : 
                '✅';
                
  const logPrefix = `${emoji} [${stepCounter}] [${component}]`;
  
  // Log to console with appropriate type
  switch (type) {
    case 'error':
      console.error(`${logPrefix} ${message}`, data !== undefined ? data : '');
      break;
    case 'warn':
      console.warn(`${logPrefix} ${message}`, data !== undefined ? data : '');
      break;
    case 'success':
      console.log(`%c${logPrefix} ${message}`, 'color: green; font-weight: bold;', data !== undefined ? data : '');
      break;
    default:
      console.log(`${logPrefix} ${message}`, data !== undefined ? data : '');
  }
  
  // Also log to DOM if possible for when console isn't visible
  if (typeof document !== 'undefined') {
    try {
      let debugElement = document.getElementById('debug-log-container');
      
      if (!debugElement) {
        debugElement = document.createElement('div');
        debugElement.id = 'debug-log-container';
        debugElement.style.position = 'fixed';
        debugElement.style.bottom = '0';
        debugElement.style.right = '0';
        debugElement.style.maxWidth = '400px';
        debugElement.style.maxHeight = '200px';
        debugElement.style.overflow = 'auto';
        debugElement.style.backgroundColor = 'rgba(0,0,0,0.8)';
        debugElement.style.color = 'white';
        debugElement.style.fontSize = '10px';
        debugElement.style.padding = '5px';
        debugElement.style.fontFamily = 'monospace';
        debugElement.style.zIndex = '9999';
        document.body.appendChild(debugElement);
      }
      
      const logLine = document.createElement('div');
      logLine.style.borderBottom = '1px solid rgba(255,255,255,0.2)';
      logLine.style.padding = '2px 0';
      
      // Color based on type
      if (type === 'error') logLine.style.color = '#ff5555';
      if (type === 'warn') logLine.style.color = '#ffcc00';
      if (type === 'success') logLine.style.color = '#55ff55';
      
      logLine.textContent = `[${stepCounter}] ${component}: ${message}`;
      debugElement.appendChild(logLine);
      
      // Scroll to bottom
      debugElement.scrollTop = debugElement.scrollHeight;
    } catch (e) {
      // Silently fail if DOM manipulation fails
    }
  }
}

/**
 * Get all logs for display in debug UI
 */
export function getDebugLogs(): LogEntry[] {
  return logHistory;
}

/**
 * Clear all stored logs
 */
export function clearDebugLogs(): void {
  logHistory.length = 0;
  stepCounter = 0;
}

/**
 * Utility to log errors with stack traces
 */
export function logError(component: string, error: any): void {
  debugLog(
    component,
    error?.message || 'Unknown error',
    {
      stack: error?.stack,
      name: error?.name,
      componentStack: error?.componentStack
    },
    'error'
  );
}

export default {
  log: debugLog,
  getAll: getDebugLogs,
  clear: clearDebugLogs,
  logError
}; 