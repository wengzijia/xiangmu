<template>
  <div class="produce-main">
    <div class="main-header">
      <router-link to="/orderInfo">
        <div class="main-link" >
          <svg  viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" class="kanban-icon">
            <g id="Frame">
              <path id="Vector" d="M30.2087 33.3337H19.792V42.7087H30.2087V33.3337Z"  stroke-width="4.16667" stroke-linecap="round" stroke-linejoin="round"/>
              <path id="Vector_2" d="M42.708 8.33374H7.29134C6.14075 8.33374 5.20801 9.26648 5.20801 10.4171V31.2504C5.20801 32.401 6.14075 33.3337 7.29134 33.3337H42.708C43.8586 33.3337 44.7913 32.401 44.7913 31.2504V10.4171C44.7913 9.26648 43.8586 8.33374 42.708 8.33374Z"  stroke-width="4.16667"/>
              <path id="Vector_3" d="M22.917 28.125H27.0837"  stroke-width="4.16667" stroke-linecap="round" stroke-linejoin="round"/>
              <path id="Vector_4" d="M14.583 42.7087H35.4163"  stroke-width="4.16667" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
          </svg>
          当前订单
        </div>
      </router-link>
      <router-link to="/orderList">
        <div class="main-link" >
          <svg  viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" class="list-icon">
            <g id="list">
              <path id="Vector" d="M9.37467 43.7498C11.6758 43.7498 13.5413 41.8843 13.5413 39.5832C13.5413 37.282 11.6758 35.4165 9.37467 35.4165C7.07349 35.4165 5.20801 37.282 5.20801 39.5832C5.20801 41.8843 7.07349 43.7498 9.37467 43.7498Z" />
              <path id="Vector_2" d="M9.37467 14.5833C11.6758 14.5833 13.5413 12.7179 13.5413 10.4167C13.5413 8.11548 11.6758 6.25 9.37467 6.25C7.07349 6.25 5.20801 8.11548 5.20801 10.4167C5.20801 12.7179 7.07349 14.5833 9.37467 14.5833Z" />
              <path id="Vector_3" d="M9.37467 29.1668C11.6758 29.1668 13.5413 27.3014 13.5413 25.0002C13.5413 22.6989 11.6758 20.8335 9.37467 20.8335C7.07349 20.8335 5.20801 22.6989 5.20801 25.0002C5.20801 27.3014 7.07349 29.1668 9.37467 29.1668Z" />
              <path id="Vector_4" d="M21.875 25H44.7917"  stroke-width="4.16667" stroke-linecap="round" stroke-linejoin="round"/>
              <path id="Vector_5" d="M21.875 39.5835H44.7917"  stroke-width="4.16667" stroke-linecap="round" stroke-linejoin="round"/>
              <path id="Vector_6" d="M21.875 10.4165H44.7917"  stroke-width="4.16667" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
          </svg>
          生产列表
        </div>
      </router-link>
      <div class="capitan">
        <div class="capitan-name"><span>{{ currentDeviceName }}</span><span>{{ operatorName }}</span></div> 
        <button @click="punchOut()">下班</button>
      </div>

      <van-overlay :show="confirmPunchOutShow" @click="confirmPunchOutShow = false" class="confirm-punchout-show">
        <div class="wrapper"  @click="confirmPunchOutShow = false">
          <div class="block">
            <div>{{hint.title}}</div>
            <div v-if="hint.type!=1" class="buttonStyle">
              <button @click="punchOutConfirm">确认下班</button>
              <button @click="confirmPunchOutShow = false">取消</button>
            </div>
            <div v-else class="buttonStyle">
              <button @click="confirmPunchOutShow = false">关闭</button>
            </div>
          </div>
        </div>
      </van-overlay>
      
      <div class="full-screen" @click="enlargeScreen">
        <img :src="fullscreenImg" alt="">
      </div>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
import {punchConfirm} from "@/api/punchin";
import {checkProducingOrder} from "@/api/producemain";
import {getProduceInlineList} from "@/api/producelist";
import {getToken} from '@/utils/auth.js'
import {getTodayTime,compareTime,isTodayOrder} from '@/utils/utils.js'

