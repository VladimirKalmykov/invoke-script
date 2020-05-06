const fs = require("fs");
const findLocalScript = require("@invoke-script/core/find-local-script");
const runScript = require("@invoke-script/core/run-script");
const Bailout = require("@invoke-script/core/bailout");
const resolveSystemPath = require("@invoke-script/core/resolve-system-path");
const {
  SYSTEM_STATS_FILENAME
} = require("@invoke-script/core/constants");
const defaultStats = require("@invoke-script/core/defaults/stats");
const defaultScriptStats = require("@invoke-script/core/defaults/scriptStats");

module.exports = async function invokeScript(query, options, args) {
  const scriptInfo = await findLocalScript(query, {
    cwd: process.cwd(),
    detailed: true
  });

  if (!scriptInfo) {
    throw new Bailout(`Script ${query} not found`, 1, `List all scripts:
  invoke ls
`);
  }

  if (options.resolve) {
    return scriptInfo.binary;
  }

  /* Collect stats */
  const scriptPath = scriptInfo.path;
  const statsPath = await resolveSystemPath(SYSTEM_STATS_FILENAME);
  let stats;

  try {
    stats = require(statsPath);
  } catch (e) {
    stats = {
      ...defaultStats
    };
  }

  stats.scripts[scriptPath] = stats.scripts[scriptPath] || defaultScriptStats;
  stats.scripts[scriptPath].executedTimes += 1;
  stats.scripts[scriptPath].lastExecuteTimestamp = new Date().getTime();
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));


  await runScript(scriptInfo.binary, args, {
    env: Object.create(process.env)
  });
};
