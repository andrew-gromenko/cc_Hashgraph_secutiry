<template lang="pug">
v-flex
  popup(title="Register user", :show="addPopup", @closed="addPopup = false")
    add-group
  v-list
      v-list-tile(v-for='user in users', :key='user.id')
          v-list-tile-title(v-text='user.name')
          v-btn(icon, @click='')
              v-icon delete
  add-button(@click="addPopup = true")
</template>

<script>
import AddGroup from './AddGroup.vue'
import Popup from '../../core/components/Popup'
import AddButton from '../../core/components/AddButton.vue'

export default {
  data () {
    return {
      users: [],
      addPopup: false
    }
  },
  async mounted () {
    this.users = await this.$http('get', '/api/users')
  },
  components: {
    AddGroup,
    AddButton,
    Popup
  }
}
</script>

<style lang="sass">

</style>
