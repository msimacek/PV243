var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/main/web',
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'target/webpack'),
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ["react-hot-loader/webpack", "babel-loader"] },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract("css-loader")
      }
    ],
  },
  plugins: [
    new ExtractTextPlugin("index.css")
  ]
};
