<template lang="pug">
v-app
  navigation-drawer(v-if="$auth.isAuth", :show="drawer", @closed="drawer = false")
  v-toolbar(dark='', color='primary', tabs)
    v-toolbar-side-icon(@click.stop="drawer = !drawer", :disabled="!$auth.isAuth")
    v-toolbar-title.white--text
      | {{title}}
    v-spacer
    v-btn(v-if="$auth.isAuth", icon, @click="logout()")
      v-icon exit_to_app
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
    async logout () {
      await this.$auth.logout()
      this.$router.push('/login')
    }
  },
  components: {
    Notification,
    NavigationDrawer
  }
}
</script>
