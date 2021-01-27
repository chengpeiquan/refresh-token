import Mock from 'mockjs'

const NOW: number = Date.now();
const EXP: number = NOW + 10 * 1000;

const refreshToken = (options: any): any => {
  const BODY: any = options.body;
  console.log(BODY);
  if ( !BODY ) {
    return {
      code: 1,
      data: null,
      msg: '缺少请求的参数'
    }
  }
  
  
  const data = Mock.mock({
    tokenType: 'Bearer',
    accessToken: Mock.Random.guid(),
    refreshToken: Mock.Random.guid(),
    expiresTime: EXP
  })

  return {
    code: 0,
    data: data,
    msg: 'success'
  }
}

export default refreshToken;