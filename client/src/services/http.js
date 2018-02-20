export default {
  install (Vue, { $eventBus }) {
    Vue.prototype.$http = async function http (method, url, data) {
      var res = null
      var headers = {}
      if (data && !(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
      }

      try {
        res = await fetch(url, {
          headers,
          method: method.toUpperCase(),
          body: data instanceof FormData ? data : (data ? JSON.stringify(data) : null)
        })

        const json = await res.json()

        if (!res.ok) {
          $eventBus.$emit(
            'notify',
            !json.message ? res.status + ': ' + res.statusText : json.message
          )
        }

        return json
      } catch (e) {
        $eventBus.$emit('notify', res.status + ': ' + res.statusText)
        console.error('Http error', e)
        return null
      }
    }
  }
}
