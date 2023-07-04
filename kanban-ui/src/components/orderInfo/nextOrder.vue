<template>
  <div class="nextOrderBox">
    <div class="next-order-info" >
      <span>下一订单</span>
      <div :class="nextOrderInfo[keys] ? 'next-order-info-detail' : 'next-order-info-detail noData' ">
        <div :class="attributeId==6&&className?'setFontSize nextInfoImgs':'nextInfoImgs'"  v-if="nextOrderInfo.imgArr&&nextOrderInfo.imgArr.length>0">
          {{ nextOrderInfo[keys] || '无' }}
          <img  v-if="nextOrderInfo.urgentFlag==='Y'" :src="emergencyImg" alt="" />
          <div class="imgStyle"> 
            <viewer :images="nextOrderInfo.imgArr" >
              <img v-for="(src,index) in  nextOrderInfo.imgArr " :src="src.url" :data-source = "src.bigUrl || src.url" :key="index" :alt="src.title">
            </viewer>
          </div>
        </div>
        <div :class="attributeId==6&&className?'setFontSize nextInfoImgs':'nextInfoImgs'" @click="showBigPic()" v-else>
          {{ nextOrderInfo[keys] || '无' }} 
          <img  v-if="nextOrderInfo.urgentFlag==='Y'" :src="emergencyImg" alt="" />
        </div>
       
        <div v-if="className" v-for="(item,index) in nextOrderData" :key='index' :class="className" >{{nextOrderInfo[item.value] || '无'}}</div>
        <div v-if="!className" v-for="(item,index) in nextOrderData" :key='index' :class="nextOrderInfo[item.value]&& nextOrderInfo[item.value]!='无'? '':'setWidthStyle'" >{{nextOrderInfo[item.value] || '无'}}</div>

      </div>
    </div>
  </div> 
</template>

<script>
import {getNextOrderInfo} from "@/utils/listTitle";
export default {
  name: "nextOrder",
  props:['nextOrderInfo'],
  data() {
    return {
      emergencyImg: require('../../static/images/emergency.png'),
      nextOrderData:[],
      keys:'groupSn',
      className:'',
      attributeId:null
     
    }
  },
  
 
  created() {
    this.className = ''
    const attributeId =this.$store.state.device.attributeId
    this.attributeId = attributeId
    let attid = [5,10]
    this.keys = attid.indexOf(attributeId) > -1 ? 'poSns' : 'groupSn'
    this.nextOrderData = getNextOrderInfo()
    //如果展示的数据不超过5个，平分剩下的空间
    if(this.nextOrderData.length<6)this.className='flex_1'
    if(attributeId==4) this.className='flex_2'
    if(this.attributeId==6&&this.nextOrderInfo&&this.nextOrderInfo.subclassTypeName){
      if(this.nextOrderInfo.subclassTypeName.length>20) this.className='setFontSize20'
      if(this.nextOrderInfo.subclassTypeName.length>22) this.className='setFontSize'
    }
  },
  
 
  methods: {
     showBigPic(){
      console.log(this.nextOrderInfo)
      console.log(this.keys)
      console.log(this.nextOrderInfo[this.keys])
        if(!this.nextOrderInfo[this.keys]) return 
        this.$toast('暂无图片，如有需要请联系加工商。')
     },
      /**日期格式化*/
    formatTime(str) {
      let date = ''
      if (str) {
        let reg = /\d*-\d* \d*:\d*/g
        date = str.match(reg).toString()
      }
      return date
    },
    
  },
  
}
</script>

<style scoped lang="scss">
.nextOrderBox{
  // 下一订单样式
   .next-order-info {
     margin: 0 auto;
     width: 1720px;
     >span{
      height: 80px;
      line-height: 80px;
      font-size: 36px;
     }
    .next-order-info-detail {
      display: flex;
      height: 80px;
      background: white;
      border: 1px solid rgba(0, 0, 0, 0.3);
      -webkit-border-radius: 20px;
      -moz-border-radius: 20px;
      border-radius: 20px;
      div {
        border-right: 1px solid rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
        
        box-sizing: border-box;
        min-width: 100px;
        // &:nth-child(1) {
        //   flex: 1;
        // }
        &:nth-child(n+1) { 
          width: auto;
          padding:0 20px;
        }
        &:last-child {
          border: none;
          flex: 1;
          padding: 0 !important;
        }
      }
      .setWidthStyle{
        flex: 1;
      }
      .flex_1{
        flex: 1;
      }
      .flex_2{
        padding:0 30px !important;
      }
      .flex_2:last-child{
        flex: 1;
        padding: 0 !important;
      }
      .setFontSize{
        font-size: 12px !important;
        padding:0 10px !important;
        max-width: 650px !important;
      }

      .nextInfoImgs{
        position: relative;
        // flex: 1;
        >.imgStyle{
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          img{
            position: absolute;
            width:100% ;
            height: 100% ;
            left: 0;
            top:0;
            opacity: 0;
          }
          img:nth-of-type(n+2){
              display: none;
          }
           
        }
        >img{
          width: 50px;
          height: 32px;
          margin-left: 10px;
        }
      }

    }
    .noData{
      div{
        flex: 1;
      }
    }
  }

}
</style>

