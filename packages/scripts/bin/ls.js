#!/usr/bin/env node
if (!process.env.INVOKE_SCRIPT_CORE) {
  console.warn("This script should be executed with invoke-script command");
  process.exit(1);
}
const path = require("path");
const echo = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "echo"
));
const parseArgv = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "parse-argv"
));

function parseKeywords(rawKeywords) {
  return rawKeywords
    .split(",")
    .map(keyword => keyword.trim());
}

const firstArg = (process.argv[2] || "").replace(/[./]/g, "");

/* Help */
if (firstArg === "--help") {
  echo(`List all aviable scripts

${echo.strong("invoke ls")} <pattern> [...options]

Options:
  -g, --group-by-location) Group output by the scripts location
  -d, --ditailed) Show script description
  -r, --realpath) Display only paths
  -j, --json) Print result as JSON
  -n, --limit) Max count
  -k, --keywords) List only matched keywords
`);
  process.exit(0);
}

const args = parseArgv(process.argv.slice(2));

const firstParam = args._[0];

// Determine options
const options = {
  groupByLocation: args.g || args["group-by-location"],
  ditailed: args.d || args.ditailed,
  json: args.j || args.json,
  realpath: args.r || args.realpath,
  limit: args.n || args.limit,
  keywords: args.k || args.keywords
};

const keywords = options.keywords
  ? parseKeywords(options.keywords)
  : false;

const findLocalScripts = require(path.join(
  process.env.INVOKE_SCRIPT_CORE,
  "find-local-scripts"
));

// Determine the result is a simple array
const plainResult = Boolean(!options.ditailed || options.realpath);

// Define renderers

// Script renderer
const scriptRenderer = plainResult
  ? scriptName => scriptName
  : script => {
    const {
      name, description
    } = script;

    return `${name} \t${echo.soft(description)}`;
  };

// Extract path from script data
const extractPath = function extractPath(info) {
  return info && info.path;
};

findLocalScripts({
  cwd: process.cwd(),
  ditailed: options.ditailed || options.realpath,
  groupByLocation: options.groupByLocation,
  match: firstParam,
  keywords: keywords || false
})
  /* Transform result */
  .then(result => {
    if (options.realpath) {
      if (options.groupByLocation) {
        const nextResult = {};

        Object.keys(result)
          .forEach(groupName => {
            nextResult[groupName] = Object.assign(
              {},
              result[groupName],
              {
                scripts: result[groupName].scripts.map(extractPath)
              }
            );
          });

        return nextResult;
      }

      return result.map(extractPath);
    }

    return result;
  })

  /* Dedup result */
  .then(result => {
    if (!options.groupByLocation && !options.realpath) {
      return result.filter((item, index) => result.findIndex(anotherItem => (options.ditailed
        ? anotherItem.name === item.name
        : item === anotherItem)) <= index);
    }

    return result;
  })

  /* Limit output */
  .then(result => {
    if (options.limit) {
      return options.groupByLocation
        ? result
        : result.slice(0, options.limit || 0);
    }

    return result;
  })

  .then(result => {
    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
      process.exit(0);
    }
    let output = [];

    if (options.groupByLocation) {
      Object.values(result).forEach(group => {
        if (group.scripts.length) {
          output.push(`${echo.strong(group.description || group.path)}`);
          output = output.concat(group.scripts.map(scriptRenderer));
          output.push("");
        }
      });
    } else {
      output = output.concat(result.map(scriptRenderer));
    }

    echo(output.join("\n"));
  })
  .catch(e => {
    throw e;
  });
