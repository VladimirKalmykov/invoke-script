const resolveSystemPath = require("@invoke-script/tools/resolve-system-path");
const glob = require("@invoke-script/tools/glob");

module.exports = async function() {
  const scriptsPath = resolveSystemPath("scripts");

  const allScripts = await glob("*/*", {
    cwd: scriptsPath
  });

  console.log("allScripts", allScripts);
};
