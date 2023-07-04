<template>
  <div class="errorCheckBox">
    <van-overlay :show="errorCheckShow" @click="closeHiddenBox('errorCheckShow')" class="error-check-layer" :lock-scroll="false">
      <div class="wrapper">
        <div class="block" @click.stop >
          <div class="error-check-header" v-if="attributeId != 48">
            <span>{{ curOrderInfo[keys] }}</span>         
            <span>{{ curOrderInfo.paperSize}}</span>
            <span>{{ attributeId == 4 ? curOrderInfo.otherCraftInfo : curOrderInfo.subclassTypeName }}</span>
          </div>
          <div class="error-check-header" v-else>
            <span></span>         
            <span>{{ curOrderInfo[keys]}}</span>
            <span></span>
          </div>
          <div class="error-check-content" ref="errorCheckBox">
            <div class="error-check-content-wrap" @touchmove="touchmove">
              <div class="error-check-content-page" v-for="(item,index) in curOrderInfo.lossInfos"
                   :key="index">
                <div class="error-check-content-page-title">异常登记{{ index + 1 }}</div>
                <div class="error-check-content-page-process">异常工序：{{ item.machiningAttributeName }}</div>
                <div class="error-check-content-page-num">
                  异常数量：{{ item.lossNum = item.lossNum == null ? '全部' : item.lossNum }}
                </div>
                <div class="error-check-content-page-reason">异常原因：{{ item.reason || '暂无' }}</div>
                <div class="error-check-content-page-pic">
                  <div v-if="item.photoPath1&&item.photoPath1.length>0">
                    <viewer :images="item.photoPath1"  >
                        <img v-for="(src,index) in item.photoPath1 " :src="'http://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/'+src" :data-source="'http://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/'+src"  :key="index" >
                    </viewer>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="error-check-button">
            <van-button class="submit-button" :disabled="isDisabled" v-if="curOrderInfo.productStatus != 2"   @click="errorCheckSubmit()" >
              开始生产
            </van-button>
          </div>
          <span class="error-check-page">{{ pageNumber }}/{{ lossLength }}</span>
          <span @click="closeHiddenBox('errorCheckShow')" class="layer-close"><van-icon name="cross"/></span>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
export default {
  name: "errorCheck",
  props:['curOrderInfo'],
  data() {
    return {
      errorCheckShow:true,
      touchStartY: 0,
      scrollTop: 0,
      lossLength: 0,
      //查看异常数据
      isDisabled: true,
      pageNumber: 1,
      heightArr:[],
      attributeId:4,
      keys:null

    }
  },
  created() {
    this.attributeId =this.$store.state.device.attributeId
    let attid = [5,10]
    this.keys =  attid.indexOf(this.attributeId) >-1 ? 'poSns' : 'groupSn'
   
  },
  mounted(){
    this.errorCheck()
  },
  methods: {
     /**打开查看异常模态框*/
    errorCheck() {
      this.$nextTick(()=>{
        let oBox = document.querySelector('.error-check-content')
        oBox.scrollTop = 0
        let oItems = document.querySelectorAll('.error-check-content-page')
        this.heightArr = []
        let arr = [0]
        for(let item of oItems){
          arr.push(item.offsetHeight)
        }
        for(let i = 0; i<arr.length;i++){
          if(i === 0){
            this.heightArr.push(arr[i])
          }else {
            this.sum = 0
            for(let j=0 ; j<= i;j++){
              this.sum += arr[j]
            }
            this.heightArr.push(this.sum)
          }
        }
        let pageTotal = oItems.length
        this.pageNumber = 1
        this.isDisabled = pageTotal !== 1;
        this.lossLength = pageTotal
      })
     
    },
     /**触摸开始判断*/
    touchstart(e) {
      this.touchStartY = e.changedTouches[0].clientY
    },
    /**触摸结束判断*/
    touchend(e) {
      let obj = {}
      if (e.changedTouches[0].clientY - this.touchStartY > 50) {
        obj.deltaY = -1
        this.scrollPage(obj)
      } else if (e.changedTouches[0].clientY - this.touchStartY < -50) {
        obj.deltaY = 1
        this.scrollPage(obj)
      }

    },
    /**触摸判断*/
    touchmove(){
      let oBox = document.querySelector('.error-check-content')
      let scrollHeight = oBox.scrollTop
      let maxHeight = oBox.scrollHeight - oBox.offsetHeight

      if(scrollHeight > maxHeight-50){
        this.isDisabled = false
      }
      this.heightArr.forEach((item,index)=>{
          if(scrollHeight>item - 100){
            this.pageNumber = index + 1
          }
      })
      if(this.pageNumber > this.lossLength){
        this.pageNumber = this.lossLength
      }
    },
    /**异常查看滚屏*/
    scrollPage(e) {
      this.$nextTick(() => {
        let pageTotal = this.curOrderInfo.lossInfos.length
        this.lossLength = pageTotal
        let oItems = document.querySelectorAll('.error-check-content-page');
        let itemHeight = oItems[0].offsetHeight;
        let oWrap = document.querySelector('.error-check-content-wrap')
        if (e.deltaY > 0) {
          if (this.pageNumber >= pageTotal) {
            return
          }
          this.pageNumber++
          if (this.pageNumber === pageTotal) {
            this.isDisabled = false
          }
          oWrap.style.marginTop = -(this.pageNumber - 1) * itemHeight + 'px';
        } else if (e.deltaY < 0) {
          if (this.pageNumber <= 1) return
          this.pageNumber--
          oWrap.style.marginTop = -(this.pageNumber - 1) * itemHeight + 'px';
        }
      })
    },
      
    /**
     * 点击查看备注，获取弹出框需要渲染的数据
     * @param {弹出框标题} title 
     * @param {弹出框渲染数据的取值字段} key 
     */
 
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
      this.$emit('setOpen',false)
    },
    /**
     * 开始生产按钮
     */
    errorCheckSubmit() {
        this.$emit('setOpen',true)
    }
  
  },
  
}
</script>

