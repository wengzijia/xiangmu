/**
 * 判断对象中的属性是否都为空
 * @param {Object} obj
 */
export function objectElmentEmpty(obj) {
  // debugger;
  if (obj == null || obj == '' || obj == undefined) {
    return true;
  }
  // debugger;
  for (let vo of Object.values(obj)) {
    if (vo != undefined && vo != null && vo != '') {
      for (let i of Object.values(vo)) {
        if (i != undefined && i != null && i != '') {
          return false;
        }
      }
    }
  }
  return true;
}

export function replaceAll(str, nSymobls, oSymbols) {
  if (str == undefined || str == null || str == '') {
    return '';
  }
  let ls = str.split(nSymobls);
  let newStr = '';
  for (let i = 0; i < ls.length; i++) {
    if (i < ls.length - 1) {
      newStr += ls[i] + oSymbols;
    } else {
      newStr += ls[i];
    }
  }
  return newStr;
}

/**
 * 空处理
 */
export function objectEmpty(obj) {
  if (obj === undefined || obj === null) {
    return '';
  }
  return obj;
}

/**
 * 对象中的undefined和null进行空对象赋值
 * @param {Object} obj
 */
export function handleUndefineNullObj(obj) {
  for (let _index in obj) {
    let _val = obj[_index];
    if (typeof _val == 'object') {
      handleUndefineNullObj(_val);
    } else {
      if (_val == undefined || _val == null) {
        obj[_index] = '';
      }
    }
  }
}
