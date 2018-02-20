import * as zkitSDK from 'zerokit-web-sdk'

export default {
  install (Vue, { $eventBus }) {
    Vue.prototype.$http = async function http (method, url, data) {
      var res = null
      var headers = {}
      const zkitId = await zkitSDK.whoAmI()
      headers['Authorization'] = zkitId
      if (data && !(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
      }

      try {
        console.log(data)
        res = await fetch(url, {
          headers,
          method: method.toUpperCase(),
          body: data instanceof FormData ? data : (data ? JSON.stringify(data) : null)
        })

        const json = await res.json()
        console.log(res)

        if (!res.ok) {
          $eventBus.$emit(
            'notify',
            !json.message ? res.status + ': ' + res.statusText : json.message
          )
        }

        return json
      } catch (e) {
        console.log(e)
        $eventBus.$emit('notify', res.status + ': ' + res.statusText)
        console.error('Http error', e)
        return null
      }
    }
  }
}
