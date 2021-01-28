/** 
 * 用户信息
 * https://www.fastmock.site/mock/1c85c0d436ae044cf22849549ef471b8/api/userInfo
 */

({_req, Mock}) => {
  const headers = _req.headers;

  const token = headers.authorization || '';
  if ( !token ) {
    return {
      code: 1,
      data: null,
      msg: '缺少用户凭证'
    }
  }

  const expTime = headers.expiredtime || 0;
  const nowTime = Date.now();
  const diffTime = expTime - nowTime;
  if ( diffTime <= 0 ) {
    return {
      code: 1,
      data: null,
      msg: '用户凭证已过期'
    }
  }

  return {
    code: 0,
    data: {
      id: 1,
      name: 'admin'
    },
    msg: '请求成功'
  }
  
}