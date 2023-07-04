<template>
  <div class="lookDetail">
    <el-drawer v-model="isTable" direction="rtl" :title="orderType.orderTitle" size="600px" @close="cancelClick">
      <template #default>
        <div>
          <h3 style="margin-top: 0">基础信息</h3>
          <el-form ref="baseInfoRef" :model="baseInfoForm" :rules="rules" label-width="120px" class="demo-ruleForm"
            size="default" status-icon>
            <el-form-item label="供应商：" prop="supplierName">
              <el-input v-model="baseInfoForm.supplierName" maxlength="50" placeholder="请输入供应商或者供应商编号" show-word-limit
                type="text" />
            </el-form-item>
            <el-form-item label="联系人：" prop="contactsName">
              <el-input v-model="baseInfoForm.contactsName" placeholder="请输入联系人名称" maxlength="50" show-word-limit
                type="text" />
            </el-form-item>
            <el-form-item label="联系电话：" prop="contactsPhone">
              <el-input v-model.number="baseInfoForm.contactsPhone" placeholder="请输入供应商联系人电话" maxlength="11"
                show-word-limit type="text" />
            </el-form-item>
          </el-form>
          <h3>可合作品类</h3>
          <el-form ref="cooperRef" :model="baseInfoForm" :rules="rules" label-width="120px" class="demo-addressForm"
            size="default" status-icon>
            <el-form-item label="合作项：" prop="cooperList">
              <el-select v-model="baseInfoForm.cooperList" placeholder="请选择合作项" style="width: 400px" clearable filterable
                multiple>
                <el-option v-for="item in crm_cooperativeProc" :key="item.userId" :label="item.label"
                  :value="item.value" />
              </el-select>
              <el-tooltip class="box-item" effect="dark" placement="top-end">
                <template #content>打样合作仅支持派发打<br />样单。（支持多选）
                </template>
                <el-icon class="icons">
                  <WarningFilled />
                </el-icon>
              </el-tooltip>

            </el-form-item>
            <el-form-item label="可合作品类：" prop="categoryList">
              <div style="width: 100%">
                <el-button v-if="!isAddCategory" @click="isAddCategory = true">添加品类</el-button>
              </div>
              <div v-if="isAddCategory" class="selectOption">
                <el-select style="width: 140px" v-model="firstGoodsName" placeholder="包装类型" clearable filterable>
                  <el-option v-for="emo in oneCategoryList" :key="emo.data.id" :label="emo.data.name"
                    :value="emo.data.name" @click="oneCategoryClick(emo.children)" />
                </el-select>
                <el-select style="width: 140px;margin:0 6px;" v-model="secondGoodsName" placeholder="盒型" clearable
                  filterable>
                  <el-option v-for="e in twoCategoryList" :key="e.data.id" :label="e.data.name" :value="e.data.name"
                    @click="twoCategoryClick(e.children)" />
                </el-select>
                <el-select style="width: 140px" v-model="thirdGoodsName" placeholder="盒型" clearable filterable>
                  <el-option v-for="emo in threeCategoryList" :key="emo.data.id" :label="emo.data.name"
                    :value="emo.data.name" @click="threeCategoryClick(emo.data)" />
                </el-select>
              </div>
              <div v-if="isAddCategory" style="margin-top:10px">
                <el-button @click="cancelCategory">取消</el-button>
                <el-button style="margin-left: 10px" type="primary" @click="addCate">确定</el-button>
              </div>
            </el-form-item>
          </el-form>
          <div class="selectedItem" v-if="baseInfoForm.categoryList.length">
            <p style="margin-top: 14px">已选：</p>
            <ul class="hadCategory">
              <li v-for="(
									item, index
								) in baseInfoForm.categoryList" :key="item.goodsId">
                <span>{{ item.goodsName }}</span>
                <el-icon class="icon" @click="deleteCategory(index)">
                  <Delete />
                </el-icon>
              </li>
            </ul>
          </div>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submitForm">保存</el-button>
        </div>
      </template>
    </el-drawer>
    <el-dialog v-model="centerDialogVisible" :title="isConfirm ? '确定新建吗？' : '确定取消新建？'" width="30%" align-center>
      <span>{{
        isConfirm
        ? '操作立即生效是否继续'
        : '退出后，已填充的内容不会被保存。'
      }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  newNupplier,
  editNupplier,
  supplierDetail,
} from '@/api/orderManagement/subOrder'
import { validateForms, checkPhone, debounce } from '@/utils/form'
import { ElMessage ,ElLoading} from 'element-plus'

