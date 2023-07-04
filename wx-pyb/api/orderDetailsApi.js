import { http } from "../utils/request.js";

/**
 *  获取园区信息
 * @param {*} data 
 * @returns 
 */
export function listPark(data) {
  return http({
    url: "/edition/miniEditionPark/listPark",
    method: "post",
    data,
  });
}


/**
 *  获取纸张信息
 * @param {*} data 
 * @returns 
 */
export function listPaper(data) {
  return http({
    url: "/edition/miniEditionPaper/listPaper",
    method: "post",
    data
  });
}
/**
 *  获取纸张信息
 * @param {*} data 
 * @returns 
 */
 export function listColorPaper(data) {
  return http({
    url: "/edition/miniEditionPaper/listColorPaper",
    method: "post",
    data
  });
}
/**
 *  获取表面处理
 * @param {*} data 
 * @returns 
 */
export function pinBanFilmMulchingName(data) {
  return http({
    url: "/special/miniCollageParams/getPinBanFilmMulchingName",
    method: "post",
    data
  });
}
export function listTon(data) {
  return http({
    url: "/edition/miniEditionPapertonprice/list",
    method: "post",
    data,
  });
}
/**
 * 获取吨价
 * @param {*} data 
 * @returns 
 */
export function getLose(data) {
  return http({
    url: "/certifyFree/editionOne/getLose",
    method: "post",
    data,
  });
}

/**
 * 获取价格
 * @param {*} data 
 * @returns 
 */
export function getPrice(data) {
  return http({
    url: "/certifyFree/editionOne/getPrice",
    method: "post",
    data,
  });
}
/**
 * 单款计价
 * @param {*} data 
 * @returns 
 */
 export function getPriceV31(data) {
  return http({
    url: "/certifyFree/edition/getPriceV31",
    method: "post",
    data,
  });
}
/**
 * 专版计价
 * @param {*} data 
 * @returns 
 */
 export function getPriceSpecial(data) {
  return http({
    url: "/certifyFree/edition/getPriceSpecial",
    method: "post",
    data,
  });
}

/**
 * 获取购物车数量
 * @param {}} data 
 * @returns 
 */
export function countCart(data) {
  return http({
    url: "/cart/miniCartEdition/countCart",
    method: "post",
    data,
  });
}

/**
 * 检验色号是否正确
 * @param {*} data 
 * @returns 
 */
export function checkPantone(data) {
  return http({
    url: "/certifyFree/attrGroup/checkPantone",
    method: "post",
    data,
  });
}

/**
 * 检验色号是否正确
 * @param {*} data 
 * @returns 
 */
 export function computeSize(data) {
  return http({
    url: "/certifyFree/attrGroup/computeSize",
    method: "post",
    data,
  });
}

/**
 * 反馈纸张信息
 * @param {*} data 
 * @returns 
 */
export function save(data) {
  return http({
    url: "/edition/miniPaperFeedback/save",
    method: "post",
    data,
  });
}

/**
 * 按照用户id获取园区工厂及印刷机
 * @param {*} data 
 * @returns 
 */
export function getByUidGetFactory(data) {
  return http({
    url: "/edition/miniEditionFactory/getByUid",
    method: "post",
    data,
  });
}
/**
 * 保存用户输入的园区工厂及印刷机信息
 * @param {*} data 
 * @returns 
 */
export function saveFactory(data) {
  return http({
    url: "/edition/miniEditionFactory/save",
    method: "post",
    data,
  });
}

/**
 * 按照用户id获取纸张吨价信息
 * @param {*} data 
 * @returns 
 */
export function getByUidGetPapertonprice(data) {
  return http({
    url: "/edition/miniEditionPapertonprice/getByUid",
    method: "post",
    data,
  });
}

/**
 * 保存用户输入的纸张信息
 * @param {*} data 
 * @returns 
 */
export function savePapertonprice(data) {
  return http({
    url: "/edition/miniEditionPapertonprice/saveOrUpdate",
    method: "post",
    data,
  });
}
/**
 * 获取优惠差价
 * @param {*} data 
 * @returns 
 */
export function getByKey(data) {
  return http({
    url: "/edition/miniEditionConfig/getByKey",
    method: "post",
    data,
  });
}

/**
 * 3.0整版订单获取价格
 * @param {*} data 
 * @returns 
 */
