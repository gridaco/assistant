import { Framework } from "@grida/builder-platform-types";

export enum Language {
  jsx = "jsx",
  tsx = "tsx",
  dart = "dart",
}

export type ReactStylingStrategy = "css" | "styled-components" | "css-in-jsx";

export interface FlutterOption {
  framework: Framework.flutter;
  language: Language.dart;
}

export interface ReactOption {
  framework: Framework.react;
  language: Language.jsx | Language.tsx;
  styling: ReactStylingStrategy;
}

export type FrameworkOption = ReactOption | FlutterOption;

export const react_presets = {
  react_default: <ReactOption>{
    framework: Framework.react,
    language: Language.tsx,
    styling: "styled-components",
  },
  react_with_styled_components: <ReactOption>{
    framework: Framework.react,
    language: Language.tsx,
    styling: "styled-components",
  },
  react_with_css_in_jsx: <ReactOption>{
    framework: Framework.react,
    language: Language.tsx,
    styling: "css-in-jsx",
  },
  react_with_css: <ReactOption>{
    framework: Framework.react,
    language: Language.tsx,
    styling: "css",
  },
};

export const flutter_presets = {
  flutter_default: <FlutterOption>{
    framework: Framework.flutter,
    language: Language.dart,
  },
};

export const presets = {
  react: react_presets,
  flutter: flutter_presets,
};

export const all_preset_options__prod = [
  flutter_presets.flutter_default,
  react_presets.react_default,
  react_presets.react_with_styled_components,
  // react_with_css_in_jsx // NOT ON PRODUCTION
  // react_with_css // NOT ON PRODUCTION
];

export const all_preset_options_map__prod = {
  none: null,
  flutter_default: flutter_presets.flutter_default,
  react_default: react_presets.react_default,
  react_with_styled_components: react_presets.react_with_styled_components,
  // react_with_css_in_jsx // NOT ON PRODUCTION
  // react_with_css // NOT ON PRODUCTION
};

export const lang_by_framework = {
  flutter: [Language.dart],
  react: [Language.jsx, Language.tsx],
};

export const react_styles: ReactStylingStrategy[] = [
  "styled-components",
  "css-in-jsx",
  "css",
];

export const getpreset = (preset_name: string): FrameworkOption => {
  const _p = all_preset_options_map__prod[preset_name];
  if (_p) {
    return _p;
  }
  throw `"${preset_name}" is not a valid platform preset key`;
};

export const getDefaultPresetByFramework = (frameowrk: Framework) => {
  switch (frameowrk) {
    case Framework.flutter:
      return all_preset_options_map__prod.flutter_default;
    case Framework.react:
      return all_preset_options_map__prod.react_default;
  }
};
