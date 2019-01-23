Shortcuts
==

Shortcuts is a powerful feature, that allows you to invoke scripts with the long names in the short way.

```shell
$ invoke --add-shortcut cra npm//create-react-app@1.1.5
```

And then you can call that query as:

```shell
$ invoke cra my-react-project
```

You can see a list of all shortcuts by calling command:

```shell
$ invoke --shortcuts
cra       invoke npm//create-react-app@1.1.5
```

## Described shortcuts

You can add a description to your shortcuts just by specifying parameter `-d` (or `--description`).

```shell
invoke --add-shortcut ghp npm//gh-pages /
  -d 'Publish files to a gh-pages'
```

Also you can add description to an existen shortcut:

```shell
invoke --edit-shortcut cra /
  -d 'Create app with CRA 1.*'
```

Let see the list of shortcuts again:

```shell
$ invoke --shortcuts
cra       Create app with CRA 1.*
ghp       Publish files to a gh-pages
```

## Shortcut groups

You able to separate your shortcuts to the groups. By the default, all shortcuts  belongs to the group `default`.

But you do not need to specify that group name when you calling or naming shortcut.

For example, these two shortcut are identical.

```shell
invoke cra
invoke default/cra
```

But you can create any number of own groups.
```shell
$ invoke --create-group web -d 'My tools for creating web-apps'
```

Let see - your group is added.

```sheel
invoke --groups
web       My tools for creating web-apps
```

Now, you able to add new shortcut to your new group:

```shell
$ invoke --add-shortcut web/cra npm//create-react-app
```

As you see, now the name of shortcut has specified with prefix `web/` telling a program to insert shortcut `cra` into the group `web`.

To call your shortcut from the group just write it name with a group prefix divided by a slash, just like you have been named him.

```shell
$ invoke web/cra my-react-project
```

## Shortcuts with argumnets preset

If you'd wish to preserve some command arguments, you may specify them in option `--args`.

```shell
$ invoke --add-shortcut webpack /
  npm//webpack --args '--json > stats.json'
```

If you pass the additional arguments they will be mixed with preserved.

```shell
$ invoke --preview webpack --config webpack.config.js
invoke npm//webpack --json > stats.json --config webpack.config.js
```

## Api reference

For the ditails read [Shortcuts API reference](api/shortcuts).

----

Want advanced features of scripting? Read about the [Invoke custom scripts](./custom-scripts.md).
