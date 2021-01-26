<template>
  <div class="login">
    <a-form :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
      <a-form-item label="用户名">
        <a-input v-model:value="form.name">
          <template #prefix><UserOutlined style="color:rgba(0,0,0,.25)"/></template>
        </a-input>
      </a-form-item>
      
      <a-form-item label="密码">
        <a-input type="password" v-model:value="form.password">
          <template #prefix><LockOutlined style="color:rgba(0,0,0,.25)"/></template>
        </a-input>
      </a-form-item>
      
      <a-form-item :wrapper-col="{ span: 18, offset: 4 }">
        <a-button type="primary">
          点击登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'

interface Col {
  span: number
}

interface Form {
  name: string,
  password: string
}

export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup () {
    const labelCol: Col = { span: 4 };
    const wrapperCol: Col = { span: 14 };
    const form: Form = reactive({
      name: 'admin',
      password: '123456'
    })

    return {
      labelCol,
      wrapperCol,
      form
    }
  }
})
</script>

<style lang="stylus" scoped>
@import "~@styl/config"

.login
  display flex
  flex-direction column
  width 350px
  margin auto
  .label
    display flex
    justify-content space-between
    align-items center
    margin-bottom $margin
    &:last-child
      margin-bottom 0
    .text
      display flex
      flex-shrink 0
      justify-content flex-end
      width 80px
      font-weight bold
      margin-right $margin
    .input
      display flex
      flex 1
      font-size 14px
      padding ($margin /2) $margin
      border 1px solid $color-border
      border-radius $radius
    .btn-login
      display flex
      align-items center
      justify-content center
      width 80px
      height 30px
      font-size 14px
      color $color-white
      background-color $color-blue
      border-radius ($radius /2)
      cursor pointer
      &:hover
        background-color lighten($color-blue, 20%)
</style>