/**
 * 金额相关相关数据
 */
export default {
  data() {
    return {};
  },
  computed: {
    // 余额支付已支付
    activeBalancePay: function() {
      if (this.checked) {
        if (this.money > this.userInfo.userMoney) {
          return this.userInfo.userMoney;
        } else {
          return this.money;
        }
      }
      return '0';
    },
    // 订单金额
    activeMoney: function() {
      let balance = this.paytype;
      let totalMoney = this.money;
      if (balance != undefined && balance == 'balance' && totalMoney >= this.userInfo.userMoney) {
        totalMoney -= this.userInfo.userMoney;
      }
      return totalMoney;
    },
    //用户余额
    activeUserMoney: function() {
      let user = this.userInfo;
      if (user) {
        return user.userMoney;
      }
      return '0.00';
    }
  }
};
