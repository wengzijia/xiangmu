<!--<script src="../store/modules/user.js"></script>-->
<template>
  <div class="home">
    <div class="login-page" v-if="!isLogin">
      <p class="login-title">机长看板</p>
      <div class="login-form">
        <div class="login-phone">
          <input type="number"
                 placeholder="请输入手机号码"
                 oninput="if(value.length>11)value=value.slice(0,11)"
                 v-model="userInfo.account"
                 class="phone-input"
          >
          <van-icon name="manager"></van-icon>
        </div>
        <div class="login-code">
          <input type="number" placeholder="请输入短信验证码" v-model="loginInfo.textCode">
          <van-button @click="sendCode" ref="code" :disabled="!!codeTimer">验证码</van-button>
          <van-icon name="lock"></van-icon>
        </div>
      </div>
      <van-button class="login-button" @click="userLogin()" :disabled="!!!userInfo.account||!!!loginInfo.textCode">登录 </van-button>
    </div>

    <div class="select-page" v-if="isLogin">
      <div class="logOut"  @click="loggingOut">
        <img :src="leftImg" alt="" />
        <button>登录</button>
      </div>
      <div v-if="!hasMachine">
        <div class="select-title">请选择设备</div>
        <div class="machines">
          <div class="machine-item"
               v-for="(item) in machineList"
               :key="item.id" @click="selectItem(item)"
               :class="{active:machineSelected === item.id , disable:item.chooseType === 1}"
          >
            <img :src="machineiconImg" alt="">
            <span class="machine-item-name">{{ item.deviceName + item.deviceModel}}</span>
          </div>
        </div>
        <van-button class="select-button" @click="machineConfirm()" :disabled="!!!machineSelected">确定</van-button>
      </div>
      <div v-if="hasMachine" class="no-machine">
        <img :src="frameImg" alt="">
        <div>暂无其他设备，请前往包秘书进行设置</div>
      </div>
    </div>
  </div>
</template>

<script>
import {getVerifySmsCode, verifySmsCode, getDeviceList, LogOut, setValidDeviceStatus} from '@/api/login.js'
import {getToken, removeToken, setToken} from '@/utils/auth.js'
import {punchConfirm} from "@/api/punchin";

