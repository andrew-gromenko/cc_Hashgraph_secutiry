var user = null

export default {
  install (Vue, { $http }) {
    Vue.prototype.$auth = {
      login () {

      },
      logout () {

      },
      async auth () {
        const userId = '5a82d3ea8854aa7bae1a4f17' // localStorage.
        user = {
          id: userId,
          username: 'asdf',
          role: 'admin'
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