export default {
  name: "dieCutting",
  data(){
    return{
      operatorName:this.$store.state.device.deviceOperatorName,
      currentDeviceName:this.$store.state.device.currentDeviceName,
      confirmPunchOutShow:false,//模态框是否开启
      isScreen:false,
      hint:{
        title:'当前有正在生产的订单，暂时不可以下班。',
        type:1
      },
      fullscreenImg:require('../static/images/fullscreen.png'),
      
    }
  },
  beforeRouteLeave (to, from, next) {
    console.log('to---',to)
    console.log('from--',from)
    if(this.$store.state.device.deviceProducingStatus==1&&getToken()){
      if(to.name=='PunchIn'|| to.name=='Login') {
        next(false)
        return this.$toast('当前有设备未下班，不允许回退。')
      }
    }
    next()
  },

  methods:{
    /**
     * 点击切换全屏
     */
    enlargeScreen(){
      document.body.requestFullscreen()
    //  this.isScreen = !this.isScreen
    //  this.isScreen ?  document.body.requestFullscreen() : document.exitFullscreen();
    },
    /**
     * 点击下班按钮
     */
    punchOut(){
      const {currentDeviceId,attributeId } = this.$store.state.device
      const paramse = {attId: attributeId,deviceId: currentDeviceId}
      	// ○ 若当前有正在生产的订单，机长点击 “下班” 之后，会跳出 “当前有正在生产的订单，暂时不可以下班。” 提示弹窗。但是机长点击“暂停生产”之后，可以下班。
        // ○ 如果当前订单为今日订单，则会跳出 “今日订单未全部完成，确认是否强制下班” 提示弹窗。
        // ○ 如果当前订单为明日订单则正常下班，页面返回到开始上班界面。
        // ○ 若订单列表中含有急单，机长点击 “下班” 之后，会跳出 “订单中含有急单，确认是否强制下班” 提示弹窗。
        // ○ 若当前订单是急单，机长点击 “下班” 之后，会跳出 “订单中含有急单，确认是否强制下班” 提示弹窗。
      // console.log(getTodayTime(true))
    
      this.$toast.loading('加载中')
      checkProducingOrder(currentDeviceId).then(res=>{//通过deviceId获取当前订单数据
        this.$toast.clear()
        if(res.code !== '000000') return this.punchOutConfirm() //如果点击下班的时候，通过deviceId获取当前订单数据失败，直接去进行下班
        if(!res.data || res.data=='null' || res.data==null) return this.getTodayList(paramse)
        let title = null
        //订单正在生产中，需要提示用户停止订单之后才能下班
        if(!title&&res.data.productStatus  === '2') title = '当前有正在生产的订单，暂时不可以下班。'
        //当前订单是急单，需要提醒用户
        if(!title&&res.data.urgentFlag  === 'Y') title = '订单中含有急单，确认是否强制下班？'
        //通过时间判断，当前订单日期是否大于今天9点，如果大于就属于明日订单，小于就属于今日订单--覆膜工序
        // if(attributeId==2&&!title&&res.data.nearFinishTime&&compareTime(res.data.nearFinishTime,getTodayTime()))title = '今日订单未全部完成，确认是否强制下班？'

        //通过判断交货日期判断，交货日期减去当前时间，是否小于一天时间，如果小于就属于今日订单，不小于就属于明日订单--除开覆膜工序
        // if(attributeId!=2&&!title&&res.data.deliveryDate&&compareTime(res.data.deliveryDate,getTodayTime(true),1))title = '今日订单未全部完成，确认是否强制下班？'
        if(!title&&isTodayOrder(attributeId,res.data))title = '今日订单未全部完成，确认是否强制下班？'
        
        
        if(!title)  return this.getTodayList(paramse) //判断待生产列表中是否有今日订单未完成

        this.hint.title = title
        this.hint.type = res.data.productStatus  === '2' ? 1 : 0
        return this.confirmPunchOutShow = true
        //判断今日订单列表中是否有急单
        
      },err=>{
        this.$toast(err.message|| '接口异常。')
      })
    },

    /**
     * 点击确定下班按钮
     */
    punchOutConfirm(){
      const {deviceOperatorId,currentDeviceId} = this.$store.state.device
      const params = { deviceOperatorId,deviceId:currentDeviceId,punchType:1 }
      this.$toast.loading('加载中')
      punchConfirm(params).then(res => {
        this.$toast.clear()
        if(res.code !== '000000') return this.$toast(res.message|| '下班接口异常。')
        setTimeout(() => {
          this.$toast.success('下班成功')
        }, 10);
        this.$store.dispatch('STORE_PRODUCING_STATUS',0)//下班成功
        this.$router.push(`/PunchIn`)
      }, err => {
        this.$toast(err.err || '下班接口异常。')
      })
    },
    /**
     * 获取今日订单列表
     * @param {*} paramse 
     */
    getTodayList(paramse){
      this.$toast.loading('加载中')
      getProduceInlineList(paramse).then(res=>{
          this.$toast.clear()
          if(res.code !== '000000') return  this.$toast(res.message|| '接口异常。')
          if(res.data&&res.data.todayProductList&&res.data.todayProductList.length>0){
            const flag = res.data.todayProductList.some(item=>{
              return item.urgentFlag === 'Y'
            })
            this.hint={ title:flag ? '订单中含有急单，确认是否强制下班？' : '今日订单未全部完成，确认是否强制下班？',type:0}
            return this.confirmPunchOutShow = true
          }
          this.punchOutConfirm()
      },err=>{
        this.$toast(err.message|| '接口异常。')
      })
    },

   
  }
}
</script>

