# CHANGELOG

> this changelog follows guideline at [keepachangelog.com](https://keepachangelog.com/en/1.0.0/)

## UNRELEASED

> unreleased features will be added here

- [engines/react] Figma to React with styled components is initailly added, under beta label.
- [packages/detection] Screen detection - determines if selected node should be considered as an screen or not.
- [packages/detection] Pattern detection - detects the patttern from givven layout (node), finds the pattern from it if exists. (used for List layout detection)
- [packages/detection] List detection - determines if selected node is a list of specific component, or complex layout.
- [interpreter/column] column crossAxisAlignment fixed with explicit order providence. Now supports start, end, center and stretch.

> implemented, and next-releasing features

- [toolbox/meta-editor] Meta data editor of root (file)'s metadata single property editor available for developer experience. (you can manually set files property to mock or give context to assistant which this design system holds as a data. e.g. - uses-designsystem=material-design)
- [linter/textstyles] `MissingTextStyleWarning`: New Linter added. this lints the design warning the plain text with no textstyle specified. [PR](https://github.com/bridgedxyz/assistant/pull/80)
- [assistant/ux] Resizing added. Now you can resize the plugin as you want. starting on figma platform. ([#107](https://github.com/bridgedxyz/assistant/pull/107))

### Will be added

- [Builder] Core builder logic re-design
- [Flutter] LineNode support with Divider
- [Flutter] Image Support with XImage / Image
- [Flutter] Material Icon Support with XIcon / Icon
- [Flutter] Star Node support with XImage (svg)
- [Flutter] Poligon Node support with XImage (svg)
- [Lint] Primal naming & grouping linting for better code export quality. this is tracked sperately on [lint](https://github.com/bridgedxyz/lint)

## [2022.12.0.1] - 2022-12-6 (schduled)

- New Icons set added.
  - Unicon Icons
  - Radix-ui Icons

## [2022.4.0.3] - 2022-04-29

- New feature: Publish as website

## [2022.4.0.2] - 2022-04-28

- PR: https://github.com/gridaco/assistant/pull/197
- Add “Open in Grida” action in design/preview screen like as in code/preview screen.
- Update design preview screen to show preview in a more isolated way - (hide tab bars while previewing)
- Update filekey input to be more visible

## [2022.4.0.1] - 2022-04-08

- D2C: CSS Duplication reduction
- UI: Prettier & Dart formatter added
- Preview: React executable live scripting feature added

## [2022.3.4] - 2022-03-30

- Fix incomplete autolayout flex mapping
- D2C Module Update - with embeddings support
- Instant prototyping with instant previews of components and embeddings (checkbox, button, progress, slider, youtube, google maps and more)

## [2022.3.1] - 2022-03-14

- Lint updates
- D2C Module Update
- Add instant preview to designers' mode

## (Draft) [2022.0.1] - 2022-01-20

> (Draft)

- Flags editor
- Components & Property Editor
- Responsive & Resizable Preview
- Icons DnD Fix

## (Draft) [2021.11.1] - 2021-12-1

> Live session support with experimental components support

- Assistant Live - [#174](https://github.com/gridaco/assistant/pull/174)

## [2021.11.1] - 2021-12-1

- Add Vanilla Html codegen support (preview feature)
- Fix ReactJS Codegen bugs
- Fix Icons loading failure with 200 (caused by cors)

## [2021.9.1] - 2021-10-11

> 2021.9 is a cold release

[PR#159](https://github.com/gridaco/assistant/pull/159)

- Instant responsive preview - a realtime application from design, seriously, with a single click.
- Adopted Monaco Editor
- Semi-stable react support with styled-component
- Minimalistic navigation with hide animation on focus mode
- (fix) wrong cache loading issue on boot
- Prevent thread lock on big screen
- Prevent thread lock on too many remote component screen

### [2021.9.1f1] - 2021-10-26

- Fix icons loader cors issue

## [2021.8.0b] - 2021-8-26

**What's new**

- Speed
- Navigation UX Renewal
- The code
- Code interaction
- Figma to Flutter
- Figma to React (React as preview feature)
- Icons loader
- Design Lint now on beta channel

[Read thw full release notes from medium blog](https://blog.grida.co/d-figma-assistant-by-grida-supercharge-your-design-development-workflow-e6b2989216e2)

## [2021.0.2f0] - 2021-5-21

> Deisgn to code logical separation. Design to code is now imported from [designto.codes](https://designto.codes)

- [new/ui] About page - https://github.com/bridgedxyz/assistant/pull/106
- [features/design-to-code] Core foundation refactoring - https://github.com/bridgedxyz/assistant/pull/99, https://github.com/bridgedxyz/assistant/pull/98
- [features/analytics] Secure proxy analytics added for improving UX. - https://github.com/bridgedxyz/assistant/pull/104
- [features/tool-box] Made internal toolbox available for production.
- [features/component-view] Components registration & metadata editing, interface design is added (will be fully supported on next version) - https://github.com/bridgedxyz/assistant/pull/72

## [2021.0.1f1.1] - 2021-2-7

> cors issue hot fix. cors anywhere usage has been replaced with cors.bridged.cc

- [fix] CORS related requests back online

## [2021.0.1f1] - 2021-1-31

> Update focused on UI improvement of icon list, Ant Icon, not just Material Icon, and search function has been changed in detail for Icon.

- [ui/icons] `design/icon` util screen design updated
- [ui/icons] Icon variant, size filter added
- [ui/icons] `ant-design-icons` added as a default source
- [ui/icons] Infinite scrolling of icons
- [ui/icons] Icons Drag & Drop Loading - Now you can import icons from assistant via Drag & Drop.

## [2021.0.1] - 2021-1-6

> Update focused on improving UI/UX, and console integrations. other tools will be added under toolbox

- [interpreter/text] Dart String escape optimized, and fixed with execution order
- [packages/detection] Icon detection - determines if selected node should be considered as an icon or not.
- [packages/detection] Chip detection - determines if selected node should be considered as an chip or not.
- [packages/detection] Button detection - determines if selected node should be considered as an button or not.
- [ui/tabs] New tabs are added (design, tools, contents)
- [ui/design] Assistant design updated with clean and clear black theme.

## [0.1.3] - 2020-11-08

> Update focused on quicklook and resolving flutter compile issues.

- 3 major error causing building-logic is fixed.
- Now there are know known compile issues.
- Stack runtime error resolved.
- Quicklook has major performance boost, up to 5 times faster loading time.
- Dart character escape is implemented

## [0.1.2] - 2020-10-30

> Mainly update of quicklook feature. Make your design compiled within few seconds.

- [packages/design-sdk] Using design SDK for better capability.
  [features/quicklook] Newly added.

## [0.1.0] - 2020-10-23 (ETA)

Initial release of Bridged's figma plugin (a.k.a assistant)

> 0.1.0 focuses on flutter code generation feature.

- Figma plugin UI built with React + plain CSS
- Supported: Figma / Flutter
- Flutter code exporter built with [flutter-builder](https://github.com/bridgedxyz/flutter-builder)

### Info

[v0.1.0]

**name**: Bridged (design to flutter)

**description**:

Bridged's assistant plugin that generates usable & readable flutter code for production. Run this plugin, Select any design of yours, It will generate ready-to-use formatted native flutter code for you.

_Notice_

No matter how big and complex frame you select, it will generate the code. Anyway we recommend you to use it on a component level for best experience. Code may not be manageable if you are tring to build full-screen level code in one single code base.

Contribute on [github](https://github.com/bridgedxyz/assistant)

**tags**: flutter, lint, code, figma to code, prototyping, hosting

**support contact**: https://github.com/bridgedxyz/assistant/issues/new/choose

---

### Added

**Initial Features**

- Flutter widgets support
  - Figma to SingleChildScrollView
  - Figma to Column
  - Figma to Row
  - Figma to Text
  - Figma to SizedBox
  - Figma to Container
  - Figma to Color
  - Figma to BoxDecoration
  - Figma to Padding (EdgeInsets)
  - Figma to Transform
  - Figma to Gradient
  - Figma to Stack
  - Figma to Expanded
  - Figma to Opacity
- Builder
  - Flutter widget builder with [flutter-builder](https://github.com/bridgedxyz/flutter-builder) v31
  - Theme TextStyle supported with textstyle name detection. H1 will give you `Theme.of(context).textTheme.heading1`
- UI
  - Preview Interface -- Shows the selected node's image on preview
  - Code Section -- Shows the generated code

### Changed

N/A -- This is an initial release

### Removed

N/A -- This is an initial release
