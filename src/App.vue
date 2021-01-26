<template>
  <Header />
  <main class="main">
    <router-view />
  </main>
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
.main
  position relative
  display flex
  flex 1
</style>