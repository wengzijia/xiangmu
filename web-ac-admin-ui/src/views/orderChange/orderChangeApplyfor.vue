<template>
  <div class="applyforContainer">
    <div class="headBox">
      <div class="title">变更文件图文内容</div>
      <div class="explainBox">
        <div class="explain">说明：变更大货订单PO单的印刷颜色、客户文件上的图案文字及图文尺寸位置等，与盒型结构无关的内容，不改变印刷方式，并且不影响其它工艺生产。</div>
        <div class="sampleBox">
          <div>举例：</div>
          <div class="content">
            <div>1）印刷:双面印刷;正面印刷颜色:多色_CMYK;反面印刷颜色:多色_CMYK; 改为 印刷:双面印刷;正面印刷颜色:单色_青色;反面印刷颜色:多色_CMYK;（不改变单双面印刷方式、不改变印刷有与无）
            </div>
            <div>2）客户文件上的图案、文字在当前盒型结构下，更换LOGO图案或主题表述文字，以及位置、尺寸等；（图文的大小位置改变不要影响其它工艺烫金工艺）</div>
          </div>
        </div>
      </div>
    </div>
    <el-form ref="ruleFormRef" :model="ruleForm" scroll-to-error label-width="140px" class="applyforForm" @submit.prevent>
      <el-form-item label="需要变更的订单号" prop="orderNo" :rules="{
        required: true, message: '请输入需要变更的订单号', trigger: 'blur'
      }">
        <el-input v-model="ruleForm.orderNo" type="text" style="width: 300px;" @input="orderChange" />
      </el-form-item>
      <el-form-item label="订单类型">
        <DictTag :value="ruleForm.orderType" :options="orderChange_order_type" />
      </el-form-item>
      <el-form-item label="订单来源">
        <DictTag :value="ruleForm.orderSource" :options="orderChange_order_source" />
      </el-form-item>
      <el-form-item label="需要变更的PO号" prop="checkedPos" :rules="{
        type: 'array', required: true, message: '请选择需要变更的PO号', trigger: 'change'
      }">
        <div class="posBox">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="checkAllPosChange">全部</el-checkbox>
          <el-checkbox-group v-model="ruleForm.checkedPos" @change="checkedPosChange" style="margin-left: 20px;">
            <el-checkbox v-for="item in ruleForm.poSns" :key="item.id" :label="item.poSn">{{
              item.poSn
            }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <template v-if="ruleForm.orderChangeApplyList.length > 0">
        <template v-for="(item, index) in ruleForm.orderChangeApplyList" :key="item.id">
          <el-form-item label="变更PO号">
            <div>{{ item.poSn }}</div>
          </el-form-item>
          <el-form-item label="变更类型" :prop="`orderChangeApplyList[${index}].updateCategoryId`" :rules="{
            required: true, message: '请选择变更类型', trigger: 'change'
          }">
            <el-checkbox-group v-model="item.updateCategoryId" @change="typeChange($event, index)">
              <el-checkbox v-for="zitem in item.postData" :key="zitem.id" :label="zitem.id">{{ zitem.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <template v-for="(item, zIndex) in item.typeHTData" :key="item.id">
            <el-form-item :label="item.name" :prop="`orderChangeApplyList[${index}].typeHTData[${zIndex}].remark`" :rules="{
              required: true, message: `请输入${item.name}说明`, trigger: 'blur'
            }">
              <el-input v-model="item.remark" maxlength="60" show-word-limit type="text"
                :placeholder="`请输入${item.name}说明`" style="width: 940px;" />
            </el-form-item>
          </template>
          <el-form-item label="选择印刷颜色">
            <div class="colorContainer">
              <div class="colorBox">
                <printColor v-model:attrInfo="item.attrInfo" v-show="false"></printColor>
                <div>{{ item.newAttrInfo.oldAttr }}</div>
                <div><span style="color:red;">编辑后</span> {{ item.newAttrInfo.newAttr }}</div>
              </div>
              <el-button class="editColor" v-if="item.attrInfo.goodsAttr.includes('印刷颜色:')" @click="editColor(index)">编辑颜色参数</el-button>
            </div>
            <div class="colorPopup">
              <el-dialog v-model="item.colorPopup" title="编辑颜色参数" width="46%" :show-close="false"
                :close-on-click-modal="false">
                <printColor v-model:attrInfo="item.attrInfo"></printColor>
                <template #footer>
                  <el-button size="large" class="confirmColor" @click="colorConfirm(index)">确认</el-button>
                  <el-button size="large" class="cancelColor" @click="colorCancel(item,index)">
                    取消
                  </el-button>
                </template>
              </el-dialog>
            </div>
          </el-form-item>
          <el-form-item label="上传客户文件">
            <div>
              <el-link :href="senseUrl(BASE_FILE_URL + item.fileUrl)" type="primary" :underline="false" target="_blank"
                v-if="item.fileUrl">原客户文件</el-link>
              <FileUpload :fileType="['pdf', 'ai', 'cdr', 'psd', 'eps', 'dxf', 'jpg', 'tiff', 'png', 'gif', 'zip']"
                :fileSize="500" :name="'重新上传'" replace down v-model:modelValue="item.file" class="uploadComponents" />
            </div>
          </el-form-item>
          <el-form-item label="变更详细说明">
            <Editor v-model:html="item.changeRemark" placeholder="请输入变更详细说明" class="editor"></Editor>
          </el-form-item>
        </template>
      </template>
      <el-form-item>
        <el-button class="instantSubmit" @click="submitForm(ruleFormRef)">
          立即提交
        </el-button>
        <el-button class="reset" @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
    <changePopup v-model:dialogVisible="dialogVisible" :changeHint="changeHint" @confirm="confirm" v-if="dialogVisible">
    </changePopup>
  </div>
</template>

<script setup>
// 域名
import { BASE_FILE_URL } from "@/store/global-constant";
import { ElMessage } from 'element-plus'
import { senseUrl } from "@/utils/index";
import { debounce } from "@/utils/form";
import printColor from '@/components/orderChange/printColor.vue';
import Editor from "@/components/Editor"
import changePopup from "./components/changePopup.vue"
import { getAllPoSn, validateOrder, childChangeCategory, submitChangeDetail, submitChange } from "@/api/orderChange/applyfor"
const { proxy } = getCurrentInstance();
const { orderChange_order_source, orderChange_order_type } = proxy.useDict("orderChange_order_source", "orderChange_order_type");
// 是否弹窗
let dialogVisible = ref(false);
// 变更信息提示
let changeHint = ref({
  type: '', // 类型  1 不可变更   2 变更费用信息
  title: '', // 标题
  hintData: [] // 提示数据
})
// 全选是否选中
const checkAll = ref(false)
// 全选不确定状态
const isIndeterminate = ref(true)
// 全选
let allElection = ref([])
const ruleFormRef = ref()
let ruleForm = ref({
  orderNo: '', // 订单号
  orderType: '', // 订单类型
  orderSource: '', // 订单来源
  poSns: [], // 需要变更的PO号
  checkedPos: [], // 选中的po
  orderChangeApplyList: [] // 展示填写的数据
})

// 确认参数
let confirmParam = ref({
  changeCategoryId: "14", // 变更类型
  orderChangeApplyList: []
})

// 获取变更类型
function getChangeType() {
  childChangeCategory('14').then(res => {
    console.log('res', res);
    if (res.code == '200') {
      ruleForm.value.poSns.forEach(item => {
        item.postData = res.data.map(item => ({
          id: item.id, // 变更类型id
          name: item.categoryName, // 变更类型
          remark: ""// 变更说明
        }))
      })
    }
  }).catch(err => {
    console.log('报错了', err);
  })
}

// 订单号改变事件(防抖)
const orderChange = debounce(() => {
  if (!ruleForm.value.orderNo) {
    reset(1)
    return
  }
  let param = {
    orderNo: ruleForm.value.orderNo
  }
  getAllPoSn(param).then(res => {
    if (res.code == '200') {
      reset(1)
      ruleForm.value.orderType = res.data.orderType
      ruleForm.value.orderSource = res.data.orderSource
      if (res.data.orderInfo?.length) {
        ruleForm.value.poSns = res.data.orderInfo
        ruleForm.value.poSns.forEach(item => {
          item.colorPopup = false, // 控制颜色弹窗
            // 旧商品参数
            item.attrInfo = {
              goodsAttr: item.goodsAttr,//商品原始属性
              isComplete: true,//判断专色是否填写完整
              oldAttr: '',//商品需要被替换的颜色属性的旧数据
              newAttr: ''//更新后的数据
            }
          // 新商品参数
          item.newAttrInfo = {
            goodsAttr: '',//编辑后颜色属性
            isComplete: true,//判断专色是否填写完整
            oldAttr: '',//商品需要被替换的颜色属性的旧数据
            newAttr: ''//更新后的数据
          }
          item.file = "", // 重新上传文件
            item.changeRemark = "", // 富文本编辑器内容
            item.updateCategoryId = [], // 类型绑定数据
            item.typeHTData = [], // 变更类型后台数据
            item.postData = [] // 变更类型渲染数据
        })
        getChangeType()
        console.log('ruleForm.value.poSns', ruleForm.value.poSns);
      }
    }
  }).catch(err => {
    console.log('报错了', err);
    reset()
  })
}, 500)

orderChange()

// 获取需要默认显示的数据
const allElectionFun = () => {
  allElection.value = [];
  for (var i = 0; i < ruleForm.value.poSns.length; i++) {
    allElection.value.push(ruleForm.value.poSns[i].poSn)
  }
}

// 获取选中的对象
const selectionFun = () => {
  ruleForm.value.orderChangeApplyList = [];
  // 处理选中的数据
  for (var i = 0; i < ruleForm.value.poSns.length; i++) {
    for (var j = 0; j < ruleForm.value.checkedPos.length; j++) {
      if (ruleForm.value.checkedPos[j] == ruleForm.value.poSns[i].poSn) {
        ruleForm.value.orderChangeApplyList.push(ruleForm.value.poSns[i])
      }
    }
  }
  // 组件处理数据可能会延迟,nextTick确保组件数据回来
  nextTick(() => {
    for (let i = 0; i < ruleForm.value.orderChangeApplyList.length; i++) {
      ruleForm.value.orderChangeApplyList[i].newAttrInfo.oldAttr = ruleForm.value.orderChangeApplyList[i].attrInfo.oldAttr
    }
  })
}


// 验证po是否可变更
const verifyPos = () => {
  let param = {
    changeCategoryId: 14,
    poSns: ruleForm.value.checkedPos
  }
  validateOrder(param).then(res => {
    if (res.code == '200') {
      // 可变更
      if (JSON.stringify(res.data) == "{}") {
        selectionFun()
      } else {
        // 不可变更
        // 对象处理 过滤掉po(取消选择)
        ruleForm.value.checkedPos = ruleForm.value.checkedPos.filter(item => !Object.keys(res.data).includes(item));
        console.log('ruleForm.value.checkedPos', ruleForm.value.checkedPos);
        checkAll.value = false
        isIndeterminate.value = true
        dialogVisible.value = true
        changeHint.value.type = "1"
        changeHint.value.title = "提示"
        changeHint.value.hintData = res.data
        console.log('changeHint.value.hintData', changeHint.value.hintData);
        // 可变需要选中
        selectionFun()
      }
    }
  }).catch(err => {
    console.log('报错了', err);
  })
}

// 全选po事件
const checkAllPosChange = (val) => {
  allElectionFun()
  ruleForm.value.checkedPos = val ? allElection.value : []
  isIndeterminate.value = false
  if (ruleForm.value.checkedPos.length) {
    verifyPos()
  } else {
    isIndeterminate.value = true
    ruleForm.value.orderChangeApplyList = [];
  }
}

// 选中po事件
const checkedPosChange = (value) => {
  if (ruleForm.value.checkedPos.length) {
    verifyPos()
    let checkedCount = ruleForm.value.checkedPos.length
    checkAll.value = checkedCount == ruleForm.value.poSns.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < ruleForm.value.poSns.length
  } else {
    checkAll.value = false
    isIndeterminate.value = true
    ruleForm.value.orderChangeApplyList = [];
  }
}

// 变更类型事件
const typeChange = (value, index) => {
  console.log('value', value, index);
  ruleForm.value.orderChangeApplyList[index].typeHTData = [];
  for (var i = 0; i < ruleForm.value.orderChangeApplyList[index].postData.length; i++) {
    for (var j = 0; j < value.length; j++) {
      if (value[j] === ruleForm.value.orderChangeApplyList[index].postData[i].id) {
        ruleForm.value.orderChangeApplyList[index].typeHTData.push(ruleForm.value.orderChangeApplyList[index].postData[i])
      }
    }
  }
}

// 排序
watch(() => ruleForm.value.orderChangeApplyList, (val) => {
  if (ruleForm.value.orderChangeApplyList?.length > 1) {
    ruleForm.value.orderChangeApplyList.sort((a, b) => a.recId - b.recId);
    ruleForm.value.orderChangeApplyList.forEach(item => {
      if (item.postData?.length > 1) {
        item.postData.sort((a, b) => a.id - b.id)
      }
    })
  }
}, { deep: true })

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      confirmParam.value.orderChangeApplyList = ruleForm.value.orderChangeApplyList.map(item => {
        return {
          poSn: item.poSn, // 修改PO
          postData: item.postData, // 变更类型数据
          updateCategoryId: item.updateCategoryId.toString(), // 变更类型id,多个用,隔开
          // 要修改的数据
          updateInfo: {
            file: item.file, // 编辑后的客户文件
            goodsAttr: item.newAttrInfo.goodsAttr // 编辑后的商品属性
          },
          changeRemark: item.changeRemark // 变更详细说明
        }
      })
      console.log('confirmParam.value', confirmParam.value);
      // 判断颜色是不是有改变,没有改变直接提交,不需要弹变更费用信息
      if (confirmParam.value.orderChangeApplyList.every(item => !item.updateInfo.goodsAttr)) {
        affirmChange()
        return
      }
      getCostMessage()
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 获取变更费用信息
function getCostMessage() {
  submitChangeDetail(confirmParam.value).then(res => {
    if (res.code == '200') {
      dialogVisible.value = true
      changeHint.value.type = "2"
      changeHint.value.title = "变更费用信息"
      changeHint.value.hintData = res.data
    }
  }).catch(err => {
    console.log('报错了', err);
  })
}

// 重置  订单号  0 清除  1 不清除
function reset(status) {
  if (status == 0) {
    ruleForm.value.orderNo = ''
  }
  ruleForm.value.orderType = ''
  ruleForm.value.orderSource = ''
  checkAll.value = false
  isIndeterminate.value = true
  allElection.value = []
  ruleForm.value.poSns = []
  ruleForm.value.checkedPos = []
  ruleForm.value.orderChangeApplyList = []
}

const resetForm = (formEl) => {
  if (!formEl) return
  reset(0)
}

// 编辑颜色参数
const editColor = (index) => {
  console.log('index', index);
  ruleForm.value.orderChangeApplyList[index].colorPopup = true
}

// 颜色确认
const colorConfirm = (index) => {
  if (!ruleForm.value.orderChangeApplyList[index].attrInfo.isComplete) {
    ElMessage.error('请填写PANTONE色号');
    return
  }
  ruleForm.value.orderChangeApplyList[index].newAttrInfo.goodsAttr = JSON.parse(JSON.stringify(ruleForm.value.orderChangeApplyList[index].attrInfo.goodsAttr));
  ruleForm.value.orderChangeApplyList[index].newAttrInfo.isComplete = JSON.parse(JSON.stringify(ruleForm.value.orderChangeApplyList[index].attrInfo.isComplete));
  ruleForm.value.orderChangeApplyList[index].newAttrInfo.newAttr = JSON.parse(JSON.stringify(ruleForm.value.orderChangeApplyList[index].attrInfo.newAttr));
  ruleForm.value.orderChangeApplyList[index].colorPopup = false
}

// 颜色取消
const colorCancel = (item,index) => {
  console.log('item',item);
  // 判断参数是否有改变
  if(item.newAttrInfo.goodsAttr){
    // 有改变  使用新参数回显
    ruleForm.value.orderChangeApplyList[index].attrInfo.goodsAttr = item.newAttrInfo.goodsAttr
  }else{
    // 没有改变  使用旧参数回显
    ruleForm.value.orderChangeApplyList[index].attrInfo.goodsAttr = item.goodsAttr
  }
  ruleForm.value.orderChangeApplyList[index].colorPopup = false
}

// 确认变更
function affirmChange() {
  proxy.$modal.loading('提交中，请稍候...')
  submitChange(confirmParam.value).then(res => {
    if (res.code == '200') {
      ElMessage.success(res.data)
      // window.location.href = `${window.origin}/admin/new_order_change/index.html`
      window.parent.postMessage({
        cmd: 'break',
        params: {
          url: `${window.origin}/admin/new_order_change/index.html`
        }
      }, '*');
    }
  }).catch(err => {
    console.log('报错了', err);
  }).finally(() => {
    proxy.$modal.closeLoading()
  })
}

// 确认提交
const confirm = () => {
  affirmChange()
}
</script>
<!-- <style lang="scss">
.typeSelect,.dictSelect,.spotColorSelect {
  .el-select-dropdown__item.selected {
    color: $bgColor !important;
  }
}
</style> -->
<style lang="scss" scoped>
// :deep(.el-input__wrapper.is-focus) {
//   box-shadow: 0 0 0 1px $bgColor inset !important;
// }

// :deep(.el-select .el-input.is-focus .el-input__wrapper) {
//   box-shadow: 0 0 0 1px $bgColor inset !important;
// }

// :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
//   background-color: $bgColor !important;
//   border-color: none !important;
// }

// :deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
//   background-color: $bgColor !important;
//   border-color: none !important;
// }

// :deep(.el-checkbox__input.is-checked+.el-checkbox__label) {
//   color: $bgColor !important;
// }

.applyforContainer {
  padding: 20px;

  .headBox {
    .title {
      font-weight: 700;
    }

    .explainBox {
      background-color: #fef7ec;
      margin-top: 10px;

      .sampleBox {
        display: flex;
      }
    }
  }

  .applyforForm {
    margin-top: 20px;

    &:deep(.el-form-item__label) {
      color: #333;
      font-weight: 700;
    }

    .posBox {
      display: flex;
    }

    .colorContainer {
      display: flex;
      background-color: #f2f2f2;
      padding: 20px 10px;

      .editColor {
        background-color: $bgColor;
        color: $color;
        border: $borColor;
      }
    }

    .colorPopup {
      &:deep(.el-dialog) {
        min-width: 880px;
      }

      &:deep(.el-dialog__body) {
        padding-top: 0 !important;
      }

      &:deep(.el-dialog__footer) {
        text-align: center;
      }

      &:deep(.el-checkbox__input.is-checked+.el-checkbox__label) {
        color: #333333 !important;
      }

      .confirmColor {
        background-color: $bgColor;
        color: $color;
        border: $borColor;
      }

      .cancelColor:focus,
      .cancelColor:hover {
        background-color: transparent !important;
        color: #606266 !important;
        border: 1px solid $bgColor !important;
      }
    }

    .uploadComponents {
      &:deep(.el-upload) {

        .el-button:focus,
        .el-button:hover {
          background-color: transparent !important;
          color: #606266 !important;
          border: 1px solid $bgColor !important;
        }
      }
    }

    .editor {
      width: 1000px;

      &:deep(.w-e-text-placeholder) {
        margin-top: -6px;
      }
    }

    .instantSubmit {
      background-color: $bgColor;
      color: $color;
      border: $borColor;
    }

    .reset:focus,
    .reset:hover {
      background-color: transparent !important;
      color: #606266 !important;
      border: 1px solid $bgColor !important;
    }
  }
}
</style>