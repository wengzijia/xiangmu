<template>
    <div class="changeContent">
        <el-dialog v-model="changeDialog" width="50%" :show-close="false" :close-on-click-modal="false">
            <template #header>
                <div class="headerBox">
                    <div class="title">查看变更内容</div>
                    <el-icon class="close" @click="close">
                        <Close />
                    </el-icon>
                </div>
            </template>
            <!-- 变更申请 -->
            <div class="applyforBox">
                <div class="title">变更申请</div>
                <el-descriptions :column="1" direction="horizontal" border style="margin-top: 10px;">
                    <el-descriptions-item label="订单PO号" label-align="center">
                        <div style="color: #409EFF;">{{ changeContentData.poSn }}</div>
                    </el-descriptions-item>
                    <el-descriptions-item label="变更项" label-align="center">
                        <div>{{ changeContentData.changeCategoryName }}</div>
                    </el-descriptions-item>
                    <el-descriptions-item label="变更类型/说明" label-align="center" class-name="type">
                        <el-table :data="changeContentData.postData" border class="typeTable">
                            <el-table-column label="变更类型" align="center">
                                <template #default="scope">
                                    <div>{{ scope.row.name }}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="变更说明" align="center">
                                <template #default="scope">
                                    <div>{{ scope.row.remark }}</div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-descriptions-item>
                    <el-descriptions-item label="变更详情说明" label-align="center">
                        <HtmlImaagePriview :html='changeContentData.changeRemark'></HtmlImaagePriview>
                    </el-descriptions-item>
                    <el-descriptions-item label="申请人" label-align="center">
                        <div>{{ changeContentData.addUser }}</div>
                    </el-descriptions-item>
                    <el-descriptions-item label="申请时间" label-align="center">
                        <div>{{ changeContentData.addTime }}</div>
                    </el-descriptions-item>
                </el-descriptions>
            </div>
            <!-- 变更内容 -->
            <div class="contentBox">
                <div class="title">变更内容</div>
                <el-table :data="changeContentData.content" border class="contentTable">
                    <el-table-column prop="date" label="变更内容项" align="center" width="180">
                        <template #default="scope">
                            <div v-if="scope.$index == 0">订单信息</div>
                            <div v-if="scope.$index == 1">订单文件</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="变更前" align="center">
                        <template #default="scope">
                            <template v-if="scope.$index == 0">
                                <div style="text-align: left;">
                                    <span style="color: #D0111B;">原订单参数：</span>
                                    <span>{{ scope.row.oldGoodsAttr }}</span>
                                </div>
                                <div style="text-align: left;">
                                    <span style="color: #D0111B;">原订单货期：</span>
                                    <span>{{ scope.row.oldDeliveryDay + '天，' }}</span>
                                    <span>交货日期</span>
                                    <span>{{ '（' + scope.row.oldOutTime + '）' }}</span>
                                </div>
                            </template>
                            <div v-if="scope.$index == 1">
                                <span>原客户文件：</span>
                                <el-link type="primary" :href="senseUrl(BASE_FILE_URL + scope.row.oldFile)" target="_blank"
                                    v-if="scope.row.oldFile">{{ getFileName(scope.row.oldFile) }}</el-link>
                                <span v-else>无</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="变更后" align="center">
                        <template #default="scope">
                            <template v-if="scope.$index == 0">
                                <div style="text-align: left;">
                                    <span style="color: #D0111B;">新订单参数：</span>
                                    <span>{{ scope.row.goodsAttr || '无' }}</span>
                                </div>
                                <div style="text-align: left;">
                                    <span style="color: #D0111B;">新订单货期：</span>
                                    <span>{{ scope.row.deliveryDay ? scope.row.deliveryDay + '天' : '无' }}，</span>
                                    <span>交货日期 </span>
                                    <span>{{ scope.row.outTime ? '（' + scope.row.outTime + '）' : '无' }}</span>
                                    <span v-if="scope.row.deliveryDayAdd">+{{ scope.row.deliveryDayAdd }}天（变更额外增加）</span>
                                </div>
                            </template>
                            <div v-if="scope.$index == 1">
                                <span>新客户文件：</span>
                                <el-link type="primary" :href="senseUrl(BASE_FILE_URL + scope.row.file)" target="_blank"
                                    v-if="scope.row.file">{{ getFileName(scope.row.file) }}</el-link>
                                <span v-else>无</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 变更费用 -->
            <div class="costBox">
                <div class="title">变更费用</div>
                <el-table :data="changeContentData.cost" border class="costTable">
                    <el-table-column label="费用项目" align="center" width="180">
                        <template #default="scope">
                            <div>变更费用</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="变更前" align="center">
                        <template #default="scope">
                            <div>{{ scope.row.orderAmount }}元</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="变更后" align="center">
                        <template #default="scope">
                            <div>{{ scope.row.orderAmount }}元+{{ scope.row.orderAmountDiff }}元</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <template #footer>
                <div style="text-align: center;">
                    <el-button @click="close">关闭</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { senseUrl, getFileName } from "@/utils/index";
import { BASE_FILE_URL } from "@/store/global-constant";
const props = defineProps({
    changeDialog: {
        type: Boolean,
        default: true
    },
    changeContentData: {
        type: Object,
        default: {}
    }
})
const emits = defineEmits(["update:changeDialog"]);
function close() {
    emits("update:changeDialog", false);
}

</script>

<style lang="scss" scoped>
.changeContent {
    &:deep(.el-dialog__header) {
        display: flex;
        align-items: center;
        margin: 0;
        padding: 0;
        background-color: #F5F5F5;
        height: 42px;
        font-size: 14px;
        color: #333333;
        box-sizing: border-box;

        .headerBox {
            padding: 0 22px 0 23px;
            display: flex;
            justify-content: space-between;
            width: 100%;

            .close {
                font-size: 18px;
                cursor: pointer;
            }
        }
    }

    // 变更申请
    .applyforBox {
        .title {
            font-size: 16px;
            color: #333333;
        }

        &:deep(.el-descriptions__cell) {
            background-color: transparent;
        }

        &:deep(.is-bordered-label) {
            color: #666666 !important;
            font-size: 14px !important;
            font-weight: 400;
        }

        &:deep(.type) {
            padding: 0 !important;
        }

        .typeTable {
            &:deep(.el-table__header) {
                .el-table__cell {
                    background-color: transparent !important;
                    color: #666666;
                    font-weight: 400;
                }
            }
        }
    }

    // 变更内容
    .contentBox {
        .title {
            font-size: 16px;
            color: #333333;
            margin-top: 29px;
        }

        .contentTable {
            margin-top: 11px;

            &:deep(.el-table__header) {
                .el-table__cell {
                    background-color: #F7F7F7 !important;
                    color: #666666;
                    font-weight: 400;
                }
            }
        }
    }

    // 变更费用
    .costBox {
        .title {
            font-size: 16px;
            color: #333333;
            margin-top: 29px;
        }

        .costTable {
            margin-top: 11px;

            &:deep(.el-table__header) {
                .el-table__cell {
                    background-color: #F7F7F7 !important;
                    color: #666666;
                    font-weight: 400;
                }
            }
        }
    }

    &:deep(.el-dialog__body) {
        padding: 26px 28px 35px 28px;
        height: 50vh;
        overflow-y: scroll;
    }
}
</style>