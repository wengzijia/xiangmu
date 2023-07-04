<template>
  <div>
    <el-drawer v-model="innerDrawer" title="选择品类" :append-to-body="true" size="580px" destroy-on-close :before-close="handleClose">
      <div>
        <ul class="categorys" v-if="categoryList.length > 0">
          <li v-for="(item, index) in categoryList" :key="index">
            <selectPack 
            v-if="item" 
            :data="item" 
            :index="index" 
            :orderType="orderType" 
            :disabledList="disabledList" 
            :packCategoryList="oneCategoryList" 
            @deleteCategory="deleteCategory" />
          </li>
        </ul>
        <el-button class="newCategory" @click="newCategory">新增品类</el-button>
      </div>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="allCancel">取消</el-button>
          <el-button type="primary" @click="saveClick()">保存</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { getAllVoList } from '@/api/orderManagement/category'
import { getFileName } from '@/utils/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import selectPack from './selectPack.vue'

const { proxy } = getCurrentInstance()
const data = reactive({
  innerDrawer: false,
  categoryList: [], //品类
  oneCategoryList: [],
})
const { innerDrawer, categoryList, oneCategoryList, } = toRefs(data)
const emits = defineEmits()
const props = defineProps({
  orderType: {
    type: String,
    default: '',
  },
  formList:{
    type:Array,
    default: []
  }
})
const disabledList = computed(()=>{
  if(categoryList.value.length){
    return categoryList.value.map(e => e.goodsId)
  }
  return []
})

const getAllVoListFn = () => {
  getAllVoList({ status: 1 }).then((res) => {
    oneCategoryList.value = res.data
  })
}
getAllVoListFn()
// 新增品类
const newCategory = () => {
  const obj = {
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
}
  categoryList.value.push(obj)

}

// 删除品类
const deleteCategory = (index) => {
  categoryList.value.splice(index, 1)
}

const allCancel = () => {
  let flag = categoryList.value.every((e) => !e.isCategoryEdit)
  if (!flag){
    ElMessage({
      message: '品类未全部确认！',
      type: 'error',
    })
    return
  }
  categoryList.value = []
  innerDrawer.value = false
}
// 保存
const saveClick = () => {
  categoryList.value.map((item, index) => {
    item.sortIndex = index
  })
  //检查重名文件
  let urlList =  categoryList.value.map(item=>{
    return getFileName(item.designFileUrl||item.designRequirementAttachment)
  })
  urlList = urlList.filter(a=>a)
  if (urlList.length&&(urlList.length != [...new Set(urlList)].length)) {
    ElMessage.error('存在相同文件名，请更换文件名称重试。')
    return
  }
  //检查是否全部确认
  let flag = categoryList.value.every((e) => !e.isCategoryEdit)
  if (flag) {
    innerDrawer.value = false
    emits('getCategoryList')
    ElMessage({
      message: '保存成功！',
      type: 'success',
    })
  } else {
    ElMessage({
      message: '品类未全部确认！',
      type: 'error',
    })
  }
}
const handleClose = (done) => {
  let flag = categoryList.value.every((e) => !e.isCategoryEdit)
  if (!flag){
    ElMessage({
      message: '品类未全部确认！',
      type: 'error',
    })
    return
  }else{
    done()
    innerDrawer.value = false
  }
}
const handleOpen = () => {
  if (props.formList.length) {
    categoryList.value = props.formList
  }
  innerDrawer.value = true
}
defineExpose({
  handleOpen,
  categoryList,
  innerDrawer,
})
</script>

<style scoped>
ul,
li {
  list-style: none;
}

p {
  margin: 0;
  padding: 0;
}

.categorys {
  padding-left: 20px;
}

.categorys li .alignRight {
  display: inline-block;
  width: 100px;
  text-align: right;
}

.categorys li {
  width: 510px;
  border: 1px solid #ddd;
  background: #f3f3f3;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 10px;
}

.cateHead {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  font-size: 18px;
  padding: 10px;
}

.elicons {
  color: #7f7f7f;
  margin-right: 10px;
  cursor: pointer;
}

.newCategory {
  width: 500px;
  margin-left: 20px;
  height: 40px;
}

.selectOption {
  width: 423px;
  display: flex;
  justify-content: space-between;
}
</style>
