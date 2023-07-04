<template>
  <div>
    <listLayout>
      <template #header>
      <div class="top-bar">
        <el-form :inline="true" :model="termParams" class="demo-form-inline" label-width="120px" ref="formRef">
          <el-form-item label="PO号" prop="poNo">
            <el-input v-model.trim="termParams.poNo" placeholder="请输入PO号" clearable style="width:252px;" />
          </el-form-item>
          <el-form-item label="结构状态" prop="status">
            <el-select v-model="termParams.status" placeholder="所有状态" clearable style="width:252px;">
              <!-- <el-option label="未领取" :value="1" /> -->
              <el-option label="已领取" :value="2" />
              <el-option label="被驳回" :value="4" />
              <el-option label="已撤回" :value="9" />
            </el-select>
          </el-form-item>
          <el-form-item label="业务员" prop="salesman">
            <el-input v-model.trim="termParams.salesman" placeholder="请输入业务员名称" clearable style="width:252px;" />
          </el-form-item>
          
        </el-form>
        <div class="form-tool-bar">
          <div style="min-width:160px;width:160px;">
            <el-button @click="resetFormParams">重置</el-button>
            <el-button type="primary" @click="search">搜索</el-button>
          </div>
        </div>
      </div>
      </template>
        <template #table-header>
          <div class="top-bar">
            <div class="titleBox">
              <div class="listText">
                <div style="line-height: 32px;">
                  个人结构工作台
                </div>
                <el-badge :value="revokeMsgCount||0" :max="99" class="msgbtn" @click="isRevokeShow = true">
                  <el-button type="warning">撤单消息</el-button>
                </el-badge>
              </div>
              <div class="disposeBox">
                <div style="width:300px;margin-right:20px;">
                  <el-input
                    v-model.trim="taskPO"
                    placeholder="请输入PO号"
                    @keydown.enter="searchTask"
                    style="margin-right: 20px;"
                  >
                    <template #append>
                      <el-button type="primary" style="background:#409EFF;color:#fff;border-radius: 0 5px 5px 0;" @click="searchTask">搜索并领取</el-button>
                    </template>
                  </el-input>
                </div>
                <Counter :processing="processing" :toBeProcessed="toBeProcessed"/>
                <el-button class="getTask" style="margin-left:15px;" type="primary" @click="receiveTask">领取任务</el-button>
              </div>
            </div>
          </div>
        </template>
        <!--结构文件列表  -->
        <template #table-content='tableHeight'>
          <div class="outworkListBox">
            <el-table
              :data="tableData"
              :height='tableHeight.tableHeight'
              scrollbar-always-on
              row-key="id"
              ref="multipleTable"
            >
              <el-table-column label="PO号" width="200">
                <template #default="scope">
                  <div>
                    <!-- <span class="turn" v-if="scope.row.orderFlag == 1">翻</span> -->
                    <poView :po-no="scope.row.poNo" type="2"></poView>
                    <!-- <span>{{ scope.row.poNo || "-" }}</span>
                    <el-icon
                      v-copyText="scope.row.poNo"
                      v-copyText:callback="copyTextSuccess"
                      v-if="scope.row.poNo"
                      class="gesture"
                    >
                      <CopyDocument />
                    </el-icon> -->
                    <div><el-tag v-if="scope.row.transfer=='是'" effect="dark">转单</el-tag></div>
                    <!-- <div
                      style="margin-top: 5px"
                      v-if="scope.row.allowModificationOfDie"
                    >
                      <el-tag class="mx-1" effect="dark">
                        {{
                          scope.row.allowModificationOfDie==1 ? "允" : "不"
                        }}许对设计文件、刀模文件进行生产规范化修正
                      </el-tag>
                    </div> -->
                    <div style="margin-top: 5px">
                      <el-tag hit>{{scope.row.productName}}</el-tag>
                      <followInfoFlag  :row="scope.row" name='structuralFollow' type="2"></followInfoFlag>
                      <ThreeDayFlag  style="margin-top:5px" :row="scope.row" ></ThreeDayFlag>
                    </div>
                    <div style="margin-top: 5px" v-if="scope.row.isAgain">
                      <el-tag style="background:#169BD5;color:#fff;">翻单订单</el-tag>
                    </div>
                    <div class="divsn" v-if="scope.row.originalBulkOrderNumber">
                      <p>原大货订单号：</p>
                      <poView :po-no="scope.row.originalBulkOrderNumber" type="2" :copy="false"></poView>
                    </div>
                    <div class="divsn" v-if="scope.row.associatedTrackingNumber">
                      <p>关联打样订单号：</p>
                      <poView :po-no="scope.row.associatedTrackingNumber" :copy="false"></poView>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="业务员" width="200px">
                <template #default="scope">
                  <div>
                    <p v-show="scope.row.salesman">
                      <span class="TimeTitle">业务员：</span><br/>
                      <span class="TimeCon">{{ scope.row.salesman || "-" }}</span>
                    </p>
                    <p v-show="scope.row.createTime">
                      <span class="TimeTitle">推送结构时间：</span>
                      <br/>
                      <span class="TimeCon">{{ scope.row.createTime || "-" }}</span>
                    </p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="工单参数" width="310">
                <template #default="scope">
                  <OrderAttrShow :attr="scope.row.productAttr" :pname="scope.row.productName" :activityId="scope.row.id" type="structure"></OrderAttrShow>
                  <!-- <div>
                    <el-link
                      @click="seeAll(scope.row.productAttr)"
                      :underline="false"
                    >
                      <span class="property">{{
                        scope.row.productAttr || "-"
                      }}</span>
                    </el-link>
                  </div> -->
                </template>
              </el-table-column>
              <el-table-column label="备注" width="100">
                <template #default="scope">
                  <div>
                    <RemarkDialog :order="scope.row" type="structure" :proxyType="ac_remark_type" @changeRemark="changeRemark" />
                  </div>
                  <div>
                    <el-link
                      v-if="scope.row.orderRemark"
                      type="primary"
                      :underline="false"
                      @click="showAttr(scope.row.orderRemark,'订单备注')"
                      >订单备注</el-link
                    >
                  </div>
                  <!-- <div>
                    <el-link
                      v-if="scope.row.transfer=='是'&&scope.row.transferRemark"
                      type="primary"
                      :underline="false"
                      @click="showAttr(scope.row.transferRemark,'转单备注')"
                      >转单备注</el-link
                    >
                  </div>
                  <div>
                    <el-link
                      v-if="scope.row.remark"
                      type="primary"
                      :underline="false"
                      @click="remarkclick(scope.row.remark)"
                      >结构备注</el-link
                    >
                  </div> -->
                </template>
              </el-table-column>
              <el-table-column label="客户文件" width="250">
                <template #default="scope">
                  <div v-if="scope.row.customerFiles?.length > 0" class="gesture">
                    <div v-show="scope.row?.aiFile?.cutUrl||scope.row?.aiFile?.outlineImg" style="font-size: 16px;font-weight: 600;text-align: center;margin: 10px auto;">已完成预处理</div>
                    <template
                      v-for="(item, index) in scope.row.customerFiles"
                      :key="index"
                    >
                      <FileShow title="客户文件：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)"/>
                      <!-- <el-popover
                        placement="top-start"
                        trigger="hover"
                        :content="item.fileName"
                      >
                        <template #reference>
                          <div
                            style="word-break: break-all;"
                            @click="openFile(item.fileAddress)"
                          >
                            <span v-if="scope.row.customerFiles.length > 1"
                              >部件{{ toChineseNumber(index + 1) }}:</span
                            >
                            <span style="margin-right: 6px;">{{ item.fileName }}</span>
                            <singDownFile :url="item.fileAddress"></singDownFile>
                          </div>
                        </template>
                      </el-popover> -->
                      <div v-show="scope.row?.aiFile?.outlineImg">
                        <div style="margin-bottom: 6px;margin-right: 6px;" v-show="scope.row?.aiFile?.outlineImg">
                          <!-- <el-tag effect="dark" style="margin-right: 6px;">客户刀线图</el-tag> -->
                          <!-- <singDownFile :url="scope.row?.aiFile?.outlineImg"></singDownFile> -->
                          <FileShow title="客户刀线图：" :filename="scope.row?.aiFile?.outlineImg" :fileurl="senseUrl(BASE_FILE_URL + scope.row?.aiFile?.outlineImg)"/>
                        </div>
                        <!-- <div v-show="scope.row?.aiFile?.cutUrl">
                          <el-tag effect="dark" style="margin-right: 6px;">已经自动匹配盒型库文件</el-tag>
                          <el-link type="primary" :underline="false" :href="scope.row?.aiFile?.cutUrl" target="_blank">下载</el-link>
                        </div> -->
                      </div>
                    </template>
                  </div>
                  <!-- <div v-else>-</div> -->
                </template>
              </el-table-column>
              <el-table-column label="结构文件" width="200">
                <template #default="scope">
                  <!-- {{scope.row}} -->
                    <StructureFile 
                    v-if="scope.row.annexUploadVO&&scope.row.productName.indexOf('精装盒')===-1"
                    :order-id='rowId'
                    :drawerData="scope.row"
                    @changeList="getAllList()"
                    @doneclick="doneclick"
                    bulk/>
                    <FileShow v-if="scope.row?.aiFile?.cutUrl" title="系统匹配刀线：" :filename="scope.row?.aiFile?.cutUrl" :fileurl="senseUrl(BASE_FILE_URL + scope.row?.aiFile?.cutUrl)"/>
                    <div v-if="scope.row.productName.indexOf('精装盒')>-1">
                      <el-button
                        :underline="false"
                        class="mar_10"
                        @click="uploadOutwork(scope.row)"
                        >上传文件</el-button
                      >
                    </div>
                </template>
              </el-table-column>
            <el-table-column label="状态/耗时(小时)" width="150">
              <template #default="scope">
                <!-- <div style="display: flex;">
                  <DictTag :value="scope.row.status" :options="ac_structure_newstatus"/>
                  <span v-show="scope.row?.duration">/{{scope.row?.duration}}</span>
                </div> -->
                <div style="display:flex;">
                  <!-- <span v-if="scope.row.status==6">被撤回</span> -->
                  <DictTag :value="scope.row.status" :options="ac_structure_newstatus"/>
                  <span v-if="scope.row.status==1">
                    /{{getHour(scope.row.createTime)}}
                  </span>
                  <span v-else-if="scope.row.status==2||scope.row.status==4||scope.row.status==9">
                    /{{getHour(scope.row.startTime)}}
                  </span>
                  <template v-else>
                    <span v-if="scope.row?.duration">/{{scope.row?.duration}}</span>
                  </template>
                </div>
              </template>
            </el-table-column>
              <!-- <el-table-column label="设计正稿文件" width="200">
                <template #default="scope">
                  <div v-if="scope.row.originalDTO" class="gesture">
                    <el-popover
                      placement="top-start"
                      trigger="hover"
                      v-for="(item, index) in scope.row.originalDTO.annexes"
                      :key="item.fileAddress"
                      :content="item.fileName"
                    >
                      <template #reference>
                        <div
                          class="text-overflow gesture"
                          style="width: 180px"
                          @click="openFile(item.fileAddress)"
                        >
                          <span v-if="scope.row.originalDTO.annexes.length > 1"
                            >部件{{ toChineseNumber(index + 1) }}:</span
                          >
                          {{ item.fileName }}
                        </div>
                      </template>
                    </el-popover>
                  </div>
                  <div v-if="scope.row.originalDTO == null">-</div>
                </template>
              </el-table-column> -->
              
              <!-- <el-table-column label="正稿备注" width="200">
                <template #default="scope">
                  <div v-if="scope.row.originalDTO">
                    <el-popover
                      placement="top-start"
                      trigger="hover"
                      :content="scope.row.originalDTO.originalRemark"
                      popper-class="popper_note"
                      v-if="scope.row.originalDTO.originalRemark"
                    >
                      <template #reference>
                        <div class="text-overflow" style="width: 153px">
                          {{ scope.row.originalDTO.originalRemark }}
                        </div>
                      </template>
                    </el-popover>
                  </div>
                  <div v-else>-</div>
                </template>
              </el-table-column> -->
              <!-- <el-table-column label="业务员" >
                <template #default="scope">
                  <div>{{ scope.row.salesman || "-" }}</div>
                </template>
              </el-table-column>
              <el-table-column label="文件推送人" width="90">
                <template #default="scope">
                  <div>
                    {{ scope.row.fileSender || "-" }}
                  </div>
                </template>
              </el-table-column> -->
              <!-- <el-table-column label="是否转单" width="200">
                <template #default="scope">
                  <div>{{ scope.row.transfer || "-" }}</div>
                </template>
              </el-table-column> -->
              <!-- <el-table-column label="转单备注" width="200">
                <template #default="scope">
                  <div v-if="!scope.row.transferRemark">-</div>
                  <el-popover
                    placement="top-start"
                    trigger="hover"
                    :content="scope.row.transferRemark"
                    popper-class="popper_note"
                    v-if="scope.row.transferRemark"
                  >
                    <template #reference>
                      <div class="text-overflow" style="width: 153px">
                        {{ scope.row.transferRemark }}
                      </div>
                    </template>
                  </el-popover>
                </template>
              </el-table-column> -->
              <!-- <el-table-column label="客户源文件上传时间" width="160">
                <template #default="scope">
                  <div v-if="scope.row.customerFiles.length > 0">
                    {{ scope.row.customerFiles[0].uploadTime }}
                  </div>
                  <div v-else>-</div>
                </template>
              </el-table-column>
              <el-table-column label="推送结构时间" width="160">
                <template #default="scope">
                  <div>{{ scope.row.createTime || "-" }}</div>
                </template>
              </el-table-column>
              <el-table-column label="结构任务领取时间" width="160">
                <template #default="scope">
                  <div>{{ scope.row.startTime || "-" }}</div>
                </template>
              </el-table-column> -->
              <el-table-column fixed="right" label="操作">
                <template #default="scope">
                  <div class="operate">
                    <template v-if="scope.row.status!=1">
                      <!-- <div>
                        <el-link
                          type="primary"
                          :underline="false"
                          class="mar_10"
                          @click="uploadOutwork(scope.row)"
                          >上传结构</el-link
                        >
                      </div> -->
                      <div>
                        <el-link
                          v-if="scope.row?.annexUploadVO?.positionFlag != 2"
                          type="primary"
                          :underline="false"
                          class="mar_10"
                          :disabled="!scope.row.isUpload||!scope.row?.annexUploadVO?.annexVOS||!scope.row?.annexUploadVO?.annexVOS[0]?.position"
                          @click="doneclick(scope.row)"
                          >完成并冻结</el-link
                        >
                        <el-link
                          v-else
                          type="primary"
                          :underline="false"
                          class="mar_10"
                          :disabled="!scope.row.isUpload"
                          @click="doneclick(scope.row)"
                          >完成并冻结</el-link
                        >
                      </div>
                      <div>
                        <el-link
                          type="primary"
                          :underline="false"
                          class="mar_10"
                          @click="reject(scope.row.id, scope.row.poNo)"
                          >驳回</el-link
                        >
                        </div>
                        <blisterNato @updateList='getList' :row='scope.row'></blisterNato>
                        <div v-if="scope.row.status!=1">
                          <el-link
                          type="primary"
                          :underline="false"
                          class="mar_10"
                          @click="transferSheet(scope.row.id)"
                          >转移结构单</el-link
                        >
                        </div>
                        <!-- <div>
                          <el-link
                          type="primary"
                          :underline="false"
                          class="mar_10"
                          @click="backFile(scope.row.id)"
                          >退回文件推送前</el-link
                        >
                        </div> -->
                    </template>
                    <template v-if="scope.row.status==1">
                      <el-link
                        type="primary"
                        :underline="false"
                        class="mar_10"
                        @click="receiveTask(scope.row.id)"
                        >领取</el-link
                      >
                    </template>
                    <el-popover placement="bottom" width="300px;" trigger="click" v-if="false">
                      <template #reference>
                        <el-button size="small" style="margin-left: 10px">
                          <el-icon>
                            <More />
                          </el-icon>
                        </el-button>
                      </template>
                      <div class="downBoX">
                        <div>
                          <el-button
                            class="downBtn"
                            text
                            @click="reject(scope.row.id, scope.row.poNo)"
                            >驳回</el-button
                          >
                        </div>
                        <blisterNato @updateList='getList' :row='scope.row'></blisterNato>
                        <div>
                          <el-button
                            class="downBtn"
                            text
                            @click="backFile(scope.row.id)"
                            >退回文件推送前</el-button
                          >
                        </div>
                        <div v-if="scope.row.status!=1">
                          <el-button
                            class="downBtn"
                            text
                            @click="transferSheet(scope.row.id)"
                            >转移结构单</el-button
                          >
                        </div>
                        <div>
                          <el-button
                            class="downBtn"
                            text
                            :disabled="downDisabled(scope.row.customerFiles, 0)"
                            @click="downFile(scope.row.customerFiles, 0)"
                            >下载客户源文件</el-button
                          >
                        </div>
                        <div>
                          <el-button
                            class="downBtn"
                            text
                            @click="
                              downFile(
                                scope.row.originalDTO
                                  ? scope.row.originalDTO.annexes
                                  : '',
                                1
                              )
                            "
                            :disabled="
                              downDisabled(
                                scope.row.originalDTO
                                  ? scope.row.originalDTO.annexes
                                  : '',
                                0
                              )
                            "
                            >下载正稿文件</el-button
                          >
                        </div>
                      </div>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!-- 工作台分页 -->
          </div>
        </template>
        <template #pagination>
          <div class="prooflaypage" style="position: relative">
            <pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              v-model:page="termParams.current"
              @pagination="handleSizeChange(1)"
              :total="total"
              v-model:limit="termParams.size"
              :pageSizes="[10, 20, 50, 100]"
            />
          </div>
        </template>
    </listLayout>
      <!-- 撤单消息弹窗 -->
      <div class="revokeMessage">
        <el-dialog v-model="isRevokeShow" title="撤单消息" width="1200px">
          <!-- 撤单消息列表 -->
          <cancelOrder :revokeData="revokeData" @getRevoke="getRevoke"></cancelOrder>
          <div style="position: relative">
            <pagination background layout="total, sizes, prev, pager, next, jumper" v-model:page="revokeParams.current"
              @pagination="handleSizeChange(2)" :total="revokeTotal" v-model:limit="revokeParams.size"
              :pageSizes="[10, 20, 50, 100]" />
          </div>
          <div class="alignRight" style="padding-top: 20px">
            <el-button type="primary" @click="isRevokeShow = false">关闭</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 属性弹框 -->
      <div class="is-align-center">
        <el-dialog v-model="isAttrShow" title="属性详情" width="600px">
          <div style="line-height: 2">{{ attrContent }}</div>
          <template #footer>
            <span>
              <el-button type="primary" @click="isAttrShow = false">关闭</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
      <!-- 完成任务弹窗 -->
      <div class="doneTask">
        <el-dialog v-model="isDoneTaskShow" title="确定完成结构文件任务？" width="600px">
          <div>请确认检查结构文件。操作立即生效是否继续？</div>
          <div class="alignRight">
            <el-button @click="isDoneTaskShow = false">取消</el-button>
            <el-button type="primary" @click="doneAffirm">确定</el-button>
          </div>
        </el-dialog>
      </div>
      <el-dialog v-model="isAiTaskShow" title="AI识别该刀线图疑似不能成型！" width="600px">
        <div style="margin-top:10px;;">
          <div>
            <span>错误原因：</span>
            <span style="color:red;">
              <!-- {{ aiMsg.reason }} -->
              <DictTag :value="aiMsg.reason" :options="ac_structure_err_type" style="display: inline-block;" />
            </span>
          </div>
          <div style="margin-top:10px;margin-bottom: 16px;">
            <span>详细报错信息：</span>
            <span style="color:red;">
              <el-button size="small" type="danger" plain @click="viewAIMsg">查看</el-button>
            </span>
          </div>
        </div>
        <div class="alignRight">
          <el-button type="primary" @click="doneAffirm">忽略报错继续提交</el-button>
          <el-button type="primary" @click="isAiTaskShow = false">重新制作文件</el-button>
        </div>
      </el-dialog>
      <!-- 驳回弹窗 -->
      <div class="is-align-center">
        <rejectOrder
          v-if="isRefusalShow"
          v-model:dialogType="isRefusalShow"
          classification
          :dialogId="rejectId"
          @changeList="getAllList()"
        ></rejectOrder>
      </div>
      <!-- 转移结构单弹窗 -->
      <div class="is-align-center">
        <transferOrder
          v-if="deptId&&isTransferShow"
          v-model:dialogTransferType="isTransferShow"
          :dialogId="transferId"
          :deptId="deptId"
          @changeList="getAllList()"
        ></transferOrder>
      </div>
      <!-- 退回文件推送前弹窗 -->
      <div class="is-align-center">
        <backFileOrder v-model:dialog-file-type="isBackFile" :dialogId="backFileId" @changeList="getAllList()">
        </backFileOrder>
      </div>
      <!-- <EditorRemark v-if="RemarkShow" :remarkTxt="remarkTxt" v-model:RemarkShow="RemarkShow"/> -->
      <el-dialog
        v-model="dialogType"
        title="请确认是否完成并冻结"
        width="800px"
        :before-close="cancel"
      >
        <el-form
          ref="formRefusal"
          :model="refusalParams"
          label-width="120px"
          class="demo-ruleForm"
        > 
          <el-form-item label="结构备注:">
            <Editor v-model:html="refusalParams.remark" ></Editor>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="cancel">取消</el-button>
            <el-button type="primary" @click="refusalAffirm()">确定</el-button>
          </span>
        </template>
      </el-dialog>
      <component
        v-if="BoxName!=''"
        :is="dialogList"
        :order-id='rowId'
        v-model:drawer-type="isShow"
        :drawerData="drawerData"
        :pname="pname"
        :positionFlag="positionFlag"
        @CompleteCallback="CompleteCallback"
        bulk
        @changelist="change('不是首次')"
      >
      </component>
  </div>
