<template>
  <div class="produce-waiting">
    <table class="produce-waiting-table">
        <tr class="produce-waiting-table-title">
          <th v-for="(item,index) in listData.titleArr" :key="index">{{item.name}}</th>
        </tr>
    </table>
    <div class="produce-waiting-wrap" >
      <table class="produce-waiting-table" v-if="tableList.length>0">
        <tr class="produce-waiting-table-item" v-for="(item,index) in tableList" :key="item.mainId" :class="{active:itemSelected === item.mainId}" @click="setItemSelect(item)">
          <td><label ><input type="radio" name="produce-waiting-table-item" :value="item.mainId" v-model="itemSelected"></label></td>
          <td class="imgStyles" v-if="!item.groupImg || item.groupImg.length==0" @click.stop="showBigPic()">
             {{ isPO ?item.poSns :item.groupSn }}
             <img :src="emergencyImg" alt="" v-if="(item.urgentFlag==='Y')" />
           </td>
          <td class="imgStyles" v-else >
            {{ isPO ? item.poSns :item.groupSn }}
            <img :src="emergencyImg" alt="" v-if="(item.urgentFlag==='Y')" />
            <viewer :images="item.imgArr" > 
                <img v-for="src in  item.imgArr" :src="src.url" :data-source="src.bigUrl || src.url"  :alt="src.title" >
            </viewer>
          </td>
         <td v-for="(item_s,index_s) in listData.keysArr" :key="index_s" >
            <!-- redFlag:表示当前订单是外发订单；delayIdentificationSign：表示当前订单是粘盒工艺并且截止时间已经延期 -->
             <span :class="(item.redFlag &&  item_s.value == 'nearCount')||(item.delayIdentificationSign &&  item_s.value == 'deadtime') ?  'redStyle' : '' "> {{item[item_s.value] || '无'}}</span>
         </td>
        </tr>
      </table>
      <div v-if="tomorrowList.length > 0" class="produce-inline-line-title">明日订单</div>
      <table class="produce-waiting-table" v-if="tomorrowList.length > 0">
         <tr class="produce-waiting-table-item" v-for="(item,index) in tomorrowList" :key="item.mainId" :class="{active:itemSelected === item.mainId}" @click="setItemSelect(item)">
          <td><label ><input type="radio" name="produce-waiting-table-item" :value="item.mainId" v-model="itemSelected"></label></td>
          <td class="imgStyles" v-if="!item.groupImg || item.groupImg.length==0" @click.stop="showBigPic()">{{ isPO ?item.poSns :item.groupSn }}</td>
          <td class="imgStyles" v-else >
            {{ isPO ?item.poSns :item.groupSn }}
            <viewer :images="item.imgArr" > 
                <img v-for="src in  item.imgArr" :src="src.url" :data-source="src.bigUrl || src.url" :alt="src.title" >
            </viewer>
          </td>
          <td v-for="(item_s,index_s) in listData.keysArr" :key="index_s">
            <span :class="item.delayIdentificationSign &&  item_s.value == 'deadtime' ?  'redStyle' : '' "> {{item[item_s.value] || '无'}}</span>
          </td>
        </tr>
      </table>

      <div v-if="tomorrowList.length==0&&tableList.length==0" class="hintBox">
        <div v-if="!searchVal&&!hintTitle"><p>暂时还没有订单哟~</p></div>
        <div v-if="searchVal&&!hintTitle"><p>抱歉，没有搜索到您想要的订单~</p></div>
        <span v-if="hintTitle">{{hintTitle}}</span>
      </div>
    </div>
  </div>
</template>

<script>

