<template>
    <div class="commonTableListBox">
        <main>
            <p>待办事项</p>
            <div class="table_box" id="getTableHeight">
                <el-table :data="pendingList" :header-cell-style="{ color: '#333' }" border :height="tableHeight">
                    <el-table-column prop="flowName" label="流程名称及流程节点" min-width="200" align="center" />
                    <el-table-column prop="initiatorUserName" label="发起人" min-width="120" align="center" />
                    <el-table-column prop="createTime" label="待办产生时间" align="center" min-width="180">
                        <template #default="scope">
                            <div style="color: #333;">{{ parseTime(scope.row.createTime, '{m}-{d} {h}:{i}') || '-' }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="preUserName" label="上环节处理人" align="center" min-width="160" />
                    <el-table-column prop="preRemark" label="上环节备注" align="center" min-width="200" />
                    <el-table-column label="操作" width="160" align="center">
                        <template #default="scope">
                            <el-button class="edit_buttom" size="small" @click="openPendingList(scope.row)">去处理</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="footer">
                <pageIndex @dropDownValueChange="fruitValueChange" v-if="pendingList && pendingList.length > 0"
                    :pageNumber="pageData.pageNumber" :pageSize="pageData.pageSize" :totalCount="pageData.totalCount" />
            </div>
        </main>
    </div>
</template>
  
<script name="ProcessorList" setup>
import pageIndex from "@/layout/commonLayout/pageIndex.vue";
import { getPendingPage } from '@/api/modules/workbench'
import { onMounted, ref } from 'vue'
import { parseTime } from "@/utils/util"
import { openNewPage } from '@/utils/commonApi'
import { ElMessage } from "element-plus";
import { setLoginModule } from "@/utils/commonApi"
import { useBroadcast } from '@/hooks/component/useBroadcast'
const {listenPendingListChannel} = useBroadcast()

const pageData = ref({
    pageNumber: 1,
    pageSize: 15,
    pageSizeArr: [15, 30, 50, 100],
    totalCount: 0
})

var tableHeight = ref()
let channel = ""
//设置表格高度，当屏幕高度发生变化时，表格高度随之变化
onMounted(() => {
    if (document.getElementById('getTableHeight')) tableHeight.value = document.getElementById('getTableHeight').clientHeight
    window.onresize = () => {    //写在mounted中,onresize事件会在页面大小被调整时触发
        return (() => {
            if (document.getElementById('getTableHeight')) tableHeight.value = document.getElementById('getTableHeight').clientHeight
            console.log(tableHeight.value)
        })();
    };
     channel = listenPendingListChannel((data)=> {
        console.log('触发待办消息--pendingList--：', data)
        //如果要判定从哪个界面发出的消息，可以在data中传递个tag参数过来，tag=页面名字
        if (data.refreshData) setTimeout(() => {
            getgetPendingList()
        }, 10);
    });
});
onUnmounted(() => {
    channel.close();
})
const pendingList = ref([])
function getgetPendingList() {
    getPendingPage({ language: "zh-cn", pageNumber: pageData.value.pageNumber, pageSize: pageData.value.pageSize }).then(res => {
        console.log('获取待办事项的列表：', res)
        if (res.code == '000000') {
            pendingList.value = res?.data?.items || []
            pageData.value.totalCount = res?.data?.totalCount || 0
        }
    })
}
getgetPendingList()

const openPendingList = (item) => {
    if (!item) return window.open(`pendingList`, '_blank')
    const { pendingType } = item
    //pendingType: 枚举(单价计费规则审核:1:bill_rule_audit ,账单核算审核:2:account_audit ,结款单核算:3:settle_calc )
    switch (pendingType) {
        case 1:
            navToUnitChargeRule(item)
            break;
        case 2:
            navToMonthyAccounting(item)
            break;
        case 3:
            navToSettlement(item)
            break;
        default:
            return ElMessage({ message: '该待办服务暂未开放，敬请期待！', type: 'warning', })
    }
}

//导航到月结核算
const navToMonthyAccounting = (data) => {
    let { businessId, busAuditStatus,customFiled:customFieldStr } = data
    //busAuditStatus -1未审核(默认)/提交审核， 1.采购经理通过，2.采购经理不通过， 3.产业园财务通过，4.产业园财务不通过，5.驳回给加工商， 6.驳回给采购，7.作废
    let customField = JSON.parse(customFieldStr||'{}')
    const {billId,billNum} = customField
    console.log(busAuditStatus,customFieldStr,billId,billNum)
    const urls = {
        3: '/accountChecking/monthlyStatementDetail',
        6: '/accountChecking/abnormalProcessFee',
    }
    if ([-1, 1, 2, 3, 4, 5, 7].indexOf(busAuditStatus) > -1) {
        busAuditStatus = 3;
    }

    busAuditStatus = busAuditStatus||3
    openNewPage(`${urls[busAuditStatus]}?id=${businessId}&billId=${billId}&billNum=${billNum}`)
}

//导航到结算
const navToSettlement = (data) => {
    //busAuditStatus 8.加工商通过 9.加工商不通过 10.总部财务通过 11.总部财务不通过
    let { businessId, busAuditStatus } = data
    openNewPage(`/accountChecking/settlementDetail?id=${businessId}`)
}

//导航到计费规则
const navToUnitChargeRule = (data) => {
    let  { businessId, busAuditStatus } =  data
    //busAuditStatus 审核状态：-1未审核(默认)/提交审核， 1.采购经理通过，2.采购经理不通过，3.产业园财务通过，4.产业园财务不通过，5.驳回给加工商， 6.驳回给采购，7.作废 8.加工商通过 9.加工商不通过 10.总部财务通过 11.总部财务不通过
    const viewUrl = {
        cg: '/unitChargeRule/unitChargeRuleAuditCGJLDetail',
        cw: '/unitChargeRule/unitChargeRuleAuditCWDetail'
    }
    //所有不通过的审核(2:采购经理不通过；4：产业园财务不通过)都会到采购专员那里去，如果当前待办是不通过的信息，直接跳转到采购专员重新编辑审核的页面上去
    if (busAuditStatus == 2 || busAuditStatus == 4) {
        return openNewPage(`/unitChargeRule/unitChargeRuleCGDetail?id=${businessId}`)
    }
    openNewPage(`${viewUrl[setLoginModule()]}?id=${businessId}`)
}
/* const viewUrl = {
    cg: 'unitChargeRule/unitChargeRuleAuditCGJLDetail',
    cw: 'unitChargeRule/unitChargeRuleAuditCWDetail'
}
//去处理待办事项
const openPage = (item) => {
    console.log(item)
    const { businessId, pendingType,busAuditStatus } = item //pendingType: 1--单价计费规则审核;2--结款单核算
    if (pendingType != 1) return ElMessage({ message: '该待办服务暂未开放，敬请期待！', type: 'warning', })
    //所有不通过的审核(2:采购经理不通过；4：产业园财务不通过)都会到采购专员那里去，如果当前待办是不通过的信息，直接跳转到采购专员重新编辑审核的页面上去
    if(busAuditStatus==2||busAuditStatus==4) {
       
        return window.open(`unitChargeRule/unitChargeRuleCGDetail?id=${businessId}`, '_blank')
    } 
    //因为现在只有单价计费规则审核，所以可以不用区分
    window.open(`${viewUrl[setLoginModule()]}?id=${businessId}`, '_blank')
} */


//分页模块改变的值
const fruitValueChange = (val) => {
    console.log('改变分页模块的值：', val)
    pageData.value = Object.assign(pageData.value, val)
    getgetPendingList()
}



</script>
  
<style lang="scss" scoped>
.commonTableListBox {
    height: 100%;
    width: 100%;
    background-color: #f2f2f2;
    padding: 16px;
    box-sizing: border-box;

    main {
        // height: calc(100% - 48px);
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background-color: #fff;
        padding: 0 24px;
        box-sizing: border-box;

        >p {
            font-size: 16px;
            color: #333;
            font-weight: 600;
            margin: 0;
            padding: 0;
            height: 60px;
            padding-top: 20px;
            box-sizing: border-box;
        }

        .table_box {
            flex: 1;
            overflow: hidden;

            .edit_buttom {
                color: var(--vt-c-theme-colors);
            }
        }

        .footer {
            height: 72px;
            width: 100%;
            padding-top: 32px;
            box-sizing: border-box;


        }
    }

    .table_box :deep(.el-table__header) th {
        background-color: #f2f2f2;
    }

    .table_box .edit_buttom {
        color: var(--vt-c-theme-colors);
        background-color: transparent;
        border-color: var(--vt-c-theme-colors);
    }

    .table_box .edit_buttom:hover {
        opacity: 0.5;
    }


}
</style>