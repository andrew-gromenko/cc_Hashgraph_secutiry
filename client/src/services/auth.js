import * as zkitSdk from 'zerokit-web-sdk'

var user = null

export default {
  install (Vue, { $http, $eventBus }) {
    Vue.prototype.$auth = {
      async login (zkitLogin, name) {
        const u = await $http('get', '/api/zkit/user?username=' + name)
        if (!u.zkitId) {
          return null
        }
        var userId = null

        try {
          userId = await zkitLogin.login(u.zkitId)
        } catch (e) {
          $eventBus.$emit('notify', e.description)
        }

        return userId
      },
      async logout () {
        await zkitSdk.logout()
        user = null
      },
      async auth () {
        // Temporary hack
        const {count} = await $http('get', '/api/user/count')

        if (count === 0) {
          user = {
            id: '000',
            username: 'Fake admin',
            role: 'admin'
          }
        }
        const whoami = await zkitSdk.whoAmI()
        if (whoami == null) return

        user = await $http('get', '/api/zkit/user?zkitId=' + whoami)
        if (!user || !user.zkitId) {
          user = null
        }
      },
      get isAuth () {
        return user !== null
      },
      async isAdmin () {
        return user && user.role === 'admin'
      },
      getUser () {
        return user
      }
    }
  }
}
