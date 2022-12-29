/*global process, module*/

// vars for the unit-tests...
process.env.LOG_LEVEL = `verbose`;

module.exports = {
    bail: true,
    browser: false,
    verbose: true,
    collectCoverage: true,
    cache: false,
    coverageDirectory: `coverage`,
    coverageReporters: [ `lcov`, `text`, `clover` ],
    collectCoverageFrom: [
        `src/**/*.js`,
        `!src/samples/*.js`,
    ],
    setupFilesAfterEnv: [ `<rootDir>/jest-setup` ],
};
