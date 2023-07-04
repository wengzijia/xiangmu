<template>
    <div>
        <div class="cateHead">
            <span>品类{{ toChineseNumber(index + 1) }}：</span>
            <span v-if="!formData.isCategoryEdit">
                <el-icon class="elicons" @click="editEnable()">
                    <Edit />
                </el-icon>
                <el-icon class="elicons" @click="deleteCategory(index)">
                    <Delete />
                </el-icon>
            </span>
            <p v-if="formData.isCategoryEdit">
                <el-button @click="cancel()">取消</el-button>
                <el-button type="primary" @click="comfirmCategory()">确认</el-button>
            </p>
        </div>
        <el-form :model="formData" :rules="rules" label-width="120px" ref="categoryRef">
            <el-form-item label="品类：" prop="goodsId">
                <span v-if="!formData.isCategoryEdit">{{
                    formData.goodsName
                }}</span>
                <div v-else class="selectOption" style="width: 370px">
                    <el-select style="width: 120px" v-model="formData.packCategory" placeholder="包装类型" filterable>
                        <el-option v-for="item in packCategoryList" :key="item.data.id" :label="item.data.name"
                            :value="item.data.name" @click="selectBoxCategory(item.children)" />
                    </el-select>
                    <el-select style="width: 120px" v-model="formData.boxCategory" placeholder="盒型" filterable>
                        <el-option v-for="item in boxCategoryList" :key="item.data.id" :label="item.data.name"
                            :value="item.data.name" @click="selectBoxGoods(item.children)" />
                    </el-select>
                    <el-select style="width: 120px" v-model="formData.goodsId" placeholder="盒型" filterable
                        @change="selectGoods">
                        <el-option v-for="item in boxGoodsList" :key="item.data.id" :label="item.data.name" :disabled="item.disabled"
                            :value="item.data.id" />
                    </el-select>
                </div>
            </el-form-item>
            <el-form-item :label="orderType == '1'
                ? '打样数量：'
                : '大货生产数量：'
                " prop="proofingQuantity">
                <span v-if="!formData.isCategoryEdit">{{
                    formData.proofingQuantity
                }}</span>
                <el-input-number v-else v-model="formData.proofingQuantity" @keydown="clearInput" :precision="0" :min="1"
                    :max="orderType == '1' ? 10 : 999999999" :controls="false"
                    :placeholder="orderType == '1' ? '请输入打样数量' : '请输入大货生产数量'" style="width: 370px"></el-input-number>
            </el-form-item>
            <el-form-item v-if="orderType == '2'" label="客户文件：" prop="designFileUrl">
                <crmFileUpload v-if="formData.isCategoryEdit" v-model:modelValue="formData.designFileUrl" name="上传客户提供设计文件"
                    :fileType="['pdf', 'png', 'jpg', 'jpeg']" :fileSize="50" replace></crmFileUpload>
                <div v-if="!formData.isCategoryEdit" style="word-break: break-all;">{{ getFileName(formData.designFileUrl) }}
                </div>
            </el-form-item>
            <el-form-item v-if="orderType != '2'" label="设计需求：" prop="designRequirementRtf">
                <div v-if="!formData.isCategoryEdit" style="color: #7f7f7f;">
                    <span style="word-break: break-all;">
                        {{ formData.designRequirementRtf }}
                    </span>
                    <p v-if="formData.designRequirementAttachment" style="margin: 10px 0">
                        附件1：{{ getFileName(formData.designRequirementAttachment) }}
                    </p>
                </div>
                <el-input v-if="formData.isCategoryEdit" v-model="formData.designRequirementRtf" placeholder="请输入设计需求"
                    type="textarea" :rows="3" resize="none" maxlength="2000" style="margin-bottom: 6px;width: 370px" />
                <crmFileUpload v-if="formData.isCategoryEdit" v-model:modelValue="formData.designRequirementAttachment"
                    name="上传附件" :del="true" replace></crmFileUpload>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { toChineseNumber, getFileName } from '@/utils/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import crmFileUpload from '@/components/FileUpload/crmFileUpload.vue'

