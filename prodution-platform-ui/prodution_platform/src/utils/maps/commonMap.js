export const sortByLetterMap = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
  5: "E",
  6: "F",
  7: "G",
  8: "H",
  9: "I",
  10: "J",
  11: "K",
  12: "L",
  13: "M",
  14: "N",
  15: "O",
  16: "P",
  17: "Q",
  18: "R",
  19: "S",
  20: "T",
  21: "U",
  22: "V",
  23: "W",
  24: "X",
  25: "Y",
  26: "Z",
};

//unitPriceUnit	单价单位 1.元/平方米,2.元/个,3.分/个
// numberType :1 整数，2小数
const machineAdjustCost = {title:'基础调机费',key:'machineAdjustCost'}
const modNum = {title:'基础模数',key:'modNum',numberType:1}
const machineAdjustPrice =  {title:'调机费单价(元)',key:'machineAdjustPrice'}
const pieceUnitPrice = {title:'单价(元/张)',key:'pieceUnitPrice'}
const lowestConsume = {title:'最低消费(元)',key:'lowestConsume'}
const attributeIds = {
  2:[lowestConsume,{title:'单价(元/平方米)',key:'unitPrice',unitPriceUnit:1}],//覆膜
  3:[lowestConsume,pieceUnitPrice,{title:'单价(元/平方米)',key:'unitPrice',unitPriceUnit:1}],//过油
  4:[lowestConsume,machineAdjustCost,modNum,machineAdjustPrice,pieceUnitPrice],//模切
  5:[lowestConsume,{title:'单价(元/个)',key:'unitPrice',unitPriceUnit:2}],//粘盒
  6:[lowestConsume,pieceUnitPrice],//烫金
  7:[lowestConsume,machineAdjustCost,modNum,machineAdjustPrice,pieceUnitPrice],//击凸
  8:[lowestConsume,machineAdjustCost,modNum,machineAdjustPrice,pieceUnitPrice],//击凹
  10:[{title:'调机费',key:'machineAdjustCost'},{title:'单价(分/个)',key:'unitPrice',unitPriceUnit:3}],//贴窗
  11:[lowestConsume,pieceUnitPrice,{title:'单价(元/平方米)',key:'unitPrice',unitPriceUnit:1}],//对裱卡纸
  28:[lowestConsume,pieceUnitPrice,{title:'单价(元/平方米)',key:'unitPrice',unitPriceUnit:1}]//对裱坑纸
}
export const attributeIdHeader = (id) =>{
  return attributeIds[id] || [{title:'单价(元/平方米)',key:'unitPrice',unitPriceUnit:1}]
}
/**
 * 通过工艺id获取当前工艺计费规则需要展示的字段
 */

export default {
  sortByLetterMap
};
