/* eslint-disable import/no-extraneous-dependencies */
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const path = require("path");
const { useBabelRc, addExternalBabelPlugin, addBabelPlugin, override } = require('customize-cra');

module.exports = (config) => {
  // Remove the ModuleScopePlugin which throws when we try to import something
  // outside of src/.
  config.resolve.plugins.pop();

  // Resolve the path aliases.
  config.resolve.plugins.push(new TsconfigPathsPlugin());
  // Let Babel compile outside of src/.
  const oneOfRule = config.module.rules.find((rule) => rule.oneOf);
  const tsRule = oneOfRule.oneOf.find((rule) =>
  rule.test.toString().includes("ts|tsx")
  );
  tsRule.include = undefined
  tsRule.exclude = /node_modules/;
  
  addBabelPlugin([
    "@babel/plugin-transform-typescript",
    { allowNamespaces: true }
  ])
  return config;
};