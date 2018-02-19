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
      this.file = val[0]
    },
    encryptFile (file) {
      return new Promise((resolve, reject) => {
        var reader = new FileReader()

        reader.onload = async () => {
          const data = await zkitSDK.encrypt(this.group.tresorId, reader.result)

          resolve(data)
        }
        reader.onerror = reject

        reader.readAsText(file)
      })
    },
    async submit () {
      if (!this.group) {
        this.$eventBus.$emit('notify', 'Choose a group')
        return
      }

      const id = await this.$http('post', '/api/files', {
        name: this.name,
        encryptedString: await this.encryptFile(this.file),
        groupId: this.group.id
      })
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
