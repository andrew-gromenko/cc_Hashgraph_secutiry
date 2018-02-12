<template lang="pug">
v-snackbar(:timeout="timeout"
    :bottom="true"
    v-model="snackbar") {{message}}
</template>

<script>
export default {
  data () {
    return {
      timeout: 3000,
      snackbar: false,
      message: ''
    }
  },
  mounted () {
    this.$eventBus.$on('notify', (val) => {
      this.snackbar = true
      this.message = val
    })
  }
}
</script>

<style lang="sass">

</style>
