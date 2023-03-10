# Installation

Via npm:

```shell
npm i @invoke-script/cli -g
```

Via yarn:

```shell
yarn global add @invoke-script/cli
```

# Tutorial

1. Create a folder with name .scripts at the top of your working directory. It can be a project folder or a folder that includes projects, or the root folder of your drive. Placement of the folder determines the area of the script's visibility. Only children folders will have access to the folder.
2. Open your terminal application, go to your project folder (or that directory to which you have added .scripts folder), Run in the command line `invoke create-script hello-world -c "echo 'Hello, World'"`
3. Run `invoke hello-world`

# Windows hang

Windows is not capable to execute bash scripts from the box. But you can create [node](https://nodejs.org/en/) scripts - they're cross-platform.

To create _node_ script follow scheme:

```shell
invoke create-script testmynode --shell node --ext js -c "console.log('Node works');" 
```
