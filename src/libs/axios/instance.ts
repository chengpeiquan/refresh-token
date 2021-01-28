import axios from 'axios'
import config from '@libs/axios/config'
import ls from '@libs/localStorage'
import router from '@/router'

/** 
 * 创建一个独立的axios实例
 * 把常用的公共请求配置放这里添加
 */
const instance = axios.create(config);

/** 
 * 请求拦截
 * 要判断开发环境决定是否添加代理path
 */
instance.interceptors.request.use(

  // 正常拦截
  (config: any): any =>{

    /** 
     * Token的有效期
     * 因为是Mock接口，没法判断token有效期，所以要带上时间戳去判断一下
     */
    const LOCAL_TOKEN_EXP: number = ls.get('token_expired_timestamp') || 0;
    if ( LOCAL_TOKEN_EXP ) {
      config.headers['expiredTime'] = LOCAL_TOKEN_EXP;
    }
    
    /** 
     * 定义token
     * 除非免token的接口，否则登录后都要返回带身份token的请求头
     */
    const LOCAL_TOKEN: string = ls.get('token') || '';
    if ( LOCAL_TOKEN ) {
      config.headers['Authorization'] = LOCAL_TOKEN;
    }

    /** 
     * 返回处理后的配置
     */
    return config;
  },
  
  // 拦截失败
  (err: any): any => Promise.reject(err)

);

/** 
 * 返回拦截
 * 在这里解决数据返回的异常问题
 */
instance.interceptors.response.use(

  // 正常响应
  (res: any): any => {

    /** 
     * 处理axios在低版本IE下的坑爹问题
     * 主要针对IE 8-9
     */
    if (
      res.data === null
      &&
      res.config.responseType === 'json'
      &&
      res.request.responseText !== null
    ) {

      try {
        res.data = JSON.parse(res.request.responseText);
      }
      catch (e) {
        console.log(e);
      }

    }

    /** 
     * 登录失效拦截
     * 虽然在请求前有通过refreshToken去延长有效期，但它也有失效的时候…
     */
    if ( res.data.code === 1 && res.data.msg === '用户凭证已过期' ) {

      try {
        router.push({
          name: 'login'
        });
      }
      catch (e) {
        console.log(e);
      }

    }

    /** 
     * 提取接口的返回结果
     * 简化接口调用的编码操作
     */
    return res.data;

  },

  // 异常响应（统一返回一个msg提示即可）
  (err: any): Promise<string> => Promise.reject('网络异常')

);

export default instance;