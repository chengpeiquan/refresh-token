<template>
  <Header />

  <main class="main">
    <router-view
      :key="key"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent, ComputedRef, computed } from 'vue'
import Header from '@cp/Header.vue'
import { useRoute } from 'vue-router';

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