const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, 'public', 'scripts', 'app.js'),
  output: { path: path.resolve(__dirname, 'public', 'scripts'), filename: 'bundle.js' },
  watch: true,
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ]
}
