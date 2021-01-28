import axios from '@libs/axios/instance'
import ls from '@libs/localStorage'
import refreshToken from '@libs/refreshToken'

/** 
 * 防止重复刷新的开关
 */
let isRefreshing: boolean = false;
let requests: any = [];

/** 
 * 请求拦截
 * 在这里要判断是否需要刷新token
 * 帮助用户自动延长登录有效期
 */
axios.interceptors.request.use(

  // 正常拦截
  async (config: any): Promise<any> =>{

    /** 
     * 刷新token
     */
    const HAS_LOCAL_TOKEN: boolean = ls.get('token') ? true : false;
    const HAS_LOCAL_TOKEN_EXP: boolean = ls.get('token_expired_timestamp') ? true : false;

    // 获取旧token过期时间戳
    const OLD_TOKEN_EXP: number = ls.get('token_expired_timestamp') || 0;

    // 获取当前时间戳
    const NOW_TIMESTAMP: number = Date.now();

    // 计算有效的剩余时间差
    const TIME_DIFF: number = OLD_TOKEN_EXP - NOW_TIMESTAMP;

    // 请求时认为需要刷新、有本地token记录、有过期时间记录，并且允许刷新，四者缺一不可
    if (
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
    
        // 打开开关
        isRefreshing = true;

        // 获取新的token
        const NEW_TOKEN: string = await refreshToken();
        console.log('NEW_TOKEN', NEW_TOKEN);
        

        // 关闭开关，允许下次继续刷新
        isRefreshing = false;

        // 如果新的token存在，则更新token为刷新后的
        if ( NEW_TOKEN ) {

          // 更新新token
          config.headers['Authorization'] = NEW_TOKEN;

          // 执行队列请求
          requests.forEach( (callback: any) => callback(config) );

          // 重置队列
          requests = [];

        }

        return config;
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

    return config;
  }

);

export default axios;