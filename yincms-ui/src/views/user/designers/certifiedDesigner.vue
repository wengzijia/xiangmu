<template>
  <div class="certifiedDesigner">
    <div class="certified" v-if="isCertified">
      <div class="head ">
        <h3 :class="isCash ? 'wordSize' : ''" @click="tabClick(false)">认证设计师</h3>
        <h3 :class="!isCash ? 'wordSize' : ''" @click="tabClick(true)">提现设置</h3>
      </div>
      <div v-if="!isCash">
        <div class="common">
          <p class="topHead">基本信息</p>
          <p class="messages" v-if="inUser.tel">
            手机号：<span style="color:#818181"> {{ inUser.tel == null ? '' : encodingMobile(inUser.tel) }}</span>
          </p>
          <!-- <p class="messages">
          真实姓名：<span style="color:#818181">{{ inUser.realname }}</span>
        </p> -->
          <p class="messages">
            擅长标签：<span class="meritName" v-for="item in inUser.meritList" :key="item.id">{{ item.meritName }}</span>
            <span class="meritName">{{ inUser.meritRests }}</span>
          </p>
          <p class="messages">
            熟悉软件：<span class="meritName" v-for="val in inUser.softwareList" :key="val.id">{{ val.meritName }}</span>
            <span class="meritName">{{ inUser.softwareRests }}</span>
          </p>
        </div>
        <div class="common" v-if="realStatus == 2">
          <p class="topHead">实名认证</p>
          <p style="margin-bottom: 20px;">真实姓名：{{ inUser.realname }}</p>
          <p>身份证号：{{ inUser.idcard }}</p>
        </div>
        <div class="common">
          <p class="topHead">协议合同</p>
          <div style="display:flex;align-items: self-end;">
            <div class="same">
              <a style="color:#409eff; cursor: pointer;" v-if="!inUser.viewpdfUrl" href="/user/designContract" target="_blank">《委托设计协议》</a>
              <a style="color:#409eff; cursor: pointer;" v-if="inUser.viewpdfUrl" :href="inUser.viewpdfUrl" target="_blank">《委托设计协议》</a>
              <a style="color:#409eff; cursor: pointer;" v-if="inUser.downloadUrl" :href="inUser.downloadUrl" target="_blank">下载</a>
              <!-- <p style="color:#409eff; cursor: pointer;">《委托设计协议》</p> -->
              <p v-if="inUser.accomplishDate">同意时间：{{ inUser.accomplishDate == null || inUser.accomplishDate == 0 ? '' : inUser.accomplishDate }}</p>
            </div>
          </div>
        </div>
        <div class="designer">
          <p class="topHead designLevel">
            <span>设计师级别</span>
            <span style="color:#409eff; cursor: pointer;font-weight:normal">《设计师等级规则》</span>
            <!-- <a style="color:#409eff; cursor: pointer;font-weight:normal"   href="/user/designerRules" target="_blank">《设计师等级规则》</a> -->
          </p>
          <div class="levels">
            <p class="levelTile">设计师星级评级</p>
            <div class="levelContent">
              <p class="messages">
                任务作品数 <span class="meritName">{{ inUser.worksNumber }}</span>
              </p>
              <p class="messages" v-if="inUser.documentIfExist == 0 && inUser.initialGrade == 0">综合级别: <span style="margin-left: 10px;color:#dd184d">未评级</span></p>
              <p class="messages" v-else>
                综合级别: <span class="lefts"><el-rate v-model="value" disabled :colors="['#dd184d', '#dd184d', '#dd184d']" text-color="#dd184d" score-template="{value}"> </el-rate></span
                ><span style="margin-left: -10px;">{{ value }}星级平面设计师</span>
              </p>
              <p class="messages">
                更新时间：<span class="meritName">{{ inUser.gradeTime == null || inUser.gradeTime == 0 ? '' : formatSecond(inUser.gradeTime) }}</span>
              </p>
            </div>
          </div>
          <div>
            <p class="levelTile">设计师服务能力</p>
            <div class="levelContent">
              <p class="messages" v-for="val in gradeList" :key="val.id">
                {{ val.name }} <span class="lefts progress"><el-progress :text-inside="true" color="#dd184d" :show-text="false" :stroke-width="12" :percentage="val.score < 0 ? 0 : val.score > 100 ? 100 : val.score"></el-progress></span>
                <span class="lefts">{{  val.score &lt; 0 ? 0 : val.score > 100 ? 100 : val.score }}</span>
                <!-- <span class="lefts">{{ 0 > val.score ? 0 : val.score > 100 ? 100 : val.score }}</span> -->
                <!-- <span class="lefts">持平于同行</span> -->
              </p>
            </div>
          </div>
          <div>
            <div class="uploads ">
              <span style="font-weight: 700;color:#333">上传初始作品:</span>
              <div>
                <!-- <p class="upinit"> -->
                <div v-if="attestationList.length > 0">
                  <p class="upinit" v-for="(vals, idx) in attestationList" :key="idx">
                    <a :href="baseUrl + vals.attestationUrl" target="_blank">{{ fileName(vals.attestationUrl) }}</a>
                  </p>
                  <!-- <span v-for="(vals, idx) in inUser.attestationList" :key="idx">{{ vals }}</span> -->
                </div>
                <p v-if="inUser.attestationUrl">
                  <a class="upinit" :href="baseUrl + inUser.attestationUrl" target="_blank">{{ urlList[urlList.length - 1] }}</a>
                </p>
                <!-- <div style="width:400px;margin:10px 20px"> -->
                <!-- documentIfExist==0 && initialGrade==0 就是未评级的  ifDueTime:1超过30天,0正常-->
                <div style="width:400px;margin:10px 20px" v-if="inUser.documentIfExist == 0 && attestationList.length - num < 5 && inUser.ifDueTime == 0 && inUser.initialGrade !== 1">
                  <!-- :disabled="attestationList.length + attestationUrlList.length + num == 5" -->
                  <el-upload
                    class="upload-demo"
                    :headers="headers"
                    action="/api/consumer/designer/miniPackUsersApply/uploadFile?file=designer"
                    :before-upload="beforeUploadFile"
                    :on-success="(response, file, fileList) => uploadSuccess(response, file, fileList)"
                    :on-remove="handleRemove"
                    :limit="attestationList.length > 0 ? 5 - attestationList.length - num : 5 - num"
                    :file-list="fileListes"
                  >
                    <!-- accept=".ai,.psd,.pdf,.cdr" -->
                    <el-button size="small" class="upBtn" style="padding: 6px 15px">上传</el-button>
                  </el-upload>
                </div>
              </div>
            </div>
            <!-- <div style="margin: 10px 106px;"> -->
            <div style="margin: 10px 106px;" v-if="inUser.documentIfExist == 0 && attestationList.length < 5 && inUser.ifDueTime == 0 && inUser.initialGrade != 1">
              <el-button type="primary" style="padding: 6px 15px;" @click="updateInitialDesignDocumentFn">提交</el-button>
            </div>
            <p style="color:#7f7f7f">（入驻30天内未接任务前可补充上传来评定初始等级，超过期限则按不可再上传；有领取任务完成后，以任务实际评级为最终级别）</p>
          </div>
          <!-- <div>
          <span class="level">当前认定：V{{ inUser.level }}级设计师</span>
          <span style="color:#999">{{ urlList[urlList.length - 1] }}</span>
        </div> -->
        </div>
      </div>
      <div v-if="isCash" style="margin-top: 30px;">
        <div style="padding-left: 26px;">
          <span>注册招商银行灵工账号，作为在傲彩平台提现后的收款账号</span>
          <span class="tutorial" @click="$refs.cashPopup.showDialog(1)">《提现教程》</span>
        </div>
        <div style="margin-top:20px">
          <el-form :model="infoForm" ref="info" :rules="rules" label-width="100px" class="demo-dynamic">
            <el-form-item label="姓名:" prop="realname">
              <el-input v-model="infoForm.realname" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="身份证号:" prop="idcard">
              <el-input v-model="infoForm.idcard" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item label="手机账号:" prop="mobile">
              <el-input v-model="infoForm.mobile" style="width:300px"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="saveAndApply">
                <el-button type="primary" @click="submitForm('info')">保存设置</el-button>
                <el-button @click="$router.push('/user/financial')">去提现申请</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <showCode ref="showCodeRef" :url="url" @gainRealSignMessageFn="gainRealSignMessageFn"></showCode>
    <cashPopup ref="cashPopup" :cashId="infoForm.id"></cashPopup>
  </div>
