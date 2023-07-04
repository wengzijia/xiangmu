<template>
  <div class="axnHotBox">
    <h1>热门分类</h1>
    <!--食品-->
    <div class="axnHotList" v-for="(item, index) in dataArray" :key="index + 1100">
      <h3 class="axnHotile">
        <span class="axnHotileL">{{ item.title }}</span>
        <el-button type="text" class="axnHotileR"><a :href="'/zbz/list?zbzCateId=' + item.cateId">全部</a><i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </h3>
      <div class="axnGroup">
        <el-row class="axnGrow" :gutter="20">
          <el-col class="axnGcol" :span="12" v-for="o in item.children" :key="o.id">
            <el-card shadow="never" :body-style="{ padding: '0px' }">
              <div class="axnGrimg">
                <router-link :to="{ path: o.href }"><img :src="alifileUrl + o.coverPath"/></router-link>
              </div>
              <p class="axnGtxt">{{ o.title }}</p>
            </el-card>
          </el-col>
        </el-row>
        <div class="axnHotMore">
          <el-link :href="'/zbz/list?zbzCateId=' + item.cateId"> {{ '找更多' + item.title }}</el-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HotCategory',
  props: {
    dataArray: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  updated() {
    console.log('hotArray', this.dataArray);
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
