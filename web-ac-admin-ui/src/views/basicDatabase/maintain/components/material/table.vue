<template>
  <div>
    <div style="margin-top: 20px;">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline" ref="queryRef">
        <el-form-item label="物料编码:" prop="materialInfoNo">
          <el-input style="width:200px;" v-model="queryParams.materialInfoNo" type="text" clearable placeholder="请输入物料编码"></el-input>
        </el-form-item>
        <el-form-item label="材质类别:" prop="materialTypeId">
          <el-select style="width:200px;" v-model="queryParams.materialTypeId" class="m-2" placeholder="请选择材质类别" clearable
            @change="getMaterialSubclassList">
            <el-option v-for="item in MaterialTypeList" :key="item.id" :label="item.materialTypeName"
              :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="材质小类:" prop="materialSubclassId">
          <el-select style="width:200px;" v-model="queryParams.materialSubclassId" class="m-2" placeholder="请选择材质小类" clearable>
            <el-option v-for="item in MaterialSubclassList" :key="item.id" :label="item.materialSubclassName"
              :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="材质规格名称:" prop="materialSpecName" >
          <el-input style="width:200px;" v-model="queryParams.materialSpecName" type="text" clearable placeholder="请输入材质规格名称"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-button @click="resetQuery()">重置</el-button>
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
        <div>物料信息表</div>
        <div>
          <el-button @click="exportForm">导出列表</el-button>
          <el-button  @click="addMaterial" v-hasPermi="['maintain:add']">新增物料</el-button>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="materialInfoNo" label="物料编码" width="150px"/>
        <el-table-column prop="materialInfoName" label="物料名称"  width="160px" :show-overflow-tooltip="true">
          <template #default="scope">
            <span v-if="!scope.row.materialInfoName&&scope.row.materialInfoName!==0">-</span>
            <span v-else>{{scope.row.materialInfoName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="materialSpecName" label="材质规格名称"  width="120px" :show-overflow-tooltip="true">
          <template #default="scope">
            <span v-if="!scope.row.materialSpecName&&scope.row.materialSpecName!==0">-</span>
            <span v-else>{{scope.row.materialSpecName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="materialTypeName" label="材质类别" width="120px"/>
        <el-table-column prop="materialSubclassName" label="材质小类" width="120px"/>
        <el-table-column prop="brand" label="纸品牌" width="180px" :show-overflow-tooltip="true">
        <template #default="scope">
            <span v-if="!scope.row.brand&&scope.row.brand!==0">-</span>
            <span v-else>{{scope.row.brand}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stiffness" label="挺度"  :show-overflow-tooltip="true">
        <template #default="scope">
            <span v-if="!scope.row.stiffness&&scope.row.stiffness!==0">-</span>
            <span v-else>{{scope.row.stiffness}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="waterContent" label="含水量"  :show-overflow-tooltip="true">
        <template #default="scope">
            <span v-if="!scope.row.waterContent&&scope.row.waterContent!==0">-</span>
            <span v-else>{{scope.row.waterContent}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="paperWhiteness" label="纸白度"  :show-overflow-tooltip="true">
        <template #default="scope">
            <span v-if="!scope.row.paperWhiteness&&scope.row.paperWhiteness!==0">-</span>
            <span v-else>{{scope.row.paperWhiteness}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="compressiveStrength" label="抗压强度"  :show-overflow-tooltip="true">
          <template #default="scope">
            <span v-if="!scope.row.compressiveStrength&&scope.row.compressiveStrength!==0">-</span>
            <span v-else>{{scope.row.compressiveStrength}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="priceUnit" label="计价单位"  :show-overflow-tooltip="true">
        <template #default="scope">
            <span v-if="!scope.row.priceUnit&&scope.row.priceUnit!==0">-</span>
            <span v-else>{{scope.row.priceUnit}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="scope">
            <el-link type="primary" :underline="false" class="mar_10" @click="Drawer(scope.row,'edit')" v-hasPermi="['maintain:change']">编辑</el-link>
            <el-link type="primary" :underline="false" @click="handDelete(scope.row)" v-hasPermi="['maintain:change']">删除</el-link>
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
import { getMaterialInfo, delMaterial} from '@/api/basicDatabase';
import { ElMessage, ElMessageBox } from 'element-plus'
import { GetMaterialTypeList, GetMaterialSubclassList } from '../getList'
import { download } from '@/utils/request';
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
const MaterialTypeList = ref([])
const MaterialSubclassList = ref([])
const deleteOpen = ref(false);
const dropdown = ref(false);
const tableData = ref([]);
let delId = ref('');
const data = reactive({
  queryParams: {
  },
});
const { queryParams, } =
  toRefs(data);
const { currentPage, pageSize} = toRefs(props);
watch([currentPage, pageSize],([currentPageVal,pageSizeVal])=>{
  getList()
})
//搜索
function handleQuery() {
  emit('ChangeOption')
  getList()
}
const { proxy } = getCurrentInstance();
/** 重置按钮操作 */
function resetQuery() {
  MaterialSubclassList.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}
const loading = ref(false)
function getList() {
  loading.value = true
  getMaterialInfo({
    size: props.pageSize,
    current: props.currentPage,
    materialTypeId: queryParams.value.materialTypeId,
    materialSubclassId: queryParams.value.materialSubclassId==''?undefined:queryParams.value.materialSubclassId,
    materialSpecName: queryParams.value.materialSpecName,
    materialInfoNo: queryParams.value.materialInfoNo
  }).then(res => {
    if (res.code === 200) {
      let arr = res.data.records
      emit('setTotal', res.data.total)
      // for (let i = 0; i < arr.length; i++) {
      //   for (let key in arr[i]) {
      //     if (!arr[i][key]) {
      //       arr[i][key] = '-'
      //     }
      //   }
      // }
      tableData.value = arr
    }
  }).finally(()=>{
    loading.value = false
  })
}
getList()
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
function DeleteSubmit() {
  delMaterial(delId.value).then(res=>{
    if (res.code===200) {
      ElMessage({
        type: 'success',
        message: '提交成功',
      })
    }
  })
  deleteOpen.value = false
}
function cancel() {
  deleteOpen.value = false
}
function showClick() {
  dropdown.value.handleOpen()
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
function addMaterial(){
  emit('showDrawer', { data:{}, type:'add' })
}
//获得所有材质类别
async function getMaterialTypeList() {
  MaterialTypeList.value = await GetMaterialTypeList()
}
getMaterialTypeList()
//获得材质小类集合
async function getMaterialSubclassList() {
  queryParams.value.materialSubclassId = '';
  MaterialSubclassList.value = await GetMaterialSubclassList(queryParams.value.materialTypeId)
}
function exportForm(){
  let data = {
    materialTypeId: queryParams.value.materialTypeId,
    materialSubclassId: queryParams.value.materialSubclassId==''?undefined:queryParams.value.materialSubclassId,
    materialSpecName: queryParams.value.materialSpecName,
    materialInfoNo: queryParams.value.materialInfoNo
  }
  download('/base-data/base-material-info/export',data,'物料信息表.xlsx')
}
</script>

<style scoped>
@import '../index.css';
:deep(.el-popper){
  max-width:300px;
  word-break: break-all;
}
</style>