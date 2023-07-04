<!-- fengjianbo -->
<template>
  <div id="topBox">
    <div class="flex comBox">
      <div class="logo">
        <a href="/"><img src="@/static/mulindex/img/logo.gif"/></a>
      </div>
      <div class="topRight" style="display:flex;justify-content: flex-end;">
        <ul class="flex fl topNav" style="margin-right:40px;">
          <li v-for="(item, index) in navs" :key="index" :class="select($route.path.indexOf(item.curUrl))">
            <div v-if="item.curUrl === '/zbz'" :class="{ menuZbz: isZbzPage($route.path) }">
              <a :href="item.param == null ? item.url : item.url + '?' + item.param" target="_blank">{{ item.name }}</a>
              <!-- 菜单导航栏 -->
              <multi-level-menu class="LookNav hide"></multi-level-menu>
            </div>
            <div v-else>
              <a :href="item.param == null ? item.url : item.url + '?' + item.param" target="_blank">{{ item.name }}</a>
            </div>
          </li>
        </ul>
        <div class="fr topCart">
          <el-menu router default-active="/cart/index" class="cart-nav" mode="horizontal" active-text-color="#fff" text-color="#fff" background-color="#d0514e">
            <el-submenu index="/cart/index">
              <template slot="title">
                <i class="el-icon-shopping-cart-full"></i>购物车<em>{{ $store.getters.cartNum }}</em>
              </template>
              <el-menu-item index="/cart/index">购物车 ({{ $store.getters.cartNum }})</el-menu-item>
              <el-menu-item index="/cart/proof">打样购物车 ({{ $store.getters.proofCartNum }})</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MultiLevelMenu from '@/views/zbz/multiLevelMenu/index';

export default {
  name: 'HeaderUser',
  components: {
    MultiLevelMenu
  },
  data() {
    return {
      navs: [
        { name: '首页', url: '/index/index', curUrl: '/index/index' },
        { name: '报价下单', url: '/price/cartIndex', curUrl: '/price', param: 'cateId=1&subCateId=15' },
        // { name: '找包装', url: '/zbz/index', curUrl: '/zbz' },
        { name: '包装方案', url: '/packagingSolution/packagingSolution', curUrl: '/packagingSolution' },
        // { name: '包装方案', url: '/zbz/packageList', curUrl: '/zbz/packageList' },
        // { name: '包装设计', url: '/packing', curUrl: '/packing' },
        { name: '设计打样', url: '/proof/index', curUrl: '/proof', param: 'cateId=1&subCateId=15' },
        { name: '下载刀模', url: '/cutter/index', curUrl: '/cutter', param: 'cateId=1&subCateId=15' },
        // { name: '月饼礼盒', url: '/ironActivity', curUrl: '/ironActivity' },
        // { name: '餐饮包装', url: '/disposable', curUrl: '/disposable' },
        // { name: '下载魔术手', url: '/plug/index', curUrl: '/plug' },
        // { name: '下载模板', url: '/solution/index', curUrl: '/solution' },
        { name: '智能预检', url: '/preview/index', curUrl: '/preview' }
      ],
      cartNum: 0,
      proofCartNum: 0,
      multiMenuShow: false,
      activeIndex: 1,
      // 是否展示多级菜单，路径list，需要的子路径添加到其中
      showZbzMultiLevelMenu: '/zbz',
      showPriceMultiLevelMenu: ['/price'],
      newHappy: true
    };
  },

  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    select(isSel) {
      let lt = isSel !== -1 ? 'curr' : '';
      return lt;
    },
    isZbzPage(path) {
      // console.log('00000000000');
      if (path.indexOf(this.showZbzMultiLevelMenu) !== -1) {
        return true;
      }
      return false;
    },
    isPricePage(path) {
      // console.log('00000000000');
      if (path.indexOf(this.showPriceMultiLevelMenu) !== -1) {
        return true;
      }
      return false;
    },
    /**
     * 存在于list中
     * @param _list 列表
     * @param _el 元素
     */
    existList(_list, _el) {
      for (let _li of _list) {
        if (_li === _el) {
          return true;
        }
      }
      return false;
    }
  }
};
</script>
<style scoped>
.menuZbz {
  position: relative;
}
</style>
<style src="../../static/mulindex/css/fonts.css" />
