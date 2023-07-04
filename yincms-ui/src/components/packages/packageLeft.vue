<template>
  <div :class="['downLyLt', 'downLtBox', topScroll > 200 ? 'positionFixed' : 'positionStatic']" ref="downLtBox" :style="'top:' + topVal + 'px'">
    <!-- 大图begin -->
    <div ref="box" class="spec-preview" style="position: relative; width: 520px; height: 520px">
      <div class="show3DBox">
        <!-- <img class="imAge" v-if="imAge_show" :src="imgSrc + packageLeftDta.allImg" /> -->
        <!-- <canvas v-for="item in totalPage" :key="item" :id="'the-canvas' + item" :class="canvas_show ? 'pdf-content ' : 'pdf-content hiddencanvas'"></canvas> -->
        <!-- <iframe v-if="packageLeftDta.designVideo && packageLeftDta.video_show" name="knife_3d" :src="imgSrc + packageLeftDta.designVideo" class="knife_3d" id="knife_1" style="width: 842px;height: 578px;"></iframe> -->
        <div v-if="packageLeftDta.frame_show">
          <div v-if="packageLeftDta.designVideo && packageLeftDta.video_show && !packageLeftDta.customFlag">
            <div v-if="!packageLeftDta.videoEnd && !imgShow">
              <video ref="video1" width="520px" height="520px" autoplay>
                <source :src="imgSrc + packageLeftDta.designVideo" />
                您的浏览器不支持 video 标签。
              </video>
            </div>
            <div v-if="packageLeftDta.videoEnd && !imgShow" style="width: 100%; height: 100%">
              <img :src="imgSrc + packageLeftDta.allImg.watermark" style="width: 520px; height: 520px" />
              <!-- <img :src="imgSrc + packageLeftDta.allImg.secondThumbnail" style="background-color: #FFF;height: 100%;width: 100%;" /> -->
              <span class="player">
                <img style="width: 90px" v-if="packageLeftDta.plays" src="@/static/mulindex/img/play.png" alt="" />
                <img style="width: 90px" v-if="packageLeftDta.pause" src="@/static/mulindex/img/pause.png" @click="play()" alt="" />
              </span>
            </div>
          </div>
          <!-- 控制选中显示放大镜的图片 -->
          <div v-show="imgShow && !packageLeftDta.customFlag">
            <img v-show="packageLeftDta.typeImg == 'all'" :src="imgSrc + packageLeftDta.allImg.watermark" style="width: 520px; height: 520px" />
            <img v-show="packageLeftDta.typeImg" :src="imgSrc + packageLeftDta.bigImg" style="width: 520px; height: 520px" />
          </div>
          <!-- <div v-show="(!packageLeftDta.designVideo || !packageLeftDta.video_show) && !packageLeftDta.customFlag"> -->
          <div v-if="(!packageLeftDta.designVideo || !packageLeftDta.video_show) && !packageLeftDta.customFlag" style="width: 520px; height: 520px">
            <!-- <template v-for="val in goodsList"> -->
            <threeItem v-if="packageLeftDta.showThree && !imgShow" ref="threeItem" :list="goodsList" :goodsId="packageLeftDta.typeImg" :goodsImg="packageLeftDta.allImg.watermark"></threeItem>
            <!-- </template> -->
            <!-- <iframe name="knife_3d" v-show="!packageLeftDta.typeImg && !imgShow" :src="allPackage_3d_2(packageLeftDta.allId)" class="knife_3d" id="knife_1" style="width: 520px;height: 520px;"></iframe>
            <iframe
              name="knife_3d"
              v-show="packageLeftDta.typeImg && packageLeftDta.typeImg == val.id && !packageLeftDta.imAgeShow && !imgShow"
              v-for="val in goodsList"
              :key="val.id + 's'"
              :src="package_3d_2(val.skinFile, val.mould3d, val.goodsImg.watermark == null ? val.coverPath : val.goodsImg.watermark, 1)"
              class="knife_3d"
              id="knife_1"
              style="width: 520px;height: 520px;"
            ></iframe> -->
            <div style="width: 100%; height: 100%" v-show="packageLeftDta.imAgeShow && packageLeftDta.typeImg && packageLeftDta.typeImg == vo.id && !imgShow" v-for="vo in goodsList" :key="vo.id + 'b'">
              <img v-if="vo.goodsImg.watermark" :src="imgSrc + vo.goodsImg.watermark" style="width: 520px; height: 520px" />
              <!-- <img v-if="vo.goodsImg.secondThumbnail" :src="imgSrc + vo.goodsImg.secondThumbnail" style="background-color: #FFF;height: 100%;width: 100%;" /> -->
              <img v-else :src="imgSrc + vo.coverPath" style="height: 100%; width: 100%" />
            </div>
          </div>
          <!-- 自定义设计 -->
          <div v-if="packageLeftDta.customFlag" style="width: 520px; height: 520px">
            <!-- 这个是显示刀模图 即isthree==null时 -->
            <iframe name="knife_3d" v-show="!packageLeftDta.isThree" :src="iframeSrc(packageLeftDta)" class="knife_3d" id="knife_1" style="width: 520px; height: 520px"></iframe>
            <!-- 这个是显示3d图 即isthree==1时 -->
            <!-- <iframe name="knife_3d" v-show="packageLeftDta.isThree" :src="package_3d_2(packageLeftDta.skinFile, packageLeftDta.mould3d, packageLeftDta.previewImg, 2)" class="knife_3d" id="threeIframe" style="width: 520px; height: 520px"></iframe> -->
            <threeItem ref="threeItem2" :isShow="packageLeftDta.isThree" :list="packageLeftDta.customList" :goodsId="packageLeftDta.typeImg + ''"></threeItem>
          </div>
        </div>
      </div>
      <ul class="tabImg" v-show="!packageLeftDta.customFlag">
        <li :class="imgShow ? 'sel' : ''" @click="changeImg(2)">2D</li>
        <li :class="!imgShow ? 'sel' : ''" @click="changeImg(3)">3D</li>
      </ul>
      <!-- 2D时图片放大的可视区域 -->
      <div v-if="packageLeftDta.isShow" class="viewArea" ref="mask"></div>
    </div>
    <!-- 缩略图begin -->
    <div class="spec-scroll beginBox" v-show="!packageLeftDta.customFlag">
      <div v-if="goodsList.length > 5" class="leftRightBox leftBox" @click="toLeft">
        <img src="@/static/mulindex/img/left.png" alt="" />
      </div>
      <div class="jcenter">
        <div class="items jcenter" :style="'width:' + (goodsList.length + 1) * 75 + 'px'">
          <ul class="ulBox" :style="{ '-webkit-transition': transitionConfig, '-webkit-transform': imgLateX }">
            <li style="width: 68px; height: 68px; box-sizing: border-box" :class="packageLeftDta.typeImg == 'all' ? 'current' : ''" @click="model_preview_3d('all', packageLeftDta.allId, packageLeftDta.designVideo, packageLeftDta.allImg.watermark)">
              <img :src="imgSrc + packageLeftDta.allImg.firstThumbnail" style="height: 100%; width: 100%" />
            </li>
            <li
              style="width: 68px; height: 68px; box-sizing: border-box"
              :class="packageLeftDta.typeImg == items.id ? 'current' : ''"
              v-for="items in goodsList"
              :key="items.id + 'a'"
              @click="model_preview_3d('one', items.id, packageLeftDta.designVideo, items.goodsImg.watermark)"
            >
              <img v-if="items.goodsImg.firstThumbnail" :src="imgSrc + items.goodsImg.firstThumbnail" style="height: 100%; width: 100%" />
              <img v-else :src="imgSrc + items.coverPath" style="background-color: #fff; height: 100%; width: 100%" />
            </li>
          </ul>
        </div>
      </div>
      <div v-if="goodsList.length > 5" class="leftRightBox rightBox" @click="toRight">
        <img src="@/static/mulindex/img/right.png" alt="" />
      </div>
    </div>
    <!-- 自定义设计3d数据 -->
    <div class="spec-scroll beginBox" v-show="packageLeftDta.customFlag">
      <div v-if="packageLeftDta.customList.length > 5" class="leftRightBox leftBox" @click="toLeft(1)">
        <img src="@/static/mulindex/img/left.png" alt="" />
      </div>
      <div class="jcenter">
        <div class="items jcenter" :style="'width:' + (goodsList.length + 1) * 76 + 'px'">
          <ul class="ulBox" :style="{ '-webkit-transition': transitionConfig, '-webkit-transform': imgLateX }">
            <!-- <li style="width: 68px;height: 68px;box-sizing: border-box;" :class="packageLeftDta.typeImg == null ? 'current' : ''" @click="model_preview_3d('all', packageLeftDta.allId, packageLeftDta.designVideo)">
              <img :src="imgSrc + packageLeftDta.allImg" style="background-color: #FFF;height: 100%;width: 100%;" />
            </li> -->
            <li
              style="width: 68px; height: 68px; box-sizing: border-box; background-color: #f3f3f3"
              :class="(items.id == null ? items.packDesignEditBase.id : items.id) == packageLeftDta.typeImg ? 'current' : ''"
              v-for="items in packageLeftDta.customList"
              :key="(items.id == null ? items.packDesignEditBase.id : items.id) + 'a'"
              @click="custom_preview_3d(items)"
            >
              <img :src="imgSrc + (items.id == null ? items.packDesignEditBase.previewImg : items.previewImg)" style="height: 100%; width: 100%" />
            </li>
          </ul>
        </div>
      </div>
      <div v-if="packageLeftDta.customList.length > 5" class="leftRightBox rightBox" @click="toRight(1)">
        <img src="@/static/mulindex/img/right.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import { allPackage_3d_2, package_3d_2, iframeSrc } from '@/utils/cutter/knifeUtil';
