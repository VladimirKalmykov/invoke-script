#!/usr/bin/env node
const fs = require("fs");
const resolveSystenPath = require("@invoke-script/core/resolve-system-path");
const systemPath = resolveSystenPath();
const systemPathScripts = resolveSystenPath("scripts");

if (!fs.existsSync(systemPath)) {
  fs.mkdirSync(systemPath);
}

if (!fs.existsSync(systemPathScripts)) {
  fs.mkdirSync(systemPathScripts);
}
