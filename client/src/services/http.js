import * as zkitSDK from 'zerokit-web-sdk'

export default {
  install (Vue, { $eventBus }) {
    Vue.prototype.$http = async function http (method, url, data) {
      console.log('you made it')
      var res = null
      var headers = {}
      const baseUrl = 'http://localhost:3000'
      const zkitId = await zkitSDK.whoAmI()
      headers['ZkitID-Auth'] = zkitId
      if (data && !(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
      }

      try {
        res = await fetch(url.startsWith('http://') ? url : baseUrl + url, {
          headers,
          method: method.toUpperCase(),
          body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
          credentials: 'include'
        })

        const json = await res.json()

        if (!res.ok) {
          console.log('Here')
          throw new Error(
            !json.message ? res.status + ': ' + res.statusText : json.message
          )
        }

        return json
      } catch (e) {
        $eventBus.$emit('notify', res.status + ': ' + res.statusText)
        console.error('Http error', e)
        throw e
      }
    }
  }
}
