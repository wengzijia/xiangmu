<template>
  <div class="graybj newYearImg1" id="app">
    <el-main class="comBox axnMain">
      <!-- 菜单导航栏 -->
      <ul class="navBar">
        <li class="cascaderes">
          <cascader :cateMap="cateMap"></cascader>
        </li>
        <li>
          <Carousel :boxWidth="boxWidth" :imgWidth="imgWidth" :imgList="indexList" :initIndex="0" :loop="true" :auto="true" :autoTime="2000"></Carousel>
        </li>
        <li class="rightImg">
          <a :href="val.href" target="_blank" v-for="val in specialList" :key="val.id">
            <img :src="alifileUrl + val.coverPath" @click="$report({ channel: 161000, actionId: 4, param: JSON.stringify({ url: val.href }) })" />
          </a>
          <!-- <img src="http://alifile.xiaocaiyin.com/uploads/file/VO202204/VO/skin_37/手提袋.png" /> -->
          <!-- <img src="http://alifile.xiaocaiyin.com/uploads/file/VO202204/VO/skin_37/手提袋.png" /> -->
        </li>
      </ul>
      <!-- 一级导航筛选 -->
      <div class="title_seach">
        <ul class="txtList">
          <li
            class="host"
            :class="[sectId == null ? 'active1' : '']"
            @click="
              sectId = null;
              parmsData.categoryIds = null;
              parmsData.pageNumber = 1;
              getHotSchemeListByCategoryPidFn();
            "
          >
            热门推荐
          </li>
          <li
            v-for="item in options"
            :key="item.id"
            :class="[item.id == sectId ? 'active' : '']"
            @click="
              sectId = item.id;
              parmsData.categoryIds = item.categoryId;
              parmsData.pageNumber = 1;
              getHotSchemeListByCategoryPidFn();
            "
          >
            {{ item.name }}
          </li>
        </ul>
        <div class="searchBox">
          <el-input placeholder="搜索商品~~" v-model.trim="inputContent" class="input-with-select">
            <!-- <el-button slot="append" class="seachBtn">搜索</el-button> -->
            <el-button slot="append" icon="el-icon-search" class="seachBtn" @click="searchResults"></el-button>
          </el-input>
        </div>
      </div>

      <div class="axnWrap">
        <el-row :gutter="10">
          <el-col class="axnEcol" :span="6" v-show="vo.goodsImg" v-for="(vo, index) in productList" :key="index" style="cursor: pointer;">
            <el-card  shadow="hover" :body-style="{ padding: '0px' }">
              <div @click="routeToProduct(vo.id)">
                <p class="axnEcoImg"><img :src="alifileUrl + getImg(vo.goodsImg)" /></p>
                <div class="axnEcoltx">
                  <h3>{{ vo.schemeName }}</h3>
                  <div class=" axnEcolBt priceCenter" style="text-align: center;">
                    <span class="axnEcolBtsp  size"><i style="font-size: 18px;">￥</i>{{ vo.price }}<i style="font-size: 14px;color: #999;margin-left: 10px;">元/套起</i></span>
                    <!-- <el-button type="text" class="button">30天成交{{ vo.salesCount / 10000 }}万</el-button> -->
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div v-if="productList.length == 0" class="noDatas">找不到相关数据~~</div>
        <el-pagination background class="axnPag" :hide-on-single-page="true" @current-change="handleCurrentChange" :current-page="parmsData.pageNumber" :page-size="parmsData.pageSize" layout="total, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </el-main>

    <!--导航分类-->
    <div class="axnFixed" v-show="false">
      <div class="axnFixedW">
        <div class="axnFixedL">
          <a href="" class="curr"><i class="icon icon-shipin"></i>食品</a>
          <a href=""><i class="icon icon-huaz"></i>化妆品</a>
          <a href=""><i class="icon icon-dianzi"></i>电子产品</a>
          <a href=""><i class="icon icon-yyao"></i>医药保健品</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Carousel from '@/components/banner/carousel';
import cascader from '@/components/cascader/cascader';
import { categoryList, AdSetting, getHotCategoryList } from '@/api/zbz/packCategoryApi';
import { setDocumentTitle } from '@/utils/domUtil';
import { getHotSchemeListByCategoryPid } from '@/api/zbz/packCategoryApi';

