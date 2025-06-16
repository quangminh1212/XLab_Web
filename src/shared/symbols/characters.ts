/**
 * Special characters and symbols used across the application
 * This file centralizes all special characters for easier maintenance and consistency
 */

export const Characters = {
  // Currency symbols
  CURRENCY: {
    VND: '₫',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
  },
  
  // Mathematical symbols
  MATH: {
    PLUS: '+',
    MINUS: '−',
    MULTIPLY: '×',
    DIVIDE: '÷',
    EQUALS: '=',
    NOT_EQUALS: '≠',
    LESS_THAN: '<',
    GREATER_THAN: '>',
    LESS_THAN_OR_EQUAL: '≤',
    GREATER_THAN_OR_EQUAL: '≥',
    INFINITY: '∞',
    PLUS_MINUS: '±',
  },
  
  // Punctuation
  PUNCTUATION: {
    BULLET: '•',
    MIDDOT: '·',
    ELLIPSIS: '…',
    DASH: '—',
    NDASH: '–',
    QUOTE_LEFT: '"',
    QUOTE_RIGHT: '"',
    QUOTE_SINGLE_LEFT: "'",
    QUOTE_SINGLE_RIGHT: "'",
  },
  
  // Arrows
  ARROWS: {
    RIGHT: '→',
    LEFT: '←',
    UP: '↑',
    DOWN: '↓',
    RIGHT_LONG: '⟶',
    LEFT_LONG: '⟵',
    UP_LONG: '⟰',
    DOWN_LONG: '⟱',
    RIGHT_DOUBLE: '⇒',
    LEFT_DOUBLE: '⇐',
    UP_DOUBLE: '⇑',
    DOWN_DOUBLE: '⇓',
  },
  
  // Special symbols
  SPECIAL: {
    COPYRIGHT: '©',
    REGISTERED: '®',
    TRADEMARK: '™',
    DEGREE: '°',
    PARAGRAPH: '¶',
    SECTION: '§',
    CHECK: '✓',
    CROSS: '✕',
    STAR: '★',
    HOLLOW_STAR: '☆',
    HEART: '♥',
    HOLLOW_HEART: '♡',
  },
  
  // Spaces and invisible characters
  SPACES: {
    NON_BREAKING_SPACE: '\u00A0',
    HAIR_SPACE: '\u200A',
    THIN_SPACE: '\u2009',
    ZERO_WIDTH_SPACE: '\u200B',
  },
}; 