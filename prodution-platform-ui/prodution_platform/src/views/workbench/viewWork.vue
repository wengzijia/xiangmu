<template>
    <div class="viewWork_box">
        <header>
            <p class="title">业务进展</p>
            <div class="list-item">
                <ul>
                    <li v-for="(item, index) in getOPtions()" :key="index">
                        <div>
                            <img :src="getAssetURL(item)" :alt="item.title">
                        </div>
                        <div class="right">
                            <p>{{ item.title }}</p>
                            <p>{{ item.value }}</p>
                        </div>
                        <div class="line" v-if="getOPtions().length > 3 ? index < 3 : index < getOPtions().length - 1">
                        </div>
                    </li>
                </ul>
            </div>
        </header>
        <main>
            <div class="main_left" id="main-container">
                <p class="title">快捷功能</p>
                <el-scrollbar :height="tableHeight">
                    <div class="main-container">
                        <p>数据分析</p>
                        <ul class="data-analysis" style="padding-left: 36px;box-sizing: border-box;">
                            <li v-for="(item, index) in getDataAnalysisOPtions('analysis')" :key="index"
                                @click="openPage(item)">
                                <img :src="getAssetURL(item)" :alt="item.title">
                                <span :class="item.disable ? 'forbidden-title' : 'default-title'">{{ item.title }}</span>
                            </li>
                        </ul>
                        <div class="stepBox">
                            <el-steps direction="vertical">
                                <el-step v-for="(item, index) in getDataAnalysisOPtions('steps')" :key="index">
                                    <template v-slot:icon>
                                        <span :class="`step step_${index + 1}`"></span>
                                    </template>
                                    <template v-slot:title>
                                        <span class="stepTitle">{{ item.title }}</span>
                                        <ul class="data-analysis">
                                            <li v-for="(val, cur) in item.subitems" :key="cur" @click="openPage(val)">
                                                <img :src="getAssetURL(val)" :alt="val.title">
                                                <span :class="val.disable ? 'forbidden-title' : 'default-title'">{{
                                                    val.title
                                                }}</span>
                                            </li>
                                        </ul>
                                    </template>
                                </el-step>

                            </el-steps>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
            <p style="width: 16px;"></p>
            <div class="main-right">
                <div class="title">
                    待办事项<span>{{ pendingCount }}</span>
                    <p class="seeAll" v-if="pendingList && pendingList.length > 0" @click="openPendingList('')">
                        查看全部<el-icon>
                            <ArrowRight size="14px" color="#999" />
                        </el-icon>
                    </p>
                </div>
                <el-scrollbar :height="tableHeight">
                    <div class="main-container" v-if="pendingList && pendingList.length > 0">
                        <ul>
                            <li v-for="item in pendingList" @click="openPendingList(item)">
                                <div class="item-top">
                                    <p>{{ item.flowName }}</p>
                                    <p>{{ parseTime(item.createTime, '{m}-{d} {h}:{i}') || '-' }}</p>
                                </div>
                                <div class="item-bottom">
                                    <p>发起人：{{ item.initiatorUserName }}</p>
                                    <p>上环节处理人：{{ item.preUserName }}</p>
                                    <p>上环节备注：<span>{{ item.preRemark }}</span></p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <template v-else>
                        <el-empty description="暂无待办事项 ~" :image="emptyFlow" />
                    </template>
                </el-scrollbar>

            </div>
        </main>

    </div>
</template>  
<script name="viewWork" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { setLoginModule, permissionsMenuFlag, openNewPage,appendUrlTimeStamp, setAuthorityJudgment, userLoginOut } from '@/utils/commonApi'
import { parseTime } from "@/utils/util"
import { getPendingPage } from '@/api/modules/workbench'
import emptyFlow from '@/assets/images/emptyFlow.png'
import { useBroadcast } from '@/hooks/component/useBroadcast'
const {listenPendingListChannel} = useBroadcast()
const pendingCount = ref(0)
const pendingList = ref([])
const router = useRouter();

