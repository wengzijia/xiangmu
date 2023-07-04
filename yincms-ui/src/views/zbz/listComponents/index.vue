<template>
  <div class="graybj" id="app">
    <el-main class="comBox axnMain">
      <el-breadcrumb class="crumb">
        <el-breadcrumb-item><em class="icon icon-locat"></em>您当前的位置：</el-breadcrumb-item>
        <el-breadcrumb-item>{{ zbzCate.title }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ zbzSubCate.title }}</el-breadcrumb-item>
      </el-breadcrumb>

      <ul class="axLsaBox">
        <li>
          <span class="axLsaLt">类目:</span>
          <div class="axLsaRt">
            <el-button
              @click="
                queryData.categoryId = '';
                queryData.isPid = false;
                queryData.pageNumber = 1;
                queryData.cateId = '';
                queryData.unitName = '';
                queryData.unitValue = '';
              "
              :class="!queryData.categoryId || queryData.isPid == true ? 'curr' : ''"
              type="text"
              >全部</el-button
            >
            <el-button
              v-for="(item, index) in zbzSubCateList"
              :key="index"
              @click="
                queryData.categoryId = item.id;
                queryData.isPid = false;
                queryData.pageNumber = 1;
                queryData.cateId = '';
                queryData.unitName = '';
                queryData.unitValue = '';
              "
              :class="item.id == queryData.categoryId && queryData.isPid == false ? 'curr' : ''"
              type="text"
            >
              {{ item.title }}</el-button
            >
          </div>
        </li>
        <li>
          <span class="axLsaLt">类型:</span>
          <div class="axLsaRt">
            <el-button
              @click="
                queryData.cateId = '';
                queryData.pageNumber = 1;
                queryData.unitName = '';
                queryData.unitValue = '';
              "
              :class="!queryData.cateId ? 'curr' : ''"
              type="text"
              >全部</el-button
            >
            <el-button
              v-for="(item, index) in cateList"
              :key="index"
              @click="
                queryData.cateId = item.cateId;
                queryData.pageNumber = 1;
                queryData.unitName = '';
                queryData.unitValue = '';
              "
              :class="item.cateId == queryData.cateId ? 'curr' : ''"
              type="text"
            >
              {{ item.cateName }}</el-button
            >
          </div>
        </li>
        <li>
          <span class="axLsaLt">规格:</span>
          <div class="axLsaRt">
            <el-button
              @click="
                queryData.unitName = '';
                queryData.unitValue = '';
                queryData.pageNumber = 1;
              "
              :class="!queryData.unitName && !queryData.unitValue ? 'curr' : ''"
              type="text"
              >全部</el-button
            >
            <el-button
              v-for="(item, index) in unitList"
              :key="index"
              @click="
                queryData.unitName = item.unitName;
                queryData.unitValue = item.unitValue;
                queryData.pageNumber = 1;
              "
              :class="item.unitName == queryData.unitName && item.unitValue == queryData.unitValue ? 'curr' : ''"
              type="text"
            >
              {{ item.unitValue }}{{ item.unitName }}</el-button
            >
          </div>
        </li>
      </ul>

      <el-row class="axLsort flex">
        <el-col :span="12" class="axLsortL">
          <el-button-group>
            <el-button @click="queryData.orderByType = ''" size="mini">综合</el-button>
            <el-button @click="queryData.orderByType = 'sale'" size="mini">销量</el-button>
            <el-button
              class="priceAbnt"
              size="mini"
              @click="
                queryData.orderByType = priceOrderByAsc ? 'price_asc' : 'price_desc';
                priceOrderByAsc = !priceOrderByAsc;
              "
            >
              价格
              <i :class="priceOrderByAsc ? 'el-icon-caret-top curr' : 'el-icon-caret-top'"></i>
              <i :class="priceOrderByAsc ? 'el-icon-caret-bottom' : 'el-icon-caret-bottom curr'"></i>
            </el-button>
          </el-button-group>
        </el-col>
        <el-col :span="12" class="axLsortR">
          <span class="axLsortRspn"
            >共 <span>{{ totalCount }}</span> 件相关商品</span
          >
          <span class="axLsortRspn"
            ><b>{{ queryData.pageNumber }}</b
            >/{{ Math.ceil(totalCount / queryData.pageSize) }}</span
          >
          <el-button-group>
            <el-button @click="queryData.pageNumber--" class="ative" size="mini" icon="el-icon-arrow-left"></el-button>
            <el-button @click="queryData.pageNumber++" size="mini" icon="el-icon-arrow-right"></el-button>
          </el-button-group>
        </el-col>
      </el-row>

      <div class="axnWrap">
        <el-row :gutter="10">
          <el-col class="axnEcol" :span="6" v-for="(vo, index) in productList" :key="index">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div @click="routeToProduct(vo.id)">
                <p class="axnEcoImg"><img :src="alifileUrl + vo.facePath8" /></p>
                <div class="axnEcoltx">
                  <h3>{{ vo.title }}</h3>
                  <div class="flex axnEcolBt">
                    <span class="axnEcolBtsp"><i>￥</i>{{ vo.price }}</span>
                    <el-button type="text" class="button">30天成交{{ vo.salesCount / 10000 }}万</el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-pagination background class="axnPag" @current-change="handleCurrentChange" :current-page="queryData.pageNumber" :page-size="queryData.pageSize" layout="total, prev, pager, next, jumper" :total="totalCount"> </el-pagination>
      </div>
    </el-main>
  </div>