</template>

<script>
import { ACCESS_TOKEN } from '@/store/global-constant';
import { getByUserId, updateInitialDesignDocument, gainFinanceWithdrawalAccount, gainRealSignMessage, getCertificationUrl, gainUserElectronicContractUrl, addFinanceWithdrawalAccount } from '@/api/users/designer';
import { getCurrentUserInfo } from '@/api/users/userApi';
import { encodingMobile } from '@/utils/strUtil';
import { formatDateSecond, formatSecond } from '@/utils/timeUtil';
import showCode from '@/components/designer/showCode';
import cashPopup from '@/components/cashPopup/index.vue';

export default {
  components: {
    showCode,
    cashPopup
  },
  data() {
    function checkPhone(mobile) {
      // var tel = /^0\d{2,3}-?\d{7,8}$/;
      var tel = /0\d{2,3}-\d{7,8}/;
      var phone = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
      // var phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
      if (mobile.length == 11) {
        //手机号码
        if (phone.test(mobile)) {
          return true;
        }
      } else if (mobile.length > 11 && mobile.indexOf('-') != -1) {
        //电话号码
        if (tel.test(mobile)) {
          return true;
        }
      }
      // console.log('请输入有效的号码！');
      return false;
    }
    // 电话号码校验
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机账号'));
      } else {
        // console.log('22222222---',value);
        if (checkPhone(value + '')) {
          callback();
        } else {
          callback(new Error('请输入有效的号码！'));
        }
      }
    };
    return {
      infoForm: {
        id: '',
        idcard: '', //身份证号
        mobile: '', //联系电话
        realname: '', //真实姓名
        userId: '' //用户ID
      },
      baseUrl: 'http://alifile.xiaocaiyin.com/',
      fileListes: [],
      attestationUrlList: [],
      UrlList: [],
      headers: {
        token: localStorage.getItem(ACCESS_TOKEN),
        Authorization: localStorage.getItem(ACCESS_TOKEN)
      },
      value: 0,
      isCertified: true, //判断是否入驻注册
      uid: '',
      inUser: '',
      urlList: [],
      gradeList: [],
      num: 0,
      attestationList: [],
      status: '',
      url: '',
      codeTime: null,
      realStatus: '', //实名状态:0:未激活 1:未认证 2:审核通过 3:已提交待审核 4:审核不通过
      electronicContractStatus: '', //   签署状态:0:未签署 1:签署中 2:签署完成 3:签署失败 4:拒签
      isCash: false, //是否是提现tab
      rules: {
        realname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        idcard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
        mobile: [{ validator: validatePhone, trigger: 'blur' }]
      }
    };
  },
  created() {
    this.getUserInfo();
    this.gainFinanceWithdrawalAccountFn();
    if (this.$route.query.isCash) {
      this.isCash = true;
    }
  },
  watch: {
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
          // console.log('this.$refs.showCodeRef', this.$refs.showCodeRef);
          _this.$message.success('实名认证成功！');
          _this.gainUserElectronicContractUrlFn();
          _this.$refs.showCodeRef.showCodeDialog = false;
        } else if (val == '2') {
          _this.$message.success('签署完成！');
          _this.$refs.showCodeRef.showCodeDialog = false;
          clearInterval(_this.codeTime);
        } else if (val == '3' || val == '4' || val == '5' || val == '6') {
          _this.gainUserElectronicContractUrlFn();
        }
      }
    }
  },
  methods: {
    ...{ encodingMobile, formatSecond, formatDateSecond },
    // 设计师财务结算-获取用户提现账户
    gainFinanceWithdrawalAccountFn() {
      gainFinanceWithdrawalAccount().then(res => {
        // console.log('获取用户提现账户res', res);
        if (res.code == '000000' && res.data) {
          this.infoForm.id = res.data.id;
          this.infoForm.idcard = res.data.idcard;
          this.infoForm.mobile = res.data.mobile;
          this.infoForm.realname = res.data.realname;
          this.infoForm.realname = res.data.realname;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.infoForm.userId = this.uid;
          this.addFinanceWithdrawalAccountFn();
        } else {
          return false;
        }
      });
    },
    //设计师财务结算-获取用户提现账户
    addFinanceWithdrawalAccountFn() {
      addFinanceWithdrawalAccount(this.infoForm).then(res => {
        if (res.code == '000000') {
          this.$message.success('保存成功！');
        }
      });
    },
    tabClick(type) {
      this.isCash = type;
    },
    showCode2() {
      if (this.realStatus != 2) {
        this.$refs.showCodeRef.code2Url(this.url, 1);
      } else if (this.realStatus == 2 && this.electronicContractStatus != 2) {
        this.$refs.showCodeRef.code2Url(this.url, 2);
      }
    },
    // 获取用户实名和签署信息
    gainRealSignMessageFn() {
      gainRealSignMessage().then(res => {
        // console.log('获取用户实名和签署信息', res);
        if (res.code == '000000') {
          this.status = res.data.status; // 0未实名1实名成功2签署完成3合同签署中4签署失败5拒签6未签署
        }
      });
    },
    // 到法大大注册用户并获取实名认证
    getCertificationUrlFn() {
      getCertificationUrl().then(res => {
        // console.log('到法大大注册用户并获取实名认证', res);
        this.url = res.data;
        this.showCode2();
      });
    },
    // 获取电子合同签约地址
    gainUserElectronicContractUrlFn() {
      gainUserElectronicContractUrl().then(res => {
        // console.log('获取电子合同签约地址', res);
        this.url = res.data;
        this.showCode2();
      });
    },
    // 获取用户信息
    getUserInfo() {
      getCurrentUserInfo().then(res => {
        // this.$set(this, 'userInfo', res.data);
        if (res.code == '000000') {
          this.uid = res.data.id;

          // console.log('获取用户信息',this.uid);
          this.getByUserIdFn();
        }
      });
    },
    // 获取入驻用户信息
    getByUserIdFn() {
      getByUserId({ id: this.uid }).then(res => {
        console.log('入驻用户信息', res.data);
        if (res.code == '000000') {
          this.realStatus = res.data.realStatus; //实名状态:0:未激活 1:未认证 2:审核通过 3:已提交待审核 4:审核不通过
          this.electronicContractStatus = res.data.electronicContractStatus; //签署状态:0:未签署 1:签署中 2:签署完成 3:签署失败 4:拒签
          // console.log('res.data.realStatus-----', res.data.realStatus);
          if (this.realStatus != 2) {
            this.gainRealSignMessageFn();
          } else if (this.realStatus == 2 && this.electronicContractStatus != 2) {
            this.gainUserElectronicContractUrlFn();
          }
          this.isCertified = res.data.id == null ? false : true;
          if (!this.isCertified) {
            this.$router.replace('/user/designerRegister');
            return false;
          }
          this.inUser = res.data;
          this.value = res.data.level;
          this.gradeList = res.data.gradeList;
          if (this.inUser.attestationUrl != null) {
            this.num = 1;
          }
          // console.log('this.num', this.num);
          this.gradeList.map((item, index) => {
            if (index == 0) {
              item.name = '任务完成量';
            } else if (index == 1) {
              item.name = '任务难易度';
            } else if (index == 2) {
              item.name = '设计与创意';
            } else if (index == 3) {
              item.name = '响应配合度';
            }
          });
          this.attestationList = res.data.attestationList;
          if (this.inUser.attestationUrl != null) {
            this.urlList = this.inUser.attestationUrl.split('/');
          }
        }
      });
    },
    // 上传初始设计文件
    updateInitialDesignDocumentFn() {
      const docParms = {
        attestationUrlList: this.attestationUrlList, //认证作品地址
        uid: this.uid //用户id
      };
      if (this.attestationUrlList.length > 0) {
        updateInitialDesignDocument(docParms)
          .then(res => {
            console.log('认证作品地址', res);
            this.$message.success('提交上传文件成功！');
            this.getByUserIdFn();
          })
          .catch(error => {
            this.attestationUrlList = [];
            this.fileListes = [];
          });
      }
      this.attestationUrlList = [];
      this.fileListes = [];
    },
    // 获取路径的名字
    fileName(url) {
      if (url) {
        let urlList = url.split('/');
        return urlList[urlList.length - 1];
      }
    },
    //上传文件的判断
    beforeUploadFile(file) {
      var fileName = file.name;
      // console.log('file333333333333', file);
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
      this.attestationUrlList.push(response.data);
    },
    handleRemove(file, fileList) {
      // console.log('2222file', file);
      // console.log('44444fileList', fileList);
      fileList.map(item => {
        this.attestationUrlList.push(item.response.data);
      });
    }
  },
  beforeDestroy() {
    clearInterval(this.codeTime);
  }
};
</script>

