<template>
  <div class="errorReportBox">
    <van-overlay :show="errorReportShow" @click="closeHiddenBox('errorReportShow')" class="error-report-layer"
                 :lock-scroll="false">
      <div class="wrapper" @click="closeHiddenBox('errorReportShow')">
        <div class="block" @click.stop>

          <div class="error-report-header" v-if="attributeId != 48">
            <span>{{ curOrderInfo[keys] }}</span>
            <span>{{ curOrderInfo.paperSize}}</span>
            <span>{{attributeId==4 ? curOrderInfo.otherCraftInfo : curOrderInfo.subclassTypeName }}</span>
          </div>
          <div class="error-report-header" v-else >
            <span></span>
            <span>{{ curOrderInfo[keys] }}</span>
            <span></span>
          </div>

          <div class="error-report-content">
            <div class="error-order" v-if="attributeId != 10&&attributeId!=5">
              <div class="error-order-title">异常订单：</div>
              <div class="error-order-content">
                <div class="error-order-content-detail">
                  <van-checkbox @click="selectAll" class="select-all" v-model="checkAll" shape="square" name='all'>全选</van-checkbox>
                  <van-checkbox-group v-model="poCheckList" direction="horizontal" ref="checkboxGroup">
                    <van-checkbox :name="item" shape="square" v-for="(item,index) in curOrderInfo.poList"
                                  :key="index" @click="selectSingle">
                      {{ item }}
                    </van-checkbox>
                  </van-checkbox-group>
                </div>
              </div>
            </div>
            <div class="error-type"  >
              <div class="error-type-title">异常类型：</div>
              <div class="error-type-content" >
                <van-checkbox-group v-model="errorTypeList" direction="horizontal">
                  <van-checkbox v-for="(item,index) in errorTypesArr" :key="index"  :name="item.name" shape="square">{{item.value}}</van-checkbox>
                </van-checkbox-group>
              </div>
            </div>
            <div class="error-number">
              <div class="error-number-title">异常纸张数：</div>
              <div class="error-number-content"> 
                <van-radio-group v-model="errorReportForm.lossType" direction="horizontal">
                  <van-radio type="checkbox" shape="square" name="0" class="error-number-content-left">全部</van-radio>
                  <van-radio shape="square" name="1">
                    <input  class="other" v-model="errorReportForm.lossNum" type="number" placeholder="请输入数量" />
                  </van-radio>
                </van-radio-group>
              </div>
            </div>
            <div class="error-pic">
              <!-- <span style="color: red">*</span> -->
              <div class="error-pic-title">异常图片：</div>
              <div class="error-pic-content">
                <van-field name="uploader">
                  <template #input>
                    <van-uploader v-model="errorUploader" 
                                  :max-count="4"
                                  :after-read="afterRead"
                                  :before-delete="beforeDelete"   
                    />
                  </template>
                </van-field>
              </div>
            </div>
            <div class="error-remark">
              <div class="error-remark-title">异常备注：</div>
              <div class="error-remark-content">
                <textarea placeholder="请输入说明" v-model="errorReportForm.reason"  maxlength="200" > </textarea>
                <span>{{errorReportForm.reason.length + '/200'}}</span>
              </div>
            </div>
            
          </div>
          <div class="error-report-button">
            <button class="submit-button" @click="errorReportContinue('Y')">继续生产</button>
            <button class="cancel-button" @click="errorReportContinue('N')">停止生产</button>
            <button class="leave-button" @click="closeHiddenBox('errorReportShow')">退出</button>
          </div>
          <span @click="closeHiddenBox('errorReportShow')" class="layer-close"><van-icon name="cross"/></span>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { fileUpload, recordExceptionInfo } from '@/api/producemain.js';
