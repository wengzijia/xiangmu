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
              <img src="@/static/pack/digital/gift-box.png" alt="" />
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
              <div class="i-t-form-btn">
                <img class="dom-scale" src="@/static/pack/digital/from-btn.png" alt="" @click="save({ actionId: 2, channel: 203003 })" />
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
          <div class="i-c-tabs">
            <div v-for="(item2, index2) in item.list" :key="index2" class="i-c-tabs-item" :class="item2.isActive ? 'tabs-active' : ''" @click="activeItem(item, index2)">
              {{ item2.name }}
            </div>
            <div class="i-c-more">
              <a style=" color: #9792bf !important;font-size: 18px;" :href="'/packagingSolution/packageList?id=' + item.moreId" target="_blank">查看更多>></a>
            </div>
          </div>
          <template v-for="(item2, index2) in item.list">
            <div :key="index2" v-if="item2.isActive && packSchemeInfo[item2.name]">
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
          <div class="i-c-header" style="margin-top: 60px;margin-bottom: 40px;">
            设计.打样.大货 一站式服务
          </div>
          <div>
            <img src="@/static/pack/digital/one-stop.png" style="width:100%;object-fit: contain;" alt="" />
          </div>
        </div>
        <div>
          <div class="i-c-header" style="margin-top: 120px;margin-bottom: 60px;">
            三大包装产业园 占地30万平方米
          </div>
          <div>
            <img src="@/static/pack/digital/industrial-park.png" style="width:100%;object-fit: contain;" alt="" />
          </div>
        </div>
        <div>
          <div class="i-c-header" style="margin-top: 60px;margin-bottom: 60px;">
            已服务全球15万+品牌
          </div>
          <div>
            <img src="@/static/pack/brand.png" style="width:100%;object-fit: contain;" alt="" />
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
          name: '手机配件',
          moreId: '85',
          channel: 203000,
          list: [
            {
              name: '数据线',
              isActive: true,
              list: ['2392', '2390', '2331', '2330', '2323', '2334', '2333', '2391'],
              actionId: 1,
              detailsActionId: 8
            },
            {
              name: '手机充电器',
              isActive: false,
              list: ['2360', '2353', '2356', '2358', '2355', '2365', '2354', '2349'],
              actionId: 2,
              detailsActionId: 9
            },
            {
              name: '移动电源',
              isActive: false,
              list: ['2376', '2386', '2401', '2369', '2370', '2375', '2384', '2383'],
              actionId: 3,
              detailsActionId: 10
            },
            {
              name: '手机支架',
              isActive: false,
              list: ['2447', '2441', '2445', '2430', '2443', '2434', '2431', '2435'],
              actionId: 4,
              detailsActionId: 11
            },
            {
              name: '手机膜',
              isActive: false,
              list: ['2763', '2760', '2761', '2749', '2759', '2758', '2750', '2747'],
              actionId: 5,
              detailsActionId: 12
            },
            {
              name: '手机壳',
              isActive: false,
              list: ['2472', '2464', '2454', '2455', '2457', '2459', '2458', '2462'],
              actionId: 6,
              detailsActionId: 13
            }
          ],
          moreActionId: 7
        },
        {
          name: '电器类',
          moreId: '146',
          channel: 203001,
          list: [
            {
              name: '美容仪',
              isActive: true,
              list: ['2629', '2627', '2618', '2622', '2626', '2617', '2619', '2621'],
              actionId: 1,
              detailsActionId: 8
            },
            {
              name: '洁面仪',
              isActive: false,
              list: ['2638', '2633', '2634', '2635', '2639', '2631', '2189', '2636'],
              actionId: 2,
              detailsActionId: 9
            },
            {
              name: '充电器',
              isActive: false,
              list: ['2366', '2347', '2341', '2345', '2339', '2338', '2336', '2343'],
              actionId: 3,
              detailsActionId: 10
            },
            {
              name: '电吹风/理发器',
              isActive: false,
              list: ['3097', '3091', '3092', '3099', '2927', '2918', '2917', '2895'],
              actionId: 4,
              detailsActionId: 11
            },
            {
              name: '咖啡机/面包机',
              isActive: false,
              list: ['2724', '2717', '2718', '2723', '2956', '2957', '2958', '2959'],
              actionId: 5,
              detailsActionId: 12
            },
            {
              name: '榨汁机/料理机',
              isActive: false,
              list: ['2742', '2743', '2744', '2741', '2739', '2737', '2738', '2740'],
              actionId: 6,
              detailsActionId: 13
            }
          ],
          moreActionId: 7
        },
        {
          name: '影音娱乐',
          moreId: '76',
          channel: 203002,
          list: [
            {
              name: '耳机/耳麦',
              isActive: true,
              list: ['2514', '2490', '2512', '2489', '2508', '2510', '2509', '2515'],
              actionId: 1,
              detailsActionId: 6
            },
            {
              name: '点读笔/录音笔',
              isActive: false,
              list: ['2712', '2710', '2707', '2714', '2708', '2791', '2801', '2793'],
              actionId: 2,
              detailsActionId: 7
            },
            {
              name: '音频线/麦克风',
              isActive: false,
              list: ['2537', '2535', '2523', '2542', '2553', '2552', '2543', '2539'],
              actionId: 3,
              detailsActionId: 8
            },
            {
              name: '读卡器/存储卡',
              isActive: false,
              list: ['2659', '2656', '2657', '2669', '2661', '2668', '2779', '2780'],
              actionId: 4,
              detailsActionId: 9
            }
          ],
          moreActionId: 5
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
  }
};
</script>

