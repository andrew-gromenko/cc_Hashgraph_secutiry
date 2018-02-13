<template lang="pug">
v-flex
  popup(title="Add file", :show="addPopup", @closed="addPopup = false")
    add-file
  confirm-dialog(:title="'Do you want to delete the '+(deletedFile?deletedFile.name:'')+' file?'",
                :show="confirmDeleteDialog",
                @canceled="confirmDeleteDialog = false",
                @confirmed="confirmDeleteDialog = false; deleteFileConfirm()"
  )
  v-list
      v-list-tile(v-for='file in files', :key='file.id')
          v-list-tile-title(v-text='file.name')
          v-btn(icon, @click='deleteFile(file)')
              v-icon delete
  add-button(@click="addPopup = true")
</template>

<script>
import AddFile from './AddFile.vue'
import Popup from '../../core/components/Popup'
import AddButton from '../../core/components/AddButton.vue'
import ConfirmDialog from '../../core/components/ConfirmDialog'

export default {
  data () {
    return {
      files: [],
      addPopup: false,
      confirmDeleteDialog: false,
      deletedFile: null
    }
  },
  methods: {
    deleteFile (file) {
      this.deletedFile = file
      this.confirmDeleteDialog = true
    },
    async deleteFileConfirm () {
      // await this.$http('delete', '/api/files/'+deletedFile.id);
      console.log('deleteFileConfirm')
      this.confirmDeleteDialog = false
    }
  },
  async mounted () {
    this.files = await this.$http('get', '/api/files')
  },
  components: {
    AddFile,
    AddButton,
    Popup,
    ConfirmDialog
  }
}
</script>

<style lang="sass">

</style>