const { proxy } = getCurrentInstance()
const { crm_cooperativeProc } = proxy.useDict('crm_cooperativeProc')
const props = defineProps({
  oneCategoryList: {
    type: Array,
    default: null,
  },
})
// 接收父组件传来的方法
const emits = defineEmits(['crmSupplierFn'])
const baseInfoRef = ref()
const cooperRef = ref()
let isTable = ref(false)
const orderType = reactive({
  orderTitle: '',
  type: null,
  centerDialogVisible: false,
  isConfirm: false,
  firstGoodsName: '',
  secondGoodsName: '',
  thirdGoodsName: '',
  // oneCategoryList: [],
  twoCategoryList: [],
  threeCategoryList: [],
  isAddCategory: false,
  cateObj: {
    goodsId: '',
    goodsName: '',
    sortIndex: 0,
  },
})
const baseInfoForm = reactive({
  cooperList: [],
  id: '',
  categoryList: [], //品类集合
  contactsName: '', //联系人姓名
  contactsPhone: '', //联系人电话
  cooperativeProc: '', //合作项字符串，多个用英文逗号隔开
  supplierName: '', //供应商姓名
})
const {
  centerDialogVisible,
  isConfirm,
  firstGoodsName,
  secondGoodsName,
  thirdGoodsName,
  // oneCategoryList,
  twoCategoryList,
  threeCategoryList,
  isAddCategory,

  cateObj,
} = toRefs(orderType)

// 电话号码校验
const validatePhone = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入联系电话'))
  } else {
    // console.log('22222222---',value);
    if (checkPhone(value + '')) {
      callback()
    } else {
      callback(new Error('请输入有效的号码！'))
    }
  }
}
const validateCate = (rule, value, callback) => {
  // console.log('value--------', value)
  if (value.length > 0) {
    callback()
  } else {
    callback(new Error('请添加品类'))
  }
}
const rules = reactive({
  supplierName: [
    {
      required: true,
      message: '请输入供应商名称或者供应商编号',
      trigger: 'blur',
    },
  ],
  contactsName: [
    {
      required: true,
      message: '请输入联系人名称',
      trigger: 'blur',
    },
  ],
  cooperativeProc: [
    {
      required: true,
      message: '请选择合作项',
      trigger: 'change',
    },
  ],
  categoryList: [
    {
      required: true,
      // message: '请选择品类',
      validator: validateCate,
      trigger: 'change',
    },
  ],
  cooperList: [
    {
      required: true,
      message: '请选择合作项',
      trigger: 'change',
    },
  ],
  contactsPhone: [
    {
      required: true,
      validator: validatePhone,
      trigger: 'blur',
    },
  ],
})

// 选择品类
const oneCategoryClick = (list) => {
  if (twoCategoryList.value == list) {
    return
  }
  twoCategoryList.value = list
  secondGoodsName.value = null
  thirdGoodsName.value = null
  cateObj.value.goodsId = null
  cateObj.value.goodsName = null
}
// 选择品类
const twoCategoryClick = (list) => {
  if (threeCategoryList.value == list) {
    return
  }
  threeCategoryList.value = list
}
  thirdGoodsName.value = null
  cateObj.value.goodsId = null
  cateObj.value.goodsName = null
