<template lang="pug">
div
  v-card-text
    v-form(v-model="valid")
      v-text-field(
        prepend-icon='attachment'
        required
        label='Name'
        v-model="name"
        :rules="nameRules"
      )
      v-select(
        prepend-icon='attachment'
        :items="searchItems"
        label="Group"
        clearable
        v-model="select"
        autocomplete
        :loading="loading"
        item-text="name"
        item-value="id"
        required
        :search-input.sync="search"
      )
      file-input(
        v-model="filename"
        @files="onFiles"
        required
        :rules="fileRules"
        :max-size="1024 * 1000 * 100"
      )
  v-card-actions
    v-spacer
    v-btn(color="primary", @click="submit", :disabled="!valid") Submit
</template>

<script>
import { FileRules } from '@/core/validation/rules'
import FileInput from '@/core/components/FileInput'
import * as zkitSDK from 'zerokit-web-sdk'

export default {
  props: ['onSubmit'],
  data () {
    return {
      name: '',
      filename: '',
      file: null,
      valid: true,
      group: null,
      nameRules: FileRules.name,
      fileRules: FileRules.file,
      select: null,
      loading: false,
      search: '',
      searchItems: []
    }
  },
  watch: {
    search (val) {
      val && this.querySelections(val)
    },
    select (id) {
      if (id == null) return

      this.group = this.searchItems.find(g => g.id === id)
    }
  },
  methods: {
    onFiles (val) {
      if (!val) {
        this.valid = false
        return
      }
      this.valid = true
      this.file = val[0]
    },
    async encryptFile (file) {
      try {
        console.log('tresorId', this.group.tresorId)
        return await zkitSDK.encryptBlob(this.group.tresorId, file)
      } catch (e) {
        this.$eventBus.$emit('notify', e.description)
      }
    },
    async submit () {
      if (!this.group) {
        this.$eventBus.$emit('notify', 'Choose a group')
        return
      }

      const encryptedBlob = await this.encryptFile(this.file)
      if (!encryptedBlob) {
        return
      }
      var fd = new FormData()
      fd.append('name', this.name)
      console.log(this.file)
      fd.append('encryptedData', encryptedBlob)
      fd.append('type', this.file.type)
      fd.append('groupId', this.group.id)

      const id = await this.$http('post', '/api/files', fd)
      const file = await this.$http('get', `/api/files/${id}`)

      this.$emit('onSubmit', file)
      this.valid = true
      this.name = ''
      this.filename = ''
    },
    async querySelections (query) {
      this.loading = true
      this.searchItems = await this.$http('get', `/api/groups?substr=${query}`)
      this.loading = false
    }
  },
  components: {
    FileInput
  }
}
</script>

<style lang="sass">

</style>
