<template>
    <div class="workbench_box">
        <LayoutHeader />
        <div class="workbench_container_box">
            <div class="viewModuleList">
                <div v-for="item in viewModuleList" class="item-list">
                    <div class="item-list-left">
                        <div @click="openView(item)">
                            <SvgIcon :name="item.iconSrc" :color="item.color ||'var(--default-main-color)'" w="120px" h="120px" />
                            <p>{{ item.title }}</p>
                        </div>
                    </div>
                    <div class="item-list-right">
                        <ul>
                            <li v-for="val in item.subitems" :class="val.type ? val.className : ''">
                                <div @click="openPages(val, item.iconSrc)">
                                    <img :src="getAssetURL(val)" :alt="val.title">
                                    <p>{{ val.title }}</p>
                                    <el-icon v-if="val?.iconType == 1" color="#999" size="24px" class="el-icon_Right">
                                        <Right />
                                    </el-icon>
                                    <el-icon v-if="val?.iconType == 2" color="#999" size="24px" class="el-icon_DArrowRight">
                                        <DArrowRight />
                                    </el-icon>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>  
<script name="workbench" setup>
import LayoutHeader from "@/layout/mainLayout/components/header.vue";
import { ref } from "vue";
import router from "@/router";
import {getToken,getViemManagement,openNewPage} from '@/utils/commonApi'
const viewModuleList = ref([
    {
        title: 'boss视图', iconSrc: 'boss', isShow: true,
        subitems: [
            { title: '产业园管理', imgSrc: 'cyygl', imgTypes:'boss', pagePath: ['/industrialParkManage/industrialParkList'] },
            { title: '数据驾驶舱', imgSrc: 'sjjsc',imgTypes:'boss', disable: true, iconType: 1 },
            { title: '订单数据分析', imgSrc: 'ddsjfx',imgTypes:'boss', disable: true, iconType: 2, type: 1, className: 'borderLeft' },
            { title: '生产数据分析', imgSrc: 'scsjfx',imgTypes:'boss', disable: true, iconType: 2, type: 1, className: 'borderCenter' },
            { title: '生产设备运行监控', imgSrc: 'scsbyxjk',imgTypes:'boss', disable: true, iconType: 2, type: 1, className: 'borderCenter' },
            { title: '物流设备运行监控', imgSrc: 'wlsbyxjk',imgTypes:'boss', disable: true, type: 1, className: 'borderRight' },
        ]
    },
    {
        title: '采购视图', iconSrc: 'cg', isShow: true,
        subitems: [
            { title: '计费规则配置', imgSrc: 'jfgzpz',imgTypes:'common', pagePath: ['/unitChargeRule/unitChargeRuleListCG','/unitChargeRule/unitChargeRuleListCW'] },
            { title: '生产加工对账', imgSrc: 'scjgdz',imgTypes:'common', pagePath: ['/accountChecking/abnormalProcessFee'] },
            { title: '加工商管理', imgSrc: 'jgsgl',imgTypes:'cg', pagePath: ['/processor/processorList'] },
            { title: '采购计划管理', imgSrc: 'cgjhgl',imgTypes:'cg', disable: true, },
            { title: '询报价管理', imgSrc: 'xbjgl',imgTypes:'cg', disable: true, },
            { title: '采购订单管理', imgSrc: 'cgddgl',imgTypes:'cg', disable: true, },
            { title: '合同管理', imgSrc: 'htgl',imgTypes:'cg', disable: true, },
        ]
    },
    {
        title: '财务视图', iconSrc: 'cw', isShow: true,
        subitems: [
            { title: '计费规则配置', imgSrc: 'jfgzpz',imgTypes:'common',pagePath:['/unitChargeRule/unitChargeRuleListCW']},
            { title: '生产加工对账', imgSrc: 'scjgdz',imgTypes:'common', pagePath: ['/accountChecking/monthlyStatementList','/accountChecking/settlementList'] },
            { title: '采购对账', imgSrc: 'cgdz',imgTypes:'cw', disable: true, },
            { title: '物流对账', imgSrc: 'wldz',imgTypes:'cw', disable: true, },
            { title: '经营对账', imgSrc: 'jydz',imgTypes:'cw', disable: true, },
            { title: '账单审核管理', imgSrc: 'zdshgl', imgTypes:'cw',disable: true, },
            { title: '计价标准配置', imgSrc: 'jjbzpz',imgTypes:'cw', pagePath:['/financial/priceFormulaList','/financial/formulaConfiguration'] },
        ]
    },
    {
        title: '管理员视图', iconSrc: 'gly', isShow: true,
        subitems: [
            { title: '系统权限配置', imgSrc: 'xtqxpz',imgTypes:'gly',pagePath:['/admin/userManage'] },
        ]
    },
    {
        title: '生产计划员视图', iconSrc: 'scjhy',color:'#ABABAB',
        subitems: [
            { title: 'APS智能排产', imgSrc: 'APS',imgTypes:'scjhy', disable: true, iconType: 1 },
            { title: '生产主计划', imgSrc: 'sczjh',imgTypes:'scjhy', disable: true, type: 1, iconType: 2, className: 'borderLeft' },
            { title: '生产过程管理', imgSrc: 'scgcgl',imgTypes:'scjhy', disable: true, type: 1, iconType: 2, className: 'borderCenter' },
            { title: '排产计划调整', imgSrc: 'pcjhtz',imgTypes:'scjhy', disable: true, type: 1, iconType: 2, className: 'borderCenter' },
            { title: '产能管理', imgSrc: 'cngl', imgTypes:'scjhy',disable: true, type: 1, className: 'borderRight' },
            { title: '生产过程管理', imgSrc: 'scgcgl-2',imgTypes:'scjhy', disable: true, iconType: 1 },
            { title: '打样管理', imgSrc: 'dygl', imgTypes:'scjhy',type: 1, disable: true, iconType: 2, className: 'borderLeft' },
            { title: '工序管理', imgSrc: 'gxgl',imgTypes:'scjhy', disable: true, type: 1, className: 'borderRight' }
        ]
    },
    {
        title: '标准化生产经理视图', iconSrc: 'bzhscjl',color:'#ABABAB',
        subitems: [
            { title: '敬请期待', imgSrc: 'nothing',imgTypes:'common' },
        ]
    },
    {
        title: '品质经理视图', iconSrc: 'pzjl',
        subitems: [
            { title: '敬请期待', imgSrc: 'nothing',imgTypes:'common' },
        ]
    }
])

