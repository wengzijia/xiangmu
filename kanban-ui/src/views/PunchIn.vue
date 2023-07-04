<template>
  <div class="punch-in">
    <div v-if="hasPerson" class="punch-in-wrapper" >
      <div class="person-list" >
        <div class="person" v-for="(item,index) in persons" :key="index">
          <img :src="item.operatorUrl" alt="">
          <div class="person-name">{{ item.operatorName }}</div>
          <button @click="punchIn(item)">开始上班</button>
        </div>
      </div>
    </div>
    
    <div v-else class="no-machine">
      <img :src="frameImg" alt="">
      <div>暂无其他机长，请前往包秘书进行设置</div>
    </div>

    <van-overlay :show="show" @click="show = false;punchInfo.password='';" class="layer">
      <div class="wrapper" @click.stop>
          <div class="pwd">
            <div>请输入打卡密码</div>
            <input ref="pwd" placeholder="请输入打卡密码" v-model="punchInfo.password" @input="formatPWD()">
          </div>
          <div class="operation" >
            <button @click="show = false;punchInfo.password='';" >取消</button>
            <button @click="checkPwd()">确定</button>
          </div>
        <span @click="show = false;punchInfo.password='';" class="layer-close"><van-icon name="cross" /></span>
        </div>
    </van-overlay>

    <div class="return" @click="$router.push(`/Login`)">
      <img :src="leftImg" alt="" />
      <button> 设备列表</button>
    </div>
    
  </div>
</template>

<script>
import {getDeviceOperatorsList,punchConfirm} from '@/api/punchin.js'
import {getToken} from "@/utils/auth";
export default {
  name: "PunchIn",
  data() {
    return {
      hasPerson:false,
      deviceId:0,
      supplierId:null,//加工商id
      attributeId:null,//当前设备工序id
      persons: [],
      show: false,
      selectedId: -1,
      defaultHead:require('../static/images/head.png'),
      leftImg:require('../static/images/returnLeft.png'),
      frameImg:require('../static/images/noData.png'),
      punchInfo:{
        name:'',
        password:'',
        punchId:0,
      }
    }
  },
  created(){
    const {attributeId,deviceProducingStatus} = this.$store.state.device
    if(deviceProducingStatus==1&&getToken()) return this.$router.push(`/dieCutting`)
  },
  beforeRouteLeave (to, from, next) {
      console.log('to---',to)
      console.log('from--',from)
      if(this.$store.state.device.deviceProducingStatus==0){
      if(to.name !=='Login') {
          next(false)
          return this.$toast('当前设备已经下班，不允许回退，请点击上班后进入看板页面。')
      }
      }
      next()
  },
  mounted() {
    this.enlargeScreen()
    const {currentDeviceId,supplierId,attributeId} = this.$store.state.device
    this.deviceId = currentDeviceId
    this.supplierId = supplierId
    this.attributeId = attributeId
    this.getOperatorsList();
  },
  methods: {
    /**
     * 开启全屏
     */
    enlargeScreen() {
      if(document.body&&document.body.requestFullscreen)document.body.requestFullscreen()
    },
    /**
     * 输入打卡密码，过滤不符合规定的值
     */
    formatPWD(){
      this.punchInfo.password = this.punchInfo.password.replace(/[^\w\.\/]/ig,'')
    },
    /**
     * 通过加工商id获取当前加工商名下所有的机器
     */
    getOperatorsList(){
      this.$toast.loading('加载中')
      getDeviceOperatorsList(this.supplierId).then(res => {
        this.$toast.clear()
        if(res.code !== '000000') return  this.$toast(res.message || '服务异常。')
        if (!res.data || res.data.length === 0){
          this.hasPerson = false
          return this.$toast('请在包秘书添加机长信息')
        }
        this.hasPerson = true
        let personsData = res.data
        for(let item of personsData){
          item.operatorUrl = !!item.operatorUrl ? 'http://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/' + item.operatorUrl :  this.defaultHead
        }
        this.persons = personsData

      }, err => {
        this.$toast(err.message || '服务异常。')
      })
    },
    /**
     * 点击开始上班按钮
     * @param {当前设备数据} val 
     */
    punchIn(val) {
      const {id,operatorName} = val
      this.show = true
      this.$refs.pwd.value = ''
      this.selectedId = id
      this.punchInfo.punchId = id
      this.punchInfo.name = operatorName
      
    },
    /**
     * 上班打卡，输入密码点击确定上班
     */
    checkPwd(){
     const {password,punchId,name} = this.punchInfo
      if(!!!password) return this.$toast.fail('请输入密码')
      let params = {
        deviceOperatorId: punchId,
        operatorPassword: password,
        deviceId:this.$store.state.device.currentDeviceId,
        punchType: 0
      }
      this.$toast.loading('加载中')
      punchConfirm(params).then(res => {
        this.$toast.clear()
        if(res.code === '990003'){
          this.$toast(res.message || '机器异常');
          return this.$router.push('/login')
        } 
        if(res.code !== '000000') return  this.$toast(res.message || '获取数据失败。');
        this.$store.dispatch('STORE_DEVICE_OPERATOR_INFO',punchId)//员工id存储起来
        this.$store.dispatch('STORE_DEVICE_OPERATOR_NAME_INFO',name)
        this.$store.dispatch('STORE_PRODUCING_STATUS',1)//上班成功，添加一个已经上班的状态值

        return this.$router.push(`/dieCutting`) 
         
      }, err => {
        this.$toast(err.message || '服务异常。')
      })
    }
  }
}
</script>

