class Regexp {
  
  // 手机号校验
  isMob (phoneNumber: number | string): boolean {
    const TEXT: string = String(phoneNumber);
    return /^1[3456789]\d{9}$/.test(TEXT);
  }

  // 邮箱校验
  isEmail (email: string): boolean {
    return /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(email);
  }

  // 网址校验
  isUrl (url: string): boolean {
    return /https?:\/\/[\w-]+(\.[\w-]+){1,2}(\/[\w-]{3,6}){0,2}(\?[\w_]{4,6}=[\w_]{4,6}(&[\w_]{4,6}=[\w_]{4,6}){0,2})?/.test(url);
  }

  // 获取随机字符串
  getRandomString (length: number): string {
    let result = '';
    const DICT = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';

    for( let i = 0; i < length; i++ ) {
      const INDEX = Math.floor( Math.random() * DICT.length);
      result += DICT[INDEX];
    }
    
    return result;
  }
}

const regexp = new Regexp();

export default regexp;