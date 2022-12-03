## [General Contribution Guideline](https://github.com/bridgedxyz/contributing-and-license)

## Access Design (readonly)

**The plugin desing**

The design of the plugin user interface. Here, you can find what to develop.
[figma](https://www.figma.com/file/4hqwYFw6FKw1njvzEl3VUh/figma-plugin?node-id=0%3A1)

**The sample design**

Sample design is used for evaluating code generation quality check. Both good and bad examples are provided. [Link here](https://www.figma.com/file/iypAHagtcSp3Osfo2a7EDz/?node-id=164%3A2621).

## Writing UI codes (React)

If using material-ui, read the following [guidelines](https://material-ui.com/guides/minimizing-bundle-size/).


You can also run / inspect / develop the [ui](./ui) on the browser environment without design tools openned. Instructions available at [webdev](./webdev)


## Project Structure

- core - core logic container converting reflect node to various target platform code
- app - shared ui  / app library for displaying plugin.
- figma - figma patform specific codes
- sketch - sketch patform specific codes
- zeplin - zeplin platform specific codes
- xd - xd platform specific codes
- packages - list of packages used by this project as submodules
- - lint
- - coli
- - flutter builder
- - design sdk
- - ui utils
- - and more!
