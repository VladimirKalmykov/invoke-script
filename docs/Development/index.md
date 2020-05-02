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

1. Create a folder with name .scripts at the top of your working directory. It can be a project folder or a folder that includes projects, or the root folder of the drive. Placement of the folder determines the area of the script's visibility.
2. Open your terminal application, go to your project folder (or that directory to which you has added .scripts folder), Run in the command line `invoke create-script hello-world -c "echo 'Hello, World'"`
3. Run `invoke hello-world`

# Windows hang

On OS Windows there're no opportunities to execute shell scripts as well as support shebang syntax