import * as zkitSdk from 'zerokit-web-sdk'

let user = null
let admin = false

const idpLogin = (token, name, cb) => new Promise((resolve, reject) => {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  document.body.appendChild(iframe)

  iframe.addEventListener('load', () => {
    let iframeLocation
    try {
      iframeLocation = iframe.contentWindow.location
      if (iframeLocation.origin !== window.location.origin) {
        return false
      }
    } catch (e) {
      return console.error(e)
    }
    if (iframeLocation.pathname === location.pathname) {
      document.body.removeChild(iframe)
      if (iframeLocation.hash && iframeLocation.hash.indexOf('error') !== -1) {
        return console.error(new Error(iframeLocation.search.substr(1)))
      }
      return resolve(null)
    }
  })

  iframe.src = `http://localhost:3000/api/auth/login?reto=${encodeURIComponent(location.href)}&token=${token}&username=${name}`
})

export default {
  install (Vue, { $http, $eventBus }) {
    Vue.prototype.$auth = {
      async login (zkitLogin, name, token) {
        console.log(token)
        try {
          const zkitId = await $http('get', `/api/user/get-user-id?userName=${name}`)
          if (!zkitId) {
            throw new Error('There is no such user')
          }
          console.log('here')
          await zkitLogin.login(zkitId)
          await idpLogin(token, name)
          user = await $http('get', `/api/user/me`)
          admin = await $http('get', `/api/user/admin?zkitId=${user.zkitId}`)
          console.log('User: ', user, admin)
          return user.zkitId
        } catch (e) {
          $eventBus.$emit('notify', e.description || e.message)
        }
      },
      async logout () {
        await zkitSdk.logout()
        user = null
      },
      get isAuth () {
        return Boolean(user)
      },
      async Authenticate () {
        const zkitId = await zkitSdk.whoAmI()
        if (zkitId) {
          if (!user) {
            user = await $http('get', `/api/user/me`)
            admin = await $http('get', `/api/user/admin?zkitId=${user.zkitId}`)
          }
          return true
        } else {
          return false
        }
      },
      isAdmin () {
        return user && admin
      },
      getUser () {
        return user
      }
    }
  }
}
