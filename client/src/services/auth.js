import * as zkitSdk from 'zerokit-web-sdk'

var user = null

export default {
  install (Vue, { $http }) {
    Vue.prototype.$auth = {
      login () {

      },
      logout () {

      },
      async auth () {
        const whoami = await zkitSdk.whoAmI()
        if (whoami == null) return

        user = await $http('get', '/api/zkit/user?zkitId=' + whoami)
        if (!user || !user.zkitId) {
          user = null

          // Temporary hack
          const {count} = await $http('get', '/api/user/count')

          if (count === 0) {
            user = {
              id: '000',
              username: 'Fake admin',
              role: 'admin'
            }
          }
        }
      },
      isAuth () {
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
