export function encodingMobile(str) {
  if (str.length > 7) {
    return str.substring(0, 3) + '****' + str.substring(7);
  } else {
    return str.substring(0, 3) + '****';
  }
}
export function startWith(str, startStr) {
  if (str === startStr) {
    return true;
  }
  if (str.length > startStr.length) {
    const tempStr = str.substring(0, startStr.length);
    return tempStr === startStr;
  }
  return false;
}
export function endWith(str, endStr) {
  if (str === endStr) {
    return true;
  }
  if (str.length > endStr.length) {
    const tempStr = str.substring(str.length - endStr.length);
    return tempStr === endStr;
  }
  return false;
}

/**
 * 判断字符串是否相等,将传入参数转换字符串在比较
 * @param str1
 * @param str2
 * @returns {boolean}
 */
export function strEquals(str1, str2) {
  if (str1 === null || str2 === null) {
    return false;
  }
  if (str1 + '' === str2 + '') {
    return true;
  }
  return false;
}

/**
 * 计算json对象长度
 * @param str1
 * @returns {boolean}
 */
export function strJsonLength(str1) {
  var length = 0;
  for (var ever in str1) {
    length++;
  }
  return length;
}
