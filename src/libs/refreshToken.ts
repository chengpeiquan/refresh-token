import axios from '@libs/axios/instance'
import ls from '@libs/localStorage'
import setLoginInfoToLocal from '@libs/setLoginInfoToLocal'

/** 
 * 刷新token
 */
const refreshToken = (): Promise<any> => {
  return new Promise( (resolve: any): any => {
    
    // 获取刷新凭证
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

    }).catch( (err: any) => {
      
      // 刷新失败，返回一个空token
      resolve('');
    });
    
  });
}

export default refreshToken;