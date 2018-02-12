<template lang="pug">
v-dialog(v-model="dialog" max-width="600px")
    v-card
        v-card-title
            span.headline Edit user's files
        v-card-text
            v-list
                v-list-tile(v-for='file in files', :key='file.id')
                    v-list-tile-title(v-text='file.name')
                    v-checkbox(v-model="file.allowed", @change="fileChanged(file)")
        v-card-actions
            v-spacer
            v-btn(color="green darken-1" flat="flat" @click="dialog = false") Accept
</template>

<script>
export default {
  props: {
    user: {
      required: true
    },
    closed: {}
  },
  watch: {
    dialog (val) {
      if (!val) this.$emit('closed')
    },
    async user (val) {
      if (val == null) return

      this.dialog = true
      this.files = await this.$http('get', '/api/files?userId=' + this.user.id)
    }
  },
  methods: {
    async fileChanged (file) {
      this.$http('patch', '/api/files/' + file.id, {
        allowed: file.allowed
      })
    }
  },
  data () {
    return {
      dialog: false,
      files: []
    }
  }
}
</script>

<style lang="sass">

</style>
