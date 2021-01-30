# 基于 OAuth 2.0 的 refreshToken 方案与 demo

如今在涉及到用户登录的系统设计里面，基本上都是通过 OAuth 2.0 来设计授权，当你在调用登录接口的时候，可以看到在返回来的数据里面会有 2 个 Token：一个 `accessToken` 和一个 `refreshToken` 。

为什么会有两个 Token，之间有什么区别？前端在开发的时候需要注意什么事情？

这其实是我最近在业务上涉及到的一处开发需求点，因为之前的老业务，服务端都没有按照这样的模式去做，单纯的过期就让用户重新登录，所以自己也没有实际去处理过 Token 续期的场景，颇觉有趣，把第一次的开发经验记录起来。

## 需求背景

这其实是 [OAuth 2.0 的四种方式](http://www.ruanyifeng.com/blog/2019/04/oauth-grant-types.html) 之一的 “凭证式”。

通常来说下发的 `accessToken` 都有一个比较短暂的有效期，大部分情况下可能只有大半天，短的话更可能只有 2 ~ 3 小时（对，我处理的这个业务就是……），意味着用户在一天之内可能需要频繁进行重新登录。

关于为什么 `accessToken` 的有效期要那么短，可以参考 [OAuth 2.0 的一个简单解释](http://www.ruanyifeng.com/blog/2019/04/oauth_design.html) 。

传统的登录都是到期了跳回登录页面，让用户重新走一遍登录流程就可以了，但如今 `accessToken` 的超短有效期带来的用户体验是非常糟糕的，为了安全而牺牲用户体验，就是产品和开发打架的常见原因之一。

那么有没有办法既保证安全，又能够减少用户重复登录的操作呢？ `refreshToken` 就是因此产生。

它可以用来请求重新颁发一个 `accessToken`，当请求被告知过期时，通过刷新令牌的方式，用新的令牌来完成之前还没完成的请求，让用户可以不重新登录，达到无感知刷新的目的，直到 `refreshToken` 也过期了，才需要回去走登录流程。

这一篇来讲一讲如何无感知的帮助用户执行 `accessToken` 的刷新。

## 需求目的

搞清楚目的才能好好搞事情哈哈哈，于是拆解了一下需求，分为三个小点：

1. 当 `accessToken` 过期的时候，在发起下一次请求之前，前端先帮用户主动刷新 Token，拿到新的 Token 完成后续的请求

2. 在刷新 Token 成功之前，不允许重复刷新（因为一个页面可能有多个请求），多次未完成的请求需要挂起

3. 当 `refreshToken` 也过期时（也就是刷新失败），停止重复刷新，引导用户重新登录

## 实现思路

理清楚需求目的之后，还需要先跟服务端同学约定一下判断规则，先确认我们在前端能够拿到哪些数据，按照上一次对接的业务情况，服务端的登录接口提供了以下三个字段返回：

字段|含义
:--|:--
accessToken|请求接口的时候，需要在请求头里带上的 Token
refreshToken|用来请求刷新 Token 的凭证
expiresTime|Token 的过期时间

其中登录接口和刷新接口是免 Token 验证的，登录接口只需要校验默认的请求头以及账号密码，刷新接口只需要校验刷新凭证。

## 实现过程

以 Vue + Axios 来搭一个演示项目为例，核心代码相关的文件是这几个：

```js
src
└─libs
  ├─axios
  │ ├─config.ts
  │ ├─index.ts
  │ └─instance.ts
  ├─refreshToken.ts
  └─setLoginInfoToLocal.ts
```

虽然文件比较多，但代码其实不多，习惯把一些可能复用的代码抽离出来独立成模块了。

文件|作用
:--|:--
axios/config.ts|axios 的一些基础配置，可以配置接口路径、超时时间等
axios/instance.ts|一个 axios 实例，在这里配置了一些全局都会用到的请求拦截、返回拦截
axios/index.ts|组件里用到的 axios 入口文件，会在这里再添加一些专属业务侧的拦截
refreshToken.ts|用来刷新 Token 的一些业务代码，返回一个 Promise
setLoginInfoToLocal.ts|存储登录信息到本地，在调用登录接口和刷新接口之后需要用到

点击查看： [libs - refresh-token](https://github.com/chengpeiquan/refresh-token/tree/main/src/libs)

下面把几个主要文件里面，主要的代码部分讲一下

### instance.ts

这里把主要的部分讲一下，之所以要抽离出 config ，然后再单独通过 create 创建一个新的实例，是因为之前遇到一个坑，axios 如果先 create 再 export，那么用到的地方其实都是同一个实例，如果你在其他地方可能要用到一个干净的新实例，抽离出 config 可以减少你重复编写代码的情况。

```ts
// 通过create创建一个新的实例
const instance = axios.create(config);
```

/** 
 * 请求拦截
 * 添加一些全局要带上的东西
 */
instance.interceptors.request.use(

  // 正常拦截
  config => {
    
    // 添加token
    const LOCAL_TOKEN: string = ls.get('token') || '';
    if ( LOCAL_TOKEN ) {
      config.headers['Authorization'] = LOCAL_TOKEN;
    }

    // 返回处理后的配置
    return Promise.resolve(config);
  },
  
  // 拦截失败
  err => Promise.reject(err)

);

/** 
 * 返回拦截
 * 在这里解决数据返回的异常问题
 */
instance.interceptors.response.use(

  // 正常响应
  res => {

    // 处理axios在IE 8-9下的坑爹问题
    if (
      res.data === null
      &&
      res.config.responseType === 'json'
      &&
      res.request.responseText !== null
    ) {

      try {
        res.data = JSON.parse(res.request.responseText);
      }
      catch (e) {
        console.log(e);
      }

    }

    // 登录失效拦截（主要针对refreshToken也失效的情况）
    if ( res.data.code === 1 && res.data.msg === '用户凭证已过期' ) {
      
      // 告知用户
      message.error(res.data.msg);

      // 切去登录
      try {
        router.push({
          name: 'login'
        });
      }
      catch (e) {
        console.log(e);
      }

    }

    // 提取接口的返回结果，简化接口调用的编码操作
    return Promise.resolve(res.data);
  },

  // 异常响应（统一返回一个msg提示即可）
  err => Promise.reject('网络异常')

);

export default instance;
```

## 项目演示

本仓库就是一个项目源码，这里提供了两种类型的 Mock 接口：

### 本地 Express Server

推荐用这个方式，可以一遍测试效果，一遍看代码。

1. 先通过 `git clone https://github.com/chengpeiquan/refresh-token.git` 克隆本仓库到本地

2. 控制台访问项目，输入 `npm install` 执行依赖安装

3. 执行 `npm run api` 启动接口服务

4. 另外打开一个控制台访问项目，输入 `npm run serve` 启动项目调试

### 远程 FastMock API

原本是采用这个方式的，但是可能受自己网络或者对方服务器影响，有时候响应很慢，试过 30s 超时了还没响应回来，花费过多时间在等待上了，所以才换成了本地 Server 。

线上访问：[Refresh Token Demo](https://chengpeiquan.github.io/refresh-token/)

## 参考资料

[理解OAuth 2.0](http://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html)

[OAuth 2.0 的四种方式](http://www.ruanyifeng.com/blog/2019/04/oauth-grant-types.html)

[深入理解token](https://www.cnblogs.com/xuxinstyle/p/9675541.html)

[请求时token过期自动刷新token](https://segmentfault.com/a/1190000016946316)