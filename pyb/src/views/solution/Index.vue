<!-- fengjianbo -->
<template>
  <el-main v-loading="loading">
    <div class="comBox">
      <!--按条件筛选-->
      <div class="solutionBox">
        <ul class="solutionTop">
          <li>
            <span class="solutionLt">模板分类:</span>
            <div class="solutionRt">
              <a v-for="(item, index) in cateNavsTop" :key="index" :class="[item.id == cateNavsTopId ? 'curr' : '']" style="font-size: 14px" @click="cateNavsTopLink(item.id, item.name)">
                {{ item.name }}
              </a>
            </div>
          </li>
          <li :class="[categoryExpand ? 'curr' : '']">
            <span class="solutionLt">{{ cateNavsTopTitle }}:</span>
            <div class="solutionRt">
              <a style="font-size: 14px" :class="[cateNavsChildID == 0 ? 'curr' : '']" @click="cateNavsChildClick(0, 0)">
                全部
              </a>
              <a v-for="(item, index) in cateNavsChild" :key="index" @click="cateNavsChildClick(item.id, item.name)" :class="[cateNavsChildID == item.id ? 'curr' : '']" style="font-size: 14px">
                {{ item.name }}
              </a>
            </div>
            <span class="solutionMore" @click="isCategoryExpand">更多<em :class="[categoryExpand ? 'icon icon-arrow_up' : 'icon icon-arrow_d']"></em></span>
          </li>
          <li v-if="cateNavsChildID > 0 && cateNavsTopId == 1" class="Tot">
            <span class="solutionLt">{{ cateNavsThreeName }}:</span>
            <div class="solutionRt">
              <a style="font-size: 14px" :class="[cateNavsThreeID == 0 ? 'curr' : '']" @click="cateNavsThreeClick(0)">
                全部
              </a>
              <a v-for="(item, index) in cateNavsThree" :key="index" @click="cateNavsThreeClick(item.id)" :class="[cateNavsThreeID == item.id ? 'curr' : '']" style="font-size: 14px">
                {{ item.name }}
              </a>
            </div>
          </li>
          <li v-if="cateNavsTopId == 1">
            <span class="solutionLt">风格:</span>
            <div class="solutionRt">
              <a style="font-size: 14px" :class="[TemplateField1ID == 0 ? 'curr' : '']" @click="TemplateField1Click(0)">
                全部
              </a>
              <a v-for="(item, index) in TemplateField1" :key="index" @click="TemplateField1Click(item.id)" :class="[TemplateField1ID == item.id ? 'curr' : '']" style="font-size: 14px">
                {{ item.name }}
              </a>
            </div>
          </li>
          <li v-if="cateNavsTopId == 1">
            <span class="solutionLt">色系:</span>
            <div class="solutionRt">
              <a style="font-size: 14px" :class="[TemplateField2ID == 0 ? 'curr' : '']" @click="TemplateField2Click(0)">
                全部
              </a>
              <a v-for="(item, index) in TemplateField2" :key="index" @click="TemplateField2Click(item.id)" :class="[TemplateField2ID == item.id ? 'curr' : '']" style="font-size: 14px">
                {{ item.name }}
              </a>
            </div>
          </li>
          <li v-if="cateNavsTopId == 1" :class="[PackingTypeExpand ? 'curr' : '']">
            <span class="solutionLt">包装类型:</span>
            <div class="solutionRt">
              <a style="font-size: 14px" :class="[TemplateField3ID == 0 ? 'curr' : '']" @click="TemplateField3Click(0)">
                全部
              </a>
              <a v-for="(item, index) in TemplateField3" :key="index" @click="TemplateField3Click(item.id)" :class="[TemplateField3ID == item.id ? 'curr' : '']" style="font-size: 14px">
                {{ item.name }}
              </a>
            </div>
            <span class="solutionMore" @click="isPackingTypeExpand">更多<em :class="[PackingTypeExpand ? 'icon icon-arrow_up' : 'icon icon-arrow_d']"></em></span>
          </li>
        </ul>
        <div class="solutionGroup">
          <ul class="solutionGroupUl">
            <li class="grid" v-for="(item, index) in TemplatePage" :key="index" data-id="">
              <router-link :to="'/solution/detail?id=' + item.id" target="_blank">
                <div class="solutionGimg imgholder">
                  <img :src="'http://alifile.xiaocaiyin.com/' + item.photoPath1" style="object-fit: inherit" />
                </div>
                <h6 v-if="item.price == 0">免费下载</h6>
                <h6 v-if="item.price > 0">¥ {{ item.price }}</h6>
                <div class="solutionTx">
                  <p class="solutionTitle">{{ item.name }}</p>
                  <p class="solutionId">编号ID：{{ item.templateSn }}</p>
                </div>
              </router-link>
            </li>
          </ul>
          <!--分页-->
          <div class="w_page_0528" style="margin:30px 0;text-align: center;">
            <el-pagination background layout="prev, pager, next" :hide-on-single-page="value" :total="totalCount" :page-size="pageSize" :current-page="pageNumber" @current-change="handleCurrentChange"></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </el-main>
</template>

