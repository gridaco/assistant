  <meta name="description" content="generate flutter code from figma, with design linting.">
  <meta name="title" content="bridged figma plugin. figma to flutter code exporter">

# bridged-figma-plugin (flutter code builder from figma design)

> a figma to flutter code exporter

## Development guide

### Pre-requisites

- [Node.js](https://nodejs.org/)
- [Figma desktop app](https://figma.com/downloads/)

### Building the plugin

First:

```sh
$ yarn install

# building for production - this will load production web hosted version in your plugin host
$ yarn run build

# building for development - this will load localhost:3303/init-figma page in to your plugin host
$ yarn run build:dev
$ yarn run watch # same as `build:dev`, but in watch mode. (if you are not interacting with figma-core, you don't have to run this command.)
```

### Installing the plugin

In the Figma desktop app:

- Open a Figma document.
- Go to `Plugins` → `Development` → `New Plugin…`.
- Click the `Click to choose a manifest.json file` box, and select the `manifest.json` file that was generated.

### Debugging

Use `console.log` statements to inspect values in your code.

To open the developer console in the Figma desktop app, go to `Plugins` → `Development` → `Open Console`.

### Docs

- [Create Figma Plugin docs](https://github.com/yuanqing/create-figma-plugin#docs)
- [Figma plugin API docs](https://figma.com/plugin-docs/api/)
- [React plugin](https://www.figma.com/plugin-docs/bundling-react/)
- [Create Figma Plugin](https://github.com/yuanqing/create-figma-plugin)
