<template>
  <el-container class="container">
    <el-main class="shopping">
      <div class="catbj">
        <!--content start-->
        <div class="container clear">
          <!--主要内容-->
          <div class="ordokBox">
            <dl>
              <li>
                <h3 class="ordok_h3">收货人信息</h3>
                <div class="adresBox">
                  <fieldset class="layui-elem-field">
                    <legend class="red">温馨提示</legend>
                    <div class="layui-field-box">温馨提示：国家规定，快递收件人必须实名制，禁止使用X先生、X小姐称呼，为了使您第一时间收到货品，请务必核实修改您的收货人信息！</div>
                  </fieldset>
                  <div class="Caddress">
                    <div :class="addres.defaultTemp != 0 ? 'add_mi curr' : 'add_mi'" v-for="(addres, index) of ordersAddressLists" :key="index" @click="updateDefaultAddress(addres.id)">
                      <p class="consignee">{{ addres.consigneeName }}</p>
                      <p>{{ addres.province }}.{{ addres.city }}.{{ addres.county }}.{{ addres.address }}</p>
                    </div>
                  </div>
                </div>
                <div class="open_new">
                  <dl>
                    <dd>
                      <button class="layui-btn layui-btn-primary layui-btn-sm show-address" @click="showAllAddress">{{ isAllAddress ? '收齐全部地址' : '显示全部地址' }}</button>
                      <button class="layui-btn layui-btn-primary layui-btn-sm add-address" @click="showDetail($event)">添加新地址</button>
                      <button class="layui-btn layui-btn-primary layui-btn-sm search-address" @click="showDetailSearch($event)">搜索收货人</button>
                    </dd>
                    <dd>
                      <button class="layui-btn layui-btn-primary layui-btn-sm manage-address" @click="goDesignAddress">管理收货地址</button>
                    </dd>
                  </dl>
                </div>
                <el-dialog :visible.sync="dialogVisible" title="收货地址" width="700px" @close="closeForm('form')">
                  <div style="padding: 0px 20px">
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                      <el-form-item label="收货人" prop="consigneeName">
                        <el-input v-model="form.consigneeName"></el-input>
                        <label style="color: #f00; font-size: 12px">* 请填写实名，国家规定收件人实名制，否则后果自负</label>
                      </el-form-item>
                      <el-form-item label="省市区" prop="countyId" style="margin-top: 20px">
                        <el-select v-model="form.provinceId" placeholder="请选择" style="width: 180px" @change="selectCity($event, 'province')">
                          <el-option style="padding-left: 15px" v-for="(item, index) in provinceList" :key="index" :label="item" :value="index + ''"> </el-option>
                        </el-select>
                        <el-select v-model="form.cityId" placeholder="请选择" style="width: 180px" @change="selectCity($event, 'city')">
                          <el-option style="padding-left: 15px" v-for="(item, index) in cityList" :key="index" :label="item" :value="form.provinceId + '_' + index"> </el-option>
                        </el-select>
                        <el-select v-model="form.countyId" placeholder="请选择" style="width: 180px" @change="selectCity($event, 'county')">
                          <el-option style="padding-left: 15px" v-for="(item, index) in countyList" :key="index" :label="item" :value="form.cityId + '_' + index"> </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="地址" prop="address" style="margin-top: 20px">
                        <el-input v-model="form.address" @input="form.address = form.address.replace(/\s+/g, '')"></el-input>
                      </el-form-item>
                      <el-form-item label="手机" prop="mobile" style="margin-top: 20px">
                        <el-input v-model="form.mobile"></el-input>
                      </el-form-item>
                      <el-form-item style="margin-top: 20px">
                        <el-button style="width: 95px; height: 35px" type="primary" @click="handlerSubmit">立即提交</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-dialog>
                <el-dialog :visible.sync="dialogVisibleSearch" title="搜索收货人" width="300px">
                  <el-row type="flex">
                    <el-col justify="center">
                      <el-select v-model="optionAddressId" filterable placeholder="直接选择收货人或搜索收货人" style="width: 260px">
                        <el-option style="padding-left: 15px" v-for="(item, index) in tempSearchList" :key="index" :label="item.consigneeName" :value="item.id"></el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row style="margin: 20px 0 0 50px">
                    <el-col style="margin-left: -20px">
                      <el-button style="width: 95px; height: 35px" type="primary" @click="selectAddress(optionAddressId)">确认</el-button>
                      <el-button style="width: 95px; height: 35px" @click="dialogVisibleSearch = false">取消</el-button>
                    </el-col>
                  </el-row>
                </el-dialog>
              </li>
              <li>
                <h3 class="ordok_h3">订单商品信息</h3>
                <div class="godsBox" v-for="(mode, index) in orderGoodInfo.shippingModeVos" :key="index">
                  <!--配送方式-->
                  <div class="modeLf">
                    <h4>配送方式</h4>
                    <p v-for="(item, index) in mode.proofShippingInfo.shippingName" :key="index" :class="mode.proofShippingInfo.shippingType == item ? 'modesign curr' : 'modesign'" @click="changeShippingType(item)">
                      {{ item }}
                    </p>
                    <ul>
                      <li>
                        <span class="C9">配送时间：</span>
                        <span>工作日、双休日与节假日均可送货</span>
                      </li>
                      <li>
                        <span class="C9">配送费用：</span>
                        <span class="red">{{ '￥' + mode.proofShippingInfo.shipfee }} </span>
                      </li>
                      <li class="selfaddress" v-if="mode.proofShippingInfo.shippingType == '上门自取'">
                        打样店名称：{{ mode.designerInfos.companyname }}<br />
                        地址：{{ replaceAll(mode.designerInfos.city, '.', '') + ' ' + mode.designerInfos.address }}<br />
                        联系人：{{ mode.designerInfos.contacts }}<br />
                        联系电话：{{ mode.designerInfos.mobile }}
                      </li>
                    </ul>
                  </div>
                  <!--商家-->
                  <div class="shopRgt">
                    <h4>傲彩打样店</h4>
                    <table class="ShopCartTable">
                      <tbody>
                        <tr v-for="(cart, index) in mode.miniCartList" :key="index">
                          <td width="56%" class="selectLeft">
                            <span class="inline"><img class="goodImg" src="/uploads/picture/20181208/f34163b2254efbc498a3938a07ae587f.jpg"/></span>
                            <span class="inline goodsName">
                              <h2 class="inline bule">{{ cart.cateStr }}</h2>
                              <br />
                              <input name="custom_name" class="layui-input" type="text" @change="changeCustomName($event, cart.id)" :value="cart.alias" placeholder="自定义产品名称(30字以内)，选填" />
                              {{ cart.goodsAttr }}
                            </span>
                          </td>
                          <td>{{ 'x' + cart.num }}</td>
                          <td>{{ 'x' + cart.fnumber + '款' }}</td>
                          <td>
                            <p class="totalPrice">{{ '￥' + cart.goodsTotal }}</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </li>

              <li class="billLi">
                <h3 class="ordok_h3">文件规范化处理</h3>
                <div class="adresBox">
                  <div class="layui-col-md12">
                    <div class="layui-card">
                      <div class="opt layui-form">
                        <el-radio v-model="fileNormalization" label="1">允许傲彩对设计文件、刀模文件进行生产规范化修正</el-radio> <br />
                        <el-radio style="margin-top: 10px" v-model="fileNormalization" label="0">不允许傲彩对设计文件、刀模文件进行任何修正</el-radio>
                      </div>
                    </div>
                  </div>
                </div>
              </li>

              <li class="billLi">
                <h3 class="ordok_h3">订单备注</h3>
                <div class="adresBox">
                  <div class="layui-col-md12">
                    <div class="layui-card">
                      <div class="layui-form-item">
                        <input name="postscript" v-model="remarks" lay-verify="postscript" autocomplete="off" placeholder="订单备注" class="layui-input" type="text" />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <!-- 优惠卷 -->
              <bonus-components
                v-if="orderData.orderSumMoney"
                ref="couponRef"
                v-model="couponData"
                :orderData="orderData"
                @change="changeCoupon"
              ></bonus-components>
            </dl>
          </div>

          <div class="orfootDv">
            <ul>
              <ol>
                <li>
                  <label>商品金额：</label>
                  <span class="val"
                    ><span class="cartMoney">{{ orderGoodInfo.totalAmount - orderGoodInfo.totalShipfee }}</span
                    >元</span
                  >
                </li>
                <li>
                  <label>运费：</label>
                  <span class="val red">{{ orderGoodInfo.totalShipfee || 0 }}元</span>
                </li>
                <li v-if="couponMoney">
                  <label>优惠金额：</label>
                  <span class="val red">{{ couponMoney }}元</span>
                </li>
              </ol>
              <li class="bjrow">
                <div class="totalDv">
                  <label>应付总额：</label>
                  <b class="val">
                    <font class="chktotalmoney">{{ orderGoodInfo.totalAmount - couponMoney }}</font
                    >元
                  </b>
                </div>
              </li>
            </ul>
            <div class="fr">
              <input type="hidden" name="coupon" value="0" />
              <input type="hidden" name="ordertotal" value="{$totalMoney}" />
              <button class="layui-btn layui-btn-custom submitForm" @click="commitOrder">提交订单</button>
            </div>
          </div>
        </div>
        <!--content-->
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { getAddressByUid, getCountCart, commit, customerOrderCouponDrawList, setAddresDefault, updateCartName } from '@/api/cart/cartCheckProofApi';
import { saveOrUpdate } from '@/api/users/userDesignAddressApi';
import { getProvince, getCity, getAreaId, getAreaName } from '@/utils/city';
import { replaceAll } from '@/utils/objectUtil';
import BonusComponents from './bonusComponents/index';

