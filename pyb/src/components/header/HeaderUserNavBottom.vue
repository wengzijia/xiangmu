<!-- fengjianbo -->
<template>
  <div class="header">
    <div class="main_header">
      <div class="logo">
        <a href="/" class="fore1"> </a>
        <a href="/" class="fore2">我的拼一版</a>
        <a href="/" class="fore3">返回拼一版首页</a>
      </div>
      <div class="navitems">
        <ul>
          <li><a href="/">首页</a></li>
          <li class="fore-3">
            <el-menu mode="horizontal" router class="userNav cart-nav" active-text-color="#fff" text-color="#fff" background-color="#d0111b">
              <el-submenu index="1" popper-class="popUserNav" style="min-width:138px;">
                <template slot="title">账户设置</template>
                <el-menu-item index="/user/index">个人信息</el-menu-item>
                <el-menu-item index="/user/orderlist">我的订单</el-menu-item>
                <el-menu-item index="/user/editpassword">修改密码</el-menu-item>
                <el-menu-item index="/user/editprofile">账户设置</el-menu-item>
                <el-menu-item index="/user/userAddressList">收货地址</el-menu-item>
                <el-menu-item index="/user/invoice">发票信息</el-menu-item>
                <el-menu-item index="/user/userBonusList">我的优惠券</el-menu-item>
              </el-submenu>
            </el-menu>
          </li>
        </ul>
      </div>
      <div class="nav-r">
        <div class="dorpdown">
          <div class="cw-icon">
            <i class="ci-left"></i>
            <i class="ci-right">&gt;</i>
            <i class="ci-count">{{ $store.getters.cartNum }}</i>
            <router-link to="/cart/index">我的购物车</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store';
import { mapActions } from 'vuex';
import { ACCESS_TOKEN } from '@/store/global-constant';
import { encodingMobile } from '@/utils/strUtil';
import router from '@/router';
export default {
  name: 'HeaderUser',
  data() {
    return {
      userInfo: null
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    ...mapActions(['Logout']),
    logout() {
      const { Logout } = this;
      Logout({}).then(() => {
        this.$router.push({ path: '/' });
      });
    },
    getUserInfo() {
      if (localStorage.getItem(ACCESS_TOKEN) != null) {
        store.dispatch('GetUserInfo').then(() => {
          this.userInfo = store.getters.userInfo;
          if (this.userInfo) {
            this.userInfo.mobile = encodingMobile(this.userInfo.mobile);
          }
        });
      }
    }
  }
};
</script>
<style scoped src="../../static/index/user/css/all.css" />
<style lang="scss" src="../top-nav.scss"></style>