let channel = ""
var channelType = '' //审核不通过时触发
var tableHeight = ref()
//设置表格高度，当屏幕高度发生变化时，表格高度随之变化
onMounted(() => {
    if (document.getElementById('main-container')) tableHeight.value = document.getElementById('main-container').clientHeight - 20
    window.onresize = () => {    //写在mounted中,onresize事件会在页面大小被调整时触发
        return (() => {
            if (document.getElementById('main-container')) tableHeight.value = document.getElementById('main-container').clientHeight - 20
        })();
    };
    
    channel = listenPendingListChannel((data)=> {
        console.log('触发待办消息--viewwork page--：', data)
        //如果要判定从哪个界面发出的消息，可以在data中传递个tag参数过来，tag=页面名字
        if (data.refreshData) setTimeout(() => {
            getgetPendingList()
        }, 10);
    });
});
onUnmounted(() => {
    channel.close();
})
const getgetPendingList = () => (
    getPendingPage({ "language": "zh-cn", "pageNumber": 1, "pageSize": 100 }).then(res => {
        console.log('获取待办事项的列表：', res)
        if (res.code == '000000') {
            pendingList.value = res?.data?.items || []
            pendingCount.value = res?.data?.totalCount || 0
        }
    })
)
getgetPendingList()
const viewModuleList = {
    cg: [
        { title: '采购订单', key: '', value: '0', iconSrc: 'cgdd' },
        { title: '订单在途', key: '', value: '0', iconSrc: 'ddzt' },
        { title: '采购退货', key: '', value: '0', iconSrc: 'cgth_header' },
        { title: '采购入库', key: '', value: '0', iconSrc: 'cgrk_header' }
    ],
    cw: [
        { title: '应收金额', key: '', value: '0.00', iconSrc: 'ysje' },
        { title: '应付金额', key: '', value: '0.00', iconSrc: 'yfje' },
        { title: '待收金额', key: '', value: '0.00', iconSrc: 'dsje' },
        { title: '待付金额', key: '', value: '0.00', iconSrc: 'dfje' }
    ],
    boss: [
        { title: '在产工单数', key: '', value: '0', iconSrc: 'zcgds' },
        { title: '延期订单数', key: '', value: '0', iconSrc: 'yqdds' },
        { title: '生产目标完成率', key: '', value: '0%', iconSrc: 'scmbwcl' },
        { title: '今日发货订单数', key: '', value: '0', iconSrc: 'jrfhdds' }
    ],
    gly: [
        { title: '今日登录异常数', key: '', value: '0', iconSrc: 'jrdlycs' },
        { title: '今日登录日志数', key: '', value: '0', iconSrc: 'jrdlrzs' },
    ]
}
const dataAnalysisOPtions = {
    cg: {
        analysis: [
            { title: '采购订单分析', iconSrc: 'cgddfx', disable: true },
            { title: '加工费单价分析', iconSrc: 'jgfdjfx', disable: true },
            { title: '采购类目分析', iconSrc: 'cglmfx', disable: true },
            { title: '来料品质分析', iconSrc: 'llpzfx', disable: true }
        ],
        steps: [
            {
                title: '供应商/加工商', subitems: [
                    { title: '新增加工商', iconSrc: 'xzjgs', pagePath: '/processorModule/addProcessor', openType: 1 },
                    { title: '新增供应商', iconSrc: 'xzgys', disable: true },
                    { title: '供应商物料维护', iconSrc: 'gyswlwh', disable: true },
                    { title: '加工商列表', iconSrc: 'jgslb', pagePath: '/processor/processorList' },
                ]
            },
            {
                title: '采购', subitems: [
                    { title: '采购计划管理', iconSrc: 'cgjhgl', disable: true },
                    { title: '询报价管理', iconSrc: 'xbjgl', disable: true },
                    { title: '采购订单管理', iconSrc: 'cgddgl', disable: true },
                    { title: '合同管理', iconSrc: 'htgl', disable: true },
                ]
            },
            {
                title: '售后', subitems: [
                    { title: '采购入库', iconSrc: 'cgrk', disable: true },
                    { title: '采购退货', iconSrc: 'cgth', disable: true }

                ]
            },
            {
                title: '对账', subitems: [
                    { title: '采购账单对账', iconSrc: 'cgzddz', disable: true },
                    { title: '加工商账单对账', iconSrc: 'jgszddz', pagePath: '/accountChecking/abnormalProcessFee', },
                    //采购专员以及采购经理：pagePath_1--表示经理
                    { title: '单价计费规则列表', iconSrc: 'djjfgzpz', pagePath: '/unitChargeRule/unitChargeRuleListCG', pagePath_1: '/unitChargeRule/unitChargeRuleListCW' },
                    { title: '单价计费规则审核', iconSrc: 'djjfgzsh', pagePath: '/unitChargeRule/unitChargeRuleListAuditCGJL' },
                ]
            }
        ]
    },
    cw: {
        analysis: [
            { title: '加工费账单分析', iconSrc: 'jgfzdfx', disable: true },
            { title: '加工费单价分析', iconSrc: 'jgfdjfx', disable: true },
            { title: '采购账单分析', iconSrc: 'cgzdfx', disable: true },
            { title: '生产经营账单分析', iconSrc: 'scjyzdfx', disable: true }
        ],
        steps: [
            {
                title: '计费规则配置', subitems: [
                    { title: '计价公式配置', iconSrc: 'jjgspz', pagePath: '/financial/priceFormulaList' },
                    { title: '单价计费规则列表', iconSrc: 'djjfgzpz', pagePath: '/unitChargeRule/unitChargeRuleListCW' },
                    { title: '单价计费规则审核', iconSrc: 'djjfgzsh', pagePath: '/unitChargeRule/unitChargeRuleListAuditCWB' },
                    { title: '加工商公式配置', iconSrc: 'jgsgspz', pagePath: '/financial/formulaConfiguration' },
                ]
            },
            {
                title: '生产加工对账', subitems: [
                    { title: '账单管理', iconSrc: 'zdgl', disable: true },
                    { title: '扣款单', iconSrc: 'kkd', disable: true },
                    { title: '结款单', iconSrc: 'jkd', disable: true },
                    { title: '付款单', iconSrc: 'fkd', disable: true },
                ]
            },
            {
                title: '账单审核管理', subitems: [
                    { title: '账单审核流程配置', iconSrc: 'zdshlcpz', disable: true },

                ]
            },
            {
                title: '对账', subitems: [
                    { title: '采购账单对账', iconSrc: 'cgzddz', disable: true },
                    { title: '加工商账单对账', iconSrc: 'jgszddz', pagePath: '/accountChecking/monthlyStatementList',pagePath_1:'/accountChecking/settlementList' },

                ]
            }
        ]
    },
    boss: {
        analysis: [
            { title: '订单数据分析', iconSrc: 'ddsjfx', disable: true },
            { title: '生产工单数据分析', iconSrc: 'scgdsjfx', disable: true },
            { title: '生产交付及时率分析', iconSrc: 'scjfjslfx', disable: true }
        ],
        steps: [
            {
                title: '产业园管理', subitems: [
                    { title: '新增产业园', iconSrc: 'xzcyy', pagePath: '/industrialParkManage/industrialParkAdd', openType: 1 },
                    { title: '产业园列表', iconSrc: 'cyylb', pagePath: '/industrialParkManage/industrialParkList' },
                ]
            },
            {
                title: '生产设备运行监控', subitems: [
                    { title: '设备列表', iconSrc: 'sblb', disable: true },
                    { title: '设备故障监控', iconSrc: 'sbgzjk', disable: true }
                ]
            },
            {
                title: '物流设备运行监控', subitems: [
                    { title: ' AGV配置', iconSrc: 'AVG', disable: true },


                ]
            },
            {
                title: '生产工单监控', subitems: [
                    { title: '敬请期待', iconSrc: 'scgdjk', disable: true, type: 'nothing' },

                ]
            }
        ]
    },
    gly: {
        analysis: [
            { title: '登录异常分析', iconSrc: 'dlycfx', disable: true },
            { title: '登录日志分析', iconSrc: 'dlrzfx', disable: true },
        ],
        steps: [
            {
                title: '菜单管理', subitems: [
                    { title: '新增菜单', iconSrc: 'xzcd', disable: true },
                    { title: '菜单管理', iconSrc: 'cdgl', pagePath: '/admin/menuManage' },
                    { title: '页面管理', iconSrc: 'ymgl', disable: true },
                    { title: '按钮配置', iconSrc: 'anpz', disable: true },
                ]
            },
            {
                title: '角色权限管理', subitems: [
                    { title: '新增角色', iconSrc: 'xzjs', disable: true },
                    { title: '角色管理', iconSrc: 'jsgl', disable: true },
                    { title: '角色权限配置', iconSrc: 'jsqxpz', pagePath: '/admin/roleManage' },

                ]
            },
            {
                title: '组织管理', subitems: [
                    { title: '新增组织', iconSrc: 'xzzz', disable: true },
                    { title: '组织管理', iconSrc: 'zzgl', disable: true }
                ]
            },
            {
                title: '用户管理', subitems: [
                    { title: '新增用户', iconSrc: 'xzyh', pagePath: '/admin/addNewUser', openType: 1 },
                    { title: '用户管理', iconSrc: 'yhgl', pagePath: '/admin/userManage' }

                ]
            }
        ]
    }
}

