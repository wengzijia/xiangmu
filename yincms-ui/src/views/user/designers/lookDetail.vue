<!-- fengjianbo -->
<template>
  <el-container class="login" style="background-color: #eff2f9 ;position: relative;">
    <el-header class="header-nav" style="height: auto;">
      <header-user-nav-top></header-user-nav-top>
      <header-user-nav-bottom></header-user-nav-bottom>
    </el-header>
    <el-container class="allChange_key" style="margin-top:25px;">
      <el-main class="login-main" style="padding-left: 10px; width:500px">
        <div class="designContract">
          <h2>
            查看详情
          </h2>
          <div class="content">
            内容
          </div>
        </div>
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
    return {};
  },
  methods: {}
};
</script>
<style scoped>
.designContract {
  background: #fff;
  padding: 20px;
}
.designContract h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 26px;
}
.content {
  font-size: 16px;
  color: #999999;
}
.define {
  color: #333333;
  padding: 4px;
  margin: 20px 0;
  border-bottom: 1px solid #f1f1f1;
}
.designContract .textIndent {
  text-indent: 2em;
  line-height: 32px;
}
.uls {
  margin-top: 90px;
  display: flex;
  justify-content: space-between;
  color: #333333;
  padding: 30px;
}
.uls li {
  flex: 1;
  line-height: 40px;
}
</style>
<style scoped src="@/static/mulindex/css/public.css"></style>
<style scoped src="@/static/mulindex/css/fonts.css"></style>
<style scoped src="@/static/index/user/css/all.css" />
<!--<style scoped src="../../static/index/css/main.css" />-->
<style scoped src="../../../static/login.css" />
<style src="../../../static/index/user/css/reset.css" />
