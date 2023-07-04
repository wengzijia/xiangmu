import { http } from "../utils/request.js"
//获取全部订单列表
export function getAllOrder(data) {
  return http({
    url: '/order/miniEditionSuborder/orderList',
    method: 'post',
    data
  });
}
//获取尾款
export function countNoPaid(data) {
  return http({
    url: '/order/miniEditionSuborder/countNoPaid',
    method: 'post',
    data
  });
}
//获取尾款列表
export function countNoPaidAll(data) {
  return http({
    url: '/order/miniEditionSuborder/countNoPaidAll',
    method: 'post',
    data
  });
}
//获取全部单款订单列表
export function getAllSupplierOrder(data) {
  return http({
    url: '/order/miniSupplierOrders/getAllSupplierOrder',
    method: 'post',
    data
  });
}
//获取全部线下报价订单列表
export function getOfflineCartByUid(data) {
  return http({
    url: '/cart/getOfflineCartByUid',
    method: 'post',
    data
  });
}
// 加入购物车
export function updateOfflineCart(data) {
  return http({
    url: '/cart/updateOfflineCart',
    method: 'post',
    data
  });
}
/**
 * 获取单款订单详情
 * @param {*} data 
 * @returns 
 */
export function getSupplierOrderDetails(data) {
  return http({
    url: "/order/miniSupplierOrders/getSupplierOrderDetails",
    method: "post",
    data,
  });
}
/**
 * 免登录获取单款订单详情
 * @param {*} data 
 * @returns 
 */
export function getShareOrderDetails(data) {
  return http({
    url: "/certifyFree/order/miniSupplierOrders/getSupplierOrderDetails",
    method: "post",
    data,
  });
}
/**
 * 免登录获取单款订单详情
 * @param {*} data 
 * @returns 
 */
 export function getShareProcessOrderDetails(data) {
  return http({
    url: "/certifyFree/order/miniEditionSuborder/ordersDetails",
    method: "post",
    data,
  });
}

//获取订单详情
export function ordersDetails(data) {
  return http({
    url: '/order/miniEditionSuborder/ordersDetails',
    method: 'post',
    data
  });
}
//文件绑定订单
export function editionFiles(data) {
  return http({
    url: '/order/miniEditionSuborder/editionFiles',
    method: 'post',
    data
  });
}
//文件绑定订单
export function editFileLook(data) {
  return http({
    url: '/order/miniSupplierOrders/editFileLook',
    method: 'post',
    data
  });
}


