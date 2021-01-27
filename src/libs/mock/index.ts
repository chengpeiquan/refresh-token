import Mock from 'mockjs'
import userInfo from './userInfo'
import login from './login'

/** 
 * 基本配置
 */
Mock.setup({
  timeout: '300-600'
});


/** 
 * 用get的
 */
Mock.mock(/\/api\/userInfo/, 'get', userInfo);


/** 
 * 用post的
 */
Mock.mock(/\/api\/login/, 'post', login);
Mock.mock(/\/api\/refreshToken/, 'post', login);
Mock.mock(/\/api\/aaaaa/, 'post', login);


export default Mock;