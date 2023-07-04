<template>
  <div class="headerRightBox">
    <div class="header-right">
      <div v-if="remarkInfos">
        <div class="detail-title">备注</div>
        <ul class="remark">
          <li @click="showRemarkDetail('大版备注','groupRemark')" v-if="remarkInfos.groupRemark&&remarkInfos.groupRemark.content">
            <div>大版备注:</div>
            <div>{{remarkInfos.groupRemark.content }}</div>
          </li>
          <li @click="showRemarkDetail('注意事项','attentionRemark')" v-if="remarkInfos.attentionRemark&&remarkInfos.attentionRemark.content">
            <div>注意事项:</div>
            <div>{{remarkInfos.attentionRemark.content}}</div>
          </li>
          <li @click="showRemarkDetail('生产备注','productionPoRemarks')" v-if="remarkInfos.productionPoRemarks&&remarkInfos.productionPoRemarks.length>0">
            <div>生产备注:</div>
            <div>{{remarkInfos.productionPoRemarks[0].poSn}} </div>
          </li>
          <li @click="showRemarkDetail('质量要求备注','qualityPoRemarks')" v-if="remarkInfos.qualityPoRemarks&&remarkInfos.qualityPoRemarks.length>0">
            <div>质量要求备注:</div>
            <div>{{remarkInfos.qualityPoRemarks[0].poSn}} </div>
          </li>
        </ul>
      </div>
      <div class="no-order" v-else >
        <img :src="frameImg" alt="">
        <p>暂无备注信息</p>
      </div>
    </div>
    <!-- 查看备注弹出框 -->
    <van-overlay :show="remarkShow" @click="closeHiddenBox('remarkShow')" class="remark-layer" :lock-scroll="false"  @touch.stop>   
      <div class="remark-wrapper" @click="closeHiddenBox('remarkShow')">
        <div class="remark-content" @click.stop>
          <div class="remark-detail-header" v-if="remarkInfos&&attributeId != 8">
            <span >{{ remarkInfos[keys] }}</span> 
            <span>{{ remarkInfos.paperSize}}</span> 
            <span>{{ attributeId == 4 ? remarkInfos.otherCraftInfo : remarkInfos.subclassTypeName }}</span>
          </div>
          <div class="remark-detail-header" v-if="remarkInfos&&attributeId == 8">
            <span ></span> 
            <span>{{ remarkInfos[keys]}}</span> 
            <span></span>
          </div>

          <div class="remark-detail-content">
            <div class="remark-detail-content-title">{{ title }}</div>
            <ul class="remark-detail-content-wrapper">
              <li v-for="(item,index) in remarkDetail" :key="index"  >
                <div v-if="item.content" class="remark-detail-content-card">
                  <div class="remark-detail-list-po">{{ item.poSn || item[keys] }}</div>
                  <div class="remark-detail-list-content">{{ item.content }}</div>
                </div>
              </li>
            </ul>
          </div>
          <span @click="closeHiddenBox('remarkShow')" class="layer-close"><van-icon name="cross"/></span>
        </div>
      </div>
    </van-overlay>

  </div>
</template>

<script>
export default {
  name: "headerRight",
  props:['remarkInfos'],
  data() {
    return {
      remarkShow: false,//查看备注模态框是否开启
      frameImg: require('../../static/images/noData.png'),
      title:null,
      remarkDetail:[],
      attributeId:null,
      keys:'groupSn'
    }
  },
  created() {
    this.attributeId =this.$store.state.device.attributeId
    let attid = [5,10]
    this.keys =  attid.indexOf(this.attributeId) >-1 ? 'poSns' : 'groupSn'

    
  },

  methods: {
    
      
      /**
     * 点击查看备注，获取弹出框需要渲染的数据
     * @param {弹出框标题} title 
     * @param {弹出框渲染数据的取值字段} key 
     */
    showRemarkDetail(title,key) {
      this.openHiddenBox('remarkShow')
      this.title = title
      this.remarkDetail = []
      this.remarkDetail = key == 'groupRemark' || key == 'attentionRemark' ? [this.remarkInfos[key]] :  this.remarkInfos[key]
    },
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
    },
   
  },
  
}
</script>

<style scoped lang="scss">
.headerRightBox{
    width: 100%;
    min-height: 730px;
    background: #ffffff;
    border-radius: 10px;
    .header-right {
      width: 550px;
      background: #ffffff;
      box-sizing: border-box;
      border-radius: 10px;
      min-height: 730px;
      .no-order {
        min-height: 730px;
        width: 100%;
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
        font-size: 30px;
        margin-top: 30px;
        margin-left: 30px;
      }

      .remark {
        margin-left: 30px;
        margin-top: 32px;
        width: 490px;
        height: 524px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        li {
          width: 100%;
          height: 116px;
          background: #F8F8FA;
          border-radius: 10px;
          box-sizing: border-box;
          font-size: 25px;
          padding: 15px;
          color: #8C8C8C;
          margin-bottom: 20px;

          div {
            line-height: 30px;
            height: 30px;
            overflow: hidden;
            text-overflow: ellipsis; //超出部分以省略号显示
            white-space: nowrap;
            width: 15em; //用px单位亦可行
            &:nth-child(1) {
              margin-bottom: 15px;
            }
          }
        }
      }
    }
    .remark-layer {
      .remark-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        .remark-content {
          position: relative;
          width: 1300px;
          min-height: 800px;
          background-color: #fff;
          border-radius: 20px;
          box-sizing: border-box;
          .remark-detail-header {
            // height: 100px;
            // line-height: 100px;
            padding:30px 0;

            background: #F7F7F7; 

            color: #262626;
            border-radius: 20px 20px 0 0;
            margin-bottom: 23px;
            display: flex;
            justify-content: center;
            font-size: 30px;
            font-family: Source Han Sans CN-Medium, Source Han Sans CN;
            font-weight: 500;
           
            span {
              // margin-right: 150px;
              padding:0 50px;
            }
            >span:last-child{
              padding-right: 100px;
             
             
            }
          }

          .remark-detail-content {
            width: 1160px;
            height: 660px;
          
            -webkit-border-radius: 8px;
            -moz-border-radius: 8px;
            border-radius: 8px;
            box-sizing: border-box;
            padding-top: 30px;
            padding-left: 120px;
            overflow-y: scroll;

            .remark-detail-content-title {
              font-size: 36px;
              font-family: Source Han Sans CN-Regular, Source Han Sans CN;
              font-weight: 500;
              color: #262626;
            }

            .remark-detail-content-wrapper {
              margin-top: 25px;
              width: 1060px;
              overflow-y: scroll;
              overflow-x: hidden;
              .remark-detail-content-card {
                width: 1060px;
                background: #F7F7F7;
                min-height: 120px;
                padding:15px  30px;
                box-sizing: border-box;
                border-radius: 4px;
                margin-bottom: 20px;
                font-size: 25px;
                font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                font-weight: 400;
                color: #595959;
                .remark-detail-list-content {
                  margin-top: 15px;
                  width: 800px;
                  letter-spacing: 0.1em;
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
            // font-size: 50px;

            color:#262626;

          }
        }


      }
    }

}
</style>

