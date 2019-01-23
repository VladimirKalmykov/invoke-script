Query hooks
==

When a script becomes too useful, you always have an idea how to save it for use on other machines or by other users. The only correct way to reuse the script is to publish it.

But in the process of developing such a script, it will be useful to be able to edit it and use it simultaneously. In that way you may add special hook, that provides ability to call your package using its real public name, but in fact run it from the local file system.

```shell
invoke --hook-query `npm//make-awesome` \
  -c './Users/me/projects/npm/make-awesome/bin/cli.js "$@"'
```

Then, each time you invoke `npm//make-awesome` this package won't be searching at npm registry, instead will be executed script, specified in the hook.
