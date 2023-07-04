<template>
  <div>
    <el-row class="contsAside">
      <h2 class="guigeRtH2">价格和货期</h2>
      <div class="geRtList">
        <h4>价格</h4>
        <table class="priceTable">
          <tr v-for="(item, index) in goodsPrice" :key="index">
            <td bgcolor="#fbfbfb">
              {{ item.goods_name }}
              <p class="C9">{{ item.number }}pcs</p>
            </td>
            <td class="extra en priceTatx">
              <p class="tdmoney">￥{{ item.price_old }}</p>
              <p class="f12 C7">单价: {{ item.unit_price }}</p>
            </td>
          </tr>
        </table>
      </div>
      <div class="geRtList">
        <h4>货期</h4>
        <ul class="guigeRtUl">
          <ol class="flex">
            <span>出货时间</span>
            <span>预计发货</span>
          </ol>
          <li>
            <div class="flex geRtime curr">
              <label class="layui-form-item geRtimeLt dateSel">
                <em class="dateH" value="0"></em>
                <span class="dayNormal">{{ priceFormData.time }}小时（{{ priceFormData.day }}天）</span>
              </label>
              <div class="extra en">
                <p class="moneyNormal">{{ priceFormData.out_time }}</p>
                <!-- <p class="f12 C7 unitNormal">单价:{{ getUnitPrice(priceFormData.price_normal, priceFormData.yssl * priceFormData.tkks) }}</p> -->
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="geRtList">
        <h4>货期规则</h4>
        <el-row class="geRtSection">
          20点前确认，当天20点开始计算；20点后确认，次日20点开始计算；周日和节假日不计货期。
          <a href="" class="bule" target="_blank">计时规则</a>
        </el-row>
      </div>
      <div class="geRtList">
        <h4>配送费用</h4>
        <div class="costBox">
          <form class="flex areBox" action="">
            <div class="layui-form-item">
              <el-select size="small" v-model="priceFormData.provinceId" placeholder="请选择" style="width:150px" @change="selectCity($event, 'province')">
                <el-option v-for="(item, index) in provinceList" :key="index" :label="item" :value="index + ''"> </el-option>
              </el-select>
            </div>
            <div class="layui-form-item">
              <el-select size="small" v-model="priceFormData.cityId" placeholder="请选择城市" style="width:150px" @change="selectCity($event, 'city')">
                <el-option v-for="(item, index) in cityList" :key="index" :label="item" :value="priceFormData.provinceId + '_' + index"> </el-option>
              </el-select>
            </div>
          </form>
          <p class="flex geRtkg">
            <span class="C9 kgColor goodsWeight">重量:{{ parseNumber(priceFormData.weight) }}kg</span>
            <span class="red en shipfee">¥{{ parseMoney(priceFormData.shipping_fee) }}</span>
          </p>
          <!-- <div class="flex geRtExpect">
            <i></i>
            <div class="geRtExpectxt">
              <p>预计发货</p>
              <p id="out_time">{{ priceFormData.out_time }}</p>
            </div>
          </div> -->
        </div>
      </div>

      <div class="geRtList">
        <div class="yuanPrice">
          <div class="flex priceDv">
            <span class="priceDvL"><em class="icon icon-cont"></em>原价</span>
            <span class="priceDvR"
              >¥<font id="price_old">{{ parseMoney(priceFormData.total_old) }}</font></span
            >
          </div>
        </div>
        <div class="geRtotal" v-if="priceFormData.total_old > priceFormData.total_member">
          <div class="flex priceDv">
            <span class="priceDvL"><i class="ticon"></i>会员价</span>
            <span class="priceDvR red"
              >¥ <font id="price_limit">{{ parseMoney(priceFormData.total_member) }}</font></span
            >
          </div>
        </div>
        <el-row :gutter="8" class="geRtBtnDv">
          <el-col :span="24"><el-button type="danger" @click="buyNow">立即购买</el-button></el-col>
        </el-row>
      </div>
    </el-row>
  </div>
</template>
<script>
import { strEquals } from '@/utils/strUtil';
import { getCity, getProvince, getAreaName } from '@/utils/city';

export default {
  name: 'GoodsPrice',
  props: {
    formData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    buyNow: {
      type: Function,
      default: () => {}
    },
    // 商品情况
    goodsPrice: {
      type: Array
    },
    // 商品属性
    priceFormData: {
      type: Object
    }
  },
  data() {
    return {
      value: '',
      options: '',
      model: '',
      provinceList: [],
      cityList: []
    };
  },
  created() {
    this.provinceList = getProvince();
  },
  methods: {
    ...{ strEquals },
    selectCity(val, type) {
      if (type === 'province') {
        this.$set(this.priceFormData, 'cityId', '');
        this.$set(this, 'cityList', getCity(this.priceFormData.provinceId));
      }
      console.log(this.priceFormData);
      // this.priceValuation();
    },
    getUnitPrice(price, num) {
      if (price > 0 && num > 0) {
        return (price / num).toFixed(2);
      }
      return 0;
    },
    selectExtends(val) {
      if (!strEquals(val, this.priceFormData.extends)) {
        this.priceFormData.extends = val;
        // this.priceValuation();
      }
    },
    // 调用计价
    invokeValuation() {
      let form = this.priceFormData;
      let city = getAreaName('province', form.provinceId) + ' ' + getAreaName('city', form.cityId);
      // this.formData['city'] = city;
      this.$set(this.formData, 'city', city);
      // console.log('填入地址', this.formData);
    },
    // 保留两位小数
    parseMoney(money) {
      if (money) {
        return parseFloat(money).toFixed(2);
      }
      return parseFloat(0).toFixed(2);
    },
    parseNumber(number) {
      if (number) {
        return number;
      }
      return parseInt(0);
    }
  },
  watch: {
    priceFormData: {
      handler(newVal, oldVal) {
        if (newVal.cityId && newVal.provinceId) {
          this.invokeValuation();
        }
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped></style>
<style scoped src="@/static/mulindex/css/fonts.css" />
<style scoped src="@/static/mulindex/css/attr.css" />
<style scoped src="@/static/mulindex/css/shop.css" />
