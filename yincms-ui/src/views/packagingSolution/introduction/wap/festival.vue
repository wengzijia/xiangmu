<!-- 包装方案-3C数码专题页 -->
<template>
  <div class="introduction">
    <div class="i-t-nav">
      <div class="i-t-nav-content">
        <div class="logo">
          <a href="/packagingSolution/packagingSolution" target="_blank"><img src="@/static/pack/logo.png" alt=""/></a>
        </div>
        <div class="search-box" @keydown.enter="wapSearchFun">
          <input type="text" placeholder="搜索包装方案" v-model="searchVal" />
          <div class="search-btn" @click="wapSearchFun"><img src="@/static/pack/search.png" alt="" /></div>
        </div>
        <div class="i-t-nav-more">
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
        </div>
      </div>
    </div>
    <div class="banner-box">
      <img class="banner-img" src="@/static/pack/wap/festival/banner.png" alt="" />
      <div class="banner-btn ">
        <span @click="qiyu" title="客服" style="display: inline-block;width: 100%;height: 100%;">
          <img class="dom-scale" src="@/static/pack/wap/festival/banner-btn.png" alt="" />
        </span>
      </div>
    </div>
    <div class="introduction-main">
      <div class="introduction-content">
        <div class="i-t-form">
          <div class="i-t-title">
            <div class="i-t-title-text">
              <div>
                今日仅剩<span>6</span>个免费设计名额
              </div>
            </div>
          </div>
          <div class="i-t-form-tcontent">
            <div style="margin:1vw 0 5vw ;">
              <span>输入姓名</span>
              <input type="text" placeholder="锁定优惠资格" v-model="saveParams.customerName" />
            </div>
            <div>
              <span>输入电话</span>
              <input type="text" placeholder="送免费设计服务" v-model="saveParams.mobile" />
            </div>
            <div class="i-t-form-btn">
              <img class="dom-scale" src="@/static/pack/wap/festival/from-btn.png" alt="" @click="save" />
            </div>
          </div>
        </div>
        <div v-for="(item, index) in packList" :key="index">
          <div class="i-c-header">
            {{ item.name }}
          </div>
          <div class="i-c-body" >
            <div class="i-c-tabs" v-if="item.list.length != 1">
              <div v-for="(item2, index2) in item.list" :key="index2" class="i-c-tabs-item" :class="item2.isActive ? 'tabs-active' : ''" @click="activeItem(item, index2)">
                {{ item2.name }}
              </div>
              <!-- <div class="i-c-more">
                <a style=" color: #9792bf !important;font-size: 18px;" :href="'/packagingSolution/packageList?id=' + item.moreId" target="_blank">查看更多>></a>
              </div> -->
            </div>
            <template v-for="(item2, index2) in item.list">
              <div class="i-c-item-box" :key="index2" v-if="item2.isActive && packSchemeInfo[item2.name]">
                <el-row :gutter="10">
                  <el-col :span="12" v-for="(item, index) in packSchemeInfo[item2.name]" :key="index"
                    ><div class="i-c-item" @click="toWapPackageDetails(item)" v-if="item">
                      <div class="i-c-item-img">
                        <el-image :src="baseImgUrl + item.goodsImg.secondThumbnail" style="display: block;" lazy></el-image>
                      </div>
                      <div class="i-c-item-text">
                        <div class="i-c-item-text-title">
                          {{ item.schemeName }}
                        </div>
                        <div class="i-c-item-text-content">
                          <span class="i-c-symbol">￥</span><span class="i-c-price">{{ item.price }}</span
                          ><span class="i-c-unit">元 / 套起</span>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </template>
          </div>
        </div>
        <div>
          <div class="i-c-header">
            设计.打样.大货 一站式服务
          </div>
          <div>
            <img src="@/static/pack/wap/festival/one-stop.png" style="width:100%;object-fit: contain;" alt="" />
          </div>
        </div>
      </div>
    </div>
    <div class="introduction-main">
      <div class="introduction-content" style="width: 100vw;">
        <div>
          <div class="i-c-header i-c-header-bg2">
            三大包装产业园 占地30万平方米
          </div>
          <div>
            <img src="@/static/pack/wap/festival/industrial-park.png" style="width:100%;object-fit: contain;" alt="" />
          </div>
        </div>
      </div>
    </div>
    <div class="introduction-main">
      <div class="introduction-content" style="padding-bottom:10vw;">
        <div>
          <div class="i-c-header">
            已服务全球15万+品牌
          </div>
          <div>
            <img src="@/static/pack/wap/festival/brand.png" style="width:100%;object-fit: contain;" alt="" />
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
  background: #114f44;
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
    background-color: rgba(255, 255, 255, 0.4);

    .i-c-item-img {
    }
    .i-c-item-text-title {
      color: #004a35;
    }
    .i-c-item-text-content {
      color: #ff0024;

      .i-c-price {
      }
      .i-c-unit {
        color: #017150 !important;
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
import qiyu from '@/mixins/qiyu';
import promotionMixins from '../promotionMixins';
import wapFooter from './components/wapFooter.vue';
export default {
  mixins: [promotionMixins, qiyu],
  components: {
    wapFooter
  },
  data() {
    return {
      packList: [
        {
          name: '端午礼品包装',
          moreId: '442',
          isHideHeader: true,
          list: [{ name: '粽子包装', isActive: true, list: ['2020', '2025', '2012', '2013', '2011', '2021', '2024', '2026', '2016', '2017', '2009', '2010', '2014', '2015', '2030', '2027', '2029', '2028', '2022', '2023'] }]
        },
        {
          name: '热门礼品包装方案推荐',
          moreId: '437',
          isHideHeader: true,
          list: [
            { name: '商务礼品', isActive: true, list: ['731', '2185', '640', '2184', '729', '727', '2186', '698', '641', '728', '644', '2187'] },
            { name: '促销礼品', isActive: false, list: ['2149', '2145', '2144', '2139', '2148', '2150', '2147', '2152', '2153', '2141', '2154', '2142'] },
            { name: '庆典礼品', isActive: false, list: ['2108', '2120', '2119', '2161', '2164', '2166', '2162', '2160', '2167', '2106', '2165', '2107'] },
            { name: '中秋礼品', isActive: false, list: ['2072', '2048', '2057', '2052', '2043', '2042', '2053', '2038', '2039', '2078', '2066', '2067'] },
            { name: '春节礼品', isActive: false, list: ['589', '588', '587', '736', '646', '697', '643', '642', '694', '635', '645', '636'] },
            { name: '圣诞礼品', isActive: false, list: ['2098', '2094', '2096', '2158', '2099', '2104', '2101', '2102', '2157', '2103', '2100', '2095'] }
          ]
        }
      ],
      pagePackSchemeParams: {
        pageNumber: 1, //页数
        pageSize: 100, //页大小
        categoryIds: '300,434,243,293'
      },
      pageKeywords: {
        title: '端午礼品包装_免费设计打样_大货100起订 - 傲彩aocai.cn',
        keywords: '端午礼品包装,粽子包装,企业礼品包装',
        description: '傲彩端午礼品包装专题，为客户提供粽子等端午礼品包装设计方案，免费设计打样，在线报价下单，做包装上傲彩。'
      }
    };
  },
  methods: {},
  created() {
    let _this = this;
    _this.saveParams.cateName = '礼品包装';
    _this.saveParams.webCateId = 437;
    _this.saveParams.client = 'WAP'
  }
};
</script>
