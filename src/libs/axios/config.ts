const IS_DEV: boolean = process.env.NODE_ENV === 'development' ? true : false;

/** 
 * axios的公共配置
 */
const config: any = {

  // 接口路径
  baseURL: IS_DEV ? 'http://127.0.0.1:12321/api' : 'https://www.fastmock.site/mock/1c85c0d436ae044cf22849549ef471b8/api',

  // 公共请求头
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    Authorization: 'Basic KJytrqad8765Fia'
  },

  // 默认的响应方式
  responseType: 'json',

  // 超时时间
  timeout: 30000, 

  // 跨域的情况下不需要带上cookie
  withCredentials: false,

  // 调整响应范围，范围内的可以进入then流程，否则会走catch
  validateStatus: (status: number) => {
    return status >= 200 && status < 500;
  }

}

export default config;