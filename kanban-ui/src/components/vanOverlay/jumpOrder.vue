<template>
  <div class="jumpOrderBox">
    <van-overlay :show="isShow" @click.stop="closeHiddenBox('isShow')" class="change-machine-layer" :lock-scroll="false">
      <div class="wrappers" @click.stop="closeHiddenBox('isShow')">
        <div class="blocks" @click.stop>
          <div class="change-machine-layer-header">
                <p>
                  <span>{{ checkedData[keys] }}</span>
                  <span>{{ checkedData.paperSize }}</span>
                  <span>{{ attributeId == 4 ? checkedData.attributeName : checkedData.subclassTypeName }}</span>    
                </p>   
              <span @click="closeHiddenBox('isShow')" class="layer-close"><van-icon name="cross"/></span>
          </div>
          <div class="mainBox">
              <p class="title">转单原因</p>
              <div class="change-machine-layer-content" >
                <van-radio-group v-model="currentIndex" class="van-radio-group-producedList">
                  <van-radio shape="square" v-if="index<causeData.length-1" class="van-radio-producedList" v-for="(item,index) in causeData" :key="index" @click="seleteCause(index,'currentIndex')" :name="index" >
                    {{item.value}}
                  </van-radio>
                  <van-radio shape="square"  class="van-radio-producedList otherWidth" :name="causeData.length-1">
                        <input type="text" v-model="currentOther" maxlength="20" class="other" :placeholder=" currentIndex == causeData.length-1 ? '请输入其他原因' : '其他'"   />
                  </van-radio>
                </van-radio-group>
              </div>
              <p class="title">选择机器</p>
              <div class="change-machine-layer-content person-list" v-if="machineData&&machineData.length>0" >
                <van-radio-group v-model="currentId" class="van-radio-group-producedList">
                  <van-radio   class="van-radio-producedList" v-for="(item,index) in machineData" :key="item.id"  @click="seleteCause(item.id,'currentId')" :name="item.id" >
                    {{item.deviceName}}
                  </van-radio>
                </van-radio-group>
              </div>
              <div v-else="" class="no-device">
                <img :src="framenImg" alt="">
                <div>暂无其他设备，请前往包秘书进行设置</div>
              </div>
          </div>

          
          <div class="change-machine-layer-footer">
             <button  @click.stop="closeHiddenBox('isShow')">取消</button>
             <button @click="machineChangeConfirm()" >确定</button>
          </div>
         
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>

