async function http (method, url, data) {
  try {
    var res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: method.toUpperCase(),
      body: data ? JSON.stringify(data) : null
    })

    return await res.json()
  } catch (e) {
    console.error(e)
    this.$eventBus.$emit('notify', e.message)
    return null
  }
}

export default {
  install (Vue, options) {
    Vue.prototype.$http = http
  }
}
