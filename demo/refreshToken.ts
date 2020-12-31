import qs from 'qs'
import axios from '@libs/axios/instance'
import ls from '@libs/localStorage'
import setTokenInfoToLocal from '@libs/setTokenInfoToLocal'

/** 
 * 刷新token
 */
const refreshToken = (): Promise<any> => {
  return new Promise( (resolve: any): any => {
    // 获取用来刷新token的凭证
    const REFRESH_TOKEN: string = ls.get('refreshToken') || '';

    // 请求
    axios({
      isNoToken: true,
      isNoRefresh: true,
      method: 'post',
      url: '/auth/oauth/token?grant_type=refresh_token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: qs.stringify({
        scope: 'server',
        refresh_token: REFRESH_TOKEN
      })
    }).then( (data: any) => {

      // 存储token信息
      setTokenInfoToLocal(data);

      // 返回新的token，通知那边搞定了
      const NEW_TOKEN: string = ls.get('token');
      resolve(NEW_TOKEN);

    }).catch( (err: any) => {
      // 刷新失败，返回一个空token
      resolve('');
    });
  });
}

export default refreshToken;