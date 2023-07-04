<template>
  <div>
    <div class="UP_right_List">优惠券</div>
    <div class="Coupon_List" style="position: relative;max-height: 1925px;min-height: 920px;height: auto;padding-bottom: 90px;">
      <!-- 领取优惠券 -->
      <div v-if="canReceive">
        <div style="font-size: 16px;font-weight: 500;margin: 20px;">
          领取优惠券
        </div>
        <div style="display: flex;align-items: center;flex-wrap: wrap;">
          <div style="position: relative;margin-left: 20px;" v-for="(item,index) in canReceive" :key="index">
            <img src="../../static/coupon/coupon.png" style="width: 453px;height: 120px;" alt="">
            <div style="" class="couponGet">
              <!-- left -->
              <div class="flex flex_center" style="flex-wrap: wrap;width: 188px;">
                <span style="font-size: 38px;font-weight: bold;color: #D0111B;">优惠券</span>
                <div class="coupon_mark_" style="margin-left: 5px;">
                  <img src="../../static/coupon/coupon_min_my.png" style="width: 100%;position: absolute;" alt="">
                  <div class="coupon_min" style="color: rgb(255, 96, 0);left: 8px;">
                    {{ item.discountType != 4 ? '1次' : '满减'  }}
                  </div>
                </div>
                <div>
                  <span style="font-size: 14px;color: #999999;margin-top: 7px;">满{{item.satisfyMoney}}元可用</span>
                </div>
              </div>
              <!-- right -->
              <div class="flex" style="padding-left: 12px;">
                <div>
                  <p style="font-size: 18px;font-weight: bold;margin-top: 4px;">{{ item.couponName }}</p>
                  <p style="font-size: 14px;font-weight: 400;color: #FF0036;margin-top: 4px;">优惠金额：{{item.discountMoney}}元</p>
                  <p style="font-size: 14px;font-weight: 400;color: #999999;margin-top: 4px;">有效期：{{ formatDateSecond(item.endGetTime) }} </p>
                </div>
                <div style="padding-left: 18px;">
                  <el-button @click="receiveCoupon(item)" style="width: 76px;height: 36px;border: 1px solid #FF0036;color: #FF0036;margin-top: 10px;">领取</el-button>
                  <el-tooltip :content="item.couponRule" placement="right" effect="light">
                    <p style="margin-top: 10px;color: #666;">规则说明<el-icon name="arrow-right"></el-icon></p>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 我的优惠券 -->
      <div style="font-size: 16px;font-weight: 500;margin: 20px;">
        我的优惠券
      </div>
      <div class="Coupon_List_Hd">
        <ul class="first_list">
          <!--<li class="two-active no-distance"><a href="#">全部优惠券</a></li>-->
          <!-- <li :class="'two-active ' + (type === '' ? 'selected_0526' : '')">
            <router-link to="/user/userBonusList">全部（{{ wsyCount }}）</router-link>
          </li> -->
          <li :class="'two-active ' + (type === '2' ? 'selected_0526' : '')">
            <router-link to="/user/userBonusList?type=2">未使用（{{ couponData.notUsedNum || 0 }}）</router-link>
          </li>
          <li :class="'two-active ' + (type === '3' ? 'selected_0526' : '')">
            <router-link to="/user/userBonusList?type=3">已使用（{{ couponData.usedNum || 0 }}）</router-link>
          </li>
          <li :class="'two-active no-border ' + (type === '5' ? 'selected_0526' : '')">
            <router-link to="/user/userBonusList?type=5">已过期（{{ couponData.expiredNum || 0 }}）</router-link>
          </li>
        </ul>
      </div>
      <div class="box_big" >
        <div class="notUsed" style="display: flex;flex-wrap: wrap;">
          <div class="coupon" style="margin-right: 10px;margin-top: 16px;position: relative;" v-for="(item,index) in couponData.records" :key="index">
            <img v-if="item.status == 2" src="../../static/coupon/coupon_max.png" style="width: 100%;position: absolute;" alt="">
            <img v-else src="../../static/coupon/coupon_history.png" style="width: 100%;position: absolute;" alt="">
            <div class="coupon_top" :style="item.status != 2 ?'background-color: #D9D9D9;':''">
              <div class="flex flex_center">
                <div class="coupon_title" :style="item.status != 2 ?'color: #999;': ''">
                  优惠券
                </div>
                <div class="coupon_mark_" :style="item.status != 2 ?'background-color: #D9D9D9;color: #999;':''">
                  <img v-if="item.status == 2" src="../../static/coupon/coupon_min.png" style="width: 100%;position: absolute;left: 10px;" alt="">
                  <img v-else src="../../static/coupon/coupon_min_history.png" style="width: 100%;position: absolute;left: 10px;" alt="">
                  <div class="coupon_min" :style="item.status != 2 ?'color: #999;': ''">
                    {{ item.discountType != 4  ? '1次' : '满减'  }}
                  </div>
                </div>
              </div>
              <div class="coupon_name" style="">
                <span :style="item.status != 2 ?'color: #999;': ''">{{ item.couponTypeName }}</span>
              </div>
              <div style="margin-top:10px;color: #C7000A;font-size: 15px;font-weight: 400;">
                <span :style="item.status != 2 ?'color: #999;': ''">优惠金额：{{ item.discountMoney }}</span>
              </div>
              <div style="margin-top:10px;font-size: 14px;font-weight: 400;color: rgba(255,255,255,0.66);">
                <span :style="item.status != 2 ?'color: #999;': ''" v-if="item.useEffectivityType == 1">
                  有效期：{{ formatDateSecond(item.startEffectivityTime) }} 至 {{ formatDateSecond(item.endEffectivityTime) }}
                </span>
                <span :style="item.status != 2 ?'color: #999;': ''" v-else>
                  有效期：{{ formatDateSecond(item.receiverTime) }} 至 {{ formatDateSecond(Number(item.receiverTime) + (86400 * Number(item.useEffectivityDay))) }}
                </span>
              </div>
            </div>
            <div class="coupon_bottom" :style="item.status != 2 ? 'color: #666;' : ''">
              <img v-if="item.status == 5" src="../../static/coupon/expired.png" class="couponStatus" alt="">
              <img v-else-if="item.status == 3" src="../../static/coupon/hasUse.png" class="couponStatus" alt="">
              <p>
                <span class="coupon_left">
                  券编号：
                </span>
                <span class="coupon_right">
                  {{ item.promotionCode }}
                </span>
              </p>
              <p style="padding-top: 10px;">
                <span class="coupon_left">
                  领取时间：
                </span>
                <span class="coupon_right">
                  {{ formatDateSecond(item.receiverTime) }}
                </span>
              </p>
              <p style="padding-top: 10px;">
                <span class="coupon_left">
                  使用限制：
                </span>
                <span class="coupon_right" v-if="item.discountType == 1 || item.discountType == 2">
                  限单次最大抵扣金额{{item.discountMoney}}元
                </span>
                <span class="coupon_right" v-else-if="item.discountType == 3">
                  限单次最大抵扣金额{{item.discountMoney}}元,并且不超过订单比例{{ item.ratio }}%
                </span>
                <span class="coupon_right" v-else-if="item.discountType == 4">
                  满{{item.satisfyMoney}}元,抵扣{{ item.discountMoney }}元
                </span>
                <span class="coupon_right" v-else-if="item.discountType == 5">
                  满{{item.satisfyMoney}}元,抵扣比例{{ item.ratio }}%,限单次最大抵扣金额{{item.discountMoney}}元
                </span>
              </p>
              <p style="padding-top: 10px;" v-if="item.status == 3">
                <span class="coupon_left">
                  使用订单：
                </span>
                <span class="coupon_right">
                  {{ item.orderNo }}
                </span>
              </p>
              <p style="padding-top: 10px;" v-if="item.status == 3">
                <span class="coupon_left">
                  使用时间：
                </span>
                <span class="coupon_right">
                  {{ formatDateSecond(item.useTime) }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="clear"></div>
      <div style="position: absolute;bottom: 40px;left: 50%;transform: translate(-50%);">
        <el-pagination v-if="couponData.total" @current-change="changePage" background layout="prev, pager, next" :total="couponData.total" :page-size="couponData.size" :current-page.sync="couponData.current" > </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDateSecond } from '@/utils/timeUtil';
