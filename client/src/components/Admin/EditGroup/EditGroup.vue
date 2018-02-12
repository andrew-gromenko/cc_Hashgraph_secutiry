<template lang="pug">
div
  //v-subheader Group name: {{group.name}}
  v-layout(row)
    v-flex.sm6
      editable-list(:items="files", target="files", title="Files", label="Search file by name")
    v-flex.sm6
      editable-list(:items="users", target="users", title="Users", label="Search user by name")
</template>

<script>
import EditableList from './EditableList.vue'

export default {
  props: ['group'],
  data () {
    return {
      files: [],
      users: []
    }
  },
  watch: {
    group (val) {
      if (!val) return

      this.files = this.group.fileIds
      this.users = this.group.userIds
    }
  },
  components: {
    EditableList
  }
}
</script>

<style lang="sass">

</style>