<style scoped lang="scss">
.punch-in {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .no-machine{
    margin: 50px auto 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 50px;
    img{
      width: 800px;
    }
  }
  .punch-in-wrapper{
    margin: 300px auto 0;
    height: 800px;
    width: 80%;
    overflow-x: scroll;
    position: relative;
    .person-list {
      min-width: 1800px;
      position: absolute;
      left: 0;
      display: flex;
      justify-content: space-around;
      text-align: center;
      .person {
        width: 500px;
        height: 650px;
        padding-top: 50px;
        -webkit-border-radius: 20px;
        -moz-border-radius: 20px;
        border-radius: 20px;
        background: #F2F3F7;
        margin-right: 50px;
        flex-shrink: 0;
        box-sizing: border-box;
        img {
          width: 246px;height: 246px;
          border-radius: 50%;
        }

        .person-name {
          font-size: 45px;
          color: #262626;
          margin: 30px auto 0;
          text-align: center;
          width: 350px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
          word-break: break-all;
        }

        button {
          width: 260px;
          height: 80px;
          background: #3D7EFF;
          color: white;
          font-size: 40px;
          border: none;
          border-radius: 10px;
          margin-top: 100px;
        }
      }
    }

  }
  .layer {
    display: flex;
    align-items: center;
    justify-content: center;
    .wrapper {
      position: relative;
      background: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 20px;
      //justify-content: center;
      width: 1300px;
      height: 800px;
      .pwd{
        width: 832px;
        font-size: 40px;
        margin-top: 170px;
        font-weight: 550;
        color: #262626;
        input{
          width: 832px;
          height: 100px;
          font-size: 35px;
          background: #F2F3F7;
          border: none;
          border-radius: 50px;
          padding-left: 100px;
          box-sizing: border-box;
          margin-top: 50px;
          font-weight: 500;
        }
      }
      .operation{
        width: 800px;
        display: flex;
        justify-content: space-between;
        margin-top: 170px;
        button{
          width: 280px;height: 80px;
          border-radius: 10px;
          font-size: 40px;
          border: 2px solid #8C8C8C;
          background: #FFFFFF;
          color: #8C8C8C;
          &:nth-child(2){
            color: #FFFFFF;
            background: #3D7EFF;
            border: none;
          }
        }
      }
      .layer-close{
        position: absolute;
        top: 0;
        right: 0;
        width: 100px;
        line-height: 100px;
        text-align: center;
        font-size: 50px;
        color: #8C8C8C;
      }
    }
  }
  .return{
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
    button{
    
      font-size: 40px;
      font-weight: 550;
      border: none;
      background: white;
    }
  }
}
</style>
