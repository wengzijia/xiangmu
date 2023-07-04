// 最低数量
var lessNum = 100;

export function getLessNum(that) {
  console.log('that.goodsTag', that.goodsId);
  if (that.goodsTag == '18') {
    lessNum = 100;
  } else if (that.goodsTag == '6') {
    lessNum = 20;
  } else if (that.goodsTag == '5' || that.goodsTag == '17') {
    lessNum = 1000;
  } else if (that.goodsTag == '19') {
    lessNum = 1;
  } else if (that.goodsTag == '10') {
    lessNum = 5000;
  } else if (that.goodsId == 937 || that.goodsId == 958) {
    lessNum = 1;
  }
  return lessNum;
}