import threeItem from '@/components/three2/index.vue';

export default {
  name: 'packageLeft',
  components: {
    threeItem
  },
  props: {
    goodsList: Array,
    packageLeftDta: Object,
    model_preview_3d: Function,
    custom_preview_3d: Function,
    play: Function,
    updateDate: Function,
    getDom: Function
  },
  data() {
    return {
      imgSrc: 'http://alifile.xiaocaiyin.com/',
      timer: '',
      md: null,
      imgWidth: 75,
      imgIndex: 0,
      durationTime: 0.2,
      topVal: 0,
      topScroll: 0,
      imgShow: true
    };
  },
  computed: {
    imgLateX() {
      return 'translate3d(' + -this.imgIndex * this.imgWidth + 'px,0,0)';
    },
    transitionConfig() {
      return 'all ' + this.durationTime + 's';
    }
  },
  created() {
    this.$nextTick(() => {
      this.offsetLeft = this.$refs.box?.offsetLeft;
      // console.log('offsetLeft-55555--', this.$refs.box?.offsetLeft);
    });
  },
  mounted() {
    // window.addEventListener('resize', () => {
    //   console.log(122233444);
    //   this.offsetLeft = this.$refs.box?.offsetLeft;
    //   console.log('offsetLeft-222222--',  this.offsetLeft);
    // });
    window.addEventListener('scroll', this.handleScroll, false);
    if (!this.packageLeftDta.typeImg && this.imgShow && this.packageLeftDta.isShow) {
      this.magnifyGlass();
      // this.move();
    }
  },
  methods: {
    ...{ allPackage_3d_2, package_3d_2, iframeSrc },
    domShow() {
      let _this = this;
      _this.getDom('bigBox').style.display = 'block';
      _this.$refs.mask.style.display = 'block';
    },
    domHidden() {
      let _this = this;
      _this.getDom('bigBox').style.display = 'none';
      _this.$refs.mask.style.display = 'none';
    },
    //坐标移动，遮挡层跟随鼠标功能
    move(e) {
      //让鼠标的中心停在遮挡框中心
      let _this = this;
      //计算黄色小盒子在图片上的大小
      _this.$refs.mask.style.width = _this.$refs.box?.offsetWidth / (_this.getDom('bimg')?.offsetWidth / _this.getDom('bigBox')?.offsetWidth) + 'px';
      _this.$refs.mask.style.height = _this.$refs.box?.offsetHeight / (_this.getDom('bimg')?.offsetHeight / _this.getDom('bigBox')?.offsetHeight) + 'px';
      const headHeight = 161; //头部的高度
      var x = e.pageX - _this.$refs.box?.offsetLeft - _this.$refs.mask?.offsetWidth / 2;
      var y = e.pageY - _this.$refs.box?.offsetTop - _this.$refs.mask?.offsetHeight / 2 - headHeight;
      if (this.topScroll > 200) {
        x = e.pageX - this.offsetLeft - _this.$refs.mask?.offsetWidth / 2;
        y = e.pageY - 109 - _this.$refs.mask?.offsetHeight / 2 - _this.topScroll + 60;
      }
      // console.log('y---', y, e.pageY);
      // console.log('this.topScroll---', this.topScroll);
      // console.log('top---', _this.getDom('bigBox').style.top);
      // console.log('offsetWidth---', _this.$refs.box?.offsetWidth);
      // console.log('offsetLeft---', _this.$refs.box?.offsetLeft);
      // console.log('offsetTop---', _this.$refs.box?.offsetTop);
      // //将遮挡框固定在box里
      var maxX = _this.$refs.box?.offsetWidth - _this.$refs.mask?.offsetWidth;
      var maxY = _this.$refs.box?.offsetHeight - _this.$refs.mask?.offsetHeight;
      if (x <= 0) {
        x = 0;
      } else if (x >= maxX) {
        x = maxX;
      }
      if (y <= 0) {
        y = 0;
      } else if (y >= maxY) {
        y = maxY;
      }
      _this.$refs.mask.style.left = x + 'px';
      _this.$refs.mask.style.top = y + 'px';
      // 移动遮挡层，大图片成比例跟随移动
      var bigX = _this.getDom('bimg')?.offsetWidth - _this.getDom('bigBox')?.offsetWidth;
      var bigY = _this.getDom('bimg')?.offsetHeight - _this.getDom('bigBox')?.offsetHeight;
      var moveX = (x * bigX) / maxX;
      var moveY = (y * bigY) / maxY;
      _this.getDom('bimg').style.left = -moveX + 'px';
      _this.getDom('bimg').style.top = -moveY + 'px';
    },
    // 监听鼠标书否移入盒子区，控制遮盖层和放大区的显示和隐藏
    magnifyGlass() {
      let _this = this;
      // 监听鼠标以上盒子
      _this.$refs.box?.addEventListener('mouseover', _this.domShow);
      //监听鼠标离开
      _this.$refs.box?.addEventListener('mouseout', _this.domHidden);
      //坐标移动，遮挡层跟随鼠标功能
      _this.$refs.box?.addEventListener('mousemove', _this.move);
    },
    removeEvent() {
      let _this = this;
      _this.$refs.box?.removeEventListener('mouseover', _this.domShow, false);
      _this.$refs.box?.removeEventListener('mouseout', _this.domHidden, false);
      _this.$refs.box?.removeEventListener('mousemove', _this.move, false);
    },
    changeImg(type) {
      let _this = this;
      if (type == 2) {
        if (!_this.imgShow) {
          this.$report({
            channel: 161003,
            actionId: 5
          });
        }
        _this.imgShow = true;
        _this.packageLeftDta.isShow = true;
        _this.magnifyGlass();
      } else {
        if (_this.imgShow) {
          this.$report({
            channel: 161003,
            actionId: 6
          });
        }
        _this.imgShow = false;
        _this.packageLeftDta.isShow = false;
        _this.play();
        _this.videoEndFn();
        _this.removeEvent();
      }
      // console.log('this.imgShow', this.imgShow);
    },
    // 滚动底部对齐（吸底）
    handleScroll() {
      this.$nextTick(() => {
        this.updateDate();
        let leftHeight = this.$refs.downLtBox?.offsetHeight; //左边盒子的高度
        let diffHeight = this.packageLeftDta?.rightTop - leftHeight; //左右盒子高度差值
        this.topScroll = Math.floor(document.documentElement?.scrollTop || document.body?.scrollTop);
        let sclHt = this.topScroll - diffHeight - 170; //滚动距离-左右高度差值-头部遮盖高度
        if (this.topScroll > diffHeight + 170) {
          //判断滚动到左右两边盒子底部对齐时
          this.topVal = 48 - sclHt;
        } else {
          if (this.getDom('bigBox')) {
            if (this.topScroll > 200) {
              this.topVal = 48;
              let top = this.topScroll - 222;
              this.getDom('bigBox').style.top = top + 'px';
            } else {
              this.topVal = 0;
              this.getDom('bigBox').style.top = 0 + 'px';
            }
          }
        }
      });

      // console.log('this.topVal', this.topVal, 'topScroll', this.topScroll);
      // console.log('diffHeight', diffHeight, leftHeight, this.packageLeftDta.rightTop);
    },
    toLeft(type) {
      if (type == 1) {
        if (this.imgIndex == 0) return (this.imgIndex = this.this.packageLeftDta.customList.length - 5);
      } else {
        if (this.imgIndex == 0) return (this.imgIndex = this.goodsList.length - 5);
      }
      this.imgIndex--;
    },
    toRight(type) {
      this.imgIndex++;
      if (type == 1) {
        if (this.imgIndex > this.packageLeftDta.customList.length - 5) return (this.imgIndex = 0);
      } else {
        if (this.imgIndex > this.goodsList.length - 5) return (this.imgIndex = 0);
      }
    },
    videoEndFn() {
      let _this = this;
      this.$nextTick(() => {
        _this.md = _this.$refs.video1;
        // console.log('3333333', _this.md);
        if (_this.md) {
          if (_this.md.ended) {
            // console.log('结束');
            _this.packageLeftDta.videoEnd = true;
          }
          _this.md.addEventListener('ended', function() {
            // console.log('结束');
            _this.packageLeftDta.videoEnd = true;
            _this.packageLeftDta.plays = false;
            _this.packageLeftDta.pause = true;
            // console.log('videoEnd00000', _this.packageLeftDta.videoEnd);
            // console.log('videoEnd00000plays', _this.packageLeftDta.plays);
            // console.log('_this.packageLeftDta.pause', _this.packageLeftDta.pause);
          });
        }
      });
    }
  },
  beforeDestroy() {
    // 取消监听
    window.removeEventListener('scroll', this.handleScroll, false);
  }
};
</script>

