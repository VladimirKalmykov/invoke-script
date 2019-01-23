function runRemoteScript(argv) {
  const {
    parameters,
    options,
    args
  } = require("@invoke-script/tools/extract-argv")(argv);

  if (parameters.length) {
    return require("@invoke-script/run")(
      parameters[0],
      options,
      args
    );
  }

  return false;
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

    return scriptName && scriptName.includes("//");
  },
  description: "Run custom script",
  handler: runRemoteScript
};
