---
framework: figma, flutter, react
platform: Android, iOS, Web, macOS, Linux, Windows
title: bridged figma plugin
---

  <meta name="description" content="figma to flutter code exporter, lint your design. generate human level quality code from figma">
  <meta name="title" content="bridged assistant">


![bridged assistant](./branding/assistant-cover-v0.1.0.png)



# Bridged Assistant plugin (figma to flutter)
- ✅ Human readable code generation.
- ✅ code generation built with CoLI, developed especially for assistant usage, ensuring the best code generation quality.
- ✅ Slots support (Component with parameters)
- ✅ Modularized code generation / readability. All production level code, code beign generated as Functions, Varables, Ect..
- ✅ Design Linting - Visaully makes sence, Structure made sence.
- ✅ Cloud Resource Copy. Copy your resource in 1 second. (No need to download images and move under `res/`)

## Usage

> link is temporarily dead. it's being reviewed by figma team. until this plugin is available publicly, you have to build it on local and run it.


install via figma plugin [link here](https://www.figma.com/community/plugin/896445082033423994)


> Cloning and running the project.
> we use yarn workspace for maintaining this project as monorepository.
> Some additional steps are required to run this project properly.
``` shell
# [REQUIRED] we use git submodules for `packages/`. you have to explicitly execute this command instead default clone.
git clone --recurse-submodules https://github.com/bridgedxyz/assistant.git

cd assistant

# [REQUIRED] yarn will install dependencies, link packages, and generate compiled code of packages, so it can be referenced by root projects.
yarn

# [OPTIONAL 1] run figma plugin in dev mode
yarn figma

# [OPTIONAL 2]run sketch plugin in dev mode
yarn sketch
```

*soon as the subpackages are released as stable, we will remove git submodule dependency for ease of use. until then, this will be the primary repository and all the edits and PRs will be caused by this project.*


### Pre-requisites

- [Node.js](https://nodejs.org/)
- [Figma desktop app](https://figma.com/downloads/)



## Flutter code builder



![](doc/images/plugin-flutter-example.png)



flutter widget builder is done by [figma/flutter](/flutter) and the core builder is powered by [bridged's dynamic](https://github.com/bridgedxyz/dynamic)
- [figma/flutter](/figma/src/flutter)
- [bridgedxyz/flutter-js](https://github.com/bridgedxyz/flutter-builder)
- [bridgedxyz/dynamic](https://github.com/bridgedxyz/dynamic)


- ✅ `Theme.of` Textstyle support
- ✅ `Colors.` Color support
- ✅ Slots support (not static content)
- ✅ Modularized builder functions - (not all-in-one widget tree)
- ✅ formatted dart code
- ✅ Best code quality (I Assure,) in this planet


## UI Element Detection
> rule based button / input / icon detection with [@reflect.bridged.xyz/detection](./packages/detection)
> Higher quality ML based detection available at [Bridged's context engine](https://github.com/bridgedxyz/context)


### Debugging

Use `console.log` statements to inspect values in your code.

To open the developer console in the Figma desktop app, go to `Plugins` → `Development` → `Open Console`.



### Change Log

visit [CHANGELOG.md](./CHANGELOG.md)




## Development guide


### Building the plugin

See [plugin README](/plugin/README.md)


### Docs

- [Create Figma Plugin docs](https://github.com/yuanqing/create-figma-plugin#docs)
- [Figma plugin API docs](https://figma.com/plugin-docs/api/)



### LEGAL
> read [LICENSE](./LICENSE).

***to shortly breif,***
- any form of modifing this software, including clone, fork, merge is allowed with no restrictions.
- making profit "by using" this software is allowed with no restrictions.
- making profit "by re-distributing" is not allowed. recap, you cannot publish this plugin as an alternative to this original plugin.
-- why is that? we are taking "minimum" profit from this software, we will prevent from other enterprise from copycatting this software.
- the code and packages distributed via this repository is free to use without any restrictions.
- code, design is free to use and modify. (just don't make any profits by re-distributing this plugin.)



### DISCLAIMER

re-use of this software and it's license is overrided by [contributing-and-license](https://github.com/bridgedxyz/contributing-and-license)
