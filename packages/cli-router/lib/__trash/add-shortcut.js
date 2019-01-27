function addShortcut() {
  console.log("Add shortcut");
}

module.exports = {
  match: argv => argv[0] === "--add-shortcut",
  usage: "invoke --",
  description: "Add new shortcut",
  handler: addShortcut
};
