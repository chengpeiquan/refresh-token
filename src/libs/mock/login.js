/** 
 * 登录接口
 * https://www.fastmock.site/mock/1c85c0d436ae044cf22849549ef471b8/api/login
 */

({_req, Mock}) => {
  const body = _req.body;

  if ( body.name === 'admin' && body.password === '123456' ) {
    return Mock.mock({
      code: 0,
      data: {
        tokenType: 'Bearer',
        accessToken: '@guid',
        refreshToken: '@guid',
        expiresTime: () => Date.now() + 20 * 1000
      },
      msg: '登录成功'
    })
  }

  return {
    code: 1,
    data: null,
    msg: '用户名或密码错误'
  }
}