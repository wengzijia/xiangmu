<template>
    <div class="popupContainer">
        <el-dialog v-model="visible" :show-close="false" :destroy-on-close="true" :close-on-click-modal="false">
            <template #header>
                <div class="hintBox">
                    <div class="text">编辑</div>
                    <img class="closeImg" src="@/assets/images/close.png" alt="" @click="cancelBtn">
                </div>
            </template>
            <el-form :model="formData" class="demo-form-inline" style="width:100%;" ref="ruleFormRef">
                <el-form-item label="公式详情:" style="width: 392px;">
                    <p class="el-radio__label"> {{ dialogData.formulaDesc }}</p>
                </el-form-item>
                <el-form-item label="加工商:" prop="checkedList"
                    :rules="[{ required: true, message: '请选择加工商', trigger: ['blur', 'change'] }]">
                    <!-- <el-cascader :options="options" :props="defaultParams" v-model="formData.checkedList" separator="-"
                        @change="handleChange" clearable /> -->
                    <el-select v-model="formData.checkedList" @change="handleChange" multiple placeholder="请选择加工商">
                        <el-option v-for="item in options" :key="item.manufacturerId" :label="item.manufacturerName"
                            :value="item.manufacturerId" />
                    </el-select>
                    <div v-if="promptMessage.length > 0" class="messageStyle">
                        <p v-for="(item, index) in promptMessage" :key="index">{{ item }}</p>
                    </div>
                </el-form-item>

            </el-form>
            <footer>
                <div>
                    <el-button type="primary" class="search_button button" @click="successBtn(ruleFormRef)">{{ confirm
                    }}</el-button>
                    <el-button class="reset_button button" @click="cancelBtn">{{ cancel }}</el-button>
                </div>
            </footer>
        </el-dialog>
    </div>
</template>
  
<script name="formulaConfigurationDialog" setup>
import { getPreRelationManufacturerInfo, getManufacturerWithAtt, relationManufacturers } from "@/api/modules/financia"
import { ref } from 'vue'
const props = defineProps({
    dialogData: {
        type: Object,
        default: () => {
            return { checkedList: [] }
        }
    },
    confirm: {
        type: String,
        default: () => '确定'
    },
    cancel: {
        type: String,
        default: () => '取消'
    },
    processorArr: {
        type: Array,
        default: []
    }


});
const formData = ref({ checkedList: [] })
const defaultParams = { multiple: true }
const options = ref([])
const visible = ref(true)
const promptMessage = ref([])
const changeFlag = ref(false) //判断用户是否切换过加工商的值
const params = {}

/**
 * 通过工艺id获取当前工艺下的加工商
 */
const getcheckedAttributeIds = () => {
    const { manufacturerList, attributeId, id } = props.dialogData || {}
    Object.assign(params, { attributeId, valuationFormulaId: id })
    getManufacturerWithAtt(attributeId).then(res => {
        const { code, data } = res || {}
        if (!res || code != '000000' || !data || data.length == 0) return
        // data.forEach(item => {
        //     const { manufacturerName, manufacturerId, parkOrOutFactoryList } = item
        //     let arr = []
        //     parkOrOutFactoryList.forEach(val => {
        //         const { relationName, relationId } = val
        //         val.label = relationName
        //         val.value = manufacturerId + '-' + relationId
        //         arr.push(val)
        //     })
        //     item.label = manufacturerName
        //     item.value = manufacturerId
        //     item.children = arr
        // })
        options.value = data
        const arr = []
        manufacturerList.forEach(item => {
            const { manufacturerId, relationId } = item
            // const checkIds = [manufacturerId, manufacturerId + '-' + relationId]
            // formData.value.checkedList.push(checkIds)
            let findIndex = data.findIndex(p =>parseInt(p.manufacturerId) == manufacturerId)
            console.log(manufacturerId,findIndex, data)
            if (manufacturerId && findIndex > -1) arr.push(manufacturerId)
        })
        formData.value.checkedList = arr
    })
}

