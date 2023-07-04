<template>

  <div class="maintain">
    <el-card style="margin:10px">
      <div style="margin-top: 20px;">
        <el-form :inline="true" :model="queryParams" class="demo-form-inline" ref="queryRef" label-width="120px">
          <el-form-item label="申请单编号:" prop="applyNo"   style="width: 300px">
            <el-input type="text" v-model="queryParams.applyNo" clearable placeholder="请输入申请单编号" ></el-input>
          </el-form-item>
          <el-form-item label="申请日期:" prop="applyDate" class="font">
            <el-date-picker v-model="queryParams.applyDate" type="daterange" range-separator="To" start-placeholder="开始时间" end-placeholder="结束时间" />
          </el-form-item>
          <el-form-item label="审批日期:" prop="aprovalDate" class="font">
            <el-date-picker v-model="queryParams.aprovalDate" type="daterange" range-separator="To" start-placeholder="开始时间" end-placeholder="结束时间" />
          </el-form-item>
          <el-form-item label="基础数据表:" prop="baseDateTable"   style="width: 300px">
            <el-select v-model="queryParams.baseDateTable" class="m-2" placeholder="所有基础数据表" clearable>
              <el-option v-for="item in basic_database" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="审批状态:" prop="approvalStatus" >
            <el-select v-model="queryParams.approvalStatus" class="m-2" placeholder="所有状态" clearable>
              <el-option v-for="item in basic_approval_status" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="异动内容/编码:" prop="keyWord"   style="width: 300px">
            <el-input type="text" clearable v-model="queryParams.keyWord" placeholder="请输入异动内容/编码"></el-input>
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
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
          <el-table-column prop="applyNo" label="申请编号" width="180px" />
          <el-table-column prop="baseDateNo" label="基础数据编号" width="150px" >
            <template #default="scope">
              <div> {{scope.row.baseDateNo || '-'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="baseDateTable" label="基础数据表名" width="150px">
            <template #default="scope">
              <template v-for="item in basic_database">
                <div :key="item.value" v-if="scope.row.baseDateTable==item.value">{{item.label}}</div>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="applyTye" label="申请类别" width="100px">
            <template #default="scope">
              <template v-for="item in basic_approval_category">
                <div :key="item.value" v-if="scope.row.applyTye==item.value">{{item.label}}</div>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="abnormalContent" label="异动内容" :show-overflow-tooltip="true" width="220px" />
          <el-table-column prop="applerName" label="申请人" />
          <el-table-column prop="appleTime" label="申请时间" :show-overflow-tooltip="true" />
          <el-table-column prop="approvalStatus" label="审批状态">
            <template #default="scope">
              <template v-for="item in basic_approval_status">
                <div :key="item.value" v-if="scope.row.approvalStatus==item.value">{{item.label}}</div>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="approvalerName" label="审批人" >
            <template #default="scope">
              <div> {{scope.row.approvalerName || '-'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="approvalTime" label="审批时间" :show-overflow-tooltip="true" >
            <template #default="scope">
              <div> {{scope.row.approvalTime || '-'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="scope">
              <el-link type="primary" :underline="false" class="mar_10" @click="more(scope.row,'审批')" v-show="scope.row.approvalStatus==1"  v-hasPermi="['basicDatabase:approval']">审批</el-link>
              <el-link type="primary" :underline="false" @click="more(scope.row,'查看')">查看</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div class="pages" style="position: relative;">
        <pagination background layout="total, sizes, prev, pager, next, jumper" v-model:page="currentPage" @pagination="handleSizeChange" :total="total" v-model:limit="pageSize" :pageSizes="[20, 50, 100]" />
      </div>
    </el-card>
    <!-- :title="drawerTitle" -->
    <el-drawer v-model="drawer" direction="rtl" :title="drawerTitle" :before-close="handleClose" size="600px">
      <!-- 弹窗抽屉组件 -->
      <template #default>
        <component :is="dialogList" :drawerData="drawerData" :drawerType="drawerType"  @ChangeLoading="moduleLoading=false"> </component>
      </template>
      <template #footer>
      <div style="flex: auto"  v-show="disabled">
        <el-button @click="goBack">退回</el-button>
        <el-button type="primary" @click="confirmChange">审批通过</el-button>
      </div>
    </template>
    </el-drawer>
    <!-- 弹窗抽屉组件 -->
  </div>
</template>
<script setup>
import { getApplyRecord,baseApproval,} from "@/api/basicDatabase/approval";
import { ElMessage, ElMessageBox } from "element-plus";
import checkAppNewVersion from '@/utils/checkAppNewVersion.js'
import { formatDate } from "@/utils";
const { proxy } = getCurrentInstance();
const flag = ref(true);
const { basic_database, basic_approval_status, basic_approval_category } =
  proxy.useDict(
    "basic_database",
    "basic_approval_status",
    "basic_approval_category"
  );
const total = ref(0);
const pageSize = ref(20);
const currentPage = ref(1);
const loading = ref(false);
const moduleLoading = ref(true);
var tableName = ref("materialQuality");
var drawer = ref(false);
var drawerType = ref("查看");
var drawerTitle = ref("");
const recordId = ref('')
const disabled = ref(true);
const tableData = ref([
]);
const data = reactive({
  queryParams: {
    approvalStatus: "1",
    surface: "",
  },
  drawerData: {
  },
});
const { queryParams, drawerData } = toRefs(data);
//动态加载弹窗组件
const dialogList = computed(() => {
  if (tableName.value) {
    checkAppNewVersion()
    return defineAsyncComponent(() =>
      import(`../maintain/components/${tableName.value}/approval.vue`)
    );
  }
});

function handleQuery() {
  currentPage.value = 1;
  getList();
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
getList();
//获取基础数据申请记录
function getList() {

  let data = {
    size: pageSize.value,
    current: currentPage.value,
    applyNo: queryParams.value.applyNo,
    baseDateTable: queryParams.value.baseDateTable,
    keyWord: queryParams.value.keyWord,
    approvalStatus: queryParams.value.approvalStatus,
    appleTimeStart: queryParams.value.applyDate
      ?  proxy.parseTime(queryParams.value.applyDate[0])
      : "",
    appleTimeEnd: queryParams.value.applyDate
      ? proxy.parseTime(new Date(queryParams.value.applyDate[1]).getTime()+(60*60*24-1)*1000)
      : "",
    approvalTimeStart: queryParams.value.aprovalDate
      ? proxy.parseTime(queryParams.value.aprovalDate[0])
      : "",
    approvalTimeEnd: queryParams.value.aprovalDate
      ? proxy.parseTime(new Date(queryParams.value.aprovalDate[1]).getTime()+(60*60*24-1)*1000)
      : "",
    "orders[0].column":'apple_time',
    "orders[0].asc":false,
  };
  getApplyRecord({
    ...data,
  }).then((res) => {
    if (res.code === 200) {
      let arr = res.data.records;
      arr.map((item) => {
        item.appleTime = item.appleTime?.replace("T", " ");
        item.approvalTime = item.approvalTime?.replace("T", " ");
      });
      tableData.value = arr;
      total.value = res.data.total;
    }
    loading.value = false;
  });
}
//查看/审批数据
function more(data, type) {
  tableName.value = data.baseDateTable;
  recordId.value = data.id
  showDrawer({ data, type });
}
//关闭抽屉dialog前的回调
const handleClose = (done) => {
  ElMessageBox.confirm("确认关闭弹窗?")
    .then(() => {
      done();
    })
    .catch(() => {});
};
function showDrawer({ data, type }) {
  if (data) {
    let val = data.applyTye;
    let sum = type + "-" + val;
    drawerType.value = sum;
    switch (sum) {
      case "查看-1":
      case "查看-2":
      case "查看-3":
        drawerTitle.value = "详细信息";
        disabled.value = false
        break;
      case "审批-1":
        drawerTitle.value = "新增/删除审批";
        disabled.value = true
        break;
      case "审批-2": //审批
        drawerTitle.value = "编辑信息审批";
        disabled.value = true
        break;
      case "审批-3":
        drawerTitle.value = "新增/删除审批";
        disabled.value = true
        break;
      default:
        drawerTitle.value = "详细信息";
    }
    drawerData.value = { id: data.id, baseDateTable: data.baseDateTable,};
  }
  drawer.value = true;
}
function handleSizeChange(val) {
  getList();
}
function goBack() {
  ElMessageBox.confirm("操作立即生效，是否继续？", "是否确认退回申请单？", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      getApproval(!flag.value);
    })
    .catch(() => {});
}
function confirmChange() {
  ElMessageBox.confirm("操作立即生效，是否继续？", "是否确认审批通过？", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      getApproval(flag.value);
    })
    .catch(() => {});
}
function getApproval(val) {
  let data = {
    flag: val,
    id: recordId.value,
  };
  baseApproval({
    ...data,
  }).then((res) => {
    if (res.code === 200) {
      if (val) {
    ElMessage({
      message: "审批通过",
      type: "success",
      offset: 300,
      duration: 1500,
    });
   
  } else {
    ElMessage({
      message: "退回成功",
      type: "success",
      offset: 300,
      duration: 1500,
    });
  }
  setTimeout(() => {
      proxy.$router.go(0);
    }, 1500);
    }
  });
 
}
</script>
<style scoped>
.mar_10 {
  margin-right: 10px;
}
:deep(.el-drawer__body) {
  padding-right: 2px;
  padding-top: 0px;
}
:deep(.el-drawer__header) {
  margin-bottom: 10px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color);
}
.form-tool-bar{
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
}
.font{
  font-weight: 700;
}
:deep(.el-popper){
  max-width:300px;
  word-break: break-all;
}
</style>
