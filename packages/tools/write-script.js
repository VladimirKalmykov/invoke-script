const path = require("path");
const resolveSystemPath = require("./resolve-system-path");
const Bailout = require("./bailout");
const shelljs = require("shelljs");
const fs = require("fs");

module.exports = async function writeScript(section, name, {
  code,
  shell = "bash",
  description,
  forceOverride
}) {
  const scriptsPath = resolveSystemPath("scripts");
  const content = `#!/usr/bin/env ${shell}
${code}`;

  if (!fs.existsSync(path.join(scriptsPath, section))) {
    throw new Bailout("You can not create script inside unexisten section.", 1, `You may create new section with command:
    invoke --create-section <name> -d <description>
`);
  }

  const scriptPath = path.join(scriptsPath, section, name);

  if (!forceOverride && fs.existsSync(scriptPath)) {
    throw new Bailout("Script with a such name already exists");
  }

  // Create dir
  await fs.mkdirSync(scriptPath);
  // Create package.json
  fs.writeFileSync(
    path.join(scriptPath, "package.json"),
    JSON.stringify({
      name: `${section}/${name}`,
      description,
      bin: "main"
    })
  );
  const binaryPath = path.join(scriptPath, "main");
  // Create main

  fs.writeFileSync(
    binaryPath,
    content
  );
  // Set chmod +x
  shelljs.chmod("+x", binaryPath);
};
