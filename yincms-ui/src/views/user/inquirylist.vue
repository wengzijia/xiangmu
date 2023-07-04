<template>
  <div>
    <!--main start-->
    <el-main>
      <div class="right_List">
        <div class="UP_right_List">询价订单</div>
        <div class="homeInfo_New">
          <div class="boxDetails">
            <div class="mt_HdList">
              <ul class="extra_Left">
                <li><a :class="payStatus != 0 ? 'trrOne' : ''" @click="payStatus = -1">全部订单</a></li>
                <li><a :class="payStatus == 0 ? 'trrOne' : ''" @click="payStatus = 0">待付款</a></li>
              </ul>
              <div class="mt_HdList-Right">
                <div class="searchBox">
                  <input type="text" name="orderkey" class="inputGoods_Name" placeholder="询价单号" v-model="orderkey" style="color: rgb(204, 204, 204)" />
                  <a href="javascript:;" class="searchBtn findOrder" @click="listDemandList({ orderSn: orderkey })">搜索<b> </b></a>
                </div>
              </div>
            </div>
            <div class="md_MainList">
              <table class="td-void order-tb">
                <colgroup>
                  <col class="number-col" />
                  <col class="consignee-col" />
                  <col class="consignee-col amount-col" />
                  <col class="consignee-col status-col" />
                  <col class="consignee-col operate-col" />
                </colgroup>
                <thead>
                  <tr>
                    <th>
                      <div class="order_detail_txt">货品规格</div>
                    </th>
                    <th colspan="2">订单金额</th>
                    <th>订单状态</th>
                    <th>
                      交易操作
                      <!-- <div class="ordertime_cont deal-state-cont">
                        <el-dropdown @command="handleCommand">
                          <span class="el-dropdown-link"> {{ statusStr }}<i class="el-icon-arrow-down el-icon--right"></i> </span>
                          <span class="blank"></span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="1">全部状态</el-dropdown-item>
                            <el-dropdown-item command="0">等待付款</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div> -->
                    </th>
                    <!-- <th>其他</th> -->
                  </tr>
                </thead>
                <tbody v-for="(order, index) in demandList" :key="index">
                  <tr class="sep-row">
                    <td colspan="5"></td>
                  </tr>
                  <tr class="tr-th">
                    <td colspan="5">
                      <span class="dealtime">{{ formatSecond(order.addTime) }}</span>
                      <span class="numberTatle"
                        >询价单号：<span>{{ order.orderSn }}</span></span
                      >
                      <!-- <span style="margin-left: 20px" v-if="order.designerInfos">{{ order.designerInfos.companyname }}:{{ order.designerInfos.contacts }}-{{ order.designerInfos.tel }}</span> -->
                      <span v-if="order.orderType == 1" style="margin-left: 20px; color: red">大货适配打样</span>
                    </td>
                  </tr>
                  <tr v-for="(info, index1) in order.proofInfos" :key="index1" class="track57442710364">
                    <td>
                      <div class="p_911672" style="width: 265px;margin-right:0">
                        <div class="goodsFont" style="padding-left: 15px; max-width: 100%">
                          <!-- <p class="goodsFont_One" v-if="order.orderType == 5"> -->
                          <p class="goodsFont_One" style="width: 100%">
                            <a href="javascript:;" class="Hd_goodsName" style="font-weight: 600; font-size: 13px">
                              精装盒-定制精装盒
                            </a>
                          </p>
                          <p class="goodsFont_One" style="width: 100%">
                            <a href="javascript:;" class="Hd_goodsName"> 设计稿:{{ order.proofInfos[0].goodsAttr }}; </a>
                            产品名称:{{ order.customName }}
                          </p>
                          <p class="goodsFont_One" style="width: 100%; max-height: 85px">
                            {{ order.memo }}
                          </p>
                          <!-- <p class="goodsFont_One" v-if="order.orderType == 5 && info.goodsId">
                            <a href="javascript:;" class="Hd_goodsName">{{ info.goodsName }}</a>
                          </p>
                          <p class="goodsFont_One">
                            <a href="javascript:;" class="Hd_goodsName">{{ info.goodsAttr }}</a>
                          </p> -->
                        </div>
                      </div>
                      <div class="right_P911672" style="fone-size: 12px;float:right;margin-right:5px">
                        <a v-if="order.proofInfos[0].designFileUrl" style="text-decoration: underline" target="_blank" :href="'/api/consumer/certifyFree/alibaba/oss/viewFile?fileName=' + order.proofInfos[0].designFileUrl" class="lookfile"
                          >查看上传文件</a
                        >
                        <span class="lookfile" style="color: #029018; margin-right: 55px" v-else>未上传</span>
                        X{{ info.num }}
                      </div>
                      <br /><br />

                      <!-- <div v-if="order.orderType != 5" class="right_P911672">X{{ info.fnumber }}款</div> -->
                    </td>
                    <td v-if="index1 == 0" style="vertical-align: middle;" :rowspan="order.proofInfos.length" colspan="2">
                      <!-- <div class="consigneeName consigneeName01">
                        <span>123</span>
                      </div> -->
                      <div class="amount amount01">
                        <template v-if="order.bigSupOrderNo">
                          <div v-if="order.miniOrders">
                            <p v-if="order.miniOrders.miniSupplierOrdersVo[0].status === 'nopaid'" class="center"></p>
                            <p class="center" v-else-if="order.miniOrders.miniSupplierOrdersVo[0].status === 'paid' && order.miniOrders.confirmTime > 1 && order.miniOrders.status != 'shipped'">待发货</p>
                            <p class="center" v-else-if="order.miniOrders.miniSupplierOrdersVo[0].status === 'shipped'">已发货</p>
                            <p class="center" v-else-if="order.miniOrders.miniSupplierOrdersVo[0].status === 'cancel'">大货订单取消</p>
                            <p class="center" v-else-if="order.miniOrders.miniSupplierOrdersVo[0].status === 'stoped'">已终止</p>
                          </div>
                          <template v-if="order.amount">
                            <b style="color: #000">设计打样费：</b>
                            <span style="color: red"> {{ order.amount }}; </span>
                            <br />
                            (含设计费:{{ order.designAmount }};打样费:{{ order.proofAmount }};)
                          </template>
                          <p v-if="order.miniOrders">
                            <br />
                            <b style="color: #000">大货金额：</b><span style="color: red">{{ order.miniOrders.amount }}</span>
                            <br />
                            (含运费:{{ order.shipfee }})
                            <br />
                          </p>
                          <p v-if="order.miniOrders">
                            <br />
                            <b style="color: #000">总金额：</b><span style="color: red">{{ (order.miniOrders.amount + order.amount).toFixed(2) }}</span>
                          </p>
                          <!-- <span>{{order.proofInfos[0].agentFileMap[16][0].fileUrl}}</span> -->
                        </template>
                        <template v-else>
                          <span v-if="order.amount">
                            <b style="color: #000">设计打样费：</b>
                            <span style="color: red" v-if="order.amount"> {{ order.amount }}; </span>
                            <br />
                            (含设计费:{{ order.designAmount }};打样费:{{ order.proofAmount }};)
                          </span>
                          <!-- <p class="center" v-if="order.amount&&order.payStatus">已付设计打样费</p>
                        <p class="center" v-else-if="!order.payStatus&&order.amount">待付设计打样费</p> -->
                          <h3 class="center" style="color: red" v-else>待报价</h3>
                        </template>
                        <!-- designAmount 设计费
                             proofAmount 打样费
                             -->
                      </div>
                    </td>
                    <td v-if="index1 == 0" style="vertical-align: middle" :rowspan="order.proofInfos.length">
                      <p class="center" v-if="order.proofInfos[0].createpdf"><a style="color:red" :href="'http://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/' + order.proofInfos[0].createpdf" target="_blank" alt="">查看报价单</a></p>
                      <template v-if="order.bigSupOrderNo">
                        <div v-if="order.miniOrders">
                          <p v-if="order.miniOrders.miniSupplierOrdersVo[0].status === 'nopaid'" class="center">待付货款</p>
                          <p class="center" v-else-if="order.miniOrders.miniSupplierOrdersVo[0].status === 'paid'">已付款</p>
                          <p class="center" v-else-if="order.miniOrders.miniSupplierOrdersVo[0].status === 'shipped'">已发货</p>
                          <p class="center" v-else-if="order.miniOrders.miniSupplierOrdersVo[0].status === 'cancel'">大货订单取消</p>
                          <p class="center" v-else-if="order.miniOrders.miniSupplierOrdersVo[0].status === 'stoped'">已终止</p>
                        </div>
                        <p class="center" v-else>大货待报价</p>
                      </template>
                      <template v-else>
                        <p class="center" v-if="order.amount && order.payStatus">已付设计打样费</p>
                        <p class="center" v-else-if="!order.payStatus && order.amount">待付设计打样费</p>
                        <h3 class="center" style="color: red" v-else>待报价</h3>
                      </template>
                    </td>
                    <td v-if="index1 == 0" class="center" style="vertical-align: middle" :rowspan="order.proofInfos.length">
                      <template v-if="order.bigSupOrderNo">
                        <a v-if="order.miniOrders && order.payStatus && order.miniOrders.miniSupplierOrdersVo[0].status === 'nopaid'" @click="toPayOrder(order, 0)" target="_blank" class="payOrder">付款</a>
                        <br />
                        <a :href="'/user/orderdetail?orderNo=' + order.bigSupOrderNo" class="OrderDetail" target="_blank">订单详情</a>
                      </template>
                      <template v-else>
                        <a v-if="!order.payStatus && order.amount" @click="toPayOrder(order, 1)" target="_blank" class="payOrder">付款</a>
                        <p class="center" v-if="order.amount && order.payStatus">已付设计打样费</p>
                        <p class="center" v-else-if="!order.payStatus && order.amount">待付设计打样费</p>
                        <h3 class="center" style="color: red" v-else>待报价</h3>
                      </template>

                      <!-- <div v-if="order.payStatus == 0">
                        <div v-if="order.amount != 0">
                          <div class="amount finishOrder finishOrder01">
                            <a @click="toPayOrder(order)" target="_blank" class="payOrder">付款</a>
                          </div>
                        </div>
                      </div>
                      <div v-else>
                        <div class="amount finishOrder finishOrder01">已付款</div>
                      </div>
                      <div v-if="order.ordersRefundsInfo != null">
                        <div v-if="order.ordersRefundsInfo.status == '1'" class="amount finishOrder finishOrder01">
                          <a href="javascript:;" class=" payOrder">客服处理中</a>
                        </div>
                        <div v-else-if="order.ordersRefundsInfo.status == '2'" class="amount finishOrder finishOrder01">
                          <a href="javascript:;" class=" payOrder">退款审核中</a>
                        </div>
                        <div v-else-if="order.ordersRefundsInfo.status == '3'" class="amount finishOrder finishOrder01">
                          <a href="javascript:;" class=" payOrder">退款处理中</a>
                        </div>
                        <div v-else-if="order.ordersRefundsInfo.status == '4'" class="amount finishOrder finishOrder01">
                          <a href="javascript:;" class=" payOrder">已退款</a>
                        </div>
                      </div>
                      <div v-else-if="order.canRefund">
                        <div class="amount finishOrder finishOrder01">
                          <a href="javascript:;" class="wbb1201Modify1 payOrder" @click="openRefundDialog(order.orderSn)">退款申请</a>
                        </div>
                      </div>
                      <div v-if="order.orderType == 1 && order.confirmTime == 0 && order.expressNo != ''" class="amount">
                        <a href="javascript:;" class="payOrder" @click="bigAdaptation(order.orderSn)">确认大货适配</a>
                      </div>

                      <div v-if="order.orderType == 1 && order.confirmTime > 0 && order.expressNo != ''" class="amount finishOrder finishOrder01">
                        <span>适配确认时间:</span>
                        <br />
                        <span>{{ formatSecond(order.confirmTime) }}</span>
                      </div> -->
                    </td>
                    <!-- <td v-if="index1 == 0" :rowspan="order.proofInfos.length">
                      <div class="amount amount01">
                        <template v-if="order.bigSupOrderNo"> <a :href="'/user/orderdetail?orderNo=' + order.bigSupOrderNo" class="OrderDetail" target="_blank">订单详情</a><br /> </template>
                        <template v-else>
                          <a :href="'/user/demanddetail?id=' + order.orderSn" class="OrderDetail" target="_blank">订单详情</a>
                          待报价
                        </template>
                      </div>
                    </td> -->
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="w_page_0528" style="margin: 30px 0 0">
            <el-pagination background layout="prev, pager, next" :hide-on-single-page="value" :total="totalCount" :page-size="pageSize" :current-page="pageNumber" @current-change="handleCurrentChange"></el-pagination>
          </div>
        </div>
      </div>
    </el-main>
    <!--main end-->
    <!--dialog start-->
    <el-dialog title="退款申请" :visible.sync="dialogRefundFormVisible" :before-close="handleCloseDialog">
      <div>
        <el-form :model="refundReq" :rules="rules" ref="refundForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="退款原因：" :label-width="formLabelWidth" prop="moe">
            <el-input v-model="refundReq.moe" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('refundForm')">立即提交</el-button>
            <el-button @click="resetForm('refundForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--dialog end-->
    <!--dialog start-->
    <div>
      <div
        v-show="dialogConfirmFormVisible"
        class="sweet-alert showSweetAlert visible"
        data-custom-class=""
        data-has-cancel-button="true"
        data-has-confirm-button="true"
        data-allow-outside-click="false"
        data-has-done-function="true"
        data-animation="pop"
        data-timer="null"
        style="display: block; margin-top: -192px"
      >
        <div class="sa-icon sa-error" style="display: none">
          <span class="sa-x-mark">
            <span class="sa-line sa-left"></span>
            <span class="sa-line sa-right"></span>
          </span>
        </div>
        <div class="sa-icon sa-warning pulseWarning" style="display: block">
          <span class="sa-body pulseWarningIns"></span>
          <span class="sa-dot pulseWarningIns"></span>
        </div>
        <div class="sa-icon sa-info" style="display: none"></div>
        <div class="sa-icon sa-success" style="display: none">
          <span class="sa-line sa-tip"></span>
          <span class="sa-line sa-long"></span>

          <div class="sa-placeholder"></div>
          <div class="sa-fix"></div>
        </div>
        <div class="sa-icon sa-custom" style="display: none"></div>
        <h2>确认大货适配打样操作声明！</h2>
        <p style="display: block">尊敬的客户：请您认真检查样品盒型适配效果, 一旦确认适配效果后，非傲彩原因产生的适配问题概不受理,请您确保已经一 一仔细确认。</p>
        <fieldset>
          <input type="text" tabindex="3" placeholder="" />
          <div class="sa-input-error"></div>
        </fieldset>
        <div class="sa-error-container">
          <div class="icon">!</div>
          <p>Not valid!</p>
        </div>
        <div class="sa-button-container">
          <button
            class="cancel"
            tabindex="2"
            style="display: inline-block; box-shadow: none"
            @click="
              dialogConfirmFormVisible = false;
              orderSn = '';
            "
          >
            否，返回再次查看确认
          </button>
          <button class="confirm" tabindex="1" style="display: inline-block; background-color: rgb(236, 108, 98); box-shadow: rgba(236, 108, 98, 0.8) 0px 0px 2px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset" @click="confirmOrder()">
            是的，我已确认无误
          </button>
        </div>
      </div>
    </div>
    <!--dialog end-->
  </div>
