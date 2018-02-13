<template lang="pug">
v-layout.layout(fill-height)
  v-flex(style="flex: auto 0")
    v-tabs(centered, dark, color='primary', v-model="tab")
      v-tabs-slider(color="yellow")
      v-tab(href="#groups") Group
      v-tab(href="#files") Files
      v-tab(href="#users") Users
  v-tabs-items.tab_items(v-model="tab")
    v-tab-item.tab_item(id="groups")
      groups
    v-tab-item.tab_item(id="files")
      files
    v-tab-item.tab_item(id="users")
      users

</template>

<script>
import Groups from './Groups.vue'
import Files from './Files.vue'
import Users from './Users.vue'

export default {
  data () {
    return {
      tab: 'groups'
    }
  },
  components: {
    Groups,
    Files,
    Users
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
