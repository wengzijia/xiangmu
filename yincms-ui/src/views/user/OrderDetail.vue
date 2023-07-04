<!-- fengjianbo -->
<template>
  <el-main>
    <div class="useMainRt">
      <div class="or_tipsT">
        <h5>友情提醒：</h5>
        <p>1、用CorelDRAW 软件设计的文件请导出PDF格式上传文件，否则CDR格式文件会延时处理，因CDR格式文件产生的质量问题由客户自行承担</p>
        <p>2、如您的设计文件中有"R"或"TM"的商标，请务必提供商标注册复印件和授权委托书（<router-link :to="'/news/detail?id=92'">样本</router-link>），以免耽误您订单印刷</p>
        <p>3、如您的设计文件中使用了三色或四色混合(浅灰、灰、深灰、黑)、暗红色、墨绿色、蓝紫色、深紫色、深褐色、咖啡色等，建议您先在本平台打样跟色，否则，出现色差平台概不负责。</p>
        <p>4、因为屏幕为RGB格式，印刷为CMYK格式，3D颜色仅供参考，不作为大货验收颜色。</p>
        <p>5、设计文件为CDR文件，因软件版本差异可能存在显示不统一的情况，为保证生产正确性需再上传jpg/png图片格式的设计稿用于校验。<router-link :to="'/uploads/editor/file/CDR_Tutorials.pdf'" target="_blank">查看教程</router-link></p>
      </div>
      <!--订单进度-->
      <div class="barBox" v-if="orderInfo.status != 'cancel'">
        <ul class="barBoxT">
          <li class="flex bFirst" v-if="orderInfo.status === 'nopaid'">
            <div class="barList a1">
              <h3>提交订单</h3>
              <div class="stepNo">1</div>
              <p v-text="orderInfo.createTime"></p>
            </div>
            <div class="barList a2">
              <h3>付款成功</h3>
              <div class="stepNo">2</div>
              <p></p>
            </div>
            <div class="barList a3">
              <h3>确认成功</h3>
              <div class="stepNo">3</div>
              <p></p>
            </div>
            <div class="barList a4">
              <h3>发货成功</h3>
              <div class="stepNo">4</div>
              <p></p>
            </div>
            <div class="barList a5">
              <h3>收货成功</h3>
              <div class="stepNo">5</div>
              <p></p>
            </div>
          </li>
          <li class="flex bTwo" v-if="orderInfo.status === 'paid' && (orderInfo.confirmTime === '' || orderInfo.confirmTime === null || orderInfo.confirmTime === 0)">
            <div class="barList a1">
              <h3>提交订单</h3>
              <div class="stepNo"></div>
              <p v-text="orderInfo.createTime"></p>
            </div>
            <div class="barList a2">
              <h3>付款成功</h3>
              <div class="stepNo">2</div>
              <p v-if="orderInfo.payTime != '' && orderInfo.payTime != null" v-text="formatSecond(orderInfo.payTime)"></p>
            </div>
            <div class="barList a3">
              <h3>确认成功</h3>
              <div class="stepNo">3</div>
              <p></p>
            </div>
            <div class="barList a4">
              <h3>发货成功</h3>
              <div class="stepNo">4</div>
              <p></p>
            </div>
            <div class="barList a5">
              <h3>收货成功</h3>
              <div class="stepNo">5</div>
              <p></p>
            </div>
          </li>
          <li class="flex bThre" v-else-if="orderInfo.status === 'paid' && orderInfo.confirmTime != ''">
            <div class="barList a1">
              <h3>提交订单</h3>
              <div class="stepNo"></div>
              <p v-text="orderInfo.createTime"></p>
            </div>
            <div class="barList a2">
              <h3>付款成功</h3>
              <div class="stepNo"></div>
              <p v-if="orderInfo.payTime != '' && orderInfo.payTime != null" v-text="formatSecond(orderInfo.payTime)"></p>
            </div>
            <div class="barList a3">
              <h3>确认成功</h3>
              <div class="stepNo">3</div>
              <p v-if="orderInfo.confirmTime != '' && orderInfo.confirmTime != null" v-text="formatSecond(orderInfo.confirmTime)"></p>
            </div>
            <div class="barList a4">
              <h3>发货成功</h3>
              <div class="stepNo">4</div>
              <p></p>
            </div>
            <div class="barList a5">
              <h3>收货成功</h3>
              <div class="stepNo">5</div>
              <p></p>
            </div>
          </li>
          <li class="flex bFour" v-if="orderInfo.status === 'shipped'">
            <div class="barList a1">
              <h3>提交订单</h3>
              <div class="stepNo"></div>
              <p v-text="orderInfo.createTime"></p>
            </div>
            <div class="barList a2">
              <h3>付款成功</h3>
              <div class="stepNo"></div>
              <p v-if="orderInfo.payTime != '' && orderInfo.payTime != null" v-text="formatSecond(orderInfo.payTime)"></p>
            </div>
            <div class="barList a3">
              <h3>确认成功</h3>
              <div class="stepNo"></div>
              <p v-if="orderInfo.confirmTime != '' && orderInfo.confirmTime != null" v-text="formatSecond(orderInfo.confirmTime)"></p>
            </div>
            <div class="barList a4">
              <h3>发货成功</h3>
              <div class="stepNo">4</div>
              <p v-if="orderInfo.shipTime != '' && orderInfo.shipTime != null" v-text="orderInfo.shipTime"></p>
            </div>
            <div class="barList a5">
              <h3>收货成功</h3>
              <div class="stepNo">5</div>
              <p></p>
            </div>
          </li>
          <li class="flex bFive" v-if="orderInfo.status === 'completed'">
            <div class="barList a1">
              <h3>提交订单</h3>
              <div class="stepNo"></div>
              <p v-text="orderInfo.createTime"></p>
            </div>
            <div class="barList a2">
              <h3>付款成功</h3>
              <div class="stepNo"></div>
              <p v-if="orderInfo.payTime != ''" v-text="orderInfo.payTime"></p>
            </div>
            <div class="barList a3">
              <h3>确认成功</h3>
              <div class="stepNo"></div>
              <p v-if="orderInfo.confirmTime != ''" v-text="orderInfo.confirmTime"></p>
            </div>
            <div class="barList a4">
              <h3>发货成功</h3>
              <div class="stepNo">4</div>
              <p v-if="orderInfo.shipTime != ''" v-text="orderInfo.shipTime"></p>
            </div>
            <div class="barList a5">
              <h3>收货成功</h3>
              <div class="stepNo">5</div>
              <p></p>
            </div>
          </li>
        </ul>
        <div class="ofBox" v-if="orderInfo.status === 'nopaid'">
          <h6>
            当前订单状态： <span class="org">下单成功</span>，请及时付款
            <a @click="toPayCheckorder" target="_blank" class="saveBtns saveImg1" style="left: 10px; width: 82px">立即付款</a>
          </h6>
        </div>
      </div>
      <!--订单信息-->
      <div class="infoBox">
        <div :class="switchTopShow == 0 ? 'infoBoxTop' : 'infoBoxTops'" @click="switchTopShow = 0"><a>订单详情</a></div>
        <div :class="switchTopShow == 1 ? 'infoBoxTop' : 'infoBoxTops'" @click="switchTopShow = 1"><a>订单进度</a></div>
        <div class="infoBox_cont">
          <template v-if="switchTopShow == 0">
            <ul class="flex inforUl">
              <li>
                <h3>基本信息</h3>
                <p class="inp">
                  <label class="inpL">订单号：</label>
                  <span class="inpR" v-text="orderInfo.orderNo"></span>
                </p>
                <p class="inp">
                  <label class="inpL">支付方式：</label>
                  <span class="inpR" v-if="orderInfo.payType === 'alipay'">支付宝</span>
                  <span class="inpR" v-else-if="orderInfo.payType === 'wxpay'">微信</span>
                  <span class="inpR" v-else>其它</span>
                </p>
                <p class="inp">
                  <label class="inpL">配送方式：</label>
                  <span class="inpR" v-text="orderInfo.shippingName"></span>
                </p>
                <p class="inp" v-if="orderInfo.shippingName != '工厂自提'">
                  <label class="inpL">收货地址：</label>
                  <span class="inpR">{{ orderInfo.consigneeName }} {{ orderInfo.mobile }} {{ orderInfo.province }} {{ orderInfo.city }} {{ orderInfo.county }} {{ orderInfo.address }} </span>
                </p>
                <p class="inp" v-if="orderInfo.shippingName == '工厂自提'">
                  <label class="inpL">提货人：</label>
                  <span class="inpR">{{ orderInfo.consigneeName }} {{ orderInfo.mobile }}</span>
                </p>
                <p class="inp" v-if="orderInfo.shippingName == '工厂自提'">
                  <label class="inpL">自提地址：</label>
                  <span class="inpR">广东省佛山市南海区里水镇麻奢拼一版档口(导航:傲彩产业园)</span>
                </p>
                <p class="inp">
                  <label class="inpL">订单备注：</label>
                  <span class="inpR" v-text="orderInfo.memo"></span>
                </p>
                <p class="inp">
                  <label class="inpL">发票：</label>
                  <span class="inpR"> </span>
                </p>
                <table class="Consignee_List" v-if="activeMiniInvocieExist">
                  <tr>
                    <td class="left_Consignee" style="width: 100px">发票类型</td>
                    <td class="right_Consignee" v-if="miniInvoiceVo.invoiceType === 1">增值税发票</td>
                    <td v-else>普通发票</td>
                  </tr>
                  <tr>
                    <td class="left_Consignee">发票抬头</td>
                    <td class="right_Consignee">{{ miniInvoiceVo.invoiceName }}</td>
                  </tr>
                  <tbody v-if="miniInvoiceVo.invoiceType === 1">
                    <tr>
                      <td class="left_Consi gnee">单位名称</td>
                      <td class="right_Consignee" v-text="miniInvoiceVo.invoiceName"></td>
                    </tr>
                    <tr>
                      <td class="left_Consignee">纳税人码</td>
                      <td class="right_Consignee" v-text="miniInvoiceVo.invoiceVo.invoiceCode"></td>
                    </tr>
                    <tr>
                      <td class="left_Consignee">注册地址</td>
                      <td class="right_Consignee" v-text="miniInvoiceVo.invoiceVo.invoiceAddress"></td>
                    </tr>
                    <tr>
                      <td class="left_Consignee">注册电话</td>
                      <td class="right_Consignee" v-text="miniInvoiceVo.invoiceVo.mobile"></td>
                    </tr>
                    <tr>
                      <td class="left_Consignee">开户银行</td>
                      <td class="right_Consignee" v-text="miniInvoiceVo.invoiceVo.invoiceBank"></td>
                    </tr>
                    <tr>
                      <td class="left_Consignee">银行账户</td>
                      <td class="right_Consignee" v-text="miniInvoiceVo.invoiceVo.invoiceBankcode"></td>
                    </tr>
                  </tbody>
                </table>
                <table class="Consignee_List" v-else>
                  <tr>
                    <td colspan="2">不开发票</td>
                  </tr>
                </table>
              </li>
              <li>
                <h3>合规文件</h3>
                <div class="compbox" v-if="miniComDocumentsVo != null">
                  <form action="" method="post" id="picform">
                    <div class="inp">
                      <template v-if="miniComDocumentsVo.companyname != null && miniComDocumentsVo.companyname != ''">
                        <label class="compLa">营业执照名称：</label>
                        <span class="disedTxt" v-text="miniComDocumentsVo.companyname"></span>
                        <input type="hidden" name="companyname" v-model="miniComDocumentsVo.companyname" />
                      </template>
                      <template v-else>
                        <label class="compLa">营业执照名称：</label>
                        <input type="text" class="compInput" name="companyname" v-model="companyName" />
                      </template>
                      <template v-if="(miniComDocumentsVo.companyimg != null && miniComDocumentsVo.companyimg != '') || (companyimg != null && companyimg != '')">
                        <span class="leftPic"
                          ><a :href="baseUrl + miniComDocumentsVo.companyimg" target="_blank"><img src="../../static/index/img/picture.png" /></a
                        ></span>
                        <input type="hidden" name="companyimg" v-text="miniComDocumentsVo.companyimg" />
                      </template>
                      <template v-else>
                        <p>
                          <span class="pass-portrait-openimg-1025">
                            <el-upload
                              class="uploadCompanyimg"
                              :headers="headers"
                              action="/api/consumer/user/miniComDocuments/uploadDocumentsFile"
                              :before-upload="beforeUploadImg"
                              :on-success="(response, file, fileList) => uploadImgSuccess('companyimg', response, file, fileList)"
                              :on-error="uploadError"
                              :data="uploadDocData"
                              accept=".png,.jpeg,.jpg,.gif,.bmp"
                            >
                              <el-button size="small" type="primary" class="filesBnt">上传文件</el-button>
                            </el-upload>
                          </span>
                        </p>
                      </template>
                    </div>
                    <div class="inp">
                      <template v-if="miniComDocumentsVo.brandname != null && miniComDocumentsVo.brandname != ''">
                        <label class="compLa">品牌名称：</label>
                        <span class="disedTxt" v-text="miniComDocumentsVo.brandname"></span>
                        <input type="hidden" name="brandname" v-model="miniComDocumentsVo.brandname" />
                      </template>
                      <template v-else>
                        <label class="compLa">品牌名称：</label>
                        <input type="text" class="compInput" name="brandname" v-model="brandName" />
                      </template>
                      <template v-if="(miniComDocumentsVo.brandimg != null && miniComDocumentsVo.brandimg != '') || (brandimg != null && brandimg != '')">
                        <span class="leftPic"
                          ><a v-for="(item, index) in miniComDocumentsVo.brandimg" :key="index" :href="baseUrl + item" target="_blank"><img src="../../static/index/img/picture.png" /></a
                        ></span>
                        <input type="hidden" name="brandimg" v-text="miniComDocumentsVo.brandimg" />
                      </template>
                      <template v-else>
                        <p>
                          <span class="pass-portrait-openimg-1025">
                            <el-upload
                              class="uploadBrandname"
                              :headers="headers"
                              action="/api/consumer/user/miniComDocuments/uploadDocumentsFile"
                              :before-upload="beforeUploadImg"
                              :on-success="(response, file, fileList) => uploadImgSuccess('brandimg', response, file, fileList)"
                              :on-error="uploadError"
                              :data="uploadDocData"
                              accept=".png,.jpeg,.jpg,.gif,.bmp"
                            >
                              <el-button size="small" type="primary" class="filesBnt">上传文件</el-button>
                            </el-upload>
                          </span>
                        </p>
                      </template>
                    </div>
                    <div class="inp">
                      <template v-if="miniComDocumentsVo.codename != null && miniComDocumentsVo.codename != ''">
                        <label class="compLa">条形码：</label>
                        <span class="disedTxt" v-text="miniComDocumentsVo.codename"></span>
                        <input type="hidden" name="codename" v-model="miniComDocumentsVo.codename" />
                      </template>
                      <template v-else>
                        <label class="compLa">条形码：</label>
                        <input type="text" class="compInput" name="codename" v-model="codeName" />
                      </template>
                      <template v-if="(miniComDocumentsVo.codeimg != null && miniComDocumentsVo.codeimg != '') || (codeimg != null && codeimg != '')">
                        <span class="leftPic"
                          ><a :href="baseUrl + miniComDocumentsVo.codeimg" target="_blank"><img src="../../static/index/img/picture.png" /></a
                        ></span>
                        <input type="hidden" name="codeimg" v-model="miniComDocumentsVo.codeimg" />
                      </template>
                      <template v-else>
                        <p>
                          <span class="pass-portrait-openimg-1025">
                            <el-upload
                              class="uploadCodename"
                              :headers="headers"
                              action="/api/consumer/user/miniComDocuments/uploadDocumentsFile"
                              :before-upload="beforeUploadImg"
                              :on-success="(response, file, fileList) => uploadImgSuccess('codeimg', response, file, fileList)"
                              :on-error="uploadError"
                              :data="uploadDocData"
                              accept=".png,.jpeg,.jpg,.gif,.bmp"
                            >
                              <el-button size="small" type="primary" class="filesBnt">上传文件</el-button>
                            </el-upload>
                          </span>
                        </p>
                      </template>
                    </div>
                    <div
                      class="inp"
                      v-if="
                        miniComDocumentsVo.companyname === null ||
                        miniComDocumentsVo.companyname === '' ||
                        miniComDocumentsVo.companyimg === null ||
                        miniComDocumentsVo.companyimg === '' ||
                        miniComDocumentsVo.brandname === null ||
                        miniComDocumentsVo.brandname === '' ||
                        miniComDocumentsVo.brandimg === null ||
                        miniComDocumentsVo.brandimg === '' ||
                        miniComDocumentsVo.codename === null ||
                        miniComDocumentsVo.codename === '' ||
                        miniComDocumentsVo.codeimg === null ||
                        miniComDocumentsVo.codeimg === ''
                      "
                    >
                      <input type="button" class="saveBtns saveImg1" style="background-color: #eee; border-color: #cacaca; color: #666" @click="addDocument" value="保存" />
                    </div>
                  </form>
                </div>
              </li>
            </ul>
            <template v-if="miniDiffOrder">
              <ul class="flex inforUl" v-for="diff in miniDiffOrder" :key="diff.id">
                <li>
                  <h3>补差价订单</h3>
                  <p class="inp">
                    <span class="inpL">差价单号：</span>
                    <span class="inpR" v-text="diff.orderNo"></span>
                  </p>
                  <p class="inp">
                    <span class="inpL">差价金额：</span>
                    <span class="inpR" v-text="diff.diffMoney"></span>
                  </p>
                  <p class="inp">
                    <span class="inpL">差价描述：</span>
                    <span class="inpR" v-text="diff.diffDesc"></span>
                  </p>
                  <p class="inp">
                    <span class="inpL">支付状态：</span>
                    <span class="inpR" v-if="diff.status === 'paid'"> 已支付 </span>
                    <span class="inpR red" v-else-if="diff.status === 'cancel'"> 已取消 </span>
                    <span class="red" v-else> 未支付 </span>
                  </p>
                  <p class="inp" v-if="diff.status != 'paid' && diff.status !== 'cancel'">
                    <span class="inpL"> <el-button size="mini" @click="toPayDiffOrder(diff.orderNo)">去付款</el-button></span>
                  </p>
                </li>
              </ul>
            </template>
            <div class="use_listBox">
              <ul class="detailds">
                <ol class="itemListZ">
                  <span class="t1">货品</span>
                  <span class="t2">文件</span>
                  <span class="t3">单价(元)</span>
                  <span class="t4">数量(个)</span>
                  <span class="t5">货品总价(元)</span>
                </ol>
                <li class="ttBox">
                  <div class="itemaBox">
                    <div class="itema" v-for="goods in orderGoods" :key="goods.id">
                      <div class="s1">
                        <dl class="flex orderInfoDL">
                          <dt class="DLimg"><img v-bind:src="goods.coverPath" /></dt>
                          <dd class="orderInfo_t">
                            <h6>
                              <a href="" target="_blank" v-if="!goods.customName" v-text="goods.name"> </a>
                              <a href="" target="_blank" v-else v-text="goods.customName"></a>
                            </h6>
                            <p class="orderInfo_tC C9" title="" v-text="goods.goodsAttr"></p>
                            <p class="red" v-if="goods.goodsId != 1546 && goods.goodsId != 1547 && goods.goodsId != 1548 && goods.goodsId != 1549 && goods.goodsId != 1550">生产货期：{{ goods.day * 24 }}小时 ({{ goods.day }}天)</p>
                          </dd>
                        </dl>
                      </div>
                      <div class="s2">
                        <div class="s2div">
                          <div v-if="goods.isOpenPreflight == '1'">
                            <el-button v-if="goods.reportIsOk == '1'" size="small" type="primary" class="filesBnt" @click="tolook(goods.reportId)">查看预检报告</el-button>
                            <span class="gree" v-if="goods.reportIsOk == '0'">预检完成</span>
                          </div>
                          <span v-if="goods.goodsId === 959">
                            <div v-for="(file, index) in goods.orderDocumentsInfo" :key="index + 1000">
                              <span v-if="file.fileUrl">
                                <span v-if="file.docStatus === 3">
                                  <span class="gree">部件{{ index + 1 }}已上传</span>
                                </span>
                                <span v-else>
                                  <a v-bind:href="downloadOrView(encodeUrlSpecial(file.fileUrl))" download target="_blank" class="lookBnt">[查看部件{{ index + 1 }}文件]</a>
                                </span>
                              </span>
                              <div class="s2div" v-else>
                                <span class="gree">部件{{ index + 1 }}未上传</span>
                                <el-upload
                                  class="uploadCompanyimg1"
                                  :headers="headers"
                                  action="/api/consumer/order/miniSupplierOrders/updatePdfFile"
                                  :data="uploadData(goods.id, 'uploads/file', orderInfo.orderNo, index)"
                                  :before-upload="beforeUpload"
                                  :on-success="(response, file, fileList) => uploadSuccess(response, file, fileList, goods.id)"
                                  :on-error="uploadError"
                                  accept=".pdf,.ai,.cdr,.psd,.eps,.dxf,.jpg,.tiff,.png,.gif,.zip"
                                >
                                  <el-button size="small" type="primary" class="pass-portrait-filebtn-1025 filesBnt" style="margin-top: 6px">点击上传</el-button>
                                  <!-- <div slot="tip" class="el-upload__tip">只能上传pdf文件</div> -->
                                </el-upload>
                              </div>
                            </div>
                          </span>
                          <span v-else>
                            <span v-if="goods.orderDocumentsInfo[0].fileUrl != '' && goods.orderDocumentsInfo[0].fileUrl != null">
                              <template v-if="goods.orderDocumentsInfo[0].docStatus === 2">
                                <span class="gree">{{ goods.orderDocumentsInfo[0].docDesc }}</span>
                                <el-upload
                                  class="uploadCompanyimg1"
                                  :headers="headers"
                                  action="/api/consumer/order/miniSupplierOrders/updatePdfFile"
                                  :data="{ orderDocId: goods.id, folder: 'uploads/file', orderNo: orderInfo.orderNo, isPdf: 1 }"
                                  :before-upload="beforeUpload"
                                  :on-success="(response, file, fileList) => uploadSuccess(response, file, fileList, goods.id)"
                                  :on-error="uploadError"
                                  accept=".pdf,.ai,.cdr,.psd,.eps,.dxf,.jpg,.tiff,.png,.gif,.zip"
                                >
                                  <el-button size="small" type="primary" class="pass-portrait-filebtn-1025 filesBnt" style="margin-top: 6px">点击上传</el-button>
                                </el-upload>
                              </template>
                              <span v-else-if="goods.orderDocumentsInfo[0].docStatus === 3"> <span class="gree">文件已上传</span> </span>
                              <span v-else>
                                <!-- <template v-if="goods.orderDocumentsInfo[0].fileUrl.lastIndexOf('.cdr')>-1">
                                  <el-upload
                                    class="uploadCompanyimg1"
                                    :headers="headers"
                                    action="/api/consumer/order/miniSupplierOrders/updatePdfFile"
                                    :data="{ orderDocId: goods.id, folder: 'uploads/file', orderNo: orderInfo.orderNo, isPdf: 1 }"
                                    :before-upload="beforeUpload"
                                    :on-success="uploadSuccess"
                                    :on-error="uploadError"
                                    accept=".pdf,.ai,.cdr,.psd,.eps,.dxf,.jpg,.tiff,.png,.gif,.zip"
                                  >
                                    <el-button size="small" type="primary" class="pass-portrait-filebtn-1025 filesBnt" style="margin-top:6px;">点击上传</el-button>
                                  </el-upload>
                                  </template> -->
                                <a :href="downloadOrView(encodeUrlSpecial(goods.orderDocumentsInfo[0].fileUrl))" download target="_blank" class="lookBnt">[查看上传文件]</a><br />
                                <el-button size="small" style="margin: 5px 0" v-if="goods.orderDocumentsInfo[0].fileUrl.lastIndexOf('.cdr') > -1 && !goods.orderDocumentsInfo[0].patoneFile" @click="upcdrimg(goods.id)">上传设计稿图片</el-button>
                              </span>
                            </span>
                            <div class="s2div" v-else>
                              <span class="gree">未上传</span>
                              <el-upload
                                class="uploadCompanyimg1"
                                :headers="headers"
                                action="/api/consumer/order/miniSupplierOrders/updatePdfFile"
                                :data="{ orderDocId: goods.id, folder: 'uploads/file', orderNo: orderInfo.orderNo, isPdf: 1 }"
                                :before-upload="beforeUpload"
                                :on-success="(response, file, fileList) => uploadSuccess(response, file, fileList, goods.id)"
                                :on-error="uploadError"
                                accept=".pdf,.ai,.cdr,.psd,.eps,.dxf,.jpg,.tiff,.png,.gif,.zip"
                              >
                                <el-button size="small" type="primary" class="pass-portrait-filebtn-1025 filesBnt" style="margin-top: 6px">点击上传</el-button>
                              </el-upload>
                            </div>
                          </span>
                          <!-- 折法示意图开始 -->
                          <template v-if="goods.goodsId == 957">
                            <template v-if="goods.orderDocumentsInfo[0].solaPng != null">
                              <div class="gree">折法示意图</div>
                              <div v-for="png in goods.orderDocumentsInfo[0].solaPngArray" :key="png">
                                <a v-bind:href="baseUrl + png" target="_blank">[查看示意图]</a>
                              </div>
                            </template>
                            <div v-if="goods.orderDocumentsInfo[0].solaTotal < 3" class="fileupload">
                              <el-upload
                                class="uploadCompanyimg"
                                style="justify-content: center; margin: 4px 0"
                                :headers="headers"
                                action="/api/consumer/order/miniSupplierOrders/updatePdfFile"
                                :data="{ orderDocId: goods.id, folder: 'uploads/file', orderNo: orderInfo.orderNo, isPdf: 1 }"
                                :before-upload="beforeUpload"
                                :on-success="(response, file, fileList) => uploadSuccess(response, file, fileList, goods.id)"
                                :on-error="uploadError"
                                accept=".pdf,.ai,.cdr,.psd,.eps,.dxf,.jpg,.tiff,.png,.gif,.zip"
                              >
                                <el-button size="small" type="primary" class="pass-portrait-filebtn-1025">上传折法示意图</el-button>
                              </el-upload>
                            </div>
                          </template>
                          <!-- 折法示意图结束 -->
                        </div>
                        <!--3D打样开始-->
                        <div class="s2div" v-if="goods.goodsTag != 6">
                          <span class="gree" v-if="goods.isEsko">3D打样:已生成</span>
                          <span class="gree" v-else>3D打样:生成中</span>
                          <p v-if="boxdisplay(goods.goodsTag)">
                            <span></span>
                          </p>
                          <p v-else>
                            <!-- <a href="javascript:;" class="rightBtn05 rightBtn01" @click="orderDone(goods.id, orderInfo.parentId, goods.supOrderId)">确认效果</a> -->
                            <a v-if="orderInfo.oldSn == '' && goods.isEsko > 0 && !goods.confirmTime" href="javascript:;" class="rightBtn05 rightBtn01" @click="orderDone(goods.id, orderInfo.parentId, goods.supOrderId)">确认效果</a>
                          </p>
                        </div>
                        <!--3D打样结束-->
                        <!--确认时间开始-->
                        <div class="s2div">
                          <div v-if="goods.confirmTime < 1"><span class="gree">文件未确认</span></div>
                          <div v-else>
                            <span class="gree"> 确认时间：</span>
                            <span class="gree" v-text="formatSecond(goods.confirmTime)"></span>
                          </div>
                          <div v-if="goods.goodsId != 1546 && goods.goodsId != 1547 && goods.goodsId != 1548 && goods.goodsId != 1549 && goods.goodsId != 1550">
                            <span class="gree"> 预计出货时间：</span>
                            <span class="gree" v-text="goods.outTime"></span>
                          </div>
                        </div>
                        <!--确认时间结束-->
                        <!--确认开始-->
                        <div class="s2div" v-if="goods.modifyDetail">
                          <div>
                            <a :href="fileUrl + encodeUrlSpecial(goods.modifyDetail.modifyDocument.pdfFile)" @click="lookFileStatus2(goods, 1)" target="_blank" class="rightBtn rightBtn01 viewcolor">查看文件</a>
                          </div>
                          <div>
                            <el-tooltip content="订单确认后无法撒回，请仔细确认" placement="bottom" effect="light">
                              <em class="guigeTis" style="margin-right: 3px"> ? </em>
                            </el-tooltip>
                            <a href="javascript:;" class="rightBtn05 rightBtn01" @click="modifyConfirm(goods)">确认效果</a>
                          </div>
                        </div>
                        <div class="s2div" v-else>
                          <!--确认pdf修改开始-->
                          <div v-if="goods.orderDocumentsInfo[0].isPrepressnotes == 1">
                            <a href="javascript:;" class="rightBtn rightBtn01" @click="prepressnotes(goods.orderDocumentsInfo[0].docId)">查看pdf修改</a>
                            <a href="javascript:;" class="rightBtn rightBtn01 nofile99" @click="warningPDF">查看文件</a>
                            <a href="javascript:;" class="rightBtn rightBtn01 nofile99" @click="warningPDF">查看3D视频</a>
                            <a href="javascript:;" class="rightBtn rightBtn01 nofile99" @click="warningPDF">确认效果</a>
                          </div>
                          <div v-else>
                            <div v-if="goods.goodsId == 959">
                              <!-- {{ goods.id }} -->
                              <div v-show="orderInfo.oldSn == '' && goods.isEsko > 0">
                                <div v-for="(file, index) in goods.orderDocumentsInfo" :key="index + 100">
                                  <a :href="fileUrl + encodeUrlSpecial(file.pdfFile)" target="_blank" class="rightBtn rightBtn01 viewcolor" @click="lookFileStatus(goods.id, 1)">查看部件{{ index + 1 }}</a>
                                  <div v-show="goods.isLook == 0 && file.threePdf != ''">
                                    <a href="javascript:;" class="rightBtn rightBtn01 nofile" @click="warning3D">部件{{ index + 1 }}_3D</a>
                                  </div>
                                  <div v-show="goods.isLook == 1">
                                    <div v-show="file.pngFile">
                                      <a :href="'/agent/base/threed?id=' + goods.id" class="rightBtn" target="_blank">部件{{ index + 1 }}_3D</a>
                                    </div>
                                    <div v-show="file.threePdf != ''">
                                      <!-- <a target="_blank" :href="'http://alifile.xiaocaiyin.com/'+file.threePdf" class="rightBtn rightBtn01 viewcolor" @click="lookFileStatus(goods.id, 2)">部件{{ index + 1 }}_3D</a> -->
                                      <a target="_blank" :href="fileUrl + encodeUrlSpecial(file.threePdf)" class="rightBtn rightBtn01 viewcolor" @click="lookFileStatus(goods.id, 2)">部件{{ index + 1 }}_3D</a>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="goods.confirmTime > 1 || goods.isLook == 2">
                                  <div v-if="goods.confirmTime < 1">
                                    <div>
                                      <el-tooltip content="订单确认后无法撒回，请仔细确认" placement="bottom" effect="light">
                                        <em class="guigeTis" style="margin-right: 3px"> ? </em>
                                      </el-tooltip>
                                      <a href="javascript:;" class="rightBtn05 rightBtn01" @click="orderDone(goods.id, orderInfo.parentId, goods.supOrderId)">确认效果</a>
                                    </div>
                                    <!-- <label class="rightBtn rightBtn01 hide">已确认</label> -->
                                  </div>
                                  <div v-else>
                                    <label class="rightBtn rightBtn01">已确认</label>
                                  </div>
                                  <!-- <div v-else>
                                    <label class="rightBtn rightBtn01">已确认</label>
                                    <div v-show="goods.isChe == 1">
                                      <a href="javascript:;" class="rightBtn rightBtn01 confirm_time_che" @click="cancelConfirmTime(goods.id)">确认撤回</a>
                                      <span class="gree"> 撤回剩余时间：</span>
                                      <span class="gree"> {{ goods.lessCheTime }}分钟</span>
                                    </div>
                                    </div> -->
                                </div>
                                <div v-else>
                                  <div>
                                    <el-tooltip content="订单确认后无法撒回，请仔细确认" placement="bottom" effect="light">
                                      <em class="guigeTis" style="margin-right: 3px"> ? </em>
                                    </el-tooltip>
                                    <a href="javascript:;" class="rightBtn05 rightBtn01 nofile" @click="warning3D">确认效果</a>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <!--吸塑确认开始-->
                            <div v-else-if="goods.goodsId == 962">
                              <div v-if="orderInfo.createtime < blisterCreateTime">
                                <div v-if="goods.confirmTime < 1">
                                  <div v-if="orderInfo.status == 'paid'">
                                    <a href="javascript:;" class="rightBtn rightBtn01" @click="orderDoneByxisu(goods.id, orderInfo.parentId, goods.supOrderId)">确认样品</a>
                                  </div>
                                </div>
                                <div v-else>
                                  <label class="rightBtn rightBtn01">已确认</label>
                                </div>
                              </div>
                              <div v-else>
                                <div v-if="goods.cacheConfirmTime < 1">
                                  <div v-if="(orderInfo.status == 'paid' || orderInfo.status == 'shipped') && goods.factorySample > 0">
                                    <div v-if="goods.isLook == 0">
                                      <a :href="fileUrl + encodeUrlSpecial(goods.orderDocumentsInfo[0].cutterUrl)" @click="lookFileStatus(goods.id, 1)" target="_blank" class="rightBtn rightBtn01 viewcolor">查看文件</a>
                                      <a href="javascript:;" class="rightBtn rightBtn01 nofile962" @click="warningFile">确认效果</a>
                                    </div>
                                    <div v-else-if="goods.isLook == 1">
                                      <a href="javascript:;" class="rightBtn rightBtn01" @click="orderDoneBymic(goods.id, orderInfo.parentId, goods.supOrderId)">确认样品</a>
                                      <a :href="fileUrl + encodeUrlSpecial(goods.orderDocumentsInfo[0].cutterUrl)" target="_blank" class="rightBtn rightBtn01 viewcolor">查看文件</a>
                                    </div>
                                  </div>
                                </div>
                                <div v-else>
                                  <a :href="fileUrl + encodeUrlSpecial(goods.orderDocumentsInfo[0].cutterUrl)" target="_blank" class="rightBtn rightBtn01 viewcolor">查看文件</a>
                                  <label class="rightBtn rightBtn01">已确认</label>
                                </div>
                              </div>
                            </div>
                            <!--精装盒确认开始-->
                            <div v-else-if="goods.goodsTag == 6">
                              <div v-if="orderInfo.createtime > hardcoverCreateTime">
                                <div v-if="goods.cacheConfirmTime < 1">
                                  <div v-if="orderInfo.status == 'paid'">
                                    <!-- <div v-if="goods.factorySample > 0"> -->
                                    <div>
                                      <!-- <a :href="fileUrl + encodeUrlSpecial(goods.orderDocumentsInfo[0].pdfFile)" @click="lookFileStatus(goods.id, 1)" target="_blank" class="rightBtn rightBtn01 viewcolor">查看文件</a> -->
                                      <!-- <div v-if="goods.isLook == 0">
                                        <div v-show="goods.orderDocumentsInfo[0].threePdf != ''"><a href="javascript:;" class="rightBtn rightBtn01 nofile" @click="warning3D">查看3D视频</a></div>
                                        </div> -->
                                      <!-- <div v-if="goods.isLook == 1">
                                        <div v-if="goods.orderDocumentsInfo[0].pngFile">
                                          <a :href="fileUrl + goods.id" class="rightBtn" target="_blank">查看3D</a>
                                        </div>
                                          <div v-if="goods.orderDocumentsInfo[0].threePdf != ''"> -->
                                      <!-- <a href="javascript:void(0);" class="rightBtn rightBtn01 nofile" @click="lookFileStatus(goods.id, 2,1)">查看3D视频</a> -->
                                      <!-- <a :href="fileUrl + encodeUrlSpecial(goods.orderDocumentsInfo[0].threePdf)" class="rightBtn rightBtn01 nofile" @click="lookFileStatus(goods.id, 2)" target="_blank">查看3D视频</a>
                                        </div>
                                        </div> -->
                                      <!-- <div v-if="goods.isLook == 1">
                                        <a :href="'http://192.168.1.222/' + encodeUrlSpecial(goods.orderDocumentsInfo[0].reportPng)" @click="lookFileStatus(goods.id, 1)" target="_blank" class="rightBtn rightBtn01 viewcolor">查看文件</a>
                                        <a href="javascript:;" class="rightBtn rightBtn01" @click="orderDoneBymic(goods.id, orderInfo.parentId, goods.supOrderId)">确认样品</a>
                                        <label class="rightBtn rightBtn01 hide">已确认</label>
                                        </div> -->

                                      <!-- <div v-else>
                                        <a href="javascript:;" class="rightBtn rightBtn01 nofile" @click="warning3D">确认效果</a>
                                        </div> -->
                                    </div>
                                  </div>
                                </div>
                                <div v-else>
                                  <label class="rightBtn rightBtn01">样品已确认</label>
                                </div>
                                <div v-if="goods.cacheConfirmTime && !goods.confirmTime && goods.orderDocumentsInfo[0].pdfFile" style="margin-top: 12px">
                                  <a :href="fileUrl + encodeUrlSpecial(goods.orderDocumentsInfo[0].pdfFile)" style="margin-bottom: 10px" @click="lookFileStatus(goods.id, 1)" target="_blank" class="rightBtn rightBtn01 viewcolor">查看文件</a>
                                  <a href="javascript:;" v-if="goods.hardcoverFollow" style="padding: 3px 14px" class="rightBtn05 rightBtn01" @click="orderDone(goods.id, orderInfo.parentId, goods.supOrderId)">确认文件</a>
                                </div>
                                <div v-if="goods.cacheConfirmTime && goods.confirmTime">
                                  <label class="rightBtn rightBtn01">文件已确认</label>
                                </div>
                              </div>
                            </div>
                            <div v-else>
                              <div v-if="orderInfo.oldSn == '' && goods.isEsko > 0">
                                <a :href="fileUrl + encodeUrlSpecial(goods.orderDocumentsInfo[0].pdfFile)" @click="lookFileStatus(goods.id, 1)" target="_blank" class="rightBtn rightBtn01 viewcolor">查看文件</a>
                                <div v-if="goods.isLook == 0 && goods.orderDocumentsInfo[0].threePdf != ''">
                                  <a href="javascript:;" class="rightBtn rightBtn01 nofile" @click="warning3D">查看3D视频</a>
                                </div>
                                <div v-else>
                                  <div v-if="goods.orderDocumentsInfo[0].pngFile">
                                    <a :href="'/agent/base/threed?id=' + goods.id" class="rightBtn" target="_blank">查看3D</a>
                                  </div>
                                  <div v-if="goods.orderDocumentsInfo[0].threePdf != ''">
                                    <!-- <a href="javascript:void(0);" @click="lookFileStatus(goods.id, 2,1)" class="rightBtn rightBtn01 viewcolor">查看3D视频</a> -->
                                    <a :href="fileUrl + encodeUrlSpecial(goods.orderDocumentsInfo[0].threePdf)" class="rightBtn rightBtn01 nofile" @click="lookFileStatus(goods.id, 2)" target="_blank">查看3D视频</a>
                                    <!-- <el-dialog
                                      title=""
                                      :visible.sync="VideoVisible"
                                      width="50%"
                                      :before-close="handleClose">
                                      <video width="100%" height="100%" controls autoplay>
                                        <source :src="fileUrl + encodeUrlSpecial(goods.orderDocumentsInfo[0].threePdf)" type="video/mp4">
                                        您的浏览器不支持 video 属性。
                                      </video>
                                      </el-dialog> -->
                                  </div>
                                </div>
                                <div v-if="goods.confirmTime > 1 || goods.isLook == 2">
                                  <div v-if="goods.confirmTime < 1">
                                    <div>
                                      <el-tooltip content="订单确认后无法撒回，请仔细确认" placement="bottom" effect="light">
                                        <em class="guigeTis" style="margin-right: 3px"> ? </em>
                                      </el-tooltip>
                                      <a href="javascript:;" class="rightBtn05 rightBtn01" @click="orderDone(goods.id, orderInfo.parentId, goods.supOrderId)" v-if="boxdisplay(goods.goodsTag)">确认效果</a>
                                    </div>
                                    <label class="rightBtn rightBtn01 hide">已确认</label>
                                  </div>
                                  <div v-else>
                                    <label class="rightBtn rightBtn01">已确认</label>
                                    <div v-show="goods.isChe == 1">
                                      <a href="javascript:;" class="rightBtn rightBtn01 confirm_time_che" @click="cancelConfirmTime(goods.id)">确认撤回</a>
                                      <span class="gree"> 撤回剩余时间：</span>
                                      <span class="gree"> {{ goods.lessCheTime }}分钟</span>
                                    </div>
                                  </div>
                                </div>
                                <div v-else>
                                  <div>
                                    <el-tooltip content="订单确认后无法撒回，请仔细确认" placement="bottom" effect="light">
                                      <em class="guigeTis" style="margin-right: 3px"> ? </em>
                                    </el-tooltip>
                                    <a href="javascript:;" class="rightBtn05 rightBtn01 nofile" @click="warning3D" v-if="boxdisplay(goods.goodsTag)">确认效果</a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!--确认结束-->
                      </div>
                      <div class="s3">{{ goods.price }}元</div>
                      <div class="s4">{{ goods.num }}</div>
                      <!-- <div v-if="orderGoods" class="newtable">{{goods.goodsAttr}}</div>
                      <div v-if="orderGoods" class="newtable">{{goods.goodsAttr}}</div>
                      <div v-if="orderGoods" class="newtable">{{goods.goodsAttr}}</div>
                        <div v-if="orderGoods" class="newtable">{{goods.goodsAttr}}</div> -->
                      <div style="display: table-footer-group" v-if="goods.miniOrderEnquiry && goods.miniOrderEnquiry.isConfirmed == 1">
                        <div style="text-align: left; position: absolute; background: #fff; margin-left: 15px; width: 650px">
                          <p style="color: red; width: 500px">当前订单包括有自定义工艺，生产评估后对参数有修改</p>
                          <p style="width: 550px" v-if="goods.miniOrderEnquiry.reviewStatus == 1">
                            修改记录： #自定义工艺#:{{ goods.ordersCustomParameList[0].description }}; 工艺修改为 #自定义工艺#:{{ goods.ordersCustomParameList[0].correctionParame }};
                          </p>
                          <p style="width: 550px" v-else-if="goods.miniOrderEnquiry.reviewStatus == 2">
                            {{ goods.miniOrderEnquiry.remark }}
                          </p>
                          <el-button style="float: right; margin-top: -30px" @click="accept(goods.poSn)">确认接受</el-button>
                        </div>
                        <div style="text-align: left; z-index: 0; opacity: 0">
                          <p style="color: red">当前订单包括有自定义工艺，生产评估后对参数有修改</p>
                          <p v-if="goods.miniOrderEnquiry.reviewStatus == 1">修改记录： #自定义工艺#:{{ goods.ordersCustomParameList[0].description }}; 工艺修改为 #自定义工艺#:{{ goods.ordersCustomParameList[0].correctionParame }};</p>
                          <p v-else-if="goods.miniOrderEnquiry.reviewStatus == 2">{{ goods.miniOrderEnquiry.remark }}</p>
                          <p style="height: 30px; width: 99%">1</p>
                        </div>
                      </div>
                      <div v-if="goods.confirmTime < 1" style="display: table-row;height: 50px;">
                        <div style="text-align: left;position: absolute;background:#fff;padding-left:86px;width:646px;">
                          <span style="color: #ff0036;">温馨提示:</span>
                          <span>
                            如果您的设计文件中使用了三色或四色混合(浅灰、灰、深灰、黑)、暗红色、浅红色、墨绿色、蓝紫色、深紫色、深褐色、咖啡色等色，建议您选择专色印刷，否则出现色差问题不予受理。
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="s5">{{ orderInfo.goodsAmount }}</div>
                </li>
              </ul>
              <div class="mo_money">
                <div v-if="orderInfo.designFee > 0">
                  <p>设计费：{{ orderInfo.designFee }} 元</p>
                </div>
                <div v-if="orderInfo.bonusMoney > 0 && orderInfo.bonusUseType === 0">
                  <p>抵现金额：-{{ orderInfo.bonusMoney }} 元</p>
                </div>
                <p>运费：{{ orderInfo.shippingFee }}元</p>
                <p>
                  订单金额：<b class="red mo_moneyB">
                    {{ (orderInfo.amount * 100 - (orderInfo.bonusUseType == 1 ? 0 : orderInfo.bonusMoney) * 100 + (orderInfo.designFee ? orderInfo.designFee * 100 : 0)) / 100 }}
                    <!-- {{ (orderInfo.amount * 100 - (orderInfo.bonusUseType == 1 ? 0 : orderInfo.bonusMoney) * 100) / 100 }} -->
                  </b>
                  元
                </p>
              </div>
            </div>
          </template>
          <ul class="flex inforUl" v-if="switchTopShow == 1">
            <li style="width: 100%">
              <h3>订单进度</h3>
              <div class="inlogBox">
                <table class="Consignee_List">
                  <div style="margin-bottom: 5px">
                    <el-radio-group v-model="radio1" @change="selectedPOsn" text-color="#ff0036" fill="#ff0036">
                      <el-radio-button v-for="(vo, index) in orderGoods" :key="index" :label="index"> {{ vo.customName ? vo.customName : vo.name }} 进度</el-radio-button>
                    </el-radio-group>
                  </div>
                  <div>
                    <tr style="background: #f7f7f7">
                      <td colspan="6">物流清单</td>
                    </tr>
                    <tr>
                      <td width="100px">快递公司</td>
                      <td width="200px" style="color: #999">
                        <span v-if="currentTrackRecords.expressNo || (currentTrackRecords.miniOrderGoodsShipment && currentTrackRecords.miniOrderGoodsShipment.expressNo)">{{
                          currentTrackRecords.miniOrderGoodsShipment['expressType'] || currentTrackRecords.miniOrderGoodsShipment.expressType
                        }}</span>
                        <span v-else>未发货</span>
                      </td>
                      <td width="100px">配送方式</td>
                      <td width="200px" style="color: #999">
                        <span v-if="orderInfo.shippingName">{{ orderInfo.shippingName }}</span>
                        <span v-else>未发货</span>
                      </td>
                      <td width="100px">快递单号</td>
                      <td width="200px" style="color: #999">
                        <span v-if="currentTrackRecords.expressNo || (currentTrackRecords.miniOrderGoodsShipment && currentTrackRecords.miniOrderGoodsShipment.expressNo)">
                          {{ currentTrackRecords.expressNo || currentTrackRecords.miniOrderGoodsShipment.expressNo }}
                        </span>
                        <span v-else>未发货</span>
                      </td>
                    </tr>
                    <tr>
                      <td width="100px">实际出货数量</td>
                      <td width="200px" style="color: #999">{{ currentTrackRecords.miniOrderGoodsShipment && currentTrackRecords.miniOrderGoodsShipment.actNum ? currentTrackRecords.miniOrderGoodsShipment.actNum : '暂无实际出货数量' }}</td>
                      <td width="100px">箱数</td>
                      <td width="200px" style="color: #999">
                        {{ currentTrackRecords.miniOrderGoodsShipment && currentTrackRecords.miniOrderGoodsShipment.pkgNum ? currentTrackRecords.miniOrderGoodsShipment.pkgNum : '暂无箱数' }}
                      </td>
                      <td width="100px">装箱信息</td>
                      <td width="200px" style="color: #999">
                        {{ currentTrackRecords.miniOrderGoodsShipment && currentTrackRecords.miniOrderGoodsShipment.pkgListNum ? currentTrackRecords.miniOrderGoodsShipment.pkgListNum : '暂无装箱信息' }}
                      </td>
                    </tr>
                    <tr>
                      <td width="100px">实际出货时间</td>
                      <td width="200px" style="color: #999">
                        {{ currentTrackRecords.miniOrderGoodsShipment && currentTrackRecords.miniOrderGoodsShipment.shipTime ? currentTrackRecords.miniOrderGoodsShipment.shipTime : '暂无实际出货时间' }}
                      </td>
                      <td width="100px">备注</td>
                      <td colspan="3" width="200px" style="color: #999">
                        {{ currentTrackRecords.miniOrderGoodsShipment && currentTrackRecords.miniOrderGoodsShipment.remark ? currentTrackRecords.miniOrderGoodsShipment.remark : '暂无备注' }}
                      </td>
                    </tr>
                    <!-- <tr>
                      <td width="100px">快递公司</td>
                      <td width="90%" v-if="currentTrackRecords.expressNo || (currentTrackRecords.miniOrderGoodsShipment && currentTrackRecords.miniOrderGoodsShipment.expressNo)">
                        {{ currentTrackRecords.miniOrderGoodsShipment['expressType'] || currentTrackRecords.miniOrderGoodsShipment.expressType }}
                      </td>
                      <td width="90%" v-else>未发货</td>
                    </tr>
                    <tr>
                      <td>配送方式</td>
                      <td v-if="orderInfo.shippingName">{{ orderInfo.shippingName }}</td>
                      <td v-else>未发货</td>
                    </tr>
                    <tr>
                      <td>快递单号</td>
                      <td v-if="currentTrackRecords.expressNo || (currentTrackRecords.miniOrderGoodsShipment && currentTrackRecords.miniOrderGoodsShipment.expressNo)">
                        {{ currentTrackRecords.expressNo || currentTrackRecords.miniOrderGoodsShipment.expressNo }}
                      </td>
                      <td v-else>未发货</td>
                      </tr> -->
                    <!--物流追踪信息-->
                    <tr v-show="trackRecords">
                      <td colspan="6">
                        <div v-if="currentTrackRecords.trackRecord || currentTrackRecords.factoryRecord" id="map" style="max-height: 320px; overflow: auto">
                          <el-timeline class="trackBox" :reverse="reverse">
                            <template v-if="currentTrackRecords.trackRecord">
                              <el-timeline-item size="large" v-for="(trackInfo, index) in currentTrackRecords.trackRecord" :key="index" :timestamp="formatSecond(trackInfo.trackTime)" :icon="index == 0 ? 'el-icon-truck' : ''">
                                {{ trackInfo.trackDetail }}
                              </el-timeline-item>
                              <!-- <el-timeline-item size="large" :key="index" v-else
                                :timestamp="formatSecond(trackInfo.trackTime)">
                                {{ trackInfo.trackDetail }}
                              </el-timeline-item> -->
                            </template>
                            <template v-if="currentTrackRecords.factoryRecord">
                              <el-timeline-item v-for="(trackInfos, indexs) in currentTrackRecords.factoryRecord" :timestamp="trackInfos.machining_time" size="large" :key="'pppp' + indexs">
                                {{ trackInfos.machining_name }}
                              </el-timeline-item>
                            </template>
                          </el-timeline>
                        </div>
                        <div v-else style="text-align: center">
                          <img class="infos" src="../../static/mulindex/img/none.png" alt="" />
                          <p>暂无物流信息</p>
                        </div>
                        <!-- <div class="logisticsBox">
                          <div class="logisList">
                            <ul>
                              <li v-for="(trackInfo, index) in trackRecords" :key="trackInfo.id">
                                <span class="logNew" v-if="index === 0">最新</span>
                                <div class="logListDv">
                                  <p class="logListDvtx red" v-text="trackInfo.trackDetail"></p>
                                  <p class="logListTime" v-text="formatSecond(trackInfo.trackTime)"></p>
                                </div>
                              </li>
                            </ul>
                          </div>
                          </div> -->
                      </td>
                    </tr>
                  </div>
                </table>
              </div>
            </li>
          </ul>
        </div>
        <el-dialog title="pdf修改备注" :visible.sync="dialogVisible" width="740px" :before-close="handleClose">
          <section class="content" v-if="pdfNotes">
            <el-timeline :reverse="reverse">
              <el-timeline-item v-for="(note, index) in pdfNotes" :key="index" :timestamp="formatSecond(note.addtime)">
                <div v-html="note.notes"></div>
              </el-timeline-item>
            </el-timeline>
            <div class="box-footer gocenter">
              <el-button @click="pdfConfirm(pdfDocId)" plain style="width: 160px; height: 35px">已阅PDF修改信息</el-button>
            </div>
          </section>
          <section class="content" style="text-align: center" v-else>暂时没有数据</section>
        </el-dialog>
        <!-- <el-dialog :title="'补差价'" custom-class="dialogYs" ref="childDialog" :append-to-body="true" :visible.sync="diffDialog" @closed="diffClose">
          <router-view></router-view>
          </el-dialog> -->
      </div>
    </div>
    <el-dialog title="上传设计稿图片" :visible.sync="sdrdialog" center>
      <div style="padding: 50px 150px">
        <el-upload
          class="avatar-uploader"
          ref="upload"
          action="/api/consumer/order/miniSupplierOrders/updatePdfFile"
          :headers="headers"
          :data="{ orderDocId: cdrid, folder: 'uploads/file', orderNo: orderInfo.orderNo, isPdf: 3 }"
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
    <!-- <button @click="sdrdialog=true">show</button> -->
    <!--right end-->
  </el-main>
