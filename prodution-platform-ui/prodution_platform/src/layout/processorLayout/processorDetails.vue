<template>
    <div class="ProcessorDetailsBox">
        <div class="item-line">
            <p>基本信息</p>
            <div class="info">
                <div>
                    <span class="isTrue">加工商名称：</span>
                    <span>{{ formData.manufacturerName }}</span>
                </div>
                <div>
                    <span class="isTrue">法人：</span>
                    <span>{{ formData.corpName || '-'}}</span>
                </div>
                <div>
                    <span class="isTrue">电话：</span>
                    <span>{{ formData.telephone || '-' }}</span>
                </div>
                <div>
                    <span>联系地址：</span>
                    <span class="addressText">{{ getDetailedAddress() }}</span>
                </div>
                <div>
                    <span class="isTrue">加工商老板：</span>
                    <span>{{ formData.bossName }}</span>
                </div>
                <div>
                    <span class="isTrue">手机号：</span>
                    <span>{{ formData.userMobile }}</span>
                </div>
            </div>
        </div>
        <div class="item-line" v-if="formData.manufacturerAccountList && formData.manufacturerAccountList.length > 0">
            <p>账户信息</p>
            <div class="manufacturerAccountList">
                <div v-for="(item, index) in formData.manufacturerAccountList" :key="index">
                    <p> <span class="isTrue">{{` 账户${index+1}收款人：` }}</span>
                        <span>{{ item.payeeName }}</span>
                    </p>
                    <p> <span class="isTrue">{{ `账户${index+1}账号：` }}</span>
                        <span>{{ item.paymentAccount }}</span>
                    </p>
                    <p> <span class="isTrue">{{ `账户${index+1}开户行：` }}</span>
                        <span>{{ item.paymentBank }}</span>
                    </p>
                </div>

            </div>
        </div>
        <div class="item-line">
            <p>开票信息</p>
            <div class="info">
                <div>
                    <span>税号：</span>
                    <span>{{ formData.taxNum || '无' }}</span>
                </div>
                <div>
                    <span>开票税率：</span>
                    <span>{{ getTaxRate(formData.taxRate) }}</span>
                </div>
                <div>
                    <span>收费税点：</span>
                    <span>{{ formData.taxPoint?formData.taxPoint+'%' : '无' }}</span>
                </div>

            </div>
        </div>
        <div class="item-line">
            <p>加工商类型</p>
            <div class="processor-item" v-for="item in formData.manufacturerTypes" :key="item">
                <div>
                    <p> <span class="isTrue">加工商类型：</span>
                        <span>{{ getmanufacturerType(item.manufacturerType) }}</span>
                    </p>
                    <p v-if="item.manufacturerType == 1"> <span class="isTrue" >所属产业园：</span>
                        <span>{{ item.relationName }}</span>
                    </p>
                    <p v-if="item.manufacturerType == 3 || item.manufacturerType == 4"> <span class="isTrue" >外发厂地址：</span>
                        <span class="addressText">{{ getFactoryAddress(item) }}</span>
                    </p>
                    <p v-if="item.manufacturerType != 2 && item.manufacturerType != 4"> <span class="isTrue">结款方式：</span>
                        <span>{{ gettlementType(item.settlementType) }}</span>
                    </p>
                    <p v-if="item.manufacturerType == 1"> <span class="isTrue">配置机长看板：</span>
                        <span>{{ item.isBw == 1 ? '有' : '没有' }}</span>
                    </p>
                    <p> <span class="isTrue">状态：</span>
                        <span>{{ item.enableStatus == 1 ? '启用中' : '禁用中' }}</span>
                    </p>
                    <p v-if="item.manufacturerType != 4"> <span class="isTrue">分配工艺：</span>
                        <span>{{ getAttributeBinds(item.attributeBinds) }}</span>
                    </p>
                </div>
                <!-- <div v-if="item.manufacturerType == 3">
                    <p> <span class="isTrue">加工商类型：</span>
                        <span>{{ getmanufacturerType(item.manufacturerType) }}</span>
                    </p>
                   
                    <p> <span class="isTrue">结款方式：</span>
                        <span>{{ gettlementType(item.settlementType) }}</span>
                    </p>

                    <p> <span class="isTrue">状态：</span>
                        <span>{{ item.enableStatus == 1 ? '启用中' : '禁用中' }}</span>
                    </p>
                    <p> <span class="isTrue">分配工艺：</span>
                        <span>{{ getAttributeBinds(item.attributeBinds) }}</span>
                    </p>
                </div>
                <div v-if="item.manufacturerType == 2">
                    <p> <span class="isTrue">加工商类型：</span>
                        <span>{{ getmanufacturerType(item.manufacturerType) }}</span>
                    </p>

                    <p> <span class="isTrue">状态：</span>
                        <span>{{ item.enableStatus == 1 ? '启用中' : '禁用中' }}</span>
                    </p>
                    <p> <span class="isTrue">分配工艺：</span>
                        <span>{{ getAttributeBinds(item.attributeBinds) }}</span>
                    </p>
                </div> -->
            </div>
        </div>
    </div>
