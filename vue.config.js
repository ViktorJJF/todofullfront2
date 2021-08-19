const webpack = require("webpack");
const path = require("path");

module.exports = {
  //   configureWebpack: {
  //     node: {
  //       global: false,
  //     },
  //     plugins: [
  //       new webpack.DefinePlugin({
  //         global: "window", // Placeholder for global used in any node_modules
  //       }),
  //     ],
  //   },
  outputDir: path.resolve(__dirname, "../todo-mujeron/public"),
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        // target: 'https://mastermindgeeks.herokuapp.com'
      },
    },
  },
};