export default {
  name: 'ZbzIndex',
  components: {
    Carousel,
    cascader
  },
  data() {
    return {
      alifileUrl: 'http://alifile.xiaocaiyin.com/',
      cateMap: null,
      // 轮番图片
      indexList: [
        {
          img: null
        }
      ],
      specialList: [],
      imgWidth: 811,
      boxWidth: 811,
      boxHeigth: 420,
      titleList: [{ name: '热门推荐', id: 0 }],
      sectId: null,
      show1: false,
      show2: false,
      totalCount: 0,
      productList: [],
      options: [],
      inputContent: '',
      parmsData: { pageNumber: 1, pageSize: 24, categoryIds: null }
    };
  },
  watch: {
    show1: function(value) {
      let _this = this;

      if (value) {
        _this.show2 = value;
      } else {
        setTimeout(() => {
          _this.show2 = value;
        }, 1000);
      }
    }
  },

  computed: {
    // listHeight: function() {
    //   let _this = this;
    //   if (!_this.show1) return 50;
    //   let len = _this.options.length;
    //   // console.log('len / 6).ceil', Math.ceil(len / 8));
    //   return 50 * Math.ceil(len / 8);
    // }
  },

  created() {
    this.getListAll();
    // this.categoryListFn();
    this.getHotSchemeListByCategoryPidFn();
    this.getHotCategoryListFn();
    this.setDocumentTitle('包装方案-傲彩aocai.cn');
    this.$report({
      channel: 161000,
      actionId: 1
    });
  },
  methods: {
    setDocumentTitle,
    // 获取json数据的图片地址
    getImg(url) {
      if (url) {
        let data = JSON.parse(url);
        return data.secondThumbnail;
      }
    },
    tabChange() {
      this.show1 = !this.show1;
    },
    searchResults() {
      console.log(this.inputContent);
      this.$router.push({ path: '/packagingSolution/searchResults', query: { schemeName: this.inputContent } });
      this.$report({
        channel: 161000,
        actionId: 7,
        param: JSON.stringify({
          keywords: this.inputContent
        })
      });
    },
    //   获取一二级分类
    // categoryListFn() {
    //   categoryList().then(res => {
    //     // this.options = res.data;
    //     // console.log(' this.options', this.options);
    //   });
    // },
    getHotCategoryListFn() {
      getHotCategoryList().then(res => {
        // console.log('res777777', res);
        this.options = res.data;
      });
    },
    // 商品列表
    getHotSchemeListByCategoryPidFn() {
      // const parms = {
      //   pageNumber: 0,
      //   pageSize: 24,
      //   pid: id
      // };
      // this.parmsData.pid = id;
      // console.log('this.parmsData', this.parmsData);
      getHotSchemeListByCategoryPid(this.parmsData)
        .then(res => {
          this.productList = res.data == null ? [] : res.data;
          this.totalCount = res.totalCount;

          //   this.totalCount = res.totalCount;
          console.log('productList666', this.productList);
        })
        .catch(err => {
          console.log(err);
        });
      this.$report({
        channel: 161000,
        actionId: 5,
        param: JSON.stringify({
          id: this.sectId
        })
      });
    },
    handleCurrentChange(pageNumber) {
      this.parmsData.pageNumber = pageNumber;
      this.getHotSchemeListByCategoryPidFn();
    },
    // 一二级跳转
    changeCate(val) {
      // console.log('一二级跳转', val);
      //   console.log(val[1]);
      this.$router.push({ path: '/packagingSolution/packageList', query: { id: val[1] } });
      // let routeUrls = this.$router.resolve({ path: '/packagingSolution/packageList', query: { id: val[1] } });
      // window.open(routeUrls.href, '_blank');
    },
    /**
     * 跳转到商品详情页
     * @param {number} id -商品id
     */
    routeToProduct(id) {
      let routeUrl = this.$router.resolve({ path: '/packagingSolution/packageDetails', query: { id: id } });
      window.open(routeUrl.href, '_blank');
      this.$report({
        channel: 161000,
        actionId: 6,
        param: JSON.stringify({ id })
      });
    },
    /**
     * 获取轮播图图片
     */
    getListAll() {
      AdSetting().then(res => {
        if (res.code === '000000') {
          console.log('轮播图22', res.data);
          this.indexList = res.data.indexList;
          this.cateMap = res.data.cateMap;
          if (res.data.specialList.length > 3) {
            this.specialList = res.data.specialList.slice(0, 3);
            // console.log('this.specialList----', this.specialList);
          } else {
            this.specialList = res.data.specialList;
          }
          this.indexList.map(item => {
            item.img = this.alifileUrl + item.coverPath;
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.priceLayout .el-input-group__append {
  width: 25px;
  padding: 0 5px;
  text-align: center;
}

.graybj .navBar {
  display: flex;
  margin-top: 10px;
  margin-bottom: 20px;
  /* position: relative; */
}
.graybj .navBar .cascaderes {
  /* overflow: hidden; */
  margin-right: 10px;
}
.graybj .navBar li {
  /* width: 270px; */
  /* width: 190px; */
  height: 420px;
  /* vertical-align: top; */
}
.graybj .navBar .licascaderes {
  width: 270px;
  background: #fff;
}
.graybj .rightImg {
  text-align: right;
  /* position: absolute;
  right: 0; */
  width: 172px;
  margin-left: 10px;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  overflow: hidden;
}
.graybj .rightImg a {
  display: inherit;
}
.graybj .rightImg img {
  width: 100%;
  height: 136px;
  background: #fff;
}
</style>
<style>
.graybj .el-cascader-panel.is-bordered {
  border: 0;
}
.graybj .el-cascader-panel.is-bordered:hover .el-scrollbar.el-cascader-menu:nth-child(2),
.graybj .el-cascader-panel.is-bordered:hover .el-scrollbar.el-cascader-menu:nth-child(3) {
  display: inline;
}
.graybj .el-cascader-panel.is-bordered .el-scrollbar.el-cascader-menu:first-child {
  background-color: rgba(255, 255, 255, 0.6);
}
.graybj .el-cascader-panel.is-bordered .el-scrollbar.el-cascader-menu::nth-child(2),
.graybj .el-cascader-panel.is-bordered .el-scrollbar.el-cascader-menu::nth-child(3) {
  display: none;
}
/* .el-cascader-panel.is-bordered {
    border: 0;
    &:hover {
      .el-scrollbar.el-cascader-menu:nth-child(2),
      .el-scrollbar.el-cascader-menu:nth-child(3) {
        display: inline;
      }
    }
    .el-scrollbar.el-cascader-menu {
      &:first-child {
        background-color: rgba(255, 255, 255, 0.6);
      }
      &:nth-child(2),
      &:nth-child(3) {
        display: none;
      }
    }
    .el-cascader-menu__wrap.el-scrollbar__wrap {
      height: 490px;
      li {
        height: 65px;
      }
    }
  } */

.graybj .el-cascader-node.in-active-path,
.graybj .el-cascader-node.is-active,
.graybj .el-cascader-node.is-active {
  color: #c41b20;
}
.graybj .el-cascader-menu__wrap {
  height: 480px;
  font-size: 18px;
  /* line-height: 400px; */
}
.graybj .el-cascader-node {
  height: 50px;
}
.graybj .el-cascader-menu {
  position: relative;
  z-index: 1;
  background: #fff;
  /* padding: 9px 0; */
}
.graybj .title_seach {
  width: 100%;
  height: 60px;
  margin-top: 20px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.graybj .title_seach .searchBox .el-input__inner {
  border-right: 0;
}
.graybj .title_seach .searchBox {
  display: flex;
  align-items: center;
  margin-right: 20px;
  width: 300px;
}
.graybj .title_seach .searchBox .seachBtn {
  background: #fff;
  /* color: #fff; */
  border: 1px solid #dcdfe6;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-right: 0;
}
.graybj .title_seach .txtList {
  width: 930px;
  overflow: hidden;
  font-size: 16px;
  display: flex;
  align-items: center;
  border-radius: 6px;
}
.graybj .title_seach .txtList .host {
  color: #333;
  font-size: 26px;
  margin: 0 30px 0 10px;
  font-weight: 700;
}
.graybj .title_seach .txtList .active1 {
  color: #ff3131;
}
.graybj .title_seach .txtList li {
  flex-shrink: 0;
  font-family: '微软雅黑', serif;
  font-size: 20px;
  margin-right: 30px;
  box-sizing: border-box;
  color: #8c8c8c;
  text-align: center;
  cursor: pointer;
  user-select: none;
  padding: 16px 0;
}
.graybj .title_seach .txtList li.active {
  font-weight: 700;
  color: #ff3131;
  border-bottom: 2px solid #ff3131;
}
/* .graybj .title_seach .txtList li:hover {
  background: #f00;
  color: #fff;
} */
.graybj .title_seach .txtList .more {
  /* width: 40px; */
  height: 40px;
  border: 1px solid #999;
  line-height: 20px;
  text-align: center;
  margin: 0;
  /* font-size: 20px; */
  /* border-radius: 6px; */
  /* font-weight: 700; */
  background: #fff;
  color: #999;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
}
.axnEcoltx .priceCenter .size {
  font-size: 36px;
}
.noDatas {
  font-size: 16px;
  color: #999;
  width: 200px;
  height: 313px;
  margin: 20px auto;
  text-align: center;
  line-height: 313px;
}
</style>
<style scoped src="@/static/mulindex/css/fonts.css" />
<style scoped src="@/static/mulindex/css/shop.css" />
<style src="@/static/mulindex/css/newYear.css"></style>
