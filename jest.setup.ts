import '@testing-library/jest-dom';
// Mock next/image to render plain img in tests
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const React = require('react');
    const { src, alt, ...rest } = props;
    return React.createElement('img', { src, alt, ...rest });
  },
}));
// Polyfill Request for NextRequest in route tests
if (typeof (global as any).Request === 'undefined') {
  (global as any).Request = class {} as any;
}
// Polyfill fetch/Response for Next route handlers
import 'whatwg-fetch';




