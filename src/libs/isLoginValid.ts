import ls from '@libs/localStorage'

const isLoginValid = (): boolean => {
  let status: boolean = true;

  // 读取token过期时间戳
  const TOKEN_EXPIRED_TIMESTAMP: number = ls.get('token_expired_timestamp') ? ls.get('token_expired_timestamp') : 0;

  // 获取当前的时间戳
  const NOW_TIMESTAMP: number = new Date().getTime();

  // token过期时间不存在，说明完全没有登陆过，登录无效
  if ( !TOKEN_EXPIRED_TIMESTAMP ) {
    status = false;
  }

  // 如果当前时间戳，大于等于过期时间戳，说明登录过期，登录无效
  if ( NOW_TIMESTAMP - TOKEN_EXPIRED_TIMESTAMP >= 0 ) {
    status = false;
  }

  return status;
}

export default isLoginValid;