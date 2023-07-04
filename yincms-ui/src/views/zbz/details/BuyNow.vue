<template>
  <div class="graybj" id="app">
    <!-- 商品详情共享部分 -->
    <detail-nav :id="goodsId"></detail-nav>

    <div class="comBox axnMain">
      <!--banner-->
      <zbz-index-banner :dataArray="indexList" :divClass1="'detasBanner'"></zbz-index-banner>
      <!--banner end-->
      <el-container class="contsbox">
        <el-main class="contsMain">
          <!-- 商品属性 -->
          <goods-attributes :dataArray="goodsAttributes" :form.sync="goodsForm" @changeForm="_changeForm"></goods-attributes>
        </el-main>
        <el-aside width="350px">
          <!-- 商品计价 -->
          <goods-price :formData="goodsForm" :goodsPrice.sync="selected" :priceValuation="runInovke" :priceFormData.sync="invokeData" :buyNow.sync="clickBuyNowButton"></goods-price>
        </el-aside>
      </el-container>
    </div>
    <login-form :dialogVisible="loginVisible" @update:dialogVisible="loginVisible = false"></login-form>
  </div>
</template>
<script>
import DetailNav from './detailNav/index';
import ZbzIndexBanner from '../indexComponents/ZbzIndexBanner';
import GoodsAttributes from './buyNowComponents/GoodsAttributes';
import GoodsPrice from './buyNowComponents/GoodsPrice';
import LoginForm from '@/components/common/LoginForm';
import store from '@/store';
import { ACCESS_TOKEN } from '@/store/global-constant';
import { resultHandler } from '@/utils/zbz/zbzUtil';
import { getProductDetail, getProductPrice, buyNowProduct } from '@/api/zbz/zbzProductApi';

