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
      <el-main class="login-main" style="padding-left: 10px; width:500px">
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
  name: 'myDesign'
};
</script>

<style scoped src="../static/mulindex/css/public.css"></style>
<style scoped src="../static/mulindex/css/fonts.css"></style>
<style scoped src="../static/index/user/css/all.css" />
<!--<style scoped src="../static/index/css/main.css" />-->
<style scoped src="../static/login.css" />
<style src="../static/index/user/css/reset.css" />
