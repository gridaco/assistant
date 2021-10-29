const slsw = require("serverless-webpack");

module.exports = {
  entry: slsw.lib.entries,
  plugins: [],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        include: [__dirname],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};
