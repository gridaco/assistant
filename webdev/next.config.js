const path = require("path");

const withTM = require("next-transpile-modules")(
    // All of the packages will resolve to our monorepo so we can match that path.
    [
        'ui',
        '@bridged.xyz/client-sdk',
        '@bridged.xyz/design-sdk',
        '@reflect.bridged.xyz/core',
        '@reflect.bridged.xyz/linter',
        "@bridged.xyz/flutter-builder"
    ]
);

// const typescriptLoader = {
//   test: /\.ts(x?)$/,
//   loader: ['ts-loader'],
//   exclude: /node_modules/,
// };

module.exports = withTM(
    {
    webpack: (config) => {
    //   config.module.rules.push(typescriptLoader);
      config.module.rules.push({
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
          },
        },
      });

      config.module.rules.map((rule) => {
        if (rule.test !== undefined && rule.test.source.includes('|svg|')) {
          rule.test = new RegExp(rule.test.source.replace('|svg|', '|'));
        }
      });
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });

      return config;
    },
  }
);
