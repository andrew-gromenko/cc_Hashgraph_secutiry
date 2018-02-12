<template lang="pug">
v-layout
    v-flex.xs12.sm6.offset-sm3.md4.offset-md4
        v-card.mx-4.my-4
            v-card-title(primary-title)
                h3.headline.mb-0 Login
            v-form.mx-3(v-model='valid', lazy-validation)
                v-text-field(label='Name', v-model='name', :rules='nameRules', required)
                v-text-field(label='Password', v-model='password', type="password", :rules='passwordRules', required)
                v-card-actions.text-md-right
                    v-btn(flat, @click='submit', :disabled='!valid')
                        | Submit
</template>

<script>
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
      password: '',
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 8 || 'Password must be more than 8 characters'
      ]
    }
  },
  methods: {
    submit () {
      console.log(this.name, this.password)
    }
  }
}
</script>

<style lang="sass">
</style>
