// Import các module ngôn ngữ tiếng Việt
import about from './about';
import account from './account';
import admin from './admin';
import common from './common';
import contact from './contact';
import home from './home';
import login from './login';
import terms from './terms';
import testimonials from './testimonials';
import warranty from './warranty';

// Hợp nhất tất cả các module lại thành một đối tượng
const vie = {
  admin,
  common,
  home,
  testimonials,
  account,
  about,
  contact,
  warranty,
  login,
  terms,
};

export default vie; 