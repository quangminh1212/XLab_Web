'use client';

import React from 'react';
import { 
  Characters, 
  Colors,
  TextFormatters,
  FontFamilies,
  FontWeights,
  Icons
} from '@/shared/symbols';

export default function SymbolsPage() {
  return (
    <div className="p-6 bg-slate-100 dark:bg-slate-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Hệ thống ký tự và biểu tượng</h1>
        
        {/* Icons Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Biểu tượng</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-8">
            <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-700 rounded-lg">
              <div className="h-12 w-12 flex items-center justify-center">
                <Icons.Facebook className="h-8 w-8 text-blue-600" />
              </div>
              <span className="mt-2 text-sm">Facebook</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-700 rounded-lg">
              <div className="h-12 w-12 flex items-center justify-center">
                <Icons.Twitter className="h-8 w-8 text-blue-400" />
              </div>
              <span className="mt-2 text-sm">Twitter</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-700 rounded-lg">
              <div className="h-12 w-12 flex items-center justify-center">
                <Icons.Search className="h-8 w-8" />
              </div>
              <span className="mt-2 text-sm">Search</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-700 rounded-lg">
              <div className="h-12 w-12 flex items-center justify-center">
                <Icons.ShoppingCart className="h-8 w-8" />
              </div>
              <span className="mt-2 text-sm">ShoppingCart</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-700 rounded-lg">
              <div className="h-12 w-12 flex items-center justify-center">
                <Icons.Success className="h-8 w-8" />
              </div>
              <span className="mt-2 text-sm">Success</span>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-700 rounded-lg">
              <div className="h-12 w-12 flex items-center justify-center">
                <Icons.Error className="h-8 w-8" />
              </div>
              <span className="mt-2 text-sm">Error</span>
            </div>
          </div>
        </section>
        
        {/* Characters Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Ký tự đặc biệt</h2>
          
          {/* Currencies */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">Tiền tệ</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {Object.entries(Characters.CURRENCY).map(([key, value]) => (
                <div key={key} className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-medium">{value}</span>
                    <span className="text-slate-500 dark:text-slate-400">{key}</span>
                  </div>
                  <div className="text-sm mt-2 text-slate-600 dark:text-slate-300">
                    {TextFormatters.formatPrice(1250000, key as any)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Arrows */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">Mũi tên</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {Object.entries(Characters.ARROWS).map(([key, value]) => (
                <div key={key} className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-center">
                  <div className="text-2xl font-medium mb-2">{value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{key}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Special Symbols */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">Biểu tượng đặc biệt</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {Object.entries(Characters.SPECIAL).map(([key, value]) => (
                <div key={key} className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-center">
                  <div className="text-2xl font-medium mb-2">{value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{key}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Typography Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Định dạng văn bản</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">Bộ công cụ định dạng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Định dạng giá</h4>
                <div className="font-medium">{TextFormatters.formatPrice(1250000)}</div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  <code>TextFormatters.formatPrice(1250000)</code>
                </div>
              </div>
              
              <div className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Định dạng ngày tháng</h4>
                <div className="font-medium">{TextFormatters.formatDate(new Date())}</div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  <code>TextFormatters.formatDate(new Date())</code>
                </div>
              </div>
              
              <div className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Rút ngắn văn bản</h4>
                <div className="font-medium">{TextFormatters.truncate('Đây là một đoạn văn bản rất dài sẽ bị cắt ngắn', 20)}</div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  <code>TextFormatters.truncate('text', 20)</code>
                </div>
              </div>
              
              <div className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Chuyển thành dạng tiêu đề</h4>
                <div className="font-medium">{TextFormatters.toTitleCase('xin chào thế giới')}</div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  <code>TextFormatters.toTitleCase('xin chào thế giới')</code>
                </div>
              </div>
              
              <div className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Định dạng số điện thoại</h4>
                <div className="font-medium">{TextFormatters.formatPhoneNumber('0912345678')}</div>
                <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  <code>TextFormatters.formatPhoneNumber('0912345678')</code>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">Font chữ và trọng lượng</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Font chữ chính ({FontFamilies.PRIMARY})</h4>
                <p style={{ fontFamily: FontFamilies.PRIMARY }} className="text-lg">
                  Đây là font chữ chính của ứng dụng. Một con chó nhỏ vừa qua đường.
                </p>
              </div>
              
              <div className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Font chữ phụ ({FontFamilies.SECONDARY})</h4>
                <p style={{ fontFamily: FontFamilies.SECONDARY }} className="text-lg">
                  Đây là font chữ phụ của ứng dụng. Một con chó nhỏ vừa qua đường.
                </p>
              </div>
              
              <div className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Font chữ monospace ({FontFamilies.MONOSPACE})</h4>
                <p style={{ fontFamily: FontFamilies.MONOSPACE }} className="text-lg">
                  Đây là font monospace. Một con chó nhỏ vừa qua đường.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Colors Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Bảng màu</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">Màu chính</h3>
            <div className="space-y-6">
              {Object.entries(Colors.BRAND).map(([category, colorObj]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-base font-medium">{category}</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-11 gap-2">
                    {Object.entries(colorObj).map(([shade, color]) => (
                      <div key={shade} className="flex flex-col items-center">
                        <div 
                          className="w-full h-12 rounded-md shadow-inner"
                          style={{ backgroundColor: color as string }}
                        ></div>
                        <span className="text-xs mt-1">{shade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4">Màu ngữ nghĩa</h3>
            <div className="space-y-6">
              {Object.entries(Colors.SEMANTIC).map(([category, colorObj]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-base font-medium">{category}</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-11 gap-2">
                    {Object.entries(colorObj).map(([shade, color]) => (
                      <div key={shade} className="flex flex-col items-center">
                        <div 
                          className="w-full h-12 rounded-md shadow-inner"
                          style={{ backgroundColor: color as string }}
                        ></div>
                        <span className="text-xs mt-1">{shade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <div className="text-center py-8">
          <p>Trang này hiển thị các thành phần của hệ thống ký tự, biểu tượng và định dạng của XLab.</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Dễ dàng bảo trì và phát triển.</p>
        </div>
      </div>
    </div>
  );
} 