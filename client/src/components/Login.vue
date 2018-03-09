<template lang="pug">
v-layout
    v-flex.xs12.sm6.offset-sm3.md4.offset-md4
        v-card.mx-4.my-4
            v-card-title(primary-title)
                h3.headline.mb-0 Login
            v-form.mx-3(v-model='valid', lazy-validation)
                v-text-field(
                  prepend-icon='account_box',
                  label='Name',
                  v-model='name',
                  :rules='nameRules',
                  required
                  )
                v-text-field(
                  prepend-icon='lock',
                  label='Code',
                  v-model='token',
                  :rules='tokenRules',
                  required
                  )
                .password-frame.login(ref="frame")
                  v-icon.pw1 vpn_key
                v-card-actions.text-md-right
                    v-btn(flat, @click='submit', :disabled='!valid')
                        | Submit
</template>

<script>
import * as zkitSdk from 'zerokit-web-sdk'

export default {
  data () {
    return {
      valid: false,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length <= 30 || 'Name must be less than 20 characters',
        v => v.length >= 4 || 'Name must be more than 4 characters'
      ],
      token: '',
      tokenRules: [
        v => !!v || 'Code is required',
        v => v.length === 6 || 'Code must be 6 characters'
      ],
      zkitLogin: null
    }
  },
  methods: {
    async submit () {
      const userId = await this.$auth.login(this.zkitLogin, this.name, this.token)

      if (userId != null) {
        this.$router.push('/')
      }
    }
  },
  mounted () {
    this.zkitLogin = zkitSdk.getLoginIframe(this.$refs.frame)
  }
}
</script>

<style lang="sass">
@import '../assets/password-frame'
</style>
