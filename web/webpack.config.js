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
        loader: ExtractTextPlugin.extract("css-loader")
      },
      {
        test: /\.png$/,
        loader: "url-loader?limit=100000"
      },
      {
        test: /\.jpg$/,
        loader: "file-loader"
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      }
    ],
  },
  plugins: [
    new ExtractTextPlugin("index.css")
  ],
  devServer: {
    historyApiFallback: true,
    port: 8081,
    proxy: {
      '/rest': {
        target: {
          host: "localhost",
          protocol: 'http:',
          port: 8080
        },
      }
    }
  },
};
