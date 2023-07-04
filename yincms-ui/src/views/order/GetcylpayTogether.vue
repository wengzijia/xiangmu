<template>
  <el-container style="margin-bottom:30px">
    <el-main>
      <div class="catbj">
        <!--content start-->
        <div class="container clear">
          <div class="payWapper">
            <div class="payWstart" style="margin-top: 50px">
              <span class="payWicon icon icon-checkm"></span>
              <div class="payWsTxt">
                <h3>订单提交成功！请尽快支付！</h3>
                <p class="payWsTxt_p">
                  共1张订单，<router-link to="/user/orderlist">订单中心</router-link>。<span class="gree">请在当天内完成支付</span>，待支付：<span class="red">{{ '￥' + activeMoney }}</span>
                </p>
              </div>
            </div>
            <div class="modeWapper" style="margin: 50px auto">
              <el-tabs type="border-card" v-model="tabsValue" @tab-click="tabClick">
                <el-tab-pane name="alipay">
                  <span slot="label" style="color:black"> 支付宝支付</span>
                  <div class="zfbDiv" style="height: 500px;">
                    <div class="payMoneyCss">
                      应付款金额：<span class="red" style="font-size: 22px;">￥{{ activeMoney }}</span>
                    </div>
                    <div class="payImg">
                      <img :class="isCodeLayer ? 'payImgCode' : ''" :src="'data:image/png;base64, ' + alicode" />
                      <p class="refresh" v-show="isCodeLayer" @click="refreshCode()"><span class="el-icon-refresh"></span></p>
                    </div>
                    <div class="alipayDiv">
                      <p><img style="width:25px;height:25px" src="@/static/index/img/alipay.png" alt="" /> 支付宝扫码付款</p>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="花呗支付" name="huabei">
                  <span slot="label" style="color:black">花呗支付</span>
                  <div style="height: 500px">
                    <div v-show="activeStagesShow" style="margin-top:30px">
                      <ul class="hbeiBoxUl stagesPays">
                        <li v-for="(item, index) in activeStages" :key="index" :class="curStages == index ? 'curr' : ''" @click="changeCurr(item, index)">
                          <div class="hbeiliDv">
                            <div class="stageTx">
                              <span class="red">{{ item.times }}</span
                              >期
                            </div>
                            <div class="hbeiRtxt">
                              <p>分期价</p>
                              <p>
                                ￥<span class="red">{{ item.capitalOne }}</span
                                >x{{ item.times }}
                              </p>
                              <p class="C9">{{ item.capitalOne }}元/期</p>
                            </div>
                          </div>
                          <p class="hbeiTotal">总计：￥{{ item.moneyTotal }}</p>
                        </li>
                      </ul>
                      <div class="hbeiBot"><span class="hbeiBnt stagesPay" @click="stagesPayDialog(huabeiRates[curStages].times)">立即支付</span></div>
                    </div>
                    <div v-show="!activeStagesShow">
                      <li class="nopaytips">该金额不支持花呗分期</li>
                    </div>
                  </div>
                  <el-dialog title="花呗支付" :visible.sync="hasAlipayStages" width="40%" :before-close="handleClose">
                    <div class="zfbDiv" style="height: 500px;">
                      <div class="payMoneyCss">
                        应付款金额：<span class="red" style="font-size: 22px;">￥{{ activeMoney }}</span>
                      </div>
                      <div class="payImg">
                        <img :class="isCodeLayer ? 'payImgCode' : ''" :src="'data:image/png;base64, ' + huabei" />
                        <p class="refresh" v-show="isCodeLayer" @click="refreshCode()"><span class="el-icon-refresh"></span></p>
                      </div>
                      <div class="alipayDiv">
                        <p><img style="width:25px;height:25px" src="@/static/index/img/alipay.png" alt="" /> 支付宝扫码付款</p>
                      </div>
                    </div>
                  </el-dialog>
                </el-tab-pane>
                <el-tab-pane label="微信支付" name="wxpay">
                  <span slot="label" style="color:black">微信支付</span>
                  <div style="height: 500px">
                    <div class="payMoneyCss">
                      应付款金额：<span class="red" style="font-size: 22px;">￥{{ activeMoney }}</span>
                    </div>
                    <div class="payImg">
                      <img :class="isCodeLayer ? 'payImgCode' : ''" :src="'data:image/png;base64, ' + wxcode" />
                      <p class="refresh" v-show="isCodeLayer" @click="refreshCode()"><span class="el-icon-refresh"></span></p>
                    </div>
                    <div class="alipayDiv">
                      <p><img style="width:25px;height:25px" src="@/static/index/img/wxpay.png" alt="" /> 微信扫码付款</p>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { createPayQrCode, getOrderByOrderNo } from '@/api/order/orderTogetherApi';
