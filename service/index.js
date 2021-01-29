/** 
 * 导入依赖
 */
const express = require('express');
const bodyParser = require('body-parser');
const createApi = require('./createApi');

/** 
 * 创建实例
 */
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));


/** 
 * 跨域允许
 */
app.all('*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
	next();
});


/** 
 * 创建接口
 */
createApi(app);


/** 
 * 启动服务
 */
const hostName = '127.0.0.1';
const port = 12321;
app.listen(port, hostName, () => {
	console.log(`接口服务器已运行 http://${hostName}:${port}/`);
});