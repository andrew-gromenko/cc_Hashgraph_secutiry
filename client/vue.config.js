module.exports = {
  lintOnSave: true,
  devServer: {
    port: 3002,
    proxy: {
      '/api': {
        target: 'http://localhost:' + process.env.PORT
      }
    }
  }
}
