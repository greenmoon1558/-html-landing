const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const loaders = require('./loaders');
const plugins = require('./plugins');
const WorkboxPlugin = require('workbox-webpack-plugin');
module.exports = {
  entry: [
    path.resolve(__dirname, "../src/js/index.js"),
    path.resolve(__dirname, "../src/styles/main.scss")
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  module: {
    rules: [
      loaders.CSSLoader,
      loaders.JSLoader,
      loaders.ESLintLoader,
      loaders.PugLoader,
      
    ]
  },
  plugins: [
    plugins.StyleLintPlugin,
    plugins.MiniCssExtractPlugin,
    //new PreloadCssPlugin(),
    plugins.CopyResources,
    plugins.HtmlWebpackPlugin,
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: "defer",
      chunks: 'all'
    }),
    // new PreloadWebpackPlugin({
    //   rel: 'preload',
    //   as: 'script'
    // }),
    new CompressionPlugin(),
    new WorkboxPlugin.GenerateSW({
      // Exclude images from the precache
      exclude: [/\.(?:png|jpg|jpeg|svg)$/],
      include: [/\.html$/, /\.js$/],
      // Define runtime caching rules.
      runtimeCaching: [{
        // Match any request ends with .png, .jpg, .jpeg or .svg.
        urlPattern: /\.(?:png|jpg|jpeg|svg|css)$/,

        // Apply a cache-first strategy.
        handler: 'cacheFirst',

        options: {
          // Use a custom cache name.
          cacheName: 'images',

          // Only cache 10 images.
          expiration: {
            maxEntries: 30,
          },
        },
      }],
    })
  ],
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "js/[name].bundle.js"
  }
};
