<!-- fengjianbo -->
<template>
  <el-container class="login" style="background-color: #eff2f9 ;position: relative;">
    <el-header class="header-nav" style="height: auto;">
      <header-user-nav-top></header-user-nav-top>
      <header-user-nav-bottom></header-user-nav-bottom>
    </el-header>
    <el-container class="allChange_key" style="margin-top:25px;">
      <el-main class="login-main" style="padding-left: 10px; width:500px">
        <div class="signing">
          <h2>加入傲彩，认证设计师兼职做设计任务</h2>
          <div v-show="isAactiveShow" v-for="todo in activityList" :key="todo.id" class="activity">
            <p v-html="todo.brief"></p>
            <!-- <el-button v-if="isActivity == 0" style="margin-left: 20px;" @click="toReceive(todo.id, todo.price, 1)">领取</el-button> -->
            <!-- <el-button v-else style="margin-left: 20px;" @click="toReceive(todo.id, todo.price, 0)">取消</el-button> -->
          </div>
          <div class="centerBox">
            <div>
              <h3>个人信息</h3>
              <!-- <div class="upFiles"> -->
              <el-form ref="form" :model="form" label-width="90px">
                <el-form-item label="手机号码：">
                  <el-input placeholder="请输入手机号" v-model="form.tel" @input="toEmpty(0)"></el-input>
                </el-form-item>
                <el-form-item label="姓名/昵称：">
                  <el-input placeholder="请输入姓名/昵称" maxlength="12" v-model="form.name" @input="toEmpty(1)"></el-input>
                </el-form-item>
                <el-form-item label="擅长标签：">
                  <el-checkbox-group v-model="form.type1">
                    <el-checkbox v-for="item in labelList.merit" :key="item.id" :label="item.id" name="type1">{{ item.meritName }}</el-checkbox>
                    <el-checkbox label="oth1" name="type1"> 其它 <el-input v-model="form.desc1"></el-input> </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="熟练软件：">
                  <el-checkbox-group v-model="form.type2">
                    <el-checkbox v-for="emo in labelList.software" :key="emo.id" :label="emo.id" name="type2">{{ emo.meritName }}</el-checkbox>
                    <el-checkbox label="oth2" name="type2"> 其它 <el-input v-model="form.desc2"></el-input> </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-form>
              <!-- </div> -->
            </div>
            <div>
              <h3>认证级别</h3>
              <p>系统默认设计师初始级别为V1</p>
              <div style="color:#d0111b;margin-bottom: 10px;margin-top: 10px;">
                温馨提示：上传5个印刷包装相关的平面设计作品，就可以依据上传作品评定初始级别，评级高报酬高
                <span style="color:#409eff; cursor: pointer;margin-left:10px">《设计师等级规则》</span>
                <!-- <a href="/user/lookDetail" style="color:#409eff; cursor: pointer;margin-left:10px" target="_blank">查看详情</a> -->
              </div>
              <div class="upFiles">
                <el-upload
                  class="upload-demo"
                  :headers="headers"
                  action="/api/consumer/designer/miniPackUsersApply/uploadFile?file=designer"
                  :before-upload="beforeUploadFile"
                  :on-success="(response, file, fileList) => uploadSuccess(response, file, fileList)"
                  :on-remove="handleRemove"
                  :limit="5"
                  :file-list="fileListes"
                >
                  <!-- accept=".ai,.psd,.pdf,.cdr" -->
                  <span style="margin-right:30px"> 我要上传作品，提升初始级别</span>
                  <el-button size="small" class="upBtn">上传</el-button>
                </el-upload>
              </div>
              <div class="limits">请上传AI\PSD\PDF\CDR等分层源文件（限50M内），依据作品评定初始设计师级别，便于优先分配任务订单给您，系统会在接单完成后自动升级</div>
            </div>
            <div>
              <h3>签约合同</h3>
              <p class="readContract">
                <el-checkbox v-model="checked"></el-checkbox>
                请先阅读完全
                <!-- <span style="color:#409eff; cursor: pointer;">《委托设计协议》</span> -->
                <a style="color:#409eff; cursor: pointer;" href="/user/designContract" target="_blank">《委托设计协议》</a>

                再同意，即表示同意加入傲彩认证成为设计师，点击"同意"按钮即表示您完全接受本协议项下的全部条款
              </p>
            </div>
            <showCode ref="showCodeRef" :url="url" @gainRealSignMessageFn="gainRealSignMessageFn"></showCode>
          </div>
          <el-button class="agree" @click="agreeDesiger">同意</el-button>
        </div>
      </el-main>
    </el-container>
    <el-footer class="footer">
      <foot-top></foot-top>
      <foot-bottom></foot-bottom>
    </el-footer>
  </el-container>
