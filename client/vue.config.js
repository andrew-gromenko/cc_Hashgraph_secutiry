module.exports = {
  lintOnSave: true,

  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:' + process.env.PORT
      }
    }
  }
}
