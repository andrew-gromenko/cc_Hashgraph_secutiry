const port = require('../config.json').dev.api.port
console.log(port)

module.exports = {
  lintOnSave: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:' + port
      }
    }
  }
}
