'use client';

import React from 'react';
import Button from '@/components/common/Button';
import { Icons } from '@/shared/symbols';

export default function ButtonDemoPage() {
  const iconNames = Object.keys(Icons) as Array<keyof typeof Icons>;
  
  // Select a few common icons for the demo
  const demoIcons = ['Search', 'ShoppingCart', 'User', 'Success', 'Error', 'Info'];
  
  return (
    <div className="p-6 bg-slate-100 dark:bg-slate-800 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Button Component Demo</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Button Variants</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <div className="flex flex-col gap-2 items-center">
              <Button variant="primary">Primary</Button>
              <span className="text-sm mt-2 text-slate-600 dark:text-slate-400">Primary</span>
            </div>
            
            <div className="flex flex-col gap-2 items-center">
              <Button variant="secondary">Secondary</Button>
              <span className="text-sm mt-2 text-slate-600 dark:text-slate-400">Secondary</span>
            </div>
            
            <div className="flex flex-col gap-2 items-center">
              <Button variant="outline">Outline</Button>
              <span className="text-sm mt-2 text-slate-600 dark:text-slate-400">Outline</span>
            </div>
            
            <div className="flex flex-col gap-2 items-center">
              <Button variant="ghost">Ghost</Button>
              <span className="text-sm mt-2 text-slate-600 dark:text-slate-400">Ghost</span>
            </div>
            
            <div className="flex flex-col gap-2 items-center">
              <Button variant="danger">Danger</Button>
              <span className="text-sm mt-2 text-slate-600 dark:text-slate-400">Danger</span>
            </div>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Button Sizes</h2>
          
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex flex-col gap-2 items-center">
              <Button size="sm">Small</Button>
              <span className="text-sm mt-2 text-slate-600 dark:text-slate-400">Small</span>
            </div>
            
            <div className="flex flex-col gap-2 items-center">
              <Button size="md">Medium</Button>
              <span className="text-sm mt-2 text-slate-600 dark:text-slate-400">Medium</span>
            </div>
            
            <div className="flex flex-col gap-2 items-center">
              <Button size="lg">Large</Button>
              <span className="text-sm mt-2 text-slate-600 dark:text-slate-400">Large</span>
            </div>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Buttons with Icons</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {demoIcons.map((iconName) => (
              <div key={iconName} className="flex flex-col gap-2 items-center">
                <Button icon={iconName as keyof typeof Icons}>{iconName}</Button>
                <span className="text-sm mt-2 text-slate-600 dark:text-slate-400">
                  {iconName} (Left)
                </span>
              </div>
            ))}
            
            {demoIcons.map((iconName) => (
              <div key={`${iconName}-right`} className="flex flex-col gap-2 items-center">
                <Button 
                  icon={iconName as keyof typeof Icons} 
                  iconPosition="right"
                >
                  {iconName}
                </Button>
                <span className="text-sm mt-2 text-slate-600 dark:text-slate-400">
                  {iconName} (Right)
                </span>
              </div>
            ))}
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Button States</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col gap-2 items-center">
              <Button disabled>Disabled</Button>
              <span className="text-sm mt-2 text-slate-600 dark:text-slate-400">Disabled</span>
            </div>
            
            <div className="flex flex-col gap-2 items-center">
              <Button isLoading>Loading</Button>
              <span className="text-sm mt-2 text-slate-600 dark:text-slate-400">Loading</span>
            </div>
            
            <div className="flex flex-col gap-2 items-center">
              <Button fullWidth>Full Width</Button>
              <span className="text-sm mt-2 text-slate-600 dark:text-slate-400">Full Width</span>
            </div>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">Custom Styling</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex flex-col gap-2 items-center">
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                icon="Success"
              >
                Custom Style
              </Button>
              <span className="text-sm mt-2 text-slate-600 dark:text-slate-400">
                Custom Gradient
              </span>
            </div>
            
            <div className="flex flex-col gap-2 items-center">
              <Button 
                variant="outline"
                className="border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                icon="Info"
                iconProps={{ color: '#3b82f6' }}
              >
                Custom Outline
              </Button>
              <span className="text-sm mt-2 text-slate-600 dark:text-slate-400">
                Custom Outline with Colored Icon
              </span>
            </div>
          </div>
        </section>
        
        <div className="text-center py-8">
          <p>This page demonstrates how to use the Button component with our symbols system.</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Icons are imported from the symbols system and used within the Button component.
          </p>
        </div>
      </div>
    </div>
  );
} 