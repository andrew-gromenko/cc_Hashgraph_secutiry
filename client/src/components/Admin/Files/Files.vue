<template lang="pug">
v-flex
  popup(title="Add file", :show="addPopup", @closed="addPopup = false")
    add-file(@onSubmit="onSubmit")
  confirm-dialog(:title="'Do you want to delete the '+(deletedFile?deletedFile.name:'')+' file?'",
                :show="confirmDeleteDialog",
                @canceled="confirmDeleteDialog = false",
                @confirmed="confirmDeleteDialog = false; deleteFileConfirm()"
  )
  v-list
      v-list-tile(v-for='file in files', :key='file.id')
          v-list-tile-title(v-text='file.name')
          v-chip {{file.group.name}}
          v-btn(icon, @click='deleteFile(file)')
              v-icon delete
  add-button(@click="addPopup = true")
</template>

<script>
import AddFile from './AddFile.vue'
import Popup from '@/core/components/Popup'
import AddButton from '@/core/components/AddButton.vue'
import ConfirmDialog from '@/core/components/ConfirmDialog'

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
      await this.$http('delete', '/api/files/' + this.deletedFile.id)
      this.files.splice(this.files.indexOf(this.deletedFile), 1)
    },
    onSubmit (file) {
      this.addPopup = false
      this.files.push(file)
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
