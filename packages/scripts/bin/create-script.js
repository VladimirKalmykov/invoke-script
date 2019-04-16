#!/usr/bin/env node
if (!process.env.INVOKE_SCRIPT_CORE) {
  console.warn("This script should be executed with invoke-script command");
  process.exit(1);
}

const fs = require("fs");
const path = require("path");

const NAME_REGEX = /^[a-z0-9-_]+$/i;

const echo = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "echo"
));

const getScriptPaths = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "get-script-paths"
));

const resolveSystemPath = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "resolve-system-path"
));

if (process.argv[2] === "--help") {
  echo(`Create script in nearest parent .scripts directory

${echo.strong("invoke create-script")} <name>

Options:
  --location, -l) Script location (by the default it is nearest parent .scripts)
  --shell, -s) Shell (Default: bash)
  --code, -c) Source code
  --description, -d) Description
  --ext) Binary file extenstion
  --system) Create in the system scripts directory
  --json, -j) Display report in json format
`);
  process.exit(0);
}

const args = require("minimist")(process.argv.slice(2));

(async function() {
  const userLocation = args.location;

  let nearestPath;

  if (userLocation) {
    if (!require(path.join(
      process.env.INVOKE_SCRIPT_CORE,
      "resolve-system-path"
    ))(userLocation)) {
      echo("Specified location is not a directory");
      process.exit(1);
    } else {
      nearestPath = userLocation;
    }
  } else {
    const systemScriptsPath = resolveSystemPath("scripts");
    const scriptsPaths = await getScriptPaths({
      cwd: args.cwd || process.cwd()
    });

    /* TODO: what about case when no .scripts found */
    nearestPath = args.system ? systemScriptsPath : userLocation || scriptsPaths[0];
  }

  /* Check shortcut exists */
  const [ name ] = args._;

  /* Validate name */
  if (!NAME_REGEX.test(name)) {
    echo("The script name is invalid");
    process.exit(1);
  }

  /* Check for script exists */
  const scriptPath = path.join(
    nearestPath,
    name
  );

  if (fs.existsSync(scriptPath)) {
    echo(`Script with name ${name} already exists`);
    process.exit(1);
  }

  const options = {
    name,
    shell: args.shell || args.s || "bash",
    code: args.code || args.c || "",
    description: args.description || args.d || "",
    ext: args.ext || false
  };

  const {
    directory, binary
  } = await require(path.join(
    process.env.INVOKE_SCRIPT_CORE,
    "write-script"
  ))(scriptPath, options);

  const report = {
    ...options,
    directory,
    path: binary
  };

  if (args.j || args.json) {
    console.log(JSON.stringify(report, null, 1));
  } else {
    console.log(report.path);
  }
}())
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
