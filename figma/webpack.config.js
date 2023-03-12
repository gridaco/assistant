const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");
const webpack = require("webpack");

module.exports = (env, argv) => {
  const { mode, host } = env;
  const isProd = mode === "production";

  return {
    mode: isProd ? "production" : "development",
    stats: { warnings: false },

    // This is necessary because Figma's 'eval' works differently than normal eval
    devtool: mode === "production" ? false : "inline-source-map",

    entry: {
      ui: "./src/ui.tsx", // The entry point for your UI code
      code: "./src/code.ts", // The entry point for your plugin code
    },

    module: {
      rules: [
        // Converts TypeScript code to JavaScript
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                configFile: isProd ? "tsconfig.prod.json" : "tsconfig.json",
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },

    // Webpack tries these extensions for you if you omit the extension like "import './file'"
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js"],
      fallback: {
        fs: false,
      },
    },

    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "dist"), // Compile into a folder called "dist"
    },

    // minimize
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: { comments: false },
            // required for @flutter-builder annotion based code gen.
            keep_classnames: false,
            compress: true,
          },
        }),
      ],
    },

    plugins: [
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
      new webpack.EnvironmentPlugin({
        HOST: get_host(host),
      }),
      // Tells Webpack to generate "ui.html" and to inline "ui.ts" into it
      // https://www.figma.com/plugin-docs/bundling-webpack/
      new HtmlWebpackPlugin({
        template: "./src/ui.html",
        filename: "ui.html",
        inlineSource: ".(js)$",
        chunks: ["ui"],
      }),
      // https://github.com/jantimon/html-webpack-plugin/issues/1379#issuecomment-610208969
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/\.(js|css)$/]),
    ],
  };
};

const get_host = (mode) => {
  switch (mode) {
    case "development":
      return "http://localhost:3303";
    case "production":
      return "https://assistant-serve.grida.co";
    case "staging":
      return "https://staging-branch-assistant-serve.vercel.app";
    default:
      return "http://localhost:3303";
  }
};
