  <meta name="description" content="generate flutter code from figma">
  <meta name="title" content="bridged figma plugin. figma to flutter code exporter">


# bridged-figma-plugin (flutter code builder from figma design)
> a figma to flutter code exporter

## Development guide


### Pre-requisites

- [Node.js](https://nodejs.org/)
- [Figma desktop app](https://figma.com/downloads/)

### Building the plugin

First:

```
$ yarn install
```

```
$ yarn run webpack:watch
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


### DISCLAIMER
re-use of this software and it's license is overrided by [contributing-and-license](https://github.com/bridgedxyz/contributing-and-license)

the initial commit of this project was inspired by [FigmaToCode](https://github.com/bernaferrari/FigmaToCode) , which was (is) under GPL-3.0 License License. By this acknowledgement Bridged have done all legal obligation operations.
(the current source is all overriten, no origin source remaining. if you want to see legacy logics, go link above)