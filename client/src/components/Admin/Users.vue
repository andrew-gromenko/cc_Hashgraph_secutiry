<template lang="pug">
v-flex
  popup(title="Register user", :show="addPopup", @closed="addPopup = false")
    add-group
  confirm-dialog(:title="'Do you want to delete the '+(deletedUser?deletedUser.name:'')+'?'",
                :show="confirmDeleteDialog",
                @canceled="confirmDeleteDialog = false",
                @confirmed="confirmDeleteDialog = false; deleteUserConfirm()"
  )
  v-list
      v-list-tile(v-for='user in users', :key='user.id')
          v-list-tile-title(v-text='user.name')
          v-btn(icon, @click='deleteUser(user)')
              v-icon delete
  add-button(@click="addPopup = true")
</template>

<script>
import AddGroup from './AddGroup.vue'
import Popup from '../../core/components/Popup'
import AddButton from '../../core/components/AddButton.vue'
import ConfirmDialog from '../../core/components/ConfirmDialog'

export default {
  data () {
    return {
      users: [],
      addPopup: false,
      confirmDeleteDialog: false,
      deletedUser: null
    }
  },
  methods: {
    deleteUser (user) {
      this.deletedUser = user
      this.confirmDeleteDialog = true
    },
    async deleteUserConfirm () {
      // await this.$http('delete', '/api/users/'+deletedUser.id);
      console.log('deleteUserConfirm')
      this.confirmDeleteDialog = false
    }
  },
  async mounted () {
    this.users = await this.$http('get', '/api/users')
  },
  components: {
    AddGroup,
    AddButton,
    Popup,
    ConfirmDialog
  }
}
</script>

<style lang="sass">

</style>
