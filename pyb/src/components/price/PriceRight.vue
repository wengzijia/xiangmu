<template>
  <div class="guigeRt">
    <div class="guigeRtWrap">
      <h2 class="guigeRtH2">{{ topNav.name }}-{{ subNav.name }}报价</h2>
      <div class="geRtList">
        <h4>价格</h4>
        <ul class="guigeRtUl">
          <ol class="flex">
            <span>出货时间</span>
            <span>价格</span>
          </ol>
          <li>
            <div v-if="$route.query.cateId === '70'">
              <div :class="'flex geRtime' + ' curr'">
                <label class="layui-form-item geRtimeLt dateSel">
                  <em class="dateH" value="0"></em>
                  <span class="dayNormal">具体货期请咨询客服</span>
                </label>
              </div>
            </div>
            <div v-else>
              <div :class="'flex geRtime' + (strEquals(priceFormData.extends, '1') ? ' curr' : '')" @click="selectExtends('1')">
                <label class="layui-form-item geRtimeLt dateSel">
                  <em class="dateH" value="1"></em>
                  <span class="dayNormal">{{ priceFormData.time_normal }}小时（{{ priceFormData.days_normal }}天）</span>
                </label>
                <div class="extra en">
                  <p class="moneyNormal">¥{{ priceFormData.price_normal }}</p>
                  <p class="f12 C7 unitNormal">单价:{{ getUnitPrice(priceFormData.price_normal, priceFormData.yssl) }}</p>
                </div>
              </div>
              <div :class="'flex geRtime' + (strEquals(priceFormData.extends, '0') ? ' curr' : '')" @click="selectExtends('0')">
                <!-- <div
                v-if="priceFormData.yssl < 10000 && (($route.query.cateId === '1' && $route.query.subCateId == '24') || $route.query.cateId === '13' || ($route.query.cateId === '4' && $route.query.subCateId === '35'))"
                :class="'flex geRtime' + (strEquals(priceFormData.extends, '1') ? ' curr' : '')"
                @click="selectExtends('1')"
              > -->
                <label class="layui-form-item geRtimeLt dateSel">
                  <em class="dateH" value="0"></em>
                  <span class="daySlow">{{ priceFormData.time_fast }}小时（{{ priceFormData.days_fast }}天）</span>
                </label>
                <div class="extra en">
                  <p class="moneySlow">¥{{ priceFormData.price_fast }}</p>
                  <p class="f12 C7 unitSlow">单价:{{ getUnitPrice(priceFormData.price_fast, priceFormData.yssl) }}</p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="geRtList" v-if="$route.query.cateId == '1' && $route.query.subCateId != '24'">
        <table class="meterTable">
          <tr>
            <td width="35%"><span class="meterSp">数量</span></td>
            <td width="65%"><span class="priceEach">价格</span></td>
          </tr>
          <tr>
            <td><span class="meterSp">1000</span></td>
            <td>
              <span class="priceEach price1">{{ priceFormData.price1 }}</span
              >元
            </td>
          </tr>

          <tr>
            <td><span class="meterSp">2000</span></td>
            <td>
              <span class="priceEach price2">{{ priceFormData.price2 }}</span
              >元
            </td>
          </tr>
          <tr>
            <td><span class="meterSp">3000</span></td>
            <td>
              <span class="priceEach price3">{{ priceFormData.price3 }}</span
              >元
            </td>
          </tr>
          <tr>
            <td><span class="meterSp">5000</span></td>
            <td>
              <span class="priceEach price5">{{ priceFormData.price5 }}</span
              >元
            </td>
          </tr>
          <tr>
            <td><span class="meterSp">10000</span></td>
            <td>
              <span class="priceEach price10">{{ priceFormData.price10 }}</span
              >元
            </td>
          </tr>
        </table>
      </div>
      <!-- 货期规则 -->
      <div class="geRtList" v-if="$route.query.subCateId === '24'">
        <h4>货期规则</h4>
        <div class="geRtSection">
          20点前确认，当天20点开始计算；20点后确认，次日20点开始计算；周日和节假日不计货期。
          <a href="/news/detail?id=102" class="bule">计时规则</a>
        </div>
        <div class="geRtSection chap red" v-if="$route.query.subCateId === '24'">
          <span class="red">温馨提示：</span><br />
          1、本通道仅限于用您自主设计的卡盒盒型刀模图进行下单，如文件导致的问题，责任自负；<br />
          2、本通道报价、货期只能作为参考，实际价格与生产货期以我司客服反馈为准 ；<br />
          3、本通道仅限卡盒下单，非卡盒品类在此下单不退款不生产，请您谅解；<br />
          4、建议按照对应盒型报价下单，价格比此通道更优惠，祝您下单愉快！
        </div>
        <div class="geRtSection" v-if="$route.query.subCateId === '24'">
          <p class="agree_check">
            <label>
              <!--              <input type="checkbox" name="agree" class="colored-danger btnCheckAll" value="1">-->
              <el-checkbox v-model="priceFormData.agreement" />
              <span class="text"></span>
            </label>
            <span>我已了解并同意以上免责声明</span>
          </p>
        </div>
      </div>
      <!-- 配送费用 -->

      <div class="geRtList">
        <h4>配送费用</h4>
        <div class="costBox">
          <form class="flex areBox" action="">
            <div class="layui-form-item">
              <el-select size="small" v-model="priceFormData.provinceId" placeholder="请选择省份" style="width: 150px" @change="selectCity($event, 'province')">
                <el-option v-for="(item, index) in provinceList" :key="index" :label="item" :value="index + ''"> </el-option>
              </el-select>
            </div>
            <div class="layui-form-item">
              <el-select size="small" v-model="priceFormData.cityId" placeholder="请选择城市" style="width: 150px" @change="selectCity($event, 'city')">
                <el-option v-for="(item, index) in cityList" :key="index" :label="item" :value="priceFormData.provinceId + '_' + index"> </el-option>
              </el-select>
            </div>
          </form>
          <p class="flex geRtkg">
            <span class="C9 kgColor goodsWeight">重量:{{ priceFormData.weight }}kg</span>
            <span class="red en shipfee">¥{{ priceFormData.shipping_fee }}</span>
          </p>
          <div class="flex geRtExpect">
            <i></i>
            <div class="geRtExpectxt">
              <p>预计发货</p>
              <p id="out_time">{{ priceFormData.out_time }}</p>
              <!-- <p class="red">临近年关，且因疫情影响，货期会有2-3天的波动</p> -->
            </div>
          </div>
        </div>
      </div>
      <div class="geRtList">
        <div class="geRtotalBox" v-if="currentUser.vipRank <= 0 || currentUser.vipRank > 6">
          <p class="flex geRtotal">
            总计:<span id="price_total">￥{{ priceFormData.total_price + priceFormData.shipping_fee }}</span>
          </p>
        </div>
        <div class="geRtotalBox" v-else-if="currentUser.vipRank">
          <div class="yuanPrice">
            <div class="flex priceDv">
              <span class="priceDvL"><i></i>普通会员</span>
              <span class="priceDvR"
                >¥ <font id="price_old">{{ priceFormData.price_old + priceFormData.shipping_fee }}</font></span
              >
            </div>
          </div>
          <div class="geRtotal">
            <div class="flex priceDv">
              <span class="priceDvL"
                ><i class="vicon"></i>您的V{{ currentUser.vipRank }}会员价
                <div class="guigeTis">
                  ?
                  <div class="geTipstxt">
                    <s></s>
                    <div class="vipstx">
                      <p class="flex"><span>1.</span> <span>从2019年7月1日开始计算累计PO数量，PO数量不含标签</span></p>
                      <p class="flex"><span>2.</span> <span>线下报价订单不享受本优惠政策、卡盒特殊材质不享受优惠</span></p>
                      <p class="flex"><span>3.</span> <span>第1次下单PO不参与优惠，商品交付后开始计数</span></p>
                      <p class="flex"><span>4.</span> <span>物流费、税金不参与优惠</span></p>
                      <p class="flex"><span>5.</span> <span>会员到期：2021-05-04</span></p>
                    </div>
                  </div>
                </div>
              </span>
              <span class="priceDvR red"
                >¥ <font id="price_limit">{{ priceFormData.total_price + priceFormData.shipping_fee }}</font></span
              >
            </div>
          </div>
          <p class="yuantiptxt">恭喜您获得拼一版的V6会员等级，您将享受9折的折扣，会员到期：2021-05-04</p>
          <!-- <p class="yuantiptxt">比普通会员优惠<span class="red">9%</span></p> -->
        </div>
        <div class="price" style="display: none">
          <input type="text" class="quotemobile priceIput" placeholder="请输入您的电话号码" />
          <button onclick="Quote()" class="priceBtn">申请人工核价</button>
          <br />
          <span class="priceTips">订单价格＞1万元，可申请人工核价，价格更优惠，输入联系电话，拼一版包装顾问将与您联系</span>
        </div>
        <div v-if="$route.query.cateId === '3'" style="color: red; font-size: 12px; padding-bottom: 10px">精装盒系统报价未完善，请点击右下角QQ客服人工报价</div>
        <!-- <p class="upPriceTips hide">抗击疫情，限时折扣！</p> -->
        <p style="color:red;margin-bottom:10px" v-show="priceFormData.out_time">此价格不含税，如需开普票加5个点、专票加13个点</p>
        <div class="flex geRtBtnDv">
          <a href="javascript:;" :disabled="priceFormData.submitProgress" @click="addCart('1')" class="buybtn goCart getBuy">立即购买</a>
          <a href="javascript:;" @click="addCart('0')" class="joinShoping buybtn btnCart curr"><i></i>加入购物车</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ACCESS_TOKEN } from '@/store/global-constant';
