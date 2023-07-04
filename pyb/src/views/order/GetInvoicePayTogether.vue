<template>
  <div>
    <div class="catbj">
      <!--content start-->
      <div class="container clear">
        <div class="ordokBox orderpay" style="background:#f8f8f8;">
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
            <h2 class="member_h2"><i></i>选择支付方式付款</h2>
            <div class="membCont">
              <p class="memb_tile">
                应付金额 <span class="meOrgs red">{{ money }}</span> 元
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
import { createPayQrCode, createPayQrCode2, getOrderByOrderNo } from '@/api/order/orderTogetherApi';
import { getUserInfo as getUser } from '@/api/users/userApi.js';

export default {
  data() {
    return {
      wxbaseAliImg: '',
      baseAliImg: '',
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
  destroyed() {
    // clearInterval(this.timer);
    clearTimeout(this.timer);
    clearTimeout(this.aliTimer);
  },
  methods: {
    //刷新支付二维码
    refreshCode() {
      this.isCodeLayer = false;
      this.stopPolling();
    },
    // 5分钟后二维码失效，停止轮询，刷新继续
    stopPolling() {
      let _this = this;
      clearTimeout(this.aliTimer);
      _this.getOrderInfo(true);
      _this.aliTimer = setTimeout(() => {
        _this.isCodeLayer = true;
      }, 1000 * 60);
    },
    getUserInfo() {
      getUser().then(res => {
        this.$set(this, 'userInfo', res.data);
        this.getOrderInfo();
      });
    },
    // getPaySuccess() {
    //   getOrderByOrderNo({ data: this.orderNo })
    //     .then(res => {
    //       console.log(res.data.status);
    //       if (res.data.status == 'paid') {
    //         this.paySuccess();
    //       }
    //     })
    //     .catch(() => {
    //       this.$router.push({ path: '/user/orderlist' });
    //     });
    // },
    /**
     * 获取订单信息并判断支付状态
     */
    getOrderInfo(isRecursion) {
      let _this = this;
      clearTimeout(_this.timer);
      getOrderByOrderNo({ data: this.orderNo })
        .then(res => {
          if (res.code === '000000') {
            this.money = res.data.amount;
            if (res.data.status == 'paid') {
              this.paySuccess();
            } else if (isRecursion) {
              if (_this.isCodeLayer) return;
              _this.timer = setTimeout(() => {
                _this.getOrderInfo(true);
              }, 1000);
            }
            if (res.data.status != 'paid' && !isRecursion) {
              _this.isPayType();
            }
          }
        })
        .catch(() => {
          this.$router.push({ path: '/user/orderlist' });
        });
    },
    // 成功后跳转页面
    paySuccess() {
      this.$message({ type: 'success', message: '支付成功' });
      // clearInterval(this.timer);
      let data = { orderNo: this.orderNo, type: 0 };
      this.$router.push({ path: '/user/orderlist' });
    },
    /**
     * 根据不同的支付类型调取不同的api
     */
    isPayType() {
      let _this = this;
      if (this.paytype === 'balance') {
        this.checked = true;
        // this.balancePayPage();
      } else {
        createPayQrCode2({
          language: 'zh-cn',
          orderNo: this.orderNo,
          payType: 'alipay'
        })
          .then(res => {
            this.baseAliImg = res.data;
          })
          .catch(error => {
            _this.$message({ type: 'error', message: error.message });
          });
        createPayQrCode({ id: 0, orderNo: this.orderNo == undefined ? 0 : this.orderNo, payType: 'wxpay3' })
          .then(res => {
            this.wxbaseAliImg = res.data;
          })
          .catch(error => {
            this.$message({ type: 'error', message: error.message });
          });
        _this.refreshCode();
        // _this.timer = setTimeout(() => {
        //   _this.getOrderInfo(true);
        // }, 1000);
      }
    },

    toOrderCenter() {
      this.$router.push('/user/orderlist');
    },
    changeUseBalance() {
      if (this.checked) {
        if (this.money > this.userInfo.userMoney) {
          this.useBalance = this.userInfo.userMoney;
        } else {
          this.useBalance = this.moeny;
        }
      }
      this.useBalance = '0.00';
    }
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
<style scoped src="../../static/index/css/base.css" />
<style scoped src="../../static/index/css/common.css" />
<style scoped src="../../static/assets/css/vip.css" />
<style scoped src="../../static/assets/layui/css/layui.css" />
<style scoped src="../../static/index/css/shopping.css" />