import { getErrorTypesArr } from "@/utils/listTitle";
export default {
  name: "errorReport",
  props:['curOrderInfo'],
  data() {
    return {
      errorReportShow:true,//备注模块是否展示
      errorReportForm:{
        attributeExceptionType:'1',
        lossType:'0',
        lossNum:null,
        reason:'',
      },
      poCheckList:[],//选中的异常订单
      errorUploader:[],//用户选择的图片
      errorUploaderUrl:[],//上传到服务器的图片
      checkAll:true,
      attributeId:4,
      errorTypeList:['1'],//异常类型默认选择其他
      errorTypesArr:[],
      keys:'groupSn',

      
    }
  },
  created() {
    this.attributeId =this.$store.state.device.attributeId
  
    let attid = [5,10]
    this.keys =  attid.indexOf(this.attributeId) >-1 ? 'poSns' : 'groupSn'
    this.errorTypesArr = getErrorTypesArr()
  },
  mounted(){
    if(this.attributeId != 10&&this.attributeId!=5)this.$refs.checkboxGroup.toggleAll(true)
  },
  methods: {
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
      this.$emit('setFinishTaskType',false)
    },
     /**
     * 异常报备弹出框，点击继续生产按钮和停止生产按钮逻辑处理
     * @param {状态值} type Y---表示继续生产；N---表示停止生产
     */
    errorReportContinue(continueType) {
      const {lossType,lossNum} =  this.errorReportForm
      if (lossType == 1&&!(/(^[1-9]\d*$)/.test(lossNum))) return this.$toast.fail('请输入正确的异常纸张数。')
      // if (!this.errorUploaderUrl || this.errorUploaderUrl.length == 0) return this.$toast.fail('请上传异常图片。')
      
      let flag = false
      if(this.curOrderInfo.poSns&&this.curOrderInfo.poSns.length>0&&this.attributeId != 10&&this.attributeId!=5){
        flag = true//表示异常订单有数据
        if(this.poCheckList.length==0) return  this.$toast.fail('请最少选择一个异常订单。')
      }

      if(this.errorTypeList.length == 0) return this.$toast.fail('请选择异常类型。')
      this.errorReportForm.attributeExceptionType = this.errorTypeList.toString()

      const {groupSn,mainId,deviceId} = this.curOrderInfo
      const params ={
        continueType,// 是否继续生产 Y 是 N 否
        groupSn,//大版编号
        mainId,//大版id
        deviceId,//设备id
        deviceOperatorId: this.$store.state.device.deviceOperatorId,//机长id
        photoPath1: this.errorUploaderUrl.toString(),//损耗图片
        
      }
      if(lossType != 1) this.errorReportForm.lossNum = ''
       //如果异常订单没有数据，将大版号赋值当前字段；如果异常订单有数据，全选依然将大版号赋值当前字段，没有全选就传选择的异常订单选项
      if(this.attributeId != 10&&this.attributeId != 5) params.bwPoSns = flag ? (this.checkAll ? groupSn : this.poCheckList.toString()) : groupSn//电子看板记录异常的po集合 ,隔开
      if(this.attributeId == 10||this.attributeId == 5) params.bwPoSns = this.curOrderInfo.poSns // 如果是贴窗工艺或者是粘盒工艺，异常报备时不会有异常订单号，将po号赋值其中
      this.setRecordExceptionInfo(Object.assign(params,this.errorReportForm))

      
    },
     /**
     * 上传图片
     * @param {} file 
     */
    afterRead(file) {
      let formData = new FormData();
      formData.append("file", file.file)
      formData.append("folder", 'error/')
      this.$toast.loading('图片上传中...')
      fileUpload(formData).then(res => {
        this.$toast.clear()
        if (res.code !== '000000'){//如果图片上传失败，需要将添加的图片删除
          const imgLength = this.errorUploader.length -1
          this.errorUploader.splice(imgLength, 1)
          return  this.$toast(res.message || '上传图片失败。')
        } 
        this.errorUploaderUrl.push(res.data)
      }, err => {
         this.$toast.clear()
          const imgLength = this.errorUploader.length -1
          this.errorUploader.splice(imgLength, 1)
          this.$toast(err.message || '上传图片失败。')
      })
    },
    /**
     * 删除图片
     * @param {*} file 
     * @param {*} obj 
     */
    beforeDelete(file, obj) {
      this.errorUploader.splice(obj.index, 1)
      this.errorUploaderUrl.splice(obj.index, 1)
    },
     /**
     * 异常报备弹出框--选择异常订单--全选按钮
     */
    selectAll(){
      const poList = this.curOrderInfo.poList
      if(!poList || poList.length==0) return this.checkAll= true
      let totalLength = poList.length
      let checkboxLength = this.poCheckList.length
      if(checkboxLength === totalLength) return this.$refs.checkboxGroup.toggleAll()
      if(checkboxLength<totalLength){
        this.checkAll= true
        this.$refs.checkboxGroup.toggleAll(true)
      }
    },
    /**
     * 异常报备弹出框--选择异常订单--选择单项
     */
    selectSingle(){
      let totalLength = this.curOrderInfo.poList.length
      let checkboxLength = this.poCheckList.length
      if(checkboxLength<totalLength)  this.checkAll = false
      if(checkboxLength === totalLength) this.checkAll = true
    },

     /**
     * 异常报备弹出框，点击继续生产按钮和停止生产按钮逻辑处理
     * @param {状态值} continueType Y---表示继续生产；N---表示停止生产
     */
    setRecordExceptionInfo(params) {
      this.$toast.loading('加载中')
      recordExceptionInfo(params).then(res => {
        this.$toast.clear(true)
        if (res.code !== "000000") return  this.$toast(res.message || '服务异常。')
        params.continueType === 'Y' ?  this.$toast.success('报备成功，继续生产。') :  this.$toast.success('报备成功，停止生产。')
        this.$emit('setFinishTaskType',true)
      }, err => {
        this.$toast(err.message || '服务异常。')
      })
    },
  },
  
}
</script>

