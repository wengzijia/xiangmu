<template>
  <div v-loading="loading">
    <el-card style="margin: 10px">
      <div style="margin-right: 30px; max-width: 1200px">
        <div class="title">变更申请单</div>
        <el-descriptions title="" :column="1" border >
          <el-descriptions-item label="订单PO号" align="center" label-class-name="line_bg" width="170px" min-width="160px" >{{
            formParams.changeDetail?.poSn
          }}</el-descriptions-item>
          <el-descriptions-item label="订单类型/来源" width="160px" align="center" label-class-name="line_bg">
            <DictTag :value="formParams.changeDetail?.orderType" :options="orderChange_order_type" style="display:inline"  />(<DictTag :value="formParams.changeDetail?.orderSource" :options="orderChange_order_source" style="display:inline" />)
            </el-descriptions-item>
          <el-descriptions-item label="变更项" align="center" label-class-name="line_bg">{{
            resultFind?.categoryName
          }}</el-descriptions-item>
          <el-descriptions-item label="变更类型/原因" align="center" width="160px" class-name="des1" label-class-name="line_bg">
            <el-table :data="formParams.changeDetail?.postData" border :header-cell-style="{
                  background: 'none !important',
                  color: '#666666',
                  'font-weight': '400'
                }">
              <el-table-column prop="name" label="变更类型" align="center">
                <template #default="scope">
                  <div>{{ scope.row.name || "无" }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="变更说明" align="center">
                <template #default="scope">
                  <div>{{ scope.row.remark || "无" }}</div>
                </template>
              </el-table-column>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="变更详情说明" align="center" label-class-name="line_bg">
            <HtmlImaagePriview :html='formParams.changeDetail?.changeRemark' style="display:inline-block"
              class="remarkIndex"></HtmlImaagePriview>
          </el-descriptions-item>
          <el-descriptions-item label="申请人" width="100px" align="center" label-class-name="line_bg">{{
            formParams.changeDetail?.addUser
          }}</el-descriptions-item>
          <el-descriptions-item label="申请时间" align="center" label-class-name="line_bg">{{
            parseTime(formParams.changeDetail?.addTime) || '无'
          }}</el-descriptions-item>
        </el-descriptions>
        <div class="title mar_60">变更内容</div>
        <el-table :data="contentTable" style="width: 100%" border>
          <el-table-column prop="name" label="变更内容项" align="center">

          </el-table-column>
          <el-table-column prop="front" label="变更前" align="left">
            <template #default="scope">
              <div v-if="scope.row.oldGoodsAttr">
                <span style="color:#D9001B;">{{ scope.row.old }}订单参数:</span>
                <span>{{ scope.row.oldGoodsAttr }}</span>
              </div>
              <div>
                <span v-if="scope.row.oldDeliveryDay">
                  <span style="color:#D9001B;">{{ scope.row.old }}订单货期:</span>
                  <span>{{ scope.row.oldDeliveryDay }}天</span>,
                </span>
                <span v-if="scope.row.oldOutTime">
                  交货日期({{ scope.row.oldOutTime }})
                </span>
              </div>
              <div v-if="scope.row.oldFile">
                <span>{{ scope.row.old }}客户文件:</span>
                <el-link type="primary" @click="openFile(scope.row.oldFile)">查看文件</el-link>
                <!-- <span style="color:#02A7F0;" @click="openFile(scope.row.oldFile)">查看文件</span> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="after" label="变更后" align="left">
            <template #default="scope">
              <div v-if="scope.row.goodsAttr">
                <span style="color:#D9001B;">{{ scope.row.new }}订单参数:</span>
                <span>{{ scope.row.goodsAttr }}</span>
              </div>
              <div>
                <span v-if="scope.row.deliveryDay">
                  <span style="color:#D9001B;">{{ scope.row.new }}订单货期:</span>
                  <span>{{ scope.row.deliveryDay }}天</span>,
                </span>
                <span v-if="scope.row.outTime">
                  交货日期({{ scope.row.outTime }})
                </span>
              </div>
              <div v-if="scope.row.file">
                <span>{{ scope.row.new }}客户文件:</span>
                <el-link type="primary" @click="openFile(scope.row.file)">查看文件</el-link>
              </div>
              <div v-if="scope.row.isMakeUpGroup">
                订单已拼版,<span v-if="scope.row.groupSn">大版号:{{ scope.row.groupSn
                }}({{ orderChange_makeUp_status[scope.row.makeUpType].label }})</span>
              </div>
              <div v-if="scope.row.groupFileHandler">大版文件处理:
                <DictText :value="scope.row.groupFileHandler" dict="orderChange_groupFile_type"
                  style="display: inline-block;"></DictText>
              </div>
              <div v-if="scope.row.pressFileHandler"> 印前文件处理:
                <DictText :value="scope.row.pressFileHandler" dict="orderChange_pressFile_type"
                  style="display: inline-block;"></DictText>
              </div>
              <div v-if="scope.row.structureFileHandler">结构文件处理:
                <DictText :value="scope.row.structureFileHandler" dict="orderChange_structureFile_type"
                  style="display: inline-block;"></DictText>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="title mar_60">变更成本</div>
        <el-table :data="costTable" style="width: 100%" border>
          <el-table-column prop="name" label="费用项目" />
          <el-table-column prop="orderAmount" label="变更前">
            <template #default="scope">
              <div>{{ scope.row.orderAmount }}元</div>
            </template>
          </el-table-column>
          <el-table-column prop="orderAmountDiff" label="变更后">
            <template #default="scope">
              <div>{{ scope.row.orderAmountDiff }}元</div>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="commonVal.length > 0">
          <div v-if="commonVal[0].orderType == 1">
            <div class="title mar_60">补差价</div>
            <el-table :data="commonVal" style="width: 100%" border>
              <el-table-column prop="orderNo" label="差价单号" width="226" />
              <el-table-column prop="diffMoney" label="差价金额" width="100" />
              <el-table-column prop="createTime" label="生成时间">
                <template #default="scope">
                  <div>{{ parseTime(scope.row.createTime) }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="diffDesc" label="备注" />
              <el-table-column prop="type" label="补差价类别" />
              <el-table-column prop="statusName" label="支付状态" />
            </el-table>
          </div>
          <div v-if="commonVal[0].orderType == 2">
            <div class="title mar_60">退款</div>
            <el-table :data="commonVal" style="width: 100%" border>
              <el-table-column prop="orderNo" label="退款单号" width="226" />
              <el-table-column prop="diffMoney" label="退款金额" width="100" />
              <el-table-column prop="createTime" label="申请时间">
                <template #default="scope">
                  <div>{{ parseTime(scope.row.createTime) }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="diffDesc" label="备注" />
              <el-table-column prop="type" label="退款类别" />
              <el-table-column prop="statusName" label="状态">
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div class="title mar_60">审核进度</div>
        <div class="step_mar">
          <el-steps :active="currentApproveNode" process-status="process" finish-status="success">
            <template v-for="(item, index) in approveNode" :key="index">
              <el-step :title="item.name" :status="item.status" />
            </template>
          </el-steps>
        </div>
        <div v-for="item in approveList" style="margin-top:30px">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>{{ item.changeDepartment }}
                  <span v-if="item.approveUseTime">用时 {{ calcTime(item.approveUseTime) }}</span>
                  <span v-else-if="item.status == 1 && formParams.changeDetail.changeStatus == 1">
                    审核剩余时间
                    <span>{{ calcTime(countdown) }}</span></span>
                </span>
                <!-- {{ hours }}</span>:<span>{{ minutes }}</span>:<span>{{ seconds }} -->
                <el-button class="button" link type="primary" @click="goURLs(item, formParams.changeDetail?.node)"
                  v-if="item.stepsType != 9 && item.status != 1" :disabled="IsDisabled()">查看</el-button>
              </div>
            </template>
            <div class="item_mar" v-if="item.approveUser">审核人：{{ item.approveUser }}</div>
            <div class="item_mar" v-if="item.statusName">审核状态：{{ item.statusName }}</div>
            <div class="item_mar" v-if="item.operateTime">审核时间：{{ parseTime(item.operateTime) }}</div>
            <div v-if="item.stepsType == 11">
              <div v-if="item.auditInstructions">
                审核意见： <HtmlImaagePriview :html='item?.auditInstructions' style="display:inline-block" class="remarkIndex">
                </HtmlImaagePriview>
              </div>

            </div>
            <div v-else>
              <div class="item_mar" v-if="item.auditInstructions">审核意见：{{ item.auditInstructions }}</div>
            </div>


            <div class="btn_mar">
              <el-button size="large" class="sucess" @click.once="goURLs(item, formParams.changeDetail?.node)"
                v-if="item.stepsType != 9 && item.status == 1 && formParams.changeDetail.changeStatus == 1"
                :disabled="IsDisabled()">开始审核</el-button>
              <!-- <el-button size="large"  @click="goURLs(item, 'NoPass', formParams.changeDetail?.node)" v-if="item.stepsType != 9">审核不通过</el-button> -->
            </div>
          </el-card>
        </div>
        <el-card class="box-card" v-if="formParams.changeDetail?.changeStatus == 2" style="margin-top:30px">
          <div>
            <span style="display: inline-block;margin-right: 40px;">订单变更审核完成</span>
            <span>完成时间:{{ parseTime(formParams.changeDetail?.endTime) }}</span>
          </div>
        </el-card>
        <el-card class="box-card"
          v-if="formParams.changeDetail?.changeStatus == 3 || formParams.changeDetail?.changeStatus == 5 || formParams.changeDetail?.changeStatus == 4"
          style="margin-top:30px">
          <div>
            <span style="display: inline-block;margin-right: 40px;">订单变更审核终止</span>
            <span>终止时间:{{ parseTime(formParams.changeDetail?.endTime) }}</span>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { BASE_FILE_URL } from "@/store/global-constant";
import { senseUrl } from "@/utils/index";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
const route = useRoute();
const router = useRouter();
let { changeNo, isView } = route.query;
const { proxy } = getCurrentInstance();
import { getApproveDetail, getFirstCategory, isApproveOutTime } from "@/api/orderChange/detail";
const { orderChange_makeUp_status,orderChange_order_source, orderChange_order_type } = proxy.useDict("orderChange_order_source", "orderChange_order_type","orderChange_makeUp_status");
const IconType = ref()
const resultFind = ref();
const loading = ref(true)
const countdown = ref(1)
const data = reactive({
  formParams: {
  },
  contentTable: [
  ],
  costTable: [],
  commonVal: [],
  approveNode: [],
  currentApproveNode: 0,
  approveList: []
});
const { formParams, contentTable, costTable, commonVal, approveNode, currentApproveNode, approveList } = toRefs(data);
const goURLs = (val, node) => {
  console.log("___");
  let arr = node.split(",")
  let isShow;
  let routerUrl;
  switch (val.stepsType) {
    case 1:
      routerUrl = "qualityConfirm";
      break;
    case 2:
      routerUrl = "offlineConfirm";
      break;
    case 3:
    case 4:
      routerUrl = "produceConfirm";
      break;
    case 5:
      routerUrl = "prepressConfirm";
      console.log(3243);
      break;
    case 6:
      routerUrl = "structureConfirm";
      break;
    case 7:
      routerUrl = "businessConfirm";
      if (arr.indexOf(5) !== -1) {
        isShow = true
      } else {
        isShow = false
      }
      break;
    case 8:
      routerUrl = "customerConfirm";
      break;
    case 11:
      routerUrl = "eraBusinessConfirm";
      break;
  }
  getIsApproveOutTime(routerUrl, val)

};

// 拼版类型
let makeUpStatus = reactive({
  0: "单板",
  1: "专版",
  2: "拼版"
})

const getList = () => {
  let obj = {
    //  changeNo: "OC2306061131293208",
    //changeNo: "OC2306064820461032",
    // changeNo: "OC2306073732005743",
    //changeNo:"OC2306086632491905"
    // OC2306087651392169 //质量
    //OC2306098552069415 //业务主管审核
    //
    changeNo: changeNo
  };
  getApproveDetail(obj)
    .then((res) => {
      if (res.code == 200) {
        formParams.value = res.data
        approveList.value = res.data.approveList
        countdown.value = res.data.totalApproveTime - res.data.totalUsedTime
        // test(res.data)
        resetTable(res.data)
        getFirstCategory()
          .then((res) => {
            if (res.code == 200) {
              let arr = res.data;

              resultFind.value = arr.find((num) => {
                return num.id == formParams.value.changeDetail.changeCategoryId
              })
            }
          })
          .catch(() => { })
          .finally(() => { });
      }
    })
    .catch(() => {
      loading.value = false
    })
    .finally(() => {
      loading.value = false
    });

};
getList();
const resetTable = (val) => {
  contentTable.value = [
    {
      name: '订单信息',
      old: '原',
      oldGoodsAttr: val.changeDetail.updateInfo.oldGoodsAttr,
      oldDeliveryDay: val.changeDetail.updateInfo.oldDeliveryDay,
      oldOutTime: val.changeDetail.updateInfo.oldOutTime,
      new: '新',
      goodsAttr: val.changeDetail.updateInfo.goodsAttr || "无",
      deliveryDay: val.changeDetail.updateInfo.deliveryDay,
      outTime: val.changeDetail.updateInfo.outTime,
    },
    {
      name: '订单文件',
      old: '原',
      oldFile: val.changeDetail.updateInfo.oldFile,
      new: '新',
      file: val.changeDetail.updateInfo.file,
      isMakeUpGroup: val.changeDetail.isMakeUpGroup,
      groupSn: val.changeDetail.groupSn,
      makeUpType: val.changeDetail.makeUpType,
      groupFileHandler: val.changeDetail.groupFileHandler,
      pressFileHandler: val.changeDetail.pressFileHandler,
      structureFileHandler: val.changeDetail.structureFileHandler,
    }
  ]
  costTable.value = [{
    name: '变更费用',
    orderAmount: val.changeDetail.orderAmount,
    orderAmountDiff: val.changeDetail.orderAmount + val.changeDetail.orderAmountDiff,
  }]
  commonVal.value = [{
    orderNo: val.diffOrder?.orderNo,
    diffMoney: val.diffOrder?.diffMoney,
    createTime: val.diffOrder?.createTime,
    diffDesc: val.diffOrder?.diffDesc,
    type: val.diffOrder?.type,
    statusName: val.diffOrder?.statusName,
    status: val.diffOrder?.status,
    orderType: val.diffOrder?.orderType
  }]
  approveNode.value = val.changeDetail.node?.split(',').map((e, index) => {
    let status = '';
    if (e == val.currentApproveNode) {
      if (e == 12) {
        currentApproveNode.value = index + 1
      } else {
        IconType.value = "close"
        currentApproveNode.value = index
        let error = val.approveList.find(s => s.stepsType == e)
        let changeStatus = val.changeDetail.changeStatus
        console.log(val.changeDetail.changeStatus);
        // || val.changeDetail.changeStatus==5
        // if(error?.status==3 ){
        //   status = "error"
        // }
        if (changeStatus == 3 || changeStatus == 4 || changeStatus == 5) {
          status = "error"
        }
      }
    }
    return {
      name: val.approveNode[e],
      key: e,
      status: status,
    }
  })
}
// 打开文件
const openFile = (url) => {
  window.open(senseUrl(BASE_FILE_URL + url), "_blank");
}
//isView查看传view  审核传"review"
const IsDisabled = () => {
  if (isView == "view") {
    return true
  } else {
    return false
  }
}

const startCountdown = () => {
  calcTime(countdown.value)
  const intervalId = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value -= 1
    } else {
      countdown.value = 0
    }
    calcTime(countdown.value)
    if (countdown.value < 0) {
      clearInterval(intervalId)
    }
  }, 1000)
}

