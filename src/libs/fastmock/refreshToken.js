/** 
 * 登录接口
 * https://www.fastmock.site/mock/1c85c0d436ae044cf22849549ef471b8/api/refreshToken
 */

({_req, Mock}) => {
  const body = _req.body;

  const refreshToken = body.refreshToken || '';
  if ( !refreshToken ) {
    return {
      code: 1,
      data: null,
      msg: '缺少刷新凭证'
    }
  }

  const isAllowRefresh = Mock.mock('@boolean');
  if ( !isAllowRefresh ) {
    return {
      code: 1,
      data: null,
      msg: '用户凭证已过期'
    }
  }

  return Mock.mock({
    code: 0,
    data: {
      tokenType: 'Bearer',
      accessToken: '@guid',
      refreshToken: '@guid',
      expiresTime: () => Date.now() + 10 * 1000
    },
    msg: '续期成功'
  })
}