<style scoped lang="scss">
.produce-main{
  width: 100vw;
  min-height: 100vh;
  background: #F4F5FC;
  .main-header{
    background: #FFFFFF;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    height: 100px;
    padding-left: 100px;
    margin-bottom: 40px;
    .main-link{
      background: #F2F3F7;
      text-align: center;
      color: #595959;
      font-size: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 100px;
      width: 500px;
      .kanban-icon{
        margin-right: 10px;
        stroke: #595959;
        width: 50px;
        height: 50px;
      }
      .list-icon{
        margin-right: 10px;
        stroke:#595959;
        fill: #595959;
        width: 50px;
        height: 50px;
      }
    }
    .router-link-active{
      .main-link{
        background: #3D7EFF;
        color: white;
        .kanban-icon{
          stroke: white;
        }
        .list-icon{
          stroke: white;
          fill: white;
        }
      }
    }
    .capitan{
      flex: 1;
      display: flex;
      // margin-left: auto;
      font-size: 35px;
      align-items: center;
      color: #262626;
      .capitan-name{
        text-align: right;
        // width: 350px;
        flex: 1;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        word-break: break-all;
        >span:first-child{
          margin-right: 25px;
        }
      }
      button{
        width: 210px;
        height: 80px;
        border-radius: 8px;
        border: none;
        font-size: 30px;
        color: white;
        background: #3D7EFF;
        margin-right: 30px;
        margin-left: 26px;
      }
    }

    .confirm-punchout-show{
      .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      }

      .block {
        width: 900px;
        height: 500px;
        border-radius: 30px;
        background-color: #fff;
       
        
       
        position: relative;
        padding-top: 100px;
        box-sizing: border-box;
        div{
          font-size: 40px;
          font-family: Source Han Sans CN-Medium, Source Han Sans CN;
          font-weight: 600;
          color: #262626;
          text-align: center;
          padding:20px;
          &:nth-child(2){
           
            button{
              width: 280px;
              height: 110px;
              
              border-radius: 10px 10px 10px 10px;
              font-weight: 500;
              border: none;
              &:nth-child(1){
                color: white;
                background: #3D7EFF;
                margin-right: 50px;
              }
              &:nth-child(2){
                color: #3D7EFF;
                background: white;
                border: 2px solid #3D7EFF;
              }
            }
          }
        }
        .buttonStyle{
          position: absolute;
          left:50%;
          bottom: 80px;
          transform: translateX(-50%);
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;

        }
      }
    }
  }
  .full-screen{
    position: absolute;
    left: 0;
    top: 0;
    width: 100px;
    img{
      width: 100%;
    }
  }
}
</style>

