/*
 * Search directories by named. placed in all parent directories
 */
const path = require("path");
const findParentDir = require("find-parent-dir");

module.exports = function searchParentDirectories(name, {
  cwd
}) {
  return new Promise(resolve => {
    const paths = [];

    function reFingParentDir(dir) {
      findParentDir(dir, name, (err, dir) => {
        if (err || !dir) {
          resolve(paths);
        } else {
          paths.push(path.join(dir, name));
          reFingParentDir(path.resolve(dir, "../"));
        }
      });
    }
    reFingParentDir(cwd);
  });
};
