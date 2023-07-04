<template>
  <div class="graybj" id="app">
    <!-- 商品详情共享部分 -->
    <detail-nav :id="goodsId"></detail-nav>

    <el-main class="comBox axnMain">
      <!--  轮播图  -->
      <zbz-index-banner :dataArray="indexList" :divClass1="'detasBanner'"></zbz-index-banner>

      <div class="detasGorup" v-html="content"></div>
      <!-- <div class="flex detastop">
        <div class="detastopLt">
          <img src="" width="130" height="150" />
          <p>化妆洗护包装顾问</p>
        </div>
        <div class="detastopRt">
          面膜包装：阻隔空气性能强、防氧化、防水、防潮、避光性能和热封性能避免面膜里面的有效成分散失，从而影响到面膜的功效避免面膜里面的有效成分散失，从而影响到面膜的功效
        </div>
      </div>
      <div class="demo-image__lazy detasGorup">
        <el-image></el-image>
      </div> -->
      <!--更多推荐-->
      <div class="axnWrap">
        <span class="titles">更多包装方案推荐</span>
        <el-row :gutter="10">
          <el-col class="axnEcol" :span="6" v-for="(vo, index) in productList" :key="index">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div @click="routeToProduct(vo.id)">
                <p class="axnEcoImg"><img :src="alifileUrl + vo.coverPath1" /></p>

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
      </div>
    </el-main>
    <!--返回顶部-->
    <el-backtop id="backtop" :bottom="100">
      <a><i class="el-icon-upload2"></i>回顶部</a>
    </el-backtop>
  </div>
</template>
<script>
import DetailNav from './detailNav/index';
import ZbzIndexBanner from '../indexComponents/ZbzIndexBanner';
import { getProductById, getRecommendList } from '@/api/zbz/zbzProductApi';

export default {
  name: 'Detail',
  components: {
    DetailNav,
    ZbzIndexBanner
  },
  data() {
    return {
      alifileUrl: 'http://alifile.xiaocaiyin.com/',
      // 商品id
      goodsId: '',
      // 轮播图片 [{href: '', coverPath: ''}]
      indexList: [],
      productList: [],
      content: ''
    };
  },
  created() {
    this.init();
    getProductById({ data: this.goodsId })
      .then(res => {
        this.$set(this, 'content', res.data.description);
        console.log(res.data);
        this.$set(this, 'indexList', this.setCoverPathList(res.data));
      })
      .catch(err => {
        console.log(err);
      });
    getRecommendList(this.queryData)
      .then(res => {
        this.productList = res.data;
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    // 设置轮播图列表
    setCoverPathList(_attributes) {
      // 遍历属性
      let _list = [];
      for (let _attr in _attributes) {
        if (_attr.indexOf('coverPath') != -1) {
          let _el = {};
          _el['coverPath'] = _attributes[_attr];
          if (_el['coverPath']) {
            _list.push(_el);
          }
        }
      }
      return _list;
    },
    init() {
      let _id = this.$route.query.id;
      if (_id) {
        this.goodsId = _id;
      }
    },
    routeToProduct(id) {
      this.$router.push({ path: '/zbz/detail', query: { id: id } });
    },
    getProductById() {
      console.log(this.goodsId);
      getProductById({ data: this.goodsId })
        .then(res => {
          this.$set(this, 'content', res.data.description);
          this.$set(this, 'indexList', this.setCoverPathList(res.data));
        })
        .catch(err => {
          console.log(err);
        });
    },
    getRecommendList() {
      getRecommendList(this.queryData)
        .then(res => {
          this.productList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    $route(to) {
      this.init();
      this.getProductById();
      this.getRecommendList();
    }
  }
};
</script>
<style>
.detasBanner .el-carousel__indicators--outside {
  position: absolute;
  bottom: 10px;
  width: 100%;
  left: 0;
}
</style>
<!--<style>
.dsTbaner2 .el-carousel__container {
  height: 450px !important;
}
.dsTbaner2 .el-carousel__indicators--outside {
  position: absolute;
  bottom: 10px;
  width: 100%;
  left: 0;
}
.dsTbaner2 .el-carousel--horizontal {
  width: 100%;
}
</style>-->
<style scoped src="@/static/mulindex/css/fonts.css" />
<style scoped src="@/static/mulindex/css/shop.css" />
