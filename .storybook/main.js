// https://stackoverflow.com/a/65970945/12377179

const path = require("path");
const fs = require("fs");

function getPackageDir(filepath) {
  let currDir = path.dirname(require.resolve(filepath));
  while (true) {
    if (fs.existsSync(path.join(currDir, "package.json"))) {
      return currDir;
    }
    const { dir, root } = path.parse(currDir);
    if (dir === root) {
      throw new Error(
        `Could not find package.json in the parent directories starting from ${filepath}.`
      );
    }
    currDir = dir;
  }
}

module.exports = {
  stories: [
    "../app/lib/components/**/*.stories.mdx",
    "../app/lib/components/**/*.stories.@(js|jsx|ts|tsx)",
    "**/*.stories.mdx",
    "**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],

  webpackFinal: async (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        "@emotion/core": getPackageDir("@emotion/react"),
        "@emotion/styled": getPackageDir("@emotion/styled"),
        "emotion-theming": getPackageDir("@emotion/react"),
      },
    },
  }),
};