</template>

<script>
import { formatSecond } from '@/utils/timeUtil';
import { getAllProofOrder, adaptationOrder } from '@/api/users/userDemandApi';
import { cancelOrder } from '@/api/order/orderApi';
import { createOrderRefund } from '@/api/order/orderRefundApi';

export default {
  data() {
    return {
      demandList: [],
      payStatus: -1,
      orderkey: '',
      orderSn: '',
      statusStr: '全部状态',
      pageNumber: 1,
      pageSize: 6,
      emptyQueryData: {
        pageNumber: 1,
        pageSize: 6,
        orderType: 8
      },
      value: true,
      totalCount: 0,
      refundReq: {
        moe: '',
        orderType: 2
      },
      dialogRefundFormVisible: false,
      dialogConfirmFormVisible: false,
      formLabelWidth: '120px',
      rules: {
        moe: [{ required: true, message: '输入退款原因', trigger: 'blur' }]
      }
    };
  },
  methods: {
    ...{ formatSecond },
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      if (this.payStatus == 0) {
        this.listDemandList({ payStatus: 0, pageNumber: pageNumber, pageSize: this.pageSize });
      } else {
        this.listDemandList({ pageNumber: pageNumber, pageSize: this.pageSize });
      }
    },
    handleCommand(command) {
      if (command == 0) {
        this.statusStr = '等待付款';
        this.payStatus = 0;
        this.listDemandList({ payStatus: 0, pageNumber: 1, pageSize: 6 });
        this.pageNumber = 1;
      } else {
        this.statusStr = '全部状态';
        this.payStatus = -1;
        this.listDemandList();
      }
    },
    openRefundDialog(orderSn) {
      this.dialogRefundFormVisible = true;
      this.refundReq.orderNo = orderSn;
    },
    handleCloseDialog() {
      this.resetForm();
    },
    bigAdaptation(orderSn) {
      this.dialogConfirmFormVisible = true;
      this.orderSn = orderSn;
    },
    cancelUserOrder(orderNo) {
      this.$confirm('是否取消该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var param = {
            orderNo: orderNo
          };
          cancelOrder(param)
            .then(res => {
              if (res.code === '000000') {
                this.$message({
                  type: 'success',
                  message: res.message
                });
                this.listDemandList();
              } else {
                this.$message({
                  type: 'error',
                  message: res.message
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    confirmOrder() {
      adaptationOrder({ orderSn: this.orderSn })
        .then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '提交成功!'
            });
            this.listDemandList({
              pageNumber: this.pageNumber,
              pageSize: 6
            });
          } else {
            this.$message({
              type: 'error',
              message: res.message
            });
          }
          this.dialogConfirmFormVisible = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          createOrderRefund(this.refundReq)
            .then(res => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '提交成功!'
                });
                this.listDemandList();
              } else {
                this.$message({
                  type: 'error',
                  message: res.message
                });
              }
              this.resetForm();
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: '提交失败!'
              });
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dialogRefundFormVisible = false;
      this.refundReq = {
        moe: '',
        orderSn: '',
        orderType: 2
      };
    },
    listDemandList(parameter) {
      if (!parameter) {
        parameter = this.emptyQueryData;
      }
      parameter.orderType = 8;
      getAllProofOrder(parameter)
        .then(res => {
          this.$set(this, 'demandList', res.data);
          console.log(res.data);
          this.totalCount = res.totalCount;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 去付款
    toPayOrder(order, num) {
      if (num) {
        this.$router.push({ path: '/service/getpay', query: { orderNo: order.supOrderNo, subOrderId: order.orderSn, inquiry: 1 } });
      } else {
        this.$router.push({ path: '/service/getcylpay', query: { orderNo: order.miniOrders.orderNo, paytype: 'normal' } });
      }
    }
  },
  created() {
    this.listDemandList();
    console.log(this.$route.name);
  },
  watch: {
    payStatus: {
      handler() {
        if (this.payStatus == 0) {
          this.statusStr = '等待付款';
          this.listDemandList({ payStatus: 0, pageNumber: 1, pageSize: 6 });
          this.pageNumber = 1;
        } else {
          this.statusStr = '全部状态';
          this.listDemandList();
        }
      }
    }
  }
};
</script>
<style scoped>
button,
input,
optgroup,
option,
select,
textarea {
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  outline: 0;
}
.lookfile {
  margin-right: 20px;
  color: #000;
}
.center {
  text-align: center;
}
</style>
<style scope src="../../static/index/user/css/reset.css" />
<style scope src="../../static/index/user/css/all.css" />
<style scope src="../../static/index/user/css/foot.css" />
<style scope src="../../static/index/user/css/main.css" />
<style scope src="../../static/agent/css/sweetalert.css" />
<style scope src="../../static/index/css/new/public.css" />
