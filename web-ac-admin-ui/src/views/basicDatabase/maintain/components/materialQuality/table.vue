<template>
  <div>
    <div style="margin-top: 20px;">
      <el-form :inline="true" :model="queryParams" ref="queryRef" class="demo-form-inline">
        <el-form-item label="材质名称:" prop="materialName">
          <el-input style="width:200px;" v-model="queryParams.materialName" type="text" clearable placeholder="请输入材质名称"></el-input>
        </el-form-item>
        <el-form-item label="材质类别:" prop="materialTypeId">
          <el-select v-model="queryParams.materialTypeId" class="m-2" placeholder="请选择材质类别" clearable @change="getMaterialSubclassList">
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
        <el-form-item label="材质编码:" prop="materialNo">
          <el-input style="width:200px;" v-model="queryParams.materialNo" type="text" clearable placeholder="请输入材质编码"></el-input>
        </el-form-item>
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
        <div>材质信息表</div>
        <div>
          <el-button @click="exportForm">导出列表</el-button>
          <el-button @click="addMaterialQuality" v-hasPermi="['maintain:add']">新增材质</el-button>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column label="材质编号" >
          <template #default="scope">
            <div v-if="!scope.row.materialNo&&scope.row.materialNo!==0">-</div>
            <span v-else>{{scope.row.materialNo}}</span>
          </template>
        </el-table-column>
        <el-table-column label="材质名称"  :show-overflow-tooltip="true">
          <template #default="scope">
            <div v-if="!scope.row.materialName&&scope.row.materialName!==0">-</div>
            <span v-else>{{scope.row.materialName}}</span>
            <!-- <TableTooltip :content="scope.row.materialName"/> -->
          </template>
        </el-table-column>
        <el-table-column label="材质类别"  :show-overflow-tooltip="true">
          <template #default="scope">
            <div v-if="!scope.row.materialTypeName&&scope.row.materialTypeName!==0">-</div>
            <span v-else>{{scope.row.materialTypeName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="材质小类" :show-overflow-tooltip="true">
          <template #default="scope">
            <div v-if="!scope.row.materialSubclassName&&scope.row.materialSubclassName!==0">-</div>
            <span v-else>{{scope.row.materialSubclassName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="克重"  :show-overflow-tooltip="true">
          <template #default="scope">
            <span v-if="!scope.row.weight&&scope.row.weight!==0">-</span>
            <span v-else>{{scope.row.weight}}</span>
          <!-- <TableTooltip :content="scope.row.weight"/> -->
            <!-- <el-tooltip
              v-if="scope.row.weight.length>15"
              class="box-item"
              effect="dark"
              placement="top"
            >
              <template #content>
                <div style="max-width:400px">
                  {{scope.row.weight}}
                </div>
              </template>
              <div class="overflow-tooltip">{{scope.row.weight}}</div>
            </el-tooltip>
            <div v-else>
              <div v-if="!scope.row.weight&&scope.row.weight!==0">-</div>
              <div v-else class="overflow-tooltip">{{scope.row.weight}}</div>
            </div> -->
          </template>
        </el-table-column>
        <el-table-column label="厚度(毫米)" width="180"  :show-overflow-tooltip="true">
          <template #default="scope">
            <div v-if="!scope.row.thickness&&scope.row.thickness!==0">-</div>
            <span v-else>{{scope.row.thickness}}</span>
            <!-- <TableTooltip :content="scope.row.thickness"/> -->
            <!-- <el-tooltip
              v-if="scope.row.thickness.length>15"
              class="box-item"
              effect="dark"
              placement="top-start"
            >
              <template #content>
                <div style="max-width:400px">
                  {{scope.row.thickness}}
                </div>
              </template>
              <div class="overflow-tooltip">{{scope.row.thickness}}</div>
            </el-tooltip>
            <div v-else>
              <div v-if="!scope.row.thickness&&scope.row.thickness!==0" >-</div>
              <div v-else class="overflow-tooltip">{{scope.row.thickness}}</div>
            </div> -->
          </template>
        </el-table-column>
        <el-table-column label="计价方式" :show-overflow-tooltip="true">
          <template #default="scope">
            <!-- <TableTooltip :content="scope.row.priceMethod"/> -->
            <div v-if="!scope.row.priceMethod&&scope.row.priceMethod!==0">-</div>
            <span v-else>{{scope.row.priceMethod}}</span>
          </template>
        </el-table-column>
        <el-table-column label="计价单位" :show-overflow-tooltip="true">
          <template #default="scope">
            <!-- <TableTooltip :content="scope.row.priceUnit"/> -->
            <div v-if="!scope.row.priceUnit&&scope.row.priceUnit!==0">-</div>
            <span v-else>{{scope.row.priceUnit}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="scope">
            <el-link type="primary" :underline="false" class="mar_10" @click="Drawer(scope.row,'edit')" v-hasPermi="['maintain:change']">编辑</el-link>
            <el-link type="primary" :underline="false" @click="handDelete(scope.row)" v-hasPermi="['maintain:del']">删除</el-link>
            <el-dropdown trigger="click" @command="(e)=>{Drawer(scope.row,e)}">
              <span class="el-dropdown-link">
                <el-button size="small">
                  <el-icon>
                    <More />
                  </el-icon>
                </el-button>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="item in editBtnList" :key="item.type" :command="item.type" >{{item.name}}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <!-- <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <el-button size="small">
                  <el-icon>
                    <More />
                  </el-icon>
                </el-button>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="Drawer(scope.row,'view')">更多信息</el-dropdown-item>
                  <el-dropdown-item @click="Drawer(scope.row,'copy')">复制</el-dropdown-item>
                  <el-dropdown-item @click="Drawer(scope.row,'subedit')">规格管理</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown> -->
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMaterialQuality,delMaterialQuality } from '@/api/basicDatabase';
import {GetMaterialTypeList,GetMaterialSubclassList} from '../getList';
import { checkPermi } from "@/utils/permission";
import { download } from '@/utils/request';
// import TableTooltip from '@/components/TableTooltip'
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
let editBtnList = ref([
  {
    type:'view',
    name:"更多信息"
  },
  {
    type:'copy',
    name:"复制"
  },
  {
    type:'subedit',
    name:"规格管理"
  }
 
]).value.filter(e =>{
  return e.type!='copy'||checkPermi(['maintain:add'])
});
const { proxy } = getCurrentInstance();
const emit = defineEmits();
const deleteOpen = ref(false);
const MaterialTypeList = ref([])
const MaterialSubclassList = ref([])
const tableData = ref([])
let delId = ref('')
const data = reactive({
  queryParams: {
    materialName: null,//材质名称
    materialTypeId: null,//材质类别ID
    materialSubclassId: null,//材质小类ID
    materialNo: null,//材质编号
  },
});
const { queryParams, } = toRefs(data);
const { currentPage, pageSize} = toRefs(props);
watch([currentPage, pageSize],([currentPageVal,pageSizeVal])=>{
  getList()
})
//搜索
function handleQuery() {
  emit('ChangeOption')
  getList()
}
/** 重置按钮操作 */
function resetQuery() {
  MaterialSubclassList.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}
const loading = ref(false)
/**
 * 获取材质信息列表
 */
function getList() {
  loading.value = true
  getMaterialQuality({
    size: props.pageSize,
    current: props.currentPage,
    materialName: queryParams.value.materialName,
    materialTypeId: queryParams.value.materialTypeId,
    materialSubclassId: queryParams.value.materialSubclassId==''?undefined:queryParams.value.materialSubclassId,
    materialNo: queryParams.value.materialNo,
  }).then(res => {
    if (res.code === 200) {
      let arr = null
      emit('setTotal', res.data.total)
      arr = res.data.records.map(a => {
        let weightArr = []
        let thicknessArr = []
        try {
          if (a.materialSpecsList) {
            a.materialSpecsList.map(item => {
              if (item.weight) {
                weightArr.push(item.weight)
              }
              if (item.thickness) {
                thicknessArr.push(item.thickness)
              }
              // if (item.auditing) {
              //   a.auditing = true
              // }
            })
          }
        } catch (error) {
          console.log('遍历克重和厚度失败', error);
        }
        a.weight = weightArr.join('/')
        a.thickness = thicknessArr.join('/')
        return a
      })
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
  DeleteSubmit()
  // deleteOpen.value = true;
}
//删除材质
function DeleteSubmit() {
  ElMessageBox.confirm(
    '删除材质将删除材质下的所有规格，并同步删除引用此材质及其规格的物料信息。',
    '是否继续？',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    delMaterialQuality(delId.value).then(res=>{
      if (res.code===200) {
        ElMessage({
          type: 'success',
          message: '提交成功',
        })
      }
    })
    deleteOpen.value = false
  })
  .catch(() => {
    deleteOpen.value = false
  })
}
function cancel() {
  deleteOpen.value = false
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
function addMaterialQuality(){
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
    materialName: queryParams.value.materialName,
    materialTypeId: queryParams.value.materialTypeId,
    materialSubclassId: queryParams.value.materialSubclassId==''?undefined:queryParams.value.materialSubclassId,
    materialNo: queryParams.value.materialNo,
  }
  download('/base-data/base-material/export',data,'材质信息表.xlsx')
}
</script>

<style scoped>
@import '../index.css';
</style>
<style scoped>
.overflow-tooltip{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
:deep(.el-popper){
  max-width:300px;
  word-break: break-all;
}
</style>