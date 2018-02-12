<template lang="pug">
div
  popup(title="Add group", :show="addPopup", @closed="addPopup = false")
    add-group
  popup(title="Edit group", :show="groupEditPopup", @closed="groupEditPopup = false; editedGroup = null")
    edit-group(:group="editedGroup")
  v-list
      v-list-tile(v-for='group in groups', :key='group.id')
          v-list-tile-title(v-text='group.name')
          v-btn(icon, @click='editedGroup = group')
              v-icon edit
          v-btn(icon, @click='')
              v-icon delete
  add-button(@click="addPopup = true")
</template>

<script>
import AddGroup from './AddGroup.vue'
import EditGroup from './EditGroup/EditGroup.vue'
import Popup from '../../core/components/Popup'
import AddButton from '../../core/components/AddButton.vue'

export default {
  data () {
    return {
      groups: [],
      addPopup: false,
      groupEditPopup: false,
      editedGroup: null
    }
  },
  watch: {
    editedGroup (val) {
      if (val) {
        this.groupEditPopup = true
      }
    }
  },
  async mounted () {
    this.groups = await this.$http('get', '/api/groups')
  },
  components: {
    AddGroup,
    EditGroup,
    AddButton,
    Popup
  }
}
</script>

<style lang="sass">

</style>
