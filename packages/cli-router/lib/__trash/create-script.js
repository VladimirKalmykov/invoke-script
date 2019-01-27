function createScript(argv) {
  return require("@invoke-script/cmd-create-script")(argv);
}

module.exports = {
  match: argv => argv[0] === "--create-script",
  description: "Create new script",
  handler: createScript
};
