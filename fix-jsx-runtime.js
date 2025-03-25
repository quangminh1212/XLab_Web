// File này giúp patching React/JSX runtime cho các thư viện như next-auth
// với Next.js 15
const React = require('react');

if (!global.React) {
  global.React = React;
}

const runtime = require('react/jsx-runtime');

if (!global.runtime) {
  global.runtime = runtime;
}

// Đảm bảo module là khả dụng khi next-auth tìm kiếm
module.exports = runtime; 