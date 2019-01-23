/**
 * Get a path inside application directory
 */
const path = require("path");

module.exports = function resolveAppPath(subpath = ".") {
  const appPath = path.join(
    require("os").homedir(),
    ".invoke-script"
  );

  return path.resolve(appPath, subpath);
};
