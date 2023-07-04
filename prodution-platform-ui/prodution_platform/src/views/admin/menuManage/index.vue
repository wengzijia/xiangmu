<template>
  <div class="user_manage_page">
    <CommonBreadCrumb :first="'系统权限配置'" :marginBottom="'16px'" />
    
    <div class="content_box">
      <div class="content_top">

        <p @click="handleShowAddDialog(true)" class="reset_button" style="background-color:transparent !important;">
          <!-- <el-icon
                size="14px">
                <Plus />
              </el-icon> -->
          <span>+</span>
          添加菜单
        </p>

      </div>
      <div class="table_box" id="getTableHeight">
        <el-table style="width: 100%" :height="tableHeight" :data="tableData" border
          :header-cell-style="{ color: '#333' }">
          <el-table-column label="序号" min-width="50" align="center">
            <template #default="scope">
              <span>{{ getTableSortNum(scope) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sysName" label="系统" min-width="160" align="center" />
          <el-table-column prop="moduleName" label="模块" min-width="160" align="center" />
          <el-table-column prop="childName" label="子模块" min-width="160" align="center" />
          <el-table-column prop="functionName" label="功能" min-width="160" align="center">
            <!-- <template #default="scope">
              <span>{{ getState(scope.row.userState) }}</span>
            </template> -->
          </el-table-column>
          <el-table-column label="操作" align="center" width="135" >
            <template #default="scope">
              <el-button class="edit_buttom" size="small" text
                @click="handleShowAddDialog(false, scope.row)" v-hasPermission="'edit'">编辑</el-button>
                <el-button class="edit_buttom" size="small" text
                @click="handleShowDeleteDialog(scope.row)">删除</el-button>
            </template>
            
          </el-table-column>
        </el-table>
      </div>

    </div>
    <div class="footer">
      <!-- <pageIndex @dropDownValueChange="fruitValueChange" v-if="tableData && tableData.length > 0" :pageNumber="pageNumber"
        :pageSize="pageData.pageSize" :totalCount="pageData.totalCount" /> -->
    </div>
  </div>
  <addMenu :isShowDialog="isShowAddDialog" :isAdd="isAdd" :editParams="editParams" @closeDialog="closeDialog"/>
  <el-dialog v-model="isShowDeleteDialog" width="500" :show-close="false" :destroy-on-close="true"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <template #header>
        <div class="dialog_header">
          <div class="dialog_header_title">提示</div>
          <div class="dialog_close_btn" @click="closeDeleteDialog">
            <Close style="width: 24px; height: 24px" />
          </div>
        </div>
      </template>
      <div class="delete_dialog_content">
        <div class="delete_dialog_body">
          <p class="tips_text">是否删除{{delText}}，并清除所有角色对其的操作权限</p>
        </div>
        <div class="delete_dialog_footer">
          <CommonSureBtn style="margin-right: 80px" @click="suerDeleteRole" />
          <CommonCancelBtn @click="closeDeleteDialog" />
        </div>
      </div>
    </el-dialog>
</template>

<script name="UserManage" setup>
import { onMounted, ref, computed,reactive } from "vue";
import pageIndex from "@/layout/commonLayout/pageIndex.vue";
import api from "@/api";
import { ElMessage } from "element-plus";
import addMenu from './addMenu.vue'
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

/********************************************** 列表数据逻辑 **********************************************/
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
    scope.$index + 1;
  return num;
});


// 获取列表
const getTableData = () => {
  const { pageNumber, pageSize } = pageData.value;

  const reqData = {
    orgCodes:['head_office','industrial_park','manufacturer'],
    pageNumber,
    pageSize :100000,
    // userMobile,
    // userName,
    // userState,
  };

  api.getMenuTreeList(reqData).then((res) => {
    if (res.code !== "000000") {
      return ElMessage.error(res.message);
    }
    console.log("getTableData", res);
    const { head_office,industrial_park,manufacturer } = res.data || {}

    const flatten = (data,pid) =>{
      return data.reduce((arr, { id, name, type,level,permission,orgCode,sysUrls,isShow,sort,children = []}) =>
        arr.concat([{id, name,pid,type,level,permission,orgCode,sysUrls,isShow,sort}], flatten(children,id)), [])
    }
  //  let temp = flatten(head_office,'-1');
   let temp = flatten(head_office,'-1').concat(flatten(industrial_park,'-1')).concat(flatten(manufacturer,'-1'))
   let newArr = temp.map(item => {
     if(item.type == 1) {
        return {
            ...item,
            sysName: item.name,
            moduleName: '',
            childName: '',
            functionName: '',
        }
     } 
     if(item.type == 2) {
        return {
          ...item,
          sysName: '',
          moduleName: item.name,
          childName: '',
          functionName: '',
        }
     }
     if(item.type == 3) {
        return {
          ...item,
          sysName: '',
          moduleName: '',
          childName: item.name,
          functionName: '',
        }
     }
     if(item.type >= 4) {
        return {
          ...item,
          sysName: '',
          moduleName: '',
          childName: '',
          functionName: item.name,
        }
     } 

   })
  pageData.value.totalCount = newArr.length || 0
  tableData.value = newArr || []
  });
};


