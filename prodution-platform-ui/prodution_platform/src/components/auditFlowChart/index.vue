<template>
  <div class="layout">
    <!-- 审核流程容器 -->
    <div class="auditFlowContainer">
      <!-- <div class="auditHeadBox">
        <div class="text">{{ flowTitle }}</div>
      </div> -->
      <div class="auditFlowBox">
        <!-- 空流程提示 -->
        <div class="emptyFlowBox" v-if="!recordListData?.length">
          <img class="img" src="@/assets/images/emptyFlow.png" alt="">
          <div class="text">暂无审核流程~</div>
        </div>
        <!-- 正常审核流程 -->
        <div class="flowBox" v-if="recordListData?.length && isExpand">
          <!-- <div>1234正常审核流程</div> -->
          <el-steps direction="vertical">
            <el-step v-for="(item, index) in recordListData" :key="item.id">
              <template v-slot:icon>
                <img class="statusImg" :src="getImageUrl(auditStatusImg(item.auditStatus))" alt="">
              </template>
              <template v-slot:title>
                <div class="itemBox">
                  <div class="headBox">
                    <el-col :span="8">
                      <div class="name">
                        <span v-if="item.auditUserName">
                          {{ item.auditUserName }}
                        </span>
                        <span v-if="item.roleId != 32 && item.orgCode != 'manufacturer'">{{ item.roleName && '-' +
                          item.roleName }}</span>
                      </div>
                    </el-col>
                    <el-col :span="10">
                      <div class="tiemBox">
                        <div class="title" v-if="!flowType">
                          {{ item.orgCode == 'manufacturer' ? '修改时间' : (item.auditStatus !== -1 ? '审核时间' : '提交时间') }}:
                        </div>
                        <div class="title" v-if="flowType == 'settle'">
                          {{ item.auditStatus == -1 ? '发起结算时间' : (item.auditStatus == 12 ? '操作时间' : '审核时间') }}:
                        </div>
                        <div class="time">{{ item.auditTime || '-' }}</div>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="resultBox" v-if="!flowType || (flowType == 'settle' && item.auditStatus != -1)">
                        <div v-if="item.orgCode !== 'manufacturer' || flowType == 'settle'" class="title">
                          {{ item.auditStatus == 12 ? '操作' : '审核结果' }}:</div>
                        <div v-if="item.orgCode !== 'manufacturer' || flowType == 'settle'" class="result"
                          :style="{ color: auditStatuColor }">{{
                            auditStatuDesc(item.auditStatus)
                          }}</div>
                      </div>
                    </el-col>
                  </div>
                  <div class="reasonBox" v-if="item.modifyContent">
                    <text style="color:#333333">修改记录：</text>
                    {{ item.modifyContent }}
                  </div>
                  <div class="reasonBox" v-if="item.remark">
                    <text style="color:#333333">备注：</text>
                    {{ item.remark }}
                  </div>
                </div>

                <div class="itemBox" v-if="item.showBoth">
                  <div class="headBox">
                    <el-col :span="8">
                      <div class="name">
                        <span v-if="item.showBoth.auditUserName">
                          {{ item.showBoth.auditUserName }}
                        </span>
                        <span v-if="item.showBoth.roleId != 32 && item.showBoth.orgCode != 'manufacturer'">{{
                          item.showBoth.roleName && '-' + item.showBoth.roleName }}</span>
                      </div>
                    </el-col>
                    <el-col :span="10">
                      <div class="tiemBox">
                        <div class="title" v-if="!flowType">
                          {{ item.showBoth.orgCode == 'manufacturer' ? '修改时间' : (item.showBoth.auditStatus !== -1 ? '审核时间'
                            : '提交时间') }}:
                        </div>
                        <div class="title" v-if="flowType == 'settle'">
                          {{ item.showBoth.auditStatus == -1 ? '发起结算时间' : (item.showBoth.auditStatus == 12 ? '操作时间' :
                            '审核时间') }}:
                        </div>
                        <div class="time">{{ item.showBoth.auditTime || '-' }}</div>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="resultBox"
                        v-if="!flowType || (flowType == 'settle' && item.showBoth.auditStatus != -1)">
                        <div v-if="item.showBoth.orgCode !== 'manufacturer' || flowType == 'settle'" class="title">
                          {{ item.showBoth.auditStatus == 12 ? '操作' : '审核结果' }}:
                        </div>
                        <div v-if="item.showBoth.orgCode !== 'manufacturer' || flowType == 'settle'" class="result"
                          :style="{ color: auditStatusColorFn(item.showBoth.auditStatus) }">{{
                            auditStatuDesc(item.showBoth.auditStatus)
                          }}</div>
                      </div>
                    </el-col>
                  </div>
                  <div class="reasonBox" v-if="item.showBoth.modifyContent">
                    <text style="color:#333333">修改记录：</text>
                    {{ item.showBoth.modifyContent }}
                  </div>
                  <div class="reasonBox" v-if="item.showBoth.remark">
                    <text style="color:#333333">备注：</text>
                    {{ item.showBoth.remark }}
                  </div>
                </div>
              </template>
            </el-step>
          </el-steps>
        </div>
        <!-- 收起审核流程 -->
        <div class="putAwayFlowBox" v-if="recordListData?.length && !isExpand">
          <!--  <div>1234收起审核流程</div> -->
          <el-steps direction="vertical">
            <el-step v-if="!strippedDown && recordListData[0]">
              <template v-slot:icon>
                <img class="statusImg" :src="getImageUrl(auditStatusImg(recordListData[0].auditStatus))" alt="">
              </template>
              <template v-slot:title>
                <div class="itemBox">
                  <div class="headBox">
                    <el-col :span="8">
                      <div class="name">
                        <span v-if="recordListData[0].auditUserName">
                          {{ recordListData[0].auditUserName }}
                        </span>
                        <span v-if="recordListData[0].roleId != 32 && recordListData[0].orgCode != 'manufacturer'">{{
                          recordListData[0].roleName && '-' + recordListData[0].roleName }}</span>
                      </div>
                    </el-col>
                    <el-col :span="10">
                      <div class="tiemBox">
                        <div class="title" v-if="!flowType">
                          {{ recordListData[0].orgCode == 'manufacturer' ? '修改时间' : (recordListData[0].auditStatus !== -1
                            ? '审核时间' : '提交时间') }}:
                        </div>
                        <div class="title" v-if="flowType == 'settle'">
                          发起结算时间:
                        </div>
                        <div class="time">{{ recordListData[0].auditTime || '-' }}</div>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="resultBox" v-if="!flowType">
                        <div v-if="recordListData[0].orgCode !== 'manufacturer' || flowType == 'settle'" class="title">
                          审核结果:</div>
                        <div v-if="recordListData[0].orgCode !== 'manufacturer' || flowType == 'settle'" class="result"
                          :style="{ color: auditStatusColorFn(recordListData[0].auditStatus) }">
                          {{
                            auditStatuDesc(recordListData[0].auditStatus)
                          }}</div>
                      </div>
                    </el-col>
                  </div>
                  <div class="reasonBox" v-if="recordListData[0].modifyContent">
                    <text style="color:#333333">修改记录：</text>
                    {{ recordListData[0].modifyContent }}
                  </div>
                  <div class="reasonBox" v-if="recordListData[0].remark">
                    <text style="color:#333333">备注：</text>
                    {{ recordListData[0].remark }}
                  </div>
                </div>

                <div class="itemBox" v-if="recordListData[0].showBoth">
                  <div class="headBox">
                    <el-col :span="8">
                      <div class="name">
                        <span v-if="recordListData[0].showBoth.auditUserName">
                          {{ recordListData[0].showBoth.auditUserName }}
                        </span>
                        <span
                          v-if="recordListData[0].showBoth.roleId != 32 && recordListData[0].showBoth.orgCode != 'manufacturer'">{{
                            recordListData[0].showBoth.roleName && '-' + recordListData[0].showBoth.roleName }}</span>
                      </div>
                    </el-col>
                    <el-col :span="10">
                      <div class="tiemBox">
                        <div class="title" v-if="!flowType">
                          {{ recordListData[0].showBoth.orgCode == 'manufacturer' ? '修改时间' :
                            (recordListData[0].showBoth.auditStatus !== -1 ? '审核时间' : '提交时间') }}:
                        </div>
                        <div class="title" v-if="flowType == 'settle'">
                          {{ recordListData[0].showBoth.auditStatus == -1 ? '发起结算时间' :
                            (recordListData[0].showBoth.auditStatus == 12 ? '操作时间' : '审核时间') }}:
                        </div>
                        <div class="time">{{ recordListData[0].showBoth.auditTime || '-' }}</div>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="resultBox"
                        v-if="!flowType || (flowType == 'settle' && recordListData[0].showBoth.auditStatus != -1)">
                        <div v-if="recordListData[0].showBoth.orgCode !== 'manufacturer' || flowType == 'settle'"
                          class="title">{{ recordListData[0].showBoth.auditStatus == 12 ? '操作' : '审核结果' }}:</div>
                        <div v-if="recordListData[0].showBoth.orgCode !== 'manufacturer' || flowType == 'settle'"
                          class="result" :style="{ color: auditStatusColorFn(recordListData[0].showBoth.auditStatus) }">{{
                            auditStatuDesc(recordListData[0].showBoth.auditStatus)
                          }}</div>
                      </div>
                    </el-col>
                  </div>
                  <div class="reasonBox" v-if="recordListData[0].showBoth.modifyContent">
                    <text style="color:#333333">修改记录：</text>
                    {{ recordListData[0].showBoth.modifyContent }}
                  </div>
                  <div class="reasonBox" v-if="recordListData[0].showBoth.remark">
                    <text style="color:#333333">备注：</text>
                    {{ recordListData[0].showBoth.remark }}
                  </div>
                </div>
              </template>
            </el-step>
            <el-step v-if="!strippedDown && recordListData.length >= 2">
              <template v-slot:icon>
                <img class="statusImg" src="../../assets/images/greenRound.png" alt="">
              </template>
              <template v-slot:title>
                <div class="operateBox pointer" @click="changeShowType">
                  <!-- 共收起{{ recordListData.length - 2 }}个审核流程 -->
                  展开更多
                  <img class="img" src="@/assets/images/down.png" alt="">
                </div>
              </template>
            </el-step>
            <el-step v-if="recordListData[recordListData.length - 1]">
              <template v-slot:icon>
                <img class="statusImg"
                  :src="getImageUrl(auditStatusImg(recordListData[recordListData.length - 1].auditStatus))" alt="">
              </template>
              <template v-slot:title>
                <div>
                  <div class="itemBox">
                    <div class="headBox">
                      <el-col :span="8">
                        <div class="name">
                          <span v-if="recordListData[recordListData.length - 1].auditUserName">
                            {{ recordListData[recordListData.length - 1].auditUserName }}
                          </span>
                          <span
                            v-if="recordListData[recordListData.length - 1].roleId != 32 && recordListData[recordListData.length - 1].orgCode != 'manufacturer'">{{
                              recordListData[recordListData.length - 1].roleName && '-' +
                              recordListData[recordListData.length - 1].roleName }}</span>
                        </div>
                      </el-col>
                      <el-col :span="10">
                        <div class="tiemBox">
                          <div class="title" v-if="!flowType">
                            {{ recordListData[recordListData.length - 1].orgCode == 'manufacturer' ? '修改时间' :
                              (recordListData[recordListData.length - 1].auditStatus !== -1 ? '审核时间' : '提交时间') }}:
                          </div>
                          <div class="title" v-if="flowType == 'settle'">
                            {{ recordListData[recordListData.length - 1].auditStatus == -1 ? '发起结算时间' :
                              (recordListData[recordListData.length - 1].auditStatus == 12 ? '操作时间' : '审核时间') }}:
                          </div>
                          <div class="time">{{
                            recordListData[recordListData.length - 1].auditTime || '-' }}</div>
                        </div>
                      </el-col>
                      <el-col :span="6">
                        <div class="resultBox"
                          v-if="!flowType || (flowType == 'settle' && recordListData[recordListData.length - 1].auditStatus != -1)">
                          <div
                            v-if="recordListData[recordListData.length - 1].orgCode !== 'manufacturer' || flowType == 'settle'"
                            class="title">
                            {{ recordListData[recordListData.length - 1].auditStatus == 12 ? '操作' : '审核结果' }}:</div>
                          <div
                            v-if="recordListData[recordListData.length - 1].orgCode !== 'manufacturer' || flowType == 'settle'"
                            class="result"
                            :style="{ color: auditStatusColorFn(recordListData[recordListData.length - 1].auditStatus) }">
                            {{
                              auditStatuDesc(recordListData[recordListData.length - 1].auditStatus)
                            }}</div>
                        </div>
                      </el-col>
                    </div>
                    <div class="reasonBox" v-if="recordListData[recordListData.length - 1].modifyContent">
                      <text style="color:#333333">修改记录：</text>
                      {{ recordListData[recordListData.length - 1].modifyContent }}
                    </div>
                    <div class="reasonBox" v-if="recordListData[recordListData.length - 1].remark">
                      <text style="color:#333333">备注：</text>
                      {{ recordListData[recordListData.length - 1].remark }}
                    </div>
                  </div>

                  <div class="itemBox" v-if="recordListData[recordListData.length - 1].showBoth">
                    <div class="headBox">
                      <el-col :span="8">
                        <div class="name">
                          <span v-if="recordListData[recordListData.length - 1].showBoth.auditUserName">
                            {{ recordListData[recordListData.length - 1].showBoth.auditUserName }}
                          </span>
                          <span
                            v-if="recordListData[recordListData.length - 1].showBoth.roleId != 32 && recordListData[recordListData.length - 1].showBoth.orgCode != 'manufacturer'">{{
                              recordListData[recordListData.length - 1].showBoth.roleName && '-' +
                              recordListData[recordListData.length - 1].showBoth.roleName }}</span>
                        </div>
                      </el-col>
                      <el-col :span="10">
                        <div class="tiemBox">
                          <div class="title" v-if="!flowType">
                            {{ recordListData[recordListData.length - 1].showBoth.orgCode == 'manufacturer' ? '修改时间' :
                              (recordListData[recordListData.length - 1].showBoth.auditStatus !== -1 ? '审核时间' : '提交时间') }}:
                          </div>
                          <div class="title" v-if="flowType == 'settle'">
                            {{ recordListData[recordListData.length - 1].showBoth.auditStatus == -1 ? '发起结算时间' :
                              (recordListData[recordListData.length - 1].showBoth.auditStatus == 12 ? '操作时间' : '审核时间') }}:
                          </div>
                          <div class="time">{{ recordListData[recordListData.length - 1].showBoth.auditTime || '-' }}
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="6">
                        <div class="resultBox"
                          v-if="!flowType || (flowType == 'settle' && recordListData[recordListData.length - 1].showBoth.auditStatus != -1)">
                          <div
                            v-if="recordListData[recordListData.length - 1].showBoth.orgCode !== 'manufacturer' || flowType == 'settle'"
                            class="title">{{ recordListData[recordListData.length - 1].showBoth.auditStatus == 12 ? '操作' :
                              '审核结果' }}:</div>
                          <div
                            v-if="recordListData[recordListData.length - 1].showBoth.orgCode !== 'manufacturer' || flowType == 'settle'"
                            class="result"
                            :style="{ color: auditStatusColorFn(recordListData[recordListData.length - 1].showBoth.auditStatus) }">
                            {{
                              auditStatuDesc(recordListData[recordListData.length - 1].showBoth.auditStatus)
                            }}</div>
                        </div>
                      </el-col>
                    </div>
                    <div class="reasonBox" v-if="recordListData[recordListData.length - 1].showBoth.modifyContent">
                      <text style="color:#333333">修改记录：</text>
                      {{ recordListData[recordListData.length - 1].showBoth.modifyContent }}
                    </div>
                    <div class="reasonBox" v-if="recordListData[recordListData.length - 1].showBoth.remark">
                      <text style="color:#333333">备注：</text>
                      {{ recordListData[recordListData.length - 1].showBoth.remark }}
                    </div>
                  </div>
                  <div class="item-expand" v-if="strippedDown" v-show="recordListData.length >= 2">
                    <span class="text">共收起{{ recordListData.length - 1 }}个审核流程</span>
                    <span class="btn-wrap" @click="changeShowType">
                      <span class="link">展开</span>
                      <img class="img" src="@/assets/images/down.png" alt="">
                    </span>
                  </div>
                </div>

              </template>
            </el-step>
          </el-steps>
        </div>
        <div v-if="recordListData?.length > 1" v-show="isExpand" class="operateBox pointer fold"
          :class="{ 'flex-end': strippedDown }" @click="changeShowType">
          <div class="text">收起</div>
          <img class="img" src="@/assets/images/up.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<script name="auditFlowChart" setup>
