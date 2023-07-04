/**
 * 向下截取数字小数位
 * @param {*} value 
 * @param {*} digitLength 小数位个数
 * @returns 
 */
export function numberFloor(value, digitLength = 2) {
    let finalValue = Number.parseFloat(value);
    let multiple   = Math.pow(10, digitLength);
    let result = Number.isNaN(finalValue) ? 0 : Math.floor((finalValue*multiple))/multiple;
    console.log('aaa',finalValue,multiple,result)
    return result
  }