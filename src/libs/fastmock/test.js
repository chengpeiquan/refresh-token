/** 
 * 普通测试接口
 * https://www.fastmock.site/mock/1c85c0d436ae044cf22849549ef471b8/api/test
 */

({_req}) => {
  const headers = _req.headers;
  
  const token = headers.authorization || '';
  if ( !token ) {
    return {
      code: 1,
      data: null,
      msg: '缺少用户凭证'
    }
  }

  return {
    code: 0,
    data: null,
    msg: '请求成功'
  }
}