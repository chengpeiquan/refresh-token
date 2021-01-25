<template>
  <Header />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Header from '@cp/Header.vue'

export default defineComponent({
  components: {
    Header
  },
  setup () {
    

    return {}
  }
})
</script>

<style lang="stylus" scoped>
</style>