<template>
  <Header
    v-if="route.name !== 'login'"
  />

  <main class="main">
    <router-view
      :key="key"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent, ComputedRef, computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@cp/Header.vue'

export default defineComponent({
  components: {
    Header
  },
  setup () {
    const route = useRoute();

    const key: ComputedRef<string> = computed( () => {
      const date: Date = new Date();

      const KEY: string = route.name ? `${String(route.name)}${date}` : `${String(route.name)}${date}`; 

      return KEY;
    });

    return {
      route,
      key
    }
  }
})
</script>

<style lang="stylus" scoped>
.main
  position relative
  display flex
  flex 1
  flex-direction column
</style>