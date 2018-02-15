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

export default {
  props: ['onSubmit'],
  data () {
    return {
      name: '',
      filename: '',
      file: null,
      valid: true,
      nameRules: FileRules.name,
      fileRules: FileRules.file
    }
  },
  methods: {
    onFiles (val) {
      this.file = val[0]
    },
    encryptFile (file) {
      return new Promise((resolve, reject) => {
        var reader = new FileReader()

        reader.onload = () => {
          // zkit_sdk.encrypt(tresorId, text)
          resolve(reader.result)
        }
        reader.onerror = reject

        reader.readAsText(file)
      })
    },
    async submit () {
      const id = await this.$http('post', '/api/files', {
        name: this.name,
        encryptedString: await this.encryptFile(this.file)
      })
      const file = await this.$http('get', `/api/files/${id}`)

      this.$emit('onSubmit', file)
      this.valid = true
      this.name = ''
      this.filename = ''
    }
  },
  components: {
    FileInput
  }
}
</script>

<style lang="sass">

</style>
