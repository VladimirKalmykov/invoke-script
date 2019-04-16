const path = require("path");
const fs = require("fs");
const resolveSystemPath = require("./resolve-system-path");
const findParentDirs = require("./find-parent-dirs");
/**
 * Search for shortcut file
 */

module.exports = async function findLocalScript(name, options = {}) {
  const paths = await findParentDirs(".scripts", {
    cwd: options.cwd || process.cwd()
  });

  const detailed = Boolean(options.detailed);

  const builtInScripts = path.dirname(require.resolve("@invoke-script/scripts"));
  const systemScriptsPath = await resolveSystemPath("scripts");

  paths.unshift(systemScriptsPath);
  paths.unshift(builtInScripts);

  for (let i = 0; i < paths.length; i++) {
    const scriptsPath = paths[i];

    /* Check for multiple bin package */
    const packageJsonPath = path.join(
      scriptsPath,
      "package.json"
    );

    if (fs.existsSync(packageJsonPath)) {
      let pj;

      try {
        pj = require(packageJsonPath);
      } catch (e) {
        pj = null;
      }

      if (pj) {
        if (typeof pj.bin === "object") {
          if (pj.bin[name]) {
            const binary = path.resolve(scriptsPath, pj.bin[name]);

            if (detailed) {
              return {
                name,
                binary,
                directory: scriptsPath,
                description: pj["bin-descriptions"]
                  ? pj["bin-descriptions"][name] || ""
                  : ""
              };
            }

            return binary;
          }
        }
      }
    }
    const scriptPath = path.join(
      scriptsPath,
      `${name}`
    );

    /* Check scripts path containes package.json */
    const scriptPackageJsonPath = path.join(
      scriptPath,
      "package.json"
    );

    if (fs.existsSync(scriptPackageJsonPath)) {
      let pj;

      try {
        pj = require(scriptPackageJsonPath);
      } catch (e) {
        pj = null;
      }

      if (pj && typeof pj.bin === "string") {
        const binary = path.resolve(scriptPath, pj.bin);

        if (detailed) {
          return {
            name,
            binary,
            directory: scriptPath,
            description: pj.description || ""
          };
        }

        return binary;
      }
    } else if (fs.existsSync(scriptPath)) {
      if (fs.statSync(scriptPath).isDirectory()) {
        return false;
      }

      if (detailed) {
        return {
          name,
          binary: scriptPath,
          directory: null,
          description: ""
        };
      }

      return scriptPath;
    }
  }

  return false;
};