/**
 * 动态加载图片
 * @param {*} item 
 */
const getAssetURL = (item) => {
    const { imgSrc, disable,imgTypes } = item
    const urlImg = disable ? imgSrc + '_d' : imgSrc
    if(imgTypes=='boss') return new URL(`../../assets/images/workbeach/boss/${urlImg}.png`, import.meta.url).href
    if(imgTypes=='cg') return new URL(`../../assets/images/workbeach/cg/${urlImg}.png`, import.meta.url).href
    if(imgTypes=='cw') return new URL(`../../assets/images/workbeach/cw/${urlImg}.png`, import.meta.url).href
    if(imgTypes=='gly') return new URL(`../../assets/images/workbeach/gly/${urlImg}.png`, import.meta.url).href
    if(imgTypes=='common')return new URL(`../../assets/images/workbeach/common/${urlImg}.png`, import.meta.url).href
    if(imgTypes=='scjhy')return new URL(`../../assets/images/workbeach/scjhy/${urlImg}.png`, import.meta.url).href
}
/**
 * 点击查看视图
 * @param {*}  
 */
const openView = (item) => {
    const { iconSrc, isShow } = item
    if (!isShow) return ElMessage({ message: '敬请期待', type: 'warning', })
    //判断当前视图是否有权限
    //1.0首先判断用户是否登录，如果没有登录不需要处理
    //2.0在已经登录的情况下，判断当前用户是否拥有权限，如果有权限不需要处理
    //3.0在已经登录的情况下，判断当前用户没有当前视图的权限，提示用户暂无权限
    if(getToken()&&!getViemManagement(iconSrc))return ElMessage({ message: '暂无权限访问，请联系管理员！', type: 'warning', })
    openNewPage(`/${iconSrc}/viewWork`,true)
    //window.open(`/${iconSrc}`,'_blank')
}
/**
 * 点击查看视图中的功能页面
 * @param {*} openPages 
 */
