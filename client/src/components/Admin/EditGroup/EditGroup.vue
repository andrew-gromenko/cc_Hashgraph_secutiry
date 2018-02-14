<template lang="pug">
div
  //v-subheader Group name: {{group.name}}
  v-layout(row)
    v-flex.sm6
      editable-list(v-if="group", :groupId="group.id", :ids="group.fileIds", target="file", title="Files", label="Search file by name")
    v-flex.sm6
      editable-list(v-if="group", :groupId="group.id", :ids="group.userIds", target="user", title="Users", label="Search user by name")
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
  components: {
    EditableList
  },
  mounted () {
    console.log(this.group)
  }
}
</script>

<style lang="sass">

</style>