const props = defineProps({
    orderType: {
        type: String,
        default: '',
    },
    index: {
        type: Number,
        default: 1,
    },
    data: {
        type: Object,
        default: {
            isCategoryEdit: true,//是否可编辑状态
            goodsName: '',//选中的盒型
            packCategory: '',//包装类型
            boxCategory: '',//盒型1
            goodsId: '',//盒型2
            proofingQuantity: null,//打样/大货数量
            designFileUrl: '',//客户文件
            designRequirementRtf: '',//设计需求
            designRequirementAttachment: ''//设计需求/附件
        }
    },
    //包装类型
    packCategoryList: {
        type: Array,
        default: []
    },
    //禁用盒型列表
    disabledList:{
        type:Array,
        default:[]
    }
})
const data = reactive({
    formData: {
        isCategoryEdit: true,//是否可编辑状态
        goodsName: '',//选中的盒型
        packCategory: '',//包装类型
        boxCategory: '',//盒型1
        goodsId: '',//盒型2
        proofingQuantity: null,//打样/大货数量
        designFileUrl: '',//客户文件
        designRequirementRtf: '',//设计需求
        designRequirementAttachment: '',//设计需求/附件
        add:true
    },
})
const oldData = ref('')
const { formData } = toRefs(data)
if (props.data) {
    oldData.value = JSON.stringify(props.data)
    formData.value = props.data
}
const { orderType,packCategoryList,disabledList } = toRefs(props)
//盒型1
const boxCategoryList = ref([])
//盒型2
const boxGoodsList = ref([])

const validateQuantity = (rule, value, callback) => {
    if (value === '') {
        callback(new Error(props.orderType == '1' ? '请输入打样数量' : '请输入大货生产数量'))
    } else {
        if (props.orderType == '1' && value > 10) {
            callback(new Error('最大打样数量为10'))

        } else {
            if (value < 1) {
                callback(new Error(props.orderType == '1' ? '最小打样数量为1' : '最小大货生产数量为1'))
            }
            callback()
        }
    }
}
const rules = reactive({
    goodsId: [
        {
            required: true,
            message: '请选择盒型',
            trigger: 'blur',
        },
    ],
    proofingQuantity: [
        {
            required: true,
            validator: validateQuantity,
            trigger: 'blur',
        },
    ],
    designRequirementRtf: [
        {
            required: true,
            message: '请输入设计需求',
            trigger: 'blur',
        },
    ],
    designFileUrl: [
        {
            required: true,
            message: '请上传设计文件',
            trigger: 'change',
        },
    ],
})

//根据包装类型给盒型1下拉列表赋值
function selectBoxCategory(list) {
    if (boxCategoryList.value == list) {
        return
    }
    boxCategoryList.value = list
    boxGoodsList.value = []
    formData.value.boxCategory = null
    formData.value.goodsId = null
}
//根据盒型1型给盒型2下拉列表赋值
function selectBoxGoods(list) {
    if (boxGoodsList.value == list) {
        return
    }
    boxGoodsList.value = list
    formData.value.goodsId = null
}
//启用编辑
function editEnable(){
    emits('update:data', JSON.parse(oldData.value))
    formData.value = props.data 
    formData.value.isCategoryEdit = true
    formData.value.add = false
    if (formData.value.packCategory) {
       boxCategoryList.value = packCategoryList.value.find(item=>{return item.data.name == formData.value.packCategory}).children 
    }
    if (formData.value.boxCategory) {
        boxGoodsList.value = boxCategoryList.value.find(item=>{return item.data.name == formData.value.boxCategory}).children
    }
}
//取消编辑
function cancel() {
    if (formData.value.add) {
        deleteCategory()
        return
    }
    if (disabledList.value.indexOf(JSON.parse(oldData.value).goodsId!=-1)) {
        ElMessage.error('不能选择同一种盒型!')
        return
    }
    formData.value = JSON.parse(oldData.value)
    formData.value.isCategoryEdit = false
}
const emits = defineEmits()
//删除该品类
function deleteCategory() {
    emits('deleteCategory', props.index)
}
const categoryRef = ref(null)
//确认该品类
function comfirmCategory() {
    //校验
    categoryRef.value.validate((valid, fields) => {
        if (valid) {
            formData.value.isCategoryEdit = false
            formData.value.add = false
            oldData.value = JSON.stringify(formData.value)
            emits('update:data', formData.value)
        } else {
            console.log('校验不通过', fields)
        }
    })
}
//选择盒型
function selectGoods(val) {
    if (disabledList.value.indexOf(val)!=-1) {
        ElMessage.error('不能选择同一种盒型!')
        formData.value.goodsId = ''
        return
    }
    if (val) {
        formData.value.goodsName = formData.value.boxCategory +'-' + boxGoodsList.value.find(item => { return item.data.id == val })?.data.name
    } else {
        formData.value.goodsId = ''
    }
}
</script>

<style lang="scss" scoped>
p {
    margin: 0;
    padding: 0;
}


.cateHead {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    font-size: 18px;
    padding: 10px;
    margin-bottom: 18px;
}

.alignRight {
    display: inline-block;
    width: 100px;
    text-align: right;
}

.elicons {
    color: #7f7f7f;
    margin-right: 10px;
    cursor: pointer;
}

.selectOption {
    width: 423px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>