</template>
  
<script name="ProcessorDetails" setup>
import { sortByLetterMap } from "@/utils/maps/commonMap";
import { ref, computed } from 'vue'
const props = defineProps({
    formData: {
        type: Object,
        default: () => {
            return {

            }
        }
    },
});
const tlementTypeObj = {
    1: '月结',
    3: '现结',
    4: '预付款'
}
const manufacturerTypeObj = {
    1: '产业园',
    3: '单工序外发',
    2: '未入驻',
    4: '整单外发'
}
const taxRateObj = {
    0: '0%',
    0.03: '3%',
    0.05: '5%',
    0.06: '6%',
    0.09: '9%',
    0.13: '13%',
}

const gettlementType = computed(() => (key) => {
    return tlementTypeObj[key] || '暂无'
});
const getmanufacturerType = computed(() => (key) => {
    return manufacturerTypeObj[key] || '暂无'
});
const getTaxRate = computed(() => (key) => {
    console.log(key, 'getTaxPoint')
    return taxRateObj[key] || '无'
})
/**
 * 获取工艺名称展示
 */
const getAttributeBinds = computed(() => (data) => {
    const arr = []
    if (data && data.length > 0) {
        data.forEach(item => {
            arr.push(item.attributeName)
        })
    }
    return arr.join('、')
});
/**
 * 获取详细地址信息展示
 */
const getDetailedAddress = computed(() => () => {
    console.log(props.formData)
    const { provinceName, cityName, countyName, address } = props.formData
    let title = ''
    if (provinceName) title += provinceName + '-'
    if (cityName) title += cityName + '-'
    if (countyName) title += countyName

    if (address) title += ' ' + address
    return title || '无'

})
// const emit = defineEmits(['dropDownValueChange'])

// 外发厂地址
const getFactoryAddress = computed(() => (data) => {
    console.log(data)
    const { provinceName, cityName, countyName, address } = data
    let title = ''
    if (provinceName) title += provinceName + '-'
    if (cityName) title += cityName + '-'
    if (countyName) title += countyName

    if (address) title += ' ' + address
    return title || '无'

})

</script>
  
<style lang="scss" scoped>
.ProcessorDetailsBox {
    height: 100%;

    .item-line {
        margin-bottom: 32px;

        >p {
            font-size: 16px;
            font-family: Source Han Sans CN-Medium, Source Han Sans CN;
            font-weight: 600;
            color: #333;
            margin: 0 0 16px 0;
        }

        >.info {
            width: 100%;
            display: flex;
            flex-wrap: wrap;

            >div {
                width: 33.3%;
                margin-bottom: 12px;
                display: flex;
                flex-direction: row;
            }
        }

        .info,
        .manufacturerAccountList,
        .processor-item {
            span {
                font-size: 14px;
                font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                font-weight: 400;
                color: #666;
                position: relative;
                // display: inline-block;
                // width: 90px;
                
            }

            span:last-child {
                color: #333;
                flex: 1;
                
                margin-right: 20px;
            }
            .addressText{
                word-wrap: normal;
                word-break: break-all;
                white-space:pre-wrap;
            }

            .isTrue::after {
                content: '*';
                color: var(--el-color-danger);

                position: absolute;
                left: -8px;
                top: 0;
            }
        }

        >.manufacturerAccountList {
            width: 100%;
            display: flex;
            flex-wrap: wrap;

            >div {
                width: 400px;
                background: #F7F7F7;
                border-radius: 4px 4px 4px 4px;
                margin-right: 40px;
                padding: 20px 20px 8px 20px;
                box-sizing: border-box;

                p {
                    margin-bottom: 12px;
                }
            }
        }

        .processor-item {
            width: calc(100% - 32px);
            background: #F7F7F7;
            padding: 20px 20px 8px 20px;
            box-sizing: border-box;

            >div {
                width: 100%;
                display: flex;
                flex-wrap: wrap;

                >p {
                    width: 33.3%;
                    margin-bottom: 12px;
                    display: flex;
                }
            }
        }
    }

}
</style>