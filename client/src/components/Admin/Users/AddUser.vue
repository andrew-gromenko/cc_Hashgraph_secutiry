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
      //v-text-field(
        prepend-icon='security'
        required
        label='Password'
        v-model="password"
        :rules="passwordRules"
        :type="hidePassword ? 'password' : 'text'"
        :append-icon="hidePassword ? 'visibility_off' : 'visibility'"
        :append-icon-cb="() => (hidePassword = !hidePassword)"
      //)
  v-card-actions
    v-spacer
    v-btn(color="primary", @click="submit", :disabled="!valid") Submit
</template>

<script>
import { UserRules } from '@/core/validation/rules'
import * as zkitSdk from 'zerokit-web-sdk'

export default {
  props: ['onSubmit'],
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
        'api/zkit/init-user-registration', {
          username: this.name
        }
      )
      if (!userId || !regSessionId) return

      const regResponse = await this.zkitReg.register(userId, regSessionId)
      const newUser = await this.$http('post', 'api/zkit/finish-user-registration',
        {
          userId,
          validationVerifier: regResponse.RegValidationVerifier
        }
      )

      this.$emit('onSubmit', newUser)
      this.valid = true
      this.name = ''
    }
  },
  mounted () {
    this.zkitReg = zkitSdk.getRegistrationIframe(this.$refs.frame)
    this.zkitReg.addClass('pw1', 'my-inp1')
  }
}
</script>

<style lang="sass">
@import '../../../assets/password-frame'

</style>
