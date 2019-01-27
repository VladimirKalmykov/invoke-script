const path = require("path");
const fs = require("fs");

module.exports = function resolveScriptBinary(scriptPath) {
  try {
    // Query the entry
    const stats = fs.lstatSync(scriptPath);

    // Is it a directory?
    if (stats.isDirectory()) {
      /* If script is a directory, then we should find its package.json */
      const scriptPackage = path.join(
        scriptPath,
        "package.json"
      );

      if (fs.existsSync(scriptPackage)) {
        const packageInfo = require(scriptPackage);

        if (packageInfo.bin) {
          return path.resolve(scriptPath, packageInfo.bin);
        }
      }
    } else {
      return scriptPath;
    }
  } catch (e) {
    return false;
  }

  return false;
};
