const HtmlWebpackPlugin = require("html-webpack-plugin");
const openBrowser = require("react-dev-utils/openBrowser");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const host = process.env.HOST || "localhost";
const port = parseInt(process.env.PORT, 10) || 3000;

let htmlPageNames = ["index", "test"];
let multipleHtmlPlugins = htmlPageNames.map((name) => {
  return new HtmlWebpackPlugin({
    template: `./src/pages/${name}.html`,
    filename: `${name}.html`,
  });
});

module.exports = {
  mode: "production",
  entry: "./src/scripts/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "./scripts/bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx$/i,
        include: path.resolve(__dirname, "./src/scripts"),
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { useBuiltIns: "entry", corejs: 3 }],
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.scss$/i,
        include: path.resolve(__dirname, "./src/styles"),
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    onListening: () => {
      openBrowser(`http://${host}:${port}`);
    },
    host,
    port,
    open: false,
    compress: true,
    watchFiles: {
      paths: ["./dist/**/*", "./src"],
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./styles/bundle.css",
    }),
  ].concat(multipleHtmlPlugins),
};
