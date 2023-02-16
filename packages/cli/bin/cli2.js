#!/usr/bin/env node

const path = require("path");
const factory = require("@invoke-script/factory");
const {
  findScriptInPaths,
  listScriptsInPaths,
  findParentDirectories
} = require("@invoke-script/core");
const {
  isValidScript
} = require("@invoke-script/is");
const invoke = factory();

/* Direct run specified path to package or a file */
/*
 * invoke.use("run", run);
 * invoke.use(absoluteScripts)
 * invoke.use(systemScripts)
 * invoke.use(scriptFromParents)
 */
invoke
  .resolve((req, next) => {
    if (path.isAbsolute(req.query)) {
      if (isValidScript(req.query)) {
        return req.query;
      }

      return new Error("Passed resource is not executable");
    }
    next();
  })
  .ls(() => []);

/* Resolve scripts in the system directory */
const systemScripts = "path/to/system";

invoke
  .resolve((req, next) => {
    const script = findScriptInPaths(req.query, [ systemScripts ]);

    if (script) {
      return script;
    }

    next();
  })
  .ls(() => listScriptsInPaths([ systemScripts ]))
  .lsLoc(() => [ systemScripts ]);

/* Support invoke script from the parent directories */
invoke
  .resolve(async ({
    query, cwd
  }, next) => {
    const paths = await findParentDirectories(".scripts", {
      cwd
    });
    const script = findScriptInPaths(query, paths);

    if (script) {
      return script;
    }

    next();
  })

  /* List all aviable scripts */
  .ls(async ({
    cwd
  }) => {
    const paths = await findParentDirectories(".scripts", {
      cwd
    });

    return listScriptsInPaths(paths);
  })

  /* List all script locations */
  .lsLoc(() => findParentDirectories(".scripts"));

invoke.route(() => new Error("Unknown script"));

invoke.handle(process);
