module.exports = {
  entry: { "example/compiled/index": "./example/src/index" },
  output: {
    path: ".",
    filename: "[name].js",
    publicPath: "/example/compiled/"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: { presets: [ "es2015" ] }
      },
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  }
};
