// 日期格式化
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * 月份有多少天
 * @param {*} year 
 * @param {*} month 
 * @returns 
 */
export function daysInMonth(year, month) {
  if (month == 1) {
    if (year % 4 == 0 && year % 100 != 0)
      return 29;
    else
      return 28;
  } else if ((month <= 6 && month % 2 == 0) || (month = 6 && month % 2 == 1))
    return 31;
  else
    return 30;
};

/**
 * 日期增加月份
 * @param {*} num  要改变的月份数
 * @returns 
 */
export function addMonth(date, num) {
  var y = date.getFullYear();
  var m = date.getMonth();
  var nextY = y;
  var nextM = m;
  //如果当前月+要加上的月>11 这里之所以用11是因为 js的月份从0开始
  if ((m + num) > 11) {
    nextY = y + 1;
    nextM = parseInt(m + num) - 12;
  } else {
    nextM = date.getMonth() + num
  }
  var daysInNextMonth = daysInMonth(nextY, nextM);
  var day = date.getDate();
  if (day > daysInNextMonth) {
    day = daysInNextMonth;
  }
  return new Date(nextY, nextM, day);
};


/**
 * 保留2位小数（小数位有几位就显示几位，最多保留2位小数）
 * @param {*} num 
 * @returns 
 */
export function numberFixed2(num) {
  if (isFinite(num)) {
    return parseFloat(num.toFixed(2))
  } else {
    return num
  }
}

/**
 * 完善图片前缀
 * @param {*} imgUrl 
 * @returns 
 */
export function improveImgUrl(imgUrl){
  return imgUrl && imgUrl.indexOf('https:')==-1 && `https://alifile.xiaocaiyin.com/${imgUrl}` ||imgUrl
}

/**
 *  裁剪内容为数字
 * （ ！！！注意！！！
 *  这个方法用于输入框正在输入字符的场景，不会切掉尾部的小数点！
 *  原因：因为用户输入小数点后可能继续还会输入小数位，所以不能一刀切掉。
 *  解决办法：请在输入框离开焦点时使用trimNumber(value)函数来修复
 * @param {*} value 
 * @param {*} intLength 整数位长度
 * @param {*} digitLength 小数位长度
 * @param {*} negative 支持负数
 * @returns 
 */
export function trimToNumber(value, intLength = 9, digitLength = 2, negative = false) {
  if (!Number.isInteger(intLength)) {
    throw new Error("util.js中的trimToNumber(...)，参数intLength必须为数字")
  }
  if (!Number.isInteger(digitLength)) {
    throw new Error("util.js中的trimToNumber(...)，参数digitLength必须为数字")
  }
  //console.log(1111,value)
  // 去除负号
  if (!negative) {
    value = value.replace(/\-/g, "")
  }
  // 先把非数字的都替换掉（除了数字和小数点）
  value = value.replace(/[^\d\.\-]/g, "")
  // 去除开头的小数点
  value = value.replace(/^\.+/, '')
  // 去除多余的的负号(首位的负号不去除)
  value = value.replace(/^\-/, '#').replace(/\-/g, '').replace('#', '-')
  // 如果是0开头多位整数部分，截取开头的0
  value = value.replace(/^(\-?)0+(\d.*)$/, '$1$2')
  //console.log(2222,value)
  const isLessThenOne = /^\-?0/.test(value) //0开头是小数
  if (isLessThenOne) {
    //保留小数位
    var reg = new RegExp(`^(\\-?\\d+)\\.(\\d{0,${digitLength}}).*$`);
    value = value.replace(reg, '$1.$2');
    //console.log(333,value)
  } else {
    //保留整数位+保留小数位
    var reg = new RegExp(`^(\\-?\\d{1,${intLength}})\\d*(\\.\\d{0,${digitLength}})?.*$`);
    value = value.replace(reg, (match, key1, key2) => {
      return `${key1}${key2 || ''}`
    });
    //console.log(4444,value)
  }
  return value
}

/**
 * 去除字符串尾部的小数点
 * @param {*} value 
 * @returns 
 */
export function trimLastDigit(value) {
  return ((value || '') + '').replace(/\.+$/, '')
}

/**
 * 为数字字符设置默认值（比如0，或者 --）
 * @param {*} value 
 * @param {*} defaultValue 
 * @returns 
 */
export function defaultZero(value, defaultValue = '0.00') {
  let finalValue = Number.parseFloat(value);
  return Number.isNaN(finalValue) ? defaultValue :finalValue.toFixed(2);
}
