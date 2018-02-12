<template lang="pug">
v-navigation-drawer(
  v-if="$auth.isAuth()"
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
          v-list-tile-title {{$auth.getUser().name}}
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
      return item.role !== 'admin' || (this.$auth.isAdmin() && item.role === 'admin')
    }
  }
}
</script>
