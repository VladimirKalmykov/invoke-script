const minimist = require("minimist");

module.exports = function parseArgv(argv) {
  return minimist(argv);
};
