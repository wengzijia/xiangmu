<template>
  <div class="produce-detail">
    <div class="detail-content">
      <!-- 生产规格数据 -->
      <header-left :curOrderInfo="curOrderInfo"  @setOpenError="errorCheckShow=true"  />
      <!-- 右部备注模块数据 -->
      <header-right :remarkInfos="remarkInfos" />
    </div>

    <!-- 底部按钮模块 -->
    <div class="header-bottom">
      <div class="btn1">
        <van-button @click="errorReportShow = true;groupSn_old=curOrderInfo.mainId" :disabled="!!!curOrderInfo.groupSn">异常报备</van-button>
      </div>
      <div class="btn2">
        <button v-if="curOrderInfo.productStatus==2" style="background-color: #52C41A" @click="openFinishTask()">完成生产</button>  
        <van-button v-else @click="startProduce()" :disabled="!!!curOrderInfo.groupSn">开始生产</van-button>
      </div>
      <div class="btn3">
        <button v-if="curOrderInfo.productStatus==2" style="background-color: #FFFFFF;border: 2px solid #3D7EFF;color: #3D7EFF;" @click="switchStatus({optionType:3})">暂停生产</button>
        <van-button v-else @click="jumpOrderHandle()" :disabled="!!!nextOrderInfo.groupSn || isJumpFlag">跳过此单</van-button> 
      </div>
    
      <div class="btn4" v-if="pdfTitle" @click="pdfJump">
        <button>{{pdfTitle}}</button>
        <img :src="pdfImg" alt="">
      </div>
      
    </div>

    <!-- 下一订单模块 -->
    <next-order v-if="nextOrderShow" :nextOrderInfo="nextOrderInfo"  />
    
    <!-- 完成生产 弹出框输入下机数量和校版纸数 -->
    <finish-task v-if="finishShow"  @setFinishTask="getFinishTaskNum"   />

    <!-- 异常报备 弹出框 -->
   <error-report v-if="errorReportShow"  :curOrderInfo="curOrderInfo" @setFinishTaskType="getFinishTaskType" />

    <!-- 查看异常 弹出框- -->
    <error-check v-if="errorCheckShow" :curOrderInfo="curOrderInfo"  @setOpen="openRrrorCheck" />

     <!-- 跳过此单 弹出框- -->
    <jump-order  v-if="changeMachineShow" :curOrderInfo="curOrderInfo" @setJumpOrder="getJumpOrder" />

    <!-- 暂无数据 弹出框 -->
    <no-data v-if=" hasOrderShow && (attributeId != 10&& attributeId != 5)" @setNoData="getNoData"  />


    <!-- 查看流程操作规程模块 -->
    <van-overlay :show="pdfShow" @click="closepdf()" class="pdf-layer" :lock-scroll="false">
      <div class="wrapper" style="display: flex;align-items: center;justify-content: center;height: 100%;">
        <div class="pdf-wrapper" @click.stop>
          <pdf :closepdf="closepdf" ref="pdf"></pdf>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import {getProduceMainDetail,switchProductStatus,checkProducingOrder,getValidBeiRelatedStatus} from '@/api/producemain.js'
import {getProduceInlineList} from "@/api/producelist";
import {getToken} from "@/utils/auth";
import {disposeImgs, getcraftTypes,compareTime , getTodayTime,connectWebSocket,isTodayOrder} from "@/utils/utils";
import {getPDFTitle} from "@/utils/listTitle";
import headerLeft from '@/components/orderInfo/headerLeft'
import headerRight from '@/components/orderInfo/headerRight'
import nextOrder from '@/components/orderInfo/nextOrder'
import finishTask from '@/components/orderInfo/finishTask'
import errorReport from '@/components/orderInfo/errorReport'
import errorCheck from '@/components/orderInfo/errorCheck'
import jumpOrder from '@/components/orderInfo/jumpOrder'
import noData from '@/components/orderInfo/noData'
import pdf from '@/components/pdf.vue'

