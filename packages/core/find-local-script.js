const path = require("path");
const fs = require("fs");
const resolveSystemPath = require("./resolve-system-path");
const findParentDirs = require("./find-parent-dirs");
/**
 * Search for shortcut file
 */

module.exports = async function resolveScriptBinaryPath(name, options = {}) {
  const paths = await findParentDirs(".scripts", {
    cwd: options.cwd
  });

  const builtInScripts = path.dirname(require.resolve("@invoke-script/scripts"));
  const systemScriptsPath = await resolveSystemPath("scripts");

  paths.unshift(systemScriptsPath);
  paths.unshift(builtInScripts);

  for (let i = 0; i < paths.length; i++) {
    const scriptsPath = paths[i];

    const scriptPath = path.join(
      scriptsPath,
      `${name}`
    );

    /* Check scripts path containes package.json */
    const packageJsonPath = path.join(
      scriptsPath,
      "package.json"
    );

    if (fs.existsSync(packageJsonPath)) {
      const pj = require(packageJsonPath);

      if (pj && typeof pj.bin === "object") {
        if (pj.bin[name]) {
          return path.resolve(scriptsPath, pj.bin[name]);
        }

        continue; // eslint-disable-line
      }
    }

    if (fs.existsSync(scriptPath)) {
      return scriptPath;
    }
  }

  return false;
};
