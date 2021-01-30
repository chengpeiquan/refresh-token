<template>
  <header class="header">
    <div class="wrap">
      <!-- 左侧 -->
      <nav class="nav">
        <router-link class="item" to="/home" exact>Home</router-link>
        <span class="divider"></span>
        <router-link class="item" to="/list">List</router-link>
        <span class="divider"></span>
        <router-link class="item" to="/about">About</router-link>
      </nav>
      <!-- 左侧 -->

      <!-- 右侧 -->
      <div class="user-info" v-if="name">
        <span class="name">Hi, {{ name }}</span>
        <router-link
          class="logout"
          to="/login"
        >[Logout]</router-link>
      </div>

      <router-link
        v-else
        class="login"
        to="/login"
      >
        Login
      </router-link>
      <!-- 右侧 -->
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import ls from '@libs/localStorage'
import bus from '@libs/bus'

interface UserInfo {
  id: number,
  name: string
}

export default defineComponent({
  setup () {
    const name = ref<string>('');

    const getName = (userName: string = ''): void | boolean => {
      if ( userName ) {
        name.value = userName;
        return false;
      }

      const USER_INFO: UserInfo = ls.get('user_info') || {
        id: 0,
        name: ''
      };
      
      name.value = USER_INFO.name;
    }

    bus.on('updateUserName', getName)

    onBeforeUnmount( () => {
      bus.off('updateUserName', getName)
    })

    onMounted( () => {
      getName();
    })

    return {
      name
    }
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
    width 100%
    max-width $width-container
    justify-content space-between
    align-items center
    padding 0 $margin
    box-sizing border-box
    .nav
      display flex
      justify-content flex-start
      align-items center
      flex 1
      .item
        display flex
        font-size 14px
        &.cur
          font-size 16px
          font-weight bold
          text-decoration underline
      .divider
        display flex
        width 1px
        height 20px
        color $color-gray
        background-color $color-gray
        margin 0 $margin
    .user-info
      .name
        color $color-text
        margin-right ($margin /4)
</style>