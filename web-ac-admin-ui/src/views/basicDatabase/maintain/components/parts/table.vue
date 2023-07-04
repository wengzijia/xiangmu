<template>
  <div>
    <div style="margin-top: 20px;">
      <el-form :inline="true" :model="queryParams" ref="queryRef" class="demo-form-inline">
        <el-form-item label="配件名称:" prop="accessoryName">
          <el-input style="width:200px;" type="text" v-model="queryParams.accessoryName" clearable placeholder="请输入配件名称"></el-input>
        </el-form-item>
        <el-form-item label="材质名称:" prop="materialName">
          <el-input style="width:200px;" type="text" v-model="queryParams.materialName" clearable placeholder="请输入材质名称"></el-input>
        </el-form-item>
        <el-form-item label="材质类别:" prop="materialTypeId">
          <el-select style="width:200px;" v-model="queryParams.materialTypeId" class="m-2" placeholder="请选择材质类别" clearable>
            <el-option v-for="item in MaterialTypeList" :key="item.value" :label="item.materialTypeName" :value="item.id" />
          </el-select>
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
        <div>配件信息表</div>
        <div>
          <el-button @click="exportForm">导出列表</el-button>
          <el-button @click="addMaterialQuality" v-hasPermi="['maintain:add']">新增配件</el-button>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column label="配件编号" >
          <template #default="scope">
            <div v-if="!scope.row.accessoryNo&&scope.row.accessoryNo!==0">-</div>
            <span v-else>{{scope.row.accessoryNo}}</span>
          </template>
        </el-table-column>
        <el-table-column label="配件名称"  :show-overflow-tooltip="true">
          <template #default="scope">
            <!-- <TableTooltip :content="scope.row.accessoryName"/> -->
            <div v-if="!scope.row.accessoryName&&scope.row.accessoryName!==0">-</div>
            <span v-else>{{scope.row.accessoryName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="材质名称"  :show-overflow-tooltip="true">
          <template #default="scope">
            <!-- <TableTooltip :content="scope.row.materialName"/> -->
            <div v-if="!scope.row.materialName&&scope.row.materialName!==0">-</div>
            <span v-else>{{scope.row.materialName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="材质类别" :show-overflow-tooltip="true">
          <template #default="scope">
            <div v-if="!scope.row.materialTypeName&&scope.row.materialTypeName!==0">-</div>
            <span v-else>{{scope.row.materialTypeName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="可选规格"  width="180" :show-overflow-tooltip="true">
          <template #default="scope">
            <span v-if="scope.row.accessorySpecList?.length>0">
              <span v-for="(item,i) in scope.row.accessorySpecList" :key="item.id"><span v-show="1">/</span>{{spec}}</span>
            </span>
            <span v-else>-</span>
            <!-- <TableTooltip :content="scope.row.length"/> -->
            <!-- <el-tooltip
              v-if="scope.row.spec.length>15"
              class="box-item"
              effect="dark"
              placement="top"
            >
              <template #content>
                <div style="max-width:300px">
                  {{scope.row.spec}}
                </div>
              </template>
              <div class="overflow-tooltip">{{scope.row.spec}}</div>
            </el-tooltip>
            <span v-else>
              <div v-if="!scope.row.spec&&scope.row.spec!==0">-</div>
              <span v-else class="overflow-tooltip">{{scope.row.spec}}</span>
            </span> -->
          </template>
        </el-table-column>
        <el-table-column label="计量单位" :show-overflow-tooltip="true">
          <template #default="scope">
            <div v-if="!scope.row.measurementUnit&&scope.row.measurementUnit!==0">-</div>
            <span v-else>{{scope.row.measurementUnit}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="scope">
            <el-link type="primary" :underline="false" class="mar_10" @click="Drawer(scope.row,'edit')" v-hasPermi="['maintain:change']">编辑</el-link>
            <el-link type="primary" :underline="false" @click="handDelete(scope.row)" v-hasPermi="['maintain:del']">删除</el-link>
            <!-- <el-dropdown trigger="click" >
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
import { getAccessory, delAccessory } from "@/api/basicDatabase";
import {GetMaterialTypeList} from '../getList'
import { ElMessage, ElMessageBox } from 'element-plus'
import { checkPermi } from "@/utils/permission";
import { download } from "@/utils/request";
import TableTooltip from '@/components/TableTooltip'
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
const tableData=ref([]);
const emit = defineEmits();
const deleteOpen = ref(false);
let delId = ref('')
const data = reactive({
  queryParams: {
    category: "",
    subclass: "",
  },
  MaterialTypeList: [],
  rejectForm: {
    remark: "",
  },
  transferForm: {
    tremark: "",
  },
});
const { queryParams,  rejectForm, transferForm, MaterialTypeList, } =
  toRefs(data);
const { currentPage, pageSize} = toRefs(props);
watch([currentPage, pageSize],([currentPageVal,pageSizeVal])=>{
  getList()
})
function del(e) {
  console.log(e);
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
//s删除配件
function DeleteSubmit() {
  // ElMessageBox.confirm(
  //   '删除材质将删除材质下的所有规格，并同步删除引用此材质及其规格的物料信息。',
  //   '是否继续？',
  //   {
  //     confirmButtonText: '确认',
  //     cancelButtonText: '取消',
  //     type: 'warning',
  //   }
  // ).then(() => {
    delAccessory(delId.value).then(res=>{
      if (res.code===200) {
        ElMessage({
          type: 'success',
          message: '提交成功',
        })
      }
    })
    deleteOpen.value = false
  // })
  // .catch(() => {
  //   deleteOpen.value = false
  // })
}
function cancel() {
  console.log(123);
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
function addMaterialQuality(){
  emit('showDrawer', { data:{}, type:'add' })
}
//搜索
function handleQuery() {
  emit('ChangeOption')
  getList()
}
const { proxy } = getCurrentInstance();
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
const loading = ref(false)
function getList() {
  loading.value = true
  getAccessory({
    size: props.pageSize,
    current: props.currentPage,
    accessoryName: queryParams.value.accessoryName,
    materialName: queryParams.value.materialName,
    materialTypeId: queryParams.value.materialTypeId,
  }).then((res) => {
    if (res.code === 200) {
      let arr = res.data.records;
      emit("setTotal", res.data.total);
      arr.map((item) => {
        let specArr = [];
        if (item.accessorySpecList) {
          item.accessorySpecList.map(e=>{
            if(e.spec){
              specArr.push(e.spec)
            }
          })
          item.spec = specArr.join("/");
        }else{
          item.spec = ''
        }
      })
      tableData.value = arr;
    }
  }).finally(()=>{
    loading.value = false
  })
}
getList()
//获得所有材质类别
async function getMaterialTypeList() {
  MaterialTypeList.value = await GetMaterialTypeList()
}
getMaterialTypeList()
function exportForm(){
  let data = {
    accessoryName: queryParams.value.accessoryName,
    materialName: queryParams.value.materialName,
    materialTypeId: queryParams.value.materialTypeId,
  }
  download('/base-data/base-accessory/export',data,'配件信息表.xlsx')
}
</script>

<style scoped>
@import "../index.css";
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