export function invoke(data) {
  return http({
    url: "/certifyFree/editionOne/invoke",
    method: "post",
    data,
  });
}
/**
 * 获取后道工艺
 * @param {*} data 
 * @returns 
 */
 export function byBoxNameGetCraft(data) {
  return http({
    url: "/certifyFree/editionOne/byBoxNameGetCraft",
    method: "post",
    data,
  });
}
/**
 * 获取纸价和优惠后的纸价
 * @param {*} data 
 * @returns 
 */
 export function getPaperPrice(data) {
  return http({
    url: "/certifyFree/editionOne/getPaperPrice",
    method: "post",
    data,
  });
}
/**
 * 拼一版微信小程序买纸和印刷计价
 * @param {{
 *   frontsNumber:'车头数量',
 *   goodsAttr: '商品属性attrStr',
 *   paperOnePrice: '纸张价格:吨/平方',
 *   printPrice:'印刷费用',
 *  }} data 
 * @returns 
 */
export function getPaperAndPrintPrice(data) {
  return http({
    url: "/certifyFree/editionOne/getPaperAndPrintPrice",
    method: "post",
    data,
  });
}

/**
 * 获取纸行列表
 * @param {*} data 
 * @returns 
 */
 export function listAllPaperShop(data) {
  return http({
    url: "/edition/miniEditionPaperShop/listAllPaperShop",
    method: "post",
    data,
  });
}
/**
 * 获取纸张列表
 * @param {*} data 
 * @returns 
 */
 export function listPaperShopPaper(data) {
  return http({
    url: "/edition/miniEditionPaperShop/listPaperShopPaper",
    method: "post",
    data,
  });
}
/**
 * 获取要替换的字符串
 * @param {*} data 
 * @returns 
 */
 export function getFrontPaperMap(data) {
  return http({
    url: "/certifyFree/edition/miniEditionPaper/getFrontPaperMap",
    method: "post",
    data,
  });
}
/**
 * 判断尺寸是否超过提示值
 * @param {*} data 
 * @returns 
 */
export function sizeMax(data) {
  return http({
    url: "/certifyFree/price/sizeMax",
    method: "post",
    data,
  });
}
/**
 * 获取物流信息
 * @param {*} data 
 * @returns 
 */
 export function getShippingTrack(data) {
  return http({
    url: "/order/miniSupplierOrders/getShippingTrack",
    method: "post",
    data,
  });
}



/**
 * 单版订单确认制作文件
 * @param data
 * @returns
 */
 export function sendFile(data) {
  return http({
    url:  '/order/miniSupplierOrders/send',
    method: "post",
    data,
  });
}
/** 拼一版微信小程序3.0整版验证计价接口 */
export function checkPrice(data) {
  return http({
    url: "/certifyFree/editionOne/checkPrice",
    method: "post",
    data,
  });
}
/**
 * 上传专版刀模文件
 * @param {*} data 
 * @returns 
 */
 export function uploadAutoCutting(data) {
  return http({
    url: "/file/uploadAutoCutting",
    method: "post",
    data,
  });
}
/**
 * 上传专版刀模文件
 * @param {*} data 
 * @returns 
 */
 export function uploadAutoCuttingByList(data) {
  return http({
    url: "/file/uploadAutoCuttingByList",
    method: "post",
    data,
  });
}
/**
 * 坑盒信息
 * @param {*} data 
 * @returns 
 */
 export function paperTypeInfo(data) {
  return http({
    url: "/edition/miniEditionPaper/paperType",
    method: "post",
    data,
  });
}
/**
 * 配置接口
 * @param {
 *  secretKey: 密钥,
 *  data: 数据,
 *  status: 1 存 取
 *  key: 检索key 值   空为 自定义工艺配置 1 为自定义工艺是否展示
 * } data 
 * @returns 
 */
 export function getAndSetConfig(data) {
  return http({
    url: "/special/miniCollageParams/getAndSetConfig",
    method: "post",
    data,
  });
}

/**
 * 撤回确认文件
 * @param {*} data 
 * @returns 
 */
 export function cancelConfirmFile(data) {
  return http({
    url: "/order/miniSupplierOrders/cancelConfirmFile",
    method: "post",
    data,
  });
}

/**
 * 报价单保存
 * @param {*} data 
 * @returns 
 */
export function saveEfficiencyParam(data) {
  return http({
    url: "/efficiency/miniEfficiencyParam/saveEfficiencyParam",
    method: "post",
    data,
  });
}

/**
 * 报价单保存2
 * @param {*} data 
 * @returns 
 */
export function saveQuotationOrder(data) {
  return http({
    url: "/quotation/miniQuotationOrder/saveQuotationOrder",
    method: "post",
    data,
  });
}

/**
 * 报价单列表
 * @param {*} data 
 * @returns 
 */
export function getUserPageList(data) {
  return http({
    url: "/quotation/miniQuotationOrder/getUserPageList",
    method: "post",
    data,
  });
}

/**
 * 报价单信息
 * @param {*} data 
 * @returns 
 */
 export function getQuotationInfo(data) {
  return http({
    url: "/quotation/miniQuotationOrder/getById",
    method: "post",
    data,
  });
}

