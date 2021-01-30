---
framework: figma, flutter, react
platform: Android, iOS, Web, macOS, Linux, Windows
title: bridged assistant for figma, sketch, xd
---

  <meta name="description" content="figma to flutter code exporter, lint your design. generate human level quality code from figma">
  <meta name="title" content="bridged assistant">

![bridged assistant](./branding/assistant-cover-v0.1.1.png)

# Bridged Assistant plugin (figma to flutter)

> Any design to high quality code, with live preview.

![bridged figma to code demo with live preview](docs/gifs/assistant-demo-2021.0.1.gif)

- ✅ Human readable code generation.
- ✅ code generation built with CoLI, developed especially for assistant usage, ensuring the best code generation quality.
- ✅ Slots support (Component with parameters)
- ✅ Modularized code generation / readability. All production level code, code beign generated as Functions, Varables, Ect..
- ✅ Design Linting - Visaully makes sence, Structure made sence.
- ✅ Cloud Resource Copy. Copy your resource in 1 second. (No need to download images and move under `res/`)
- ✅ Live preview via [console](https://console.bridged.xyz) - compiles output source remotely makes design to living application within seconds
- ✅ Context detection - bridged assistant understands the design, than converts it into a hight quality code. we don't generate rect and text code for a button. We generate button code for a button.



## Usage

> install figma plugin via below link. note that the published plugin is allways behind few new features behind this repository. for trying out the latest and mindblowing features, please build from your local environment directly.

install via figma plugin [link here](https://www.figma.com/community/plugin/896445082033423994)

> Cloning and running the project.
> we use yarn workspace for maintaining this project as monorepository.
> Some additional steps are required to run this project properly.

```shell
# [REQUIRED] we use git submodules for `packages/`. you have to explicitly execute this command instead default clone.
git clone --recurse-submodules https://github.com/bridgedxyz/assistant.git

cd assistant

# [REQUIRED] yarn will install dependencies, link packages, and generate compiled code of packages, so it can be referenced by root projects.
yarn

# [OPTIONAL 1] run figma plugin in dev mode
yarn figma

# [OPTIONAL 2]run sketch plugin in dev mode
yarn sketch

# [OPTIONAL 3 & Contributors only] run plugin ui in webdev mode
yarn webdev
```

_soon as the subpackages are released as stable, we will remove git submodule dependency for ease of use. until then, this will be the primary repository and all the edits and PRs will be caused by this project._

> sometimes, when pulling this repo from remote, if new submodule package is added, you'll need to run below command to pull with updated submodules (we recommand you to know what this command actually does in a nut shell.)

```shell
git submodule update --init --recursive
```

### Pre-requisites

- [Node.js](https://nodejs.org/)
- [Figma desktop app](https://figma.com/downloads/)

## Flutter code builder

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



## Console & Cloud integrations

> Watch the demo on our [website](https://bridged.xyz)

Bridged consle integrated with assistant enables you to manage your design's content in one place. even if text, image is updated, you don't need to update your code. our cloud service got your back.

Learn more at [console repository](https://github.com/bridgedxyz/console.bridged.xyz)



## UI Element Detection

> rule based button / input / icon detection with [@reflect.bridged.xyz/detection](./packages/detection)
> Higher quality ML based detection available at [Bridged's context engine](https://github.com/bridgedxyz/context)



## Design Assistant

> We provide various tools for you for creating stauning designs, and making you 10 times faster to create a working prototype.

**Features**

- **icons loader** (Design Tab ➡️ Icons)

  ![bridged figma to load icons](docs/gifs/assistant-icons-loader-2021.0.1f.gif)

  - 5,000 + material design icons
  - ant design icons (comming soon)
  
- fonts replacer
- buttons generator
- and more



## Development guide

### Building the plugin

- figma: See [plugin README](/figma/README.md)
- sketch: `sketch platform will be available soon`

### Running as Webdev
> webdev is a mode that you can run assistant as a standalone appliaction for ui development purpose of its' you can't acccess or call api to design tools.

Learn more at [./webdev](./webdev)
``` sh
yarn

# on root
yarn webdev

# or..
cd webdev
yarn start
```



### Debugging

Use `console.log` statements to inspect values in your code.

To open the developer console in the Figma desktop app, go to `Plugins` → `Development` → `Open Console`.



### Docs

- [Create Figma Plugin docs](https://github.com/yuanqing/create-figma-plugin#docs)
- [Figma plugin API docs](https://figma.com/plugin-docs/api/)



## Contributing & Project Structure

**general**
See this project's contributing guideline and technical overview [here](./CONTRIBUTING.md).
And general bridged project contribution and collaboration guideline [here](https://github.com/bridgedxyz/contributing-and-license).


**supported platforms and frameworks**
- ✅ [figma](./figma)
- ✅ [flutter](./core)
- ✅ [bridged web](https://github.com/bridgedxyz/console.bridged.xyz)
- [sketch](./sketch) -- coming soon
- react -- coming soon & under [development](https://github.com/bridgedxyz/web-builder)
- vue -- coming soon & under [development](https://github.com/bridgedxyz/web-builder)
- css / sass -- coming soon & under [development](https://github.com/bridgedxyz/web-builder)
- [xd](./xd) -- coming soon
- [zeplin](./zeplin) -- coming soon



## Changelog

we release new updates in a by-monthluy cycle. Watch this repository on github or signup for our news letters on [bridged.xyz](https://bridged.xyz)

All update logs available at [CHANGELOG.md](./CHANGELOG.md)



## LEGAL

> read [LICENSE](./LICENSE).

**_to shortly brief,_**

- any form of modifing this software, including clone, fork, merge is allowed with no restrictions.
- making profit "by using" this software is allowed with no restrictions.
- making profit "by re-distributing" is not allowed. recap, you cannot publish this plugin as an alternative to this original plugin.
  -- why is that? we are taking "minimum" profit from this software, we will prevent from other enterprise from copycatting this software.
- the code and packages distributed via this repository is free to use without any restrictions.
- code, design is free to use and modify. (just don't make any profits by re-distributing this plugin.)



### DISCLAIMER

re-use of this software and it's license is overrided by [contributing-and-license](https://github.com/bridgedxyz/contributing-and-license)
