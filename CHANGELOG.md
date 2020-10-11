# CHANGELOG

this changelog follows guideline at [keepachangelog.com](https://keepachangelog.com/en/1.0.0/)



## UNRELEASED

> unreleased features will be added here



### Will be added

- [Builder] Core builder logic re-design
- [Flutter] LineNode support with Divider
- [Flutter] Image Support with XImage / Image
- [Flutter] Material Icon Support with XIcon / Icon
- [Flutter] Star Node support with XImage (svg)
- [Flutter] Poligon Node support with XImage (svg)
- [Lint] Primal naming & grouping linting for better code export quality. this is tracked sperately on [lint](https://github.com/bridgedxyz/lint)





## [0.1.0] - 2020-10-14 (ETA)

Initial release of Bridged's figma plugin (a.k.a assistant)

> 0.1.0 focuses on flutter code generation feature.

- Figma plugin ui built with react + plain css
- Supported : Fimga / Flutter
- Flutter code exporter built with [flutter-builder](https://github.com/bridgedxyz/flutter-builder)



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

