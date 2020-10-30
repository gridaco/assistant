# CHANGELOG

>  this changelog follows guideline at [keepachangelog.com](https://keepachangelog.com/en/1.0.0/)





## UNRELEASED

> unreleased features will be added here

- [packages/detection] Icon detection - determines if selected node should be considered as an icon or not.
- [packages/detection] Screen detection - determines if selected node should be considered as an screen or not.
- [packages/detection] Pattern detection - detects the patttern from givven layout (node), finds the pattern from it if exists. (used for List layout detection)
- [packages/detection] List detection - determines if selected node is a list of specific component, or complex layout.



### Will be added

- [Builder] Core builder logic re-design
- [Flutter] LineNode support with Divider
- [Flutter] Image Support with XImage / Image
- [Flutter] Material Icon Support with XIcon / Icon
- [Flutter] Star Node support with XImage (svg)
- [Flutter] Poligon Node support with XImage (svg)
- [Lint] Primal naming & grouping linting for better code export quality. this is tracked sperately on [lint](https://github.com/bridgedxyz/lint)


## [0.1.2] - 2020-10-30
> Mainly update of quicklook feature. Make your design compiled within few seconds.
- [packages/design-sdk] using design SDK for better capability.
[features/quicklook] Newly added.



## [0.1.0] - 2020-10-23 (ETA)

Initial release of Bridged's figma plugin (a.k.a assistant)

> 0.1.0 focuses on flutter code generation feature.

- Figma plugin ui built with react + plain css
- Supported : Fimga / Flutter
- Flutter code exporter built with [flutter-builder](https://github.com/bridgedxyz/flutter-builder)



### Info

[v0.1.0]

**name** : Bridged (design to flutter)

**description** : 

Bridged's assistant plugin that generates usable & readable flutter code for production. Run this plugin, Select any design of yours, It will generate ready-to-use formatted native flutter code for you.

*Notice*

No matter how big and complex frame you select, it will generate the code. Anyway we recommend you to use it on a component level for best experience. Code may not be manageable if you are tring to build full-screen level code in one single code base.

contribute on [github](https://github.com/bridgedxyz/assistant)

**tags**: flutter, lint, code, figma to code, prototyping, hosting

**support contact**: https://github.com/bridgedxyz/assistant/issues/new/choose

----





### Added

**Initial Features**

- flutter widgets support
  - figma to SingleChildScrollView
  - figma to Column
  - figma to Row
  - figma to Text
  - figma to SizedBox
  - figma to Container
  - figma to Color
  - figma to BoxDecoration
  - figma to Padding (EdgeInsets)
  - figma to Transform
  - figma to Gradient
  - figma to Stack
  - figma to Expanded
  - figma to Opacity
- builder
  - flutter widget builder with [flutter-builder](https://github.com/bridgedxyz/flutter-builder) v31
  - Theme TextStyle supported with textstyle name detection. H1 will give you `Theme.of(context).textTheme.heading1`
- ui
  - preview interface -- shows the selected node's image on preview
  - code section -- shows the generated code



### Changed

N/A -- this is an initial release

### Removed

N/A -- this is an initial release

