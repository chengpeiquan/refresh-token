import axios from '@libs/axios'
import ls from '@libs/localStorage'
import router from '@/router'

/** 
 * 重新登录
 */
const reLogin = (): void => {
  // 清除本地记录
  ls.clear();

  // 切去切去登录
  try {
    router.push({
      name: 'login'
    });
  } catch (e) {

  }
}

/** 
 * 执行登出
 */
const logout = (): void => {
  axios({
    method: 'delete',
    url: '/auth/token/logout'
  }).then( (data: any) => {

    // 重登
    reLogin();

  }).catch( (msg: string) => {

    // 重登
    reLogin();

  });
}

export default logout;