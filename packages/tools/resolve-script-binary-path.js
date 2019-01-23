const path = require("path");
const fs = require("fs");
const resolveSystemPath = require("./resolve-system-path");
/**
 * Search for shortcut file
 */

module.exports = async function resolveScriptBinaryPath(section, name) {
  const scriptsPath = await resolveSystemPath("scripts");
  const scriptPath = path.join(
    scriptsPath,
    `${section}/${name}`
  );
  const scriptPackage = path.join(
    scriptsPath,
    `${section}/${name}`,
    "package.json"
  );

  if (!fs.existsSync(scriptPackage)) {
    return false;
  }

  const packageInfo = require(scriptPackage);

  return packageInfo.bin
    ? path.resolve(scriptPath, packageInfo.bin)
    : false;
};
