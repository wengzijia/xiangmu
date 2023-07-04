<template>
  <div :class="divClass1" style="padding:0;background: none;height:470px">
    <div :class="divClass2" style="width:100%;padding:0;box-shadow:none">
      <!-- <el-carousel height="430px" indicator-position="outside"> -->
      <el-carousel height="430px" indicator-position="outside">
        <el-carousel-item v-for="item in dataArray" :key="item.id">
          <a :href="item.href"><img class="axnBwrapImg" :src="alifileUrl + item.coverPath"/></a>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ZbzIndexBanner',
  props: {
    dataArray: {
      type: Array,
      default: function() {
        return [];
      }
    },
    divClass1: {
      type: String
    },
    divClass2: {
      type: String
    }
  },
  data() {
    return {
      alifileUrl: 'http://alifile.xiaocaiyin.com/'
    };
  }
};
</script>
<style>
.axnBwrap .el-carousel__indicators--outside {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}
.graybj .axnBwrap .el-carousel__arrow--left {
  left: 210px;
}
.graybj .axnBwrap .el-carousel__arrow--right {
  right: 210px !important;
}
</style>
<style scoped src="@/static/mulindex/css/fonts.css" />
<style scoped src="@/static/mulindex/css/shop.css" />
