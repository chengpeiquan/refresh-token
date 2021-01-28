import axios from 'axios'
import config from '@libs/axios/config'
import ls from '@libs/localStorage'
import setLoginInfoToLocal from '@libs/setLoginInfoToLocal'

/** 
 * 创建一个独立的axios实例
 * 把常用的公共请求配置放这里添加
 */
const instance = axios.create(config);

/** 
 * 刷新token
 */
const refreshToken = (): Promise<any> => {
  return new Promise( (resolve: any): any => {
    // 获取用来刷新token的凭证
    const REFRESH_TOKEN: string = ls.get('refresh_token') || '';
    console.log('REFRESH_TOKEN', REFRESH_TOKEN);

    
    /** 
     * Token的有效期
     * 因为是Mock接口，没法判断token有效期，所以要带上时间戳去判断一下
     */
    const LOCAL_TOKEN_EXP: number = ls.get('token_expired_timestamp') || 0;

    // 请求
    instance({
      method: 'post',
      url: '/refreshToken',
      headers: {
        expiredTime: LOCAL_TOKEN_EXP
      },
      data: {
        refreshToken: REFRESH_TOKEN
      }
    }).then( (res: any) => {
      
      // 存储token信息
      const DATA: any = res.data.data;
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