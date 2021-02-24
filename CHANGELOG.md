# CHANGELOG

> this changelog follows guideline at [keepachangelog.com](https://keepachangelog.com/en/1.0.0/)

## UNRELEASED

> unreleased features will be added here

- [packages/detection] Screen detection - determines if selected node should be considered as an screen or not.
- [packages/detection] Pattern detection - detects the patttern from givven layout (node), finds the pattern from it if exists. (used for List layout detection)
- [packages/detection] List detection - determines if selected node is a list of specific component, or complex layout.
- [interpreter/column] column crossAxisAlignment fixed with explicit order providence. Now supports start, end, center and stretch.

> implemented, and next-releasing features

- [toolbox/meta-editor] Meta data editor of root (file)'s metadata single property editor available for developer experience. (you can manually set files property to mock or give context to assistant which this design system holds as a data. e.g. - uses-designsystem=material-design)
- [linter/textstyles] `MissingTextStyleWarning` : New Linter added. this lints the design warning the plain text with no textstyle specified. [PR](https://github.com/bridgedxyz/assistant/pull/80)

### Will be added

- [Builder] Core builder logic re-design
- [Flutter] LineNode support with Divider
- [Flutter] Image Support with XImage / Image
- [Flutter] Material Icon Support with XIcon / Icon
- [Flutter] Star Node support with XImage (svg)
- [Flutter] Poligon Node support with XImage (svg)
- [Lint] Primal naming & grouping linting for better code export quality. this is tracked sperately on [lint](https://github.com/bridgedxyz/lint)

## [2021.0.1f1.1] - 2021-2-7

> cors issue hot fix. cors anywhere usage has been replaced with cors.bridged.cc

- [fix] cors related requests back online

## [2021.0.1f1] - 2021-1-31

> Update focused on UI improvement of icon list, Ant Icon, not just Material Icon, and search function has been changed in detail for Icon.

- [ui/icons] design/icon util screen design updated
- [ui/icons] icon variant, size filter added
- [ui/icons] ant-design-icons added as a default source
- [ui/icons] infinite scrolling of icons
- [ui/icons] Icons Drag & Drop Loading - Now you can import icons from assistant via Drag & Drop.

## [2021.0.1] - 2021-1-6

> Update focused on improving UI/UX, and console integrations. other tools will be added under toolbox

- [interpreter/text] Dart String escape optimized, and fixed with execution order
- [packages/detection] Icon detection - determines if selected node should be considered as an icon or not.
- [packages/detection] chip detection - determines if selected node should be considered as an chip or not.
- [packages/detection] button detection - determines if selected node should be considered as an button or not.
- [ui/tabs] New tabs are added (design, tools, contents)
- [ui/design] assistant design updated with clean and clear black theme.

## [0.1.3] - 2020-11-08

> Update focused on quicklook and resolving flutter compile issues.

- 3 major error causing building-logic is fixed.
- now there are know known compile issues.
- stack runtime error resolved.
- quicklook has major performance boost, up to 5 times faster loading time.
- dart character escape is implemented

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

_Notice_

No matter how big and complex frame you select, it will generate the code. Anyway we recommend you to use it on a component level for best experience. Code may not be manageable if you are tring to build full-screen level code in one single code base.

contribute on [github](https://github.com/bridgedxyz/assistant)

**tags**: flutter, lint, code, figma to code, prototyping, hosting

**support contact**: https://github.com/bridgedxyz/assistant/issues/new/choose

---

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
