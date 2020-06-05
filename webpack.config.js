const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { WebpackPluginServe: Serve } = require("webpack-plugin-serve");

module.exports = function () {
  const outputPath = path.resolve(__dirname, "dist");

  const cfg = {
    mode: 'development',
    entry: {
      app: "./src/index.js",
    },
    output: {
      path: outputPath,
      filename: "[name].bundle.js",
      publicPath: "/",
    },
    devtool: "inline-source-map",
    plugins: [
      new HtmlWebpackPlugin({
          title: 'Elektron mikroskopet',
          template: 'src/index.ejs'
      }),
      new Serve({
        historyFallback: true,
        static: [outputPath],
      }),
    ],
    watch: true,
  };
  return cfg;
};
