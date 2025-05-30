// Utility functions để backup và restore dữ liệu localStorage
export class LocalStorageBackup {
  
  // Backup tất cả dữ liệu localStorage của user
  static backupUserData(userEmail: string): string {
    if (typeof window === 'undefined') return '';
    
    const userData: { [key: string]: string } = {};
    const keys = Object.keys(localStorage);
    
    // Lọc ra các key liên quan đến user
    const userKeys = keys.filter(key => 
      key.includes(userEmail) || 
      key.startsWith('orders_') || 
      key.startsWith('user_profile_') ||
      key.startsWith('notification_settings_')
    );
    
    // Backup từng key
    userKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        userData[key] = value;
      }
    });
    
    const backupData = {
      timestamp: new Date().toISOString(),
      userEmail,
      data: userData
    };
    
    return JSON.stringify(backupData, null, 2);
  }
  
  // Restore dữ liệu từ backup
  static restoreUserData(backupString: string): boolean {
    try {
      const backupData = JSON.parse(backupString);
      
      if (!backupData.data || typeof backupData.data !== 'object') {
        throw new Error('Invalid backup format');
      }
      
      // Restore từng key
      Object.entries(backupData.data).forEach(([key, value]) => {
        if (typeof value === 'string') {
          localStorage.setItem(key, value);
        }
      });
      
      console.log(`Restored backup from ${backupData.timestamp} for user ${backupData.userEmail}`);
      return true;
    } catch (error) {
      console.error('Error restoring backup:', error);
      return false;
    }
  }
  
  // Kiểm tra và khôi phục dữ liệu nếu bị mất
  static checkAndRestore(userEmail: string): boolean {
    const orderKey = `orders_${userEmail}`;
    const orderData = localStorage.getItem(orderKey);
    
    // Nếu không có dữ liệu orders, thử tìm backup gần nhất
    if (!orderData || orderData === '[]') {
      const backupKey = `backup_${userEmail}`;
      const backupData = localStorage.getItem(backupKey);
      
      if (backupData) {
        console.log('Found backup data, attempting restore...');
        return this.restoreUserData(backupData);
      }
    }
    
    return false;
  }
  
  // Tự động backup định kỳ
  static autoBackup(userEmail: string): void {
    const backupKey = `backup_${userEmail}`;
    const backupData = this.backupUserData(userEmail);
    
    if (backupData) {
      localStorage.setItem(backupKey, backupData);
      console.log('Auto backup completed for user:', userEmail);
    }
  }
  
  // Export dữ liệu để download
  static exportUserData(userEmail: string): void {
    const backupData = this.backupUserData(userEmail);
    
    if (!backupData) {
      alert('Không có dữ liệu để xuất!');
      return;
    }
    
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xlab_backup_${userEmail.replace('@', '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  // Import dữ liệu từ file
  static importUserData(): Promise<boolean> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve(false);
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const success = this.restoreUserData(content);
          resolve(success);
        };
        reader.readAsText(file);
      };
      
      input.click();
    });
  }
} 