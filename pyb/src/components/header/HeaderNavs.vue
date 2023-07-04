<!-- fengjianbo -->
<template>
  <div id="topBox">
    <div class="flex comBox">
      <div class="logo">
        <a href="/"><img src="@/static/mulindex/img/logo.gif"/></a>
      </div>
      <div class="topRight">
        <ul class="flex fl topNav" style="padding-left: 200px">
          <li v-for="(item, index) in navs" :key="index" :class="$route.path.indexOf(item.curUrl) !== -1 ? 'curr' : ''">
            <a :href="item.param == null ? item.url : item.url + '?' + item.param" target="_blank">{{ item.name }}</a>
          </li>
        </ul>

        <div class="fr topCart">
          <router-link to="/cart/index"><i class="el-icon-shopping-cart-full"></i><span style="color:#fff;font-size: 14px;">购物车</span></router-link>
          <em>{{ $store.getters.cartNum }}</em>
          <!-- <el-menu router default-active="/cart/index" class="cart-nav" mode="horizontal" active-text-color="#fff" text-color="#fff" background-color="#d0514e"> -->
          <!-- <el-submenu index="1"> -->
          <!-- <template slot="title">
          <i class="el-icon-shopping-cart-full"></i><span style="color:#fff;font-size: 14px;">购物车</span>
          <em>{{ $store.getters.cartNum }}</em>
          </template> -->
          <!-- <el-menu-item index="/cart/index">购物车 ({{ $store.getters.cartNum }})</el-menu-item> -->
          <!--              <el-menu-item index="/cart/proof">打样购物车 ({{ $store.getters.proofCartNum }})</el-menu-item>-->
          <!-- </el-submenu> -->
          <!-- </el-menu> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderUser',
  data() {
    return {
      navs: [
        // { name: '首页', url: '/index/index' },
        { name: '单款报价', url: '/price/cartIndex', curUrl: '/price', param: 'cateId=1&subCateId=15' },
        { name: '整版报价', url: '/full/fullPageIndex', curUrl: '/full' },
        { name: '下载刀模', url: '/cutter/index', curUrl: '/cutter', param: 'cateId=1&subCateId=15' },
        { name: '下载魔术手', url: '/plug/index', curUrl: '/plug' }
        // { name: '下载模板', url: '/solution/index', curUrl: '/solution' }
      ],
      cartNum: 0,
      proofCartNum: 0
    };
  }
};
</script>
<style>
.el-icon-shopping-cart-full {
  /* width: 19px;
    height: 18px; */
  color: #fff;
  font-size: 18px;
  margin-right: 10px;
}
.topRight {
  display: flex;
  justify-content: space-between;
}
/* .topCart{
    margin-left: 28px;
} */
</style>
<style src="../../static/mulindex/css/fonts.css" />