import { couponDrawPage, customerCouponInformation, customerGainCoupon } from '@/api/users/userBonusApi';

export default {
  name: 'UserBonusList',
  data() {
    return {
      couponData: {},
      type: '2',
      canReceive: []
    };
  },
  created() {
    this.getCouponList();
  },
  watch: {
    $route(to) {
      this.getCouponList();
      // this.pageNumber = 1;
    },
  },
  methods: {
    ...{ formatDateSecond },
    getCouponList(val=1) {
      this.type = this.$route.query.type || '2'
      let data = {
        status: this.type,
        uuid: this.$store.getters.userInfo.uuid,
        systemType: 'aocai_gw',
        size: 9,
        current: val
      }
      couponDrawPage(data).then(res => {
        this.couponData = res.data
      });
      customerCouponInformation({uuid: this.$store.getters.userInfo.uuid}).then(res => {
        this.canReceive = res.data
      })
    },
    changePage(val) {
      this.getCouponList(val)
    },
    receiveCoupon(row) {
      let obj = {
        couponPlanId: row.id,
        couponType: row.couponType,
        uuid: this.$store.getters.userInfo.uuid
      }
      customerGainCoupon(obj).then(res => {
        // if (res.dode == 200) {
        this.$message({ type: 'success', message: '领取成功' });
        this.getCouponList()
        // }
      })
    }
  }
};
</script>

