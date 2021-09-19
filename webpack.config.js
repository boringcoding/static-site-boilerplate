const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");
const openBrowser = require("react-dev-utils/openBrowser");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const host = process.env.HOST || "localhost";
const port = parseInt(process.env.PORT, 10) || 3000;

const pages = fs.readdirSync("./src/pages/");

let multipleHtmlPlugins = pages.map((page) => {
  return new HtmlWebpackPlugin({
    template: `./src/pages/${page}`,
    filename: page,
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
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
          },
        ],
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
    ...multipleHtmlPlugins,
    new MiniCssExtractPlugin({
      filename: "./styles/bundle.css",
    }),
  ],
};
