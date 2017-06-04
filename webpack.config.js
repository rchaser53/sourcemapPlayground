const webpack = require('webpack');
const path = require("path");

module.exports = {
  context: path.resolve(__dirname, './src'),
  devtool: 'inline-source-map',
  entry: {
    index: "./index.ts"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/public/",
    filename: "bundle.js"
  },
  resolve: {
    extensions: ['.html', '.js', '.ts', '.tsx']
  },
  module: {
    rules:[
    {
      test: /\.(ts|tsx)$/,
      loaders:[
        'babel-loader',
        'ts-loader'
      ],
      include: path.join(__dirname, 'src'),
      exclude:["node_modules/*"]
    },
    {
      test: /\.html$/,
      loader: "html-loader",
      exclude:["node_modules/*"]
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};
