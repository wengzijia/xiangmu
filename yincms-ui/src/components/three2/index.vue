<template>
  <div style="position: relative;width: 100%;height: 100%;">
    <div :class="isShow ? '' : 'hide-three'">
      <div class="felxBox" v-show="engineInfo.loading">
        <div class="goods-img-box">
          <img :src="imgSrc + goodsImg" alt="" />
        </div>
        <div class="loading-img-box">
          <img src="https://sd.liaotu.com/img/loading2.gif" class="imgbox2" alt="" />
        </div>
      </div>
      <div ref="container" class="three-box" :class="engineInfo.loading ? 'three-hide' : ''"></div>
    </div>
  </div>
</template>

<script>
import { Engine } from './js/engine';
import { lightList } from './js/light';
export default {
  props: {
    goodsId: String,
    goodsImg: String,
    watermark: {
      default: () => {
        return {};
      }
    },
    list: {
      default: () => {
        return [];
      }
    },
    isShow: {
      default: true
    }
  },
  name: 'PreProduceAdminUiThree',
  data() {
    return {
      imgSrc: '/api/consumer/certifyFree/alibaba/oss/viewFile?fileName=',
      fileList: [],
      engineInfo: { loading: true },
      isLoading: true
    };
  },
  watch: {
    goodsId: function(newVal) {
      this.setGoodsId(newVal || 'all');
    }
  },
  mounted() {
    let _this = this;
    _this.fileList = _this.list.map(e => {
      if (e.packDesignEditBase) {
        e.skinFile = e.packDesignEditBase.skinFile;
        e.mould3d = e.packDesignEditBase.mould3d;
      }
      return {
        zipUrl: `https://sd.liaotu.com/aliyunoss/${encodeURIComponent(e.skinFile)}`,
        objUrl: `https://sd.liaotu.com/aliyunoss/${encodeURIComponent(e.mould3d)}`,
        id: e.id,
        imgUrl: e.previewImg ? _this.imgSrc + e.previewImg : ''
      };
    });
    const TE = new Engine(_this.$refs['container'], _this.fileList, _this.goodsId);
    TE.addObject(lightList);
    _this.$set(_this, 'engineInfo', TE);
  },

  methods: {
    setGoodsId(id) {
      this.engineInfo.setModel(id);
    }
  }
};
</script>

<style lang="scss" scoped>
.three-box {
  width: 100%;
  height: 100%;
  cursor: grab;
}
.three-hide {
  position: absolute;
  z-index: -1;
  left: 100;
}
.goods-img-box {
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  .imgbox {
    height: 100%;
    width: 100%;
  }
}
.loading-img-box {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
}
.hide-three {
  position: absolute;
  left: 9999px;
}
</style>
