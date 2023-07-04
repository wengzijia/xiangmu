<template>
  <div style="margin: 0 50px">
    <el-steps :active="actnum - 1" finish-status="success" simple style="margin-top: 20px;color: #C0C4CC;">
      <el-step title="上传文件"></el-step>
      <el-step title="一键预检"></el-step>
      <el-step title="查看结果"></el-step>
    </el-steps>

    <div v-if="actnum == 1" class="main-container upload-demo" style="    padding: 5px;">
      <div @click="isLogin">
        <el-upload drag multiple :action="uploadAction" :disabled="uploadDisabled" :on-success="uploadSuccess" :before-upload="beforeUpload" :on-error="onError" name="pdf-file" accept=".pdf">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text" v-if="uploadDisabled" style="font-size: 18px;">请点击<em style="color: red">登录</em>后，进行文件上传</div>
          <div class="el-upload__text" v-else style="font-size: 18px;">将文件拖到此处，或<em style="color: red">点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传PDF文件，且不超过100M</div>
        </el-upload>
      </div>
    </div>

    <!--    <div class="canvas-container" v-if="actnum > 1" :class="actnum == 3 ? 'pdfbox2' : 'pdfbox'" :style="'width: ' + canvasWidth + 'px;height: ' + canvasHeight + 'px;'">-->
    <div class="canvas-container " v-if="actnum > 1" :class="actnum == 3 ? 'pdfbox2' : canvasShow ? 'canvas-container-show pdfbox' : 'canvas-container-hide pdfbox'">
      <div :style="'width: ' + canvasWidth + 'px;height: ' + canvasHeight + 'px;transform:rotate(-' + rotate + 'deg);margin-top:-' + marginTop + 'px'">
        <!--        <pdf :src="domain + PNGurl" :page="pages" height="600px" />-->
        <!--        <img class="img" :src="domain + PNGurl" style="width: 100%;transform:rotate(-90deg)" />-->
        <img class="img" :src="domain + PNGurl" style="width: 100%;border: 1px dashed black;padding: 5px" />
      </div>
    </div>
    <div class="prebox" v-if="actnum == 2">
      <div slot="tip" class="el-upload__tip">预检比较耗时，预估1-3分钟左右 请在<a href="/preview/previewList" class="upbtn">预检列表</a>查看预检结果</div>
      <el-button class="upbtn" @click="prefn" style="margin-top: 10px;color: #fff;background-color: red"><i class="el-icon-success"></i> 开始预检</el-button>
    </div>
    <div class="pretxt" v-if="actnum == 3">
      <!--      <p>预检完成</p>-->
      <!--      <p class="upbtn">错误1:xxxx</p>-->
      <!--      <p>错误2:xxxx</p>-->
    </div>

    <login-form :dialogVisible.sync="showLoginDialog"></login-form>
    <el-dialog :visible.sync="dialogVisible" width="500px" top="300px" :append-to-body="true" :modal="true" :center="true" title="文件预检中" custom-class="dialog-activityimgs" :close-on-click-modal="false" :show-close="false">
      <div v-if="false" slot="title"></div>
      <div style="text-align: center;padding: 40px 30px 60px;">
        <div slot="tip" style="margin-bottom:30px;font-size: 14px;" class="el-upload__tip">预检比较耗时，预估1-3分钟左右 请在<a href="/preview/previewList" class="upbtn" style="font-size: 15px;">预检列表</a>查看预检结果</div>
        <!--        <el-progress :text-inside="true" :stroke-width="24" :percentage="progress" status="success"></el-progress>-->
        <el-progress :text-inside="true" color="#A81D453" :stroke-width="24" :percentage="progress" status="success"></el-progress>
      </div>
    </el-dialog>

    <el-dialog title="预检完成" :visible.sync="completeShow" top="300px" width="30%" :close-on-click-modal="false" :show-close="false">
      <span>{{ completeTitle }}</span>
      <span slot="footer" class="dialog-footer">
        <!--        <el-button @click="completeClick(0)">取 消</el-button>-->
        <el-button type="primary" @click="completeClick(1)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGenReport, getPollReport } from '@/api/preview/previewApi';
