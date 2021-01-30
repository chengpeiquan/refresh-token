const Mock = require('mockjs');

/** 
 * 登录接口
 */
module.exports = (app) => {
  app.post('/api/login', (req, res) => {

    const headers = req.headers;
    const token = headers.authorization
    if ( token !== 'Basic KJytrqad8765Fia' ) {
      res.status(403).send({
        code: 1,
        data: null,
        msg: '非法请求'
      });
      return false;
    }

    const body = req.body;
    if ( body.name !== 'admin' || body.password !== '123456' ) {
      res.status(403).send({
        code: 1,
        data: null,
        msg: '用户名或密码错误'
      });
      return false;
    }
  
    res.send({
      code: 0,
      data: {
        tokenType: 'Bearer',
        accessToken: Mock.Random.guid(),
        refreshToken: Mock.Random.guid(),
        expiresTime: Date.now() + 10 * 1000,
        userInfo: {
          id: 1,
          name: 'admin'
        }
      },
      msg: '登录成功'
    });

  });
}