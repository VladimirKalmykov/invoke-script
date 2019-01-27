/* Extract from raw script name a group and script name itself */
module.exports = function parseScriptName(rawName) {
  const parts = rawName.split("/");

  if (parts.length > 2) {
    throw new Error("Script name can includes only one slash");
  }
  const group = parts.length > 1
    ? parts[0]
    : "common";
  const name = parts.length > 1
    ? parts[1]
    : rawName;

  return [
    group,
    name
  ];
};
