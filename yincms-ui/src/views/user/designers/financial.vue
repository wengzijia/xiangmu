<template>
  <div class="financial">
    <div>
      <!-- <div v-if="isCertified"> -->
      <ul class="total">
        <li class="longTotal">
          <p>累计总收入</p>
          <p>
            <span class="totalPrice">{{ cumulativeGrossIncome }}</span> 元
          </p>
        </li>
        <li class="canMenoy">
          <div>
            <p>可结算金额</p>
            <p>
              <span class="totalPrice"> {{ canSettlementMoney }}</span
              >元
              <span>(待结算{{ cannotSettlementMoney }}元)</span>
              <span style="margin-left: 112px;">活动奖励：{{ activityMoney }}元（待提现）</span>
            </p>
          </div>
          <!-- <el-button class="btn" @click="applyMenoy">提现申请</el-button> -->
          <!-- <el-tooltip content="提现功能正在开发中" placement="bottom" effect="light"> -->
          <!-- <el-button  class="btn">提现申请</el-button> -->

          <!-- </el-tooltip> -->
          <div>
            <el-button title="提现功能正在开发中" class="btn" :disabled="!isCash" @click="cashButton">提现申请</el-button>
            <!-- <el-button title="提现功能正在开发中" class="btn" @click="cashButton">提现申请</el-button> -->
            <p style="text-align: center; margin-top: 6px;">（50元起）</p>
          </div>
        </li>
      </ul>
      <div class="flexHead">
        <ul class="taskHead">
          <li :class="financialStatus == 1 ? 'active' : ''" @click="selectFinancial(1)">可结算任务单</li>
          <li :class="financialStatus == 0 ? 'active' : ''" @click="selectFinancial(0)">待结算任务单</li>
          <li :class="financialStatus == 2 ? 'active' : ''" @click="selectFinancial(2)">已结算提现</li>
        </ul>
        <p style="text-align: right;">合计：{{ cannotSettlementMoney }} 元</p>
      </div>
      <div class="cainter">
        <el-table v-if="tableData.length && financialStatus != 2" :data="tableData" :header-cell-style="{ background: '#f5f7fa' }" style="width: 100%;font-size:13px">
          <!-- 可结算和待结算 -->
          <el-table-column prop="endTime" label="结算时间" width="95">
            <template slot-scope="scope">
              <span style="text-align:center">{{ formatDateSecond(scope.row.settlementTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="任务单号" width="160">
            <template slot-scope="scope">
              {{ scope.row.drawSn }}
            </template>
          </el-table-column>
          <el-table-column label="任务">
            <template slot-scope="scope">
              {{ scope.row.outName }}
            </template>
          </el-table-column>
          <el-table-column label="完成时间" width="95">
            <template slot-scope="scope">
              <span style="text-align:center">{{ formatDateSecond(scope.row.addTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="任务金额（元）">
            <template slot-scope="scope">
              <span style="margin-left: 10px">￥{{ scope.row.price }}</span>
              <span class="tipss" v-show="scope.row.restsStatus == 1">折扣报酬</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="税款（元）" width="95">
            <template slot-scope="scope">
              <span style="margin-left: 10px">￥{{ scope.row.taxation }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="结算金额（元）" width="115">
            <template slot-scope="scope">
              <span style="margin-left: 10px">￥{{ scope.row.settlementPrice }}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 已结算 -->
        <el-table v-if="tableList.length && financialStatus == 2" :data="tableList" :header-cell-style="{ background: '#f5f7fa' }" style="width: 100%;font-size:13px">
          <el-table-column prop="endTime" label="申请时间" width="95">
            <template slot-scope="scope">
              <span style="text-align:center">{{ formatDateSecond(scope.row.addTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="结算单号" width="154">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.withdrawSn }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="姓名" width="115">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.realname }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="身份证号" width="115">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.idcard }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="手机账号" width="115">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.mobile }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="结算金额（元）" width="115">
            <template slot-scope="scope">
              <span style="margin-left: 10px">￥{{ scope.row.settlementPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" width="115">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ getStatus(scope.row.status) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="包含订单" width="115">
            <template slot-scope="scope">
              <u class="include" @click="$refs.IncludedOrder.showDialog(scope.row.id)">{{ scope.row.severalNum }}</u>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="w_page_0528 pages" style="padding: 30px 0">
        <el-pagination
          background
          layout="prev, pager, next"
          :hide-on-single-page="true"
          :total="totalCount"
          :page-size="queryParm.pageSize"
          :current-page="queryParm.pageNumber"
          @current-change="getPageData"
          @prev-click="getPageData"
          @next-click="getPageData"
        ></el-pagination>
      </div>
      <div class="instructions">
        <p>说明：</p>
        <p>1）任务完成，审核被录用，需等待30天，确认可交付生产工艺，文件无问题，方可进入可结算环节</p>
        <p>2）每17号-20号可提现申请，可提现截止当日可结算任务金额，提现后平台财务会核算并汇款，预计7个工作日完成</p>
      </div>
    </div>
    <cashPopup ref="cashPopup" :cashId="cashId"></cashPopup>
    <IncludedOrder ref="IncludedOrder" />
  </div>
</template>

<script>
import { getSettlementListPage, getSettlementMoney, getWithdrawListPage, gainFinanceSettlemenWithdraw, gainFinanceWithdrawalAccount } from '@/api/users/designer';
import { formatDateSecond } from '@/utils/timeUtil';
import { getByUserId } from '@/api/users/designer';
import { getCurrentUserInfo } from '@/api/users/userApi';
import cashPopup from '@/components/cashPopup/index.vue';
import IncludedOrder from '@/components/cashPopup/IncludedOrder.vue';
export default {
  components: {
    cashPopup,
    IncludedOrder
  },
  data() {
    return {
      isCertified: true, //判断是否入驻注册
      totalCount: 60,
      financialStatus: 0,
      cumulativeGrossIncome: 0,
      cannotSettlementMoney: 0,
      canSettlementMoney: 0,
      activityMoney: 0,
      tableData: [],
      tableList: [],
      isCash: false,
      cashId: null,
      queryParm: {
        outName: '', //搜索的名字
        pageNumber: 1, //页数
        pageSize: 10, //页大小
        status: 0 //状态 空=全部,1设计中2审核中3已完成4已结束
      }
    };
  },
  created() {
    this.getUserInfo();
    this.getSettlementListPageFn();
    this.getSettlementMoneyFn();
    this.withdrawCash();
    this.gainFinanceWithdrawalAccountFn();
  },
  methods: {
    ...{ formatDateSecond },
    // 处理状态
    getStatus(val) {
      if (val == 0) {
        return '审核中';
      } else if (val == 1) {
        return '审核不通过';
      } else if (val == 2) {
        return '审核中';
      } else if (val == 3) {
        return '已汇款';
      } else if (val == 4) {
        return '冻结中';
      }
    },
    // 分页数据
    getPageData(page) {
      this.queryParm.pageNumber = page;
    },
    // 获取用户信息
    getUserInfo() {
      getCurrentUserInfo().then(res => {
        // this.$set(this, 'userInfo', res.data);
        if (res.code == '000000') {
          this.uid = res.data.id;
          // console.log('获取用户信息',this.uid);
          this.getByUserIdFn();
        }
      });
    },
    // 获取入驻用户信息
    getByUserIdFn() {
      getByUserId({ id: this.uid })
        .then(res => {
          // console.log('入驻用户信息22222', res);
          if (res.code == '000000') {
            // this.isCertified = res.data == null ? false : true;
            if (res.data.id == null) {
              this.$router.replace('/user/designerRegister');
            }
          }
        })
        .catch(err => {
          this.$router.replace('/user/designerRegister');
        });
    },
    // 设计师财务结算-获取用户提现账户
    gainFinanceWithdrawalAccountFn() {
      gainFinanceWithdrawalAccount().then(res => {
        // console.log('获取用户提现账户res', res);
        if (res.code == '000000' && res.data) {
          this.cashId = res.data.id;
        }
      });
    },
    // 提现按钮只有在17到20号可以提现
    withdrawCash() {
      const dateTime = new Date().getDate();
      if (dateTime == 17 || dateTime == 18 || dateTime == 19 || dateTime == 20) {
        this.isCash = true;
      }
    },
    // 设计师财务结算-提现操作
    cashButton() {
      this.$confirm('您是否确定提现？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.gainFinanceSettlemenWithdrawFn();
        })
        .catch(() => {});
    },
    gainFinanceSettlemenWithdrawFn() {
      gainFinanceSettlemenWithdraw().then(res => {
        // console.log('提现操作res======', res);
        if (res.code == '000000') {
          let cashStatus = res.data.status;
          if (cashStatus == 1) {
            this.getSettlementMoneyFn();
            this.$message({
              message: '提现申请成功，平台财务审核完后会汇款，预计7个工作日完成',
              type: 'success'
            });
            this.queryParm = {
              outName: '', //搜索的名字
              pageNumber: 1, //页数
              pageSize: 10, //页大小
              status: this.financialStatus == 2 ? '' : this.financialStatus //状态 空=全部,1设计中2审核中3已完成4已结束
            };
          } else if (cashStatus == 2) {
            this.$confirm('你还没有实名认证和签署《委托设计协议》，请前往签署', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.$router.push('/user/certifiedDesigner');
              })

              .catch(() => {});
          } else if (cashStatus == 3) {
            this.$message({
              message: '未到提现日期',
              type: 'error'
            });
          } else if (cashStatus == 4) {
            // console.log('未添加提现账户');
            this.$refs.cashPopup.showDialog(2);
          }
        }
      });
    },

    // 设计师财务结算-累计收入及可结算收入
    getSettlementMoneyFn() {
      getSettlementMoney().then(res => {
        // console.log('res2222', res);
        this.activityMoney = res.data.activityMoney.settlementPrice;
        this.cumulativeGrossIncome = res.data.cumulativeGrossIncome.settlementPrice;
        this.cannotSettlementMoney = res.data.cannotSettlementMoney.settlementPrice;
        this.canSettlementMoney = res.data.canSettlementMoney.settlementPrice;
      });
    },
    // 提现任务单列表
    getWithdrawListPageFn() {
      getWithdrawListPage(this.queryParm).then(res => {
        // console.log('提现任务单列表res', res);
        this.tableList = res.data;
        this.totalCount = res.totalCount;
      });
    },
    // 设计师财务结算-待结算任务单列表
    getSettlementListPageFn() {
      getSettlementListPage(this.queryParm).then(res => {
        // console.log(123, res);
        this.tableData = res.data;
        this.totalCount = res.totalCount;
      });
    },
    // tab选项的状态
    selectFinancial(type) {
      this.financialStatus = type;
      this.queryParm.pageNumber = 1;
      if (this.financialStatus == 2) {
        this.queryParm.status = '';
      } else {
        this.queryParm.status = type;
      }
    },
    applyMenoy() {
      this.$message({
        message: '提现功能正在开发中',
        type: 'warning'
      });
    }
  },
  watch: {
    queryParm: {
      handler() {
        if (this.financialStatus == 2) {
          this.getWithdrawListPageFn();
        } else {
          this.getSettlementListPageFn();
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style>
.financial .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #e60021;
  font-weight: normal;
}
</style>
<style scoped>
.include {
  margin-left: 10px;
  cursor: pointer;
}

.include:hover {
  color: #409eff;
}

.tipss {
  margin-left: 10px;
  border: 1px solid #f00;
  padding: 0px 4px;
  color: #f00;
}

.financial {
  background: #fff;
  font-size: 14px;
  color: #333;
  padding: 20px;
}

.financial .total {
  height: 96px;
  background: #f9f9f9;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.financial .total .totalPrice {
  font-size: 16px;
  font-weight: 700;
  color: #555;
}

.financial .longTotal {
  width: 166px;
  line-height: 22px;
  text-align: center;
  border-right: 1px solid #d8d8d8;
}

.financial .canMenoy {
  flex: 1;
  margin-left: 62px;
  display: flex;
  justify-content: space-between;
  margin-right: 20px;
}

.financial .canMenoy .btn {
  /* margin-left: 26px; */
}

.financial .canMenoy .btn:focus,
.financial .canMenoy .btn:active {
  /* color: #606266;
  border-color: #dcdfe6;
  background-color: #ffffff; */
}

.financial .canMenoy .btn:hover {
  /* color: #d0111b;
  border-color: #da5c60;
  background-color: #faccd3; */
}

.financial .flexHead {
  /* margin: 20px 0; */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.financial .taskHead {
  margin: 20px 0;
  display: flex;
}

.financial .taskHead li {
  font-size: 16px;
  cursor: pointer;
  display: inline-block;
  padding: 12px 20px;
  color: #666;
  /* border-bottom: 2px solid #e8e8e8; */
  /* position: relative;
  bottom: -2px; */
  font-weight: 700;
  font-family: '微软雅黑', serif;
}

.financial .taskHead li:hover {
  color: #e60021;
}

.financial .taskHead li.active {
  border-bottom: 2px solid #e8e8e8;
  border-color: #e60021;
  color: #e60021;
}

.financial .instructions {
  background: #f9f9f9;
  border-radius: 4px;
  padding: 15px 10px;
  line-height: 22px;
}
</style>

<style src="@/static/index/user/css/main.css" />
