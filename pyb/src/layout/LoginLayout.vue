<!-- fengjianbo -->
<template>
  <el-container class="login">
    <el-header class="header-nav" style="height: auto;">
      <header-user-top></header-user-top>
      <div class="logo_div">
        <div class="content">
          <h1>
            <a href="/">
              <img src="@/static/index/img/logo.png" />
              <img src="@/static/index/img/logo.gif" style="margin-top:15px;" />
            </a>
          </h1>
          <div class="clear"></div>
        </div>
      </div>
    </el-header>
    <el-main class="login-main">
      <router-view />
    </el-main>
    <el-footer class="footer">
      <foot-top></foot-top>
      <foot-bottom></foot-bottom>
    </el-footer>
  </el-container>
</template>
<script>
import HeaderUserTop from '@/components/header/HeaderUserNavTop';
import FootTop from "@/components/footer/FootTop";
import FootBottom from "@/components/footer/FootBottom";
export default {
  components: {
    FootTop, FootBottom, HeaderUserTop
  },
  name: "IndexLayout"
};
</script>
<!--<style scoped src="../static/mulindex/css/public.css" ></style>-->
<style scoped src="../static/index/css/new/public.css" />
<style scoped src="../static/index/css/main.css" />
<style scoped src="../static/login.css" />
