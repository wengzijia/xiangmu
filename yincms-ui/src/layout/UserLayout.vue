<!-- fengjianbo -->
<template>
  <el-container class="login" style="background-color: #eff2f9 ;position: relative;">
    <el-header class="header-nav" style="height: auto;">
      <header-user-nav-top></header-user-nav-top>
      <header-user-nav-bottom></header-user-nav-bottom>
    </el-header>
    <el-container class="allChange_key" style="margin-top:25px;">
      <el-aside width="210px">
        <div class="left_list">
          <div class="leftOne">
            <div class="head_font">
              <h1>我的订单</h1>
            </div>
            <div class="smallList">
              <ul>
                <li :class="$route.path.indexOf('/user/orderlist') !== -1 ? 'select_List' : ''">
                  <router-link to="/user/orderlist"><b class="icon icon-idcard"></b>大货订单</router-link>
                </li>
                <!-- <li :class="$route.path.indexOf('user/designerlist') !== -1 ? 'select_List' : ''">
                  <router-link to="/user/designerlist"><b class="icon icon-filedone"></b>设计订单</router-link>
                </li> -->
                <li :class="$route.path.indexOf('user/inquirylist') !== -1 ? 'select_List' : ''">
                  <router-link to="/user/inquirylist"><b class="icon icon-inquiry"></b>询价订单</router-link>
                </li>
                <li :class="$route.path.indexOf('user/offlineOrderlist') !== -1 ? 'select_List' : ''">
                  <router-link to="/user/offlineOrderlist"><b class="icon icon-offline"></b>线下报价订单</router-link>
                </li>
                <li :class="$route.path.indexOf('user/demandlist') !== -1 ? 'select_List' : ''">
                  <router-link to="/user/demandlist"><b class="icon icon-filedone"></b>打样订单</router-link>
                </li>
                <li :class="$route.path.indexOf('/user/templatelist') !== -1 ? 'select_List' : ''">
                  <router-link to="/user/templatelist"><b class="icon icon-audit"></b>模版订单</router-link>
                </li>
                <li :class="$route.path.indexOf('/user/designerlist') !== -1 ? 'select_List' : ''">
                  <router-link to="/user/designerlist"><b class="icon icon-ic_design"></b>设计订单</router-link>
                </li>
                <!--<li class="">
                  <a href="/index.php/index/user/offline_factory.html"><b class="icon icon-solution"></b>线下报价</a>
                </li>-->
                <li :class="$route.path.indexOf('user/userAddressList') !== -1 ? 'select_List' : ''">
                  <router-link to="/user/userAddressList"><b class="icon icon-map1"></b>收货地址</router-link>
                </li>
                <li :class="$route.path.indexOf('/user/designAddress') !== -1 ? 'select_List' : ''">
                  <router-link to="/user/designAddress"><b class="icon icon-map2"></b>打样地址</router-link>
                </li>
              </ul>
            </div>
          </div>

          <div class="leftOne leftTwo">
            <div class="head_font">
              <h1>我的资产</h1>
            </div>
            <div class="smallList">
              <ul>
                <li :class="$route.path.indexOf('user/balance') !== -1 ? 'select_List' : ''">
                  <router-link to="/user/balance"><b class="icon icon-cont"></b>账户余额</router-link>
                </li>
                <li :class="$route.path.indexOf('user/userBonusList') !== -1 ? 'select_List' : ''">
                  <router-link to="/user/userBonusList"><b class="icon icon-coupon"></b>我的优惠券</router-link>
                </li>
                <li :class="$route.path.indexOf('user/userBonusExchange') !== -1 ? 'select_List' : ''">
                  <router-link to="/user/userBonusExchange"><b class="icon icon-coupon"></b>兑换优惠券</router-link>
                </li>
              </ul>
            </div>
          </div>
          <div class="leftOne leftTwo">
            <div class="head_font">
              <h1>我的资料</h1>
            </div>
            <div class="smallList">
              <ul>
                <li :class="$route.path.indexOf('user/invoice') !== -1 ? 'select_List' : ''">
                  <router-link to="/user/invoice"><b class="icon icon-detail"></b>发票信息</router-link>
                </li>
                <li :class="$route.path.indexOf('user/aptitude') !== -1 ? 'select_List' : ''">
                  <router-link to="/user/aptitude"><b class="icon icon-idcard"></b>资质资料</router-link>
                </li>
                <li :class="$route.path.indexOf('/user/editprofile') !== -1 ? 'select_List' : ''">
                  <router-link to="/user/editprofile"><b class="icon icon-setting"></b>账户设置</router-link>
                </li>
                <li :class="$route.path.indexOf('user/editpassword') !== -1 ? 'select_List' : ''">
                  <router-link to="/user/editpassword"><b class="icon icon-pass"></b>修改密码</router-link>
                </li>
              </ul>
            </div>
          </div>
          <div class="leftOne leftTwo">
            <div class="head_font">
              <h1>我的设计</h1>
            </div>
            <div class="smallList">
              <ul>
                <li :class="$route.path.indexOf('user/myTask') !== -1 ? 'select_List' : ''">
                  <router-link to="/user/myTask"><b class="icon icon-task"></b>我的任务</router-link>
                </li>
                <li :class="$route.path.indexOf('user/financial') !== -1 ? 'select_List' : ''">
                  <router-link to="/user/financial"><b class="icon icon-finance"></b>财务结算</router-link>
                </li>
                <li :class="$route.path.indexOf('user/certifiedDesigner') !== -1 ? 'select_List' : ''">
                  <router-link to="/user/certifiedDesigner"><b class="icon icon-designer"></b>认证设计师</router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-aside>
      <el-main class="login-main" style="padding-left: 10px; ">
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
import HeaderUserNavTop from '@/components/header/HeaderUserNavTop';
import HeaderUserNavBottom from '@/components/header/HeaderUserNavBottom';
export default {
  components: {
    FootTop,
    FootBottom,
    HeaderUserNavTop,
    HeaderUserNavBottom
  },
  name: 'IndexLayout',
  data() {
    return {
      newHappy: true
    };
  },
  created() {
    // console.log('$route.name', this.$route.name);
    console.log('$route.path', this.$route.path);
    // 判断是否显示左右两边的新年烟花
    if (this.$route.path == '/index/index' || this.$route.path == '/login' || this.$route.path == '/register') {
      this.newHappy = false;
    }
  }
};
</script>
<style scoped src="../static/mulindex/css/public.css"></style>
<style scoped src="../static/mulindex/css/fonts.css"></style>
<style scoped src="../static/index/user/css/all.css" />
<!--<style scoped src="../static/index/css/main.css" />-->
<style scoped src="../static/login.css" />
<style src="../static/index/user/css/reset.css" />
