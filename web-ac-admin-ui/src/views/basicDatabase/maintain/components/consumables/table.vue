<template>
  <div>
    <div style="margin-top: 20px;">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline" ref="queryRef">
        <el-form-item label="耗材编码:" prop="consumablesNo">
          <el-input style="width:200px;" type="text" clearable placeholder="请输入耗材编码" v-model="queryParams.consumablesNo"></el-input>
        </el-form-item>
        <el-form-item label="耗材类别:" prop="consumablesTypeId">
          <el-select style="width:200px;" v-model="queryParams.consumablesTypeId" class="m-2" placeholder="请选择耗材类别" clearable @change="GetConsumablesTypeList">
            <el-option v-for="item in ConsumablesTypeList" :key="item.id" :label="item.consumablesTypeName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="耗材名称:" prop="consumablesName">
          <el-input style="width:200px;" type="text" clearable placeholder="请输入耗材名称" v-model="queryParams.consumablesName"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
        </el-form-item> -->
      </el-form>
      <div class="form-tool-bar">
        <div style="min-width:160px;width:160px;">
          <el-button @click="resetQuery">重置</el-button>
          <el-button type="primary" @click="handleQuery">搜索</el-button>
        </div>
      </div>
    </div>
    <el-card style="margin-top:42px" shadow="never">
      <div class="title">
        <div>耗材信息表</div>
        <div>
          <el-button @click="exportForm">导出列表</el-button>
          <el-button @click="addConsumables" v-hasPermi="['maintain:add']">新增耗材</el-button>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="consumablesNo" label="耗材编码" >
          <template #default="scope">
            <div v-if="!scope.row.consumablesNo&&scope.row.consumablesNo!==0">-</div>
            <span v-else>{{scope.row.consumablesNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="consumablesName" label="耗材名称" :show-overflow-tooltip="true">
          <template #default="scope">
            <div v-if="!scope.row.consumablesName&&scope.row.consumablesName!==0">-</div>
            <span v-else>{{scope.row.consumablesName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="consumablesTypeName" label="耗材类别" :show-overflow-tooltip="true">
          <template #default="scope">
            <div v-if="!scope.row.consumablesTypeName&&scope.row.consumablesTypeName!==0">-</div>
            <span v-else>{{scope.row.consumablesTypeName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="spec" label="耗材规格" :show-overflow-tooltip="true">
          <template #default="scope">
            <div v-if="!scope.row.spec&&scope.row.spec!==0">-</div>
            <span v-else>{{scope.row.spec}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="priceUnit" label="计价单位" :show-overflow-tooltip="true">
          <template #default="scope">
            <div v-if="!scope.row.priceUnit&&scope.row.priceUnit!==0">-</div>
            <span v-else>{{scope.row.priceUnit}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="scope">
            <el-link type="primary"  :underline="false" class="mar_10" @click="Drawer(scope.row,'edit')" v-hasPermi="['maintain:change']">编辑</el-link>
            <el-link type="primary"  :underline="false"  @click="handDelete(scope.row)" v-hasPermi="['maintain:del']">删除</el-link>
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <el-button size="small">
                  <el-icon>
                    <More />
                  </el-icon>
                </el-button>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="Drawer(scope.row,'copy')">复制</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="是否申请删除该行信息?" v-model="deleteOpen" width="500px" append-to-body>
      <div>审批通过之前，信息不会删除。</div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel()">取 消</el-button>
          <el-button type="primary" @click="DeleteSubmit">提交审批</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { getConsumables, delConsumables } from "@/api/basicDatabase";
import { download } from "@/utils/request";
import { ElMessage, ElMessageBox } from 'element-plus'
import { GetConsumablesTypeList } from "../getList";
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 20,
  },
});
const emit = defineEmits();
const ConsumablesTypeList = ref([]);
const deleteOpen = ref(false);
const dropdown = ref(false);
const loading = ref(true)
const tableData = ref([])
let delId = ref('');
const data = reactive({
  queryParams: {},
});
const { queryParams } = toRefs(data);
const { currentPage, pageSize} = toRefs(props);
watch([currentPage, pageSize],([currentPageVal,pageSizeVal])=>{
  getList()
})
//搜索
function handleQuery() {
  emit("ChangeOption");
  getList();
}
const { proxy } = getCurrentInstance();
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
getList();
function getList() {
  getConsumables({
    size: props.pageSize,
    current: props.currentPage,
    consumablesName: queryParams.value.consumablesName,
    consumablesTypeId: queryParams.value.consumablesTypeId,
    consumablesNo: queryParams.value.consumablesNo,
  }).then((res) => {
    if (res.code === 200) {
      let arr = res.data.records;
      emit("setTotal", res.data.total);
      // for (let i = 0; i < arr.length; i++) {
      //   for (let key in arr[i]) {
      //     if (!arr[i][key]) {
      //       arr[i][key] = "-";
      //     }
      //   }
      // }
      tableData.value = arr;
    }
    loading.value = false
  });
}
function handDelete(data) {
  if (data.auditing) {
    ElMessage({
      type: 'warning',
      message: '本条数据有未审批完的申请，需审批后才能二次编辑',
    })
    return
  }
  delId.value = data.id
  deleteOpen.value = true;
}
//删除耗材
function DeleteSubmit() {
  delConsumables(delId.value).then(res=>{
    if (res.code===200) {
      ElMessage({
        type: 'success',
        message: '提交成功',
      })
    }
  })
  deleteOpen.value = false;
}
function cancel() {
  deleteOpen.value = false;
}
function Drawer(data, type) {
  if (type=='edit'&&data.auditing) {
    ElMessage({
      type: 'warning',
      message: '本条数据有未审批完的申请，需审批后才能二次编辑',
    })
    return
  }
  emit('showDrawer', { data, type })
}
function addConsumables(){
  emit('showDrawer', { data:{}, type:'add' })
}
getConsumablesTypeList();
//获得所有耗材类别
async function getConsumablesTypeList() {
  ConsumablesTypeList.value = await GetConsumablesTypeList();
}
function exportForm(){
  let data = {
    consumablesName: queryParams.value.consumablesName,
    consumablesTypeId: queryParams.value.consumablesTypeId,
    consumablesNo: queryParams.value.consumablesNo,
  }
  download('/base-data/base-consumables/export',data,'耗材信息表.xlsx')
}
</script>

<style scoped>
@import "../index.css";
:deep(.el-popper){
  max-width:300px;
  word-break: break-all;
}
</style>