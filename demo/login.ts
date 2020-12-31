import axios from './axios'
import message from './message'
import ls from './localStorage'
import setTokenInfoToLocal from './setTokenInfoToLocal'

/** 
 * 执行登录
 */
const login = (phoneNumber: string, verCode: string): any => {
  return new Promise( (resolve: any, reject: any): void => {
    axios({
      isNoToken: true,
      isNoRefresh: true,
      method: 'post',
      url: '/auth/mobile/token/sms',
      data: {
        mobile: phoneNumber,
        code: verCode
      } 
    }).then( (data: any) => {
      
      // 异常拦截
      const CODE: number | undefined = data.code;
      const MSG: string | undefined = data.msg;
      if ( CODE === 1 ) {
        message.error(MSG);
        reject(false);
        return false;
      }
  
      // 这个接口特殊，只有包含用户字段才算成功了
      if ( !data.hasOwnProperty('user_info') ) {
        message.error('登录验证码错误');
        reject(false);
        return false;
      }

      // 存储token信息
      setTokenInfoToLocal(data);

      // 获取用户信息
      getUserInfo()
        .then( (userInfo: any) => {

          // 获取登录信息
          const LOGIN_INFO: any = data;

          // 替换新的用户信息
          LOGIN_INFO['user_info'] = userInfo;

          // 存储登录信息到本地记录
          ls.set('login_info', data);
  
          // 销毁现有的message
          message.destroy();
      
          // 登录成功
          resolve(true);

        })
        .catch( (emptyUserInfo: any) => {

          // 直接存储登录信息到本地记录
          ls.set('login_info', data);
  
          // 销毁现有的message
          message.destroy();
      
          // 登录成功
          resolve(true);

        });
      
    }).catch( (msg: string) => {
      message.error(msg);
      reject(false);
    });
  });
}

export default login;