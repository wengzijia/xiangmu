<template>
  <div class="errorTable-box">
    <table class="errorTable-box-table">
      <tr class="errorTable-box-table-title">
        <th v-for="(item,index) in listData.titleArr" :key="index">{{item.name}}</th>
      </tr>
    </table>
    <div class="produce-waiting-wrap" v-if="produceErrorList&&produceErrorList.length>0">
      <table class="errorTable-box-table">
        <tr class="errorTable-box-table-item" v-for="(item,index) in produceErrorList" :key="item.id"
            :class="{active:item.id === itemSelected}" @click="setItemSelect(item)">
          <td>
            <label>
              <input type="radio" name="errorTable-box-table-item" :value="item.id" v-model="itemSelected" />
            </label>
          </td>
          <td class="imgStyles" v-if="!item.groupImg || item.imgArr.length==0" @click.stop="showBigPic()">
            {{  isPO ? item.poSns :item.groupSn }}
            <span v-if="item.orderSource==1">外</span>
          </td>
          <td class="imgStyles" v-else >
              {{  isPO ?item.poSns :item.groupSn }}
            <span v-if="item.orderSource==1">外</span>
            <viewer :images="item.imgArr" > 
                <img v-for="src in  item.imgArr" :src="src.url" :data-source="src.bigUrl || src.url" :alt="src.title" >
            </viewer>
          </td>

          <td v-for="(item_s,index_s) in listData.keysArr" :key="index_s">{{item[item_s.value] || '无'}}</td>

          <td class="imgStylesError"  v-if="item.photoPath1&&item.photoPath1.length == 1"  >
                <viewer :images="item.photoPath1" class="viewer"  > 
                    <img v-for="src in  item.photoPath1"  :src="'http://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/'+src" :data-source="'http://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/'+src"  >
                </viewer>
          </td>
          <td class="imgStylesError1"  v-else-if="item.photoPath1&&item.photoPath1.length > 1"  >
                <viewer :images="item.photoPath1"  class="viewer"  > 
                    <img v-for="src in  item.photoPath1"  :src="'http://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/'+src" :data-source="'http://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/'+src" >
                </viewer>
          </td>
          <td v-else>暂无异常图片</td> 
          
        </tr>
      </table>
    </div>
    <div  class="hintBox" v-if="!produceErrorList||produceErrorList.length==0">
      <div v-if="!searchVal&&!hintTitle"><p>暂时还没有订单哟~</p></div>
      <div v-if="searchVal&&!hintTitle"><p>抱歉，没有搜索到您想要的订单~</p></div>
      <span v-if="hintTitle">{{hintTitle}}</span>
    </div>
  </div>
</template>

<script>
import {errorList} from "@/utils/listTitle";
import {errorListInfo} from "@/utils/listData";
import bus from '../../utils/eventBus.js';
export default {
  name: "errorTable",
  props:['update'],
  data() {
    return {
      itemSelected: null,//存放选中行id
      produceErrorList: [],//存放异常列表数据
      productStatusFlag:null,//是否有正在生产中的订单
      listData:{},//存放表头标题和表格内容字段
      attributeId:4,
      searchVal:null,
      hintTitle:null,
    }
  },
  
  created() {
    this.attributeId = this.$store.state.device.attributeId
    let attid = [5,10]
    this.isPO = attid.indexOf(this.attributeId) >-1 ?true : false
    this.listData = errorList()
    this.searchVal = this.$store.state.device.searchValue
    this.getErrorListDetail()
  },
  mounted() {
   this.productStatusFlag = this.$store.state.device.productStatusFlag
      bus.$off('errorList') 
			bus.$on('errorList',val=>{
				console.log('我是异常列表：',val)
        this.getErrorListDetail(val)
        this.searchVal = val
			})
  },
  methods: {
    /**
     * 获取列表数据
     */
    getErrorListDetail(val) {
      errorListInfo(val).then(data=>{
          this.$emit('setItemSelect',null)
          console.log('异常列表返回的数据：',data)
          this.produceErrorList = data.list || []
          this.hintTitle = data.message||null  
          console.log(!this.searchVal&&!this.hintTitle) 
          console.log(!this.produceErrorList || this.produceErrorList.length==0)
      })
    },
    /**
     * 选中当前行，高亮显示
     * @param {*} item 
     */
    setItemSelect(item) {
      this.itemSelected = this.itemSelected == item.id ? null : item.id
      if(item.orderSource !=1 ) return this.$emit('setItemSelect',null)
      this.$emit('setItemSelect',this.itemSelected?item:null)
    },
   
    /**
     * 点击大版编号查看图片，给出暂无图片提示文案
     */
    showBigPic(){
      this.$toast('暂无图片，如有需要请联系加工商')
    },

   
  }
}
</script>

<style scoped lang="scss">
.errorTable-box {
  width: 1720px;
  margin: 0 auto;
  padding-bottom: 10px;
  overflow: hidden;
  .produce-waiting-wrap{
    // max-height: 700px;
    height: 700px;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: auto;
  }
  .errorTable-box-table {
    width: 1720px;
    table-layout: fixed;
    text-align: center;
    font-size: 26px;
    color: #595959;
    white-space: normal;
    word-break: break-all;
    
    .errorTable-box-table-title {
      width: 1720px;
      height: 80px;
      background: #EDEFF4;
      padding: 0;
      font-weight: normal;
      >th{
        // font-weight: 600;
        // font-weight: bold;
        // font-size: 32px;
      }
    }

    th,td {
        border: none;
        &:nth-child(1) {
          width: 85px;
        }

        &:nth-child(2) {
          width: 320px;
        }
        &:nth-child(n+3){
          width:auto;
        }
        &:last-child {
          width: 295px;
        }
    }
    

   
    .imgStyles{
      position: relative;
      >span{
        position: absolute;
        width: 40px;
        height: 26px;
        background: #3D7EFF;
        border-radius: 6px 6px 6px 6px;
        font-size: 20px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 500;
        color: #FFFFFF;
        top: 50%;
        left:50%;
        transform: translate(-50%,50%);
      }
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

    .errorTable-box-line-title {
      width: 1750px;
      line-height: 82px;
      background: #EDEFF4;
      color: #3D7EFF;
      font-weight: 550;
    }

    .errorTable-box-table-item {
      background: #ffffff;
      td {
        height: 80px;
        position: relative;
        &:nth-child(1) {
          label {
            display: block;
            width: 100%;
            height: 100%;
            vertical-align: middle;
            position: relative;
            input {
              width: 44px;
              height: 44px;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }

        &:nth-child(2) {
          // text-align: center;
        }

        &:nth-child(8) {
          padding: 15px 20px;
          box-sizing: border-box;

        }
      }
    }

    .active.errorTable-box-table-item {
      background: #CFDFFF;
    }

     .imgStylesError{
      /deep/ .viewer{
        >img{
          width: 240px;
          height: 90px;
        }
      }
    }

    .imgStylesError1{
      /deep/ .viewer{
        display: flex;
        flex-wrap: wrap;
        >img{
          width:125px !important;
          height: 110px !important;
        }
      }
    }

  }
}
</style>

