<template>
  <div class="unitChargeDetailContainer">
    <CommonBreadCrumb :first="'计费规则配置'" :marginBottom="'16px'" />
    <div class="unitChargeDetailBox">
      <div class="leftContainer">
        <div class="versions">{{ "V" + detailData.version }}</div>
        <div class="detailText">计费规则详情</div>
        <div class="detailBox">
          <div class="titleBox">
            <div>工艺:</div>
            <div>计价公式:</div>
            <div>创建时间:</div>
            <div>加工商:</div>
            <div>状态:</div>
            <div>启用时间:</div>
          </div>
          <div class="contentBox">
            <div>{{ detailData.attributeName }}</div>
            <div>{{ detailData.formulaDesc }}</div>
            <div>{{ detailData.createTime }}</div>
            <div>{{ detailData.manufacturerName }}</div>
            <!-- <div>{{ detailData.manufacturerName + '-' + detailData.relationName }}</div> -->
            <div style="color: #666666" :style="colorMap[detailData.ruleStatus]">
              {{ statusMap[detailData.ruleStatus] }}
            </div>
            <div>
              <span>{{ parseTime(detailData.enableTime, '{y}-{m}-{d}') }}</span>
              <span v-if="detailData.ruleStatus == 3 && detailData.auditStatus == 3">（未到启用时间）</span>
            </div>
          </div>
        </div>
        <div class="tableBox">
          <el-table :data="detailData.attributeTypes" border style="width: 100%">
            <el-table-column prop="date" label="类型" width="180px" align="center">
              <template #default="scope">
                <div style="color: #333333">{{ scope.row.typeName }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="单价规则" align="center">
              <template #default="scope">
                <template v-if="isEdit">
                  <!-- 折扣优惠编辑 -->
                  <ul class="discountEditBox" v-if="scope.row.typeName == '折扣优惠'">
                    <li class="publicLi">
                      <div class="td-first-fixed">优惠方式</div>
                      <div>折扣</div>
                      <!--  自动补齐剩余的列，这样和上面的表格中的数据列数对齐 -->
                      <template v-for="(val, index) in attributeIdHeader(detailData.attributeId)">
                        <!--  排除第1,2和最后一列 -->
                        <div v-if="index > 0"></div>
                      </template>
                      <div class="null" style="border-right: 0px;"></div>
                    </li>
                    <li class="publicLi">
                      <div class="td-first-fixed">
                        <el-select v-model="detailData.preferentialWay" placeholder="请选择优惠" size="small"
                          class="discountSelect" popper-class="discountSelect" @change="discountsChange">
                          <el-option v-for="item in discountsList" :key="item.value" :label="item.label"
                            :value="item.value" />
                        </el-select>
                      </div>
                      <div class="inputBox">
                        <el-input type="text" class="input" placeholder="0" width="100px" v-model="detailData.discountVal"
                          :value="detailData.discountVal" :disabled="detailData.preferentialWay == 1 ? true : false"
                          @input="inputChange(scope.$index, index, 5, detailData.discountVal)" />
                      </div>
                      <!--  自动补齐剩余的列，这样和上面的表格中的数据列数对齐 -->
                      <template v-for="(val, index) in attributeIdHeader(detailData.attributeId)">
                        <!--  排除第1,2和最后一列 -->
                        <div v-if="index > 0"></div>
                      </template>
                      <div class="null" style="border-right: 0px;"></div>
                    </li>
                  </ul>
                  <!-- 阶梯编辑 -->
                  <ul class="ladderEditBox" v-else>
                    <li class="publicLi">
                      <div class="td-first-fixed">数量阶梯</div>
                      <!-- <div>最低消费(元)</div> -->
                      <!-- <div>单价({{ getUnits(scope.row.billRuleDetails[0].unitPriceUnit)}})</div> -->
                      <!-- <div v-if="detailData.attributeId != 2">小尺寸单价(元/张)</div> -->
                      <div v-for="val in attributeIdHeader(detailData.attributeId)">{{ val.title }}</div>
                      <div style="border-right: 0px;">操作</div>
                    </li>
                    <li class="publicLi" v-for="(item, index) in scope.row.billRuleDetails" :key="item.id">
                      <div class="td-first-fixed inputBox">
                        {{ item.gradStart }} -
                        <span v-if="item.showWSX" style="margin-left: 8px">无上限</span>
                        <el-input type="text" class="input" placeholder="0" v-model="item.gradEnd" :value="item.gradEnd"
                          @input="inputChange(scope.$index, index, 1, item.gradEnd)"
                          @blur="inputBlur(scope.$index, index, 1, item.gradEnd)" v-else />
                      </div>
                      <!-- <div class="inputBox">
                        <el-input type="text" class="input" placeholder="0" v-model="item.lowestConsume"
                          :value="item.lowestConsume" @input="inputChange(scope.$index, index, 2, item.lowestConsume,'lowestConsume')"
                          @blur="inputBlur(scope.$index, index, 2, item.lowestConsume,'lowestConsume')" />
                      </div> -->
                      <div class="inputBox" v-for="val in attributeIdHeader(detailData.attributeId)">
                        <el-input type="text" class="input" placeholder="0" v-model="item[val.key]" :value="item[val.key]"
                          @input="inputChange(scope.$index, index, 3, item[val.key], val.key,val)"
                          @blur="inputBlur(scope.$index, index, 3, item[val.key], val.key)" />
                      </div>
                      <!-- <div class="inputBox">
                        <el-input type="text" class="input" placeholder="0" v-model="item.unitPrice"
                          :value="item.unitPrice" @input="inputChange(scope.$index, index, 3, item.unitPrice)"
                          @blur="inputBlur(scope.$index, index, 3, item.unitPrice)" />
                      </div>
                      <div class="inputBox" v-if="detailData.attributeId != 2">
                        <el-input type="text" class="input" placeholder="0" v-model="item.sffUnitPrice"
                          :value="item.sffUnitPrice" @input="inputChange(scope.$index, index, 4, item.sffUnitPrice)"
                          @blur="inputBlur(scope.$index, index, 4, item.sffUnitPrice)" />
                      </div> -->
                      <div class="operate" style="border-right: 0px;">
                        <img class="delImg" src="@/assets/images/delete.png" alt="" v-if="!(index == 0 && item.showWSX)"
                          @click="deleteLadder(scope.$index, index)" />
                      </div>
                    </li>
                    <li class="addJTContainer">
                      <div class="addBox">
                        <div class="addJTBox" @click="addLadder(scope.$index)">
                          <img class="addImg" src="@/assets/images/add2.png" alt="" />
                          <div class="addJTText">添加阶梯</div>
                        </div>
                      </div>
                      <div class="addNull" :style="detailData.attributeId == 2 ? 'width:99px;' : ''"></div>
                    </li>
                  </ul>
                </template>
                <template v-if="isNormal">
                  <!-- 折扣优惠回显 -->
                  <ul class="discountEchoBox" v-if="scope.row.typeName == '折扣优惠'">
                    <li class="publicLi">
                      <div class="td-first-fixed">优惠方式</div>
                      <div>折扣</div>
                      <!--  自动补齐剩余的列，这样和上面的表格中的数据列数对齐 -->
                      <template v-for="(val, index) in attributeIdHeader(detailData.attributeId)">
                        <!--  排除已有的第1,2列 -->
                        <div v-if="index > 0"></div>
                      </template>
                    </li>
                    <li class="publicLi">
                      <div class="td-first-fixed">{{ discountsStatusMap[detailData.preferentialWay] }}</div>
                      <div>{{ detailData.discountVal == false ? '--' : detailData.discountVal }}</div>
                      <!--  自动补齐剩余的列，这样和上面的表格中的数据列数对齐 -->
                      <template v-for="(val, index) in attributeIdHeader(detailData.attributeId)">
                        <!--  排除已有的第1,2列 -->
                        <div v-if="index > 0"></div>
                      </template>
                    </li>
                  </ul>
                  <!-- 阶梯回显 -->
                  <ul class="ladderEchoBox" v-else>
                    <li class="publicLi">
                      <div class="td-first-fixed">数量阶梯</div>
                      <!-- <div>最低消费(元)</div> -->
                      <!-- <div>单价(元/平方米)</div>
                      <div v-if="detailData.attributeId != 2">小尺寸单价(元/张)</div> -->
                      <div v-for="val in attributeIdHeader(detailData.attributeId)">{{ val.title }}</div>
                    </li>
                    <li class="publicLi" v-for="(item, index) in scope.row.billRuleDetails" :key="item.id">
                      <div class="td-first-fixed">{{ item.gradStart }} - <span v-if="item.showWSX">无上限</span><span
                          v-else>{{ item.gradEnd
                          }}</span>
                      </div>
                      <!-- <div>{{ item.lowestConsume }}</div> -->
                      <div v-for="val in attributeIdHeader(detailData.attributeId)">{{ item[val.key] }}</div>
                      <!-- <div>{{ item.unitPrice }}</div>
                      <div v-if="detailData.attributeId != 2">{{ item.sffUnitPrice }}</div> -->
                    </li>
                  </ul>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="footer">
          <el-form-item class="submitBox">
            <template v-if="showBtn">
              <el-button type="primary" plain class="noSave" @click="btnClick(1)">放弃保存</el-button>
              <el-button type="primary" plain class="saveDraft" @click="btnClick(2)">保存草稿</el-button>
              <el-button type="primary" class="search_button submitAudit" @click="btnClick(3)">提交审核</el-button>
            </template>
            <template v-if="showBtn == false">
              <el-button type="primary" class="search_button addVersions" @click="btnClick(4)">新增版本</el-button>
            </template>
            <!-- <el-button class="back" @click="back">返回</el-button> -->
          </el-form-item>
        </div>
      </div>
      <div class="rightContainer">
        <!-- 审核流程容器 -->
        <div class="auditFlowContainer">
          <div class="auditHeadBox">
            <div class="text">审核流程</div>
            <div class="operateBox">
              <template v-if="!isPutAway">
                <div style="display: flex;cursor: pointer;" @click="putAwayClick">
                  <div class="text">收起</div>
                  <img class="img" src="@/assets/images/up.png" alt="" />
                </div>
              </template>
              <template v-else>
                <div style="display: flex;cursor: pointer;" @click="isPutAway = false">
                  <div class="text">展开</div>
                  <img class="img" src="@/assets/images/down.png" alt="" />
                </div>
              </template>
            </div>
          </div>
          <div class="auditFlowBox">
            <template v-if="auditData.length">
              <!-- 正常审核流程 -->
              <div class="flowBox" v-if="!isPutAway">
                <el-steps direction="vertical">
                  <el-step v-for="item in auditData">
                    <template v-slot:icon>
                      <img class="statusImg" :src="imgDispose(item.auditStatus)" alt="" />
                    </template>
                    <template v-slot:title>
                      <div class="itemBox">
                        <div class="headBox">
                          <div class="name">
                            <span v-if="item.auditUserName">{{ item.auditUserName }}-</span>
                            <span>{{ item.roleName }}</span>
                          </div>
                          <div class="tiemBox" v-if="item.auditStatus == -1">
                            <div class="title">提交时间:</div>
                            <div class="time">{{ item.auditTime }}</div>
                          </div>
                          <!-- v-if="item.auditStatus != -1 && item.auditStatus != 5" -->
                          <div class="tiemBox" v-else>
                            <div class="title">审核时间:</div>
                            <div class="time">{{ item.auditTime || '-' }}</div>
                          </div>
                          <div class="resultBox">
                            <div class="title">流程状态:</div>
                            <div class="result" :style="auditColorMap[item.auditStatus]">{{
                              auditStatusMap[item.auditStatus] }}</div>
                          </div>
                        </div>
                        <div class="reasonBox" v-if="item.remark">{{ item.remark }}</div>
                      </div>
                    </template>
                  </el-step>
                </el-steps>
              </div>
              <!-- 收起审核流程 -->
              <div class="putAwayFlowBox" v-else>
                <el-steps direction="vertical">
                  <el-step>
                    <template v-slot:icon>
                      <img class="statusImg" :src="imgDispose(auditData[0].auditStatus)" alt="" />
                    </template>
                    <template v-slot:title>
                      <div class="itemBox">
                        <div class="headBox">
                          <div class="name">
                            <span v-if="auditData[0].auditUserName">{{ auditData[0].auditUserName }}-</span>
                            <span>{{ auditData[0].roleName }}</span>
                          </div>
                          <div class="tiemBox" v-if="auditData[0].auditStatus == -1">
                            <div class="title">提交时间:</div>
                            <div class="time">{{ auditData[0].auditTime }}</div>
                          </div>
                          <!-- v-if="auditData[0].auditStatus != -1 && auditData[0].auditStatus != 5" -->
                          <div class="tiemBox" v-else>
                            <div class="title">审核时间:</div>
                            <div class="time">{{ auditData[0].auditTime || '-' }}</div>
                          </div>
                          <div class="resultBox">
                            <div class="title">流程状态:</div>
                            <div class="result" :style="auditColorMap[auditData[0].auditStatus]">{{
                              auditStatusMap[auditData[0].auditStatus] }}</div>
                          </div>
                        </div>
                        <div class="reasonBox" v-if="auditData[0].remark">{{ auditData[0].remark }}</div>
                      </div>
                    </template>
                  </el-step>
                  <el-step>
                    <template v-slot:icon>
                      <img class="statusImg" src="../../assets/images/greenRound.png" alt="" />
                    </template>
                    <template v-slot:title>
                      <div class="unfoldBox">共收起{{ auditData.length - 2 }}个审核流程</div>
                    </template>
                  </el-step>
                  <el-step>
                    <template v-slot:icon>
                      <img class="statusImg" :src="imgDispose(auditData[auditData.length - 1].auditStatus)" alt="" />
                    </template>
                    <template v-slot:title>
                      <div class="itemBox">
                        <div class="headBox">
                          <div class="name">
                            <span v-if="auditData[auditData.length - 1].auditUserName">{{ auditData[auditData.length -
                              1].auditUserName
                            }}-</span>
                            <span>{{ auditData[auditData.length - 1].roleName }}</span>
                          </div>
                          <div class="tiemBox" v-if="auditData[auditData.length - 1].auditStatus == -1">
                            <div class="title">提交时间:</div>
                            <div class="time">{{ auditData[auditData.length - 1].auditTime }}</div>
                          </div>
                          <!-- v-if="auditData[auditData.length - 1].auditStatus != -1 && auditData[auditData.length - 1].auditStatus != 5" -->
                          <div class="tiemBox" v-else>
                            <div class="title">审核时间:</div>
                            <div class="time">{{ auditData[auditData.length - 1].auditTime || '-' }}</div>
                          </div>
                          <div class="resultBox">
                            <div class="title">流程状态:</div>
                            <div class="result" :style="auditColorMap[auditData[auditData.length - 1].auditStatus]">{{
                              auditStatusMap[auditData[auditData.length - 1].auditStatus] }}</div>
                          </div>
                        </div>
                        <div class="reasonBox" v-if="auditData[auditData.length - 1].remark">{{ auditData[auditData.length
                          - 1].remark }}</div>
                      </div>
                    </template>
                  </el-step>
                </el-steps>
              </div>
            </template>
            <!-- 空流程提示 -->
            <div class="emptyFlowBox" v-else>
              <img class="img" src="@/assets/images/emptyFlow.png" alt="" />
              <div class="text">暂无审核流程~</div>
            </div>
          </div>
        </div>
        <!-- 历史版本容器 -->
        <div class="versionContainer">
          <div class="headBox">
            <div class="text">历史版本</div>
            <div class="catBox" @click="toPage">
              <div class="text">查看全部历史</div>
              <img class="img" src="@/assets/images/right.png" alt="" />
            </div>
          </div>
          <div class="versionsTableBox">
            <el-table :data="versionsData" border :row-style="cellStyle" @row-click="row => jumpPage(row)">
              <el-table-column label="版本号" align="center">
                <template #default="scope">
                  <div>
                    <span v-if="scope.row.version">{{ 'V' + scope.row.version }}</span>
                    <span v-if="scope.row.version == detailData.version">（当前版本）</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" align="center">
                <template #default="scope">
                  <div>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}') }}</div>
                </template>
              </el-table-column>
              <el-table-column label="状态" align="center">
                <template #default="scope">
                  <div style="color: #666666" :style="colorMap[scope.row.ruleStatus]">
                    {{ statusMap[scope.row.ruleStatus] }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div class="popupContainer">
      <el-dialog v-model="showPop" :show-close="false" :close-on-click-modal="false" align-center width="500"
        style="height: 280px;box-sizing: border-box;">
        <template #header>
          <div class="hintBox">
            <div class="text">提示</div>
            <img class="closeImg" src="@/assets/images/close.png" alt="" @click="closePopup" />
          </div>
        </template>
        <div class="hintContent" v-if="btnStatus == 1">
          是否确认放弃保存，确认后将删除修改！
        </div>
        <div class="hintContent" v-if="btnStatus == 2">是否确认保存草稿！</div>
        <div class="hintContent" v-if="btnStatus == 3">是否确认提交审核！</div>
        <div class="hintContent" v-if="btnStatus == 4">是否确认新增版本！</div>
        <div class="btnBox">
          <el-button type="primary" class="search_button confirm" @click="confirmClick">确定</el-button>
          <el-button type="primary" plain class="cancel" @click="closePopup">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script name="unitChargeRuleCGDetail" setup>
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import greenRound from '../../assets/images/greenRound.png';
import redRound from '../../assets/images/redRound.png';
import yellowRound from '../../assets/images/yellowRound.png';
import { getParkDetail, submitAudit, updateBillRule, addBillRuleVersion, getAuditRecordList, getBillRuleHisPage } from "@/api/modules/unitChargeRule";
import { parseTime } from "@/utils/util"
import { setLoginModule, openNewPage } from "@/utils/commonApi"
import { attributeIdHeader } from "@/utils/maps/commonMap"
import {useBroadcast} from '@/hooks/component/useBroadcast'
const router = useRouter();
const route = useRoute();
let { id } = route.query;
// 详情数据
let detailData = ref({});
// 审核数据
let auditData = ref([])
// 是否可以编辑
let isEdit = ref(false)
// 是否正常
let isNormal = ref(false)
// 是否显示按钮   true  显示其他按钮  false 显示新增版本按钮   null  所有按钮不显示
let showBtn = ref(false)
// 是否收起流程
let isPutAway = ref(false)
// 历史版本数据
let versionsData = ref([])
// 状态处理成文字
let statusMap = {
  1: "草稿",
  2: "审核中",
  3: "未启用",
  4: "启用中",
  5: "已失效",
};
// 文字颜色处理
let colorMap = {
  1: "color:#338F7A",
  2: "color:#F9B300;",
};
// 审核状态颜色处理
let auditColorMap = {
  '-1': "color: #666666;",
  1: "color:#338F7A;",
  2: "color:#f14932;",
  3: "color:#338F7A;",
  4: "color:#f14932;",
  5: "color:#F9B300;"
}
// 审核状态处理成文字 
// 审核状态：1.采购经理通过，2.采购经理不通过，3.产业园财务通过，4.产业园财务不通过
let auditStatusMap = {
  '-1': '提交审核',
  1: "审核通过",
  2: "审核不通过",
  3: "审核通过",
  4: "审核不通过",
  5: "审核中"
};
// 优惠列表
let discountsList = reactive([
  {
    label: "无优惠",
    value: 1,
  },
  // {
  //   label: "加工费折扣",
  //   value: 2,
  // }
]);
// 优惠状态处理成文字
let discountsStatusMap = {
  1: '无优惠',
  // 2: '加工费折扣'
}
// 优惠值
let discountsValue = ref("1");
// 是否显示弹窗
let showPop = ref(false);
// 按钮状态
let btnStatus = ref("");
// 是否新增版本
let addVersion = ref(false)
// 新增版本
// let addVersionData = ref({});
// 是否第一次
let num = ref(1)
// 图片处理
function imgDispose(status) {
  if (status == -1 || status == 1 || status == 3) {
    return greenRound
  } else if (status == 2 || status == 4) {
    return redRound
  } else if (status == 5) {
    return yellowRound
  }
}
// 按钮点击事件
const btnClick = (status) => {
  // status  1  放弃保存 2 保存草稿 3 提交审核 4 新增版本
  btnStatus.value = status;
  showPop.value = true;
};
// 收起事件
const putAwayClick = () => {
  if (auditData.value.length > 3) {
    isPutAway.value = true
  }
}
// 优惠改变
const discountsChange = () => {
  detailData.value.discountVal = ""
}
// 关闭弹窗
const closePopup = () => {
  showPop.value = false;
};
// 跳转页面
const toPage = () => {
  let pathInfo = router.resolve({ //使用resolve
    name: 'historyVersionList',    //这里是跳转页面的name
    // path: '/unitChargeRule/historyVersionList',
    path: `/${setLoginModule()}/unitChargeRule/historyVersionList`,
    query: {
      attributeId: detailData.value.attributeId, // 工艺id
      manufacturerId: detailData.value.manufacturerId, // 加工商类型id
      valuationFormulaId: detailData.value.valuationFormulaId, // 计价公式id
      version: detailData.value.version,
      detail: '/unitChargeRule/unitChargeRuleCGDetail'
    }
  })
  window.open(pathInfo.href, '_blank')
};
// 当前行跳转
const jumpPage = (row) => {
  console.log('row', row);
  console.log('version', detailData.value.version);
  if (row.version == detailData.value.version) {
    return
  }
  openNewPage(`/unitChargeRule/unitChargeRuleCGDetail?id=${row.id}`)
}
// 获取计费规则详情
async function getRuleDetail() {
  let { code, data, message } = await getParkDetail({ id });
  if (code == "000000") {
    if (Object.keys(data).length && data.attributeTypes.length) {
      data.attributeTypes.push({
        typeName: "折扣优惠",
      });
      data.attributeTypes.forEach(item => {
        if (item.billRuleDetails?.length) {
          item.billRuleDetails = item.billRuleDetails.map(i => {
            if (!i.gradEnd) {
              i.showWSX = true
            } else {
              i.showWSX = false
            }
            return i
          })
        }
      })
    }
    data.discountVal = data.discountVal?.substring(0, data.discountVal.indexOf(".") + 3) || ''
    detailData.value = data;

    getHistoryVersions()
    auditLogging()
    // ruleStatus  状态：1.草稿，2.审核中，3.未启用，4.启用中，5.已失效
    // auditStatus 审核状态：1.采购经理通过，2.采购经理不通过，3.产业园财务通过，4.产业园财务不通过
    let ruleStatus = [4, 5]
    if (detailData.value.ruleStatus == 1) {
      isEdit.value = true
      isNormal.value = false
      showBtn.value = true
    } else if (detailData.value.ruleStatus == 2) {
      isNormal.value = true
      isEdit.value = false
      showBtn.value = null  // 不显示按钮
    } else if (detailData.value.ruleStatus == 3) {
      // 审核状态：1.采购经理通过，2.采购经理不通过，3.产业园财务通过，4.产业园财务不通过
      if (detailData.value.auditStatus == 1) {
        // 只能查看
        isNormal.value = true
        isEdit.value = false
        showBtn.value = null
      }
      // 审核通过  未到启用时间   不可编辑   只显示新增版本按钮
      if (detailData.value.auditStatus == 3) {
        isNormal.value = true
        isEdit.value = false
        showBtn.value = false  //  显示新增版本
      }
      // 审核不通过 可编辑  显示放弃保存  保存草稿   提交审核按钮
      if (detailData.value.auditStatus == 2 || detailData.value.auditStatus == 4) {
        isNormal.value = false
        isEdit.value = true
        showBtn.value = true
      }
    } else if (ruleStatus.includes(detailData.value.ruleStatus)) {
      isNormal.value = true
      isEdit.value = false
      showBtn.value = false
    }
  } else {
    if (!detailData.value.ruleStatus) {
      console.log('ddsggd');
      showBtn.value = null
    }
    ElMessage.error(message);
  }
}

getRuleDetail();

/**
 * 获取单价的展示单位类型
 * @param {*} type 
 */
const getUnitsType = () => {
  const arr = attributeIdHeader(detailData.value.attributeId)
  let types = 0
  arr.forEach(item => {
    if (item.unitPriceUnit) types = item.unitPriceUnit
  })
  return types
}
// 获取审核流程
async function auditLogging() {
  let { code, data, message } = await getAuditRecordList({ id });
  if (code == '000000') {
    auditData.value = data
    console.log('detailData.value', detailData.value.ruleStatus);
    if (detailData.value.ruleStatus == 2) {
      if (detailData.value.auditStatus == -1) {
        auditData.value.push({
          auditStatus: 5,
          auditTime: "",
          auditUserName: "",
          roleName: "采购经理"
        })
      } else if (detailData.value.auditStatus == 1) {
        auditData.value.push({
          auditStatus: 5,
          auditTime: "",
          auditUserName: "",
          roleName: "产业园财务"
        })
      }
    }
    if (auditData.value.length > 3) {
      isPutAway.value = true
    } else {
      isPutAway.value = false
    }
    console.log('auditData', auditData.value);
  } else {
    ElMessage.error(message)
  }
}


// 获取历史版本数据
async function getHistoryVersions() {
  let param = {
    attributeId: detailData.value.attributeId, // 工艺id
    manufacturerId: detailData.value.manufacturerId, // 加工商类型id
    pageNumber: 1, // 当前页
    pageSize: 3, // 显示条数
    valuationFormulaId: detailData.value.valuationFormulaId // 计价公式id
  }
  let { code, data, message } = await getBillRuleHisPage(param);
  if (code == '000000') {
    versionsData.value = data.items
  } else {
    ElMessage.error(message)
  }
}

const cellStyle = (row) => {
  if (row.row.version == detailData.value.version) {
    return { cursor: "not-allowed" }
  } else {
    return { cursor: "pointer" }
  }
}

import {trimToNumber,trimLastDigit,improveImgUrl} from '@/utils/util'
// 添加阶梯
const addLadder = (index) => {
  let billRuleDetails = detailData.value.attributeTypes[index].billRuleDetails;
  let isPush = false;
  billRuleDetails.forEach(item => {
    isPush = item.showWSX
  })
  if (isPush) {
    console.log('billRuleDetails.length', billRuleDetails.length);
    billRuleDetails.splice(billRuleDetails.length - 1, 0, {
      billRuleId: 0,
      gradEnd: "",
      gradStart: 0,
      id: billRuleDetails.length + 1,
      lowestConsume: '0.00',
      param1Type: 0,

      // lowestUnit: 0,
      // sffUnitPrice: 0,
      // sffUnitPriceUnit: 0,//三个旧字段去掉，新增下面四个新字段
      pieceUnitPrice: '0.00',
      machineAdjustCost: '0.00',
      machineAdjustPrice: '0.00',
      modNum: 0,

      unitPrice: '0.00',
      unitPriceUnit: getUnitsType(),
      showWSX: false
    }
    )
  } else {
    billRuleDetails.push({
      billRuleId: 0,
      gradEnd: "",
      gradStart: 0,
      id: 0,
      lowestConsume: 0,
      param1Type: 0,

      // lowestUnit: 0,
      // sffUnitPrice: 0,
      // sffUnitPriceUnit: 0,//三个旧字段去掉，新增下面四个新字段
      pieceUnitPrice: '0.00',
      machineAdjustCost: '0.00',
      machineAdjustPrice: '0.00',
      modNum: 0,

      unitPrice: '0.00',
      unitPriceUnit: getUnitsType(),
      showWSX: false
    })
  }
  billRuleDetails.forEach((item, index) => {
    if (index > 0) {
      item.gradStart = billRuleDetails[index - 1].gradEnd ? Number(billRuleDetails[index - 1].gradEnd) + 1 : Number(billRuleDetails[index - 1].gradStart + 2)
    }
    item.gradEnd = item.gradEnd ? item.gradEnd : item.gradStart + 1
  })
};

// 删除阶梯
const deleteLadder = (fIndex, zIndex) => {
  detailData.value.attributeTypes[fIndex].billRuleDetails = detailData.value.attributeTypes[fIndex].billRuleDetails.filter((item, index) => {
    return index != zIndex
  })
  if (detailData.value.attributeTypes[fIndex].billRuleDetails.length) {
    detailData.value.attributeTypes[fIndex].billRuleDetails[0].gradStart = 0
  } else if (detailData.value.attributeTypes[fIndex].billRuleDetails.length < 2) {
    detailData.value.attributeTypes[fIndex].billRuleDetails = [{
      billRuleId: 0,
      gradEnd: "",
      gradStart: 0,
      id: 0,
      lowestConsume: 0,
      param1Type: 0,

      // lowestUnit: 0,
      // sffUnitPrice: 0,
      // sffUnitPriceUnit: 0,//三个旧字段去掉，新增下面四个新字段
      pieceUnitPrice: '0.00',
      machineAdjustCost: '0.00',
      machineAdjustPrice: '0.00',
      modNum: 0,

      unitPrice: '0.00',
      unitPriceUnit: getUnitsType(),
      showWSX: true
    }]
  }
  detailData.value.attributeTypes[fIndex].billRuleDetails.forEach((item, index) => {
    if (index > 0) {
      item.gradStart = Number(detailData.value.attributeTypes[fIndex].billRuleDetails[index - 1].gradEnd) + 1
      console.log('detailData.value.attributeTypes[fIndex].billRuleDetails[index]', Number(detailData.value.attributeTypes[fIndex].billRuleDetails[index - 1].gradEnd));
    }
  })
  let length = detailData.value.attributeTypes[fIndex].billRuleDetails.length;
  detailData.value.attributeTypes[fIndex].billRuleDetails[length - 1].gradEnd = 0
  detailData.value.attributeTypes[fIndex].billRuleDetails[length - 1].showWSX = true
}

// 正则格式(整数,小数点两位)
const regFormat = (value, int = 8) => {
  // 先把非数字的都替换掉，除了数字和小数点
  value = value.replace(/[^\d.]/g, "");
  // 必须保证第一个为数字而不是小数点
  value = value.replace(/^\./g, "");
  // 保证只有出现一个小数点而没有多个小数点
  value = value.replace(/\.{2,}/g, ".");
  // 保证小数点只出现一次，而不能出现两次以上
  value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
  // 保证只能输入两个小数  
  value = value.replace(/^(\d+)\.(\d{0,2}).*$/, '$1.$2');
  // 只能8位整数
  let index = value.indexOf('.')
  if (index > -1) {
    value = value.slice(0, index < int ? index : int) + value.slice(index)
  } else {
    value = value.slice(0, int)
  }
  return value
}


// 输入框改变
const inputChange = (fIndex, zIndex, type, value, key) => {
  // 最多保留两位小数正则
  // let decimalsReg = value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '');
  // type 1 阶梯结束值 2 最低消费 3 单价小尺寸 4 单价 5 折扣
  if (type == 1) {
    if (value == 0) {
      detailData.value.attributeTypes[fIndex].billRuleDetails[zIndex].gradEnd = ""
    } else {
      // 正则  只能输入整数并且不能0开头
      detailData.value.attributeTypes[fIndex].billRuleDetails[zIndex].gradEnd = value.replace(/\D|(^0+(?=\d))/g, '').slice(0, 8)
    }
  } else {
    console.log('AAAA',value)
    detailData.value.attributeTypes[fIndex].billRuleDetails[zIndex][key] = trimToNumber(value,9,2,false)
  }
  // if (type == 2) {
  //   // 整数8位,小数点2位
  //   detailData.value.attributeTypes[fIndex].billRuleDetails[zIndex].lowestConsume = regFormat(value, 8)
  // }
  // if (type == 3) {
  //   detailData.value.attributeTypes[fIndex].billRuleDetails[zIndex].unitPrice = regFormat(value, 8)
  // }
  // if (type == 4) {
  //   detailData.value.attributeTypes[fIndex].billRuleDetails[zIndex].sffUnitPrice = regFormat(value, 8)
  // }
  // if (type == 5) {
  //   // detailData.value.discountVal = regFormat(value,3)  // 后面需要确定
  // }
}

// 输入框失去焦点改变
const inputBlur = (fIndex, zIndex, type, value, key,item) => {
  console.log('下标', fIndex, zIndex);
  // let data=JSON.parse(JSON.stringify(detailData.value.attributeTypes[fIndex].billRuleDetails))
  if (type == 1) {
    if (value <= detailData.value.attributeTypes[fIndex].billRuleDetails[zIndex].gradStart || value == "") {
      console.log('1111');
      detailData.value.attributeTypes[fIndex].billRuleDetails[zIndex].gradEnd = detailData.value.attributeTypes[fIndex].billRuleDetails[zIndex].gradStart + 1
      detailData.value.attributeTypes[fIndex].billRuleDetails[zIndex + 1].gradStart = detailData.value.attributeTypes[fIndex].billRuleDetails[zIndex].gradEnd + 1
    } else {
      detailData.value.attributeTypes[fIndex].billRuleDetails.forEach((item, index) => {
        if (index > zIndex) {
          item.gradStart = Number(detailData.value.attributeTypes[fIndex].billRuleDetails[index - 1].gradEnd) + 1
          if (item.gradEnd < item.gradStart) {
            item.gradEnd = Number(detailData.value.attributeTypes[fIndex].billRuleDetails[index].gradStart) + 1
          } else {
            item.gradEnd = item.gradEnd
          }
        }
      })
    }
    let length = detailData.value.attributeTypes[fIndex].billRuleDetails.length;
    detailData.value.attributeTypes[fIndex].billRuleDetails[length - 1].gradEnd = 0
    detailData.value.attributeTypes[fIndex].billRuleDetails[length - 1].showWSX = true
  } else {
    detailData.value.attributeTypes[fIndex].billRuleDetails[zIndex][key] = trimLastDigit(value)
    if (!value || value == false) detailData.value.attributeTypes[fIndex].billRuleDetails[zIndex][key] = item.numberType==1?0:'0.00'
  }

  // if (type == 2) {
  //   if (!value || value == false) {
  //     detailData.value.attributeTypes[fIndex].billRuleDetails[zIndex].lowestConsume = 0
  //   }
  // }
  // if (type == 3) {
  //   if (!value || value == false) {
  //     detailData.value.attributeTypes[fIndex].billRuleDetails[zIndex].unitPrice = 0
  //   }
  // }
  // if (type == 4) {
  //   if (!value || value == false) {
  //     detailData.value.attributeTypes[fIndex].billRuleDetails[zIndex].sffUnitPrice = 0
  //   }
  // }
}

// 频道事件
const channelEvent = () => {
  //刷新待办列表
  let {postRefreshPendingListMessage}  = useBroadcast()
  postRefreshPendingListMessage();
  //刷新规则列表
  let channel = new BroadcastChannel("channel-unitChargeRuleListCG");
  channel.postMessage({ refreshData: true })
  setTimeout(() => {
    channel.close()
    window.close()
  }, 1000)
}

// 保存草稿
async function saveDraft(param) {
  let { code, data, message } = await updateBillRule(param);
  if (code == '000000') {
    ElMessage.success(message)
  } else {
    ElMessage.error(message)
  }
}

// 提交审核
async function submitCheck(param) {
  let { code, data, message } = await submitAudit(param);
  if (code == '000000') {
    ElMessage.success(message)
    channelEvent()
  } else {
    ElMessage.error(message)
  }
}

// 新增版本
async function addNewVersion(param) {
  let { code, data, message } = await addBillRuleVersion(param);
  if (code == '000000') {
    // 保存草稿
    if (btnStatus.value == 2) {
      saveDraft(JSON.parse(JSON.stringify(data)))
    } else if (btnStatus.value == 3) {
      // 提交审核
      submitCheck(JSON.parse(JSON.stringify(data)))
    } else {
      ElMessage.success(message)
    }
    // addVersionData.value = JSON.parse(JSON.stringify(data))
    // console.log('data', data);
    // console.log('addVersionData.value', addVersionData.value);
    if (Object.keys(data).length && data.attributeTypes.length) {
      data.attributeTypes.push({
        typeName: "折扣优惠",
      });
      data.attributeTypes.forEach(item => {
        if (item.billRuleDetails?.length) {
          item.billRuleDetails = item.billRuleDetails.map(i => {
            if (!i.gradEnd) {
              i.showWSX = true
            } else {
              i.showWSX = false
            }
            return i
          })
        }
      })
    }
    data.discountVal = data.discountVal?.substring(0, data.discountVal.indexOf(".") + 3) || ''
    detailData.value = data;
    console.log('detailData-data', detailData.value);
    num.value++
  } else {
    ElMessage.error(message)
    num.value = 1
  }
}

// 确定事件
const confirmClick = async () => {
  showPop.value = false;
  let param = JSON.parse(JSON.stringify(detailData.value));
  param.attributeTypes = param.attributeTypes.filter(item => {
    return item.typeName != '折扣优惠'
  })
  param.attributeTypes.forEach(item => {
    item.billRuleDetails.forEach(e => {
      e.unitPriceUnit = getUnitsType()
      if (e.showWSX) {
        e.gradEnd = ""
      }
      delete e.showWSX
    })
  })
  console.log('param', param);
  // 1  放弃保存 2 保存草稿 3 提交审核 4 新增版本
  if (btnStatus.value == 1) {
    getRuleDetail()
  } else if (btnStatus.value == 2) {
    console.log('addVersion.value', addVersion.value);
    console.log('num.value', num.value);
    // 第一次才需要新增版本
    if (addVersion.value && num.value == 1) {
      addNewVersion(param)
      // await addNewVersion(param)
      // 需要拿新增版本回来的数据
      // saveDraft(addVersionData.value)
    } else {
      saveDraft(param)
    }
  } else if (btnStatus.value == 3) {
    if (addVersion.value && num.value == 1) {
      addNewVersion(param)
      // 第一次才需要新增版本
      // await addNewVersion(param)
      // 需要拿新增版本回来的数据
      // submitCheck(addVersionData.value)
    } else {
      submitCheck(param)
    }
  } else if (btnStatus.value == 4) {
    isEdit.value = true
    isNormal.value = false
    showBtn.value = true
    addVersion.value = true
  }
  auditLogging()
  getHistoryVersions()
}

// 返回
const back = () => {
  router.replace("/unitChargeRule/unitChargeRuleListCG");
};


</script>
<style lang="scss">
.discountSelect {

  // 修改下拉框宽度
  .el-select-dropdown {
    width: 120px !important;
    min-width: 120px !important;
  }
}
</style>
<style lang="scss" scoped>
.unitChargeDetailContainer {
  padding: 16px 24px 0 24px;

  .unitChargeDetailBox {
    box-sizing: border-box;
    height: calc(100vh - 110px);
    overflow: auto;
    display: flex;
    padding-bottom: 14px;

    .leftContainer {
      width: 66%;
      margin-right: 24px;
      position: relative;
      // width: 1240px;
      // height: 960px;
      background-color: #FFFFFF;
      padding: 20px 24px 13px 16px;
      color: #333333;
      box-sizing: border-box;

      .versions {
        font-size: 18px;
        font-weight: 700;
      }

      .detailText {
        margin-top: 16px;
        font-weight: 700;
      }

      .detailBox {
        display: flex;

        .titleBox {
          text-align: right;

          div {
            font-size: 14px;
            margin-top: 12px;
            line-height: 19px;
          }
        }

        .contentBox {
          div {
            font-size: 14px;
            color: #666666;
            margin-top: 12px;
            margin-left: 8px;
            line-height: 19px;
          }
        }
      }

      .tableBox {
        margin-top: 20px;
        max-height: 470px;
        height: calc(100% - 318px);
        overflow: auto;

        &:deep(.el-table__header) {
          th {
            // background-color: #f2f2f2;
            color: #333333;
            font-weight: 400;
          }
        }

        // 鼠标经过背景透明
        &:deep(tr:hover>td.el-table__cell) {
          background-color: transparent;
        }

        &:deep(.el-table__row) {
          td {
            padding: 0;

            .cell {
              padding: 0;
            }
          }
        }

        // 阶梯编辑
        .ladderEditBox {
          margin: 0;
          padding: 0;
          width: 100%;
          color: #333333;

          .publicLi:first-child {
            div {
              background-color: #f2f2f2;
            }
          }

          .publicLi {
            display: flex;

            // div {
            //   flex: 1;
            //   border-bottom: 1px solid #e0e0e0;
            //   padding: 6px 0;
            // }
            >div:first-child {
              width: 200px;
              border-bottom: 1px solid #e0e0e0;
              padding: 6px 0;
            }

            >div:nth-of-type(n+2) {
              flex: 1;
              border-bottom: 1px solid #e0e0e0;
              padding: 6px 0;
            }

            .inputBox {
              display: flex;
              justify-content: center;
              align-items: center;

              .input {
                width: 100px;
                height: 24px;
                border-bottom: 0;
                margin-left: 8px;
                padding: 0;

                &:deep(.el-input__inner) {
                  text-align: center;
                }
              }
            }

            .operate {
              display: flex;
              justify-content: center;
              align-items: center;

              .delImg {
                width: 18px;
                height: 18px;
                cursor: pointer;
              }
            }

            div:last-child {
              flex: 0 0 100px;
            }

            div:nth-child(even) {
              border-left: 1px solid #e0e0e0;
              border-right: 1px solid #e0e0e0;
            }
          }

          .addJTContainer {
            display: flex;

            .addBox {
              display: flex;
              justify-content: center;
              align-items: center;
              // border-right: 1px solid #e0e0e0;
              border-bottom: 0;
              flex: 1;

              .addJTBox {
                display: flex;
                justify-content: center;
                align-items: center;
                border-bottom: 0;
                width: 90px;
                height: 20px;
                border-radius: 4px;
                border: 1px solid #338f7a;
                margin: 6px 0;
                cursor: pointer;

                .addImg {
                  width: 14px;
                  height: 14px;
                }

                .addJTText {
                  color: #338f7a;
                  font-size: 12px;
                }
              }
            }

            .addNull {
              width: 100px;
            }
          }
        }

        // 折扣优惠编辑
        .discountEditBox {
          margin: 0;
          padding: 0;
          color: #333333;

          .publicLi:first-child {
            div {
              background-color: #f2f2f2;
            }
          }

          .publicLi {
            display: flex;

            div:nth-child(even) {
              border-left: 1px solid #e0e0e0;
              border-right: 1px solid #e0e0e0;
            }

            div {
              flex: 1;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 6px 0;

              .discountSelect {
                &:deep(.select-trigger) {
                  width: 120px !important;
                  height: 24px !important;
                }
              }
            }

            .inputBox {
              display: flex;
              justify-content: center;
              align-items: center;

              .input {
                flex: 0 0 100px;
                border-bottom: 0;

                &:deep(.el-input__inner) {
                  height: 24px;
                  text-align: center;
                }
              }
            }

            .null {
              flex: 0 0 100px;
              background-color: transparent !important;
            }
          }
        }

        // 阶梯回显
        .ladderEchoBox {
          margin: 0;
          padding: 0;
          width: 100%;
          color: #333333;

          .publicLi:first-child {
            div {
              background-color: #F2F2F2;
            }
          }

          .publicLi {
            display: flex;

            div {
              flex: 1;
              border-bottom: 1px solid #E0E0E0;
              padding: 6px 0;
            }

            div:nth-child(even) {
              border-left: 1px solid #E0E0E0;
              border-right: 1px solid #E0E0E0;
            }

            div:last-child {
              border-right: 0;
            }
          }

          .publicLi:last-child {
            div {
              border-bottom: 0;
            }
          }

        }

        // 折扣优惠回显
        .discountEchoBox {
          margin: 0;
          padding: 0;
          width: 100%;
          color: #333333;

          .publicLi:first-child {
            div {
              background-color: #F2F2F2;
            }
          }

          .publicLi {
            display: flex;

            div {
              flex: 1;
              border-bottom: 1px solid #E0E0E0;
              padding: 6px 0;
            }

            div:nth-child(even) {
              border-left: 1px solid #E0E0E0;
              border-right: 1px solid #E0E0E0;
            }

            div:last-child {
              border-right: 0;
            }
          }

          .publicLi:last-child {
            div {
              border-bottom: 0;
            }
          }
        }
      }
    }

    .rightContainer {
      flex: 1;
      display: flex;
      flex-direction: column;
      // width: 608px;
      // height: 960px;
      background-color: #FFFFFF;
      // margin-left: 24px;
      box-sizing: border-box;
      padding: 20px 16px 64px 16px;
      overflow: auto;

      .auditFlowContainer {
        height: 80%;
        overflow: auto;
        border-bottom: 1px solid #F2F2F2;

        .auditHeadBox {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;

          .operateBox {
            display: flex;
            align-items: center;

            .text {
              font-size: 14px;
              color: #666666;
            }

            .img {
              width: 20px;
              height: 20px;
            }
          }
        }

        .auditFlowBox {
          height: calc(100% - 38px);
          // height: 556px;
          overflow-y: scroll;

          &:deep(.el-step__title) {
            padding: 0 !important;
            margin: 0 !important;
          }

          // 空流程提示
          .emptyFlowBox {
            width: 140px;
            height: 173px;
            margin: 80px auto 0;
            text-align: center;

            .img {
              width: 140px;
              height: 140px;
            }

            .text {
              font-size: 14px;
              color: #666666;
            }
          }

          // 正常审核流程
          .flowBox {
            .el-step {

              &:first-child {
                :deep(.el-step__title) {
                  margin-top: 8px;
                }
              }

              &:last-child {
                .itemBox {
                  margin-bottom: 40px !important
                }
              }
            }

            &:deep(.el-step__line) {
              width: 0;
              border-left: 2px dashed #338F7A;
              background-color: transparent;
            }

            .statusImg {
              width: 20px;
              height: 20px;
            }

            .itemBox {
              color: #333333;
              font-size: 12px;
              font-weight: 400;
              padding: 8px 12px;
              border-radius: 4px;
              border: 1px solid #E0E0E0;
              margin-bottom: 32px;

              .headBox {
                display: flex;
                justify-content: space-between;

                .name {
                  min-width: 130px;
                }

                .tiemBox {
                  display: flex;
                  min-width: 185px;

                  .title {
                    // white-space: nowrap;
                  }

                  .time {
                    color: #666666;
                    margin-left: 8px;
                    // white-space: nowrap;
                  }
                }

                .resultBox {
                  display: flex;
                  min-width: 121px;

                  .result {
                    color: #338F7A;
                    margin-left: 8px;
                  }
                }
              }

              .reasonBox {
                color: #999999;
                margin-top: 8px;
                word-break: break-all;
              }
            }
          }

          // 收起审核流程
          .putAwayFlowBox {
            &:deep(.el-step__line) {
              width: 0;
              border-left: 2px dashed #338F7A;
              background-color: transparent;
            }

            .statusImg {
              width: 20px;
              height: 20px;
            }

            .itemBox {
              color: #333333;
              font-size: 12px;
              font-weight: 400;
              padding: 8px 12px;
              border-radius: 4px;
              border: 1px solid #E0E0E0;
              margin-bottom: 32px;

              .headBox {
                display: flex;
                justify-content: space-between;

                .name {
                  min-width: 130px;
                }

                .tiemBox {
                  display: flex;
                  min-width: 185px;

                  .title {
                    // white-space: nowrap;
                  }

                  .time {
                    color: #666666;
                    margin-left: 8px;
                    // white-space: nowrap;
                  }
                }

                .resultBox {
                  display: flex;
                  min-width: 121px;

                  .result {
                    color: #338F7A;
                    margin-left: 8px;
                  }
                }
              }

              .reasonBox {
                color: #999999;
                margin-top: 8px;
                word-break: break-all;
              }
            }

            .unfoldBox {
              color: #999999;
              font-size: 14px;
              margin-bottom: 71px;
            }
          }
        }
      }

      .versionContainer {
        height: 28%;
        margin-top: 40px;

        .headBox {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .text {
            font-size: 16px;
            color: #333333;
          }

          .catBox {
            display: flex;
            align-items: center;
            cursor: pointer;

            .text {
              font-size: 14px;
              color: #666666;
            }

            .img {
              width: 16px;
              height: 16px;
            }
          }
        }

        .versionsTableBox {
          overflow: auto;
          height: calc(100% - 36px);
          margin-top: 16px;

          &:deep(.el-table__header) {
            th {
              background-color: #f2f2f2;
              color: #333333;
              font-weight: 400;
            }
          }

          .el-table {
            height: 100%;
          }
        }
      }
    }
  }

  .td-first-fixed {
    width: 200px;
    padding: 6px 0;
    flex: none !important;
  }

  .footer {
    padding: 16px 0;
    height: 64px;
    box-sizing: border-box;

    .submitBox {

      .noSave,
      .saveDraft {
        color: var(--vt-c-theme-colors);
      }

      .noSave,
      .saveDraft,
      .submitAudit,
      .addVersions,
      .back {
        width: 96px;
        height: 32px;
        background-color: #FFFFFF;
        border-color: var(--vt-c-theme-colors) !important;
        margin-right: 60px;

        &:hover {
          opacity: 0.5;
        }
      }

      .back {
        color: var(--vt-c-theme-colors);
        margin-right: 0;
      }

      &:deep(.el-form-item__content) {
        flex-wrap: nowrap !important;
        justify-content: center;
      }
    }

  }

  // 弹窗容器
  .popupContainer {
    &:deep(.el-dialog__header) {
      margin-right: 0;
      padding: 8px 24px;
      background-color: var(--vt-c-theme-colors);
      height: 40px;
      box-sizing: border-box;
    }

    .hintBox {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .text {
        color: #FFFFFF;
      }

      .closeImg {
        width: 30px;
        height: 30px;
      }
    }

    &:deep(.el-dialog__body) {
      padding: 0px 32px 32px 32px;
    }

    .hintContent {
      // margin-left: 7px;
      font-size: 14px;
      color: #333333;
      text-align: center;
      margin-top: 62px;
    }

    .infoFormBox {
      margin-top: 16px;

      &:deep(.el-form-item__label) {
        color: #333333;
      }

      .remarks {}
    }

    .btnBox {
      margin-top: 93px;
      text-align: center;

      .confirm {
        width: 96px;
        height: 32px;
      }

      .cancel {
        width: 96px;
        height: 32px;
        background-color: #FFFFFF;
        color: var(--vt-c-theme-colors);
        border-color: var(--vt-c-theme-colors);
        margin-left: 80px;

        &:hover {
          opacity: 0.5;
        }
      }
    }
  }
}
</style>