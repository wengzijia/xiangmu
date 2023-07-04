<template>
  <div class="detasTop">
    <el-row class="comBox">
      <el-col class="detasTlt" :span="18">
        <span>{{ title.before }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>{{ title.after }}</span>
      </el-col>
      <el-col class="tx-right detasTrg" :span="6">
        <el-link @click="toPay" :class="{ curr: isSelectedPay(this.$route) }">立即购买</el-link>
        <!-- <el-divider direction="vertical"></el-divider>
        <el-link>在线设计</el-link> -->
        <el-divider direction="vertical"></el-divider>
        <!-- <el-button type="danger" size="mini" @click="toPay">立即购买</el-button> -->
        <el-link @click="toOutLine" :class="{ curr: isSelected(this.$route) }">方案详细</el-link>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { resultHandler } from '@/utils/zbz/zbzUtil';
import { getProductTitle } from '@/api/zbz/zbzProductApi';

export default {
  name: 'DetailNav',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  computed: {
    // 商品标题
    activeTitle: function() {
      let _pro = this.product;
      let title = { before: '', after: '' };
      if (_pro) {
        title['before'] = _pro.categoryTitle + ' ' + _pro.subCategoryTitle + '-' + _pro.productTitle;
        title['after'] = _pro.unitValue + _pro.unitName;
      }
      return title;
    }
  },
  data() {
    return {
      product: '',
      title: { after: '', before: '' }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getTitle();
    },
    getTitle() {
      let data = {
        data: this.id,
        language: 'zh-cn'
      };
      getProductTitle(data).then(res => {
        this.product = resultHandler(res);
        this.setTitle();
        // console.log('product', this.title);
      });
    },
    // 获取标题的方法
    setTitle() {
      let _pro = this.product;
      let _title = { before: '', after: '' };
      if (_pro) {
        _title['before'] = _pro.categoryTitle + ' ' + _pro.subCategoryTitle + '-' + _pro.productTitle;
        _title['after'] = _pro.unitValue + _pro.unitName;
      }
      this.title = _title;
    },
    // 跳转到概述页面
    toOutLine() {
      this.$router.push({ path: '/zbz/detail', query: { id: this.id } }).catch(err => {
        err;
      });
    },
    // 跳转支付页面
    toPay() {
      this.$router.push({ path: '/zbz/buynow', query: { id: this.id } }).catch(err => {
        err;
      });
    },
    // 是否是当前页面
    isSelected(_route) {
      if (_route.path === '/zbz/detail') {
        return true;
      }
      return false;
    },
    // 是否是立即购买页
    isSelectedPay(_route) {
      if (_route.path === '/zbz/buynow') {
        return true;
      }
      return false;
    }
  },
  watch: {
    id: function() {
      this.init();
    }
  }
};
</script>
<style lang="scss" scoped></style>
<style scoped src="@/static/mulindex/css/fonts.css" />
<style scoped src="@/static/mulindex/css/shop.css" />
