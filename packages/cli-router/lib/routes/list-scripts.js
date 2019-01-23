function listScripts(argv) {
  return require("@invoke-script/cmd-list-scripts")(argv);
}

module.exports = {
  match: argv => argv[0] === "--scripts",
  description: "List scripts",
  handler: listScripts
};
