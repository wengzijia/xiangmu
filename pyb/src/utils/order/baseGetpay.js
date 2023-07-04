var _that = {};
var func = {};
export function init(__that, funcs) {
  _that = __that;
  func = funcs;
}

export function isPayType() {
  if (_that.paytype === 'balance') {
    _that.checked = true;
    _that.balancePayPage();
  } else {
    _that.getAlipayQrCode();
    _that.getWxpayQrCode();
    _that.getBaseInfo();
  }
}
export function getBaseInfo() {
  _that.getUserInfo();
  _that.getOrderMoney();
}
export function getAlipayQrCode() {
  let data = { id: 0, orderNo: _that.orderNo == undefined ? 0 : _that.orderNo, payType: 'alipay' };
  func
    .getNowPayQrCode(data)
    .then(res => {
      _that.alicode = res.data;
    })
    .catch(error => {
      _that.$message({ type: 'error', message: error.message });
      _that.$router.go(-1);
    });
}
export function getWxpayQrCode() {
  let data = { id: 0, orderNo: _that.orderNo == undefined ? 0 : _that.orderNo, payType: 'wxpay' };
  func
    .getNowPayQrCode(data)
    .then(res => {
      _that.wxcode = res.data;
      // console.log(res.data);
    })
    .catch(error => {
      _that.$message({ type: 'error', message: error.message });
      _that.$router.go(-1);
    });
}
export function getHuaBei(num) {
  let data = { hbFqNum: num, id: 0, orderNo: _that.orderNo == undefined ? 0 : _that.orderNo, payType: 'huabei' };
  func
    .getNowPayQrCode(data)
    .then(res => {
      if (res.code === '000000') {
        _that.huabei = res.data;
        _that.hasAlipayStages = true;
      }
    })
    .catch(error => {
      _that.$message({ type: 'error', message: error.message });
      _that.hasAlipayStages = false;
      // _that.$router.go(-1);
    });
}
export function toOrderCenter() {
  _that.$router.push('/user/demandlist');
}
export function changeCurr(item, index) {
  _that.curStages = index;
  _that.curStagesInfo = item;
}
export function handleClose() {
  _that.hasAlipayStages = false;
}
export function stagesPayDialog(num) {
  if (_that.paytype === 'balance') {
    _that.balancePayAndHuaBei(num);
  } else {
    _that.getHuaBei(num);
  }
}
export function getUserInfo() {
  func.getUser().then(res => {
    _that.$set(_that, 'userInfo', res.data);
  });
}
export function getOrderMoney() {
  func.getOrder({ data: _that.orderNo }).then(res => {
    console.log(res);
    if (res.code === '000000') {
      _that.money = res.data.amount;
    }
  });
}
// 定时器查询订单状态
export function getOrderInfo() {
  func.getOrder({ data: _that.orderNo }).then(res => {
    if (res.code === '000000') {
      // console.log(res);
      if (res.data.isPay == 1) {
        _that.$message({ type: 'success', message: '支付成功' });
        clearInterval(_that.timer);
        let data = { orderNo: _that.orderNo, type: 1 };
        sessionStorage.setItem('orderCache', JSON.stringify(data));
        _that.$router.push({ path: '/order/getfile' });
      }
    }
  });
}
// 使用余额支付
export function useUserMoney() {
  if (_that.userInfo.userMoney > 0) {
    if (_that.checked === true) {
      _that
        .$confirm(`您将使用余额支付${_that.userInfo.userMoney}元`, '支付提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          _that.$router.push({ path: '/service/getcylpay', query: { orderNo: _that.orderNo, paytype: 'balance' } });
          _that.paytype = 'balance';
          _that.isPayType();
        })
        .catch(() => {
          _that.checked = false;
        });
    } else {
      _that.$router.push({ path: '/service/getcylpay', query: { orderNo: _that.orderNo, paytype: 'normal' } });
      _that.paytype = 'normal';
      _that.isPayType();
    }
  }
}
// 余额支付页面刷新
export function balancePayPage() {
  // debugger;
  _that.getOrderInfo();
  // 支付二维码
  func
    .balancePay({ id: 0, orderNo: _that.orderNo == undefined ? 0 : _that.orderNo, payType: 'alipay', isBalance: true })
    .then(res => {
      if (res.code === '000000') {
        if (res.data != '0') {
          _that.alicode = res.data;
        }
      } else {
        _that.$message({ type: 'error', message: res.message });
      }
      _that.getBaseInfo();
    })
    .catch(error => {
      _that.$message({ type: 'error', message: error.message });
    });
  // 微信二维码
  func
    .balancePay({ id: 0, orderNo: _that.orderNo == undefined ? 0 : _that.orderNo, payType: 'wxpay', isBalance: true })
    .then(res => {
      if (res.code === '000000') {
        if (res.data != '0') {
          _that.wxcode = res.data;
        }
      } else {
        _that.$message({ type: 'error', message: res.message });
      }
      _that.getBaseInfo();
    })
    .catch(error => {
      _that.$message({ type: 'error', message: error.message });
    });
}
// 余额支付 + 花呗分期
export function balancePayAndHuaBei(num) {
  func
    .balancePay({ hbFqNum: num, id: 0, orderNo: _that.orderNo == undefined ? 0 : _that.orderNo, payType: 'huabei', isBalance: true })
    .then(res => {
      if (res.code === '000000') {
        _that.huabei = res.data;
      } else {
        _that.$message({ type: 'error', message: res.message });
      }
      _that.getBaseInfo();
    })
    .catch(error => {
      _that.$message({ type: 'error', message: error.message });
    });
}