<style scoped>
.show3DBox {
  background-color: #f3f3f3;
  height: 100%;
  width: 100%;
  min-width: 520px;
  min-height: 520px;
  overflow: hidden;
}
.viewArea {
  width: 160px;
  height: 160px;
  user-select: none;
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;
  border: 1px solid #aaa;
  background: #fede4f;
  opacity: 0.5;
  cursor: move;
  display: none;
  /* filter: alpha(Opacity=50); */
}

.tabImg {
  display: flex;
  position: relative;
  justify-content: center;
  text-align: center;
  z-index: 10;
  margin: auto;
  margin-top: -26px;
  width: 72px;
  background: #ccc;
}

.tabImg li {
  /* width: 30px; */
  /* height: 30px; */
  /* margin-right: 10px; */
  user-select: none;
  background: #ccc;
  padding: 2px 10px;
  /* line-height: 30px; */
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 2px;
  color: #fff;

  /* text-align: center; */
}

.tabImg li.sel {
  background: #fff;
  color: #7d7d7d;
}

.downLtBox {
  width: 520px !important;
  /* border: 1px solid red; */
}

.positionFixed {
  position: fixed;
}

.positionStatic {
  position: static;
}

.beginBox {
  width: 520px !important;
  user-select: none;
  margin: 0;
  position: relative;
}

.leftRightBox {
  width: 32px;
  height: 68px;
  display: flex;
  align-items: center;
  background: #fff;
  /* background: #f5f5f5; */
  position: absolute;
  top: 0;
  z-index: 6;
  margin-top: 8px;
  cursor: pointer;
}

.jcenter {
  max-width: 449px;
  margin: 0 auto;
  /* border: 1px solid red; */
}

.leftBox {
  left: 0;
}

.rightBox {
  right: 0;
}

.ulBox {
  /* height: 68px; */
  display: flex;
  flex-wrap: nowrap;
}

.spec-scroll .items {
  overflow: hidden;
}

.spec-scroll .items ul li {
  flex: 0 0 68px;
  margin-left: 6.5px !important;
  margin-right: 0 !important;
}
.player {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
<style scoped src="@/static/mulindex/css/fonts.css" />
<style scoped src="@/static/mulindex/css/public.css" />
<style scoped src="@/static/mulindex/css/index_new.css" />
<style scoped src="@/static/mulindex/css/attr.css" />
