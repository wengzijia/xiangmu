// const app = getApp()
import {http} from "../utils/request.js"

export function authorizeLogin(data) {
    return http({
      url:  '/certifyFree/user/weChat/authorizeLogin',
      method:'post',
      data
    });
}

export function sendRegSmsVerifyCode(data) {
  return http({
    url:  '/certifyFree/verifyCode/sendRegSmsVerifyCode',
    method:'post',
    data
  });
}
//验证短信
export function verifyMsgCode(data) {
  return http({
    url:  '/certifyFree/verifyCode/verifyMsgCode',
    method:'post',
    data
  });
}

export function simpleRegistration(data) {
  return http({
    url:  '/certifyFree/user/simpleRegistration',
    method:'post',
    data
  });
}

export function mobileExist(data) {
  return http({
    url:  '/certifyFree/user/mobileExist',
    method:'post',
    data
  });
}
//修改密码
export function updatePassword(data) {
  return http({
    url:  '/users/user/updatePassword',
    method:'post',
    data
  });
}

//反馈意见
export function miniUserFeedback(data) {
  return http({
    url:  '/edition/miniUserFeedback/add',
    method:'post',
    data
  });
}

//退出登录
export function logout(data) {
  return http({
    url:  '/certifyFree/user/logout',
    method:'post',
    data
  });
}

//申请成为推荐人
export function updateReferences(data) {
  return http({
    url:  '/produce/miniAgentApply/updateReferences',
    method:'post',
    data
  });
}

//查询推荐人资质
export function getByUid(data) {
  return http({
    url:  '/produce/miniAgentApply/getByUid',
    method:'post',
    data
  });
}

/**
 * QQ获取小程序码
 * @param {}} data 
 * @returns 
 */
export function createMiniCode(data) {
  return http({
    url:  '/certifyFree/user/QQ/createMiniCode',
    method:'get',
    data
  });
}
//收款设置
export function saveOrUpdate(data) {
  return http({
    url:  '/user/miniUserAccount/saveOrUpdate',
    method:'post',
    data
  });
}


export function sgetByUid(data) {
  return http({
    url:  '/user/miniUserAccount/getByUid',
    method:'post',
    data
  });
}

//验证密码
export function verifyPassword(data) {
  return http({
    url:  '/users/user/verifyPassword',
    method:'post',
    data
  });
}

/**
 * 获取当前用户信息
 * @param {*} data 
 * @returns 
 */
export function getCurrentUserInfo(data) {
  return http({
    url:  '/users/user/getDbUserInfo' ,
    method:'post',
    data
  });
}


/**
 * 
 * @param {*} data 
 * @returns 
 */
 export function checkToken(data) {
  return http({
    url:  '/certifyFree/user/checkToken' ,
    method:'post',
    data
  })
}

//手机号绑定wx客户端
export function bindPhone(data) {
  return http({
    url:  '/certifyFree/user/bindPhone',
    method:'post',
    data
  });
}

//手机号解密
export function decryptPhone(data) {
  return http({
    url:  '/certifyFree/user/weChat/decryptPhone',
    method:'post',
    data
  });
}
/**
 * 修改用户信息
 */
export function updateAccountInfo(data){
  return http({
    url:'/users/user/updateAccountInfo',
    method:'post',
    data
  })
}
/**
 * 收货地址列表
 */
export function getMyList(data){
  return http({
    url:'/users/address/getMyList',
    method:'post',
    data
  })
}
/**
 * 删除收货地址
 */
 export function deleteById(data){
  return http({
    url:'/users/address/deleteById',
    method:'post',
    data
  })
}

/**
 * 收货地址详情
 */
 export function getById(data){
  return http({
    url:'/users/address/getById',
    method:'post',
    data
  })
}
/**
 * 保存或者修改收货地址
 */
export function addresssaveOrUpdate(data){
  return http({
    url:'/users/address/saveOrUpdate',
    method:'post',
    data
  })
}

