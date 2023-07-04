<template>
  <div>
    <!--main start-->
    <el-main>
      <div class="right_List">
        <div class="UP_right_List">打样订单</div>
        <div class="homeInfo_New">
          <div class="boxDetails">
            <div class="mt_HdList">
              <ul class="extra_Left">
                <li><a :class="payStatus != 0 ? 'trrOne' : ''" @click="payStatus = -1">全部订单</a></li>
                <li><a :class="payStatus == 0 ? 'trrOne' : ''" @click="payStatus = 0">待付款</a></li>
              </ul>
              <div class="mt_HdList-Right">
                <div class="searchBox">
                  <input type="text" name="orderkey" class="inputGoods_Name" placeholder="订单号" v-model="orderkey" style="color:rgb(204, 204, 204);" />
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
                      <div class="order_detail_txt">订单详情</div>
                    </th>
                    <th>联系人</th>
                    <th>金额</th>
                    <th>
                      <div class="ordertime_cont deal-state-cont">
                        <el-dropdown @command="handleCommand">
                          <span class="el-dropdown-link"> {{ statusStr }}<i class="el-icon-arrow-down el-icon--right"></i> </span>
                          <span class="blank"></span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="1">全部状态</el-dropdown-item>
                            <el-dropdown-item command="0">等待付款</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                    </th>
                    <th>操作</th>
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
                        >订单号：<a :href="'/user/demanddetail?id=' + order.orderSn" class="orderIdLinks" target="_blank">{{ order.orderSn }}</a></span
                      >
                      <span style="margin-left:20px;" v-if="order.designerInfos">{{ order.designerInfos.companyname }}:{{ order.designerInfos.contacts }}-{{ order.designerInfos.tel }}</span>
                      <span v-if="order.orderType == 1" style="margin-left:20px;color: red;">大货适配打样</span>
                      <span v-if="order.orderType == 9" style="margin-left:20px;color: red;">方案适配打样</span>
                    </td>
                  </tr>
                  <tr v-for="(info, index1) in order.proofInfos" :key="index1" class="track57442710364">
                    <td>
                      <div class="p_911672">
                        <div class="goodsFont" style="padding-left:15px;">
                          <p class="goodsFont_One" v-if="order.orderType == 5">
                            <a href="javascript:;" class="Hd_goodsName" style="font-weight: 600;font-size: 13px;">原创设计</a>
                          </p>
                          <p class="goodsFont_One" v-if="order.orderType == 5 && info.goodsId">
                            <a href="javascript:;" class="Hd_goodsName">{{ info.goodsName }}</a>
                          </p>
                          <div>
                            <u>{{ info.alias ? info.alias : info.goodsName }}</u>
                          </div>
                          <p class="goodsFont_One">
                            <a href="javascript:;" class="Hd_goodsName">{{ info.goodsAttr }}</a>
                          </p>
                        </div>
                      </div>
                      <div class="right_P911672">X{{ info.num }}</div>
                      <br /><br />

                      <div v-if="order.orderType != 5" class="right_P911672">X{{ info.fnumber }}款</div>
                    </td>
                    <td v-if="index1 == 0" :rowspan="order.proofInfos.length">
                      <div class="consigneeName consigneeName01">
                        <span>{{ order.consigneeName }}</span>
                        <span class="borderFont">{{ order.tel }}</span>
                      </div>
                    </td>
                    <td v-if="index1 == 0" :rowspan="order.proofInfos.length">
                      <div class="amount amount01">
                        <span>总额￥{{ order.amount + order.shipfee }}</span>
                      </div>
                    </td>
                    <td v-if="index1 == 0" :rowspan="order.proofInfos.length">
                      <div class="amount amount01">
                        <a :href="'/user/demanddetail?id=' + order.orderSn" class="OrderDetail" target="_blank">订单详情</a>
                      </div>
                    </td>
                    <td v-if="index1 == 0" :rowspan="order.proofInfos.length">
                      <div v-if="order.payStatus == 0">
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
                      <div v-if="order.orderType == 9 && order.confirmTime == 0 && order.expressNo != ''" class="amount">
                        <a href="javascript:;" class="payOrder" @click="bigAdaptation(order.orderSn)">确认打样样品</a>
                      </div>

                      <div v-if="order.orderType == 1 && order.confirmTime > 0 && order.expressNo != ''" class="amount finishOrder finishOrder01">
                        <span>适配确认时间:</span>
                        <br />
                        <span>{{ formatSecond(order.confirmTime) }}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="w_page_0528" style="margin:30px 0 0;">
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
        style="display: block; margin-top: -192px;"
      >
        <div class="sa-icon sa-error" style="display: none;">
          <span class="sa-x-mark">
            <span class="sa-line sa-left"></span>
            <span class="sa-line sa-right"></span>
          </span>
        </div>
        <div class="sa-icon sa-warning pulseWarning" style="display: block;">
          <span class="sa-body pulseWarningIns"></span>
          <span class="sa-dot pulseWarningIns"></span>
        </div>
        <div class="sa-icon sa-info" style="display: none;"></div>
        <div class="sa-icon sa-success" style="display: none;">
          <span class="sa-line sa-tip"></span>
          <span class="sa-line sa-long"></span>

          <div class="sa-placeholder"></div>
          <div class="sa-fix"></div>
        </div>
        <div class="sa-icon sa-custom" style="display: none;"></div>
        <h2>确认大货适配打样操作声明！</h2>
        <p style="display: block;">尊敬的客户：请您认真检查样品盒型适配效果, 一旦确认适配效果后，非傲彩原因产生的适配问题概不受理,请您确保已经一 一仔细确认。</p>
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
            style="display: inline-block; box-shadow: none;"
            @click="
              dialogConfirmFormVisible = false;
              orderSn = '';
            "
          >
            否，返回再次查看确认
          </button>
          <button class="confirm" tabindex="1" style="display: inline-block; background-color: rgb(236, 108, 98); box-shadow: rgba(236, 108, 98, 0.8) 0px 0px 2px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset;" @click="confirmOrder()">
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
        orderType: 1
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
      parameter.orderType = 1;
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
    toPayOrder(order) {
      this.$router.push({ path: '/service/getpay', query: { orderNo: order.supOrderNo, subOrderId: order.orderSn } });
    }
  },
  created() {
    this.listDemandList();
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
</style>
<style scope src="../../static/index/user/css/reset.css" />
<style scope src="../../static/index/user/css/all.css" />
<style scope src="../../static/index/user/css/foot.css" />
<style scope src="../../static/index/user/css/main.css" />
<style scope src="../../static/agent/css/sweetalert.css" />
<style scope src="../../static/index/css/new/public.css" />
