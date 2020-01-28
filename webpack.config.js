const path = require('path')
const webpack = require('webpack')

// module.exports = {
//   entry: path.resolve(__dirname, 'public', 'scripts', 'app.js'),
//   output: { path: path.resolve(__dirname, 'public', 'scripts'), filename: 'bundle.js' },
//   watch: true,
//   plugins: [
//     new webpack.ProvidePlugin({
//       $: 'jquery',
//       jQuery: 'jquery',
//       'window.jQuery': 'jquery'
//     })
//   ]
// }

const config = {
  // TODO: Add common Configuration
  module: {}
}

const fooConfig = Object.assign({}, config, {
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
})

const barConfig = Object.assign({}, config, {
  entry: path.resolve(__dirname, 'public', 'scripts', 'app2.js'),
  output: { path: path.resolve(__dirname, 'public', 'scripts'), filename: 'bundle2.js' },
  watch: true,
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ]
})

const lolConfig = Object.assign({}, config,{
  entry: path.resolve(__dirname, 'public', 'scripts', 'app3.js'),
  output: { path: path.resolve(__dirname, 'public', 'scripts'), filename: 'bundle3.js' },
  watch: true,
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ]
})

// Return Array of Configurations
module.exports = [
  fooConfig, barConfig, lolConfig
]
