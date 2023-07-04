<template>
  <div class="wrap" style="background-color: #525659" ref="wrap">
    <div style="margin: 0 auto; background-color: #fff" :style="{ width: canvasWidth + 'px' }" v-show="isShowHeader">
      <!-- 头部预检问题描述 -->
      <div class="pdf-container-header" :style="{ width: canvasWidth - 20 + 'px' }">
        <div class="p-c-h-left">
          <img src="./logo.png" width="180" alt="" style="" />
        </div>
        <div class="p-c-h-right" style="flex: 1">
          <div>
            <span class="p-c-h-tip" style="color: red;"> <span></span> 红线标识为预检区域</span>
          </div>
          <div class="p-c-h-text">
            {{ previewText }}
          </div>
        </div>
      </div>
      <!-- pdf文件渲染区域  padding: 10px 10px 10px;-->
      <div
        class="pdf-container"
        style="
          margin: 0px auto;
          background-color: #fff;
          min-width: 370px;
        "
        :style="{ height: canvasHeight + 'px', width: canvasWidth + 'px' }"
        @mousewheel.stop.prevent="delayResize"
      >
        <div style="margin: 0 auto; position: relative" :style="{ width: canvasWidth + 'px' }">
          <div id="zrender-box"></div>
          <canvas ref="watermark" id="watermark"></canvas>
        </div>
      </div>
    </div>
    <!-- <div class="inputTest">
      <div>优化调整</div>
      <div>滚轮缩放事件延迟  (单位ms)<input type="text" v-model="timeout" number></div>
      <div>滚轮缩放事件比例（默认滚动一下缩放10%）<input type="text" v-model="scrollRate" number></div>
    </div> -->
  </div>
</template>

