module.exports = {
  coveragePathIgnorePatterns: ["/test", "/node_modules/"],
  setupFilesAfterEnv: ["./jest.setup.js"],
  testEnvironment: "node",
  testMatch: ["**/test/**/*.test.js"],
};