// import pdf from 'vue-pdf';
import { ACCESS_TOKEN } from '@/store/global-constant';
import store from '@/store';
import LoginForm from '@/components/common/LoginForm';
export default {
  components: {
    LoginForm
  },
  data() {
    return {
      uploadDisabled: false,
      canvasShow: false,
      marginTop: 0,
      rotate: 0,
      uploadAction: '/file/uploads',
      canvasWidth: 300,
      canvasHeight: 300,

      fileData: '',
      actnum: 1,
      pageNo: null,
      pdfPageNumber: null,
      pdfTotalPages: 1,
      renderingPage: false,
      showLoginDialog: false,
      dialogVisible: false,
      completeShow: false,
      pdfData: null, // PDF的base64
      scale: 1, // 缩放值
      pages: 1,
      isOK: 0,
      completeTitle: '预检结果为不通过，点击确定查看预检详情',
      reportId: 0,
      progress: 1,
      timer: '',
      userInfo: {},
      domain: '/',
      pdfurl: 'preflightcover/20210531/567e38f18358440784eeb21f279e3c74.png',
      PNGurl: 'preflightcover/20210531/567e38f18358440784eeb21f279e3c74.png',
      uploadLoading: '',
      canvasInterval: ''
    };
  },
  methods: {
    isLogin() {
      if (!this.userInfo.id) {
        this.showLoginDialog = true;
        return false;
      }
    },
    beforeUpload(file) {
      this.getUserInfo();
      // console.log(file);
      var maxSize = 1024 * 1024 * 100;
      if (file.size > maxSize) {
        this.$message({
          type: 'error',
          message: '预检文件不能大于100M'
        });
        return false;
      }
      if (!this.userInfo.id) {
        this.showLoginDialog = true;
        return false;
      }
      this.uploadLoading = this.$loading({
        lock: true,
        text: '文件上传中，请稍后～请勿刷新浏览器～',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    //图片上传失败
    onError(err, file, fileList) {
      console.log(err);
      console.log(file);
      console.log(fileList);
      this.$message({
        type: 'error',
        message: '功能维护中，请稍候再试'
      });
      this.uploadLoading.close();
    },
    //图片上传成功
    uploadSuccess(response, file, fileList) {
      // 用户行为埋点
      this.$report({
        channel: 151000,
        actionId: 2
      });
      if (response.code == '000000') {
        this.PNGurl = response.data.coverPath;
        this.pdfurl = response.data.pdfPath;

        this.actnum = 2;
        this.canvasInterval = setInterval(this.canvasCalculation, 500);
        //获取
      } else {
        this.$message({
          type: 'error',
          message: response.message
        });
        this.uploadLoading.close();
        return false;
      }
    },
    //开始预检
    prefn() {
      var data = {
        'pdf-path': this.pdfurl,
        'cover-path': this.PNGurl,
        uid: this.userInfo.id
      };

      // this.timer = setInterval(this.getPollReport(), 1000);
      const loading = this.$loading({
        lock: true,
        text: '文件预检中，请稍后～请勿刷新浏览器～',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      getGenReport(data)
        .then(res => {
          // console.log(res);
          if (res.code == '000000') {
            loading.close();
            this.reportId = res.data.reportId;
            if (this.reportId == 0) {
              this.$message({
                type: 'error',
                message: '预检失败请重试'
              });
              return false;
            }
            //轮询 结果
            this.dialogVisible = true;
            this.timer = setInterval(this.getPollReport, 800);
          }
        })
        .catch(err => {
          console.log('err', err);
          loading.close();
          this.$message({
            type: 'error',
            message: '功能维护中，请稍候再试'
          });
          clearInterval(this.timer);
          this.dialogVisible = false;
        });
      // this.actnum = 3;
      // 用户行为埋点
      this.$report({
        channel: 151000,
        actionId: 2
      });
    },
    //轮询是否完成
    getPollReport() {
      // console.log(555);
      var data = {
        progress: this.progress,
        reportId: this.reportId
      };
      getPollReport(data)
        .then(res => {
          // console.log(res);
          if (res.code == '000000') {
            this.progress = res.data.progress * 1;

            if (res.data.status == 1 || this.progress == 100) {
              //删除轮询
              clearInterval(this.timer);
              // this.completeShow = true;
              this.isOK = res.data.isOk;
              // if (res.data.isOk == 0) {
              //   this.completeTitle = '预检结果为通过，点击确定跳至预检列表页';
              // }
              if (this.isOK == 1) {
                //跳转到详情
                this.$router.push({ path: '/preview/previewDetails?reportId=' + this.reportId });
              } else {
                //跳转到列表
                this.$router.push({ path: '/preview/previewList' });
              }
            }
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '功能维护中，请稍候再试'
          });
          clearInterval(this.timer);
          this.dialogVisible = false;
        });
    },
    //预检完成
    completeClick(index) {
      if (index == 0) {
        this.completeShow = false;
        location.reload();
        return false;
      }

      if (this.isOK == 1) {
        //跳转到详情
        window.open('/preview/previewDetails?reportId=' + this.reportId, '_blank');
        location.reload();
      } else {
        //跳转到列表
        window.open('/preview/previewList', '_blank');
        location.reload();
      }
    },
    //获取用户信息
    getUserInfo() {
      if (localStorage.getItem(ACCESS_TOKEN) != null) {
        store.dispatch('GetUserInfo').then(() => {
          // console.log('store.getters.userInfo', store.getters.userInfo);

          if (store.getters.userInfo) {
            this.userInfo = store.getters.userInfo;
          } else {
            this.uploadDisabled = true;
          }
        });
      } else {
        this.uploadDisabled = true;
      }
    },
    canvasCalculation() {
      // console.log(6666);
      // 500
      // 600
      // var canvas = document.querySelector('canvas');
      // var w = canvas.width;
      // var h = canvas.height;

      var img = new Image();
      img.src = this.domain + this.PNGurl; //pdf地址
      var w = img.width;
      var h = img.height;
      // console.log(img);
      // console.log(img.width);
      // console.log(img.height);
      var scale = 0;
      if (w > h) {
        scale = 450 / w;
      } else {
        scale = 400 / h;
      }

      this.canvasWidth = w * scale;
      this.canvasHeight = h * scale;
      // marginTop
      // rotate
      // console.log(this.canvasHeight);
      // console.log(this.canvasWidth);
      if (this.canvasHeight > this.canvasWidth) {
        console.log(5555);
        this.rotate = 90;
        this.marginTop = (this.canvasHeight - this.canvasWidth) / 2;
      }
      this.canvasShow = true;
      clearInterval(this.canvasInterval);
      setInterval(this.uploadLoading.close(), 500);
      // console.log(w);
      // console.log(h);
      // console.log(scale);
      // if (w != 300 && h != 150) {

      // }
      // if (w != 300 && h != 150) {

      // }
      //   this.canvasCalculation();
      // } else {

      // }
    }
  },
  created() {
    this.getUserInfo();
    // console.log('444', this.userInfo);

    // var img = new Image();
    // img.src = 'http://pf.xiaocaiyin.com:10002/cover/20210529/7d798ed3c2b74f4a81d93e217b8ee5fd.png'; //pdf地址
    // console.log(img);
    // console.log(img.width);
    // console.log(img.height);
    // 用户行为埋点
    this.$report({
      channel: 151000,
      actionId: 1
    });
  },
  mounted() {
    // setTimeout(this.canvasCalculation, 1000);
  }
};
</script>
<style>
.el-dialog__header {
  padding: 10px 20px;
  background-color: #e8e8e8;
}
.el-progress-bar__outer {
  background-color: #aeb5bf;
}
.is-process > .is-text {
  background-color: black !important;
}
</style>
<style scoped>
.upbtn {
  color: red;
}
.upload-demo {
  text-align: center;
  margin-top: 150px;
}
.prebox {
  text-align: center;
  /*margin-top: 50px;*/
}
.pdfbox {
  margin: 40px auto;
}
.pdfbox2 {
  margin: 100px 0 0 200px;
}
.pretxt {
  float: right;
  margin: -300px 500px 0 0;
}

.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.canvas-container {
  max-width: 500px;
  max-height: 400px;
  /*border: 1px dashed black;*/
  position: relative;
  display: flex;
  justify-content: center;
  padding: 2px;
}
.canvas-container-hide {
  z-index: -1;
}
.canvas-container-show {
  z-index: 0;
}
.scroll-pdf-contanier {
  width: 600px;
  height: 500px;
  border: 1px dashed black;
  position: relative;
}
.pdf-container {
  width: 100%;
  height: 100%;
}
.scroll-pdf-container {
  width: 350px;
}
.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.a-upload {
  padding: 4px 10px;
  height: 20px;
  line-height: 20px;
  position: relative;
  cursor: pointer;
  color: #888;
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  display: inline-block;
  *display: inline;
  *zoom: 1;
}

.a-upload input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
  filter: alpha(opacity=0);
  cursor: pointer;
}

.a-upload:hover {
  color: #444;
  background: #eee;
  border-color: #ccc;
  text-decoration: none;
}

.file {
  position: relative;
  display: inline-block;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 9px 19px;
  overflow: hidden;
  color: red;
  text-decoration: none;
  text-indent: 0;
  line-height: 20px;
}
.file input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
}
.file:hover {
  background: #ecf5ff;
}
canvas {
  height: 500px !important;
}

.el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /*height:600px;*/
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
.el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}
</style>