import {getDeviceList} from '@/api/login.js'
import {transformDevice} from '@/api/producemain.js'
import {getTransferOptions} from "@/utils/listTitle";
export default {
  props:['checkedData'],
  name: "transferOrder",
  data() {
    return {
      machineiconImg:require('../../static/images/machineicon.png'),
      framenImg:require('../../static/images/noData.png'),
      causeData:[],//转单原因
      currentIndex:null,//转单原因选中项
      currentOther:null,//当跳单原因选择 其他 的时候，需要输入原因
      machineData:[],//可以进行转单的设备
      currentId:null,//选择转单机器
      isShow:false,
      attributeId:4,
      keys:'groupSn'
      
    }
  },

  created() {
    this.attributeId =this.$store.state.device.attributeId
    let attid = [5,10]
    this.keys =  attid.indexOf(this.attributeId) >-1 ? 'poSns' : 'groupSn'
    this.causeData = getTransferOptions()
    this.orderChangeMachine()
    this.openHiddenBox('isShow')
  },
  methods: {
    /**
     * 通过参数获取到当前订单可以转单的设备
     * @param {获取数据的入参} params 
     */
    getDeviceListData(params){
      this.$toast.loading('加载中')
      getDeviceList(params).then(res => {
        this.$toast.clear()
        if(res.code!=='000000') return this.$toast(res.message || '服务异常')
        this.machineData =  res.data || []
      }, err => {
        this.$toast(err.message || '服务异常')
      })
    },
    /**
     * 设定选择默认值，获取选择设备服务
     */
    orderChangeMachine() {
      const {supplierId,attributeId,currentDeviceId} = this.$store.state.device
      const params = {
        attributeId: attributeId == 64 ? this.checkedData.attributeId : attributeId ,//工艺id 特殊情况工艺64为丝印，但是分为局部uv、丝印单色、丝印磨砂、丝印滴注等不能取64
        currentDeviceId,//机器id
        supplierId: this.checkedData.orderSource == 1 ?  supplierId || localStorage.getItem('supplierId') : "" //如果是外部订单，需要传加工商id,否则不需要传
      }
      //如果是覆膜工序，必须传加工商id
      if(attributeId == 2)  params.supplierId = supplierId || localStorage.getItem('supplierId')
      //转单的时候 模切 工序 需要传尺寸
    
      if(attributeId == 4) params.deviceSize =  this.checkedData.paperSort
      this.getDeviceListData(params)
      this.openHiddenBox('isShow')
    },
   
    /**
     * 填写转单原因，点击确定，判断转单是否成功
     */
    machineChangeConfirm() {
      if(!this.currentIndex&&this.currentIndex!= 0) return this.$toast('请选择转单原因。')
      if(this.currentIndex == this.causeData.length - 1 && !this.currentOther) return this.$toast('请输入转单原因。')
      if(!this.currentId) return this.$toast('请选择转单设备。')
      const {deviceOperatorId,attributeId,currentDeviceId} = this.$store.state.device
      const params = {
        attributeId,//工艺id
        deviceOperatorId,//设备操作员id
        deviceIdCurrent:currentDeviceId,//当前设备id
        mainId: this.checkedData.mainId,//看板大版id
        targetDeviceId:this.currentId ,//目标设备id
        reason:this.currentIndex == this.causeData.length - 1 ? this.currentOther : this.causeData[this.currentIndex].value
      }
      this.$toast.loading('加载中')
      transformDevice(params).then(res => {
        this.$toast.clear()
        if(res.code != '000000')return  this.$toast(res.message || '转单失败。')
        // if(!res.success || res.success == 'false' || res.success == 'null') return  this.$toast(res.message || '转单失败。')
        this.$toast.success('转单成功')
        this.closeHiddenBox('isShow')
        this.$emit('setTimer', true)
      }, err => {
        this.$toast(err.message || '请求服务失败。')
      })
    },
    /**
     * 在转单原因模态框，选中项
     * @param {*} index 
     */
    seleteCause(index,keys){  
     this[keys] = index 
    },
     //这是打开遮罩层的方法
    openHiddenBox(keys) {
      this.$data[keys] = true;
      // 处理遮罩层出现后，遮罩层下的页面仍然可以滚动的问题，（遮罩层内的内容仍然可以滚动）
      this.scrollTop = document.scrollingElement.scrollTop;
      document.body.classList.add('dialog-open');
      document.body.style.top = -this.scrollTop + 'px';
    },

    //这是关闭遮罩层的方法
    closeHiddenBox(keys) {
      this.$data[keys] = false
      // 处理遮罩层出现后，遮罩层下的页面仍然可以滚动的问题，（遮罩层内的内容仍然可以滚动）
      document.body.classList.remove('dialog-open');
      document.scrollingElement.scrollTop = this.scrollTop;
      this.$emit('setTimer',false)
    },
  },
 
}
</script>

