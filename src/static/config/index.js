/*
 * @Descripttion:
 * @version:
 * @Date: 2021-11-17 19:09:53
 * @LastEditTime: 2022-03-23 09:32:58
 */
/*
 * @Description:
 * @param:
 */

const isDev = process.env.NODE_ENV === 'development';

const secretKeyMap = {
  防灾减灾: 'DisasterPreventionAndReduction',
  数智管家: 'ShuZhiHousekeeper',
  欣云管家: 'XinYunHousekeeper',
  沙东: 'SaDongShuZhiHousekeeper',
  垃圾分类: 'GarbageClassificationInLiCheng',
};

const defaultConfig = {
  // baseUrl: 'http://192.168.3.126:8888', //琳青
  baseUrl: 'https://scg.chinaemt.com',
  // baseUrl: 'http://192.168.3.176:8888', // 杨凡
  // baseUrl: 'http://192.168.3.155:8055/ser', // 炎城
  // baseUrl: 'http://192.168.3.237:8055/ser', // 直潮
  // baseUrl: 'http://192.168.3.251:8055/ser', // 少赞
  // baseUrl: 'http://192.168.3.166:8888', // 乃键
  // baseUrl: 'https://www.zciot1.cn/ser', // 增城垃圾分类
  // baseUrl: 'https://www.shuzhiguanjia.cn/ser', // 沙河
  // baseUrl: 'https://sioc.chinaemt.com', // 公司测试环境
  // baseUrl: 'https://xc1.zeits.cn/ser', // 沙东
  // baseUrl: 'https://housekeeper.chinaemt.com/ser', // 欣云管家

  projectName: '欣云管家',
  // projectName: '数智管家',
  // projectName: '防灾减灾',
  // projectName: '沙东',
  // projectName: '垃圾分类',

  // 密钥key
  get secretKey() {
    const key = secretKeyMap[this.projectName];
    if (key) {
      return key;
    }
    return 'DisasterPreventionAndReduction';
  },

  // 公众号域名
  wxUrl: 'https://scg.zczhzl.cn/ser',

  // 源域名
  get host() {
    return this.baseUrl.replace('/ser', '');
  },

  get wxHost() {
    return this.wxUrl.replace('/ser', '');
  },

  get fileHost() {
    return this.host;
  },
  get imgStaticUrl() {
    if (isDev) {
      return 'http://120.24.173.36:9000/sinvie/sinvie-steward/applet';
    }
    return 'http://120.24.173.36:9000/sinvie/sinvie-steward/applet';
    // return this.fileHost + '/WechatAppStatic';
  },
  websocketUrl: '',
  GDKey: '2300898618f6ce0fa1527f4e76866162',
  TXKey: 'KKQBZ-FH2WF-TGRJU-J5YXQ-GUT7V-3FB76',
  serviceId: 'wxc1c68623b7bdea7b', //Service ID
  apiName: 'poiSearch', //API Name
};
console.log(
  '%c [ process.env.NODE_ENV ]',
  'font-size:13px; background:pink; color:#bf2c9f;',
  process.env.NODE_ENV
);

export default defaultConfig;
