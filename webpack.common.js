const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: path.resolve(`${__dirname}/src/index.tsx`),
  output: {
    path: path.resolve(`${__dirname}/public`),
    filename: 'bundle.js',
    chunkFilename: '[name].[contenthash].js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.woff2$|\.ttf$|\.eot$/,
        loader: 'url-loader',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [require.resolve('react-refresh/babel')].filter(Boolean),
          },
        },
      },
    ],
  },
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.NODE_ENV === 'production' ? 'static' : 'disabled',
    }),
    new ReactRefreshWebpackPlugin(),
    new CompressionPlugin({
      algorithm: 'gzip',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  devServer: {
    contentBase: path.resolve(`${__dirname}/public`),
    compress: true,
    port: 9000,
    hot: true,
    open: true,
  },
};