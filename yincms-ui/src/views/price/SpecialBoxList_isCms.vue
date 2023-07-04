<!-- fengjianbo -->
<template>
  <div>
    <div class="comBox" v-resize="monResize">
      <div class="specialBox">
        <dl v-for="(item, index) in goodsList" :key="index">
          <dt>
            <img class="smallImg-ul-img_1007" :src="item.photoPath1" />
            <img class="smallImg-ul-img_1007" :src="item.photoPath2" />
            <img class="smallImg-ul-img_1007" :src="item.photoPath3" />
          </dt>
          <dd class="specialTx">
            <h4>{{ item.name }}</h4>
            <p>盒型ID：{{ item.goodsSn }}</p>
          </dd>
          <router-link :to="getUrl(cateId, subCateId, item.id)" class="specialBtn">报价下单</router-link>
        </dl>
      </div>
      <el-row class="pageBox">
        <el-pagination background layout="prev, pager, next" :total="totalCount" :hide-on-single-page="true" :page-size="pageSize" :current-page.sync="pageNumber"> </el-pagination>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getPriceSubCategoryGoods } from '@/api/goods/miniGoodsApi';
import { strEquals } from '@/utils/strUtil';
import { getSessionToken, setSessionToken } from '../../utils/auth';
import entiretyIframe from './mixins/entiretyIframe';
export default {
  mixins: [entiretyIframe],
  data() {
    return {
      goodsList: [],
      curCateId: '',
      listIds: {
        '1_23': '254',
        '2_29': '233',
        '2_30': '231'
      },
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
      bindType: 'cate', // 绑定类型,cate:商品计价
      cateId: '0',
      parentId: '0',
      pagerId: '',
      subCateId: ''
    };
  },
  created() {
    this.getPagerCate();
    this.curCateId = this.listIds[this.cateId + '_' + this.subCateId];
    this.getGoodsList();
  },
  mounted() {},
  watch: {
    pageNumber: {
      handler() {
        this.getGoodsList();
      }
    },
    $route(to) {
      this.getPagerCate();
      this.curCateId = this.listIds[this.cateId + '_' + this.subCateId];
      this.getGoodsList();
    }
  },
  methods: {
    getUrl(cateId, subCateId, goodsId) {
      let token = this.$route.query.token;
      let index = this.$route.query.index || 0;
      if (!getSessionToken() && token) {
        setSessionToken(token);
      }
      // let url = `/isCms/cartIndex?cateId=${cateId}&subCateId=${subCateId}&gid=${goodsId}&isCms=add&token=${token}&flat=false`
      let url = '';
      if (strEquals(cateId, '1')) {
        url = `/isCms/cartIndex?cateId=${cateId}&subCateId=${subCateId}&gid=${goodsId}&isCms=add&token=${token}&flat=false&index=${index}`;
      } else if (strEquals(cateId, '2')) {
        url = `/isCms/index?cateId=${cateId}&subCateId=${subCateId}&gid=${goodsId}&isCms=add&token=${token}&flat=false&index=${index}`;
      }
      if (this.$route.query.isnum) {
        url += '&isnum=true';
      }
      console.log('url-------------', url);
      return url;
    },
    getGoodsList() {
      getPriceSubCategoryGoods({ cateId: this.curCateId, pageNumber: this.pageNumber, pageSize: this.pageSize }).then(res => {
        this.goodsList = res.data;
        this.totalCount = res.totalCount;
      });
    },
    getPagerCate() {
      this.cateId = this.$route.query.cateId;
      if (!this.cateId) {
        this.cateId = '1';
      }
      if (this.$route.query.subCateId) {
        this.subCateId = this.$route.query.subCateId;
      }
    }
  }
};
</script>

<style src="../../static/mulindex/css/public.css"></style>
<style src="../../static/mulindex/css/attr.css"></style>
