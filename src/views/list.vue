<template>
  <div>

  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import axios from 'axios'

export default defineComponent({
  setup () {

    const getList = (): void => {
      axios({
        method: 'get',
        url: '/api/list'
      }).then( (res: any) => {
        console.log(res);
      }).catch( (err: any) => {
        console.log(err);
        
      })
    }
    
    onMounted( () => {
      getList();
    })

    return {}
  }
})
</script>

<style scoped>

</style>