</template>
<script setup>
// 域名
import { BASE_FILE_URL } from "@/store/global-constant";
import { zipDownload } from "@/api/download";
import cancelOrder from "@/components/cancelOrder";
import rejectOrder from "./components/rejectOrder/editorReject.vue";
import transferOrder from "./components/transferOrder";
import { toChineseNumber,senseUrl,getHour } from "@/utils/index";
import backFileOrder from "./components/backFileOrder";
import RemarkDialog from "@/components/RemarkDialog/remark.vue";
import checkAppNewVersion from '@/utils/checkAppNewVersion.js'
import Counter from "@/components/proof/Counter.vue"
import StructureFile from "./components/boxType/structureFile.vue"

import {
  getCancelMsg,
  submitMsgOps,
  getTask,
  finish,
  getSelfWorkList,
  getSelfWorkSpace,
  getAnnexByOriginalId,
  getHardBoundBoxFileDetail,
  msgCount,
  getTaskByPo,
  checkTakeShape,
  getTaskCount
} from "@/api/structural/selfWork";
import {
  rejectStructural,
  getSuppliers,
  transferStructural,
} from "@/api/structural/structuralList";
import { ElMessage, ElMessageBox } from "element-plus";
import OrderAttrShow from "@/components/OrderAttrShow/order.vue";
import { nextTick } from "vue"
import blisterNato from './components/push/blisterNato.vue'
import singDownFile from "@/components/singDownFile"
import ThreeDayFlag from "@/components/fileTag/threeDayFlag.vue";
import poView from "../../../proof/components/poView.vue"
import Editor from "@/components/Editor"
const { proxy } = getCurrentInstance();

