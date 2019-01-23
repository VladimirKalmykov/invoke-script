Custom scripts
==

If you've read about [shortcuts]('./shortcuts.md'), maybe You'd wish to get more opportunities for the shortcut scripting, and You're right on way to get know of the custom scripts.

The custom scripts works just like the shortcuts, but instead of describing shortcut for reduce long script names, it provides you to create standalone complete script.

```shell
$ invoke --create-script add-gitignore /
  -c 'echo "node_modules" > .gitignore' /
  -d `Create .gitignore`
Script 'add-gitignore' successful added
```

After creating your script you can invoke it just like shortcut.

```shell
$ invoke add-gitignore
```

If you list custom scripts you may be surprised that the list of scripts will contain shortcuts.

```shell
$ invoke --scripts
add-gitignore       Create .gitignore
cra                 npm//create-react-app
```

This is because the shortcuts it's the same scripts, but with certain restrictions.

Script shell
--

By the default script runned with the bash interpreter. You can customize shell for your script by passing parameter `--shell`.

```shell
invoke --create-script add-npmignore /
  --shell node
```

Editing script code
--

If you do not pass parameter `-c` with a source code, after calling command will be automatically opened code editor (by the default, basically, it is [vim](https://www.vim.org/)). This is useful if you want to create multiline script. Finally, it's just more convenient.

But it is expected that you would like to use your favorite IDE as an editor for the script code.

The first method allows you to specify the editor by passing parameter `---editor` (shorted `-e`).

For example, if you prefer to use [Atom](https://atom.io/), your command will looks like follow:

```js
invoke --edit-script my-script --editor 'atom -a'
```

> The Atom provides parameter `-a`, that tells em to open file in current window, this is convenient when you do not want to multiply windows

But if you don't like to write this parameter every time, you can customize it once and forever by defining the variable `code_editor` in the configuration file *~/.invoke-script/config*.

```
[settings]
code_editor=atom -a
```

## Api reference

For the ditails read [Custom scripts API reference](api/shortcuts).
