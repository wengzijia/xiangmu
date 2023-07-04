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
                      <el-form-item style="margin-top: 20px">
                        <el-button style="width: 95px;height: 35px;" type="danger" @click="handlerSubmit">立即提交</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-dialog>
                <el-dialog :visible.sync="dialogVisibleSearch" title="搜索收货人" width="300px">
                  <el-row type="flex">
                    <el-col justify="center">
                      <el-select v-model="optionAddressId" filterable placeholder="直接选择收货人或搜索收货人" style="width:260px">
                        <el-option style="padding-left: 15px" v-for="(item, index) in tempSearchAddrList" :key="index" :label="item.consigneeName" :value="item.id"></el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row style="margin: 20px 0 0 50px">
                    <el-col style="margin-left: -20px">
                      <el-button style="width: 95px;height: 35px;" type="danger" @click="selectAddress(optionAddressId)">确认</el-button>
                      <el-button style="width: 95px;height: 35px;" @click="dialogVisibleSearch = false">取消</el-button>
                    </el-col>
                  </el-row>
                </el-dialog>

                <fieldset class="layui-elem-field layui-field-title" style="margin-top: 20px;">
                  <legend>大货寄样</legend>
                </fieldset>
                <div class="yangBox">
                  <div class="layui-col-md12">
                    <div class="layui-card" v-if="isSample">
                      <div class="layui-card-body" v-if="hasSampleAddress">
                        <div class="opt layui-form">
                          <el-radio>{{ sample.contacts + '&nbsp;' + sample.mobile + '&nbsp;' + sample.city + '&nbsp;' + sample.address }}</el-radio>
                        </div>
                        <div class="layui-card-body">
                          <button class="layui-btn layui-btn-primary layui-btn-sm" id="canceladdress" @click="cancelSampleAddress">取消大货寄样</button>
                          <button class="layui-btn layui-btn-primary layui-btn-sm" id="sampleaddress" @click="showSample(1)">修改寄样地址</button>
                        </div>
                      </div>
                      <div class="layui-card-body" v-else>
                        <button class="layui-btn layui-btn-primary layui-btn-sm" id="sampleaddress" @click="showSample(0)">添加寄样地址</button>
                      </div>
                      <div class="layui-form-mid layui-word-aux">大货寄样：指成品大货直接发送到您指定的收货地址，同时额外寄送5个同批生产的成品样品给您，方便您及时查看成品大货的质量，<span class="red">配送方式为顺丰到付。</span></div>
                    </div>
                    <div v-else>
                      <div class="layui-form-mid layui-word-aux">数码品类不支持大货寄样。</div>
                    </div>
                  </div>
                </div>
                <el-dialog :visible.sync="hasVisibleSample" title="寄样地址" width="700px" @close="closeForm('sampleForm')">
                  <div style="padding: 0px 20px;">
                    <el-form ref="sampleForm" :model="sampleForm" :rules="rules" label-width="80px">
                      <el-form-item label="收货人" prop="consigneeName">
                        <el-input v-model="sampleForm.consigneeName"></el-input>
                      </el-form-item>
                      <el-form-item label="省市区" prop="countyId" style="margin-top: 20px">
                        <el-select v-model="sampleForm.provinceId" placeholder="请选择" style="width:180px" @change="selectSCity($event, 'province')">
                          <el-option style="padding-left: 15px" v-for="(item, index) in provinceList" :key="index" :label="item" :value="index + ''"> </el-option>
                        </el-select>
                        <el-select v-model="sampleForm.cityId" placeholder="请选择" style="width:180px" @change="selectSCity($event, 'city')">
                          <el-option style="padding-left: 15px" v-for="(item, index) in cityList" :key="index" :label="item" :value="sampleForm.provinceId + '_' + index"> </el-option>
                        </el-select>
                        <el-select v-model="sampleForm.countyId" placeholder="请选择" style="width:180px" @change="selectSCity($event, 'county')">
                          <el-option style="padding-left: 15px" v-for="(item, index) in countyList" :key="index" :label="item" :value="sampleForm.cityId + '_' + index"> </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="地址" prop="address" style="margin-top: 20px">
                        <el-input v-model="sampleForm.address" @input="sampleForm.address = sampleForm.address.replace(/\s+/g, '')"></el-input>
                      </el-form-item>
                      <el-form-item label="手机" prop="mobile" style="margin-top: 20px">
                        <el-input v-model="sampleForm.mobile"></el-input>
                      </el-form-item>
                      <el-form-item style="margin-top: 20px">
                        <el-button style="width: 95px;height: 35px;" type="danger" @click="handlerSubmitSample">立即提交</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-dialog>
              </li>
              <li class="billLi">
                <h3 class="ordok_h3">发货人信息</h3>
                <div class="adresBox">
                  <div class="layui-col-md12">
                    <div class="layui-card">
                      <div class="opt layui-form">
                        <div>
                          <p :class="isDefaultSender ? 'sender-name curr' : 'sender-name'" @click="cancelAllSenderDeafult" data-id="0">无</p>
                          <p :class="item.defaultTemp != 0 ? 'sender-name curr' : 'sender-name'" v-for="(item, index) in senderInfoList" :key="index + 3000" @click="setDefaultConsignees(item.id)">{{ item.senderName }}</p>
                        </div>
                        <div class="open_new">
                          <dl>
                            <dd>
                              <button class="layui-btn layui-btn-primary layui-btn-sm add-sender" @click="showSenderDetail">添加发货人信息</button>
                              <span class=" preview-sender" style="color: blue;margin-left: 10px;font-size: 10px;cursor:pointer" @click="dialogVisible02 = true">
                                查看示例
                              </span>
                            </dd>
                          </dl>
                          <el-dialog title="添加发货人信息" :visible.sync="hasVisibleSender" width="20%" center>
                            <el-input v-model="senderName" placeholder="请填写发货人信息"></el-input>
                            <span slot="footer" class="dialog-footer">
                              <el-button style="width: 95px;height: 35px;" @click="hasVisibleSender = false">取 消</el-button>
                              <el-button style="width: 95px;height: 35px;" type="danger" @click="saveSender">确 定</el-button>
                            </span>
                          </el-dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <h3 class="ordok_h3">合规性文件信息 <span class="red">*请上传公司营业执照，注册商标，条形码注册证</span></h3>
                <div class="adresBox">
                  <div class="layui-col-md12">
                    <div class="layui-card">
                      <div class="layui-card-body">
                        <div v-if="defaultDoc">
                          <div class="opt layui-form">
                            <el-radio>{{ defaultDoc.companyname }}</el-radio>
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

                <!-- {volist name="lists" id="data" key="k"} -->
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
                            <span class="red">￥ {{ ship.freight == undefined ? 0 : ship.freight }}</span>
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
                        <li v-if="activeTaxMoney > 0">
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
                          <td width="56%" class="selectLeft">
                            <span class="inline"><img class="goodImg" :src="cart.goodsCoverPath"/></span>
                            <span class="inline goodsName">
                              <h2 class="inline bule">{{ cart.goodsName }}</h2>
                              <br />
                              <input name="custom_name" class="layui-input" type="text" @change="changeCustomName($event, cart.id)" :value="cart.customName" placeholder="自定义产品名称(15字以内)，选填" />
                              {{ cart.goodsAttr }}
                            </span>
                          </td>
                          <td>x {{ cart.num }}</td>
                          <td>
                            <p class="totalPrice">￥{{ cart.goodsTotal }}</p>
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
                        <el-radio v-model="fileNormalization" label="1">允许拼一版对设计文件、刀模文件进行生产规范化修正（首次修改免费，<a href="" target="_brank" style="color:#0088cc">查看详情</a>）</el-radio> <br />
                        <el-radio style="margin-top: 10px" v-model="fileNormalization" label="0">不允许拼一版对设计文件、刀模文件进行任何修正</el-radio>
                      </div>
                    </div>
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
                          <button class="layui-btn layui-btn-primary layui-btn-sm add_invoice" data-val="common" @click="addNormalInvoice">添加增值普通发票</button>
                          <button class="layui-btn layui-btn-primary layui-btn-sm add_invoice" data-val="added" @click="addDedicatedInvoice">添加增值专用发票</button>
                          <button class="layui-btn layui-btn-primary layui-btn-sm manage_invoice" @click="invoiceListVisible = true">发票管理</button>
                        </div>
                        <div class="layui-form ">
                          <el-radio v-model="invoiceAddrRadio" label="1">【发票收件地址】等同于大货地址</el-radio>
                          <div v-if="activeInvoiceAddress != ''">
                            <el-radio v-model="invoiceAddrRadio" label="2">【发票收件地址】{{ activeInvoiceAddress }}</el-radio>
                            <button class="layui-btn layui-btn-primary layui-btn-sm" id="invoiceaddress" @click="invoiceAddrVisible = true">修改发票收件地址</button>
                          </div>
                          <div class="layui-card-body" v-else>
                            <el-button style="width: 140px; height: 35px;" class="layui-btn layui-btn-primary layui-btn-sm" @click="invoiceAddrVisible = true">添加发票收件地址</el-button>
                          </div>
                          <el-dialog :visible="invoiceAddrVisible" title="发票收件地址" width="700px" @close="invoiceAddrVisible = false">
                            <div style="padding: 0px 20px;">
                              <el-form ref="dialogForm" :model="dialogForm" :rules="rules" label-width="80px">
                                <el-form-item label="收件人" prop="contacts">
                                  <el-input v-model="dialogForm.contacts"></el-input>
                                  <label style="color: #f00; font-size: 12px;">* 请填写实名，国家规定收件人实名制，否则后果自负</label>
                                </el-form-item>
                                <el-form-item label="省市区" prop="countyId" style="margin-top: 20px">
                                  <el-select v-model="dialogForm.provinceId" placeholder="请选择" style="width:180px" @change="selectInvoiceCity($event, 'province')">
                                    <el-option style="padding-left: 15px" v-for="(item, index) in provinceList" :key="index" :label="item" :value="index + ''"> </el-option>
                                  </el-select>
                                  <el-select v-model="dialogForm.cityId" placeholder="请选择" style="width:180px" @change="selectInvoiceCity($event, 'city')">
                                    <el-option style="padding-left: 15px" v-for="(item, index) in cityList" :key="index" :label="item" :value="dialogForm.provinceId + '_' + index"> </el-option>
                                  </el-select>
                                  <el-select v-model="dialogForm.countyId" placeholder="请选择" style="width:180px" @change="selectInvoiceCity($event, 'county')">
                                    <el-option style="padding-left: 15px" v-for="(item, index) in countyList" :key="index" :label="item" :value="dialogForm.cityId + '_' + index"> </el-option>
                                  </el-select>
                                </el-form-item>
                                <el-form-item label="地址" prop="address" style="margin-top: 20px">
                                  <el-input v-model="dialogForm.address" @input="dialogForm.address = dialogForm.address.replace(/\s+/g, '')"></el-input>
                                </el-form-item>
                                <el-form-item label="手机" prop="mobile" style="margin-top: 20px">
                                  <el-input v-model="dialogForm.mobile"></el-input>
                                </el-form-item>
                                <el-form-item style="margin-top: 20px">
                                  <el-button style="width: 95px;height: 35px;" type="danger" @click="handlerDialogSubmit">立即提交</el-button>
                                </el-form-item>
                              </el-form>
                            </div>
                          </el-dialog>
                        </div>
                      </div>
                      <div class="layui-card-body" v-else>
                        <button class="layui-btn layui-btn-primary layui-btn-sm" id="no_invoice">暂不开发票</button>
                        <button class="layui-btn layui-btn-primary layui-btn-sm add_invoice" data-val="common" @click="addNormalInvoice">添加增值普通发票</button>
                        <button class="layui-btn layui-btn-primary layui-btn-sm add_invoice" data-val="added" @click="addDedicatedInvoice">添加增值专用发票</button>
                        <button class="layui-btn layui-btn-primary layui-btn-sm manage_invoice" @click="invoiceListVisible = true">发票管理</button>
                      </div>
                    </div>
                  </div>
                </div>
                <user-invoice-dialog :visible="invoiceVisible" :invoiceType="iName" @handleClick="clickInvoice" @close="closeInvoiceVisible"></user-invoice-dialog>
                <user-invoice-list-dialog :activeVisible="invoiceListVisible" @addInvoice="openInvoiceDialog" @close="closeInvoiceList" @updateInvoice="getOrderGoodInfo"></user-invoice-list-dialog>
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
                    ><span class="cartMoney">{{ orderGoodInfo.totalAmount }}</span
                    >元</span
                  >
                </li>
                <li>
                  <label>运费：</label>
                  <span class="val red">{{ orderGoodInfo.totalShipfee }}元</span>
                </li>
                <li v-show="sample.id != 0">
                  <label>寄样费用：</label>
                  <span class="val red">
                    <font>顺丰到付</font>
                  </span>
                </li>
                <li v-if="activeTaxMoney > 0">
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
      <el-dialog title="面单示例" :visible="dialogVisible02" width="420px" :before-close="handleClose02">
        <img src="@/static/index/img/users_sender_template.png" />
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import {
  getOrderGoodsInfoList,
  saveOrupdateAddress,
  getAddressByUid,
  getMiniAddress,
  saveMiniAddress,
  modifyMiniAddress,
  deleteMiniAddress,
  getSenderInfoAll,
  saveSenderInfo,
  setSenderDefault as setConsigneesDefault,
  commitOrder
} from '../../api/cart/cartCheckOrderApi';
import { getDefault, updateDefault, saveOrUpdate as docSaveOrUpdate } from '@/api/users/userComDocumentsApi';
import { getProvince, getCity, getAreaId, getAreaName } from '@/utils/city';
import UserDocumentDialog from './userDocumentDialog/index';
import UserDocumentList from './userDocumentList/index';
import { getInvoiceDefault, saveOrUpdate as updateInvoice } from '@/api/users/userInvoiceApi';
import { getInvoiceAddressByUid, updateInvoiceAddr, addInvocieAddr } from '@/api/users/userInvoiceAddressApi';
import UserInvoiceDialog from './userInvoiceDialog/index';
import UserInvoiceListDialog from './userInvoiceListDialog/index';
import { formatDateSecond } from '@/utils/timeUtil';
import { getUserBonusList } from '@/api/users/userBonusApi';
import { update as updateCartName } from '@/api/cart/cartApi';
import { objectElmentEmpty, replaceAll, objectEmpty } from '@/utils/objectUtil';

