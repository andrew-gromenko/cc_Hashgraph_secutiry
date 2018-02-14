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
      v-text-field(
        prepend-icon='security'
        required
        label='Password'
        v-model="password"
        :rules="passwordRules"
        :type="hidePassword ? 'password' : 'text'"
        :append-icon="hidePassword ? 'visibility_off' : 'visibility'"
        :append-icon-cb="() => (hidePassword = !hidePassword)"
      )
  v-card-actions
    v-spacer
    v-btn(color="primary", @click="submit", :disabled="!valid") Submit
</template>

<script>
import { UserRules } from '@/core/validation/rules'

export default {
  props: ['onSubmit'],
  data () {
    return {
      name: '',
      password: '',
      hidePassword: true,
      valid: true,
      nameRules: UserRules.name,
      passwordRules: UserRules.password
    }
  },
  methods: {
    async submit () {
      // var zkitUser = {
      //   name: this.name,
      //   password: this.password
      // }

      const user = await this.$http('post', '/api/users', {
        username: this.name
      })

      this.$emit('onSubmit', user)
      this.valid = true
      this.name = ''
      this.password = ''
    }
  }
}
</script>

<style lang="sass">

</style>
