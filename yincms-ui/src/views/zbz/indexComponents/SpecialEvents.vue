<template>
  <div class="axnAdbox">
    <h2>专题活动</h2>
    <el-row class="axnAdLst" :gutter="10">
      <el-col :span="6" v-for="o in dataArray" :key="o.id">
        <el-card shadow="hover" :body-style="{ padding: '0px' }">
          <a :href="o.href"><img class="axnAdImage" :src="alifileUrl + o.coverPath"/></a>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'SpecialEvents',
  props: {
    dataArray: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      alifileUrl: 'http://alifile.xiaocaiyin.com/'
    };
  }
};
</script>
<style lang="scss" scoped></style>
<style scoped src="@/static/mulindex/css/fonts.css" />
<style scoped src="@/static/mulindex/css/shop.css" />