import { getUserInfo as getUser } from '@/api/users/userApi.js';
import huabei from './mixins/huabei';
import refreshCode from './mixins/refreshCode';
export default {
  name: 'component_name',
  mixins: [huabei, refreshCode],
  computed: {
    // activeStagesShow: function() {
    //   if (this.money < 10) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // }
    // // 订单金额
    // activeMoney: function() {
    //   let balance = this.paytype;
    //   let totalMoney = this.money;
    //   if (balance != undefined && balance == 'balance' && totalMoney >= this.userInfo.userMoney) {
    //     totalMoney -= this.userInfo.userMoney;
    //   }
    //   return totalMoney;
    // },
    // // 花呗计算分期 3 6 12 期
    // activeStages: function() {
    //   let stagesMoney = this.money;
    //   let data = [];
    //   for (let i of this.huabeiRates) {
    //     // 单期手续费为 费率 * (总金 / 分期数)
    //     let stagMoney = stagesMoney / i.times;
    //     let fee = i.rates * stagMoney;
    //     // 总手续费
    //     let totalFee = fee * i.times;
    //     // 总费用
    //     let totalMoney = totalFee + stagesMoney;
    //     // 分期当期费用
    //     let tempCapitalOne = fee + stagMoney;
    //     // 取小数2位
    //     let tempVal = parseFloat(fee).toFixed(2);
    //     fee = tempVal;
    //     // ----------------
    //     tempVal = parseFloat(tempCapitalOne).toFixed(2);
    //     tempCapitalOne = tempVal;
    //     // ---------
    //     tempVal = parseFloat(totalFee).toFixed(2);
    //     totalFee = tempVal;
    //     // ---------
    //     tempVal = parseFloat(totalMoney).toFixed(2);
    //     totalMoney = tempVal;
    //     let stag = {
    //       times: i.times,
    //       capitalOne: tempCapitalOne,
    //       handlingFee: fee,
    //       moneyTotal: totalMoney,
    //       totalFee: totalFee
    //     };
    //     data.push(stag);
    //   }
    //   // console.log(data);
    //   return data;
    // },
    // // 计算花呗总额
    // activeStagesMoney: function() {
    //   return this.activeStages[this.curStages].capitalOne;
    // }
  },
  data() {
    return {
      alicode: '',
      wxcode: '',
      money: '',
      orderNo: '',
      huabei: '',
      tabsValue: 'alipay',
      // huabeiRates: [
      //   { times: 3, rates: 0.025 },
      //   { times: 6, rates: 0.045 },
      //   { times: 12, rates: 0.088 }
      // ],
      stages: [],
      curStages: 0,
      curStagesInfo: {},
      hasAlipayStages: false,
      // 是否勾选余额支付
      checked: false,
      // 用户信息
      userInfo: {},
      // 定时器
      timer: '',
      paytype: '',
      // 已支付金额
      useBalance: '0.00',
      aliTimer: null,
      isCodeLayer: false //二维码刷新
    };
  },
  async created() {
    this.orderNo = this.$route.query.orderNo;
    this.paytype = this.$route.query.paytype != undefined ? this.$route.query.paytype : '';
    this.getUserInfo();
  },
  beforeDestroy() {
    //清除定时器
    clearTimeout(this.timer);
    clearTimeout(this.aliTimer);
  },
  methods: {
    // //刷新支付二维码
    // refreshCode() {
    //   // 当在http页面，大于10块不展示二维码，https正常展示
    //   if(!(new RegExp('https')).test(window.location.origin)&&this.activeMoney>10){
    //     this.isCodeLayer = true;
    //     return
    //   }
    //   this.isCodeLayer = false;
    //   this.stopPolling();
    // },
    // // 5分钟后二维码失效，停止轮询，刷新继续
    // stopPolling() {
    //   let _this = this;
    //   clearTimeout(this.aliTimer);
    //   _this.getOrderInfo();
    //   _this.aliTimer = setTimeout(() => {
    //     _this.isCodeLayer = true;
    //   }, 1000*300);
    // },
    /**
     * tab选项，选择支付类型（支付宝，微信，花呗）
     */
    tabClick() {
      let _this = this;
      let code = {
        alipay: 'alicode',
        wxpay: 'wxcode',
        huabei: 'huabei'
      };
      if (_this.paytype === 'balance') {
        _this.checked = true;
        if (!_this[code[_this.tabsValue]] && _this.tabsValue != 'huabei') {
          // _this.getBalancePayCode();
          console.log(_this.checked);
        }
      } else {
        if (!_this[code[_this.tabsValue]] && _this.tabsValue != 'huabei') {
          _this.getPayCode();
        }
      }
      this.refreshCode();
    },
    /**
     *判断是否使用余额支付
     */
    isPayType() {
      if (this.paytype === 'balance') {
        this.checked = true;
        // this.getBalancePayCode();
      } else {
        this.getPayCode();
      }
    },
    // getBaseInfo() {
    //   this.getOrderMoney();
    // },
    /**
     * 余额+支付
     */
    // getBalancePayCode() {
    //   let _this = this;
    //   let code = {
    //     alipay: 'alicode',
    //     wxpay: 'wxcode',
    //     huabei: 'huabei'
    //   };
    //   /** 提交的数据 */
    //   let data = { id: 0, orderNo: _this.orderNo == undefined ? 0 : _this.orderNo, payType: _this.tabsValue, isBalance: true };
    //   if (_this.tabsValue == 'huabei') {
    //     //判断是否是花呗支付，添加花呗分期值
    //     data.hbFqNum = _this.huabeiRates[_this.curStages].times;
    //   }
    //   balancePay(data)
    //     .then(res => {
    //       // debugger;
    //       if (res.code === '000000') {
    //         if (res.data != '0') {
    //           _this[code[_this.tabsValue]] = res.data;
    //           if (_this.tabsValue == 'huabei') {
    //             _this.hasAlipayStages = true;
    //           }
    //           _this.getOrderInfo();
    //         } else {
    //           _this.paySuccess();
    //         }
    //       } else {
    //         _this.$message({ type: 'error', message: res.message });
    //       }
    //     })
    //     .catch(error => {
    //       _this.$message({ type: 'error', message: error.message });
    //     });
    // },
    /**
     * 获取支付二维码
     */
    getPayCode() {
      let _this = this;
      /** 提交的数据 */
      let data = { id: 0, orderNo: this.orderNo == undefined ? 0 : this.orderNo, payType: _this.tabsValue };
      let code = {
        alipay: 'alicode',
        wxpay: 'wxcode',
        huabei: 'huabei'
      };
      if (_this.tabsValue == 'huabei') {
        //判断是否是花呗支付，添加花呗分期值
        data.hbFqNum = _this.huabeiRates[_this.curStages].times;
      }
      createPayQrCode(data)
        .then(res => {
          if (res.success) {
            _this[code[_this.tabsValue]] = res.data;
            if (_this.tabsValue == 'huabei') {
              _this.hasAlipayStages = true;
            }
            _this.getOrderInfo();
          } else {
            _this.$message({ type: 'error', message: res.message });
          }
        })
        .catch(error => {
          _this.$message({ type: 'error', message: error.message });
          _this.hasAlipayStages = false;
          // this.$router.go(-1);
        });
    },
    // getAlipayQrCode() {
    //   let data = { id: 0, orderNo: this.orderNo == undefined ? 0 : this.orderNo, payType: 'alipay' };
    //   createPayQrCode(data)
    //     .then(res => {
    //       this.alicode = res.data;
    //     })
    //     .catch(error => {
    //       this.$message({ type: 'error', message: error.message });
    //       // this.$router.go(-1);
    //     });
    // },
    // getWxpayQrCode() {
    //   let data = { id: 0, orderNo: this.orderNo == undefined ? 0 : this.orderNo, payType: 'wxpay' };
    //   createPayQrCode(data)
    //     .then(res => {
    //       this.wxcode = res.data;
    //       // console.log(res.data);
    //     })
    //     .catch(error => {
    //       this.$message({ type: 'error', message: error.message });
    //       // this.$router.go(-1);
    //     });
    // },
    // getHuaBei(num) {
    //   let data = { hbFqNum: num, id: 0, orderNo: this.orderNo == undefined ? 0 : this.orderNo, payType: 'huabei' };
    //   createPayQrCode(data)
    //     .then(res => {
    //       if (res.code === '000000') {
    //         this.huabei = res.data;
    //         this.hasAlipayStages = true;
    //       }
    //     })
    //     .catch(error => {
    //       this.$message({ type: 'error', message: error.message });
    //       this.hasAlipayStages = false;
    //       // this.$router.go(-1);
    //     });
    // },
    toOrderCenter() {
      this.$router.push('/user/orderlist');
    },
    changeCurr(item, index) {
      this.curStages = index;
      this.curStagesInfo = item;
    },
    handleClose() {
      this.hasAlipayStages = false;
    },
    /**
     * 确认是否选中余额支付弹框
     */
    stagesPayDialog(num) {
      if (this.paytype === 'balance') {
        // this.balancePayAndHuaBei(num);
        // this.getBalancePayCode(num);
        console.log(num);
      } else {
        // this.getHuaBei(num);
        this.getPayCode(num);
      }
    },
    getUserInfo() {
      getUser().then(res => {
        this.$set(this, 'userInfo', res.data);
        this.getOrderMoney();
      });
    },
    getOrderMoney() {
      let _this = this;
      getOrderByOrderNo({ data: this.orderNo })
        .then(res => {
          if (res.code === '000000') {
            this.money = res.data.amount;
            if (res.data.status == 'paid') {
              _this.paySuccess();
            } else {
              _this.tabClick();
            }
          }
        })
        .catch(() => {
          this.$router.push({ path: '/user/orderlist' });
        });
    },
    // 定时器查询订单状态
    getOrderInfo() {
      let _this = this;
      getOrderByOrderNo({ data: this.orderNo })
        .then(res => {
          if (res.code === '000000') {
            if (res.data.status == 'paid') {
              this.paySuccess();
            } else {
              clearTimeout(_this.timer);
              if (_this.isCodeLayer) return;
              _this.timer = setTimeout(_this.getOrderInfo, 1000);
            }
          } else {
            _this.$message.error(res.message);
          }
        })
        .catch(() => {
          this.$router.push({ path: '/user/orderlist' });
        });
    },
    // 支付成功
    paySuccess() {
      this.$message({ type: 'success', message: '支付成功' });
      clearTimeout(this.timer);
      let data = { orderNo: this.orderNo };
      this.$router.push({ path: '/user/orderlist' });
    }
  }
};
</script>
<style scoped>
.payImgCode {
  filter: blur(5px);
}
.payImg {
  position: relative;
  user-select: none;
}
.payImg .refresh {
  width: 217px;
  height: 217px;
  line-height: 217px;
  text-align: center;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  font-size: 30px;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  /* background: rgba(0, 0, 0, 0.6); */
}
.yueBoxs {
  border: 1px solid #efefef;
  line-height: 48px;
  height: 48px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 12px;
}
.payMoneyCss {
  margin: auto;
  width: 100%;
  font-size: 16px;
  text-align: center;
  padding: 80px 0 40px;
}
.alipayDiv {
  margin: auto;
  width: 100%;
  font-size: 14px;
  text-align: center;
  padding: 10px 0 40px;
}

.hbeiBoxUl li {
  padding: 10px 0 5px 10px;
}

.hbeiTotal {
  font-size: 12px;
  color: #666;
  line-height: 34px;
  padding: 0 20px;
}

.el-tabs--border-card {
  box-shadow: none !important;
}
</style>
<style scoped src="../../static/index/css/shopping.css"></style>
<style scoped src="../../static/assets/layui/css/layui.css" media="all"></style>
<style scoped src="../../static/index/css/base.css"></style>
<style scoped src="../../static/index/css/new/fonts.css?v=201909001"></style>
<style scoped src="../../static/index/css/new/cart.css?v=201909001"></style>