<style scoped lang="scss">
.errorCheckBox{
     .error-check-layer {
      .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        .block {
          width: 1300px;
          min-height: 800px;
          border-radius: 20px;
          background: #ffffff;
          position: relative;
          padding-bottom: 30px;

          .layer-close {
            position: absolute;
            top: 0;
            right: 0;
            width: 100px;
            line-height: 100px;
            text-align: center;
            font-size: 50px;
            // color: #fff;
            color: #262626;
          }
          .error-check-page {
            position: absolute;
            right: 2%;
            top: 75%;
            font-size: 30px;
            color: #3D7EFF;
          }
          .error-check-header {
            font-size: 30px;
            display: flex;
            justify-content: center;
            width: 100%;
            border-radius: 20px 20px 0 0;
         
            background: #F7F7F7;
            font-family: Source Han Sans CN-Medium, Source Han Sans CN;
            font-weight: 500;
           
            // height: 100px;
            // line-height: 100px;
            // padding:0 100px 0 120px;

            padding:30px 100px 30px 120px;
            box-sizing: border-box;
            span {
              flex: 2;
               
              font-weight: 500;
              font-size: 30px;
              font-family: Source Han Sans CN-Regular, Source Han Sans CN;
             
              color: #262626;
              text-align: center;
              &:nth-child(1) {
                text-align: left;
                flex: 3;
              }
            }
          }

          .error-check-content {
            width: 1300px;
            height: 570px;
            border-bottom: 1px solid #D9DAE0;
            margin: 0 auto;
            font-size: 30px;
            box-sizing: border-box;
            overflow-y: scroll;
            -webkit-overflow-scrolling: auto;
            .error-check-content-wrap {
              .error-check-content-page {
                min-height: 550px;

                .error-check-content-page-title {
                  color: #FF4D4F;
                  margin-left: 50px;
                  line-height: 115px;
                }

                .error-check-content-page-process {
                  margin-left: 70px;
                  margin-bottom: 20px;
                }

                .error-check-content-page-num {
                  margin-left: 70px;
                  margin-bottom: 20px;
                }

                .error-check-content-page-reason {
                  margin-left: 70px;
                  margin-bottom: 35px;
                  white-space: pre-line;
                }

                .error-check-content-page-pic {
                  display: flex;
                  width: 944px;
                  justify-content: flex-start;
                  margin: 0 auto;

                  img {
                    width: 212px;
                    height: 159px;
                    margin-right: 50px;
                  }
                }
              }
            }
          }


          .error-check-button {
            width: 1080px;
            margin: 30px auto 0;
            display: flex;
            align-items: center;
            justify-content: center;

            button {
              width: 280px;
              height: 110px;
              border-radius: 20px;
              font-size: 40px;
              color: #ffffff;
              border: none;
            }

            .van-button--normal {
              background: #3D7EFF;
            }

            .van-button--disabled {
              background: #D9D9D9;
              color: #8C8C8C;
            }

          }
        }
      }
      
    }
}
</style>

