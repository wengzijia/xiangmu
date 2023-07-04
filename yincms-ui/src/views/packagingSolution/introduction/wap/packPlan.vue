<template>
  <div class="myStyle pack-plan-main" style="padding-bottom: 15vw;overflow: hidden;">
    <div class="pack-plan-top">
      <div class="pack-code">NO : {{ packInfo.schemeNo }}</div>
      <img v-if="!isShow3D" class="pack-plan-img" :src="goodsImg" style="height: 100vw;" />
      <!-- <div v-show="!isShow3D && designImgInfo.secondThumbnail" class="canvas">
        <canvas id="canvasImg"></canvas>
      </div> -->
      <div v-if="isShow3D" style=" height: 100vw;width: 100vw;">
        <!-- <iframe
        :src="threeIframeSrc"
        width="100%"
        scrolling="no"
        style="border: none; height: 100vw"
      ></iframe> -->
        <threeItme ref="threeItme" :list="packInfo.designList[designIndex].designGoods" :goodsId="goodsId" :goodsImg="goodsImg" :watermark="watermarkInfo" v-if="packInfo.designList && packInfo.designList[designIndex]"></threeItme>
      </div>
      <div class="myStyle pack-img-tabs">
        <span :class="!isShow3D ? 'active' : ''" @click="tabsImg(false)">2D</span>
        <span :class="isShow3D ? 'active' : ''" @click="tabsImg(true)">3D</span>
      </div>
    </div>
    <div class="goods-list-box" v-if="packInfo.designList && packInfo.designList[designIndex]" style="overflow: auto;">
      <ul class="goods-list" :style="{ width: packInfo.designList[designIndex].designGoods.length * 90 + 90 + 'px' }">
        <li class="goods-list-item" :class="goodsId == 'all' ? 'active' : ''" @click="checkGoods({ id: 'all' })">
          <img v-if="designImgInfo.firstThumbnail" :src="OSS_FILE_URL + designImgInfo.firstThumbnail" style="height: 100%;width: 100%;" />
          <img v-else :src="OSS_FILE_URL + designImgInfo.firstThumbnail" style="background-color: #FFF;height: 100%;width: 100%;" />
        </li>

        <li class="goods-list-item" :class="goodsId == item.id ? 'active' : ''" @click="checkGoods(item)" v-for="(item, index) in packInfo.designList[designIndex].designGoods" :key="index">
          <img v-if="item.goodsImg.firstThumbnail" :src="OSS_FILE_URL + item.goodsImg.firstThumbnail" style="height: 100%;width: 100%;" />
          <img v-else :src="OSS_FILE_URL + item.coverPath" style="background-color: #FFF;height: 100%;width: 100%;" />
        </li>
      </ul>
    </div>
    <div class="item-box" v-if="packInfo.schemeName">
      <p>{{ packInfo.schemeName }}</p>
      <p class="price-box">
        <span style="color: #ff5f61; font-size: 12px"
          >￥<span class="price">{{ packInfo.price }}</span></span
        >元/套起 <span class="price-tips">参考价格</span>
      </p>
    </div>

    <div class="item-box" v-if="packInfo.packForm">
      <p>
        <span class="item-label">包装适用商品</span>
        <span class="item-value">{{ packInfo.packForm.type }}</span>
      </p>
      <p>
        <span class="item-label">商品建议尺寸</span>
        <span class="item-value">{{ packInfo.attribute }}</span>
      </p>
    </div>
    <div class="item-box" v-if="packInfo.designList">
      <p><span class="item-label">包装方案组成</span></p>
      <div>
        <div class="pack-goods" v-for="(item, index) in packInfo.designList[designIndex].designGoods" :key="item.id">
          <div class="pack-goods-item">
            <div class="item-value">
              <div style="height: 20px; line-height: 20px">
                {{ item.boxName }}
              </div>
              <div style="color: #777777">每套数量：{{ item.number }}个</div>
            </div>
            <div class="look-params" @click="lookParams(item, index)">{{ item.showParams ? '收起' : '查看' }}参数</div>
          </div>
          <div>
            <packParams ref="designItem" :style="{ height: item.showParams ? item.itemClientHeight + 'px' : '0', overflow: 'hidden', transition: 'all .8s' }" :designGoods="item"></packParams>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="pack-bottom">
      <div class="pack-bottom-left" >
        <div>商城</div>
      </div>
      <div class="pack-bottom-right" @click="consult">咨询</div>
    </div> -->
    <wapFooter></wapFooter>
  </div>
