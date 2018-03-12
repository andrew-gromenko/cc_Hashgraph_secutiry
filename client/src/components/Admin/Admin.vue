<template lang="pug">
v-layout.layout(fill-height)
  v-flex(style="flex: auto 0")
    v-tabs(centered, dark, color='primary', v-model="tab")
      v-tabs-slider(color="yellow")
      v-tab(href="#groups") Group
      v-tab(href="#files") Files
      v-tab(href="#users") Users
      v-tab(href="#settings") Settings
  v-tabs-items.tab_items(v-model="tab")
    v-tab-item.tab_item(id="groups")
      groups
    v-tab-item.tab_item(id="files")
      files
    v-tab-item.tab_item(id="users")
      users
    v-tab-item.tab_item(id="settings")
      auth

</template>

<script>
import Groups from './Groups/Groups.vue'
import Files from './Files/Files.vue'
import Users from './Users/Users.vue'
import Auth from './Auth/Auth.vue'

export default {
  data () {
    return {
      tab: 'groups'
    }
  },
  components: {
    Groups,
    Files,
    Users,
    Auth
  }
}
</script>

<style lang="sass">
.layout
  flex-direction: column

.tab_items
  flex: 1

.tab_item
  height: 100%
  display: flex
</style>
