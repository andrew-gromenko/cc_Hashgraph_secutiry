<template lang="pug">
v-flex
  popup(title="Add group", :show="addPopup", @closed="addPopup = false")
    add-group(@onSubmit="onSubmit")
  popup(title="Edit group", :show="groupEditPopup", @closed="groupEditPopup = false")
    edit-group(:group="editedGroup")
  confirm-dialog(:title="'Do you want to delete the '+(deletedGroup?deletedGroup.name:'')+' group?'",
                :show="confirmDeleteDialog",
                @canceled="confirmDeleteDialog = false",
                @confirmed="confirmDeleteDialog = false; deleteGroupConfirm()"
  )
  v-list
      v-list-tile(v-for='group in groups', :key='group.id')
          v-list-tile-title(v-text='group.name')
          v-btn(icon, @click='editGroup(group)')
              v-icon edit
          v-btn(icon, @click='deleteGroup(group)')
              v-icon delete
  add-button(@click="addPopup = true")
</template>

<script>
import AddGroup from './AddGroup.vue'
import EditGroup from './EditGroup/EditGroup.vue'
import Popup from '@/core/components/Popup'
import AddButton from '@/core/components/AddButton.vue'
import ConfirmDialog from '@/core/components/ConfirmDialog'

export default {
  data () {
    return {
      groups: [],
      addPopup: false,
      groupEditPopup: false,
      confirmDeleteDialog: false,
      editedGroup: null,
      deletedGroup: null
    }
  },
  methods: {
    editGroup (group) {
      this.editedGroup = group
      this.groupEditPopup = true
    },
    deleteGroup (group) {
      this.deletedGroup = group
      this.confirmDeleteDialog = true
    },
    async deleteGroupConfirm () {
      await this.$http('delete', '/api/group/' + this.deletedGroup.id)
      this.groups.splice(this.groups.indexOf(this.deletedGroup), 1)
    },
    onSubmit (group) {
      this.addPopup = false
      this.groups.push(group)
    }
  },
  async mounted () {
    this.groups = await this.$http('get', '/api/group')
  },
  components: {
    AddGroup,
    EditGroup,
    AddButton,
    Popup,
    ConfirmDialog
  }
}
</script>

<style lang="sass">

</style>
