/**
 * 支付以及花呗相关数据
 */
export default {
  data() {
    return {
      huabeiRates: [
        { times: 3, rates: 0.025 },
        { times: 6, rates: 0.045 },
        { times: 12, rates: 0.088 }
      ]
    };
  },
  computed: {
    // 大于10元支持花呗支付
    activeStagesShow: function() {
      if (this.money < 10) {
        return false;
      } else {
        return true;
      }
    },
    // 余额支付已支付
    activeBalancePay: function() {
      if (this.checked) {
        if (this.money > this.userInfo.userMoney) {
          return this.userInfo.userMoney;
        } else {
          return this.moeny;
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
    // 花呗计算分期 3 6 12 期
    activeStages: function() {
      let stagesMoney = this.money;
      if (this.checked && this.money > this.userInfo.userMoney) {
        stagesMoney = this.money - this.userInfo.userMoney;
      }
      let data = [];
      for (let i of this.huabeiRates) {
        // 单期手续费为 费率 * (总金 / 分期数)
        let stagMoney = stagesMoney / i.times;
        let fee = i.rates * stagMoney;
        // 总手续费
        let totalFee = fee * i.times;
        // 总费用
        let totalMoney = totalFee + stagesMoney;
        // 分期当期费用
        let tempCapitalOne = fee + stagMoney;
        // 取小数2位
        let tempVal = parseFloat(fee).toFixed(2);
        fee = tempVal;
        // ----------------
        tempVal = parseFloat(tempCapitalOne).toFixed(2);
        tempCapitalOne = tempVal;
        // ---------
        tempVal = parseFloat(totalFee).toFixed(2);
        totalFee = tempVal;
        // ---------
        tempVal = parseFloat(totalMoney).toFixed(2);
        totalMoney = tempVal;
        let stag = {
          times: i.times,
          capitalOne: tempCapitalOne,
          handlingFee: fee,
          moneyTotal: totalMoney,
          totalFee: totalFee
        };
        data.push(stag);
      }
      // console.log(data);
      return data;
    },
    // 计算花呗总额
    activeStagesMoney: function() {
      return this.activeStages[this.curStages].capitalOne;
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
