<template>
  <header class="header">
    <div class="wrap">
      <nav class="nav">
        <router-link to="/home">Home</router-link>
        <span class="divider"></span>
        <router-link to="/list">List</router-link>
      </nav>

      <router-link
        class="login"
        to="/login"
      >
        Login
      </router-link>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    

    return {}
  }
})
</script>

<style lang="stylus" scoped>
@import "~@styl/config"

.header
  display flex
  justify-content center
  align-items center
  width 100%
  height 60px
  border-bottom 1px solid $color-border
  box-shadow 0 0 2px $color-mask
  .wrap
    display flex
    width $width-container
    justify-content space-between
    align-items center
    .nav
      display flex
      justify-content flex-start
      align-items center
      flex 1
      .divider
        display flex
        width 1px
        height 20px
        color $color-gray
        background-color $color-gray
        margin 0 $margin
</style>