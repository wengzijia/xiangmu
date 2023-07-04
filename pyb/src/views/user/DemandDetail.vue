<template>
  <div>
    <!--main start-->
    <el-main>
      <div class="right_List">
        <div class="UP_right_List">打样详情</div>
        <div class="homeInfo_New">
          <div class="boxDetails">
            <div class="Essential_information">
              <h1 class="titleYous yoursBox">打样信息</h1>
            </div>
            <div class="yousBox_Detail">
              <table class="yousBox_Hd">
                <tbody>
                  <tr class="tr_th">
                    <td class="yousBox01">打样详情</td>
                    <td class="yousBox01">设计文件</td>
                  </tr>
                </tbody>
              </table>
              <table class="yousBox_Main">
                <tbody>
                  <div class="yousBox_MainDv" v-for="(info, index) in proofInfos" :key="index">
                    <tr class="tr_th">
                      <td class="yousBox01 BoxNum">
                        <span class="">订单编号：</span>
                        <a href="javascript:;">{{ proofOrder.orderSn }}</a>
                        <span style="color: red;margin-left: 10px;">预计发货时间：{{ info.outTime }}</span>
                      </td>
                      <td class="yousBox02">
                        <span>购买数量：</span>
                        <span class="numberAdd">{{ info.num }}X{{ info.fnumber }}</span>
                      </td>
                      <td class="yousBox02">
                        <span>总价：</span>
                        <span class="everyPrice">￥{{ info.amount }}</span>
                      </td>
                    </tr>
                    <tr class="tr_thNew" style="clear: both;">
                      <td class="yousBox01 ImgPart">
                        <div class="goodsFont">
                          <p class="goodsFont_One">
                            <a href="javascript:;" class="Hd_goodsName">{{ info.goodsAttr }}</a>
                          </p>
                        </div>
                      </td>
                      <td class="yousBox01 Two_Part">
                        <div v-if="info.files != null && info.files.fileUrl != ''">
                          <div v-if="info.files.status == 3">
                            文件已上传
                          </div>
                          <a v-else style="align-self: center" :href="baseUrl + info.files.fileUrl" target="_blank">{{ info.files.fileName }}</a>
                        </div>
                        <div v-else>
                          【请上传设计文件】
                          <span class="wbb1022CommodityPrice-span fileupload" data-id="{$info.files.file_id}" data-no="{$demand_info.order_sn|default=''}" data-save="1">
                            <el-upload
                              :headers="headers"
                              :show-file-list="false"
                              action="/api/consumer/proof/miniProof/uploadProofPdfFile"
                              :data="{ proofInfoId: info.id, orderSn: proofOrder.orderSn, folder: 'uploads/file' }"
                              :before-upload="beforeUpload"
                              :on-success="uploadSuccess"
                              :on-error="uploadError"
                              accept=".pdf,.ai,.cdr,.psd,.eps,.dxf,.jpg,.tiff,.png,.gif,.zip"
                            >
                              <input class="wbb1022Button" style="padding: 4px 8px;height: auto;" value="上传文件" type="button" />
                            </el-upload>
                          </span>
                        </div>
                        <div v-if="info.files != null && info.files.status == 2">退回原因：{{ info.files.note }}</div>
                      </td>
                      <td class="yousBox02 Two_Part" style="padding-right:10px;">
                        <div v-if="proofOrder.type == 2">
                          <br />
                          <a v-if="info.files.fileUrl != ''" class="layui-btn layui-btn-normal layui-btn-sm" :href="info.files.fileUrl" target="_blank">查看正稿文件</a><br /><br />
                        </div>
                        <el-button type="warning" v-if="proofOrder.type == 3 && proofOrder.confirmTime == '' && proofOrder.expressNo != ''" class="layui-btn layui-btn-normal layui-btn-sm submit_file" @click="openConfirm(proofOrder.id)">
                          确认订单
                        </el-button>
                      </td>
                    </tr>
                  </div>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-if="proofOrder.diffOrder != null">
          <div v-for="(vo, index) in proofOrder.diffOrder" :key="index" class="homeInfo_New">
            <div class="boxDetails">
              <div class="Essential_information">
                <h1 class="titleYous yoursBox">补差价订单</h1>
              </div>
              <div class="Consignee_Part">
                <table class="Consignee_List">
                  <tr>
                    <td class="left_Consignee">差价单号</td>
                    <td class="right_Consignee">{{ vo.orderNo }}</td>
                  </tr>
                  <tr>
                    <td class="left_Consignee">差价金额</td>
                    <td class="right_Consignee">{{ vo.diffMoney }}</td>
                  </tr>
                  <tr>
                    <td class="left_Consignee">差价描述</td>
                    <td class="right_Consignee">{{ vo.diffDesc }}</td>
                  </tr>
                  <tr>
                    <td class="left_Consignee">支付状态</td>
                    <td class="right_Consignee pay_status">
                      <div v-if="vo.status == 'paid'">
                        已支付
                      </div>
                      <div v-else>
                        未支付
                      </div>
                    </td>
                  </tr>
                  <tr v-if="vo.status != 'paid'" class="paybtn">
                    <td class="left_Consignee"></td>
                    <td class="right_Consignee">
                      <button class="layui-btn layui-btn-danger layui-btn-sm diff_pay" data-val="{$vo.order_no}" @click="toPayDiffOrder(vo.orderNo)">去付款</button>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="homeInfo_New">
          <div class="boxDetails">
            <div class="Essential_information">
              <h1 class="titleYous yoursBox">备注信息</h1>
            </div>
            <div class="Consignee_Part">
              <table class="Consignee_List">
                <tbody>
                  <tr>
                    <td class="left_Consignee">备注信息</td>
                    <td class="right_Consignee">{{ proofOrder.memo }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div v-if="proofOrder.designerId == 26" class="homeInfo_New">
          <div class="boxDetails">
            <div class="Essential_information">
              <h1 class="titleYous yoursBox">门店信息</h1>
            </div>
            <div class="Consignee_Part">
              <table class="Consignee_List">
                <tbody>
                  <tr>
                    <td class="left_Consignee">门店名称</td>
                    <td class="right_Consignee">{{ proofOrder.designerInfos.companyname }}</td>
                  </tr>
                  <tr>
                    <td class="left_Consignee">门店地址</td>
                    <td class="right_Consignee">{{ proofOrder.designerInfos.city }}{{ proofOrder.designerInfos.address }}</td>
                  </tr>
                  <tr>
                    <td class="left_Consignee">联系人</td>
                    <td class="right_Consignee">{{ proofOrder.designerInfos.contacts }}</td>
                  </tr>
                  <tr>
                    <td class="left_Consignee">联系电话</td>
                    <td class="right_Consignee">{{ proofOrder.designerInfos.tel }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="homeInfo_New">
          <div class="boxDetails">
            <div class="Essential_information">
              <h1 class="titleYous yoursBox">联系信息</h1>
            </div>
            <div class="Consignee_Part">
              <table class="Consignee_List">
                <tbody>
                  <tr>
                    <td class="left_Consignee">联系人</td>
                    <td class="right_Consignee">{{ proofOrder.consigneeName }}</td>
                  </tr>
                  <tr>
                    <td class="left_Consignee">联系地址</td>
                    <td class="right_Consignee">{{ proofOrder.address }}</td>
                  </tr>
                  <tr>
                    <td class="left_Consignee">联系电话</td>
                    <td class="right_Consignee">{{ proofOrder.tel }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="homeInfo_New">
          <div class="boxDetails">
            <div class="Essential_information">
              <h1 class="titleYous yoursBox">物流信息</h1>
            </div>
            <div class="Consignee_Part">
              <table class="Consignee_List">
                <tbody>
                  <tr v-if="proofOrderTrack.shipping">
                    <td class="left_Consignee">配送方式</td>
                    <td class="right_Consignee">{{ proofOrderTrack.shipping }}</td>
                  </tr>
                  <tr v-if="proofOrderTrack.expressNo">
                    <td class="left_Consignee">配送单号</td>
                    <td class="right_Consignee">{{ proofOrderTrack.expressNo }}</td>
                  </tr>
                  <tr v-else>
                    <td class="left_Consignee">配送方式</td>
                    <td class="right_Consignee">暂无配送</td>
                  </tr>
                  <tr v-if="proofOrderTrack.trackRecord != null">
                    <td></td>
                    <td>
                      <div class="logisticsBox">
                        <h2 class="logisticsH2">
                          <span class="logLtx">运单号:&nbsp;&nbsp;{{ proofOrderTrack.expressNo }}</span>
                          <span class="logRtx">
                            <!--0=>无轨迹 1=>已揽件 2=>在途中 3=>签收 4=>问题件-->
                            <div v-if="proofOrderTrack.state == 0">无轨迹</div>
                            <div v-if="proofOrderTrack.state == 1">已揽件</div>
                            <div v-if="proofOrderTrack.state == 2">在途中</div>
                            <div v-if="proofOrderTrack.state == 3">已签收</div>
                            <div v-if="proofOrderTrack.state == 4">问题件</div>
                          </span>
                        </h2>
                        <div v-if="proofOrderTrack.trackRecord != null" class="logisList">
                          <ul>
                            <template v-for="(vo, index) in proofOrderTrack.trackRecord">
                              <li v-if="index == 0" :key="index">
                                <span class="logNew">最新</span>
                                <div class="logListDv">
                                  <p class="logListDvtx red">{{ vo.trackDetail }}</p>
                                  <p class="logListTime">{{ formatSecond(vo.trackTime) }}</p>
                                </div>
                              </li>
                              <li :key="index" v-else>
                                <span class="logListCircle"></span>
                                <div class="logListDv">
                                  <p class="logListDvtx">{{ vo.trackDetail }}</p>
                                  <p class="logListTime">{{ formatSecond(vo.trackTime) }}</p>
                                </div>
                              </li>
                            </template>
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="homeInfo_New">
          <div class="boxDetails">
            <div class="Essential_information">
              <h1 class="titleYous yoursBox">结算信息</h1>
            </div>
            <div class="Consignee_Part">
              <table class="Consignee_List">
                <tbody>
                  <tr>
                    <td class="left_Consignee">订单总金额</td>
                    <td class="right_Consignee">打样金额：{{ proofOrder.amount }}元 + 运费：{{ proofOrder.shipfee }} = 订单总金额： {{ proofOrder.amount + proofOrder.shipfee }} 元</td>
                  </tr>
                  <tr v-if="proofOrder.payStatus < 1">
                    <td class="left_Consignee">支付信息</td>
                    <td class="right_Consignee"><a @click="toPayOrder" target="_blank" class="payOrder">去支付</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </el-main>
    <!--main end-->
  </div>
</template>

<script>
import { getAllProofOrder, ProofOrderSend } from '@/api/users/userDemandApi';
import { formatSecond } from '@/utils/timeUtil';

export default {
  data() {
    return {
      proofOrder: {},
      proofInfos: [],
      proofOrderTrack: {},
      headers: {
        token: localStorage.getItem('Access-Token'),
        Authorization: localStorage.getItem('Access-Token')
      },
      orderSn: '',
      baseUrl: '/api/consumer/certifyFree/alibaba/oss/viewFile?fileName=',
      subOrderId: ''
    };
  },
  created() {
    sessionStorage.clear();
  },
  methods: {
    ...{ formatSecond },
    listProofOrderDetail() {
      getAllProofOrder({ orderSn: this.orderSn })
        .then(res => {
          this.$set(this, 'proofOrder', res.data[0]);
          this.$set(this, 'proofInfos', res.data[0].proofInfos);
          this.$set(this, 'proofOrderTrack', res.data[0].orderTrack);
        })
        .catch(err => {
          console.log(err.message);
        });
    },
    //上传成功的方法
    uploadSuccess(response, file, fileList) {
      if (response.success) {
        this.listProofOrderDetail();
        this.$message({
          type: 'success',
          message: '上传成功'
        });
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
      this.$message({
        type: 'error',
        message: '上传失败'
      });
    },
    openConfirm(id) {
      this.$confirm('确认完成打样订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(() => {
          ProofOrderSend({ id: id })
            .then(res => {
              if (res.success) {
                this.listProofOrderDetail();
                this.$message({
                  type: 'success',
                  message: '确认成功!'
                });
              } else {
                this.$message({
                  type: 'error',
                  message: res.message
                });
              }
            })
            .catch(err => {
              // console.log(err);
              this.$message({
                type: 'error',
                message: '确认失败!'
              });
            });
        })
        .catch(() => {});
    },
    // 去支付
    toPayOrder() {
      this.$router.push({ path: '/service/getpay', query: { orderNo: this.proofOrder.supOrderNo, subOrderId: this.proofOrder.orderSn } });
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
    // 补差价
    toPayDiffOrder(orderNo) {
      // this.diffDialog = true;
      let routerPath = { path: '/user/demanddetail', query: { id: this.proofOrder.orderSn } };
      sessionStorage.setItem('cachePath', JSON.stringify(routerPath));
      this.$router.push({ path: '/service/diffpay', query: { orderNo: orderNo } });
    }
  },

  mounted() {
    this.orderSn = this.$route.query.id;
    this.listProofOrderDetail();
  }
};
</script>

<style scope src="../../static/index/user/css/reset.css" />
<style scope src="../../static/index/user/css/all.css?0621" />
<style scope src="../../static/index/user/css/foot.css" />
<style scope src="../../static/index/user/css/main.css" />
<style scoped>
.wbb1022File {
  cursor: pointer;
}
.payOrder {
  padding: 5px 10px;
  text-indent: 0;
}

.paydiv {
  width: 150px;
  margin: 25px auto 0;
}

.floatleft {
  float: left;
}

.right_Consignee .floatleft {
  top: 6px;
  margin-right: 10px;
}

.goodsFont .goodsFont_One {
  width: 300px;
  padding: 10px;
  padding-left: 15px;
}

.payOrder {
  margin: 5px 0 5px 0;
}

.logisticsBox {
  background: #fff;
  padding: 0 25px 25px;
  color: #131313;
  margin-bottom: 20px;
  position: relative;
  text-indent: 0;
}

.logisticsH2 {
  margin-bottom: 10px;
  position: relative;
  border-bottom: 1px solid #e9e9ee;
  line-height: 46px;
  font-weight: normal;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
}

.logRtx {
  color: #1bc723;
  font-size: 15px;
}

.logisList {
  background-color: #fff;
}

.logisList ul {
  padding: 10px 0 0 20px;
}

.logisList li {
  border-left: 1px solid #e9e9ee;
  position: relative;
}

.logNew {
  width: 40px;
  height: 17px;
  line-height: 17px;
  background: #fd000d;
  color: #fff;
  left: -20px;
  top: 8px;
  border-radius: 0;
  padding: 0;
  border: 0;
  text-align: center;
  font-size: 12px;
  display: block;
  position: absolute;
}

.logListCircle {
  display: block;
  width: 8px;
  height: 8px;
  padding: 2px;
  background: #fff;
  border: 1px solid #33a2f7;
  border-radius: 100%;
  position: absolute;
  left: -7px;
  top: 6px;
  z-index: 2;
}

.logListCircle::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: #33a2f7;
  border-radius: 100%;
}

.logListDv {
  padding-left: 40px;
  position: relative;
  padding-bottom: 10px;
}

.logListDvtx {
  font-size: 14px;
}

.logListTime {
  font-size: 12px;
  color: #a1a1a1;
  line-height: 22px;
  padding-left: 6px;
}

.red {
  color: #fd000d;
}
</style>
