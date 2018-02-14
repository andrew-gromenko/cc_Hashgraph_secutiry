<template lang="pug">
v-list(subheader)
  template(v-for="group in groups")
    v-subheader {{group.name}}
    v-list-tile(v-for="file in group.files", :key="file.id")
        v-list-tile-title {{file.name}}
        v-btn(icon, @click='download(file)')
            v-icon file_download
</template>

<script>
export default {
  data () {
    return {
      groups: []
    }
  },
  methods: {
    download (file) {

    }
  },
  async mounted () {
    this.groups = await this.$http('get', `/api/groups?userId=${this.$auth.getUser().id}`)
  }
}
</script>

<style lang="sass">

</style>
