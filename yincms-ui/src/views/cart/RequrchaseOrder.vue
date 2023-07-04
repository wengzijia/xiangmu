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
                    <div :class="addres.isDefault != 0 ? 'add_mi curr' : 'add_mi'" v-for="(addres, index) of ordersAddressLists" :key="index" @click="updateDefaultAddress(addres)">
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
                      <button class="layui-btn layui-btn-primary layui-btn-sm manage-address" @click="goUserAddress">管理收货地址</button>
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
                      <el-form-item label="QQ" prop="qq" style="margin-top: 20px">
                        <el-input v-model="form.qq"></el-input>
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
                        <el-option style="padding-left: 15px" v-for="(item, index) in tempAddressLists" :key="index" :label="item.consigneeName" :value="item.id"></el-option>
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
                    <template v-if="mode.orderShippingInfo.length == 0">
                      <span style="color: red; margin-top: 40px; font-size: large">该地址不在配送范围</span>
                    </template>
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
                            <span class="red" v-if="ship.isSuccess != -11 && ship.payMode != 2">￥ {{ ship.freight == undefined ? 0 : ship.freight }}</span>
                            <span class="red" v-else>{{ ship.msg }}</span>
                          </li>
                        </div>
                        <div v-show="ship.laLaMove == null && ship.shippingName == '工厂自提'">
                          <li style="display: flex">
                            <span class="C9">自提地址：</span>
                            <span style="flex: 1; line-height: 18px; display: inline-block; margin: 10px 0">广东省佛山市南海区里水镇麻奢拼一版档口(导航:傲彩产业园)</span>
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
                    <h4 style="display: flex; justify-content: space-between">
                      <span>商家：傲彩供应商</span>
                      <span style="font-weight: 700; color: #d8111b">{{ tips }}</span>
                    </h4>
                    <table class="ShopCartTable">
                      <tbody>
                        <tr v-for="(cart, index) in mode.miniCartList" :key="index">
                          <td width="53%" class="selectLeft">
                            <span class="inline">
                              <el-checkbox v-model="cart.checked" @change="selectExtends(cart.id, cart.delivery, findex, index)" class="selectOrder">{{ cart.checked ? '已选择翻单' : '未选择翻单' }}</el-checkbox>
                              <img class="goodImg" :src="cart.goodsCoverPath" />
                            </span>
                            <span class="inline goodsName">
                              <h2 class="inline bule">{{ cart.goodsName }}</h2>
                              <br />
                              <input name="custom_name" class="layui-input" type="text" @change="changeCustomName($event, cart.id, cart.num, cart)" :value="cart.customName" placeholder="自定义产品名称(15字以内)，选填" />
                              {{ cart.goodsAttr }}
                            </span>
                          </td>
                          <td>
                            <el-input-number
                              v-model="cart.num"
                              @change="handleChange(cart, findex, index)"
                              :min="getLessNum(cart)"
                              :max="99999999"
                              :step="50"
                              :disabled="updateNumLock[findex] == undefined || updateNumLock[findex][index] == undefined ? true : updateNumLock[findex][index]"
                              size="mini"
                              style="margin-left: -10px"
                            ></el-input-number>
                          </td>
                          <td>
                            <div v-if="cart.goodsId == 640">个性定制无法翻单</div>
                            <div v-else class="geRtimeLt">
                              <!-- 3天短货期 -->
                              <div
                                v-if="(cart.goodsDetails.cextends == 4 || cart.goodsDetails.cextends == 5) && cart.goodsTag == 1 && cart.num <= 10000"
                                :class="'flex geRtime' + (strEquals(cart.isCurr, '4') || strEquals(cart.isCurr, '5') ? ' curr' : '')"
                                @click="selectExtends(cart.id, cart.goodsDetails.cextends + '', findex, index)"
                              >
                                <label class="geRtimeLt dateSel">
                                  <em class="dateH" :value="cart.goodsDetails.cextends + ''"></em>
                                  <span class="dayNormal">{{ cart.goodsDetails.time_slow }}小时（{{ cart.goodsDetails.days_slow }}天）</span>
                                  <div class="extra en" style="display: inline; width: 100px">
                                    <p class="moneyNormal" style="display: inline; width: 100px">¥{{ cart.goodsDetails.price_slow }}</p>
                                  </div>
                                </label>
                              </div>
                              <div
                                v-else-if="cart.goodsDetails.cextends != 4 && cart.goodsDetails.cextends != 5 && cart.goodsTag == 1 && cart.num < 10000"
                                :class="'flex geRtime' + (strEquals(cart.isCurr, '0') ? ' curr' : '')"
                                @click="selectExtends(cart.id, '0', findex, index)"
                              >
                                <label class="geRtimeLt dateSel">
                                  <em class="dateH" value="0"></em>
                                  <span class="dayNormal">{{ cart.goodsDetails.time_normal }}小时（{{ cart.goodsDetails.days_normal }}天）</span>
                                  <div class="extra en" style="display: inline; width: 100px">
                                    <p class="moneyNormal" style="display: inline; width: 100px">¥{{ cart.goodsDetails.price_normal }}</p>
                                  </div>
                                </label>
                              </div>
                              <div v-if="cart.goodsDetails.cextends != 4 && cart.goodsDetails.cextends != 5" :class="'flex geRtime' + (strEquals(cart.isCurr, '1') ? ' curr' : '')" @click="selectExtends(cart.id, '1', findex, index)">
                                <label class="geRtimeLt dateSel">
                                  <em class="dateH" value="1"></em>
                                  <span class="dayNormal">{{ cart.goodsDetails.time_slow }}小时（{{ cart.goodsDetails.days_slow }}天）</span>
                                  <div class="extra en" style="display: inline; width: 100px">
                                    <p class="moneyNormal" style="display: inline; width: 100px">¥{{ cart.goodsDetails.price_slow }}</p>
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
                <h3 class="ordok_h3">
                  发票信息
                  <span style="margin-left: 10px"><span style="color: red">*</span>订单未选择开票的，仅限订单创建三个月内可补开发票，请慎重选择</span>
                </h3>
                <div class="adresBox">
                  <div class="layui-col-md12">
                    <div class="layui-card">
                      <div v-if="invoiceInfo.invoiceName != null && invoiceInfo.invoiceName != ''">
                        <div class="opt layui-form">
                          <el-radio v-if="invoiceInfo.invoiceType == 0">【增值普通发票】{{ invoiceInfo.invoiceName }} <font style="color: #d0111b">【默认】</font></el-radio>
                          <el-radio v-else>【增值专用发票】{{ invoiceInfo.invoiceName }} <font style="color: #d0111b">【默认】</font></el-radio>
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
                <user-invoice-list-dialog :activeVisible="invoiceListVisible" :reGoodsInfoList="reGoodsInfoList" @addInvoice="openInvoiceDialog" @close="closeInvoiceList"></user-invoice-list-dialog>
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
              <!-- 优惠卷 -->
              <bonus-components
                v-if="orderData.orderSumMoney && activeTotal"
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
                    ><span class="cartMoney">{{ activeTotalGoodsMoney.total }}</span
                    >元</span
                  >
                </li>
                <li>
                  <label>运费：</label>
                  <template v-if="isRemoteCity()">
                    <span class="val red">{{ activeTotalGoodsMoney.shipFee }}元</span>
                  </template>
                  <template v-else>
                    <span class="val black" style="text-decoration: line-through">{{ activeTotalGoodsMoney.shipFee }}元</span>
                    <br />
                    <div class="val red">{{ activeTotalGoodsMoney.shipFee - getShippeFreePrice(activeTotalGoodsMoney.shipFee) }}元</div>
                  </template>
                </li>
                <li v-if="invoiceInfo.invoiceType === 1">
                  <label>税金：</label>
                  <template v-if="isRemoteCity()">
                    <span class="val">
                      <font>{{ activeTaxMoney }}</font
                      >元
                    </span>
                  </template>
                  <template v-else>
                    <!--<span class="val black" style="text-decoration: line-through">
                      <font>{{ activeTaxMoney }}</font
                      >元
                    </span>
                    <br />-->
                    <span class="val">
                      <font>{{ activeTaxMoney - Math.floor(getShippeFreePrice(activeTotalGoodsMoney.shipFee) * 0.06) }}</font
                      >元
                    </span>
                  </template>
                </li>
                <li v-if="offerAmount">
                  <label>优惠金额：</label>
                  <span class="val">
                    <font class="chkorderbonus">{{ offerAmount }}</font
                    >元
                  </span>
                </li>
                <!-- <div v-if="cashOrDiscount !== -1 && offerAmount > 0">
                  <li v-if="cashOrDiscount === 0">
                    <label>抵现金额：</label>
                    <span class="val">
                      <font class="chkorderbonus">{{ offerAmount }}</font
                      >元
                    </span>
                  </li>
                  <li v-else>
                    <label>返现金额：</label>
                    <span class="val">
                      <font class="chkorderbonus">{{ offerAmount }}</font
                      >元
                    </span>
                  </li>
                </div> -->
              </ol>
              <li class="bjrow">
                <div class="totalDv">
                  <label>应付总额：</label>
                  <b class="val">
                    <font class="chktotalmoney">
                      <template v-if="isRemoteCity()">
                        {{ activeTotal }}
                      </template>
                      <template v-else>
                        {{ activeTotal  - getShippeFreePrice(activeTotalGoodsMoney.shipFee) - (activeTaxMoney > 0 ? Math.floor(getShippeFreePrice(activeTotalGoodsMoney.shipFee) * 0.06) : 0) }}
                      </template>
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
import BonusComponents from './bonusComponents/index';
import { getInvoiceDefault, saveOrUpdate as updateInvoice } from '@/api/users/userInvoiceApi';
import UserInvoiceDialog from './userInvoiceDialog/index';
import UserInvoiceListDialog from './userInvoiceListDialog/index';
import { formatDateSecond } from '@/utils/timeUtil';
import { getUserBonusList } from '@/api/users/userBonusApi';
import { strEquals } from '@/utils/strUtil';
import { objectElmentEmpty, replaceAll } from '@/utils/objectUtil';
import { getLessNum } from '@/utils/order/requrchaseOrder';
export default {
  name: 'RequrchaseOrder',
  components: {
    'user-document-dialog': UserDocumentDialog,
    'user-document-list': UserDocumentList,
    'user-invoice-dialog': UserInvoiceDialog,
    'user-invoice-list-dialog': UserInvoiceListDialog,
    BonusComponents
  },
  computed: {
    // 收货地址全
    activeBonusMoney: function () {
      let _bonus = this.offerAmount;
      let _type = this.cashOrDiscount;
      if (_type !== -1) {
        // 抵现，
        if (_type === 0) {
          return _bonus;
        } else {
          return 0;
        }
      }
      return 0;
    },
    // 发票信息
    activeInvoiceInfo: function () {
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
    activeConsigneedInfo: function () {
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
    activeDefaultConsigneed: function () {
      let con = this.ordersAddressLists.filter(function (consigneed) {
        return consigneed.isDefault == 1;
      });
      if (con == undefined || con.length <= 0) {
        return 0;
      } else {
        return con[0];
      }
    },
    activeDefaultConsigneedId: function () {
      let con = this.ordersAddressLists.filter(function (consigneed) {
        return consigneed.isDefault == 1;
      });
      if (con == undefined || con == null || con == []) {
        return 0;
      } else {
        return con[0].id;
      }
    },
    activeFromShippingItemVoList: function () {
      let formList = [];
      for (let i = 0; i < this.shipLength; i++) {
        let ship = this.orderGoodInfo.shippingModeVos[i].orderShippingInfo[this.curList[i]];
        if (ship.isSuccess == -1) {
          return ship.msg;
        }
        let data = {
          list: [],
          shippingId: ship.id,
          shippingName: ship.shippingName,
          supplierId: ship.shippingId,
          isOut: this.orderGoodInfo.shippingModeVos[i].isOut
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
    activeBonusShow: function () {
      // 是否显示优惠卷
      return this.bonusList == undefined || this.bonusList == '' || this.bonusList == [];
    },
    // 是否显示货拉拉
    activeHuolalaShow: function () {
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
    activeShippingTotal: function () {
      let shipTotal = 0;
      for (let i = 0; i < this.shipLength; i++) {
        let cartList = this.orderGoodInfo.shippingModeVos[i].miniCartList;
        // debugger;
        for (let j = 0; j < cartList.length; j++) {
          let cart = cartList[j];
          if (cart.isCurr) {
            shipTotal += this.curShipList[i].freight;
            break;
          }
        }
      }
      return shipTotal;
    },
    // 统计总价
    activeTotal: function () {
      let total = this.activeTotalGoodsMoney.total + this.activeTotalGoodsMoney.shipFee - this.activeBonusMoney;
      if (this.invoiceInfo.invoiceType === 1) {
        total += this.activeTaxMoney;
      }

      return total;
    },
    // 是否是拼板
    activeIsMarkup: function () {
      if (this.isMakeUp == undefined || this.isMakeUp == '') {
        return 0;
      }
      return this.isMakeUp;
    },
    // 税金
    activeTaxMoney: function () {
      if (this.curShipList.length === 0) return 0;
      if (this.invoiceInfo) {
        if (this.invoiceInfo.invoiceType != undefined && this.invoiceInfo.invoiceType === 0) {
          return 0;
        }
      }
      // 是否有选中
      if (!this.isSelectedTaxShow()) {
        return 0;
      }
      var totalTaxMoney = this.curShipList[0].taxSingle;
      // console.log('curShipList', this.curShipList);
      return totalTaxMoney;
    },
    // 选中的金额
    activeTotalGoodsMoney: function () {
      let shippingVo = this.orderGoodInfo.shippingModeVos;
      let totalMoney = 0;
      let totalShipfee = 0;
      if (shippingVo) {
        if (shippingVo.length > 0) {
          shippingVo.forEach(mode => {
            mode.miniCartList.forEach(cart => {
              if (cart.isCurr) {
                if (strEquals(cart.isCurr, '0')) {
                  if (cart.goodsId === 962) {
                    totalMoney += cart.goodsDetails.price_member - 500;
                  } else {
                    totalMoney += cart.goodsDetails.price_member;
                  }
                } else if (strEquals(cart.isCurr, '1')) {
                  if (cart.goodsId === 962) {
                    totalMoney += cart.goodsDetails.price_slow - 500;
                  } else {
                    totalMoney += cart.goodsDetails.price_slow;
                  }
                } else if (strEquals(cart.isCurr, '4') || strEquals(cart.isCurr, '5')) {
                  totalMoney += cart.goodsDetails.price_slow;
                } else {
                  totalMoney += cart.goodsDetails.price_slow;
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
      tips: '请先选择货期再进行修改数量！',
      ordersAddressLists: [],
      tempAddressLists: [],
      isAllAddress: false,
      // 新增地址
      dialogVisible: false,
      form: { province: '', city: '', county: '', provinceId: '', cityId: '', countyId: '', mobile: '' },
      rules: {
        consigneeName: { required: true, message: '请输入收货人', trigger: 'blur' },
        address: { required: true, message: '请输入地址', trigger: 'blur' },
        mobile: { required: true, validator: validatePhone, message: '请输入正确的手机号', trigger: 'blur' },
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
      // 商品分类统计
      cartCategory: {},
      // 优惠卷方式
      cashOrDiscount: 0,
      // 优惠金额
      offerAmount: 0,
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
      updateNumLock: [[]],
      confirmLock: false,
      // 获取选中 id: 选中 获取 0  1  -1 未选中
      selectExtendsStr: [],
      // 货期选中样式 选中样式
      isSelectExtends: [],
      // 运费价格
      shipFeeList: {},
      // 选中的商品
      selectGoodsCartIds: [],
      loadinger: {},
      // 最少数量
      lessNum: 100,
      remoteCity: ['青海省', '台湾省', '内蒙古', '西藏', '香港', '澳门', '新疆'],
      orderData: {
        orderType: '1',
        systemType: 'aocai_gw',
        orderSumMoney: 0
      },
      couponData: []
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
    ...{ getLessNum },
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
    // 全选事件
    selectAllClick() {
      for (let i = 0; i < this.orderGoodInfo.shippingModeVos.length; i++) {
        const miniCarts = this.orderGoodInfo.shippingModeVos[i];
        for (let j = 0; j < miniCarts.miniCartList.length; j++) {
          const cart = miniCarts.miniCartList[j];
          let val = '';
          // 微坑盒型不让选中
          if (cart.goodsTag == '7') {
            this.$message({ type: 'warning', message: '该盒型不支持翻单，请重新下单' });
            this.loadinger.close();
            return;
          } else {
            cart.checked = true;
            this.updateNumLock[i][j] = false;
            if ((cart.goodsDetails.cextends == 4 || cart.goodsDetails.cextends == 5) && cart.goodsTag == 1 && cart.num <= 10000) {
              val = cart.goodsDetails.cextends + '';
              cart.delivery = cart.goodsDetails.cextends + '';
            } else if (cart.goodsDetails.cextends != 4 && cart.goodsDetails.cextends != 5) {
              val = '1';
              cart.delivery = '1';
            } else if (cart.goodsDetails.cextends != 4 && cart.goodsDetails.cextends != 5 && cart.goodsTag == 1 && cart.num < 10000) {
              val = '0';
              cart.delivery = '0';
            }
            this.$set(this.orderGoodInfo.shippingModeVos[i].miniCartList[j], 'isCurr', val);
            this.$set(this.orderGoodInfo.shippingModeVos[i].miniCartList[j], 'checked', true);
            this.selectGoodsCartIds[cart.id] = cart.id;
            let data = {
              id: cart.id,
              num: cart.num,
              extendsStr: val
            };
            updateReOrderNum(data).then(res => {
              console.log('sss');
            });
          }
        }
      }
      this.reGoodsInfoList();
    },
    // 获取翻单商品
    async getOrderGoodInfo() {
      this.loadinger = this.$loading({
        lock: true,
        text: '加载中～',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      await getReOrder({})
        .then(res => {
          if (res.code === '000000') {
            // console.log('-------------- order goods -------------------');
            // console.log(res);
            let order = JSON.parse(JSON.stringify(res.data));
            this.shipLength = order.shippingModeVos.length;
            // 默认选中第一种快递
            let len = 0;
            // 默认选中第一种快递
            let cartCategory = {};
            // 计算占用率
            var ratioCount = { scale: 1 };
            this.orderGoodInfo = order;
            this.getCoupon()
            for (var i = 0; i < this.shipLength; i++) {
              this.$set(this.curList, i, 0);
              this.$set(this.curShipList, i, order.shippingModeVos[i].orderShippingInfo[0]);
              len = order.shippingModeVos[i].miniCartList.length;
              // 商品类型
              let isEnd = i === this.shipLength - 1;
              this.setCartList(cartCategory, ratioCount, isEnd, res.data.shippingModeVos[i].miniCartList, i, order);
            }
            // for (let j = 0; j < len; j++) {
            //   this.updateNumLock[j] = true;
            // }
            console.log('update', this.updateNumLock);
            // 拼装货期
            // this.setSelectExtends(res.data.shippingModeVos);
            this.calcTotalShipfee();
            // 全选
            this.selectAllClick();
          } else {
            this.$message({ type: 'error', message: res.message });
            // this.$router.go(-1);
            this.loadinger.close();
          }
        })
        .catch(() => {
          this.loadinger.close();
        });
    },
    // 整理订单数据，获取优惠券
    getCoupon() {
      for (let i = 0; i < this.orderGoodInfo.shippingModeVos.length; i++) {
        const el = this.orderGoodInfo.shippingModeVos[i];
        if (!el.isOut) {
          this.orderData.goodsSumMoney = 0
          this.orderData.goodsId = el.miniCartList.map(e => {
            this.orderData.goodsSumMoney += Number(e.goodsTotal)
            return e.goodsId
          }).join(',')
          this.orderData.orderSumMoney = this.orderData.goodsSumMoney + Number(this.curShipList[i]?.taxSingle) + Number(this.curShipList[i]?.freight)
        }
      }
      console.log('=========================', this.orderData);
    },
    // 选中优惠券
    changeCoupon(data) {
      this.offerAmount = 0
      data.map(e => {
        this.offerAmount += Number(e.useMoney) 
      })
      console.log(this.offerAmount, '================+++++++++++++');
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
      this.orderData.orderSumMoney = this.orderData.goodsSumMoney + Number(this.curShipList[findex]?.taxSingle) + Number(this.curShipList[findex]?.freight)
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
        this.$set(this, 'totalCount', res.totalCount);
        // console.log('this.bonusList', this.bonusList);
        if (this.bonusList.length > 0) {
          for (let _index = 0; _index < this.bonusList.length; _index++) {
            this.isSelectedBonus[_index] = false;
          }
        }
      });
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
    changeCustomName($event, cartId, num, cart) {
      let extendsStr = cart.isCurr;
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
                  }
                }
              }
            }
          }
        });
      }
    },
    setCartList(cartCategory, ratioCount, isEnd, list, index, order) {
      // debugger;
      let lock = [];
      for (let _index = 0; _index < list.length; _index++) {
        lock[_index] = true;
        let el = list[_index];
        let tag = cartCategory[el.goodsTag];
        let ratio = 0;
        if (isEnd) {
          ratio = ratioCount.scale;
        } else {
          ratio = this.numFilter(el.goodsTotal / order.totalAmount);
          ratioCount.scale -= ratio;
        }
        if (tag) {
          cartCategory[el.goodsTag].total += el.goodsTotal;
        } else {
          cartCategory[el.goodsTag] = { total: el.goodsTotal, ratio: ratio };
        }
      }
      this.updateNumLock[index] = [];
      this.updateNumLock[index] = lock;
    },
    // 保留两位小数
    numFilter(val) {
      var realVal = parseFloat(val).toFixed(2);
      return parseFloat(realVal);
    },
    // 重新赋值
    setReCartCategory(cartCategory, index, list) {
      for (let _index = 0; _index < list.length; _index++) {
        let el = list[_index];
        cartCategory[el.goodsTag] = { total: el.goodsTotal, ratio: el.goodsTotal / this.orderGoodInfo.totalAmount };
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
      // 优惠卷类型 折现
      let bonusType = this.cashOrDiscount;
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
      if (typeof shippingList === 'string') {
        this.$message({ type: 'error', message: shippingList });
        this.confirmLock = false;
        return;
      }
      if (shippingList) {
        let isSelectedGoods = false;
        for (let index = 0; index < shippingList.length; index++) {
          let el = shippingList[index];
          if (el.list.length > 0) {
            isSelectedGoods = true;
          }
        }
        if (!isSelectedGoods) {
          this.$message({ type: 'error', message: '必须选择商品' });
          this.confirmLock = false;
          return;
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
        // 优惠券信息
        couponList: this.couponData,
        // 优惠卷id
        bonusId: bonusId,
        // 收货id
        consigneeId: consigneedId,
        // 文档id
        documentId: documentId,
        // 购物车信息(只返回list为真的数据)
        formShippingItemVoList: shippingList.filter(item => item.list.length),
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
      if (bonusType !== -1) {
        data['bonusUseType'] = bonusType;
      }
      // debugger;
      // console.log('-------------- commit ---------------');
      // console.log(data);
      if (this.orderGoodInfo.isCanPay == 0) {
        this.$confirm('订单中包括了自定义工艺，下单后进入评估报价，待评估完成后再计入订单金额一起支付吧！', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            commitOrder(data)
              .then(res => {
                if (res.code == '000000') {
                  this.$router.push('/user/orderlist');
                }
              })
              .catch(() => {
                this.confirmLock = false;
              });
          })
          .catch(() => {});
        this.confirmLock = false;
      } else {
        commitOrder(data)
          .then(res => {
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
      }
    },
    getUnitPrice(price, num) {
      if (price > 0 && num > 0) {
        return (price / num).toFixed(2);
      }
      return 0;
    },
    // 选择货期
    selectExtends(cartId, val, findex, index) {
      console.log('selectExtends--', cartId, val, findex, index);
      this.orderGoodInfo.shippingModeVos[findex].miniCartList[index].delivery = val;
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
              this.updateNumLock[findex][index] = true;
              // cart.isCurr = '';
              this.$set(this.orderGoodInfo.shippingModeVos[i].miniCartList[j], 'isCurr', '');
              this.$set(this.orderGoodInfo.shippingModeVos[i].miniCartList[j], 'checked', false);
              // this.shipFeeList[cartId] = 0;
              this.selectGoodsCartIds[cartId] = '';
              // this.selectGoodsCartIds[cartId] = cartId;
              this.reGoodsInfoList();
            } else {
              console.log('cart.num--', cart.num);
              // console.log(this.updateNumLock);
              this.updateNumLock[findex][index] = false;
              let goodsTag = this.orderGoodInfo.shippingModeVos[i].miniCartList[j].goodsTag;
              // 微坑盒型不让选中
              if (goodsTag === '7') {
                this.$message({ type: 'warning', message: '该盒型不支持翻单，请重新下单' });
                this.loadinger.close();
              } else {
                this.$set(this.orderGoodInfo.shippingModeVos[i].miniCartList[j], 'isCurr', val);
                this.$set(this.orderGoodInfo.shippingModeVos[i].miniCartList[j], 'checked', true);
                this.selectGoodsCartIds[cartId] = cartId;
                let data = {
                  id: cart.id,
                  num: cart.num,
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
            this.clearCurBonus();
            // console.log('data', res.data);
            let shippingVo = res.data.shippingModeVos;
            if (shippingVo) {
              if (shippingVo.length > 0) {
                for (let _i = 0; _i < shippingVo.length; _i++) {
                  this.$set(this.orderGoodInfo.shippingModeVos[_i], 'orderShippingInfo', shippingVo[_i].orderShippingInfo);
                  // console.log('shippingInfo', this.orderGoodInfo.shippingModeVos[_i]);
                  let cartList = shippingVo[_i].miniCartList;
                  for (let _j = 0; _j < cartList.length; _j++) {
                    this.$set(this.orderGoodInfo.shippingModeVos[_i].miniCartList[_j], 'goodsDetails', cartList[_j].goodsDetails);
                    this.$set(this.orderGoodInfo.shippingModeVos[_i].miniCartList[_j], 'goodsAttr', cartList[_j].goodsAttr);
                    this.$set(this.orderGoodInfo.shippingModeVos[_i].miniCartList[_j], 'customName', shippingVo[_i].miniCartList[_j].customName);
                    // console.log('cust',shippingVo[_i].miniCartList[_j].customName);
                  }
                  // 配送方式选择
                  this.setDefaultShip(_i);
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
    setDefaultShip(_findex) {
      // console.log('111111111111', _findex);
      if (this.curList.length > 0) {
        this.changeShip(_findex, this.curList[0]);
      } else {
        this.changeShip(_findex, 0);
      }
    },
    // 改变数量
    handleChange(cart, findex, index) {
      console.log('cart=====', cart, findex, index);
      let selectList = [];
      for (let _obj of Object.values(this.selectGoodsCartIds)) {
        selectList.push(_obj);
      }
      if (this.updateNumLock) {
        this.updateNumLock[findex][index] = false;
      }
      if (this.updateNumLock[findex][index]) {
        return;
      }
      let id = cart.id;
      let num = cart.num;
      let extendsStr = cart.isCurr;
      console.log('extendsStr=-=-=-=555', extendsStr);
      if (!extendsStr) {
        extendsStr = '0';
        return;
      }
      if ((id !== undefined && id !== null) || (num !== undefined && num !== null)) {
        this.updateNumLock[findex][index] = true;
        let data = {
          id: id,
          num: num,
          extendsStr: extendsStr
        };
        // console.log('---------------- handleChange ----------------');
        // console.log(data);
        this.loadinger = this.$loading({
          lock: true,
          text: '加载中～',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        updateReOrderNum(data)
          .then(res => {
            if (res.code === '000000') {
              this.clearCurBonus();
              getReOrder({ data: selectList })
                .then(res => {
                  if (res.code == '000000') {
                    let shippingVo = res.data.shippingModeVos;
                    if (shippingVo) {
                      if (shippingVo.length > 0) {
                        for (let _i = 0; _i < shippingVo.length; _i++) {
                          let cartList = shippingVo[_i].miniCartList;
                          this.setReCartCategory(this.cartCategory, _i, cartList);
                          this.$set(this.orderGoodInfo.shippingModeVos[_i], 'orderShippingInfo', shippingVo[_i].orderShippingInfo);
                          // console.log('shippingInfo', shippingVo[_i].orderShippingInfo);
                          for (let _j = 0; _j < cartList.length; _j++) {
                            this.$set(this.orderGoodInfo.shippingModeVos[_i].miniCartList[_j], 'goodsDetails', cartList[_j].goodsDetails);
                            this.$set(this.shipFeeList, cartList[_j].cartId, cartList[_j].shipping_fee);
                          }
                          // 配送方式选择
                          this.setDefaultShip(_i);
                        }
                        // 3天货期的判断，选中之后更改数量货期改变默认选中状态
                        if (cart.goodsDetails.cextends != 4 && extendsStr != 4) {
                          if (cart.num >= 10000) {
                            this.$set(this.orderGoodInfo.shippingModeVos[findex].miniCartList[index], 'isCurr', '1');
                            this.$set(this.orderGoodInfo.shippingModeVos[findex].miniCartList[index], 'delivery', '1');
                            this.selectGoodsCartIds[cart.id] = cart.id;
                            let data = {
                              id: cart.id,
                              num: cart.num,
                              extendsStr: '1'
                            };
                            updateReOrderNum(data).then(res => {
                              this.reGoodsInfoList();
                            });
                          }
                        } else {
                          console.log(' cart.goodsDetails.cextends', cart.goodsDetails.cextends)
                          this.selectExtends(cart.id, cart.goodsDetails.cextends + '', findex, index);
                        }
                        // if(cart.goodsDetails.cextends==0&&extendsStr!=0){
                        //   this.selectExtends(cart.id, '0', findex,index)
                        // }else if(cart.goodsDetails.cextends!=1&&extendsStr==1){
                        //   this.selectExtends(cart.id, cart.goodsDetails.cextends, findex,index)
                        // }
                      }
                    }
                    this.calcTotalShipfee();
                  } else {
                    this.$message({ type: 'error', message: res.message });
                    // this.$router.go(-1);
                  }
                  this.updateNumLock[findex][index] = false;
                  this.loadinger.close();
                })
                .catch(() => {
                  this.updateNumLock[findex][index] = false;
                  this.loadinger.close();
                });
            }
          })
          .catch(error => {
            // console.log(error);
            this.updateNumLock[findex][index] = false;
            this.loadinger.close();
          });
      }
      // console.log(id);
      // console.log(val);
    },
    clearCurBonus() {
      this.isNotSelectedBonus(-1);
      this.curBonus = [];
      this.curIndex = [];
    },
    // 是否有选中商品货期，显示税金
    isSelectedTaxShow() {
      let list = this.selectGoodsCartIds;
      if (list) {
        for (let _val of Object.values(list)) {
          if (_val) {
            return true;
          }
        }
      }
      return false;
    },
    // 优惠卷优惠卷金额
    discountAmount(money) {
      this.offerAmount = money;
      // console.log('this.offerAmount', money);
    },
    // 使用优惠卷方式
    bonusType(type) {
      this.cashOrDiscount = type;
      // console.log('this.cashOrDiscount', this.cashOrDiscount);
    },
    //判断是否偏远城市
    isRemoteCity() {
      let today = new Date();
      let startDate = new Date(this.$store.state.user.activitys);
      let endDate = new Date(this.$store.state.user.activitye);
      if (today < startDate || today > endDate) {
        return true;
      }
      if (!this.ordersAddressLists[0]) {
        return true;
      }
      if (this.remoteCity.indexOf(this.ordersAddressLists[0].province) > -1) {
        return true;
      }
      return this.$store.state.user.activitystatus;
    },
    getShippeFreePercent() {
      let today = new Date();
      let startDate = new Date(this.$store.state.user.activitys);
      let endDate = new Date(this.$store.state.user.activitye);
      if (today < startDate || today > endDate) {
        return;
      }
      if (this.remoteCity.indexOf(this.ordersAddressLists[0].province) > -1) {
        return;
      }
      if (this.ordersAddressLists[0].province == '广东省') {
        return 0.3;
      } else {
        return 0.8;
      }
    },
    getShippeFreePrice(shippefee) {
      return shippefee * this.getShippeFreePercent() - 2000 > 0 ? 2000 : Math.floor(shippefee * this.getShippeFreePercent());
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

/* 选择翻单样式 */
.selectOrder {
  display: block !important;
  top: -10px !important;
}
.selectOrder /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #333333;
}
</style>
