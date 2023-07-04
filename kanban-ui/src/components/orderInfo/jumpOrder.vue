<template>
  <div class="jumpOrderBox">
     <!-- 点击 跳过此单 按钮  弹出选择原因模态框 跳过此单按钮必须是可以使用的状态才允许开启-->
    <van-overlay :show="changeMachineShow" @click.stop="closeHiddenBox('changeMachineShow')" class="change-machine-layer" :lock-scroll="false">
      <div class="wrappers" @click.stop="closeHiddenBox('changeMachineShow')">
        <div class="blocks" @click.stop>
          <div class="change-machine-layer-header">
              <span>跳单原因</span>  
              <span @click="closeHiddenBox('changeMachineShow')" class="layer-close"><van-icon name="cross"/></span>
          </div>
          <div class="change-machine-layer-content" >
            <van-radio-group v-model="currentIndex" class="van-radio-group-producedList">
              <van-radio shape="square" v-if="index<causeData.length-1" class="van-radio-producedList" v-for="(item,index) in causeData" :key="index" @click="seleteCause(index)" :name="index" >
                {{item.value}}
              </van-radio>
            </van-radio-group>
            <van-radio-group v-model="currentIndex" class="van-radio-group-producedList">
                <van-radio shape="square"  class="van-radio-producedList" :name="causeData.length-1">
                       <input type="text" maxlength="20" v-model="currentOther" class="other" :placeholder="currentIndex == causeData.length-1 ? '请输入其他原因' : '其他'"   />
                </van-radio>
            </van-radio-group>
          </div>

          <div class="change-machine-layer-footer">
             <button  @click.stop="closeHiddenBox('changeMachineShow')">取消</button>
             <button @click="jumpOrderOk()">确定</button>
          </div>
        </div>
      </div>

    </van-overlay>
  </div>
</template>

<script>
import {skipOrder,lockOrSkipOrder} from '@/api/producemain.js'
import {getJumpOptions} from "@/utils/listTitle";
export default {
  name: "jumpOrder",
  props:['curOrderInfo'],
  data() {
    return {
      changeMachineShow:true,
      causeData:[],//跳单原因
      currentIndex:null,//跳单原因选中项
      currentOther:null,//当跳单原因选择 其他 的时候，需要输入原因
     
    }
  },
  created() {
     this.causeData = getJumpOptions()
  },
  mounted(){
    
  },
  methods: {
  
   
     /**
     * 打开跳过此单弹出框，选择跳单原因
     * @param {选择跳过此单原因下标} index 
     */
    seleteCause(index){
      this.currentIndex = index  
    },
    /**
     * 选择跳单原因弹出框，点击弹出框确定按钮逻辑处理
     */
    jumpOrderOk(){
       if(!this.currentIndex&&this.currentIndex!= 0) return this.$toast('请选择跳单原因。')
       if(this.currentIndex==this.causeData.length-1&&!this.currentOther) return this.$toast('请输入跳单原因。')
       const {deviceOperatorId,currentDeviceId} =  this.$store.state.device
       const params = {
        attributeId:this.curOrderInfo.attributeId ,//工艺，2表示覆膜；4表示模切
        deviceOperatorId:deviceOperatorId,
        mainId:this.curOrderInfo.mainId,
        reason:this.currentIndex==this.causeData.length-1 ? this.currentOther : this.causeData[this.currentIndex].value
       }
      //  
      //如果状态值是0，说明是待排产过来的，需要先解锁
      if(this.curOrderInfo.productStatus !=0) return this.setSkipOrder(params)
          this.$toast.loading('加载中')
          const Obj = {deviceId:currentDeviceId,mainId: this.curOrderInfo.mainId,type: "N"}
          //待排产状态过来的订单跳过此单之前需要进行解锁
          lockOrSkipOrder(Obj).then(res=>{
            this.$toast.clear()
            if(res.code !== '000000') return this.$toast(res.message || '操作不成功。')
            this.setSkipOrder(params)
          },err=>{
            this.$toast(err.message || '操作不成功。')
          })
       
       
    },

    setSkipOrder(params){
       this.$toast.loading('加载中')
       skipOrder(params).then(res=>{
          this.$toast.clear()
          if(res.code !== '000000') return this.$toast(res.message || '跳单失败。')
          this.$emit('setJumpOrder',true)
       },err=>{
         this.$toast(err.message || '跳单服务异常。')
       })
    },
    //这是打开遮罩层的方法
    openHiddenBox(params) {
      this.$data[params] = true;
      // 处理遮罩层出现后，遮罩层下的页面仍然可以滚动的问题，（遮罩层内的内容仍然可以滚动）
      this.scrollTop = document.scrollingElement.scrollTop;
      document.body.classList.add('dialog-open');
      document.body.style.top = -this.scrollTop + 'px';
    },
    //这是关闭遮罩层的方法
    closeHiddenBox(params) {
      this.$data[params] = false;
      // 处理遮罩层出现后，遮罩层下的页面仍然可以滚动的问题，（遮罩层内的内容仍然可以滚动）
      document.body.classList.remove('dialog-open');
      document.scrollingElement.scrollTop = this.scrollTop;
      this.$emit('setJumpOrder',false)
    },
   
  
  },
  
}
</script>

<style scoped lang="scss">
.jumpOrderBox{
      // 跳过此单模块样式
  .change-machine-layer {
    .wrappers {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      .blocks {
        width: 950px;
        height: 750px;
        border-radius: 20px;
        background: #ffffff;
        position: relative;
        .change-machine-layer-header{
          width: 100%;
          height: 110px;
          // background: #3D7EFF;
          background-color: #F7F7F7;
          border-radius: 20px 20px 0 0 ;
          text-align: center;
          line-height: 110px;
          position: relative;
          font-size: 40px;
          font-family: Source Han Sans CN-Medium, Source Han Sans CN;
          font-weight: 500;
          // color: #FFFFFF;
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
            width: 80%;
            margin: 0 auto;
            >span{
              flex: 1;
              font-size: 30px;
              
              font-weight: 500;
             
              font-family: Source Han Sans CN-Regular, Source Han Sans CN;
              color: #262626;
            }
            >span:first-child{
              flex: 2;
            }
          }

        }
        .change-machine-layer-content{
          padding:50px 140px;
          box-sizing: border-box;
          .van-radio-group-producedList{
            
            position: relative;
            .van-radio-producedList{
             
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
              }


            }

            .other{
              border: 0;
              height: 100px;
              line-height: 100px;
              background-color: #fff;
              width: 100%;
            }
          }
        }

        .change-machine-layer-footer{
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: absolute;
          width: 100%;
          bottom: 70px;
          padding:0 140px;
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

}
</style>

