<template>
  <el-container style="margin-bottom: 30px">
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
                  共1张订单，<router-link :to="$route.query.design ? '/user/designerlist' : '/user/demandlist'">订单中心</router-link>。<span class="gree">请在当天内完成支付</span>，待支付：<span class="red">{{ '￥' + money }}</span>
                </p>
              </div>
            </div>
            <div class="modeWapper" style="margin: 50px auto">
              <div class="yueBoxs">
                <el-checkbox v-model="checked" @change="useUserMoney"
                  ><span style="font-size:17px; ">余额支付(￥{{ activeUserMoney }})</span><font class="red"> (如果您有正在使用中的后付费产品，请保证有足够余额)</font></el-checkbox
                >
                <span class="yueMRt" style="float: right"
                  >已支付
                  <font class="red"
                    >¥ <font class="f20">{{ activeBalancePay }}</font></font
                  >
                  <!-- <font class="red"
                    >¥ <font class="f20">{{ useBalance }}</font></font
                  > -->
                </span>
              </div>
              <el-tabs type="border-card" v-model="tabsValue" @tab-click="tabClick">
                <el-tab-pane name="alipay">
                  <span slot="label" style="color: black"> 支付宝支付</span>
                  <div class="zfbDiv" style="height: 500px">
                    <div class="payMoneyCss">
                      应付款金额：<span class="red" style="font-size: 22px">￥{{ activeMoney }}</span>
                    </div>
                    <div class="payImg">
                      <img :class="isCodeLayer ? 'payImgCode' : ''" :src="'data:image/png;base64, ' + alicode" />
                      <p class="refresh" v-show="isCodeLayer" @click="refreshCode()"><span class="el-icon-refresh"></span></p>
                    </div>
                    <div class="alipayDiv">
                      <p><img style="width: 25px; height: 25px" src="@/static/index/img/alipay.png" alt="" /> 支付宝扫码付款</p>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="花呗支付" name="huabei">
                  <span slot="label" style="color: black">花呗支付</span>
                  <div style="height: 500px">
                    <div v-show="activeStagesShow" style="margin-top: 30px">
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
                    <div class="zfbDiv" style="height: 500px">
                      <div class="payMoneyCss">
                        应付款金额：<span class="red" style="font-size: 22px">￥{{ activeMoney }}</span>
                      </div>
                      <div class="payImg">
                        <img :class="isCodeLayer ? 'payImgCode' : ''" :src="'data:image/png;base64, ' + huabei" />
                        <p class="refresh" v-show="isCodeLayer" @click="refreshCode()"><span class="el-icon-refresh"></span></p>
                      </div>
                      <div class="alipayDiv">
                        <p><img style="width: 25px; height: 25px" src="@/static/index/img/alipay.png" alt="" /> 支付宝扫码付款</p>
                      </div>
                    </div>
                  </el-dialog>
                </el-tab-pane>
                <el-tab-pane label="微信支付" name="wxpay">
                  <span slot="label" style="color: black">微信支付</span>
                  <div style="height: 500px">
                    <div class="payMoneyCss">
                      应付款金额：<span class="red" style="font-size: 22px">￥{{ activeMoney }}</span>
                    </div>
                    <div class="payImg">
                      <img :class="isCodeLayer ? 'payImgCode' : ''" :src="'data:image/png;base64, ' + wxcode" />
                      <p class="refresh" v-show="isCodeLayer" @click="refreshCode()"><span class="el-icon-refresh"></span></p>
                    </div>
                    <div class="alipayDiv">
                      <p><img style="width: 25px; height: 25px" src="@/static/index/img/wxpay.png" alt="" /> 微信扫码付款</p>
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
import { getNowPayQrCode, getOrder, balancePay } from '@/api/order/orderGetpay';
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
    // },
    // // 订单金额
    // activeMoney: function() {
    //   // let balance = this.paytype;
    //   // let totalMoney = this.money;
    //   // console.log('this.activeBalancePay111', this.activeBalancePay); //不要注释这一行，监听值的变化操i执行
    //   // if (balance != undefined && balance == 'balance' && totalMoney >= this.userInfo.userMoney) {
    //   //   totalMoney -= this.activeBalancePay;
    //   //   // console.log('this.activeBalancePay2222', this.activeBalancePay);
    //   //   // totalMoney -= this.userInfo.userMoney;
    //   // }
    //   if( this.checked&& this.money >= this.userInfo.userMoney){
    //     return this.money - this.userInfo.userMoney;
    //   }else{
    //     return this.money
    //   }

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
    //   return this.curStagesInfo.moneyTotal;
    // },
    // 余额支付已支付
    // activeBalancePay: function() {
    //   if (this.checked) {
    //     if (this.money > this.userInfo.userMoney) {
    //       return this.userInfo.userMoney;
    //     } else {
    //       return this.moeny;
    //     }
    //   }
    //   return '0';
    // },
    // 余额
    activeUserMoney: function() {
      let user = this.userInfo;
      if (user) {
        return user.userMoney;
      }
      return '0.00';
    }
  },
  data() {
    return {
      tabsValue: 'alipay',
      alicode: '',
      wxcode: '',
      money: '',
      orderNo: '',
      huabei: '',
      huabeiRates: [
        { times: 3, rates: 0.025 },
        { times: 6, rates: 0.045 },
        { times: 12, rates: 0.088 }
      ],
      stages: [],
      curStages: 0,
      curStagesInfo: {},
      hasAlipayStages: false,
      // 是否勾选余额支付
      checked: false,
      // 用户信息
      userInfo: {},
      // 子单号
      subOrderId: '',
      // 已支付余额
      useBalance: '0.00',
      orderType: '',
      paytype: '',
      timer: '',
      aliTimer: null,
      isCodeLayer: false //二维码刷新
    };
  },
  async created() {
    this.orderNo = this.$route.query.orderNo;
    this.paytype = this.$route.query.paytype != undefined ? this.$route.query.paytype : '';
    this.subOrderId = this.$route.query.subOrderId;
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
          _this.getBalancePayCode();
        }
      } else {
        if (!_this[code[_this.tabsValue]] && _this.tabsValue != 'huabei') {
          _this.getPayCode();
        }
      }
      this.refreshCode();
    },
    isPayType() {
      if (this.paytype === 'balance') {
        this.getBalancePayCode();
      } else {
        this.getPayCode();
      }
    },
    getBaseInfo() {
      this.getOrderMoney();
    },
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
      getNowPayQrCode(data)
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
    /**
     * 余额+支付
     */
    getBalancePayCode() {
      let _this = this;
      let code = {
        alipay: 'alicode',
        wxpay: 'wxcode',
        huabei: 'huabei'
      };
      /** 提交的数据 */
      let data = { id: 0, orderNo: _this.orderNo == undefined ? 0 : _this.orderNo, payType: _this.tabsValue, isBalance: true };
      if (_this.tabsValue == 'huabei') {
        //判断是否是花呗支付，添加花呗分期值
        data.hbFqNum = _this.huabeiRates[_this.curStages].times;
      }
      balancePay(data)
        .then(res => {
          // debugger;
          if (res.code === '000000') {
            if (res.data != '0') {
              _this[code[_this.tabsValue]] = res.data;
              if (_this.tabsValue == 'huabei') {
                _this.hasAlipayStages = true;
              }
              _this.getOrderInfo();
            } else {
              _this.paySuccess();
            }
          } else {
            _this.$message({ type: 'error', message: res.message });
          }
        })
        .catch(error => {
          _this.$message({ type: 'error', message: error.message });
        });
    },
    // getAlipayQrCode() {
    //   let data = { id: 0, orderNo: this.orderNo, payType: 'alipay' };
    //   getNowPayQrCode(data)
    //     .then(res => {
    //       if (res.code == '000000') {
    //         this.alicode = res.data;
    //       } else {
    //         this.$message({ type: 'error', message: res.message });
    //         // this.$router.go(-1);
    //       }
    //     })
    //     .catch(error => {
    //       // this.$router.go(-1);
    //     });
    // },
    // getWxpayQrCode() {
    //   let data = { id: 0, orderNo: this.orderNo, payType: 'wxpay' };
    //   getNowPayQrCode(data).then(res => {
    //     this.wxcode = res.data;
    //     // console.log(res.data);
    //   });
    // },
    // getHuaBei(num) {
    //   let data = { hbFqNum: num, id: 0, orderNo: this.orderNo, payType: 'huabei' };
    //   getNowPayQrCode(data).then(res => {
    //     if (res.code === '000000') {
    //       this.huabei = res.data;
    //       this.hasAlipayStages = true;
    //     }
    //   });
    // },
    toOrderCenter() {
      this.$router.push('/user/demandlist');
    },
    changeCurr(item, index) {
      this.curStages = index;
      this.curStagesInfo = item;
    },
    handleClose() {
      this.hasAlipayStages = false;
    },
    stagesPayDialog(num) {
      if (this.paytype === 'balance') {
        this.getBalancePayCode(num);
      } else {
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
      getOrder({ data: this.orderNo }).then(res => {
        // console.log(res);
        if (res.code === '000000') {
          this.money = res.data.amount;
          if (res.data.payStatus == 1) {
            _this.paySuccess();
          } else {
            _this.tabClick();
          }
        }
      });
    },
    // 定时器查询订单状态
    getOrderInfo() {
      let _this = this;
      getOrder({ data: this.orderNo })
        .then(res => {
          if (res.code === '000000') {
            // console.log(res);
            this.orderType = res.data.ordertype;
            if (res.data.payStatus == 1) {
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
    // 使用余额支付
    useUserMoney() {
      if (this.userInfo.userMoney > 0) {
        if (this.checked === true) {
          let useMoney = 0;
          if (this.money <= this.userInfo.userMoney) {
            useMoney = this.money;
          } else if (this.money > this.userInfo.userMoney) {
            useMoney = this.userInfo.userMoney;
          }
          this.$confirm(`您将使用余额支付${useMoney}元`, '支付提醒', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.alicode = '';
              this.wxcode = '';
              if (this.$route.query.inquiry == 1) {
                this.$router.push({ path: '/service/getpay', query: { orderNo: this.orderNo, paytype: 'balance', inquiry: '1' } });
              } else {
                this.$router.push({ path: '/service/getpay', query: { orderNo: this.orderNo, paytype: 'balance' } });
              }
              this.paytype = 'balance';
              this.checked = true;
              this.tabClick();
            })
            .catch(() => {
              this.checked = false;
            });
        } else {
          this.alicode = '';
          this.wxcode = '';
          if (this.$route.query.inquiry == 1) {
            this.$router.push({ path: '/service/getpay', query: { orderNo: this.orderNo, paytype: 'normal', inquiry: '1' } });
          } else {
            this.$router.push({ path: '/service/getpay', query: { orderNo: this.orderNo, paytype: 'normal' } });
          }

          this.paytype = 'normal';
          this.tabClick();
        }
      }
    },
    // 余额支付页面刷新
    // balancePayPage() {
    //   if (this.orderNo != undefined && this.orderNo != '') {
    //     getOrder({ data: this.orderNo }).then(res => {
    //       if (res.code === '000000') {
    //         if (res.data.payStatus == 1) {
    //           this.paySuccess();
    //         } else {
    //           this.balanceAlipay();
    //         }
    //       }
    //     });
    //   }
    // },
    // 余额支付 + 支付宝
    // balanceAlipay() {
    //   // 支付二维码
    //   clearTimeout(this.timer);
    //   balancePay({ id: 0, orderNo: this.orderNo == undefined ? 0 : this.orderNo, payType: 'alipay', isBalance: true })
    //     .then(res => {
    //       // debugger;
    //       if (res.code === '000000') {
    //         if (res.data != '0') {
    //           this.alicode = res.data;
    //           this.balanceWxpay();
    //           this.timer = setInterval(this.getOrderInfo, 1000);
    //         } else {
    //           this.paySuccess();
    //         }
    //       }
    //       this.getBaseInfo();
    //     })
    //     .catch(error => {
    //       // this.$message({ type: 'error', message: error.message });
    //       console.log(error.message);
    //     });
    // },
    // // 余额支付 + 微信
    // balanceWxpay() {
    //   // 微信二维码
    //   balancePay({ id: 0, orderNo: this.orderNo == undefined ? 0 : this.orderNo, payType: 'wxpay', isBalance: true })
    //     .then(res => {
    //       if (res.code === '000000') {
    //         if (res.data != '0') {
    //           this.wxcode = res.data;
    //         }
    //       }
    //       this.getBaseInfo();
    //     })
    //     .catch(error => {
    //       // this.$message({ type: 'error', message: error.message });
    //       console.log(error.message);
    //     });
    // },
    // 余额支付 + 花呗分期
    // balancePayAndHuaBei(num) {
    //   balancePay({ hbFqNum: num, id: 0, orderNo: this.orderNo == undefined ? 0 : this.orderNo, payType: 'huabei', isBalance: true })
    //     .then(res => {
    //       if (res.code === '000000') {
    //         this.huabei = res.data;
    //         this.hasAlipayStages = true;
    //       } else {
    //         this.$message({ type: 'error', message: res.message });
    //       }
    //       this.getBaseInfo();
    //     })
    //     .catch(error => {
    //       this.$message({ type: 'error', message: error.message });
    //     });
    // },
    // 成功后的跳转
    paySuccess() {
      this.$message({ type: 'success', message: '支付成功' });
      clearTimeout(this.timer);
      if (this.$route.query.inquiry == 1) {
        this.$router.push('/user/inquirylist');
      } else if (this.subOrderId && this.orderType != 3 && !this.$route.query.inquiry) {
        this.$router.push({ path: '/user/demanddetail', query: { id: this.subOrderId } });
      } else {
        this.$router.push({ path: '/user/demandlist' });
      }
    }
    // 已支付余额
    // changeUseBalance() {
    //   if (this.checked) {
    //     if (this.money > this.userInfo.userMoney) {
    //       this.useBalance = this.userInfo.userMoney;
    //     } else {
    //       this.useBalance = this.moeny;
    //     }
    //   }
    //   this.useBalance = '0.00';
    // }
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
