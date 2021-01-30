/** 
 * 测试接口
 */
module.exports = (app) => {
  app.get('/api/test', (req, res) => {

    const headers = req.headers;
    const token = headers.authorization || '';
    if ( !token || token === 'Basic KJytrqad8765Fia' ) {
      res.status(401).send({
        code: 1,
        data: null,
        msg: '用户凭证已过期'
      });
      return false;
    }

    const query = req.query;
    res.send({
      code: 0,
      data: query.key,
      msg: '请求成功'
    });

  });
}