// 计算小时,分钟,秒
const calcTime = (time) => {
  let hours = 0;
  let minutes = 0;
  let seconds = 0
  let remainingSeconds = time
  hours = Math.floor(remainingSeconds / 3600)
  remainingSeconds -= hours * 3600
  minutes = Math.floor(remainingSeconds / 60)
  remainingSeconds -= minutes * 60
  seconds = remainingSeconds
  return hours + ":" + minutes + ":" + seconds
}
onMounted(() => {
  startCountdown()
})
const getIsApproveOutTime = (routerUrl, val) => {
  let obj = {
    // addTime: val.addTime,
    changeNo: formParams.value.changeDetail.changeNo,
  }
  // router.push({
  //           path: routerUrl,
  //           query: {
  //             id: val.id,
  //             stepsType: val.stepsType
  //           },
  //         });
  if (val.status == 1) {
    isApproveOutTime(obj)
      .then((res) => {
        console.log(res);
        if (res.code == 200) {
          console.log(res);
          if (res.data) {
            ElMessage({
              type: "error",
              message: "审核超时",
            });

            getList()
          } else {
            router.push({
              path: routerUrl,
              query: {
                id: val.id,
                stepsType: val.stepsType
              },
            });
          }
        }
      })
      .catch(() => { })
      .finally(() => { });
  } else {
    console.log(routerUrl,);
    router.push({
      path: routerUrl,
      query: {
        id: val.id,
        stepsType: val.stepsType
      },
    });
  }

}
</script>
<style>
.des1 {
  padding: 0 !important;
  border: none !important;
}

