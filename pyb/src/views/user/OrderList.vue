<template>
  <div>
    <el-main>
      <!--right-->
      <div class="useMainRt">
        <!--搜索条件-->
        <div class="uSbox">
          <form class="flex uSbox_form">
            <div class="uSboxL">
              <ul>
                <li>
                  <span class="uSboxL_tx">订单号：</span>
                  <div class="uSboxL_v">
                    <input type="text" name="order_id" v-model="queryCondition.orderNo" />
                  </div>
                </li>
                <li>
                  <span class="uSboxL_tx">收货人：</span>
                  <div class="uSboxL_v">
                    <input type="text" name="consignee_name" v-model="queryCondition.consigneeName" />
                  </div>
                </li>
                <li>
                  <span class="uSboxL_tx">订单状态：</span>
                  <div class="uSboxL_v">
                    <select name="order_status" v-model="queryCondition.status">
                      <option value="">-- 全部 --</option>
                      <option value="1">-- 待付款 --</option>
                      <option value="2">-- 待确认 --</option>
                      <option value="5">-- 待发货 --</option>
                      <option value="3">-- 已发货 --</option>
                      <option value="4">-- 已取消 --</option>
                    </select>
                  </div>
                </li>
                <li>
                  <span class="uSboxL_tx">付款方式：</span>
                  <div class="uSboxL_v">
                    <select name="pay_type" v-model="queryCondition.payType">
                      <option value="">-- 全部 --</option>
                      <option value="1">-- 支付宝 --</option>
                      <option value="2">-- 微信 --</option>
                      <option value="3">-- 余额 --</option>
                      <option value="4">-- 其它 --</option>
                    </select>
                  </div>
                </li>
              </ul>
              <ul>
                <li>
                  <span class="uSboxL_tx">付款状态：</span>
                  <div class="uSboxL_v">
                    <select name="pay_status" v-model="queryCondition.isPay">
                      <option value="-1">-- 全部 --</option>
                      <option value="1">-- 已支付 --</option>
                      <option value="0">-- 待支付 --</option>
                    </select>
                  </div>
                </li>
                <li class="dateIput">
                  <span class="uSboxL_tx"> 下单时间：</span>
                  <el-date-picker size="mini" type="datetime" v-model="queryCondition.createTime" placeholder="开始时间"></el-date-picker>
                  <span class="uSboxL_tx">-</span>
                  <el-date-picker size="mini" type="datetime" v-model="queryCondition.endTime" placeholder="结束时间"></el-date-picker>
                </li>
              </ul>
            </div>
            <div class="uSboxR">
              <el-button icon="el-icon-search" @click="getAllOrder(queryCondition.status)">搜索 </el-button>
              <!-- s -->
            </div>
          </form>
        </div>
        <div class="useOr_box">
          <ul class="use_tabs">
            <li :class="{ curr: queryCondition.status == '' }">
              <a href="javascript:;" @click="getAllOrder('')">所有订单<span v-text="orderNum.all"></span></a>
            </li>
            <li :class="{ curr: queryCondition.status == '1' }">
              <a href="javascript:;" @click="getAllOrder('1')">待付款<span v-text="orderNum.nopaid"></span></a>
            </li>
            <li :class="{ curr: queryCondition.status == '2' }">
              <a href="javascript:;" @click="getAllOrder('2')">待确认<span v-text="orderNum.orderDone"></span></a>
            </li>
            <li :class="{ curr: queryCondition.status == '5' }">
              <a href="javascript:;" @click="getAllOrder('5')">待发货<span v-text="orderNum.paid"></span></a>
            </li>
            <li :class="{ curr: queryCondition.status == '3' }">
              <a href="javascript:;" @click="getAllOrder('3')">已发货<span v-text="orderNum.shipped"></span></a>
            </li>
          </ul>
          <div class="use_listBox">
            <span class="recheckbox" v-if="queryCondition.status === '1' && allOrderData.length > 0">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            </span>
            <el-checkbox-group v-model="checkList" @change="handleCheckedOrderChange">
              <ul class="close" v-for="order in allOrderData" :key="order.id">
                <ol class="flex itemListT">
                  <p>
                    <span class="recheckbox" v-if="queryCondition.status === '1'">
                      <el-checkbox :label="order.orderNo" :key="order.orderNo"><br /></el-checkbox>
                    </span>
                    <span
                      >订单号：<router-link :to="'/user/orderdetail?orderNo=' + order.orderNo">{{ order.orderNo }}</router-link></span
                    >
                    <span
                      >下单时间：{{ order.createTime }} &nbsp;&nbsp;&nbsp; 收货人：{{ order.consigneeName }}
                      <template v-if="order.einvoice != '' && order.einvoice != null">
                        <el-tooltip class="item" effect="light" placement="top-start">
                          <template slot="content">
                            <div class="EattrMtips" v-html="order.einvoice">{{ order.einvoice }}</div>
                          </template>
                          <span v-if="order.einvoice" style="color: red">发票信息</span>
                        </el-tooltip>
                      </template>
                    </span>
                  </p>
                  <p class="red">
                    <span class="numberTatle" style="margin-left: 5px; color: #ff5241" v-if="order.invoiceExprNum != '' && order.invoiceExprNum != null"
                      >发票：
                      <a v-if="order.invoiceExprType === 0">顺丰快递：</a>
                      <a v-else>京东快递:：</a>
                      <a v-text="order.invoiceExprNum"></a
                    ></span>
                    <span class="numberTatle" style="margin-left: 5px; color: #ff5241" v-else v-text="order.invoiceNote"></span>
                  </p>
                </ol>
                <ol class="itemListZ">
                  <span class="t1">货品规格</span>
                  <span class="t2">文件</span>
                  <span class="t3">货品金额</span>
                  <span class="t4">数量</span>
                  <span class="t5">订单金额</span>
                  <span class="t6">订单状态</span>
                  <span class="t7">交易操作</span>
                  <span class="t8">其它</span>
                </ol>
                <li class="ttBox">
                  <div class="itemaBox">
                    <div class="itema" v-for="(orderInfo, index) in order.children" :key="orderInfo.id">
                      <div class="s1">
                        <dl class="flex orderInfoDL">
                          <dt class="DLimg"><img v-bind:src="orderInfo.coverPath" /><span style="display: none" v-text="index"></span></dt>
                          <dd class="orderInfo_t">
                            <h6>
                              <!-- <a href="/user/orderdetail" target="_blank"> -->
                              <router-link :to="{ path: '/user/orderdetail', query: { orderNo: order.orderNo } }" target="_blank">
                                <span v-if="!orderInfo.customName" v-text="orderInfo.name"></span>
                                <span v-else v-text="orderInfo.customName"></span>
                              </router-link>

                              <!-- </a> -->
                            </h6>
                            <p class="orderInfo_tC C9" title="" v-text="orderInfo.goodsAttr"></p>

                            <span v-if="orderInfo.goodsId != 1546 && orderInfo.goodsId != 1547 && orderInfo.goodsId != 1548 && orderInfo.goodsId != 1549 && orderInfo.goodsId != 1550">
                              <p class="red stime">生产货期：{{ orderInfo.day * 24 }}小时 ({{ orderInfo.day }}天)</p>

                              <p class="red ytime">预计发货时间：{{ orderInfo.outTime }}</p>
                            </span>
                            <div class="flagDv curr" v-if="orderInfo.sortAdaptive > 0">
                              <i></i><span>适配盒型:<a v-if="orderInfo.sortAdaptive === 1">主体</a><a v-else>次体</a></span>
                              <p></p>
                              <span>适配编码:</span>
                              <p></p>
                              <span v-text="orderInfo.adaptive"></span>
                              <p></p>
                              <div v-if="orderInfo.proofConfirmTime != null && orderInfo.proofConfirmTime != ''">
                                <span>适配确认时间:</span>
                                <p></p>
                                <span v-text="orderInfo.proofConfirmTime"></span>
                              </div>
                            </div>
                          </dd>
                        </dl>
                      </div>
                      <div class="s2" v-if="orderInfo.postatus != 'stoped'">
                        <span v-if="orderInfo.goodsId === 959">
                          <div>
                            <span v-if="orderInfo.orderDocumentsInfo[0].fileUrl != '' && orderInfo.orderDocumentsInfo[0].fileUrl != null">
                              <span v-if="orderInfo.orderDocumentsInfo[0].docStatus === 3"> <span class="gree">部件1已上传</span><br /> </span>
                              <span v-else> <a v-bind:href="downloadOrView(encodeUrlSpecial(orderInfo.orderDocumentsInfo[0].fileUrl))" target="_blank" class="lookBnt">[查看部件1文件]</a><br /> </span>
                            </span>
                            <div class="s2div" v-else>
                              <span class="gree">部件1未上传</span><br />
                              <el-upload
                                class="uploadCompanyimg1s"
                                :headers="headers"
                                action="/api/consumer/order/miniSupplierOrders/updatePdfFile"
                                :data="{ orderDocId: orderInfo.id, folder: 'uploads/file', orderNo: order.orderNo, isPdf: 1 }"
                                :before-upload="beforeUpload"
                                :on-success="(response, file, fileList) => uploadSuccess(response, file, fileList, order.orderNo)"
                                :on-error="uploadError"
                                accept=".pdf,.ai,.cdr,.psd,.eps,.dxf,.jpg,.tiff,.png,.gif,.zip"
                              >
                                <el-button size="small" type="primary" class="pass-portrait-filebtn-1025 filesBnt" style="margin-top: 6px">点击上传</el-button>
                              </el-upload>
                            </div>
                          </div>
                          <div>
                            <span v-if="orderInfo.orderDocumentsInfo[1].fileUrl != '' && orderInfo.orderDocumentsInfo[1].fileUrl != null">
                              <span v-if="orderInfo.orderDocumentsInfo[1].docStatus === 3"> <span class="gree">部件2已上传</span><br /> </span>
                              <span v-else> <a v-bind:href="downloadOrView(encodeUrlSpecial(orderInfo.orderDocumentsInfo[1].fileUrl))" target="_blank" class="lookBnt">[查看部件2文件]</a><br /> </span>
                            </span>
                            <div class="s2div" v-else>
                              <span class="gree">部件2未上传</span><br />
                              <el-upload
                                class="uploadCompanyimg1s"
                                :headers="headers"
                                action="/api/consumer/order/miniSupplierOrders/updatePdfFile"
                                :data="{ orderDocId: orderInfo.id, folder: 'uploads/file', orderNo: order.orderNo }"
                                :before-upload="beforeUpload"
                                :on-success="(response, file, fileList) => uploadSuccess(response, file, fileList, order.orderNo)"
                                :on-error="uploadError"
                                accept=".pdf,.ai,.cdr,.psd,.eps,.dxf,.jpg,.tiff,.png,.gif,.zip"
                              >
                                <el-button size="small" type="primary" class="pass-portrait-filebtn-1025 filesBnt" style="margin-top: 6px">点击上传</el-button>
                              </el-upload>
                            </div>
                          </div>
                        </span>
                        <span v-else>
                          <span v-if="orderInfo.orderDocumentsInfo[0].fileUrl != '' && orderInfo.orderDocumentsInfo[0].fileUrl != null">
                            <template v-if="orderInfo.orderDocumentsInfo[0].docStatus === 2">
                              <span class="gree">{{ orderInfo.orderDocumentsInfo[0].docDesc }}</span>
                              <el-upload
                                class="uploadCompanyimg1s"
                                :headers="headers"
                                action="/api/consumer/order/miniSupplierOrders/updatePdfFile"
                                :data="{ orderDocId: orderInfo.id, isPdf: 1, folder: 'uploads/file', orderNo: order.orderNo }"
                                :before-upload="beforeUpload"
                                :on-success="(response, file, fileList) => uploadSuccess(response, file, fileList, order.orderNo)"
                                :on-error="uploadError"
                                accept=".pdf,.ai,.cdr,.psd,.eps,.dxf,.jpg,.tiff,.png,.gif,.zip"
                              >
                                <el-button size="small" type="primary" class="pass-portrait-filebtn-1025 filesBnt" style="margin-top: 6px">点击上传</el-button>
                              </el-upload>
                            </template>
                            <span v-else-if="orderInfo.orderDocumentsInfo[0].docStatus === 3"> <span class="gree">文件已上传</span><br /> </span>
                            <span v-else>
                              <a :href="downloadOrView(encodeUrlSpecial(orderInfo.orderDocumentsInfo[0].fileUrl))" download target="_blank" class="lookBnt">[查看上传文件] </a><br />
                              <a v-if="orderInfo.orderDocumentsInfo[0].patoneFile" :href="downloadOrView(encodeUrlSpecial(orderInfo.orderDocumentsInfo[0].patoneFile))" target="_blank" class="lookBnt">[查看设计稿图片] </a><br />
                              <div v-if="orderInfo.orderDocumentsInfo[0].fileUrl.lastIndexOf('.cdr') > -1 && !orderInfo.orderDocumentsInfo[0].patoneFile" style="margin-top: -18px">
                                <el-button class="pass-portrait-filebtn-1025 filesBnt" size="small" style="margin: 5px 0" @click="upcdrimg(orderInfo.id, order.orderNo)">上传设计稿图片</el-button>
                                <p style="color: #cc0101">*CDR文件因软件版本差异可能存在显示不统一的情况，为保证生产正确性需再上传jpg/png图片格式的设计稿。</p>
                              </div>
                            </span>
                          </span>
                          <div class="s2div" v-else>
                            <span class="gree">未上传</span>
                            <el-upload
                              class="uploadCompanyimg1"
                              :headers="headers"
                              action="/api/consumer/order/miniSupplierOrders/updatePdfFile"
                              :data="{ orderDocId: orderInfo.id, isPdf: 1, folder: 'uploads/file', orderNo: order.orderNo }"
                              :before-upload="beforeUpload"
                              :on-success="(response, file, fileList) => uploadSuccess(response, file, fileList, order.orderNo)"
                              :on-error="uploadError"
                              accept=".pdf,.ai,.cdr,.psd,.eps,.dxf,.jpg,.tiff,.png,.gif,.zip"
                            >
                              <el-button size="small" type="primary" class="pass-portrait-filebtn-1025 filesBnt" style="margin-top: 6px">点击上传</el-button>
                            </el-upload>
                          </div>
                        </span>
                      </div>
                      <div class="s3">
                        <b v-text="orderInfo.price"></b>
                      </div>
                      <div class="s4" v-text="orderInfo.num"></div>
                    </div>
                  </div>
                  <div class="s5">
                    <b class="red" v-if="order.bonusUseType === 1">{{ order.amount }}</b>
                    <b class="red" v-else>{{ (order.amount*100 - order.bonusMoney*100)/100 }}</b>
                    <p class="C9">(含运费{{ order.shippingFee }})</p>
                  </div>
                  <div class="s6">
                    <p v-if="order.status === 'nopaid'">未支付</p>
                    <span v-else-if="order.status === 'paid' && order.confirmTime < 1">
                      <span v-if="order.adaptiveInfo != '' && order.adaptiveInfo != null">
                        <p v-if="(order.adaptiveInfo.confirmTime == '' || order.adaptiveInfo.confirmTime == 0) && (order.adaptiveInfo.expressNo === '' || order.adaptiveInfo.expressNo === null)">打样适配中</p>
                        <span v-else-if="(order.adaptiveInfo.confirmTime == '' || order.adaptiveInfo.confirmTime == 0) && order.adaptiveInfo.expressNo != '' && order.adaptiveInfo.expressNo != null">
                          <div class="spayBnt">
                            <a
                              href="javascript:;"
                              @click="
                                dialogConfirmFormVisible = true;
                                orderSn = order.adaptiveInfo.orderSn;
                              "
                              >确认适配</a
                            >
                          </div>
                        </span>
                        <p v-else>待确认</p>
                      </span>
                      <p v-else>待确认</p>
                    </span>
                    <p v-else-if="order.status === 'paid' && order.confirmTime > 1 && order.status != 'shipped'">待发货</p>
                    <p v-else-if="order.status === 'shipped'">已发货</p>
                    <p v-else-if="order.status === 'cancel'">已取消</p>
                    <p v-else-if="order.status === 'stoped'">已终止</p>
                    <span v-else></span>
                  </div>
                  <div class="s7">
                    <span v-if="order.status === 'nopaid'">
                      <span v-if="order.payaction === 'yes'">
                        <div class="spayBnt" v-if="order.invoiceType === 0">
                          <a @click="toPayOrder(order)" target="_blank">付款</a>
                        </div>
                        <div class="spayBnt" v-else>
                          <a @click="toPayOrder(order)" target="_blank">付款</a>
                        </div>
                      </span>
                      <a href="javascript:;" class="consurlOrder" v-else>订单已失效</a><br />
                      <a href="javascript:;" @click="cancelUserOrder(order.orderNo)">取消订单</a>
                    </span>
                    <span v-if="order.hasRefundStatus === 0">
                      <div class="spayBnt" v-if="order.canRefund === 'can'">
                        <a href="javascript:;" @click="showOrderRefundPop(order.orderNo)" class="wbb1201Modify1">退款申请</a>
                      </div>
                    </span>
                    <div class="spayBnt" v-else-if="order.hasRefundStatus === 1">
                      <a href="javascript:;">退款审核中</a>
                    </div>
                    <div class="spayBnt" v-else-if="order.hasRefundStatus === 2">
                      <a href="javascript:;">退款审核中</a>
                    </div>
                    <div class="spayBnt" v-else-if="order.hasRefundStatus === 3">
                      <a href="javascript:;">退款处理中</a>
                    </div>
                    <div class="spayBnt" v-else-if="order.hasRefundStatus === 4">
                      <a href="javascript:;">已退款</a>
                    </div>
                  </div>
                  <div class="s8">
                    <router-link class="s8as" :to="{ path: '/user/orderdetail', query: { orderNo: order.orderNo } }" target="_blank">订单详情</router-link>
                    <div class="amount finishOrder finishOrder01" v-if="order.canOrder > 0">
                      <a target="_blank" @click="repurchase(order.orderNo)">一键翻单</a>
                    </div>
                  </div>
                </li>
              </ul>
            </el-checkbox-group>
            <div class="gotherBnt" v-if="queryCondition.status === '1' && allOrderData.length > 0">
              <el-button type="danger" plain @click="mergeCommit">合并订单付款</el-button>
            </div>
          </div>
          <div class="w_page_0528" style="padding: 30px 0">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="totalCount"
              :page-size="pageSize"
              :current-page="pageNumber"
              :hide-on-single-page="true"
              @current-change="getPageData"
              @prev-click="getPageData"
              @next-click="getPageData"
            ></el-pagination>
          </div>
        </div>
      </div>
      <!--main end-->
      <el-dialog title="订单退款" :visible.sync="dialogVisible" :before-close="handleClose" width="35%" top="20px" close-on-press-escape :center="true">
        <div class="row">
          <div class="layui-form-item">
            <label class="layui-form-label">退款原因</label>
            <div class="layui-input-block">
              <input v-model="moe" lay-verify="title" autocomplete="off" placeholder="输入退款原因" class="layui-input" type="text" />
            </div>
          </div>
          <div class="layui-form-item">
            <div class="layui-input-block">
              <button class="layui-btn addsubmit" @click="orderRefund(orderNo)">立即提交</button>
              <button type="button" class="btn btn-default" data-dismiss="modal" @click="cancel">取消</button>
            </div>
          </div>
        </div>
      </el-dialog>
    </el-main>
    <!--dialog start-->
    <div>
      <div
        v-show="dialogConfirmFormVisible"
        class="sweet-alert showSweetAlert visible"
        data-custom-class=""
        data-has-cancel-button="true"
        data-has-confirm-button="true"
        data-allow-outside-click="false"
        data-has-done-function="true"
        data-animation="pop"
        data-timer="null"
        style="display: block; margin-top: -192px"
      >
        <div class="sa-icon sa-error" style="display: none">
          <span class="sa-x-mark">
            <span class="sa-line sa-left"></span>
            <span class="sa-line sa-right"></span>
          </span>
        </div>
        <div class="sa-icon sa-warning pulseWarning" style="display: block">
          <span class="sa-body pulseWarningIns"></span>
          <span class="sa-dot pulseWarningIns"></span>
        </div>
        <div class="sa-icon sa-info" style="display: none"></div>
        <div class="sa-icon sa-success" style="display: none">
          <span class="sa-line sa-tip"></span>
          <span class="sa-line sa-long"></span>

          <div class="sa-placeholder"></div>
          <div class="sa-fix"></div>
        </div>
        <div class="sa-icon sa-custom" style="display: none"></div>
        <h2>确认大货适配打样操作声明！</h2>
        <p style="display: block">尊敬的客户：请您认真检查样品盒型适配效果, 一旦确认适配效果后，非傲彩原因产生的适配问题概不受理,请您确保已经一 一仔细确认。</p>
        <fieldset>
          <input type="text" tabindex="3" placeholder="" />
          <div class="sa-input-error"></div>
        </fieldset>
        <div class="sa-error-container">
          <div class="icon">!</div>
          <p>Not valid!</p>
        </div>
        <div class="sa-button-container">
          <button class="cancel" tabindex="2" style="display: inline-block; box-shadow: none" @click="dialogConfirmFormVisible = false">否，返回再次查看确认</button>
          <button class="confirm" tabindex="1" style="display: inline-block; background-color: rgb(236, 108, 98); box-shadow: rgba(236, 108, 98, 0.8) 0px 0px 2px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset" @click="orderDone">
            是的，我已确认无误
          </button>
        </div>
      </div>
    </div>
    <!--dialog end-->

    <el-dialog title="上传设计稿图片" :visible.sync="sdrdialog" center>
      <div style="padding: 50px 150px">
        <el-upload
          class="avatar-uploader"
          ref="upload"
          action="/api/consumer/order/miniSupplierOrders/updatePdfFile"
          :headers="headers"
          :data="{ orderDocId: cdrid, folder: 'uploads/file', orderNo: ordernum, isPdf: 3 }"
          :show-file-list="false"
          :on-change="cdrPreview"
          :on-success="sdrSuccess"
          :before-upload="sdrUpload"
          :auto-upload="false"
          accept=".jpg,.png"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <p style="margin-top: 30px"><span class="red">*</span>CDR文件因软件版本差异可能存在显示不统一的情况，为保证生产正确性需再上传jpg/png图片格式的设计稿。</p>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="sdrdialog = false">取 消</el-button>
        <el-button type="primary" @click="$refs.upload.submit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { adaptationOrder } from '@/api/users/userDemandApi';
