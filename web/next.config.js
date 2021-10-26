const withTM = require("next-transpile-modules")([
  // _firstparty
  "@assistant-fp/analytics",
  "@assistant-fp/auth",

  // UI
  "@ui/core",
  "@ui/previewer",
  "@ui/codebox",
  "@assistant/icons",
  "@assistant/lint-icons",

  // @app
  "app",
  "@app/design-to-code",
  "@app/live",
  "@app/auth",
  "@app/i18n",
  "@app/component-manage",
  "@app/button-maker",
  "@app/data-mapper",
  "@app/preferences",
  "@app/design-lint",
  "@app/design-text-code-syntax-highlight",
  "@app/icons-loader",
  "@app/meta-editor",
  "@app/meta-editor",
  "@app/export-scene-as-json",
  "@app/scene-view",
  "@app/schema-editor",

  // @toolbox
  "@app/toolbox",
  "@toolbox/font-replacer",

  // cores
  "@core/code-formatter",

  // Plugin sdk
  "@plugin-sdk/app",
  "@plugin-sdk/core",
  "@plugin-sdk/service",
  "@plugin-sdk/draggable",
  "plugin-app",

  // -----------------------------
  // region @designto-code
  "@designto/config",
  "@grida/builder-config-preset",
  "@grida/builder-platform-types",
  "@designto/code",
  "@designto/sanitized",
  "@designto/token",
  "@designto/flutter",
  "@designto/web",
  "@designto/vanilla",
  "@designto/react",

  "@code-features/assets",
  "@code-features/flags",
  // -----------------------------

  // -----------------------------
  // design-sdk
  "@design-sdk/flags",
  "@design-sdk/core",
  "@design-sdk/core-types",
  "@design-sdk/universal",
  "@design-sdk/figma",
  "@design-sdk/figma-url",
  "@design-sdk/figma-xpath",
  "@design-sdk/url-analysis",
  "@design-sdk/sketch",
  // -----------------------------

  // -----------------------------
  // region @reflect-ui types & utils
  "@reflect-ui/core",
  "@reflect-ui/detection",
  // -----------------------------

  // base sdk
  "@base-sdk/core",
  "@base-sdk/base",
  "@base-sdk/url",
  "@base-sdk/hosting",
  "@base-sdk/build",
  "@base-sdk/scene-store",
  "@base-sdk/resources",

  // baes sdk fp
  "@base-sdk-fp/auth",

  // -----------------------------
  // region coli
  "coli",
  "@coli.codes/escape-string",
  "@coli.codes/core-syntax-kind",
  // endregion coli
  // -----------------------------

  // -----------------------------
  // region builders - part of designto-code / coli
  // region flutter builder
  "@flutter-builder/flutter",
  // endregion flutter builder

  // region web builders
  "@coli.codes/nodejs-builder",
  "@web-builder/core",
  "@web-builder/vanilla",
  "@web-builder/react",
  "@web-builder/reflect-ui",
  "@web-builder/styled",
  "@web-builder/styles",
  // endregion web builders
  // -----------------------------
]);

module.exports = withTM();
