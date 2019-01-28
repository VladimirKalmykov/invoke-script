const path = require("path");

/* Determine is script used in this request */
function runCustomScript(argv) {
  const {
    query,
    options,
    args
  } = require("@invoke-script/core/extract-argv")(argv);

  return require("@invoke-script/from-absolute")(
    query,
    options,
    args
  );
}

module.exports = {
  match: argv => {
    let scriptName;
    // Search first non-option

    for (let i = 0; i < argv.length; i++) {
      if (!argv[i].startsWith("-")) {
        scriptName = argv[i];
        break;
      }
    }

    return path.isAbsolute(scriptName);
  },
  description: "Run custom script",
  handler: runCustomScript
};
