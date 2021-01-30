import axios from '@libs/axios/instance'
import ls from '@libs/localStorage'
import refreshToken from '@libs/refreshToken'

// 防止重复刷新的状态开关
let isRefreshing: boolean = false;

// 被拦截的请求列表
let requests: any[] = [];

/** 
 * 请求拦截
 * 在这里要判断是否需要刷新token
 * 帮助用户自动延长登录有效期
 */
axios.interceptors.request.use(

  async config => {

    /** 
     * 刷新token
     */

    // 计算token的剩余有效时间
    const OLD_TOKEN_EXP: number = ls.get('token_expired_timestamp') || 0;
    const NOW_TIMESTAMP: number = Date.now();
    const TIME_DIFF: number = OLD_TOKEN_EXP - NOW_TIMESTAMP;

    // 判断本地是否有记录
    const HAS_LOCAL_TOKEN: boolean = ls.get('token') ? true : false;
    const HAS_LOCAL_TOKEN_EXP: boolean = OLD_TOKEN_EXP ? true : false;

    // 获取接口url
    const API_URL: string = config.url || '';

    // 非刷新请求、有本地记录、已过期，同时满足，才会进入刷新流程
    if (
      API_URL !== '/refreshToken'
      &&
      HAS_LOCAL_TOKEN
      &&
      HAS_LOCAL_TOKEN_EXP
      &&
      TIME_DIFF <= 0
    ) {

      // 如果没有在刷新，则执行刷新
      if ( !isRefreshing ) {
    
        // 打开状态
        isRefreshing = true;

        // 获取新的token
        const NEW_TOKEN: string = await refreshToken();

        // 如果新的token存在，用新token继续之前的请求，然后重置队列
        if ( NEW_TOKEN ) {
          config.headers['Authorization'] = NEW_TOKEN;
          requests.forEach( (callback: any) => callback(config) );
          requests = [];
        }
        // 否则直接清空队列，因为需要重新登录了
        else {
          requests = [];
        }

        // 关闭状态，允许下次继续刷新
        isRefreshing = false;

      }

      // 并把刷新完成之前的请求都存储为请求队列
      return new Promise( (resolve: any) => {
        requests.push( () => {
          resolve(config)
        });
      });

    }

    return Promise.resolve(config);
  }

);

export default axios;