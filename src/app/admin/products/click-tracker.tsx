'use client';

import { useEffect } from 'react';

export default function ClickTracker() {
  useEffect(() => {
    console.log('ClickTracker mounted');
    // Tạo một đối tượng kiểm soát click hoàn toàn độc lập
    const clickCounter = {
      count: 0,
      
      increment() {
        this.count++;
        this.updateUI();
        console.log(`[DIRECT] Click count: ${this.count}`);
        return this.count;
      },
      
      reset() {
        this.count = 0;
        this.updateUI();
        console.log('[DIRECT] Click count reset');
        return this.count;
      },
      
      updateUI() {
        // Cập nhật tất cả phần tử hiển thị
        document.querySelectorAll('.text-red-600').forEach(el => {
          el.textContent = String(this.count);
        });
        
        // Cập nhật tracker
        const tracker = document.getElementById('click-counter-tracker');
        if (tracker) {
          tracker.textContent = String(this.count);
        }
        
        // Cập nhật title
        document.title = `Count: ${this.count}`;
      },
      
      setupTracker() {
        // Tạo UI tracker chuyên dụng
        const trackerContainer = document.createElement('div');
        trackerContainer.style.position = 'fixed';
        trackerContainer.style.top = '40px';
        trackerContainer.style.right = '10px';
        trackerContainer.style.backgroundColor = 'red';
        trackerContainer.style.color = 'white';
        trackerContainer.style.padding = '5px 10px';
        trackerContainer.style.borderRadius = '5px';
        trackerContainer.style.zIndex = '999999';
        trackerContainer.style.fontFamily = 'monospace';
        trackerContainer.style.fontSize = '14px';
        trackerContainer.style.fontWeight = 'bold';
        
        trackerContainer.innerHTML = `
          <div>CLICK TRACKER: <span id="click-counter-tracker">0</span></div>
          <div style="display: flex; gap: 5px; margin-top: 5px;">
            <button id="click-tracker-increment" style="background: white; color: black; border: none; padding: 3px 5px; border-radius: 3px;">+1</button>
            <button id="click-tracker-reset" style="background: black; color: white; border: none; padding: 3px 5px; border-radius: 3px;">Reset</button>
          </div>
        `;
        
        document.body.appendChild(trackerContainer);
        
        // Thêm event listener cho các nút
        document.getElementById('click-tracker-increment')?.addEventListener('click', () => this.increment());
        document.getElementById('click-tracker-reset')?.addEventListener('click', () => this.reset());
      },
      
      setupGlobalHandlers() {
        // Thêm đối tượng này vào window để có thể truy cập từ bất kỳ đâu
        window.clickTracker = this;
        
        // Lắng nghe tất cả các click trên các nút liên quan
        document.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          
          // Kiểm tra xem có phải nút Thêm sản phẩm
          if (target && 
              (target.textContent?.includes('Thêm sản phẩm') || 
               target.parentElement?.textContent?.includes('Thêm sản phẩm'))
          ) {
            this.increment();
            console.log('Product add button clicked, count:', this.count);
          }
        });
      },
      
      init() {
        this.setupTracker();
        this.setupGlobalHandlers();
        console.log('Click tracker initialized');
      }
    };
    
    // Khởi tạo khi component mount
    setTimeout(() => {
      clickCounter.init();
    }, 1000);
    
    // Cleanup khi component unmount
    return () => {
      const tracker = document.querySelector('[id="click-counter-tracker"]')?.parentElement;
      if (tracker) {
        tracker.remove();
      }
      console.log('ClickTracker unmounted');
    };
  }, []);
  
  // Component này không render gì cả
  return null;
}

// Khai báo type cho window
declare global {
  interface Window {
    clickTracker: {
      count: number;
      increment: () => number;
      reset: () => number;
    };
  }
} 