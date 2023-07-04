<template>
  <div style="background:#525659;min-width:100%;" class="preview-details">
    <!--top-->
    <el-container>
      <el-header>
        <el-row class="lookTop">
          <el-col :span="8" class="lookTopLt">
            <div class="lookTopLt-one" @click="$router.push('/preview/previewList')"><span class="el-icon-arrow-left"></span>返回列表</div>
            <i class="el-icon-s-fold" style="maring:0 !important;" title="菜单" @click="showCont"></i>
            <!-- <img src="@/static/images/aocai.png" style="width: 22px;height: 24px;margin-top: 5px;" /> -->
            <span :title="pdfName">{{ pdfName }}</span>
          </el-col>
          <el-col :span="12" class="lookTopCot">
            <!-- <div class="lookTopCotL"><input type="text" placeholder="1" />/ 1</div> -->
            <div class="lookTopCotM">
              <i class="el-icon-minus" title="缩小" @click="narrow()"></i>
              <el-input type="text" v-model.number="inpval" @blur="inpblur" size="mini">
                <template slot="suffix">%</template>
              </el-input>
              <span style="background:#191b1c;margin-left:-20px;margin-right:10px;">%</span>
              <i class="el-icon-plus" title="放大" @click="enlarge()"></i>
            </div>
            <div class="lookTopCotR">
              <i class="el-icon-c-scale-to-original" @click="original" title="适合页面大小"></i>
              <!-- <i class="el-icon-refresh" title="逆时针旋转"></i> -->
            </div>
          </el-col>
          <el-col :span="4" class="lookTopRt">
            <!-- <i class="el-icon-download" title="下载"></i>
        <i class="el-icon-printer" title="打印"></i> -->
            <i class="el-icon-magic-stick" @click="$refs.pdfView.ZR.activeRectAll()" title="查看预检区域"></i>
          </el-col> </el-row
        ><!--top end-->
      </el-header>
      <el-container class="lookcont">
        <el-aside class="lookLeft" width="282" style="position: fixed" v-if="show">
          <template>
            <el-tabs tab-position="left" style="">
              <el-tab-pane>
                <span slot="label" class="lookLicon" title="文档大纲">
                  <!--              <i class="el-icon-s-order"></i>-->
                </span>
                <div class="flex" style="align-items: center; padding-bottom: 10px; display: flex">
                  <span style="padding-left: 18px; margin-right: 6px;color: #fff;font-size: 16px;width: 90%; display: inline-block;">印前检查：傲彩文件预检系统</span>
                </div>
                <el-tree :default-expand-all="true" :data="data" :props="defaultProps" @node-click="handleNodeClick">
                  <div class="showname" slot-scope="{ node, data }">
                    <el-tooltip class="item" :class="node.label == 'previewText' ? 'is-active' : ''" effect="light" :content="node.label" placement="top" v-if="node.label.length > 16">
                      <span> <svg-icon style="margin-right:0px;" v-if="data.type === 'group'" icon-class="cabinet-16px" />{{ node.label }}</span>
                    </el-tooltip>
                    <span v-else> <svg-icon style="margin-right:0px;" v-if="data.type === 'group'" icon-class="cabinet-16px" />{{ node.label }}</span>
                  </div>
                </el-tree>
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-aside>
        <el-aside class="block" v-show="show"></el-aside>
        <el-main style="padding-top:20px">
          <!--  :class="lookMainShow ? 'lookMain-show' : 'lookMain-hide'" -->
          <!-- <img class="perImgs" :width="width + '%'" :src="domain + currentReport" style="background-color: #fff;margin-left: 282px;" /> -->
          <pdf ref="pdfView" @wheelResize="wheelResize" @getScaleRestrict="setScaleRestrict" v-if="currentReport != ''" :scale="scale" :previewText="previewText" :pdfUrl="pdfUrl" :axis="axis" :minscale="minscale" :maxscale="maxscale"></pdf>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// import { getReportDetail, getReportList } from '@/api/preview/previewApi';
