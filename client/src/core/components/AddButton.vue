<template lang="pug">
v-btn.mb-5(
absolute
dark
fab
bottom
right
fixed
color="blue"
@click="$emit('click')"
)
  v-icon add
</template>

<script>
export default {
  props: ['click']
}
</script>

<style lang="sass">

</style>
