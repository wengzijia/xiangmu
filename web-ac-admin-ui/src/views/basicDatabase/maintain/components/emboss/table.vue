<template>
  <div>
    <div style="margin-top: 20px;">
      <el-form :inline="true" :model="queryParams" ref="queryRef" class="demo-form-inline">
        <el-form-item label="纹理编码:" prop="embossTextureNo">
          <el-input style="width:200px;" type="text" v-model="queryParams.embossTextureNo" clearable placeholder="请输入纹理编码"></el-input>
        </el-form-item>
        <el-form-item label="纹理名称:" prop="embossTextureName">
          <el-input style="width:200px;" type="text" v-model="queryParams.embossTextureName" clearable placeholder="请输入纹理名称"></el-input>
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
        <div>压纹工艺纹理表</div>
        <div>
          <el-button @click="exportForm">导出列表</el-button>
          <el-button @click="addEmboss" v-hasPermi="['maintain:add']">新增压纹工艺纹理</el-button>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="embossTextureNo" label="纹理编码" >
          <template #default="scope">
            <div v-if="!scope.row.embossTextureNo&&scope.row.embossTextureNo!==0">-</div>
            <span v-else>{{scope.row.embossTextureNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="embossTextureName" label="纹理名称" :show-overflow-tooltip="true">
          <template #default="scope">
            <div v-if="!scope.row.embossTextureName&&scope.row.embossTextureName!==0">-</div>
            <span v-else>{{scope.row.embossTextureName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="suitedCraftStr" label="适用工艺" :show-overflow-tooltip="true">
          <template #default="scope">
            <div v-if="!scope.row.suitedCraftStr&&scope.row.suitedCraftStr!==0">-</div>
            <span v-else>{{scope.row.suitedCraftStr}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="imageUrl" label="纹理示例图" :show-overflow-tooltip="true">
          <template #default="scope">
            <el-image v-if="scope.row.imageUrl&&scope.row.imageUrl!='-'" style="width: 100px; height: 60px" preview-teleported :src="ossBaseUrl+scope.row.imageUrl" :preview-src-list="[ossBaseUrl+scope.row.imageUrl]"
              fit="cover" />
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
import { getTexture, delTexture} from "@/api/basicDatabase";
import { download } from "@/utils/request";
import { ElMessage, ElMessageBox } from 'element-plus'

const ossBaseUrl = 'http://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/'
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 1,
  },
});
const emit = defineEmits();
const deleteOpen = ref(false);
const dropdown = ref(false);
const tableData = ref([]);
let delId = ref('')
const data = reactive({
  queryParams: {
    embossTextureName: "",
    embossTextureNo: "",
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
const { proxy } = getCurrentInstance();
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
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
function addEmboss() {
  emit('showDrawer', { data: {}, type: 'add' })
}
const loading = ref(false)
function getList() {
  loading.value = true
  getTexture({
    size: props.pageSize,
    current: props.currentPage,
    embossTextureNo: queryParams.value.embossTextureNo,
    embossTextureName: queryParams.value.embossTextureName,
  }).then(res => {
    if (res.code === 200) {
      let arr = res.data.records;
      // for (let i = 0; i < arr.length; i++) {
      //   for (let key in arr[i]) {
      //     if (!arr[i][key]) {
      //       arr[i][key] = '-'
      //     }
      //   }
      // }
      tableData.value = arr
      emit('setTotal', res.data.total)
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
  deleteOpen.value = true
}
//删除材质
function DeleteSubmit() {
  delTexture(delId.value).then(res=>{
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
function exportForm(){
  let data = {
    embossTextureNo: queryParams.value.embossTextureNo,
    embossTextureName: queryParams.value.embossTextureName,
  }
  download('/base-data/base-emboss-texture/export',data,'压纹工艺纹理表.xlsx')
}
</script>

<style scoped>
@import '../index.css';
:deep(.el-popper){
  max-width:300px;
  word-break: break-all;
}
</style>