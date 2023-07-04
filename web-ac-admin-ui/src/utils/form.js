// 多个表单的校验
export function validateForms(formRefs) {
  let objectList = [];
  let results = formRefs.map(formRef =>
    new Promise((resolve, reject) => {
      formRef.validate((valid, object) => {
        if (valid) {
          resolve();
        } else {
          objectList.push(object);
          reject();
        }
      });
    })
  )
  return Promise.all(results).catch(() => {
    return Promise.reject(objectList);
  });
}
// 手机号码和电话号码（座机号）正则校验
export function checkPhone(mobile) {
  // var tel = /^0\d{2,3}-?\d{7,8}$/;
  var tel = /0\d{2,3}-\d{5,8}/;
  var phone = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/; 
  // var phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
  if(mobile.indexOf("-") == -1){//手机号码
    return phone.test(mobile);
  }else{//电话号码
    return tel.test(mobile)
  }
}
/**
 * 函数防抖
 * @param {*} fn
 * @param {*} interval
 * @returns
 */
 export function debounce(fn, interval) {
  var timer;
  var gapTime = interval || 1000; //间隔时间，如果interval不传，则默认1000ms
  return function() {
    clearTimeout(timer);
    var context = this;
    var args = arguments; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    // console.log('args',args)
    timer = setTimeout(function() {
      fn.call(context, ...args);
    }, gapTime);
  };
}

