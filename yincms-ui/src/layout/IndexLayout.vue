<!-- fengjianbo -->
<template>
  <el-container>
    <el-header class="headerBox header-nav" style="height: auto;">
      <header-notice></header-notice>
      <header-user></header-user>
      <header-navs></header-navs>
    </el-header>
    <!-- <el-main  style="position: relative;overflow: hidden;background: #f5f5f5;"> -->
    <el-main :class="newHappy ? 'newYearImg3' : ''" style="position: relative;overflow: hidden;">
      <router-view />
    </el-main>
    <el-footer class="footer" v-if="$route.name != 'packing' && $route.name != 'PackagingDemand'">
      <foot-top></foot-top>
      <foot-bottom></foot-bottom>
    </el-footer>
  </el-container>
</template>
<script>
import HeaderNotice from '@/components/header/HeaderNotice';
import HeaderUser from '@/components/header/HeaderUser';
import HeaderNavs from '@/components/header/HeaderNavs';
import FootTop from '@/components/footer/FootTop';
import FootBottom from '@/components/footer/FootBottom';
export default {
  components: {
    HeaderNotice,
    HeaderUser,
    HeaderNavs,
    FootTop,
    FootBottom
  },
  name: 'IndexLayout',
  data() {
    return {
      newHappy: false
    };
  },
  created() {
    // 判断是否显示左右两边的新年烟花
    if (this.$route.path == '/preview/index') {
      this.newHappy = true;
    }
  }
};
</script>
<style src="../static/mulindex/css/public.css"></style>
<style src="../static/mulindex/css/newYear.css"></style>