<style scoped src="../../static/index/user/css/all.css" />
<style scoped>
.c-type-style01 .c-limit span,
.c-type-style01 .c-time {
  color: #868686;
}
.c-type-style01 .c-type-bottom {
  background-position: 0 -316px;
}

.flex {
  display: flex;
}
.flex_center {
  align-items: center;
  justify-content: center;
}
.coupon {
  width: 298px;
  height: 367px;
}
/* 优惠券上部 */
.coupon_top {
  /* height: 162px;
  -webkit-mask: radial-gradient(circle at 0 0,transparent 20px,red 0),
                radial-gradient(circle at right 0, transparent 20px,red 0); 
  -webkit-mask-composite: source-in;
  background: #FF574D;
  padding-top: 11px; */
  position: absolute;
  top: 11px;
  width: 100%;
  text-align: center;
}
.coupon_title {
  font-size: 42px;
  color: #fff;
  font-weight: bold;
}
.coupon_mark_ {
  width: 40px;
  height: 22px;
  position: relative;
}
.coupon_min {
  position: relative;
  left: 10px;
  line-height: 24px;
  color: #FFF4F4;
  font-weight: 500;
  font-size: 12px;
}
.coupon_bottom {
  /* height: 180px; */
  /* background: #FFFBF4; */
  width: 100%;
  position: relative;
  top: 156px;
  padding: 20px;
  text-align: left;
  font-size: 14px;
  color: #000;

}
.couponGet {
  position: absolute;
  display: flex;
  top: 16px;
  left: 2px;
}
.coupon_left {
  width: 75px;
  text-align: right;
  display: inline-block;
}
.couponStatus {
  width: 76px;
  height: 72px;
  position: absolute;
  right: 55px;
  bottom: -20px;
}
.coupon_name {
  margin-top:10px;
  color: #FFF;
  font-size: 14px;
  font-weight: 400;
}
</style>








