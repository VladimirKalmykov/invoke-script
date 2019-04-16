const path = require("path");
const Bailout = require("./bailout");
const shelljs = require("shelljs");
const fs = require("fs");

/* TODO: get more possible shell veriant */
function getExtByShell(shell) {
  switch (shell) {
  case "bash":
  case "sh":
    return ".bash";
  case "node":
    return ".js";
  default:
    return "";
  }
}

module.exports = async function writeScript(scriptPath, {
  name,
  code = "",
  shell = "bash",
  description = "",
  ext,
  forceOverride
}) {
  if (!name) {
    throw new Bailout("Script name is required");
  }

  const extension = ext || getExtByShell();
  const content = `#!/usr/bin/env ${shell}
${code}`;

  if (!forceOverride && fs.existsSync(scriptPath)) {
    throw new Bailout("Script with a such name already exists");
  }

  const binaryName = `cli${extension}`;

  // Create dir
  await fs.mkdirSync(scriptPath);
  // Create package.json
  fs.writeFileSync(
    path.join(scriptPath, "package.json"),
    JSON.stringify({
      name,
      description,
      bin: `bin/${binaryName}`
    }, null, 1)
  );
  const binPath = path.join(scriptPath, "bin");

  await fs.mkdirSync(binPath);
  const binaryPath = path.join(binPath, binaryName);

  // Create main
  fs.writeFileSync(
    binaryPath,
    content
  );
  // Set chmod +x
  shelljs.chmod("+x", binaryPath);

  return {
    directory: scriptPath,
    binary: binaryPath
  };
};
