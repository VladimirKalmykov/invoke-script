Shortcuts API reference
==

# Add shortcut

Add new shortcut

```
invoke --add-shortcut <name> <query> [...options]
```

**Options:**

- `q`, `--query` Query string (if  this option has skipped, the second argument will be used as query)
- `-d`, `--description` Shortcut description (max length 256 symbols)
- `-a`, `--args` Specify command arguments

# Edit shortcut

Edit existen shortcut

```
invoke --edit-shortcut <name> [...options]
```

**Options:**

- `q`, `--query` Query string
- `-d`, `--description` Description (max length 256 symbols)
- `-a`, `--args` Specify command arguments

# Remove shortcut

Remove existen shortcut

```
invoke --remove-shortcut <name>
```

# List shortcuts

List existen shortcuts

```
invoke --shortcuts
```
