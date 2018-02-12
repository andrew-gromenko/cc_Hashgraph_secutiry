<template lang="pug">
div
  v-tabs(centered, dark, color='primary', v-model="tab")
    v-tabs-slider(color="yellow")
    v-tab(href="#groups") Group
    v-tab(href="#files") Files
    v-tab(href="#users") Users
  v-tabs-items(v-model="tab")
    v-tab-item(id="groups")
      groups
    v-tab-item(id="files")
      files
    v-tab-item(id="users")
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
.tab-item
  height: 100%
</style>
