<!-- 包装方案-3C数码专题页 -->
<template>
  <div class="introduction">
    <div class="introduction-main">
      <div class="introduction-content">
        <!-- <div class="i-t-form">
          <div class="i-t-title">
            <div class="i-t-title-text">
              <div>
                今日仅剩<span>6</span>个免费设计名额
              </div>
            </div>
            <div class="i-t-title-list">
              <el-carousel height="24px" direction="vertical" style="width:1000px" indicator-position="none" :autoplay="true">
                <el-carousel-item v-for="(item, index) in carouselList" :key="index">
                  <div style="display: flex;justify-content: space-between;">
                    <div class="i-t-carousel-item" v-for="(item2, index2) in item" :key="index2"><img src="@/static/pack/hot-icon.png" alt="" /> {{ item2.time }}分钟前 {{ item2.name }} {{ item2.mobile }} 已抢免费设计</div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
          <div class="i-t-form-tcontent">
            <div class="i-t-f-c-left">
              <img src="@/static/pack/festival/gift-box.png" alt="" />
            </div>
            <div class="i-t-f-c-right">
              <div style="margin:40px 0;">
                输入姓名<span>|</span>
                <input type="text" placeholder="锁定优惠资格" v-model="saveParams.customerName" />
              </div>
              <div>
                输入电话<span>|</span>
                <input type="text" placeholder="送免费设计服务" v-model="saveParams.mobile" />
              </div>
              <div class="i-t-form-btn dom-scale">
                <img src="@/static/pack/festival/from-btn.png" alt="" @click="save({ actionId: 2, channel: 204001 })" />
              </div>
            </div>
            <div class="i-t-f-c-bottom">
              您的隐私将被严格保密，请放心填写！报名成功后请留意接听傲彩总部0755开头的客服来电，期待为您服务！
            </div>
          </div>
        </div> -->
        <div v-for="(item, index) in packList" :key="index">
          <div class="i-c-header">
            {{ item.name }}
          </div>
          <div class="i-c-tabs" v-if="item.list.length > 1">
            <div v-for="(item2, index2) in item.list" :key="index2" class="i-c-tabs-item" :class="item2.isActive ? 'tabs-active' : ''" @click="activeItem(item, index2)">
              {{ item2.name }}
            </div>
            <div class="i-c-more">
              <a style=" font-size: 18px;" :href="'/packagingSolution/packageList?id=' + item.moreId" target="_blank">查看更多>></a>
            </div>
          </div>
          <template v-for="(item2, index2) in item.list">
            <div :key="index2" v-if="item2.isActive">
              <el-row :gutter="20">
                <el-col :span="6" v-for="(item, index) in packSchemeInfo[item2.name]" :key="index"
                  ><div class="i-c-item" @click="toPackageDetails(item)">
                    <div class="i-c-item-img">
                      <el-image :src="baseImgUrl + item.goodsImg.secondThumbnail" style="display: block;" lazy></el-image>
                      <div class="i-c-item-img-smegma">
                        <div>查看3D效果</div>
                      </div>
                    </div>
                    <div class="i-c-item-text">
                      <div class="i-c-item-text-title">
                        {{ item.schemeName }}
                      </div>
                      <div class="i-c-item-text-content">
                        <span class="i-c-symbol">￥</span> <span class="i-c-price">{{ item.price }}</span
                        ><span class="i-c-unit">元 / 套起</span>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </template>
        </div>
        <div>
          <div class="i-c-header h-bg2" style="margin-top: 60px;margin-bottom: 40px;width: 516px;">
            设计.打样.大货 一站式服务
          </div>
          <div>
            <img src="@/static/pack/festival/one-stop.png" style="width:100%;object-fit: contain;" alt="" />
          </div>
        </div>
      </div>
      <div class="introduction-content" style="width: 100%;padding: 0;">
        <div>
          <div class="i-c-header h-bg2" style="margin-top: 120px;margin-bottom: 60px;width: 516px;">
            三大包装产业园 占地30万平方米
          </div>
          <div>
            <img src="@/static/pack/festival/industrial-park.png" style="width:100%;object-fit: contain;" alt="" />
          </div>
        </div>
      </div>
      <div class="introduction-content">
        <div>
          <div class="i-c-header" style="margin-top: 60px;margin-bottom: 60px;">
            已服务全球15万+品牌
          </div>
          <div>
            <img src="@/static/pack/festival/brand.png" style="width:100%;object-fit: contain;" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import promotionMixins from './promotionMixins';
