<template>
  <div>
    <div style="margin-top: 20px;">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline" ref="queryRef">
        <el-form-item label="颜色编码:" prop="bronzeColorNo">
          <el-input style="width:200px;" type="text" clearable placeholder="请输入颜色编码" v-model="queryParams.bronzeColorNo"></el-input>
        </el-form-item>
        <el-form-item label="颜色名称:" prop="bronzeColorName">
          <el-input style="width:200px;" type="text" clearable placeholder="请输入颜色名称" v-model="queryParams.bronzeColorName"></el-input>
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
        <div>烫金工艺颜色表</div>
        <div>
          <el-button @click="exportForm">导出列表</el-button>
          <el-button @click="addGilding" v-hasPermi="['maintain:add']">新增烫金工艺颜色</el-button>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="bronzeColorNo" label="颜色编码"  >
          <template #default="scope">
            <div v-if="!scope.row.bronzeColorNo&&scope.row.bronzeColorNo!==0">-</div>
            <span v-else>{{scope.row.bronzeColorNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bronzeColorName" label="颜色名称" :show-overflow-tooltip="true">
          <template #default="scope">
            <div v-if="!scope.row.bronzeColorName&&scope.row.bronzeColorName!==0">-</div>
            <span v-else>{{scope.row.bronzeColorName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bronzeColorCode" label="颜色代码" :show-overflow-tooltip="true">
          <template #default="scope">
            <!-- <TableTooltip :content="scope.row.bronzeColorCode"/> -->
            <div v-if="!scope.row.bronzeColorCode&&scope.row.bronzeColorCode!==0">-</div>
            <span v-else>{{scope.row.bronzeColorCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="suitedCraftStr" label="适用工艺" :show-overflow-tooltip="true">
          <template #default="scope">
            <!-- <TableTooltip :content="scope.row.suitedCraftStr"/> -->
            <div v-if="!scope.row.suitedCraftStr&&scope.row.suitedCraftStr!==0">-</div>
            <span v-else>{{scope.row.suitedCraftStr}}</span>
            <!-- 必须要用行内元素，否则show-overflow-tooltip不显示省略号 -->
          </template>
        </el-table-column>
        <el-table-column prop="imageUrl" label="颜色示例图">
          <template #default="scope" >
          <el-image v-if="scope.row.imageUrl&&scope.row.imageUrl!='-'" fit="cover" class="img_wid" preview-teleported :src="ossBaseUrl + scope.row.imageUrl" :preview-src-list="[ossBaseUrl + scope.row.imageUrl]" >
          </el-image>
          <span v-else>-</span>
        </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="scope">
            <el-link type="primary" :underline="false" class="mar_10" @click="Drawer(scope.row,'edit')" v-hasPermi="['maintain:change']">编辑</el-link>
            <el-link type="primary" :underline="false" @click="handDelete(scope.row)" v-hasPermi="['maintain:del']">删除</el-link>
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
import { getBronzeColor, delBronzeColor } from "@/api/basicDatabase";
import { ElMessage, ElMessageBox } from 'element-plus'
import { Picture as IconPicture } from "@element-plus/icons-vue";
import { download } from "@/utils/request";
import TableTooltip from '@/components/TableTooltip'
const ossBaseUrl = 'http://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/'
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
const deleteOpen = ref(false);
const loading = ref(true);
const tableData = ref([]);
let delId = ref('');
const data = reactive({
  queryParams: {},
});
const { queryParams } = toRefs(data);
const { currentPage, pageSize } = toRefs(props);
watch([currentPage, pageSize], ([currentPageVal, pageSizeVal]) => {
  getList();
});
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
  getBronzeColor({
    size: props.pageSize,
    current: props.currentPage,
    bronzeColorName: queryParams.value.bronzeColorName,
    bronzeColorNo: queryParams.value.bronzeColorNo,
  }).then((res) => {
    if (res.code === 200) {
      let arr = res.data.records;
      emit("setTotal", res.data.total);
      // for (let i = 0; i < arr.length; i++) {
      //   for (let key in arr[i]) {
      //     if (!arr[i][key]) {
      //       arr[i][key] = '-'
      //     }
      //   }
      // }
      tableData.value = arr;
    }
  }).finally(()=>{
    loading.value = false
  })
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
function DeleteSubmit() {
  delBronzeColor(delId.value).then(res=>{
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
function addGilding(){
  emit('showDrawer', { data:{}, type:'add' })
}
function exportForm(){
  let data = {
    bronzeColorName: queryParams.value.bronzeColorName,
    bronzeColorNo: queryParams.value.bronzeColorNo,
  }
  download('/base-data/base-bronze-color/export',data,'烫金工艺颜色表.xlsx')
}
</script>

<style scoped>
@import "../index.css";
:deep(.el-popper){
  max-width:300px;
  word-break: break-all;
}
</style>
<style>
/* .image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
.image-slot .el-icon {
  font-size: 30px;
} */
.img_wid {
  width: 100px;
  height: 60px;
}
</style>