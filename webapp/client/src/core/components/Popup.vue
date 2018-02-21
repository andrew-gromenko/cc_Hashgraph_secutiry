<template lang="pug">
v-dialog(v-model="dialog" max-width="600px")
  v-card
    v-card-title
      span.headline {{title}}
    slot
</template>

<script>
export default {
  props: ['show', 'closed', 'title'],
  data () {
    return {
      dialog: false
    }
  },
  watch: {
    show (val) {
      this.dialog = val
    },
    dialog (val) {
      if (!val) {
        this.$emit('closed')
      }
    }
  }
}
</script>

<style lang="sass">

</style>
