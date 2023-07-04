<template>
  <div class="guigeRt">
    <div class="guigeRtWrap">
      <h2 class="guigeRtH2">定制精装盒</h2>
      <div class="geRtList">
        <div class="geRtSection chap">
          <b style="color:#000">温馨提示：</b><br />
          <p><span class="red"> * </span> 由于精装盒过于复杂，需要人工进行报价，请提供您包装盒的信息；</p>
          <p><span class="red"> * </span> 没有设计稿的情况下请邮寄包装样品给傲彩，根据您邮寄的样品报价；</p>
          <p><span class="red"> * </span> 需要设计精装盒，请邮寄商品给傲彩，我们会按您的产品定位量身设计一款精装盒；</p>
          <p><span class="red"> * </span> 设计和打样在报价之前会产生额外费用，为了避免发生纠纷，需要先收取设计和打样费；</p>
        </div>
      </div>
      <!-- 配送费用 -->
      <div class="geRtList">
        <h4>配送地址</h4>
        <div class="costBox">
          <form class="flex areBox" action="">
            <div class="layui-form-item">
              <el-select size="small" v-model="priceFormData.provinceId" placeholder="请选择" style="width: 150px" @change="selectCity($event, 'province')">
                <el-option v-for="(item, index) in provinceList" :key="index" :label="item" :value="index + ''"> </el-option>
              </el-select>
            </div>
            <div class="layui-form-item">
              <el-select size="small" v-model="priceFormData.cityId" placeholder="请选择城市" style="width: 150px" @change="selectCity($event, 'city')">
                <el-option v-for="(item, index) in cityList" :key="index" :label="item" :value="priceFormData.provinceId + '_' + index"> </el-option>
              </el-select>
            </div>
          </form>
        </div>
      </div>
      <div class="geRtList" style="margin:100px 0 20px 0">
        <h4>总计：<span style="font-size:30px;color:red">待报价</span></h4>
      </div>
      <div class="geRtList">
        <div class="flex geRtBtnDv">
          <a href="javascript:;" class="joinShoping buybtn btnCart curr" @click="hardcoverfn">立即下单</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCity, getProvince, getAreaName } from '@/utils/city';
export default {
  name: 'PriceRight',
  props: {
    priceFormData: Object,
    hardcover: Function
  },
  data() {
    return {
      provinceList: [],
      cityList: []
    };
  },

  created() {
    this.provinceList = getProvince();
  },
  methods: {
    selectCity(val, type) {
      if (type === 'province') {
        this.$set(this.priceFormData, 'cityId', '');
        this.$set(this, 'cityList', getCity(this.priceFormData.provinceId));
      }
    },
    hardcoverfn() {
      let city = '';
      if (this.priceFormData.provinceId !== '') {
        city += getAreaName('province', this.priceFormData.provinceId);
      }
      if (this.priceFormData.cityId !== '') {
        if (city !== '') {
          city += ' ';
        }
        city += getAreaName('city', this.priceFormData.cityId);
      }
      console.log(this.priceFormData.provinceId);
      console.log(this.priceFormData.cityId);
      console.log('city', city);
      this.hardcover(city);
    }
  }
};
</script>

<style scoped>
.geRtListkg {
  margin-top: 20px;
}
.geRtListkg li {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-top: 0;
  border-bottom: 0;
  padding: 0;
}
.geRtListkglist {
  width: 309px;
  height: 45px;
  line-height: 55px;
  border-bottom: 1px solid #e0e0e0;
  padding-left: 10px;
}
.labelr .el-radio__input {
  display: none;
}
.chap p {
  line-height: 20px;
  margin-top: 5px;
  color: #000;
}
</style>
