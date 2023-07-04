<template>
  <div class="wrap">
    <div class="pdf-container" ref="pdf-container">
      <canvas ref="myCanvas" @mousedown.prevent="mouseDown"></canvas>
    </div>
    <div class="pdf-control">
      <div class="pdf-control-page">
        <button @click="prev">上一页</button>
        <span class="page-number-container">
<!--                    <input-->
<!--                        type="number"-->
<!--                        v-model="pageNum"-->
<!--                        class="page-number-input"-->
<!--                        @blur="queueRenderPage(pageNum)"-->
<!--                    />-->
                    {{pageNum}}
                    / {{ pageCount }}页
                </span>
        <button @click="next">下一页</button>
      </div>
      <div class="pdf-control-zoom">
        <button @click="minus()">缩小</button>
        <button @click="addscale()">放大</button>
<!--        <button @click="rotate()">旋转</button>-->
<!--        <button @click="reset">还原</button>-->
<!--        <button @click="autoResize">全屏</button>-->
        <button @click="close">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as pdfJS from "pdfjs-dist";
import  pdfWorker from "pdfjs-dist/build/pdf.worker.entry"
import {getPdfFile} from "@/api/producemain";
pdfJS.GlobalWorkerOptions.workerSrc = pdfWorker 
// pdfJS.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.js"
export default {
  name: "pdf",
  props:{
    closepdf:Function
  },
  data() {
    return {
      isLoading: false,
      pdfUrl: '/api/consumer/file/downloadSOP', // PDF的base64
      pdfDoc: null, // pdfjs 生成的对象
      pageNum: 0, // 当前页数
      pageRendering: false,
      pageNumPending: null,
      scale: 1, // 放大倍数
      page_num: 0, // 当前页数
      pageCount: 0, // 总页数
      maxscale: 8, // 最大放大倍数
      minscale: 0.3, // 最小放大倍数
      rotateDeg:0,
      autoScale:0,
      waterInfo: {},
      count:0,
      timer:null
    };
  },
  computed: {
    docid() {
      // return this.$route.query.docid;
    }
  },
  mounted() {
  
  },
  methods: {
    close(){
      this.closepdf();
    },
    /**
     * 初始化pdf文件
     * @param {string} url pdf文件地址
     */
    init() {
      const params = {url:this.pdfUrl+'/'+this.$store.state.device.attributeId,cMapUrl:"https://cdn.jsdelivr.net/npm/pdfjs-dist@2.6.347/cmaps/",cMapPacked:true}
      // params.cMapUrl = window.location.origin + "/pdf/web/cmaps/"
      pdfJS.getDocument(params).promise.then((pdfDoc_) => {
        // this.isLoading = false;
        this.pdfDoc = pdfDoc_;
        console.log(this.pdfDoc);
        this.pageCount = this.pdfDoc.numPages;
        this.pageNum = 1;
        this.renderPage(this.pageNum);
      });
    },
    /**
     * 渲染pdf文件
     * @param {number} num 第几页
     */
    renderPage(num) {
      this.pageRendering = true;
      let canvas = this.$refs.myCanvas;
      let container = this.$refs["pdf-container"];
      let containerWidth = container.offsetWidth
      // Using promise to fetch the page
      this.pdfDoc.getPage(num).then((page) => {
        let viewport = page.getViewport({scale:this.scale,rotation:this.rotateDeg});
        let num = containerWidth/viewport.width
        this.autoScale = num.toFixed(2);
        console.log(this.autoScale);
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        let ctx = canvas.getContext("2d")
        var renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };
        var renderTask = page.render(renderContext);
        renderTask.promise.then(() => {
          this.pageRendering = false;
          if (this.pageNumPending !== null) {
            this.renderPage(this.pageNumPending);
            this.pageNumPending = null;
          }
        });
      });
    },
    /**
     * pdf放大功能
     * @param {number} step = 放大倍数，不传参数默认0.2
     */
    addscale(step = 0.2) {
      if (this.scale >= this.maxscale) {
        return;
      }
      this.scale = Math.round((this.scale + step)*10)/10;
      this.queueRenderPage(this.pageNum);
    },
    /**
     * pdf缩小功能
     * @param {number} step = 缩小倍数，不传参数默认0.1
     */
    minus(step=0.1) {
      if (this.scale <= this.minscale) {
        return;
      }
      this.scale -= step;
      this.queueRenderPage(this.pageNum);
    },
    /**
     * pdf旋转功能
     * @param {number} deg = 旋转度数，正数顺时针。负数逆时针，不传默认顺时针90度
     */
    rotate(deg=90) {
      this.rotateDeg += deg;
      if(this.rotateDeg >= 360){
        this.rotateDeg = 0
      }
      this.queueRenderPage(this.pageNum);
    },
    /**
     * pdf重置功能 一键恢复默认配置
     */
    reset() {
      this.rotateDeg = 0;
      this.scale = 1;
      this.queueRenderPage(this.pageNum);
    },
    /**
     * pdf全屏功能，适应屏幕宽度铺满
     */
    autoResize(){
      this.scale = this.autoScale * this.scale
      this.queueRenderPage(this.pageNum);
    },
    // 上一页
    prev() {
      if (this.pageNum <= 1) {
        return;
      }
      this.pageNum--;
      this.queueRenderPage(this.pageNum);
    },
    // 下一页
    next() {
      if (this.pageNum >= this.pageCount) {
        return;
      }
      this.pageNum++;
      this.queueRenderPage(this.pageNum);
    },
    /**
     * pdf拖拽功能，监听鼠标移动
     * @params {obj} e = 监听事件
     */
    mouseDown(e){
      let container = this.$refs["pdf-container"];
      let oCanvas = this.$refs["myCanvas"];
      oCanvas.style.cursor = 'grab'
      let beginX = container.scrollLeft
      let beginY = container.scrollTop
      let mouseX = e.pageX
      let mouseY = e.pageY
      window.onmousemove = (event) =>{
        event = event || window.event
        let moveMouseX = event.pageX
        let moveMouseY = event.pageY
        container.scrollLeft = beginX + (mouseX - moveMouseX)
        container.scrollTop = beginY + (mouseY - moveMouseY)
      }
      window.onmouseup = ()=> {
        oCanvas.style.cursor = 'auto'
        window.onmousemove = null
      }
    },
    /**
     * 滚轮放大缩小功能，鼠标位置为焦点
     * @params {obj} e = 监听事件
     */
    gunlun(e,step) {
      let direction = e.deltaY > 0 ? 'down' : 'up'
      let container = this.$refs["pdf-container"];
      let oCanvas = this.$refs["myCanvas"];
      let oldScale = this.scale
      if (direction === 'up') {
        // 滑轮向上滚动
        if (this.scale >= this.maxscale) {
          return;
        }
        this.addscale(step)
        if(oCanvas.offsetLeft <= 0) {
          // container.scrollTop = e.offsetY -container.offsetHeight/2
          container.scrollTop = e.offsetY / oldScale * this.scale - e.pageY
          // container.scrollLeft = e.offsetX-container.offsetWidth/2
          container.scrollLeft = e.offsetX / oldScale * this.scale - e.pageX
        }
      } else {
        // 滑轮向下滚动
        this.minus(step)
        if(oCanvas.offsetLeft <= 0) {
          // container.scrollTop = e.offsetY -container.offsetHeight/2
          container.scrollTop = e.offsetY / oldScale * this.scale - e.pageY
          // container.scrollLeft = e.offsetX-container.offsetWidth/2
          container.scrollLeft = e.offsetX / oldScale * this.scale - e.pageX
        }
      }
    },
    queueRenderPage(num) {
      var number = Number(num);
      if (this.pageRendering) {
        this.pageNumPending = number;
      } else {
        this.renderPage(number);
      }
    },
    debounce(fn,delay){
      let timer = null //借助闭包
      return function() {
        if(timer){
          clearTimeout(timer)
        }
        timer = setTimeout(fn, delay) // 简化写法
      }
    }
  },
};
</script>

