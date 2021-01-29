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

    // 判断本地是否有记录
    const HAS_LOCAL_TOKEN: boolean = ls.get('token') ? true : false;
    const HAS_LOCAL_TOKEN_EXP: boolean = ls.get('token_expired_timestamp') ? true : false;

    // 获取旧token过期时间戳
    const OLD_TOKEN_EXP: number = ls.get('token_expired_timestamp') || 0;

    // 获取当前时间戳
    const NOW_TIMESTAMP: number = Date.now();

    // 计算有效的剩余时间差
    const TIME_DIFF: number = OLD_TOKEN_EXP - NOW_TIMESTAMP;

    // 获取接口url
    const API_URL: string = config.url || '';

    // 有本地token记录、有过期时间记录，并且时间已经过期，三者缺一不可
    if (
      API_URL !== '/refreshToken'
      &&
      HAS_LOCAL_TOKEN
      &&
      HAS_LOCAL_TOKEN_EXP
      &&
      TIME_DIFF <= 0
    ) {

      /** 
       * 如果没有在刷新，则允许刷新
       */
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

      /** 
       * 之前的请求都存储为队列
       */
      const retryOriginalRequest: any = new Promise( (resolve: any) => {
        requests.push( () => {
          resolve(config)
        });
      });

      return retryOriginalRequest;
    }

    return Promise.resolve(config);
  }

);

export default axios;