</template>
<script>
import { getProductList, getUnitList, groupCateList } from '@/api/zbz/zbzProductApi';
import { getById, getCateList } from '@/api/zbz/zbzCateApi';

export default {
  name: 'ZbzList',
  data() {
    return {
      alifileUrl: 'http://alifile.xiaocaiyin.com/',
      zbzCate: {
        id: 1,
        title: ''
      },
      zbzSubCate: {
        id: 0,
        title: ''
      },
      zbzSubCateList: [],
      cateList: [],
      unitList: [],
      productList: [],
      totalCount: 0,
      priceOrderByAsc: true,
      queryData: {
        isPid: true,
        cateId: '',
        categoryId: '',
        unitName: '',
        unitValue: '',
        language: 'zh-cn',
        pageNumber: 1,
        pageSize: 16,
        orderByType: '' //price:价格升序,sale:销量倒序,其他为创建时间倒序
      }
    };
  },
  methods: {
    initBreadcrumb() {
      this.getCateTitle(this.zbzCate);
      this.getCateTitle(this.zbzSubCate);
    },
    routeToProduct(id) {
      this.$router.push({ path: '/zbz/buynow', query: { id: id } });
    },
    handleCurrentChange(pageNumber) {
      this.queryData.pageNumber = pageNumber;
    },
    getProductList() {
      getProductList(this.queryData)
        .then(res => {
          this.totalCount = res.totalCount;
          this.productList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    initUnitList() {
      getUnitList(this.queryData)
        .then(res => {
          this.unitList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    initCateList() {
      groupCateList(this.queryData)
        .then(res => {
          this.cateList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    initZbzSubCateList() {
      getCateList({
        language: 'zh-cn',
        pid: this.zbzCate.id
      })
        .then(res => {
          this.zbzSubCateList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getCateTitle(cate) {
      if (cate.id) {
        getById({
          data: cate.id,
          language: 'zh-cn'
        })
          .then(res => {
            if (res.data) {
              cate['title'] = res.data.title;
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        cate.title = '';
      }
    }
  },
  created() {
    this.zbzCate.id = this.$route.query.zbzCateId ? this.$route.query.zbzCateId : 1;
    this.zbzSubCate.id = this.$route.query.zbzSubCateId ? this.$route.query.zbzSubCateId : 0;
    if (this.zbzSubCate.id) {
      this.queryData.isPid = false;
      this.queryData.categoryId = this.zbzSubCate.id;
    } else {
      this.queryData.isPid = true;
      this.queryData.categoryId = this.zbzCate.id;
    }
    this.initBreadcrumb();
    this.initZbzSubCateList();
    this.getProductList();
    this.initCateList();
    this.initUnitList();
  },
  watch: {
    queryData: {
      handler() {
        this.initCateList();
        this.initUnitList();
        this.getProductList();
        if (!this.queryData.isPid) {
          this.zbzSubCate.id = this.queryData.categoryId;
        } else {
          this.zbzSubCate.id = 0;
        }
      },
      deep: true
    },
    'zbzSubCate.id': {
      handler() {
        this.initBreadcrumb();
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>
<style scoped src="@/static/mulindex/css/fonts.css" />
<style scoped src="@/static/mulindex/css/shop.css" />
