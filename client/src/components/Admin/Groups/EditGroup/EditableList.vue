<template lang="pug">
v-list(subheader)
  v-subheader {{title}}
  v-list-tile(v-for="item in items", :key="item.id")
    v-list-tile-content
      v-list-tile-title(v-text="item[itemText]")
    v-list-tile-action
      v-btn(icon, @click='removeItem(item.id)')
        v-icon delete
  v-list-tile
    v-select(
      :items="searchItems"
      :label="label"
      v-model="select"
      autocomplete
      :loading="loading"
      :item-text="itemText"
      item-value="id"
      required
      :search-input.sync="search"
    )
</template>

<script>
export default {
  props: ['groupId', 'ids', 'target', 'itemText', 'title', 'label'],
  data () {
    return {
      select: null,
      loading: false,
      search: '',
      selectItem: null,
      searchItems: [],
      items: []
    }
  },
  async mounted () {
    this.items = await Promise.all(this.ids.map(id => {
      console.log(id)
      return this.$http('get', 'api/' + this.target + 's/' + id)
    }))
  },
  watch: {
    search (val) {
      val && this.querySelections(val)
    },
    select (id) {
      this.addItem(id)
    }
  },
  methods: {
    async addItem (id) {
      console.log(id)
      const item = await this.$http('patch', `/api/groups/${this.groupId}`, { [this.target + 'Id']: id })

      console.log(item)
      if (this.items.find(i => i.id === item.id)) {
        this.$eventBus.$emit('notify', this.target + ' already exist')
      } else {
        this.items.push(item)
      }
    },
    async removeItem (id) {
      await this.$http('delete', `/api/groups/${this.groupId}`, { [this.target + 'Id']: id })
      const item = this.items.find(i => i.id === id)
      this.items.splice(this.items.indexOf(item), 1)
    },
    async querySelections (query) {
      this.loading = true
      this.searchItems = await this.$http('get', `/api/${this.target}s?substr=${query}`)
      console.log(this.searchItems)
      this.loading = false
    }
  }
}
</script>

<style lang="sass">

</style>
