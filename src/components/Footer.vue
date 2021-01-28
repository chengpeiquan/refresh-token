<template>
  <div>

  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import axios from '@libs/axios'
import message from '@libs/message'

export default defineComponent({
  setup () {
    /** 
     * 请求用户信息
     */
    const getUserInfo = (): void => {
      axios({
        method: 'get',
        url: '/userInfo'
      }).then( (data: any) => {
        const CODE: number = data.code;
        const MSG: string = data.msg;
        if ( CODE !== 0 ) {
          message.error(MSG);
          return false;
        }

        const DATA: any = data.data;
        
      }).catch( (msg: string) => {
        message.error(msg);
      })
    }

    onMounted( () => {
      getUserInfo();
    })

    return {}
  }
})
</script>

<style scoped>

</style>