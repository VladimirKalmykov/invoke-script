#!/usr/bin/env node
if (!process.env.INVOKE_SCRIPT_CORE) {
  console.warn("This script should be executed with invoke-script command");
  process.exit(1);
}

const fs = require("fs");
const path = require("path");

const NAME_REGEX = /^[a-z0-9-_]$/i;
const QUERY_REGEX = /^[a-z0-9-_]\/\/[^\s]+$/i;

const echo = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "echo"
));

if (process.argv[2] === "--help") {
  echo(`Add shortcut

${echo.strong("invoke add-shortcut")} <name> <query>
`);
} else {
  const args = require("minimist")(process.argv.slice(2));
  const shortcutsPath = require(path.join(
    process.env.INVOKE_SCRIPT_CORE,
    "resolve-system-path"
  ))("shortcuts");

  /* Check shortcut exists */
  const [
    name,
    query
  ] = args._;

  /* Validate name */
  if (!NAME_REGEX.test(name)) {
    echo(`The shortcut name must be matched pattern ${echo.strong(NAME_REGEX.toString())}`);
    process.exit(1);
  }

  /* Validate query */
  if (!QUERY_REGEX.test(query)) {
    echo(`The shortcut query must be matched pattern ${echo.strong(QUERY_REGEX.toString())}`);
    process.exit(1);
  }

  /* Check for shortcut exists */
  const shortcutPath = path.join(
    shortcutsPath,
    name
  );

  if (fs.existsSync(shortcutPath)) {
    echo(`Shortcut with name ${name} already exists`);
    process.exit(1);
  }

  require(path.join(
    process.env.INVOKE_SCRIPT_CORE,
    "write-script"
  ));
}
