<template>
  <div class="graybj" id="app">
    <el-main class="comBox axnMain">
      <div class="box_titile">
        <div class="navHead" style="height:30px;flex-shrink: 0;">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item> 全部结果</el-breadcrumb-item>
            <el-breadcrumb-item>{{ $route.query.schemeName }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="tags">
          <el-tag :key="itx" v-for="(tag, itx) in dynamicTags" closable :disable-transitions="false" type="info" @close="handleClose(tag)">
            <span>{{ tag.name }}</span>
            <span style="color:#F56C6C">{{ tag.val }}</span>
          </el-tag>
        </div>
        <div class="search">
          <div class="serchInput">
            <el-input placeholder="请输入商品名称如:快餐盒，外卖盒，纸杯" v-model="input2" @input="getPackSchemeSearchNameFn" @keyup.enter.native="initSearch(0)">
              <el-button slot="append" @click="initSearch(0)">搜索</el-button>
            </el-input>
          </div>
          <ul class="keysName" :style="searchShow == 1 ? 'display:block' : 'display:none'">
            <li v-for="eomo in searchName" :key="eomo.text" @click.stop="initSearch(1, eomo.text)">
              <span>{{ eomo.text }}</span>
            </li>
          </ul>
        </div>
      </div>

      <ul class="axLsaBox" style="margin-bottom: 10px;padding: 10px;">
        <li>
          <span class="axLsaLt">商品类型:</span>
          <div class="axLsaRt">
            <el-button @click="initTypeGoods(1)" :class="goodsType == null ? 'curr' : ''" type="text">全部</el-button>
            <el-button
              v-for="(item, index) in packFormlist"
              :key="index"
              @click="
                parmsData.formId = item.formIds;
                parmsData.pageNumber = 1;
                goodsType = item.type;
                toTag('商品类型:', item.type, 1);
              "
              :class="item.type == goodsType ? 'curr' : ''"
              type="text"
            >
              {{ item.type }}</el-button
            >
          </div>
        </li>
        <li>
          <span class="axLsaLt">商品规格:</span>
          <div class="axLsaRt">
            <el-button @click="initSpecificationGoods(1)" :class="specifications == null ? 'curr' : ''" type="text">全部</el-button>
            <el-button
              v-for="(item, index) in commercialList"
              :key="index"
              @click="
                parmsData.baseId = item.idStr;
                parmsData.packId = item.packIdStr;
                packIds = item.packIdStr;
                parmsData.pageNumber = 1;
                specifications = item.attribute;
                toTag('商品规格:', item.attribute, 2);
              "
              :class="item.attribute == specifications ? 'curr' : ''"
              type="text"
            >
              {{ item.attribute }}</el-button
            >
          </div>
        </li>
        <li>
          <span class="axLsaLt">包装形式:</span>
          <div class="axLsaRt">
            <el-button @click="initFormPacking(1)" :class="packName == null ? 'curr' : ''" type="text">全部</el-button>
            <el-button
              v-for="(item, index) in packList"
              :key="index"
              @click="
                parmsData.packId = item.idStr;
                packIdStr = item.idStr;
                parmsData.pageNumber = 1;
                packName = item.attribute;
                toTag('包装形式:', item.attribute, 3);
              "
              :class="item.attribute == packName ? 'curr' : ''"
              type="text"
            >
              {{ item.attribute }}</el-button
            >
          </div>
        </li>
        <li>
          <span class="axLsaLt">包装设计风格:</span>
          <div class="axLsaRt">
            <el-button @click="initStyle(1)" :class="parmsData.styleId == null ? 'curr' : ''" type="text">全部</el-button>
            <el-button
              v-for="(item, index) in styleList"
              :key="index"
              @click="
                parmsData.styleId = item.id;
                parmsData.pageNumber = 1;
                toTag('包装设计风格:', item.name, 4);
              "
              :class="item.id == parmsData.styleId ? 'curr' : ''"
              type="text"
            >
              {{ item.name }}</el-button
            >
          </div>
        </li>
        <li>
          <span class="axLsaLt">包装功能:</span>
          <div class="axLsaRt">
            <el-button @click="initHandles(1)" :class="parmsData.packAttr == null ? 'curr' : ''" type="text">全部</el-button>
            <el-button
              v-for="(item, index) in attrList"
              :key="index"
              @click="
                parmsData.packAttr = item;
                parmsData.pageNumber = 1;
                toTag('包装功能:', item, 5);
              "
              :class="item == parmsData.packAttr ? 'curr' : ''"
              type="text"
            >
              {{ item }}</el-button
            >
          </div>
        </li>
        <li>
          <el-row class="axLsort flex since">
            <el-col :span="12" class="axLsortL" style="margin-left: 18px;display:flex;flex:0 0 64%">
              <el-button-group>
                <el-button
                  :class="['btns', parmsData.saleCount == null && parmsData.price == null ? 'sums' : '']"
                  @click="
                    parmsData.saleCount = null;
                    parmsData.price = null;
                    parmsData.pageNumber = 1;
                  "
                  size="mini"
                  >综合</el-button
                >
                <el-button
                  :class="['priceAbnt', 'btns', parmsData.saleCount !== null && parmsData.price == null ? 'sums' : '']"
                  @click="
                    saleOrderByAsc = !saleOrderByAsc;
                    parmsData.saleCount = saleOrderByAsc ? 1 : 0;
                    parmsData.price = null;
                    parmsData.pageNumber = 1;
                  "
                  size="mini"
                >
                  销量
                  <i :class="saleOrderByAsc ? 'el-icon-caret-top curr' : 'el-icon-caret-top'"></i>
                  <i :class="saleOrderByAsc ? 'el-icon-caret-bottom' : 'el-icon-caret-bottom curr'"></i>
                </el-button>
                <el-button
                  :class="['priceAbnt', 'btns', parmsData.price !== null && parmsData.saleCount == null ? 'sums' : '']"
                  size="mini"
                  @click="
                    priceOrderByAsc = !priceOrderByAsc;
                    parmsData.price = priceOrderByAsc ? 1 : 0;
                    parmsData.saleCount = null;
                    parmsData.pageNumber = 1;
                  "
                >
                  价格
                  <i :class="priceOrderByAsc ? 'el-icon-caret-top curr' : 'el-icon-caret-top'"></i>
                  <i :class="priceOrderByAsc ? 'el-icon-caret-bottom' : 'el-icon-caret-bottom curr'"></i>
                </el-button>
              </el-button-group>
              <div style="margin: 0 30px 0 20px">
                <el-input v-model.trim="beginPrice" style="width:120px" clearable @blur="priceRanges(1, beginPrice)" @clear="clear(1)">
                  <template slot="prepend">￥</template>
                </el-input>
                <span style="padding:0 10px;color: #909399;">~</span>
                <el-input v-model.trim="endPrice" style="width:120px" clearable @blur="priceRanges(2, endPrice)" @clear="clear(2)">
                  <template slot="prepend">￥</template>
                </el-input>
              </div>
              <el-select v-model="parmsData.sdCategoryId" placeholder="筛选包装类型" clearable @change="selectPackge">
                <el-option v-for="item in filterList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-col>
            <el-col :span="12" class="axLsortR">
              <span class="axLsortRspn"
                >共找到 <span>{{ totalCount }}</span> 套相关方案</span
              >
              <span class="axLsortRspn"
                ><b>{{ parmsData.pageNumber }}</b
                >/{{ Math.ceil(totalCount / parmsData.pageSize) }}</span
              >
              <el-button-group>
                <el-button @click="parmsData.pageNumber < 2 ? 1 : parmsData.pageNumber--" class="ative" size="mini" icon="el-icon-arrow-left"></el-button>
                <el-button @click="parmsData.pageNumber++" size="mini" icon="el-icon-arrow-right"></el-button>
              </el-button-group>
            </el-col>
          </el-row>
        </li>
      </ul>

      <div class="axnWrap">
        <el-row :gutter="10">
          <el-col class="axnEcol" v-show="vo.goodsImg" :span="6" v-for="(vo, index) in productList" :key="index" style="cursor: pointer;">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div @click="routeToProduct(vo.id)">
                <p class="axnEcoImg"><img :src="alifileUrl + getImg(vo.goodsImg)" /></p>
                <div class="axnEcoltx">
                  <h3 class="keyword" v-html="vo.schemeName"></h3>
                  <div class=" axnEcolBt priceCenter" style="text-align: center;">
                    <span class="axnEcolBtsp  size"><i style="font-size: 18px;">￥</i>{{ vo.price }}<i style="font-size: 14px;color: #999;margin-left: 10px;">元/套起</i></span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div v-if="productList.length == 0" class="noDatas">找不到相关数据~~</div>
        <el-pagination background class="axnPag" @current-change="handleCurrentChange" :current-page="parmsData.pageNumber" :page-size="parmsData.pageSize" layout="total, prev, pager, next, jumper" :total="totalCount"> </el-pagination>
      </div>
    </el-main>
  </div>
</template>
<script>
import { setDocumentTitle } from '@/utils/domUtil';
import { getPackSchemeSearch, getPackSchemeSearchName } from '@/api/zbz/packCategoryApi';

export default {
  name: 'packageList',
  data() {
    return {
      alifileUrl: 'http://alifile.xiaocaiyin.com/',
      dynamicTags: [],
      packFormlist: [],
      commercialList: [],
      packList: [],
      attrList: [],
      styleList: [],
      productList: [],
      totalCount: 0,
      priceOrderByAsc: true,
      saleOrderByAsc: true,
      beginPrice: null, //最低价格
      endPrice: null, //最高价格
      goodsType: null,
      specifications: null,
      packName: null,
      packIds: null,
      packIdStr: null,
      parmsData: {
        baseId: null, //商品规格id
        beginPrice: null, //最低价格
        categoryId: null, //分类下商品id
        endPrice: null, //最高价格
        formId: null, //规格id
        packAttr: null, //包装属性id
        packId: null, //包装规格id
        pageNumber: 1, //页数
        pageSize: 16, //页大小
        styleId: null, //风格id
        price: null, //按价格排序 0是升序1是降序
        saleCount: null, //按销量排序 0是升序1是降序
        schemeName: null, //es收索关键字
        sdCategoryId: null //包含的商品分类的id
      },
      input2: '',
      filterList: [],
      searchName: [],
      searchText: '',
      searchShow: 0
    };
  },
  created() {
    // this.getSecondCategoriesFn();
    this.searchText = this.$route.query.schemeName;
    this.$report({
      channel: 161002,
      actionId: 1,
      param: JSON.stringify(this.$route.query)
    });
  },
  methods: {
    ...{ setDocumentTitle },
    // 获取json数据的图片地址
    getImg(url) {
      if (url) {
        let data = JSON.parse(url);
        return data.secondThumbnail;
      }
    },
    // 初始化商品类型
    initTypeGoods(type) {
      this.parmsData.formId = null;
      this.parmsData.pageNumber = 1;
      this.goodsType = null;
      this.parmsData.sdCategoryId = null;
      if (type == 1) {
        let index = this.dynamicTags.findIndex(e => e.name == '商品类型:');
        if (index > -1) {
          this.dynamicTags.splice(index, 1);
        }
      }
    },
    // 初始化商品规格
    initSpecificationGoods(type) {
      this.parmsData.baseId = null;
      this.parmsData.pageNumber = 1;
      this.specifications = null;
      this.packIds = null;
      this.parmsData.sdCategoryId = null;
      if (this.packIdStr) {
        this.parmsData.packId = this.packIdStr;
      } else {
        this.parmsData.packId = null;
      }
      if (type == 1) {
        let index = this.dynamicTags.findIndex(e => e.name == '商品规格:');
        if (index > -1) {
          this.dynamicTags.splice(index, 1);
        }
      }
    },
    //初始化包装形式
    initFormPacking(type) {
      if (this.packIds) {
        this.parmsData.packId = this.packIds;
      } else {
        this.parmsData.packId = null;
      }
      // console.log('this.parmsData--', this.parmsData);
      this.parmsData.pageNumber = 1;
      this.packName = null;
      this.packIdStr = null;
      this.parmsData.sdCategoryId = null;
      if (type == 1) {
        let index = this.dynamicTags.findIndex(e => e.name == '包装形式:');
        if (index > -1) {
          this.dynamicTags.splice(index, 1);
        }
      }
    },
    // 初始化设计风格
    initStyle(type) {
      this.parmsData.styleId = null;
      this.parmsData.pageNumber = 1;
      this.parmsData.sdCategoryId = null;
      if (type == 1) {
        let index = this.dynamicTags.findIndex(e => e.name == '包装设计风格:');
        if (index > -1) {
          this.dynamicTags.splice(index, 1);
        }
      }
    },
    // 初始化包装功能
    initHandles(type) {
      this.parmsData.packAttr = null;
      this.parmsData.pageNumber = 1;
      this.parmsData.sdCategoryId = null;
      if (type == 1) {
        let index = this.dynamicTags.findIndex(e => e.name == '包装功能:');
        if (index > -1) {
          this.dynamicTags.splice(index, 1);
        }
      }
    },
    // 传值给标签显示对应的属性
    toTag(name, val, type) {
      let obj = { name, val, type };
      let index = this.dynamicTags.findIndex(e => e.name == name);
      if (index == -1) {
        this.dynamicTags.push(obj);
      } else {
        this.dynamicTags[index].val = val;
      }
    },
    // 标签关闭
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      if (tag.type == 1) {
        this.initTypeGoods();
      } else if (tag.type == 2) {
        this.initSpecificationGoods();
      } else if (tag.type == 3) {
        this.initFormPacking();
      } else if (tag.type == 4) {
        this.initStyle();
      } else {
        this.initHandles();
      }
      // console.log('tag----', tag);
    },
    initSearch(type, txt) {
      if (type == 1) {
        this.searchText = txt;
      } else {
        this.searchText = this.input2;
      }
      this.searchShow = 0;
      this.parmsData.pageNumber = 1;
      this.parmsData.baseId = null;
      this.parmsData.packId = null;
      this.parmsData.packAttr = null;
      this.parmsData.styleId = null;
      this.parmsData.saleCount = null;
      this.parmsData.price = null;
    },
    clear(type) {
      if (type == 1) {
        this.parmsData.beginPrice = null;
      } else {
        this.parmsData.endPrice = null;
      }
    },
    selectText() {
      this.input2 = this.searchText;
      this.parmsData.schemeName = this.searchText;
      if (this.$route.query.schemeName != this.searchText) {
        this.$router.push({ path: '/packagingSolution/searchResults', query: { schemeName: this.searchText } });
      }
    },

    getPackSchemeSearchNameFn() {
      this.input2 = this.input2.replace(/^\s/, '');
      this.searchShow = 1;
      getPackSchemeSearchName({ schemeName: this.input2 }).then(res => {
        // console.log('getPackSchemeSearchName', res);
        this.searchName = res.data == null ? [] : res.data;
      });
    },
    getPackSchemeSearchFn() {
      getPackSchemeSearch(this.parmsData).then(res => {
        // console.log('搜索框', res.data);
        if (res.code == '000000') {
          this.packFormlist = res.data.getyPackForm; //商品类型
          this.attrList = res.data.packAttrNameList; //包装功能
          this.packList = res.data.packSpecifications; //包装形式
          this.commercialList = res.data.commercialSpecifications; //包装规格

          this.totalCount = res.data.totalCount;
          this.productList = res.data.packSchemeEsList;

          this.styleList = res.data.getStyleList;
          this.filterList = res.data.getyCategories;

          this.setDocumentTitle(this.$route.query.schemeName + '包装方案-傲彩aocai.cn');
        }
      });
    },

    routeToProduct(id) {
      let routeUrl = this.$router.resolve({ path: '/packagingSolution/packageDetails', query: { id: id } });
      window.open(routeUrl.href, '_blank');
    },
    handleCurrentChange(pageNumber) {
      this.parmsData.pageNumber = pageNumber;
    },
    priceRanges(val, price) {
      // console.log('this.beginPriceal', price);
      this.parmsData.pageNumber = 1;
      const reg1 = /^[0-9]+(.[0-9]{2})?$/.test(price);
      //   const reg2 = /^[0-9]+(.[0-9]{2})?$/.test(this.endPrice);
      if (val === 1) {
        if (price == '' || price == null) {
          // this.$message.error('请输入最低价格');
          this.parmsData.beginPrice = null;
        } else {
          if (!reg1) {
            this.$message.error('请输入数字');
            this.beginPrice = '';
          } else {
            this.parmsData.beginPrice = price;
          }
        }
      }
      if (val === 2) {
        if (price == '' || price == null) {
          // this.$message.error('请输入最高价格');
          this.parmsData.endPrice = null;
        } else {
          if (!reg1) {
            this.$message.error('请输入数字');
            this.endPrice = '';
          } else {
            this.parmsData.endPrice = price;
          }
        }
      }
    },

    // // 筛选包装类型
    // getSecondCategoriesFn() {
    //   getSecondCategories(this.formQarms).then(res => {
    //     // console.log('getSecondCategories', res);
    //     this.filterList = res.data;
    //   });
    // },

    // 选择包装类型
    selectPackge(e) {
      // console.log('包装类型', e);
      this.parmsData.pageNumber = 1;
      if (e == '') {
        this.parmsData.sdCategoryId = null;
      }
    }
  },

  watch: {
    parmsData: {
      handler() {
        if (this.parmsData.schemeName != null) {
          this.getPackSchemeSearchFn();
        }
      },
      deep: true,
      immediate: true
    },
    searchText: {
      handler() {
        // let reg = /\s+/g;

        // console.log('searchText', reg.test(this.searchText));
        if (this.searchText == '' || this.searchText == null) {
          this.searchText = this.$route.query.schemeName;
        } else {
          this.selectText();
        }
      },
      deep: true
    },
    '$route.query.schemeName': {
      handler() {
        window.location.reload();
      }
    }
  }
};
</script>
<style scoped>
.axLsaLt {
  margin-top: -2px;
}
</style>
<style lang="scss">
.keyword span {
  color: #e60021;
}
.box_titile .navHead .poist {
  position: relative;
  border: 1px solid #ddd;
  padding: 6px;
  top: -6px;
}
.box_titile .navHead .poist:hover {
  border: none;
}
.down {
  display: inline-block;
}
.up {
  display: none;
}
.poist:hover .down {
  display: none;
}
.poist:hover .up {
  display: inline-block;
}
.poist:hover .el-breadcrumb__inner {
  position: relative;
  z-index: 99;
  // border: 1px solid #f00;
  box-shadow: 0px -3px 3px rgb(0 0 0 / 30%);
  border-bottom: none;
  padding: 6px;
  background: #fff;
  cursor: pointer;
}

