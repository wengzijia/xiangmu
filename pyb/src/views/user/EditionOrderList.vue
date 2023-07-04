<template>
  <div>
    <!--main start-->
    <el-main>
      <div class="right_List">
        <div class="UP_right_List">整版报价列表</div>
        <div class="use_listBox" style="margin-top: 15px">
          <ul class="every-box" v-for="(order, index) in editionOrder" :key="index">
            <ol class="flex itemListT">
              <p>
                <span>编号：{{ order.orderNo }}</span
                >&nbsp;&nbsp;<span>时间：{{ formatSecond(order.addtime) }}</span
                >&nbsp;&nbsp;&nbsp;
                <span>联系人信息：{{ order.consigneeName }} &nbsp;&nbsp;{{ order.mobile }}</span>
              </p>
            </ol>
            <li class="ttBox">
              <table class="Tasbox">
                <tr class="Tas">
                  <th width="30%" style="text-align: left; text-indent: 40px">商品信息</th>
                  <th width="15%">货期</th>
                  <th width="15%">数量</th>
                  <th width="15%">价格</th>
                  <th width="15%">状态</th>
                  <th width="15%">操作</th>
                </tr>
                <tr v-for="(subOrder, indexOne) in order.miniEditionGoodsInfo" :key="indexOne">
                  <td>
                    <dl class="flex orderInfoDL">
                      <dt class="DLimg">
                        <a href="" target="_blank" class="icon icon-img"></a>
                      </dt>
                      <dd class="orderInfo_t">
                        <p class="orderInfo_tC">纸张材质：{{ subOrder.goodsAttr }};</p>
                      </dd>
                    </dl>
                  </td>
                  <td class="red">{{ subOrder.totalTime }}小时</td>
                  <td v-text="subOrder.number"></td>
                  <td v-text="subOrder.amount"></td>
                  <td>
                    <span v-if="order.status === 'nopaid'">未支付</span>
                    <span v-else-if="order.status === 'paid'">已支付</span>
                    <span v-else-if="order.status === 'paidpart'">已支付预付款</span>
                    <span v-else-if="order.status === 'cancel'">已取消</span>
                  </td>
                  <td>
                    <template v-if="order.status === 'normal'">
                      <div class="spayBnt" v-if="order.amount > 0">
                        <a href="{:url('order/payedition',['orderno'=>$list.order_no])}" class="wbb1201Modify1">立即付款</a>
                      </div>
                      <a class="cal setstatus" data-status="cancel" data-no="{$list.order_no|default=''}">取消订单</a>
                    </template>
                    <router-link class="C9" :to="{ path: '/user/editionOrderDetails', query: { orderNo: order.orderNo } }">订单详情</router-link>
                  </td>
                </tr>
              </table>
            </li>
          </ul>
          <div class="w_page_0528" style="margin: 30px 0">
            <el-pagination
              style="display: block; "
              background
              layout="prev, pager, next"
              :hide-on-single-page="value"
              :total="totalCount"
              :page-size="pageSize"
              :current-page="pageNumber"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-main>
    <!--main end-->
  </div>
</template>

<script>
import { formatSecond } from '@/utils/timeUtil';
import { orderList } from '@/api/order/editionSubOrderApi';
import { createOrderRefund } from '@/api/order/orderRefundApi';

export default {
  data() {
    return {
      editionOrder: [],
      payStatus: -1,
      orderkey: '',
      orderSn: '',
      statusStr: '全部状态',
      pageNumber: 1,
      pageSize: 6,
      emptyQueryData: {
        pageNumber: 1,
        pageSize: 6,
        orderType: 0
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
        this.editionOrderList({ payStatus: 0, pageNumber: pageNumber, pageSize: this.pageSize, orderType: 0 });
      } else {
        this.editionOrderList({ pageNumber: pageNumber, pageSize: this.pageSize, orderType: 0 });
      }
    },
    handleCommand(command) {
      if (command == 0) {
        this.statusStr = '等待付款';
        this.payStatus = 0;
        this.editionOrderList({ payStatus: 0, pageNumber: 1, pageSize: 6, orderType: 0 });
        this.pageNumber = 1;
      } else {
        this.statusStr = '全部状态';
        this.payStatus = -1;
        this.editionOrderList();
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
                this.editionOrderList();
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
    editionOrderList(parameter) {
      if (!parameter) {
        parameter = this.emptyQueryData;
      }
      orderList(parameter)
        .then(res => {
          this.$set(this, 'editionOrder', res.data);
          console.log('editionOrder', this.editionOrder);
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
    this.editionOrderList();
  },
  watch: {
    payStatus: {
      handler() {
        if (this.payStatus == 0) {
          this.statusStr = '等待付款';
          this.editionOrderList({ payStatus: 0, pageNumber: 1, pageSize: 6, orderType: 0 });
          this.pageNumber = 1;
        } else {
          this.statusStr = '全部状态';
          this.editionOrderList();
        }
      }
    }
  }
};
</script>
<style scoped src="../../static/index/user/css/reset.css" />
<style scoped src="../../static/index/user/css/all.css" />
<style scoped src="../../static/index/user/css/foot.css" />
<style scoped src="../../static/index/user/css/main.css" />
<style scoped src="../../static/index/user/css/bootstrap.min.css" />
<style scoped src="../../static/index/css/new/public.css" />
<style scoped src="../../static/mulindex/css/fonts.css?v=202003051652" />
<style scoped src="../../static/mulindex/css/public.css?v=202003051652" media="all" />
<style scoped src="../../static/mulindex/css/user.css" media="all" />
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
<style scoped>
.Tasbox {
  width: 100%;
}
.Tasbox a {
  cursor: pointer;
}
.Tasbox td,
.Tas th {
  padding: 0 16px;
  text-align: center;
}
.Tas {
  height: 22px;
  line-height: 22px;
  background: #f7f7f7;
}
.Tas th {
  font-weight: normal;
  text-align: center;
  color: #7e7e7e;
}
.spayBnt {
  font-size: 12px;
}
.Tasbox .DLimg {
  border-color: transparent;
}
.Tasbox .DLimg a {
  font-size: 52px;
  color: #ddd;
}
.use_listBox .every-box {
  /* clear: both; */
  border: solid 1px #cae1fe;
  /* zoom: 1; */
  margin-bottom: 12px;
  font-size: 12px;
  /* line-height: 18px; */
}
/* .use_listBox li {
  display: block
  width: auto;
} */
</style>