<script>
import * as pdfJS from 'pdfjs-dist/es5/build/pdf';
import pdfjsWorker from 'pdfjs-dist/es5/build/pdf.worker.entry';
import * as ZRender from 'zrender';
import zrender from './pdfClass';
import { getPreviewPro } from '@/api/preview/previewFileApi';
export default {
  props: {
    proId: {
      type: Number,
      default: 0
    },
    scale: {
      type: Number,
      default: 1
    },
    previewText: {
      type: String,
      default: ''
    },
    pdfUrl: {
      type: String,
      default: ''
    },
    axis: {
      type: Array,
      default: () => {
        return [];
      }
    },
    maxscale: {
      type: Number,
      default: 0
    }, // 最大放大倍数
    minscale: {
      type: Number,
      default: 0
    } // 最小放大倍数
  },
  data() {
    return {
      isLoading: false,
      isShowHeader: false,
      // pdfUrl: "", // PDF的base64
      pdfDoc: null, // pdfjs 生成的对象
      pageNum: 0, // 当前页数
      pageRendering: false,
      pageNumPending: null,
      page_num: 0, // 当前页数
      pageCount: 0, // 总页数

      waterInfo: {},
      // scale:1,
      canvasWidth: 500,
      canvasHeight: 500,
      defect: [],
      updataType: '',
      suitableWidth: 0, //渲染时画布的可用宽度
      suitableHeight: 0, //渲染时画布的可用高度
      maxLength: 4000,
      minLength: 400,
      testWidth: 0,
      arr: [],
      pdfData: null,
      ZR: null,
      renderTask: null,
      count: 0,
      timer: null,
      timeout: 500,
      scrollRate: 10
    };
  },
  watch: {
    // scale: function(newVal, oldVal) {
    //   let _this = this;
    //   newVal > oldVal ? _this.addscale() : _this.minus();
    // },
    // previewText: function(newVal, oldVal) {
    //   this.queueRenderPage(this.pageNum);
    // }
  },
  async mounted() {
    let _this = this;
    _this.fileLoading();
    _this.suitableWidth = document.querySelector('.preview-details').clientWidth - 282 - 40;
    _this.suitableHeight = document.querySelector('.preview-details').clientHeight - 60 - 20;
    console.log(_this.suitableHeight);
    let newUrl = encodeURI(_this.pdfUrl);
    getPreviewPro(newUrl)
      .then(res => {
        _this.pdfData = res;
        _this.init();
      })
      .catch(err => {
        _this.isLoading.close();
        _this.$message.error('获取PDF文件失败，请刷新重试！');
      });
  },
  methods: {
    //延迟缩放 防抖原理
    delayResize(e) {
      this.count++;
      let event = e;
      let step = (this.count * this.scrollRate) / 100;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(
        () => {
          this.move(event, step);
          this.count = 0;
        },
        this.timeout,
        event,
        step
      );
    },
    move(e, step) {
      this.$emit('wheelResize', { e, step });
    },
    // 初始化pdf
    init() {
      let _this = this;
      console.log(_this.pdfData.data);
      pdfJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      let loadingTask = pdfJS.getDocument({
        data: _this.pdfData.data,
        rangeChunkSize: 65536 * 16
      });
      loadingTask.promise
        .then(function(pdfDoc_) {
          _this.pdfDoc = pdfDoc_;
          _this.pageCount = _this.pdfDoc.numPages;
          _this.pageNum = 1;
          _this.ZR = new zrender(document.querySelector('#zrender-box'), ZRender);
          _this.renderPage(_this.pageNum);
        })
        .catch(() => {
          _this.isLoading.close();
        });
    },
    /**
     * 文件渲染loading
     */
    fileLoading() {
      let _this = this;
      if (_this.isLoading) {
        _this.isLoading.close();
      }
      return new Promise((resolve, reject) => {
        const loading = _this.$loading({
          // target: document.querySelector('.wrap>div'),
          lock: true,
          text: '文件渲染中，请稍后～请勿刷新浏览器～',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
        _this.isLoading = loading;
        let time = setInterval(() => {
          if (loading.visible) {
            clearInterval(time);
            resolve(loading);
          }
        }, 50);
      });
    },
    // 渲染pdf
    async renderPage(num) {
      const _this = this;
      try {
        await _this.fileLoading();
        _this.pdfDoc.getPage(num).then(page => {
          let viewport = page.getViewport({ scale: 1 });
          let pdfVW = viewport.width; //pdf原本的宽度
          let pdfVH = viewport.height; //pdf原本的高度
          var scale = _this.scale; //要渲染的比例
          var Width = _this.suitableWidth > 400 ? _this.suitableWidth : 400;
          var Height = _this.suitableHeight - 150 - 20;
          if (Height / viewport.height < Width / viewport.width) {
            //计算出最终实际上要放大的比例
            scale = Height / (viewport.height / scale);
            if (_this.maxscale == 0) {
              let maxscale = 4000 / viewport.height / (Height / viewport.height);
              let minscale = 400 / viewport.height / (Height / viewport.height);
              _this.$emit('getScaleRestrict', { minscale, maxscale });
            }
          } else {
            scale = Width / (viewport.width / scale);
            if (_this.maxscale == 0) {
              let maxscale = 4000 / viewport.width / (Width / viewport.width);
              let minscale = 400 / viewport.width / (Width / viewport.width);
              _this.$emit('getScaleRestrict', { minscale, maxscale });
            }
          }
          let zcp = zrender.canvasPadding;
          viewport = page.getViewport({ scale: scale, offsetX: zcp, offsetY: zcp });
          console.log('viewport', viewport);
          var canvas = document.getElementById('watermark');
          var context = canvas.getContext('2d');
          _this.canvasHeight = canvas.height = viewport.height + zcp * 2;
          _this.canvasWidth = canvas.width = viewport.width + zcp * 2;
          _this.ZR.resize({ width: canvas.width, height: canvas.height });
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          if (_this.renderTask) {
            _this.isLoading.close();
            _this.renderTask.cancel();
          }
          _this.renderTask = page.render(renderContext);
          _this.renderTask.promise
            .then(function() {
              _this.isShowHeader = true;
              _this.isLoading.close();
              _this.renderTask = null;

              if (_this.axis.length > 0) {
                if (_this.updataType === 'size') {
                  console.log('_this.updataType', _this.updataType);
                  _this.updataType = '';

                  console.log('5265566465.axis', _this.axis.length, zrender.modifyArrData({ arr: _this.axis, pdfVW, pdfVH, canvasWidth: canvas.width, canvasHeight: canvas.height, isRestrict: true }));
                  _this.ZR.updataRects(zrender.modifyArrData({ arr: _this.axis, pdfVW, pdfVH, canvasWidth: canvas.width, canvasHeight: canvas.height, isRestrict: true }), 1);
                } else {
                  _this.ZR.removesAll();
                  console.log('_this.axis', _this.axis);
                  _this.ZR.renderRects(zrender.modifyArrData({ arr: _this.axis, pdfVW, pdfVH, canvasWidth: canvas.width, canvasHeight: canvas.height, isRestrict: true }), 1);
                }
                document.querySelector('.pdf-container').addEventListener('mousemove', function(e) {
                  _this.ZR.activeRect(e);
                });
                document.querySelector('#zrender-box').addEventListener('mouseout', function(e) {
                  _this.ZR.activeRect(e);
                });
              } else {
                console.log('6666');
                _this.ZR.removesAll();
                _this.ZR.Rect({}); //清空之后调用绘制，才能重绘canvas
              }
            })
            .catch(err => {
              _this.isLoading.close();
              console.log('err', err);
            });
        });
      } catch (error) {
        _this.isLoading.close();
        _this.$message.error('渲染文件出错，请刷新浏览器重试！');
      }
    },

    // 放大
    addscale() {
      const _this = this;
      _this.updataType = 'size';
      _this.queueRenderPage(_this.pageNum);
    },
    // 缩小
    minus() {
      const _this = this;
      _this.updataType = 'size';
      _this.queueRenderPage(_this.pageNum);
    },
    // 上一页
    prev() {
      const _this = this;
      if (_this.pageNum <= 1) {
        return;
      }
      _this.pageNum--;
      _this.queueRenderPage(_this.pageNum);
    },
    // 下一页
    next() {
      const _this = this;
      if (_this.pageNum >= _this.pageCount) {
        return;
      }
      _this.pageNum++;
      _this.queueRenderPage(_this.pageNum);
    },
    queueRenderPage(num) {
      var number = Number(num);
      if (this.pageRendering) {
        this.pageNumPending = number;
      } else {
        this.renderPage(number);
      }
    }
  }
};
</script>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0);
}

