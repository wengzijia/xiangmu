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
          <uniPriceRuleTable :tableData="detailData.attributeTypes" :attributeId="detailData.attributeId" >
          </uniPriceRuleTable>
          
        </div>
        <!-- <div class="footer">
          <el-form-item class="submitBox">
            <el-button class="back" @click="back">返回</el-button>
          </el-form-item>
        </div> -->
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
  </div>
</template>
<script name="unitChargeRuleCGDetail" setup>
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import greenRound from '../../assets/images/greenRound.png';
import redRound from '../../assets/images/redRound.png';
import yellowRound from '../../assets/images/yellowRound.png';
import { getParkDetail, getAuditRecordList, getBillRuleHisPage } from "@/api/modules/unitChargeRule";
import { parseTime } from "@/utils/util"
import { setLoginModule, openNewPage } from "@/utils/commonApi"
import {attributeIdHeader} from  "@/utils/maps/commonMap"
import uniPriceRuleTable from "@/views/unitChargeRule/components/uniPriceRuleTable.vue"
const router = useRouter();
const route = useRoute();
let { id } = route.query;
// 详情数据
let detailData = ref({});
// 审核数据
let auditData = ref([])
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
  {
    label: "加工费折扣",
    value: 2,
  },
]);
// 优惠状态处理成文字
let discountsStatusMap = {
  1: '无优惠',
  2: '加工费折扣'
}
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
// 收起事件
const putAwayClick = () => {
  if (auditData.value.length > 3) {
    isPutAway.value = true
  }
}
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
      detail: '/unitChargeRule/unitChargeRuleCWDetail'
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
  openNewPage(`/unitChargeRule/unitChargeRuleCWDetail?id=${row.id}`)
}
// 获取计费规则详情
async function getRuleDetail() {
  let { code, data, message } = await getParkDetail({ id });
  if (code == "000000") {
    if (Object.keys(data).length && data.attributeTypes.length) {
      if (data.attributeTypes) {
        data.attributeTypes.push({
            typeName: '折扣优惠',
            preferentialWay: data.preferentialWay == 1 ? "无优惠" : "加工费折扣",
            discountVal: Number(data.discountVal).toFixed(2)
        });
    }
     /*  data.attributeTypes.forEach(item => {
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
      }) */
    }
    data.discountVal = data.discountVal?.substring(0, data.discountVal.indexOf(".") + 3) || ''
    detailData.value = data;
    getHistoryVersions()
    auditLogging()
  } else {
    ElMessage.error(message);
  }
}

getRuleDetail();

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

// 返回
const back = () => {
  router.replace("/unitChargeRule/unitChargeRuleListCW");
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
      padding: 20px 24px 40px 16px;
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
        height: calc(100% - 296px);
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

  .td-first-fixed{
    width: 200px;
    padding: 6px 0;
    flex:none!important;
  }

  .footer {
    padding: 16px 0;
    height: 64px;
    box-sizing: border-box;

    .submitBox {

      .noSave,
      .saveDraft,
      .submitAudit,
      .addVersions,
      .back {
        width: 96px;
        height: 32px;
        // color: var(--vt-c-theme-colors);
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
}
</style>