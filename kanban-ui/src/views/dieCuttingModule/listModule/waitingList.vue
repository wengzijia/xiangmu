<template>
  <div class="produce-waitingBox">
    <routine-table @setItemSelect="getItemSelect"   />
    <div class="produce-waiting-button">
      <van-button :disabled="!!!checkedData || productStatusFlag" @click="toBeInline()">开始生产</van-button>
      <button @click="$router.push(`/dieCutting`)">退出</button>
    </div>
  </div>
</template>

<script>
import {lockOrSkipOrder} from "@/api/producemain";
import routineTable from '@/components/listModule/routineTable'
export default {
  name: "waitingList",
  components: {routineTable},
  data(){
    return{
      productStatusFlag:null,//是否有正在生产中的订单
      checkedData:null
    }
  },
  created() {
   
  },
  mounted() {
   this.productStatusFlag = this.$store.state.device.productStatusFlag
  },

  methods:{
    /**
     * 子组件触发的回调
     * @param {*} item 
     */
    getItemSelect(item){
       this.checkedData = item
       console.log(this.checkedData)
    },
   
    
    /**
     * 点击开始生产按钮
     */
    toBeInline(){
      if(!this.checkedData) return this.$toast('请选择开始数据。')
      this.$toast.loading('加载中')
      const params = {
          deviceId: this.$store.state.device.currentDeviceId,
          mainId: this.checkedData.mainId,
          type: "Y"
      }
      /**
       * 转单之前需要先将当前订单锁定
       */
      lockOrSkipOrder(params).then(res=>{
        this.$toast.clear()
        if(res.code !== '000000') return this.$toast(res.message || '操作不成功。')
        this.$router.push({path:'/dieCutting',query:{mainId: params.mainId}})
      },err=>{
        this.$toast(err.message || '操作不成功。')
      })
      
    },
   
  },
 
  
}
</script>

<style scoped lang="scss">
.produce-waitingBox {
  width: 1720px;
  margin: 0 auto;
  padding-bottom: 50px;
  .produce-waiting-button{
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    button{
      width: 300px;
      height: 110px;
      -webkit-border-radius: 20px;
      -moz-border-radius: 20px;
      border-radius: 20px;
      font-size: 40px;
      &:nth-child(1){
        margin-right: 240px;
        color: white;
        background: #3D7EFF;
        border: none;
      }
      &:nth-child(2){
        color: #3D7EFF;
        background: #ffffff;
        border: 2px solid #3D7EFF;
      }
    }
  }
}
</style>

