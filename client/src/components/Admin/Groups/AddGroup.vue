<template lang="pug">
div
  v-card-text
    v-form(v-model="valid")
      v-text-field(
        prepend-icon='supervisor_account'
        required
        label='Name'
        v-model="name"
        :rules="nameRules"
      )
  v-card-actions
    v-spacer
    v-btn(color="primary", @click="submit", :disabled="!valid") Submit
</template>

<script>
import { GroupRules } from '@/core/validation/rules'
import * as zkitSDK from 'zerokit-web-sdk'

export default {
  props: ['onSubmit'],
  data () {
    return {
      name: '',
      valid: true,
      nameRules: GroupRules.name
    }
  },
  methods: {
    async submit () {
      const tresorId = await zkitSDK.createTresor()

      const id = await this.$http('post', '/api/groups', {
        name: this.name,
        tresorId,
        userIds: [],
        fileIds: []
      })
      const group = await this.$http('get', `/api/groups/${id}`)

      this.$emit('onSubmit', group)
      this.valid = true
      this.name = ''
    }
  }
}
</script>

<style lang="sass">

</style>