<script>
import store from '@/store';
import { getCateByParentId, getCateById, getFieldByParentId, getTemplatePage } from '@/api/template/templateApi';
export default {
  props: {
    //cateType: String
  },
  data() {
    return {
      cateNavsTop: [],
      cateNavsTopInfo: {},
      cateNavsChild: [],
      cateNavsChildInfo: {},
      cateNavsThree: [],
      TemplateField1: [],
      TemplateField2: [],
      TemplateField3: [],
      TemplatePage: [],
      cateNavsTopId: 1,
      cateNavsTopTitle: '行业类目',
      categoryExpand: false,
      PackingTypeExpand: false,
      TemplateField1ID: 0,
      TemplateField2ID: 0,
      TemplateField3ID: 0,
      cateNavsChildID: 0,
      cateNavsThreeID: 0,
      cateNavsThreeName: '',
      pageNumber: 1,
      pageSize: 16,
      value: true,
      totalCount: 1100,
      cateId: 1,
      fieldId: '',
      loading: true
    };
  },
  created() {
    this.getCateNavsTop(); //获取顶级分类
    this.getCateNavsTopInfo(); //获取顶级分类信息
    this.getCateNavsChild(this.cateNavsTopId); //获取子分类
    this.getTemplateField1('TemplateField1', 1); //获取风格
    this.getTemplateField2('TemplateField2', 10); //获取色系
    this.getTemplateField3('TemplateField3', 23); //获取包装类型
    this.getTemplateList(); //获取列表信息
  },
  methods: {
    getCateNavsTop() {
      getCateByParentId({ pid: 0, status: 1 }).then(res => {
        this.cateNavsTop = res.data;
      });
    },
    getCateNavsTopInfo() {
      getCateById({ id: 1, status: 1 }).then(res => {
        this.cateNavsTopInfo = res.data;
      });
    },
    getCateNavsChild(cateNavsTopId) {
      getCateByParentId({ pid: cateNavsTopId, status: 1 }).then(res => {
        this.cateNavsChild = res.data;
      });
    },
    //获取行业类目子类 获取三级分类
    getCateThree(pid) {
      getCateByParentId({ pid: pid, status: 1 }).then(res => {
        this.cateNavsThree = res.data;
      });
    },
    getTemplateField1(typeName, fieldId) {
      getFieldByParentId({ pid: fieldId, status: 1 }).then(res => {
        this.TemplateField1 = res.data;
      });
    },
    getTemplateField2(typeName, fieldId) {
      getFieldByParentId({ pid: fieldId, status: 1 }).then(res => {
        this.TemplateField2 = res.data;
      });
    },
    getTemplateField3(typeName, fieldId) {
      getFieldByParentId({ pid: fieldId, status: 1 }).then(res => {
        this.TemplateField3 = res.data;
      });
    },
    getTemplateList(pageNumber) {
      if (this.fieldId === 0) {
        this.fieldId = '';
      }
      if (!pageNumber) {
        this.pageNumber = 1;
      }
      getTemplatePage({
        cateId: this.cateId,
        field: this.fieldId,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        status: 1
      }).then(res => {
        this.TemplatePage = res.data;
        this.totalCount = res.totalCount;
        this.loading = false;
      });
    },
    //模板分类跳转
    cateNavsTopLink(id, name) {
      this.cateNavsTopId = id;
      this.cateNavsTopTitle = name;
      this.TemplateField1ID = 0;
      this.TemplateField2ID = 0;
      this.TemplateField3ID = 0;
      this.cateNavsChildID = 0;
      this.cateNavsThreeID = 0;
      this.cateId = id;
      this.fieldId = 0;
      this.getCateNavsChild(id);
      this.getTemplateList();
    },
    //行业类目展开
    isCategoryExpand() {
      this.categoryExpand = this.categoryExpand ? false : true;
    },
    //包装类型展开
    isPackingTypeExpand() {
      this.PackingTypeExpand = this.PackingTypeExpand ? false : true;
    },
    //获取行业类目子属性
    cateNavsChildClick(id, name) {
      this.cateNavsThreeID = 0;
      this.cateNavsChildID = id;
      this.cateNavsThreeName = name;
      this.cateId = id == 0 ? this.cateNavsTopId : id;
      this.getCateThree(id);
      this.getTemplateList();
    },
    cateNavsThreeClick(id) {
      this.cateNavsThreeID = id;
      this.cateId = id == 0 ? this.cateNavsChildID : id;
      this.getTemplateList();
    },
    TemplateField1Click(id) {
      this.TemplateField1ID = id;
      var fieldId = id == 0 ? '' : id;
      if (this.TemplateField2ID > 0) {
        fieldId = fieldId + ',' + this.TemplateField2ID;
      }
      if (this.TemplateField3ID > 0) {
        fieldId = fieldId + ',' + this.TemplateField3ID;
      }
      this.fieldId = fieldId;
      this.getTemplateList();
    },
    TemplateField2Click(id) {
      this.TemplateField2ID = id;
      var fieldId = id == 0 ? '' : id;
      if (this.TemplateField1ID > 0) {
        fieldId = fieldId + ',' + this.TemplateField2ID;
      }
      if (this.TemplateField3ID > 0) {
        fieldId = fieldId + ',' + this.TemplateField3ID;
      }
      this.fieldId = fieldId;
      this.getTemplateList();
    },
    TemplateField3Click(id) {
      this.TemplateField3ID = id;
      var fieldId = id == 0 ? '' : id;
      if (this.TemplateField1ID > 0) {
        fieldId = fieldId + ',' + this.TemplateField2ID;
      }
      if (this.TemplateField2ID > 0) {
        fieldId = fieldId + ',' + this.TemplateField3ID;
      }
      this.fieldId = fieldId;
      this.getTemplateList();
    },
    //分页
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.getTemplateList(pageNumber);
    }
  }
};
</script>

<style scoped src="../../static/mulindex/css/fonts.css"></style>
<style scoped src="../../static/index/css/new/public.css"></style>
<style scoped src="../../static/mulindex/css/index.css"></style>
<style scoped src="../../static/mulindex/css/attr.css"></style>