const { prepress_department,ac_remark_type,ac_structure_err_type,ac_structure_newstatus } = proxy.useDict("prepress_department","ac_remark_type","ac_structure_err_type","ac_structure_newstatus");
// 撤单消息状态对应文字
let statusMap = {
  0: "待审批",
  1: "已同意",
  2: "不同意",
};
const uploadref = ref(null);
const dialogType = ref(false)
const refusalParams = ref({
  remark:'',
})
let dialogdata=ref(null)
const isShow = ref(false);
// 撤单总条数
let revokeTotal = ref(0);
// 领取人
let receiver = ref([]);
// 总条数
let total = ref(0);
//撤单消息数量
let revokeMsgCount = ref("");
let rowId = ref("");
let rowPoNo = ref("");
// 撤单数据
let revokeData = ref([]);
// 表格数据
let tableData = ref([]);
// 是否显示属性弹框
let isAttrShow = ref(false);
// 属性内容
let attrContent = ref("");
let isRevokeShow = ref(false);
// 是否显示上传弹窗
let isUploadShow = ref(false);
// 是否显示完成任务弹窗
let isDoneTaskShow = ref(false);
let isAnnexVOS = ref(true);
// 是否显示驳回弹窗
let isRefusalShow = ref(false);
// 是否显示转移单弹窗
let isTransferShow = ref(false);
//是否显示退回文件推送前
let isBackFile = ref(false);
//驳回id
const rejectId = ref("");
//转移id
const transferId = ref("");
//搜索并领取
const taskPO = ref('')
// ai检测弹窗
const isAiTaskShow = ref(false);
let RemarkShow = ref(false);
let remarkTxt = ref("");
const data = reactive({
  drawerData: {},
  termParams: {
    orderType: "1",
    current: 1, // 页数
    size: 10, // 每页条数
    proofType: 0, //打样类型：1打样，0大货
    poNo: null,//PO号
    salesman: null,//业务员
    status: null,//印前状态
  },
  //撤单参数
  revokeParams: {
    current: 1, // 页数
    size: 10, // 每页条数
    type: 0, //0大货 1打样
  },
  // 撤单消息结果参数
  btnResultParams: {
    msgId: "", // 消息ID
    result: "", //  1同意 2拒绝
    structuralId: "",
  },
  // 完成结构单参数
  doneParams: {
    taskId: "", // id
  },
  aiMsg: {}
});
const { drawerData, termParams, revokeParams, btnResultParams, doneParams, aiMsg } =
  toRefs(data);
