module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: `${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`,
        changeOrigin: true
      }
    }
  }
}
