function removeShortcut() {
  console.log("Remove shortcut");
}

module.exports = {
  match: argv => argv[0] === "--remove-shortcut",
  description: "Remove shortcut",
  handler: removeShortcut
};
