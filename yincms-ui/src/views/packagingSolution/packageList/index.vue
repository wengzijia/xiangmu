<template>
  <div class="graybj" id="app">
    <el-main class="comBox axnMain">
      <!-- <el-breadcrumb class="crumb">
        <el-breadcrumb-item><em class="icon icon-locat"></em>您当前的位置：</el-breadcrumb-item>
        <el-breadcrumb-item>{{ zbzCate.title }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ zbzSubCate.title }}</el-breadcrumb-item>
      </el-breadcrumb> -->
      <div class="box_titile">
        <div class="navHead" style="height:30px;flex-shrink: 0;">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item class="poionter" @click.native="$router.push('/packagingSolution/packagingSolution')">包装方案</el-breadcrumb-item>
            <el-breadcrumb-item class="poionter" v-for="(k, i) in titleList" :key="i" :class="i + 1 == titleList.length ? 'poist' : ''"
              ><span style="cursor: pointer;" @click="goToCary(k.id, k.pid, k.linkCategoryIds)"
                >{{ k.name }}
                <i v-if="i + 1 == titleList.length" class="down el-icon-arrow-down"></i>
                <i v-if="i + 1 == titleList.length" class="up el-icon-arrow-up"></i>
              </span>
              <div v-if="i + 1 == titleList.length" class="dropDown hidden">
                <ul class="mouchSome">
                  <li v-for="v in threeList" :key="v.id" :class="[v.id == k.id ? 'typeActive' : '', v.schemeNum == 0 ? 'grayColor' : '']" @click="categoryThree(v.id, v.linkCategoryIds)">{{ v.name }}</li>
                </ul>
              </div>
            </el-breadcrumb-item>
            <!-- <el-breadcrumb-item>{{ titleTxt }}</el-breadcrumb-item> -->
          </el-breadcrumb>
        </div>
        <div class="tags">
          <el-tag :key="itx" v-for="(tag, itx) in dynamicTags" closable :disable-transitions="false" type="info" @close="handleClose(tag)">
            <span>{{ tag.name }}</span>
            <span style="color:#F56C6C">{{ tag.val }}</span>
          </el-tag>
        </div>
        <!-- <div class="search" v-if="false">
          <el-input placeholder="请输入商品名称如，快餐盒，外卖盒，纸杯" prefix-icon="el-icon-search" v-model="input2">
            <el-button slot="append" @click="search(input2)">搜索</el-button>
          </el-input>
        </div> -->
      </div>

      <ul class="axLsaBox" style="margin-bottom: 10px;">
        <li v-if="goodsCategoryList.length > 0">
          <span class="axLsaLt">商品分类:</span>
          <div class="axLsaRt ">
            <!-- <el-button @click="initCateGoods(1)" :class="cateIds == null ? 'curr' : ''" type="text">全部</el-button> -->
            <el-button v-for="(item, index) in goodsCategoryList" :key="index" @click="toLink(item.id)" :class="cateIds == item.id ? 'curr' : ''" type="text"> {{ item ? item.name : '' }}</el-button>
          </div>
        </li>
        <template v-if="goodsCategoryList.length == 0">
          <li>
            <span class="axLsaLt">商品类型:</span>
            <div class="axLsaRt ">
              <el-button @click="initTypeGoods(1)" :class="formType == null ? 'curr' : ''" type="text">全部</el-button>
              <el-button
                v-for="(item, index) in formsList"
                :key="index"
                @click="
                  formType = item ? item.type : '';
                  parmsData.formIds = item.formIds;
                  formQarms.formIds = item.formIds;
                  parmsData.pageNumber = 1;
                  parmsData.sdCategoryId = null;
                  toTag('商品类型:', item ? item.type : '', 1);
                "
                :class="item && formType == item.type ? 'curr' : ''"
                type="text"
              >
                {{ item ? item.type : '' }}</el-button
              >
            </div>
          </li>
          <li>
            <span class="axLsaLt">商品规格:</span>
            <input type="checkbox" name="toggle" id="toggle" style="display: none;" />
            <div class="axLsaRt muchText" ref="goodsMuchText">
              <el-button @click="initSpecificationGoods(1)" :class="attribute == null ? 'curr' : ''" type="text">全部</el-button>
              <el-button
                v-for="(item, index) in packList"
                :key="index"
                @click="
                  attribute = item.attribute;
                  parmsData.attrRelations = item.attrRelations;
                  formQarms.attrRelations = item.attrRelations;
                  parmsData.pageNumber = 1;
                  parmsData.sdCategoryId = null;
                  toTag('商品规格:', item.attribute, 2);
                "
                :class="attribute == item.attribute ? 'curr' : ''"
                type="text"
              >
                {{ item.attribute }}</el-button
              >
            </div>
            <label class="labelBtn" for="toggle">
              <span class="el-icon-arrow-down"></span>
              <span class="el-icon-arrow-up"></span>
            </label>
          </li>
          <li>
            <span class="axLsaLt">包装形式:</span>
            <div class="axLsaRt">
              <el-button @click="initFormPacking(1)" :class="packIds == null ? 'curr' : ''" type="text">全部</el-button>
              <el-button
                v-for="(e, i) in attrList"
                :key="i"
                @click="
                  packIds = e.packTypeName;
                  parmsData.packIds = e.ids;
                  formQarms.packIds = e.ids;
                  parmsData.pageNumber = 1;
                  parmsData.sdCategoryId = null;
                  toTag('包装形式:', e.packTypeName, 3);
                "
                :class="packIds == e.packTypeName ? 'curr' : ''"
                type="text"
              >
                {{ e.packTypeName }}</el-button
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
                  formQarms.styleId = item.id;
                  parmsData.pageNumber = 1;
                  parmsData.sdCategoryId = null;
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
                v-for="(item, index) in handlesList"
                :key="index"
                @click="
                  parmsData.packAttr = item.name;
                  formQarms.packAttr = item.name;
                  parmsData.pageNumber = 1;
                  parmsData.sdCategoryId = null;
                  toTag('包装功能:', item.name, 5);
                "
                :class="item.name == parmsData.packAttr ? 'curr' : ''"
                type="text"
              >
                {{ item.name }}</el-button
              >
            </div>
          </li>
        </template>
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
                  :class="['priceAbnt', 'btns', parmsData.saleCount !== null ? 'sums' : '']"
                  @click="
                    saleOrderByAsc = !saleOrderByAsc;
                    parmsData.saleCount = saleOrderByAsc ? 1 : 0;
                    parmsData.pageNumber = 1;
                  "
                  size="mini"
                >
                  销量
                  <i :class="saleOrderByAsc ? 'el-icon-caret-top curr' : 'el-icon-caret-top'"></i>
                  <i :class="saleOrderByAsc ? 'el-icon-caret-bottom' : 'el-icon-caret-bottom curr'"></i>
                </el-button>
                <el-button
                  :class="['priceAbnt', 'btns', parmsData.price !== null ? 'sums' : '']"
                  size="mini"
                  @click="
                    priceOrderByAsc = !priceOrderByAsc;
                    parmsData.price = priceOrderByAsc ? 1 : 0;
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
        <el-pagination background class="axnPag" @current-change="handleCurrentChange" :current-page="parmsData.pageNumber" :page-size="parmsData.pageSize" :hide-on-single-page="true" layout="total, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </el-main>
  </div>
