<template>
  <p class="tips">使用<span>Chrome</span>按<span>F12</span>唤起控制台</p>

  <p class="tips">切到<span>Network</span>，观察里面的<span>XHR</span>请求</p>

  <p class="tips">留意<span>Request Headers</span>里的<span>Authorization</span>变化</p>
</template>

<style lang="stylus" scoped>
@import "~@styl/config"

.tips
  display flex
  align-items center
  margin ($margin /2) auto
  span
    font-size 12px
    color $color-yellow
    background-color $color-black
    border-radius ($radius /2)
    padding ($margin /8) ($margin /2)
    margin 0 ($margin /2)
</style>