const timer = ref("");
const formRef = ref();
let pname = ref("");
// 账号列表
let accountList = ref([]);
// 转移结构单参数
var BoxName = ref("");
let uploadsFile = ref([]);
let inputVal = ref([]);
let uploadParam = ref([]);
//回显结构文件
let echoFileData = ref([]);
const backFileId = ref("");
const deptId = ref("");
const processing = ref(0)//处理中
const toBeProcessed = ref(0)//待处理
const positionFlag = ref(0)//显示粘位下拉选项:0正常显示（粘左，粘右，异形盒），1显示(不粘),2不显示下拉框
watch(prepress_department, (val) => {
  deptId.value = val.find((item) => {
    return item.label == "structural_bulk";
  }).value;
});
const multipleTable = ref(null)
watch(tableData, () => {
  nextTick(() => {
    multipleTable.value.setScrollTop(0)
    multipleTable.value.setScrollLeft(0)
  })
})
if (prepress_department.value.length > 0) {
  deptId.value = prepress_department.value.find((item) => {
    return item.label == "structural_bulk";
  }).value;
}
// 获取撤单消息数据
function revokeListData() {
  getCancelMsg(revokeParams.value).then((res) => {
    if (res.code == 200) {
      if (res.data) {
        revokeData.value = res.data.records;
        revokeTotal.value = res.data.total;
      }
    } else {
    }
  });
}
function handleSizeChange(val) {
  if (val == 2) {
    revokeListData();
  } else {
    getList();
  }
}
// 获取结构文件工作台数据
function getList() {
  getSelfWorkList(termParams.value).then((res) => {
    // getSelfWorkSpace(termParams.value).then((res) => {
    if (res.code == 200) {
      if (res.data) {
        tableData.value = res.data.records;
        total.value = res.data.total;
      }
    } else {
      ElMessage.error(res.msg);
    }
  });
}
getAllList();
// 领取任务
function receiveTask(id) {
  try {
    let obj = { proofType: 0 }
    if (id) {
      obj.id = id
    }
    getTask(obj).then((res) => {
      if (res.code == 200) {
        ElMessage.success(res.msg);
        getAllList();
      } else {
        ElMessage.error(res.msg);
      }
    });
  } catch (err) { }
}
const remarkclick = (data) => {
  RemarkShow.value=true
  remarkTxt.value=data
}
//搜索并领取
function searchTask() {
  if (!taskPO.value) {
    return
  }
  getTaskByPo({ poNo: taskPO.value }).then(res => {
    if (res.code == 200) {
      ElMessage.success('领取成功');
      getAllList();
    } else {
      ElMessage.error(res.msg);
    }
  })
}
function getAllList() {
  // revokeListData();
  getList();
  getMsgCount();
}
function getMsgCount() {
  msgCount({ type: 0 }).then((res) => {
    if (res.code == 200) {
      revokeMsgCount.value = res.data;
    } else {
      ElMessage.error(res.msg);
    }
  });
}
//重置表单
function resetFormParams() {
  proxy.resetForm("formRef");
  search();
}
//搜索
function search() {
  termParams.value.current = 1//页码
  termParams.value.size = 20//分页大小
  getList()
  getCount()
}
// 处理数据
function getCount(){
  getTaskCount(
    {
      position:1,
      ...termParams.value,
    }
    ).then(res=>{
    if (res.code==200) {
      processing.value = res?.data?.processingCount
      toBeProcessed.value = res?.data?.waitingCount
    }
  })
}
getCount()
//转单备注
function showAttr(text, type) {
  ElMessageBox.alert(text, type, {
    confirmButtonText: '关闭',
    callback: () => { }
  })
}
/** 复制代码成功 */
function copyTextSuccess() {
  proxy.$modal.msgSuccess("复制成功");
}