export default {
  name: "orderInfo",
  components: {headerLeft, headerRight, nextOrder, finishTask, errorReport, errorCheck, jumpOrder, noData, pdf},
  data() {
    return {
      changeMachineShow: false,//跳过此单模态框是否开启 
      errorCheckShow: false,//查看异常模态框是否开启
      hasOrderShow: false,//当前订单页面无数据，且待生产列表也无数据，弹出暂无数据提示框
      errorReportShow: false,//异常报备模态框是否开启
      remarkShow: false,//查看备注模态框是否开启
      finishShow: false,//完成生产模态框是否开启
      pdfShow: false,//查看工艺流程pdf模态框是否开启
      groupSn_old:null,//在点击打开上面这些模态框时，需要将当前mainId存起来，以防止打开后，如果有回调过来，当前数据发生改变应该关闭，如果当前数据没有发生改变，依旧保持原样
      isOpenRrrorCheck:true,//是否需要查看异常模态框
      nextOrderShow:false,
      nextOrderInfo:{},//下一订单存放值
      curOrderInfo:{},//当前订单对象
      remarkInfos:null,//备注数据
      pdfImg: require('../../static/images/pdf.png'),
      noDataFlag:0,//暂无数据的提示框是否弹出过一次
      router_mainId:null,//其他列表页面进入当前页面携带的mainId
      isJumpFlag:true,//是否禁用跳单按钮
      ProduceData:[],//存放待生产列表数据

      repetitionNum:5,//webScoket连接重复次数
      isLeaveFlag:false,//是否已经离开当前页面
      stompClient:null,//webSocket赋值
      timer:null,//定时器容器
      pdfTitle:null,

      currentDeviceId:null,
      attributeId:null,
      // keyName:null,//当是贴窗工艺时，需要比较的值需要发生改变

      
    }
  },
  watch: {
    'nextOrderInfo': function() {
      
        this.nextOrderShow = false
        setTimeout(() => {
          this.nextOrderShow = true
        }, 100);
    },
  },
  created() {
    clearInterval(this.timer)
    this.timer = null
    this.stompClient?this.stompClient.close() : ''
    if(!getToken()) return  this.$router.replace('/login')
   
    console.log('进入当前订单页面传入的参数---',this.$route.query)
    const {currentDeviceId,attributeId} = this.$store.state.device
    this.pdfTitle = getPDFTitle()
    this.currentDeviceId = currentDeviceId //获取设备id（deviceId）
    this.attributeId = attributeId
    //如果携带mainId表示是从其他列表页面进入
    //如果有mainId进入需要先通过mainId查询数据，然后主动进行开始生产按钮判断
    this.router_mainId = this.$route.query.mainId ||  null //'376'
    this.getPageInfo()
    this.setWebSocket() //开启webSocket

  
    
  },
  beforeRouteLeave (to, from, next) {//判断是否已经离开当前页面
    this.isLeaveFlag = true //如果已经离开，不允许进行webSocket链接，停止定时器的调用
    clearInterval(this.timer)
    this.timer = null
    this.stompClient?this.stompClient.close() : ''
    next()
  },
  methods: {
     /**
     * 通过deviceId获取当前订单数据
     * 从其他页面进入当前订单页面，且携带mainId进入，需要使用mainId去获取当前订单页面数据
     * flag:--是否要弹出正在加载中的模态框 ---webSockte以及主动去调取的时候不提示正在加载中的模态框
     */

    getPageInfo(flag) {
      if(!flag)this.$toast.loading('加载中')
      this.hasOrderShow = false
      this.curOrderInfo = {}
      this.nextOrderInfo = {}
      this.nextOrderShow = true
      this.remarkInfos = null
      if(this.router_mainId) return this.getMainData(flag)
      this.getDeviceIdInfo(flag)
    },
   
    /**
     * 通过设备id(deviceId)获取当前订单数据
     * flag:--是否要弹出正在加载中的模态框 ---webSockte以及主动去调取的时候不提示正在加载中的模态框
     */
    getDeviceIdInfo(flag){
      checkProducingOrder(this.currentDeviceId ).then(res => {
        this.$toast.clear()
        if (res.code !== '000000') return  this.$toast(res.message || '服务异常')
        if (res.data) this.disposeData(res.data)//如果有数据，将数据进行处理
        this.getProduceList(flag)
      }, err => {
        this.$toast(err.message || '服务失败。')
      })
    },
     /**
     * 当通过mainId获取数据
     * 有两种情况：1--其他页面跳转进入当前页面携带mainId，通过mainId去查询当前页面数据
     * 有两种情况：2--通过设备id(deviceId)没有获取到数据时，通过生产列表第一条的mainId去查询当前页面数据
     */
    getMainData(flag,orderList) {
      const mainId = this.router_mainId ||  orderList[0].mainId
      if(!flag)this.$toast.loading('加载中...')
      getProduceMainDetail(mainId).then(res => {
          if (res.code !== '000000') return this.$toast(res.message || '网络错误请重试')
          this.$toast.clear()
          //如果用mainId查出来得数据和当前设备id不一致需要重新去查询
          if(res.data && res.data.deviceId != this.currentDeviceId && this.router_mainId) {
            this.router_mainId = null//将其置空后重新去获取数据
            return this.getPageInfo()
          }
          this.disposeData(res.data)
          //如果携带router_mainId，表示其他页面进入当前页面，且需要自动开启当前订单页面
          if(this.router_mainId){
             this.getProduceList(flag,true)//需要确定下一订单是否有数据
             return this.startProduce() //开始生产判断是否有异常需要查看--
          }
           this.isJumpFunc()
          //通过deviceId拿不到当前页面数据，然后通过待排产列表第一个数组的mainId获取当前订单数据，获取成功，则数组第二条数据就是下一订单数据
          if(orderList.length>1)return  this.disposeNextInfo(orderList[1]) 
          this.nextOrderInfo = {} //如果列表没有两条数据，下一订单置空

      }, err => {
        this.$toast(err.message || '网络错误请重试')
      })
    },
    
  
    /**
     * 获取待生产列表数据
     * flag:表示是否展示真正加载中
     * isGetData：true:不需要通过第一条数据得mainId去获取当前订单数据,false：需要
     */
    getProduceList(flag,isGetData) {
      const {attributeId,currentDeviceId} = this.$store.state.device
      let params = {attId:attributeId ,deviceId:currentDeviceId} 
      if(!flag) this.$toast.loading('加载中')
      getProduceInlineList(params).then(res => {//先判断是否有今日订单和明日订单
          this.$toast.clear()
          if(res.code !== '000000') return this.$toast.fail(res.message || '获取数据失败')
          const {todayProductList,tomorrowProductList} = res.data || {}
          let newOrder = []
          let totalList = []
          if(todayProductList&&todayProductList.length>0){
            todayProductList.forEach((item,index)=>{
              //排除掉今日订单有强制排产的且未到该工序的数据
              if(item.forcedSchedulingFlag!=1) newOrder.push(item)
            })
            res.data.todayProductList = newOrder
            totalList = [...newOrder]
          }
          if(tomorrowProductList&&tomorrowProductList.length>0){
            tomorrowProductList.forEach(item=>{
              totalList.push(item)
            })
          }
          this.ProduceData = res.data
          if(!totalList || totalList.length==0) {
            if(!this.curOrderInfo.groupSn){
              this.changeMachineShow =  false
              this.errorCheckShow = false
              this.errorReportShow= false
              this.remarkShow = false
              this.hasOrderShow = true //如果待生产列表无数据，当前订单也无数据，需要弹框提示没有数据
              this.$dialog.close()
            }  
            return this.isJumpFlag = true //将跳过此单按钮禁用
          } 
          this.isJumpFunc()
          //如果当前订单有数据，下一订单数据取数组第一条--此时的maniId不存在
          if(this.curOrderInfo.mainId) {
            if(totalList[0].mainId === this.curOrderInfo.mainId&&totalList.length>1)  return  this.disposeNextInfo(totalList[1]) 
            return  this.disposeNextInfo(totalList[0]) 
          }
           if(this.curOrderInfo.mainId&&this.router_mainId) return  this.disposeNextInfo(totalList[0]) 
          //如果没有数据，取数组第一条数据的mainId去获取数据
          if(!isGetData)this.getMainData(flag,totalList)

      }, err => {
        this.$toast.fail(err.message || '接口异常。')
      })
    },
   
    /**
     * 处理当前订单页面渲染数据
     * @param {*} data 
     */
    disposeData(data){
        data.imgArr = disposeImgs(data)
        if(data.poSns)data.poList = data.poSns.indexOf(',') != -1 ? data.poSns.split(',') : [data.poSns]
        if(data.lossInfos&&data.lossInfos.length>0){//处理查看异常模块数据
          data.lossInfos.forEach(item=>{
            if(item.photoPath1 )item.photoPath1 = item.photoPath1.indexOf(',') !== -1 ? item.photoPath1.split(',') : [item.photoPath1]
            item.machiningAttributeName =  getcraftTypes(item.machiningAttributeId)
          })
        }
        if(data.poSnDetail&&data.poSnDetail.length >0){
          const poList = data.poSnDetail
          poList.forEach(item=>{
            if(item.imageUrl )item.imageUrl = item.imageUrl.indexOf(',') !== -1 ? item.imageUrl.split(',') : [item.imageUrl]
          })
           data.poSnDetail = poList
        }
        if(data.deadline) data.deadtime = data.deadline.substring(5, 16)
        if(data.deliveryDate)data.deliveryDateTime = data.deliveryDate.substring(5, 10)
        if(data.subclassTypeName)data.subclassTypeName = data.subclassTypeName.replace(/,/g,'/')
        data.paperSize = data.paperLength&&data.paperWidth&&data.paperUnit ?  data.paperLength + '*' + data.paperWidth + data.paperUnit : '0*0mm'

        //如果是粘盒工艺，需要将粘口位放置到盒型后面
        if(this.attributeId==5){
          let arr =['异型盒','左边','右边']
          data.subclassTypeName += arr[data.stickyPosition]?'-'+arr[data.stickyPosition] :''
        }

        this.curOrderInfo = data
        this.disposeRemarkInfo(data)
      
        if(this.groupSn_old && this.groupSn_old != data.mainId) {//判断打开模态框存储的大版号和重新渲染数据的mainId是否一致，如果不一致需要关闭打开的模态框
            this.changeMachineShow =  false
            this.errorCheckShow = false
            this.errorReportShow= false
            this.remarkShow = false
            this.isOpenRrrorCheck = true 
            this.$dialog.close()
        }
       
    },
    /**
     * 处理下一订单数据图片数据的处理
     */
    disposeNextInfo(data){
      //需要处理一下，下一订单的大版号不允许和当前订单大版号一致---因为模切工序击凹、击凸，模切都是属于模切工序，而且大版号一致，所以需要判断他们的工序id是否一致，如果不一致就展示出来
      if(data.mainId === this.curOrderInfo.mainId&&data.attributeId === this.curOrderInfo.attributeId) return  this.nextOrderInfo = {}
      data.paperSize = data.paperLength&&data.paperWidth&&data.paperUnit ?  data.paperLength + '*' + data.paperWidth + data.paperUnit : '0*0mm'
      data.imgArr = disposeImgs(data)
      if(data.deadline)data.deadTime = data.deadline.substring(5,16)
      let deliveryDateTime ='无'
      if(data.deliveryDate)deliveryDateTime = data.deliveryDate.substring(5, 10)
      data.deliveryDateTime = deliveryDateTime
      if(data.subclassTypeName)data.subclassTypeName = data.subclassTypeName.replace(/,/g,'/')
      if(this.attributeId==5){
          let arr =['异型盒','左边','右边']
          data.stickyPositionName = arr[data.stickyPosition]||'无'
        }
      this.nextOrderInfo = data
    },
    /**
     * 判断是否允许跳单
     */
    isJumpFunc(){ 
      //判断当前展示的数据，在待生产列表里面是否存在不一样的数据，如果存在就可以跳单，不存在就不允许跳单
    
      const {todayProductList,tomorrowProductList} =  this.ProduceData 
      //覆膜工序的今日订单和其他工序的今日订单定义不一样，所以需要区分
      const toDayOrder = isTodayOrder(this.attributeId,this.curOrderInfo)
      if(toDayOrder){//表示属于今日订单
          if(!todayProductList || todayProductList.length==0) {
            this.changeMachineShow = false//有可能存在一致的情况，如果跳过此单按钮禁用，也不允许开启
            return  this.isJumpFlag = true
          }
          //如果今日订单列表有数据，且其中的数据和当前展示数据不一致，就允许跳单
          const flag = todayProductList.some(item=>{
            return item.mainId != this.curOrderInfo.mainId
          })
           this.isJumpFlag = flag ? false : true
          if(this.isJumpFlag) this.changeMachineShow = false//有可能存在一致的情况，如果跳过此单按钮禁用，也不允许开启
          return
      }
      
      //说明是明日订单，跳单的时候需要判断今日订单是否有数据，如果今日订单有数据，就允许跳单
      if(todayProductList&&todayProductList.length>0) return  this.isJumpFlag = false

      // 如果今日订单无数据，就去明日订单列表找，如果也无数据，就不允许跳单
      if(!tomorrowProductList || tomorrowProductList.length==0) {
        this.changeMachineShow = false//有可能存在一致的情况，如果跳过此单按钮禁用，也不允许开启
        return  this.isJumpFlag = true
      }

      //如果明日订单列表有数据，且其中的数据和当前展示数据不一致，就允许跳单
      const flag = tomorrowProductList.some(item=>{
        return item.mainId != this.curOrderInfo.mainId
      })
      this.isJumpFlag = flag ? false : true
      if(this.isJumpFlag) this.changeMachineShow = false//有可能存在一致的情况，如果跳过此单按钮禁用，也不允许开启
    },
     /**
     * 处理 备注 数据信息
     */
    disposeRemarkInfo(data){
      if(!data || !data.remarkInfos) return this.remarkInfos = null
      const {productionPoRemarks,qualityPoRemarks,groupRemark,attentionRemark} = data.remarkInfos
      let  productionPoRemarksArr = []
      let qualityPoRemarksArr = []
      if(productionPoRemarks&&productionPoRemarks.length>0){
        productionPoRemarks.forEach(item=>{
            if(item.content) productionPoRemarksArr.push(item)
        })
      }
      if(qualityPoRemarks&&qualityPoRemarks.length>0){
        qualityPoRemarks.forEach(item=>{
            if(item.content) qualityPoRemarksArr.push(item)
        })
      }
      let remarkInfosData = {}
      remarkInfosData.productionPoRemarks = productionPoRemarksArr.length > 0 ? productionPoRemarksArr : null
      remarkInfosData.qualityPoRemarks = qualityPoRemarksArr.length > 0 ? qualityPoRemarksArr : null
      remarkInfosData.groupRemark =  groupRemark && groupRemark.content ? groupRemark : null
      remarkInfosData.attentionRemark = attentionRemark && attentionRemark.content ? attentionRemark : null
      if(!remarkInfosData.productionPoRemarks && !remarkInfosData.qualityPoRemarks && !remarkInfosData.groupRemark && !remarkInfosData.attentionRemark) return this.remarkInfos = null
      remarkInfosData.paperSize = data.paperSize
      remarkInfosData.groupSn = data.groupSn
       remarkInfosData.poSns = data.poSns
      remarkInfosData.otherCraftInfo = data.otherCraftInfo
      remarkInfosData.subclassTypeName = data.subclassTypeName
      this.remarkInfos = remarkInfosData
    },
    
    /**点击 开始生产 按钮  判断异常查看是否查看完成*/
    startProduce() {
      //如果有查看异常按钮且用户未查看异常，需要弹出查看异常框，查看完异常之后才允许开始生产
      if (this.curOrderInfo&&this.curOrderInfo.lossInfos&&this.curOrderInfo.lossInfos.length != 0 && this.isOpenRrrorCheck && this.curOrderInfo.productStatus != 2 ) return this.errorCheckShow = true
      this.switchStatus({optionType:1})//开启生产
    },
    /**
     * 点击 完成生产 按钮
     */
    openFinishTask(flag){
       //首先判断是不是啤工序，如果是的话需要检验有没有其他相关联的工艺未完成
       if(this.curOrderInfo.attributeId == 4&&!flag) return this.getValidBeiRelatedStatusFlag({optionType:2})
       this.finishShow = true
       this.groupSn_old = this.curOrderInfo.mainId
    },
   
     /**生产状态
     * @{optionType} number 1开始 2完成 3停止
     */
    switchStatus(val) {
      this.$toast.loading('加载中...')
      const {attributeId,productStatus} = this.curOrderInfo
      if(attributeId == 4 && val.optionType == 1 && (productStatus == 1 || productStatus == 4) ) return this.getValidBeiRelatedStatusFlag(val)
      this.setSwitchProductStatus(val)
    },
    /**
     * 啤点击开始生产的时候校验有没有其他未完成的相关工艺，前端给出提示框
     */
    getValidBeiRelatedStatusFlag(val){
      getValidBeiRelatedStatus({groupSn:this.curOrderInfo.groupSn,attId:this.curOrderInfo.attributeId}).then(res=>{
        this.$toast.clear()
        if(res.code !== '000000')  return this.$toast(res.message || '服务异常。')
        //如果返回的是false--就继续执行
        if(!res.data){
          //如果值是2，表示点击的是完成任务，需要将开始完成的模态框开启
          if(val.optionType == 2) return this.openFinishTask(true)
          return  this.setSwitchProductStatus(val)
        }
        if(val.optionType==2) return this.$toast('此订单击凸/击凹未完成，模切无法完成生产。') 
        this.$dialog.confirm({title: '提示',message: res.message || '有其他未完成的相关工艺,是否确定开始？',}).then(() => {
          this.setSwitchProductStatus(val)
        }).catch(() => {});
        
      }, err => {
        this.$toast(err.message || '服务异常。');
      })
    },

    /**
     * 通知后端，当前订单是--开始生产：1；停止生产：3；完成生产：2
     * @param {*} val 
     */
    setSwitchProductStatus(val){
      const { currentDeviceId,deviceOperatorId} = this.$store.state.device
      const {groupSn,mainId} = this.curOrderInfo
      let params = {
        deviceId: currentDeviceId,
        deviceOperatorId,
        groupNo: groupSn,
        mainId: mainId,
        onCount: val.onCount || null,
        lossCount: val.lossCount || null,
        optionType: val.optionType,
        onFinishImage:val.onFinishImage || null
      }
      this.$toast.loading('加载中...')
      switchProductStatus(params).then(res => {
        this.$toast.clear()
        if(this.router_mainId) this.router_mainId = null
        if(res.code ==='980003'||res.code ==='980002' || res.code === '980001') {
          if(this.$route.query.mainId)this.$router.replace({path:'/dieCutting'})
          this.getPageInfo() 
          return this.$toast.fail(res.message || '订单已外发。');
        }
        if (res.code !== '000000')   return this.$toast(res.message || '服务异常。')
        this.$toast.success('操作成功。')
        if(this.$route.query.mainId)this.$router.replace({path:'/dieCutting'})
        this.getPageInfo() 
      }, err => {
         this.$toast.fail(err.message || '服务异常。');

       
      })
    },
    /**
     * 没有数据模态框回调
     * @param {} val 
     */
    getNoData(val){
      console.log(val)
      this.hasOrderShow = false
    },
    /**
     * 完成任务组件传入的回调
     * @param {点击完成任务模态框出传入的值} val 
     */
    getFinishTaskNum(val){
      this.finishShow = false
      console.log(val)
      if(val)this.setSwitchProductStatus(val)
     
    },
    /**
     * 异常报备组件传入的回调
     * @param {是否继续生产} val 
     */
    getFinishTaskType(val){
      this.errorReportShow = false
      console.log(val)
      if(val) {//如果异常报备按钮成功，需要重新去渲染数据
        if(this.$route.query.mainId)this.$router.replace({path:'/dieCutting'})
        if(this.router_mainId) this.router_mainId = null
        this.getPageInfo()
      } 
    },
    
    /**
     * 
     * @param {查看异常模态框的回调} val 
     */
    openRrrorCheck(val){
        this.errorCheckShow = false
        console.log(val)
        if(!val)return 
        this.isOpenRrrorCheck = false
        this.switchStatus({optionType:1})//开启生产
    },
      /**
     * 开启跳过此单弹出框，可以选择跳过原因
     */
    jumpOrderHandle(){
      const urgentFlag = this.curOrderInfo.urgentFlag
      if(urgentFlag === 'Y') return this.$toast.fail('急单不可跳单。')
      this.groupSn_old = this.curOrderInfo.mainId
      this.changeMachineShow = true
    },
    /**
     * 
     * @param {跳过此单模态框回调} val 
     */
    getJumpOrder(val){
      this.changeMachineShow = false
      if(val) {
        if(this.$route.query.mainId)this.$router.replace({path:'/dieCutting'})
        if(this.router_mainId) this.router_mainId = null
        this.getPageInfo()//如果返回true，表示跳过此单成功，需要重新获取数据
      }
    },
   
    /**
   * 查看pdf操作流程图按钮
   */
    pdfJump() {
      this.pdfShow = true
      this.$refs.pdf.init()
    },

    /**
     * 点击关闭查看pdf图按钮
     */
    closepdf() {
      // this.closeHiddenBox('pdfShow')
      this.pdfShow = false
    },
 
    /**
     * 设置长连接
     */
    setWebSocket(){
      clearInterval(this.timer)
      this.timer = null
      if(this.isLeaveFlag) return this.stompClient?this.stompClient.close() : ''
      connectWebSocket().then((data)=>{
        this.stompClient = data.websocket
        data.stompClient.connect({Authorization: getToken()}, () => {
          console.log('stompClient已连接--当前订单数据');
          // 第一个订阅，广播级别
          data.stompClient.subscribe( "/topic/all",(msg) =>{
            if(this.isLeaveFlag) return data.websocket ? data.websocket.close() : ''
            console.log('收到消息的回调--当前订单',msg); //收到消息的回调
            this.getPageInfo(true)
          }, {Authorization: getToken()});
          // 发送send指令给服务端
          data.stompClient.send("/pushAll", {}, {});
        }, err => {
          console.log('连接异常状态-当前订单：',err.type);
          if(this.isLeaveFlag) return this.stompClient ? this.stompClient.close() : ''
          console.log('webSocket连接失败,重新请求--当前订单:', this.repetitionNum)
          if(this.stompClient)this.stompClient.close()
          if(this.repetitionNum<1) {
            this.drivingList()
            if(this.stompClient)this.stompClient.close()
            return
          }
          setTimeout(() => {//连接失败后，每五秒钟重新调用一次
            if(this.isLeaveFlag) return
            this.repetitionNum--
            this.setWebSocket()
          }, 15000);
          
         
        })
      })
    },

    /**
     * 主动循环去调取服务
     */
    drivingList(){
      if(this.stompClient)this.stompClient.close()
      if(this.timer) return 
      this.timer = setInterval(()=>{
       const pathName = window.location.pathname
        if(pathName.indexOf('orderInfo') == -1 || this.isLeaveFlag) {
             clearInterval(this.timer)
             this.timer = null
             return
        }
        if(this.repetitionNum == 0) return this.getPageInfo(true)
        clearInterval(this.timer)
        this.timer = null
      },1*60*1000)
    }
  },
  beforeDestroy() {
    const flag = this.curOrderInfo&&this.curOrderInfo.productStatus == 2 ? true : false
    console.log('完成生产按钮是否出现：',flag)
    clearInterval(this.timer)
    this.timer = null
    this.$store.dispatch('store_productStatusFlag_info', flag)//标记是否有订单正在生产
  }
}
</script>

