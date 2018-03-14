<template lang="pug">
div.auth-container
    h2.headline.margin-top Two factor auth
    small.block don't forget to scan QR with authorizer
    img(:src="qr", height="auto").auth-img
    v-btn(color="primary", @click="enableTwoFactorAuth").block.auth-btn {{twoFactorAuth ? 'Disable' : 'Enable'}}
</template>

<script>
export default {
  data () {
    return {
      qr: null,
      twoFactorAuth: false
    }
  },
  methods: {
    enableTwoFactorAuth () {
      this.$http('post', '/api/user/2factor-auth')
      this.twoFactorAuth = !this.twoFactorAuth
    }
  },
  async mounted () {
    this.qr = this.$auth.getUser().qr
    this.twoFactorAuth = this.$auth.getUser().twoFactorAuth
  },
  components: {
  }
}
</script>

<style lang="sass">
  .auth-container
    display: block;
    margin: 0 auto;
    width: 300px;
    text-align: center;

  .auth-img
    margin: 20px auto
    display: block

  .block
    display: block

  .margin-top
    margin-top: 20px;
  .auth-btn
    margin: 0;
    padding: 0;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
</style>
