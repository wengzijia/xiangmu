<template>
  <div>
    <el-main>
      <!--right-->
      <div class="useMainRt">
        <div class="useOr_box">
          <ul class="use_tabs">
            <li :class="{ curr: queryCondition.status == '' }">
              <a href="javascript:;" @click="getAllOrder('')">所有订单<span v-text="orderNum.all"></span></a>
            </li>
          </ul>
          <div class="use_listBox">
            <el-checkbox-group v-model="checkList" @change="handleCheckedOrderChange">
              <ul class="close" v-for="order in allOrderData" :key="order.id">
                <ol class="itemListZ">
                  <span class="t1">货品规格</span>
                  <span class="t2">文件</span>
                  <span class="t3">货品金额</span>
                  <span class="t4">数量</span>
                  <span class="t5">订单金额</span>
                  <span class="t6">订单状态</span>
                  <span class="t7">交易操作</span>
                </ol>
                <li class="ttBox" style="background: #eff2f9;">
                  <div class="itemaBox">
                    <div class="itema" v-for="(orderInfo, index) in order.children" :key="orderInfo.id">
                      <div class="s1">
                        <dl class="flex orderInfoDL">
                          <dt class="DLimg"><img v-bind:src="orderInfo.goodsCoverPath" /><span style="display: none" v-text="index"></span></dt>
                          <dd class="orderInfo_t">
                            <h6>
                              <a>
                                <span v-if="!orderInfo.customName" v-text="orderInfo.goodsName"></span>
                                <span v-else v-text="orderInfo.customName"></span>
                              </a>
                            </h6>
                            <p class="orderInfo_tC C9" title="" v-text="orderInfo.goodsAttr"></p>

                            <!-- <span v-if="orderInfo.goodsId != 1546 && orderInfo.goodsId != 1547 && orderInfo.goodsId != 1548 && orderInfo.goodsId != 1549 && orderInfo.goodsId != 1550">
                              <p class="red stime">生产货期：{{ orderInfo.day * 24 }}小时 ({{ orderInfo.day }}天)</p>

                              <p class="red ytime">预计发货时间：{{ orderInfo.outTime }}</p>
                            </span> -->
                            <div class="flagDv curr" v-if="orderInfo.sortAdaptive > 0">
                              <i></i><span>适配盒型:<a v-if="orderInfo.sortAdaptive === 1">主体</a><a v-else>次体</a></span>
                              <p></p>
                              <div v-if="orderInfo.proofConfirmTime != null && orderInfo.proofConfirmTime != ''">
                                <span>适配确认时间:</span>
                                <p></p>
                                <span v-text="orderInfo.proofConfirmTime"></span>
                              </div>
                            </div>
                          </dd>
                        </dl>
                      </div>
                      <div class="s2" v-if="orderInfo.postatus != 'stoped'"></div>
                      <div class="s3">
                        <b class="red" v-if="orderInfo.goodsTotal">{{ orderInfo.goodsTotal }}</b>
                      </div>
                      <div class="s4" v-text="orderInfo.num"></div>
                    </div>
                  </div>
                  <div class="s5">
                    <b class="red" v-if="order.amount">{{ order.amount }}</b>
                    <p class="C9">(不含运费)</p>
                  </div>
                  <div class="s6">
                    <p>未支付</p>
                  </div>
                  <div class="s7">
                    <div class="spayBnt">
                      <a @click="toPayOrder(order)" target="_blank">付款</a>
                    </div>
                  </div>
                  <!-- <div class="s8">
                    <router-link class="s8as" :to="{ path: '/user/orderdetail', query: { orderNo: order.orderNo } }" target="_blank">订单详情</router-link>
                    <div class="amount finishOrder finishOrder01" v-if="order.canOrder > 0">
                      <a target="_blank" @click="repurchase(order.orderNo, order.children)">一键翻单</a>
                    </div>
                  </div> -->
                </li>
              </ul>
            </el-checkbox-group>
            <div class="gotherBnt" v-if="queryCondition.status === '1' && allOrderData.length > 0">
              <el-button type="danger" plain @click="mergeCommit">合并订单付款</el-button>
            </div>
          </div>
          <div class="w_page_0528" style="padding: 30px 0">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="totalCount"
              :page-size="pageSize"
              :current-page="pageNumber"
              :hide-on-single-page="true"
              @current-change="getPageData"
              @prev-click="getPageData"
              @next-click="getPageData"
            ></el-pagination>
          </div>
        </div>
        <div v-if="allOrderData.length == 0" style="display: flex;flex: 1;justify-content: center;align-items: center;">
          <span style="color:#aaa">无待确认订单</span>
        </div>
      </div>
      <!--dialog end-->
    </el-main>
  </div>
