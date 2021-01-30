<template>
  <LoginInfo />
  <UsageTips />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Mock from 'mockjs'
import LoginInfo from '@cp/LoginInfo.vue'
import UsageTips from '@cp/UsageTips.vue'
import axios from '@libs/axios'

export default defineComponent({
  components: {
    LoginInfo,
    UsageTips
  },
  setup () {
    const request = (): void => {
      for ( let i = 0; i < 4; i++ ) {
        axios({
          method: 'get',
          url: '/test',
          params: {
            key: Mock.Random.word()
          }
        })
      }
    }
    
    onMounted( () => {
      request();
    })
  }
})
</script>

<style lang="stylus" scoped>
</style>