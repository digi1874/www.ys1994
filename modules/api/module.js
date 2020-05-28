const path = require('path')

function apiModule (_moduleOptions) {
  // Register plugin
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    fileName: 'api.js'
  })
}

module.exports = apiModule
