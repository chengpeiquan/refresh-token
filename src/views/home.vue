<template>
  <LoginInfo />

  <p>啊啊啊啊</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import LoginInfo from '@cp/LoginInfo.vue'
import axios from '@libs/axios'

export default defineComponent({
  components: {
    LoginInfo
  },
  setup () {

    

    return {
    }
  }
})
</script>

<style lang="stylus" scoped>
@import "~@styl/config"

</style>