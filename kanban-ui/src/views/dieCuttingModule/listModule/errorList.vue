<template>
  <div class="produce-error">
    <error-table @setItemSelect="getItemSelect"  :update="timer" />
    <div class="produce-error-button">
      <van-button :disabled="!!!checkedInfo" @click="resumeProduce()">恢复生产</van-button>
      <button @click="$router.push(`/dieCutting`)">退出</button>
    </div>
  </div>
</template>
<script>
import { ReproduceProduceErrorOrder} from '@/api/producelist.js'
import errorTable from '@/components/listModule/errorTable'

export default {
  name: "errorList",
  components: {errorTable},
  data() {
    return {
      checkedInfo:null,//存放选择行数据信息
      timer:null
    }
  },
  created() {},
  mounted() {
   
  },
  methods: {
    /**
     * 点击恢复生产按钮
     */
    resumeProduce() {
      if (this.checkedInfo&&this.checkedInfo.orderSource != '1')  return this.$toast('非外部订单，不可恢复生产。')
      this.$toast.loading('加载中')
      ReproduceProduceErrorOrder(this.checkedInfo.id).then(res => {
          if (res.code !== '000000') return this.$toast(res.message || '恢复生产失败。')
          this.$toast.clear()
          this.$toast.success('恢复生产成功')
          this.timer = new Date().getTime() //重新刷新子组件去调用列表数据
      }, err => {
        this.$toast(err.message || '恢复生产服务异常。')
      })
      
    },
    /**
     * 子组件触发的回调
     * @param {*} item 
     */
    getItemSelect(item){
       this.checkedInfo = item
       console.log(this.checkedInfo)
    }
  }
}
</script>

<style scoped lang="scss">
.produce-error {
  width: 1720px;
  margin: 0 auto;
  padding-bottom: 50px;
  overflow: hidden;
  .produce-error-button {
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
      color: #3D7EFF;
      background: #ffffff;
      border: 2px solid #3D7EFF;

      &:nth-child(1) {
        background: #3D7EFF;
        color: white;
        margin-right: 300px;
      }
    }
  }
}
</style>