// 查看
function seeAll(value) {
  if (value) {
    isAttrShow.value = true;
    attrContent.value = value;
  }
}

// 是否同意撤单
function getRevoke(val) {
  let { data, type } = val;
  let { id, structuralId } = data;
  btnResultParams.value.msgId = id;
  btnResultParams.value.structuralId = structuralId;
  btnResultParams.value.result = type;
  submitMsgOps(btnResultParams.value).then((res) => {
    if (res.code == 200) {
      ElMessage.success(res.msg);
      getAllList();
    } else {
      ElMessage.error(res.msg);
    }
    isRevokeShow.value = false;
  });
}

// 上传结构
const uploadOutwork = (row) => {
  let orderType = row.orderType
  dialogdata.value=row
  if(orderType!=1){
    rowId.value = row.id;
    rowPoNo.value = row.poNo;
    getFileData(row.id, row.poNo);
    BoxName.value = row.orderType == 1 ? "otherBox" : "cardBox";
  } else {
    rowId.value = row.id;
    rowPoNo.value = row.poNo;
    pname.value = row.productName
    BoxName.value = "hardbackBox";
    isShow.value = true

  }

};
// 撤单消息按钮禁用
function revokeBtnDisabled(status) {
  // 待审核激活      0待审批，1已同意，2不同意
  if (status == 0) {
    return false;
  }
  return true;
}
// 是否禁用完成按钮
let isDoneDisabled = (annexVOS) => {
  // 没有结构文件禁用
  if (annexVOS == null) {
    return true;
  }
  return false;
};
// 是否禁用下载客户源文件按钮
function downDisabled(file, status) {
  if (status == 0 || status == 1) {
    if (file && file.length > 0) {
      return false;
    } else {
      return true;
    }
  }
}
// 下载文件
async function downFile(file, status) {
  // 0 客户源文件    1 正稿文件
  let name = status == 1 ? "正稿文件" : "客户源文件";
  if (status == 0 || (status == 1 && file && file.length > 0)) {
    let fileParam = {
      fileList: [],
      name: name,
    };
    file.forEach((item) => {
      fileParam.fileList.push(item.fileAddress);
    });
    let result = await zipDownload(fileParam, name + ".zip");
  }
}
const cancel = () => {
  dialogType.value=false
  refusalParams.value.remark=''
}
const refusalAffirm = () => {
  // console.log('refusalAffirm');
  done(dialogdata.value)
}
const doneclick = (data) => {
  if(data.annexUploadVO?.remark){
    refusalParams.value.remark=data.annexUploadVO?.remark
  }
  dialogdata.value=data
  dialogType.value=true
}
function CompleteCallback(){
  refusalParams.value.remark=dialogdata.value?.remark
  dialogType.value=true
}
// 完成
const done = (data) => {
  doneParams.value.taskId = data.id;
  if (data.productName.indexOf('卡纸盒') != -1 || data.productName.indexOf('微坑盒') != -1) {
    let obj = {
      "activityId": data.activityId,
      "goodsName": data.productName,
      "id": data.id,
      "poNo": data.poNo,
      "productAttr": data.productAttr
    }
    proxy.$modal.loading('AI检测中，请稍候...')
    checkTakeShape(obj).then(res => {
      if (res.code == 200) {
        if (res.data.code) {
          doneAffirm()
        } else {
          aiMsg.value = res.data
          isAiTaskShow.value = true
        }
      }
    })
      .catch(() => {
        isDoneTaskShow.value = true;
      })
      .finally(() => {
        proxy.$modal.closeLoading()
      })
  } else {
    isDoneTaskShow.value = true;
  }
};
function viewAIMsg() {
  ElMessageBox.alert(
    h('p', { style: 'white-space: pre-line' }, aiMsg.value.msg)
    , '详细信息', {
    confirmButtonText: '确认',
    callback: (action) => { },
  })
}
// 驳回
const reject = (id, poNo) => {
  rejectId.value = id;
  isRefusalShow.value = true;
};
// 转移结构单
const backFile = (id) => {
  isBackFile.value = true;
  backFileId.value = id;
};
// 转移结构单
const transferSheet = (id) => {
  isTransferShow.value = true;
  transferId.value = id;
};
// 完成任务确认
const doneAffirm = function () {
  isAiTaskShow.value = false
    proxy.$modal.loading('文件提交中，请稍候...')
  finish({ id: doneParams.value.taskId,remark:refusalParams.value.remark })
    .then((res) => {
      try {
        if (res.code === 200) {
          ElMessage.success("确认成功");
          isDoneTaskShow.value = false;
          dialogType.value=false;
          if(isShow.value) isShow.value=false;
          getList();
        } else {
          ElMessage.error(res.msg);
        }
      } catch (err) {
        ElMessage.error(err.message);
      }
    })
    .catch(() => {
      isDoneTaskShow.value = false;
    })
    .finally(() => {
      proxy.$modal.closeLoading()
    });
};

