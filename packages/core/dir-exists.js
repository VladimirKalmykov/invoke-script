const fs = require("fs");

module.exports = function dirExists(dirPath) {
  try {
    // Query the entry
    const stats = fs.lstatSync(dirPath);

    // Is it a directory?
    if (stats.isDirectory()) {
      return true;
    }
  } catch (e) {
    // Ignore
  }

  return false;
};
