import ls from '@libs/localStorage'
import getExpiredTime from '@libs/getExpiredTime'

/** 
 * 存储token相关信息到本地
 */
const setTokenInfoToLocal = (data: any): void => {

  // 更新本地存储的token
  const TOKEN: string = `${data.token_type.replace(/bearer/, 'Bearer')}${data.access_token}`
  ls.set('token', TOKEN);

  // 更新本地存储的refresh token
  const REFRESH_TOKEN: string = data.refresh_token;
  ls.set('refreshToken', REFRESH_TOKEN);

  // 更新本地存储的token过期时间戳
  const EXPIRED_TIME: number = getExpiredTime(data);
  ls.set('token_expired_timestamp', EXPIRED_TIME);
}

export default setTokenInfoToLocal;