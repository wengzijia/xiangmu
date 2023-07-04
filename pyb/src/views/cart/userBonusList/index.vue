<template>
  <div>
    <div class="Coupon_List">
      <div class="box_big">
        <div class="notUsed">
          <div class="coupon-type" v-for="(item, index) in bonusList" :key="index">
            <div :class="'c-type-style '">
              <div class="c-price">
                <em>￥</em>
                <strong>{{ item.miniBonusType.bonusMoney }}</strong>
              </div>
              <div class="c-limit"><span>优惠券</span> 【满{{ item.miniBonusType.minAmount }}可用】</div>
              <div class="c-time">{{ formatDateSecond(item.miniBonusType.startTime) }}-{{ formatDateSecond(item.miniBonusType.endTime) }}</div>
              <div class="c-type-top"></div>
              <div class="c-type-bottom"></div>
              <div class="displayIcon" style="display: none;"></div>
            </div>
            <div class="c-message usedSite">
              <div class="range-item">
                <span class="lable">券 &nbsp;编&nbsp;号：</span>
                <span class="txt">0</span>
              </div>
              <div class="range-item">
                <span class="lable">使用限制：</span>
                <span class="txt">消费满1即可使用</span>
              </div>
              <div class="range-item">
                <span class="lable">平台限制：</span>
                <span class="txt">全平台</span>
              </div>
            </div>
          </div>
        </div>
        <!--big_box-->
      </div>
      <div class="clear"></div>
      <div class="w_page_0528" style="margin:30px 0;"></div>
      <el-pagination background layout="prev, pager, next" :total="totalCount" :hide-on-single-page="true" :page-size="pageSize" :current-page.sync="pageNumber"> </el-pagination>
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
};
</script>
