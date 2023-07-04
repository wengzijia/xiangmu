<template>
  <div>
    <div class="catbj">
      <!--content start-->
      <div class="container clear">
        <div class="ordokBox orderpay" style="background: #f8f8f8">
          <div class="ordersubmissionsuccess">
            <p class="order-first"><img src="@/static/images/wbb113006.png" />&nbsp;&nbsp; 订单提交成功！请尽快支付！</p>
            <p class="order-two">共1张订单， <router-link to="/user/orderlist">订单中心</router-link>。 &nbsp;请在 <span> 当天 </span> 内完成支付</p>
            <p class="order-three">
              待支付：<span>￥{{ money }}</span>
            </p>
          </div>
        </div>
        <div class="Paymentmethod">
          <div class="memberbox">
            <h2 class="member_h2"><i></i>选择余额支付</h2>
            <div class="membCont layui-form">
              <div class="layui-card"></div>
              <div class="layui-form-item">
                <el-checkbox v-model="checked" @change="useUserMoney"
                  ><span style="font-size:15px;">余额支付({{ '￥' + activeUserMoney }})</span></el-checkbox
                >
                <div class="warnings">如果您有正在使用中的后付费产品，请保证有足够余额。</div>
                <div class="w-item">
                  支付：<span class="warnings temp_money">{{ '￥ ' + activeBalancePay }}</span>
                  <!-- 支付：<span class="warnings temp_money">{{ '￥ ' + useBalance }}</span> -->
                </div>
              </div>
            </div>
            <h2 class="member_h2"><i></i>选择支付方式付款</h2>
            <div class="membCont">
              <p class="memb_tile">
                应付金额 <span class="meOrgs red">{{ activeMoney }}</span> 元
                <!-- 应付金额 <span class="meOrgs red">{{ money }}</span> 元 -->
              </p>
              <ul class="membrUl">
                <li>
                  <p class="codeimg"><img :class="isCodeLayer ? 'payImg' : ''" :src="'data:image/jpeg;base64,' + wxbaseAliImg" /></p>
                  <p class="codwx"><i class="picbj"></i>使用微信扫码付款</p>
                  <p class="refresh" v-show="isCodeLayer" @click="refreshCode()"><span class="el-icon-refresh"></span></p>
                </li>
                <li>
                  <p class="codeimg"><img :class="isCodeLayer ? 'payImg' : ''" :src="'data:image/jpeg;base64,' + baseAliImg" /></p>
                  <p class="codzfb"><i class="picbj"></i>使用支付宝扫码付款</p>
                  <p class="refresh" v-show="isCodeLayer" @click="refreshCode()"><span class="el-icon-refresh"></span></p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getNowPayQrCode, getNowPayQrCode02, getOrder, balancePay } from '@/api/order/orderGetcylpay';
