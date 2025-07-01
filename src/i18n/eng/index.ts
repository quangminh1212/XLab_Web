// Import English language modules
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

// Merge all modules into one object
const eng = {
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
};

export default eng; 