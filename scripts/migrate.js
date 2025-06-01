const fs = require('fs');
const path = require('path');

// Đường dẫn files
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const TRANSACTIONS_FILE = path.join(process.cwd(), 'data', 'transactions.json');
const USERS_DIR = path.join(process.cwd(), 'data', 'users');

// Tạo tên file từ email
function getFileNameFromEmail(email) {
  return email.replace(/[^a-zA-Z0-9@.-]/g, '_') + '.json';
}

// Đảm bảo thư mục users tồn tại
function ensureUsersDir() {
  if (!fs.existsSync(USERS_DIR)) {
    fs.mkdirSync(USERS_DIR, { recursive: true });
    console.log('✅ Created users directory');
  }
}

// Đọc dữ liệu
function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log(`Could not read ${filePath}:`, error.message);
    return [];
  }
}

// Lưu dữ liệu user
function saveUserData(email, userData) {
  const fileName = getFileNameFromEmail(email);
  const filePath = path.join(USERS_DIR, fileName);
  
  userData.metadata.lastUpdated = new Date().toISOString();
  userData.metadata.version = '1.0';
  
  fs.writeFileSync(filePath, JSON.stringify(userData, null, 2), 'utf8');
  console.log(`✅ Saved data for: ${email}`);
}

// Chạy migration
function migrate() {
  console.log('🚀 Starting migration to individual user files...');
  
  ensureUsersDir();
  
  const users = readJsonFile(USERS_FILE);
  const transactions = readJsonFile(TRANSACTIONS_FILE);
  
  if (users.length === 0) {
    console.log('❌ No users found to migrate');
    return;
  }
  
  console.log(`Found ${users.length} users to migrate`);
  
  for (const user of users) {
    console.log(`Migrating user: ${user.email}`);
    
    // Tìm transactions của user này
    const userTransactions = transactions.filter(t => t.userId === user.id);
    
    // Tạo dữ liệu user đầy đủ
    const userData = {
      profile: user,
      transactions: userTransactions,
      cart: [], // Giỏ hàng trống ban đầu
      settings: {
        notifications: true,
        language: 'vi',
        theme: 'light'
      },
      metadata: {
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      }
    };
    
    saveUserData(user.email, userData);
  }
  
  console.log('✅ Migration completed successfully!');
}

// Chạy migration
migrate(); 