/**
 * 获取时间
 */
 export function getCurrentTimeMillis(data){
  return http({
    url:'/certifyFree/test/getCurrentTimeMillis',
    method:'post',
    data
  })
}
/**
 * 用户信用支付功能查询
 * @param {*} data 
 * @returns 
 */
 export function getUserCreditPurchaseDetail(data) {
  return http({
    url: "/user/creditPurchase/getUserCreditPurchaseDetail",
    method: "get",
    data,
  });
}
/**
 * 查询能否抽奖
 * @param {*} data 
 * @returns 
 */
 export function canRebate(data) {
  return http({
    url: "/special/miniUserBonusRebate/canRebate",
    method: "post",
    data,
  });
}
/**
 * 优惠券抽奖
 * @param {*} data 
 * @returns 
 */
 export function rebate(data) {
  return http({
    url: "/special/miniUserBonusRebate/rebate",
    method: "post",
    data,
  });
}
/**
 * 获取用户优惠券列表
 * @param {*} data 
 * @returns 
 */
 export function getUserBonusList(data) {
  return http({
    url: "/user/miniUserBonus/getUserBonusList",
    method: "post",
    data,
  });
}
/**
 * 获取用户信用购月账单
 * @param {*} data 
 * @returns 
 */
 export function getUserCreditPurchaseMonthlyStatementList(data) {
  return http({
    url: "/user/creditPurchase/getUserCreditPurchaseMonthlyStatementList",
    method: "post",
    data,
  });
}
/**
 * 信用购月账单还款
 * @param {*} data 
 * @returns 
 */
 export function payBackMonthlyStatement(data) {
  return http({
    url: "/user/creditPurchase/payBackMonthlyStatement",
    method: "post",
    data,
  });
}
/**
 * 信用购提前还款
 * @param {*} data 
 * @returns 
 */
 export function payBackCurrentMonthlyStatement(data) {
  return http({
    url: "/user/creditPurchase/payBackCurrentMonthlyStatement",
    method: "post",
    data,
  });
}
/**
 * 获取活动信息
 * @param {*} data 
 * @returns 
 */
 export function gainActivities(data) {
  return http({
    url: "/user/miniTopupDiscountActivities/gainActivities",
    method: "post",
    data,
  });
}
/**
 * 消费记录
 * @param {*} data 
 * @returns 
 */
 export function listUserConsume(data) {
  return http({
    url: "/user/miniUserAccountLog/listUserConsume",
    method: "post",
    data,
  });
}
/**
 * 充值明细
 * @param {*} data 
 * @returns 
 */
 export function gainTopUpDetail(data) {
  return http({
    url: "/user/miniUserAccountTopup/gainTopUpDetail",
    method: "post",
    data,
  });
}
/**
 * 创建余额充值订单
 * @param {*} data 
 * @returns 
 */
 export function createAccountTopupOrder(data) {
  return http({
    url: "/user/miniUserAccountTopup/createAccountTopupOrder",
    method: "post",
    data,
  });
}
/**
 * 创建支付二维码
 * @param {*} data 
 * @returns 
 */
 export function createPayQrCode(data) {
  return http({
    url: "/user/miniUserAccountTopup/createPayQrCode",
    method: "post",
    data,
  });
}
/**
 * 上传文件
 * @param {*} data 
 * @returns 
 */
 export function uploadFile(data) {
  return http({
    url: "/user/miniUserAccountTopup/uploadFile",
    method: "post",
    data,
  });
}
/**
 * 获取预存收款账户信息
 * @param {*} data 
 * @returns 
 */
 export function gainAccount(data) {
  return http({
    url: "/user/miniUserDepositCollectionAccount/gainAccount",
    method: "post",
    data,
  });
}
/**
 * 获取用户信息
 * @param {*} data
 * @returns 
 */
 export function getDbUserInfo(data) {
  return http({
    url: "/users/user/getDbUserInfo",
    method: "post",
    data,
  });
}
/**
 * 根据订单号获取订单信息
 * @param {*} data
 * @returns 
 */
export function getAccountTopupNo(data) {
  return http({
    url: "/user/miniUserAccountTopup/getAccountTopupNo",
    method: "post",
    data,
  });
}
/**
 * 生成打开指定页链接
 * @param {*} data
 * @returns 
 */
export function generateUrlLink(data) {
  return http({
    url: "/user/weChat/generateUrlLink",
    method: "post",
    data,
  });
}