const openPages = (val, viewName) => {
    const { pagePath, disable } = val
    if (disable || !pagePath) return ElMessage({ message: '敬请期待', type: 'warning' })
    //判断是否登录--如果未登录跳转到登录页并且携带跳转地址
    //财务视图有产业园财务和总部财务，采购分采购经理和采购专员，当是财务视图或者采购视图的时候，地址可能是多个
    if (!getToken()) return  openNewPage(`/${viewName +'/?redirect='+JSON.stringify(pagePath)}`)
    //如果登录过
    const options = getViemManagement(viewName)
    if(!options) return ElMessage({ message: '暂无权限访问，请联系管理员！', type: 'warning', })
    //判断当前点击的页面用户是否有权限
    let signUrl = ''
    pagePath.forEach(item=>{if(!signUrl && options.includes(item))signUrl=item})
    if(!signUrl) return ElMessage({ message: '暂无权限访问，请联系管理员！', type: 'warning', })
    openNewPage(`/${viewName + signUrl}`,true)
    //window.open(`/${viewName + signUrl}`,'_blank')
}

</script>
  
<style lang="scss" scoped>
.workbench_box {
    width: 100%;
    height: 100vh;
    box-sizing: border-box;
    background: #F8F9FD;
    position: relative;
    padding-bottom: 48px;
    box-sizing: border-box;
    overflow: hidden;

    .workbench_container_box {
        width: 100%;
        min-width: 1200px;
        height: calc(100vh - 96px);
        padding: 32px 32px 0;
        box-sizing: border-box;
        overflow-y: auto;

        .viewModuleList {
            width: 100%;
            .item-list {
                margin-bottom: 32px;
                background: #FFFFFF;
                width: 100%;
                overflow: hidden;
                display: flex;

                .item-list-left {
                    width: 246px;
                    background: #FFFFFF;
                    box-shadow: 10px 0px 18px -6px rgba(0, 7, 35, 0.06);
                    text-align: center;
                    position: relative;
                    min-height: 166px;

                    >div {
                        position: absolute;
                        width: 100%;
                        left: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        height: 148px;
                        cursor: pointer;

                        p {
                            font-size: 18px;
                            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
                            font-weight: 400;
                            color: #333;
                        }
                    }

                }

                .item-list-right {
                    flex: 1;
                    padding-top: 20px;
                    padding-bottom: 8px;
                    >ul {
                        width: 100%;
                        display: flex;
                        flex-wrap: wrap;
                        padding: 0 0 0 40px;
                        box-sizing: border-box;

                        >li {
                            // width: 222px;
                            width: 258px;
                            padding-top: 10px;
                            text-align: center;
                            height: 126px;
                            position: relative;
                            padding-right: 36px;
                            margin-bottom: 12px;
                            box-sizing: border-box;
                            div {
                                position: absolute;
                                width: 100%;
                                left: 0;
                                top: 50%;
                                transform: translateY(-50%);
                                cursor: pointer;

                                img {
                                    width: 48px;
                                    height: 48px;
                                }

                                p {
                                    font-size: 18px;
                                    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
                                    font-weight: bold;
                                    color: #333;
                                    margin-top: 12px;
                                }

                                .el-icon_Right {
                                    position: absolute;
                                    right: 36px;
                                    top: 50%;
                                    transform: translateY(-120%);
                                }

                                .el-icon_DArrowRight {
                                    position: absolute;
                                    right: 0;
                                    top: 50%;
                                    transform: translateY(-120%);
                                }
                            }

                        }

                  

                        .borderLeft {
                            border-left: 3px dashed #EBEBEB;
                            border-top: 3px dashed #EBEBEB;
                            border-bottom: 3px dashed #EBEBEB;
                            border-radius: 100px 0 0 100px;
                            padding-top: 4px;
                            
                        }

                        .borderCenter {
                            border-top: 3px dashed #EBEBEB;
                            border-bottom: 3px dashed #EBEBEB;
                            padding-top: 4px;
                            
                        }

                        .borderRight {
                            border-right: 3px dashed #EBEBEB;
                            border-top: 3px dashed #EBEBEB;
                            border-bottom: 3px dashed #EBEBEB;
                            border-radius: 0 100px 100px 0;
                            padding-top: 4px;
                            
                        }

                    }
                }

            }
        }
    }
}</style>
  