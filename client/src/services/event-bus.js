export default {
  install (Vue, options) {
    Vue.prototype.$eventBus = new Vue()
  }
}
