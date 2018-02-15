async function http (method, url, data) {
  var res = null
  try {
    res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: method.toUpperCase(),
      body: data ? JSON.stringify(data) : null
    })

    return await res.json()
  } catch (e) {
    console.error(e)
    this.$eventBus.$emit('notify', res.status + ': ' + res.statusText)
    return null
  }
}

export default {
  install (Vue, options) {
    Vue.prototype.$http = http
  }
}