import { getUserInfo as getUser } from '@/api/users/userApi.js';
import money from './mixins/money';
import refreshCode from './mixins/refreshCode';
export default {
  mixins: [money, refreshCode],
  data() {
    return {
      baseAliImg: '',
      wxbaseAliImg: '',
      money: 0,
      timer: '',
      orderNo: '',
      userInfo: '',
      checked: false,
      paytype: '',
      useBalance: '0.00',
      aliTimer: null,
      isCodeLayer: false //二维码刷新
    };
  },
  created() {
    this.orderNo = this.$route.query.orderNo;
    this.paytype = this.$route.query.paytype != undefined ? this.$route.query.paytype : '';
    this.getUserInfo();
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
    //   _this.getOrderInfo(true);
    //   _this.aliTimer = setTimeout(() => {
    //     _this.isCodeLayer = true;
    //   }, 1000 * 300);
    // },
    /**
     * 获取用户信息
     */
    getUserInfo() {
      let _this = this;
      getUser().then(res => {
        _this.$set(_this, 'userInfo', res.data);
        _this.getOrderInfo();
      });
    },
    /**
     * 获取订单信息并判断支付状态
     */
    getOrderInfo(isRecursion) {
      let _this = this;
      clearTimeout(_this.timer);
      getOrder({ data: _this.orderNo })
        .then(res => {
          if (res.code === '000000') {
            _this.money = res.data.amount;
            if (res.data.isPay == 1) {
              _this.paySuccess();
            } else if (isRecursion) {
              if (_this.isCodeLayer) return;
              _this.timer = setTimeout(() => {
                _this.getOrderInfo(true);
              }, 1000);
            }
            if (res.data.isPay != 1 && !isRecursion) {
              _this.isPayType();
            }
          }
        })
        .catch(() => {
          _this.$router.push({ path: '/user/orderlist' });
        });
    },
    // /**
    //  * 获取订单信息并判断支付状态
    //  */
    // getOrderInfo(isRecursion) {
    //   let _this = this;
    //   clearTimeout(_this.timer);
    //   getOrder({ data: _this.orderNo })
    //     .then(res => {
    //       _this.money = res.data.amount;
    //       if (res.data.isPay == 1) {
    //         _this.paySuccess();
    //       } else if (isRecursion) {
    //         _this.timer = setTimeout(() => {
    //           _this.getOrderInfo(true);
    //         }, 1000);
    //       }
    //       if (res.data.isPay != 1 && !isRecursion) {
    //         _this.isPayType();
    //       }
    //     })
    //     .catch(() => {
    //       _this.$router.push({ path: '/user/orderlist' });
    //     });
    // },
    /**
     * 使用余额支付
     */
    useUserMoney() {
      let _this = this;
      if (_this.userInfo.userMoney > 0) {
        if (_this.checked === true) {
          let useMoney = 0;
          if (_this.money <= _this.userInfo.userMoney) {
            useMoney = _this.money;
          } else if (_this.money > _this.userInfo.userMoney) {
            useMoney = _this.userInfo.userMoney;
          }
          _this
            .$confirm(`您将使用余额支付${useMoney}元`, '支付提醒', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(() => {
              _this.paytype = 'balance';
              _this.isPayType();
              _this.$router.push({ path: '/service/getinvoicepay', query: { orderNo: _this.orderNo, paytype: 'balance' } });
              _this.refreshCode();
            })
            .catch(e => {
              _this.checked = false;
            });
        } else {
          _this.paytype = 'normal';
          _this.isPayType();
          _this.$router.push({ path: '/service/getinvoicepay', query: { orderNo: _this.orderNo, paytype: 'normal' } });
          _this.refreshCode();
        }
      } else {
        _this.$message.error('余额不足！！！');
        _this.checked = false;
      }
    },
    /**
     * 余额支付 + 支付宝
     * @param {*} payType
     */
    balanceAlipay(payType) {
      // 支付二维码
      let _this = this;
      balancePay({ id: 0, orderNo: this.orderNo, payType: payType || 'alipay', isBalance: true })
        .then(res => {
          // debugger;
          if (res.code === '000000') {
            if (res.data != '0') {
              if (!payType) {
                this.baseAliImg = res.data;
                this.balanceAlipay('wxpay3');
              } else {
                this.wxbaseAliImg = res.data;
                this.refreshCode();
                // _this.timer = setTimeout(() => {
                // _this.getOrderInfo(true);
                // _this.aliTimer = setTimeout(() => {
                //   _this.isCodeLayer = true;
                // }, 10000);
                // }, 1000);
              }
            } else {
              this.paySuccess();
            }
          }
        })
        .catch(error => {
          console.log(error.message);
        });
    },
    /**
     * 支付成功后跳转页面
     */
    paySuccess() {
      this.$message({ type: 'success', message: '支付成功' });
      clearTimeout(this.timer);
      let data = { orderNo: this.orderNo, type: 0 };
      this.$router.push({ path: '/order/getfile', query: data });
    },
    /**
     * 根据不同的支付类型调取不同的api
     */
    isPayType() {
      let _this = this;
      if (_this.paytype === 'balance') {
        _this.checked = true;
        _this.balanceAlipay();
      } else {
        getNowPayQrCode02({
          language: 'zh-cn',
          orderNo: _this.orderNo,
          payType: 'alipay'
        })
          .then(res => {
            _this.baseAliImg = res.data;
          })
          .catch(error => {
            _this.$message({ type: 'error', message: error.message });
          });
        getNowPayQrCode({ id: 0, orderNo: _this.orderNo == undefined ? 0 : _this.orderNo, payType: 'wxpay3' })
          .then(res => {
            _this.wxbaseAliImg = res.data;
          })
          .catch(error => {
            _this.$message({ type: 'error', message: error.message });
          });
        _this.refreshCode();
        // // _this.timer = setTimeout(() => {
        // _this.getOrderInfo(true);
        // _this.aliTimer = setTimeout(() => {
        //   _this.isCodeLayer = true;
        // }, 10000);
        // // }, 1000);
      }
    }
  },

  beforeDestroy() {
    clearTimeout(this.timer);
    clearTimeout(this.aliTimer);
  }
};
</script>
<style scoped>
.membrUl > li {
  position: relative;
  user-select: none;
}
.membrUl > li .payImg {
  filter: blur(5px);
}
.membrUl > li .refresh {
  width: 215px;
  height: 215px;
  line-height: 215px;
  text-align: center;
  position: absolute;
  left: 0;
  top: -55px;
  right: 0;
  bottom: 0;
  margin: auto;
  font-size: 30px;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  /* background: rgba(0, 0, 0, 0.6); */
}
</style>
<style scoped src="../../static/index/css/base.css"></style>
<style scoped src="../../static/index/css/common.css"></style>
<style scoped src="../../static/assets/css/vip.css"></style>
<style scoped src="../../static/assets/layui/css/layui.css"></style>
<style scoped src="../../static/index/css/shopping.css"></style>