export default {
  mixins: [promotionMixins],
  data() {
    return {
      packList: [
        {
          name: '端午礼品包装',
          moreId: '442',
          isHideHeader: true,
          channel: 204000,
          list: [{ name: '粽子包装', detailsActionId: 14, isActive: true, list: ['2020', '2025', '2012', '2013', '2011', '2021', '2024', '2026', '2016', '2017', '2009', '2010', '2014', '2015', '2030', '2027', '2029', '2028', '2022', '2023'] }]
        },
        {
          name: '热门礼品包装方案推荐',
          moreId: '437',
          isHideHeader: true,
          moreActionId: 7,
          channel: 204000,
          list: [
            { name: '商务礼品', actionId: 1, detailsActionId: 8, isActive: true, list: ['731', '2185', '640', '2184', '729', '727', '2186', '698', '641', '728', '644', '2187'] },
            { name: '促销礼品', actionId: 2, detailsActionId: 9, isActive: false, list: ['2149', '2145', '2144', '2139', '2148', '2150', '2147', '2152', '2153', '2141', '2154', '2142'] },
            { name: '庆典礼品', actionId: 3, detailsActionId: 10, isActive: false, list: ['2108', '2120', '2119', '2161', '2164', '2166', '2162', '2160', '2167', '2106', '2165', '2107'] },
            { name: '中秋礼品', actionId: 4, detailsActionId: 11, isActive: false, list: ['2072', '2048', '2057', '2052', '2043', '2042', '2053', '2038', '2039', '2078', '2066', '2067'] },
            { name: '春节礼品', actionId: 5, detailsActionId: 12, isActive: false, list: ['589', '588', '587', '736', '646', '697', '643', '642', '694', '635', '645', '636'] },
            { name: '圣诞礼品', actionId: 6, detailsActionId: 13, isActive: false, list: ['2098', '2094', '2096', '2158', '2099', '2104', '2101', '2102', '2157', '2103', '2100', '2095'] }
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
  }
};
</script>

<style lang="scss" scoped src="./base.scss"></style>
<style lang="scss" scoped>
// 页面主体
$font-color: #ffeec8;
.introduction {
  background: #114f44;
}
.introduction-main {
  background: none;
  padding-bottom: 300px;
}
// 页面导航

// 页面banner
.banner-box {
  width: 100%;
  min-width: 1240px;
  position: relative;
  .banner-img {
    width: 100%;
    object-fit: contain;
    display: block;
  }
  .banner-btn3 {
    position: absolute;
    bottom: 20%;
    width: 100%;
    img {
      // width: 302px;
      width: 11%;
      position: absolute;
      cursor: pointer;
      object-fit: contain;
      // box-shadow: 0px 3px 16px 0px #d38b8e;
      box-shadow: inset 0px 2px 3px 0px #fff3f3, inset 0px -1px 0px 0px #ffffff, inset 0px -1px 4px 0px #320204;
      border-radius: 50px 50px;
      left: 45%;
    }
  }
  .banner-item {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
  }
}
$input-color: #006447;
.i-t-form {
  .i-t-title {

    .i-t-title-text {
      background-image: url('../../../static/pack/festival/nav-title.png');
      background-repeat: no-repeat;
      color: $font-color;
      width: 516px;
      height: 70px;
      div {
        padding-top: 0px;
        span {
          color: #fffb00;
        }
      }
    }
    .i-t-title-list {
      .i-t-carousel-item {
        color: #fff;
      }
    }
  }
  .i-t-form-tcontent {
    background: rgba(254, 254, 237,0.9);
    .i-t-f-c-right {
      > div {
        color: $input-color;
        input {
          color: $input-color;
        }
        input,
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
      .i-t-form-btn {
        img {
          box-shadow: inset 0px 2px 3px 0px #fff3f3, inset 0px -1px 0px 0px #ffffff, inset 0px -1px 4px 0px #ac484c;
        }
      }
    }
    .i-t-f-c-bottom {
      color: $input-color;
    }
  }
}

// 页面主体内容
.introduction-content {
  .i-c-header {
    background: url('../../../static/pack/festival/design-title.png') no-repeat center;
    background-size: contain;
    color: $font-color;
    font-size: 30px;
    line-height: 70px;
    width: 430px;
  }
  .i-c-header.h-bg2{
    background: url('../../../static/pack/festival/nav-title.png') no-repeat center;
    background-size: contain;
  }
  .i-c-tabs {
    .i-c-tabs-item {
      color: $font-color;
    }
    .i-c-tabs-item.tabs-active,
    .i-c-tabs-item:hover {
      background-image: url('../../../static/pack/festival/tabs-item.png') ;
      color: #ffffff;
    }
    .i-c-more {
      a {
        color: #fff0cd;
      }
    }
  }
  .i-c-item {
    border-radius: 20px;
    overflow: hidden;
    background-color: #fefeed !important;
    // margin-bottom: 30px;
    padding: 5px;
    .i-c-item-img {
      border-radius: 20px;
      overflow: hidden;
      object-fit: contain;
      display: block;
    }
    .i-c-item-text-title {
      color: #017150;
    }
    .i-c-item-text-content {
      padding-bottom: 5px;
      color: #e50020;
      font-size: 14px;
      vertical-align: bottom;
      text-align: center;
      font-weight: 500;
      .i-c-price {
        font-size: 26px;
        margin: 0 5px;
      }
      .i-c-unit {
        color: #017150 !important;
      }
    }
  }
}
</style>
