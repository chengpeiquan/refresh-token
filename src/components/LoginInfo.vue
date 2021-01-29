<template>
  <div class="logined-time-info">
    <p class="line">
      <span class="key">当前路由：</span>
      <span class="value">{{ route.fullPath }}</span>
    </p>
    <p class="line">
      <span class="key">当前时间：</span>
      <span class="value">{{ now }}</span>
    </p>

    <p class="line">
      <span class="key">过期时间：</span>
      <span class="value">{{ exp || '请先登录' }}</span>
    </p>

    <p class="line">
      <span class="key">过期计时：</span>
      <span class="value">{{ diff }}秒{{ diff ? '' : '（已过期）' }}</span>
    </p>

    <p class="line">
      <span class="key">当前凭证：</span>
      <span class="value">{{ token || '请先登录' }}</span>
    </p>

    <p class="line">
      <span class="key">刷新凭证：</span>
      <span class="value">{{ refreshToken || '请先登录' }}</span>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@libs/axios'
import ls from '@libs/localStorage'
import message from '@/libs/message'
import bus from '@/libs/bus'

interface LoginTimeInfo {
  now: string,
  exp: string,
  diff: number,
  token: string,
  refreshToken: string
}

export default defineComponent({
  setup () {
    const route = useRoute();
    const loginTimeInfo: LoginTimeInfo = reactive({
      now: '',
      exp: '',
      diff: 0,
      token: '',
      refreshToken: ''
    });
    const loginTimeInfoRefs = toRefs(loginTimeInfo);

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
        const USER_NAME: string = DATA.name || '';
        bus.emit('updateUserName', USER_NAME);
        
      }).catch( (msg: string) => {
        message.error(msg);
      })
    }

    /** 
     * 获取ISO日期
     */
    const getISODate = (timestramp: number): string => {
      // 时差
      const JET_LAG: number = 8 * 60 * 60 * 1000;

      // 补充时差后的时间戳
      const TIMESTRAMP: number = timestramp ? timestramp + JET_LAG : new Date().getTime() + JET_LAG;

      // 获取新的日期
      const DATE: Date = new Date(TIMESTRAMP);

      // 转为ISO日期
      const ISO_DATE: string = DATE.toISOString().slice(0, 19).replace(/T/, ' ');

      return ISO_DATE;
    }

    /** 
     * 获取登录的时间信息
     */
    const getLoginDate = (): void => {
      const NOW: number = Date.now();
      loginTimeInfo.now = getISODate(NOW);

      const LS_EXP: string = ls.get('token_expired_timestamp');
      const EXP: number = Number(LS_EXP) || 0;
      if ( !EXP ) {
        clearInterval(interVal);
      }
      loginTimeInfo.exp = EXP ? getISODate(EXP) : '';

      const DIFF: number = EXP - NOW;
      loginTimeInfo.diff = DIFF < 0 ? 0 : Math.floor(DIFF / 1000);

      const TOKEN: string = ls.get('token') || '';
      loginTimeInfo.token = TOKEN;

      const REFRESH_TOKEN: string = ls.get('refresh_token') || '';
      loginTimeInfo.refreshToken = REFRESH_TOKEN;
    }

    /** 
     * 倒计时定时器
     */
    const interVal = setInterval(getLoginDate, 1000);
    
    onMounted( () => {
      // getUserInfo();
      getLoginDate();
    })

    onUnmounted( () => {
      clearInterval(interVal);
    })

    return {
      ...loginTimeInfoRefs,
      route
    }
  }
})
</script>

<style lang="stylus" scoped>
@import "~@styl/config"

.logined-time-info
  background-color lighten($color-desc, 75%)
  border-radius $radius
  padding $margin
  margin ($margin *2) auto $margin
  .line
    margin-bottom $margin
    &:last-child
      margin-bottom 0
    .key
      font-weight bold
      margin-right ($margin /2)
</style>