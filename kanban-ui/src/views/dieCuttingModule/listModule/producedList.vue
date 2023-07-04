<template>
  <div class="produce-inline">
    <routine-table @setItemSelect="getItemSelect"   :update="timer" />
    <jump-order   @setTimer="getTimer" v-if="isShow"  :checkedData="checkedData" />
    <div class="produce-inline-button">
      <van-button :disabled="!!!checkedData || productStatusFlag" @click="startProduce()">开始生产</van-button>
      <van-button :disabled="!!!checkedData" @click="setJumpModule()" >转单</van-button>
      <button @click="$router.push(`/dieCutting`)">退出</button>
    </div>
  </div>
</template>

<script>
import routineTable from '@/components/listModule/routineTable'
import jumpOrder from '@/components/vanOverlay/jumpOrder'
export default {
  name: "producedList",
  components: {routineTable,jumpOrder},
  data() {
    return {
      checkedData:null,//存放已经选中的机器
      productStatusFlag:null,//是否有正在生产中的订单
      isShow:false,//转单模态框是否开启
      timer:null,
    }
  },
  
  created() {
  },
  mounted() {
    this.productStatusFlag  = this.$store.state.device.productStatusFlag
  },
  methods: {
   
    /**
     * 子组件触发的回调--列表组件
     * @param {*} item 
     */
    getItemSelect(item){
      this.checkedData = item 
    },

    /**
     * 跳单模态框组件
     */
    getTimer(val){
      this.isShow = false
      if(val) {
        this.timer = new Date().getTime()
        this.checkedData = null
      }
     
    },

    /**
     * 点击 转单 按钮--开启转单模态框
     */
    setJumpModule() {
      if(this.checkedData.forcedSchedulingFlag ==1) return this.$toast('当前订单属于强制排产订单，未到该工序，暂不允许操作。')
      this.isShow = true
    },

    /**
     * 点击 开始生产 按钮
     */
    startProduce() {
      if(!this.checkedData) return this.$toast('请选择开始数据。')
      if(this.checkedData.forcedSchedulingFlag ==1) return this.$toast('当前订单属于强制排产订单，未到该工序，暂不允许操作。')
      this.$router.replace({path:'/dieCutting',query:{mainId: this.checkedData.mainId}})
    }
  },
 
}
</script>

<style scoped lang="scss">
.produce-inline {
  width: 1720px;
  margin: 0 auto;
  padding-bottom: 50px;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: auto;  
  .produce-inline-button {
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    button {
      width: 300px;
      height: 110px;
      -webkit-border-radius: 20px;
      -moz-border-radius: 20px;
      border-radius: 20px;
      font-size: 40px;
      &:nth-child(1){
        font-size: 40px;
        background: #3D7EFF;
        color: white;
        border: none;
        margin-right: 240px;
      }
      &:nth-child(2) {
        margin-right: 240px;
        color: white;
        background: #F9AC14;
        border: none;
      }
      &:nth-child(3) {
        color: #3D7EFF;
        background: #ffffff;
        border: 2px solid #3D7EFF;
      }
    }
  }

}
</style>
