export const ACCESS_TOKEN = 'Access-Token';
export const CURRENT_USER_INFO = 'CURRENT-USER-INFO';
export const BASEURL = '/api/consumer'
export const LOTTERY_TIME = 'lottery-time'
export const MOBILE_REG=  /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;//手机号正则
export const USER_NAME_REG =  /^[\u4e00-\u9fa5]{2,4}$/;//2-4个中文字符正则
export const PASSWORD_REG = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{6,16}')//6-16位字母加数字密码验证
// export const CARD_BASEURL =  process.env.NODE_ENV === "development"?'http://192.168.1.220:7900':'https://qdpyb.aocai.cn'
export const CARD_BASEURL = 'http://192.168.1.220:7900'