const getAssetURL = (data) => {
    const { iconSrc, disable, type } = data
    if (type == 'nothing') return new URL(`../../assets/images/workbeach/common/nothing.png`, import.meta.url).href
    const urlImg = disable ? iconSrc + '_d' : iconSrc
    const imgType = setLoginModule()
    if (imgType == 'boss') return new URL(`../../assets/images/workbeach/boss/child/${urlImg}.png`, import.meta.url).href
    if (imgType == 'cg') return new URL(`../../assets/images/workbeach/cg/child/${urlImg}.png`, import.meta.url).href
    if (imgType == 'cw') return new URL(`../../assets/images/workbeach/cw/child/${urlImg}.png`, import.meta.url).href
    if (imgType == 'gly') return new URL(`../../assets/images/workbeach/gly/child/${urlImg}.png`, import.meta.url).href


}


const getOPtions = computed(() => () => {
    return viewModuleList[setLoginModule()] || []
});

const getDataAnalysisOPtions = computed(() => (type) => {
    return dataAnalysisOPtions[setLoginModule()][type] || []
})

/**
 * 点击跳转到当前功能菜单路由
 * @param {*} item 
 * disable:true--表示当前功能未实现；
 * pagePath：有值则表示当前功能已实现，并且通过当前值进行访问；
 * openType：1--表示开启一个新页面
 */
