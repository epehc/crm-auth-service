module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    resetModules: true,  // force each test file to load fresh modules
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: ["**/tests/integration tests/**/*.(test|spec).(ts|js)"],
  };