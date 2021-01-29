"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var config_1 = require("@libs/axios/config");
var localStorage_1 = require("@libs/localStorage");
var message_1 = require("@libs/message");
var router_1 = require("@/router");
/**
 * 创建一个独立的axios实例
 * 把常用的公共请求配置放这里添加
 */
var instance = axios_1["default"].create(config_1["default"]);
/**
 * 请求拦截
 * 添加一些全局要带上的东西
 */
instance.interceptors.request.use(
// 正常拦截
function (config) {
    /**
     * 定义token
     * 如果本地有token记录，都要在请求头里带上去给接口
     */
    var LOCAL_TOKEN = localStorage_1["default"].get('token') || '';
    if (LOCAL_TOKEN) {
        config.headers['Authorization'] = LOCAL_TOKEN;
    }
    /**
     * 返回处理后的配置
     */
    return Promise.resolve(config);
}, 
// 拦截失败
function (err) { return Promise.reject(err); });
/**
 * 返回拦截
 * 在这里解决数据返回的异常问题
 */
instance.interceptors.response.use(
// 正常响应
function (res) {
    /**
     * 处理axios在低版本IE下的坑爹问题
     * 主要针对IE 8-9
     */
    if (res.data === null
        &&
            res.config.responseType === 'json'
        &&
            res.request.responseText !== null) {
        try {
            res.data = JSON.parse(res.request.responseText);
        }
        catch (e) {
            console.log(e);
        }
    }
    /**
     * 登录失效拦截
     * 虽然在请求前有通过refreshToken去延长有效期，但它也有失效的时候…
     */
    if (res.data.code === 1 && res.data.msg === '用户凭证已过期') {
        message_1["default"].error(res.data.msg);
        try {
            router_1["default"].push({
                name: 'login'
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    /**
     * 提取接口的返回结果
     * 简化接口调用的编码操作
     */
    return Promise.resolve(res.data);
}, 
// 异常响应（统一返回一个msg提示即可）
function (err) { return Promise.reject('网络异常'); });
exports["default"] = instance;