// 打开文件
function openFile(url) {
  window.open(senseUrl(BASE_FILE_URL + url), "_blank");
}

let dialogList = computed(() => {
  console.log(BoxName.value)
  checkAppNewVersion()
  let vueCom = ''
  if (BoxName.value != '') {
    vueCom = defineAsyncComponent(() =>
      import(`./components/boxType/${BoxName.value}.vue`)
    );
  }
  console.log('vueCom', vueCom)
  return vueCom
});

// 获取正稿文件数据
function getFileData(id, poNo, status) {
  getAnnexByOriginalId({ id: id, poNo: poNo }).then((res) => {
    if (res.code == 200) {
      let annexVOS = res.data.annexVOS;
      positionFlag.value = res.data?.positionFlag || 0
      if (annexVOS) {
        uploadsFile.value = annexVOS.map((item) => {
          return [
            {
              position: item.position,
              length: item.length,
              name: item.fileName,
              fileAddress: item.fileAddress,
              sort: item.sort,
            },
          ];
        });
        inputVal.value = annexVOS.map((item) => {
          return {
            position: item.position,
            length: item.length,
            sort: item.sort,
          };
        });
      } else {
        uploadsFile.value = [];
        inputVal.value = [];
      }
      drawerData.value = {
        uploadsFile: uploadsFile.value,
        originalId: id,
        dataVal: res.data,
        poNo: poNo,
        inputVal: inputVal.value,
        type: true
      };
      if (status) {
        isShow.value = false;
      } else {
        nextTick(() => {
          isShow.value = true;
        });
      }
    } else {
    }
  });
}
function change(val) {
  getAllList();
  getFileData(rowId.value, rowPoNo.value, val);
}
function changeRemark() {
  getAllList();
}
// 查看变更内容
const checkChange = () => {
  changeDialog.value = true
}
watch(isRevokeShow, (val) => {
  if (!val) {
    revokeParams.value.current = 1;
    revokeParams.value.size = 10;
  } else {
    revokeListData();
  }
});



