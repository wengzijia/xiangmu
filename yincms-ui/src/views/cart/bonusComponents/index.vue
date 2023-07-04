<template>
  <li class="couponconts" v-show="show">
    <div class="ordok_h3" style="display: flex;justify-content: space-between;">
      <h3>
        <i>+</i>使用优惠券
        <span class="C9"
          >已成功使用<font class="red"> {{ this.frame }} </font>张卡券</span
        >
      </h3>
      <div style="margin-right: 15px;" @click="jumpCoupon()">
        <span style="color: #FF0036;">我的优惠券</span>
        <el-icon style="position: absolute;color: #dfdfdf;right: 0px;background-color: transparent;" name="arrow-right"></el-icon>
      </div>
    </div>
    <div class="coupsBox">
      <p class="coupsNoe center C9" v-if="!couponList">您还没有满足条件的优惠券</p>
      <div v-else>
        <div class="coupon" v-for="(item, index) in couponList" :key="index" @click="checkCoupon(index)">
          <div style="position: relative;">
            <img v-if="item.check"  src="./coupon_check.png"  style="width:100%;height:145px;" alt="dark" />
            <img v-else src="./coupon_noCheck.png" style="width:100%;height:145;" alt="dark" />
            <p style="color: #fff; font-size: 23px;font-weight:500;position: absolute;top: 15px;left: 20px;">
              优惠券
            </p>
            <img style="position: absolute;top: 20px;left: 100px;" src="./coupon_check_min.png" alt="dark" />
            <p style="position: absolute;top: 22px;left: 110px;color:#D0111B;">
              {{ item.discountType != 4 ? '1次' : '满减' }}
            </p>
            <div style="position: absolute;top: 50px;left: 20px;">
              <p style="color:#FFFFFF">
                {{ item.couponName }}
              </p>
              <p style="margin-top:12px;font-size: 12px;font-weight: 400;color: rgba(255,255,255,0.7);">
                有效期：{{formatDateSecond(item.startEffectivityTime)}} 至 {{formatDateSecond(item.endEffectivityTime)}}
              </p>
              <p style="padding-top: 20px;font-size: 14px;font-weight: 400;color: #666666;text-align: center;">
                [最高限额{{ item.maximumAmount }}元]
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>
<script>
import { formatDateSecond } from '@/utils/timeUtil';
import { customerOrderCouponDrawList,customerIvAdvanceCouponMoney } from '@/api/cart/cartCheckProofApi';

