const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => ({
  mode: argv.mode === "production" ? "production" : "development",
  stats: { warnings: false },
  // https://github.com/webpack-contrib/css-loader/issues/447#issuecomment-285598881
  node: {
    fs: "empty",
  },
  // This is necessary because Figma's 'eval' works differently than normal eval
  devtool: argv.mode === "production" ? false : "inline-source-map",

  entry: {
    code: "./src/code.ts", // The entry point for your plugin code
  },

  module: {
    rules: [
      // Converts TypeScript code to JavaScript
      { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
    ],
  },

  // Webpack tries these extensions for you if you omit the extension like "import './file'"
  resolve: { extensions: [".ts", ".js"] },

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
          keep_classnames: true, // keep class name cause, flutter-builder uses class name reflection.
          sourceMap: false,
          output: {
            comments: false,
          },
        },
      }),
    ],
  },

  // Tells Webpack to generate "ui.html" and to inline "ui.ts" into it
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/ui.html",
      filename: "ui.html",
      inlineSource: ".(js)$",
      chunks: ["ui"],
      // custom env var - ref: https://stackoverflow.com/a/49375928/5463235
      host:
        argv.mode == "production"
          ? "https://assistant-serve.grida.co"
          : "http://localhost:3000",
    }),
    new HtmlWebpackInlineSourcePlugin(),
  ],
});