import { ElMessage } from "element-plus";
import { getAuditRecordList } from "@/api/modules/unitChargeRule"
import { ref, reactive, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { parseTime } from "@/utils/util";

import greenRound from '../../assets/images/greenRound.png';
import redRound from '../../assets/images/redRound.png';
import yellowRound from '../../assets/images/yellowRound.png';
/**
* 处理 加工商和财务确认是同一个节点
* */
const processBothConfirmStep = (data) => {
  let removeI = []
  let res = data.map((e, i) => {
    // 当前元素
    if (e.businessType == 3 && [8, 9, 10, 11, 99].includes(e.auditStatus)) {
      // 当前元素的下一个
      if (data[i + 1] && data[i + 1].businessType == 3 && [8, 9, 10, 11, 99].includes(data[i + 1].auditStatus)) {
        e.showBoth = data[i + 1]
        removeI.push(i + 1)
      }
    }
    return e
  })
  // 过滤出数据
  res = res.filter((item, ii) => {
    if (!removeI.includes(ii)) return item
  })
  return res
}

const props = defineProps({
  /* flowTitle: { // 流程标题
    type: String,
    default: "审核流程"
  }, */
  getDataFn: { // 请求数据的方法（promise）
    type: Function
  },
  flowType: { // 流程类型
    type: String,
    default: ""
  },
  //精简模式（精简模式下 收起的样子不一样）
  strippedDown: {
    type: Boolean,
    default: false,
  },
  //审核记录数据
  data: {
    type: Array,
    default: () => []
  }
})
// console.warn(props.data);
// 获取计价公式
const route = useRoute()
// 获取审批历史记录
const recordListData = ref([])
const getAuditRecordListFn = async () => {
  const res = await getAuditRecordList({ id: route.query.id || 0 })
  if (res.code !== '000000') return ElMessage.error(res.message)
  recordListData.value = processBothConfirmStep(res.data)
  if (props.strippedDown) {
    isExpand.value = false
  } else {
    isExpand.value = (recordListData.value?.length < 3)
  }
}

/* const showFlag = ref(false)
watch(() => recordListData.value.length, () => {
  if (recordListData.value?.length >= 3) showFlag.value = true
}) */

//展开状态
const isExpand = ref(false)
const changeShowType = () => {
  //if (!recordListData.value?.length || recordListData.value?.length < 3) return
  isExpand.value = !isExpand.value
}

// 初始化页面数据
function initPageFn() {
  if (props.getDataFn) {
    props.getDataFn().then(res => {
      if (res.code !== '000000') return ElMessage.error(res.message)
      recordListData.value = processBothConfirmStep(res.data)
    })
  } else if (props.data?.length) {
    recordListData.value = processBothConfirmStep(props.data)
  } else {
    getAuditRecordListFn()
  }
}
initPageFn()

watch(() => props.data, (newValue) => {
  recordListData.value = processBothConfirmStep(newValue)
})

let auditStatuColor = ""
let statusMap = [
  { key: -1, color: "#666666", icon: greenRound, value: "提交审核" }, // 未审核(默认)/提交审核
  { key: 1, color: "#338F7A", icon: greenRound, value: "审核通过" }, // 采购经理
  { key: 2, color: "#F14932", icon: greenRound, value: "审核不通过" }, // 采购经理
  { key: 3, color: "#338F7A", icon: greenRound, value: "审核通过" }, // 产业园财务
  { key: 4, color: "#F14932", icon: greenRound, value: "审核不通过" }, // 产业园财务
  { key: 5, color: "#F14932", icon: greenRound, value: "驳回给加工商" },
  { key: 6, color: "#F14932", icon: greenRound, value: "驳回给采购" },
  { key: 7, color: "#F14932", icon: greenRound, value: "作废" },
  { key: 8, color: "#338F7A", icon: greenRound, value: "审核通过" }, // 加工商
  { key: 9, color: "#F14932", icon: greenRound, value: "审核不通过" }, // 加工商
  { key: 10, color: "#338F7A", icon: greenRound, value: "审核通过" }, // 总部财务
  { key: 11, color: "#F14932", icon: greenRound, value: "审核不通过" }, // 总部财务
  { key: 12, color: "#338F7A", icon: greenRound, value: "上传付款凭证" }, // 审核通过
  { key: 99, color: "#F9B300", icon: yellowRound, value: "审核中" },
  { key: 100, color: "#F9B300", icon: yellowRound, value: "付款中" },
]
let auditStatusImg = (val) => {
  let row = statusMap.find(e => val == e.key)
  auditStatuColor = row?.color
  return row?.icon
}
let auditStatusColorFn = (val) => {
  let row = statusMap.find(e => val == e.key)
  return row?.color
}
function auditStatuDesc(val) {
  let row = statusMap.find(e => val == e.key)
  return row?.value
}
// 引入本地图片
function getImageUrl(url) {
  return new URL(url, import.meta.url).href;
}
</script>
<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}

