<template lang="pug">
v-list(subheader)
  template(v-for="group in groups")
    v-subheader {{group.name}}
    v-list-tile(v-for="file in group.fileIds", :key="file")
        v-list-tile-title {{file}}
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
    // this.files = await this.$http('get', `/api/files?userId=${this.$auth.getUser().id}`)
    this.groups = await this.$http('get', `/api/groups`)
  }
}
</script>

<style lang="sass">

</style>
