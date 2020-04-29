#!/usr/bin/env node
const fs = require("fs");

if (!process.env.INVOKE_SCRIPT_CORE) {
  console.warn("This script should be executed with invoke-script command");
  process.exit(1);
}
const path = require("path");
const echo = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "echo"
));

const resolveSystemPath = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "resolve-system-path"
));

const firstArg = (process.argv[2] || "").replace(/[./]/g, "");

/* Help */
if (firstArg === "--help") {
  echo(`Get invoke home directory

${echo.strong("invoke home")}

Options:
  none
`);
  process.exit(0);
}

const args = require("minimist")(process.argv.slice(2));

try {
  const searchPath = args._.length > 0
    ? args._[0]
    : ".";
  const result = resolveSystemPath(searchPath);

  if (fs.existsSync(result)) {
    echo(result);
  } else {
    throw new Error(`Home resource '${searchPath}' is not exists`);
  }
} catch (e) {
  console.error(e.message); // eslint-disable-line
  process.exit(1);
}
