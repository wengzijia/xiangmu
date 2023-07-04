<template>
  <el-container>
    <el-main>
      <div class="catbj">
        <!--content start-->
        <div class="container clear">
          <!--主要内容-->

          <div class="catBox">
            <div class="row tableprompt">
              <strong style="font-size:18px;">友情提醒：</strong><br />
              <strong>1、用CorelDRAW 软件设计的文件请导出PDF格式上传文件，否则CDR格式文件会延时处理，因CDR格式文件产生的质量问题由客户自行承担</strong><br /><br />
              <strong>2、如您的设计文件中有"R"或"TM"的商标，请务必提供商标注册复印件和授权委托书（<a style="font-size:15px;color:#666;" href="/news/detail?id=92">样本</a>），以免耽误您订单印刷</strong><br /><br />
              <strong>3、如您的设计文件中使用了三色或四色混合(浅灰、灰、深灰、黑)、暗红色、墨绿色、蓝紫色、深紫色、深褐色、咖啡色等，建议您先在本平台打样跟色，否则，出现色差平台概不负责。</strong><br /><br /><br />
              <strong>如您寄过样品给拼一版跟色跟样，为确保跟色准确，请按拼一版跟色文件上传，不明白请找客服拿取文件。如本单已匹配打样/调色单，或未做来样跟色跟样，请忽略本条提示。</strong>
            </div>
            <div class="row tableheader">
              <input type="hidden" name="typebox" value="" />
              <a @click="toOrderList" class="removeMuch">订单号：{{ orderNo }}</a>
              <a @click="toOrderList"><span class="SettlementBtn">我的订单</span></a>
            </div>
            <table class="ShopCartTable tablebottom">
              <thead>
                <tr>
                  <th width="34%" class="selectLeft">
                    商品名称
                  </th>
                  <th width="50%" class="leftxt">规格</th>

                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(orderInfo, index) in orderList" :key="index">
                  <td width="34%" class="selectLeft">
                    <span class="inline"><img :src="orderInfo.coverPath" class="goodImg"/></span>
                    <span class="inline goodsName">
                      <h2 class="inline">{{ orderInfo.name }}</h2>
                    </span>
                  </td>
                  <td width="50%" class="danPrice gattr">{{ orderInfo.goodsAttr }}</td>
                  <td class="gongneng" v-if="orderInfo.goodsId == 959">
                    <div style="margin-bottom:6px;">
                      <span v-if="orderInfo.orderDocumentsInfo[0].fileUrl != '' && orderInfo.orderDocumentsInfo[0].fileUrl != null">
                        <span v-if="orderInfo.orderDocumentsInfo[0].docStatus === 3"> <span class="gree">部件1已上传</span><br /> </span>
                        <span v-else> <a v-bind:href="baseUrl + orderInfo.orderDocumentsInfo[0].fileUrl" target="_blank" class="lookBnt">[查看部件1文件]</a><br /> </span>
                      </span>
                      <div class="s2div" v-else>
                        <el-upload
                          class="uploadCompanyimg"
                          :headers="headers"
                          action="/api/consumer/order/miniSupplierOrders/updatePdfFile"
                          :data="{ orderDocId: orderInfo.id, folder: 'uploads/file', orderNo: orderInfo.orderNo, isPdf: 1 }"
                          :before-upload="beforeUpload"
                          :on-success="uploadSuccess"
                          :on-error="uploadError"
                          accept=".pdf,.ai,.cdr,.psd,.eps,.dxf,.jpg,.tiff,.png,.gif,.zip"
                        >
                          <el-button size="small" class="pass-portrait-filebtn-1025 uploadBtn">上传部件一文件</el-button>
                        </el-upload>
                      </div>
                    </div>
                    <div>
                      <span v-if="orderInfo.orderDocumentsInfo[1].fileUrl != '' && orderInfo.orderDocumentsInfo[1].fileUrl != null">
                        <span v-if="orderInfo.orderDocumentsInfo[1].docStatus === 3"> <span class="gree">部件2已上传</span><br /> </span>
                        <span v-else> <a v-bind:href="baseUrl + orderInfo.orderDocumentsInfo[1].fileUrl" target="_blank" class="lookBnt">[查看部件2文件]</a><br /> </span>
                      </span>
                      <div class="s2div" v-else>
                        <el-upload
                          class="uploadCompanyimg"
                          :headers="headers"
                          action="/api/consumer/order/miniSupplierOrders/updatePdfFile"
                          :data="{ orderDocId: orderInfo.id, folder: 'uploads/file', orderNo: orderInfo.orderNo }"
                          :before-upload="beforeUpload"
                          :on-success="uploadSuccess"
                          :on-error="uploadError"
                          accept=".pdf,.ai,.cdr,.psd,.eps,.dxf,.jpg,.tiff,.png,.gif,.zip"
                        >
                          <el-button size="small" class="pass-portrait-filebtn-1025 uploadBtn">上传部件二文件</el-button>
                        </el-upload>
                      </div>
                    </div>
                  </td>
                  <td class="gongneng" v-else>
                    <span v-show="orderInfo.orderDocumentsInfo[0].fileUrl != '' && orderInfo.orderDocumentsInfo[0].fileUrl != null">
                      <span v-show="orderInfo.orderDocumentsInfo[0].docStatus === 3"> <span class="gree">文件已上传</span><br /> </span>
                      <span v-show="orderInfo.orderDocumentsInfo[0].docStatus !== 3"> <a v-bind:href="baseUrl + orderInfo.orderDocumentsInfo[0].fileUrl" target="_blank" class="lookBnt">[查看上传文件]</a><br /> </span>
                    </span>
                    <div class="s2div" v-show="orderInfo.orderDocumentsInfo[0].fileUrl == '' || orderInfo.orderDocumentsInfo[0].fileUrl == null">
                      <span class="gree">未上传</span><br />
                      <el-upload
                        class="uploadCompanyimg"
                        style="margin:0 auto;"
                        :headers="headers"
                        action="/api/consumer/order/miniSupplierOrders/updatePdfFile"
                        :data="{ orderDocId: orderInfo.id, folder: 'uploads/file', orderNo: orderInfo.orderNo, isPdf: 1 }"
                        :before-upload="beforeUpload"
                        :on-success="uploadSuccess"
                        :on-error="uploadError"
                        accept=".pdf,.ai,.cdr,.psd,.eps,.dxf,.jpg,.tiff,.png,.gif,.zip"
                      >
                        <el-button class="uploadBtn"> 点击上传</el-button>
                      </el-upload>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!--content-->
      </div>
      <!--文件上传-->
      <div class="progreebar none" id="progreebar">
        <!-- the global progress bar -->
        <div class="layui-progress">
          <div class="layui-progress-bar" lay-percent="10%"></div>
        </div>
        <div class="loading">
          <img src="STATIC_PATH/upload/images/loading2.gif" id="loadingsrc" />
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { getMiniOrderList } from '@/api/order/orderFileUpload';
import { ACCESS_TOKEN } from '@/store/global-constant';

