<!-- 包装方案-3C数码专题页 -->
<template>
  <div class="introduction" style="padding-bottom: 0;">
    <div class="i-t-nav">
      <div class="i-t-nav-content">
        <div class="logo">
          <a href="/packagingSolution/packagingSolution" target="_blank"><img src="@/static/pack/logo.png" alt=""/></a>
        </div>
        <div class="search-box" @keydown.enter="searchFun" style="margin-right: 5vw;">
          <input type="text" placeholder="搜索包装方案" v-model="searchVal" />
          <div class="search-btn" @click="searchFun"><img src="@/static/pack/search.png" alt="" /></div>
        </div>
        <!-- <div class="i-t-nav-more">
          <el-popover placement="bottom" width="30vw" trigger="click" class="i-t-nav-more-popover">
            <ul class="i-t-nav-more-list">
              <li class="i-t-nav-more-list-item"><a class="i-t-nav-more-list-item" href="/introduction/wap/pack-makeup">化妆品包装</a></li>
              <li class="i-t-nav-more-list-item"><a class="i-t-nav-more-list-item" href="/introduction/wap/pack-digital">3C数码包装</a></li>
              <li class="i-t-nav-more-list-item"><a class="i-t-nav-more-list-item nav-active" href="/introduction/wap/pack-festival">礼品包装</a></li>
            </ul>
            <div slot="reference">
              <img src="@/static/pack/wap/more.png" alt="" />
              <div>
                更多
              </div>
            </div>
          </el-popover>
        </div> -->
      </div>
    </div>
    <div class="introduction-main" v-infinite-scroll="getPack" :infinite-scroll-disabled="scrollDisabled" style="overflow: auto; height: calc(100vh - 31vw) ">
      <div class="introduction-content">
        <div>
          <div class="i-c-body" style="background: none;padding: 0;">
            <div class="i-c-item-box" style="height: auto;">
              <el-row :gutter="10" v-if="packList.length > 0">
                <el-col :span="12" v-for="(item, index) in packList" :key="index"
                  ><div class="i-c-item" @click="toWapPackageDetails(item)" v-if="item">
                    <div class="i-c-item-img">
                      <el-image :src="baseImgUrl + item.goodsImg.secondThumbnail" style="display: block;" lazy></el-image>
                    </div>
                    <div class="i-c-item-text">
                      <div class="i-c-item-text-title">
                        <div v-html="item.schemeName"></div>
                      </div>
                      <div class="i-c-item-text-content">
                        <span class="i-c-symbol">￥</span><span class="i-c-price">{{ item.price }}</span
                        ><span class="i-c-unit">元 / 套起</span>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <div v-if="noMore" style="text-align: center;margin-top: 5vw;color: #777;">
                没有更多了~
              </div>
              <div v-if="packList.length == 0" style="text-align: center;margin-top: 5vw;color: #777;">
                找不到相关数据~
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <wapFooter></wapFooter>
  </div>
</template>

<style lang="scss" scoped src="./base.scss"></style>
<style lang="scss" scoped>
$input-color: #046f50;
.introduction {
  background: #f5f7fe;
}
// 页面导航

// 页面banner
.banner-box {
  width: 100%;
  position: relative;
  .banner-img {
    width: 100%;
    object-fit: contain;
    display: block;
  }
  .banner-btn {
    position: absolute;
    bottom: 13%;
    width: 100%;
    img {
      width: 30%;
      position: absolute;
      cursor: pointer;
      object-fit: contain;
      // box-shadow: 0px 3px 16px 0px #d38b8e;
      // border-radius: 50px 50px;
      left: 35%;
    }
  }
  .banner-item {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
  }
}

.i-t-form {
  margin: 0 auto;
  .i-t-title {
    .i-t-title-text {
      height: 13vw;
      width: 75vw;
      margin-bottom: 6vw;
      background-image: url('../../../../static/pack/wap/festival/design-title.png');
      background-size: contain;
      color: #ffe4a6;
      div {
        span {
          color: #fffb00;
        }
      }
    }
  }
  .i-t-form-tcontent {
    background: rgba(254, 254, 237, 0.86);

    > div {
      background: #ffffff;
      color: $input-color;

      input {
        color: $input-color;
      }
      input:-moz-placeholder,
      textarea:-moz-placeholder {
        color: $input-color;
      }

      input:-ms-input-placeholder,
      textarea:-ms-input-placeholder {
        color: $input-color;
      }

      input::-webkit-input-placeholder,
      textarea::-webkit-input-placeholder {
        color: $input-color;
      }
    }
  }
}

// 页面主体内容

