<template>
  <div class="headerLeftBox">
      <div class="header-left">
        <div v-if="curOrderInfo && curOrderInfo.groupSn ">
          <div class="detail-title">生产规格</div>
          <table class="tableBox yunBox">
            <tr v-for="(item,index) in listData" :key="index" >
              <td class="table-title"> {{item.name}} </td>
              <td class="table-des" >
                {{ curOrderInfo[item.value] || '无' }}
                <img  v-if="curOrderInfo.urgentFlag==='Y' && (item.value == 'groupSn' || item.value == 'poSns') " :src="emergencyImg" alt="">
              </td>
            </tr>
            <tr >
              <td class="table-title" style="vertical-align: top">相关图片：</td>
              <td class="table-img">
                <div v-if="curOrderInfo&&curOrderInfo.imgArr&&curOrderInfo.imgArr.length>0" class="groupImgStyle">
                    <viewer :images="curOrderInfo.imgArr" > 
                      <img v-for="(src,index_img) in curOrderInfo.imgArr" :src="src.url || src.bigUrl "  :data-source="src.bigUrl || src.url"  :key="index_img" :alt="src.title" >
                    </viewer>
                    <div v-if="curOrderInfo.imgArr&&curOrderInfo.imgArr.length>2" class="seeMoreBox">
                      <div class="seeMoreImg">
                        查看更多图片
                        <img :src="returnImg" alt="">
                        <div class="imgStyle"> 
                          <viewer :images="curOrderInfo.imgArr" >
                            <img v-for="(src,index) in  curOrderInfo.imgArr " :src="src.url || src.bigUrl " :data-source = "src.bigUrl || src.url" :key="index" :alt="src.title">
                          </viewer>
                        </div>
                      </div>
                    </div>
                </div>
                
                <!-- <div v-else>暂无图片，如有需要请联系加工商</div> -->
                <div v-else>
                  <img :src="noImg" alt="">
                </div>
              </td>
            </tr>
          </table>

          <p class="table-btn" v-if="curOrderInfo.lossInfos&&curOrderInfo.lossInfos.length>0">
            <button @click="openRrrorCheck()" >查看异常</button>
          </p>
        </div>

        <div class="no-order" v-else>
          <img :src="frameImg" alt="">
          <p>目前无生产订单，请稍后~</p>
        </div>
      </div> 

      
      
  </div>
</template>

<script>
import {orderInfoHeaderLeft} from "@/utils/listTitle";

export default {
  name: "headerLeft",
  props:['curOrderInfo'],
  data() {
    return {
        emergencyImg: require('../../static/images/emergency.png'),
        frameImg: require('../../static/images/noData.png'),
        returnImg: require('../../static/images/seeMore.png'),
        noImg: require('../../static/images/noImg.png'),
        listData:[],
        attributeId:null,
        imgArrData:'http://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/uploads/bill/PDF20220712/P2022071228011972/大版/1db5d94334a64e91bb93eddc2cc77848.png',
    }
  },
  created() {
    this.attributeId =this.$store.state.device.attributeId
    this.listData = orderInfoHeaderLeft()
  },
 
  methods: {
    /**
     * 打开查看异常模态框
     */
    openRrrorCheck(val){
        this.$emit('setOpenError',true)
    }
  },

}
</script>

<style scoped lang="scss">
.headerLeftBox {
    width: 100%;
    display: flex;
    justify-content: center;
    min-height: 730px;
   
    .header-left {
        width: 1120px;
        background: #ffffff;
        box-sizing: border-box;
        border-radius: 10px;
        margin-right: 50px;
        >div{
            position: relative;
            .table-btn {
                vertical-align: bottom;
                position: absolute;
                top:10px;
                right: 30px;
                margin: 0;
                button {
                    border: 0;
                    background: #FFFFFF;
                    color: #FF4D4F;
                    font-size: 32px;
                    width: 200px;
                    border-radius: 5px;
                    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                }
            }
        }
    }
    .no-order {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
          width: 400px;
          display: block;
      }
      p {
          display: block;
          color: #595959;
          font-size: 30px;
      }
    }
    .detail-title { 
      font-size: 35px;
      margin:30px 0 0 30px;
      font-weight: 500;
      font-size: 35px;
      font-weight: 600;
      color: #262626;
    }

    .tableBox {
        font-size: 30px;
        mso-cellspacing: 20px;
        margin: 30px 0 0 30px;
        tr {
          // padding-bottom: 10px;
          // height: 60px;
          // line-height: 60px;
          padding:10px 0;
        }
        .table-title {
          text-align: right;
          white-space: nowrap;
          font-size: 30px;
          font-weight: 500;
          color: #595959;
        }
        .table-des {
          color: #262626;
          padding-left: 20px;
          font-weight: 550;
          >img{
            width: 50px;
            height: 32px;
          }
        }
    }

   
    

    .yunBox{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        >tr{
          display: flex;
          >td:last-child{
            padding:0;
            flex: 1;
          }
        }
        >tr:nth-of-type(2n-1){
          width: 60%;
        }
        >tr:nth-of-type(2n){
          width: 40%;
        }
        >tr:last-child{
          width: 100%;
          display: flex;
          padding:0;
        }
        

        /deep/.table-img {
          padding-left: 20px;
          flex: 1;
          >div{
            img{
              max-width: 416px;
              max-height: 290px;
              // object-fit: cover;
              // object-fit: scale-down;
              object-fit: contain;
            }
            img:first-child{
              margin-right: 40px;
            }
            
          }
          .groupImgStyle{
              width: 100%;
              margin-top: 25px;
              img:nth-of-type(n+3){//因为最多只能展示2张图片，但是查看图片的时候可以查看，所以从第3张图片以后不展示
                display: none;
              }
          }

          .seeMoreBox{
            position: relative;
            margin-top: 10px;
            >.seeMoreImg{
              position: absolute;
              font-size: 30px;
              font-family: Source Han Sans CN-Regular, Source Han Sans CN;
              font-weight: 400;
              color: #3D7EFF;
              top:0;
              right: 60px;
              padding-right: 56px;
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
                position: absolute;
                width: 36px;
                height: 40px;
                right: -18px;
                top:50%;
                transform: translateY(-50%);
              }
            }
            
          }
        }
    }
    

}

</style>

