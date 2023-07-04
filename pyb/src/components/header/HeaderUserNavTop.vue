<!-- fengjianbo -->
<template>
  <!--修改于2017-0621-->
  <div class="wbb_top">
    <div class="wbb_top_content clearfix">
      <div class="fl">
        您好！
        <span v-if="userInfo != null">
          <router-link to="/user/index">{{ userInfo.mobile }}</router-link>
          <i class="color1">|</i>
          <el-link type="text" @click="logout">退出</el-link>
        </span>
        <span v-else>
          <a href="/login">请登录</a>
          <i class="color1">|</i>
          <a href="/register">免费注册</a>
        </span>
      </div>
      <div class="fr">
        <a href="/">拼一版首页</a>
      </div>
      <div class="clear"></div>
    </div>
  </div>
  <!--顶部结束-->
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

<style scoped src="../../static/login.css" />