.introduction-content {
  padding-bottom: 0;
  .i-c-header {
    color: #333333;
    background: url('../../../../static/pack/wap/festival/design-title2.png') no-repeat center;
    background-size: contain;
    color: #ffe4a6;
    width: 75vw;
    height: 13vw;
    line-height: 12vw;
    font-size: 4.2vw;
    font-weight: 500;
    margin-bottom: 6vw;
  }
  .i-c-header-bg2 {
    background: url('../../../../static/pack/wap/festival/design-title.png') no-repeat center;
    background-size: contain;
    width: 90vw;
    height: 13vw;
  }
  .i-c-tabs {
    width: 100%;

    .i-c-tabs-item {
      color: $input-color;
    }
    .i-c-tabs-item.tabs-active,
    .i-c-tabs-item:hover {
      // background-image: url('../../../../static/pack/digital/tabs-item.png');
      color: #ff0024;
    }
    .i-c-more {
      flex: 1;
      text-align: right;
      display: flex;
      justify-content: end;
      align-items: center;
    }
  }
  .i-c-item {
    background-color: rgba(255, 255, 255, 1);

    .i-c-item-img {
    }
    .i-c-item-text-title {
      color: #333333;
    }
    .i-c-item-text-content {
      color: #ff0024;

      .i-c-price {
      }
      .i-c-unit {
        color: #777777 !important;
      }
    }
  }
}
</style>
<style lang="scss">
$popperColor: rgba(0, 0, 0, 0.9);
.el-popover {
  background: $popperColor !important;
  border-color: $popperColor !important;
  .popper__arrow,
  .popper__arrow::after {
    border-bottom-color: $popperColor !important;
  }
}
.i-t-nav-more-list {
  .i-t-nav-more-list-item {
    height: 10vw;
    line-height: 10vw;
    font-size: 5vw;
    color: #fff;
    border-bottom: 1px solid #343434;
    text-indent: 10px;
  }
  .i-t-nav-more-list-item:last-child {
    border-bottom: none;
  }
  .i-t-nav-more-list-item.nav-active {
    color: #e50020;
  }
}
</style>

<script>
import wapFooter from './components/wapFooter.vue';
import { getPackSchemeSearch } from '@/api/zbz/packCategoryApi';
export default {
  components: {
    wapFooter
  },
  data() {
    return {
      packList: [],
      baseImgUrl: 'http://alifile.xiaocaiyin.com/',
      pagePackSchemeParams: {
        pageNumber: 1, //页数
        pageSize: 100, //页大小
        categoryIds: '300,434,243,293'
      },
      pageKeywords: {
        title: '端午礼品包装_免费设计打样_大货100起订 - 傲彩aocai.cn',
        keywords: '端午礼品包装,粽子包装,企业礼品包装',
        description: '傲彩端午礼品包装专题，为客户提供粽子等端午礼品包装设计方案，免费设计打样，在线报价下单，做包装上傲彩。'
      },
      pageNumber: 1,
      noMore: false, //是否触底了
      loading: false,
      schemeParams: {
        baseId: null,
        beginPrice: null,
        categoryId: null,
        endPrice: null,
        formId: null,
        packAttr: null,
        packId: null,
        pageNumber: 1,
        pageSize: 8,
        styleId: null,
        price: null,
        saleCount: null,
        schemeName: '测试',
        sdCategoryId: null
      },
      searchVal: ''
    };
  },
  computed: {
    scrollDisabled() {
      return this.loading || this.noMore;
    }
  },
  methods: {
    toWapPackageDetails(item) {
      window.open(`/introduction/wap/pack-plan?id=${item.id}`);
    },
    getPack() {
      let _this = this;
      _this.loading = true;
      getPackSchemeSearch(_this.schemeParams).then(res => {
        let list = res.data.packSchemeEsList.map(e => {
          if (e.goodsImg) e.goodsImg = JSON.parse(e.goodsImg);
          else {
            e.goodsImg = {};
          }
          return e;
        });
        if (list.length < 8 && list.length > 0) {
          _this.noMore = true;
        }
        _this.packList = _this.packList.concat(list);
        _this.schemeParams.pageNumber++;
        _this.loading = false;
      });
    },
    searchFun() {
      let _this = this;
      if (_this.searchVal != _this.$route.query.schemeName) {
        _this.schemeParams.schemeName = _this.searchVal;
        _this.schemeParams.pageNumber = 1;
        _this.packList = [];
        _this.$router.push({
          path: '/introduction/wap/pack-search',
          query: {
            schemeName: _this.searchVal
          }
        });
        _this.getPack();
      }
    }
  },
  created() {
    let _this = this;
    _this.searchVal = _this.schemeParams.schemeName = _this.$route.query.schemeName || '';
    _this.getPack();
  }
};
</script>
