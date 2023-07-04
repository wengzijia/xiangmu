<template>
  <div class="finishTaskBox">
    <van-overlay :show="finishShow" @click="closeHiddenBox('finishShow')" class="finish-layer">
      <div class="wrapper" @click.stop="closeHiddenBox('finishShow')">
        <div class="block" @click.stop>
          <div class="block-content">
            <div class="inputBox">
              <div class="xiaji-input">
                <div class="pwd-title">良品数</div>
                <input type="number" ref="pwd" placeholder="请输入数量" v-model="finishData.onCount">
              </div>
              <div class="imgBox">
                <div class="pwd-title">下机图片</div>
                <div class="error-pic-content">
                  <van-field name="uploader">
                    <template #input>
                      <van-uploader v-model="uploader" 
                                    :max-count="1"
                                    :after-read="afterRead"
                                    :before-delete="beforeDelete"    
                      />
                    </template>
                  </van-field>
                </div>
              </div>
              <div class="jiaobanzhi-input" v-if="lossCountFlag">
                <div class="pwd-title">校版纸</div>
                <input type="number" ref="pwd" placeholder="请输入数量" v-model="finishData.lossCount">
              </div>
            </div>
            <div class="operation">
              <button @click="closeHiddenBox('finishShow')">取消</button>
              <button @click="confirmProduce()">确定</button>
            </div>
          </div>
          <span @click="closeHiddenBox('finishShow')" class="layer-close"><van-icon name="cross"/></span>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { fileUpload} from '@/api/producemain.js';
export default {
  name: "finishTask",
  data() {
    return {
      finishShow:true,//备注模块是否展示
      finishData:{
        onCount:null,
        lossCount:null,
        optionType:2,
      },
      lossCountFlag:true,
      uploader:[],//用户选择的图片
      uploaderUrl:[],//上传到服务器的图片

    }
  },
  created() {
    //工序id--5表示为粘盒，不需要校版纸数量
    const attributeId =this.$store.state.device.attributeId
    let attid = [5]
    this.lossCountFlag =  attid.indexOf(attributeId) >-1 ? false : true
  },
  methods: {
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
      this.$emit('setFinishTask',false)
    },
    confirmProduce() {
      const {lossCount,onCount} = this.finishData
      if(!onCount || !(/(^[1-9]\d*$)/.test(onCount))) return this.$toast('请输入正确的良品数')
      // if(!this.uploaderUrl||this.uploaderUrl.length==0) return this.$toast('请上传下机图片')
      if(this.lossCountFlag&&(!lossCount || !(/(^[1-9]\d*$)/.test(lossCount)))) return this.$toast('请输入正确的校板纸数量') 
      if(this.uploaderUrl&&this.uploaderUrl.length>0) this.finishData.onFinishImage = this.uploaderUrl[0]
      console.log(this.finishData)
      this.$emit('setFinishTask',this.finishData)

    },
     /**
     * 上传图片
     * @param {} file 
     */
     afterRead(file) {
      let formData = new FormData();
      formData.append("file", file.file)
      formData.append("folder", 'board/finish/')
      this.$toast.loading('图片上传中...')
      fileUpload(formData).then(res => {
        this.$toast.clear()
        if (res.code !== '000000'){//如果图片上传失败，需要将添加的图片删除
          const imgLength = this.uploader.length -1
          this.uploader.splice(imgLength, 1)
          return  this.$toast(res.message || '上传图片失败。')
        } 
        this.uploaderUrl.push(res.data)
      }, err => {
          this.$toast.clear()
          const imgLength = this.uploader.length -1
          this.uploader.splice(imgLength, 1)
          this.$toast(err.message || '上传图片失败。')
      })
    },
    /**
     * 删除图片
     * @param {*} file 
     * @param {*} obj 
     */
    beforeDelete(file, obj) {
      this.uploader.splice(obj.index, 1)
      this.uploaderUrl.splice(obj.index, 1)
    },
  },
  
}
</script>

<style scoped lang="scss">
.finishTaskBox{
     .finish-layer {
        .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;

        .block {
            width: 1300px;
            min-height: 600px;
            border-radius: 20px;
            padding:100px;
            background: #ffffff;
            position: relative;

            .block-content {
              width: 1022px;
              min-height: 300px;
              position: absolute;
             
              left: 50%;
             
              transform: translateX(-50%);
              .inputBox{
                padding-top: 100px;
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
              }
              .xiaji-input, .jiaobanzhi-input ,.imgBox{
                  width: 1022px;
                  height: 100px;
                  font-size: 40px;
                  color: #262626;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  white-space: nowrap;

                  .pwd-title {
                    line-height: 100px;
                    margin-right: 30px;
                    width: 160px;
                    text-align: right;
                    font-size: 40px;
                    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
                    font-weight: 600;
                    color: #262626;
                  }

                  input {
                    width: 832px;
                    height: 100px;
                    font-size: 30px;
                

                    background: #F2F3F7;
                    
                    border: none;
                    border-radius: 50px;
                    padding-left: 100px;
                    box-sizing: border-box;
                  }
              }

              .jiaobanzhi-input {
                  // margin-top: 90px;
              }
              .imgBox{
                height: 120px;
                margin:50px 0;
                .error-pic-content{
                  flex: 1;
                  /deep/ .van-cell {
              
                    .van-uploader__upload {
                      width: 200px;
                      height: 120px;
                      .van-icon-photograph {
                        // font-size: 60px;
                      }
                    }

                    .van-uploader__preview {
                      width: 200px;
                      height: 120px;
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
             
              .operation {
                  position: absolute;
                  left:0;
                  bottom: -100%;
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  button {
                    width: 280px;
                    height: 110px;

                    border-radius: 20px ;
                    font-size: 40px;
                    color: #8C8C8C;
                    background: #ffffff;
                    border: 2px solid #8C8C8C;
                    letter-spacing: 0.3em;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    &:nth-child(2) {
                        color: #FFFFFF;
                        background: #3D7EFF;
                        border: none;
                    }
                  }
              }
            }

            .layer-close {
              position: absolute;
              top: 0;
              right: 0;
              width: 100px;
              line-height: 100px;
              text-align: center;
              font-size: 50px;
              color: #8C8C8C;
            }
        }
        }
    }
}
</style>

