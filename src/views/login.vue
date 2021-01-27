<template>
  <div class="login">
    <a-form :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="用户名">
        <a-input
          v-model:value="form.name"
          readonly
        >
          <template #prefix>
            <UserOutlined />
          </template>
        </a-input>
      </a-form-item>
      
      <a-form-item label="密码">
        <a-input
          type="password"
          v-model:value="form.password"
          readonly
        >
          <template #prefix>
            <LockOutlined />
          </template>
        </a-input>
      </a-form-item>
      
      <a-form-item :wrapper-col="wrapperColOffset" >
        <a-button
          :loading="isSending"
          type="primary"
          @click="login"
        >
          点击登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import ls from '@libs/localStorage'
import setLoginInfoToLocal from '@libs/setLoginInfoToLocal'
import message from '@libs/message'
import axios from '@libs/axios'
import bus from '@libs/bus'

interface Col {
  span: number,
  offset?: number
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
    const router = useRouter();
    const labelCol: Col = { span: 4 };
    const wrapperCol: Col = { span: 18 };
    const wrapperColOffset: Col = { span: 18, offset: 4 };
    const form: Form = reactive({
      name: 'admin',
      password: '123456'
    });
    const isSending = ref<boolean>(false);

    const login = (): void | boolean => {
      if ( isSending.value ) {
        return false;
      }

      if ( !form.name ) {
        message.warning('用户名不能为空');
        return false;
      }

      isSending.value = true;

      axios({
        method: 'post',
        url: '/login',
        data: {
          name: form.name,
          password: form.password
        }
      }).then( (data: any) => {
        const CODE: number = data.code;
        const MSG: string = data.msg;
        if ( CODE !== 0 ) {
          message.error(MSG);
          isSending.value = false;
          return false;
        }

        const DATA: any = data.data;
        console.log('登录信息', DATA);
        setLoginInfoToLocal(DATA);

        message.success('登录成功！');
        isSending.value = false;
        router.push({
          name: 'home'
        });
        
      }).catch( (msg: string) => {
        message.error(msg);
        isSending.value = false;
      })
    }

    onMounted( () => {
      ls.clear();
      bus.emit('updateUserName', '');
    })

    return {
      // 数据
      labelCol,
      wrapperCol,
      wrapperColOffset,
      form,
      isSending,

      // 方法
      login
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
  margin ($margin *2) auto
  >>> .ant-input-prefix
    color $color-desc
</style>