export default {
  name: 'BonusComponents',
  model: {
    prop: "couponData", //绑定的值，通过父组件传递
    event: "update" //自定义时间名
  },
  props: {
    // 是否显示
    show: {
      type: Boolean,
      default: true
    },
    // 商品统计数据
    orderData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    couponData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      frame: 0,
      // couponData: {},
      couponList: null,
      isOut: null, // 外发商品信息
      notOut: null, // 非外发商品信息
    };
  },
  // computed: {
  //   couponData: function() {
  //     return this.arrayData
  //   }
  // },
  beforeMount() {
    console.log('优惠券开始');
    if (this.orderData) {
      if (this.orderData?.isOut) {
        this.isOut = {...this.orderData?.isOut}
      }
      this.notOut = {...this.orderData}
      this.notOut?.isOut && delete this.notOut?.isOut
      this.getCoupon()
    }
  },
  methods: {
    ...{formatDateSecond},
    // 获取优惠券
    getCoupon(reset = true) {
      let obj = {}
      let _IsOut = false
      if (reset && this.notOut) {        
        obj = {...this.notOut}
      } else if (this.isOut) {
        obj = {...this.isOut}
        _IsOut = true
      }
      if (obj != {}) {
        customerOrderCouponDrawList({
          uuid: this.$store.getters.userInfo.uuid,
          ...obj
        }).then(res => {
          reset && (this.couponList = [])
          this.frame = 0
          if (reset) {
            res.data && (this.couponList = this.disposeCoupon(res.data, _IsOut))
          } else {
            res.data && (this.couponList = this.couponList.concat(this.disposeCoupon(res.data, _IsOut)))
            this.couponList = this.couponList.filter(e => {return e.id})
          }
          // 如果不仅有非外发商品 还有 外发商品信息则再请求一遍优惠券
          if (reset && this.notOut && this.isOut) {
            this.getCoupon(false)
          }
        })
      }
    },
    // 处理优惠券
    disposeCoupon(arr, _isOut) {
      return arr.map(e => {
        if (e.visibleStatus == 1) {
          return
        }
        // 有效期时间处理
        if (e.useEffectivityType == 2) {
          e.startEffectivityTime = e.receiverTime
          e.endEffectivityTime = e.receiverTime + (e.useEffectivityDay * 86400)
        }
        // 判断是否是月度券 第一次请求中如果有 月度券 则清空外发商品信息
        if(e.couponType == 'yewu_month_coupon') {
          this.isOut = null
        }
        e.check = false
        e.isOut = _isOut
        return e
      }).filter(e => {return e})
    },
    // 点击优惠券
    checkCoupon (index) {
      console.log('checkCoupon', index);
      if (this.couponList[index].check) {
        this.couponList[index].check = false
        this.frame--
      } else {
        this.couponList = this.couponList.map(e => {
          if (e.check) {
            this.frame--
          }
          return {...e, check: false}
        })
        this.couponList[index].check = true
        this.frame++
      }
      this.countCouponMoney(this.couponList)
    },
    // 更换优惠券
    countCouponMoney(arr) {
      let data = {
        ...this.orderData,
        useCouponList: arr.map(e => {
          if (e.check) {
            return {
              couponPlanDrawId: e.id,
              couponPlanId: e.couponPlanId,
              couponType: e.couponType,
              useMoney: e.useMoney,
              isOut: e.isOut       
            }
          }
          return ''
        }).filter(e => {return e})
      }
      this.$emit('update', data.useCouponList)
      this.$emit('change', data.useCouponList)
    },
    jumpCoupon() {
      this.$router.push('/user/userBonusList')
    }
  },
};
</script>

<style scoped src="@/static/index/css/shopping.css"></style>
<style scoped src="@/static/index/css/base.css"></style>
<style scoped>
.flex {
  display: flex;
}
.flex_center {
  align-items: center;
  justify-content: flex-start;
}
.coupon {
  width: 264px;
  text-align: left;
  border: 0;
}
/* 优惠券上部 */
.coupon_top {
  height: 102px;
  -webkit-mask: radial-gradient(circle at 0 0,transparent 15px,red 0),
                radial-gradient(circle at right 0, transparent 15px,red 0); 
  -webkit-mask-composite: source-in;
  background: #FF574D;
  padding-top: 11px;
  position: relative;
}
.coupon_bg {
  position: absolute;
  right: 6px;
  bottom: -4px;
  transform: rotate(335deg);
  opacity: 0.7;
}
.coupon_title {
  font-size: 27px;
  color: #fff;
  font-weight: 600;
}
.coupon_mark {
  width: 42px;
  height: 24px;
  -webkit-mask: radial-gradient(circle at 0, #0000 4px, #FFF4F4 0), radial-gradient(circle at right, #0000 4px, #FFF4F4 0); 
  -webkit-mask-composite: source-in;
  background-color: #D0111B;
  opacity: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 7px;
}
.coupon_mark_ {
  width: 40px;
  height: 22px;
  -webkit-mask: radial-gradient(circle at 0, #0000 4px, #FFF4F4 0), radial-gradient(circle at right, #0000 4px, #FFF4F4 0); 
  -webkit-mask-composite: source-in;
  background: #FF574D;
  text-align: center;
  line-height: 22px;
  color: #D0111B;
  font-weight: 500;
  font-size: 14px;
}
.coupon_bottom {
  height: 40px;
  background: #FFFBF4;
  position: relative;
  text-align: center;
}
.check_coupon {
  border: 1px solid #FF0036;
  border-top: 0;
}
.noCheck_coupon {
  border: 1px solid #DFDFDF;
  border-top: 0;
}
.coupon_side {
  position: absolute;
  top: -145px;
  right: 145px;
  width: 8px;
  height: 298px;
  margin: auto;
  -webkit-mask: radial-gradient(circle at -1px, transparent 5px, red 0) 0px / 100% 15px;
  background-color: #FF574D;
  transform: rotate(-90deg);
}

</style>