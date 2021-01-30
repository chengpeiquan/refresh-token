const login = require('./api/login');
const refreshToken = require('./api/refreshToken');
const test = require('./api/test');

/** 
 * 接口配置
 */
const createApi = (app) => {
  // post
  login(app);
  refreshToken(app);

  // get
  test(app);
}

module.exports = createApi;