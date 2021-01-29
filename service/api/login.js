const Mock = require('mockjs');

/** 
 * 登录接口
 */
module.exports = (app) => {
  app.post('/api/login', (req, res) => {

    const body = req.body;
    if ( body.name !== 'admin' || body.password !== '123456' ) {
      res.send({
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
        expiresTime: Date.now() + 5 * 1000,
        userInfo: {
          id: 1,
          name: 'admin'
        }
      },
      msg: '登录成功'
    });

  });
}