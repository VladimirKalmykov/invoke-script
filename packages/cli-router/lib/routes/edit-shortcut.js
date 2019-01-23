function editShortcut() {
  console.log("Edit shortcut");
}

module.exports = {
  match: argv => argv[0] === "--edit-shortcut",
  description: "Edit shortcut",
  handler: editShortcut
};
