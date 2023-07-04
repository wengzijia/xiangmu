<!-- fengjianbo -->
<template>
  <el-container>
    <el-header class="headerBox header-nav" style="height: auto;">
      <!-- <header-notice></header-notice> -->
      <header-user></header-user>
      <header-navs></header-navs>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
    <el-footer class="footer">
      <foot-top></foot-top>
      <foot-bottom></foot-bottom>
    </el-footer>
  </el-container>
</template>
<script>
// import HeaderNotice from "@/components/header/HeaderNotice";
import HeaderUser from '@/components/header/HeaderUser';
import HeaderNavs from '@/components/header/HeaderNavs';
import FootTop from '@/components/footer/FootTop';
import FootBottom from '@/components/footer/FootBottom';
export default {
  components: {
    // HeaderNotice,
    HeaderUser,
    HeaderNavs,
    FootTop,
    FootBottom
  },
  name: 'IndexLayout'
};
</script>
<style src="../static/mulindex/css/public.css"></style>
