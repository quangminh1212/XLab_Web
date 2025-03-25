
// JSX Runtime loader cho Next.js 15
const originalRequire = module.constructor.prototype.require;

module.constructor.prototype.require = function patchedRequire(path) {
  if (path === 'react/jsx-runtime') {
    return {
      jsx: function jsx(type, props) { return { type: type, props: props }; },
      jsxs: function jsxs(type, props) { return { type: type, props: props }; },
      Fragment: Symbol.for('react.fragment')
    };
  }
  
  return originalRequire.apply(this, arguments);
};

module.exports = {};
