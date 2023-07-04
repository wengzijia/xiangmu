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
              <img src="@/static/pack/makeup/gift-box.png" alt="" />
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
                <img src="@/static/pack/digital/from-btn.png" alt="" @click="save({ actionId: 2, channel: 202004 })" />
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
            <div :key="index2" v-if="item2.isActive">
              <el-row :gutter="20">
                <el-col :span="6" v-for="(item, index) in packSchemeInfo[item2.name]" :key="index"
                  ><div class="i-c-item" @click="toPackageDetails(item)">
                    <div class="i-c-item-img">
                      <el-image :src="baseImgUrl + item.goodsImg.secondThumbnail" style="display: block;min-height: 285px;" lazy></el-image>
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
          <div class="i-c-header" style="margin-top: 40px;margin-bottom: 40px;">
            设计.打样.大货 一站式服务
          </div>
          <div>
            <img src="@/static/pack/makeup/one-stop.png" style="width:100%;object-fit: contain;" alt="" />
          </div>
        </div>
        <div>
          <div class="i-c-header" style="margin-top: 80px;margin-bottom: 40px;">
            三大包装产业园 占地30万平方米
          </div>
          <div>
            <img src="@/static/pack/makeup/industrial-park.png" style="width:100%;object-fit: contain;" alt="" />
          </div>
        </div>
        <div>
          <div class="i-c-header" style="margin-top: 60px;margin-bottom: 40px;">
            已服务全球15万+品牌
          </div>
          <div style="text-align: center;">
            <img src="@/static/pack/brand.png" style="width:90%;object-fit: contain;" alt="" />
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
          name: '面部护肤',
          moreId: '2',
          channel: 202000,
          list: [
            {
              name: '面膜',
              actionId: 1,
              detailsActionId: 8,
              id: '35',
              isActive: true,
              list: ['1902', '1903', '1860', '1904', '1870', '1887', '585', '590']
            },
            {
              name: '面霜',
              id: '35',
              isActive: false,
              list: ['2034', '1916', '1920', '1927', '1649', '1657', '1684', '1640'],
              actionId: 2,
              detailsActionId: 9
            },
            {
              name: '精华液/冻干粉',
              id: '35',
              isActive: false,
              list: ['1989', '1194', '582', '1191', '1192', '1963', '1108', '1367'],
              actionId: 3,
              detailsActionId: 10
            },
            {
              name: '化妆棉/卸妆棉',
              id: '35',
              isActive: false,
              list: ['1079', '1728', '1106', '1103', '1250', '1247', '1105', '1248'],
              actionId: 4,
              detailsActionId: 11
            },
            {
              name: '洁面乳/洗面奶',
              id: '35',
              isActive: false,
              list: ['1951', '1955', '1952', '1268', '1962', '1270', '1188', '779'],
              actionId: 5,
              detailsActionId: 12
            },
            {
              name: '护肤套装',
              id: '35',
              isActive: false,
              list: ['572', '812', '524', '518', '569', '526', '1312', '521'],
              actionId: 6,
              detailsActionId: 13
            }
          ],
          moreActionId: 7
        },
        {
          name: '彩妆',
          moreId: '17',
          channel: 202001,
          list: [
            {
              name: '口红/唇膏',
              id: '35',
              isActive: true,
              list: ['1995', '761', '662', '1993', '1939', '860', '1537', '1988'],
              actionId: 1,
              detailsActionId: 8
            },
            {
              name: 'BB霜',
              id: '35',
              isActive: false,
              list: ['659', '648', '1161', '1178', '1325', '647', '1215', '1159'],
              actionId: 2,
              detailsActionId: 9
            },
            {
              name: '眼线/眼影',
              id: '35',
              isActive: false,
              list: ['1011', '1210', '817', '1271', '703', '1276', '1277', '1562'],
              actionId: 3,
              detailsActionId: 10
            },
            {
              name: '散粉/粉饼',
              id: '35',
              isActive: false,
              list: ['1996', '918', '923', '1231', '1259', '1261', '916', '701'],
              actionId: 4,
              detailsActionId: 11
            },
            {
              name: '香水/指甲油',
              id: '35',
              isActive: false,
              list: ['926', '937', '1217', '931', '1602', '1597', '1600', '725'],
              actionId: 5,
              detailsActionId: 12
            },
            {
              name: '彩妆套装/美妆工具',
              id: '35',
              isActive: false,
              list: ['1632', '1722', '1721', '1617', '2191', '1633', '1364', '1614'],
              actionId: 6,
              detailsActionId: 13
            }
          ],
          moreActionId: 7
        },
        {
          name: '身体护理',
          moreId: '45',
          channel: 202003,
          list: [
            {
              name: '护手霜',
              isActive: true,
              list: ['1473', '2368', '1464', '1466', '1238', '1200', '739', '1459'],
              actionId: 1,
              detailsActionId: 8
            },
            {
              name: '防晒霜',
              isActive: false,
              list: ['2000', '1495', '1497', '1494', '1493', '1518', '1509', '1492'],
              actionId: 2,
              detailsActionId: 9
            },
            {
              name: '艾灸贴/暖宫贴',
              isActive: false,
              list: ['1654', '1663', '1655', '1232', '1662', '1667', '1658', '1650'],
              actionId: 3,
              detailsActionId: 10
            },
            {
              name: '按摩油/精油',
              isActive: false,
              list: ['1674', '1233', '1280', '716', '714', '715', '1279', '1278'],
              actionId: 4,
              detailsActionId: 11
            },
            {
              name: '身体乳/沐浴露',
              isActive: false,
              list: ['1246', '846', '1747', '1748', '1245', '857', '845', '857'],
              actionId: 5,
              detailsActionId: 12
            },
            {
              name: '手膜/足膜',
              isActive: false,
              list: ['1040', '1027', '1039', '1041', '1501', '880', '1029', '1042'],
              actionId: 6,
              detailsActionId: 13
            }
          ],
          moreActionId: 7
        },
        {
          name: '美发护发',
          moreId: '34',
          channel: 202004,
          list: [
            {
              name: '护发素/护肤霜',
              id: '35',
              isActive: true,
              list: ['908', '1002', '1006', '805', '1005', '806', '707', '1003'],
              actionId: 1,
              detailsActionId: 8
            },
            {
              name: '发膜',
              id: '36',
              isActive: false,
              list: ['1998', '1772', '1771', '1769', '652', '797', '1347', '996'],
              actionId: 2,
              detailsActionId: 9
            },
            {
              name: '弹力素',
              id: '37',
              isActive: false,
              list: ['655', '794', '653', '795', '1356', '1353', '654', '796'],
              actionId: 3,
              detailsActionId: 10
            },
            {
              name: '染发霜/染发剂',
              id: '40',
              isActive: false,
              list: ['1424', '1023', '650', '1726', '1426', '651', '1022', '1020'],
              actionId: 4,
              detailsActionId: 11
            },
            {
              name: '毛发生长液',
              id: '43',
              isActive: false,
              list: ['1452', '1451', '1292', '1293', '1290', '1291', '1453', '1454'],
              actionId: 5,
              detailsActionId: 12
            },
            {
              name: '洗发水/洗发膏',
              id: '39',
              isActive: false,
              list: ['781', '1082', '629', '1420', '829', '965', '831', '830'],
              actionId: 6,
              detailsActionId: 13
            }
          ],
          moreActionId: 7
        }
      ],
      pagePackSchemeParams: {
        pageNumber: 1, //页数
        pageSize: 100, //页大小
        categoryIds: '1,44'
      },
      pageKeywords: {
        title: '化妆品包装_免费设计打样_大货100起订 - 傲彩aocai.cn',
        keywords: '化妆品包装,面膜包装,面霜包装,唇膏包装,香水包装,护手霜包装,精油包装',
        description: '傲彩化妆品包装专题，为客户提供面膜、面霜、精华液等化妆品包装设计方案，免费设计打样，在线报价下单，做包装上傲彩。'
      }
    };
  },
  created() {
    let _this = this;
    _this.saveParams.cateName = '化妆品包装';
    _this.saveParams.webCateId = 1;
  }
};
</script>

