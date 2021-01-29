import axios from '@libs/axios/instance'
import ls from '@libs/localStorage'
import setLoginInfoToLocal from '@libs/setLoginInfoToLocal'

/** 
 * 刷新token
 * 成功返回新的token，失败返回空字符串
 */
const refreshToken = (): Promise<any> => {
  return new Promise( resolve => {
    
    // 获取本地记录的刷新凭证
    const REFRESH_TOKEN: string = ls.get('refresh_token') || '';

    // 请求刷新
    axios({
      method: 'post',
      url: '/refreshToken',
      data: {
        refreshToken: REFRESH_TOKEN
      }
    }).then( (data: any) => {
      
      // 存储token信息
      const DATA: any = data.data;
      setLoginInfoToLocal(DATA);

      // 返回新的token，通知那边搞定了
      const NEW_TOKEN: string = `${DATA.tokenType} ${DATA.accessToken}`;
      resolve(NEW_TOKEN);

    }).catch( (msg: string) => {
      resolve('');
    });
    
  });
}

export default refreshToken;