import store from '@/store';
import { strEquals } from '@/utils/strUtil';
import { getCity, getProvince } from '@/utils/city';
import { getSubNav, getTopNav } from '@/utils/cateNavsUtil';
export default {
  name: 'PriceRight',
  props: {
    priceFormData: Object,
    addCart: Function,
    priceValuation: Function
  },
  data() {
    return {
      currentUser: {},
      provinceList: [],
      cityList: [],
      cateNavs: [],
      topNav: { name: '' },
      subNav: { name: '' }
    };
  },
  watch: {
    $route() {
      this.topNav = getTopNav(this.cateNavs, this.$route.query.cateId).data;
      this.subNav = getSubNav(this.cateNavs, this.$route.query.cateId, this.$route.query.subCateId);
    }
  },
  created() {
    console.log('priceFormData', this.priceFormData);
    this.provinceList = getProvince();
    if (localStorage.getItem(ACCESS_TOKEN) != null) {
      if (store.getters.userInfo == null) {
        store.dispatch('GetUserInfo').then(() => {
          this.currentUser = store.getters.userInfo;
        });
      } else {
        this.currentUser = store.getters.userInfo;
      }
    }
    if (store.getters.priceCateNavs.length === 0) {
      store.dispatch('GetPriceCateNavs').then(() => {
        this.cateNavs = store.getters.priceCateNavs;
        console.log('标题', this.cateNavs);
        if (this.$route.query.cateId && this.$route.query.subCateId) {
          this.topNav = getTopNav(this.cateNavs, this.$route.query.cateId).data;
          this.subNav = getSubNav(this.cateNavs, this.$route.query.cateId, this.$route.query.subCateId);
        }
      });
    } else {
      this.cateNavs = store.getters.priceCateNavs;
      if (this.$route.query.cateId && this.$route.query.subCateId) {
        this.topNav = getTopNav(this.cateNavs, this.$route.query.cateId).data;
        this.subNav = getSubNav(this.cateNavs, this.$route.query.cateId, this.$route.query.subCateId);
      }
    }
  },
  methods: {
    ...{ strEquals },
    getUnitPrice(price, num) {
      if (price > 0 && num > 0) {
        return (price / num).toFixed(2);
      }
      return 0;
    },
    selectExtends(val) {
      console.log('selectExtendsval', val);
      if (!strEquals(val, this.priceFormData.extends)) {
        this.priceFormData.extends = val;
        this.priceFormData.tatolTime = val == '1' ? this.priceFormData.time_normal : this.priceFormData.time_fast;
        // console.log('货期时间666', this.priceFormData.tatolTime);
        this.priceValuation();
      }
      this.priceValuation();
    },
    selectCity(val, type) {
      if (type === 'province') {
        this.$set(this.priceFormData, 'cityId', '');
        this.$set(this, 'cityList', getCity(this.priceFormData.provinceId));
      }
      this.priceValuation();
    }
  }
};
</script>

<style>
.el-select-dropdown .el-scrollbar .el-scrollbar__wrap {
  overflow: scroll !important;
}
</style>

<style scoped>
.meterTable {
  border: 1px solid #edeef0;
  width: 100%;
  line-height: 38px;
  color: #666;
}
.meterTable tr,
.meterTable td {
  border: 1px solid #edeef0;
}
.meterTable td {
  padding-left: 20%;
}
.meterTable td:first-child {
  background-color: #f8f8f8;
  padding-right: 20px;
  padding-left: 0;
  text-align: right;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
</style>
