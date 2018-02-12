var user = null

export default {
  install (Vue, options) {
    Vue.prototype.$auth = {
      login () {

      },
      logout () {

      },
      auth () {
        user = {
          name: 'Matt',
          id: 2,
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
