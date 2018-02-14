<template lang="pug">
div
  v-text-field(
    prepend-icon='attach_file'
    single-line=''
    v-model='filename'
    :label='label'
    :required='required'
    @click.native='onFocus'
    :disabled='disabled'
    ref='fileTextField'
    :rules="rules"
  )
  input(
    type='file'
    :accept='accept'
    :multiple='multiple'
    :disabled='disabled'
    ref='fileInput'
    @change='onFileChange'
  )
</template>

<script>
export default {
  props: {
    value: {
      type: [Array, String]
    },
    accept: {
      type: String,
      default: '*'
    },
    label: {
      type: String,
      default: 'Choose file'
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array
    }
  },
  data () {
    return {
      filename: ''
    }
  },
  watch: {
    value (v) {
      this.filename = v
    }
  },
  mounted () {
    this.filename = this.value
  },
  methods: {
    onFocus () {
      if (!this.disabled) {
        this.$refs.fileInput.click()
      }
    },
    onFileChange ($event) {
      const files = $event.target.files || $event.dataTransfer.files

      if (files) {
        if (files.length > 0) {
          this.filename = [...files].map(file => file.name).join(', ')
        } else {
          this.filename = null
        }
      } else {
        this.filename = $event.target.value.split('\\').pop()
      }
      this.$emit('input', this.filename)
      this.$emit('files', files)
    }
  }
}
</script>

<style lang="sass">
input[type=file]
  position: absolute
  left: -99999px
</style>
