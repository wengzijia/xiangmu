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
              <div class="yueBoxs">
                <el-checkbox v-model="checked" @change="useUserMoney"
                  ><span style="font-size:17px; ">余额支付({{ '￥' + userInfo.userMoney }})</span><font class="red"> (如果您有正在使用中的后付费产品，请保证有足够余额)</font></el-checkbox
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
              <div class="yueBoxs" style="display:none">
                <el-checkbox v-model="checked1" @change="customMoney"><span style="font-size:17px; ">自定义余额金额支付</span></el-checkbox>
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
                  <el-dialog title="花呗支付" :visible.sync="hasAlipayStages" width="40%">
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
import { getNowPayQrCode, getOrder, balancePay } from '@/api/order/orderGetcylpay';
import { getUserInfo as getUser } from '@/api/users/userApi.js';
import huabei from './mixins/huabei';
import refreshCode from './mixins/refreshCode'; //花呗相关数据
export default {
  name: 'component_name',
  mixins: [huabei, refreshCode],
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
      checked1: false,
      // 用户信息0
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

    // /**
    //  * 支付宝支付二维码
    //  */
    // getAlipayQrCode() {
    //   let data = { id: 0, orderNo: this.orderNo == undefined ? 0 : this.orderNo, payType: 'alipay' };
    //   getNowPayQrCode(data)
    //     .then(res => {
    //       this.alicode = res.data;
    //     })
    //     .catch(error => {
    //       this.$message({ type: 'error', message: error.message });
    //       // this.$router.go(-1);
    //     });
    // },
    /**
     * 微信支付二维码
     */
    // getWxpayQrCode() {
    //   let data = { id: 0, orderNo: this.orderNo == undefined ? 0 : this.orderNo, payType: 'wxpay' };
    //   getNowPayQrCode(data)
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
    //   getNowPayQrCode(data)
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

    changeCurr(item, index) {
      this.curStages = index;
      this.curStagesInfo = item;
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
    /**
     * 获取订单信息
     */
    getOrderMoney() {
      let _this = this;
      getOrder({ data: this.orderNo }).then(res => {
        if (res.code === '000000') {
          _this.money = res.data.amount;
          if (res.data.isPay == 1) {
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
      getOrder({ data: _this.orderNo })
        .then(res => {
          if (res.code === '000000') {
            if (res.data.isPay == 1) {
              _this.paySuccess();
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
      // this.changeUseBalance();
      if (this.userInfo.userMoney > 0) {
        if (this.checked === true) {
          // debugger;
          let useMoney = 0;
          // this.money 订单金额
          // this.userInfo.userMoney  余额支付的金额
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
              this.$router.push({ path: '/service/getcylpay', query: { orderNo: this.orderNo, paytype: 'balance' } });
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
          this.$router.push({ path: '/service/getcylpay', query: { orderNo: this.orderNo, paytype: 'normal' } });
          this.paytype = 'normal';
          this.tabClick();
        }
      }
    },
    customMoney() {
      if (this.userInfo.userMoney > 0) {
        if (this.checked1) {
          this.$prompt('请输入自定义余额金额支付', '支付提醒', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[0-9]*$/,
            inputErrorMessage: '自定义余额金额支付格式不正确',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                let cusMoney = Number(instance.inputValue);
                if (cusMoney > 0 && cusMoney < this.userInfo.userMoney && cusMoney < this.money) {
                  // console.log(2222);
                  done();
                } else {
                  console.log(88888);
                  this.$message({
                    type: 'error',
                    message: '输入自定义余额金额支付不在范围之内'
                  });
                  instance.inputValue = '';
                }
              } else {
                done();
                // this.checked1 = false;
              }
            }
          })
            .then(({ value }) => {
              if (value) {
                this.$message({
                  type: 'success',
                  message: '您自定义余额金额支付为 ' + value
                });
              } else {
                this.checked1 = false;
                this.$message({
                  type: 'warning',
                  message: '自定义余额金额支付不能为空! '
                });
              }
            })
            .catch(() => {
              this.checked1 = false;
            });
        }
      }
    },
    // 余额支付页面刷新
    // balancePayPage() {
    //   if (this.orderNo != undefined && this.orderNo != '') {
    //     if (this.orderNo != undefined && this.orderNo != '') {
    //       getOrder({ data: this.orderNo }).then(res => {
    //         if (res.code === '000000') {
    //           if (res.data.payStatus == 1) {
    //             this.paySuccess();
    //           } else {
    //             this.balanceAlipay();
    //           }
    //         }
    //       });
    //     }
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
    // 余额支付 + 微信
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
    // 支付成功
    paySuccess() {
      this.$message({ type: 'success', message: '支付成功' });
      clearTimeout(this.timer);
      let data = { orderNo: this.orderNo };
      this.$router.push({ path: '/order/getfile', query: data });
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
