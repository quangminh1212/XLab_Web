const fs = require('fs');
const path = require('path');

// Đường dẫn file user
const USER_EMAIL = 'xlab.rnd@gmail.com';
const USER_FILE = path.join(process.cwd(), 'data', 'users', `${USER_EMAIL}.json`);

// Mock cart data để test
const mockCartData = [
  {
    id: 'grok',
    name: 'Grok',
    price: 149000,
    quantity: 5,
    image: '/images/products/grok/grok-1.png',
    version: 'default',
    uniqueKey: 'grok_default_',
  },
  {
    id: 'grok',
    name: 'Grok',
    price: 149000,
    quantity: 1,
    image: '/images/products/grok/grok-1.png',
    version: 'full',
    uniqueKey: 'grok_full_',
  },
];

// Function để update cart trong user file
async function updateUserCart(cartData) {
  try {
    console.log('🛒 Testing cart sync...\n');

    // Đọc file user hiện tại
    if (!fs.existsSync(USER_FILE)) {
      console.error(`❌ User file not found: ${USER_FILE}`);
      return;
    }

    const userData = JSON.parse(fs.readFileSync(USER_FILE, 'utf8'));
    console.log('📄 Current user data loaded');
    console.log('   Current cart items:', userData.cart.length);

    // Update cart data
    userData.cart = cartData;
    userData.metadata.lastUpdated = new Date().toISOString();

    // Tạo backup trước khi update
    const backupFile = `${USER_FILE}.backup.${Date.now()}`;
    fs.writeFileSync(backupFile, JSON.stringify(userData, null, 2));
    console.log('💾 Backup created:', path.basename(backupFile));

    // Ghi lại file user với cart mới
    fs.writeFileSync(USER_FILE, JSON.stringify(userData, null, 2));

    console.log('✅ Cart data updated successfully!');
    console.log('   New cart items:', cartData.length);
    console.log(
      '   Total quantity:',
      cartData.reduce((sum, item) => sum + item.quantity, 0),
    );
    console.log(
      '   Total value:',
      cartData.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString('vi-VN') +
        ' VND',
    );

    // Verify data
    const verifyData = JSON.parse(fs.readFileSync(USER_FILE, 'utf8'));
    console.log('\n🔍 Verification:');
    console.log(
      '   Cart saved correctly:',
      verifyData.cart.length === cartData.length ? '✅' : '❌',
    );
    console.log(
      '   Timestamp updated:',
      verifyData.metadata.lastUpdated !== userData.metadata.lastUpdated ? '✅' : '❌',
    );

    // Print cart details
    console.log('\n📋 Cart Details:');
    verifyData.cart.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name} (${item.version || 'default'})`);
      console.log(`      Price: ${item.price.toLocaleString('vi-VN')} VND`);
      console.log(`      Quantity: ${item.quantity}`);
      console.log(`      Subtotal: ${(item.price * item.quantity).toLocaleString('vi-VN')} VND`);
      console.log(`      UniqueKey: ${item.uniqueKey}`);
      console.log('');
    });

    return true;
  } catch (error) {
    console.error('❌ Error updating cart:', error);
    return false;
  }
}

// Function để clear cart
async function clearUserCart() {
  try {
    console.log('🧹 Clearing user cart...\n');

    if (!fs.existsSync(USER_FILE)) {
      console.error(`❌ User file not found: ${USER_FILE}`);
      return;
    }

    const userData = JSON.parse(fs.readFileSync(USER_FILE, 'utf8'));
    userData.cart = [];
    userData.metadata.lastUpdated = new Date().toISOString();

    fs.writeFileSync(USER_FILE, JSON.stringify(userData, null, 2));
    console.log('✅ Cart cleared successfully!');

    return true;
  } catch (error) {
    console.error('❌ Error clearing cart:', error);
    return false;
  }
}

// Function để show current cart
function showCurrentCart() {
  try {
    console.log('📋 Current Cart Status:\n');

    if (!fs.existsSync(USER_FILE)) {
      console.error(`❌ User file not found: ${USER_FILE}`);
      return;
    }

    const userData = JSON.parse(fs.readFileSync(USER_FILE, 'utf8'));

    console.log(`👤 User: ${userData.profile.name} (${userData.profile.email})`);
    console.log(`💰 Balance: ${userData.profile.balance.toLocaleString('vi-VN')} VND`);
    console.log(`🛒 Cart Items: ${userData.cart.length}`);
    console.log(`📅 Last Updated: ${userData.metadata.lastUpdated}`);

    if (userData.cart.length > 0) {
      console.log('\n📋 Cart Items:');
      userData.cart.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name} (${item.version || 'default'})`);
        console.log(`      Price: ${item.price.toLocaleString('vi-VN')} VND x ${item.quantity}`);
        console.log(`      Subtotal: ${(item.price * item.quantity).toLocaleString('vi-VN')} VND`);
      });

      const total = userData.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      console.log(`\n💵 Total: ${total.toLocaleString('vi-VN')} VND`);
    } else {
      console.log('   (Cart is empty)');
    }
  } catch (error) {
    console.error('❌ Error reading cart:', error);
  }
}

// Main function
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'show':
      showCurrentCart();
      break;

    case 'test':
      const success = await updateUserCart(mockCartData);
      if (success) {
        console.log('\n🎉 Cart sync test completed successfully!');
        console.log('📝 Instructions:');
        console.log('   1. Refresh your browser page');
        console.log('   2. Check if cart items appear');
        console.log('   3. Try adding/removing items');
        console.log('   4. Check server logs for API calls');
      }
      break;

    case 'clear':
      const cleared = await clearUserCart();
      if (cleared) {
        console.log('✅ Cart cleared. Refresh browser to see changes.');
      }
      break;

    default:
      console.log('🛒 Cart Sync Test Tool\n');
      console.log('Usage:');
      console.log('  node scripts/test-cart-sync.js show   - Show current cart');
      console.log('  node scripts/test-cart-sync.js test   - Add test cart data');
      console.log('  node scripts/test-cart-sync.js clear  - Clear cart');
      console.log('');
      console.log('Current status:');
      showCurrentCart();
  }
}

// Run
main().catch(console.error);
