import config from '@ts/config'

/** 
 * sessionStorage的封装
 * 
 * @description 简化sessionStorage的读取操作，同时支持直接读取不同类型的值，无需每次都对默认的字符串进行转化
 * @author chengpeiquan
 */

class SessionStorage {
  prefix: string;

  /** 
   * 通用参数
   * 在初始化的时候传入
   * @param {String} prefix - key的前缀，因为同一个网站使用相同的key会互相覆盖，所以通过前缀来区分数据，格式为：prefix_key
   */

  constructor (prefix: string) {
    this.prefix = prefix;
  }

  /** 
   * 读取数据
   */

  get (key: string) {
    const KEY = `${this.prefix}_${key}`;
    const DATA_STRING: any = (window as any).sessionStorage.getItem(KEY);

    /** 
     * 如果可以解析为JSON，则优先导出JSON
     * 否则按情况导出布尔值、数字、字符串
     */
    try {
      const DATA_JSON = JSON.parse(DATA_STRING);
      return DATA_JSON;
    }
    catch (e) {

      // 导出布尔值 true
      if ( DATA_STRING === 'true' ) {
        return true;
      }

      // 导出布尔值 false
      if ( DATA_STRING === 'false' ) {
        return false;
      }

      // 导出数字
      const DATA_NUMBER = Number(DATA_STRING);
      if ( !isNaN(DATA_NUMBER) ) {
        return DATA_NUMBER;
      }

      // 导出字符串
      return DATA_STRING;
    }
  }

  /** 
   * 存储数据
   */

  set (key: string, value: any) {
    const KEY = `${this.prefix}_${key}`;
    const VALUE = typeof value === 'object' ? JSON.stringify(value) : value;
    (window as any).sessionStorage.setItem(KEY, VALUE);
  }

  /** 
   * 移除数据
   */

  remove (key: string) {
    const KEY = `${this.prefix}_${key}`;
    (window as any).sessionStorage.removeItem(KEY);
  }

  /** 
   * 清除所有痕迹
   */
  clear () {
    (window as any).sessionStorage.clear();
  }

}

const ls = new SessionStorage(config.storageKeyPrefix);

export default ls;