// 选择品类
const threeCategoryClick = (e, index) => {
  cateObj.value.goodsId = e.goodsId
  cateObj.value.goodsName = secondGoodsName.value + '-' + e.name
  // console.log('eeeeee--------', e)
}
// 取消选中的盒型
const cancelCategory = () => {
  firstGoodsName.value = ''
  secondGoodsName.value = ''
  thirdGoodsName.value = ''
  isAddCategory.value = false
}
// 添加品类
const addCate = () => {
  let flag = baseInfoForm.categoryList.some(
    (e) => e.goodsId == cateObj.value.goodsId
  )
  // console.log('flag-----77777', flag)
  if (flag) {
    ElMessage({
      message: '不能添加同一个盒型',
      type: 'error',
    })
  } else {
    if (cateObj.value.goodsId) {
      baseInfoForm.categoryList.push(cateObj.value)
    }
  }

  cateObj.value = {
    goodsId: '',
    goodsName: '',
    sortIndex: 0,
  }
  firstGoodsName.value = ''
  secondGoodsName.value = ''
  thirdGoodsName.value = ''

  // console.log(1214444212, baseInfoForm.categoryList)
}
const deleteCategory = (index) => {
  baseInfoForm.categoryList.splice(index, 1)
}
// 处理数据
const wantData = (type) => {
  // props.baseCategoryList.map((item, index) => {
  // 	let i = baseInfoForm.categoryList.indexOf(item.id)
  // 	if (i > -1) {
  // 		let obj = {
  // 			goodsId: item.id, //品类id
  // 			goodsName: item.categoryName, //品类名称
  // 			sortIndex: i, //排序序列
  // 		}
  // 		baseInfoForm.categoryList.push(obj)
  // 	}
  // })
  // console.log('props.baseCategoryList-----', props.baseCategoryList)

  baseInfoForm.cooperativeProc = baseInfoForm.cooperList.join(',')
  delete baseInfoForm.cooperList
  if (type == 1) {
    baseInfoForm.categoryList.map((val, idx) => {
      val.sortIndex = idx
    })
    delete baseInfoForm.id
  }
}
// 新增供应商
const newNupplierFn = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  wantData(1)
  newNupplier(baseInfoForm)
    .then((res) => {
      // console.log('新增供应商---', res)
      if (res.code == 200) {
        loading.close()
        emits('crmSupplierFn', 1)
        ElMessage({
          message: '新建供应商成功',
          type: 'success',
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

// 编辑供应商
const editNupplierFn = () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  wantData(2)
  editNupplier(baseInfoForm)
    .then((res) => {
      if (res.code == 200) {
        loading.close()
        emits('crmSupplierFn', 1)
        ElMessage({
          message: '编辑成功',
          type: 'success',
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
// 新建供应商
const confirmClick = () => {
  if (isConfirm.value) {
    if (orderType.type == 1) {
      newNupplierFn()
    } else if (orderType.type == 2) {
      editNupplierFn()
    }
    cancelClick()
  } else {
    cancelClick()
  }
}
// 初始化数据
const cancelClick = () => {
  isTable.value = false
  centerDialogVisible.value = false
  isAddCategory.value = false
  if (!baseInfoRef.value || !cooperRef.value) return
  baseInfoRef.value.resetFields()
  cooperRef.value.resetFields()
}
// 保存
const submitForm = debounce(async () => {
  let formRefs = [baseInfoRef.value, cooperRef.value]
  validateForms(formRefs)
    .then(() => {
      // console.log(111113333338888);

      // console.log('baseInfoForm2222----', baseInfoForm)
      // console.log('props.baseCategoryList', props.baseCategoryList)
      centerDialogVisible.value = true
      isConfirm.value = true
    })
    .catch((err) => {
      console.log(err)
    })
}, 100)
// 取消
const cancel = () => {
  isConfirm.value = false
  centerDialogVisible.value = true
}
// 查询供应商详情数据
const supplierDetailFn = (id) => {
  supplierDetail(id).then((res) => {
    // console.log('查询供应商详情数据--', res)
    if (res.code == 200) {
      baseInfoForm.supplierName = res.data.supplierName
      baseInfoForm.contactsName = res.data.contactsName
      baseInfoForm.contactsPhone = res.data.contactsPhone
      baseInfoForm.cooperativeProc = res.data.cooperativeProc
      baseInfoForm.cooperList = res.data.cooperativeProc.split(',')
      baseInfoForm.categoryList = res.data.categoryList
    }
  })
}
//暴露给父组件的方法控制显示与隐藏
const dialogShow = (type, order, id) => {
  isTable.value = type
  if (order == 1) {
    orderType.orderTitle = '新增供应商'
    orderType.type = 1
  } else if (order == 2) {
    orderType.orderTitle = '编辑供应商'
    orderType.type = 2
    baseInfoForm.id = id
    supplierDetailFn(id)
  }
}

defineExpose({
  dialogShow,
})
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}

.icons {
  color: #b3b3b3;
  font-size: 22px;
  vertical-align: middle;
  margin-left: 10px;
  cursor: pointer;
}

.lookDetail :deep(.el-form-item__label) {
  font-weight: 700;
}

.customer {
  color: #b3b3b3;
  user-select: none;
}

.selectOption {
  // width: 100%;
  // display: flex;
  // justify-content: space-between;
}

.hadCategory {
  width: 100%;
  font-size: 14px;
}

.hadCategory>li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.hadCategory .icon {
  font-size: 18px;
  color: #bbb;
  cursor: pointer;
}

.hadCategory .icon:hover {
  color: red;

}

.selectedItem {
  width: 100%;
  padding-left: 120px;
  font-size: 14px;
}</style>
