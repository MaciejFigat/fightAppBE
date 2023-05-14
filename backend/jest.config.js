module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  // setupFilesAfterEnv: ['<rootDir>/tests/testingDB/jest.setup.ts'],
  collectCoverage: false,
}