<style scoped lang="scss">
.wrap {
  width: 70vw;
  height: 100vh;
  background-color: #fff !important;
  display: flex;
  flex-direction: column;
  position: relative;
  .pdf-container {
    flex: 1;
    overflow: auto;
    padding:20px 0 120px 0;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .pdf-control {
    width: 100%;
    padding: 0px 30px;
    box-sizing: border-box;
    height: 100px;
    line-height: 100px;
    // background: rgba(103, 103, 103, 1);
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #fff;
    position: absolute;
    bottom: 0;
    img {
      vertical-align: middle;
    }
    button{
      width: 150px;
      height: 80px;
      background: #FFFFFF;
      border-radius: 10px 10px 10px 10px;
      border: 2px solid #B3B3B3;
      font-size: 30px;
      font-family: Source Han Sans CN-Medium, Source Han Sans CN;
      font-weight: 500;
      color: #808080;
    }
    .pdf-control-page {
      .page-number-container {
        font-size: 30px;
        margin: 0px 20px;
        /* Chrome浏览器 */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
        /* Firefox浏览器 */
        input[type="number"]{
          -moz-appearance: textfield;
        }
        .page-number-input {
          width: 50px;
          background-color: #363636;
          border: none;
          border-radius: 2px;
          padding: 2px 4px;
          box-sizing: border-box;
          color: #fff;
        }
      }
    }
    .pdf-control-zoom {
      margin-top: 5px;
      button{
        margin-right: 20px;
      }
    }
  }
}
</style>