</template>
<script>
import { saveOrdersRepurchase } from '@/api/cart/cartApi';
import { cancelOrder, updateName } from '@/api/order/orderApi';
import { createOrder } from '@/api/order/orderTogetherApi';
import { getAllSupplierOrder, updateOfflineCart, getOfflineCartByUid } from '@/api/order/supplierOrdersApi';
import { ACCESS_TOKEN } from '@/store/global-constant';
import { mapActions } from 'vuex';
import { encodeUrlSpecial, downloadOrView } from '@/utils/order/baseEncodeUrl';
import { endWith } from '@/utils/strUtil';
import { getCartByUid, updateCheck, update, del, addByCartIds, addCartByIds, deleteByIds, listCollect } from '@/api/cart/cartApi';

export default {
  components: {},
  inject: ['reload'], //注入reload方法
  data() {
    return {
      headers: {
        token: localStorage.getItem(ACCESS_TOKEN),
        Authorization: localStorage.getItem(ACCESS_TOKEN)
      },
      orderNum: {},
      allOrderData: [],
      queryCondition: {
        orderNo: '',
        consigneeName: '',
        status: '',
        payType: '',
        isPay: -1,
        createTime: '',
        endTime: ''
      },
      pageNumber: 0,
      pageSize: 6,
      totalCount: 0,
      moe: '',
      orderNo: '',
      dialogVisible: false,
      dialogConfirmFormVisible: false,
      orderSn: '',
      baseUrl: 'http://alifile.xiaocaiyin.com/',
      // 合并支付
      checkList: [],
      // 全选
      checkAll: false,
      isIndeterminate: false,
      imageUrl: '',
      sdrdialog: false,
      cdrid: '',
      ordernum: ''
    };
  },
  created() {
    this.queryClassify();
    this.getAllOrder('', 0, 6);
  },
  methods: {
    ...{ encodeUrlSpecial, downloadOrView },
    ...{ endWith },
    ...mapActions(['Login', 'SmsLogin', 'Logout']),
    getPageData(page) {
      this.getAllOrder(this.queryCondition.status, page, 6);
      this.backTop();
    },
    queryClassify() {
      // queryOrderClassify({})
      //   .then(res => {
      //     var _this = this;
      //     if (res.code === '000000') {
      //       this.$set(this, 'orderNum', res.data);
      //     } else {
      //       _this.$message({
      //         type: 'error',
      //         message: res.message
      //       });
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    getAllOrder(status, pageNumber, pageSize) {
      const loading = this.$loading({
        lock: true,
        text: '加载中～',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      if (status != '') {
        this.queryCondition.status = status;
      } else {
        this.queryCondition.status = '';
      }
      const reqParam = {
        pageNumber: pageNumber < 1 ? 0 : pageNumber,
        pageSize: pageSize < 1 ? 6 : pageSize,
        orderNo: this.queryCondition.orderNo,
        status: this.queryCondition.status + '',
        payType: this.queryCondition.payType + '',
        consigneeName: this.queryCondition.consigneeName,
        createTime: this.queryCondition.createTime,
        isPay: this.queryCondition.isPay,
        endTime: this.queryCondition.endTime
      };

      getOfflineCartByUid(reqParam)
        .then(res => {
          loading.close();
          var _this = this;
          if (res.code === '000000') {
            this.$set(this, 'allOrderData', res.data);
            this.pageNumber = res.pageNumber;
            this.pageSize = res.pageSize;
            this.totalCount = res.totalCount;
            console.log('allOrderData', this.allOrderData);
          } else {
            _this.$message({
              type: 'error',
              message: res.message
            });
          }
        })
        .catch(err => {
          loading.close();
          console.log(err);
        });
    },
    upcdrimg(id, o) {
      console.log(id);
      this.cdrid = id;
      this.sdrdialog = true;
      this.ordernum = o;
      this.imageUrl = '';
    },

    handleClose(done) {
      this.moe = '';
      done();
    },
    cancel() {
      this.dialogVisible = false;
      this.moe = '';
    },
    orderchange(on) {
      // console.log(on);
    },
    // 去付款
    toPayOrder(order) {
      updateOfflineCart({ data: order.panelSn }).then(res => {
        this.$router.push({ path: '/cart/checkorder?webfrom=5' });
      });
    },
    // 合并支付
    mergeCommit() {
      if (this.checkList.length < 2) {
        this.$message({
          type: 'error',
          message: '至少选择两个未支付订单'
        });
      } else {
        for (let i = 0; i < this.allOrderData.length; i++) {
          if (this.allOrderData[i].orderNo == this.checkList[i]) {
            // console.log(this.allOrderData[i]);
            if (this.allOrderData[i].isCanPay == 0) {
              this.$alert('订单中包括了自定义工艺，下单后进入评估报价，待评估完成后再计入订单金额一起支付吧！', '温馨提示', {
                confirmButtonText: '关闭'
              });
              return;
            }
          }
        }
        createOrder({ list: this.checkList })
          .then(res => {
            if (parseInt(res.data.invoiceType) == 1) {
              this.$router.push({ path: '/service/getinvoicepaytogether', query: { orderNo: res.data.orderNo, paytype: 'normal' } });
            } else {
              this.$router.push({ path: '/service/getcylpaytogether', query: { orderNo: res.data.orderNo, paytype: 'normal' } });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 合并支付
    handleCheckAllChange(val) {
      this.checkList = val ? this.getOrderList(this.allOrderData) : [];
      this.isIndeterminate = false;
    },
    handleCheckedOrderChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.allOrderData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allOrderData.length;
    },
    // 获取所有订单号
    getOrderList(orderList) {
      let orderIds = [];
      orderList.forEach(order => orderIds.push(order.orderNo));
      return orderIds;
    },
    // 回到顶部
    backTop() {
      window.scrollTo(0, 0);
    }
  }
};
</script>
<style src="../../static/index/user/css/reset.css" />
<style src="../../static/index/user/css/all.css" />
<style src="../../static/index/user/css/foot.css" />
<style src="../../static/index/user/css/main.css" />
<style src="../../static/agent/css/sweetalert.css" />
<style src="../../static/mulindex/css/fonts.css?v=202003051652" media="all" />
<style src="../../static/mulindex/css/public.css?v=202003051652" media="all" />
<style src="../../static/mulindex/css/user.css" media="all" />

<style scoped>
.layui-form-label {
  float: left;
  display: block;
  padding: 9px 15px;
  width: 90px;
  font-weight: 400;
  line-height: 20px;
  text-align: right;
}

.layui-input {
  display: block;
  width: 100%;
  padding-left: 10px;
  font-size: 12px;
  line-height: 38px;
  border-width: 1px;
  border-style: solid;
  background-color: #fff;
  border-radius: 2px;
  border-color: #e6e6e6;
}

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

.layui-btn {
  display: inline-block;
  height: 38px;
  line-height: 38px;
  padding: 0 65px;
  background-color: #009688;
  color: #fff;
  white-space: nowrap;
  text-align: center;
  font-size: 14px;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}

.layui-form-item:after {
  content: '\20';
  clear: both;
  *zoom: 1;
  display: block;
  height: 0;
}

.layui-form-item {
  margin-bottom: 15px;
  clear: both;
  *zoom: 1;
}

.layui-input-block {
  margin-left: 120px;
  min-height: 36px;
}

.gotherBnt {
  width: 162px;
  height: 23px;
  line-height: 23px;
  font-size: 13px;
  color: #fff;
  background: linear-gradient(top, #f98838, #f97635);
  background: -webkit-linear-gradient(top, #f98838, #f97635);
  background: -moz-linear-gradient(top, #f98838, #f97635);
  border: 1px solid #f97635;
  border-radius: 2px;
  text-align: center;
  cursor: pointer;
  border: 0;
  margin: 0 auto;
  float: right;
}

.gotherBnt a {
  color: #fff;
}
.gotherBnt button {
  float: right;
}
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  text-indent: 0;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
