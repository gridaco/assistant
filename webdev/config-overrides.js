const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

// module.exports = function override(config, env) {
//     //https://medium.com/@NiGhTTraX/making-typescript-monorepos-play-nice-with-other-tools-a8d197fdc680
//     // Remove the ModuleScopePlugin which throws when we try
//     // to import something outside of src/.
//     // config.resolve.plugins.pop();

//     // Resolve the path aliases.
//     config.resolve.plugins.push(new TsconfigPathsPlugin());

//     // Let Babel compile outside of src/.
//     // const tsRule = config.module.rules[2].oneOf[1];
//     // tsRule.include = undefined;
//     // tsRule.exclude = /node_modules/;
//     return config;
// }

const { 
    addDecoratorsLegacy, 
    addWebpackPlugin,
    override 
} = require("customize-cra");
  
  module.exports = {
    webpack: override(
        addDecoratorsLegacy(),
        addWebpackPlugin(new TsconfigPathsPlugin())
    )
  };