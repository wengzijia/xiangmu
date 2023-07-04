<template>
  <div>
    <listLayout>
      <template #header>
        <div class="top-bar">
          <el-form :inline="true" :model="formData" class="demo-form-inline" label-width="120px" ref="formRef">
            <el-form-item label="PO号" prop="poNo">
              <el-input v-model.trim="formData.poNo" placeholder="请输入PO号" clearable style="width: 252px" />
            </el-form-item>
            <el-form-item label="印前状态" prop="status">
              <el-select v-model="formData.status" placeholder="所有状态" clearable style="width: 252px">
                <!-- v-show="
                    item.label != '待客户确认' &&
                    item.label != '客户已确认' &&
                    item.label != '已退回订单' &&
                    item.label != '客户撤单' &&
                    item.label != '已驳回' &&
                    item.label != '已完成' &&
                    item.label != '已撤回' &&
                    item.label != '未领取'&&
                    item.label != '转正稿中'
                  " -->
                <el-option v-for="item in prepress_status" :key="item.value" :label="item.label" :value="item.value"
                  v-show="item.label != '待客户确认' &&
                    item.label != '客户已确认' &&
                    item.label != '已退回订单' &&
                    item.label != '客户撤单' &&
                    item.label != '已驳回' &&
                    item.label != '已完成' &&
                    item.label != '被撤回' &&
                    item.label != '未领取' &&
                    item.label != '转正稿中'
                    " />
              </el-select>
            </el-form-item>
            <el-form-item label="业务员" prop="salesman">
              <el-input v-model.trim="formData.salesman" placeholder="请输入业务员名称" clearable style="width: 252px" />
            </el-form-item>

          </el-form>
          <div class="form-tool-bar">
            <div style="min-width: 160px; width: 160px">
              <el-button @click="resetFormParams">重置</el-button>
              <el-button type="primary" @click="search">搜索</el-button>
            </div>
          </div>
        </div>
      </template>
      <template #table-header>
        <!-- <div class="top-bar">
          <el-link :underline="false" @click="showDialog"
            >撤单消息<span>({{ revokeNum }})</span
            ><span v-if="revokeNum" class="red-dot"></span
          ></el-link>
          <div style="display: flex;">
            <el-input
              v-model.trim="taskPO"
              placeholder="请输入PO号"
              @keydown.enter="receiveTask"
              style="margin-right: 20px;"
            >
              <template #append>
                <el-button type="primary" @click="receiveTask">搜索并领取</el-button>
              </template>
            </el-input>
            <el-button type="primary" @click="Task">领取任务</el-button>
          </div>
        </div> -->
        <div class="top-bar">
          <div class="titleBox">
            <div class="listText">
              个人印前工作台
              <el-badge :value="revokeNum || 0" :max="99" class="msgbtn" @click="showDialog">
                <el-button type="warning">撤单消息</el-button>
              </el-badge>
            </div>
            <div class="disposeBox">
              <div style="width:300px;margin-right:20px;">
                <el-input v-model.trim="taskPO" placeholder="请输入PO号" @keydown.enter="receiveTask"
                  style="margin-right: 20px;">
                  <template #append>
                    <el-button type="primary" @click="receiveTask">搜索并领取</el-button>
                  </template>
                </el-input>
              </div>
              <Counter :processing="processing" :toBeProcessed="toBeProcessed" />
              <el-button class="getTask" style="margin-left:15px;" type="primary" @click="Task">领取任务</el-button>
            </div>
          </div>
        </div>
      </template>

      <template #table-content='tableHeight'>
        <el-table :data="tableData" :height='tableHeight.tableHeight' v-loading="loading" row-key="activityId"
          ref="multipleTable">
          <el-table-column label="PO号" width="230px">
            <template #default="scope">
              <!-- <el-link
                  :underline="false"
                  v-copyText="scope.row.poNo"
                  v-copyText:callback="copyTextSuccess"
                >
                  {{ scope.row.poNo }}
                  <el-icon>
                    <CopyDocument />
                  </el-icon>
                </el-link> -->
              <poView :po-no="scope.row.poNo" type="2"></poView>
              <DictTag class="changeStatus" :value="scope.row.orderChangeFlag" :options="orderChange_order_status"
                @click="checkChangeContent(scope.row)" />
              <div style="display: flex">
                <div v-for="(item, index) in ac_proof_type" :key="index">
                  <el-tag class="mx-1" effect="dark" v-if="item.value == scope.row.proofingType">
                    {{ item.label }}
                  </el-tag>
                </div>
                <!-- <el-tag
                    effect="dark"
                    style="margin-left: 5px; cursor: pointer"
                    @click="seeNote(scope.row.combinationInformation)"
                    >组合信息</el-tag
                  > -->
                <el-tag v-if="scope.row.isTransfer" style="margin-left: 5px" effect="dark">转单</el-tag>
              </div>
              <!-- <div
                  v-if="scope.row.allowModificationOfDie"
                  style="margin-top: 5px"
                >
                  <el-tag effect="dark" style="font-size: 12px"
                    >{{
                      scope.row.allowModificationOfDie == 1 ? "允" : "不"
                    }}许对设计文件、刀模文件进行生产规范化修正</el-tag
                  >
                </div> -->
              <div style="margin-top: 5px">
                <el-tag>{{ scope.row.productName }}</el-tag>
                <followInfoFlag :row="scope.row" name="prepressFollow" type="2"></followInfoFlag>
                <ThreeDayFlag style="margin-top:5px" :row="scope.row"></ThreeDayFlag>
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
            </template>
          </el-table-column>
          <el-table-column label="业务员" width="170px">
            <template #default="scope">
              <div>
                <p v-show="scope.row.salesman">
                  <span class="TimeTitle">业务员：</span><br />
                  <span class="TimeCon">{{ scope.row.salesman || "-" }}</span>
                </p>
                <p v-show="scope.row.createTime">
                  <span class="TimeTitle">推送印前时间：</span>
                  <br />
                  <span class="TimeCon">{{ scope.row.createTime || "-" }}</span>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="工单参数" width="300px">
            <template #default="scope">
              <OrderAttrShow :attr="scope.row.productAttr" :activityId="scope.row.activityId"></OrderAttrShow>
              <!-- <el-link :underline="false" @click="showAttr(scope.row.productAttr)">
                <div class="overflow-tooltip">{{scope.row.productAttr}}</div>
              </el-link> -->
            </template>
          </el-table-column>
          <el-table-column label="备注" width="80px">
            <template #default="scope">
              <!-- <RemarkDialog
                  :order="scope.row"
                  :showButton="scope.row?.remarkFlag == 2"
                  type="prepress"
                  @getList="getList"
                  :perperss_remark_type="perperss_remark_type"
                /> -->
              <div>
                <el-link v-if="scope.row.structuralRemark" type="primary" :underline="false"
                  @click="remarkclick(scope.row.structuralRemark)">结构备注</el-link>
              </div>
              <div>
                <el-link v-if="scope.row.orderRemark" type="primary" :underline="false"
                  @click="showAttr(scope.row.orderRemark, '订单备注')">订单备注</el-link>
              </div>
              <!-- <div>
                  <el-link
                    v-if="scope.row.originalRemark"
                    type="primary"
                    :underline="false"
                    @click="showAttr(scope.row.originalRemark, '正稿备注')"
                    >正稿备注</el-link
                  >
                </div> -->
            </template>
          </el-table-column>
          <el-table-column label="客户文件">
            <template #default="scope">
              <div v-for="(item, index) in scope.row.customerFileList" :key="index">
                <!-- <el-link :underline="false" @click="urlDownFile(item.fileAddress,'客户源文件')">{{item.fileName}}</el-link> -->
                <!-- <el-link
                    :underline="false"
                    :href="senseUrl(BASE_FILE_URL + item.fileAddress)"
                    target="_blank"
                    >{{ item.fileName }}</el-link
                  > -->
                <FileShow title="客户文件：" :filename="item.fileName" :fileurl="senseUrl(BASE_FILE_URL + item.fileAddress)" />

              </div>
              <div v-if="!scope.row.customerFileList">-</div>
              <div v-if="scope.row.productName.indexOf('精装盒') === -1"><el-tag effect="dark" style="cursor: pointer;"
                  @click="threeDownFile(scope.row)">一键三连下载</el-tag></div>
            </template>
          </el-table-column>
          <el-table-column label="印前文件" width="300px">
            <template #default="scope">
              <template v-if="scope.row.productName.indexOf('精装盒') === -1">
                <div v-for="(item, index) in scope.row.structuralFile" :key="index">
                  <div v-for="citem in item.files" :key="citem">
                    <FileShow title="结构文件：" :filename="citem.fileName"
                      :fileurl="senseUrl(BASE_FILE_URL + citem.fileAddress)" />
                  </div>
                </div>
              </template>
              <StructureFile v-if="scope.row.annexs && scope.row.productName.indexOf('精装盒') === -1" :fileobj="scope.row"
                @changeList="getList()" @doneclick="doneclick" />

              <div v-if="scope.row.productName.indexOf('精装盒') > -1">
                <el-button
                  :disabled="scope.row.status != 1 && scope.row.status != 3 && scope.row.status != 11" :underline="false"
                  @click="toUpload(scope.row)">
                  上传印前
                </el-button>
              </div>
              <!-- <FileShow v-if="scope.row?.aiFile?.cutUrl" title="系统匹配刀线：" :filename="scope.row?.aiFile?.cutUrl" :fileurl="senseUrl(BASE_FILE_URL + scope.row?.aiFile?.cutUrl)"/>
                    <div v-if="scope.row.productName.indexOf('精装盒')>-1">
                      <el-button
                        type="primary"
                        :underline="false"
                        class="mar_10"
                        @click="uploadOutwork(scope.row)"
                        >上传文件</el-button
                      >
                    </div> -->

            </template>
          </el-table-column>
          <el-table-column label="状态/耗时(小时)" width="150">
            <template #default="scope">
              <div style="display:flex;">
                <DictTag :value="scope.row.status" :options="prepress_status" />
                <span v-if="scope.row.status == 0">
                  /{{ getHour(scope.row.createTime) }}
                </span>
                <span v-else-if="scope.row.status == 1 || scope.row.status == 3 || scope.row.status == 11">
                  /{{ getHour(scope.row.startTime) }}
                </span>
                <template v-else>
                  <span v-if="scope.row?.timeConsum">/{{ scope.row?.timeConsum }}</span>
                </template>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="设计正稿文件" width="140px">
              <template #default="scope">
                <div v-for="(item, index) in scope.row.originalFile" :key="index">
                  <el-link
                    :underline="false"
                    :href="senseUrl(BASE_FILE_URL + item.fileAddress)"
                    target="_blank"
                    >{{ item.fileName }}</el-link
                  >
                </div>
                <div v-if="!scope.row.originalFile">-</div>
              </template>
            </el-table-column>
            <el-table-column label="结构文件" width="140px">
              <template #default="scope">
                <div
                  v-for="(item, index) in scope.row.structuralFile"
                  :key="index"
                >
                  <el-link
                    :underline="false"
                    :href="senseUrl(BASE_FILE_URL + item.fileAddress)"
                    target="_blank"
                    >{{ item.fileName }}</el-link
                  >
                </div>
                <div v-if="!scope.row.structuralFile">-</div>
              </template>
            </el-table-column>
            <el-table-column label="业务员" width="80px">
              <template #default="scope">
                <div>{{ scope.row.salesman || "-" }}</div>
              </template>
            </el-table-column> -->

          <!-- <el-table-column label="文件推送人" width="140px">
              <template #default="scope">
                <div>{{ scope.row.fileSender || "-" }}</div>
              </template>
            </el-table-column> -->
          <!-- <el-table-column label="是否转单" width="140px">
            <template #default="scope">
              <div>{{scope.row.isTransfer?'是':'否'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="转单备注" width="140px" :show-overflow-tooltip="true">
            <template #default="scope">
              <div>{{scope.row.transferRemark||'-'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="正稿备注" width="140px" :show-overflow-tooltip="true">
            <template #default="scope">
              <div>{{scope.row.originalRemark||'-'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="结构备注" width="140px" :show-overflow-tooltip="true">
            <template #default="scope">
              <div>{{scope.row.structuralRemark||'-'}}</div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="客户源文件上传时间" width="160px">
              <template #default="scope">
                <div
                  v-for="(item, index) in scope.row.customerFileList"
                  :key="index"
                >
                  <span>{{ parseDate(item.uploadTime, true) }}</span>
                </div>
                <div v-if="!scope.row.customerFileList">-</div>
              </template>
            </el-table-column>
            <el-table-column label="推送印前时间" width="160px">
              <template #default="scope">
                <div>{{ scope.row.createTime || "-" }}</div>
              </template>
            </el-table-column>
            <el-table-column label="印前领取时间" width="160px">
              <template #default="scope">
                <div>{{ scope.row.startTime || "-" }}</div>
              </template>
            </el-table-column> -->
          <el-table-column fixed="right" width="130px" label="操作">
            <template #default="scope">
              <template v-if="scope.row.status != 0">
                <!-- <div>
                    <el-link
                      type="primary"
                      :disabled="scope.row.status != 1 && scope.row.status != 3"
                      :underline="false"
                      @click="toUpload(scope.row)"
                      >上传印前</el-link
                    >
                  </div> -->
                <div>
                  <el-link type="primary" :disabled="!scope.row.fileStatus || pauseDisable(scope.row.orderChangeFlag)"
                    :underline="false" @click="doneclick(scope.row)">完成并冻结</el-link>
                </div>
                <!-- <div>
                    <el-link
                      type="primary"
                      :underline="false"
                      @click="rejectDialog(scope.row)"
                      >驳回</el-link
                    >
                  </div> -->

                <div><el-link :underline="false" type="primary" :disabled="pauseDisable(scope.row.orderChangeFlag)"
                    @click="rejectDialog(scope.row, 'reject')">驳回至结构</el-link>
                </div>
                <div><el-link :underline="false" type="primary" :disabled="pauseDisable(scope.row.orderChangeFlag)"
                    @click="rejectDialog(scope.row, 'rejectSend')">驳回至业务</el-link></div>

                <div>
                  <el-link type="primary" :underline="false" :disabled="pauseDisable(scope.row.orderChangeFlag)"
                    v-if="scope.row.status != 0" @click="transferDialog(scope.row)">转移印前单</el-link>
                </div>
              </template>
              <!-- <template v-if="scope.row.status == 0">
                  <el-link
                    type="primary"
                    :underline="false"
                    class="mar_10"
                    @click="Task2(scope.row.activityId)"
                    >领取</el-link
                  >
                </template> -->
              <el-dropdown v-if="false" trigger="click" @command="(e) => {
                downFile(scope.row, e);
              }
                ">
                <span class="el-dropdown-link">
                  <el-button size="small">
                    <el-icon>
                      <More />
                    </el-icon>
                  </el-button>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="rejectDialog(scope.row)" command="">驳回</el-dropdown-item>
                    <!-- <el-dropdown-item @click="toStructure(scope.row)" command=""
                        >转正稿</el-dropdown-item
                      > -->
                    <el-dropdown-item @click="rejectSend(scope.row)" command="">退回文件推送前</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.status != 0" @click="transferDialog(scope.row)"
                      command="">转移印前单</el-dropdown-item>
                    <el-dropdown-item command="customerFile"
                      :disabled="disDownload(scope.row.customerFile, 1)">下载客户源文件</el-dropdown-item>
                    <el-dropdown-item command="originalFileUrl"
                      :disabled="disDownload(scope.row.originalFileUrl, 2)">下载正稿文件</el-dropdown-item>
                    <el-dropdown-item command="structuralFileUrl"
                      :disabled="disDownload(scope.row.structuralFileUrl, 3)">下载结构文件</el-dropdown-item>
                    <!-- <el-dropdown-item @click="downXML(scope.row)" command="">下载poxml</el-dropdown-item> -->
                    <el-dropdown-item command="poxmlUrl"
                      :disabled="disDownload(scope.row.poxmlUrl, 4)">下载poxml</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #pagination>
        <div class="prooflaypage" style="position: relative">
          <pagination background layout="total, sizes, prev, pager, next, jumper" v-model:page="formData.pageNum"
            @pagination="getList" :total="total" v-model:limit="formData.pageSize" :pageSizes="[20, 30, 50, 100]" />
        </div>
      </template>
    </listLayout>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px" destroy-on-close>
      <el-form
            :model="dialogForm"
            label-width="120px"
            :rules="rules"
            ref="dialogFormRef"
          >
            <!-- <el-form-item
              v-if="dialogType == 'reject'"
              label="驳回原因"
              prop="remark"
            >
              <el-input
                v-model.trim="dialogForm.remark"
                placeholder="请填写驳回原因"
                maxlength="500"
                show-word-limit
                :rows="4"
                type="textarea"
                clearable
                style="width: 400px"
              />
              <div style="margin-top: 10px">
                <FileUpload
                  :fileType="['png', 'jpg', 'jpeg','dxf','tif','ard']"
                  :fileSize="200"
                  type=""
                  name="上传图片附件"
                  v-model:modelValue="dialogForm.remarkImages"
                  del
                />
              </div>
            </el-form-item>
            <el-form-item
              v-if="dialogType == 'structure'"
              label="备注"
              prop="remark"
            >
              <el-input
                v-model.trim="dialogForm.remark"
                placeholder="请输入转正稿备注内容"
                maxlength="300"
                show-word-limit
                :rows="4"
                type="textarea"
                clearable
                style="width: 400px"
              />
            </el-form-item>
            <el-form-item
              v-if="dialogType == 'rejectSend'"
              label="备注"
              prop="remark"
            >
              <el-input
                v-model.trim="dialogForm.remark"
                placeholder="请输入退回文件推送前备注内容"
                maxlength="300"
                show-word-limit
                :rows="4"
                type="textarea"
                clearable
                style="width: 400px"
              />
            </el-form-item> -->
            <el-form-item
              v-if="dialogType == 'transfer'"
              label="账号"
              prop="username"
            >
              <el-select
                v-model="dialogForm.username"
                placeholder="请选择接收账号"
                filterable
              >
                <el-option
                  v-for="item in deptUserList"
                  v-show="item.userName != name"
                  :key="item"
                  :label="item.nickName"
                  :value="item.userName"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="dialogType == 'transfer'" label="转单备注">
              <el-input
                v-model.trim="dialogForm.transferRemark"
                placeholder="请填写转单原因"
                maxlength="500"
                :rows="4"
                show-word-limit
                type="textarea"
              />
            </el-form-item>
          </el-form>
          
      <div v-if="dialogType == 'reject' || dialogType == 'rejectSend'">
        <el-form :model="dialogForm" label-width="120px" ref="dialogFormRef" :rules="rules">
          <!-- <el-form-item v-if="dialogType=='reject'" label="驳回原因" prop="remark"> -->
          <el-form-item label="驳回原因分类" prop="refuseClassification">
            <el-checkbox-group v-model="dialogForm.refuseClassification">
              <p><el-checkbox label="尺寸差异" /></p>
              <p><el-checkbox label="结构类型与订单不符" /></p>
              <p><el-checkbox label="结构不符合生产规范" /></p>
              <p><el-checkbox label="其他" /></p>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="驳回备注说明:" prop="remark">
            <Editor v-model:html="dialogForm.remark"></Editor>
          </el-form-item>
          <!-- <el-input v-model.trim="dialogForm.remark" placeholder="请填写驳回原因" maxlength="500" show-word-limit :rows="4"
                  type="textarea" clearable style="width:400px;" />
                <div style="margin-top:10px;">
                  <FileUpload
                    :fileType="['png', 'jpg', 'jpeg','dxf','tif','ard']"
                    :fileSize="200"
                    type=""
                    name="上传图片附件"
                    v-model:modelValue="dialogForm.remarkImages"
                    del
                  />
                </div> -->
          <!-- </el-form-item> -->
          <el-form-item v-if="dialogType != 'reject' && dialogType != 'rejectSend'" label="账号" prop="account">
            <el-select v-model="dialogForm.account" placeholder="请选择接收账号" clearable style="width:400px;">
              <el-option v-for="item in deptUserList" v-show="item.userName != name" :key="item.value"
                :label="item.nickName" :value="item.userName" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="dialogType != 'reject' && dialogType != 'rejectSend'" label="转单备注">
            <el-input v-model.trim="dialogForm.transferRemark" placeholder="请填写转单原因" maxlength="500" show-word-limit
              type="textarea" clearable style="width:400px;" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogConfirm">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="isRevokeShow" title="撤单消息" width="1200px">
      <!-- 撤单消息列表 -->
      <cancelOrder :revokeData="revokeData" @getRevoke="getRevoke"></cancelOrder>
      <div style="position: relative">
        <pagination background layout="total, sizes, prev, pager, next, jumper" v-model:page="revokeParams.pageNum"
          @pagination="getCancellationMessage" :total="revokeTotal" v-model:limit="revokeParams.pageSize"
          :pageSizes="[10, 20, 50, 100]" />
      </div>
      <div class="alignRight" style="padding-top: 20px">
        <el-button type="primary" @click="isRevokeShow = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="dialogsave" title="请确认是否完成并冻结" width="800px" :before-close="saveclose">
      <el-form ref="formRefusal" :model="refusalParams" label-width="120px" class="demo-ruleForm">
        <el-form-item label="印前备注:">
          <Editor v-model:html="refusalParams.remark"></Editor>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="saveclose">取消</el-button>
          <el-button type="primary" @click="refusalAffirm()">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="RemarkShow" title="结构备注" :close-on-click-modal="false" destroy-on-close align-center width="800px"
      class="historyPopupBox">
      <Editor v-model:html="remarkTxt" :edit="false"></Editor>
    </el-dialog>

    <FileDialog v-if="preileDialog" v-model:preileDialog="preileDialog" @complete="complete" @updatelist="getList"
      :DialogData="dialogData" :queryData="queryData" />
    <!-- 变更弹窗 -->
    <changeContent v-model:changeDialog="changeDialog" :changeContentData="changeContentData" v-if="changeDialog"></changeContent>
  </div>
</template>

<script setup>
import {
  getTask,
  getTask2,
  getMyTaskList,
  getMyTaskWork,
  finishPrepress,
  rejectPrepress,
  transferTask,
  cancellationMessage,
  cancellationMessageSum,
  doNotAgreeToCancelTheOrder,
  agreeToWithdraw,
  downloadPoxml,
  transferOrderAcrossNodes,
  returnFileBeforePushing,
  getPerperssTaskByPo,
  getCountOfStatus,
  getPrepressFile
} from "@/api/prepress";
import { changeDetail } from "@/api/orderChange/pause"
import { getDeptUser } from "@/api/system/user";
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import cancelOrder from "@/components/cancelOrder";
import OrderAttrShow from "@/components/OrderAttrShow";
import RemarkDialog from "@/components/RemarkDialog";
import { downPrepressFile, parseDate, senseUrl, getText, getHour } from "@/utils/index";
import { blobValidate, parseTime } from "@/utils/ruoyi";
import { saveAs } from "file-saver";
import { BASE_FILE_URL } from "@/store/global-constant";
import useAppStore from "@/store/modules/user";
import { nextTick } from "vue";
import { zipDownload } from '@/api/download'
import ThreeDayFlag from "@/components/fileTag/threeDayFlag.vue";
import poView from "../../../proof/components/poView.vue"
import Counter from "@/components/proof/Counter.vue"
import FileDialog from "./uploadFile3.vue"
import Editor from "@/components/Editor"
import StructureFile from "./uploadFile2.vue"
import changeContent from "@/components/orderChange/changeContent.vue"
const appStore = useAppStore();
const name = ref("");
name.value = appStore.$state.name;
const route = useRoute();
const router = useRouter();
// 是否显示变更弹窗
let changeDialog = ref(false);
const dialogsave = ref(false)
const tableData = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const isRevokeShow = ref(false);
const refusalParams = ref({
  remark: '',
})
const { proxy } = getCurrentInstance();
const {
  prepress_department,
  perperss_remark_type,
  prepress_status,
  ac_proof_type,
  orderChange_order_status
} = proxy.useDict(
  "prepress_department",
  "perperss_remark_type",
  "prepress_status",
  "ac_proof_type",
  "orderChange_order_status"
);
const data = reactive({
  dialogForm: {
    username: "", //接收账号
    transferRemark: "", //驳回原因
    remarkImages: "", //驳回图片
    activityId: "",
    poNo: "",
    refuseClassification: []
  },
  //撤单参数
  revokeParams: {
    pageNum: 1, // 页数
    pageSize: 10, // 每页条数
  },
  formData: {
    pageNum: 1, //页码
    pageSize: 20, //分页大小
    poNo: null, //PO号
    salesman: null, //业务员
    status: null, //印前状态
    type: 0, //印前类型0大货，1打样
  },
  // 变更详情参数
  changeDetailsParams: {
    poNo: '' // po号
  }
});
const { dialogForm, revokeParams, formData, changeDetailsParams } = toRefs(data);
const revokeData = ref([]); //撤单列表
const revokeTotal = ref(0);
const revokeNum = ref(0);//撤单消息数量
const dialogType = ref("reject");
const deptUserList = ref([]); //印前领取人列表
const deptId = ref("");
const taskPO = ref('')//搜索并领取
const total = ref(0);
const dialogTitle = ref("驳回");
const processing = ref(0)//处理中
const toBeProcessed = ref(0)//待处理
const preileDialog = ref(false)
const dialogData = ref(null)
const queryData = ref(null)
const dialogsavedata = ref(null)
const changeContentData = ref({}) // 变更内容数据
let RemarkShow = ref(false);
let remarkTxt = ref("");
watch(prepress_department, (val) => {
  deptId.value = val.find((item) => {
    return item.label == "prepress_bulk";
  }).value;
  getDeptUserList();
});
watch(dialogVisible, (val) => {
  if (val) {
    dialogForm.value.remark = null;
    dialogForm.value.username = null;
    dialogForm.value.transferRemark = null;
    dialogForm.value.remarkImages = "";
    dialogForm.value.refuseClassification = [];
  }
});
watch(isRevokeShow, (val) => {
  if (!val) {
    revokeParams.value.pageNum = 1;
    revokeParams.value.pageSize = 10;
    getCancellationMessage();
    getList();
  }
});
const multipleTable = ref(null);
watch(tableData, () => {
  nextTick(() => {
    multipleTable.value.setScrollTop(0);
    multipleTable.value.setScrollLeft(0);
  });
});
if (prepress_department.value.length > 0) {
  deptId.value = prepress_department.value.find((item) => {
    return item.label == "prepress_bulk";
  }).value;
  getDeptUserList();
}
//重置表单
function resetFormParams() {
  proxy.resetForm("formRef");
  search();
}
function saveclose() {
  dialogsave.value = false
  refusalParams.value.remark = ''
}

//搜索
function search() {
  formData.value.pageNum = 1; //页码
  formData.value.pageSize = 20; //分页大小
  getList();
  getCount()
}
// 处理数据
function getCount() {
  getCountOfStatus({ position: 1, ...formData.value }).then(res => {
    if (res.code == 200) {
      processing.value = res?.data?.processing
      toBeProcessed.value = res?.data?.toBeProcessed
    }
  })
}
getCount()
function disDownload(val, status) {
  if (val === 'null') return true
  switch (status) {
    case 1:
      if (val && JSON.parse(val).length > 0) {
        return false;
      } else {
        return true;
      }
      break;
    case 2:
      if (val && JSON.parse(val).length > 0) {
        return false;
      } else {
        return true;
      }
      break;
    case 3:
      if (val && JSON.parse(val).length > 0) {
        return false;
      } else {
        return true;
      }
      break;
    case 4:
      if (val) {
        return false;
      } else {
        return true;
      }
      break;
  }
}
//获取印前领取人列表
function getDeptUserList() {
  if (!deptId.value) {
    return;
  }
  getDeptUser({ deptId: deptId.value }).then((res) => {
    if (res.code == 200) {
      deptUserList.value = res.data;
    }
  });
}
function Task() {
  getTask({ type: 0 }).then((res) => {
    if (res.code == 200) {
      if (res.data == "没有可领取的任务了") {
        ElMessage({
          type: "success",
          message: res.data,
        });
      } else {
        ElMessage({
          type: "success",
          message: '任务领取成功！',
        });
        getList();
      }
    }
  });
}
const remarkclick = (data) => {
  RemarkShow.value = true
  remarkTxt.value = data
}
//搜索并领取
function receiveTask() {
  if (!taskPO.value) {
    return
  }
  //type 0大货印前，1打样印前
  getPerperssTaskByPo({ poNo: taskPO.value, type: 0 }).then(res => {
    if (res.code == 200) {
      ElMessage({
        type: "success",
        message: '任务领取成功！',
      });
      getList();
    } else {
      ElMessage.error('领取失败！')
    }
  })
}
function Task2(id) {
  getTask2({ type: 0 }, id).then((res) => {
    if (res.code == 200) {
      ElMessage({
        type: "success",
        message: res.data,
      });
      getList();
    }
  });
}
function getList() {
  loading.value = true;
  // getMyTaskList({type:0}).then(res => {
  getMyTaskWork(formData.value)
    .then((res) => {
      if (res.code == 200) {
        total.value = res.data.total;
        // tableData.value = res.data.map(item=>{
        tableData.value = res.data.rows.map((item) => {
          if (item.originalFileUrl) {
            item.originalFile = JSON.parse(item.originalFileUrl);
          }
          if (item.customerFile) {
            item.customerFileList = JSON.parse(item.customerFile);
          }
          if (item.structuralFileUrl) {
            item.structuralFile = JSON.parse(item.structuralFileUrl);
          }
          return item;
        });
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
getList();
const doneclick = (data) => {
  if (data.remark) {
    refusalParams.value.remark = data?.remark
  }
  dialogsavedata.value = data
  dialogsave.value = true
}
//完成
const refusalAffirm = () => {
  // console.log('refusalAffirm');
  complete(dialogsavedata.value.activityId)
}
function complete(id) {
  ElMessageBox.confirm(
    "请确认检查印前文件。操作立即生效是否继续？",
    "确定完成印前文件任务？",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(() => {
      proxy.$modal.loading('数据提交中，请稍候...')
      finishPrepress({ type: 0 }, id).then((res) => {
        if (res.code == 200) {
          ElMessage({
            type: "success",
            message: "成功",
          });
          if (preileDialog.value) preileDialog.value = false;
          dialogsave.value = false
          getList();
        }
      }).finally(() => {
        proxy.$modal.closeLoading()
      });
    })
    .catch(() => { });
}
//获取撤单消息
function getCancellationMessage() {
  cancellationMessageSum({ type: 0 }).then(res => {
    if (res.code == 200) {
      revokeNum.value = res.data || 0
    }
  })
  //type  0大货印前，1打样印前
  cancellationMessage({ type: 0, ...revokeParams.value, }).then((res) => {
    if (res.code == 200) {
      revokeData.value = res.data.rows;
      revokeTotal.value = res.data.total;
    }
  })
}
function dotNum(data) {
  let num = data.filter((item) => !item.status).length || 0;
  return num;
}
getCancellationMessage();
//跳转到上传文件页面
function toUpload(data) {
  let path = "";
  switch (data.orderType) {
    case 1://精装盒
      // path = "/prepress/prepressUploadFile1";
      getPrepressFile(data.activityId).then((res) => {
        if (res.code == 200) {
          queryData.value = data
          dialogData.value = res.data;
          preileDialog.value = true;
        }
      })
      break;
    case 0://普通盒
      path = "/prepress/prepressUploadFile2";
      break;
    case 2://双驳盒
      path = "/prepress/prepressUploadFile2";
      break;

    default:
      ElMessage({
        type: "error",
        message: "错误,未知盒型",
      });
      break;
  }
  if (!path) return;
  router.push({
    path: path,
    query: {
      id: data.activityId,
      num: data.productNumber,
      goodsId: data.goodsId,
    },
  });
}
function showAttr(text, type) {
  ElMessageBox.alert(text, type, {
    confirmButtonText: "关闭",
    callback: () => { },
  });
}
//复制成功提示
function copyTextSuccess() {
  ElMessage({
    type: "success",
    message: "复制成功",
  });
}
//下载文件
function downFile(data, type) {
  if (type) {
    let arr = [];
    switch (type) {
      case "customerFile":
        try {
          arr = JSON.parse(data.customerFile).map((item) => {
            return item.fileAddress;
          });
          downPrepressFile(arr, "客户源文件");
        } catch (error) {
          console.log("下载客户源文件失败", error);
          ElMessage.error("没有客户源文件");
        }
        break;
      case "originalFileUrl":
        try {
          arr = JSON.parse(data.originalFileUrl).map((item) => {
            return item.fileAddress;
          });
          downPrepressFile(arr, "正稿文件");
        } catch (error) {
          console.log("下载正稿文件失败", error);
          ElMessage.error("没有正稿文件");
        }
        break;
      case "structuralFileUrl":
        try {
          arr = JSON.parse(data.structuralFileUrl).map((item) => {
            return item.fileAddress;
          });
          downPrepressFile(arr, "结构文件");
        } catch (error) {
          console.log("下载结构文件失败", error);
          ElMessage.error("没有结构文件");
        }
        break;
      case "poxmlUrl":
        try {
          if (!data.poxmlUrl) {
            downXML(data);
          } else {
            arr = [data.poxmlUrl];
            downPrepressFile(arr, "poxml文件");
          }
        } catch (error) {
          console.log("下载poxml文件失败", error);
          ElMessage.error("没有poxml文件");
        }
        break;

      default:
        break;
    }
  }
}
//下载文件
function urlDownFile(url, name) {
  downPrepressFile([url], name);
}
//转移印前单弹窗
function transferDialog(data) {
  dialogType.value = "transfer";
  dialogTitle.value = "转移印前单";
  dialogForm.value.activityId = data.activityId;
  dialogForm.value.poNo = data.poNo;
  dialogVisible.value = true;
}
//驳回弹窗
function rejectDialog(data, type) {
  dialogType.value = type;
  dialogTitle.value = "驳回";
  dialogForm.value.activityId = data.activityId;
  dialogForm.value.poNo = data.poNo;
  dialogForm.value.orderNo = data.orderNo;
  dialogVisible.value = true;
}
//转正稿
function toStructure(data) {
  dialogType.value = "structure";
  dialogTitle.value = "确定转正稿？";
  dialogForm.value.activityId = data.activityId;
  dialogVisible.value = true;
}
//退回文件推送前
function rejectSend(data) {
  console.log(data);
  dialogType.value = "rejectSend";
  dialogTitle.value = "确定退回文件推送前？";
  dialogForm.value.activityId = data.activityId;
  dialogForm.value.poNo = data.poNo;
  dialogForm.value.orderNo = data.orderNo;
  dialogVisible.value = true;
}
const validateFirstEditor = (rule, value, callback) => {
  if (value == "" || !getText(value)) {
    callback(new Error("驳回备注说明"));
  } else {
    callback();
  }
};
const rules = reactive({
  remark: [
    {
      required: true,
      validator: validateFirstEditor,
      trigger: "blur",
    }
  ],
  refuseClassification: [{ required: true, message: "请选择驳回原因分类", trigger: "blur" }],
  username: [{ required: true, message: "请选择接收账号", trigger: "change" }],

});
const formRef = ref(null);

const dialogFormRef = ref(null);
async function dialogConfirm() {
  await dialogFormRef.value.validate((valid, fields) => {
    if (valid) {
      dialogVisible.value = false;
      // if (dialogType.value == 'transfer') {
      //   transfer()
      // } else {
      //   reject()
      // }
      switch (dialogType.value) {
        case "transfer":
          transfer();
          break;
        case "reject":
          reject();
          break;
        case "structure":
          rejectStructure();
          break;
        case "rejectSend":
          rejectFileSend();
          break;

        default:
          break;
      }
    } else {
      console.log("提交失败,校验不通过", fields);
    }
  });
}
//转移印前单
function transfer() {
  // formRef.value.validate((valid, fields) => {
  //   if (valid) {

  let data = {
    activityId: dialogForm.value.activityId,
    poNo: dialogForm.value.poNo,
    transferRemark: dialogForm.value.transferRemark,
    username: dialogForm.value.username,
    type: dialogForm.value.type,
  };
  transferTask(data).then((res) => {
    if (res.code == 200) {
      ElMessage({
        type: "success",
        message: "转移成功",
      });
      getList();
    }
  });
  //   } else {
  //     console.log('提交失败,校验不通过', fields)
  //   }
  // })
}
//驳回
function reject(data) {
  rejectPrepress({
    activityId: dialogForm.value.activityId,
    poNo: dialogForm.value.poNo,
    remark: dialogForm.value.remark,
    orderNo: dialogForm.value.orderNo, //订单号
    remarkImages: dialogForm.value.remarkImages?.split(",").filter((a) => a),
    refuseClassification: dialogForm.value.refuseClassification.toString(),
    type: 0, //订单类型：0大货 1打样
  })
    .then((res) => {
      if (res.code == 200) {
        ElMessage({
          type: "success",
          message: "驳回成功",
        });
      }
    })
    .finally(() => {
      dialogVisible.value = false;
      getList();
    });
}
//退回文件推送前
function rejectFileSend() {
  returnFileBeforePushing({
    activityId: dialogForm.value.activityId,
    orderNo: dialogForm.value.orderNo,
    poNo: dialogForm.value.poNo,
    remark: dialogForm.value.remark,
    refuseClassification: dialogForm.value.refuseClassification.toString(),
    type: 0,
  })
    .then((res) => {
      if (res.code == 200) {
        ElMessage({
          type: "success",
          message: "退回成功",
        });
      }
    })
    .finally(() => {
      dialogVisible.value = false;
      getList();
    });
}
//转正稿
function rejectStructure() {
  transferOrderAcrossNodes({
    activityId: dialogForm.value.activityId,
    remarks: dialogForm.value.remark,
  })
    .then((res) => {
      if (res.code == 200) {
        ElMessage({
          type: "success",
          message: "转正稿成功",
        });
      }
    })
    .finally(() => {
      dialogVisible.value = false;
      getList();
    });
}
//显示撤单消息dialog
function showDialog() {
  if (revokeData.value.length == 0) {
    return;
  } else {
    isRevokeShow.value = true;
    getCancellationMessage()
  }
}
//撤单消息弹窗操作回调
function getRevoke({ data, type }) {
  if (type == 1) {
    agree(data.activityId);
  } else {
    doNotAgree(data.activityId);
  }
}
//不同意撤单
function doNotAgree(id) {
  doNotAgreeToCancelTheOrder(id)
    .then((res) => {
      if (res.code == 200) {
        ElMessage({
          type: "success",
          message: "已拒绝",
        });
      }
    })
    .finally(() => {
      getCancellationMessage();
    });
}
//同意撤单
function agree(id) {
  agreeToWithdraw(id)
    .then((res) => {
      if (res.code == 200) {
        ElMessage({
          type: "success",
          message: "已同意",
        });
      }
    })
    .finally(() => {
      getCancellationMessage();
      getList();
    });
}
let downloadLoadingInstance = null;
//下载poxml
function downXML(scope) {
  // return
  downloadLoadingInstance = ElLoading.service({
    text: "文件下载中，请稍候",
    background: "rgba(0, 0, 0, 0.7)",
  });
  let data = {
    activityId: scope.activityId,
    // "fileGroup": '1',
    goodsId: scope.goodsId,
    orderType: scope.orderType,
    poNo: scope.poNo,
    productAttr: scope.productAttr,
    productNumber: scope.productNumber,
  };
  downloadPoxml(data)
    .then(async (res) => {
      let fileName = "";
      try {
        let str = res.headers["content-disposition"]?.split("filename=")[1];
        if (str) {
          fileName = decodeURI(str);
        } else {
          fileName = false;
        }
      } catch (error) {
        fileName = false;
      }
      const isLogin = await blobValidate(res.data);
      if (isLogin) {
        const blob = new Blob([res.data]);
        saveAs(blob, fileName);
      } else {
        const resText = await res.data.text();
        const rspObj = JSON.parse(resText);
        const errMsg =
          errorCode[rspObj.code] || rspObj.msg || errorCode["default"];
        ElMessage.error(errMsg);
      }
    })
    .catch((r) => {
      console.error(r);
      ElMessage.error("下载文件出现错误，请联系管理员！");
    })
    .finally(() => {
      downloadLoadingInstance.close();
    });
}
//一键三连下载
function threeDownFile(data) {
  let arr = []
  try {
    JSON.parse(data.structuralFileUrl).map((item) => {
      if (item.fileAddress) {
        arr.push(item.fileAddress)
      }
    });
  } catch (error) { }
  try {
    JSON.parse(data.customerFile).map((item) => {
      if (item.fileAddress) {
        arr.push(item.fileAddress)
      }
    });
  } catch (error) { }
  try {
    arr.push(data.designAnnex.find(e => e.fileType == '印前文件')?.fileAddress)
  } catch (error) {
    console.log('添加印前文件错误', error);
  }

  arr.push(data.poxmlUrl)
  // let str = '一键三连'+parseTime(new Date(),'{y}{m}{d}{h}{i}')
  var newArr = [...new Set(arr)]
  zipDownload({ fileList: newArr, name: data.poNo }, data.poNo + '.zip')
}
// 获取变更详情内容
function getChangeContent() {
  changeDetail(changeDetailsParams.value).then(res => {
    if (res.code == '200') {
      // 变更内容
      if (res.data) {
        changeContentData.value = res.data
        changeContentData.value.content = [
          {
            oldGoodsAttr: res.data.updateInfo?.oldGoodsAttr, // 原订单参数
            oldDeliveryDay: res.data.updateInfo?.oldDeliveryDay, // 原货期
            oldOutTime: res.data.updateInfo?.oldOutTime, // 原交货日期
            goodsAttr: res.data.updateInfo?.goodsAttr, // 新订单参数
            deliveryDay: res.data.updateInfo?.deliveryDay, // 新货期
            outTime: res.data.updateInfo?.outTime, // 新交货日期
            deliveryDayAdd: res.data.updateInfo?.deliveryDayAdd // 货期额外添加
          },
          {
            oldFile: res.data.updateInfo?.oldFile, // 原客户文件
            file: res.data.updateInfo?.file // 新客户文件
          }
        ]
        // 变更费用
        changeContentData.value.cost = [{
          orderAmount: res.data.orderAmount, // 订单金额(税金+运费)
          orderAmountDiff: res.data.orderAmountDiff // 订单金额差价
        }]
      } else {
        changeContentData.value.content = []
        changeContentData.value.cost = []
      }
    }
  }).catch(err => {
    console.log('报错了', err);
  })
}

// 变更状态暂停禁用
const pauseDisable = (status) => {
  // status  1 变更暂停中  2 变更处理中
  if (status == 1) {
    return true
  }
  return false
}
// 查看变更内容
const checkChangeContent = (data) => {
  let { poNo, orderChangeFlag } = data
  // status  1: 订单变更暂停中  2:订单变更处理中
  changeDetailsParams.value.poNo = poNo
  changeDialog.value = true
  getChangeContent()
}
</script>

<style lang="scss" scoped>
@import "./style.css";

.changeStatus {
  color: white;
  background-color: red;
  width: 80px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.artwork-workbench {
  .top-bar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    padding: 0 10px;
  }

  .btnMt {
    margin-top: 10px;
  }
}

.overflow-tooltip {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
}

:deep(.el-popper) {
  max-width: 400px;
  word-break: break-all;
}

:deep(.el-input-group__append) {
  background-color: #409EFF;
  border-color: #409EFF;
  color: #ffffff;
  box-shadow: none;
}

.red-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: rgb(247, 70, 70);
  position: relative;
  top: -4px;
}

.alignRight {
  text-align: right;
}

.msgbtn {
  margin-left: 10px;
}

.listText {
  font-weight: 600;
}

.titleBox {
  display: flex;
  justify-content: space-between;
}

.red {
  color: #F56C6C;
}

.disposeBox {
  display: flex;
}

.divsn {
  p {
    font-weight: 600;
    margin: 5px 0 0 0;
    height: 17px;
  }

  span {
    color: #409EFF;
  }
}
</style>
