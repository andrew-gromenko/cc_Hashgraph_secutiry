<template lang="pug">
v-list(subheader)
  template(v-for="group in groups")
    v-subheader {{group.name}}
    v-list-tile(v-for="file in group.files", :key="file.id")
        v-list-tile-title {{file.name}}
        v-chip {{file.type}}
        v-btn(icon, @click='download(file)')
            v-icon file_download
</template>

<script>
import FileSaver from 'filesaver.js'
import * as zkitSDK from 'zerokit-web-sdk'
import m2e from 'mime-to-extensions'

export default {
  data () {
    return {
      groups: []
    }
  },
  methods: {
    getFileExtension (file) {
      return m2e.extension(file.type)
    },
    async download (file) {
      const res = await fetch('http://localhost:3000/api/file/download/' + file.id, {
        method: 'GET',
        credentials: 'include'
      })
      if (!res.ok) {
        const { message } = await res.json()
        return this.$eventBus.$emit('notify', message)
      }

      const blob = await res.blob()
      var decryptedBlob
      try {
        decryptedBlob = await zkitSDK.decryptBlob(blob)
      } catch (e) {
        return this.$eventBus.$emit('notify', e.description)
      }
      FileSaver.saveAs(decryptedBlob, file.name + '.' + this.getFileExtension(file))
    }
  },
  async mounted () {
    this.groups = await this.$http('get', `/api/group?userId=${this.$auth.getUser().id}`)
  }
}
</script>

<style lang="sass">

</style>
