import * as zkitSdk from 'zerokit-web-sdk'

let user = null
let admin = false

const idpLogin = (token, cb) => {
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
      return cb(e)
    }
    if (iframeLocation.pathname === location.pathname) {
      document.body.removeChild(iframe)
      if (iframeLocation.hash && iframeLocation.hash.indexOf('error') !== -1) {
        return cb(new Error(iframeLocation.search.substr(1)))
      }
      return cb(null)
    }
  })

  iframe.src = `http://localhost:3000/api/auth/login?reto=${encodeURIComponent(location.href)}&token=${token}`
}

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

          const userId = await zkitLogin.login(zkitId)
          await idpLogin(token, async err => {
            if (err) {
              throw err
            }
            user = await $http('get', `/api/user/`)
            const { zkitId: adminId } = await $http('get', '/api/user/admin')
            admin = adminId === user.address
            console.log('User: ', user, admin)

            return userId
          })
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
      isAdmin () {
        return user && admin
      },
      getUser () {
        return user
      }
    }
  }
}
