/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/singleton.ts"],
};