getcheckedAttributeIds()
const emit = defineEmits(['setDialogBtn'])
const ruleFormRef = ref();
/**
 * 点击提交按钮
 * @param {*} formEl 
 */
const successBtn = (formEl) => {
    if (!formEl) return
    formEl.validate((valid, fields) => {
        if (valid) {
            setSubmit(2)
        } else {
            console.log('error submit!', fields)
            return false
        }
    })
}
//点击取消按钮
const cancelBtn = () => {
    visible.value = false
    emit('setDialogBtn', false)
}
/**
 * 验证或者提交 type--1:表示验证；type--2:表示确定提交
 */
const setSubmit = (type) => {
    if (!changeFlag.value) return cancelBtn()
    const postUrl = type == 1 ? getPreRelationManufacturerInfo : relationManufacturers
    postUrl(params).then(res => {
        console.log(res, '验证')
        if (type == 1 && res && res.data) return promptMessage.value = res.data || []
        if (type == 2 && res.code == '000000') {
            visible.value = false
            emit('setDialogBtn', true)
            return
        }
        ElMessage({
            showClose: true,
            message: res?.message || '服务错误',
            type: 'error',
        })
    })
}


/**
 * 选择框选择的值发生改变时触发
 */
const handleChange = () => {
    changeFlag.value = true
    // const obj = {}
    console.log(formData.value.checkedList)
    // formData.value.checkedList.forEach(item => {
    //     const key = item[0]
    //     const ids = item[1].split('-')[1]
    //     obj[key] ? obj[key].push(ids) : obj[key] = [ids]

    // })
    const mutiManufacturerList = []
    // for (let keys in obj) {
    //     const checkVal = {}
    //     options.value.forEach(item => {
    //         const { manufacturerId, manufacturerName, parkOrOutFactoryList } = item
    //         if (manufacturerId == keys) {
    //             checkVal.manufacturerId = manufacturerId
    //             checkVal.manufacturerName = manufacturerName
    //             checkVal.manufacturerTypeList = parkOrOutFactoryList.filter((val) => obj[keys].includes(val.relationId))
    //         }
    //     })
    //     mutiManufacturerList.push(checkVal)
    // }
    // params.mutiManufacturerList = mutiManufacturerList
    formData.value.checkedList.forEach(val => {
        const checkVal = {}
        options.value.forEach(item => {
            const { manufacturerId, manufacturerName, parkOrOutFactoryList } = item
            if (manufacturerId == val) {
                checkVal.manufacturerId = manufacturerId
                checkVal.manufacturerName = manufacturerName
                checkVal.manufacturerTypeList = parkOrOutFactoryList
            }
        })
        mutiManufacturerList.push(checkVal)
    })
    params.mutiManufacturerList = mutiManufacturerList
    setSubmit(1)

}





</script>

<style lang="scss" scoped>
.popupContainer {
    :deep(.el-dialog) {
        width: 700px;
        height: 480px;
        margin: 200px auto 0;
        padding-bottom: 80px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;

        .el-dialog__header {
            margin-right: 0;
            padding: 8px 24px;
            background-color: var(--vt-c-theme-colors);
            height: 40px;
            box-sizing: border-box;
            position: relative;
        }

        .el-dialog__body {
            flex: 1;
            overflow: auto;

            .el-cascader {
                width: 80%;
            }

            .el-select {
                width: 80%;
            }
        }
    }

    .messageStyle {
        font-size: 14px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-weight: 400;
        color: #F14932;
    }

    .contentBox {
        padding-top: 16px;
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
            cursor: pointer;
        }
    }

    &:deep(.el-dialog__body) {
        padding: 16px 32px 32px 32px;
        box-sizing: border-box;
    }

    .hintContent {
        font-size: 14px;
        color: #333;
    }

    footer {
        width: 100%;
        background-color: #fff;
        height: 80px;
        position: absolute;
        left: 0;
        bottom: 0;
        padding-top: 16px;
        box-sizing: border-box;
        z-index: 99;

        >div {
            margin: 0 auto;
            text-align: center;

            .button {
                width: 96px;
                margin: 0 40px;
            }
        }

    }


}
</style>