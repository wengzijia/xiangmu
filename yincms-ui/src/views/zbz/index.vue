<template>
  <div class="graybj" id="app">
    <!--banner-->
    <zbz-index-banner :dataArray="indexList" :divClass1="'axnBner'" :divClass2="'axnBwrap'"></zbz-index-banner>
    <!--banner end-->

    <el-main class="comBox axnMain">
      <!--活动专题-->
      <special-events :dataArray="specialList"></special-events>
      <!--活动专题 end-->

      <!-- 热门分类 -->
      <hot-category :dataArray="cateList"></hot-category>
      <!-- 热门分类end -->
    </el-main>

    <!--导航分类-->
    <div class="axnFixed" v-show="false">
      <div class="axnFixedW">
        <div class="axnFixedL">
          <a href="" class="curr"><i class="icon icon-shipin"></i>食品</a>
          <a href=""><i class="icon icon-huaz"></i>化妆品</a>
          <a href=""><i class="icon icon-dianzi"></i>电子产品</a>
          <a href=""><i class="icon icon-yyao"></i>医药保健品</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ZbzIndexBanner from './indexComponents/ZbzIndexBanner';
import SpecialEvents from './indexComponents/SpecialEvents';
import HotCategory from './indexComponents/HotCategory';

import { listAll } from '@/api/zbz/index/indexApi';

export default {
  name: 'ZbzIndex',
  components: {
    ZbzIndexBanner,
    SpecialEvents,
    HotCategory
  },
  data() {
    return {
      // 轮番图片
      indexList: [],
      // 专题活动
      specialList: [],
      // 热门分类
      cateList: []
    };
  },
  created() {
    this.getListAll();
  },
  methods: {
    getListAll() {
      listAll().then(res => {
        if (res.code === '000000') {
          this.indexList = res.data.indexList;
          this.specialList = res.data.specialList;
          this.cateList = res.data.cateList;
          // this.logout(this.indexList, this.specialList, this.cateList);
        }
      });
    },
    logout(...val) {
      for (let _i of val) {
        console.log(_i);
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>
<style scoped src="@/static/mulindex/css/fonts.css" />
<style scoped src="@/static/mulindex/css/shop.css" />