import {connectWebSocket} from "@/utils/utils";
import {waitingList,producedList} from "@/utils/listTitle";
import {waitingListInfo,producedListInfo} from "@/utils/listData";
import {getToken} from "@/utils/auth";
import bus from '../../utils/eventBus.js';
export default {
  name: "producewaiting",
  props:['update'],
  data(){
    return{
      emergencyImg:require('../../static/images/emergency.png'),
      frameImg: require('../../static/images/noData.png'),
      tableList:[],//列表数据
      tomorrowList:[],//明日订单列表数据
      listData:{},//表格标题展示以及列表数据渲染字段
      itemSelected:null,//选中行mainId
      repetitionNum:5,//重复次数
      isLeaveFlag:false,//是否离开当前页面
      stompClient:null,//存放webSocket
      timer:null,//存放定时器
      tableType:null,
      attributeId:4,
      isPo:false,//是否取po号
      hintTitle:null,
      searchVal:null,
    }
  },
  
  created() {
    this.attributeId = this.$store.state.device.attributeId
    this.searchVal = this.$store.state.device.searchValue
    let attid = [5,10]
    this.isPO = attid.indexOf(this.attributeId) >-1 ?true : false
    console.log(window.location.pathname)
    this.tableType =  window.location.pathname.split('orderList/')[1]
    clearInterval(this.timer)
    this.timer = null
    this.stompClient?this.stompClient.close() : ''
    this.getListTitle()
    this.getTableList(1)

  },
  watch: {
    update: function() {
       this.getTableList()
    },
  },
  
  mounted() {
      bus.$off(this.tableType) 
			bus.$on(this.tableType,val=>{
				console.log(this.tableType=='producedList'?'待生产':'待排产',val)
        this.searchVal = val
        this.getTableList(1,val)
			})
  },
  methods:{
    /**
     * 点击表格某一项，选中当前行
     * @param {选中行数据} item 
     */
    setItemSelect(item){
      this.itemSelected = this.itemSelected ==  item.mainId ? null : item.mainId
      //强制排产的不允许操作开始生产，转单按钮
      item.forcedSchedulingFlag ==1 ?  this.$emit('setItemSelect',null) :this.$emit('setItemSelect',this.itemSelected?item:null)
    },
    /**
     * 获取表格列表数据
     */
    getTableList(flag,val){
      const publickFunc = {
        waitingList:()=>{
            waitingListInfo(flag,val).then(data=>{
                console.log(data)
                if(flag==1&&!this.isLeaveFlag&&!this.stompClient)  setTimeout(() => {this.setWebSocket()}, 0);         
                this.tableList = data.list || []
                this.hintTitle = data.message||null      
            })
        },
        producedList:()=>{
            producedListInfo(flag,val).then(data=>{
              console.log(data)
                if(flag==1&&!this.isLeaveFlag&&!this.stompClient)  setTimeout(() => {this.setWebSocket()}, 0);     
                this.tableList = data.todayList ||[]
                this.tomorrowList = data.tomorrowList ||[]      
                this.hintTitle = data.message||null                         
            })
        }
      }
      publickFunc[this.tableType]()

    },
      /**
     * 获取表格表头以及每行渲染取值的字段名称
     */
    getListTitle(){
        const getData = {
            waitingList:waitingList(),
            producedList:producedList()
        }
        this.listData = getData[this.tableType]
       
    },
    /**
     * 点击大版编号查看图片，给出暂无图片提示文案
     */
    showBigPic(){
      this.$toast('暂无图片，如有需要请联系加工商')
    },
    
     /**
     * 设置长连接
     */
    setWebSocket(){
      clearInterval(this.timer)
      this.timer = null
      const title = this.tableType=='producedList'?'待生产':'待排产'
      if(this.isLeaveFlag) return this.stompClient?this.stompClient.close() : ''
      connectWebSocket().then((data)=>{
        //收到后台回调，需要重新调取页面数据
        this.stompClient = data.websocket
        data.stompClient.connect({Authorization: getToken()}, () => {
          console.log(`stompClient已连接--${title}`);
          // 第一个订阅，广播级别
          data.stompClient.subscribe( "/topic/all",(msg) =>{
            if(this.isLeaveFlag) return data.websocket ? data.websocket.close() : ''
            console.log(`收到消息的回调--${title}`,msg); //收到消息的回调
            this.getTableList()
          }, {Authorization: getToken()});
          // 发送send指令给服务端
          data.stompClient.send("/pushAll", {}, {});
        }, err => {
           console.log(`连接异常状态-${title}：`,err.type);
          if(this.isLeaveFlag) return this.stompClient ? this.stompClient.close() : ''
          console.log(`webSocket连接失败,重新请求--${title}:`, this.repetitionNum)
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
        if(pathName.indexOf(this.tableType) == -1 || this.isLeaveFlag) {
             clearInterval(this.timer)
             this.timer = null
             return
        }
        
        if(this.repetitionNum == 0) return this.getTableList()
        clearInterval(this.timer)
        this.timer = null
      },1*60*1000)
    }
    
    
  },
  beforeDestroy() {
    this.isLeaveFlag = true //如果已经离开，不允许进行webSocket链接，停止定时器的调用
    clearInterval(this.timer)
    this.timer = null
    this.stompClient?this.stompClient.close() : ''
  }
 
  
}
</script>

<style scoped lang="scss">
.produce-waiting {
    width: 1720px;
    margin: 0 auto;
    overflow: hidden;
    padding-bottom: 10px;
    .produce-waiting-wrap{
        // max-height: 700px;
        height: 700px;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: auto;
    }
    .produce-waiting-table {
        width: 1720px;
        table-layout: fixed;
        text-align: center;
        font-size: 32px;
        color: #595959;
        white-space: normal;
        word-break:break-all;
        .produce-waiting-table-title {
          width: 1720px;
          height: 80px;
          background: #EDEFF4;
          padding: 0;
          font-weight: normal;
          >th{
            // font-size: 18px;
            // font-weight: 600; 
          }

        }
        th,td {
            border: none;
            &:nth-child(1) {
              width: 85px;
            }

            &:nth-child(2) {
              width: 400px;
            }
            &:nth-child(n+3) {
             width: auto;
            }
        
        }
        .produce-waiting-line-title{
          width: 1750px;
          line-height: 82px;
          background: #EDEFF4;
          color: #3D7EFF;
          font-weight: 550;
        }
        .produce-waiting-table-item {
          background: #ffffff;
          td {
              height: 80px;
              &:nth-child(1) {
                label{
                    display: block;
                    width: 100%;
                    height: 100%;
                    vertical-align: middle;
                    position: relative;
                    input{
                      width: 44px;
                      height: 44px;
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%,-50%);
                    }
                }
              }
              &:nth-child(2) {
                // white-space: pre-wrap;
                img{
                    width: 40px;
                    height: 30px;
                    margin-left: 14px; 
                }
              }
          }
        }
        .active.produce-waiting-table-item{
          background: #CFDFFF;
        }
    }
    .produce-inline-line-title {
        width: 1750px;
        line-height: 82px;
        background: #EDEFF4;
        color: #3D7EFF;
        font-weight: 600;
        text-align: center;
        font-size: 32px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        
    }
    .imgStyles{
      position: relative;
      text-align: left;
      >div{
          img{
              position: absolute;
              width:100% !important;
              height: 100% !important;

              left: 0;
              top:0;
              opacity: 0;
          }
          img:nth-of-type(n+2){
              display: none;
          }
      }
    }
   
   .redStyle{
    color: #FF4D4F;
   }

 
}
</style>

