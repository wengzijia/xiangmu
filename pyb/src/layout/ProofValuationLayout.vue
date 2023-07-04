<template>
  <div class="proofLayout">
    <header-cate :cateType="bindType" :cateId.sync="cateId" :subCateId.sync="subCateId"></header-cate>
    <header-cate-sub v-if="showSubMenu" :bindType="bindType" :cateId.sync="cateId" :subCateId.sync="subCateId"></header-cate-sub>
    <div>
      <router-view />
    </div>
  </div>
</template>

<script>
import HeaderCate from '@/components/header/HeaderCate';
import HeaderCateSub from '@/components/header/HeaderCateSub';
import {strEquals} from "@/utils/strUtil";

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
      bindType: 'proof', // 绑定类型,cate:商品计价
      showSubMenu: true
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
      if (strEquals(this.cateId, '7') || strEquals(this.cateId, '3') || strEquals(this.cateId, '6')) {
        this.showSubMenu = false;
      } else {
        this.showSubMenu = true;
      }
    }
  }
};
</script>
<style src="../static/mulindex/css/attr.css"></style>
<style>
.proofLayout .el-input-group__append {
  width: 25px;
  padding: 0 5px;
  text-align: center;
}
</style>
