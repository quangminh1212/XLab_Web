// Import các module ngôn ngữ tiếng Việt
import admin from './admin';
import common from './common';
import home from './home';
import { testimonials } from './testimonials';
import { terms } from './terms';
import account from './account';
import about from './about';
import contact from './contact';
import warranty from './warranty';
import login from './login';
import { terms } from './terms';

// Hợp nhất tất cả các module lại thành một đối tượng
const vie = {
  terms,
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