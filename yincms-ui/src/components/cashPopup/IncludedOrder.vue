<template>
  <div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="1000px">
      <el-table :data="tableList" :header-cell-style="{ background: '#f5f7fa' }" style="width: 100%;font-size:13px">
        <!-- 可结算和待结算 -->
        <el-table-column prop="endTime" label="结算时间" width="95">
          <template slot-scope="scope">
            <span style="text-align:center">{{ formatDateSecond(scope.row.settlementTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="drawSn" label="任务单号" width="160"> </el-table-column>
        <el-table-column prop="outName" label="任务"> </el-table-column>
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
    </el-dialog>
  </div>
</template>

<script>
import { getSettlementWithdrawList } from '@/api/users/designer';
import { formatDateSecond } from '@/utils/timeUtil';

export default {
  name: 'IncludedOrder',
  data() {
    return {
      dialogVisible: false,
      tableList: [],
      includeId: ''
    };
  },
  created() {},
  methods: {
    formatDateSecond,
    showDialog(id) {
      this.dialogVisible = true;
      this.includeId = id;
    },
    getSettlementWithdrawListFn() {
      getSettlementWithdrawList({ id: this.includeId }).then(res => {
        this.tableList = res.data;
      });
    }
  },
  watch: {
    includeId: {
      handler() {
        this.getSettlementWithdrawListFn();
      },
      deep: true
      // immediate: true
    }
  }
};
</script>

<style></style>
