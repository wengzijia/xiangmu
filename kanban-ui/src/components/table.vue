<template>
  <div class="tableModule">
    <table class="tableModule-box">
        <tr class="tableModule-title">
          <th class="imgStyles">{{isPO ? 'PO号' : '大版编号'}}</th>
          <th v-for="(item,index) in listTitle" :key="index"  >{{item.name}}</th>
        </tr>
    </table>
    <div class="tableModule-wrap" v-if="listInfo&&listInfo.length>0" >
      <table class="tableModule-box"  >
        <tr class="tableModule-box-item" v-for="(item,index) in listInfo" :key="item.mainId" >
            <td class="imgStyles" v-if="!item.groupImg || item.imgArr.length==0" @click.stop="showBigPic()">{{ attributeId == 10 ?item.poSns :item.groupSn }}</td>
            <td class="imgStyles" v-else >
                {{ isPO ?item.poSns :item.groupSn }}
                <viewer :images="item.imgArr" > 
                  <img v-for="src in  item.imgArr" :src="src.url" :data-source="src.bigUrl || src.url"  :alt="src.title" >
                </viewer>
            </td>
            <td v-for="(item_c,index_c) in listTitle" :key="index_c">{{item[item_c.value] || '无'}}</td>
        </tr>
      </table>
    </div>
    <div  class="hintBox" v-if="!listInfo||listInfo.length==0">
      <div v-if="!searchVal&&!hintTitle"><p>暂时还没有订单哟~</p></div>
      <div v-if="searchVal&&!hintTitle"><p>抱歉，没有搜索到您想要的订单~</p></div>
      <span v-if="hintTitle">{{hintTitle}}</span>
    </div>
  </div>
</template>

<script>
import {finishedList} from "@/utils/listTitle";
import {finishedListInfo} from "@/utils/listData";
import bus from '../utils/eventBus.js';
export default {
  props:['listType'],
  name: "tableModule",
  data(){
    return{
      listInfo:[],
      listTitle:[],
      params:{},//存放入参
      itemSelected:null,
      attributeId:4,
      isPO:false,
      searchVal:null,
      hintTitle:null,
    }
  },
 
  created() {
    this.attributeId = this.$store.state.device.attributeId
    this.searchVal = this.$store.state.device.searchValue
    let attid = [5,10]
    this.isPO = attid.indexOf(this.attributeId) >-1 ?true : false
    this.getListTitle()
    this.getListData()
  },
  mounted(){
			bus.$off('finishedList') 
			bus.$on('finishedList',val=>{
				console.log('我是已完成列表：',val)
        this.getListData(val)
        this.searchVal = val
			})
	},
  methods:{

    /**
     * 点击大版号查看图片，如果没有数据提示用户
     */
    showBigPic(){
      this.$toast('暂无图片，如有需要请联系加工商。')
    },

    /**
     * 获取表格表头以及每行渲染取值的字段名称
     */
    getListTitle(){
        const getData = {
          finishedList:finishedList(),
        }
        this.listTitle = getData[this.listType]
       
    },
    /**
     * 获取表格内容数据
     */
    getListData(val){
        const getData={
            finishedList:()=>{//已完成列表
                finishedListInfo(val).then(data=>{
                  console.log(data)
                  this.listInfo = data.list || []
                  this.hintTitle = data.message||null         
                })
            }
        }
        getData[this.listType]()
    },

  },
  
}
</script>

<style scoped lang="scss">
.tableModule {
    width: 1720px;
    margin: 0 auto;
   
    .tableModule-wrap {
        // max-height: 700px;
        height: 700px;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: auto;
    }
    .tableModule-title{
      width: 1720px;
      height: 80px;
      background: #EDEFF4;
      padding: 0;
      font-weight: normal;
    }
    .tableModule-box {
        width: 1720px;
        table-layout: fixed;
        text-align: center;
        font-size: 32px;
        color: #595959;
        white-space: normal;
        word-break: break-all;

        .tableModule-box-title {
            width: 1720px;
            height: 80px;
            background: #EDEFF4;
            padding: 0;
            font-weight: normal;
        }
        th,td {
            text-align: center;
            height: 80px;
            width: auto;
        }
        .tableModule-box-title {
            width: 1750px;
            line-height: 82px;
            background: #EDEFF4;
            color: #3D7EFF;
            font-weight: 550;
        }

    }

    .tableModule-box-item {
        background: #fff;
        >td:first-child{
          text-align: left;
        }
    }
    .active.tableModule-box-item {
      background: #CFDFFF;
    }

    //大版编号样式设定
    .imgStyles{
      position: relative;
      width: 400px !important;
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
        transform: translate(-50%,100%);
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

    //选择框样式设定
    .radioStyle{
      width: 85px;
        height: 80px;
        position: relative;
        width: 85px;
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


</style>
