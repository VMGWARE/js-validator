module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // SonarQube
  collectCoverage: true,
  coverageDirectory: "coverage",
  // Only collect coverage from the src folder
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
};
