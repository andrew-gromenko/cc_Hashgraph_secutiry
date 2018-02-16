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
      clearable
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
import * as zkitSDK from 'zerokit-web-sdk'

export default {
  props: ['group', 'ids', 'target', 'itemText', 'title', 'label'],
  data () {
    return {
      select: null,
      loading: false,
      search: '',
      searchItems: [],
      selectModel: ''
    }
  },
  asyncComputed: {
    async items () {
      let items = await Promise.all(this.ids.map(id => {
        return this.$http('get', 'api/' + this.target + 's/' + id)
      }))
      return items.filter(item => item)
    }
  },
  watch: {
    search (val) {
      val && this.querySelections(val)
    },
    select (id) {
      if (id == null) return

      this.addItem(id)
    }
  },
  methods: {
    async addItem (id) {
      const user = await this.$http('get', '/api/users/' + id)

      var operationId = null
      try {
        operationId = await zkitSDK.shareTresor(this.group.tresorId, user.zkitId)
      } catch (e) {
        this.$eventBus.$emit('notify', e.description)
        return
      }

      const item = await this.$http('patch', `/api/groups/${this.group.id}`, { [this.target + 'Id']: id, operationId })

      if (this.items.find(i => i.id === item.id)) {
        this.$eventBus.$emit('notify', this.target + ' already exist')
      } else {
        this.items.push(item)
      }
    },
    async removeItem (id) {
      await this.$http('delete', `/api/groups/${this.group.id}`, { [this.target + 'Id']: id })
      const item = this.items.find(i => i.id === id)
      this.items.splice(this.items.indexOf(item), 1)
    },
    async querySelections (query) {
      this.loading = true
      this.searchItems = await this.$http('get', `/api/${this.target}s?substr=${query}`)
      this.loading = false
    }
  }
}
</script>

<style lang="sass">

</style>