<style lang="scss" scoped src="./base.scss"></style>
<style lang="scss" scoped>
.introduction {
  background: #d2d9ff;
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
  .banner-btn {
    position: absolute;
    bottom: 20%;
    width: 100%;
    img {
      // width: 302px;
      width: 18%;
      position: absolute;
      cursor: pointer;
      object-fit: contain;
      box-shadow: 0px 3px 16px 0px #d38b8e;
      border-radius: 50px 50px;
      left: 41%;
    }
  }
  .banner-item {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
  }
}

.i-t-form {
  width: 1240px;
  margin: 0 auto;
  // background-image: url(bg1.jpg),

  .i-t-title {
    .i-t-title-text {
      background-image: url('../../../static/pack/digital/nav-title.png');
      background-size: contain;
      color: #403ab2;
      div {
        span {
          color: #d34047;
        }
      }
    }
    .i-t-title-list {
      .i-t-carousel-item {
        color: #c24e53;
      }
    }
  }
  .i-t-form-tcontent {
    background: rgba(255, 255, 255, 0.4);

    .i-t-f-c-left {
      img {
      }
    }
    .i-t-f-c-right {
      > div {
        background: #ffffff;

        color: #403ab2;

        input {
          color: #403ab2;
        }
        input:-moz-placeholder,
        textarea:-moz-placeholder {
          color: #403ab2;
        }

        input:-ms-input-placeholder,
        textarea:-ms-input-placeholder {
          color: #403ab2;
        }

        input::-webkit-input-placeholder,
        textarea::-webkit-input-placeholder {
          color: #403ab2;
        }
      }
      .i-t-form-btn {
        img {
          box-shadow: 0px 3px 16px 0px #d38b8e;
        }
      }
    }
    .i-t-f-c-bottom {
      color: #c24e53;
    }
  }
}

// 页面主体内容

.introduction-content {
  .i-c-header {
    color: #333333;

    background: url('../../../static/pack/digital/design-title.png') no-repeat center;
    background-size: contain;
    color: #403ab2;
  }
  .i-c-tabs {
    .i-c-tabs-item {
      color: #403ab2;
    }
    .i-c-tabs-item.tabs-active,
    .i-c-tabs-item:hover {
      background-image: url('../../../static/pack/digital/tabs-item.png');
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
      color: #9792bf;
    }
    .i-c-item-text-content {
      color: #e47176;

      .i-c-price {
      }
      .i-c-unit {
        color: #b2aecd !important;
      }
    }
  }
}
</style>
