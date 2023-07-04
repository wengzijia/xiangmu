<template>
  <div class="commonTableListBox">
    <CommonBreadCrumb :first="'产业园管理'" :marginBottom="'16px'" />
    <div class="select_box">
      <div class="select_top">
        <div class="select_group">
          <el-form :inline="true" :model="nameParam" class="demo-form-inline" style="width:100%;" @submit.prevent>
            <!-- <el-form-item label="产业园名称">
              <el-select v-model="nameParam.name" filterable clearable @change="searchChange"
                :filter-method="searchFilter" placeholder="请输入" class="nameInput">
                <el-option v-for="item in nameList" :key="item.id" :label="item.parkName" :value="item.parkName" />
              </el-select>
            </el-form-item> -->
            <filterable class="nameBox" @dropFilterableChange="fruitFilterableChange" :keys="'parkName'" :label="'产业园名称'"
              :manufacturerName="nameParam.name" :defaultValuelist="nameList" />
            <el-form-item style="float: right;margin-right: 0;" class="selecct_item_serachBox">
              <el-button type="primary" class="search_button" @click="query"><el-icon :size="16">
                  <Search />
                </el-icon>查询</el-button>
              <el-button class="reset_button" @click="reset"><el-icon :size="16">
                  <Refresh />
                </el-icon>重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="select_bottom">
        <div class="select_group">
          <el-form :inline="true" :model="listParam" class="demo-form-inline" style="width:100%;">
            <el-form-item label="产业园类型">
              <el-select v-model="listParam.parkType" class="typeSelect" placeholder="全部" @change="selectChange">
                <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="content_box">
      <div class="addPack" @click="toPage()">
        <span class="addImg">+</span>
        添加产业园
      </div>
      <div class="table_box" id="getTableHeight">
        <el-table :data="tableData" border :height="tableHeight" @row-click="row => tableJump(row)" @sort-change="sort">
          <!-- sortable="custom" -->
          <el-table-column label="产业园名称" width="280px" align="center">
            <template #default="scope">
              <div style="color: #333333;">{{ scope.row.parkName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="法人" align="center">
            <template #default="scope">
              <div style="color: #333333;">{{ scope.row.principalName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="电话" width="280px" align="center">
            <template #default="scope">
              <div style="color: #333333;">
                {{ scope.row.principalMobile }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="产业园类型" width="280px" align="center">
            <template #default="scope">
              <div style="color: #333333;">
                {{ typeMap[scope.row.parkType] }}
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="状态" width="140px" align="center">
            <template #default="scope">
              <div>{{ statusMap[scope.row.enableStatus] }}</div>
            </template>
          </el-table-column> -->
          <el-table-column label="创建人" width="140px" align="center">
            <template #default="scope">
              <div style="color: #333333;">{{ scope.row.createUserName }}</div>
            </template>
          </el-table-column>
          <!-- sortable="custom" -->
          <el-table-column label="创建时间" width="140px" align="center">
            <template #default="scope">
              <div style="color: #333333;">{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') || '-' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140px" align="center">
            <template #default="scope">
              <el-button class="edit_buttom" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <pageIndex @dropDownValueChange="fruitValueChange" v-if="tableData && tableData.length > 0" :pageNumber="pageNumber"
        :pageSize="pageData.pageSize" :totalCount="pageData.totalCount" />
    </div>
  </div>
</template>
  
<script name="ProcessorList" setup>
import pageIndex from "@/layout/commonLayout/pageIndex.vue";
import filterable from "@/layout/commonLayout/filterable.vue";
import { onMounted, ref, onUnmounted } from 'vue'
import { ElMessage } from "element-plus";
import { Search } from '@element-plus/icons-vue'
import { getIndustrialParkList, getIndustrialParkPage } from "@/api/modules/lndustrialParkManagement"
import { useRoute, useRouter } from "vue-router";
import { parseTime } from "@/utils/util"
import { openNewPage } from "@/utils/commonApi"
const router = useRouter();
const route = useRoute();

// 产业园名称
let nameParam = reactive({
  name: ""
})
// 产业园名称列表
let nameList = ref([])

const typeList = reactive([
  {
    label: "全部", value: ""
  },
  {
    label: "自有", value: "1"
  },
  // {
  //   label: "加盟", value: "2"
  // }
])

// 类型处理成文字
const typeMap = {
  0: '全部',
  1: '自有',
  2: '加盟'
}

// 状态处理成中文
const statusMap = {
  1: "启用",
  2: "禁用"
}

// 产业园列表参数
let listParam = reactive({
  parkName: "", // 产业园名称
  parkType: "", // 产业园类型 1:自有 2：加盟
  // sortColumn: "park_name", // 排序字段 park_name 产业园名称 create_time 创建时间 
  // sortAsc: true, // true 正序，false 倒顺序
  pageNumber: 1, // 当前页
  pageSize: 15, // 显示条数
})

let pageNumber = ref(1)
let pageData = reactive({
  pageSize: 15,
  pageSizeArr: [15, 30, 50, 100],
  totalCount: 0
})

//获取表格数据
let tableData = ref([]);

var tableHeight = ref()
let channel = ""
//设置表格高度，当屏幕高度发生变化时，表格高度随之变化
onMounted(() => {
  getName()
  getTableList().finally(() => {
    if (document.getElementById('getTableHeight')) {
      tableHeight.value = document.getElementById('getTableHeight').clientHeight
    }
  })
  window.onresize = () => {    //写在mounted中,onresize事件会在页面大小被调整时触发
    return (() => {
      if (document.getElementById('getTableHeight')) tableHeight.value = document.getElementById('getTableHeight').clientHeight
    })();
  };
  channel = new BroadcastChannel("channel-ProcessorList");
  channel.addEventListener("message", function (e) {
    if (e.data.refreshData) {
      getName()
      getTableList()
    }
  });
});

onUnmounted(() => {
  channel.close();
})

// 选择改变
const selectChange = () => {
  getTableList()
}
// 获取产业园名称
async function getName() {
  let { code, data, message } = await getIndustrialParkList();
  if (code == '000000') {
    nameList.value = data
  } else {
    ElMessage.error(message)
  }
}

// 获取产业园列表
async function getTableList() {
  let { code, data, message } = await getIndustrialParkPage(listParam);
  if (code == '000000') {
    tableData.value = data.items
    pageData.totalCount = data.totalCount
    pageNumber.value = data.pageNumber
    pageData.pageSize = data.pageSize
  } else {
    ElMessage.error(message)
  }
}

/**
 * 加工商搜索框组件传回来的值
 * @param {*} val 
 */
const fruitFilterableChange = (val) => {
  console.log(val, '输入框的值')
  nameParam.name = val
}

//分页模块改变的值
const fruitValueChange = (val) => {
  console.log('改变分页模块的值：', val)
  listParam.pageNumber = val.pageNumber
  listParam.pageSize = val.pageSize
  getTableList()
}

const query = () => {
  listParam.pageNumber = 1
  listParam.parkName = nameParam.name
  getTableList()
}

// 跳转页面
const toPage = () => {
  // window.open("/industrialParkManage/industrialParkAdd", '_blank')
  openNewPage("/industrialParkManage/industrialParkAdd")
}

// 表格跳转
const tableJump = (row) => {
  // window.open(`/industrialParkManage/industrialParkEdit?id=${row.id}`, '_blank')
  openNewPage(`/industrialParkManage/industrialParkEdit?id=${row.id}`)
}

// 重置
const reset = () => {
  nameParam.name = ""
  listParam.parkName = "",
    listParam.parkType = "",
    listParam.pageNumber = "1"
  getTableList()
}

// ascending 表示升序，descending 表示降序，null 表示还原为原始顺序
const sortMap = {
  "ascending": true,
  "descending": false
}

// 排序
function sort(e) {
  let { column, prop, order } = e
  if (order) {
    if (column.id == "el-table_1_column_1") {
      listParam.sortColumn = "park_name"
    } else if (column.id == "el-table_1_column_6") {
      listParam.sortColumn = "create_time"
    }
    listParam.sortAsc = sortMap[order]
    console.log('column.id', column.id);
    getTableList()
  } else {
    listParam.sortAsc = true
  }
}

</script>
  
<style lang="scss" scoped>
@import "@/assets/css/listTable.scss";

.commonTableListBox {
  .nameBox {
    &:deep(.el-form-item__content) {
      width: 240px;
      height: 29px;
    }
  }

  .typeSelect {
    width: 240px;
    height: 29px;
  }

  .addPack {
    cursor: pointer;
    right: 20px;
    top: 0;
    position: absolute;
    height: 37px;
    line-height: 37px;
    font-size: 14px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: var(--vt-c-theme-colors);
    display: flex;
    align-items: center;

    .addImg {
      font-size: 20px;
      margin-right: 2px;
    }
  }
}
</style>