<style scoped>
.uploads {
  display: flex;
  /* align-items: center; */
  color: #666;
  /* margin: 20px 0; */
  margin-top: 20px;
}
.upinit {
  width: 400px;
  margin: 0 0 4px 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.progress {
  width: 120px;
  /* display: flex; */
  /* align-items: center; */
}
.levelTile {
  color: #333;
  margin: 20px 0;
  font-weight: 700;

  /* font-weight: 700; */
}
.tatol {
  display: flex;
}
.lefts {
  margin: 0 10px;
  color: #dd184d;
}
.levelContent {
  margin-left: 26px;
}
.messages {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
.meritName {
  margin-left: 10px;
  color: #818181;
}
.certifiedDesigner {
  background: #fff;
  font-size: 14px;
  color: #333;
  padding: 60px 20px;
}
.certifiedDesigner .head {
  display: flex;
  padding: 10px 0;
}
.certifiedDesigner .head h3 {
  margin-right: 30px;
  cursor: pointer;
  user-select: none;
}
.certifiedDesigner .head h3:hover {
  color: #dd184d;
}
.topHead {
  margin-bottom: 20px;
  font-weight: 700;
}
.designLevel {
  display: flex;
  justify-content: space-between;
}
.designer {
  padding: 30px 0;
}
.common {
  padding: 30px 0;
  border-bottom: 1px solid #ddd;
}
.level {
  margin-right: 60px;
}
.same {
  width: 240px;
  height: 70px;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 22px;
  color: #c0c4cc;
  margin-right: 10px;
}
.wordSize {
  font-size: 14px;
}
.tutorial {
  color: #409eff;
  margin-left: 20px;
  cursor: pointer;
}
.saveAndApply {
  display: flex;
  justify-content: space-between;
  width: 520px;
}
</style>