export default {
  name: 'Login',
  data() {
    return {
      hasMachine: false,
      userInfo: {
        account: '',
        supplierId: 0,
      },
      loginInfo: {
        uuid: '123456',
        textCode: ''
      },
      isLogin: false,
      machineList: [],
      machineSelected: null,
      phone: "",
      codeTimer: null,
      supplierId:null,//加工商id
      attributeId:null,//当前工序id
      leftImg:require('../static/images/returnLeft.png'),
      machineiconImg:require('../static/images/machineicon.png'),
      frameImg:require('../static/images/noData.png'),
     
    }
  },
  
  created(){
    const {attributeId,deviceProducingStatus} = this.$store.state.device
    if(deviceProducingStatus==1&&getToken())return this.$router.push(`/dieCutting`) //表示存在且有机器未下班，直接进入看板页面
    this.checkIfLogin();
  },
  mounted() {
   
  },
  beforeDestroy() {
    clearInterval(this.codeTimer);
    this.codeTimer = null
  },
  
  methods: {
    checkIfLogin() {
      let token = getToken()
      let supplierId = localStorage.getItem('supplierId')
      if (token && supplierId) {
        this.isLogin = true
        this.getMachineList(supplierId)
      } else {
        this.isLogin = false
      }
    },
   
    /**
     * 获取短信验证码
     */
    sendCode() {
      if (this.codeTimer) return
      var reg = /^1[3-9]\d{9}$/
      const mobile =  this.userInfo.account
      if (mobile.length !== 11 || !reg.test(mobile) ) return  this.$toast('请输入格式正确的手机号。')
      this.$toast.loading('加载中')
      getVerifySmsCode({language: "zh-cn",mobile: mobile}).then(res => {
        this.$toast.clear()
        if(res.code != '000000') {
            clearInterval(this.codeTimer)
            this.codeTimer = null
            this.$refs.code.innerHTML = '验证码'
            return  this.$toast(res.message || '获取短信验证码失败。')
        }
        this.$toast(res.message||'获取验证码成功。')
        this.setCountDown()
        this.loginInfo.uuid = res.data
        localStorage.setItem('uuid', res.data)

      }, err => {
         this.$toast.fail(err.message || '服务异常。')
      })
    },
    /**
     * 设置短信验证码倒计时
     */
    setCountDown(){
      let time = 60
      this.$refs.code.innerHTML = time + 's'
      this.codeTimer = setInterval(() => {
        time--
        this.$refs.code.innerHTML = time + 's'
        if (time <= 0) {
          clearInterval(this.codeTimer)
          this.codeTimer = null
          this.$refs.code.innerHTML = '验证码'
        }
      }, 1000)
    },
    
    /**
     * 点击登录按钮
     */
    userLogin() {
      
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true,
      });

      let params = {
        language: "zh-cn",
        mobile: this.userInfo.account,
        uuid:this.loginInfo.uuid || localStorage.getItem('uuid'),
        verificationCode: this.loginInfo.textCode
      }

   
      verifySmsCode(params).then(res => {
        if (res.code !== '000000') return this.$toast(res.message || '接口异常。')
          setToken(res.data.token)
          this.$toast.clear()
          this.userInfo.supplierId = res.data.mesUserVO.supplierId;
          localStorage.setItem("supplierId", this.userInfo.supplierId)
          this.$store.dispatch('SET_INFO', res.data.mesUserVO)
          clearInterval(this.codeTimer)
          this.codeTimer = null
          localStorage.removeItem('uuid')
          const {currentDeviceId, deviceOperatorId,deviceProducingStatus,attributeId} = this.$store.state.device

          if (deviceProducingStatus==1) {
            setValidDeviceStatus(currentDeviceId).then(result => {
              if (result.code === '000000') return this.$router.push(`/dieCutting`) //表示token过期且有机器未下班
              if (result.code === '990003') {//token过期、设备停用且未进行下班，需要自动下班
                punchConfirm({deviceOperatorId, deviceId: currentDeviceId, punchType: 1}).then(data => {
                  if (data.code !== '000000') return this.$toast(data.message)
                  this.$store.dispatch('STORE_PRODUCING_STATUS', 0)//下班成功
                  this.getMachineList(res.data.mesUserVO.supplierId)
                  this.isLogin = true
                }, err => {
                  this.$toast(err.err || '接口异常')
                })
                return
              }
              this.getMachineList(res.data.mesUserVO.supplierId)
              this.isLogin = true
            })

            return
          }

          this.isLogin = true
          this.getMachineList(res.data.mesUserVO.supplierId)

      }, err => {
        this.$toast(err.message || '接口异常。')
      })
    },
    
    /**
     * 退出登录按钮
     */
    loggingOut() {
      localStorage.removeItem('supplierId')
      removeToken()
      this.userInfo.account = ''
      this.loginInfo.textCode = ''
      this.isLogin = false
      LogOut().then(res => {
        console.log('LogOut', res);
      })
    },


    /**
     * 通过加工商id查看名下的机器
     * @param {加工商id} id 
     */
    getMachineList(id) {
      this.$toast.loading('加载中')
      getDeviceList({supplierId: id}).then(res => {
        this.$toast.clear()
        if (res.code !== '000000') this.$toast(res.message | '获取数据失败。')
        if (!res.data || res.data.length === 0) {
          this.hasMachine = true
          return this.$toast('请在包秘书中添加机器信息。')
        } 
        this.hasMachine = false
        this.machineList = res.data
      }, err => {
        this.$toast(err.message | '获取数据失败。')
        
      })
    },
    /**
     * 选择上班机器
     * @param {*} item 
     */
    selectItem(item) {
      if (item.chooseType == 1) return  // 表示机器未下班或出错，不允许选中
      this.machineSelected = item.id
      this.supplierId = item.supplierId
      this.attributeId = item.attributeId
      this.currentDeviceName = item.deviceName
      
    },
    /**
     * 选中机器之后，点击确定按钮
     */
    machineConfirm() {
      console.log(this.machineSelected)
      //选择机器的时候需要确认一下当前工艺模型是否存在页面功能
      //现在支持2，4，10
      const attributeIdArr = [2,4,5,6,10,48,64]
      if(attributeIdArr.indexOf(this.attributeId) == -1) return this.$toast('该工序暂时无法使用机长看板。')
      this.$store.dispatch('STORE_CURRENT_DEVICE_INFO', this.machineSelected)
      this.$store.dispatch('STORE_CURRENT_SUPPLIERID_INFO', this.supplierId)
      this.$store.dispatch('store_attributeId_info', this.attributeId)
      this.$store.dispatch('STORE_CURRENT_DEVICE_NAME_INFO',this.currentDeviceName)
      this.$router.push(`/Punchin`)
    },
  }
}
</script>

