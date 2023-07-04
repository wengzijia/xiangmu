<template>
  <div class="user_manage_page">
    <CommonBreadCrumb :first="'系统权限配置'" :marginBottom="'16px'" />
    <div class="select_box">
      <div class="select_top">
        <div class="select_group">
          <div class="select_item">
            <div class="select_item_label">手机号</div>
            <div class="select_item_content">
              <el-input v-model.trim="defaultValue.userMobile" placeholder="请输入" />
            </div>
          </div>
          <div class="select_item">
            <div class="select_item_label">姓名</div>
            <div class="select_item_content">
              <el-input v-model.trim="defaultValue.userName" placeholder="请输入" />
            </div>
          </div>
        </div>
        <div class="select_group">
          <CommonQueryBtn class="select_button" @click="handleSelect" />
          <CommonResetBtn class="select_button" @click="handleResetSelecter" />
        </div>
      </div>
      <div class="select_bottom">
        <div class="select_group">
          <div class="select_item">
            <div class="select_item_label">状态</div>
            <div class="select_item_content">
              <el-select v-model="selectData.userState" @change="switchingData">
                <el-option v-for="item in userStateMap" :key="item" :label="item.label" :value="item.type" />
              </el-select>
            </div>
          </div>
          <div class="select_item">
            <div class="select_item_label">组织</div>
            <div class="select_item_content">
              <!-- <el-select v-model="selectData.userState" @change="switchingData">
                <el-option v-for="item in userStateMap" :key="item" :label="item.label" :value="item.type" />
              </el-select> -->
              <el-cascader v-model="selectData.orgCode" popper-class="cascaderOrg" :props="props"  @change="switchingOrg" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content_box">
      <div class="content_top">
        <p @click="handleAddNewUser" class="reset_button" style="background-color:transparent !important;">
          <span>+</span>
          添加
        </p>

      </div>
      <div class="table_box" id="getTableHeight">
        <el-table style="width: 100%" :height="tableHeight" :data="tableData" border
          :default-sort="{ prop: 'date', order: 'descending' }"
          @sort-change="sortChange"
          :header-cell-style="{ color: '#333' }">
          <!-- <el-table-column label="序号" min-width="50" align="center">
            <template #default="scope">
              <span>{{ getTableSortNum(scope) }}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="userName" label="姓名" min-width="160" align="center"  sortable="custom"/>
          <el-table-column prop="userMobile" label="手机号" min-width="160" align="center" />
          <el-table-column prop="roleNames" label="角色" min-width="160" align="center" show-overflow-tooltip />
          <el-table-column prop="userState" label="状态" min-width="160" align="center">
            <template #default="scope">
              <span>{{ getState(scope.row.userState) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="160" align="center" sortable="custom">
            <template #default="scope">
                            <div style="color: #333;">{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') || '-' }}
                            </div>
                        </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button class="edit_buttom" size="small" text
                @click="handleEditUser(scope.$index, scope.row, scope)">查看</el-button>
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

<script name="UserManage" setup>

import { onMounted, ref, computed } from "vue";
import pageIndex from "@/layout/commonLayout/pageIndex.vue";
import api from "@/api";
import {openNewPage } from "@/utils/commonApi"
import { ElMessage } from "element-plus";
import router from "@/router";

import { parseTime } from "@/utils/util";

var tableHeight = ref()
//设置表格高度，当屏幕高度发生变化时，表格高度随之变化
onMounted(() => {
  getTableData();
  if (document.getElementById('getTableHeight')) tableHeight.value = document.getElementById('getTableHeight').clientHeight
  window.onresize = () => {    //写在mounted中,onresize事件会在页面大小被调整时触发
    return (() => {
      if (document.getElementById('getTableHeight')) tableHeight.value = document.getElementById('getTableHeight').clientHeight
    })();
  };
});

const sortColumn = ref('user_name')
const sortAsc	 = ref(true)
const sortChange = (val) => {
  console.log(val)
  if(val.prop =='userName') {
    sortColumn.value = 'user_name'
  } else {
    sortColumn.value = 'create_time'
  }
  if(val.order == 'ascending') {
    sortAsc.value = true
  } else {
    sortAsc.value = false
  }
  switchingData()
}
const props  = {
  // multiple: true,
  lazy: true,
  emitPath: false,
  lazyLoad(node,resolve) {
    const { level } = node
    let arr=[]
    console.log(node)
    api.getRoleListByPid({pid: node.value || '-1'}).then(res => {
      if(level === 0) {
        arr.push({label: '全部',value: '',leaf: 1})
      }
      for (const key in res.data) {
        if (Object.hasOwnProperty.call(res.data, key)) {
          const element = {label: res.data[key].name,value: res.data[key].id,leaf: level >= 1	}
          arr.push(element)
        }
      }
      resolve(arr)
    })
  }
}
let roleIdList = ref([])
const switchingOrg =(val) => {
  console.log(val)
  if(val) {
    roleIdList.value = [val]
  } else {
    roleIdList.value = []
  }
  getTableData()
}
/********************************************** 列表数据逻辑 **********************************************/
const selectData = ref({
  userMobile: "",
  userName: "",
  userState: "",
  orgCode: ''
});

const defaultValue = ref({
  userMobile: null,
  userName: null,
})

const userStateMap = ref([
  {
    label: "全部",
    type: "",
  },
  {
    label: "启用中",
    type: 1,
  },
  {
    label: "禁用中",
    type: 2,
  },
]);

const tabeluserStateMap = ref({
  1: "启用中",
  2: "禁用中",
});

const tableData = ref([]);
var pageNumber = ref(1)
const pageData = ref({
  pageNumber: 1,
  pageSize: 15,
  pageSizeArr: [15, 30, 50, 100],
  totalCount: 0,

});

const getTableSortNum = computed(() => (scope) => {
  let num =
    (pageData.value.pageNumber - 1) * pageData.value.pageSize +
    scope.$index +
    1;

  // if (scope.)
  return num;
});

const getState = computed(() => (state) => {
  return tabeluserStateMap.value[state];
});

// 获取列表
const getTableData = () => {
  const { pageNumber, pageSize } = pageData.value;
  const { userMobile, userName, userState } = selectData.value;

  const reqData = {
    language: "zh-cn",
    pageNumber,
    pageSize,
    userMobile,
    userName,
    userState,
    sortColumn:sortColumn.value,
    sortAsc:sortAsc.value,
    roleIdList: roleIdList.value
  };

  api.getUserPage(reqData).then((res) => {
    if (res.code !== "000000") {
      return ElMessage.error(res.message);
    }
    console.log("getTableData", res);
    const { totalCount, items } = res.data || {}
    pageData.value.totalCount = totalCount || 0
    tableData.value = items || []


  });
};

// 点击查询
const handleSelect = () => {
  pageNumber.value = 1
  pageData.value.pageNumber = 1;

  selectData.value.userMobile = defaultValue.value.userMobile
  selectData.value.userName = defaultValue.value.userName

  getTableData();
};

// 点击重置
const handleResetSelecter = () => {
  pageData.value.pageNumber = 1
  pageNumber.value = 1
  Object.assign(selectData.value, {
    userMobile: "",
    userName: "",
    userState: "",
    orgCode: ''
  });
  roleIdList.value = []
  Object.assign(defaultValue.value,{userMobile:'',userName:''})
  getTableData();
};
const switchingData = (val) => {
  pageData.value.pageNumber = 1
  pageNumber.value = 1
  getTableData();
}

//分页模块改变的值
const fruitValueChange = (val) => {
  console.log('改变分页模块的值：', val)
  if (val.pageNumber) pageNumber.value = val.pageNumber
  pageData.value = Object.assign(pageData.value, val)
  getTableData()
}





/********************************************** 列表数据逻辑 **********************************************/

/********************************************** 新增/编辑逻辑 **********************************************/
const openPage = (obj) => {
    const href = router.resolve(obj)
    // window.open(href.href, '_blank')
}
// 新增用户
const handleAddNewUser = () => {
  // openPage({name: "AddNewUser",path:'/admin/AddNewUser'})
  openNewPage('/admin/addNewUser')
};

// 编辑用户
const handleEditUser = (index, row, scope) => {
  console.log("handleEditUser", index, row, scope);
  // openPage({name: "UserDetail",path:'/admin/UserDetail',query:{userId:row.id}})
  openNewPage(`/admin/userDetail?userId=${row.id}`)

};

/********************************************** 新增/编辑逻辑 **********************************************/
</script>

<style lang="scss" scoped>
.user_manage_page {
  height: 100%;
  padding: 16px 24px 24px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .select_box {
    margin-bottom: 16px;
    padding: 24px 20px;
    background-color: #fff;
    border-radius: 4px;

    .select_top {
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #f2f2f2;
      display: flex;
      justify-content: space-between;
    }

    .select_group {
      display: flex;

      .select_button {
        margin-right: 20px;

        &:last-child {
          margin-right: 0;
        }
      }

      .select_item {
        margin-right: 40px;
        display: flex;
        align-items: center;

        &:last-child {
          margin-right: 0;
        }

        .select_item_label {
          margin-right: 8px;
          font-size: 14px;
          font-family: Microsoft YaHei UI-Regular, Microsoft YaHei UI;
          font-weight: 400;
          // color: #333333;

          color: var(--el-text-color-regular);
        }

        .select_item_content {
          width: 272px;
        }
      }
    }
  }

  .content_box {
    padding: 40px 20px 76px 20px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 4px;
    position: relative;
    flex: 1;
    overflow: hidden;

    .content_top {
      position: absolute;
      height: 20px;
      line-height: 20px;
      font-size: 15px;
      font-family: Source Han Sans CN-Regular, Source Han Sans CN;
      font-weight: 400;
      color: var(--vt-c-theme-colors);
      right: 20px;
      top: 10px;
      cursor: pointer;

      >p {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        border: 0 !important;
        padding-left: 24px;
        position: relative;
        >span {
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 22px;

        }
      }
    }

    .table_box {
      width: 100%;
      width: 100%;
      height: 100%;
      overflow: hidden;



      .edit_buttom {
        border: 1px solid;
        color: var(--default-main-color);
        background-color: transparent;

        &:hover {
          opacity: 0.5;
        }
      }

      :deep(.el-table__body-wrapper) {


        .cell {
          color: #666 !important;
        }
      }

      :deep(.el-table__header) {
        th {
          background-color: #f2f2f2;
        }

        .cell {
          color: #333 !important;
          font-weight: 500 !important;
        }
      }
    }



  }

  .footer {
    position: fixed;
    right: 34px;
    bottom: 44px;
  }
}
</style>
<style lang="scss">
  .cascaderOrg{
    .el-cascader-node__prefix {
      position: absolute ;
      left: 150px;
    } 
  }
</style>