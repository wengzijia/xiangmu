<template>
  <div>
    <div class="UP_right_List">优惠券</div>
    <div class="Coupon_List">
      <div class="Coupon_List_Hd">
        <ul class="first_list">
          <!--<li class="two-active no-distance"><a href="#">全部优惠券</a></li>-->
          <li :class="'two-active ' + (type === '1' ? 'selected_0526' : '')">
            <router-link to="/user/userBonusList?type=1">未使用（{{ wsyCount }}）</router-link>
          </li>
          <li :class="'two-active ' + (type === '3' ? 'selected_0526' : '')">
            <router-link to="/user/userBonusList?type=3">已使用（{{ ysyCount }}）</router-link>
          </li>
          <li :class="'two-active no-border ' + (type === '2' ? 'selected_0526' : '')">
            <router-link to="/user/userBonusList?type=2">已过期（{{ ygqCount }}）</router-link>
          </li>
        </ul>
      </div>
      <div class="box_big">
        <div class="notUsed">
          <div class="coupon-type" v-for="(item, index) in bonusList" :key="index">
            <div :class="'c-type-style ' + ($route.query.type === '3' || $route.query.type === '2' ? 'c-type-style01' : '')">
              <div class="c-price">
                <em>￥</em>
                <strong>{{ item.miniBonusType.bonusMoney }}</strong>
              </div>
              <div class="c-limit">
                <span>优惠券</span> 【满{{item.miniBonusType.minAmount}}可用】
              </div>
              <div class="c-time">{{ formatDateSecond(item.addTime) }}-{{ formatDateSecond(item.bonusEndTime) }}</div>
              <div class="c-type-top"></div>
              <div class="c-type-bottom"></div>
              <div class="displayIcon" style="display: none;"></div>
            </div>
            <div class="c-message usedSite">
              <div class="range-item">
                <span class="lable">券 &nbsp;编&nbsp;号：</span>
                <span class="txt">{{ item.bonusSn ? item.bonusSn : '0' }}</span>
              </div>
              <div class="range-item">
                <span class="lable">使用限制：</span>
                <span class="txt">消费满1即可使用</span>
              </div>
              <div class="range-item">
                <span class="lable">平台限制：</span>
                <span class="txt">全平台</span>
              </div>
              <div v-if="$route.query.type === '3'"  class="iconSite"></div>
              <div v-if="$route.query.type === '2'"  class="iconSite overdued-site"></div>

            </div>
          </div>
        </div>
        <!--big_box-->
      </div>
      <div class="clear"></div>
      <div class="w_page_0528" style="margin:30px 0;">
      </div>
      <el-pagination style="text-align:center;" background layout="prev, pager, next" :total="totalCount" :hide-on-single-page="true"
                     :page-size="pageSize" :current-page.sync="pageNumber"> </el-pagination>
    </div>
  </div>
</template>

<script>
import { formatDateSecond } from '@/utils/timeUtil';
import { getUserBonusList } from '@/api/users/userBonusApi';
export default {
  name: 'UserBonusList',
  data() {
    return {
      bonusList: [],
      totalCount: 0,
      pageSize: 6,
      pageNumber: 1,
      wsyCount: 0,
      ysyCount: 0,
      ygqCount: 0,
      type: '1'
    };
  },
  created() {
    this.getBonusList();
    this.getUserBonusCount();
  },
  watch: {
    $route(to) {
      this.getBonusList();
      this.pageNumber = 1;
    },
    pageNumber: {
      handler() {
        this.getBonusList();
      }
    }
  },
  methods: {
    ...{ formatDateSecond },
    getUserBonusCount() {
      getUserBonusList({ status: '1' }).then(res => {
        this.wsyCount = res.totalCount;
      });
      getUserBonusList({ status: '3' }).then(res => {
        this.ysyCount = res.totalCount;
      });
      getUserBonusList({ status: '2' }).then(res => {
        this.ygqCount = res.totalCount;
      });
    },
    getBonusList() {
      this.type = this.$route.query.type;
      if (!this.type) {
        this.type = '1';
      }
      getUserBonusList({ status: this.type, pageNumber: this.pageNumber, pageSize: this.pageSize }).then(res => {
        this.$set(this, 'bonusList', res.data);
        this.$set(this, 'totalCount', res.totalCount);
      });
    }
  }
}
</script>

<style scoped src="../../static/index/user/css/all.css" />
<style scoped>
.c-type-style01 .c-limit span,.c-type-style01 .c-time {
  color: #868686;
}
.c-type-style01 .c-type-bottom {
  background-position: 0 -316px;
}
</style>