.box_titile .navHead .hidden {
  // display: none;
}
.box_titile .navHead .dropDown {
  position: absolute;
  top: 30px;
  left: 0px;
  z-index: -1;
  min-width: 350px;
  // min-height: 100px;
  // border: 1px solid #e60021;
  box-shadow: 0px 0 6px rgb(0 0 0 / 30%);
  background: #fff;
  display: block;
}
.mouchSome {
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
  padding: 20px 6px;
}

.mouchSome li {
  width: 100px;
  margin-right: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 10px;
  cursor: pointer;
}
.mouchSome .typeActive,
.mouchSome li:hover {
  color: #e60021;
}
.graybj .box_titile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 22px 0;
}
.graybj .box_titile .tags {
  margin-top: -7px;
  margin-left: 10px;
  user-select: none;
  width: 660px;
}
.graybj .box_titile .tags span {
  margin-right: 10px;
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}
.graybj .box_titile .search {
  position: relative;
  top: -8px;
}
.graybj .box_titile .search .keysName {
  width: 387px;
  position: absolute;
  z-index: 7;
  border: 1px solid #dcdfe6;
  border-top: 0;
  background: #fff;
  line-height: 26px;
}
.graybj .box_titile .search .keysName li:focus {
  display: none;
}
.graybj .box_titile .search .keysName li {
  cursor: pointer;
  padding: 0 8px;
}
.graybj .box_titile .search .keysName li:hover {
  background: #f5f4f4;
}
.graybj .box_titile .search .el-input {
  width: 460px;
}
.search .el-input-group > .el-input__inner {
  // border: 1px solid #ff0000 !important;
  box-sizing: border-box;
  //   border-radius: 6px;
}
.graybj .box_titile .search .el-input-group__append {
  background: #fff;
  // color: #fff;
  // border: 1px solid #ff0000 !important;
}
.axnMain .axLsaBox .axLsort {
  width: 100%;
  border: none;
  background: #fff;
  padding: 10px;
}
.axnMain .noDatas {
  font-size: 16px;
  color: #999;
  width: 200px;
  height: 313px;
  margin: 20px auto;
  text-align: center;
  line-height: 313px;
}
.axnMain .axLsaBox .axLsort .btns {
  margin-right: 10px;
  border-radius: 3px;
}
.axnMain .axLsaBox .axLsort .sums {
  background: #e60021 !important;
  color: #fff !important;
}
.axnMain .axLsaBox .since .priceAbnt {
  background: none;
  color: #101010;
}
.axLsort .el-input-group__prepend {
  padding: 0 5px;
  // background: #fff;
  // color: #101010 ;
  // border-right: none;
}
.axLsort .el-input-group > .el-input__inner {
  height: 28px;
  // border-left: none;
}
.axLsortL .el-select .el-input__inner {
  width: 150px;
  height: 28px;
}
.axLsortL .el-input__suffix .el-input__icon {
  line-height: 28px;
  user-select: none;
}
// .axnEcoltx .priceCenter {
//   text-align: center;
// }
.axnEcoltx .priceCenter .size {
  font-size: 36px;
}
</style>
<style scoped src="@/static/mulindex/css/fonts.css" />
<style scoped src="@/static/mulindex/css/shop.css" />
