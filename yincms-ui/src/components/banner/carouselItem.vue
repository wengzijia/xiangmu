<template>
  <!-- <a href="/packagingSolution/listsPackes" target="_blank" class="swiper-item" :style="{ '-webkit-transform': imgLateX }"> -->
  <a :href="href" target="_blank" class="swiper-item" :style="{ '-webkit-transform': imgLateX }">
    <img :style="'width:' + boxWidth + 'px;height:' + boxHeigth + 'px;'" :src="img" @click="$report({ channel: 161000, actionId: 2, param: JSON.stringify({ url: href }) })" />
  </a>
</template>

<script>
export default {
  name: 'swiper-item',
  props: {
    img: {
      type: String
    },
    href: {
      type: String
    },
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
    }
  },
  data() {
    return {
      url: '/packagingSolution/listsPackes'
    };
  },
  computed: {
    imgLateX() {
      return 'translate3d(' + this.imgWidth + 'px,0,0)';
    }
  }
};
</script>

<style lang="css">
.swiper-item {
  /* width: 800px; */
  /* width: 100%; */
  position: absolute;
  top: 0;
  left: 0;
  height: 463px;
}
.swiper-item img {
  /* width: 100vw; */
  /* min-width: 1240px; */
  height: 463px;
}
</style>
