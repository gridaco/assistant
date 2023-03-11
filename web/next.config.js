const transpile_packages = [
  // _firstparty
  "@assistant-fp/analytics",
  "@assistant-fp/auth",
  "@assistant-fp/early-access",

  // UI
  "@ui/core",
  "@ui/previewer",
  "@ui/codebox",
  "@ui/flow-steps",
  "@assistant/icons",
  "@assistant/lint-icons",

  // @app
  "app",
  "@app/utils",
  "@app/design-to-code",
  "@app/live",
  "@app/auth",
  "@app/i18n",
  "@app/component-manage",
  "@app/copywriter",
  "@app/button-maker",
  "@app/data-mapper",
  "@app/preferences",
  "@app/design-lint",
  "@app/design-preview",
  "@app/design-text-code-syntax-highlight",
  "@app/icons-loader",
  "@app/photo-loader",
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

  // dedicated platform
  "@platform-dedicated/figma-checksum",

  // Plugin sdk
  "@plugin-sdk/app",
  "@plugin-sdk/core",
  "@plugin-sdk/service",
  "@plugin-sdk/draggable",
  "plugin-app",

  // -----------------------------
  // region @designto-code
  "@grida/builder-config",
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
  // region editor-packages
  "@code-editor/esbuild-services",
  "@code-editor/estypes-resolver",
  "@code-editor/prettier-services",
  "@code-editor/webworker-services-core",
  // -----------------------------

  // -----------------------------
  // region @reflect-ui types & utils
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
  "@base-sdk-fp/core",
  "@base-sdk-fp/auth",
  "@base-sdk-fp/accounts",

  // -----------------------------
  // region builders - part of designto-code / coli

  // region web builders
  "@web-builder/nodejs",
  "@web-builder/core",
  "@web-builder/vanilla",
  "@web-builder/react-core",
  "@web-builder/react",
  "@web-builder/react-native",
  "@web-builder/reflect-ui",
  "@web-builder/styled",
  "@web-builder/styles",
  // endregion web builders
  // -----------------------------
];

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  transpilePackages: transpile_packages,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
};

module.exports = nextConfig;
