const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const { WebpackPluginServe: Serve } = require("webpack-plugin-serve");

module.exports = function (arg, env) {
  const outputPath = path.resolve(__dirname, "dist");
  const publicPath = env.github
    ? "https://jballe.github.io/elektron-mikroskop/"
    : "/";

  const cfg = {
    mode: env.mode || "development",
    entry: {
      app: "./src/index.js",
    },
    output: {
      path: outputPath,
      filename: "[name].[hash].js",
      publicPath: publicPath,
    },
    module: {
      rules: [
        {
          test: /assets/,
          use: ["file-loader"],
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    devtool: "inline-source-map",
    plugins: [
      new HtmlWebpackPlugin({
        title: "Elektron mikroskopet",
        template: "src/index.ejs",
      }),
      new FaviconsWebpackPlugin({
        logo: "src/assets/splash.png",
        favicons: {
          appName: "Elektron mikroskop",
          appDescription: "Redskab til spejdermødet Ramasjang Mysteriet",
          developerName: "Jesper Balle",
          developerURL: null,
          icons: {
            android: false,
            appleIcon: true,
            appleStartup: true,
            coast: false,
            favicons: true,
            firefox: false,
            yandex: false,
            windows: false,
          },
        },
      }),
    ],
  };

  if (env.watch) {
    cfg.watch = true;
    cfg.plugins.push(
      new Serve({
        historyFallback: true,
        static: [outputPath, path.resolve("./public")],
        liveReload: true,
      })
    );
  }
  return cfg;
};
