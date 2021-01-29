const Mock = require('mockjs');

/** 
 * 登录接口
 */
module.exports = (app) => {
  app.post('/api/refreshToken', (req, res) => {
    
    const body = req.body;
    const refreshToken = body.refreshToken || '';
    if ( !refreshToken ) {
      res.send({
        code: 1,
        data: null,
        msg: '缺少刷新凭证'
      });
      return false;
    }

    const isAllowRefresh = Mock.Random.boolean();
    if ( !isAllowRefresh ) {
      res.send({
        code: 1,
        data: null,
        msg: '用户凭证已过期'
      });
      return false;
    }
  
    res.send({
      code: 0,
      data: {
        tokenType: 'Bearer',
        accessToken: Mock.Random.guid(),
        refreshToken: Mock.Random.guid(),
        expiresTime: Date.now() + 5 * 1000
      },
      msg: '续期成功'
    });

  });
}