// import ax from '@/api';
import { getReportDetail, getReportList } from '@/api/preview/previewApi';

import pdf from '@/components/zrenderPdf/index';
import { debounce } from '@/components/zrenderPdf/pdfClass';
export default {
  components: { pdf },
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
      suitable: 100,
      scale: 1,
      maxscale: 0, // 最大放大倍数
      minscale: 0, // 最小放大倍数
      previewText: '', //遇见点击选择的内容
      pdfUrl: '',
      axis: []
    };
  },

  methods: {
    debounce,
    showCont: function() {
      this.show = !this.show;
    },
    setScaleRestrict({ maxscale, minscale }) {
      this.minscale = minscale;
      this.maxscale = maxscale;
    },
    handleNodeClick(data) {
      // console.log(data);
      // console.log(data.imgPath);
      if (data.label) {
        this.currentReport = data;
        this.previewText = this.currentReport.value;
        // this.scale = 1
        // this.inpval = 100
        // console.log(' data.axis', data.axis);
        this.axis = data.axis;

        const loading = this.$loading({
          lock: true,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        setInterval(loading.close(), 500);
        this.scale = 1;
        this.inpval = 100;
        this.$refs.pdfView.renderPage(1);
      }
    },
    original() {
      let _this = this;
      let oldScale = _this.scale;
      _this.scale = 1;
      _this.inpval = 100;
      _this.scale > oldScale ? _this.$refs.pdfView.addscale() : _this.$refs.pdfView.minus();
    },
    /**
     * 输入框失焦
     */
    inpblur(e) {
      let _this = this;
      let newVal = this.inpval;
      if (newVal / 100 > _this.maxscale) {
        _this.$message.error('超过文件最大放大比例，无法放大，请重新输入！');
      } else if (newVal / 100 < _this.minscale) {
        _this.$message.error('低于文件最小缩小比例，无法缩小，请重新输入！');
      } else {
        let oldScale = _this.scale;
        _this.scale = Number((_this.inpval / 100).toFixed(2));
        _this.scale > oldScale ? _this.$refs.pdfView.addscale() : _this.$refs.pdfView.minus();
      }
    },
    /**
     * 放大
     */
    enlarge(step = 0.1) {
      let _this = this;
      let newVal = this.scale + step;
      let maxScale = Math.round(_this.maxscale * 100) / 100;
      let minScale = Math.round(_this.minscale * 100) / 100;

      if (_this.scale == maxScale) {
        _this.$message.error('超过文件最大放大比例，无法放大，请重新输入！');
        return;
      }
      if (newVal > _this.maxscale) {
        _this.scale = maxScale;
        _this.inpval = parseInt(maxScale * 100);
        _this.$refs.pdfView.addscale();
        // _this.$message.error('超过文件最大放大比例，无法放大，请重新输入！');
      } else if (newVal < _this.minscale) {
        _this.scale = minScale;
        _this.inpval = parseInt(minScale * 100);
        _this.$refs.pdfView.minus();
        // _this.$message.error('低于文件最小缩小比例，无法缩小，请重新输入！');
      } else {
        // this.scale = Number((this.inpval / 100).toFixed(2));
        _this.scale = newVal;
        _this.inpval = parseInt(newVal * 100);
        _this.$refs.pdfView.addscale();
      }
    },
    /**
     * 缩小
     */
    narrow(step = 0.1) {
      let _this = this;
      let maxscale = Math.floor(_this.maxscale * 100) / 100;
      let minscale = Math.floor(_this.minscale * 100) / 100;
      if (_this.scale === minscale) {
        _this.$message.error('低于文件最小缩小比例，无法缩小，请重新输入！');
        console.log('_this.$message', _this.$message);
        return;
      }
      let newVal = _this.scale - step;
      if (newVal > _this.maxscale) {
        _this.scale = maxscale;
        _this.inpval = parseInt(maxscale * 100);
        _this.$refs.pdfView.addscale();
        // _this.$message.error('超过文件最大放大比例，无法放大，请重新输入！');
      } else if (newVal < _this.minscale) {
        _this.scale = minscale;
        _this.inpval = parseInt(minscale * 100);
        _this.$refs.pdfView.minus();
        // _this.$message.error('低于文件最小缩小比例，无法缩小，请重新输入！');
      } else {
        _this.scale = newVal;
        _this.inpval = parseInt(newVal * 100);
        _this.$refs.pdfView.minus();
      }
    },
    /**
     * 滚轮缩放
     */
    wheelResize(params) {
      let e = params.e;
      let step = params.step;
      let _this = this;
      let oHtml = document.querySelector('html');
      let direction = e.deltaY > 0 ? 'down' : 'up';
      let oldScale = _this.scale;
      if (direction === 'up') {
        _this.enlarge(step);
        let rate = _this.scale / oldScale;
        oHtml.scrollLeft = e.pageX - e.offsetX + e.offsetX * rate - e.clientX;
        oHtml.scrollTop = e.pageY - e.offsetY + e.offsetY * rate - e.clientY;
      } else if (direction === 'down') {
        _this.narrow(step);
        let rate = _this.scale / oldScale;
        oHtml.scrollLeft = e.pageX - e.offsetX + e.offsetX * rate - e.clientX;
        oHtml.scrollTop = e.pageY - e.offsetY + e.offsetY * rate - e.clientY;
      }
    },
    /**
     * 获取数据
     */
    getReportDetail() {
      console.log('this.$route.query.reportId', this.$route.query.reportId);
      let _this = this;
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
            this.pdfUrl = res.data.pdfPath;
            this.data = [];
            this.pdfName = res.data.pdfName + '-预检报告';
            var warnReport = res.data.warnReport['警告'];
            if (warnReport) {
              var warnReports = [];
              for (var i = 0; i < warnReport.length; i++) {
                warnReports[i] = {
                  label: warnReport[i].label,
                  value: warnReport[i].label,
                  axis: warnReport[i].axis,
                  imgPath: warnReport[i].imgPath,
                  children: [
                    {
                      value: warnReport[i].label,
                      label: '第' + warnReport[i].page + '页',
                      axis: warnReport[i].axis,
                      imgPath: warnReport[i].imgPath
                    }
                  ]
                };
                if (i == 0) {
                  _this.currentReport = warnReports[i];
                  // console.log('warnReport[i].value',warnReport[i].value);
                  _this.axis = warnReports[i].axis;
                  _this.previewText = warnReports[i].value;
                }
              }
              var warn = {
                label: '警告',
                children: warnReports
              };
              _this.data.push(warn);
            }
            var errorReport = res.data.errorReport['错误'];
            if (errorReport) {
              var errorReports = [];
              for (var n = 0; n < errorReport.length; n++) {
                errorReports[n] = {
                  label: errorReport[n].label,
                  value: errorReport[n].label,
                  imgPath: errorReport[n].imgPath,
                  axis: errorReport[n].axis,
                  children: [
                    {
                      label: '第' + errorReport[n].page + '页',
                      value: errorReport[n].label,
                      axis: errorReport[n].axis,
                      imgPath: errorReport[n].imgPath
                    }
                  ]
                };
                if (n == 0 && _this.previewText == '') {
                  _this.currentReport = errorReports[n];
                  // console.log('errorReport[n]',errorReport[n]);

                  _this.axis = errorReports[n].axis;
                  _this.previewText = errorReports[n].value;
                }
              }
              var errs = {
                label: '错误',
                children: errorReports
              };
              _this.data.push(errs);
            }
            console.log('this.previewText', _this.previewText);
            // setTimeout(this.isw, 600);
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '功能维护中，请稍候再试'
          });
        });
    }
  },
  created() {
    this.getReportDetail();
  },
  mounted() {
    document.getElementsByTagName('html')[0].className = 'test';
    document.body.className = 'test';
    //禁用默认事件
    document.body.addEventListener(
      'wheel',
      function(e) {
        e.preventDefault();
      },
      { passive: false, capture: true }
    );
  },
  beforeDestroy() {
    document.getElementsByTagName('html')[0].className = '';
    document.body.className = '';
  }
};
</script>
<style>
html.test {
  background-color: #525659;
}
body.test {
  background-color: rgb(82, 86, 89);
}
</style>
<style scoped>
.preview-details >>> .el-header {
  padding: 0;
  height: 55px !important;
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
.preview-details,
.preview-details .el-container {
  background-color: #525659;
}

.preview-details >>> .el-aside {
  height: auto;
}
.lookTop i {
  cursor: pointer;
  max-width: 36px;
  min-width: 36px;

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
  /* padding: 0 8px; */
}
.lookTopLt .lookTopLt-one {
  padding: 0 5px;
  margin-left: 5px;
  border-radius: 5px;
}
.lookTopLt .lookTopLt-one:hover {
  background-color: #424649;
  cursor: pointer;
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
.lookTopCotM {
  width: 120px;
  /* border: 1px solid red; */
}
/* ,
 */
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
/* .lookTopCotM input */
.lookTopCotL input {
  /* height: 20px; */
  /* line-height: 40px; */
  background-color: #191b1c;
  border: 0;
  font-weight: bold;
  text-align: center;
  display: inline-block;
  color: #fff;

  margin-right: 10px;
  margin-left: 10px;
}
.lookTopCotL input {
  width: 24px;
}
.lookTopCotM {
  /* padding: 0 10px; */
  position: relative;
  min-width: 140px;
}
.lookTopCotM >>> .el-input {
  width: 46px;
}
.lookTopCotM >>> input {
  /* width: 46px; */
  background-color: #000 !important;
  border-color: #000;
  color: #fff;
  padding: 0;
  padding-left: 2px;
  /* margin-right: 0px; */
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

/* .lookcont {
  position: relative;
} */
.lookLeft {
  z-index: 2;
  width: 282px;
  background-color: #323639;
  /* position: absolute;
  float: left;
  height: 100%;*/
  /* position: fixed; */
  /* padding-top: 60px; */
}
.lookLeft >>> .el-tabs--left {
  padding-top: 16px;
  /* padding-bottom: 600px; */

  min-height: calc(100vh - 71px);
}
.block {
  width: 282px;
  min-height: calc(100vh - 71px);
  z-index: -99;
}
.lookLeft >>> .el-tabs__item {
  /* color: #fff; */
  padding: 0 0px 0 12px;
  margin-bottom: 18px;
  border-left: 4px solid #323639;
}
.lookLeft >>> .el-tabs__item.is-active {
  border-color: #8ab4f8;
  color: #8ab4f8;
}
.lookLeft >>> .el-tabs__nav-wrap::after {
  background-color: inherit;
}
.lookLeft >>> .el-tree-node__label {
  font-size: 13px;
}
.lookLeft >>> .el-tabs__header {
  width: 14px;
}
.lookLeft >>> .el-tabs--left .el-tabs__header.is-left {
  margin-right: 0;
}
.lookLeft >>> .el-tabs--left .el-tabs__item.is-left {
  text-align: left;
}
.lookLeft >>> .el-tabs--left .el-tabs__active-bar.is-left,
.lookLeft >>> .el-tabs--left .el-tabs__nav-wrap.is-left::after {
  display: none;
}
.lookLeft >>> .el-tabs__content {
  padding-top: 8px;
}
.lookLeft >>> .el-tree {
  background-color: inherit;
  color: #fff;
}
.lookLeft >>> .el-tree-node__content {
  height: 30px;
}
.lookLeft >>> .el-tree-node__content:hover,
.lookLeft .is-current >>> .el-tree-node__content:active,
.lookLeft >>> .el-tree-node__content:visited,
.lookLeft >>> .el-tree-node:focus > .el-tree-node__content {
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
  background-color: #525659;
  margin-top: 50px;
}
.lookLeft >>> .el-tree .el-tree-node:focus > .el-tree-node__content {
  /* background-color: red !important; */
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
</style>
