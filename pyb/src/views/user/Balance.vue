<template>
  <div>
    <el-main>
      <div class="right_List">
        <div class="UP_right_List">账户余额</div>
        <div class="Down_right_List allInvoice01">
          <div class="acountbox">
            <h2 class="acount-h2">账户总额</h2>
            <h1 class="acount-h1">{{ $store.getters.userInfo.userMoney }}</h1>
            <ul class="ac_limUl">
              <li>
                可用余额：<b>{{ $store.getters.userInfo.userMoney }}</b>
              </li>
              <li>
                冻结金额：<b>{{ $store.getters.userInfo.frozenMoney }}</b>
              </li>
            </ul>
            <div class="acbtndiv">
              <!--<router-link to="/user/recharge" class="acBtn curr">立即充值</router-link>
              <router-link to="/user/extract" class="acBtn">转出</router-link>-->
            </div>
            <h3 class="acoun-h3">交易记录</h3>
            <div class="acobvBox">
              <ul class="acobvUl">
                <li :class="type == 1 ? 'curr' : ''">
                  <a
                    @click="
                      type = 1;
                      pageNumber = 1;
                      listMoney();
                    "
                    >充值/返现</a
                  ><i></i>
                </li>
                <li :class="type == 2 ? 'curr' : ''">
                  <a
                    @click="
                      type = 2;
                      pageNumber = 1;
                      listMoney();
                    "
                    >支出</a
                  >
                </li>
              </ul>
              <!-- <ul class="acdateUl">
             <li>日期：</li>
             <li><div class="acdate"><i></i></div> </li>
             <li class="acLine"></li>
             <li> <div class="acdate"><i></i></div> </li>
             <li><span class="acquery">查询</span></li>
            </ul> -->
              <div class="acobvSolid"></div>
            </div>
            <table class="acTable">
              <thead>
                <th>金额(元)</th>
                <th>类型</th>
                <th>交易信息</th>
                <th>交易时间</th>
              </thead>
              <tbody>
                <tr v-for="(vo, index) in tempList" :key="index">
                  <td>{{ vo.userMoney }}</td>
                  <td>
                    <template v-if="vo.changeType == 1">结余</template>
                    <template v-else-if="vo.changeType == 2">支出</template>
                    <template v-else-if="vo.changeType == 3">充值</template>
                    <template v-else>其他</template>
                  </td>
                  <td>{{ vo.changeDesc }}</td>
                  <td>{{ formatSecond(vo.changeTime) }}</td>
                </tr>
              </tbody>
            </table>
			<el-row style="text-align: center;padding:30px 0 0;">
				<!--分页-->
				<el-pagination background layout="prev, pager, next" 
				:hide-on-single-page="value" :total="totalCount" 
				:page-size="pageSize" 
				:current-page="pageNumber" 
				@current-change="handleCurrentChange">
				</el-pagination>
			</el-row>
          </div>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
import { listByUid } from '@/api/users/userMoney';
import { formatSecond } from '@/utils/timeUtil';

export default {
  data() {
    return {
      type: 1,
      tempList: [],
      pageNumber: 1,
      pageSize: 10,
      value: true,
      totalCount: 0
    };
  },
  methods: {
    ...{ formatSecond },
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.listMoney();
    },
    listMoney() {
      listByUid({ pageNumber: this.pageNumber, pageSize: this.pageSize, type: this.type })
        .then(res => {
          this.totalCount = res.totalCount;
          this.$set(this, 'tempList', res.data);
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.listMoney();
  }
};
</script>

<style scope src="../../static/index/user/css/reset.css" />
<style scope src="../../static/index/user/css/all.css" />
<style scope src="../../static/index/user/css/foot.css" />
<style scope src="../../static/index/user/css/money.css" />
<style scope src="../../static/index/css/new/public.css" />
