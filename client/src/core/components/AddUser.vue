<template lang="pug">
div
  v-card-text
    v-form(v-model="valid")
      v-text-field(
        prepend-icon='account_box'
        required
        label='Name'
        v-model="name"
        :rules="nameRules"
      )
      .password-frame(ref="frame")
        v-icon.pw1 vpn_key
        v-icon.pw2 vpn_key
  v-card-actions
    v-spacer
    v-btn(color="primary", @click="submit", :disabled="!valid") Submit
</template>

<script>
import { UserRules } from '@/core/validation/rules'
import * as zkitSdk from 'zerokit-web-sdk'

export default {
  props: ['needAdmin', 'onSubmit'],
  data () {
    return {
      name: '',
      password: '',
      hidePassword: true,
      valid: true,
      nameRules: UserRules.name,
      passwordRules: UserRules.password,
      zkitReg: null
    }
  },
  methods: {
    async submit () {
      const {userId, regSessionId} = await this.$http('post', '/api/user/init-user-registration', {
        username: this.name
      })
      if (!userId || !regSessionId) {
        return
      }

      const regResponse = await this.zkitReg.register(userId, regSessionId)
      const newUser = await this.$http('post', '/api/user/finish-user-registration', {
        userId,
        validationVerifier: regResponse.RegValidationVerifier
      })

      this.name = ''
      this.valid = true
      this.$emit('onSubmit', newUser)
    }
  },
  mounted () {
    this.zkitReg = zkitSdk.getRegistrationIframe(this.$refs.frame)
    this.zkitReg.setPlaceholder('pw1', 'Password*')
    this.zkitReg.setPlaceholder('pw2', 'Confirm password*')
  }
}
</script>

<style lang="sass">
@import '../../assets/password-frame'

</style>