</template>

<script>
import { getSchemeDetailBySchemeId } from '@/api/zbz/packCategoryApi';
import threeItme from '@/components/three2/index.vue';
import wapFooter from './components/wapFooter.vue';

import packParams from './components/packParams.vue';
export default {
  components: {
    threeItme,
    wapFooter,
    packParams
  },
  data() {
    return {
      OSS_FILE_URL: 'http://alifile.xiaocaiyin.com/',
      packInfo: {},
      watermarkInfo: {
        watermarkText: '微图 - WEITU',
        watermarkImg: null
      },
      isShow3D: false,
      employeeInfo: {},
      thumbnail: '',
      designImgInfo: {},
      designIndex: 0,
      goodsIndex: 0,
      goodsId: 'all',
      goodsImg: '',
      threeIframeSrc: '',
      threeDesignId: '',
      designGoods: {},
      
    };
  },
  methods: {
    lookParams(item, index) {
      let _this = this;
      _this.$set(item, 'showParams', !item.showParams);
      _this.$set(item, 'itemClientHeight', _this.$refs.designItem[index].$el.querySelector('.pack-params-box').clientHeight);
    },
    getPackInfo(id) {
      let _this = this;
      if (!id) return;
      getSchemeDetailBySchemeId({ id }).then(res => {
        if (res.success) {
          res.data.designList[_this.designIndex].designGoods = res.data.designList[_this.designIndex].designGoods.map((e, i) => {
            if (e.goodsImg && e.goodsImg.length > 0) {
              e.goodsImg = JSON.parse(e.goodsImg);
            }
            // if(i==0) _this.goodsId = e.id
            let arr = e.composeName.split('_');
            if (arr) {
              e.boxName = arr[arr.length - 1];
            }
            return e;
          });

          if (res.data.designList[_this.designIndex].goodsImg) {
            _this.designImgInfo = JSON.parse(res.data.designList[_this.designIndex].goodsImg);
            _this.goodsImg = _this.OSS_FILE_URL + _this.designImgInfo.secondThumbnail;
            _this.packInfo = res.data;
            _this.threeDesignId = _this.packInfo.designList[_this.designIndex].id;
            _this.threeIframeSrc = 'https://sd.liaotu.com/pack/api/pack/all3d?isWT=1&designId=' + _this.threeDesignId;
          }
        }
      });
    },
    
    tabsImg(bool) {
      let _this = this;
      _this.isShow3D = bool;
    },
    checkGoods(item) {
      let _this = this;
      if (_this.goodsId == item.id) return;
      _this.goodsId = item.id + '';
      let goodsImg = '';
      if (item.id == 'all') {
        goodsImg = _this.OSS_FILE_URL + _this.designImgInfo.secondThumbnail;
        _this.threeIframeSrc = 'https://sd.liaotu.com/pack/api/pack/all3d?isWT=1&designId=' + _this.threeDesignId;
      } else {
        goodsImg = _this.OSS_FILE_URL + item.goodsImg.secondThumbnail;
        _this.threeIframeSrc = `https://sd.liaotu.com//pack/api/pack/3d?skinPath=${item.skinFile}&mouldPath=${item.mould3d}&goodsThumbnail=${item.goodsImg.secondThumbnail}`;
      }

      _this.goodsImg = goodsImg;
      this.$refs['threeItme']?.setGoodsId(item.id);
    }
  },
  created() {
    let _this = this;
    
  },
  mounted() {
    let _this = this;
    document.querySelector('head').append('<meta name="format-detection" content="telephone=yes"/>');
    _this.getPackInfo(_this.$route.query.id);
  }
};
</script>

