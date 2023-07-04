<template>
  <div class="real-name-cert">
    <div v-if="!deviceNotSupport">
      <div v-if="!result">
        <div class="title">
          实名认证
        </div>
        <div class="cert-content">
          <div class="description">请填写本人真实姓名及身份证号码</div>
          <div class="field">真实姓名： <input type="text" placeholder="请填写身份证上的姓名" v-model="certName" maxlength="15" /></div>
          <div class="field">身份证号： <input type="text" placeholder="请填写身份证号" v-model="certNo" oninput="if(value.length>18)value=value.slice(0,18)" /></div>
          <button @click="getCertification" class="cert-button">开始人脸验证</button>
        </div>
      </div>
      <div v-if="result == '认证成功'">
        <img style="width: 190px" src="../../static/mulindex/img/smilingface.png" alt="" />
        <p class="comfirm">认证成功</p>
      </div>
      <div v-if="result == '查询中'">
        <img style="width: 190px" src="../../static/mulindex/img/smilingface.png" alt="" />
        <p class="comfirm">查询中</p>
      </div>
      <div v-if="result == '认证失败'">
        <img src="../../static/mulindex/img/non.png" alt="" />
        <p class="comfirm">认证失败</p>
      </div>
    </div>

    <div v-if="deviceNotSupport" class="not-support">
      <img src="../../static/mulindex/img/分享1.png" alt="" />
    </div>
    <!-- 当前浏览器不支持，请用safari/chrome手机浏览器打开本网页。 -->
  </div>
</template>
<script>
import { checkRealNameCert, getRealNameCert } from '@/api/realNameCert';
import loadJs from '@/utils/loadJs';

export default {
  name: 'realNameCert',
  data() {
    return {
      metaInfo: null,
      certName: null,
      certNo: null,
      certUrl: null,
      certID: null,
      id: 29,
      result: null,
      deviceNotSupport: false
    };
  },
  created() {
    let str = window.navigator.userAgent;
    if (str.indexOf('MicroMessenger') !== -1 && str.indexOf('iPhone') !== -1) {
      this.deviceNotSupport = true;
    }
    let query = this.$route.query;
    console.log(query.checkResult);
    if (query.uid) {
      localStorage.setItem('uid', query.uid);
      localStorage.setItem('Access-Token', query.token);
    }
    if (query.checkResult) {
      this.result = '查询中';
      this.checkCertification();
    }
    loadJs('https://cn-shanghai-aliyun-cloudauth.oss-cn-shanghai.aliyuncs.com/web_sdk_js/jsvm_all.js').then(() => {
      // eslint-disable-next-line no-undef
      let res = getMetaInfo();
      res = JSON.stringify(res);
      this.metaInfo = res;
    });
  },
  methods: {
    // close() {
    //   window.close();
    // },
    getCertification() {
      if (!this.certName || !this.certNo) {
        this.$message.error('请输入姓名/身份证号码');
        return;
      }
      let idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;

      let cardNo = this.certNo;

      if (idcardReg.test(cardNo)) {
        // console.log('此身份证合法！');
      } else {
        this.$message.info('请核对身份证是否正确');
        return;
      }
      let url = `/realNameCert?checkResult=true&uid=${this.$route.query.uid}&token=${this.$route.query.token}`;
      let obj = {
        certName: null,
        certNo: null,
        id: null,
        metaInfo: null,
        returnUrl: window.location.origin + url
        // returnUrl: 'http://192.168.1.222:8000/realNameCert?checkResult=true'
        // returnUrl: 'http://192.168.7.20:8000/realNameCert?checkResult=true'
      };
      obj.metaInfo = this.metaInfo;
      obj.certName = this.certName;
      obj.certNo = this.certNo;
      obj.id = localStorage.getItem('uid');
      getRealNameCert(obj).then(res => {
        console.log(res);
        if (res.data.code === '200') {
          // this.certUrl = 'http://m.alyms.cn/F4.0D9vFy';
          this.certUrl = res.data.certifyUrl;
          this.certID = res.data.certifyId;
          localStorage.setItem('certifyId', res.data.certifyId);
          localStorage.setItem('certName', obj.certName);
          localStorage.setItem('certNo', obj.certNo);
          localStorage.setItem('uid', obj.id);
          // console.log('this.certUrl', this.certUrl);
          top.location = this.certUrl;
        } else if (res.data.code === '401') {
          this.$message.error('请填写正确姓名/身份证号码');
        }
      });
    },
    checkCertification() {
      let obj = {
        id: null,
        certifyId: null,
        certName: null,
        certNo: null
      };
      obj.certifyId = localStorage.getItem('certifyId');
      obj.certName = localStorage.getItem('certName');
      obj.certNo = localStorage.getItem('certNo');
      obj.id = localStorage.getItem('uid');
      checkRealNameCert(obj)
        .then(res => {
          console.log(res);
          if (res.code === '000000') {
            if (res.data.passed == 'T') {
              this.result = '认证成功';
            } else {
              this.result = '认证失败';
            }
            console.log(res.data.passed);
          }
        })
        .catch(error => {
          this.result = '请回认证设计师平台查看结果！';
        });
    },
    certificateID() {
      let cardNo = this.certNo;
    }
  }
};
</script>

<style scoped>
.btn {
  border: 1px solid #e50020;
  height: 30px;
  border-radius: 6px;
  background: #e50020;
  color: #fff;
  width: 100px;
  cursor: pointer;
  margin-left: 40px;
  margin-top: 10px;
}
.real-name-cert {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  height: 100vh;
  background: #eef1f8;
  color: #555;
}

.title {
  width: 100%;
  /*display: inline;*/
  line-height: 50px;
  color: white;
  background: #383a3c;
  text-align: center;
  position: relative;
  top: 30px;
}

.cert-content {
  max-width: 900px;
  height: calc(100vh - 50px);
  position: relative;
  top: 30px;
}

.description {
  margin-top: 30px;
}

.field {
  margin-top: 20px;
  border-bottom: 1px solid #aaa;
}

.field input {
  border: none;
  outline: none;
  font-size: 20px;
  background: #eef1f8;
}

.cert-button {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: none;
  background: #e50021;
  color: white;
  width: 100%;
  height: 50px;
  font-size: 20px;
}
.not-support {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.comfirm {
  margin-top: 10px;
  text-align: center;
  color: #666;
  font-size: 16px;
}
</style>
