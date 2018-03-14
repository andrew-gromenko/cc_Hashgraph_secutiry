<template lang="pug">
v-navigation-drawer(
  temporary
  v-model="drawer"
  absolute
)
  v-toolbar.transparent(flat)
    v-list.pa-0
      v-list-tile(avatar)
        v-list-tile-avatar
          img(src="https://randomuser.me/api/portraits/men/85.jpg")
        v-list-tile-content
          v-list-tile-title {{$auth.getUser().username}}
  v-list.pt-0(dense='')
    v-divider
    v-list-tile(v-for='item in items', :key='item.title', :to="item.route", v-if="isShown(item)")
      v-list-tile-action
        v-icon {{ item.icon }}
      v-list-tile-content
        v-list-tile-title {{ item.title }}
</template>

<script>
export default {
  props: ['show'],
  data () {
    return {
      drawer: false,
      items: [
        {
          title: 'Home',
          route: '/',
          icon: 'home',
          admin: false
        },
        {
          title: 'Settings',
          route: 'auth',
          icon: 'settings'
        },
        {
          title: 'Admin panel',
          route: 'admin',
          icon: 'dashboard',
          admin: true
        }
      ]
    }
  },
  watch: {
    show (val) {
      if (val) { this.drawer = true }
    },
    drawer (val) {
      if (!val) { this.$emit('closed') }
    }
  },
  methods: {
    isShown (item) {
      if (item.admin && !this.$auth.isAdmin()) {
        return false
      }
      if (item.admin === false && this.$auth.isAdmin()) {
        return false
      }
      return true
    }
  }
}
</script>