<style scoped lang="scss">
.produce-detail {
  width: 100vw;
  overflow: hidden;
  font-family: Source Han Sans CN-Medium, Source Han Sans CN;
  .detail-content {
    width: 100%;
    display: flex;
    justify-content: center;
    min-height: 730px;
    padding:0 100px;
    box-sizing: border-box;
  }

  .header-bottom {
    display: flex;
    margin: 10px auto 0;
    height: 150px;
    padding-right: 40px;
    box-sizing: border-box;

    div {
      width: 360px;
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      button {
        width: 300px;
        height: 110px;
        color: white;
        font-size: 40px;
        border-radius: 20px;
      }

      .van-button {
        text-align: center;
        .van-button__content {
          width: 100%;
          height: 100%;
        }
      }
    }
    .btn1 {
      margin-left: 130px;
      button {
        border: none;
        background: #FF4D4F;
      }
    }

    .btn2 {
      button {
        border: none;
        background: #3D7EFF;
      }
    }

    .btn3 {
      button {
        border: none;
        background: #F9AC14;
        margin-right: 0;
      }
    }

   
    .btn4 {
      position: relative;
      width: auto;
      height: 110px;
      margin: 20px auto 0;
      padding:0 20px 0 90px;
      background: #FFFFFF;
      border-radius: 20px 20px 20px 20px;
      border: 2px solid #3D7EFF;
      button {
        width: auto;
        height: 110px;
        border:0;
        background: #FFFFFF;
        color: #3D7EFF;
        font-size: 40px;
        font-weight: 550;
      }

      img {
        position: absolute;
        left: 40px;
        width: 50px;
      }
    }

  }
  .full-screen{
    position: absolute;
    left: 0%;
    bottom: 5%;
  }
}
</style>
<style lang="scss">
body.dialog-open {
  position: fixed;
  width: 100%;
}
</style>
