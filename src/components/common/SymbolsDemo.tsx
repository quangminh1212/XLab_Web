'use client';

import React from 'react';
import { 
  Icons, 
  Characters, 
  Patterns, 
  FontFamilies, 
  FontWeights, 
  TextFormatters,
  Layout,
  Colors
} from '@/shared/symbols';

interface SymbolsDemoProps {
  title?: string;
  showColors?: boolean;
  showIcons?: boolean;
  showCharacters?: boolean;
  showPatterns?: boolean;
  showTypography?: boolean;
}

export const SymbolsDemo: React.FC<SymbolsDemoProps> = ({
  title = 'Symbols System Demo',
  showColors = true,
  showIcons = true,
  showCharacters = true,
  showPatterns = false, // Default to false as patterns can be large
  showTypography = true,
}) => {
  return (
    <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-lg">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      
      {/* Icons Demo */}
      {showIcons && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Icons</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-700 rounded-lg">
              <Icons.Facebook />
              <span className="mt-2 text-sm">Facebook</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-700 rounded-lg">
              <Icons.Twitter />
              <span className="mt-2 text-sm">Twitter</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-700 rounded-lg">
              <Icons.Search />
              <span className="mt-2 text-sm">Search</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-700 rounded-lg">
              <Icons.ShoppingCart />
              <span className="mt-2 text-sm">ShoppingCart</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-700 rounded-lg">
              <Icons.Success />
              <span className="mt-2 text-sm">Success</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-700 rounded-lg">
              <Icons.Error />
              <span className="mt-2 text-sm">Error</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Characters Demo */}
      {showCharacters && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Characters</h2>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Currency</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {Object.entries(Characters.CURRENCY).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-700 rounded-lg">
                  <span className="text-xl">{value}</span>
                  <span className="mt-2 text-sm">{key}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Arrows</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {Object.entries(Characters.ARROWS).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-700 rounded-lg">
                  <span className="text-xl">{value}</span>
                  <span className="mt-2 text-sm">{key}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Special</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {Object.entries(Characters.SPECIAL).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-700 rounded-lg">
                  <span className="text-xl">{value}</span>
                  <span className="mt-2 text-sm">{key}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Typography Demo */}
      {showTypography && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Typography</h2>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Formatters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Format Price:</p>
                <p>{TextFormatters.formatPrice(1250000)}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Format Date:</p>
                <p>{TextFormatters.formatDate(new Date())}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Format Number:</p>
                <p>{TextFormatters.formatNumber(1234567)}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Truncate:</p>
                <p>{TextFormatters.truncate('This is a very long text that will be truncated', 20)}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">To Title Case:</p>
                <p>{TextFormatters.toTitleCase('hello world')}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Format Phone Number:</p>
                <p>{TextFormatters.formatPhoneNumber('0912345678')}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Font Families</h3>
            <div className="space-y-2">
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Primary:</p>
                <p style={{ fontFamily: FontFamilies.PRIMARY }}>The quick brown fox jumps over the lazy dog.</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Secondary:</p>
                <p style={{ fontFamily: FontFamilies.SECONDARY }}>The quick brown fox jumps over the lazy dog.</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Monospace:</p>
                <p style={{ fontFamily: FontFamilies.MONOSPACE }}>The quick brown fox jumps over the lazy dog.</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Font Weights</h3>
            <div className="space-y-2">
              {Object.entries(FontWeights).map(([key, value]) => (
                <div key={key} className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{key}:</p>
                  <p style={{ fontWeight: value }}>The quick brown fox jumps over the lazy dog.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Colors Demo */}
      {showColors && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Colors</h2>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Brand Colors</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-2">Primary</p>
                <div className="grid grid-cols-5 md:grid-cols-11 gap-1">
                  {Object.entries(Colors.BRAND.PRIMARY).map(([key, value]) => (
                    <div key={key} className="flex flex-col items-center text-xs">
                      <div className="w-full h-8 rounded-md" style={{ backgroundColor: value }}></div>
                      <span>{key}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm mb-2">Secondary</p>
                <div className="grid grid-cols-5 md:grid-cols-11 gap-1">
                  {Object.entries(Colors.BRAND.SECONDARY).map(([key, value]) => (
                    <div key={key} className="flex flex-col items-center text-xs">
                      <div className="w-full h-8 rounded-md" style={{ backgroundColor: value }}></div>
                      <span>{key}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm mb-2">Accent</p>
                <div className="grid grid-cols-5 md:grid-cols-11 gap-1">
                  {Object.entries(Colors.BRAND.ACCENT).map(([key, value]) => (
                    <div key={key} className="flex flex-col items-center text-xs">
                      <div className="w-full h-8 rounded-md" style={{ backgroundColor: value }}></div>
                      <span>{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Semantic Colors</h3>
            <div className="space-y-4">
              {Object.entries(Colors.SEMANTIC).map(([category, colorObj]) => (
                <div key={category}>
                  <p className="text-sm mb-2">{category}</p>
                  <div className="grid grid-cols-5 md:grid-cols-11 gap-1">
                    {Object.entries(colorObj).map(([key, value]) => (
                      <div key={key} className="flex flex-col items-center text-xs">
                        <div className="w-full h-8 rounded-md" style={{ backgroundColor: value as string }}></div>
                        <span>{key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Patterns Demo */}
      {showPatterns && (
        <div>
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Patterns</h2>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Background Patterns</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(Patterns.BACKGROUNDS).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <div 
                    className="h-32 w-full rounded-md border border-slate-300 dark:border-slate-600" 
                    style={{ backgroundImage: value, backgroundColor: '#1e293b' }}
                  ></div>
                  <span className="mt-2 text-sm">{key}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymbolsDemo; 