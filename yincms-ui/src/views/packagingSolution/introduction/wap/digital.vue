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
              <li class="i-t-nav-more-list-item"><a class="i-t-nav-more-list-item nav-active" href="/introduction/wap/pack-digital">3C数码包装</a></li>
              <li class="i-t-nav-more-list-item"><a class="i-t-nav-more-list-item" href="/introduction/wap/pack-festival">礼品包装</a></li>
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
      <img class="banner-img" src="@/static/pack/wap/digital/banner.png" alt="" />
      <div class="banner-btn ">
        <span @click="qiyu" title="客服" style="display: inline-block;width: 100%;height: 100%;">
          <img class="dom-scale" src="@/static/pack/digital/banner-btn.png" alt="" />
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
              <img class="dom-scale" src="@/static/pack/digital/from-btn.png" alt="" @click="save" />
            </div>
          </div>
        </div>
        <div v-for="(item, index) in packList" :key="index">
          <div class="i-c-header">
            {{ item.name }}
          </div>
          <div class="i-c-body">
            <div class="i-c-tabs">
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
            <img src="@/static/pack/wap/digital/one-stop.png" style="width:100%;object-fit: contain;" alt="" />
          </div>
        </div>
        <div>
          <div class="i-c-header">
            三大包装产业园 占地30万平方米
          </div>
          <div>
            <img src="@/static/pack/wap/digital/industrial-park.png" style="width:100%;object-fit: contain;" alt="" />
          </div>
        </div>
        <div>
          <div class="i-c-header">
            已服务全球15万+品牌
          </div>
          <div>
            <img src="@/static/pack/wap/digital/brand.png" style="width:100%;object-fit: contain;" alt="" />
          </div>
        </div>
      </div>
    </div>
    <wapFooter></wapFooter>
  </div>
</template>

<style lang="scss" scoped src="./base.scss"></style>
<style lang="scss" scoped>
$input-color: #403ab2;
.introduction {
  background: #d2d9ff;
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
    bottom: 20%;
    width: 100%;
    img {
      width: 50%;
      position: absolute;
      cursor: pointer;
      object-fit: contain;
      // box-shadow: 0px 3px 16px 0px #d38b8e;
      // border-radius: 50px 50px;
      left: 25%;
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
      background-image: url('../../../../static/pack/wap/digital/nav-title.png');
      background-size: contain;
      color: $input-color;
      div {
        span {
          color: #d34047;
        }
      }
    }
  }
  .i-t-form-tcontent {
    background: rgba(255, 255, 255, 0.4);

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
  .i-c-header {
    color: #333333;
    background: url('../../../../static/pack/wap/digital/design-title.png') no-repeat center;
    background-size: contain;
    color: $input-color;
  }
  .i-c-tabs {
    width: 100%;

    .i-c-tabs-item {
      color: #7d78d9;
    }
    .i-c-tabs-item.tabs-active,
    .i-c-tabs-item:hover {
      // background-image: url('../../../../static/pack/digital/tabs-item.png');
      color: $input-color;
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
      // color: #9792bf;
    }
    .i-c-item-text-content {
      // color: #e47176;

      .i-c-price {
      }
      .i-c-unit {
        // color: #b2aecd !important;
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
          name: '手机配件',
          moreId: '85',
          list: [
            { name: '数据线', isActive: true, list: ['2392', '2390', '2331', '2330', '2323', '2334', '2333', '2391'] },
            { name: '手机充电器', isActive: false, list: ['2360', '2353', '2356', '2358', '2355', '2365', '2354', '2349'] },
            { name: '移动电源', isActive: false, list: ['2376', '2386', '2401', '2369', '2370', '2375', '2384', '2383'] },
            { name: '手机支架', isActive: false, list: ['2447', '2441', '2445', '2430', '2443', '2434', '2431', '2435'] },
            { name: '手机膜', isActive: false, list: ['2763', '2760', '2761', '2749', '2759', '2758', '2750', '2747'] },
            { name: '手机壳', isActive: false, list: ['2472', '2464', '2454', '2455', '2457', '2459', '2458', '2462'] }
          ]
        },
        {
          name: '电器类',
          moreId: '146',
          list: [
            { name: '美容仪', isActive: true, list: ['2629', '2627', '2618', '2622', '2626', '2617', '2619', '2621'] },
            { name: '洁面仪', isActive: false, list: ['2638', '2633', '2634', '2635', '2639', '2631', '2189', '2636'] },
            { name: '充电器', isActive: false, list: ['2366', '2347', '2341', '2345', '2339', '2338', '2336', '2343'] },
            { name: '电吹风/理发器', isActive: false, list: ['3097', '3091', '3092', '3099', '2927', '2918', '2917', '2895'] },
            { name: '咖啡机/面包机', isActive: false, list: ['2724', '2717', '2718', '2723', '2956', '2957', '2958', '2959'] },
            { name: '榨汁机/料理机', isActive: false, list: ['2742', '2743', '2744', '2741', '2739', '2737', '2738', '2740'] }
          ]
        },
        {
          name: '影音娱乐',
          moreId: '76',
          list: [
            { name: '耳机/耳麦', isActive: true, list: ['2514', '2490', '2512', '2489', '2508', '2510', '2509', '2515'] },
            { name: '点读笔/录音笔', isActive: false, list: ['2712', '2710', '2707', '2714', '2708', '2791', '2801', '2793'] },
            { name: '音频线/麦克风', isActive: false, list: ['2537', '2535', '2523', '2542', '2553', '2552', '2543', '2539'] },
            { name: '读卡器/存储卡', isActive: false, list: ['2659', '2656', '2657', '2669', '2661', '2668', '2779', '2780'] }
          ]
        }
      ],
      pagePackSchemeParams: {
        pageNumber: 1, //页数
        pageSize: 100, //页大小
        categoryIds: '75,146,161,133,114'
      },
      pageKeywords: {
        title: '3C数码包装_免费设计打样_大货100起订 - 傲彩aocai.cn',
        keywords: '3C数码包装,数据线包装,充电器包装,移动电源包装,手机配件包装,个护电器包装,家用电器包装',
        description: '傲彩3C数码包装专题，为客户提供手机配件、影音娱乐、个护电器等3C数码包装设计方案，免费设计打样，在线报价下单，做包装上傲彩。'
      }
    };
  },
  created() {
    let _this = this;
    _this.saveParams.cateName = '3C数码专题';
    _this.saveParams.webCateId = 75;
    _this.saveParams.client = 'WAP'
  }
};
</script>
