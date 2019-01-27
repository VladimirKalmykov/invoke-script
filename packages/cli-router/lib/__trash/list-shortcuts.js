function listShortcuts() {
  const appDir = require("@invoke-script/core/resolve-system-path")();

  console.log("List shortcuts", appDir);
}

module.exports = {
  match: argv => argv[0] === "---shortcuts",
  description: "Display list of the shortcuts",
  handler: listShortcuts
};