</template>
<script>
import { ACCESS_TOKEN } from '@/store/global-constant';
import FootTop from '@/components/footer/FootTop';
import FootBottom from '@/components/footer/FootBottom';
import HeaderUserNavTop from '@/components/header/HeaderUserNavTop';
import HeaderUserNavBottom from '@/components/header/HeaderUserNavBottom';
import showCode from '@/components/designer/showCode';
import { apply, getLabelList, getActivity, gainRealSignMessage, getCertificationUrl, gainUserElectronicContractUrl, getById, getByUserId } from '@/api/users/designer';
import { getCurrentUserInfo } from '@/api/users/userApi';
import { formatSecond } from '@/utils/timeUtil';

export default {
  components: {
    FootTop,
    FootBottom,
    HeaderUserNavTop,
    HeaderUserNavBottom,
    showCode
  },
  name: 'IndexLayout',
  data() {
    return {
      status: '',
      codeTime: null,
      // showCodeDialog: false,
      checked: false,
      form: {
        tel: '',
        name: '',
        type1: [],
        type2: [],
        desc1: null,
        desc2: null
      },
      userInfo: '',
      attestationUrl: [],
      uid: '',
      // isRead: false,
      isAactiveShow: false,
      isActivity: 0,
      headers: {
        token: localStorage.getItem(ACCESS_TOKEN),
        Authorization: localStorage.getItem(ACCESS_TOKEN)
      },
      labelList: [],
      fileListes: [],
      activityList: [],
      url: '',
      isShow: false,
      isReal: false
      // fileList: [
      //   { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
      //   { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }
      // ]
    };
  },
  created() {
    this.getUserInfo();
    this.getLabelListFn();
    this.getActivityFn();
    this.initData();
  },
  watch: {
    checked: {
      deep: true,
      handler(val) {
        if (val) {
          // this.status = '';
          // this.gainRealSignMessageFn();
        }
      }
    },
    status: {
      deep: true,
      handler(val) {
        let _this = this;
        // 0未实名1实名成功2签署完成3合同签署中4签署失败5拒签6未签署
        if (val == '0') {
          _this.getCertificationUrlFn();
          _this.codeTime = setInterval(() => {
            _this.gainRealSignMessageFn();
          }, 5000);
        } else if (val == '1') {
          _this.$message.success('实名认证成功！');
          _this.gainUserElectronicContractUrlFn();
          _this.$refs.showCodeRef.showCodeDialog = false;
        } else if (val == '2') {
          _this.$message.success('签署完成！');
          _this.isReal = true;
          _this.$refs.showCodeRef.showCodeDialog = false;
          _this.agreeDesiger();
          clearInterval(_this.codeTime);
        } else if (val == '3' || val == '4' || val == '5' || val == '6') {
          _this.gainUserElectronicContractUrlFn();
        }
      }
    }
  },
  methods: {
    formatSecond,
    // 去空
    toEmpty(type) {
      if (type == 0) {
        this.form.tel = this.form.tel.replace(/\s+/g, '');
      } else if (type == 1) {
        this.form.name = this.form.name.replace(/\s+/g, '');
        // console.log(2222);
      }
    },
    // 处理初始化数据
    initData() {
      if (localStorage.getItem('attestationUrl')) {
        let list = JSON.parse(localStorage.getItem('attestationUrl'));
        list.map(item => {
          let obj = {
            name: this.fileName(item),
            url: item,
            response: {
              data: item
            }
          };
          this.fileListes.push(obj);
        });
        // this.fileListes = [{ name: this.fileName(localStorage.getItem('attestationUrl')), url: '/api/consumer/alibaba/oss/uploadFile?file=designer&folder=designerFiles' }];
      } else {
        this.fileListes = [];
      }
      if (this.fileListes.length > 0) {
        this.fileListes.map(item => {
          this.attestationUrl.push(item.response.data);
        });
      }
    },
    // 获取用户信息
    getUserInfo() {
      getCurrentUserInfo().then(res => {
        this.$set(this, 'userInfo', res.data);
        this.uid = res.data.id;
        this.$set(this.form, 'tel', res.data.mobile);
        // console.log('获取用户信息', this.userInfo);
      });
    },
    // 获取用户实名和签署信息
    async gainRealSignMessageFn() {
      let _this = this;
      let res = await gainRealSignMessage();
      if (res.code == '000000') {
        this.status = res.data.status; // 0未实名1实名成功2签署完成3合同签署中4签署失败5拒签6未签署

        if (this.checked) {
          if (this.status != '2') {
            // this.$message.error('请实名认证完成和签署委托设计协议完成！');
            if (this.isShow) {
              this.$refs.showCodeRef.showCodeDialog = true;
            }
          }
        }
        // console.log('isReal----', this.isReal);
      }
    },
    // 到法大大注册用户并获取实名认证
    getCertificationUrlFn() {
      getCertificationUrl().then(res => {
        // console.log('到法大大注册用户并获取实名认证', res);
        this.url = res.data;
        this.$refs.showCodeRef.code2Url(this.url, 1);
        this.isShow = true;
      });
    },
    // 获取电子合同签约地址
    gainUserElectronicContractUrlFn() {
      gainUserElectronicContractUrl().then(res => {
        // console.log('获取电子合同签约地址', res);
        this.url = res.data;
        this.$refs.showCodeRef.code2Url(this.url, 2);
        this.isShow = true;
      });
    },
    // 获取标签
    getLabelListFn() {
      getLabelList().then(res => {
        if (res.code == '000000') {
          this.labelList = res.data;
          // console.log('获取labelList', this.labelList);
        }
      });
    },
    // 获取路径的名字
    fileName(url) {
      if (url) {
        let urlList = url.split('/');
        return urlList[urlList.length - 1];
      }
    },
    // 获取认证入驻奖励活动信息
    getActivityFn() {
      getActivity().then(res => {
        // console.log('奖励活动信息', res);
        let nowTime = Date.now();
        // console.log('nowTime', res.data.length);
        // console.log(this.formatSecond(nowTime));
        if (res.data !== null && res.data.length > 0) {
          this.activityList = res.data;
          if (nowTime - this.toTime(this.activityList[0].startTime) > 0) {
            this.isAactiveShow = true;
            this.isActivity = res.data[0].id;
          }
          // console.log('nowTime', nowTime - this.toTime(this.activityList[0].startTime));
          // console.log(this.formatSecond(this.activityList[0].startTime));
        }
      });
    },
    // 把10位的时间戳转成13位
    toTime(time) {
      let timeStr = time.toString();
      if (timeStr.length < 13) {
        return time * 1000;
      } else {
        return time;
      }
    },
    // 领取活动奖励
    // toReceive(id, price, type) {
    //   if (type == 1) {
    //     localStorage.setItem('isActivity', this.isActivity);
    //     if (this.isActivity > 0) {
    //       this.$message({
    //         message: '不能重复领取！',
    //         type: 'warning'
    //       });
    //     } else {
    //       this.isActivity = id;
    //       this.$message.success(`成功领取活动奖励${price}元！`);
    //     }
    //   } else if (type == 0) {
    //     this.isActivity = 0;
    //     localStorage.removeItem('isActivity');
    //   }
    //   console.log(2222, this.isActivity);
    // },
    //上传文件的判断
    beforeUploadFile(file) {
      // console.log('file333333333333', file);
      var fileName = file.name;
      let wordLength = fileName.split('.');
      if (wordLength[0].length > 30) {
        // console.log(wordLength);
        this.$message.error('上传文件名不能超过30个字符！');
        return false;
      }
      // const reg = /\.(ai|psd|pdf|cdr)$/;
      // const extension = reg.test(fileName);
      const fileSize = file.size / 1024 / 1024 < 50;
      // if (!extension) {
      //   this.$message({
      //     message: '上传文件只能是 ai、psd、pdf、cdr格式!',
      //     type: 'warning'
      //   });
      // }
      if (!fileSize) {
        this.$message({
          message: '上传文件大小不能超过 50MB!',
          type: 'warning'
        });
      }
      return fileSize;
      // return extension && fileSize;
    },
    //上传成功的方法
    uploadSuccess(response, file, fileList) {
      // console.log('fileList上传成功', fileList);
      if (response.code === '000000') {
        this.attestationUrl.push(response.data);
        localStorage.setItem('attestationUrl', JSON.stringify(this.attestationUrl));
        // console.log('file', this.attestationUrl);

        this.$message({
          type: 'success',
          message: '上传成功'
        });
      } else {
        this.$message({
          type: 'error',
          message: response.message
        });
      }
    },
    handleRemove(file, fileList) {
      // console.log('2222file', file);
      // console.log('44444fileList', fileList);
      if (!fileList.length) {
        this.attestationUrl = [];
        localStorage.removeItem('attestationUrl');
      } else {
        this.attestationUrl = [];

        fileList.map(item => {
          this.attestationUrl.push(item.response.data);
        });
        localStorage.setItem('attestationUrl', JSON.stringify(this.attestationUrl));
      }
      // console.log('this.attestationUrl44444', this.attestationUrl);
    },
    async agreeDesiger() {
      let str1 = '';
      let str2 = '';
      if (this.form.name == '' || this.form.name == null) {
        this.$message.error('请输入姓名/昵称');
        return false;
      }
      if (this.form.type1.length > 0) {
        str1 = this.form.type1.join(',');
        let index = str1.indexOf('oth1');
        if (index != -1) {
          str1 = str1.replace('oth1,', '');
          str1 = str1.replace(',oth1', '');
          str1 = str1.replace('oth1', '');
          console.log('val.type1:', str1);
          if (this.form.desc1 == '' || this.form.desc1 == null) {
            this.$message.error('请输入其他特长标签！');
            return false;
          }
        } else {
          this.form.desc1 = null;
        }
      } else {
        this.$message.error('请至少选中一种特长标签');
        return false;
      }
      if (this.form.type2.length > 0) {
        str2 = this.form.type2.join(',');
        let index2 = str2.indexOf('oth2');
        if (index2 != -1) {
          str2 = str2.replace('oth2,', '');
          str2 = str2.replace(',oth2', '');
          str2 = str2.replace('oth2', '');
          console.log('val.type2:', str2);
          if (this.form.desc2 == '' || this.form.desc2 == null) {
            this.$message.error('请输入其他熟练软件！');
            return false;
          }
        } else {
          this.form.desc2 = null;
        }
      } else {
        this.$message.error('请至少选中一种熟练软件');
        return false;
      }

      // console.log('attestationUrl', localStorage.getItem('attestationUrl'));
      // console.log(' this.isActivity11', this.isActivity);
      if (!this.isAactiveShow) {
        this.isActivity = 0;
      }
      const parms = {
        attestationUrlList: JSON.parse(localStorage.getItem('attestationUrl')), //认证作品地址
        labelMeritId: str1 == '' ? null : str1, //特长
        labelSoftwareId: str2 == '' ? null : str2, //软件
        meritRests: this.form.desc1 == '' || this.form.desc1 == null ? null : this.form.desc1, //特长其他
        realname: this.form.name, //真实姓名
        softwareRests: this.form.desc2 == '' || this.form.desc2 == null ? null : this.form.desc2, //软件其他
        uid: this.uid, //用户id
        isActivity: this.isActivity
      };
      // console.log('parms666666', parms);
      // this.isRead = localStorage.getItem('isRead');
      // if (parms.attestationUrlList == null || parms.attestationUrlList.length == 0) {
      //   this.$message.error('请上传文件');
      //   return false;
      // } else {
      if (this.checked) {
        await this.gainRealSignMessageFn();
        // console.log('isRealInfo---', this.isReal);
        if (!this.isReal) return;
        apply(parms)
          .then(res => {
            // console.log('申请申请', res);
            if (res.code == '000000') {
              // localStorage.removeItem('isRead');
              localStorage.removeItem('attestationUrl');
              localStorage.removeItem('isActivity');
              this.$message({
                type: 'success',
                message: '欢迎加入傲彩认证为设计师，系统在有设计任务时会分配到给到您！'
              });
              this.$router.push('/user/myTask');
            }
          })
          .catch(err => {
            // console.log('err222', err);
            // localStorage.removeItem('isRead');
            localStorage.removeItem('attestationUrl');
            this.fileListes = [];
            if (err.code == '999999') {
              this.$router.push('/user/myTask');
            }
          });
      } else {
        this.$message.error('请先阅读《委托设计合同》');
        return false;
      }
      // }
    }
  },
  beforeDestroy() {
    // localStorage.removeItem('isRead');
    localStorage.removeItem('attestationUrl');
    localStorage.removeItem('isActivity');
    clearInterval(this.codeTime);
  }
};
</script>
<style>
.code2 .el-dialog--center .el-dialog__body {
  padding: 0px 25px 40px;
}
.centerBox .el-input__inner {
  height: 30px;
}
.centerBox .el-checkbox {
  margin-right: 10px;
}
.centerBox .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #d0111b;
  border-color: #d0111b;
}
.centerBox .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #d0111b;
}
.centerBox .el-checkbox.is-bordered.is-checked {
  border-color: #d0111b;
}
.centerBox .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: #d0111b;
}
.centerBox .el-checkbox__inner:hover {
  border-color: #d0111b;
}
</style>
<style scoped>
.reBtn {
  height: 30px;
  line-height: 6px;
  margin-left: 10px;
}
.activity {
  width: 1018px;
  padding: 10px 0;
  padding-left: 86px;
  border: 1px solid #f3d995;
  background: #fefcee;
  /* background: #f5dc90; */
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
.signing {
  background: #fff;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
}
.signing h2 {
  padding: 60px 0 30px 0;
  text-align: center;
  font-size: 20px;
}
.centerBox {
  background: #f9f9f9;
  /* padding: 60px 36px 100px 86px; */
  padding: 0 19px 40px 86px;
}
.centerBox h3 {
  /* margin-bottom: 40px; */
  margin: 20px 0;
}
.centerBox .el-input {
  width: 166px;
}

.upFiles {
  width: 286px;
}

/* .upBtn:active,
.upBtn:focus {
  color: #606266;
  border-color: #dcdfe6;
  background-color: #ffffff;
}
.upBtn:hover {
  color: #d0111b;
  border-color: #da5c60;
  background-color: #faccd3;
} */
.limits {
  /* width: 760px; */
  font-size: 13px;
  color: #7f7f7f;
  margin: 16px 0;
  /* border-bottom: 1px solid #797979; */
}
.readContract {
  font-size: 13px;
}
.agree {
  width: 140px;
  height: 40px;
  margin-top: 40px;
  margin-bottom: 160px;
  background: #e60021;
  color: #fff;
  border: none;
}
.agree:hover {
  background: #c81623;
}
</style>
<style scoped src="@/static/mulindex/css/public.css"></style>
<style scoped src="@/static/mulindex/css/fonts.css"></style>
<style scoped src="@/static/index/user/css/all.css" />
<!--<style scoped src="../../static/index/css/main.css" />-->
<style scoped src="../../../static/login.css" />
<style src="../../../static/index/user/css/reset.css" />
