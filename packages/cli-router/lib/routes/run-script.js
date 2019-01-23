/* Determine is script used in this request */
function runCustomScript(argv) {
  const {
    query,
    options,
    args
  } = require("@invoke-script/tools/extract-argv")(argv);

  return require("@invoke-script/from-scripts")(
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

    return scriptName && !scriptName.includes("//");
  },
  description: "Run custom script",
  handler: runCustomScript
};
