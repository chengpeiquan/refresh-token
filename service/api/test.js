const Mock = require('mockjs');

/** 
 * 测试接口
 */
module.exports = (app) => {
  app.get('/api/test', (req, res) => {

    const headers = req.headers;
    const token = headers.authorization || '';
    if ( !token || token === 'Basic KJytrqad8765Fia' ) {
      res.send({
        code: 1,
        data: null,
        msg: '用户凭证已过期'
      });
      return false;
    }

    const delayTime = Math.round( Mock.Random.float(0, 2, 3) * 1000 );
    setTimeout(() => {
      res.send({
        code: 0,
        data: Mock.Random.cparagraph(),
        msg: '请求成功',
        delayTime
      });
    }, delayTime);

  });
}