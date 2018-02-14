<template lang="pug">
v-app
  navigation-drawer(v-if="$auth.isAuth()", :show="drawer", @closed="drawer = false")
  v-toolbar(dark='', color='primary', tabs)
    v-toolbar-side-icon(@click.stop="drawer = !drawer")
    v-toolbar-title.white--text
      | {{title}}
  v-content.white
    router-view
    notification
</template>

<script>
import Notification from './components/Notification.vue'
import NavigationDrawer from './components/NavigationDrawer.vue'

export default {
  data () {
    return {
      title: 'Sapientiae service',
      drawer: false,
      items: [
        {
          title: 'Home',
          route: '/',
          icon: 'home'
        },
        {
          title: 'Admin panel',
          route: 'admin',
          icon: 'dashboard',
          role: 'admin'
        }
      ]
    }
  },
  methods: {
    isShown (item) {
      return item.role !== 'admin' || (this.$auth.isAdmin() && item.role === 'admin')
    }
  },
  components: {
    Notification,
    NavigationDrawer
  }
}
</script>
