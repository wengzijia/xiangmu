const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`;
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : `0${n}`;
};

/**
 * 函数节流
 * @param {*} fn
 * @param {*} interval
 * @returns
 */
function throttle(fn, interval) {
  var enterTime = 0; //触发的时间
  var gapTime = interval || 300; //间隔时间，如果interval不传，则默认300ms
  return function () {
    var context = this;
    var backTime = new Date(); //第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime; //赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

/**
 * 函数防抖
 * @param {*} fn
 * @param {*} interval
 * @returns
 */
function debounce(fn, interval) {
  var timer;
  var gapTime = interval || 1000; //间隔时间，如果interval不传，则默认1000ms
  return function () {
    clearTimeout(timer);
    var context = this;
    var args = arguments; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    // console.log('args',args)
    timer = setTimeout(function () {
      fn.call(context, ...args);
    }, gapTime);
  };
}

/** 生成UID */
function getUid() {
  return '9xxxyxxxxxxxxxxyxxxx'
    .replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v;
    })
    .slice(0, 9);
}

function setdecimal(num) {
  return (Math.floor(Number(num) * 100) / 100).toFixed(2);
}
/** 判断最短货期 */
const diffTime = (val, num, goodsAttr, cateId) => {
  let newObj = {};
  goodsAttr.split(';').map(e => {
    let ar = [];
    ar = e.split(':');
    newObj[ar[0]] = ar[1];
  });
  let length = newObj['成品尺寸']?.split('_')[0] || 0;
  let width = newObj['成品尺寸']?.split('_')[1] || 0;
  let ips = newObj['纸张材质'];
  let ty = newObj['品类'];
  let time = 1;
  if (val == 4) {
    // 5天货期 独立存在 直接跳出
    time = 4;
  } else if (val == 3) {
    // 牛皮纸 最小的货期 直接跳出
    time = 3;
  } else if (ips && ips.indexOf('牛') != -1 && cateId == 1 && num < 10000 && ((length < 785 && width < 545) || (length < 545 && width < 785))) {
    // 是否满足牛皮纸
    time = 3;
  } else if (val == 0 || (cateId == 1 && num < 10000)) {
    // 正常货期
    time = 0;
  } else {
    // 延长货期
    time = 1;
  }
  if (ty && ty.indexOf('吊牌') != -1) {
    // 如果是吊牌则
    time = 0;
  }

  return time;
};

// 获取文件名称
function getFileName(name) {
  if (name.lastIndexOf("/") > -1) {
    return name.slice(name.lastIndexOf("/") + 1);
  } else {
    return name;
  }
}

module.exports = {
  throttle,
  debounce,
  getUid,
  formatTime,
  setdecimal,
  diffTime,
  getFileName
};