</script>

<style lang="scss" scoped>
.msgbtn{
  margin-left: 10px;
}
.listText{
  display: flex;
  font-weight: 600;
}
.titleBox {
  display: flex;
  justify-content: space-between;
}

.disposeBox{
  display: flex;
}
.divsn{
  p{
    font-weight: 600;
    margin: 5px 0 0 0;
    height: 17px;
  }
  span{
    color: #409EFF;
  }
}
.artwork-workbench {
  .alignRight {
    display: flex;
    justify-content: right;
  }

  .top-bar {
    
    .btnBox {
      text-align: right;
      padding-right: 38px;
    }
  }

  // 结构列表
  .outworkListBox {
    .turn {
      display: inline-block;
      width: 20px;
      line-height: 20px;
      background-color: #ff3399;
      color: #ffffff;
      text-align: center;
    }

    .operate {
      .public {
        margin-left: 20px;
      }

      // .downBoX {
      //   display: flex;
      //   align-items: center;
      //   flex-direction: column;
      //   .downBtn {
      //     margin-left: 0;
      //     margin-top: 10px;
      //   }
      // }
    }

    .property {
      display: -webkit-box;
      -webkit-line-clamp: 6;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      word-break: break-all;
    }
  }

  // 分页
  .laypage {
    display: flex;
    justify-content: right;
    margin-top: 20px;
  }

  // 完成任务弹窗
  .doneTask {
    .btnBox {
      display: flex;
      justify-content: right;
      margin-top: 20px;
    }
  }
}

// 公共类
/* 单行文字溢出时出现省略号，需设定宽度 */
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gesture {
  cursor: pointer;
}
</style>
<style lang="scss">
.is-align-center {
  .el-overlay-dialog {
    display: flex;

    .el-dialog {
      margin: auto;
    }
  }
}

.mar_10 {
  margin-right: 10px;
}

.form-tool-bar {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 10px;
}
</style>
<style>
.popper_note {
  max-width: 400px !important;
  width: 400px !important;
  word-break: break-all;
}
</style>
