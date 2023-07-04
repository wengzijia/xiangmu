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
              <li class="i-t-nav-more-list-item"><a class="i-t-nav-more-list-item nav-active" href="/introduction/wap/pack-makeup">化妆品包装</a></li>
              <li class="i-t-nav-more-list-item"><a class="i-t-nav-more-list-item" href="/introduction/wap/pack-digital">3C数码包装</a></li>
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
      <img class="banner-img" src="@/static/pack/wap/makeup/banner.png" alt="" />
      <div class="banner-btn ">
        <span @click="qiyu" title="客服" style="display: inline-block;width: 100%;height: 100%;">
          <img class="dom-scale" src="@/static/pack/wap/makeup/banner-btn.png" alt="" />
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
            <img src="@/static/pack/wap/makeup/one-stop.png" style="width:100%;object-fit: contain;" alt="" />
          </div>
        </div>
        <div>
          <div class="i-c-header">
            三大包装产业园 占地30万平方米
          </div>
          <div>
            <img src="@/static/pack/wap/makeup/industrial-park.png" style="width:100%;object-fit: contain;" alt="" />
          </div>
        </div>
        <div>
          <div class="i-c-header">
            已服务全球15万+品牌
          </div>
          <div>
            <img src="@/static/pack/wap/makeup/brand.png" style="width:100%;object-fit: contain;" alt="" />
          </div>
        </div>
      </div>
    </div>
    <wapFooter></wapFooter>
  </div>
</template>

<style lang="scss" scoped src="./base.scss"></style>
<style lang="scss" scoped>
$input-color: #d75358;
.introduction {
  background: #f4ddde;
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
    bottom: 57%;
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
      background-image: url('../../../../static/pack/wap/makeup/nav-title.png');
      background-size: contain;
      color: $input-color;
      div {
        span {
          color: #a13fb9;
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
    background: url('../../../../static/pack/wap/makeup/design-title.png') no-repeat center;
    background-size: contain;
    color: $input-color;
  }
  .i-c-tabs {
    width: 100%;

    .i-c-tabs-item {
      color: #c24e53;
    }
    .i-c-tabs-item.tabs-active,
    .i-c-tabs-item:hover {
      color: #9a3578;
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
          name: '面部护肤',
          moreId: '2',
          list: [
            { name: '面膜', id: '35', isActive: true, list: ['1902', '1903', '1860', '1904', '1870', '1887', '585', '590'] },
            { name: '面霜', id: '35', isActive: false, list: ['2034', '1916', '1920', '1927', '1649', '1657', '1684', '1640'] },
            { name: '精华液/冻干粉', id: '35', isActive: false, list: ['1989', '1194', '582', '1191', '1192', '1963', '1108', '1367'] },
            { name: '化妆棉/卸妆棉', id: '35', isActive: false, list: ['1079', '1728', '1106', '1103', '1250', '1247', '1105', '1248'] },
            { name: '洁面乳/洗面奶', id: '35', isActive: false, list: ['1951', '1955', '1952', '1268', '1962', '1270', '1188', '779'] },
            { name: '护肤套装', id: '35', isActive: false, list: ['572', '812', '524', '518', '569', '526', '1312', '521'] }
          ]
        },
        {
          name: '彩妆',
          moreId: '17',
          list: [
            { name: '口红/唇膏', id: '35', isActive: true, list: ['1995', '761', '662', '1993', '1939', '860', '1537', '1988'] },
            { name: 'BB霜', id: '35', isActive: false, list: ['659', '648', '1161', '1178', '1325', '647', '1215', '1159'] },
            { name: '眼线/眼影', id: '35', isActive: false, list: ['1011', '1210', '817', '1271', '703', '1276', '1277', '1562'] },
            { name: '散粉/粉饼', id: '35', isActive: false, list: ['1996', '918', '923', '1231', '1259', '1261', '916', '701'] },
            { name: '香水/指甲油', id: '35', isActive: false, list: ['926', '937', '1217', '931', '1602', '1597', '1600', '725'] },
            { name: '彩妆套装/美妆工具', id: '35', isActive: false, list: ['1632', '1722', '1721', '1617', '2191', '1633', '1364', '1614'] }
          ]
        },

        {
          name: '身体护理',
          moreId: '45',
          list: [
            { name: '护手霜', isActive: true, list: ['1473', '2368', '1464', '1466', '1238', '1200', '739', '1459'] },
            { name: '防晒霜', isActive: false, list: ['2000', '1495', '1497', '1494', '1493', '1518', '1509', '1492'] },
            { name: '艾灸贴/暖宫贴', isActive: false, list: ['1654', '1663', '1655', '1232', '1662', '1667', '1658', '1650'] },
            { name: '按摩油/精油', isActive: false, list: ['1674', '1233', '1280', '716', '714', '715', '1279', '1278'] },
            { name: '身体乳/沐浴露', isActive: false, list: ['1246', '846', '1747', '1748', '1245', '857', '845', '857'] },
            { name: '手膜/足膜', isActive: false, list: ['1040', '1027', '1039', '1041', '1501', '880', '1029', '1042'] }
          ]
        },
        {
          name: '美发护发',
          moreId: '34',
          list: [
            { name: '护发素/护肤霜', id: '35', isActive: true, list: ['908', '1002', '1006', '805', '1005', '806', '707', '1003'] },
            { name: '发膜', id: '36', isActive: false, list: ['1998', '1772', '1771', '1769', '652', '797', '1347', '996'] },
            { name: '弹力素', id: '37', isActive: false, list: ['655', '794', '653', '795', '1356', '1353', '654', '796'] },
            { name: '染发霜/染发剂', id: '40', isActive: false, list: ['1424', '1023', '650', '1726', '1426', '651', '1022', '1020'] },
            { name: '毛发生长液', id: '43', isActive: false, list: ['1452', '1451', '1292', '1293', '1290', '1291', '1453', '1454'] },
            { name: '洗发水/洗发膏', id: '39', isActive: false, list: ['781', '1082', '629', '1420', '829', '965', '831', '830'] }
          ]
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
    _this.saveParams.client = 'WAP'
  }
};
</script>