</template>
<script>
import { setDocumentTitle } from '@/utils/domUtil';
import { currentCategoryList, pagePackScheme, formListByCateId, getParentsByCategoryId, getSecondCategories } from '@/api/zbz/packCategoryApi';
export default {
  name: 'packageList',
  data() {
    return {
      alifileUrl: 'http://alifile.xiaocaiyin.com/',
      zbzCate: {
        id: 1,
        title: ''
      },
      zbzSubCate: {
        id: 0,
        title: ''
      },
      zbzSubCateList: [],
      cateList: [],
      formsList: [], //商品类型
      packList: [],
      attrList: [],
      styleList: [],
      handlesList: [],
      productList: [],
      totalCount: 0,
      priceOrderByAsc: true,
      saleOrderByAsc: true,
      queryData: {
        categoryId: ''
      },
      beginPrice: null, //最低价格
      endPrice: null, //最高价格
      packIds: null,
      formType: null,
      attribute: null,
      parmsData: {
        attrRelations: null,
        beginPrice: null, //最低价格
        categoryIds: null, //商品分类
        endPrice: null, //最高价格
        formIds: null, //商品id
        isHot: null, //热搜
        packAttr: null, //包装属性id
        packIds: null, //包装类型
        pageNumber: 1, //页数
        pageSize: 12, //页大小
        price: null, //按价钱排序
        saleCount: null, //按销量排序
        // schemeName: null, //es收索关键字
        // schemeNameList: [], //多关键字收索
        sdCategoryId: null, //包含的商品分类的id
        styleId: null //风格id
      },
      formQarms: {
        attrRelations: null,
        categoryIds: '',
        formIds: '',
        packAttr: '',
        packIds: '',
        styleId: ''
      },
      cateIds: null, //商品分类id
      input2: '',
      titleList: [],
      titleTxt: null,
      filterList: [],
      threeList: [],
      value: '',
      pids: null,
      dynamicTags: [],
      goodsCategoryList: []
    };
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
    // 文本初始化有没有被截断,控制切换按钮的显示
    setTruncated() {
      setTimeout(() => {
        this.$nextTick(() => {
          if (this.$refs.goodsMuchText) {
            this.$refs.goodsMuchText.classList[this.$refs.goodsMuchText.scrollHeight > this.$refs.goodsMuchText.offsetHeight ? 'add' : 'remove']('truncated');
          }
        });
      }, 400);
    },
    // 初始化商品类型
    initCateGoods(type) {
      this.parmsData.cateIds = null;
      this.formQarms.cateIds = null;
      this.parmsData.pageNumber = 1;
      this.parmsData.sdCategoryId = null;
      if (type == 1) {
        let index = this.dynamicTags.findIndex(e => e.name == '商品分类:');
        if (index > -1) {
          this.dynamicTags.splice(index, 1);
        }
      }
    },
    // 初始化商品类型
    initTypeGoods(type) {
      this.formType = null;
      this.parmsData.formIds = null;
      this.formQarms.formIds = null;
      this.parmsData.pageNumber = 1;
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
      this.attribute = null;
      this.parmsData.attrRelations = null;
      this.formQarms.attrRelations = null;
      this.parmsData.pageNumber = 1;
      this.parmsData.sdCategoryId = null;
      if (type == 1) {
        let index = this.dynamicTags.findIndex(e => e.name == '商品规格:');
        if (index > -1) {
          this.dynamicTags.splice(index, 1);
        }
      }
    },
    //初始化包装形式
    initFormPacking(type) {
      this.packIds = null;
      this.parmsData.packIds = null;
      this.formQarms.packIds = null;
      this.parmsData.pageNumber = 1;
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
      this.formQarms.styleId = null;
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
      this.formQarms.packAttr = null;
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

      // console.log('this.parmsData--', this.parmsData);
    },
    toLink(id) {
      this.cateIds = id;
      this.parmsData.pageNumber = 1;
      this.parmsData.sdCategoryId = null;
      this.$router.push({ path: '/packagingSolution/packageList', query: { id: this.cateIds } });
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
    goToCary(id, pid, linkCategoryIds) {
      this.$router.push({ path: '/packagingSolution/packageList', query: { id: id } });
      this.parmsData.categoryIds = linkCategoryIds;
      this.formQarms.categoryIds = linkCategoryIds;
      this.pids = pid;
      this.parmsData.pageNumber = 1;
      // 初始化导航栏的数据
      this.dynamicTags = [];
      this.initTypeGoods();
      this.initSpecificationGoods();
      this.initFormPacking();
      this.initStyle();
      this.initHandles();
    },
    clear(type) {
      if (type == 1) {
        this.parmsData.beginPrice = null;
      } else {
        this.parmsData.endPrice = null;
      }
    },
    routeToProduct(id) {
      // this.$router.push({ path: '/packagingSolution/packageDetails', query: { id: id } });
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
    // 商品列表
    pagePackSchemeFn() {
      // console.log('this.parmsData', this.parmsData);
      pagePackScheme(this.parmsData)
        .then(res => {
          this.productList = res.data == null ? [] : res.data;
          this.totalCount = res.totalCount;
          //   console.log('productList666', this.productList);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 导航栏
    getParentsByCategoryIdFn(id) {
      getParentsByCategoryId({ categoryId: id }).then(res => {
        // console.log('getParentsByCategoryId', res);
        this.titleList = res.data;
        this.pids = this.titleList[this.titleList.length - 1].pid;
        let title = this.titleList[this.titleList.length - 1].name;
        this.setDocumentTitle(title + '包装方案-傲彩aocai.cn');
        let index = this.titleList.findIndex(e => e.id == id);
        this.parmsData.categoryIds = this.titleList[index].linkCategoryIds;
        this.formQarms.categoryIds = this.titleList[index].linkCategoryIds;
      });
    },
    // 筛选包装类型
    getSecondCategoriesFn() {
      getSecondCategories(this.formQarms).then(res => {
        // console.log('getSecondCategories', res);
        this.filterList = res.data;
      });
    },
    // 3级分类
    currentCategoryListFn(id, type) {
      currentCategoryList({ pid: id }).then(res => {
        if (res.code == '000000') {
          if (type == 1) {
            // console.log('currentCategoryListFn111', res.data);
            this.goodsCategoryList = res.data;
          } else {
            this.threeList = res.data;
          }
        }
      });
    },
    categoryThree(id, linkCategoryIds) {
      this.$router.push(`/packagingSolution/packageList?id=${id}`);
      // 初始化导航栏的数据
      this.dynamicTags = [];
      this.initTypeGoods();
      this.initSpecificationGoods();
      this.initFormPacking();
      this.initStyle();
      this.initHandles();

      this.parmsData = {
        attrRelations: null, //商品规格id,包装规格id
        beginPrice: null, //最低价格
        categoryIds: null, //商品分类
        endPrice: null, //最高价格
        formIds: null, //商品id
        isHot: null, //热搜
        packAttr: null, //包装属性id
        packIds: null, //包装类型
        pageNumber: 1, //页数
        pageSize: 12, //页大小
        price: null, //按价钱排序
        saleCount: null, //按销量排序
        // schemeName: null, //es收索关键字
        // schemeNameList: [], //多关键字收索
        sdCategoryId: null, //包含的商品分类的id
        styleId: null //风格id
      };
      this.parmsData.categoryIds = linkCategoryIds;
      this.formQarms.categoryIds = linkCategoryIds;
    },
    // 搜索
    search(input) {
      console.log('搜索', input);
      this.input2 = '';
    },
    // 选择包装类型
    selectPackge(e) {
      // console.log('包装类型', e);
      this.parmsData.pageNumber = 1;
      if (e == '') {
        this.parmsData.sdCategoryId = null;
      }
      // else {
      //   this.parmsData.sdCategoryId = e;
      // }
    },
    // 商品名称， 商品规格，包装规格：
    formListByCateIdFn() {
      formListByCateId(this.formQarms)
        .then(res => {
          // console.log('商品规格', res.data);
          this.formsList = res.data.forms;
          this.packList = res.data.attrRelations;
          this.attrList = res.data.packAttributes;
          this.styleList = res.data.styles;
          this.handlesList = res.data.handles;
          // console.log('商品类型', this.formsList);
          // console.log('包装属性：', this.packList);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  watch: {
    '$route.query.id': {
      handler() {
        this.setTruncated();
        this.currentCategoryListFn(this.$route.query.id, 1);
        this.getParentsByCategoryIdFn(this.$route.query.id);
        this.$report({
          channel: 161001,
          actionId: 1,
          param: JSON.stringify(this.$route.query)
        });
      },
      deep: true,
      immediate: true
    },
    parmsData: {
      handler() {
        this.pagePackSchemeFn();
        this.setTruncated();
      },
      deep: true
    },
    pids: {
      handler() {
        this.currentCategoryListFn(this.pids, 2);
      },
      deep: true
    },
    formQarms: {
      handler() {
        this.getSecondCategoriesFn();
        this.formListByCateIdFn();
      },
      // immediate: true,
      deep: true
    }
  }
};
</script>
<style scoped lang="scss">
.axLsaLt {
  margin-top: -2px;
}
.muchText {
  max-height: 80px;
  overflow: hidden;
  color: #999;
}
input[name='toggle']:checked {
  & + .muchText {
    max-height: none;
  }
}
.labelBtn {
  display: none;
  flex: 0 0 44px;
  margin-top: 10px;
  cursor: pointer;
  color: #999;
  user-select: none;
}
.labelBtn:hover {
  color: #e60021;
}
.labelBtn {
  &::before {
    content: '更多';
  }
  .el-icon-arrow-down {
    display: inline-block;
  }
  .el-icon-arrow-up {
    display: none;
  }
}
input[name='toggle']:checked {
  & ~ label {
    &::before {
      content: '收起';
    }
    .el-icon-arrow-down {
      display: none;
    }
    .el-icon-arrow-up {
      display: inline-block;
    }
  }
}
.muchText {
  &.truncated {
    & + label {
      display: block;
    }
  }
}
</style>
<style lang="scss">
.grayColor {
  color: #a9a9a9;
}
.poionter {
  cursor: pointer;
  user-select: none;
}
.poionter:hover > span {
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
  // justify-content: space-between;
  align-items: center;
  margin: 22px 0;
}
.graybj .box_titile .tags {
  margin-top: -14px;
  margin-left: 10px;
  user-select: none;
}
.graybj .box_titile .tags span {
  margin-right: 10px;
  font-size: 14px;
  color: #606266;
  // margin-bottom: 10px;
}
// .graybj .box_titile .search .el-input {
//   width: 460px;
// }
// .search .el-input-group > .el-input__inner {
//   // border: 1px solid #ff0000 !important;
//   // box-sizing: border-box;
//     // border-radius: 6px;
// }
// .graybj .box_titile .search .el-input-group__append {
//   background: #ff0000;
//   color: #fff;
//   border: 1px solid #ff0000 !important;
// }
.axnMain .axLsaBox .axLsort {
  width: 100%;
  border: none;
  background: #fff;
  padding: 10px;
}
.axnMain .axLsaBox {
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
