// Import các module ngôn ngữ tiếng Việt
import admin from './admin';
import common from './common';
import home from './home';
import testimonials from './testimonials';
import account from './account';

// Hợp nhất tất cả các module lại thành một đối tượng
const vi = {
  admin,
  common,
  home,
  testimonials,
  account,
};

export default vi; 