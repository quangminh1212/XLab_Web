import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.(ts|tsx|js)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  transformIgnorePatterns: ['/node_modules/'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/out/', '/dist/', '/coverage/', '/.next-dev/'],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text-summary', 'lcov'],
};

export default config;

