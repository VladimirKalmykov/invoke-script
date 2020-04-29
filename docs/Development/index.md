Invoke-script
==

The tool helps you organize and get fast access your utilities via CLI

```shell
# Show list of the all aviable scripts
invoke ls -gd

# Show list of the most used utilities
# (FUTURE PLANS)
invoke ls-favor

# Invoke script by its name
invoke myscript

# Show script binary location
invoke which myscript

# Invoke script directly from npm
invoke npx:my-npm-script

# Invoke script directly from github gist
invoke gist:morulus/3c8bc7a424304fe6be64bf5f7a4a3485

# Show path to invoke-script home directory
invoke home
```

# Register command

You can add new command to the local computer

```shell
invoke register-command \
  --name ops \
  --protocol gist \
  --uri morulus/3c8bc7a424304fe6be64bf5f7a4a3485
```

After this command will be aviable to invoke

```shell
invoke ops
```

Or you can add command registry file:

```shell
invoke registry add gist:morulus/3c8bc7a424304fe6be64bf5f7a4a3485/com.yaml
```

Registry file is a YAML with followed structure:

```yaml
name: my-best-commands
commands:
  projects-list:
    protocol: gist
    uri: morulus/3c8bc7a424304fe6be64bf5f7a4a3485/active-projects.md
    shell: invoke cat
    description: List all active projects
  projects:
    protocol: gist
    uri: morulus/3c8bc7a424304fe6be64bf5f7a4a3485/script.yaml
    shell: invoke
    description: My projects API
```
