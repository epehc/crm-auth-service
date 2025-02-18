module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    transformIgnorePatterns: [
      "/node_modules/(?!@epehc/sharedutilities)"
    ],
    resetModules: true,  // force each test file to load fresh modules
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
    },
    transformIgnorePatterns: [
      "/node_modules/(?!@epehc/sharedutilities)"
    ],
    moduleFileExtensions: ["ts", "js", "json", "node"],
    moduleNameMapper: {
      "^@epehc/sharedutilities/(.*)$":
        "<rootDir>/node_modules/@epehc/sharedutilities/$1",
    },
    testMatch: [
      "**/?(*.)+(spec|test).ts",
      "!**/tests/integration tests/**"
    ],
  };
  
  