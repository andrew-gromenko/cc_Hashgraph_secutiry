<template lang="pug">
div
  v-card-text
    //v-subheader Group name: {{group.name}}
    v-layout(row)
      v-flex.sm12
        editable-list(v-if="group"
          :group="group"
          :ids="group.userIds"
          itemText="username"
          target="user"
          title="Users"
          label="Search user by name"
        )
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
  }
}
</script>

<style lang="sass">

</style>
