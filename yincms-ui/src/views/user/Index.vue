<!-- fengjianbo -->
<template>
  <div>
    <div class="UP_right_List">个人信息</div>
    <div class="Down_right_List homeInfo">
      <div class="allInvoice">
        <div class="Essential_information">
          <h1 class="titleYous">您的基本信息</h1>
          <!--<div style="margin:30px auto;padding:20px 15px;width:808px;height:25px;line-height:25px;border:2px #c81623 dashed; font-size:14px;">
            充值返现，多充多送 <a href="/index.php/index/user/recharge.html" style="color:#0088dd">立即充值</a>&nbsp;&nbsp;&nbsp;&nbsp;
          </div>-->
          <div class="information_All">
            <div class="left_Avatar">
              <div class="yousIcon">
                <img src="@/static/index/user/images/20131025205838_WU43k.png" alt="" />
              </div>
              <div class="yous_Detail">
                <ul>
                  <li>
                    <span class="nubNumber">会员名：</span><b>{{ userInfo.username }}</b>
                  </li>
                  <li>
                    <span class="nubNumber">绑定手机号：</span><b>{{ userInfo.mobile }}</b>
                  </li>
                  <li>
                    <span class="nubNumber">账户余额：</span><b>{{ userInfo.userMoney }}</b>
                  </li>
                </ul>
              </div>
            </div>
            <div class="right_OrderInfo">
              <ul>
                <li>
                  <a href="/user/orderlist?type=1"
                    ><p class="red_Count Red_Nub">{{ dzfCount }}</p>
                    <p class="red_Count">待付款</p></a
                  >
                </li>
                <li>
                  <a href="/user/orderlist?type=2"
                    ><p class="red_Count Red_Nub">{{ dqrCount }}</p>
                    <p class="red_Count">待确认</p></a
                  >
                </li>
                <li>
                  <a href="/user/orderlist?type=3"
                    ><p class="red_Count Red_Nub">{{ yfhCount }}</p>
                    <p class="red_Count">已发货</p></a
                  >
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
import store from '@/store';
import { ACCESS_TOKEN } from '@/store/global-constant';
import { getStatusStatisticsCount } from '@/api/order/supplierOrdersApi';
export default {
  data() {
    return {
      userInfo: {},
      dzfCount: 0,
      dqrCount: 0,
      yfhCount: 0
    };
  },
  created() {
    this.getUserInfo();
    this.getStatisticsCount();
  },
  methods: {
    getStatisticsCount() {
      getStatusStatisticsCount().then(res => {
        this.dzfCount = res.data.dzfCount;
        this.dqrCount = res.data.dqrCount;
        this.yfhCount = res.data.yfhCount;
      });
    },
    getUserInfo() {
      store.dispatch('GetUserInfo').then(() => {
        this.$set(this, 'userInfo', store.getters.userInfo);
      });
    }
  }
};
</script>
<style scoped src="../../static/index/user/css/all.css" />
