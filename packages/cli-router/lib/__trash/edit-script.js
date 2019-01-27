function editScript() {
  console.log("Edit script");
}

module.exports = {
  match: argv => argv[0] === "--edit-script",
  description: "Edit script",
  handler: editScript
};