export default {
  name: 'BuyNow',
  components: {
    DetailNav,
    ZbzIndexBanner,
    GoodsAttributes,
    GoodsPrice,
    LoginForm
  },
  data() {
    return {
      // 商品id
      goodsId: '',
      // 商品详情
      goodsDetail: '',
      // 轮播图
      indexList: [],
      // 商品属性
      goodsAttributes: [],
      // 选中的数量或者商品
      goodsForm: { orderNumber: '', checked: [] },
      // 价格和货期
      priceAndDelivery: {},
      // 选中的数量临时存储
      tempGoodsAttr: {},
      // 选中的盒型计算价格
      selected: [],
      // 计价数据
      invokeData: {},
      // 提交锁
      confirmLock: false,
      // 登录弹窗
      loginVisible: false,
      // 当前用户
      currentUser: {}
    };
  },
  created() {
    this.init();
  },
  methods: {
    ...{ resultHandler },
    init() {
      // 设置商品id
      let _id = this.$route.query.id;
      if (_id) {
        this.goodsId = _id;
      }
      // 获取商品详情
      this.getProduct(_id);
      // 是否登录
      if (localStorage.getItem(ACCESS_TOKEN) != null) {
        if (store.getters.userInfo == null) {
          store.dispatch('GetUserInfo').then(() => {
            this.currentUser = store.getters.userInfo;
          });
        } else {
          this.currentUser = store.getters.userInfo;
        }
      }
    },
    getProduct(_id) {
      let data = {
        data: _id,
        language: 'zh-cn'
      };
      getProductDetail(data).then(res => {
        this.initialAssignment(resultHandler(res));
      });
    },
    // 初始化赋值
    initialAssignment(_data) {
      this.goodsDetail = _data;
      this.indexList = this.setCoverPathList(_data['data']);
      this.goodsAttributes = _data.children;
      // 构建对象
      this.setTemp(this.goodsAttributes);
      // console.log('this.indexList', this.indexList);
      // console.log('this.goodsDetail', this.goodsDetail);
      // console.log('this.goodsAttributes', this.goodsAttributes);
      // console.log('this.tempGoodsAttr', this.tempGoodsAttr);
    },
    // 设置临时对象
    setTemp(attributes) {
      for (let _el of attributes) {
        this.tempGoodsAttr[_el.id] = _el;
      }
    },
    // 设置轮播图列表
    setCoverPathList(_attributes) {
      // 遍历属性
      let _list = [];
      for (let _attr in _attributes) {
        if (_attr.indexOf('coverPath') != -1) {
          let _el = {};
          _el['coverPath'] = _attributes[_attr];
          if (_el['coverPath']) {
            _list.push(_el);
          }
        }
      }
      return _list;
    },
    // 改变 数量或选中
    _changeForm(form) {
      this.goodsForm = form;
    },
    // 调用计价
    goodsInvoke(form) {
      this.runInovke(form);
    },
    // 执行计价
    runInovke(form) {
      // 判断是否登录
      if (Object.keys(this.currentUser).length == 0) {
        this.loginVisible = true;
        return;
      }
      // 验证参数
      if (form && form.orderNumber && form.orderNumber >= 500 && form.orderNumber <= 1000000 && form.checked.length > 0) {
        // console.log('this.runInvoke');
        let ids = this.idPackage(form.checked);
        let city = '';
        if (form.city) {
          city = form.city;
        }
        let data = {
          cextends: 0,
          city: city,
          idStr: ids,
          language: 'zh-cn',
          number: form.orderNumber
        };
        // console.log('计价提交数据', data);
        getProductPrice(data).then(res => {
          if (res.code === '000000') {
            console.log('计价', res.data);
            this.setInvokeData(res.data);
            this.selected = res.data.detail;
          }
        });
      }
    },
    // 设置计价数据
    setInvokeData(data) {
      let _temp = data;
      for (let _key in _temp) {
        this.invokeData[_key] = _temp[_key];
      }
    },
    // 包装id
    idPackage(list) {
      let ids = '';
      for (let _index = 0; _index < list.length; _index++) {
        ids += list[_index];
        if (_index !== list.length - 1) {
          ids += ',';
        }
      }
      return ids;
    },
    // 设置选中的值
    setSelected(form) {
      // 标题 总价 单价 数量
      let _temp = [];
      for (let _el of form.checked) {
        _temp.push({ goods_name: this.tempGoodsAttr[_el].title, price_old: 0, unit_price: 0, number: 0, time: 0, day: 0 });
      }
      this.selected = _temp;
      // 没有选中的时候属性置空
      if (this.selected.length === 0) {
        this.invokeData = {};
      }
    },
    // 某个值存在数组中
    exist(_list, obj) {
      for (let _index = 0; _index < _list.length; _index++) {
        if (_list[_index] === obj) {
          return true;
        }
      }
    },
    // 立即购买
    clickBuyNowButton() {
      if (this.selected.length === 0) {
        this.$message({ type: 'warning', message: '请勾选商品，再提交' });
        return;
      }
      // 判断是否登录
      if (Object.keys(this.currentUser).length == 0) {
        this.loginVisible = true;
        return;
      }
      // 判断计价是否
      if (!this.invokeData.total_old && !this.goodsForm.orderNumber) {
        this.$message({ type: 'error', message: '请完善计价信息' });
        return false;
      }
      // 判断是否已经单击
      if (this.confirmLock) return;
      this.confirmLock = true;
      let _form = this.goodsForm;
      let data = {
        language: 'zh-cn',
        number: _form.orderNumber,
        zbzProductDetailIdList: _form.checked
      };
      // console.log('立即购买提交', data);
      buyNowProduct(data)
        .then(res => {
          if (res.code === '000000') {
            // console.log('立即购买成功', res.data);
            this.confirmLock = false;
            this.$router.push({ path: '/cart/checkorder', query: { isCart: 0, isZbz: 1 } });
          }
        })
        .catch(() => {
          this.confirmLock = false;
        });
    }
  },
  destroyed() {
    this.confirmLock = false;
  },
  watch: {
    // 选中套餐列表
    goodsForm: {
      handler(newVal, odlVal) {
        // console.log('---------------- way ------------------');
        // 比较修改前修改后是否发生变化
        // 校验合法性
        if (newVal.checked && newVal.orderNumber) {
          // console.log('formData', newVal);
          this.goodsInvoke(newVal);
        }
        this.setSelected(newVal);

        // console.log({ newVal });
      },
      deep: true
    }
  }
};
</script>
<style>
.detasBanner .el-carousel__indicators--outside {
  position: absolute;
  bottom: 10px;
  width: 100%;
  left: 0;
}
</style>
<style scoped src="@/static/mulindex/css/fonts.css" />
<style scoped src="@/static/mulindex/css/attr.css" />
<style scoped src="@/static/mulindex/css/shop.css" />