//分页模块改变的值
const fruitValueChange = (val) => {
  console.log('改变分页模块的值：', val)
  if (val.pageNumber) pageNumber.value = val.pageNumber
  pageData.value = Object.assign(pageData.value, val)
  getTableData()
}

/********************************************** 列表数据逻辑 **********************************************/

/********************************************** 新增/编辑逻辑 **********************************************/
const isShowAddDialog = ref(false)
const isAdd = ref(true)
const editParams = ref({})
// 打开新增弹窗
const handleShowAddDialog = (type,row) => {
  isAdd.value = type
  editParams.value = row
  isShowAddDialog.value = true;
  // if(!type) {
  //     api.getMenuDetail({id:row.id}).then(res => {
  //       editParams.value = res.data
  //       isShowAddDialog.value = true; 
  //     })
  // } else {
  //   isShowAddDialog.value = true;
  // }
  

 
};

const closeDialog =(val) => {
  isShowAddDialog.value = val
  isAdd.value = true
  getTableData()
}

/********************************************** 新增/编辑逻辑 **********************************************/




/********************************************** 删除弹窗逻辑 **********************************************/
const isShowDeleteDialog = ref(false);
const delId=ref('')
const delText = ref('')
const handleShowDeleteDialog = (row) => {
  let str = []
  let filterStr = (id) => { 
    tableData.value.forEach( item =>{
      if(item.id === id) {
        str.push(item.name)
        filterStr(item.pid)
      }
    })
    return str
  }
  let newStr = filterStr(row.pid).reverse().join('下的') || ''
  delId.value = row.id
  delText.value = newStr+ (newStr !== '' ?'下的' :'' ) + row.name
  isShowDeleteDialog.value = true;

  // delId 
};

// 关闭弹窗
const closeDeleteDialog = () => {
  isShowDeleteDialog.value = false;
};

// 删除菜单
const suerDeleteRole = () => {
  console.log("删除菜单");
  const reqData = {
    id: delId.value,
  };

  console.log("删除菜单", reqData);

  api.deleteMenu(reqData).then((res) => {
    if (res.code !== "000000") {
      return ElMessage.error(res.message);
    }

    closeDeleteDialog();
    ElMessage.success("删除成功");
    getTableData();
    // 重置数据
    clearNodeData();
    
    
  });
};

const clearNodeData = () => {
  pageData.value.pageNumber = 1;
};
/********************************************** 删除弹窗逻辑 **********************************************/
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
      font-size: 16px;
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

        // >.el-icon {
        //   position: absolute;
        //   left: 4px;
        //   top: 50%;
        //   transform: translateY(-50%);

        // }
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

.el-dialog__header {
  padding: 0;
  margin: 0;
  .dialog_header {
    height: 40px;
    box-sizing: border-box;
    padding: 0 24px;
    background-color: var(--default-main-color);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .dialog_header_title {
      font-size: 16px;
      font-family: Source Han Sans CN-Medium, Source Han Sans CN;
      font-weight: 500;
      color: #ffffff;
    }

    .dialog_close_btn {
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      color: #fff;

      &:hover {
        opacity: 0.7;
      }
    }
  }
}


.delete_dialog_content {
  min-height: 240px;

  .delete_dialog_body {
    min-height: 144px;
    display: flex;
    justify-content: center;
    align-items: center;

    .tips_text {
      font-size: 16px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
    }
  }

  .delete_dialog_footer {
    height: 96px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
<style>
 .el-dialog__header {
  padding: 0;
  margin: 0;
 }
</style>
