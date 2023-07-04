<template>
<div class="produce-list">
  <div class="produce-list-tabbar">
    <router-link to="/orderList/producedList">待生产</router-link>
    <router-link to="/orderList/waitingList" v-if="waitingListFlag">待排产</router-link>
    <router-link to="/orderList/errorList">异常</router-link>
    <router-link to="/orderList/finishedList">已完成</router-link>
    <div class="searchBox" v-if="searchFlag">
      <div>
        <input type="text" placeholder="请输入PO号" v-model.timer="searchValue" placeholderStyle="color:#B3B3B3;" @input="changeValue" />
        <span @click="setSubmitBtn()">搜索</span>
        <p v-if="searchValue"><img :src="delImg" alt="" @click="delSearch()"></p>
      </div>
    </div>
  </div>
  <router-view></router-view>
</div>
</template>

<script>
import {getToken} from "@/utils/auth";
import bus from '../../utils/eventBus.js';
export default {
  name: "orderList",
  data() {
    return {
        waitingListFlag:false,
        searchFlag:false,
        delImg: require('../../static/images/delIcon.png'),
        searchValue:null,
        
    }
  },
  beforeCreate() {
    if(!getToken())this.$router.replace('/')
  },
  created(){
    const attributeId =this.$store.state.device.attributeId
    if(attributeId==2 || attributeId==4 || attributeId==6 || attributeId==64 ) this.waitingListFlag = true
    if(attributeId==5)this.searchFlag = true
    this.$store.dispatch('store_search_value', null)
   
  },
  methods:{
    delSearch(){
      this.searchValue = null
      this.$store.dispatch('store_search_value', this.searchValue)
    },
    setSubmitBtn(){
      this.$store.dispatch('store_search_value', this.searchValue)
      const tableType = window.location.pathname.split('orderList/')[1]
      bus.$emit(tableType,this.searchValue)
    },
    changeValue(e){
      console.log(this.searchValue)
      if(!this.searchValue)this.$store.dispatch('store_search_value', this.searchValue)
      
    }
  }
}
</script>

<style scoped lang="scss">
.produce-list{
  margin: 40px auto 0;
  width: 1740px;
  .produce-list-tabbar{
    width: 1720px;
    height: 82px;
    margin: 0 auto;
    display: flex;
    a{
      display: block;
      width: 250px;
      line-height: 82px;
      text-align: center;
      color: #262626;
      font-size: 32px;
      border-radius: 4px 4px 0 0;
      background: #FFFFFF;
      margin-right: 20px;
      box-sizing: border-box;
    }
    a.router-link-active{
      border-top: 6px solid #3D7EFF;
      border-left: 2px solid #3D7EFF;
      border-right: 2px solid #3D7EFF;
      color: #3D7EFF;
    }
    .searchBox{
      flex: 1;
      
      >div{
        position: relative;
        width: 100%;
        height: 82px;
        line-height: 82px;
        >input{
          position: absolute;
          background-color: #fff;
          border:0;
          border-radius: 40px;
          width: 600px;
          height: 68px;
          line-height: 68px;
          right: 0;
          top:50%;
          transform: translateY(-50%);
          padding:0 190px 0 40px;
          box-sizing: border-box;
          font-size: 32px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #333;
        }
        >p{
          height: 68px;
          line-height: 68px;
          position: absolute;
          right: 125px;
          top:50%;
          transform: translateY(-50%);
          width: 55px;
          margin: 0;
          >img{
            position: absolute;
            width: 32px;
            height: 32px;
            left:8px;
            top:50%;
            transform: translateY(-50%);
          }

        }
        >span{
          height: 68px;
          line-height: 68px;
          position: absolute;
          right: 0;
          padding:0 30px 0 25px;
          width: 65px;
          top:50%;
          transform: translateY(-50%);
          font-size: 30px;
          font-family: Source Han Sans CN-Medium, Source Han Sans CN;
          font-weight: 500;
          color: #3D7EFF;
          
        }
        >span::after{
          content: '';
          position: absolute;
          width: 2px;
          height: 34px;
          background-color: #3D7EFF;
          left: 0;
          top:50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}
</style>

<style lang="scss">
  .hintBox{
      position: relative;
      height: 700px;
      overflow: hidden;
      background: #F4F5FC;
      >div{
        width: 400px;
        height: 400px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        background-image: url(../../static/images/noData.png);
        background-size: 100%;
        p{
          position: absolute;
          width: 1720px;
          text-align: center;
          left:50%;
          bottom: 40px;
          transform: translateX(-50%);
          font-size: 32px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #595959;
          margin: 0;
        }
       
      }
      span{
          position: absolute;
          width: 1720px;
          text-align: center;
          left:50%;
          top:50%;
          transform: translate(-50%,-50%);
          font-size: 32px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #595959;
        }
   }
</style>