<style lang="scss">
.pack-plan-main {
  min-height: 100vh;
  background: #f5f7fe;

  .pack-plan-top {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .myStyle.pack-img-tabs {
      position: absolute;
      bottom: 20px;
      background-color: #cccccc;
      // padding: 1px;
      left: 50%;
      border-radius: 20px;
      transform: translateX(-50%);
      span {
        display: inline-block;
        padding: 2px 8px;
        // background: #fff;
        color: #fff;
        border: 1px solid #ccc;
        border-radius: 20px;
      }
      span.active {
        color: #7d7d7d;
        background: #fff;
      }
    }
    .pack-plan-img {
      background: #f3f3f3;
      width: 100%;
      object-fit: contain;
    }
  }
}
.myStyle.pack-plan-main {
  .pack-plan-top {
    max-height: 750px;
  }
  .item-box {
    margin: 10px;
    background: #fff;
    padding: 14px;
    border-radius: 5px;
    p {
      margin: 0;
      margin-bottom: 5px;
      span {
        display: inline-block;
      }
      // margin-bottom: ;
      .item-label {
        font-size: 15px;
        font-weight: 500;
        color: #333333;
        line-height: 18px;
        margin-right: 10px;
      }
      .item-value {
        font-size: 15px;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
      }
    }
    .pack-goods {
      border-bottom: 1px solid #e6e6e6;
      transition: all 0.8s;
      .pack-goods-item {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        align-items: center;
      }
      .item-value {
        font-size: 15px;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
      }
      .look-params {
        width: 76px;
        height: 29px;
        border-radius: 2px 2px 2px 2px;
        border: 1px solid #e9333f;
        color: #e9333f;
        font-size: 15px;
        font-weight: 400;
        color: #e9333f;
        line-height: 29px;
        text-align: center;
      }
    }
    .price-box {
      display: inline-block;
      margin-top: 10px;
      .price {
        display: inline-block;
        font-size: 24px;
        margin-right: 5px;
      }
      .price-tips {
        background: #ffe3e4;
        color: #ff4d4f;
        font-size: 12px;
        padding: 4px 2px;
        border-radius: 4px;
        position: relative;
        bottom: 5px;
      }
    }
  }
  .pack-bottom {
    display: flex;
    width: 100%;
    height: 56px;

    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 7px;
    padding-right: 18px;
    box-sizing: border-box;
    .pack-bottom-left {
      // width: 70px;
      text-align: center;
      background: #fff;
      img {
        height: 28px;
        object-fit: contain;
      }
      div {
        color: #4c4c4d;
        font-size: 14px;
      }
    }
    .pack-bottom-right {
      background: #e9333f;
      // flex: 1;
      font-size: 20px;
      color: #fff;
      text-align: center;
      height: 42px;
      line-height: 42px;
      border-radius: 4px;
    }
  }
 
}
.canvas {
  position: relative;
  width: 100vw;
  height: 100vw;
  background-color: #f3f3f3;
}
.myStyle .goods-list-box::-webkit-scrollbar {
  display: none;
}
.myStyle .goods-list {
  display: flex;
  overflow: auto;
  margin: 10px auto 0;
  padding: 0 !important;
  // justify-content: space-evenly;
  // text-align: center;
  // min-width: 100%;
}

.myStyle .goods-list-item {
  // flex: 1 0 auto;
  margin-right: 10px;
  width: 80px;
  height: 80px;
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  border: 1px solid #e6e6e6;
  overflow: hidden;
  display: inline-block;
  text-align: center;
}
.myStyle .goods-list-item:first-child {
  margin-left: 10px;
}
.myStyle .goods-list-item:last-child {
  margin-right: 10px;
}

.myStyle .goods-list-item.active {
  border-color: #e9333f;
}
.pack-code {
  position: absolute;
  top: 1vw;
  right: 1vw;
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  border-radius: 50vw;
  padding: 1vw 2vw;
  font-size: 3.5vw;
}

</style>
