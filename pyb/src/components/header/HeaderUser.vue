<!-- fengjianbo -->
<template>
  <div id="topbar">
    <!-- <div id="topbar" style="margin-top: 46px;"> -->
    <div class="flex comBox">
      <div class="topbarLt">
        <a href="/">拼一版首页</a>
        <span class="topbarLtSpn">哞，欢迎来做包装！</span>
        <span v-if="userInfo != null">
          <router-link to="/user/index">{{ userInfo.mobile }}</router-link>
          <el-divider direction="vertical"></el-divider>
          <el-link type="text" @click="logout">退出</el-link>
        </span>
      </div>
      <ul class="flex topbarRt">
        <li class="topbarRtxt"><span>客服热线：0755-36567904</span> <span>18820487869</span></li>
        <li class="topbarRtxt">
          <a class="afterQq" href="//wpa.b.qq.com/cgi/wpa.php?ln=1&amp;key=XzgwMDgyMjAwNl80NzE5OTVfODAwODIyMDA2XzJf" target="_blank"> <i class="icon icon-qq"></i> 售后QQ </a>
        </li>
        <li class="topbarLogin">
          <!--已登录-->
          <div v-if="userInfo != null" class="useLgBox">
            <!-- <div v-if="$store.getters.userInfo.username" class="useLgBox"> -->
            <el-menu mode="horizontal" class="userNav cart-nav" router active-text-color="#fff" text-color="#fff">
              <el-submenu index="1" popper-class="popUserNav">
                <template slot="title"><i class="el-icon-user"></i><router-link to="/user/index">用户中心</router-link></template>
                <el-menu-item index="/user/orderlist">我的订单</el-menu-item>
                <el-menu-item index="/user/userAddressList">收货地址</el-menu-item>
                <el-menu-item index="#" @click="logout">退出</el-menu-item>
              </el-submenu>
            </el-menu>
          </div>
          <!--未来登录-->
          <p v-else class="LgBox">
            {{ $store.getters.userInfo.username }}
            <router-link to="/login" class="topbarLogSp">登录</router-link>
            <router-link to="/register">注册</router-link>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import store from '@/store';
import { ACCESS_TOKEN } from '@/store/global-constant';
import { encodingMobile } from '@/utils/strUtil';
export default {
  name: 'HeaderUser',
  data() {
    return { userInfo: null };
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
        window.location.reload();
      });
    },
    getUserInfo() {
      if (localStorage.getItem(ACCESS_TOKEN) != null) {
        store.dispatch('GetUserInfo').then(() => {
          this.userInfo = store.getters.userInfo;
          console.log('测试用户信息', this.$store.getters.userInfo.username);
          if (this.userInfo) {
            this.userInfo.mobile = encodingMobile(this.userInfo.mobile);
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" src="../top-nav.scss"></style>
