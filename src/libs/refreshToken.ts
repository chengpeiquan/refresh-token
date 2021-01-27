import axios from '@libs/axios/instance'
// import axios from 'axios'
import ls from '@libs/localStorage'
import setLoginInfoToLocal from '@libs/setLoginInfoToLocal'

/** 
 * 刷新token
 */
const refreshToken = (): Promise<any> => {
  return new Promise( (resolve: any): any => {
    // 获取用来刷新token的凭证
    const REFRESH_TOKEN: string = ls.get('refresh_token') || '';
    console.log('REFRESH_TOKEN', REFRESH_TOKEN);

    // 请求
    // axios({
    //   method: 'post',
    //   url: '/login',
    //   data: {
    //     refreshToken: REFRESH_TOKEN
    //   }
    // }).then( (data: any) => {
    //   console.log(data);

    //   // 存储token信息
    //   setLoginInfoToLocal(data);

    //   // 返回新的token，通知那边搞定了
    //   const NEW_TOKEN: string = ls.get('token');
    //   resolve(NEW_TOKEN);

    // }).catch( (err: any) => {
    //   console.log(err);
      
    //   // 刷新失败，返回一个空token
    //   resolve('');
    // });

    axios({
      method: 'post',
      url: '/aaaaa',
      data: {
        refreshToken: REFRESH_TOKEN
      }
    }).then( (data: any) => {
      console.log(data);

      // 存储token信息
      setLoginInfoToLocal(data);

      // 返回新的token，通知那边搞定了
      const NEW_TOKEN: string = ls.get('token');
      resolve(NEW_TOKEN);

    }).catch( (err: any) => {
      console.log(err);
      
      // 刷新失败，返回一个空token
      resolve('');
    });
    
  });
}

export default refreshToken;