<style scoped lang="scss">
.home {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  /deep/ .login-page {
    width: 100%;
    height: 100%;
    text-align: center;

    .van-cell-group {
      margin: 0 auto;
      width: 400px;

      .van-cell {
        border: 1px solid #000;
        margin-top: 20px;
        border-radius: 20px;

        .van-icon {
          font-size: 20px;
        }
      }

      //label
      .van-cell__title {
        font-size: 20px;
        width: 100px;
        text-align: center;
      }

      //输入框
      .van-cell__value {
        font-size: 20px;
      }
    }

    .login-form {
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;

      input {
        background: #F2F3F7;
        border-radius: 50px;
        border: none;
        padding-left: 100px;
        box-sizing: border-box;
        font-size: 30px;
      }

      .login-phone {
        position: relative;

        .van-icon-manager {
          position: absolute;
          left: 5%;
          top: 26%;
          transform: translate(0, -50%);
          font-size: 35px;
          color: gray;
        }

        .phone-input {
          width: 700px;
          height: 100px;
          margin-bottom: 80px;
        }
      }

      .login-code {
        position: relative;
        display: flex;
        align-items: center;
        vertical-align: center;

        input {
          width: 465px;
          height: 100px;
          margin-right: 25px;
        }

        button {
          border: none;
          background: #3D7EFF;
          color: white;
          border-radius: 50px;
          font-size: 30px;
          width: 210px;
          height: 100px
        }

        button[disabled] {
          background: gray;
        }

        .van-icon-lock {
          position: absolute;
          left: 5%;
          top: 49%;
          transform: translate(0, -50%);
          font-size: 35px;
          color: gray;
        }
      }
    }

    .login-button {
      border-radius: 50px;
      font-size: 50px;
      border: none;
      color: white;
      background: #3D7EFF;
      margin-top: 160px;
      width: 680px;
      height: 100px;
    }

    .van-button--disabled.login-button {
      color: #8C8C8C;
      background: #DCDFE6;
    }

    //.login-button.active {
    //  background: #3D7EFF;
    //  color: white;
    //}

    .login-title {
      display: inline-block;
      font-size: 80px;
      font-weight: bolder;
      background: linear-gradient(to right, #AA3DFF, #7B3DFF, #3D7EFF);
      -webkit-background-clip: text;
      color: transparent;
      margin-top: 150px;
    }
  }

  /deep/ .select-page {
    width: 100%;
    height: 100%;
    text-align: center;
    position: relative;
    border: 1px solid transparent;

    .logOut {
      position: absolute;
      left: 50px;
      top: 20px;
      padding-left:40px;
      >img{
        position: absolute;
        width:40px;
        height: 40px;
        left:0;
        top:50%;
        transform: translateY(-50%);
      }
      button {
        font-size: 40px;
        font-weight: 550;
        border: none;
        background: white;
      }
    }

    .select-title {
      font-size: 60px;
      color: #3D7EFF;
      margin-top: 100px;
      margin-bottom: 50px;
    }

    .machines {
      box-sizing: border-box;
      height: 570px;
      overflow-y: scroll;
      display: flex;
      flex-direction: column;
      align-items: center;

      .machine-item {
        width: 700px;
        height: 110px;
        text-align: left;
        font-size: 30px;
        border-radius: 20px;
        background: #F6F6FE;
        margin-bottom: 60px;
        padding-left: 35px;
        padding:20px 0 20px 35px;
        position: relative;
        .machine-item-name {
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          word-break: break-all;
          margin-left: 40px;
          font-size: 40px;
          color: #262626;
          position: absolute;
          top:50%;
          transform: translateY(-50%);
          left: 180px;
          
        }

        img {
          width: 110px
        }
      }

      .active {
        border: 4px solid #3D7EFF;
      }

      .disable {
        border: none;
        opacity: 0.5;
      }
    }

    .select-button {
      font-size: 50px;
      background: #3D7EFF;
      -webkit-border-radius: 50px;
      -moz-border-radius: 50px;
      border-radius: 50px;
      border: none;
      color: white;
      margin-top: 50px;
      width: 680px;
      height: 100px;
    }

    .no-machine {
      margin: 100px auto 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 50px;

      img {
        width: 800px;
      }
    }
  }
}
</style>
