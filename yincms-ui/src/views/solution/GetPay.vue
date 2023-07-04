<template>
  <div>
    <div class="catbj">
      <!--content start-->
      <div class="container clear">
        <div class="ordokBox orderpay" style="background:#f8f8f8;">
          <div class="ordersubmissionsuccess">
            <p class="order-first"><img src="@/static/images/wbb113006.png" />&nbsp;&nbsp; 订单提交成功！请尽快支付！</p>
            <p class="order-two">共1张订单， <router-link to="/user/templatelist">模版订单</router-link>。 &nbsp;请在 <span> 当天 </span> 内完成支付</p>
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
                  <p class="codeimg"><img :src="'data:image/jpeg;base64,' + baseWxImg" /></p>
                  <p class="codwx"><i class="picbj"></i>使用微信扫码付款</p>
                </li>
                <li>
                  <p class="codeimg"><img :src="'data:image/jpeg;base64,' + baseAliImg" /></p>
                  <p class="codzfb"><i class="picbj"></i>使用支付宝扫码付款</p>
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
import { createPayQrCode, getByOrderNo } from '@/api/template/templateApi';

export default {
  data() {
    return {
      baseWxImg: '',
      baseAliImg: '',
      money: 0,
      timer: '',
      orderNo: ''
    };
  },
  methods: {
    getPaySuccess() {
      getByOrderNo({ data: this.orderNo })
        .then(res => {
          if (res.data.payStatus == 1) {
            clearInterval(this.timer);
            this.$message({ message: '支付成功', type: 'success' });
            this.$router.push({ path: '/solution/detail?id=' + res.data.templateId });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.orderNo = this.$route.query.orderNo;
    getByOrderNo({ data: this.orderNo }).then(res => {
      this.money = res.data.price;
      if (res.data.payStatus == 1) {
        window.location.href = '/solution/detail?id=' + res.data.templateId;
      }
    });
    createPayQrCode({
      language: 'zh-cn',
      orderNo: this.orderNo,
      payType: 'wxpay'
    }).then(res => {
      this.baseWxImg = res.data;
      console.log(res);
    });
    createPayQrCode({
      language: 'zh-cn',
      orderNo: this.orderNo,
      payType: 'alipay'
    }).then(res => {
      this.baseAliImg = res.data;
      console.log(res);
    });
    this.timer = setInterval(this.getPaySuccess, 1000);
  },
  destroyed() {
    clearInterval(this.timer);
  }
};
</script>
<style scoped src="../../static/index/css/base.css" />
<style scoped src="../../static/index/css/common.css" />
<style scoped src="../../static/assets/css/vip.css" />
<style scoped src="../../static/assets/layui/css/layui.css" />
<style scoped src="../../static/index/css/shopping.css" />