.wrap .pdf-container {
  flex: 1;
  overflow: auto;
  text-align: center;
  background-color: rgba(0, 0, 0, 0);
}

.wrap .pdf-container .watermark {
  display: none;
}
#watermark {
  display: block;
  margin: 0 auto;
}
.wrap .pdf-control {
  padding: 0px 16px;
  height: 50px;
  line-height: 50px;
  /* background: rgba(103, 103, 103, 1); */
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #fff;
}
.wrap img {
  vertical-align: middle;
}
.wrap .pdf-control-page img {
  width: 14px;
}
.wrap .page-number-container {
  margin: 0px 7px;
}
.wrap .page-number-input {
  width: 50px;
  /* background-color: #363636; */
  border: none;
  border-radius: 2px;
  padding: 2px 4px;
  box-sizing: border-box;
  color: #fff;
}

.wrap .pdf-control-zoom img {
  width: 24px;
}
.wrap .zoom-out {
  margin-right: 20px;
}
.pdf-container2 {
  position: relative;
  padding-bottom: 20px;
}
#zrender-box {
  /* height: 900px; */
  /* width: 900px; */
  /* border:1px solid red; */
  position: absolute;
  top: 0;
  margin: 0px auto;
}
.wrap >>> #zrender-box > div {
  margin: 0 auto !important;
}

.pdf-container-header {
  margin: 0px auto;
  background-color: #fff;
  padding: 20px 10px 0;
  display: flex;
  height: 100px;

  min-width: 350px;
  border-bottom: 2px dashed #333;
}

.pdf-container-header .p-c-h-left {
  margin-right: 10px;
}
.pdf-container-header .p-c-h-tip span {
  display: inline-block;
  width: 50px;
  height: 2px;

  border-bottom: 1px solid red;
  position: relative;
  top: -5px;
}
.p-c-h-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
<style>
.inputTest {
  position: fixed;
  top: 100px;
  right: 20px;
  background: wheat;
  font-size: 15px;
  border: 2px solid red;
}
.inputTest input {
  width: 50px;
}
</style>
