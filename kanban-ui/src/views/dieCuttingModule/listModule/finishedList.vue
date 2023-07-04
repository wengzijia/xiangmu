<template>
  <div class="produce-finished">
    <table-list :listType="'finishedList'" />
    <div class="produce-finished-button"><button @click="$router.push(`/dieCutting`)">退出</button></div>
  </div>
</template>

<script>
import tableList from '@/components/table.vue'

export default {
  name: "finishedList",
  components: {tableList},
  data(){
    return{}
  },

  created(){
   
  },
  methods:{},
}
</script>

<style scoped lang="scss">
.produce-finished {
  width: 1720px;
  margin: 0 auto;
  .produce-finished-button {
    margin-top: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    button {
      width: 300px;
      height: 100px;
      -webkit-border-radius: 20px;
      -moz-border-radius: 20px;
      border-radius: 20px;
      font-size: 40px;
      color: #3D7EFF;
      background: #ffffff;
      border: 2px solid #3D7EFF;
    }
  }
}
</style>