export default {
  name: 'CheckProof',
  components: {
    BonusComponents
  },
  data() {
    // 手机号验证
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error('请输入正确的手机号'));
        } else {
          callback();
        }
      }
    };
    const validateQQ = (rule, value, callback) => {
      if (!value) {
        callback();
      } else {
        if (!/[1-9][0-9]{4,}/.test(value)) {
          callback(new Error('请输入正确的QQ号'));
        } else {
          callback();
        }
      }
    };
    return {
      ordersAddressLists: [
        {
          id: '',
          consigneeName: '',
          province: '',
          city: '',
          county: '',
          address: '',
          mobile: '',
          defaultTemp: 0
        }
      ],
      tempAddressLists: [],
      // 搜索联系人列表
      tempSearchList: [],
      isAllAddress: false,
      // 新增地址
      dialogVisible: false,
      form: { consigneeName: '', provinceId: '', cityId: '', countyId: '', mobile: '', province: '', city: '', county: '' },
      rules: {
        consigneeName: { required: true, message: '请输入收货人', trigger: 'blur' },
        address: { required: true, message: '请输入地址', trigger: 'blur' },
        mobile: { validator: validatePhone, message: '请输入正确的手机号', required: true, trigger: 'blur' },
        qq: { validator: validateQQ, message: '请输入正确的QQ号', trigger: 'blur' },
        countyId: { required: true, message: '请选择省市区', trigger: 'change' }
      },
      provinceList: [],
      cityList: [],
      countyList: [],
      dialogVisibleSearch: false,
      // 收货地址id
      optionAddressId: '',
      orderGoodInfo: {
        totalAmount: 0,
        totalShipfee: 0,
        shippingModeVos: [
          {
            miniCartList: [],
            orderShippingInfo: '',
            proofShippingInfo: {
              shipfee: 0,
              shippingName: [],
              shippingType: ''
            }
          }
        ]
      },
      remarks: '',
      // 确认是否重复提交
      confirmLock: false,
      // 是否是立即提交过来的
      isCart: 0,
      // 是否允许修改
      fileNormalization: '1',
      couponArr: [],
      // 优惠券统计订单数据
      orderData: {
        orderType: '2',
        systemType: 'aocai_gw',
        orderSumMoney: 0
      },
      // 选中的优惠券
      couponData: [],
      // 优惠金额
      offerAmount: 0
    }
  },
  created() {
    // 初始化确认按钮
    this.confirmLock = false;
    this.isCart = this.$route.query.isCart == undefined || this.$route.query.isCart == 1 ? 0 : 1;
    this.getMyAddress();
    this.provinceList = getProvince();
    this.getOrderGoodInfo();
  },
  computed:{
    couponMoney: function () {
      let num = 0
      for (let i = 0; i < this.couponData.length; i++) {
        const el = this.couponData[i];
        num += Number(el.useMoney)
      }
      console.log('this.couponData', this.couponData);
      return num
    }
  },
  methods: {
    ...{ saveOrUpdate, replaceAll },
    getMyAddress() {
      getAddressByUid().then(res => {
        if (res.code === '000000') {
          let data = res.data;
          this.tempSearchList = JSON.parse(JSON.stringify(data));
          this.ordersAddressLists = data.splice(0, 4);
          this.tempAddressLists = data;
        } else {
          this.$message({ type: 'error', message: '获取收货人地址失败' });
        }
      });
    },
    showAllAddress() {
      this.isAllAddress = this.isAllAddress ? false : true;
      if (this.isAllAddress) {
        this.ordersAddressLists = this.ordersAddressLists.concat(this.tempAddressLists);
      } else {
        this.ordersAddressLists = this.ordersAddressLists.splice(0, 4);
      }
    },
    updateDefaultAddress(addressId) {
      if (addressId != undefined && addressId != null) {
        // console.log(addressId);
        let id = { id: addressId };
        setAddresDefault(id).then(res => {
          if (res.code === '000000') {
            this.$message({ type: 'success', message: '设置成功' });
          } else {
            this.$message({ type: 'error', message: '设置失败' });
          }
          this.isAllAddress = false;
          this.getMyAddress();
          this.getOrderGoodInfo();
        });
      } else {
        this.$message({ type: 'error', message: '设置失败' });
      }
    },
    showDetail(event) {
      this.$set(this, 'form', {});
      this.dialogVisible = true;
    },
    handlerSubmit() {
      const formName = 'form';
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.form.provinceId) {
            this.$message({ type: 'error', message: '请选择省份' });
            return false;
          } else if (!this.form.cityId) {
            this.$message({ type: 'error', message: '请选择市' });
            return false;
          } else if (!this.form.countyId) {
            this.$message({ type: 'error', message: '请选择地区' });
            return false;
          }
          this.form.province = getAreaName('province', this.form.provinceId);
          this.form.city = getAreaName('city', this.form.cityId);
          this.form.county = getAreaName('county', this.form.countyId);
          saveOrUpdate({ data: this.form }).then(() => {
            this.$message({ type: 'success', message: '操作成功' });
            this.dialogVisible = false;
            this.closeForm(formName);
            this.getMyAddress();
          });
        }
      });
    },
    selectCity(val, type) {
      // console.log('----------------------------');
      if (type === 'province') {
        this.$set(this.form, 'cityId', '');
        this.$set(this.form, 'countyId', '');
        this.$set(this, 'cityList', getCity(this.form.provinceId));
        this.$set(this, 'countyList', []);
      } else if (type === 'city') {
        this.$set(this.form, 'countyId', '');
        this.$set(this, 'countyList', getCity(this.form.cityId));
      }
    },
    selectAddress(addressId) {
      this.updateDefaultAddress(addressId);
      this.dialogVisibleSearch = false;
    },
    closeForm(formName) {
      this.$refs[formName].resetFields();
    },
    showDetailSearch(event) {
      this.optionAddressId = null;
      this.dialogVisibleSearch = true;
    },
    goDesignAddress() {
      this.$router.push('/user/designAddress');
    },
    getOrderGoodInfo() {
      // debugger;
      getCountCart({ once: this.isCart })
        .then(res => {
          if (res.code == '000000') {
            this.orderGoodInfo = res.data;
            this.getCoupon()
            // console.log(this.orderGoodInfo);
          } else {
            this.$message({ type: 'error', message: res.message });
          }
        })
        .catch(error => {
          this.$message({ type: 'error', message: error.message });
          // this.$router.go(-1);
        });
    },
    getCoupon() {
      if (this.$route.query.type == 1) {
        return
      }
      this.orderData.orderSumMoney = 0
      for (let i = 0; i < this.orderGoodInfo.shippingModeVos.length; i++) {
        const el = this.orderGoodInfo.shippingModeVos[i];
        // 2023年6月9日 审批编号：202306081950000591937 指定人使用优惠券 uid
        if (!el.isOut || this.$store.getters.userInfo.id == 32954) {
          this.orderData.goodsSumMoney = 0
          this.orderData.goodsId = el.miniCartList.map(e => {
            this.orderData.goodsSumMoney += Number(e.goodsTotal)
            return e.goodsId
          }).join(',')
          this.orderData.orderSumMoney = this.orderData.goodsSumMoney + Number(el.proofShippingInfo.shipfee)
          this.orderData.goodsSumMoney = this.orderData.goodsSumMoney + Number(el.proofShippingInfo.shipfee)
        }
      }
      this.$refs?.couponRef?.getCoupon()
    },
    changeShippingType(shippingType) {
      let data = { shipType: shippingType, once: this.isCart };
      this.couponData = []
      getCountCart(data).then(res => {
        this.orderGoodInfo = res.data;
        this.getCoupon()
      });
    },
    // 选中优惠券
    changeCoupon(data) {
      this.offerAmount = 0
      data.map(e => {
        this.offerAmount += Number(e.useMoney) 
      })
    },
    // 修改商品名
    changeCustomName($event, cartId) {
      // 获取到当前输入框的输入值,并去除空格
      let alias = $event.srcElement.value.replace(/\s+/g, '');
      // console.log(alias);
      // console.log(cartId);
      if (alias == '' || alias == null) {
        this.$message({ type: 'error', message: '不能传空值' });
        return;
      }
      if (alias.length > 30) {
        this.$message({ type: 'error', message: '字数在30个以内' });
        alias = alias.slice(0, 30);
      }
      updateCartName({ cartId, alias }).then(res => {
        if (res.code === '000000') {
          this.getOrderGoodInfo();
        }
        // console.log(res.message);
      });
    },
    commitOrder() {
      if (this.ordersAddressLists.length == 0) {
        this.$message({ type: 'error', message: '必须选择收货地址' });
        return;
      }
      if (this.confirmLock) return;
      // 加锁
      this.confirmLock = true;
      let data = {
        memo: this.remarks,
        shipType: this.orderGoodInfo.shippingModeVos[0].proofShippingInfo.shippingType,
        isEdit: this.fileNormalization,
        noce: this.isCart,
        couponList: this.couponData
      };
      commit(data)
        .then(res => {
          // debugger;
          // sessionStorage.setItem('subOrderId', res.data.subOrderNo);
          // 返回订单号
          this.confirmLock = false;
          this.$router.push({ path: '/service/getpay', query: { orderNo: res.data.orderNo, subOrderId: res.data.subOrderNo } });
        })
        .catch(() => {
          console.log('66666');
          this.confirmLock = false;
        });
    }
  }
};
</script>
<style scoped src="../../static/index/css/shopping.css"></style>
<style scoped src="../../static/assets/layui/css/layui.css" media="all"></style>
<style scoped src="../../static/index/css/magic-check.css"></style>
<style scoped src="../../static/index/css/base.css"></style>
<style scoped src="../../static/index/css/common.css"></style>