import { saveOrdersRepurchase } from '@/api/cart/cartApi';
import { cancelOrder, updateName } from '@/api/order/orderApi';
import { createOrder } from '@/api/order/orderTogetherApi';
import { createOrderRefund } from '@/api/order/orderRefundApi';
import { getAllSupplierOrder, queryOrderClassify } from '@/api/order/supplierOrdersApi';
import { ACCESS_TOKEN } from '@/store/global-constant';
import { mapActions } from 'vuex';
import { encodeUrlSpecial, downloadOrView } from '@/utils/order/baseEncodeUrl';

export default {
  components: {},
  inject: ['reload'], //注入reload方法
  data() {
    return {
      headers: {
        token: localStorage.getItem(ACCESS_TOKEN),
        Authorization: localStorage.getItem(ACCESS_TOKEN)
      },
      orderNum: {},
      allOrderData: [],
      queryCondition: {
        orderNo: '',
        consigneeName: '',
        status: '',
        payType: '',
        isPay: -1,
        createTime: '',
        endTime: ''
      },
      pageNumber: 0,
      pageSize: 6,
      totalCount: 0,
      moe: '',
      orderNo: '',
      dialogVisible: false,
      dialogConfirmFormVisible: false,
      orderSn: '',
      baseUrl: 'http://alifile.xiaocaiyin.com/',
      // 合并支付
      checkList: [],
      // 全选
      checkAll: false,
      isIndeterminate: false,
      imageUrl: '',
      sdrdialog: false,
      cdrid: '',
      ordernum: ''
    };
  },
  created() {
    this.queryClassify();
    this.getAllOrder('', 0, 6);
  },
  methods: {
    ...{ encodeUrlSpecial, downloadOrView },
    ...mapActions(['Login', 'SmsLogin', 'Logout']),
    getPageData(page) {
      this.getAllOrder(this.queryCondition.status, page, 6);
      this.backTop();
    },
    queryClassify() {
      queryOrderClassify({})
        .then(res => {
          var _this = this;
          if (res.code === '000000') {
            this.$set(this, 'orderNum', res.data);
          } else {
            _this.$message({
              type: 'error',
              message: res.message
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getAllOrder(status, pageNumber, pageSize) {
      const loading = this.$loading({
        lock: true,
        text: '加载中～',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      if (status != '') {
        this.queryCondition.status = status;
      } else {
        this.queryCondition.status = '';
      }
      const reqParam = {
        pageNumber: pageNumber < 1 ? 0 : pageNumber,
        pageSize: pageSize < 1 ? 6 : pageSize,
        orderNo: this.queryCondition.orderNo,
        status: this.queryCondition.status + '',
        payType: this.queryCondition.payType + '',
        consigneeName: this.queryCondition.consigneeName,
        createTime: this.queryCondition.createTime,
        isPay: this.queryCondition.isPay,
        endTime: this.queryCondition.endTime
      };
      getAllSupplierOrder(reqParam)
        .then(res => {
          console.log('res', res);
          loading.close();
          var _this = this;
          let arr = '';
          if (res.code === '000000') {
            console.log('allOrderData退款记录', res.data);
            // 贴窗折线距离视图呈现
            arr = res.data.map(item => {
              item.children.map(e => {
                e.goodsAttr = e.goodsAttr.replace( new RegExp('cross3','g'), '跨三面贴窗');
                e.goodsAttr = e.goodsAttr.replace( new RegExp('cross2','g'), '跨二面贴窗');
                e.goodsAttr = e.goodsAttr.replace( new RegExp('cross','g'), '单面贴窗');
                // console.log('跨二面贴窗', e.goodsAttr);
                return e;
              });
              return item;
            });
            this.$set(this, 'allOrderData', arr);
            this.pageNumber = res.pageNumber;
            this.pageSize = res.pageSize;
            this.totalCount = res.totalCount;
            // console.log(res.data);
          } else {
            _this.$message({
              type: 'error',
              message: res.message
            });
          }
        })
        .catch(err => {
          loading.close();
          console.log(err);
        });
    },
    //上传文件的判断
    beforeUpload(file) {
      var fileName = file.name;
      const reg = /\.(pdf|ai|cdr|psd|eps|dxf|jpg|tiff|png|gif|zip)$/;
      const extension = reg.test(fileName);
      const isLt2M = file.size / 1024 / 1024 <= 200;
      if (!extension) {
        this.$message({ type: 'error', message: "上传文件格式只能是 'pdf','ai','cdr','psd','eps','dxf','jpg','tiff', 'png', 'gif', 'zip'" });
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 200MB!');
      }
      return extension && isLt2M;
    },
    //上传成功的方法
    uploadSuccess(response, file, fileList, order) {
      if (response.code === '000000') {
        this.$alert('如您文件内容与下单选项有差异，请务必联系客服或写明订单备注，如无联系或备注，直接按照文件处理生产，不承担任何差异责任。', '保存成功', {
          confirmButtonText: '我知道了'
        }).then(() => {
          console.log('');
        });
        if (file.name.lastIndexOf('.cdr') > -1) {
          this.sdrdialog = true;
          this.ordernum = order;
        }
        this.getAllOrder(this.queryCondition.status, 0, 6);
      } else {
        this.$message({
          type: 'error',
          message: response.message
        });
      }
    },
    //上传失败执行的方法
    uploadError(err, file, fileList) {
      this.$message({
        type: 'error',
        message: err
      });
    }, //一键 翻单 重新购买
    repurchase(orderNo) {
      var reqparam = {
        orderNo: orderNo
      };
      saveOrdersRepurchase(reqparam)
        .then(res => {
          if (res.success) {
            // this.$message({
            //   type: 'success',
            //   message: '执行成功 购物车id[' + res.data + ']'
            // });
            this.$router.push({ path: '/order/requrchaseOrder' });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    upcdrimg(id, o) {
      console.log('upcdrimgid', id);
      console.log('upcdrimgo', o);
      this.cdrid = id;
      this.sdrdialog = true;
      this.ordernum = o;
      this.imageUrl = '';
    },
    cdrPreview(file) {
      console.log('file', file);
      var fileName = file.name;
      const reg = /\.(jpg|png)$/;
      const extension = reg.test(fileName);
      const isLt2M = file.size / 1024 / 1024 <= 200;
      if (!extension) {
        this.$message({ type: 'error', message: "上传文件格式只能是 'jpg','png'" });
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 200MB!');
      }
      if (extension && isLt2M) {
        this.imageUrl = URL.createObjectURL(file.raw);
      }
    },
    sdrSuccess(response, file, fileList) {
      console.log('上传成功', file);
      if (response.success) {
        this.$message({
          type: 'success',
          message: '上传成功'
        });
        this.sdrdialog = false;
        this.getAllOrder(this.queryCondition.status, 0, 6);
      } else {
        this.$message({
          type: 'error',
          message: response.message
        });
      }
    },
    sdrUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1);
      const whiteList = ['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG'];
      if (whiteList.indexOf(fileSuffix) === -1) {
        this.$message.error('上传图片只能是 jpg、png格式', 'error');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20MB!');
      }
      return isLt2M && whiteList.indexOf(fileSuffix) > -1;
    },
    // orderRefund(orderNo) {
    //   if (this.moe === null || this.moe === '') {
    //     this.$message({ type: 'error', message: '退款原因不能为空' });
    //   }
    //   var reqparam = {
    //     orderNo: orderNo,
    //     moe: this.moe,
    //     orderType: 1
    //   };
    //   createOrderRefund(reqparam)
    //     .then(res => {
    //       if (res.success) {
    //         this.$message({ type: 'success', message: '退款申请已提交客服处理，请耐心等待' });
    //         this.dialogVisible = false;
    //         this.moe = '';
    //         this.getAllOrder(this.queryCondition.status, 0, 6);
    //       } else {
    //         this.$message({ type: 'error', message: res.message });
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },    // orderRefund(orderNo) {
    //   if (this.moe === null || this.moe === '') {
    //     this.$message({ type: 'error', message: '退款原因不能为空' });
    //   }
    //   var reqparam = {
    //     orderNo: orderNo,
    //     moe: this.moe,
    //     orderType: 1
    //   };
    //   createOrderRefund(reqparam)
    //     .then(res => {
    //       if (res.success) {
    //         this.$message({ type: 'success', message: '退款申请已提交客服处理，请耐心等待' });
    //         this.dialogVisible = false;
    //         this.moe = '';
    //         this.getAllOrder(this.queryCondition.status, 0, 6);
    //       } else {
    //         this.$message({ type: 'error', message: res.message });
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },
    //退款申请弹窗
    showOrderRefundPop(orderNo) {
      // console.log('orderNo:' + orderNo);
      this.orderNo = orderNo;
      // this.dialogVisible = true;
      this.$prompt('', '订单退款', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入退款原因'
        // center: true
      })
        .then(({ value }) => {
          if (value === null || value === '') {
            this.$message({ type: 'error', message: '退款原因不能为空' });
            return false;
          }
          var reqparam = {
            orderNo: orderNo,
            moe: value,
            orderType: 1
          };
          createOrderRefund(reqparam)
            .then(res => {
              if (res.success) {
                this.$message({ type: 'success', message: '退款申请已提交客服处理，请耐心等待' });
                this.dialogVisible = false;
                this.moe = '';
                this.getAllOrder(this.queryCondition.status, 0, 6);
              } else {
                this.$message({ type: 'error', message: res.message });
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    handleClose(done) {
      this.moe = '';
      done();
    },
    cancel() {
      this.dialogVisible = false;
      this.moe = '';
    },
    cancelUserOrder(orderNo) {
      this.$confirm('是否取消该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var param = {
            orderNo: orderNo
          };
          cancelOrder(param)
            .then(res => {
              if (res.code === '000000') {
                this.$message({
                  type: 'success',
                  message: res.message
                });
                this.getAllOrder(this.queryCondition.status, 0, 6);
              } else {
                this.$message({
                  type: 'error',
                  message: res.message
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    orderDone() {
      console.log(this.orderSn);
      var param = {
        orderSn: this.orderSn
      };
      adaptationOrder(param)
        .then(res => {
          if (res.code === '000000') {
            this.$message({
              type: 'success',
              message: '适配成功'
            });
            this.getAllOrder(this.queryCondition.status, 0, 6);
            this.dialogConfirmFormVisible = false;
          } else {
            this.$message({
              type: 'error',
              message: res.message
            });
            this.dialogConfirmFormVisible = false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 去付款
    toPayOrder(order) {
      // console.log('order', order);
      let invoiceType = order.invoiceType;
      if (invoiceType === 1) {
        this.$router.push({ path: '/service/getinvoicepay', query: { orderNo: order.mainSn, paytype: 'normal' } });
      } else {
        this.$router.push({ path: '/service/getcylpay', query: { orderNo: order.mainSn, paytype: 'normal' } });
      }
    },
    // 合并支付
    mergeCommit() {
      console.log('checkbox', this.checkList);
      if (this.checkList.length < 2) {
        this.$message({
          type: 'error',
          message: '至少选择两个未支付订单'
        });
      } else {
        createOrder({ list: this.checkList })
          .then(res => {
            if (parseInt(res.data.invoiceType) == 1) {
              this.$router.push({ path: '/service/getinvoicepaytogether', query: { orderNo: res.data.orderNo, paytype: 'normal' } });
            } else {
              this.$router.push({ path: '/service/getcylpaytogether', query: { orderNo: res.data.orderNo, paytype: 'normal' } });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 合并支付
    handleCheckAllChange(val) {
      this.checkList = val ? this.getOrderList(this.allOrderData) : [];
      this.isIndeterminate = false;
    },
    handleCheckedOrderChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.allOrderData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allOrderData.length;
    },
    // 获取所有订单号
    getOrderList(orderList) {
      let orderIds = [];
      orderList.forEach(order => orderIds.push(order.orderNo));
      return orderIds;
    },
    // 回到顶部
    backTop() {
      window.scrollTo(0, 0);
    }
  }
};
</script>
<style src="../../static/index/user/css/reset.css" />
<style src="../../static/index/user/css/all.css" />
<style src="../../static/index/user/css/foot.css" />
<style src="../../static/index/user/css/main.css" />
<style src="../../static/agent/css/sweetalert.css" />
<style src="../../static/mulindex/css/fonts.css?v=202003051652" media="all" />
<style src="../../static/mulindex/css/public.css?v=202003051652" media="all" />
<style src="../../static/mulindex/css/user.css" media="all" />

<style scoped>
.layui-form-label {
  float: left;
  display: block;
  padding: 9px 15px;
  width: 90px;
  font-weight: 400;
  line-height: 20px;
  text-align: right;
}

.layui-input {
  display: block;
  width: 100%;
  padding-left: 10px;
  font-size: 12px;
  line-height: 38px;
  border-width: 1px;
  border-style: solid;
  background-color: #fff;
  border-radius: 2px;
  border-color: #e6e6e6;
}

button,
input,
optgroup,
option,
select,
textarea {
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  outline: 0;
}

.layui-btn {
  display: inline-block;
  height: 38px;
  line-height: 38px;
  padding: 0 65px;
  background-color: #009688;
  color: #fff;
  white-space: nowrap;
  text-align: center;
  font-size: 14px;
  border: none;
  border-radius: 2px;
  cursor: pointer;
}

.layui-form-item:after {
  content: '\20';
  clear: both;
  *zoom: 1;
  display: block;
  height: 0;
}

.layui-form-item {
  margin-bottom: 15px;
  clear: both;
  *zoom: 1;
}

.layui-input-block {
  margin-left: 120px;
  min-height: 36px;
}

.gotherBnt {
  width: 162px;
  height: 23px;
  line-height: 23px;
  font-size: 13px;
  color: #fff;
  background: linear-gradient(top, #f98838, #f97635);
  background: -webkit-linear-gradient(top, #f98838, #f97635);
  background: -moz-linear-gradient(top, #f98838, #f97635);
  border: 1px solid #f97635;
  border-radius: 2px;
  text-align: center;
  cursor: pointer;
  border: 0;
  margin: 0 auto;
  float: right;
}

.gotherBnt a {
  color: #fff;
}
.gotherBnt button {
  float: right;
}
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  text-indent: 0;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
