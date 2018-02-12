import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import App from './App.vue'
import router from './router'
import store from './store'
import EventBus from './services/event-bus'
import Http from './services/http'
import Auth from './services/auth'

Vue.use(Vuetify)
Vue.use(EventBus)
Vue.use(Http)
Vue.use(Auth)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')