<style lang="scss" scoped src="./base.scss"></style>
<style lang="scss" scoped>
// 页面主体
.introduction {
  background: #f4ddde;
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
  .banner-btn2 {
    position: absolute;
    bottom: 35%;
    width: 100%;
    img {
      // width: 302px;
      width: 18%;
      position: absolute;
      cursor: pointer;
      object-fit: contain;
      box-shadow: 0px 3px 16px 0px #d38b8e;
      border-radius: 50px 50px;
      right: 21%;
    }
  }
  .banner-item {
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
  }
}
$input-color: #c24e53;
.i-t-form {
  .i-t-title {
    .i-t-title-text {
      background-image: url('../../../static/pack/makeup/nav-title.png');
      color: #d75358;
      div {
        span {
          color: #a13fb9;
        }
      }
    }
  }
  .i-t-form-tcontent {
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
          box-shadow: 0px 3px 16px 0px #d38b8e;
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
    background: url('../../../static/pack/makeup/design-title.png') no-repeat center contain;
    color: #e47176;
  }
  .i-c-tabs {
    .i-c-tabs-item {
      color: #d85b60;
    }
    .i-c-tabs-item.tabs-active,
    .i-c-tabs-item:hover {
      background-image: url('../../../static/pack/makeup/tabs-item.png');
    }
    .i-c-more {
    }
  }
}
</style>