<style scoped lang="scss">
.errorReportBox{
  .error-report-layer {
    /deep/ .van-checkbox__icon{
      font-size: 40px !important;
    }
    /deep/ .van-radio__icon{  
      font-size: 40px !important;
    }

    /deep/ .van-checkbox__icon--checked .van-icon {
        color: #fff;
        background-color: #3D7EFF;
        border-color: #3D7EFF;
    }

    /deep/ .van-radio__icon--checked .van-icon {
        color: #fff;
        background-color: #3D7EFF;
        border-color: #3D7EFF;
    }
    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;

      .block {
        width: 1300px;
        min-height: 1000px;
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
          // font-size: 50px;

          color:#262626;
        }

        .error-report-header {
          font-size: 30px;
          display: flex;
          justify-content: center;
          background: #F7F7F7;
          color: #262626;
          border-radius: 20px 20px 0 0;
          font-family: Source Han Sans CN-Medium, Source Han Sans CN;
          font-weight: 500;
         
          // height: 100px;
          // line-height: 100px;
          padding:30px 0;

          span {
            margin-right: 150px;

            &:nth-child(1) {
              margin-left: 70px;
            }
          }
        }

        .error-report-content {
          width: 1160px;
          height: 740px;
          border-bottom: 1px solid #D9DAE0;
          margin: 0 auto 0;
          font-size: 30px;
          box-sizing: border-box;
          padding-top: 30px;
          overflow-y: scroll;
          padding-bottom: 50px;

          .error-order {
            width: 1160px;
            display: flex;
            .error-order-title {
              width: 180px;
              text-align: right;
              padding-top: 20px;
              box-sizing: border-box;
            }

            .error-order-content {
              width: 921px;
              display: flex;
              justify-content: space-between;
              flex-wrap: wrap;

              /deep/ .error-order-content-detail {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
                position: relative;
                .select-all{
                  width: 500px;
                  height: 80px;
                  vertical-align: top;
                  .van-checkbox__icon {
                    // background: white;
                    // font-size: 30px;
                  }
                }
                .van-checkbox-group {
                  width: 900px;
                  display: flex;
                  justify-content: space-between;
                  flex-wrap: wrap;

                  .van-checkbox {
                    width: 50%;
                    height: 80px;
                    vertical-align: top;
                    text-align: left;
                    margin: 0;
                    .van-checkbox__icon {
                      // background: white;
                      // font-size: 30px;
                    }
                  }

                }

                input[type='checkbox'] {
                  width: 30px;
                  height: 30px;
                  border-radius: 4px;
                  border: 1px solid #D9D9D9;
                }

                label {
                  line-height: 30px;
                }
              }
            }
          }

          .error-type {
            display: flex;
            margin-top: 30px;

            .error-type-title {
              width: 180px;
              text-align: right;
            }

            /deep/ .error-type-content {
              display: flex;
              flex:1;
              
              .van-checkbox--horizontal {
                  margin-right: 24px;
                  margin-bottom: 20px;
              }
              .van-checkbox__icon {
                // background: white;
                // font-size: 30px;
                // margin-right: 10px;
              }

              .van-checkbox__label {
                // width: 170px;
                // font-size: 30px;
                // color: #262626;
              }

            

            }
          }
        }

        .error-number {
          display: flex;
          margin-top: 0;

          .error-number-title {
            width: 180px;
            text-align: right;
            line-height: 120px;
          }

          /deep/ .error-number-content {
            display: flex;
            .other{
              height: 50px;
              line-height: 50px;
              background-color: #fff;
              width: 90%;
              padding-left:20px;
              box-sizing: border-box;
              border: 1px solid #D9D9D9;
              border-radius: 8px 8px 8px 8px;
              font-size: 25px;
              font-family: Source Han Sans CN-Regular, Source Han Sans CN;
              font-weight: 400;
            }
            .van-radio__icon {
              // background: white;
              // font-size: 30px;
              margin-right: 10px;
              // -webkit-border-radius: 30px;
              // -moz-border-radius: 30px;
              // border-radius: 30px;
            }

            .van-radio__label {
              font-size: 30px;
              color: #262626;

            }
            .van-cell__value{
              font-size: 30px;
            }

            .error-number-content-left {
              .van-radio__label {
                width: 180px;
              }
            }

            input[type='radio'] {
              opacity: 0;
            }

            label {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 90px;

              &::before {
                content: '';
                display: block;
                background: #ffffff;
                width: 30px;
                height: 30px;
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
                border: 1px solid #D9D9D9;
                opacity: 1;
                margin-right: 10px;
              }

              input[type='number'] {
                width: 280px;
                height: 45px;
                background: #FFFFFF;
                border-radius: 8px;
                border: 1px solid #D9D9D9;
                font-size: 25px;
                padding-left: 20px;
                box-sizing: border-box;
              }
            }

            input:checked + label::before {
              content: url("../../static/images/check.png");
              display: block;
              width: 30px;
              height: 30px;
              -webkit-border-radius: 4px;
              -moz-border-radius: 4px;
              border-radius: 4px;
              border: 1px solid #D9D9D9;
              opacity: 1;
              margin-right: 10px;
            }
          }
        }

        .error-pic {
          display: flex;
          margin-top: 0;

          .error-pic-title {
            width: 180px;
            text-align: right;
            span {
              font-size: 45px;
            }
          }

          .error-pic-content {
            display: flex;

            /deep/ .van-cell {
             
              .van-uploader__upload {
                width: 202px;
                height: 159px;
                .van-icon-photograph {
                  font-size: 90px;
                }
              }

              .van-uploader__preview {
                width: 200px;
                height: 159px;
                margin: 0 24px 10px 0;
                .van-image {
                  width: 100%;
                  height: 100%;
                }
              }

              .van-uploader__preview-delete {
                width: 40px;
                height: 40px;
                .van-icon {
                  font-size: 40px;
                }
              }

            }
          }


        }

        .error-remark {
          display: flex;
          margin-top: 30px;

          .error-remark-title {
            width: 180px;
            text-align: right;
          }

          .error-remark-content {
            display: flex;
            position: relative;
            textarea {
              width: 921px;
              min-height: 260px;
              background: #FFFFFF;
              border-radius: 8px;
              border: 1px solid #D9D9D9;
              padding:10px 10px 30px;
              box-sizing: border-box;
              resize: none;
            }
            span{
              position: absolute;
              bottom: 2px;
              right: 4px;
              color:#aaa;
            }
          }


        }

        .error-report-button {
          width: 1080px;
          margin: 30px auto 0;
          display: flex;
          justify-content: space-between;

          button {
            width: 300px;
            height: 110px;
            border-radius: 20px;
            font-size: 40px;
            color: #ffffff;
            border: none;
          }

          .submit-button {
            background: #3D7EFF;
          }

          .cancel-button {
            background: #FF4D4F;
          }

          .leave-button {
            background: #ffffff;
            color: #3D7EFF;
            border: 2px solid #3D7EFF;
            -webkit-border-radius: 20px;
            -moz-border-radius: 20px;
            border-radius: 20px;
          }
        }
      }
    }
  }
 
}
</style>

