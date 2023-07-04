<!-- fengjianbo -->
<template>
  <el-container class="login" style="background-color: #f5f5f5;">
    <el-header class="header-nav" style="height: auto;">
      <!--修改于2017-0621-->
      <div class="mainNavs">
        <div class="topTilebox">
          <div class="container">
            <div class="topTile_Lft {if !session('index_user_auth.nickname')}none{/if}">
              <a href="/">拼一版首页</a>
              <a>哞，欢迎来做包装</a>
              <span v-if="userInfo != null">
                <router-link to="/user/index">{{ userInfo.mobile }}</router-link>
                <el-divider direction="vertical"></el-divider>
                <el-link type="text" @click="logout">退出</el-link>
              </span>
              <span v-else>
                <router-link to="/login">请登录</router-link>
                <el-divider direction="vertical"></el-divider>
                <router-link to="/register">免费注册</router-link>
              </span>
            </div>
            <div class="topTile_Rigt">
              <!-- <a href="{:url('cart/index')}">购物车  <span>( {$cartinfo} )</span></a>&nbsp;&nbsp;&nbsp; -->
              <div style="float:left;">
                <span>客服热线：0755-36567904 </span>
                <span>18820487869</span>
              </div>
              <div class="shoppingCat">
                <el-menu mode="horizontal" class="userNav-index cart-index-nav" router active-text-color="#666" text-color="#666" background-color="#ececec">
                  <el-submenu index="1" popper-class="popUserNav-index">
                    <template slot="title"><i class="el-icon-shopping-cart-1"></i><router-link to="/cart/index">购物车</router-link></template>
                    <el-menu-item index="/cart/index">购物车 ({{ $store.getters.cartNum }})</el-menu-item>
                    <!--                    <el-menu-item index="/cart/proof">打样购物车 ({{ $store.getters.proofCartNum }})</el-menu-item>-->
                  </el-submenu>
                </el-menu>
              </div>
            </div>
          </div>
        </div>
        <div class="container">
          <div class="logos">
            <a href="/"></a>
          </div>
          <div class="mainMenu" id="J_mainMenu">
            <div class="progress_inner">
              <dl :class="[isCurrent >= 1 ? 'progress_step curr' : 'progress_step']">
                <dt :class="[isCurrent >= 1 ? 'prg_spn current' : 'prg_spn']">1</dt>
                <dd for="step-1">选择产品</dd>
                <p class="progress_bar"></p>
                <p class="progress_cur_bar"></p>
              </dl>

              <dl :class="[isCurrent >= 2 ? 'progress_step curr' : 'progress_step']">
                <dt :class="[isCurrent >= 2 ? 'prg_spn current' : 'prg_spn']">2</dt>
                <dd for="step-2">确认订单信息</dd>
                <p class="progress_bar"></p>
                <p class="progress_cur_bar"></p>
              </dl>

              <dl :class="[isCurrent >= 3 ? 'progress_step curr' : 'progress_step']">
                <dt :class="[isCurrent >= 3 ? 'prg_spn current' : 'prg_spn']">3</dt>
                <dd for="step-3">下单支付</dd>
                <p class="progress_bar"></p>
                <p class="progress_cur_bar"></p>
              </dl>

              <dl :class="[isCurrent >= 4 ? 'progress_step curr' : 'progress_step']">
                <span :class="[isCurrent >= 4 ? 'prg_spn current' : 'prg_spn']">4</span>
                <dd for="step-4">上传文件</dd>
                <p class="progress_bar"></p>
                <p class="progress_cur_bar"></p>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!--顶部结束-->
    </el-header>
    <el-container class="allChange_key" style="margin-top:25px;">
      <el-main class="login-main">
        <router-view />
      </el-main>
    </el-container>
    <el-footer class="footer">
      <foot-top></foot-top>
      <foot-bottom></foot-bottom>
    </el-footer>
  </el-container>
</template>
<script>
import FootTop from '@/components/footer/FootTop';
import FootBottom from '@/components/footer/FootBottom';
import store from '@/store';
import { mapActions } from 'vuex';
import { ACCESS_TOKEN } from '@/store/global-constant';
import { encodingMobile } from '@/utils/strUtil';
import router from '@/router';
export default {
  components: {
    FootTop,
    FootBottom
  },
  name: 'HeaderUser',
  data() {
    return {
      userInfo: null,
      isCurrent: 1
    };
  },
  created() {
    this.getUserInfo();
    this.setCurrent();
  },
  watch: {
    $route() {
      this.setCurrent();
    }
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
    setCurrent() {
      this.isCurrent = 1;
      var path = this.$route.path;
      console.log(22222, path);
      var routePath2 = ['/cart/checkedition', '/cart/checkproof', '/order/requrchaseOrder'];
      if (routePath2.indexOf(path) > -1) {
        this.isCurrent = 2;
      }
      var routePath3 = ['/service/getpay', '/service/getcylpay', '/service/getinvoicepay','/service/GetcylpayTogether'];
      if (routePath3.indexOf(path) > -1) {
        this.isCurrent = 3;
      }
      var routePath4 = ['/order/getfile'];
      if (routePath4.indexOf(path) > -1) {
        this.isCurrent = 4;
      }
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
<style scoped src="../static/index/css/common.css" />
<style scoped src="../static/index/css/shopping.css" />
<style scoped src="../static/mulindex/css/public.css"></style>
<style scoped src="../static/mulindex/css/fonts.css"></style>
<style scoped src="../static/index/user/css/all.css" />
<!--<style scoped src="../static/index/css/main.css" />-->
<style scoped src="../static/login.css" />
<style src="../static/index/user/css/reset.css" />
<style lang="scss" src="../components/top-nav.scss"></style>
