const path = require("path");
const fs = require("fs");
const minimatch = require("minimatch");
const glob = require("./glob");
const resolveSystemPath = require("./resolve-system-path");
const dirExists = require("./dir-exists");
const findParentDirs = require("./find-parent-dirs");
const matchKeywords = require("./match-keywords");
const defaultStats = require("./defaults/stats");
const defaultScriptStats = require("./defaults/scriptStats");
const {
  SYSTEM_STATS_FILENAME
} = require("./constants");
/**
 * Search for shortcut file
 */

module.exports = async function resolveLocalScripts(options = {}) {
  const {
    groupByLocation,
    ditailed,
    match,
    keywords
  } = options;

  /* Get stats file */
  const statsPath = await resolveSystemPath(SYSTEM_STATS_FILENAME);
  let stats;

  try {
    stats = require(statsPath);
  } catch (e) {
    stats = defaultStats;
  }

  let result = groupByLocation ? {} : [];

  /* Define paths in order of from */
  const paths = await findParentDirs(".scripts", {
    cwd: options.cwd
  });

  const builtInScripts = path.dirname(require.resolve("@invoke-script/scripts"));
  const customScriptsPath = await resolveSystemPath("scripts");
  const shortcutsPath = await resolveSystemPath("shortcuts");

  paths.push(shortcutsPath);
  paths.push(customScriptsPath);
  paths.unshift(builtInScripts);

  for (let i = 0; i < paths.length; i++) {
    const scriptsPath = paths[i];
    let hereResult = result;

    if (groupByLocation) {
      result[scriptsPath] = {
        path: scriptsPath,
        description: "",
        scripts: []
      };
      hereResult = result[scriptsPath].scripts;
    }

    /* Check scripts path containes package.json */
    const packageJsonPath = path.join(
      scriptsPath,
      "package.json"
    );
    let packageJson = false;
    let isBinProvided = false;

    if (fs.existsSync(packageJsonPath)) {
      try {
        packageJson = require(packageJsonPath);

        // Match keywords
        if (keywords && keywords.length > 0 && typeof packageJson.bin === "object") {
          if (
            !(packageJson.keywords &&
            Array.isArray(packageJson.keywords)) ||
            !matchKeywords(keywords, packageJson.keywords)
          ) {
            continue; // eslint-disable-line
          }
        }

        result[scriptsPath].description = packageJson.description;
      } catch (e) {
        // Invalid package.json
      }

      if (packageJson && typeof packageJson.bin === "object") {
        isBinProvided = true;
        const scripts = Object.keys(packageJson.bin)
          /* Match if it's required by options.match */
          .filter(name => (match
            ? minimatch(name, match)
            : true))
          /* Transform to ditailed output if it's required by options.group */
          .map(name => {
            const scriptPath = path.resolve(scriptsPath, packageJson.bin[name]);

            return {
              name,
              path: scriptPath,
              directory: scriptsPath,
              location: scriptsPath,
              description: packageJson["bin-descriptions"]
                ? packageJson["bin-descriptions"][name] || ""
                : "",
              stats: stats.scripts[scriptPath] || defaultScriptStats
            };
          });

        hereResult.push(...scripts);
      }
    }

    if (!isBinProvided) {
      const files = await glob(options.match || "!(*.*)", {
        cwd: scriptsPath
      });

      for (let fi = 0; fi < files.length; fi++) {
        const file = files[fi];
        const filepath = path.join(scriptsPath, file);
        let description = "";
        let directory = false;
        // Validate script

        if (dirExists(filepath)) {
          directory = filepath;
          /*
           * If script is a file
           * Check for its package.json
           */
          try {
            const packageJson = require(path.join(
              filepath,
              "package.json"
            ));

            // Match keywords
            if (keywords && keywords.length > 0) {
              if (
                !(packageJson.keywords &&
                Array.isArray(packageJson.keywords)) ||
                !matchKeywords(keywords, packageJson.keywords)
              ) {
                continue; // eslint-disable-line
              }
            }

            description = packageJson.description || "";
          } catch (e) {
            // Package.json have not founded
            continue; // eslint-disable-line
          }
        } else if (keywords && keywords.length > 0) {
          /*
           * Single files can not have keywords, so it will be exlcuded
           * from output if user has specified keywords
           */
          continue; // eslint-disable-line
        }
        const info = {
          name: file,
          path: filepath,
          location: scriptsPath,
          directory,
          description,
          stats: stats.scripts[filepath] || defaultScriptStats
        };

        hereResult.push(info);
      }
    }
  }

  if (!ditailed) {
    result = result.map(scriptInfo => scriptInfo.name);
  }

  return result;
};
