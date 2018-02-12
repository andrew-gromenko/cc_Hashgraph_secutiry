<template lang="pug">
div
  popup(title="Add file", :show="addPopup", @closed="addPopup = false")
    add-file
  v-list
      v-list-tile(v-for='file in files', :key='file.id')
          v-list-tile-title(v-text='file.name')
          v-btn(icon, @click='')
              v-icon delete
  add-button(@click="addPopup = true")
</template>

<script>
import AddFile from './AddFile.vue'
import Popup from '../../core/components/Popup'
import AddButton from '../../core/components/AddButton.vue'

export default {
  data () {
    return {
      files: [],
      addPopup: false
    }
  },
  async mounted () {
    this.files = await this.$http('get', '/api/files')
  },
  components: {
    AddFile,
    AddButton,
    Popup
  }
}
</script>

<style lang="sass">

</style>