</template>

<script>
import { getSupplierOrderDetails, confirmSample, confirmHardcover, confirmBliter, fileLookStatus } from '@/api/order/supplierOrdersApi';
import { formatSecond } from '@/utils/timeUtil';
import { ACCESS_TOKEN } from '@/store/global-constant';
import { cancelConfirmFile, addDoc, modifityPdfNote, userDefinedConfirm, getModifyDetailByPoSns, newFileConfirm } from '@/api/order/orderApi';
import { saveOrUpdate } from '@/api/users/userComDocumentsApi';
import { encodeUrlSpecial, downloadOrView } from '@/utils/order/baseEncodeUrl';

export default {
  computed: {
    activeMiniInvocieExist: function () {
      if (this.miniInvoiceVo == null || Object.keys(this.miniInvoiceVo).length == 0 || this.miniInvoiceVo.invoiceType == null) {
        return false;
      } else {
        return true;
      }
    },
    activeCompanyName: function () {
      if (this.miniComDocumentsVo.companyname) {
        return this.miniComDocumentsVo.companyname;
      } else {
        return this.companyName;
      }
    },
    activeBrandName: function () {
      if (this.miniComDocumentsVo.brandname) {
        return this.miniComDocumentsVo.brandname;
      } else {
        return this.brandName;
      }
    },
    activeCodeName: function () {
      if (this.miniComDocumentsVo.codename) {
        return this.miniComDocumentsVo.codename;
      } else {
        return this.codeName;
      }
    }
  },
  data() {
    return {
      reverse: false,
      activities: [],
      // VideoVisible:false,
      headers: {
        token: localStorage.getItem(ACCESS_TOKEN),
        Authorization: localStorage.getItem(ACCESS_TOKEN)
      },
      orderInfo: [],
      miniComDocumentsVo: [],
      adaptiveInfo: [],
      ordersRefundsInfo: [],
      orderGoods: [],
      miniInvoiceVo: [],
      trackRecords: [],
      miniDiffOrder: [],
      orderNo: '',
      imageUrl: '',
      sdrdialog: false,
      // 吸塑时间
      blisterCreateTime: 1587811952,
      // 精装盒时间
      hardcoverCreateTime: 1587571200,
      // 鼠标悬停
      tipHover: false,
      //
      companyName: '',
      brandName: '',
      codeName: '',
      uploadDocData: { folder: 'uploads/picture' },
      baseUrl: 'http://alifile.xiaocaiyin.com/',
      fileUrl: 'http://alifile.xiaocaiyin.com/',
      // pdf 修改窗口
      dialogVisible: false,
      // pdf 数据
      pdfNotes: [],
      pdfDocId: '',
      diffDialog: false,
      po_sn: '',
      currentTrackRecords: [],
      radio1: 0,
      switchTopShow: 0,
      cdrid: '',
      companyimg: '',
      brandimg: [],
      codeimg: ''
    };
  },
  created() {
    // console.log('switchTopShow===',this.$route.query.orderNo,this.$route.query.type);
    this.orderNo = this.$route.query.orderNo;
    this.getAllOrder(this.$route.query.orderNo);
    if (this.$route.query.type) {
      this.switchTopShow = this.$route.query.type;
    }
  },
  methods: {
    ...{ formatSecond, encodeUrlSpecial, downloadOrView },

    getAllOrder(orderNo) {
      let _this = this;
      const reqParam = {
        orderNo: orderNo
      };
      getSupplierOrderDetails(reqParam)
        .then(res => {
          if (res.code === '000000') {
            if (res.data.miniComDocumentsVo.brandimg) {
              res.data.miniComDocumentsVo.brandimg = res.data.miniComDocumentsVo.brandimg.split(',');
            } else {
              res.data.miniComDocumentsVo.brandimg = [];
            }
            this.$set(this, 'orderInfo', res.data);
            this.$set(this, 'miniComDocumentsVo', res.data.miniComDocumentsVo);
            this.$set(this, 'adaptiveInfo', res.data.adaptiveInfo);
            this.$set(this, 'ordersRefundsInfo', res.data.ordersRefundsInfo);
            this.$set(this, 'orderGoods', res.data.children);
            this.$set(this, 'miniInvoiceVo', res.data.miniInvoiceVo);
            this.$set(this, 'trackRecords', res.data.trackRecords);
            this.$set(this, 'miniDiffOrder', res.data.miniDiffOrder);
            // console.log('--------------- orderGoods -------------------');
            // console.log(encodeURI('#合成纸-四色--光胶-600个_reported.png'));
            console.log('orderGoods', this.orderGoods);
            console.log(res.data.trackRecords);
            console.log(res.data.trackRecords[0]);
            console.log(res.data.children);
            console.log(res.data.children[0]);
            var po_sn = res.data.children[0].poSn;
            if (po_sn) {
              this.$set(this, 'currentTrackRecords', res.data.trackRecords[po_sn]);
              this.po_sn = po_sn;
            }
            getModifyDetailByPoSns({
              poSns: res.data.children.map(e => e.poSn)
            }).then(resp => {
              if (resp.data && resp.data.length > 0) {
                _this.orderGoods = _this.orderGoods.map(e => {
                  let item = resp.data.find(s => s.poSn === e.poSn);
                  if (item && item.changeStatus == 4) {
                    e.modifyDetail = item;
                  }
                  return e;
                });
              }
            });
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
    /**
     * 查看预检报告
     * @param {number} id -商品预检ID
     * */
    tolook(id) {
      if (id == null) {
        this.$message.error('预检id为空');
      } else {
        this.$router.push({
          path: '/preview/previewDetails',
          query: {
            reportId: id
          }
        });
      }
    },
    boxdisplay(num) {
      if (num == 1 || num == 2 || num == 7 || num == 15 || num == 18) {
        return true;
      } else {
        return false;
      }
    },
    //选择po_sn获取物流信息
    selectedPOsn(index) {
      var po_sn = this.orderGoods[index].poSn;
      // console.log("document.getElementById('map')",document.getElementById('map'));
      if (document.getElementById('map')) {
        document.getElementById('map').scrollTop = 0;
      }
      // console.log(po_sn);
      if (po_sn) {
        this.$set(this, 'currentTrackRecords', this.trackRecords[po_sn]);
      } else {
        this.$set(this, 'currentTrackRecords', []);
      }
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
    uploadSuccess(response, file, fileList, id) {
      if (response.code === '000000') {
        this.cdrid = id;
        console.log('第一个上传成功', id);
        if (file.name.lastIndexOf('.cdr') > -1) {
          console.log('yes');
          this.sdrdialog = true;
        }
        this.$message({
          type: 'success',
          message: '上传成功'
        });
        this.getAllOrder(this.orderNo);
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
    },
    // 去支付
    toPayCheckorder() {
      // debugger;
      let order = this.orderInfo;
      let invoiceType = order.miniInvoiceVo.invoiceType;
      // console.log('order', order);
      if (order.isCanPay == 0) {
        let flag = order.children.map(e => {
          return e?.miniOrderEnquiry?.reviewStatus;
        });
        if (flag.indexOf(0) == -1 && flag.indexOf(1) > -1) {
          this.$alert('订单中包括了自定义工艺，下单后进入评估报价对参数有修改，请先确认再支付！', '温馨提示', {
            confirmButtonText: '关闭'
          });
        } else {
          this.$alert('订单中包括了自定义工艺，下单后进入评估报价，待评估完成后再计入订单金额一起支付吧！', '温馨提示', {
            confirmButtonText: '关闭'
          });
        }
        return;
      }
      if (invoiceType === 1) {
        this.$router.push({ path: '/service/getinvoicepay', query: { orderNo: order.mainSn, paytype: 'normal' } });
      } else {
        this.$router.push({ path: '/service/getcylpay', query: { orderNo: order.mainSn, paytype: 'normal' } });
      }
    },
    orderDone(orderGoodsId, orderId, supOrderId) {
      this.$confirm(
        '尊敬的客户：因为屏幕为RGB格式，印刷为CMYK格式，3D颜色仅供参考，不作为大货验收颜色。请您认真检查订单文件、订单信息，订单的3D效果及文件内容和工艺内容，盒形结构， 一旦确认，印刷文件立刻进入上机生产，无法再做任何修改，并一律不处理文件产生的质量问题与退货退款，请您确保已经一 一仔细确认。',
        '确认文件操作声明！',
        {
          confirmButtonText: '是的，我已确认无误',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          let param = {
            orderGoodsId: orderGoodsId,
            orderId: orderId,
            supOrderId: supOrderId
          };
          confirmSample(param).then(res => {
            // debugger;
            if (res.code == '000000') {
              this.$message({ type: 'success', message: res.message });
            } else {
              this.$message({ type: 'error', message: '失败' });
            }
            this.reflashGoods();
          });
        })
        .catch(() => {});
    },
    // 吸塑
    orderDoneByxisu(orderGoodsId, orderId, supOrderId) {
      // debugger;
      this.$confirm('尊敬的客户：请您认真检查样品质量， 一旦确认，立刻进入上机生产，无法再做任何修改，并一律不处理产生的质量问题与退货退款，请您确保已经一 一仔细确认。', '确认吸塑样品操作声明！', {
        confirmButtonText: '是的，我已确认无误',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let param = {
            orderGoodsId: orderGoodsId,
            orderId: orderId,
            supOrderId: supOrderId
          };
          confirmBliter(param).then(res => {
            if (res.code == '000000') {
              this.$message({ type: 'success', message: res.message });
            } else {
              this.$message({ type: 'error', message: '失败' });
            }
            this.reflashGoods();
          });
        })
        .catch(() => {});
    },
    //cdr
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
    sdrSuccess(response, file, fileList) {
      if (response.success) {
        this.$message({
          type: 'success',
          message: '上传成功'
        });
        this.sdrdialog = false;
        this.getAllOrder(this.orderNo);
      } else {
        this.$message({
          type: 'error',
          message: response.message
        });
      }
    },
    accept(po) {
      // console.log(po);
      this.$confirm('生产评估后对参数有修改，确认接受吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          userDefinedConfirm({ poSn: po }).then(res => {
            if (res.code == '000000') {
              this.$message({
                type: 'success',
                message: res.message
              });
              this.reflashGoods();
            }
          });
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
    },
    cdrPreview(file) {
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
    upcdrimg(id) {
      console.log(id);
      this.cdrid = id;
      this.sdrdialog = true;
      this.imageUrl = '';
    },
    // 精装盒
    orderDoneBymic(orderGoodsId, orderId, supOrderId) {
      this.$confirm('尊敬的客户：请您认真检查样品质量， 一旦确认，立刻进入上机生产，无法再做任何修改，并一律不处理产生的质量问题与退货退款，请您确保已经一 一仔细确认。', '确认样品操作声明', {
        confirmButtonText: '是的，我已确认无误',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let param = {
            orderGoodsId: orderGoodsId,
            orderId: orderId,
            supOrderId: supOrderId
          };
          confirmHardcover(param).then(res => {
            if (res.code == '000000') {
              this.$message({ type: 'success', message: res.message });
            } else {
              this.$message({ type: 'error', message: '失败' });
            }
            this.reflashGoods();
          });
        })
        .catch(() => {});
    },
    cancelConfirmTime(id) {
      this.$confirm('确定要撤回确认文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var param = {
            data: id
          };
          cancelConfirmFile(param)
            .then(res => {
              if (res.code === '000000') {
                this.$message({
                  type: 'success',
                  message: res.message
                });
                this.getAllOrder(this.orderNo);
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
    //上传文件的判断
    beforeUploadImg(file) {
      var fileName = file.name;
      const reg = /\.(png|jpeg|jpg|gif|bmp)$/;
      const extension = reg.test(fileName);
      const fileSize = file.size / 1024 / 1024 < 1;
      if (!extension) {
        this.$message({
          message: '上传文件只能是 png、jepg、jpg、gif、bmp格式!',
          type: 'warning'
        });
      }
      if (!fileSize) {
        this.$message({
          message: '上传文件大小不能超过 1MB!',
          type: 'warning'
        });
      }
      return extension && fileSize;
    },
    //上传成功的方法
    uploadImgSuccess(img, response, file, fileList) {
      if (response.code === '000000') {
        console.log('img,file', img, file);
        if (img === 'companyimg') {
          this.companyimg = response.data;
        } else if (img === 'brandimg') {
          this.brandimg.push(response.data);
        } else if (img === 'codeimg') {
          this.codeimg = response.data;
        }
        console.log('this.brandimg || this.miniComDocumentsVo.brandimg', this.brandimg, this.miniComDocumentsVo.brandimg);
        this.$message({
          type: 'success',
          message: '上传成功'
        });
      } else {
        this.$message({
          type: 'error',
          message: response.message
        });
      }
    },
    //添加修改共用方法
    addDocument() {
      if (this.companyname == '') {
        this.$message({
          type: 'error',
          message: '公司名称不能为空'
        });
        return false;
      }
      let brandimg2 = '';
      if (this.brandimg.length != 0) {
        brandimg2 = this.brandimg.join();
      } else {
        brandimg2 = this.miniComDocumentsVo.brandimg.join();
      }
      const reqParam = {
        miniComDocuments: {
          id: this.returnObjectEmpty(this.miniComDocumentsVo.id),
          name: this.returnObjectEmpty(this.miniComDocumentsVo.name),
          companyname: this.activeCompanyName,
          companyimg: this.returnObjectEmpty(this.companyimg || this.miniComDocumentsVo.companyimg),
          brandname: this.activeBrandName,
          brandimg: this.returnObjectEmpty(this.brandimg || this.miniComDocumentsVo.brandimg),
          codename: this.activeCodeName,
          codeimg: this.returnObjectEmpty(this.codeimg || this.miniComDocumentsVo.codeimg)
        },
        orderId: this.returnObjectEmpty(this.orderInfo.parentId)
      };
      // debugger;
      // console.log(reqParam);
      addDoc(reqParam)
        .then(res => {
          if (res.code === '000000') {
            this.$message({
              type: 'success',
              message: '保存成功'
            });
            this.getAllOrder(this.orderNo);
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
    },
    // 修改pdf备注文件
    prepressnotes(docId) {
      this.pdfDocId = docId;
      // 获取pdf数据
      modifityPdfNote({ docId: docId, isPost: 0 })
        .then(res => {
          if (res.code === '000000') {
            this.pdfNotes = res.data;
            // console.log(this.pdfNotes);
            this.dialogVisible = true;
          }
        })
        .catch(error => {
          this.dialogVisible = true;
          console.log(error.message);
        });
    },
    // pdf 确认窗口
    pdfConfirm(docId) {
      // debugger;
      let data = { docId: docId, isPost: 1 };
      modifityPdfNote(data)
        .then(res => {
          // console.log(res.data);
          this.dialogVisible = false;
          this.reflashGoods();
        })
        .catch(() => {
          this.dialogVisible = false;
          this.reflashGoods();
        });
    },
    lookFileStatus(goodsId, val, num) {
      // if(num==1){
      //   this.VideoVisible=true
      // }
      console.log('lookFileStatus', val);
      let goods = this.orderInfo.children.find(e => e.id === goodsId);
      if (goods.confirmTime > 1) return;
      if (goods.isLook >= val) return;
      if (goodsId != undefined && goodsId != null && val != undefined && val != null) {
        fileLookStatus({
          isLook: val,
          orderGoodsId: goodsId
        }).then(res => {
          console.log(res);
          this.reflashGoods();
        });
      }
    },
    returnObjectEmpty(obj) {
      if (obj) {
        return obj;
      }
      return '';
    },
    // 刷新商品
    reflashGoods() {
      this.getAllOrder(this.orderNo);
    },
    warningPDF() {
      this.warningWindow01('请先查看PDF修改内容后，才能操作哦!');
    },
    warning3D() {
      this.warningWindow01('请先查看文件，再查看3d，最后确认文件.');
    },
    warningFile() {
      this.warningWindow01('请先查看文件，最后确认效果.');
    },
    // 警告窗口
    warningWindow01(message) {
      this.$message({ type: 'warning', message: message });
    },
    handleClose(done) {
      done();
    },
    // 部件上传文件参数
    uploadData(id, fileUrl, orderNo, index) {
      let data = {};
      // console.log(index);
      if (index == 0) {
        data['isPdf'] = 1;
      }
      data['orderDocId'] = id;
      data['folder'] = fileUrl;
      data['orderNo'] = orderNo;
      return data;
    },
    // 补差价
    toPayDiffOrder(orderNo) {
      // this.diffDialog = true;
      let routerPath = { path: '/user/orderdetail', query: { orderNo: this.orderInfo.orderNo } };
      sessionStorage.setItem('cachePath', JSON.stringify(routerPath));
      this.$router.push({ path: '/service/diffpay', query: { orderNo: orderNo } });
    },
    lookFileStatus2(goods) {
      this.orderGoods = this.orderGoods.map(e => {
        if (e.id == goods.id) {
          e.isLook2 = 1;
        }
        return e;
      });
    },
    modifyConfirm(goods) {
      let _this = this;
      if (goods.isLook2) {
        newFileConfirm({
          modifyNo: goods.modifyDetail.modifyNo
        }).then(res => {
          this.reflashGoods();
        });
      } else {
        _this.warningFile();
      }
    }

    // diffClose() {
    //   this.diffDialog = false;
    // }
  }
};
</script>
<style scoped src="../../static/index/user/css/all.css" />
<style scoped src="../../static/index/user/css/reset.css" />
<style scoped src="../../static/index/user/css/foot.css" />
<style scoped src="../../static/index/user/css/main.css" />
<style scoped src="../../static/agent/css/sweetalert.css" />
<style scoped src="../../static/mulindex/css/fonts.css?v=202003051652" media="all" />
<style scoped src="../../static/mulindex/css/public.css?v=202003051652" media="all" />
<style scoped src="../../static/mulindex/css/user.css" media="all" />
<style type="text/css">
.infos {
  width: 100px;
  height: 100px;
  margin: 20px;
}
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background: #ffffff !important;
  border-color: #ff0036 !important;
  /*box-shadow: -1px 0 0 0 red !important;*/
}

.trackBox li:first-child .el-timeline-item__node {
  background: #ff0036 !important;
  width: 30px !important;
  height: 30px !important;
  left: -9px !important;
  top: -5px !important;
}

.el-timeline-item__icon {
  font-size: 22px !important;
}

.newtable {
  display: table-caption;
}

::-webkit-scrollbar-track-piece {
  background-color: #fff;
  -webkit-border-radius: 0;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  height: 50px;
  background-color: #b8b8b8;
  -webkit-border-radius: 6px;
  outline: 2px solid #fff;
  outline-offset: -2px;
  border: 2px solid #fff;
  filter: alpha(opacity=50);
  -moz-opacity: 0.5;
  -khtml-opacity: 0.5;
  opacity: 0.5;
}

::-webkit-scrollbar-thumb:hover {
  height: 50px;
  background-color: #878987;
  -webkit-border-radius: 6px;
}

.trackBox {
  padding: 20px 20px 0 !important;
}

.trackBox li {
  margin: 0 !important;
  line-height: 20px;
  text-indent: 0;
  width: inherit !important;
}

.trackBox li:first-child .el-timeline-item__node {
  background: #ff0036;
}

.trackBox li:first-child .el-timeline-item__content {
  color: #ff0036;
}

.wbb1022File {
  cursor: pointer;
}

.payOrder {
  padding: 10px 15px;
}

.paydiv {
  width: 150px;
  margin: 25px auto 0;
}

.floatleft {
  float: left;
}

.right_Consignee .floatleft {
  top: 6px;
  margin-right: 10px;
}

.tableprompt {
  border: 1px solid #ededed;
  margin-top: 20px;
  background-color: #fff;
  position: relative;
  font-size: 14px;
  padding: 20px;
  color: #d0111b;
}

.textval {
  padding: 2px;
  width: 200px;
}

.saveImg {
  background-color: #009688;
  border: medium none;
  border-radius: 2px;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  height: 30px;
  line-height: 30px;
  padding: 0 25px;
  text-align: center;
}

.foldStyle,
.foldStyle a {
  margin: 18px;
}

.foldStyle a {
  line-height: 16px;
}

.serialNo {
  background-color: #00a65a;
  color: #fff;
  border-radius: 0.25em;
  display: inline;
  font-size: 75%;
  font-weight: 700;
  padding: 0.3em 0.6em;
  text-align: center;
  vertical-align: baseline;
  white-space: nowrap;
}

.guigeTis {
  background-color: #d9d9d9;
  width: 14px;
  height: 14px;
  border: 1px solid #c9c9c9;
  display: inline-block;
  border-radius: 16px;
  position: relative;
  top: 1px;
  font-size: 10px;
  line-height: 14px;
  text-align: center;
  color: #fff;
  cursor: pointer;
}

.rightBtn05 {
  width: 75px;
  height: 20px;
  line-height: 20px;
  color: #00cc33;
  border: 1px #00cc33 solid;
  background: #fff;
  margin: 0 auto;
}

.leftC {
  width: 100px;
}

label {
  display: inline-block;
  font-weight: 700;
  margin-bottom: 5px;
  max-width: 100%;
  font-size: 12px;
}

.thumbnail {
  margin-bottom: 0px;
}

.hidden {
  display: none;
}

.note_info img {
  width: 300px;
}

.gocenter {
  text-align: center;
}

.infoBoxTops {
  height: 28px;
  line-height: 28px;
  padding: 0 16px;
  /*border: 1px solid #acb1ba;*/
  display: inline-block;
  position: relative;
  /*bottom: -1px;*/
  font-weight: 700;
  font-size: 14px;
  border-bottom: 0;
  cursor: pointer;
  background-color: #f0f2f5;
}

.infoBoxTop a {
  color: red !important;
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
