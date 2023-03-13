#!/usr/bin/env node
const fs = require("fs");
const resolveSystemPath = require("@invoke-script/core/resolve-system-path");
const {
  SYSTEM_STATS_FILENAME
} = require("@invoke-script/core/constants");
const systemPath = resolveSystemPath();
const systemPathScripts = resolveSystemPath("scripts");
const systemPathStats = resolveSystemPath(SYSTEM_STATS_FILENAME);


if (!fs.existsSync(systemPath)) {
  fs.mkdirSync(systemPath);
  console.log("System path: CREATED");
} else {
  console.log("System path: OK");
}

if (!fs.existsSync(systemPathScripts)) {
  fs.mkdirSync(systemPathScripts);
  console.log("System path scripts: CREATED");
} else {
  console.log("System path scripts: OK");
}

if (!fs.existsSync(systemPathStats)) {
  fs.writeFileSync(systemPathStats, "{}");
  console.log("System path stats: CREATED");
} else {
  console.log("System path stats: OK");
}