//调起订单合并微信支付
export function createWxPayUrl(data) {
  return http({
    url: '/edition/miniEditionOrderTogether/createWxPayUrl',
    // url:  '/order/miniEditionOrder/createWxPayUrl' ,/order/miniDiffOrder/createWxPayUrl
    method: 'post',
    data
  });
}
//调起微信支付
export function WxPayUrl(data) {
  return http({
    url: '/order/miniEditionOrder/createWxPayUrl',
    method: 'post',
    data
  });
}
//调起微信二维码支付
export function createProxyPayQrCode(data) {
  return http({
    url: '/order/miniEditionOrder/createPayQrCode',
    method: 'post',
    data
  });
}
//查询订单支付状态
export function getOrderByOrderNo(data) {
  return http({
    url: '/order/miniEditionOrder/getOrderByOrderNo',
    method: 'post',
    data
  });
}
//调起微信二维码支付(合并订单)
export function createProxyMergePayQrCode(data) {
  return http({
    url: '/edition/miniEditionOrderTogether/createPayQrCode',
    method: 'post',
    data
  });
}
//查询订单支付状态(合并订单)
export function getMergeOrderByOrderNo(data) {
  return http({
    url: '/edition/miniEditionOrderTogether/getOrderByOrderNo',
    method: 'post',
    data
  });
}
//调起大货微信支付
export function singleWxPayUrl(data) {
  return http({
    url: '/order/miniOrders/createPayQrCode',
    method: 'post',
    data
  });
}
//调起补差价微信支付
export function DiffOrderPayUrl(data) {
  return http({
    url: '/order/miniDiffOrder/createWxPayUrl',
    method: 'post',
    data
  });
}
//获取推荐信息
export function refereeOrderList(data) {
  return http({
    url: '/order/miniEditionSuborder/refereeOrderList',
    method: 'post',
    data
  });
}
//获取当前用户信息
export function getCurrentUserInfo(data) {
  return http({
    url: '/users/user/getCurrentUserInfo',
    // url: '/users/user/getDbUserInfo',
    method: 'post',
    data
  });
}
//查看推荐用户订单数量
export function refereeUserList(data) {
  return http({
    url: '/order/miniEditionSuborder/refereeUserList',
    method: 'post',
    data
  });
}
//确认提货
export function confirmReceiver(data) {
  return http({
    url: '/order/miniEditionSuborder/confirmReceiver',
    method: 'post',
    data
  });
}
//查询我的资质信息
export function getDocumentsByUid(data) {
  return http({
    url: '/user/miniComDocuments/getDocumentsByUid',
    method: 'post',
    data
  });
}
//保存或修改资质信息
export function saveOrUpdate(data) {
  return http({
    url: '/user/miniComDocuments/saveOrUpdate',
    method: 'post',
    data
  });
}
//添加资质信息并绑定订单
export function addOrUpdateOrderDocuments(data) {
  return http({
    url: '/edition/miniEditionSuborderComDocuments/addOrUpdateOrderDocuments',
    method: 'post',
    data
  });
}
//已有资质信息绑定订单
export function add(data) {
  return http({
    url: '/edition/miniEditionSuborderComDocuments/add',
    method: 'post',
    data
  });
}
//删除订单已绑定的资质
export function del(data) {
  return http({
    url: '/edition/miniEditionSuborderComDocuments/del',
    method: 'post',
    data
  });
}
//修改订单联系人
export function updateReceiver(data) {
  return http({
    url: '/order/miniEditionSuborder/updateReceiver',
    method: 'post',
    data
  });
}
//取消订单
export function cancelOrder(data) {
  return http({
    url: '/order/miniEditionOrder/cancelOrder',
    method: 'post',
    data
  });
}
//单款取消订单
export function SingcancelOrder(data) {
  return http({
    url: '/order/miniOrders/cancelOrder',
    method: 'post',
    data
  });
}
/**
 * 单款转移订单
 * @param {*} data 
 * @returns 
 */
export function allot(data) {
  return http({
    url: '/order/miniSupplierOrders/allot',
    method: 'post',
    data
  });
}
/**
 * 单工序转移订单
 * @param {*} data 
 * @returns 
 */
 export function allotProcesse(data) {
  return http({
    url: '/order/miniEditionSuborder/allot',
    method: 'post',
    data
  });
}
//删除订单
export function deleteOrder(data) {
  return http({
    url: '/order/miniEditionOrder/deleteOrder',
    method: 'post',
    data
  });
}
//删除资质
export function deleteById(data) {
  return http({
    url: '/user/miniComDocuments/deleteById',
    method: 'post',
    data
  });
}

//单款创建订单
export function createSingleOrder(data) {
  return http({
    url: '/order/miniOrders/createOrder',
    method: 'post',
    data
  });
}
//获取子单号
export function SubOrderNoByOrderNo(data){
  return http({
    url: '/order/miniOrders/getSubOrderNoByOrderNo',
    method: 'post',
    data
  })
}
//调起合并大货订单微信支付
export function singnCreatePayQrCode(data) {
  return http({
    url: '/order/miniOrdersTogether/createPayQrCode',
    method: 'post',
    data
  });
}
//合并大货订单
export function createOrder1(data) {
  return http({
    url: '/order/miniOrdersTogether/createOrder',
    method: 'post',
    data
  });
}
//合并订单
export function createOrder(data) {
  return http({
    url: '/edition/miniEditionOrderTogether/createOrder',
    method: 'post',
    data
  });
}
//查看月份订单数量
export function refereeMonthList(data) {
  return http({
    url: '/order/miniEditionSuborder/refereeMonthList',
    method: 'post',
    data
  });
}

