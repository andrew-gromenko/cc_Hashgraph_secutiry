var user = null

export default {
  install (Vue, { $http }) {
    Vue.prototype.$auth = {
      login () {

      },
      logout () {

      },
      async auth () {
        const userId = 1// localStorage.
        user = await $http('get', '/api/users/' + userId)
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
