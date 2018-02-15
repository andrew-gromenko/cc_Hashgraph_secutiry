import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import AsyncComputed from 'vue-async-computed'

import App from './App.vue'
import router from './router'
import store from './store'
import EventBus from './services/event-bus'
import Http from './services/http'
import Auth from './services/auth'

Vue.use(AsyncComputed)

Vue.use(Vuetify)
Vue.use(EventBus)
Vue.use(Http)
Vue.use(Auth, {$http: Vue.prototype.$http})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
