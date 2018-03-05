import * as zkitSdk from 'zerokit-web-sdk'

let user = null

const idpLogin = () => {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)

    document.addEventListener('load', () => {
      let iframeLocation
      try {
        iframeLocation = iframe.contentWindow.location
        console.log(iframeLocation.origin !== window.location.origin) // try to access origin
      } catch (e) {
        reject(e)
      }
      if (iframeLocation.pathname === location.pathname) {
        console.log('End of IDP login')
        document.body.removeChild(iframe)
        if (iframeLocation.hash && iframeLocation.hash.indexOf('error') !== -1) {
          return reject(new Error(iframeLocation.search.substr(1)))
        }
      }
      resolve()
    })

    iframe.src = `http://localhost:3000/api/auth/login?reto=${encodeURIComponent(location.href)}`
  })
}

export default {
  install (Vue, { $http, $eventBus }) {
    Vue.prototype.$auth = {
      async login (zkitLogin, name) {
        try {
          const zkitId = await $http('get', `http://localhost:3000/api/user/get-user-id?userName=${name}`)
          if (!zkitId) {
            return null
          }

          const userId = await zkitLogin.login(zkitId)
          await idpLogin()

          return userId
        } catch (e) {
          $eventBus.$emit('notify', e.description || e.message)
        }
      },
      async logout () {
        await zkitSdk.logout()
        user = null
      },
      get isAuth () {
        return user !== null
      },
      isAdmin () {
        return user && user.role === 'admin'
      },
      getUser () {
        return user
      }
    }
  }
}
