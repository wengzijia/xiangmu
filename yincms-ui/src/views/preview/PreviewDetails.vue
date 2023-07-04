<template>
  <div style="background:#525659;height: 100%;float: left;width: 100%;">
    <!--top-->
    <el-row class="lookTop">
      <el-col :span="8" class="lookTopLt">
        <a href="/preview/previewList" style="color: #fff;margin-right: 20px;">
          <i class="el-icon-arrow-left">
            <span style="font-size: 14px">返回列表</span>
          </i></a
        >
        <i class="el-icon-s-fold" title="菜单" @click="showCont"></i>
        <img src="@/static/index/img/aocai.png" style="width: 22px;height: 24px;margin-top: 5px;" />
        <span>{{ pdfName }}</span>
      </el-col>
      <el-col :span="12" class="lookTopCot">
        <!-- <div class="lookTopCotL"><input type="text" placeholder="1" />/ 1</div> -->
        <div class="lookTopCotM">
          <i class="el-icon-minus" title="缩小" @click="narrow"></i>
          <input type="text" v-model="inpval" @blur="inpblur" />
          <span style="background:#191b1c;margin-left:-12px">%</span>
          <i class="el-icon-plus" title="放大" @click="enlarge"></i>
        </div>
        <div class="lookTopCotR">
          <i
            class="el-icon-c-scale-to-original"
            @click="
              width = suitable;
              inpval = suitable;
            "
            title="适合页面大小"
          ></i>
          <!-- <i class="el-icon-refresh" title="逆时针旋转"></i> -->
        </div>
      </el-col>
      <el-col :span="4" class="lookTopRt">
        <!-- <i class="el-icon-download" title="下载"></i>
        <i class="el-icon-printer" title="打印"></i> -->
      </el-col> </el-row
    ><!--top end-->
    <el-aside class="lookLeft" width="282" v-if="show">
      <template>
        <el-tabs :tab-position="tabPosition" style="height: 100vh">
          <el-tab-pane>
            <span slot="label" class="lookLicon" title="文档大纲">
              <!--              <i class="el-icon-s-order"></i>-->
            </span>
            <div class="flex" style="align-items: center; padding-bottom: 10px; display: flex">
              <span style="padding-left: 18px; margin-right: 6px;color: #fff;font-size: 16px;width: 90%; display: inline-block;">印前检查：傲彩文件预检系统</span>
            </div>
            <el-tree :default-expand-all="true" :data="data" :props="defaultProps" @node-click="handleNodeClick">
              <div class="showname" slot-scope="{ node, data }">
                <el-tooltip class="item" effect="light" :content="node.label" placement="top" v-if="node.label.length > 16">
                  <span> <svg-icon style="margin-right:0px;" v-if="data.type === 'group'" icon-class="cabinet-16px" />{{ node.label }}</span>
                </el-tooltip>
                <span v-else> <svg-icon style="margin-right:0px;" v-if="data.type === 'group'" icon-class="cabinet-16px" />{{ node.label }}</span>
              </div>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-aside>
    <el-container class="lookcont">
      <el-main class="lookMain" :class="lookMainShow ? 'lookMain-show' : 'lookMain-hide'">
        <img class="perImgs" :width="width + '%'" :src="domain + currentReport" style="background-color: #fff;margin-left: 282px;" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getReportDetail, getReportList } from '@/api/preview/previewApi';