//订单优惠记数
export function countDiscount(data) {
  return http({
    url: '/edition/miniEditionRefereeIncome/countDiscount',
    method: 'post',
    data
  });
}
//订单优惠记录
export function listAllDiscount(data) {
  return http({
    url: '/edition/miniEditionRefereeIncome/listAllDiscount',
    method: 'post',
    data
  });
}
//推荐人提现记录
export function getByWithdrawalUid(data) {
  return http({
    url: '/user/miniUserExtractLog/getByWithdrawalUid',
    method: 'post',
    data
  });
}

//推荐人提现申请
export function saveUserExtractLog(data) {
  return http({
    url: '/user/miniUserExtractLog/saveUserExtractLog',
    method: 'post',
    data
  });
}
/**
 * 抽奖转盘图片
 * @param {*} data 
 * @returns 
 */
export function listAllRebate(data) {
  return http({
    url: '/edition/miniEditionRebate/listAllRebate',
    method: 'post',
    data
  });
}
/**
 * 抽奖转盘
 * @param {*} data 
 * @returns 
 */
export function miniEditionRebate(data) {
  return http({
    url: '/edition/miniEditionRebate/rebate',
    method: 'post',
    data
  });
}
/**
 * 获取抽奖子订单列表
 * @param {*} data 
 * @returns 
 */
export function getSubOrderByOrderNo(data) {
  return http({
    url: '/edition/miniEditionOrderTogether/getSubOrderByOrderNo',
    method: 'post',
    data
  });
}
/**
 * 订单结算（支付宝打钱）
 * @param {*} data 
 * @returns 
 */
export function repaidByOrderNo(data) {
  return http({
    url: '/order/miniEditionSuborder/repaidByOrderNo',
    method: 'post',
    data
  });
}
/**
 * 确认兰纸
 * @param {*} data 
 * @returns 
 */
export function confirmBluePaper(data) {
  return http({
    url: '/order/miniEditionSuborder/confirmBluePaper',
    method: 'post',
    data
  });
}

/**
 * 未支付订单数
 * @param {*} data 
 * @returns 
 */
export function countOrder(data) {
  return http({
    url: '/order/miniEditionOrder/countOrder',
    method: 'post',
    data
  });
}

/**
 * 发起退款
 * @param {*} data 
 * @returns 
 */
export function createOrderRefund(data) {
  return http({
    url: '/order/miniOrdersRefund/createOrderRefund',
    method: 'post',
    data
  });
}


/**
 * 货期计算
 * @param {*} data 
 * @returns 
 */
export function delivery(data) {
  return http({
    url: '/certifyFree/manage/miniHoliday/delivery',
    method: 'post',
    data
  });
}

/**
 * 获取小程序用户推荐码
 * @param {*} data
 * @returns
 */
export function getWeChatMiniReferralCode(data) {
  const accountInfo = wx.getAccountInfoSync()
  data.envVersion = accountInfo.miniProgram.envVersion;
  return http({
    url: '/users/user/getWeChatMiniReferralCode',
    method: 'post',
    responseType: 'arraybuffer',
    data
  });
}
/**
 * 取消分享
 * @param {*} data 
 * @returns 
 */
export function cancleAllot(data) {
  return http({
    url: "/order/miniSupplierOrders/cancleAllot",
    method: "post",
    data,
  });
}
/**
 * 取消分享
 * @param {*} data 
 * @returns 
 */
 export function cancleProcessAllot(data) {
  return http({
    url: "/order/miniSupplierOrders/cancleAllot",
    method: "post",
    data,
  });
}
/**
 * 取消印刷加工分享
 * @param {*} data 
 * @returns 
 */
