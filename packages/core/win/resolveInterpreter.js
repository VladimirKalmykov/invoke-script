const readline = require("readline");
const fs = require("fs");
const path = require("path");

const SHEBANG_REGEX = /^#\!([./a-z0-9A-Z0-9:]*)[ ]?(.*)$/;

function readFirstLine(filename) {
  return new Promise(resolve => {
    const readStream = fs.createReadStream(filename);
    const rl = readline.createInterface({
      input: readStream
    });

    let wasResolved = false;

    rl.on("line", line => {
      wasResolved = true;
      resolve(line);
      rl.close();
    })
      .on("close", () => {
        /*
         * or do it here if there is only one graph
         * displayGraph(buffer);
         */
        rl.close();
        if (!wasResolved) {
          wasResolved = true;
          resolve("");
        }
      });
  });
}

/* This function emulate shebang support */
module.exports = async function resolveInterpreter(filename) {
  const shebang = await readFirstLine(filename);

  let interpreter = "node";
  let args = [];

  if (!shebang) {
    interpreter = "node";

    return [
      interpreter,
      args
    ];
  }

  const match  = SHEBANG_REGEX.exec(shebang);

  if (!match) {
    interpreter = "node";

    return [
      interpreter,
      args
    ];
  }

  const rawInterpreter = match[1];
  const rawArgs = match[2];

  args = rawArgs.split(" ");

  /* Try to resolve file if that is executable */
  if (path.extname(rawInterpreter) === ".exe" && fs.existsSync(rawInterpreter)) {
    interpreter = rawInterpreter;
    /* Support unix style interpeter resolve */
  } else if (rawInterpreter === "/usr/bin/env" && args.length > 0) {
    interpreter = args.shift();
  } else if (rawInterpreter) {
    interpreter = rawInterpreter;
  }

  return [
    interpreter,
    args
  ];
};
