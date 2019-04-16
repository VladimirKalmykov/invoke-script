const findParentDirs = require("./find-parent-dirs");
const resolveSystemPath = require("./resolve-system-path");

function dedup(arr) {
  return arr.filter((item, index) => index === arr.findIndex(i => i === item));
}

module.exports = async function getScriptPaths(options = {}) {
  const paths = await findParentDirs(".scripts", {
    cwd: options.cwd || process.cwd()
  });

  paths.push(resolveSystemPath("scripts"));

  return dedup(paths);
};
