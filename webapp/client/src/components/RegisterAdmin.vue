<template lang="pug">
v-layout
    v-flex.xs12.sm6.offset-sm3.md4.offset-md4
        v-card.mx-4.my-4
            v-card-title(primary-title)
                h3.headline.mb-0 Register Admin
            add-user(:needAdmin="true", @onSubmit="onSubmit")
</template>

<script>
import AddUser from '@/core/components/AddUser.vue'

export default {
  data () {
    return {

    }
  },
  methods: {
    onSubmit (data) {
      console.log('data, onSubmit registerAdmin should redirect', data)
      this.$router.push({name: 'login'})
    }
  },
  components: {
    AddUser
  }
}
</script>
