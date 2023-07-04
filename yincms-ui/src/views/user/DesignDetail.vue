<template>
  <div class="designdetailbox">
    <!--main start-->
    <el-main>
      <div class="right_List">
        <div class="UP_right_List">设计详情</div>
        <div class="homeInfo_New">
          <div class="boxDetails">
            <div class="Essential_information">
              <h1 class="titleYous yoursBox">订单信息</h1>
            </div>
            <div class="yousBox_Detail">
              <!-- <table class="yousBox_Hd">
                <tbody>
                  <tr class="tr_th">
                    <td class="yousBox01">打样详情</td>
                    <td class="yousBox01">设计文件</td>
                  </tr>
                </tbody>
              </table> -->
              <table class="yousBox_Main">
                <tbody>
                  <div class="yousBox_MainDv" v-for="(info, index) in proofInfos" :key="index">
                    <tr class="tr_th">
                      <td class="yousBox01 BoxNum">
                        <span class="">订单编号：</span>
                        <a href="javascript:;">{{ proofOrder.orderSn }}</a>
                        <!-- <span v-if="proofOrder.orderType != 5" style="color: red; margin-left: 10px">预计发货时间：{{ info.outTime }}</span> -->
                      </td>
                      <td class="yousBox02" style="width: 4%">
                        <!-- <span>购买数量：</span>
                        <span class="numberAdd">{{ info.num }}X{{ info.fnumber }}</span> -->
                      </td>
                      <td class="yousBox02">
                        <!-- <span>总价：</span>
                        <span class="everyPrice">￥{{ info.amount }}</span> -->
                      </td>
                    </tr>
                    <tr class="tr_thNew" style="clear: both">
                      <td class="yousBox01 ImgPart">
                        <div class="goodsFont goodsFont2" style="max-width: 100%; width: 100%">
                          <p class="goodsFont_One" style="width: 150px" v-if="proofOrder.hardcoverKind > 0">
                            <img v-if="proofOrder.hardcoverKind == 1" width="150px" height="150px" src="@/static/mulindex/img/Frame 56.png" alt="" />
                            <img v-if="proofOrder.hardcoverKind == 2" width="150px" height="150px" src="@/static/mulindex/img/Frame 55.png" alt="" />
                            <img v-if="proofOrder.hardcoverKind == 3" width="150px" height="150px" src="@/static/mulindex/img/Frame 54.png" alt="" />
                            <!-- <img width="150px" height="150px" :src="'/api/consumer/certifyFree/alibaba/oss/viewFile?fileName=' + info.agentFileMap[7][0].fileUrl" alt="" /> -->
                            <!-- <a href="javascript:;" v-if="proofOrder.orderType == 5" class="Hd_goodsName" style="font-weight: 600; font-size: 13px">原创设计</a> -->
                            <!-- <span>{{ proofOrder.memo }}</span>
                            <br>
                            <span>{{ info.goodsAttr }}</span> -->
                          </p>
                          <p class="goodsFont_One" style="width: 150px" v-if="proofOrder.orderType == 10">
                            <img width="150px" height="150px" src="@/static/mulindex/img/Frame 61.png" alt="" />
                          </p>
                          <p class="goodsFont_One" style="margin-top: 20px">
                            <a href="javascript:;" class="Hd_goodsName" style="color: red">
                              <template v-if="proofOrder.orderType == 10">平面设计-{{ info.goodsName }}</template>
                              <template v-if="proofOrder.orderType == 6">结构设计-{{ info.goodsName }}</template>
                              <template v-if="proofOrder.orderType == 7">方案设计-{{ info.goodsName }}</template>
                            </a>
                          </p>
                          <p class="goodsFont_One" style="margin-top: 20px">
                            <a href="javascript:;" class="Hd_goodsName" style="color: red">
                              <template v-if="proofOrder.hardcoverKind == 1">方案设计-提供商品样品</template>
                              <template v-if="proofOrder.hardcoverKind == 2">平面设计-提供参照盒子样品</template>
                              <template v-if="proofOrder.hardcoverKind == 3">平面设计-提供参照客户文件</template>
                            </a>
                          </p>
                          <p class="goodsFont_One" style="max-width:450px;">
                            <a href="javascript:;" class="Hd_goodsName" style="color:#666">{{ proofOrder.memo }}</a>
                          </p>
                        </div>
                      </td>
                      <td class="yousBox01 Two_Part" style="width: 4%">
                        <span class="numberAdd">{{ info.num }}X{{ info.fnumber }}</span>
                        <!-- <div v-if="info.files != null && info.files.fileUrl != ''">
                          <div v-if="info.files.status == 3">文件已上传</div>
                          <a v-else style="align-self: center; color: #08d" :href="baseUrl + info.files.fileUrl" target="_blank">[<span style="border-bottom: 1px solid #08d">查看设计文件</span>]</a>
                        </div>
                        <div v-else>
                          <template v-if="proofOrder.orderType == 5">
                            <span style="color: #666">设计师还未上传文件</span>
                          </template>
                          <template v-else>
                            【请上传设计文件】
                            <span class="wbb1022CommodityPrice-span fileupload" data-id="{$info.files.file_id}" data-no="{$demand_info.order_sn|default=''}" data-save="1">
                              <el-upload
                                :headers="headers"
                                :show-file-list="false"
                                action="/api/consumer/proof/miniProof/uploadProofFile"
                                :before-upload="beforeUpload"
                                :on-success="uploadSuccess"
                                :on-error="uploadError"
                                accept=".pdf,.ai,.cdr,.psd,.eps,.dxf,.jpg,.tiff,.png,.gif,.zip"
                              >
                                <input class="wbb1022Button" style="padding: 4px 8px; height: auto" value="上传文件" type="button" />
                              </el-upload>
                            </span>
                          </template>
                        </div>
                        <div v-if="info.files != null && info.files.status == 2">退回原因：{{ info.files.note }}</div> -->
                      </td>
                      <td class="yousBox02 Two_Part" style="padding-right: 10px">
                        <span class="everyPrice">￥{{ info.amount }}</span>
                        <!-- <div v-if="proofOrder.type == 2">
                          <br />
                          <a v-if="info.files.fileUrl != ''" class="layui-btn layui-btn-normal layui-btn-sm" :href="info.files.fileUrl" target="_blank">查看正稿文件</a><br /><br />
                        </div>
                        <el-button type="warning" v-if="proofOrder.type == 3 && proofOrder.confirmTime == '' && proofOrder.expressNo != ''" class="layui-btn layui-btn-normal layui-btn-sm submit_file" @click="openConfirm(proofOrder.id)">
                          确认订单
                        </el-button> -->
                      </td>
                    </tr>
                  </div>
                </tbody>
              </table>
              <!-- <table class="yousBox_Main" border="1"> -->
              <table v-if="proofOrder.orderType == 10 || proofOrder.orderType == 9" class="Consignee_List" style="color:#666">
                <!-- <table v-if="proofOrder.orderType == 9" style="border:none;cell-padding:0; cell-spacing:0;border-collapse:collapse;" class="yousBox_Main" border="1"> -->
                <div class="yousBox_MainDv" v-for="(info, index) in proofInfos" :key="index">
                  <tr style="height:60px;" valign="middle" v-if="proofOrder.designStatus == '1' || proofOrder.designStatus == '3'">
                    <td class="left_Consignee">设计文件</td>
                    <td class="right_Consignee" style="width:690px;" v-if="info.files.fileType == 6">
                      请查阅设计师提交的平面设计效果图，请确认符合要求，确认后将免费打样
                      <!-- <template v-for="(info, index) in proofInfos"> -->
                      <a :href="baseUrl + info.files.fileUrl" target="_blank" style="color:#409eff;cursor: pointer;">《平面设计效果图》</a>
                      <!-- </template> -->
                      <span style="text-align: right;margin-top: 20px;" class="amount finishOrder finishOrder01" v-if="proofOrder.payStatus > 0">
                        <a class="payOrder" style="width:40px;padding:0;margin-left: 10px;" @click="downloaddesign">下载</a>
                      </span>
                    </td>
                    <td class="tds" align="center">
                      <el-button
                        style="padding:5px 10px"
                        type="primary"
                        :disabled="proofOrder.delType == 1 || proofOrder.delType == 2"
                        v-if="proofOrder.designStatus == '1' && (info.files.fileUrl !== null || info.files.fileUrl != '')"
                        @click="confirmFiles(info.files.id)"
                        >确认</el-button
                      >
                      <span v-else-if="proofOrder.designStatus == '3'">已确认</span>
                    </td>
                  </tr>
                  <!-- <tr class="right_Consignee" style="height:60px;" valign="middle">
                    <td class="left_Consignee">设计样品</td>
                    <td class="tds tabContainer" style="width:auto;">
                      <span>设计样品已寄您2份样品，请确认设计样品，并签字回寄一份给到业务员</span>
                      <span>物流单号：<span style="color:#409eff;border-bottom:1px solid #409eff">3234587698</span></span>
                    </td>
                    <td class="tds" align="center">
                      <el-button style="padding:5px 10px" :disabled="proofOrder.delType == 2" type="primary">确认</el-button>
                    </td>
                  </tr> -->
                </div>
              </table>
            </div>
          </div>
        </div>
        <div v-if="proofOrder.diffOrder != null">
          <div v-for="(vo, index) in proofOrder.diffOrder" :key="index" class="homeInfo_New">
            <div class="boxDetails">
              <div class="Essential_information">
                <h1 class="titleYous yoursBox">补差价订单</h1>
              </div>
              <div class="Consignee_Part">
                <table class="Consignee_List">
                  <tr>
                    <td class="left_Consignee">差价单号</td>
                    <td class="right_Consignee">{{ vo.orderNo }}</td>
                  </tr>
                  <tr>
                    <td class="left_Consignee">差价金额</td>
                    <td class="right_Consignee">{{ vo.diffMoney }}</td>
                  </tr>
                  <tr>
                    <td class="left_Consignee">差价描述</td>
                    <td class="right_Consignee">{{ vo.diffDesc }}</td>
                  </tr>
                  <tr>
                    <td class="left_Consignee">支付状态</td>
                    <td class="right_Consignee pay_status">
                      <div v-if="vo.status == 'paid'">已支付</div>
                      <div v-else>未支付</div>
                    </td>
                  </tr>
                  <tr v-if="vo.status != 'paid'" class="paybtn">
                    <td class="left_Consignee"></td>
                    <td class="right_Consignee">
                      <el-button size="mini" style="height: 26px" @click="toPayDiffOrder(vo.orderNo)">去付款</el-button>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- <div class="homeInfo_New" v-if="proofOrder.orderType != 5">
          <div class="boxDetails">
            <div class="Essential_information">
              <h1 class="titleYous yoursBox">备注信息</h1>
            </div>
            <div class="Consignee_Part">
              <table class="Consignee_List">
                <tbody>
                  <tr>
                    <td class="left_Consignee">备注信息</td>
                    <td class="right_Consignee">{{ proofOrder.memo }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div> -->

        <!-- <div v-if="proofOrder.designerId == 26 && proofOrder.orderType != 5" class="homeInfo_New">
          <div class="boxDetails">
            <div class="Essential_information">
              <h1 class="titleYous yoursBox">门店信息</h1>
            </div>
            <div class="Consignee_Part">
              <table class="Consignee_List">
                <tbody>
                  <tr>
                    <td class="left_Consignee">门店名称</td>
                    <td class="right_Consignee">{{ proofOrder.designerInfos.companyname }}</td>
                  </tr>
                  <tr>
                    <td class="left_Consignee">门店地址</td>
                    <td class="right_Consignee">{{ proofOrder.designerInfos.city }}{{ proofOrder.designerInfos.address }}</td>
                  </tr>
                  <tr>
                    <td class="left_Consignee">联系人</td>
                    <td class="right_Consignee">{{ proofOrder.designerInfos.contacts }}</td>
                  </tr>
                  <tr>
                    <td class="left_Consignee">联系电话</td>
                    <td class="right_Consignee">{{ proofOrder.designerInfos.tel }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div> -->

        <div class="homeInfo_New">
          <div class="boxDetails">
            <div class="Essential_information">
              <h1 class="titleYous yoursBox">样品邮寄</h1>
              <!-- <el-button type="primary" plain @click="copy(proofOrder.designerInfos.city + proofOrder.designerInfos.address)">复制</el-button> -->
              <!-- <span class="copytxt" @click="copy(proofOrder.designerInfos.city + proofOrder.designerInfos.address)">复制地址</span> -->

              <span class="copytxt" @click="copy(newAddsInfo.address)">复制地址</span>
            </div>
            <div class="Consignee_Part">
              <table class="yousBox_Main sample">
                <tbody>
                  <div class="yousBox_MainDv" v-for="(info, index) in proofInfos" :key="index">
                    <!-- <tr class="tr_th">
                      <td class="yousBox01 BoxNum">
                        <span class="">订单编号：</span>
                        <a href="javascript:;">{{ proofOrder.orderSn }}</a>
                        <span v-if="proofOrder.orderType != 5" style="color: red; margin-left: 10px">预计发货时间：{{ info.outTime }}</span>
                      </td>
                      <td class="yousBox02">
                        <span>快递单号：</span>
                        <span v-if="proofOrder.agentExpressNo">{{ proofOrder.agentExpressNo }}</span>
                        <template v-else>
                          <el-input style="width: 50%" v-model="agentExpressNo" placeholder="输入快递单号"></el-input>
                          <el-button @click="subinfo('agentExpressNo')">提交</el-button>
                        </template>
                        
                      </td>
                    </tr> -->
                    <tr class="tr_thNew" style="clear: both">
                      <td class="yousBox01 ImgPart">
                        <div class="goodsFont addressbox" style="max-width: 100%">
                          <p class="goodsFont_One" style="width: 100%">
                            <!-- <a style="cursor: auto;" href="javascript:;" class="Hd_goodsName">收件地址：{{ proofOrder.designerInfos.city + proofOrder.designerInfos.address }}</a> -->
                            <!-- 收件地址：{{ proofOrder.designerInfos.city + proofOrder.designerInfos.address }} -->
                            收件地址：{{ newAddsInfo.address }}
                          </p>
                          <p class="goodsFont_One" style="width: 100%">
                            <!-- <a style="cursor: auto;" href="javascript:;" class="Hd_goodsName">收件人：{{ proofOrder.designerInfos.contacts }}</a> -->
                            <!-- 收件人：{{ proofOrder.designerInfos.contacts }} -->
                            收件人：{{ newAddsInfo.name }}
                          </p>
                          <p class="goodsFont_One" style="width: 100%">
                            <!-- <a style="cursor: auto;" href="javascript:;" class="Hd_goodsName">联系电话：{{ proofOrder.designerInfos.tel }}</a> -->
                            <!-- 联系电话：{{ proofOrder.designerInfos.tel }} -->
                            联系电话：{{ newAddsInfo.tel }}
                          </p>
                        </div>
                      </td>

                      <td class="yousBox02 Two_Part" style="padding: 0 10px; line-height: 0px">
                        <p class="ytext" style="height: 32px; line-height: 32px">
                          <span>快递单号：</span>
                          <span v-if="proofOrder.agentExpressNo">{{ proofOrder.agentExpressNo }}</span>
                          <template v-else>
                            <el-input style="width: 45%" size="mini" maxlength="15" v-model="agentExpressNo" placeholder="输入快递单号"></el-input>
                            <el-button size="mini" :disabled="proofOrder.delType == 1 || proofOrder.delType == 2 || proofOrder.delType == 3" @click="subinfo('agentExpressNo')">提交</el-button>
                          </template>
                        </p>

                        <p class="ytext">
                          为寄样品后请填写您的快递单号<span style="margin-left:20px"><el-checkbox v-model="checked">寄样需要与设计打样一起回寄</el-checkbox></span>
                        </p>
                        <p class="ytext">为了保证订单的顺利进行，寄送样品时请勿寄到付件。</p>
                        <!-- <div v-if="proofOrder.type == 2">
                          <br />
                          <a v-if="info.files.fileUrl != ''" class="layui-btn layui-btn-normal layui-btn-sm" :href="info.files.fileUrl" target="_blank">查看正稿文件</a><br /><br />
                        </div>
                        <el-button type="warning" v-if="proofOrder.type == 3 && proofOrder.confirmTime == '' && proofOrder.expressNo != ''" class="layui-btn layui-btn-normal layui-btn-sm submit_file" @click="openConfirm(proofOrder.id)">
                          确认订单
                        </el-button> -->
                      </td>
                    </tr>
                  </div>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- <div class="homeInfo_New"> -->
        <div class="homeInfo_New" v-if="proofOrder.payStatus > 0">
          <div class="boxDetails">
            <div class="Essential_information">
              <h1 class="titleYous yoursBox">客户文件</h1>
              <!-- <h1 class="titleYous yoursBox">上传补充文件</h1> -->
            </div>
            <div class="Consignee_Part" v-if="proofInfos[0].agentFileMap[7]">
              <table class="yousBox_Main sample">
                <tbody>
                  <div class="yousBox_MainDv" style="margin: 12px;" v-for="(info, index) in proofInfos" :key="index">
                    <tr class="tr_thNew" style="clear: both;">
                      <td class="yousBox01 ImgPart">
                        <template>
                          <div class="price-box">
                            <div class="cantitle">
                              客户文件：
                              <template v-if="info.agentFileMap[7]">
                                <p class="bcimg" v-for="val in info.agentFileMap[7]" :key="val.id">
                                  <a v-if="info.agentFileMap[7]" :href="baseUrl + val.fileUrl" target="_blank">{{ fileName(val.fileUrl) }}</a>
                                </p>
                              </template>
                            </div>
                          </div>
                        </template>
                      </td>
                    </tr>
                  </div>
                </tbody>
              </table>
            </div>
            <div class="Consignee_Part">
              <!-- <div class="Consignee_Part" v-if="proofInfos[0].agentFileMap[11]"> -->
              <table class="yousBox_Main sample">
                <tbody>
                  <div class="yousBox_MainDv" style="margin: 12px;" v-for="(info, index) in proofInfos" :key="index">
                    <tr class="tr_thNew" style="clear: both;">
                      <!-- <td class="yousBox01 ImgPart" style="width: 400px">
                        <div class="goodsFont" style="max-width: 99%">
                          <div class="box-info">
                            <div class="price-box">
                              <div class="cantitle">
                                补充图片：
                                <template v-if="info.agentFileMap[12]">
                                  <p class="bcimg" v-for="(n, i) in info.agentFileMap[12]" :key="i">{{ n.fileUrl.slice(n.fileUrl.lastIndexOf('/') + 1) }}</p>
                                </template>
                              </div>
                              <div class="price" v-if="!info.agentFileMap[12] || info.agentFileMap[12].length < 3">
                                <el-upload
                                  class="upload-demo"
                                  :headers="headers"
                                  action="/api/consumer/proof/miniProof/uploadProofFile"
                                  :on-remove="handleRemove"
                                  :before-remove="beforeRemove"
                                  :limit="3"
                                  :on-exceed="handleExceed"
                                  :on-success="handleAvatarSuccess"
                                >
                                  <span class="updatetxt red">上传图片</span>
                                </el-upload>
                              </div>
                              <div class="price-box" v-if="proofOrder.orderType == 5">
                                <p class="cantitle">结构文件：</p>
                                <div class="price">
                                  <el-upload
                                    class="upload-demo"
                                    :headers="headers"
                                    action="/api/consumer/proof/miniProof/uploadProofFile"
                                    :on-remove="handleRemove1"
                                    :before-remove="beforeRemove1"
                                    :limit="1"
                                    :on-exceed="handleExceed1"
                                    :on-success="handleAvatarSuccess1"
                                  >
                                    <span class="updatetxt red">上传文件/图片</span>
                                  </el-upload>
                                  <div slot="tip" class="el-upload__tip">请上传包装刀模/结构文件格式为：JPG、PDF、DWG 、CDR、AI、TIF、EPS、DXF。</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td> -->
                      <td class="yousBox01 ImgPart">
                        <!-- <template v-if="proofOrder.orderType == 6"></template> -->
                        <template>
                          <div class="price-box">
                            <div class="cantitle">
                              补充文件：
                              <template v-if="info.agentFileMap[11]">
                                <p class="pActive bcimg" v-for="(n, i) in info.agentFileMap[11]" :key="i">
                                  <a v-if="info.agentFileMap[11]" :href="baseUrl + n.fileUrl" target="_blank">{{ n.fileUrl.slice(n.fileUrl.lastIndexOf('/') + 1) }}</a>
                                </p>
                              </template>
                              <template v-if="addFileList.length">
                                <p class="pActive " v-for="vo in addFileList" :key="vo.uid">
                                  <a class="bcimg">{{ vo.response.data.slice(vo.response.data.lastIndexOf('/') + 1) }}</a>
                                  <i @click="addRemove(vo.uid)" class="el-icon-close delte"></i>
                                  <i class="el-icon-upload-success el-icon-circle-check suc"></i>
                                  <!-- <a class="bcimg"  :href="baseUrl + vo.fileUrl" target="_blank">{{ n.fileUrl.slice(n.fileUrl.lastIndexOf('/') + 1) }}</a> -->
                                </p>
                              </template>
                            </div>
                            <div class="price" v-if="(!info.agentFileMap[11] || info.agentFileMap[11].length < 3) && proofOrder.designStatus < '3'">
                              <!-- <el-upload
                                class="upload-demo"
                                :headers="headers"
                                action="/api/consumer/proof/miniProof/uploadProofFile"
                                :on-remove="handleRemove2"
                                :before-remove="beforeRemove2"
                                :limit="3"
                                :file-list="fileList"
                                :on-exceed="handleExceed2"
                                :on-success="handleAvatarSuccess2"
                              >
                                <span class="updatetxt red" style="cursor: pointer;">上传文档</span>
                              </el-upload> -->
                              <!-- :disabled="fileList.length == 3" -->

                              <el-upload
                                v-if="info.agentFileMap[11] ? info.agentFileMap[11].length + addFileList.length < 3 : addFileList.length < 3"
                                class="upCustom"
                                :headers="headers"
                                :show-file-list="false"
                                action="/api/consumer/proof/miniProof/uploadProofFile?file=addFiles"
                                :before-upload="file => beforeUploadFile(file)"
                                :on-success="(response, file, fileList) => uploadSuccessFn(response, file, fileList)"
                                :on-remove="(file, fileList) => handleRemoveFn(file, fileList)"
                              >
                                <div class="upLoading">
                                  <i style="margin-right: 10px;" class="el-icon-upload2"></i>
                                  <span>点击上传文件</span>
                                </div>
                              </el-upload>
                              <!-- <div slot="tip" class="el-upload__tip">请上传包装上所有产品规格、二维码、条码、说明等文字信息的文档，有遗漏会 影响设计结果</div> -->
                              <el-button style="margin-top: 12px; padding:5px 10px" type="primary" @click="submit">提交</el-button>
                            </div>
                          </div>
                          <!-- <div class="price-box">
                            <p class="cantitle">Logo或商标：</p>
                            <div class="price">
                              <el-upload
                                class="upload-demo"
                                :headers="headers"
                                action="/api/consumer/proof/miniProof/uploadProofFile"
                                :on-remove="handleRemove3"
                                :before-remove="beforeRemove3"
                                :limit="2"
                                :on-exceed="handleExceed3"
                                multiple
                                :on-success="handleAvatarSuccess3"
                              >
                                <span class="updatetxt red">上传图片</span>
                              </el-upload>
                              <div slot="tip" class="el-upload__tip">最多上传2张</div>
                            </div>
                          </div> -->
                        </template>
                      </td>
                    </tr>
                  </div>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="homeInfo_New">
          <div class="boxDetails">
            <div class="Essential_information">
              <h1 class="titleYous yoursBox">联系信息</h1>
            </div>
            <div class="Consignee_Part">
              <table class="Consignee_List">
                <tbody>
                  <tr class="tr_th">
                    <td class="yousBox01 BoxNum">
                      <span class="">您的联系信息</span>
                    </td>
                    <td class="yousBox02"></td>
                  </tr>
                  <tr>
                    <td class="left_Consignee">联系人</td>
                    <td class="right_Consignee">
                      <el-input
                        :disabled="proofOrder.designStatus == '3' || proofOrder.delType == 1 || proofOrder.delType == 2 || proofOrder.delType == 3"
                        @blur="subinfo('consigneeName')"
                        size="small"
                        style="width: 62%; text-indent: 0px"
                        v-model="consigneeName"
                        placeholder="输入联系人名称"
                      ></el-input>
                      <!-- <span v-if="proofOrder.consigneeName">{{ proofOrder.consigneeName }}</span
                      ><el-input v-else @blur="subinfo('consigneeName')" size="small" style="width: 30%; text-indent: 0px" v-model="consigneeName" placeholder="输入联系人名称"></el-input> -->
                    </td>
                  </tr>
                  <tr>
                    <td class="left_Consignee">联系电话</td>
                    <td class="right_Consignee">
                      <!-- <span v-if="proofOrder.tel">{{ proofOrder.tel }}</span> -->

                      <el-input
                        :disabled="proofOrder.designStatus == '3' || proofOrder.delType == 1 || proofOrder.delType == 2 || proofOrder.delType == 3"
                        @blur="subinfo('tel')"
                        style="width: 62%; text-indent: 0px"
                        size="small"
                        v-model="tel"
                        placeholder="输入联系电话"
                      ></el-input>
                      <!-- <el-input @blur="subinfo('tel')" v-else style="width: 30%; text-indent: 0px" size="small" v-model="tel" placeholder="输入联系电话"></el-input> -->
                    </td>
                  </tr>
                  <tr>
                    <td class="left_Consignee">样品回寄地址</td>
                    <td class="right_Consignee ">
                      <!-- <div class="nav-title-wrap"> -->
                      <!-- <div class="nav-title"> -->
                      <el-input
                        :disabled="proofOrder.designStatus == '3' || proofOrder.delType == 1 || proofOrder.delType == 2 || proofOrder.delType == 3"
                        @blur="subinfo('address')"
                        style="width: 62%;text-indent: 0px"
                        size="small"
                        v-model="address"
                        placeholder="输入样品回寄地址"
                      ></el-input>
                      <!-- </div>
                      </div> -->
                      <!-- <span v-if="proofOrder.address">{{ proofOrder.address }}</span
                      ><el-input v-else @blur="subinfo('address')" style="width: 30%; text-indent: 0px" size="small" v-model="address" placeholder="输入样品回寄地址"></el-input> -->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="homeInfo_New" v-if="proofOrder.orderType != 10">
          <div class="boxDetails">
            <div class="Essential_information">
              <h1 class="titleYous yoursBox">物流信息</h1>
            </div>
            <div class="Consignee_Part">
              <table class="Consignee_List">
                <tbody>
                  <tr v-if="proofOrderTrack.shipping">
                    <td class="left_Consignee">配送方式</td>
                    <td class="right_Consignee">{{ proofOrderTrack.shipping }}</td>
                  </tr>
                  <tr v-if="proofOrderTrack.expressNo">
                    <td class="left_Consignee">配送单号</td>
                    <td class="right_Consignee">{{ proofOrderTrack.expressNo }}</td>
                  </tr>
                  <tr v-else>
                    <td class="left_Consignee">配送方式</td>
                    <td class="right_Consignee">暂无配送</td>
                  </tr>
                  <tr v-if="proofOrderTrack.trackRecord != null">
                    <td></td>
                    <td>
                      <div class="logisticsBox">
                        <h2 class="logisticsH2">
                          <span class="logLtx">运单号:&nbsp;&nbsp;{{ proofOrderTrack.expressNo }}</span>
                          <span class="logRtx">
                            <!--0=>无轨迹 1=>已揽件 2=>在途中 3=>签收 4=>问题件-->
                            <div v-if="proofOrderTrack.state == 0">无轨迹</div>
                            <div v-if="proofOrderTrack.state == 1">已揽件</div>
                            <div v-if="proofOrderTrack.state == 2">在途中</div>
                            <div v-if="proofOrderTrack.state == 3">已签收</div>
                            <div v-if="proofOrderTrack.state == 4">问题件</div>
                          </span>
                        </h2>
                        <div v-if="proofOrderTrack.trackRecord != null" class="logisList">
                          <ul>
                            <template v-for="(vo, index) in proofOrderTrack.trackRecord">
                              <li v-if="index == 0" :key="index">
                                <span class="logNew">最新</span>
                                <div class="logListDv">
                                  <p class="logListDvtx red">{{ vo.trackDetail }}</p>
                                  <p class="logListTime">{{ formatSecond(vo.trackTime) }}</p>
                                </div>
                              </li>
                              <li :key="index + '_old'" v-else>
                                <span class="logListCircle"></span>
                                <div class="logListDv">
                                  <p class="logListDvtx">{{ vo.trackDetail }}</p>
                                  <p class="logListTime">{{ formatSecond(vo.trackTime) }}</p>
                                </div>
                              </li>
                            </template>
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="homeInfo_New">
          <div class="boxDetails">
            <div class="Essential_information">
              <h1 class="titleYous yoursBox">结算信息</h1>
            </div>
            <div class="Consignee_Part">
              <table class="Consignee_List">
                <tbody>
                  <tr>
                    <td class="left_Consignee">订单总金额</td>
                    <!-- <td v-if="proofOrder.orderType == 10" class="right_Consignee">基础盒型原创设计：{{ proofInfos.length }} x 300 = {{ proofInfos.length * 300 }} 元</td> -->
                    <td v-if="proofOrder.orderType == 10" class="right_Consignee">基础盒型原创设计：{{ proofInfos.length }} x {{ proofOrder.amount }} = {{ proofInfos.length * proofOrder.amount }} 元</td>
                    <td v-else-if="proofOrder.orderType == 9" class="right_Consignee">精装盒原创设计：{{ proofInfos.length }} x {{ proofOrder.amount }} = {{ proofOrder.amount }} 元</td>
                    <!-- <td v-if="proofOrder.orderType == 5 || proofOrder.orderType == 9" class="right_Consignee">{{proofOrder.orderType == 5?"基础盒型原创设计":'精装盒原创设计'}}：{{ proofInfos.length }} x 300 = {{ proofInfos.length * 300 }} 元</td> -->
                    <!-- <td v-else class="right_Consignee">打样金额：{{ proofOrder.amount }}元 + 运费：{{ proofOrder.shipfee }} = 订单总金额： {{ proofOrder.amount + proofOrder.shipfee }} 元</td> -->
                  </tr>
                  <tr v-if="proofOrder.payStatus < 1">
                    <td class="left_Consignee">支付信息</td>
                    <td v-if="proofOrder.delType == 2 && proofOrder.status == 3" class="right_Consignee"><a>未支付取消</a></td>
                    <td v-else-if="proofOrder.delType == 1 && proofOrder.status == 5" class="right_Consignee"><a>支付取消</a></td>
                    <td v-else-if="proofOrder.delType == 3 && proofOrder.status == 3" class="right_Consignee"><a>系统终止</a></td>
                    <td v-else class="right_Consignee"><a @click="toPayOrder" target="_blank" class="payOrder">去支付</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </el-main>
    <!--main end-->
    <!-- <button @click="demofn">123</button> -->
  </div>
</template>

<script>
import { getAllProofOrder, ProofOrderSend, updateAgentInfo, zipDownload, updateDesignOrderFile, updateProofInfosFiles } from '@/api/users/userDemandApi';
import { formatSecond } from '@/utils/timeUtil';

export default {
  data() {
    return {
      checked: false,
      proofOrder: {},
      proofInfos: [],
      proofOrderTrack: {},
      headers: {
        token: localStorage.getItem('Access-Token'),
        Authorization: localStorage.getItem('Access-Token')
      },
      orderSn: '',
      baseUrl: 'http://alifile.xiaocaiyin.com/',
      subOrderId: '',
      consigneeName: '',
      tel: '',
      address: '',
      agentExpressNo: '',
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      imgList: [],
      fileList: [],
      addFileList: [],
      logoFileList: [],
      structFile: '',
      comfirmed: false,
      newAddsInfo: {
        address: '深圳市龙岗区坂田街道岗头社区岗溪路3号创信时代大厦21楼（拒收到付）',
        name: '孟强',
        tel: '18938913665'
      }
    };
  },
  created() {
    sessionStorage.clear();
  },
  methods: {
    ...{ formatSecond },
    listProofOrderDetail() {
      getAllProofOrder({ orderSn: this.orderSn })
        .then(res => {
          this.$set(this, 'proofOrder', res.data[0]);
          this.$set(this, 'proofInfos', res.data[0].proofInfos);
          this.$set(this, 'proofOrderTrack', res.data[0].orderTrack);
          this.checked = this.proofOrder.expressNoDefault == 1 ? true : false;
          this.tel = this.proofOrder.tel;
          this.consigneeName = this.proofOrder.consigneeName;
          this.address = this.proofOrder.address;
          // console.log('this.proofOrder', this.proofOrder);
          if (this.proofOrder.diffOrder.length) {
            this.comfirmed = this.proofOrder.diffOrder.every(item => item.status == 'paid');
            // console.log('this.comfirmed', this.comfirmed);
          } else {
            this.comfirmed = true;
          }
        })
        .catch(err => {
          console.log(err.message);
        });
    },
    confirmFiles(id) {
      const parm = {
        filesId: id, //设计文件id
        orderSn: this.orderSn //订单号
      };
      if (this.comfirmed) {
        updateProofInfosFiles(parm).then(res => {
          this.listProofOrderDetail();
        });
      } else {
        this.$message.error('当前存在补差价订单，请先支付再确认！');
      }
    },
    fileName(url) {
      let urlList = url.split('/');
      return urlList[urlList.length - 1];
    },
    demofn() {
      this.updateDesignOrderFilefn('imgList');
    },
    copy(data) {
      //创建一个input元素
      let input = document.createElement('input');
      //给input的内容复制
      input.value = data;
      // 在body里面插入这个元素
      document.body.appendChild(input);
      // 选中input里面内容
      input.select();
      //执行document里面的复制方法
      document.execCommand('Copy');
      // 复制之后移除这个元素
      document.body.removeChild(input);
      this.$message({
        message: '复制成功',
        type: 'success'
      });
    },
    subinfo(name) {
      console.log('nanana', [name]);
      // console.log(this.userass);
      // console.log(this.username);
      // console.log(this.userphone);
      if (this[name]) {
        let parms;
        if (name == 'agentExpressNo') {
          parms = { orderSn: this.proofOrder.orderSn, [name]: this[name], expressNoDefault: this.checked ? 1 : 0 };
        } else {
          parms = { orderSn: this.proofOrder.orderSn, [name]: this[name] };
        }
        console.log('parms', parms);
        updateAgentInfo(parms).then(res => {
          if (res.code == '000000') {
            this.listProofOrderDetail();
            this.$message({
              type: 'success',
              message: '修改成功'
            });
          } else {
            this.$message({
              type: 'error',
              message: res.message
            });
          }
        });
      }
    },
    beforeUploadFile(file, type) {
      console.log('file333', file);
    },
    //上传成功的方法
    uploadSuccessFn(response, file, fileList, type, fId) {
      // console.log(file);
      // this.fileList.push(response.data);
      this.fileList = [];
      this.addFileList.push(file);

      console.log('fileListfileList', fileList);
      console.log('this.fileList6666', this.addFileList);
    },
    submit() {
      // console.log('this.fileList777', this.fileList);
      this.addFileList.map(item => {
        this.fileList.push(item.response.data);
      });
      if (this.fileList.length) {
        this.updateDesignOrderFilefn('fileList');
      }
      this.addFileList = [];
      this.fileList = [];
    },
    // 文件列表移除文件时的钩子
    handleRemoveFn(file, fileList) {
      // console.log('handleRemove--fileList', fileList);
      // this.fileList = fileList;
      this.addFileList.push(...fileList);
      // this.fileList = [];
      // fileList.map(item => {
      //   this.fileList.push(item.response.data);
      // });
      console.log('this.fileList3333', this.fileList);
    },
    addRemove(uid) {
      let index = this.addFileList.findIndex(item => item.uid == uid);
      this.addFileList.splice(index, 1);
      console.log('addFileList', this.addFileList);
    },
    //上传成功的方法
    // uploadSuccess(response, file, fileList) {
    //   if (response.success) {
    //     // this.listProofOrderDetail();
    //     console.log(response.data);

    //     this.$message({
    //       type: 'success',
    //       message: '上传成功'
    //     });
    //   } else {
    //     this.$message({
    //       type: 'error',
    //       message: response.message
    //     });
    //   }
    // },
    //上传失败执行的方法
    // uploadError(err, file, fileList) {
    //   // console.log(err);
    //   this.$message({
    //     type: 'error',
    //     message: '上传失败'
    //   });
    // },
    updateDesignOrderFilefn(data) {
      // console.log({ orderSn: this.proofOrder.orderSn, [data]: this[data] });
      updateDesignOrderFile({ orderSn: this.proofOrder.orderSn, [data]: this[data] }).then(res => {
        console.log(res);
        if (res.code == '000000') {
          this.listProofOrderDetail();
        }
      });
    },
    // beforeAvatarUpload(file) {
    //   const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1);
    //   const whiteList = ['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG'];
    //   if (whiteList.indexOf(fileSuffix) === -1) {
    //     this.$message.error('上传图片只能是 jpg、png格式', 'error');
    //     return false;
    //   }
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //   if (!isLt2M) {
    //     this.$message.error('上传文件大小不能超过 2MB', 'error');
    //     return false;
    //   }
    // },
    // handleAvatarSuccess(res, file, fileList) {
    //   this.imgList = [];
    //   if (res.code == '000000') {
    //     this.imgList.push(res.data);
    //     this.updateDesignOrderFilefn('imgList');
    //   } else {
    //     this.$message.error(file.name + '上传失败');
    //     var index = fileList.findIndex(val => val.response.code == '999999');
    //     this.$message.error(file.name + '上传失败');
    //     fileList.splice(index, 1);
    //   }
    // },
    // handleAvatarSuccess1(res, file) {
    //   if (res.code == '000000') {
    //     this.structFile = res.data;
    //   } else {
    //     this.$message.error(file.name + '上传失败');
    //     for (let key in file) {
    //       delete file[key];
    //     }
    //   }
    // },
    // handleAvatarSuccess2(res, file, fileList) {
    //   this.fileList = [];
    //   if (res.code == '000000') {
    //     this.fileList.push(res.data);
    //     this.updateDesignOrderFilefn('fileList');
    //   } else {
    //     var index = fileList.findIndex(val => val.response.code == '999999');
    //     this.$message.error(file.name + '上传失败');
    //     fileList.splice(index, 1);
    //   }
    // },
    // handleAvatarSuccess3(res, file, fileList) {
    //   if (res.code == '000000') {
    //     this.logoFileList.push(res.data);
    //     this.updateDesignOrderFilefn('logoFileList');
    //   } else {
    //     var index = fileList.findIndex(val => val.response.code == '999999');
    //     this.$message.error(file.name + '上传失败');
    //     fileList.splice(index, 1);
    //   }
    // },
    handleRemove(file, fileList) {
      this.imgList = fileList.map(e => {
        return e.response.data;
      });
    },
    // handlePictureCardPreview(file) {
    //   this.dialogImageUrl = file.url;
    //   this.dialogVisible = true;
    // },
    // handleDownload(file) {
    //   console.log(this.fileList);
    // },
    // handleChange(file, fileList) {
    //   const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1);
    //   const whiteList = ['jpg', 'png', 'jpeg', 'JPG', 'PNG', 'JPEG'];
    //   if (whiteList.indexOf(fileSuffix) === -1) {
    //     fileList.splice(-1, 1);
    //     return false;
    //   }
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //   if (!isLt2M) {
    //     fileList.splice(-1, 1);
    //     return false;
    //   }
    //   this.fileList = fileList.slice(-6);
    // },
    upper() {
      console.log(12);
      this.$emit('changeactive', 0);
    },
    // handleRemove1(file, fileList) {
    //   this.structFile = '';
    //   console.log(1, file, fileList);
    // },
    // handleExceed1(files, fileList) {
    //   this.$message.warning(`结构文件只能上传一个`);
    // },
    // handleExceed(files, fileList) {
    //   this.$message.warning(`图片只能上传一张`);
    // },
    // beforeRemove(file, fileList) {
    //   return this.$confirm(`确定移除 ${file.name}？`);
    // },
    // beforeRemove1(file, fileList) {
    //   return this.$confirm(`确定移除 ${file.name}？`);
    // },
    // handleRemove2(file, fileList) {
    //   console.log('fileList', fileList);
    //   this.fileList = fileList.map(e => {
    //     return e.response.data;
    //   });
    // },
    // handleExceed2(files, fileList) {
    //   this.$message.warning(`文字文件最多只能上传2个`);
    // },
    // beforeRemove2(file, fileList) {
    //   return this.$confirm(`确定移除 ${file.name}？`);
    // },
    // handleRemove3(file, fileList) {
    //   this.logoFileList = fileList.map(e => {
    //     return e.response.data;
    //   });
    // },
    // handleExceed3(files, fileList) {
    //   this.$message.warning(`文字文件最多只能上传2个`);
    // },
    // beforeRemove3(file, fileList) {
    //   return this.$confirm(`确定移除 ${file.name}？`);
    // },
    openConfirm(id) {
      this.$confirm('确认完成打样订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel',
        type: 'warning'
      })
        .then(() => {
          ProofOrderSend({ id: id })
            .then(res => {
              if (res.success) {
                this.listProofOrderDetail();
                this.$message({
                  type: 'success',
                  message: '确认成功!'
                });
              } else {
                this.$message({
                  type: 'error',
                  message: res.message
                });
              }
            })
            .catch(err => {
              // console.log(err);
              this.$message({
                type: 'error',
                message: '确认失败!'
              });
            });
        })
        .catch(() => {});
    },
    // 去支付
    toPayOrder() {
      this.$router.push({ path: '/service/getpay', query: { orderNo: this.proofOrder.supOrderNo, subOrderId: this.proofOrder.orderSn, design: true } });
    },
    downloaddesign() {
      let flie = this.proofInfos[0].agentFileMap[6];
      let fliearr = flie.map(e => {
        return e.fileUrl;
      });
      let data = {
        name: '压缩包',
        fileList: fliearr
      };
      console.log('flie', flie);
      if (this.proofInfos[0].agentFileMap[6].length == 1) {
        window.location.href = '/api/consumer/certifyFree/alibaba/oss/getDownloadFile?fileName=' + flie[0].fileUrl;
      } else {
        zipDownload(data).then(res => {
          console.log(res);
        });
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
    // 补差价
    toPayDiffOrder(orderNo) {
      // this.diffDialog = true;
      let routerPath = { path: '/user/demanddetail', query: { id: this.proofOrder.orderSn } };
      sessionStorage.setItem('cachePath', JSON.stringify(routerPath));
      this.$router.push({ path: '/service/diffpay', query: { orderNo: orderNo } });
    }
  },

  mounted() {
    this.orderSn = this.$route.query.id;
    this.listProofOrderDetail();
  }
};
</script>

<style scope src="../../static/index/user/css/reset.css" />
<style scope src="../../static/index/user/css/all.css?0621" />
<style scope src="../../static/index/user/css/foot.css" />
<style scope src="../../static/index/user/css/main.css" />
<style>
.nav-title-wrap {
  width: auto;
  min-width: 180px;
  /* margin: 0 12px; */
  position: relative;
}
.nav-title {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.nav-title /deep/ .el-input {
  font-size: 16px;
}
.designdetailbox .el-upload-list {
  display: none !important;
}
.price .el-upload-list {
  display: block !important;
}
.price .el-upload-list__item {
  width: 400px;
}
.yousBox02 .el-checkbox__label {
  font-size: 12px;
  padding-left: 5px;
}
</style>
<style scoped>
.pActive {
  cursor: pointer;
  width: 400px;
  display: flex;
  justify-content: space-between;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  align-items: center;
}
.bcimg {
  width: 800px !important;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: #666666;
}
.pActive .delte {
  display: none;
  cursor: pointer;
}
.pActive:hover .suc {
  display: none;
}
.pActive .suc {
  color: #67c23a;
}
.pActive:hover .delte {
  display: inline-block;
}
.upLoading {
  width: 110px;
  height: 30px;
  line-height: 30px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #ff0000;
  color: #ff0000;
  font-size: 12px;
  margin-top: 20px;
}
.tds {
  width: 100px;
  /* padding-left: 10px; */
}

.wbb1022File {
  cursor: pointer;
}
.payOrder {
  padding: 5px 10px;
  text-indent: 0;
}

.paydiv {
  width: 150px;
  margin: 25px auto 0;
}

.copytxt {
  color: red;
  text-decoration: underline;
  margin-left: 15px;
  line-height: 20px;
  cursor: pointer;
}

.floatleft {
  float: left;
}

.right_Consignee .floatleft {
  top: 6px;
  margin-right: 10px;
}

.goodsFont .goodsFont_One {
  width: 300px;
  padding: 2px 10px;
  padding-left: 15px;
}
.goodsFont_One img {
  float: left;
}
.goodsFont_One span {
  float: right;
  margin-top: 50px;
}
.goodsFont {
  padding: 10px 0;
}
.payOrder {
  margin: 5px 0 5px 0;
  cursor: pointer;
}

.logisticsBox {
  background: #fff;
  padding: 0 25px 25px;
  color: #131313;
  margin-bottom: 20px;
  position: relative;
  text-indent: 0;
}

.logisticsH2 {
  margin-bottom: 10px;
  position: relative;
  border-bottom: 1px solid #e9e9ee;
  line-height: 46px;
  font-weight: normal;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
}

.logRtx {
  color: #1bc723;
  font-size: 15px;
}

.logisList {
  background-color: #fff;
}

.logisList ul {
  padding: 10px 0 0 20px;
}

.logisList li {
  border-left: 1px solid #e9e9ee;
  position: relative;
}
.sample .yousBox02 {
  width: 27%;
  height: 58px;
  line-height: 58px;
}
.ytext {
  color: #666;
  height: 20px;
  text-align: left;
  margin-top: 10px;
}
.addressbox p {
  color: #666;
}
.logNew {
  width: 40px;
  height: 17px;
  line-height: 17px;
  background: #fd000d;
  color: #fff;
  left: -20px;
  top: 8px;
  border-radius: 0;
  padding: 0;
  border: 0;
  text-align: center;
  font-size: 12px;
  display: block;
  position: absolute;
}
.goodsFont .goodsFont_One {
  width: 60%;
  float: left;
}
.logListCircle {
  display: block;
  width: 8px;
  height: 8px;
  padding: 2px;
  background: #fff;
  border: 1px solid #33a2f7;
  border-radius: 100%;
  position: absolute;
  left: -7px;
  top: 6px;
  z-index: 2;
}

.logListCircle::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: #33a2f7;
  border-radius: 100%;
}

.logListDv {
  padding-left: 40px;
  position: relative;
  padding-bottom: 10px;
}

.logListDvtx {
  font-size: 14px;
}

.logListTime {
  font-size: 12px;
  color: #a1a1a1;
  line-height: 22px;
  padding-left: 6px;
}

.red {
  color: #fd000d;
}
.Consignee_List tr td {
  line-height: 50px;
}
.cantitle {
  font-size: 16px;
  line-height: 40px;
}
.updatetxt {
  font-size: 16px;
  line-height: 30px;
}
.bcimg {
  font-size: 12px;
  line-height: 20px;
  overflow: hidden;
  height: 20px;
  margin: 10px 36px;
}
</style>