export default {
  data() {
    return {
      lookMainShow: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tabPosition: 'left',
      show: true,
      pdfName: 'PO2021051784897098-4-1-350g单铜纸-UV-四色--哑胶-1000-V2_报告',
      domain: '/',
      currentReport: '',
      width: 100,
      inpval: 100,
      suitable: 100
    };
  },
  methods: {
    showCont: function() {
      this.show = !this.show;
    },
    handleNodeClick(data) {
      // console.log(data);
      // console.log(data.imgPath);
      if (data.imgPath) {
        this.currentReport = data.imgPath;
        const loading = this.$loading({
          lock: true,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        setInterval(loading.close(), 500);
      }
    },
    inpblur(e) {
      if (this.inpval < 20) {
        this.inpval = 20;
        this.width = this.inpval;
      } else if (this.inpval > 120) {
        this.inpval = 120;
        this.width = this.inpval;
      }
      this.width = this.inpval;
    },
    //放大
    enlarge() {
      if (this.width < 120) {
        this.width += 5;
        this.inpval = this.width;
      }
    },
    //缩小
    narrow() {
      if (this.width > 20) {
        this.width -= 5;
        this.inpval = this.width;
      }
    },
    getReportDetail() {
      console.log('this.$route.query.reportId', this.$route.query.reportId);
      if (!this.$route.query.reportId) {
        this.$message({
          type: 'error',
          message: '未获取到预检单号'
        });
        return false;
      }
      var data = {
        reportId: this.$route.query.reportId
      };
      getReportDetail(data)
        .then(res => {
          // console.log(res);
          if (res.code == '000000') {
            this.data = [];
            this.pdfName = res.data.pdfName + '-预检报告';
            var warnReport = res.data.warnReport['警告'];
            if (warnReport) {
              var warnReports = [];
              for (var i = 0; i < warnReport.length; i++) {
                warnReports[i] = {
                  label: warnReport[i].label,
                  imgPath: warnReport[i].imgPath,
                  children: [
                    {
                      label: '第' + warnReport[i].page + '页',
                      imgPath: warnReport[i].imgPath
                    }
                  ]
                };
                if (i == 0) {
                  this.currentReport = warnReport[i].imgPath;
                }
              }
              var warn = {
                label: '警告',
                children: warnReports
              };
              this.data.push(warn);
            }
            var errorReport = res.data.errorReport['错误'];
            if (errorReport) {
              var errorReports = [];
              for (var n = 0; n < errorReport.length; n++) {
                errorReports[n] = {
                  label: errorReport[n].label,
                  imgPath: errorReport[n].imgPath,
                  children: [
                    {
                      label: '第' + errorReport[n].page + '页',
                      imgPath: errorReport[n].imgPath
                    }
                  ]
                };
                if (n == 0 && this.currentReport == '') {
                  this.currentReport = errorReport[n].imgPath;
                }
              }
              var errs = {
                label: '错误',
                children: errorReports
              };
              this.data.push(errs);
            }
            setTimeout(this.isw, 600);
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '功能维护中，请稍候再试'
          });
        });
    },
    isw() {
      var canvas = document.querySelector('.perImgs');
      var w = canvas.width;
      var h = canvas.height;
      var scale = 0;
      if (w > h) {
        scale = 1200 / w;
      } else {
        scale = 800 / h;
      }
      if (scale * h > 800) {
        scale = 800 / h;
      }
      this.width = parseInt(scale * 100);
      this.inpval = parseInt(scale * 100);
      this.suitable = parseInt(scale * 100);
      this.lookMainShow = true;
    }
  },
  created() {
    this.getReportDetail();
  }
};
</script>
<style scoped>
html {
  background-color: #525659;
}
</style>
<style>
body {
  padding: 0;
  margin: 0;
  background: rgb(82, 86, 89);
}
.lookTop {
  background-color: #323639;
  padding: 10px 0;
  line-height: 36px;
  box-shadow: 2px 6px 18px -4px rgba(0, 0, 0, 0.4);
  -webkit-box-shadow: 2px 6px 8px -4px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 2px 6px 8px -4px rgba(0, 0, 0, 0.4);
  position: fixed;
  z-index: 9;
  color: #fff;
  font-size: 13px;
  width: 100%;
}
.lookTop i {
  cursor: pointer;
  width: 36px;
  height: 36px;
  line-height: 36px;
  display: inline-block;
  text-align: center;
  border-radius: 100%;
}
.lookTop i:hover {
  background-color: #424649;
}
.lookTopLt {
  display: flex;
  height: 36px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.lookTopLt i {
  font-size: 16px;
  margin: 0 16px;
}
.lookTopCot {
  display: flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  padding: 0 18%;
}
.lookTopCotL {
  padding-right: 20px;
  position: relative;
}
.lookTopCotL::after,
.lookTopCotM::after {
  background-color: #707375;
  width: 1px;
  content: '';
  height: 15px;
  position: absolute;
  right: 0;
  top: 10px;
}
.lookTopCotL input,
.lookTopCotM input {
  height: 20px;
  background-color: #191b1c;
  border: 0;
  font-weight: bold;
  text-align: center;
  display: inline-block;
  color: #fff;
  margin-right: 10px;
}
.lookTopCotL input {
  width: 24px;
}
.lookTopCotM {
  padding: 0 10px;
  position: relative;
}
.lookTopCotM input {
  width: 46px;
  margin-right: 0px;
}
.lookTopCotM input:focus,
.lookTopCotL input:focus {
  border: 0 !important;
  outline: 0;
}
.lookTop input::-webkit-input-placeholder {
  color: #fff;
}
.lookTop input::-moz-input-placeholder {
  color: #fff;
}
.lookTop input::-ms-input-placeholder {
  color: #fff;
}
.lookTopCotM i {
  font-weight: bold;
}
.lookTopCotR,
.lookTopRt {
  font-size: 18px;
}
.lookTopCotR {
  padding: 0 10px;
}
.lookTopRt {
  text-align: right;
  padding-right: 20px;
}

.lookcont {
  position: relative;
}
.lookLeft {
  z-index: 2;
  width: 282px;
  background-color: #323639;
  /* position: absolute;
  float: left;
  height: 100%;*/
  position: fixed;
  padding-top: 60px;
}
.lookLeft .el-tabs--left {
  padding-top: 16px;
  padding-bottom: 600px;
}
.lookLeft .el-tabs__item {
  color: #fff;
  padding: 0 0px 0 12px;
  margin-bottom: 18px;
  border-left: 4px solid #323639;
}
.lookLeft .el-tabs__item.is-active {
  border-color: #8ab4f8;
  color: #8ab4f8;
}
.lookLeft .el-tabs__nav-wrap::after {
  background-color: inherit;
}
.lookLeft .el-tree-node__label {
  font-size: 13px;
}
.lookLeft .el-tabs__header {
  width: 14px;
}
.lookLeft .el-tabs--left .el-tabs__header.is-left {
  margin-right: 0;
}
.lookLeft .el-tabs--left .el-tabs__item.is-left {
  text-align: left;
}
.lookLeft .el-tabs--left .el-tabs__active-bar.is-left,
.lookLeft .el-tabs--left .el-tabs__nav-wrap.is-left::after {
  display: none;
}
.lookLeft .el-tabs__content {
  padding-top: 8px;
}
.lookLeft .el-tree {
  background-color: inherit;
  color: #fff;
}
.lookLeft .el-tree-node__content {
  height: 30px;
}
.lookLeft .el-tree-node__content:hover,
.lookLeft .is-current .el-tree-node__content:active,
.lookLeft .el-tree-node__content:visited,
.lookLeft .el-tree-node:focus > .el-tree-node__content {
  background-color: #383c3f !important;
}
.lookThumb {
  border: 6px solid #8ab4f8;
  width: 140px;
  height: 86px;
  margin-left: 18px;
}
.lookLicon {
  width: 25px;
  line-height: 36px;
  height: 36px;
  margin-bottom: 12px;
  display: inline-block;
  border-radius: 100%;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
}
.lookLicon:hover {
  background-color: #424649;
}
.lookMain {
  /* margin: 4px 0px 0 284px; */
  margin: 0 100px;
  position: relative;
  z-index: 10;
  text-align: center;
  overflow: inherit;
  /*background-color: #fff;*/
  margin-top: 100px;
}
.el-tree-node:focus > .el-tree-node__content {
  background-color: red !important;
  color: #409eff;
}
.lookMain-hide {
  z-index: -1;
}
.lookMain-show {
  z-index: 0;
}
.showname {
  width: 215px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  font-size: 13px;
}
.el-icon-arrow-left:hover {
  background-color: #323639 !important;
  color: #0e9aef;
}
</style>
