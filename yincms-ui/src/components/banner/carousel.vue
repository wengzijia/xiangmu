<template>
  <div id="swiper" :style="'width:' + boxWidth + 'px;height:' + boxHeigth + 'px;'" @mouseover="stopAuto" @mouseout="autoPlay">
    <div class="swiper-box" :style="{ width: allCount, '-webkit-transition': transitionConfig, '-webkit-transform': slateX }" ref="swiper">
      <carousel-item :img="imgList[imgList.length - 1].img" :href="imgList[imgList.length - 1].href" :boxWidth="boxWidth" :boxHeigth="boxHeigth" :imgWidth="-imgWidth" v-if="loop" />
      <carousel-item v-for="(item, index) in imgList" :key="index" :href="item.href" :img="item.img" :boxWidth="boxWidth" :boxHeigth="boxHeigth" :imgWidth="imgWidth * index"></carousel-item>
      <carousel-item :img="imgList[0].img" :boxWidth="boxWidth" :href="imgList[0].href" :boxHeigth="boxHeigth" :imgWidth="imgWidth * imgList.length" v-if="loop"></carousel-item>
    </div>
    <span v-show="showView" class="swiper-left el-icon-arrow-left" @click="toLeft"></span>
    <span v-show="showView" class="swiper-right el-icon-arrow-right" @click="toRight"></span>
    <div class="swiper-dots" v-if="dots">
      <button v-for="(item, index) in imgList.length" :key="index" :class="{ active: index == dotsIndex }" @click="toDots(index)"></button>
      <!-- <button v-for="(item, index) in imgList.length" :key="index" :class="{ active: index == dotsIndex }" @click="toDots(index)">{{ item }}</button> -->
    </div>
  </div>
</template>

<script>
import CarouselItem from './carouselItem';
export default {
  name: 'swiper',
  props: {
    // 图片宽
    imgWidth: {
      type: Number,
      default: 100
    },
    boxWidth: {
      type: Number,
      default: 1240
    },
    boxHeigth: {
      type: Number,
      default: 420
    },
    // 图片地址
    imgList: {
      type: Array
    },
    // 指示器
    dots: {
      type: Boolean,
      default: true
    },
    arrow: {
      type: Boolean,
      default: true
    },
    // 初始播放位置
    initIndex: {
      type: Number,
      default: 0
    },
    // 是否循环
    loop: {
      type: Boolean,
      default: true
    },
    // 持续时间
    duration: {
      type: Number,
      default: 0.3
    },
    // 自动播放
    auto: {
      type: Boolean,
      default: false
    },
    // 自动播放时间间隔
    autoTime: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      showView: false,
      imgIndex: 0,
      durationTime: 0.2,
      dotsIndex: 0,
      autoer: null
    };
  },
  components: {
    CarouselItem: CarouselItem
  },
  computed: {
    allCount() {
      return this.imgList.length * this.imgWidth + 'px';
    },
    slateX() {
      // console.log('translate3d(' + -this.imgIndex * this.imgWidth + 'px,0,0)');
      return 'translate3d(' + -this.imgIndex * this.imgWidth + 'px,0,0)';
    },
    transitionConfig() {
      return 'all ' + this.durationTime + 's';
    }
  },
  methods: {
    toLeft() {
      if (this.loop) {
        this.imgIndex--;
        this.dotsIndex--;
        if (this.dotsIndex <= -1) this.dotsIndex = this.imgList.length - 1;

        if (this.imgIndex <= -2) this.loopFn('left');
      } else {
        if (this.imgIndex == 0) return (this.dotsIndex = this.imgIndex = this.imgList.length - 1);
        this.imgIndex--;
        this.dotsIndex--;
      }
    },
    toRight() {
      if (this.loop) {
        // alert(this.loop)

        this.imgIndex++;
        this.dotsIndex++;
        if (this.dotsIndex == this.imgList.length) this.dotsIndex = 0;
        if (this.imgIndex == this.imgList.length + 1) this.loopFn('right');
      } else {
        this.imgIndex++;
        this.dotsIndex++;
        if (this.imgIndex > this.imgList.length - 1) return (this.dotsIndex = this.imgIndex = 0);
      }
    },
    loopFn(type) {
      const dur = this.durationTime;
      this.durationTime = 0;

      this.imgIndex = type == 'right' ? 0 : this.imgList.length - 1;

      setTimeout(() => {
        this.$nextTick(function() {
          this.durationTime = dur;

          if (type == 'right') this.imgIndex++;
          else this.imgIndex--;
        });
      }, 30);
    },
    toDots(index) {
      this.dotsIndex = this.imgIndex = index;
    },
    autoPlay() {
      if (this.auto) {
        this.showView = false;
        clearInterval(this.autoer);
        this.autoer = setInterval(() => {
          this.toRight();
        }, this.autoTime);
      }
    },
    stopAuto() {
      if (this.auto) this.showView = true;
      return clearInterval(this.autoer);
    }
  },
  created() {
    this.imgIndex = this.dotsIndex = this.initIndex;

    this.durationTime = this.duration;

    if (this.auto) this.autoPlay();
  }
};
</script>

<style lang="css">
#swiper {
  position: relative;
  overflow: hidden;
  /* width: 1240px; */
  /* height: 463px; */
  background: #fff;
  margin-bottom: 20px;
  margin: auto;
}
.swiper-left {
  position: absolute;
  top: 50%;
  display: inline-block;
  transform: translateY(-50%);
  left: 20px;
  background: rgba(127, 124, 124, 0.5);
  padding: 10px;
  color: #fff;
  font-size: 20px;
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
}
.swiper-right {
  position: absolute;
  top: 50%;
  display: inline-block;
  transform: translateY(-50%);
  right: 20px;
  background: rgba(127, 124, 124, 0.5);
  padding: 10px;
  color: #fff;
  font-size: 20px;
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
}
.swiper-dots {
  position: absolute;
  bottom: 20px;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
}
.swiper-dots button {
  width: 30px;
  height: 4px;
  background: rgba(127, 124, 124, 0.5);
  display: inline-block;
  margin: 0 10px;
  border-radius: 20px;
  color: #000;
  font-weight: normal;
  border: none;
  outline: none;
  transition: all 0.2s;
  cursor: pointer;
}
.swiper-dots button:hover,
.swiper-dots button.active {
  /* background: rgba(51, 122, 183, 0.8); */
  background: #fff;
  color: #fff;
}
</style>
