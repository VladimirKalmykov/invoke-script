function runRemoteScript(argv) {
  const {
    query,
    options,
    args
  } = require("@invoke-script/core/extract-argv")(argv);

  if (query) {
    return require("@invoke-script/run")(
      query,
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
