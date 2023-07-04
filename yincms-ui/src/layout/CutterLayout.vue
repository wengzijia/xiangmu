<template>
  <div class="cutterLayout">
    <header-cate :cateType="bindType" :cateId.sync="cateId" :subCateId.sync="subCateId"></header-cate>
    <header-cate-sub :bindType="bindType" :cateId.sync="cateId" :subCateId.sync="subCateId"></header-cate-sub>
    <div class="newYearImg newYearImg2">
      <router-view />
    </div>
  </div>
</template>

<script>
import HeaderCate from '@/components/header/HeaderCate';
import HeaderCateSub from '@/components/header/HeaderCateSub';

export default {
  name: 'ValuationLayout',
  components: { HeaderCate, HeaderCateSub },
  created() {
    this.getPagerCate();
  },
  data() {
    return {
      cateId: '0',
      subCateId: '',
      goodsId: '',
      bindType: 'goodsCate' // 绑定类型,cate:商品计价
    };
  },
  watch: {
    $route(to) {
      this.getPagerCate();
    }
  },
  methods: {
    getPagerCate() {
      this.cateId = this.$route.query.cateId;
      if (!this.cateId) {
        this.cateId = '1';
      }
      if (this.$route.query.subCateId) {
        this.subCateId = this.$route.query.subCateId;
      }
      if (!this.subCateId) {
        this.subCateId = '15';
      }
    }
  }
};
</script>
<style src="../static/mulindex/css/attr.css"></style>
<style src="../static/mulindex/css/newYear.css"></style>
<style>
.cutterLayout .el-input-group__append {
  width: 25px;
  padding: 0 5px;
  text-align: center;
}
</style>