<style scoped lang="scss">
.jumpOrderBox {
  width: 1720px;
  margin: 0 auto;
  padding-bottom: 50px;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: auto;  
  .change-machine-layer {
    .wrappers {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

      /deep/ .van-radio__icon--checked .van-icon {
          color: #fff;
          background-color: #3D7EFF;
          border-color: #3D7EFF;
      }
      .blocks {
        width:1300px;
        // min-height: 1100px;
        height: auto;
        border-radius: 20px;
        padding-bottom: 180px;
        background: #ffffff;
        position: relative;
        .change-machine-layer-header{
          width: 100%;

          // height: 110px;
          // line-height: 110px;

          padding:35px 0;

          background: #F7F7F7;
          border-radius: 20px 20px 0 0 ;
          text-align: center;
        
          position: relative;
          font-size: 40px;
          font-family: Source Han Sans CN-Medium, Source Han Sans CN;
          font-weight: 500;
         
          >.layer-close {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 20px;
            width: 100px;
            line-height: 100px;
            text-align: center;
            font-size: 50px;
            color: #262626;
          }
          >p{
            display: flex;
            width: 90%;
            margin: 0 ;
            >span{
              flex: 1;
              
              font-weight: 500;
              font-size: 30px;
              font-family: Source Han Sans CN-Regular, Source Han Sans CN;
             
              color: #262626;
            }
            >span:first-child{
              flex: 2;
            }
          }

        }
        .mainBox{
          max-height: 820px;
          overflow: auto;
          padding: 40px 0 20px 0;
         
          box-sizing: border-box;
        }
        .title{
          text-align: center;
          width: 100%;
          font-size: 36px;
          font-family: Source Han Sans CN-Medium, Source Han Sans CN;
          font-weight: 600;
          color: #000000;
          margin: 0;
          &:nth-of-type(2){
             margin-top: 50px;
          }
        }
        .change-machine-layer-content{
          width:80%;
          margin: 30px auto 0;
          box-sizing: border-box;
          .van-radio-group-producedList{
            display: flex;
            flex-wrap: wrap;
            position: relative;
            .van-radio-producedList{
              width:33.33%;
              height: 90px;
              line-height: 90px;
              position: relative;
              /deep/ .van-icon{
                font-size: 30px;
                height: 40px;
                width: 40px;
                position: absolute;
                left:0;
                top:50%;
                transform: translateY(-50%);
              }

              /deep/ .van-radio__label{
                font-size: 30px;
                font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                font-weight: 400;
                color: #262626;
                padding-left: 20px;
                box-sizing: border-box;
                position: absolute;
                left:40px;
                top:50%;
                transform: translateY(-50%);
                width: 70%;
              }
            }
            .otherWidth{
              min-width: 60%;
              
            }
            .other{
              border: 0;
              height: 100px;
              line-height: 100px;
              background-color: #fff;
              width: 100%;
            }
          }
          .othenStyle{
            width: 100% !important;
             /deep/ .van-radio__label{
                width: 80% !important;
              }
          }
        }
        .person-list{
          .van-radio-group-producedList{
            .van-radio-producedList{
              width: 45%;
              &:nth-of-type(2n-1){
                margin-right:10%;
              } 
            }
          }
          
        }
        .change-machine-layer-footer{
           border-top: 1px solid #D9DAE0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: absolute;
          width: 100%;
          bottom: 50px;
          padding:40px 140px 0;
          box-sizing: border-box;
          button {
            width: 240px;
            height: 80px;
            text-align: center;
            line-height: 80px;
            background: #FFFFFF;
            border-radius: 10px 10px 10px 10px;
            border: 2px solid #8C8C8C;
            box-sizing: border-box;
            font-size: 40px;
            font-family: Source Han Sans CN-Medium, Source Han Sans CN;
            font-weight: 500;
            color: #8C8C8C;
           
          }
          button:last-child{
              background: #3D7EFF;
              color: #FFFFFF;
              border:0;
            }
        }
      }
    }
    
  }

  .no-device {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    // justify-content: center;
    font-size: 20px;
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    font-weight: 500;
    color: #595959;
    img {
      width: 300px;
      height: 300px;
    }
    div {
      font-size: 30px;
      font-size: 20px;
      font-family: Source Han Sans CN-Medium, Source Han Sans CN;
      font-weight: 500;
      color: #595959;
    }
  }


}
</style>