export default {
  name: 'CheckOrder',
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
    // 发票地址
    activeInvoiceAddress: function() {
      if (objectElmentEmpty(this.invoiceAddressInfo)) {
        return '';
      }
      let address = this.invoiceAddressInfo.contacts + ' ' + this.invoiceAddressInfo.mobile + ' ' + this.invoiceAddressInfo.city + ' ' + this.invoiceAddressInfo.address;
      address = address === undefined ? '' : address;
      return replaceAll(address, 'undefined', '');
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
    activeDefaultSender: function() {
      let ser = this.senderInfoList.filter(function(sender) {
        return sender.defaultTemp == 1;
      });
      if (ser == undefined || ser.length <= 0) {
        return 0;
      } else {
        return ser[0].id;
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
        // console.log(cartList);
        cartList.forEach(cart => {
          let info = { cartId: cart.id, customName: cart.customName == null ? '' : cart.customName };
          data.list.push(info);
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
      let total = this.orderGoodInfo.totalAmount + this.orderGoodInfo.totalShipfee - this.activeBonusMoney;
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
      tempSearchAddrList: [],
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
      // 收货地址id
      hasSampleAddress: false,
      optionAddressId: '',
      isSample: true,
      sample: { id: 0, contacts: '', uid: '', city: '', address: '', mobile: '', isuse: 0 },
      hasVisibleSample: false,
      sampleForm: { province: '', city: '', county: '', provinceId: '', cityId: '', countyId: '', mobile: '' },
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
      // 是否存在默认
      isInvoiceModifity: true,
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
      isCart: '1',
      // 提交锁
      confirmLock: false,
      dialogVisible02: false
    };
  },
  created() {
    this.isMakeUp = this.$route.query.type;
    this.isCart = this.$route.query.isCart == undefined ? '1' : this.$route.query.isCart;
    this.getMyAddress();
    this.provinceList = getProvince();
    this.getSampleAddress();
    this.getSenderInfo();
    this.getDefaultDoc();
    this.getOrderGoodInfo();
    this.getDefaultInvoiceInfo();
    this.getInvoiceAddr();
    this.getBonusList();
    // this.getUserBonusCount();
  },
  methods: {
    ...{ formatDateSecond, objectElmentEmpty, replaceAll },
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
    selectSCity(val, type) {
      if (type === 'province') {
        this.$set(this.sampleForm, 'cityId', '');
        this.$set(this.sampleForm, 'countyId', '');
        this.$set(this, 'cityList', getCity(this.sampleForm.provinceId));
        this.$set(this, 'countyList', []);
      } else if (type === 'city') {
        this.$set(this.sampleForm, 'countyId', '');
        this.$set(this, 'countyList', getCity(this.sampleForm.cityId));
      }
    },
    selectInvoiceCity(val, type) {
      if (type === 'province') {
        this.$set(this.dialogForm, 'cityId', '');
        this.$set(this.dialogForm, 'countyId', '');
        this.$set(this, 'cityList', getCity(this.dialogForm.provinceId));
        this.$set(this, 'countyList', []);
      } else if (type === 'city') {
        this.$set(this.dialogForm, 'countyId', '');
        this.$set(this, 'countyList', getCity(this.dialogForm.cityId));
      }
    },
    selectAddress(addressId) {
      this.updateDefaultAddress({ id: addressId });
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
    getSampleAddress() {
      // console.log('------------');
      getMiniAddress().then(res => {
        let sm = res.data;
        if ((sm != null) & (sm != '')) {
          this.hasSampleAddress = true;
          this.sample = sm;
        } else {
          this.sample = { id: 0, contacts: '', uid: '', city: '', address: '', mobile: '', isuse: 0 };
          this.hasSampleAddress = false;
        }
      });
    },
    // 修改大货寄样地址
    modifySampleAddress() {
      if (this.sample != '') {
        // console.log(this.sample);
        modifyMiniAddress(this.sample).then(res => {
          // console.log(res.data);
          this.getSampleAddress();
        });
      }
    },
    // 删除大货寄样地址
    cancelSampleAddress() {
      if (this.sample != '') {
        deleteMiniAddress(this.sample).then(res => {
          this.$message({ type: 'success', message: '取消成功' });
          this.getSampleAddress();
          this.hasSampleAddress = false;
        });
      }
    },
    // 保存大货寄样地址
    saveSampleAddress() {
      if (this.sample != '') {
        saveMiniAddress(this.sample).then(res => {
          // console.log(res.data);
          this.getSampleAddress();
        });
      }
    },
    showSample(condition) {
      if (condition == 0) {
        this.$set(this, 'sampleForm', {});
      } else {
        let city = this.sample.city.split('-');
        if (city.length === 3) {
          let provinceId = getAreaId('province', city[0]);
          let cityId = getAreaId('city', city[1], provinceId);
          this.$set(this.sampleForm, 'provinceId', provinceId);
          this.$set(this.sampleForm, 'cityId', cityId);
          this.cityList = getCity(provinceId);
          this.$set(this.sampleForm, 'countyId', getAreaId('county', city[2], cityId));
          this.countyList = getCity(cityId);
          this.$set(this.sampleForm, 'consigneeName', this.sample.contacts);
          this.$set(this.sampleForm, 'address', this.sample.address);
          this.$set(this.sampleForm, 'mobile', this.sample.mobile);
        }
      }
      this.hasVisibleSample = true;
    },
    handlerSubmitSample() {
      const formName = 'sampleForm';
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.sampleForm.provinceId) {
            this.$message({ type: 'error', message: '请选择省份' });
            return false;
          } else if (!this.sampleForm.cityId) {
            this.$message({ type: 'error', message: '请选择市' });
            return false;
          } else if (!this.sampleForm.countyId) {
            this.$message({ type: 'error', message: '请选择地区' });
            return false;
          }
          this.sampleForm.province = getAreaName('province', this.sampleForm.provinceId);
          this.sampleForm.city = getAreaName('city', this.sampleForm.cityId);
          this.sampleForm.county = getAreaName('county', this.sampleForm.countyId);
          this.sample.city = this.sampleForm.province + '-' + this.sampleForm.city + '-' + this.sampleForm.county;
          this.sample.address = this.sampleForm.address;
          this.sample.mobile = this.sampleForm.mobile;
          this.sample.contacts = this.sampleForm.consigneeName;
          if (this.hasSampleAddress) {
            modifyMiniAddress({ data: this.sample }).then(() => {
              this.$message({ type: 'success', message: '修改成功' });
              this.hasVisibleSample = false;
              this.closeForm(formName);
              this.getSampleAddress();
            });
          } else {
            saveMiniAddress({ data: this.sample }).then(() => {
              this.$message({ type: 'success', message: '保存成功' });
              this.hasVisibleSample = false;
              this.closeForm(formName);
              this.getSampleAddress();
            });
          }
        }
      });
    },
    goUserAddress() {
      this.$router.push('/user/userAddressList');
    },
    // 获取发货人信息
    getSenderInfo() {
      // console.log('获取发货人信息');
      getSenderInfoAll().then(res => {
        this.senderInfoList = res.data;
      });
    },
    setDefaultConsignees(senderId) {
      if (senderId != undefined && senderId != null) {
        let data = { id: senderId };
        // console.log(data);
        setConsigneesDefault(data).then(res => {
          if (res.code === '000000') {
            this.getSenderInfo();
            this.isDefaultSender = false;
            this.$message({ type: 'success', message: '设置成功' });
            this.getOrderGoodInfo();
          } else {
            this.$message({ type: 'error', message: '设置失败' });
          }
        });
      } else {
        this.$message({ type: 'error', message: '设置失败' });
      }
    },
    showSenderDetail() {
      this.senderName = '';
      this.hasVisibleSender = true;
    },
    saveSender() {
      let data = { senderName: this.senderName, defaultTemp: 1, id: 0, userId: 0 };
      saveSenderInfo({ data: data }).then(() => {
        this.hasVisibleSender = false;
        this.getSenderInfo();
        this.$message({ type: 'success', message: '保存成功' });
      });
    },
    // 取消所有默认的
    cancelAllSenderDeafult() {
      this.isDefaultSender = true;
      this.senderInfoList.forEach(item => {
        item.defaultTemp = 0;
      });
      this.$message({ type: 'success', message: '设置成功' });
    },
    // 获取默认用户资质
    getDefaultDoc() {
      getDefault()
        .then(res => {
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
      // console.log('test');
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
    getOrderGoodInfo() {
      // console.log('------ data --------');
      let data = { isMakeUp: this.activeIsMarkup, isFrom: this.isCart == '1' ? 0 : 1 };
      // console.log(data);
      let arr = '';
      getOrderGoodsInfoList(data).then(res => {
        // console.log(res.data);
        if (res.code == '000000') {
          // console.log('-------------- order goods -------------------');
          console.log('9999', res.data);
          let sys = res.data.shippingModeVos[0].miniCartList;
          console.log('sys', sys);
          res.data.shippingModeVos[0].miniCartList = sys.map(item => {
            item.goodsAttr = item.goodsAttr.replace( new RegExp('cross3','g'), '跨三面贴窗');
            item.goodsAttr = item.goodsAttr.replace( new RegExp('cross2','g'), '跨二面贴窗');
            item.goodsAttr = item.goodsAttr.replace( new RegExp('cross','g'), '单面贴窗');
            return item;
          });

          //   this.orderGoodInfo = res.data;
          this.$set(this, 'orderGoodInfo',res.data);

          // let shippingModeVos = this.orderGoodInfo.shippingModeVos;
          this.shipLength = this.orderGoodInfo.shippingModeVos.length;
          // 默认选中第一种快递
          for (var i = 0; i < this.shipLength; i++) {
            this.$set(this.curList, i, 0);
            this.$set(this.curShipList, i, this.orderGoodInfo.shippingModeVos[i].orderShippingInfo[0]);
          }
          this.calcTotalShipfee();
          // console.log(this.orderGoodInfo.shippingModeVos[0].orderShippingInfo[this.curSelectedShipping]);
        } else {
          this.$message({ type: 'error', message: res.message });
          this.$router.push('/cart/index');
        }
      });
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
      // console.log(this.curShipList);
    },
    // 获取默认发票
    getDefaultInvoiceInfo() {
      getInvoiceDefault({})
        .then(res => {
          if (res.code === '000000') {
            this.invoiceInfo = res.data;
            if (this.invoiceInfo) {
              if (this.invoiceInfo.invoiceType === 1) {
                this.getOrderGoodInfo();
              }
            }
          }
          // console.log(this.invoiceInfo);
        })
        .catch(() => {
          // console.log('');
        });
    },
    getInvoiceAddr() {
      getInvoiceAddressByUid({}).then(res => {
        // console.log(res);
        if (res.code === '000000') {
          this.invoiceAddressInfo = res.data[0];
          if (this.invoiceAddressInfo) {
            this.isInvoiceModifity = true;
            // this.showDialog();
          } else {
            this.invoiceAddressInfo = {};
            this.isInvoiceModifity = false;
          }
        } else if (res.code === '999999') {
          console.log(res.message);
        }
      });
    },
    updateInvoiceAddress() {
      updateInvoiceAddr(this.invoiceAddressInfo).then(() => {
        this.getInvoiceAddr();
        this.$message({ type: 'success', message: '更新地址成功' });
      });
    },
    // 添加发票收货地址
    addInvocieAddress() {},
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
      console.log('---------------');
      this.invoiceListVisible = false;
      this.invoiceVisible = true;
      this.iName = '0';
    },
    // 保存或更新发票地址
    handlerDialogSubmit() {
      const formName = 'dialogForm';
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.dialogForm.provinceId) {
            this.$message({ type: 'error', message: '请选择省份' });
            return false;
          } else if (!this.dialogForm.cityId) {
            this.$message({ type: 'error', message: '请选择市' });
            return false;
          } else if (!this.dialogForm.countyId) {
            this.$message({ type: 'error', message: '请选择地区' });
            return false;
          }
          this.dialogForm.province = getAreaName('province', this.dialogForm.provinceId);
          this.dialogForm.city = getAreaName('city', this.dialogForm.cityId);
          this.dialogForm.county = getAreaName('county', this.dialogForm.countyId);
          let userInvoiceAddress = this.invoiceAddressInfo;
          let addrForm = this.dialogForm;
          if (!userInvoiceAddress) {
            userInvoiceAddress = {};
          }
          userInvoiceAddress['city'] = addrForm.province + '-' + addrForm.city + '-' + addrForm.county;
          userInvoiceAddress['address'] = addrForm.address;
          userInvoiceAddress['mobile'] = addrForm.mobile;
          userInvoiceAddress['contacts'] = addrForm.contacts;
          if (this.isInvoiceModifity) {
            updateInvoiceAddr({ data: userInvoiceAddress }).then(() => {
              this.$message({ type: 'success', message: '修改成功' });
              this.closeForm(formName);
              this.invoiceAddrVisible = false;
              this.getInvoiceAddr();
            });
          } else {
            addInvocieAddr({ data: userInvoiceAddress }).then(() => {
              this.$message({ type: 'success', message: '保存成功' });
              this.closeForm(formName);
              this.invoiceAddrVisible = false;
              this.getInvoiceAddr();
            });
          }
        }
      });
    },
    // 发票地址
    showDialog() {
      console.log(this.invoiceAddressInfo);
      if (this.invoiceAddressInfo) {
        let city = this.invoiceAddressInfo.city.split('-');
        // console.log(city);
        if (city.length === 3) {
          let provinceId = getAreaId('province', city[0]);
          let cityId = getAreaId('city', city[1], provinceId);
          this.$set(this.dialogForm, 'provinceId', provinceId);
          this.$set(this.dialogForm, 'cityId', cityId);
          this.cityList = getCity(provinceId);
          this.$set(this.dialogForm, 'countyId', getAreaId('county', city[2], cityId));
          this.countyList = getCity(cityId);
          this.$set(this.dialogForm, 'contacts', this.invoiceAddressInfo.contacts);
          this.$set(this.dialogForm, 'address', this.invoiceAddressInfo.address);
          this.$set(this.dialogForm, 'mobile', this.invoiceAddressInfo.mobile);
        }
      }
    },
    getBonusList() {
      getUserBonusList({ status: '1', pageNumber: this.pageNumber, pageSize: this.pageSize }).then(res => {
        // debugger;
        this.$set(this, 'bonusList', res.data);
        this.$set(this, 'totalCount', res.totalCount);
        console.log('this.bonusList', this.bonusList);
        this.wsyCount = res.totalCount;
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
    changeCustomName($event, cartId) {
      // 获取到当前输入框的输入值
      let newCustName = $event.srcElement.value;
      // console.log(newCustName);
      // console.log(cartId);
      if (newCustName.length > 15) {
        this.$message({ type: 'error', message: '字数在15个以内' });
      } else {
        updateCartName({ id: cartId, customName: newCustName }).then(res => {
          if (res.code === '000000') {
            this.getOrderGoodInfo();
          }
          console.log(res.message);
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
        formShippingItemVoList: this.activeFromShippingItemVoList,
        // 发票地址id
        invoiceAddressId: invoiceAddressId,
        // 发票id
        invoiceId: invoiceId,
        // 是否规范化处理
        isEdit: this.fileNormalization,
        // 备注
        memo: this.memo,
        oldSn: '',
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
    handleClose02(done) {
      done();
      this.dialogVisible02 = false;
    }
  }
};
</script>
<style>
.layui-btn {
  font-family: '微软雅黑' !important;
}
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
.el-radio__input.is-checked + .el-radio__label {
  color: #666;
}
</style>
<style scoped src="../../static/index/css/shopping.css"></style>
<style scoped src="../../static/assets/layui/css/layui.css" media="all"></style>
<style scoped src="../../static/index/css/magic-check.css"></style>
<style scoped src="../../static/index/css/base.css"></style>
<style scoped src="../../static/index/css/common.css"></style>
<style scoped src="../../static/index/user/css/all.css" />
