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
      const {userId, regSessionId} = await this.$http('post',
        'http://localhost:4000/api/user/init-user-registration', {
          userName: this.name,
          needAdmin: this.needAdmin || false
        }
      )
      if (!userId || !regSessionId) return

      const regResponse = await this.zkitReg.register(userId, regSessionId)
      await this.$http('post', 'http://localhost:4000/api/user/finish-user-registration',
        {
          userId,
          validationVerifier: regResponse.RegValidationVerifier,
          zkitId: userId
        }
      )
      const newUser = await this.$http('get', 'http://localhost:4000/api/user/get-user-id?userName=' + this.name)

      this.$emit('onSubmit', newUser)
      this.valid = true
      this.name = ''
      this.password = ''
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