export function canclePrintAllot(data) {
  return http({
    url: "/order/miniEditionSuborder/cancleAllot",
    method: "post",
    data,
  });
}
/**
 * 获取货期
 * @param {*} data 
 * @returns 
 */
export function getWxMinOrderOutTime(data) {
  return http({
    url: "/order/miniSupplierOrders/getWxMinOrderOutTime",
    method: "post",
    data,
  });
}
/**
 * 代理人下单(订单确认页)
 * @param {*} data 
 * @returns 
 */
export function addEditionAndSupplierOrders(data) {
  return http({
    url: "/order/miniSupplierOrders/addEditionAndSupplierOrders",
    method: "post",
    data,
  });
}
/**
 * 获取专版商品列表
 * @param {*} data 
 * @returns 
 */
 export function listSpecialEditionGoods(data) {
  return http({
    url: "/special/miniSpecialEditionGoods/listSpecialEditionGoods",
    method: "post",
    data,
  });
}
/**
 * 同意修改
 * @param {*} data 
 * @returns 
 */
 export function userDefinedConfirm(data) {
  return http({
    url: "/order/miniOrderEnquiry/userDefinedConfirm",
    method: "post",
    data,
  });
}
/**
 * 创建模板订单
 * @param {*} data 
 * @returns 
 */
export function addTemplateEditionOrder(data) {
  return http({
    url: "/order/miniEditionOrder/addTemplateEditionOrder",
    method: "post",
    data,
  });
}
/**
 * 获取印前备注
 * @param {*} data 
 * @returns 
 */
 export function prepressNotes(data) {
  return http({
    url: "/order/miniSupplierOrders/prepressNotes",
    method: "post",
    data,
  });
}
/**
 * 新增发票
 * @param {*} data 
 * @returns 
 */
export function _saveOrUpdate(data) {
  return http({
    url: "/user/miniInvoice/saveOrUpdate",
    method: "post",
    data,
  });
}
/**
 * 设置默认发票
 * @param {*} data 
 * @returns 
 */
 export function updateDefault(data) {
  return http({
    url: "/user/miniInvoice/updateDefault",
    method: "post",
    data,
  });
}
/**
 * 获取发票列表
 * @param {*} data 
 * @returns 
 */
 export function getByUid(data) {
  return http({
    url: "/user/miniInvoice/getByUid",
    method: "post",
    data,
  });
}
/**
 * 删除发票抬头
 * @param {*} data 
 * @returns 
 */
 export function _deleteById(data) {
  return http({
    url: "/user/miniInvoice/deleteById",
    method: "post",
    data,
  });
}
/**
 * 查询发票地址
 * @param {*} data 
 * @returns 
 */
 export function _getByUid(data) {
  return http({
    url: "/user/miniInvoiceAddress/getByUid",
    method: "post",
    data,
  });
}
/**
 * 更新发票地址
 * @param {*} data 
 * @returns 
 */
 export function _update(data) {
  return http({
    url: "/user/miniInvoiceAddress/update",
    method: "post",
    data,
  });
}
/**
 * 新增发票地址
 * @param {*} data 
 * @returns 
 */
 export function saveAddress(data) {
  return http({
    url: "/user/miniInvoiceAddress/save",
    method: "post",
    data,
  });
}
/**
 * 开票中列表
 * @param {*} data 
 * @returns 
 */
 export function getAllSupplierInvoiceOrder(data) {
  return http({
    url: "/order/miniSupplierOrders/getAllSupplierInvoiceOrder",
    method: "post",
    data,
  });
}
/**
 * 开票说明
 * @param {*} data 
 * @returns 
 */
 export function getInvoiceInstructions(data) {
  return http({
    url: "/special/miniInvoiceConfig/getInvoiceInstructions",
    method: "post",
    data,
  });
}