export default {
  name: 'orderGetFile',
  computed: {
    activeShow: function() {
      return '';
    }
  },
  data() {
    return {
      orderNo: '',
      orderList: [],
      headers: {
        token: localStorage.getItem(ACCESS_TOKEN),
        Authorization: localStorage.getItem(ACCESS_TOKEN)
      },
      baseUrl: '/api/consumer/certifyFree/alibaba/oss/viewFile?fileName='
    };
  },
  created() {
    this.orderNo = this.$route.query.orderNo;
    this.getOrderList();
  },
  methods: {
    toOrderList() {
      this.$router.push({ path: '/user/orderlist' });
    },
    getOrderList() {
      getMiniOrderList({ orderNo: this.orderNo }).then(res => {
        if (res.code === '000000') {
          let len = res.data.miniSupplierOrdersVo.length;
          let doc = [];
          // console.log('-------------- orderList -----------------');
          // console.log(res.data);
          if (len > 0) {
            // 重新赋值
            this.orderList = [];
            for (let sOrderList of res.data.miniSupplierOrdersVo) {
              for (let order of sOrderList.children) {
                doc = order.orderDocumentsInfo;
                if (order.orderDocumentsInfo == undefined || order.orderDocumentsInfo.length == 0) {
                  doc.push({ fileUrl: '' });
                  doc.push({ fileUrl: '' });
                }
                let data = {
                  id: order.id,
                  goodsId: order.goodsId,
                  name: order.name,
                  coverPath: order.coverPath,
                  goodsAttr: order.goodsAttr,
                  orderDocumentsInfo: doc,
                  orderNo: sOrderList.orderNo
                };
                // console.log(order.id);
                this.orderList.push(data);
              }
            }
            // console.log('------------ orderList -----------');
            // console.log(this.orderList);
          }
        }
      });
    },
    //上传文件的判断
    beforeUpload(file) {
      var fileName = file.name;
      const reg = /\.(pdf|ai|cdr|psd|eps|dxf|jpg|tiff|png|gif|zip)$/;
      const extension = reg.test(fileName);
      if (!extension) {
        this.$message({ type: 'error', message: "上传文件格式只能是 'pdf','ai','cdr','psd','eps','dxf','jpg','tiff', 'png', 'gif', 'zip'" });
      }
      return extension;
    },
    //上传成功的方法
    uploadSuccess(response, file, fileList) {
      if (response.code === '000000') {
        this.$message({
          type: 'success',
          message: '上传成功'
        });
        this.getOrderList();
      } else {
        this.$message({
          type: 'error',
          message: response.message
        });
      }
    },
    //上传失败执行的方法
    uploadError(err, file, fileList) {
      // console.log(err);
      // console.log(file);
      this.$message({
        type: 'error',
        message: err
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.tableprompt {
  margin-top: 0px;
}
.uploadBtn {
  width: 100px;
  height: 30px;
  margin: 6px 0 6px 0;
}
</style>
<style scoped src="../../static/index/css/shopping.css"></style>
<style scoped src="../../static/assets/layui/css/layui.css" media="all"></style>
<style scoped src="../../static/index/css/base.css"></style>
<style scoped src="../../static/index/css/new/fonts.css?v=201909001"></style>
<style scoped src="../../static/index/css/new/cart.css?v=201909001"></style>
