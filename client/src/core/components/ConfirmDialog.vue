<template lang="pug">
v-dialog(v-model="dialog" persistent max-width="400px")
  v-card
    v-card-title
      span.headline {{title}}
    v-card-actions
      v-spacer
      v-btn(color="blue darken-1", flat, @click.native="cancel()") Cancel
      v-btn(color="red darken-1", flat, @click.native="confirm()") Confirm
</template>
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
    }
  },
  methods: {
    cancel () {
      this.dialog = false
      this.$emit('canceled')
    },
    confirm () {
      this.dialog = false
      this.$emit('confirmed')
    }
  }
}
</script>
