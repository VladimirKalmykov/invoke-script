const minimist = require("minimist");
/**
 * Explode argv to option, parameters and post args (intended
 * for remote coomand)
 */

module.exports = function extractArgv(argv) {
  const optionsArray = [];
  const args = [];
  let query;

  /**
   * Separate here options from node args.
   * Here aguments should always be placed before source string
   * purpose === 0 - options
   * purpose === 1 - parameters
   * purpose === 2 - command args
   */
  let purpose = 0;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (!arg.startsWith("-")) {
      if (purpose === 0) {
        query = arg;
        purpose = 2;
      } else if (purpose === 2) {
        args.push(arg);
      }
    } else {
      if (purpose === 1) {
        purpose = 2;
      }
      if (purpose === 0) {
        optionsArray.push(arg);
      } else {
        args.push(arg);
      }
    }
  }

  const options = minimist(optionsArray);

  Reflect.deleteProperty(options, "_");

  return {
    options,
    query,
    args
  };
};
