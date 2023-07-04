<template>
  <div class="guigeRt">
    <div class="guigeRtWrap">
      <!-- <h2 class="guigeRtH2">{{ topNav.data.name }}-{{ subNav.name }}报价</h2> -->
      <h2 class="guigeRtH2">报价</h2>
      <div class="geRtList">
        <h4>打样店地址</h4>
        <div class="dayC7">
          <p>地址：地址：广东省.佛山市.南海区里水镇麻奢后街傲彩包装产业园A栋打样店A5门</p>
          <p>联系人：杜思诗 18218517565</p>
        </div>
      </div>
    </div>
    <div class="geRtList">
      <h4>货期规则</h4>
      <div class="geRtSection">
        <p v-if="$route.query.cateId === '70'">1、打样数量固定为2个，货期请以客服沟通结果为准；</p>
        <p v-else>1、 数量超过10个、单个打印幅面较大、文件调整内容较多订单，货期请以客服沟通结果为准；</p>
        <p>2、 周日休息，订单顺延至下周一处理，请提前下单，带来不便请见谅。</p>
      </div>
    </div>
    <div class="geRtList" v-if="$route.query.cateId == 2">
      <h4>温馨提示:</h4>
      <div class="geRtSection" style="margin-top:10px">
        <p style="color:red;margin-top:5px;line-height:18px">因微坑盒打样与大货生产方式和条件有差异，微坑盒样品只能作为查看整体尺寸和检查内容之用，不可作为大货验收标准。</p>
      </div>
    </div>
    <div class="flex geRtExpect">
      <i></i>
      <div class="geRtExpectxt">
        <p>预计发货</p>
        <p id="out_time">{{ priceFormData.out_time }}</p>
      </div>
    </div>
    <div class="geRtList">
      <p class="flex geRtotal">
        总计:<span id="price_total">￥{{ priceFormData.total_price }}</span>
      </p>
      <div v-if="$route.query.cateId === '3'" style="color: red;font-size: 12px;padding-bottom: 10px">精装盒系统报价未完善，请点击右下角QQ客服人工报价</div>
      <div class="flex geRtBtnDv">
        <a href="javascript:void(0)" class="getBuy gobtn" @click="addCart('1')">立即购买</a>
        <a href="javascript:void(0)" class="joinShoping btnCart" @click="addCart('0')"><i></i>加入购物车</a>
      </div>
    </div>
  </div>
</template>

<script>
import { ACCESS_TOKEN } from '@/store/global-constant';
import store from '@/store';
import { strEquals } from '@/utils/strUtil';
import { getTopNav, getSubNav } from '@/utils/cateNavsUtil';
export default {
  name: 'PriceRight',
  props: {
    priceFormData: Object,
    addCart: Function
  },
  data() {
    return {
      currentUser: {},
      provinceList: [],
      cityList: [],
      topNav: {},
      proofCateNavs: []
    };
  },
  watch: {
    $route() {
      this.topNav = getTopNav(this.proofCateNavs, this.$route.query.cateId);
      this.subNav = getSubNav(this.proofCateNavs, this.$route.query.cateId, this.$route.query.subCateId);
    }
  },
  created() {
    if (localStorage.getItem(ACCESS_TOKEN) != null) {
      if (store.getters.userInfo == null) {
        store.dispatch('GetUserInfo').then(() => {
          this.currentUser = store.getters.userInfo;
        });
      } else {
        this.currentUser = store.getters.userInfo;
      }
    }
    this.proofCateNavs = this.$store.getters.proofCateNavs;
    this.topNav = getTopNav(this.proofCateNavs, this.$route.query.cateId);
    this.subNav = getSubNav(this.proofCateNavs, this.$route.query.cateId, this.$route.query.subCateId);
  },
  methods: {
    ...{ strEquals }
  }
};
</script>

<style scoped></style>