.line_bg {
  background: none !important;
  color: #666 !important;
  font-weight: 400 !important;
}
</style>
<style lang="scss" scoped>
// #el-form {
//   border: 1px solid #e4e7ed;
//   border-radius: 4px;
//   .el-form-item {
//     border-bottom: 1px solid #e4e7ed;
//     margin-bottom: 0px;
//     &:last-child {
//       border-bottom: none;
//     }
//     .el-form-item__label {
//       border-right: 1px solid #e4e7ed;
//       padding: 0 20px;
//       //   padding: 12px 0 12px 20px;
//       height: auto;
//       line-height: 40px;
//       color: #515a6e;
//       font-weight: bold;
//       font-size: 14px;
//       display: flex;
//       align-items: center;
//     }
//     .el-form-item__content {
//       //   padding: 8px 0px 0px;
//       //   height: 40px;
//       line-height: 40px;
//       color: #606266;
//       > * {
//         padding: 0 20px;
//       }
//       .el-form-item__error {
//         top: 42px;
//       }
//     }
//     .el-input__inner {
//       margin-bottom: 0px;
//     }
//   }
// }

.title {
  padding: 10px 0px;
  font-weight: bold;
  font-size: 15px;
  min-width: 180px;
}

.mar_60 {
  margin-top: 30px;
}

.flex_table {
  display: flex;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step_mar {
  margin: 20px 0;
}

.item_mar {
  margin: 10px 0;
  word-break: break-all;
}

.btn_mar {
  margin: 30px auto;
  text-align: center;
}

.sucess {
  background-color: $bgColor;
  color: $color;
  border: $borColor;
}

.remarkIndex {
  word-break: break-all;

  &:deep(img) {
    width: 150px;
    height: 150px;
    text-align: left;
    margin-right: 10px;
  }
}
</style>