const openPage = (item) => {
    // console.log('openPage',111)
    if (!setAuthorityJudgment()) {
        // console.log('openPage',222)
        userLoginOut(false)
        return ElMessage({ message: '暂无视图权限，请联系管理员！', type: 'warning' })
    }
    let { disable, pagePath, pagePath_1, openType } = item
    
    if (disable || !pagePath) return ElMessage({ message: '敬请期待', type: 'warning' })
    //如果当前功能配置了路由，判断当前路由是否有权限访问
    if (permissionsMenuFlag(pagePath)) return openType ? openNewPage(pagePath) : router.push({ path: pagePath })
    if (pagePath_1) {
        //如果是采购，判断用户是采购经理还是采购专员
        //总部财务-生产加工对账 只能pagePath_1 结款单列表，而产业园财务走对账单列表
        console.log('openPage',333)
        if (!permissionsMenuFlag(pagePath) && !permissionsMenuFlag(pagePath_1)) return ElMessage({ message: '暂无权限访问，请联系管理员！', type: 'warning', })
        if (permissionsMenuFlag(pagePath_1)) return router.push({ path: pagePath_1 })
    }
    // console.log('openPage',444)
    ElMessage({ message: '暂无权限访问，请联系管理员！', type: 'warning', })

}

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
    const urls = {
        3: '/accountChecking/monthlyStatementDetail',
        6: '/accountChecking/abnormalProcessFee',
    }
    if ([-1, 1, 2, 3, 4, 5, 7].indexOf(busAuditStatus) > -1) {
        busAuditStatus = 3;
    }
    else if([8].indexOf(busAuditStatus) > -1){
        busAuditStatus = 6;
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
</script>
  
<style lang="scss" scoped>
.viewWork_box {
    width: 100%;
    min-width: 1200px;
    height: calc(100vh - 80px);
    padding: 32px 32px 0;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    header {
        height: 176px;
        background: #FFF;
        border-radius: 4px;
        width: 100%;

        >.list-item {
            padding: 24px 64px;
            box-sizing: border-box;

            ul {
                height: 68px;
                display: flex;
                overflow: hidden;


                >li {
                    width: 25%;
                    display: flex;
                    position: relative;

                    >div {

                        margin-right: 20px;
                        height: 68px;
                        width: 68px;
                        position: relative;

                        >img {
                            position: absolute;
                            width: 68px;
                            height: 68px;
                            left: 0;
                            top: 0;
                        }


                    }

                    .right {
                        flex: 1;

                        >p {
                            font-size: 14px;
                            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
                            font-weight: 400;
                            color: #666;
                        }

                        >p:last-child {
                            font-size: 32px;
                            font-family: Source Han Sans CN-Medium, Source Han Sans CN;
                            font-weight: 500;
                            color: #333;
                            margin-top: 8px;
                        }
                    }

                    .line {
                        height: 40px;

                        width: 2px;
                        background-color: #F2F2F2;
                        right: 30px;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }

            }

        }
    }

    main {
        flex: 1;
        width: 100%;
        display: flex;
        margin-top: 16px;
        overflow: hidden;

        >div {
            background-color: #FFF;
        }

        li {
            cursor: pointer;
        }

        .main_left {
            height: 100%;
            flex: 1;
            box-sizing: border-box;
            overflow: hidden;

            .main-container {
                padding: 24px;
                box-sizing: border-box;
                overflow: hidden;

                >p {
                    font-size: 14px;
                    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                    font-weight: 400;
                    color: #666;
                }

                .data-analysis {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    margin-top: 8px;

                    >li {
                        width: 220px;
                        margin-right: 20px;
                        height: 68px;
                        padding: 16px 0 16px 16px;
                        box-sizing: border-box;
                        background: #F5F7FA;
                        border-radius: 8px 8px 8px 8px;
                        margin-bottom: 16px;

                        img {
                            width: 35px;
                            height: 35px;
                            vertical-align: middle;
                        }

                        span {
                            vertical-align: middle;
                            margin-left: 16px;
                            font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                            font-weight: 400;
                            font-size: 16px;

                        }
                    }
                }
            }

            .stepBox {
                .step {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                }

                .step_1 {
                    background: #F57116;
                }

                .step_2 {
                    background: #FF644F;
                }

                .step_3 {
                    background: #01B68B;
                }

                .step_4 {
                    background: #09B4F1;
                }

                .stepTitle {
                    font-size: 14px;
                    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                    font-weight: 400;
                    color: #666666;
                }

                :deep(.el-step.is-vertical) {
                    .el-step__line {
                        border: 1px dashed #E1E1E1;
                        background-color: transparent;
                        width: 0 !important;
                    }

                }
            }
        }

        .main-right {
            min-width: 400px;
            width: 30.9%;
            overflow: hidden;

            .main-container {
                padding: 24px;
                box-sizing: border-box;
                overflow: hidden;

                ul {
                    li {
                        border-radius: 2px;

                        border: 1px solid #DFDFDF;
                        margin-bottom: 10px;
                        cursor: pointer;

                        div {
                            display: flex;
                            width: 100%;

                            p {
                                font-size: 14px;
                                font-family: Microsoft YaHei-Regular, Microsoft YaHei;
                                font-weight: 400;
                                color: #666;
                            }
                        }

                        .item-top {
                            border-bottom: 1px solid #F2F2F2;
                            height: 32px;
                            line-height: 32px;
                            padding: 0 10px;
                            box-sizing: border-box;

                            p {
                                flex: 1;

                                &:first-child {
                                    font-weight: 500;
                                    color: #333;
                                    position: relative;
                                    padding-left: 16px;

                                    &::after {
                                        position: absolute;
                                        content: '';
                                        width: 8px;
                                        height: 8px;
                                        border-radius: 50%;
                                        background-color: #F14932;
                                        left: 0;
                                        top: 50%;
                                        transform: translateY(-50%);
                                    }
                                }

                                &:last-child {
                                    text-align: right;
                                }
                            }

                        }

                        .item-bottom {
                            flex-wrap: wrap;
                            padding: 0 10px 10px 26px;
                            box-sizing: border-box;

                            p {

                                margin-top: 10px;
                                width: 55%;

                                &:first-child {
                                    width: 45%;
                                }

                                &:last-child {
                                    width: 100%;
                                    display: flex;

                                    >span {
                                        flex: 1;
                                        word-wrap: normal;
                                        word-break: break-all;
                                        white-space: pre-wrap;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            :deep(.el-empty) {
                position: absolute;
                padding: 0 !important;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -70%);
            }

        }

    }





    .title {
        height: 52px;
        line-height: 52px;
        border-bottom: 1px solid #DFDFDF;
        padding-left: 24px;
        box-sizing: border-box;
        font-size: 16px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #333;
        position: relative;

        >span {
            font-size: 14px;
            color: #F14932;
            margin-left: 4px;
        }

        .seeAll {
            position: absolute;
            font-size: 14px;
            right: 8px;
            height: 52px;
            top: 0;
            padding-left: 20px;
            padding-right: 32px;
            color: #999;
            cursor: pointer;

            :deep(.el-icon) {
                position: absolute;
                right: 16px;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }

    .forbidden-title {
        color: #999;
    }

    .default-title {
        color: #333;
    }





}
</style>
  