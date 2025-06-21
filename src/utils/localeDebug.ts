/**
 * Locale Debug Utility - Provides comprehensive debugging for locale/i18n across the application
 */

import { LanguageKeys } from '@/locales';

// Debug levels
export enum DebugLevel {
  NONE = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  VERBOSE = 4
}

// Global debug configuration
// Read from environment variable if available
const envDebugLevel = typeof process !== 'undefined' && 
  process.env.LOCALE_DEBUG_LEVEL !== undefined ? 
  parseInt(process.env.LOCALE_DEBUG_LEVEL) : 
  (process.env.NODE_ENV === 'development' ? DebugLevel.INFO : DebugLevel.ERROR);

let debugLevel = 
  !isNaN(envDebugLevel) && 
  envDebugLevel >= DebugLevel.NONE && 
  envDebugLevel <= DebugLevel.VERBOSE ? 
  envDebugLevel : 
  (process.env.NODE_ENV === 'development' ? DebugLevel.INFO : DebugLevel.ERROR);

let enableConsoleGroups = true;
let trackMissingTranslations = true;

// Store for missing translations
interface MissingTranslation {
  key: string;
  language: LanguageKeys;
  requestedTimes: number;
  lastRequested: Date;
  contexts: string[];
}

const missingTranslationStore: Record<string, MissingTranslation> = {};

/**
 * Set the debug level for locale debugging
 */
export function setLocaleDebugLevel(level: DebugLevel): void {
  debugLevel = level;
  logDebug('Locale debug level set to', Object.keys(DebugLevel)[level], 'INFO');
}

/**
 * Get current debug level
 */
export function getDebugLevel(): DebugLevel {
  return debugLevel;
}

/**
 * Enable or disable console groups for better visualization
 */
export function setConsoleGroups(enable: boolean): void {
  enableConsoleGroups = enable;
}

/**
 * General purpose logging function for locale debugging
 */
export function logDebug(message: string, data?: any, level: keyof typeof DebugLevel = 'INFO'): void {
  const numericLevel = DebugLevel[level];
  
  if (numericLevel <= debugLevel) {
    const timestamp = new Date().toISOString();
    const prefix = `[Locale Debug ${timestamp}]`;
    
    switch (level) {
      case 'ERROR':
        console.error(prefix, message, data !== undefined ? data : '');
        break;
      case 'WARN':
        console.warn(prefix, message, data !== undefined ? data : '');
        break;
      case 'INFO':
        console.info(prefix, message, data !== undefined ? data : '');
        break;
      case 'VERBOSE':
        console.log(prefix, message, data !== undefined ? data : '');
        break;
      default:
        console.log(prefix, message, data !== undefined ? data : '');
    }
  }
}

/**
 * Log missing translation
 */
export function logMissingTranslation(key: string, language: LanguageKeys, context?: string): void {
  if (!trackMissingTranslations || debugLevel < DebugLevel.WARN) return;
  
  const id = `${language}:${key}`;
  
  if (missingTranslationStore[id]) {
    missingTranslationStore[id].requestedTimes++;
    missingTranslationStore[id].lastRequested = new Date();
    
    // Add context if not already present
    if (context && !missingTranslationStore[id].contexts.includes(context)) {
      missingTranslationStore[id].contexts.push(context);
    }
  } else {
    missingTranslationStore[id] = {
      key,
      language,
      requestedTimes: 1,
      lastRequested: new Date(),
      contexts: context ? [context] : []
    };
  }
  
  // Only log to console if debugging is set to appropriate level
  if (debugLevel >= DebugLevel.WARN) {
    console.warn(`[Locale Missing] "${key}" in ${language}${context ? ` (context: ${context})` : ''}`);
  }
}

/**
 * Log language switch
 */
export function logLanguageSwitch(from: LanguageKeys, to: LanguageKeys, trigger?: string): void {
  if (debugLevel >= DebugLevel.INFO) {
    logDebug(`Language switched from ${from} to ${to}${trigger ? ` (triggered by: ${trigger})` : ''}`, undefined, 'INFO');
  }
}

/**
 * Log language initialization
 */
export function logLanguageInit(language: LanguageKeys, source: 'localStorage' | 'default' | 'url' | 'user'): void {
  if (debugLevel >= DebugLevel.INFO) {
    logDebug(`Language initialized to ${language} (source: ${source})`, undefined, 'INFO');
  }
}

/**
 * Generate a report of missing translations
 */
export function generateMissingTranslationsReport(): void {
  if (!enableConsoleGroups) {
    logDebug('Missing Translations Summary', Object.values(missingTranslationStore), 'INFO');
    return;
  }
  
  console.group('📊 Locale Debug: Missing Translations Report');
  
  const languages = Array.from(
    new Set(Object.values(missingTranslationStore).map(item => item.language))
  );
  
  languages.forEach(language => {
    const langMissing = Object.values(missingTranslationStore)
      .filter(item => item.language === language)
      .sort((a, b) => b.requestedTimes - a.requestedTimes);
    
    if (langMissing.length > 0) {
      console.group(`${language} (${langMissing.length} missing keys)`);
      langMissing.forEach(item => {
        console.log(
          `"${item.key}": requested ${item.requestedTimes} times` + 
          (item.contexts.length ? `, contexts: ${item.contexts.join(', ')}` : '')
        );
      });
      console.groupEnd();
    }
  });
  
  console.groupEnd();
}

/**
 * Clear stored missing translations
 */
export function clearMissingTranslations(): void {
  Object.keys(missingTranslationStore).forEach(key => {
    delete missingTranslationStore[key];
  });
  logDebug('Cleared missing translations store', undefined, 'INFO');
}

/**
 * Enable or disable tracking missing translations
 */
export function setTrackMissingTranslations(enable: boolean): void {
  trackMissingTranslations = enable;
  logDebug(`${enable ? 'Enabled' : 'Disabled'} tracking of missing translations`, undefined, 'INFO');
}

/**
 * Log translation resolution
 */
export function logTranslationResolution(key: string, language: LanguageKeys, result: string, fallback: boolean = false): void {
  if (debugLevel >= DebugLevel.VERBOSE) {
    logDebug(
      `Translation for "${key}" in ${language}${fallback ? ' (fallback)' : ''}: "${result.substring(0, 30)}${result.length > 30 ? '...' : ''}"`,
      undefined,
      'VERBOSE'
    );
  }
}

// Expose for global debugging in browser console
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__LOCALE_DEBUG = {
    setLocaleDebugLevel,
    getDebugLevel,
    setConsoleGroups,
    logMissingTranslation,
    logLanguageSwitch,
    logLanguageInit,
    generateMissingTranslationsReport,
    clearMissingTranslations,
    setTrackMissingTranslations,
    DebugLevel
  };
} 