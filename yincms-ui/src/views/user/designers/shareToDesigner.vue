<!-- fengjianbo -->
<template>
  <el-container class="login" style="background-color: #eff2f9 ;position: relative;">
    <el-header class="header-nav" style="height: auto;">
      <header-user-nav-top></header-user-nav-top>
      <header-user-nav-bottom></header-user-nav-bottom>
    </el-header>
    <el-container class="allChange_key" style="margin-top:25px;">
      <el-aside width="210px" style="width: 214px;">
        <ul class="left_box">
          <li>
            <p>任务编号</p>
            <p>{{ taskdetailList.outNo }}</p>
          </li>
          <li>
            <p>模型类别</p>
            <p>
              <span v-for="(item, index) in taskdetailList.baseGoodsIdList" :key="item.baseGoodsId">{{ index > 0 ? ' | ' : '' }}{{ item.modelName }}</span>
            </p>
          </li>
          <li>
            <p>设计类型</p>
            <p>{{ taskdetailList.outType == 0 ? '包装平面设计' : taskdetailList.outType == 1 ? '平面设计' : '3D设计' }}</p>
          </li>

          <li>
            <p>开始时间</p>
            <p>{{ taskdetailList.startTime == null ? null : formatDateSecond(taskdetailList.startTime) }}</p>
          </li>
          <li>
            <p>
              金额<span v-if="taskdetailList.outType == 0">（V{{ taskdetailList.level == null ? 1 : taskdetailList.level }}设计师价格）</span>
            </p>
            <p>
              ￥{{ taskdetailList.price }} <span style="margin-left:10px" v-if="taskdetailList.grade && taskdetailList.outType == 1">({{ taskdetailList.grade }}档价格)</span>
            </p>
          </li>
          <li>
            <p>截止时间</p>
            <p>{{ taskdetailList.endTime == null ? null : formatDateSecond(taskdetailList.endTime) }}</p>
            <p>{{ theCountdown(formatDateSecond(taskdetailList.endTime).replace(/-/g, '/')) }}</p>
            <!-- <p>{{ theCountdown(formatDateSecond(taskdetailList.endTime)) }}</p> -->
          </li>
          <li class="getTask">
            <el-button :class="isGet ? '' : 'taskBtn'" :disabled="isGet" @click="getTask(taskStatus)">领取任务</el-button>
          </li>
        </ul>
        <div class="tipsMeagge" v-if="taskdetailList.outType != 2">
          <p>温馨提示：</p>
          <div v-if="taskdetailList.outType == 0">
            提交作品审核通过（评分60分以上）则可获得相应等级的报酬，未通过的作品（60分以下），未违背规范和版本要求前提下，平台可以按实际评分来给予折扣报酬
          </div>
          <div v-if="taskdetailList.outType == 1">平面设计作品，提交作品审核则会按ABC三档给予任务的报酬。</div>
        </div>
      </el-aside>
      <el-main class="login-main" style="padding-left: 10px; width:500px">
        <div class="cainterBox">
          <h3>{{ taskdetailList.outName }}</h3>
          <div class="shareTask">
            <a href="/user/myTask" target="_blank" style="font-size: 14px;margin-right: 20px;color: #333;">我的任务</a>
            <span class="goto" @click="copy">分享任务</span>
          </div>
          <div>
            <p class="process">傲彩接单流程</p>
            <div class="processList">
              <el-steps :space="230" :active="taskdetailList.flowStatus" align-center>
                <el-step title="任务大厅接单"></el-step>
                <el-step title="设计稿件"></el-step>
                <el-step title="上传稿件文件"></el-step>
                <el-step title="完成任务"></el-step>
              </el-steps>
            </div>
          </div>
          <div>
            <p class="details">任务详情</p>
            <div class="sourceFile">
              <span>设计源文件：</span>
              <div v-if="taskdetailList.status == 1">
                <span v-if="taskdetailList.outType != 0" style="margin-right:20px">适配图</span>
                <a v-if="taskdetailList.outType != 0" class="lookPdf" style="color:#409eff" :href="baseUrl + taskdetailList.fitImg" target="_blank">{{ fileName(taskdetailList.fitImg) }}</a>
                <a v-if="taskdetailList.outType == 0" class="lookPdf" :href="baseUrl + taskdetailList.faceImg" target="_blank">适配图（领取任务后可查阅）</a>
              </div>
              <el-tooltip v-else content="请先领取任务后查阅！" placement="bottom" effect="light">
                <span class="lookPdf">适配图（领取任务后可查阅）</span>
              </el-tooltip>
              <!-- <span v-else class="lookPdf">适配图（领取任务后可查阅）</span> -->
            </div>
            <p class="payFiles">交付稿件：</p>
            <ul class="listFiles">
              <li v-show="taskdetailList.outType == 1 || taskdetailList.outType == 2" class="boxs" v-for="(item, index) in taskdetailList.outTypeList" :key="index">{{ item }}</li>
              <li v-if="taskdetailList.outType == 0">
                <div class="boxs">
                  <p>{{ taskdetailList.outType == 0 ? '包装平面设计' : '其他设计' }}</p>
                </div>
                <a class="sample" :href="baseUrl + 'qcxyztTest/uploads/packout/stylistFile20220512/temp/30/天地盖天包地盒 - 123.pdf'" target="_blank">天地盖天包地盒</a>
              </li>
              <li v-if="taskdetailList.outType == 0">
                <div class="boxs">
                  <p>{{ taskdetailList.outType == 0 ? '包装平面设计' : '其他设计' }}</p>
                </div>
                <a class="sample" :href="baseUrl + 'qcxyztTest/uploads/packout/stylistFile20220512/temp/30/天包地.jpg'" target="_blank">天包地</a>
              </li>
            </ul>
            <div class="requirements">
              <p class="require">任务要求：</p>
              <p v-html="taskdetailList.requirement"></p>
            </div>
            <div class="requirements">
              <p class="require">规范要求:</p>
              <p v-html="taskdetailList.norm"></p>
            </div>
            <div class="requirements">
              <p class="require">版权要求：</p>
              <p v-html="taskdetailList.copyright"></p>
            </div>
          </div>
        </div>
        <login-form :dialogVisible.sync="showLoginDialog"></login-form>
      </el-main>
    </el-container>
    <el-footer class="footer">
      <foot-top></foot-top>
      <foot-bottom></foot-bottom>
    </el-footer>
  </el-container>
