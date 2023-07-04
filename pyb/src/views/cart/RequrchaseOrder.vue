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
                    <div class="layui-field-box">
                      温馨提示：国家规定，快递收件人必须实名制，禁止使用X先生、X小姐称呼，为了使您第一时间收到货品，请务必核实修改您的收货人信息！
                    </div>
                  </fieldset>
                  <div class="Caddress">
                    <div :class="addres.isDefault != 0 ? 'add_mi curr' : 'add_mi'" v-for="(addres, index) of ordersAddressLists" :key="index" @click="updateDefaultAddress(addres)">
                      <p class="consignee">{{ addres.consigneeName }}</p>
                      <p>{{ addres.province }}.{{ addres.city }}.{{ addres.county }}.{{ addres.address }}.{{ addres.id }}</p>
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
                      <button class="layui-btn layui-btn-primary layui-btn-sm manage-address" @click="goUserAddress">管理收货地址</button>
                    </dd>
                  </dl>
                </div>
                <el-dialog :visible.sync="dialogVisible" title="收货地址" width="700px" @close="closeForm('form')">
                  <div style="padding: 0px 20px;">
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                      <el-form-item label="收货人" prop="consigneeName">
                        <el-input v-model="form.consigneeName"></el-input>
                        <label style="color: #f00; font-size: 12px;">* 请填写实名，国家规定收件人实名制，否则后果自负</label>
                      </el-form-item>
                      <el-form-item label="省市区" prop="countyId" style="margin-top: 20px">
                        <el-select v-model="form.provinceId" placeholder="请选择" style="width:180px" @change="selectCity($event, 'province')">
                          <el-option style="padding-left: 15px" v-for="(item, index) in provinceList" :key="index" :label="item" :value="index + ''"> </el-option>
                        </el-select>
                        <el-select v-model="form.cityId" placeholder="请选择" style="width:180px" @change="selectCity($event, 'city')">
                          <el-option style="padding-left: 15px" v-for="(item, index) in cityList" :key="index" :label="item" :value="form.provinceId + '_' + index"> </el-option>
                        </el-select>
                        <el-select v-model="form.countyId" placeholder="请选择" style="width:180px" @change="selectCity($event, 'county')">
                          <el-option style="padding-left: 15px" v-for="(item, index) in countyList" :key="index" :label="item" :value="form.cityId + '_' + index"> </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="地址" prop="address" style="margin-top: 20px">
                        <el-input v-model="form.address" @input="form.address = form.address.replace(/\s+/g, '')"></el-input>
                      </el-form-item>
                      <el-form-item label="手机" prop="mobile" style="margin-top: 20px">
                        <el-input v-model="form.mobile"></el-input>
                      </el-form-item>
                      <el-form-item label="QQ" prop="qq" style="margin-top: 20px">
                        <el-input v-model="form.qq"></el-input>
                      </el-form-item>
                      <el-form-item style="margin-top: 20px">
                        <el-button style="width: 95px;height: 35px;" type="primary" @click="handlerSubmit">立即提交</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-dialog>
                <el-dialog :visible.sync="dialogVisibleSearch" title="搜索收货人" width="300px">
                  <el-row type="flex">
                    <el-col justify="center">
                      <el-select v-model="optionAddressId" filterable placeholder="直接选择收货人或搜索收货人" style="width:260px">
                        <el-option style="padding-left: 15px" v-for="(item, index) in tempAddressLists" :key="index" :label="item.consigneeName" :value="item.id"></el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row style="margin: 20px 0 0 50px">
                    <el-col style="margin-left: -20px">
                      <el-button style="width: 95px;height: 35px;" type="primary" @click="selectAddress(optionAddressId)">确认</el-button>
                      <el-button style="width: 95px;height: 35px;" @click="dialogVisibleSearch = false">取消</el-button>
                    </el-col>
                  </el-row>
                </el-dialog>
              </li>
              <li>
                <h3 class="ordok_h3">合规性文件信息 <span class="red">*请上传公司营业执照，注册商标，条形码注册证</span></h3>
                <div class="adresBox">
                  <div class="layui-col-md12">
                    <div class="layui-card">
                      <div class="layui-card-body">
                        <div v-if="defaultDoc != ''">
                          <div class="opt layui-form">
                            <el-radio>{{ defaultDoc != '' ? defaultDoc.name : '' }}</el-radio>
                          </div>
                          <div class="layui-card-body">
                            <button class="layui-btn layui-btn-primary layui-btn-sm" id="w_modify_zz" @click="docListDialog">使用其他合规性文件</button>
                          </div>
                        </div>
                        <div class="layui-card-body" v-else>
                          <button class="layui-btn layui-btn-primary layui-btn-sm" id="w_modify_zz" @click="docDialog">添加合规性文件</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <user-document-list :dialogTableVisible="isDocListVisible" @addDoc="showDo" @showListDialog="changeDocList"></user-document-list>
                <user-document-dialog :dialogVisible="isDocVisible" @showDialog="changeDocVisible"></user-document-dialog>
              </li>
              <li>
                <h3 class="ordok_h3">订单商品信息</h3>
                <div class="godsBox" v-for="(mode, findex) in orderGoodInfo.shippingModeVos" :key="findex">
                  <!--配送方式-->
                  <div class="modeLf" style="width: 295px">
                    <h4>配送方式</h4>
                    <p v-for="(ship, sindex) in mode.orderShippingInfo" :key="sindex" :class="sindex == curList[findex] ? 'modesign curr' : 'modesign'" @click="changeShip(findex, sindex)">
                      {{ ship.shippingName }}
                    </p>
                    <div v-for="(ship, index) in mode.orderShippingInfo" :key="index + 1000">
                      <ul v-show="index == curList[findex]">
                        <li>
                          <span class="C9">配送时间：</span>
                          <span>工作日、双休日与节假日均可送货</span>
                        </li>
                        <li v-if="ordersAddressLists.id == ''">
                          <span class="red">温馨提示：</span>
                          <span>收货地址无法定位请重新修改地址</span>
                        </li>
                        <div v-show="ship.laLaMove == null">
                          <li>
                            <span class="C9">配送费用：</span>
                            <span class="red">￥ {{ ship.freight }}</span>
                          </li>
                        </div>
                        <div v-show="ship.laLaMove != null">
                          <li>
                            <div v-for="(i, inde) in ship.laLaMove" :key="inde + 3000">
                              <span class="C9">{{ i.name + '费用：' }}</span>
                              <span class="red">￥{{ i.money }}</span>
                            </div>
                          </li>
                          <li>
                            <span class="C9">该报价不含 <span class="red">高速费</span>，以实际收货价格为准</span>
                          </li>
                        </div>
                        <li v-if="invoiceInfo.invoiceType === 1">
                          <span class="C9">税点：</span>
                          <span class="red">￥{{ ship.taxSingle }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <!--商家-->
                  <div class="shopRgt">
                    <h4>商家：拼一版供应商</h4>
                    <table class="ShopCartTable">
                      <tbody>
                        <tr v-for="(cart, index) in mode.miniCartList" :key="index">
                          <td width="53%" class="selectLeft">
                            <span class="inline"><img class="goodImg" :src="cart.goodsCoverPath"/></span>
                            <span class="inline goodsName">
                              <h2 class="inline bule">{{ cart.goodsName }}</h2>
                              <br />
                              <input name="custom_name" class="layui-input" type="text" @change="changeCustomName($event, cart.id, cart.num, cart.extendsStr)" :value="cart.customName" placeholder="自定义产品名称(15字以内)，选填" />
                              {{ cart.goodsAttr }}
                            </span>
                          </td>
                          <td><el-input-number v-model="cart.num" @change="handleChange(cart, index)" :min="100" :max="99999999" :step="50" :disabled="updateNumLock[index]" size="mini" style="margin-left: -10px"></el-input-number></td>
                          <td>
                            <div v-if="cart.goodsId == 640">
                              个性定制无法翻单
                            </div>
                            <div v-else class="geRtimeLt">
                              <div :class="'flex geRtime' + (strEquals(cart.isCurr, '1') ? ' curr' : '')" @click="selectExtends(cart.id, '1')">
                                <label class="geRtimeLt dateSel">
                                  <em class="dateH" value="1"></em>
                                  <span class="dayNormal">{{ cart.goodsDetails.time_normal }}小时（{{ cart.goodsDetails.days_normal }}天）</span>
                                  <div class="extra en" style="display: inline; width:100px">
                                    <p class="moneyNormal" style="display: inline; width:100px">¥{{ cart.goodsDetails.price_normal }}</p>
                                  </div>
                                </label>
                              </div>
                              <div v-if="cart.goodsTag == 1 && cart.num <= 10000" :class="'flex geRtime' + (strEquals(cart.isCurr, '0') ? ' curr' : '')" @click="selectExtends(cart.id, '0')">
                                <label class="geRtimeLt dateSel">
                                  <em class="dateH" value="0"></em>
                                  <span class="dayNormal">{{ cart.goodsDetails.time_fast }}小时（{{ cart.goodsDetails.days_fast }}天）</span>
                                  <div class="extra en" style="display: inline; width:100px">
                                    <p class="moneyNormal" style="display: inline; width:100px">¥{{ cart.goodsDetails.price_fast }}</p>
                                  </div>
                                </label>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </li>
              <li class="billLi">
                <h3 class="ordok_h3">发票信息</h3>
                <div class="adresBox">
                  <div class="layui-col-md12">
                    <div class="layui-card">
                      <div v-if="invoiceInfo.invoiceName != null && invoiceInfo.invoiceName != ''">
                        <div class="opt layui-form">
                          <el-radio v-if="invoiceInfo.invoiceType == 0">【增值普通发票】{{ invoiceInfo.invoiceName }} <font style="color:#d0111b">【默认】</font></el-radio>
                          <el-radio v-else>【增值专用发票】{{ invoiceInfo.invoiceName }} <font style="color:#d0111b">【默认】</font></el-radio>
                        </div>
                        <div class="layui-card-body">
                          <button class="layui-btn layui-btn-primary layui-btn-sm" id="no_invoice" @click="cancelInvoice">暂不开发票</button>
                          <button class="layui-btn layui-btn-primary layui-btn-sm manage_invoice" @click="invoiceListVisible = true">发票管理</button>
                        </div>
                      </div>
                      <div class="layui-card-body" v-else>
                        <button class="layui-btn layui-btn-primary layui-btn-sm manage_invoice" @click="invoiceListVisible = true">发票管理</button>
                      </div>
                    </div>
                  </div>
                </div>
                <user-invoice-dialog :visible="invoiceVisible" :invoiceType="iName" @handleClick="clickInvoice" @close="closeInvoiceVisible"></user-invoice-dialog>
                <user-invoice-list-dialog :activeVisible="invoiceListVisible" @addInvoice="openInvoiceDialog" @close="closeInvoiceList"></user-invoice-list-dialog>
              </li>
              <li class="billLi">
                <h3 class="ordok_h3">订单备注</h3>
                <div class="adresBox">
                  <div class="layui-col-md12">
                    <div class="layui-card">
                      <div class="layui-form-item">
                        <input name="postscript" lay-verify="postscript" autocomplete="off" v-model="memo" class="layui-input" type="text" />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li class="couponconts" v-show="activeIsMarkup === 0">
                <h3 class="ordok_h3">
                  <i>+</i>使用优惠券 <span class="C9">已成功使用<font class="red"> 0 </font>张卡券</span>
                </h3>
                <div class="coupsBox">
                  <p class="coupsNoe center C9" v-show="activeBonusShow">您还没有满足条件的优惠券</p>
                  <div v-show="!activeBonusShow">
                    <dl class="coupon" :class="{ curr: isSelectedBonus[index] }" v-for="(item, index) in bonusList" @click="selectedBonus(item, index)" :key="index">
                      <dt class="couponDiv">
                        <p class="couponprice">
                          ￥{{ item.miniBonusType.bonusMoney }}<i>满{{ item.miniBonusType.minAmount }}减{{ item.miniBonusType.bonusMoney }}</i>
                        </p>
                        <p class="coupontime">有效期至{{ formatDateSecond(item.miniBonusType.startTime) }}-{{ formatDateSecond(item.miniBonusType.endTime) }}</p>
                      </dt>
                      <dd class="coupontype">[ 全场通用 ]</dd>
                    </dl>
                  </div>
                </div>
              </li>
            </dl>
          </div>

          <div class="orfootDv">
            <ul>
              <ol>
                <li>
                  <label>商品金额：</label>
                  <span class="val"
                    ><span class="cartMoney">{{ activeTotalGoodsMoney.total }}</span
                    >元</span
                  >
                </li>
                <li>
                  <label>运费：</label>
                  <span class="val red">{{ activeTotalGoodsMoney.shipFee }}元</span>
                </li>
                <li v-if="invoiceInfo.invoiceType === 1">
                  <label>税金：</label>
                  <span class="val">
                    <font>{{ activeTaxMoney }}</font
                    >元
                  </span>
                </li>
                <li>
                  <label>优惠券：</label>
                  <span class="val">
                    <font class="chkorderbonus">{{ activeBonusMoney }}</font
                    >元
                  </span>
                </li>
              </ol>
              <li class="bjrow">
                <div class="totalDv">
                  <label>应付总额：</label>
                  <b class="val">
                    <font class="chktotalmoney">
                      {{ activeTotal }}
                    </font>
                    元
                  </b>
                </div>
                <div class="persDv C9">
                  <span>发票信息：{{ activeInvoiceInfo }}</span>
                  <span>收货地址： {{ activeConsigneedInfo.address }} </span>
                  <span>收货人：{{ activeConsigneedInfo.con }}</span>
                </div>
              </li>
            </ul>
            <div class="fr">
              <button class="layui-btn layui-btn-custom submitForm" @click="pageCommitOrder">提交订单</button>
            </div>
          </div>
        </div>
        <!--content-->
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { saveOrupdateAddress, getAddressByUid, getMiniAddress, commitOrder, getReOrder, updateReOrderNum } from '@/api/cart/cartCheckOrderApi';
import { getDefault } from '@/api/users/userComDocumentsApi';
import { getProvince, getCity, getAreaName } from '@/utils/city';
import UserDocumentDialog from './userDocumentDialog/index';
import UserDocumentList from './userDocumentList/index';
import { getInvoiceDefault, saveOrUpdate as updateInvoice } from '@/api/users/userInvoiceApi';
import UserInvoiceDialog from './userInvoiceDialog/index';
import UserInvoiceListDialog from './userInvoiceListDialog/index';
import { formatDateSecond } from '@/utils/timeUtil';
import { getUserBonusList } from '@/api/users/userBonusApi';
import { strEquals } from '@/utils/strUtil';
import { objectElmentEmpty, replaceAll } from '@/utils/objectUtil';
export default {
  name: 'RequrchaseOrder',
  components: {
    'user-document-dialog': UserDocumentDialog,
    'user-document-list': UserDocumentList,
    'user-invoice-dialog': UserInvoiceDialog,
    'user-invoice-list-dialog': UserInvoiceListDialog
  },
  computed: {
    // 收货地址全
    activeBonusMoney: function() {
      let _bonus = this.curBonus;
      if (_bonus) {
        if (typeof _bonus === 'object') {
          if (_bonus.length > 0) {
            return this.totalCurBonusMoney();
          }
        }
      }
      return '0.00';
    },
    // 发票信息
    activeInvoiceInfo: function() {
      // debugger;
      let invoice = this.invoiceInfo;
      let invoiceName = '';
      if (objectElmentEmpty(invoice)) {
        invoiceName = '暂无发票信息';
      } else {
        invoiceName = invoice.invoiceName;
      }
      return invoiceName;
    },
    // 收货人信息
    activeConsigneedInfo: function() {
      let consigneed = this.activeDefaultConsigneed;
      let addr = { address: '', con: '' };
      if (objectElmentEmpty(consigneed)) {
        addr.address = '暂无地址信息';
        addr.con = '暂无收货人';
      } else {
        let address = consigneed.province + '.' + consigneed.city + '.' + consigneed.county + '.' + consigneed.address;
        let contacts = consigneed.consigneeName + ' ' + consigneed.mobile;
        addr.address = address;
        addr.con = contacts;
      }
      return addr;
    },
    // 默认收货人信息
    activeDefaultConsigneed: function() {
      let con = this.ordersAddressLists.filter(function(consigneed) {
        return consigneed.isDefault == 1;
      });
      if (con == undefined || con.length <= 0) {
        return 0;
      } else {
        return con[0];
      }
    },
    activeDefaultConsigneedId: function() {
      let con = this.ordersAddressLists.filter(function(consigneed) {
        return consigneed.isDefault == 1;
      });
      if (con == undefined || con == null || con == []) {
        return 0;
      } else {
        return con[0].id;
      }
    },
    activeFromShippingItemVoList: function() {
      let formList = [];
      for (let i = 0; i < this.shipLength; i++) {
        let ship = this.orderGoodInfo.shippingModeVos[i].orderShippingInfo[this.curList[i]];
        let data = {
          list: [],
          shippingId: ship.id,
          shippingName: ship.shippingName,
          supplierId: ship.shippingId
        };
        let cartList = this.orderGoodInfo.shippingModeVos[i].miniCartList;
        // debugger;
        cartList.forEach(cart => {
          let info = {
            cartId: cart.id,
            customName: cart.customName == null ? '' : cart.customName,
            ordersGoodsId: cart.recId
          };
          if (cart.isCurr) {
            data.list.push(info);
          }
        });
        formList.push(data);
      }
      return formList;
    },
    activeBonusShow: function() {
      // 是否显示优惠卷
      return this.bonusList == undefined || this.bonusList == '' || this.bonusList == [];
    },
    // 是否显示货拉拉
    activeHuolalaShow: function() {
      let show = false;
      for (let i of this.curShipList) {
        // console.log(i);
        if (i.id == 18) {
          show = true;
          // console.log(show);
        }
      }
      return show;
    },
    activeShippingTotal: function() {
      let shipTotal = 0;
      for (let i = 0; i < this.shipLength; i++) {
        shipTotal += this.curShipList[i].freight;
      }
      return shipTotal;
    },
    // 统计总价
    activeTotal: function() {
      let total = this.activeTotalGoodsMoney.total + this.activeTotalGoodsMoney.shipFee - this.activeBonusMoney;
      if (this.invoiceInfo.invoiceType === 1) {
        total += this.activeTaxMoney;
      }
      return total;
    },
    // 是否是拼板
    activeIsMarkup: function() {
      if (this.isMakeUp == undefined || this.isMakeUp == '') {
        return 0;
      }
      return this.isMakeUp;
    },
    // 税金
    activeTaxMoney: function() {
      if (this.curShipList == undefined) return 0;
      if (this.invoiceInfo) {
        if (this.invoiceInfo.invoiceType != undefined && this.invoiceInfo.invoiceType === 0) {
          return 0;
        }
      }
      var totalTaxMoney = 0;
      this.curShipList.forEach(tax => {
        totalTaxMoney += tax.taxSingle;
      });
      return totalTaxMoney;
    },
    // 选中的金额
    activeTotalGoodsMoney: function() {
      let shippingVo = this.orderGoodInfo.shippingModeVos;
      let totalMoney = 0;
      let totalShipfee = 0;
      if (shippingVo) {
        if (shippingVo.length > 0) {
          shippingVo.forEach(mode => {
            mode.miniCartList.forEach(cart => {
              if (cart.isCurr) {
                if (strEquals(cart.isCurr, '1')) {
                  totalMoney += cart.goodsDetails.price_normal;
                } else if (strEquals(cart.isCurr, '0')) {
                  totalMoney += cart.goodsDetails.price_fast;
                }
                totalShipfee = this.activeShippingTotal;
              }
            });
          });
        }
      }
      return { total: totalMoney, shipFee: totalShipfee };
    }
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
      ordersAddressLists: [],
      tempAddressLists: [],
      isAllAddress: false,
      // 新增地址
      dialogVisible: false,
      form: { province: '', city: '', county: '', provinceId: '', cityId: '', countyId: '', mobile: '' },
      rules: {
        consigneeName: { required: true, message: '请输入收货人', trigger: 'blur' },
        address: { required: true, message: '请输入地址', trigger: 'blur' },
        mobile: { validator: validatePhone, message: '请输入正确的手机号', trigger: 'blur' },
        qq: { validator: validateQQ, message: '请输入正确的QQ号', trigger: 'blur' },
        countyId: { required: true, message: '请选择省市区', trigger: 'change' }
      },
      provinceList: [],
      cityList: [],
      countyList: [],
      dialogVisibleSearch: false,
      optionAddressId: '',
      // 发货人信息
      senderInfoList: [],
      hasVisibleSender: false,
      senderName: '',
      isDefaultSender: false,
      // 用户合法资质
      userAllDocuments: [],
      defaultDoc: '',
      // 资质弹窗是否显示
      isDocVisible: false,
      // 资质列表弹窗是否显示
      isDocListVisible: false,
      // 订单商品信息
      orderGoodInfo: {
        totalAmount: 0.0,
        totalShipfee: 0.0,
        shippingModeVos: [
          {
            orderShippingInfo: [{ id: '', shippingId: '', shippingName: '', freight: 0.0 }],
            miniCartList: []
          }
        ]
      },
      shipLength: 0,
      //
      orderShipping: [{ id: '', shippingId: '', shippingName: '', freight: 0.0 }],
      // 默认当前选中的快递
      curShip: 0,
      // 配送方式 选中的
      curShipList: [],
      // 订单 选中的 物流id
      curList: [],
      activeName: 0,
      // 文件规范化处理
      fileNormalization: '1',
      // 发票
      invoiceInfo: { id: '', invoiceType: '', invoiceName: '' },
      // 发票收件地址
      invoiceAddrRadio: '1',
      invoiceAddressInfo: { id: '', contacts: '', uid: '', city: '', address: '', mobile: '' },
      invoiceVisible: false, // 是否显示弹窗
      iName: '0',
      // 发票列表
      invoiceListVisible: false,
      // 修改发票地址
      invoiceAddrVisible: false,
      dialogForm: { province: '', city: '', county: '', provinceId: '', cityId: '', countyId: '', mobile: '', address: '' },
      // 优惠卷
      isSelectedBonus: [],
      // 优惠卷多选or单选
      multipleOrSingle: 'single',
      bonusList: [],
      totalCount: 0,
      pageSize: 9999,
      pageNumber: 1,
      wsyCount: 0,
      ysyCount: 0,
      ygqCount: 0,
      type: '1',
      curIndex: [],
      curBonus: [],
      memo: '',
      // 是否拼板
      isMakeUp: 0,
      // 是否是立即购买过来的接口
      isCart: 0,
      // 锁
      updateNumLock: [],
      confirmLock: false,
      // 获取选中 id: 选中 获取 0  1  -1 未选中
      selectExtendsStr: [],
      // 货期选中样式 选中样式
      isSelectExtends: [],
      // 运费价格
      shipFeeList: {},
      // 选中的商品
      selectGoodsCartIds: [],
      loadinger: {}
    };
  },
  created() {
    this.isMakeUp = this.$route.query.type;
    this.isCart = this.$route.query.isCart == undefined ? 0 : this.$route.query.isCart;
    this.getMyAddress();
    this.provinceList = getProvince();
    // this.getSampleAddress();
    // this.getSenderInfo();
    this.getDefaultDoc();
    this.getOrderGoodInfo();
    this.getDefaultInvoiceInfo();
    // this.getInvoiceAddr();
    this.getBonusList();
    this.getUserBonusCount();
  },
  methods: {
    ...{ formatDateSecond, objectElmentEmpty, replaceAll, strEquals },
    getMyAddress() {
      getAddressByUid().then(res => {
        if (res.code == '000000') {
          // debugger;
          let data = res.data;
          this.tempSearchAddrList = JSON.parse(JSON.stringify(data));
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
        // console.log(this.ordersAddressLists);
      } else {
        this.ordersAddressLists = this.ordersAddressLists.splice(0, 4);
      }
    },
    updateDefaultAddress(address) {
      if (address != undefined && address != null) {
        address.isDefault = 1;
        saveOrupdateAddress({ data: address }).then(res => {
          if (res.code === '000000') {
            this.$message({ type: 'success', message: '已设为默认地址' });
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
          saveOrupdateAddress({ data: this.form }).then(() => {
            this.$message({ type: 'success', message: '添加收货地址成功' });
            this.dialogVisible = false;
            this.closeForm(formName);
            this.isAllAddress = false;
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
      let data = { id: addressId };
      this.updateDefaultAddress(data);
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
      this.$router.push('/user/userAddressList');
    },
    // 不开发票
    cancelInvoice() {
      this.invoiceInfo.defaultTemp = 0;
      updateInvoice({ data: this.invoiceInfo })
        .then(res => {
          // console.log(res);
          this.getOrderGoodInfo();
          if (res.code === '000000') {
            this.getDefaultInvoiceInfo();
            this.$message({ type: 'success', message: '取消成功' });
          }
        })
        .catch(() => {});
    },
    goUserAddress() {
      this.$router.push('/user/userAddressList');
    },
    // 获取默认用户资质
    getDefaultDoc() {
      getDefault()
        .then(res => {
          // debugger;
          if (res.code === '000000') {
            this.defaultDoc = res.data;
          } else {
            this.defaultDoc = '';
          }
        })
        .catch(error => {
          console.log(error.message);
        });
    },
    docDialog() {
      this.isDocVisible = true;
      // console.log(this.isDocVisible);
    },
    docListDialog() {
      this.isDocListVisible = true;
    },
    changeDocVisible() {
      if (this.isDocVisible) {
        this.isDocVisible = !this.isDocVisible;
        this.getDefaultDoc();
      }
    },
    changeDocList() {
      if (this.isDocListVisible) {
        this.isDocListVisible = !this.isDocListVisible;
        if (!this.isDocListVisible) {
          this.getDefaultDoc();
        }
      }
    },
    showDo() {
      // 关闭窗口
      this.isDocListVisible = false;
      // 显示上传文件窗口
      this.isDocVisible = true;
    },
    // 获取翻单商品
    getOrderGoodInfo() {
      getReOrder({})
        .then(res => {
          if (res.code == '000000') {
            // console.log('-------------- order goods -------------------');
            // console.log(res);
            this.orderGoodInfo = res.data;
            this.shipLength = this.orderGoodInfo.shippingModeVos.length;
            // 默认选中第一种快递
            let len = 0;
            for (var i = 0; i < this.shipLength; i++) {
              this.$set(this.curList, i, 0);
              this.$set(this.curShipList, i, this.orderGoodInfo.shippingModeVos[i].orderShippingInfo[0]);
              len = this.orderGoodInfo.shippingModeVos[i].miniCartList.length;
            }
            for (let j = 0; j < len; j++) {
              this.updateNumLock[j] = false;
            }
            // 拼装货期
            // this.setSelectExtends(res.data.shippingModeVos);
            this.calcTotalShipfee();
          } else {
            this.$message({ type: 'error', message: res.message });
            // this.$router.go(-1);
          }
          this.updateNumLock = [];
        })
        .catch(() => {
          this.updateNumLock = [];
        });
    },
    // 选中默认不选择任何货期
    setSelectExtends(cartList) {
      cartList.forEach(mode => {
        mode.miniCartList.forEach(cart => {
          // 购物车中的商品 选中的样式给予默认值
          this.isSelectExtends[cart.id] = [{ isCurr: false }, { isCurr: false }];
          // 进行选中
        });
      });
    },
    // 判断货期是否已经选中
    existsExtendsStr(list, _el) {
      if (list) {
        for (let _index = 0; _index < list.length; _index++) {
          // 判断当前元素是否已经存在
          if (list[_index] == _el) {
            list[_index];
          }
        }
      }
    },
    // 计算总运费
    calcTotalShipfee() {
      this.orderGoodInfo.totalShipfee = this.activeShippingTotal;
    },
    changeShip(findex, sindex) {
      // 选中新的值
      this.$set(this.curShipList, findex, this.orderGoodInfo.shippingModeVos[findex].orderShippingInfo[sindex]);
      this.calcTotalShipfee();
      this.$set(this.curList, findex, sindex);
    },
    // 获取默认发票
    getDefaultInvoiceInfo() {
      getInvoiceDefault({}).then(res => {
        if (res.code === '000000') {
          this.invoiceInfo = res.data;
        }
        // console.log(this.invoiceInfo);
      });
    },
    // 关闭发票弹窗显示
    closeInvoiceVisible() {
      this.invoiceVisible = false;
      this.getDefaultInvoiceInfo();
    },
    // 点击发票弹窗选项卡
    clickInvoice(nameNumber) {
      // console.log(nameNumber);
      this.iName = nameNumber;
    },
    addNormalInvoice() {
      this.iName = '0';
      this.invoiceVisible = true;
    },
    addDedicatedInvoice() {
      this.iName = '1';
      this.invoiceVisible = true;
    },
    // 关闭发票list
    closeInvoiceList() {
      this.invoiceListVisible = false;
      this.getDefaultInvoiceInfo();
    },
    // 打开新建创建
    openInvoiceDialog() {
      // console.log('---------------');
      this.invoiceListVisible = false;
      this.invoiceVisible = true;
      this.iName = '0';
    },
    getUserBonusCount() {
      getUserBonusList({ status: '1' }).then(res => {
        this.wsyCount = res.totalCount;
      });
    },
    getBonusList() {
      getUserBonusList({ status: '1', pageNumber: this.pageNumber, pageSize: this.pageSize }).then(res => {
        this.$set(this, 'bonusList', res.data);
        console.log('bonusList', this.bonusList);
        this.$set(this, 'totalCount', res.totalCount);
        if (this.bonusList.length > 0) {
          for (let _index = 0; _index < this.bonusList.length; _index++) {
            this.isSelectedBonus[_index] = false;
          }
        }
      });
    },
    selectedBonus(item, index) {
      if (this.orderGoodInfo.totalAmount < item.miniBonusType.minAmount || this.orderGoodInfo.totalAmount < this.totalCurBonusMoney) {
        this.$message({ type: 'warning', message: '对不起，优惠卷不能使用！' });
        return;
      }
      // 添加选中
      this.addCurBonus(item, index);
    },
    // 当前选中的优惠卷
    totalCurBonusMoney() {
      let _curBonus = this.curBonus;
      if (typeof _curBonus == 'object') {
        let totalBonusMoney = 0;
        if (_curBonus.length === 0) {
          return totalBonusMoney;
        }
        for (let _cur of _curBonus) {
          totalBonusMoney += _cur.miniBonusType.bonusMoney;
        }
        return totalBonusMoney;
      }
    },
    // 添加选中的优惠卷
    addCurBonus(item, index) {
      // debugger;
      this.delSelectedBonus(this.curBonus, item);
      let isExist = this.delSelectedBonus(this.curIndex, index);
      if (!isExist) {
        if (item.overlay === 1) {
          if (this.multipleOrSingle === 'single') {
            this.isNotSelectedBonus(index);
            this.multipleOrSingle = 'multiple';
            this.curBonus = [];
            this.curIndex = [];
          }
          // 选中的元素不存在时
          this.curBonus.push(item);
          this.curIndex.push(index);
          this.isSelectedBonus[index] = true;
        } else {
          this.multipleOrSingle = 'single';
          this.curBonus = [item];
          this.curIndex = [index];
          this.isSelectedBonus[index] = true;
          // 除了本身全部不选中
          this.isNotSelectedBonus(index);
        }
      }
    },
    // 优惠卷是否已经选中
    delSelectedBonus(list, _el) {
      let _curBonus = list;
      if (typeof _curBonus == 'object') {
        if (_curBonus.length === 0) {
          return false;
        }
        for (let _index = 0; _index < _curBonus.length; _index++) {
          if (list[_index] === _el) {
            list.splice(_index);
            this.isSelectedBonus[_el] = false;
            return true;
          }
        }
      }
      return false;
    },
    // 获取优惠卷id
    getCurBonusIds() {
      let _curBonus = this.curBonus;
      if (typeof _curBonus == 'object') {
        if (_curBonus.length === 0) {
          return;
        }
        let ids = '';
        for (let _cur of _curBonus) {
          ids += _cur.bonusId + ',';
        }
        return ids;
      }
    },
    // 除了传入的index外，其他优惠卷全部不选中
    isNotSelectedBonus(index) {
      for (let i = 0; i < this.isSelectedBonus.length; i++) {
        if (index != i) {
          this.isSelectedBonus[i] = false;
        }
      }
    },
    changeCustomName($event, cartId, num, extendsStr) {
      // 获取到当前输入框的输入值
      let newCustName = $event.srcElement.value;
      // console.log(newCustName);
      // console.log(cartId);
      if (newCustName.length > 15) {
        this.$message({ type: 'error', message: '字数在15个以内' });
      } else {
        updateReOrderNum({ id: cartId, customName: newCustName, num: num, extendsStr: extendsStr == null ? '0' : extendsStr }).then(res => {
          // console.log(res.message);
          if (res.code === '000000') {
            // console.log(this.orderGoodInfo);
            let shippingVo = this.orderGoodInfo.shippingModeVos;
            if (shippingVo) {
              if (shippingVo.length > 0) {
                for (let _i = 0; _i < shippingVo.length; _i++) {
                  let cartList = shippingVo[_i].miniCartList;
                  for (let _j = 0; _j < cartList.length; _j++) {
                    if (this.orderGoodInfo.shippingModeVos[_i].miniCartList[_j].cartId == cartId) {
                      this.$set(this.orderGoodInfo.shippingModeVos[_i].miniCartList[_j], 'customName', newCustName);
                    }
                    // console.log(this.orderGoodInfo.shippingModeVos[_i].miniCartList[_j]);
                  }
                }
              }
            }
          }
        });
      }
    },
    pageCommitOrder() {
      // 判断是否已经填入信息
      if (this.confirmLock) return;
      this.confirmLock = true;
      // 数据拼接整理
      let bonusId = '';
      if (this.curBonus) {
        let _temp = this.getCurBonusIds();
        if (_temp) {
          bonusId = _temp;
        }
      }
      // debugger;
      let consigneedId = 0;
      if (this.activeDefaultConsigneed) {
        consigneedId = this.activeDefaultConsigneed.id;
      }
      // 收货地址不能为空
      if (consigneedId === 0) {
        this.$message({ type: 'error', message: '必须选择收货地址' });
        this.confirmLock = false;
        return;
      }
      let shippingList = this.activeFromShippingItemVoList;
      console.log('shippList', this.activeFromShippingItemVoList);
      if (shippingList) {
        for (let index = 0; index < shippingList.length; index++) {
          if (shippingList[index].list.length == 0) {
            this.$message({ type: 'error', message: '必须选择商品' });
            this.confirmLock = false;
            return;
          }
        }
      }
      let documentId = 0;
      if (this.defaultDoc) {
        documentId = this.defaultDoc.id;
      }
      let invoiceAddressId = 0;
      if (this.invoiceAddressInfo) {
        invoiceAddressId = this.invoiceAddressInfo.id;
      }
      let invoiceId = 0;
      if (this.invoiceInfo) {
        invoiceId = this.invoiceInfo.id;
      }
      let data = {
        // 优惠卷id
        bonusId: bonusId,
        // 收货id
        consigneeId: consigneedId,
        // 文档id
        documentId: documentId,
        // 购物车信息
        formShippingItemVoList: shippingList,
        // 发票地址id
        invoiceAddressId: invoiceAddressId,
        // 发票id
        invoiceId: invoiceId,
        // 是否规范化处理
        isEdit: this.fileNormalization,
        // 备注
        memo: this.memo,
        oldSn: this.orderGoodInfo.orderId,
        // 发送者id
        senderId: this.activeDefaultSender,
        // 是否拼板
        isMakeUp: this.activeIsMarkup
      };
      // debugger;
      // console.log('-------------- commit ---------------');
      // console.log(data);
      commitOrder(data)
        .then(res => {
          // console.log(res);
          if (res.code == '000000') {
            this.confirmLock = false;
            if (this.invoiceInfo.invoiceType === 1) {
              this.$router.push({ path: '/service/getinvoicepay', query: { orderNo: res.data, paytype: 'normal' } });
            } else {
              this.$router.push({ path: '/service/getcylpay', query: { orderNo: res.data, paytype: 'normal' } });
            }
          }
        })
        .catch(() => {
          this.confirmLock = false;
        });
    },
    getUnitPrice(price, num) {
      if (price > 0 && num > 0) {
        return (price / num).toFixed(2);
      }
      return 0;
    },
    // 选择货期
    selectExtends(cartId, val) {
      // this.$set(this.orderGoodInfo.shippingModeVos[0].miniCartList[0], 'isCurr', '0');
      this.loadinger = this.$loading({
        lock: true,
        text: '加载中～',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      for (let i = 0; i < this.orderGoodInfo.shippingModeVos.length; i++) {
        const miniCarts = this.orderGoodInfo.shippingModeVos[i];
        for (let j = 0; j < miniCarts.miniCartList.length; j++) {
          const cart = miniCarts.miniCartList[j];
          if (strEquals(cartId, cart.id)) {
            if (strEquals(val, cart.isCurr)) {
              // cart.isCurr = '';
              this.$set(this.orderGoodInfo.shippingModeVos[i].miniCartList[j], 'isCurr', '');
              // this.shipFeeList[cartId] = 0;
              this.selectGoodsCartIds[cartId] = '';
              this.reGoodsInfoList();
            } else {
              // cart.isCurr = val;
              this.$set(this.orderGoodInfo.shippingModeVos[i].miniCartList[j], 'isCurr', val);
              this.selectGoodsCartIds[cartId] = cartId;
              // console.log('true', cart.isCurr, val, cartId);
              let data = {
                id: cart.id,
                num: 0,
                extendsStr: val
              };
              updateReOrderNum(data).then(res => {
                this.reGoodsInfoList();
              });
              return false;
            }
          }
        }
      }
    },
    // 重新赋值
    reGoodsInfoList() {
      let selectList = [];
      for (let _obj of Object.values(this.selectGoodsCartIds)) {
        selectList.push(_obj);
      }
      console.log('selectList', selectList);
      getReOrder({ data: selectList })
        .then(res => {
          if (res.code == '000000') {
            // console.log('data', res.data);
            let shippingVo = res.data.shippingModeVos;
            if (shippingVo) {
              if (shippingVo.length > 0) {
                for (let _i = 0; _i < shippingVo.length; _i++) {
                  this.$set(this.orderGoodInfo.shippingModeVos[_i], 'orderShippingInfo', shippingVo[_i].orderShippingInfo);
                  this.changeShip(0, 0);
                  console.log('shippingInfo', this.orderGoodInfo.shippingModeVos[_i]);
                  let cartList = shippingVo[_i].miniCartList;
                  for (let _j = 0; _j < cartList.length; _j++) {
                    this.$set(this.orderGoodInfo.shippingModeVos[_i].miniCartList[_j], 'goodsDetails', cartList[_j].goodsDetails);
                    this.$set(this.orderGoodInfo.shippingModeVos[_i].miniCartList[_j], 'goodsAttr', cartList[_j].goodsAttr);
                  }
                }
              }
            }
            this.calcTotalShipfee();
          }
          this.loadinger.close();
        })
        .catch(() => {
          this.loadinger.close();
        });
    },
    // 改变数量
    handleChange(cart, index) {
      // console.log(this.updateNumLock);
      if (this.updateNumLock) {
        this.updateNumLock[index] = false;
      }
      if (this.updateNumLock[index]) {
        return;
      }
      let id = cart.id;
      let num = cart.num;
      let extendsStr = cart.isCurr;
      if (!extendsStr) {
        extendsStr = '0';
      }
      if ((id != undefined && id != null) || (num != undefined && num != null)) {
        this.updateNumLock[index] = true;
        let data = {
          id: id,
          num: num,
          extendsStr: extendsStr
        };
        // console.log('---------------- handleChange ----------------');
        // console.log(data);
        updateReOrderNum(data)
          .then(res => {
            if (res.code === '000000') {
              getReOrder({})
                .then(res => {
                  if (res.code == '000000') {
                    let shippingVo = res.data.shippingModeVos;
                    if (shippingVo) {
                      if (shippingVo.length > 0) {
                        for (let _i = 0; _i < shippingVo.length; _i++) {
                          let cartList = shippingVo[_i].miniCartList;
                          this.$set(this.orderGoodInfo.shippingModeVos[_i], 'orderShippingInfo', shippingVo[_i].orderShippingInfo);
                          console.log('shippingInfo', shippingVo[_i].orderShippingInfo);
                          for (let _j = 0; _j < cartList.length; _j++) {
                            this.$set(this.orderGoodInfo.shippingModeVos[_i].miniCartList[_j], 'goodsDetails', cartList[_j].goodsDetails);
                            this.$set(this.shipFeeList, cartList[_j].cartId, cartList[_j].shipping_fee);
                          }
                        }
                      }
                    }
                    this.calcTotalShipfee();
                  } else {
                    this.$message({ type: 'error', message: res.message });
                    // this.$router.go(-1);
                  }
                  this.updateNumLock[index] = false;
                })
                .catch(() => {
                  this.updateNumLock[index] = false;
                });
            }
          })
          .catch(error => {
            // console.log(error);
            this.updateNumLock[index] = false;
          });
      }
      // console.log(id);
      // console.log(val);
    }
  }
};
</script>
<style scoped src="../../static/index/css/shopping.css"></style>
<style scoped src="../../static/assets/layui/css/layui.css" media="all"></style>
<style scoped src="../../static/index/css/magic-check.css"></style>
<style scoped src="../../static/index/css/base.css"></style>
<style scoped src="../../static/index/css/common.css"></style>
<style scoped src="../../static/index/user/css/all.css" />
<style scoped src="../../static/mulindex/css/attr.css"></style>
<style>
.el-table__body-wrapper::-webkit-scrollbar {
  width: 7px;
  height: 5px;
  border-radius: 15px;
  -webkit-border-radius: 15px;
}
.el-table__body-wrapper::-webkit-scrollbar-track-piece {
  background-color: #ffff;
  border-radius: 15px;
  -webkit-border-radius: 15px;
}
.el-table__body-wrapper::-webkit-scrollbar-thumb:vertical {
  height: 5px;
  background-color: rgba(144, 147, 153, 0.5);
  border-radius: 15px;
  -webkit-border-radius: 15px;
}
.el-table__body-wrapper::-webkit-scrollbar-thumb:horizontal {
  width: 7px;
  background-color: rgba(144, 147, 153, 0.5);
  border-radius: 15px;
  -webkit-border-radius: 15px;
}
.c-type-style01 .c-limit span,
.c-type-style01 .c-time {
  color: #868686;
}
.c-type-style01 .c-type-bottom {
  background-position: 0 -316px;
}
.cur_bonus {
  background: #868686;
}
</style>
<style scoped>
.geRtime {
  padding: 5px 0px;
}
</style>
