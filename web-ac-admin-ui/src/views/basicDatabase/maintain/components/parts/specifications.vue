<template>
  <div>
    <div>
      <div class="table-head">
        <div>配件规格编号</div>
        <div>可选规格</div>
        <div>可选颜色</div>
        <div>重量</div>
        <div>操作</div>
      </div>
      <div class="table-body" v-for="(scope,index) in tableData" :key="scope.id">
        <div v-if="editIndex!==index">{{scope.accessorySpecNo}}</div>
        <div>
          <div v-if="editIndex==index">
            <el-input v-model.trim="form.spec" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" maxlength="50" show-word-limit placeholder="请输入规格" style="width:154px" />
          </div>
          <div v-else>{{!scope.spec&&scope.spec!==0?'-':scope.spec}}</div>
        </div>
        <div>
          <div v-if="editIndex==index">
            <el-input v-model.trim="form.color" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" maxlength="50" show-word-limit placeholder="请输入颜色" style="width:154px"/>
          </div>
          <div v-else>{{!scope.color&&scope.color!==0?'-':scope.color}}</div>
        </div>
        <div>
          <div v-if="editIndex==index">
            <el-input v-model.trim="form.weight" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" maxlength="50" show-word-limit placeholder="请输入重量" style="width:154px"/>
          </div>
          <div v-else>{{!scope.weight&&scope.weight!==0?'-':scope.weight}}</div>
        </div>
        <div>
            <div v-if="editIndex==index">
              <el-link type="primary" :underline="false" @click="closeChanges">取消</el-link>
              <el-link type="primary" :underline="false" @click="confirm">提交审批</el-link>
            </div>
            <div v-else  v-hasPermi="['maintain:change']">
              <el-link type="primary" :underline="false" @click="del(scope)">删除</el-link>
              <el-link type="primary" :underline="false" @click="elitTable(scope,index)">编辑</el-link>
            </div>
        </div>
      </div>
    </div>
    <div v-hasPermi="['maintain:add']" class="add-bar">
      <div v-if="editIndex>tableData.length"><el-button type="primary" @click="addSpec">+新增规格</el-button></div>
    </div>
  </div>
</template>
  
<script setup>
import { toRefs } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAccessorySpecs, addAccessorySpecs, changeAccessorySpecs, delAccessorySpecs  } from '@/api/basicDatabase'

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
})
const emit = defineEmits();
const { id } = toRefs(props)
if (id.value) {
  GetSpecsList(id.value)
}
watch(id,(val)=>{
  GetSpecsList(val)
})
const tableData = ref([])
const editIndex = ref(999)
const data = reactive({
  form: {
    color: '',
    weight: ''
  }
})
const { form } = toRefs(data)
function GetSpecsList(id) {
  getAccessorySpecs(id).then((res) => {
    if (res.code === 200) {
      tableData.value = res.data
    } 
  });
}
function elitTable(scope,i) {
  if (scope.auditing) {
    ElMessage({
      type: 'warning',
      message: '本条数据有未审批完的申请，需审批后才能二次编辑',
    })
    return
  }
  form.value.color = scope?.color || ''
  form.value.weight = scope?.weight || ''
  form.value.spec = scope?.spec || ''
  form.value.id = scope?.id
  editIndex.value = i
}
function confirm() {
  ElMessageBox.confirm(
    '操作立即生效，是否继续？',
    '确定提交审核吗？',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    let data = {}
    if (form.value.id) {
      data.id = form.value.id;
      data.color = form.value.color;
      data.weight = form.value.weight;
      data.spec = form.value.spec;
      changeAccessorySpecs(data).then(res => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: '提交成功',
          })
        }
      }).finally(()=>{
        emit('closeDrawer')
      })
    } else {
      data.accessoryId = id.value;
      data.color = form.value.color;
      data.weight = form.value.weight;
      data.spec = form.value.spec;
      addAccessorySpecs(data).then(res => {
        if (res.code === 200) {
          ElMessage({
            type: 'success',
            message: '提交成功',
          })
        }
      })
      editIndex.value = 999
    }
  }).finally(()=>{
    emit('closeDrawer')
  })
}
function del(scope) {
  if (scope.auditing) {
    ElMessage({
      type: 'warning',
      message: '本条数据有未审批完的申请，需审批后才能二次编辑',
    })
    return
  }
  ElMessageBox.confirm(
    '操作立即生效，是否继续？',
    '确定提交审核吗？',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'error',
    }
  ).then(() => {
    delAccessorySpecs(scope.id).then(res => {
      if (res.code === 200) {
        ElMessage({
          type: 'success',
          message: '提交成功',
        })
      }
      editIndex.value = 999
    }).finally(()=>{
      emit('closeDrawer')
    })
  }).catch(()=>{})
}
function closeChanges(){
  ElMessageBox.confirm(
    '退出后，已编辑的内容不会被保存。',
    '确定退出编辑吗？',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(()=>{
    cancelChange()
  })
  .catch(()=>{})
}
function cancelChange() {
  if (!form.value.id) {
    let arr = tableData.value
    arr.splice(-1,1)
    tableData.value = arr
  }
  editIndex.value = 999
  form.value = {}
}
function addSpec(){
  if (editIndex.value < tableData.value.length) {
    cancelChange()
  }
  tableData.value.push({})
  editIndex.value = tableData.value.length-1
}
</script>
<style lang="scss" scoped>
  .add-bar{
    margin-top: 10px;
    width: 100%;
    text-align: center;
  }
  .mar_10{
    margin-right: 10px;
  }
  .table-body,.table-head{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #9093992d;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    font-size: 14px;
  }
  .table-head{
    background-color:#ebebeb;
    font-weight: 600;
  }
  .table-body{
    color: #606266;
  }
  .table-body>div,.table-head>div{
    padding: 6px 10px;
    margin: 8px 0;
    width: 120px;
    word-break: break-all;
  }
  .el-link {
    margin-right: 8px;
  }
  .overflow-tooltip{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
  