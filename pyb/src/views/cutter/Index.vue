<!-- fengjianbo -->
<template>
  <div v-title data-title="人生计划书">
    <Canbody v-if="$route.query.cateId==10" />
    <el-main v-loading="loading" v-else>
      <div class="comBox">
        <div class="downBox">
          <ul>
            <li v-for="(item, index) in goodsList" :key="index" :class="index + '' == imgindex ? 'curr' : ''" @mouseenter="imageOver(index)" @mouseleave="imageLeave(index)" @click="linkDetailUrl(item.id)">
              <p class="downImg DKimg">
                <img :src="item.coverPath" />
              </p>
              <h3>{{ item.name }}</h3>
              <div class="flex downHide">
                <router-link :to="url + item.id" target="_blank">
                  <div class="downHdv">
                    <span>下载次数: {{ item.clickCount }}</span>
                    <span class="downBnt">免费下载</span>
                  </div>
                </router-link>
              </div>
            </li>
          </ul>
          <!--分页-->
          <div class="pageBox">
            <el-pagination background layout="prev, pager, next" :hide-on-single-page="value" :total="totalCount" :page-size="pageSize" :current-page="pageNumber" @current-change="handleCurrentChange"></el-pagination>
          </div>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
import { getSubCategoryGoods } from '@/api/goods/miniGoodsApi';
import { getCateId, getSubCateId } from '@/utils/goodsUtil';
import { strEquals } from '@/utils/strUtil';
import Canbody from '@/components/canbody/canbody';
export default {
  components: {Canbody},
  meta: {
    title: '刀模'
  },
  data() {
    return {
      goodsList: [],
      pageNumber: 1,
      pageSize: 12,
      value: true,
      totalCount: 0,
      imgindex: -1,
      gSubCateId: '',
      gCateId: '',
      subCateId: '',
      cateId: '',
      url: '',
      loading: true
    };
  },
  watch: {
    $route(to) {
      this.initPage();
    }
  },
  created() {
    document.title = '刀模下载';
    if (!this.$route.query.cateId) {
      this.$router.push({ path: '/cutter/index?cateId=1&subCateId=15' });
    }
    this.initPage();
  },
  mounted() {},
  methods: {
    initPage() {
      this.$store.dispatch('GetCutterCateNavs').then(() => {
        this.cateId = this.$route.query.cateId;
        this.subCateId = this.$route.query.subCateId;
        this.gSubCateId = getSubCateId(this);
        this.gCateId = getCateId(this);
        this.url = this.initDetailUrl();
        this.pageNumber = 1;
        this.listGoods();
      });
    },

    imageOver(index) {
      this.goodsList[index].temp = this.goodsList[index].coverPath;
      if (this.goodsList[index].photoPath1) {
        this.goodsList[index].coverPath = this.goodsList[index].photoPath1;
      }
      this.imgindex = index;
    },
    imageLeave(index) {
      this.goodsList[index].coverPath = this.goodsList[index].temp;
      this.imgindex = -1;
    },
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.listGoods();
    },
    listGoods() {
      getSubCategoryGoods({
        cateId: this.gSubCateId,
        language: 'zh-cn',
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      })
        .then(res => {
          this.$set(this, 'goodsList', res.data);
          this.totalCount = res.totalCount;
          this.loading = false;
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    initDetailUrl() {
      let url = '';
      if (strEquals(this.cateId, '1')) {
        //卡盒
        url = '/cutter/CardNew';
        document.title = '卡纸盒刀模图_纸盒刀模图_彩盒刀模图-拼一版';
        if (strEquals(this.subCateId, '23')) {
          url = '/cutter/CardOld';
        }
      } else if (strEquals(this.cateId, '2')) {
        //微坑
        url = '/cutter/CardNew';
        document.title = '坑纸盒刀模图_纸盒刀模图_彩盒刀模图-拼一版';
        //if (strEquals(this.subCateId, '27') || strEquals(this.subCateId, '30')) {
        if (strEquals(this.subCateId, '27')) {
          url = '/cutter/CardOld';
        }
      } else if (strEquals(this.cateId, '13')) {
        //软包
        url = '/cutter/CardOld';
        document.title = '软包装袋刀模图-拼一版';
      } else if (strEquals(this.cateId, '8')) {
        //胶片盒
        url = '/cutter/CardNew';
        document.title = '胶片盒刀模图-拼一版';
      } else if (strEquals(this.cateId, '3')) {
        //精装盒
        url = '/cutter/CardNew';
        document.title = '精装盒刀模图-拼一版';
      } else if (strEquals(this.cateId, '4')) {
        //内托
        url = '/cutter/CardNew';
        document.title = '内托刀模图-拼一版';
      } else if (strEquals(this.cateId, '7')) {
        //手提袋
        url = '/cutter/CardNew';
        document.title = '手提袋刀模图-拼一版';
      } else if (strEquals(this.cateId, '10')) {
        //铁罐
        url = '/cutter/CardOld';
        document.title = '铁罐刀模图-拼一版';
      } else if (strEquals(this.cateId, '11')) {
        //纸杯
        url = '/cutter/CardOld';
        document.title = '纸杯刀模图-拼一版';
      } else if (strEquals(this.cateId, '12')) {
        //纸巾盒
        url = '/cutter/CardOld';
        document.title = '纸巾盒刀模图-拼一版';
      } else if (strEquals(this.cateId, '83')) {
        //扑克牌
        url = '/cutter/CardOld';
        document.title = '扑克牌刀模图-拼一版';
      }
      url += '?cateId=' + this.cateId + '&subCateId=' + this.subCateId + '&gCateId=' + this.gCateId + '&gSubCateId=' + this.gSubCateId + '&gid=';
      return url;
    },
    linkDetailUrl(gid) {
      //this.$router.push({ path: this.url, query: { gid: gid } });
    }
  }
};
</script>

<style scoped src="../../static/mulindex/css/fonts.css" />
<style scoped src="../../static/mulindex/css/public.css" />
<style scoped src="../../static/mulindex/css/index_new.css" />
