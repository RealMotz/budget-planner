module.exports = {
  verbose: true,
  roots: ["<rootDir>/src/", "<rootDir>/tests/"],
  moduleFileExtensions: ['js', 'vue'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.vue$": "@vue/vue3-jest"
  },
  snapshotSerializers: [
    "<rootDir>/node_modules/jest-serializer-vue"
  ],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"]
  }
}