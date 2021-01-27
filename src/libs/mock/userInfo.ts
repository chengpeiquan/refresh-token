import ls from '@libs/localStorage'

const userInfo = (): any => {
  const LOGIN_INFO: any = ls.get('login_info');
  if ( !LOGIN_INFO ) {
    return {
      code: 0,
      data: {
        id: 0,
        name: ''
      },
      msg: 'un logined.'
    }
  }

  // 登录过期数据
  const NOW_TIMESTRAMP: number = Date.now();
  const EXP_TIMESTRAMP: number = ls.get('token_expired_timestamp');
  const DIFF: number = EXP_TIMESTRAMP - NOW_TIMESTRAMP;
  if ( DIFF <= 0 ) {
    return {
      code: 1,
      data: null,
      msg: '用户凭证已过期'
    }
  }

  // 正常数据
  const data = {
    id: 1,
    name: 'admin'
  }
  return {
    code: 0,
    data: data,
    msg: 'success'
  }
}

export default userInfo;