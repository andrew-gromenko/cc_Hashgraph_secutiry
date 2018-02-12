<template lang="pug">
v-list(subheader)
  v-subheader {{title}}
  v-list-tile(v-for="item in items")
    v-list-tile-content
      v-list-tile-title(v-text="item")
    v-list-tile-action
      v-btn(icon, @click='')
        v-icon delete
  v-list-tile
    v-select(
      :items="searchItems"
      :label="label"
      v-model="select"
      autocomplete
      :loading="loading"
      chips
      item-text="name"
      required
      :search-input.sync="search"
    )
</template>

<script>
export default {
  props: ['items', 'target', 'title', 'label'],
  data () {
    return {
      select: null,
      loading: false,
      search: '',
      searchItems: []

    }
  },
  watch: {
    search (val) {
      val && this.querySelections()
    }
  },
  methods: {
    async querySelections () {
      this.loading = true
      this.searchItems = await this.$http('get', '/api/' + this.target)
      this.loading = false
    }
  }
}
</script>

<style lang="sass">

</style>