.layout {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  //overflow: auto;
  padding: 0;
  margin-left: -6px;

  .auditFlowContainer {
    height: 100%;
    width: 100%;

    .auditHeadBox {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;

    }

    .auditFlowBox {
      height: calc(100% - 38px);
      //overflow-y: auto;

      .el-step {

        &:first-child {
          :deep(.el-step__title) {
            margin-top: 8px;
          }
        }

        &:last-child {
          .itemBox {
            margin-bottom: 10px !important
          }
        }
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

              .time {
                color: #666666;
                margin-left: 8px;
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
        // margin-top: 16px;

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

              .time {
                color: #666666;
                margin-left: 8px;
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

        .item-expand {
          margin-top: -6px;
          //padding-top: 4px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          font-size: 14px;
          color: #999;
          line-height: 21px;

          .btn-wrap {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            cursor: pointer;
            margin-left: 24px;
            color: #338F7A;
            font-weight: normal;
          }

          .link {
            color: #338F7A;
          }

          .img {
            height: 16px;
            width: 16px;
          }
        }

      }

      .operateBox {
        display: flex;
        align-items: center;
        text-align: center;
        color: #338F7A;
        font-size: 14px;
        margin-bottom: 32px;

        &.flex-end {
          justify-content: flex-end;
        }

        .img {
          height: 16px;
          width: 16px;
        }
      }

      .fold {
        margin-left: 35px;
        margin-bottom: 15px;
      }
    }
  }
}</style>