</template>
<script>
import LoginForm from '@/components/common/LoginForm';
import FootTop from '@/components/footer/FootTop';
import FootBottom from '@/components/footer/FootBottom';
import HeaderUserNavTop from '@/components/header/HeaderUserNavTop';
import HeaderUserNavBottom from '@/components/header/HeaderUserNavBottom';
import { getTaskdetail, getTheTask, upReviewOver } from '@/api/users/designer';
import { formatDateSecond, theCountdown } from '@/utils/timeUtil';
// import { getByUserId } from '@/api/users/designer';
// import { getCurrentUserInfo } from '@/api/users/userApi';
export default {
  components: {
    FootTop,
    FootBottom,
    HeaderUserNavTop,
    HeaderUserNavBottom,
    LoginForm
  },
  name: 'shareToDesigner',
  data() {
    return {
      baseUrl: 'http://alifile.xiaocaiyin.com/',
      viewUrl: '/api/consumer/certifyFree/alibaba/oss/viewFile?fileName=',

      showLoginDialog: false,
      taskdetailList: [],
      // isLogin: false,
      uid: '',
      isGet: false,
      getId: '',
      taskOutNo: '',
      currTime: '',
      isDisabled: false,
      //获取当前网站的网址
      windowUrl: window.location.href,
      taskStatus: null
    };
  },
  created() {
    // this.moveInto();
    this.getTaskdetailFn();
  },
  methods: {
    ...{ formatDateSecond, theCountdown },
    //点击复制的方法兼容ios系统
    copy() {
      var domUrl = document.createElement('input');
      domUrl.value = this.taskdetailList.outName + ':' + this.windowUrl;
      domUrl.id = 'creatDom';
      document.body.appendChild(domUrl);
      if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        window.getSelection().removeAllRanges(); //这段代码必须放在前面否则无效
        var range = document.createRange();
        // 选中需要复制的节点
        range.selectNode(domUrl);
        // 执行选中元素
        window.getSelection().addRange(range);
        // 执行 copy 操作
        document.execCommand('copy');
        // 移除选中的元素
        window.getSelection().removeAllRanges();
      } else {
        domUrl.select(); // 选择对象
        document.execCommand('Copy'); // 执行浏览器复制命令
      }
      let creatDom = document.getElementById('creatDom');
      creatDom.parentNode.removeChild(creatDom);
      this.$message({
        message: '已复制链接，可以粘贴分享到群邀请更多设计师入驻傲彩！',
        type: 'success'
      });
    },
    // 判断是否登录
    moveInto() {
      const token = localStorage.getItem('Access-Token');
      // console.log('token', token);
      if (!token) {
        // this.$router.push('/login');
        this.showLoginDialog = true;
      } else {
        this.getTheTaskFn();
      }
    },
    // 获取路径的名字
    fileName(url) {
      if (url) {
        let urlList = url.split('/');
        return urlList[urlList.length - 1];
      }
    },
    upReviewOverFn() {
      upReviewOver().then(res => {
        // console.log('upReviewOver', res);
        this.$message.success('设置默认设计师星级V1成功！领取任务成功');
        this.getTheTaskFn();
      });
    },
    // 领取任务
    getTask(status) {
      if (status == 7) {
        // console.log(33333);
        this.$confirm('您当前上传作品初始级别还没有评测完成，你确认要先默认为V1级别先领取任务吗，还是等待评测再领取任务?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
          // type: 'warning'
        })
          .then(() => {
            // console.log('v1v1');
            this.upReviewOverFn();
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
            // console.log(guanbi);
          });
      } else {
        this.moveInto();
      }
    },
    // 设计师领取任务
    getTheTaskFn() {
      const datas = {
        // id: 123,
        // outNo: 'Rqt123'
        id: this.getId,
        outNo: this.taskOutNo
      };
      getTheTask(datas)
        .then(res => {
          if (res.code == '000000') {
            this.isGet = true;
            this.getTaskdetailFn();
          }
        })
        .catch(err => {
          // console.log('err', err);
          // 未认证设计师
          if (err.code == '22002') {
            this.$router.push('/user/certifiedDesigner');
          }
        });
    },
    // 获取任务详情
    getTaskdetailFn() {
      const parms = {
        id: this.$route.query.id ? this.$route.query.id : null,
        outNo: this.$route.query.outNo
        // outNo: 'Rqt123'
      };
      getTaskdetail(parms)
        .then(res => {
          this.taskdetailList = res.data;
          if (this.taskdetailList.flowStatus > 3) {
            this.$set(this.taskdetailList, 'flowStatus', null);
          }
          // 判断是平面设计还是3d设计
          if (this.taskdetailList.outType == 2) {
            //3d设计
            const list = ['3D源文件素材包', '3D渲染组合主图', '3D皮肤文件', '3D素模文件', '3D渲染文件', '3D渲染主图'];
            this.$set(this.taskdetailList, 'outTypeList', list);
          } else if (this.taskdetailList.outType == 1) {
            const list1 = ['转曲源文件', '未转曲源文件', '缩略图文件', '刀模图文件'];
            this.$set(this.taskdetailList, 'outTypeList', list1);
          }
          this.getId = res.data.id;
          this.taskOutNo = res.data.outNo;
          if (res.data.status == 0) {
            this.isGet = false;
          } else if (res.data.status == 1) {
            if (this.taskStatus != 7) {
              if (this.isGet) {
                this.$message.success('领取成功');
              } else {
                this.$message.error('当前任务已领取!');
              }
            }
            this.isGet = true;
          } else if (res.data.status == 2) {
            this.$message.error('该任务已达最大任务量！');
            this.isGet = true;
          } else if (res.data.status == 3) {
            this.$message.error('任务结束');
            this.isGet = true;
          } else if (res.data.status == 4) {
            this.$message.error('设计师是禁用状态，请联系平台解除方可领任务。只有正常状态的设计师可领取');
            this.isGet = true;
          } else if (res.data.status == 6) {
            this.$message.error(this.taskdetailList.statusExplain);
            this.isGet = true;
          } else if (res.data.status == 7) {
            // this.$message.error('您当前提交的初始设计稿还未评审，请耐心等待平台评审后再领取该任务！');
            this.isGet = false;
            this.taskStatus = 7;
          } else if (res.data.status == 8) {
            this.$message.error('您当前只能领取一个任务，上传提交审核后才能再领取！');
            this.isGet = true;
          }

          // let times = Date.now().toString();
          // const tt = times.slice(0, times.length - 3);
          // if (tt > parseInt(res.data.endTime)) {
          //   // console.log('222', formatDateSecond(parseInt(res.data.endTime)));
          //   // console.log('222', formatDateSecond(tt));
          //   this.isDisabled = true;
          // }
          // console.log('getTaskdetail', this.taskdetailList);
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    }
  }
};
</script>
<style>
.processList .is-process {
  color: #ed111b;
}
/*等待状态——序号颜色、圆圈边框颜色*/
.processList .el-step__head.is-process {
  border-color: #ed111b;
}
</style>
<style scoped>
.tipsMeagge {
  margin-top: 20px;
  padding: 20px;
  background: #fff;
  font-size: 14px;
  color: #e60021;
  line-height: 22px;
}
.getTask .taskBtn:focus,
.getTask .taskBtn:active {
  color: #606266;
  border-color: #dcdfe6;
  background-color: #ffffff;
}
.getTask .taskBtn:hover {
  background: #d0111b;
  color: #fff;
  border: none;
}
.left_box {
  background: #fff;
  color: #333;
  font-size: 14px;
  padding: 40px 30px;
}
.left_box li {
  margin-bottom: 30px;
}
.cainterBox {
  background: #fff;
  padding: 80px 30px;
  color: #333;
  font-size: 14px;
}
.getTask {
  display: flex;
  justify-content: center;
  margin-top: 100px;
}
.shareTask .goto {
  cursor: pointer;
}
.shareTask .goto:hover {
  color: #d0111b;
}
.cainterBox h3 {
  font-size: 18px;
}
.cainterBox .shareTask {
  text-align: right;
  font-size: 14px;
  padding: 4px;
  border-bottom: 1px solid #ddd;
}
.cainterBox .process {
  margin-top: 30px;
  margin-bottom: 10px;
}
.cainterBox .processList {
  background: #f9f9f9;
  padding: 30px;
  margin-bottom: 60px;
}
.cainterBox .details {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 36px;
}
.cainterBox .sourceFile {
  margin-bottom: 50px;
  display: flex;
  align-items: center;
}
.cainterBox .sourceFile .lookPdf:hover {
  color: #d0111b;
  cursor: pointer;
}
.cainterBox .payFiles {
  margin-bottom: 20px;
}
.cainterBox .listFiles {
  display: flex;
}
.cainterBox .listFiles {
  display: flex;
}
.cainterBox .listFiles li {
  margin-left: 30px;
  text-align: center;
}
.cainterBox .boxs {
  width: 122px;
  height: 70px;
  border: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 10px;
  color: #c0c4cc;
}
.cainterBox .sample:hover {
  color: #e60021;
}
.cainterBox .requirements {
  margin-top: 60px;
}
.cainterBox .requirements .require {
  margin-bottom: 20px;
}
</style>
<style scoped src="@/static/mulindex/css/public.css"></style>
<style scoped src="@/static/mulindex/css/fonts.css"></style>
<style scoped src="@/static/index/user/css/all.css" />
<!--<style scoped src="../../static/index/css/main.css" />-->
<style scoped src="../../../static/login.css" />
<style src="../../../static/index/user/css/reset.css" />
