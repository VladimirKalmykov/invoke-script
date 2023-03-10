const path = require("path");

/* Determine if script used in this request */
function runCustomScript(argv) {
  const {
    query,
    options,
    args
  } = require("@invoke-script/core/extract-argv")(argv);

  const absQuery = query.startsWith(".") ? path.resolve(process.cwd(), query) : query;

  return require("@invoke-script/from-absolute")(
    absQuery,
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

    return path.isAbsolute(scriptName) || scriptName.startsWith(".");
  },
  description: "Run custom script",
  handler: runCustomScript
};
