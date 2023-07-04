<template>
  <div class="role_manage_page">
    <CommonBreadCrumb :first="'系统权限配置'" :marginBottom="'16px'" />
    <div class="role_manage_container">
      <div class="role_manage_container_left">
        <div class="topper">
          <div class="search_input_box">
            <el-input v-model.trim="searchWorld" placeholder="请输入关键词" @input="searchWorldChang">
              <template #suffix>
                <Search style="width: 14px; height: 14px; margin-right: 4px" color="#999" />
              </template>
            </el-input>
          </div>
          <div class="add_role_btn" @click="handleShowAddDialog">
            <CirclePlus style="width: 18px; height: 18px; margin-right: 4px" color="var(--default-main-color)" />
            新增
          </div>
        </div>
        <div v-show="!searchWorld" class="tree_box common_tree_box">
          <el-tree v-if="headOfficeArr.length" :data="headOfficeArr" highlight-current :props="defaultProps"
            @node-click="handleNode">
            <template #default="{ node }">
              <span class="custom_tree_node">
                <span>{{ node.label }}</span>
              </span>
            </template>
          </el-tree>

          <!-- <el-tree v-if="headOfficeArr.length" :data="headOfficeArr" highlight-current :props="defaultProps" @node-click="handleNode">
                  <template #default="{ node }">
                    <span class="custom_tree_node">
                      <span>{{ node.label }}</span>
                    </span>
                  </template>
                </el-tree> -->
          <!-- <template v-for="(industrialPark, index) in industrialParkArr" :key="index">
                  <el-tree v-if="industrialPark.length" :data="industrialPark"  highlight-current :props="defaultProps" @node-click="handleNode">
                    <template #default="{ node }">
                      <span class="custom_tree_node">
                        <span>{{ node.label}}</span>
                      </span>
                    </template>
                  </el-tree>
                </template>
                <el-tree v-if="manufacturerArr.length" :data="manufacturerArr" highlight-current :props="defaultProps" @node-click="handleNode">
                  <template #default="{ node }">
                    <span class="custom_tree_node" >
                      <span>{{ node.label }}</span>
                    </span>
                  </template>
                </el-tree> -->
        </div>
        <div v-if="searchWorld && !isNoSearchTree && !isSearchTreeLoading" class="tree_box searcj_tree_box">

          <el-tree v-if="searchHeadOfficeArr.length" :data="searchHeadOfficeArr" highlight-current
            :default-expand-all="true" :props="defaultProps" @node-click="handleSearchNode">
            <template #default="{ node }">
              <span class="custom_tree_node">
                <span>{{ node.label }}</span>
              </span>
            </template>
          </el-tree>

          <!-- <template v-for="(industrialPark, index) in searchIndustrialParkArr" :key="index">
            <el-tree v-if="industrialPark.length" :data="industrialPark" highlight-current :props="defaultProps"
              :default-expand-all="true" @node-click="handleSearchNode">
              <template #default="{ node }">
                <span class="custom_tree_node">
                  <span>{{ node.label }}</span>
                </span>
              </template>
            </el-tree>
          </template>
          <el-tree v-if="searchManufacturerArr.length" :data="searchManufacturerArr" highlight-current
            :default-expand-all="true" :props="defaultProps" @node-click="handleSearchNode">
            <template #default="{ node }">
              <span class="custom_tree_node">
                <span>{{ node.label }}</span>
              </span>
            </template>
          </el-tree> -->

        </div>

        <div v-if="searchWorld && isNoSearchTree && !isSearchTreeLoading" class="no_search_tree_box">
          <!-- <div
                      v-if="isNoSearchTree && !isSearchTreeLoading"
                      class="no_search_tree_box"
                    > -->
          <img src="@/assets/images/no_search_data.png" alt="" />
          暂无数据
        </div>
        <div v-if="isSearchTreeLoading" class="search_tree_loading_box">
          <el-icon class="is-loading">
            <Loading />
          </el-icon>
        </div>
      </div>
      <div style="width: 16px;height:100%;background-color:#f7f7f7;"></div>
      <div class="role_manage_container_right">
        <div class="topper">
          <div class="topper_left">
            <div class="role_name">
              {{ roleBaseInfoData.name }}
            </div>
            <div class="role_decs">
              <span class="label">角色描述：</span>
              {{ roleBaseInfoData.desc || "暂无描述" }}
            </div>
          </div>
          <div class="topper_right">
            <div class="role_btn role_edit" @click="handleEditRole">
              <EditPen style="width: 16px; height: 16px; margin-right: 4px" color="var(--default-main-color)" />
              编辑
            </div>
            <div class="role_btn" @click="handleShowDeleteDialog">
              <Delete style="width: 16px; height: 16px; margin-right: 4px" color="#999999" />
              删除
            </div>
          </div>
        </div>
        <div class="role_tabs_container" id="getTableHeight">
          <!-- @tab-click="handleClick" -->
          <el-tabs v-model="activeRoleTab" class="role_tabs">
            <el-tab-pane label="角色信息" name="first">
              <div class="role_info_box">
                <div v-if="roleBaseInfoData.name" class="role_info_title">角色基本信息</div>
                <div v-if="!isEdit" class="role_info_content">
                  <div class="role_info_content_item" v-show="roleBaseInfoData.name">
                    <div class="item_label">
                      <span class="label_required">*</span>
                      角色名称：
                    </div>
                    <div class="item_content">
                      {{ roleBaseInfoData.name }}
                    </div>
                  </div>
                  <div class="role_info_content_item" v-show="roleBaseInfoData.name">
                    <div class="item_label">角色描述：</div>
                    <div class="item_content">
                      {{ roleBaseInfoData.desc || "暂无描述" }}
                    </div>
                  </div>
                  <NoData v-if="!roleBaseInfoData.name" :text="'暂无记录~'" />
                </div>
                <div v-if="isEdit" class="role_info_content">
                  <el-form ref="mobileDialogFormRef" :model="roleFormData" label-width="120px" class="demo-ruleForm">
                    <el-form-item label="角色名称" prop="name" :rules="[{ required: true, message: '请输入角色名称' }]">
                      <div class="mobile_dialog_item" style="width: 300px">
                        <el-input v-model="roleFormData.name" maxlength="10" placeholder="请输入角色名称，不超过10个字" />
                      </div>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="verificationCode">
                      <div class="mobile_dialog_item">
                        <div class="mobile_dialog_code_box" style="width: 300px">
                          <el-input v-model="roleFormData.desc" placeholder="请输入角色描述" resize="none" type="textarea"
                            maxlength="50" show-word-limit />
                        </div>
                      </div>
                    </el-form-item>
                  </el-form>

                  <div class="role_form_btns">
                    <el-button class="role_form_btn" color="#338f7a" @click="handleSubmitEditRole">
                      确定
                    </el-button>
                    <el-button class="role_form_btn cancel_btn" color="#fff" @click="handleCloseEditRole">
                      取消
                    </el-button>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="角色权限" name="second">
              <div class="operate" @click="handleShowOperateDialog" v-show="currentNode.orgCode">操作权限
                <SvgIcon name="operate" style="margin-left: 4px;" color="var(--default-main-color)" w="16px" h="16px" />
                <!-- <EditPen style="width: 16px; height: 16px; margin-right: 4px" color="var(--default-main-color)" /> -->
              </div>
              <div class="role_menu_list_box">
                <!-- <el-table :data="roleDataRuleListTableData" :span-method="objectSpanMethod" border
                  style="width: 100%; margin-top: 20px" :height="tableHeight">
                  <el-table-column prop="systemName" label="系统" align="center" />
                  <el-table-column prop="menuItem" label="菜单" />
                  <el-table-column prop="operateName" label="功能" />
                </el-table> -->
                <el-table style="width: 100%" :height="tableHeight" :data="tableData" border :header-cell-style="{ color: '#333' }">
                  <el-table-column prop="sysName" label="系统" min-width="160" align="center" />
                  <el-table-column prop="moduleName" label="模块" min-width="160" align="center" />
                  <el-table-column prop="childName" label="子模块" min-width="160" align="center" />
                  <el-table-column prop="functionName" label="功能" min-width="160" align="center" />
                </el-table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="用户信息" name="third">
              <div class="table_box">
                <el-table :data="roleUserPageData" border width="100%" :height="tableHeight">
                  <!-- <el-table-column prop="id" label="序号" min-width="80" /> -->
                  <el-table-column label="序号" min-width="50" align="center">
                    <template #default="scope">
                      <span>{{ getTableSortNum(scope) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="userMobile" label="手机号" align="center" />
                  <el-table-column prop="userName" label="姓名" min-width="100" align="center" />
                  <el-table-column prop="createTime" label="创建时间" />
                  <el-table-column prop="userState" label="状态" min-width="80" align="center">

                    <template #default="scope">
                      <span>{{ scope.row.userState == 1 ? '启用中' : '禁用中' }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="footer_page">

                  <pageIndex @dropDownValueChange="fruitValueChange"
                    v-if="roleUserPageData && roleUserPageData.length > 0" :pageNumber="pageNumber"
                    :pageSize="pageData.pageSize" :totalCount="pageData.totalCount" />
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>



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
          <p class="tips_text">是否删除该角色</p>
        </div>
        <div class="delete_dialog_footer">
          <CommonSureBtn style="margin-right: 80px" @click="suerDeleteRole" />
          <CommonCancelBtn @click="closeDeleteDialog" />
        </div>
      </div>
    </el-dialog>
    <el-dialog v-model="isShowAddDialog" width="700" :show-close="false" :destroy-on-close="true"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <template #header>
        <div class="dialog_header">
          <div class="dialog_header_title">添加</div>
          <div class="dialog_close_btn" @click="closeAddDialog">
            <Close style="width: 24px; height: 24px" />
          </div>
        </div>
      </template>
      <div class="add_dialog_content">
        <div class="add_dialog_body">
          <el-form ref="addRoleFormRef" :model="addRoleForm" :rules="addRoleFormRule">
            <el-form-item label="父级" prop="pName">
              <div class="item_content_box">
                <div class="role_father_select_box">
                  <el-dropdown ref="addRoleDownMenu" trigger="contextmenu" placement="bottom-start" max-height="176"
                    :teleported="false" @visible-change="isShowmanufacturerDownMenu">
                    <div class="role_father_content" @click="handleOpenRoleDownMenu">
                      <div v-show="!addRoleForm.pName" class="role_father_select_placeholder">
                        请选择一个父级
                      </div>
                      <div class="role_father_name">
                        {{ addRoleForm.pName }}
                      </div>
                      <ArrowDown style="width: 12px; height: 12px" />
                    </div>
                    <template #dropdown>
                      <div class="org_role_down_menu_box">
                        <div class="role_down_menu_list">
                          <template v-for="(item, index) in rolesTreeData" :key="index">
                            <div v-if="item.length" class="role_down_menu_list_item" @click="handleClickNode(item[0])">
                              {{ item[0].name }}
                              <arrow-right style="width: 14px; height: 14px" />
                            </div>
                          </template>
                        </div>
                        <div class="role_down_menu_list">
                          <div v-for="item in roleMainChildenTree" :key="item.id" class="role_down_menu_list_item" >
                            <!-- <div
                                        v-for="item in roleMainChildenTree"
                                        :key="item.id"
                                        class="role_down_menu_list_item"
                                        @click="handleSelectParkRole(item)"
                                      > -->
                            <div class="role_down_menu_select_box">
                              <!-- <input
                                            type="checkbox"
                                            :checked="
                                              industrialParkChecked(item, industrialPark)
                                            "
                                            class="custom_checked_box"
                                          /> -->
                              <!-- <span>{{ item.name }}</span> -->
                              <el-radio v-model="addRoleForm.pid" :label="item.id" @change="roleRadioChange(item)">
                                {{ item.name }}
                              </el-radio>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="角色名称" prop="name">
              <div class="item_content_box">
                <el-input v-model="addRoleForm.name" maxlength="10" placeholder="请输入角色名称，不超过10个字" />
              </div>
            </el-form-item>
            <el-form-item label="角色描述">
              <div class="item_content_box">
                <el-input v-model="addRoleForm.desc" resize="none" type="textarea" maxlength="50" show-word-limit
                  placeholder="请输入角色描述" />
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="add_dialog_footer">
          <CommonSureBtn style="margin-right: 80px" @click="suerAddRole" />
          <CommonCancelBtn @click="closeAddDialog" />
        </div>
      </div>
    </el-dialog>
    <addOperate :isShowDialog="isShowOperateDialog" :selectIds="selectIds" :editReqData="editReqData"  @closeDialog="closeOperateDialog"/>
  </div>
</template>

<script name="RoleManage" setup>
import addOperate from './addOperate.vue'
import pageIndex from "@/layout/commonLayout/pageIndex.vue";
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import api from "@/api";
import { useDebounceFn } from "@vueuse/core";
var tableHeight = ref()
//设置表格高度，当屏幕高度发生变化时，表格高度随之变化
onMounted(() => {
  getRolesTreeData();
  if(document.getElementById('getTableHeight')) tableHeight.value = document.getElementById('getTableHeight').clientHeight - 95 - 40
  window.onresize = () => {    //写在mounted中,onresize事件会在页面大小被调整时触发
    return (() => {
      if(document.getElementById('getTableHeight')) tableHeight.value = document.getElementById('getTableHeight').clientHeight - 95 - 40
    })();
  };
});

const rolesTreeData = reactive({
  head_office: [],
  industrial_park: [],
  manufacturer: [],
});

/********************************************** 正常树形菜单角色逻辑 **********************************************/
const defaultProps = {
  children: "children",
  label: "name",
};

const currentNode = ref({});


const headOfficeArr = ref([])
// const headOfficeArr = computed(() => {

//   return rolesTreeData.head_office;
// });

const industrialParkArr = computed(() => {
  const arr = [];

  for (const key in rolesTreeData) {
    if (key !== "head_office" && key !== "manufacturer") {
      arr.push(rolesTreeData[key]);
    }
  }

  console.log("industrialParkArr", arr, rolesTreeData);
  return arr;
});

const manufacturerArr = computed(() => {
  return rolesTreeData.manufacturer;
});

const handleNode = (data) => {
  console.log('点击切换角色', data)
  if (data.level < 3) {
    return;
  }
  Object.assign(currentNode.value, data);
  isEdit.value = false;
  getRoleBaseInfoData();
  getRoleMenuTreeListData();
  getRoleUserPageData();
};

var getRolesTreeData = () => {
  const reqData = {
    roleName: "",
    orgCodes: ["head_office", "industrial_park", "manufacturer"],
  };

  api.getRoleTreeList(reqData).then((res) => {
    if (res.code !== "000000") {
      return ElMessage.error(res.message);
    }

    Object.assign(rolesTreeData, res.data);
    console.log("getRolesTreeData", rolesTreeData);

    let list = [res.data.head_office[0]]
    for (let key in res.data) {
      if (key != 'head_office' && key != 'manufacturer') list.push(res.data[key][0])
    }
    list.push(res.data.manufacturer[0])
    headOfficeArr.value = list


  });
};

/********************************************** 正常树形菜单角色逻辑 **********************************************/

/********************************************** 搜索树形菜单角色逻辑 **********************************************/
const searchWorld = ref("");
const isSearchTreeLoading = ref(false);
const isNoSearchTree = ref(false);

let searchRolesTreeData = reactive({});

const searchWorldChang = useDebounceFn(() => {
  console.log("searchWorldChang", searchWorld.value, searchRolesTreeData);

  if (!searchWorld.value) {
    isNoSearchTree.value = false;
    isSearchTreeLoading.value = false;
    return;
  }

  getSearchWorldTreeData();
}, 500);

const getSearchWorldTreeData = () => {
  const reqData = {
    roleName: searchWorld.value,
    orgCodes: ["head_office", "industrial_park", "manufacturer"],
  };

  isSearchTreeLoading.value = true;
  api
    .getRoleTreeList(reqData)
    .then((res) => {
      if (res.code !== "000000") {
        return ElMessage.error(res.message);
      }

      Object.assign(searchRolesTreeData, filterSearchRolesTreeData(res.data));
      isSearchTreeLoading.value = false;
      console.log("searchWorldChang", searchRolesTreeData);
    })
    .catch(() => {
      isSearchTreeLoading.value = false;
    });
};

// 获取搜索结果数组
const filterSearchRolesTreeData = (data) => {
  const resultData = {};

  if (!data) {
    return resultData;
  }

  let flag = true;
  for (const key in data) {
    resultData[key] = data[key];
    if (resultData[key].length) {
      flag = false;
    }
  }

  isNoSearchTree.value = flag;

  return resultData;
};

const searchHeadOfficeArr = computed(() => {
  let list = searchRolesTreeData.head_office&&searchRolesTreeData.head_office[0] ? [searchRolesTreeData.head_office[0]] : []
    for (let key in searchRolesTreeData) {
      if (key != 'head_office' && key != 'manufacturer'&&searchRolesTreeData[key]&&searchRolesTreeData[key][0]) list.push(searchRolesTreeData[key][0])
    }
    if(searchRolesTreeData.manufacturer&&searchRolesTreeData.manufacturer[0])list.push(searchRolesTreeData.manufacturer[0])
  // return searchRolesTreeData.head_office ? searchRolesTreeData.head_office : [];
  return list
});

const searchIndustrialParkArr = computed(() => {
  const arr = [];

  for (const key in searchRolesTreeData) {
    if (key !== "head_office" && key !== "manufacturer") {
      arr.push(searchRolesTreeData[key]);
    }
  }

  console.log("industrialParkArr", arr, searchRolesTreeData);
  return arr;
});

const searchManufacturerArr = computed(() => {
  return searchRolesTreeData.manufacturer
    ? searchRolesTreeData.manufacturer
    : [];
});

// 点击搜索节点
const handleSearchNode = (data) => {
  if (data.level < 3) {
    return;
  }
  Object.assign(currentNode.value, data);
  getRoleBaseInfoData();
  getRoleMenuTreeListData();
  getRoleUserPageData();
};
/********************************************** 搜索树形菜单角色逻辑 **********************************************/

/********************************************** 编辑角色逻辑 **********************************************/
const activeRoleTab = ref("first");
const roleBaseInfoData = ref({});

const isEdit = ref(false);
const roleFormData = ref({
  name: "",
  desc: "",
});

/**
 * 点击编辑角色
 */
const handleEditRole = () => {
  console.log("role_edit", currentNode);
  if (!currentNode.value.id) {
    return ElMessage.warning("请先选择角色");
  }
  if(currentNode.value.id=='32') return ElMessage.warning("当前角色不允许编辑")

  const { name, desc } = currentNode.value;
  Object.assign(roleFormData.value, { name, desc });

  isEdit.value = true;
  activeRoleTab.value = 'first'
};

const handleSubmitEditRole = () => {
  const { name, desc } = roleFormData.value;
  const { id, orgCode, pid, pidLevel, level } = roleBaseInfoData.value;
 
  const reqData = {
    name,
    desc,
    level,
    id,
    orgCode,
    pid,
    pidLevel,
    type: 1,
  };

  api.updateRole(reqData).then((res) => {
    if (res.code !== "000000") return ElMessage.error(res.message);
    ElMessage.success("编辑成功");
    getRoleBaseInfoData();
    getRolesTreeData()
  });
  handleCloseEditRole();
};

const handleCloseEditRole = () => {
  isEdit.value = false;
  Object.assign(roleFormData.value, {
    name: "",
    desc: "",
  });
};

/********************************************** 编辑角色逻辑 **********************************************/

const getRoleBaseInfoData = () => {
  const reqData = {
    roleId: currentNode.value.id,
    orgCode: currentNode.value.orgCode,
    orgId:
      currentNode.value.orgCode === "manufacturer"
        ? undefined
        : currentNode.value.orgId,
  };

  api.getRoleBaseInfo(reqData).then((res) => {
    if (res.code !== "000000") {
      return ElMessage.error(res.message);
    }

    Object.assign(roleBaseInfoData.value, res.data);
    Object.assign(currentNode.value, res.data);

    console.log("getRoleBaseInfoData", roleBaseInfoData);
  });
};

// const roleDataRuleListData = ref({});
const roleDataRuleListTableData = ref([]);
const selectIds = ref([])
const editReqData = ref({})
const tableData = ref([])
const getRoleMenuTreeListData = () => {
  const reqData = {
    roleId: currentNode.value.id,
    orgCode: currentNode.value.orgCode,
    orgId:
      currentNode.value.orgCode === "manufacturer"
        ? undefined
        : currentNode.value.orgId,
  };
  
  api.getRoleMenuTreeList({roleId:reqData.roleId}).then((res) => {
    if (res.code !== "000000") {
      return ElMessage.error(res.message);
    }
    editReqData.value = reqData
  
    const flatten = (data,pid) =>{
      return data.reduce((arr, { id, name, type,level,permission,orgCode,sysUrls,isShow,sort,children = []}) =>
        arr.concat([{id, name,pid,type,level,permission,orgCode,sysUrls,isShow,sort}], flatten(children,id)), [])
    }
    // Object.assign(roleDataRuleListData.value, res.data);
    let temp = flatten(res.data,'-1')
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
     if(item.type == 4) {
        return {
          ...item,
          sysName: '',
          moduleName: '',
          childName: '',
          functionName: item.name,
        }
     } 

   })
    tableData.value = newArr || [];
    // roleDataRuleListTableData.value = dealMenuTableData(res.data);
    selectIds.value = res.data;
    
    console.log("getRolesTreeData00000000", res.data);
  });
};

const dealMenuTableData = (data) => {
  const tableData = [];
  if (!data.length) {
    return tableData;
  }

  data[0].children.map((item) => {
    item.children.map((childrenItem, childrenIndex, childrenArr) => {
      const itemData = {
        systemName: data[0].name,
        menuItem: item.name,
        operateName: childrenItem.name,
        isOverRow: childrenIndex === 0 ? true : false,
        rowspan: childrenIndex === 0 ? childrenArr.length : undefined,
      };

      tableData.push(itemData);
    });
  });

  return tableData;
};
const objectSpanMethod = (data) => {
  const { row, column, rowIndex, columnIndex } = data;

  if (columnIndex === 0) {
    if (rowIndex === 0) {
      return {
        rowspan: roleDataRuleListTableData.value.length,
        colspan: 1,
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      };
    }
  }

  if (columnIndex === 1) {
    console.log(row, column);
    if (row.isOverRow) {
      return {
        rowspan: row.rowspan,
        colspan: 1,
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      };
    }
  }
};

/********************************************** 用户信息列表逻辑 **********************************************/
const roleUserPageData = ref([]);
const pageNumber = ref(1)
const pageData = ref({
  pageNumber: 1,
  pageSize: 15,
  pageSizeArr: [15, 30, 50, 100],
  totalCount: 0,
  jumpNumber: "",
});

const getRoleUserPageData = () => {
  const { pageNumber, pageSize } = pageData.value;
  const reqData = {
    roleId: currentNode.value.id,
    language: "zh-cn",
    pageNumber,
    pageSize,
    orgCode: currentNode.value.orgCode,
    orgId:
      currentNode.value.orgCode === "manufacturer"
        ? undefined
        : currentNode.value.orgId,
  };

  api.getRoleUserPage(reqData).then((res) => {
    if (res.code !== "000000") {
      return ElMessage.error(res.message);
    }

    roleUserPageData.value = res.data.items;
    pageData.value.totalCount = res.data.totalCount;
    // console.log("getRolesTreeData", roleDataRuleListData);
  });
};

const getTableSortNum = computed(() => (scope) => {
  let num =
    (pageData.value.pageNumber - 1) * pageData.value.pageSize +
    scope.$index +
    1;

  // if (scope.)
  return num;
});

//分页模块改变的值
const fruitValueChange = (val) => {
  console.log('改变分页模块的值：', val)
  if (val.pageNumber) pageNumber.value = val.pageNumber
  pageData.value = Object.assign(pageData.value, val)
  getRoleUserPageData();
}
// 页数改变
// const handleCurrentPageChange = (current) => {
//   pageData.value.pageNumber = current;
//   if (!currentNode.value.id) {
//     return;
//   }

//   getRoleUserPageData();
// };


// // 条数改变
// const handleSizeChange = (size) => {
//   if (!currentNode.value.id) {
//     return;
//   }
//   pageData.value.pageNumber = 1;
//   pageData.value.pageSize = size;
//   getRoleUserPageData();
// };

// 条数改变
// const blurToJump = () => {
//   if (!currentNode.value.id) {
//     return;
//   }
//   pageData.value.pageNumber = parseInt(pageData.value.jumpNumber || 1, 10);
//   getRoleUserPageData();
// };
/********************************************** 用户信息列表逻辑 **********************************************/

/********************************************** 删除弹窗逻辑 **********************************************/
const isShowDeleteDialog = ref(false);
const handleShowDeleteDialog = () => {
  if (!currentNode.value.id) {
    return ElMessage.warning("请先选择需要删除的角色");
  }
  if(currentNode.value.id=='32') return ElMessage.warning("当前角色不允许删除")
  

  isShowDeleteDialog.value = true;
};

// 关闭弹窗
const closeDeleteDialog = () => {
  isShowDeleteDialog.value = false;
};

// 删除角色
const suerDeleteRole = () => {
  console.log("删除角色");
  const reqData = {
    id: currentNode.value.id,
  };

  console.log("删除角色", reqData, currentNode.value);

  api.delRoleById(reqData).then((res) => {
    if (res.code !== "000000") {
      return ElMessage.error(res.message);
    }

    closeDeleteDialog();
    ElMessage.success("删除成功");

    // 重置数据
    clearNodeData();
    getRolesTreeData();
    if (searchWorld.value) {
      console.log("删除成功", searchRolesTreeData);
      getSearchWorldTreeData();
    }
  });
};

const clearNodeData = () => {
  currentNode.value = {};
  roleBaseInfoData.value = {};
  roleDataRuleListTableData.value = [];
  roleUserPageData.value = [];
  pageData.value.pageNumber = 1;
};
/********************************************** 删除弹窗逻辑 **********************************************/

/********************************************** 新增弹窗逻辑 **********************************************/
const isShowAddDialog = ref(false);
// const roleMainTree = ref([]);
const addRoleFormRef = ref(null);
const addRoleDownMenu = ref(null);
const roleMainChildenTree = ref([]);

const addRoleForm = ref({
  desc: "",
  level: 0,
  pName: "",
  name: "",
  orgCode: "",
  orgId: null,
  pid: null,
  type: 1,
});

const addRoleFormRule = ref({
  name: [{ required: true, message: "角色名称不能为空" }],
  pName: [{ required: true, message: "父级不能为空" }],
});

// 打开新增弹窗
const handleShowAddDialog = () => {
  isShowAddDialog.value = true;
};

// 打开父级选择弹窗
const handleOpenRoleDownMenu = () => {
  addRoleDownMenu.value.handleOpen();
};

// 点击一级
const handleClickNode = (data) => {
  console.log(data);
  let orgId = null;

  if (data.orgCode === "head_office") {
    orgId = -1;
  }

  if (data.orgCode === "industrial_park") {
    orgId = data.orgId;
  }

  // 根据变更的父级id获取其子集角色
  const reqData = {
    orgCode: data.orgCode,
    orgId,
  };

  api.getRoleTreeByOrg(reqData).then((res) => {
    roleMainChildenTree.value = res.data[0].children;
  });
};

// 子集单选框变化
const roleRadioChange = (item) => {
  let orgId = null;
  if (item.orgCode === "head_office") {
    orgId = -1;
  }

  if (item.orgCode === "industrial_park") {
    orgId = item.orgId;
  }

  const newData = {
    pName: item.name,
    orgCode: item.orgCode,
    orgId,
    level: item.level + 1,
  };

  Object.assign(addRoleForm.value, newData);
  console.log(item, newData, addRoleForm.value);
};

// 关闭添加弹窗
const closeAddDialog = () => {
  isShowAddDialog.value = false;
  Object.assign(addRoleForm.value, {
    desc: "",
    level: 0,
    pName: "",
    name: "",
    orgCode: "",
    orgId: null,
    pid: null,
  });
};

// 确定添加角色
const suerAddRole = () => {
  addRoleFormRef.value.validate((valid) => {
    console.log(valid);
    if (!valid) {
      return;
    }

    console.log("确定添加角色", addRoleForm.value);

    // 添加角色
    api.saveRole(addRoleForm.value).then((res) => {
      console.log("确定添加角色", res);

      if (res.code !== "000000") {
        return ElMessage.error(res.message);
      }

      ElMessage.success("新增成功");
      closeAddDialog();

      getRolesTreeData();
      if (searchWorld.value) {
        searchRolesTreeData();
      }
    });
  });
};
/********************************************** 新增弹窗逻辑 **********************************************/

/********************************************** 操作权限 **********************************************/
const isShowOperateDialog = ref(false)
const handleShowOperateDialog = (type,row) => {
  isShowOperateDialog.value = true;
};

const closeOperateDialog =(val) => {
  isShowOperateDialog.value = val
  getRoleMenuTreeListData()
}
</script>

<style lang="scss" scoped>
.role_manage_page {
  width: 100%;
  box-sizing: border-box;
  padding: 16px 24px 16px;
  height: 100%;
  overflow: hidden;

  .role_manage_container {
    width: 100%;
    // min-height: calc(100vh - 120px);
    height: calc(100% - 40px);
    background-color: #fff;

    display: flex;
    overflow: hidden;

    .role_manage_container_left {
      width: 290px;

      // height: 100%;
      // height: calc(100% - 108px);
      // overflow-y: auto;
      box-sizing: border-box;

      // border-right: 1px solid #e0e0e0;
      // :deep(.is-current.is-focusable){
      //   background-color: #f2f6f5;
      //   color:var(--default-main-color);
      .common_tree_box {
        overflow: hidden;
        &:hover{
          overflow: auto;
        }
        &::-webkit-scrollbar {
          width: 4px !important;
          height: 4px !important;
          z-index: 99999;
        }

        // 页面滚动条设置
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          border-radius: 10px;
          // background-color: rgba(144, 146, 152, 0.5);
          background-color: #e0e0e0 !important;
          cursor: pointer !important;
          z-index: 99999;
        }
      }

      // }

      .topper {

        width: 290px;
        box-sizing: border-box;
        padding: 20px 20px 16px;

        display: flex;

        .search_input_box {
          // width: 182px;
          flex: 1;

          :deep(.el-input__wrapper) {
            border-radius: 20px;
            background-color: #F2F2F2;

            border: none !important;

            box-shadow: none !important;

            // padding: 0px; //前边边距去掉

            .el-input__inner {
              border: 0 !important;
            }
          }
        }

        .add_role_btn {
          margin-left: 10px;
          font-size: 16px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: var(--default-main-color);
          display: flex;
          align-items: center;
          cursor: pointer;

          &:hover {
            opacity: 0.7;
          }
        }
      }

      .tree_box {
        padding-left: 14px;
        box-sizing: border-box;
        height: calc(100% - 68px);
        
      }

      

      .no_search_tree_box {
        font-size: 14px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 22px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        >img {
          width: 36px;
          height: 36px;
          margin-bottom: 5px;
        }
      }

      .search_tree_loading_box {
        min-height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .role_manage_container_right {
      width: calc(100% - 316px);
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .topper {
        height: 90px;
        padding: 20px 20px 0;
        box-sizing: border-box;
        border-bottom: 1px solid #f2f2f2;
        display: flex;
        justify-content: space-between;

        .topper_left {
          .role_name {
            margin-bottom: 12px;
            font-size: 16px;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
            color: #333333;
          }

          .role_decs {
            font-size: 14px;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
            color: #333333;

            .label {
              font-size: 14px;
              font-family: Microsoft YaHei-Regular, Microsoft YaHei;
              font-weight: 400;
              color: #666666;
            }
          }
        }

        .topper_right {
          display: flex;

          .role_btn {
            height: 24px;
            font-size: 16px;
            font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            font-weight: 400;
            color: #666666;
            cursor: pointer;
            display: flex;
            align-items: center;
            user-select: none;

            &:hover {
              opacity: 0.7;
            }

            &.role_edit {
              margin-right: 25px;
              color: var(--default-main-color);
            }
          }
        }
      }

      .role_tabs_container {
        padding: 20px;
        box-sizing: border-box;
        height: calc(100% - 46px);
        overflow: hidden;
        display: flex;
        flex-direction: column;

        :deep(.el-tabs__item) {
          &:hover {
            color: var(--default-main-color);
          }

          &.is-active {
            color: var(--default-main-color);
          }
        }

        :deep(.el-tabs__active-bar) {
          background-color: var(--default-main-color);
        }

        .role_info_box {
          .role_info_title {
            margin-bottom: 19px;
            font-size: 14px;
            font-family: Source Han Sans CN-Medium, Source Han Sans CN;
            font-weight: 500;
            color: #333333;
          }

          .role_info_content {
            margin-bottom: 15px;

            .role_info_content_item {
              min-height: 32px;
              margin-bottom: 8px;
              display: flex;
              align-items: center;

              &:last-child {
                margin-bottom: 0;
              }

              .item_label {
                width: 106px;
                // padding: 0 12px;
                box-sizing: border-box;
                font-size: 14px;
                font-family: PingFang SC-Regular, PingFang SC;
                font-weight: 400;
                color: #666666;
                display: flex;
                justify-content: flex-end;
                align-items: center;

                .label_required {
                  margin-right: 4px;
                  color: red;
                }
              }

              .item_content {
                font-size: 14px;
                font-family: Source Han Sans CN-Regular, Source Han Sans CN;
                font-weight: 400;
                color: #333333;
              }
            }

            .role_form_btns {
              padding-left: 120px;
              display: flex;

              .role_form_btn {
                &:hover {
                  opacity: 0.7;
                }

                &.cancel_btn {
                  color: #606266;
                  border: 1px solid #e0e0e0;
                }
              }
            }
          }
        }

        .table_box {
          width: 100%;
          // height: 300px;
          // height: calc(100% - 150px);
          overflow: hidden;

          &::-webkit-scrollbar {
            width: 5px;
            height: 5px;
          }

          .footer_page {

            position: fixed;
            right: 34px;
            bottom: 44px;




          }
        }

        .role_menu_list_body {
          .role_menu_list_body_item {
            // height: 40px;
            box-sizing: border-box;
            font-size: 14px;
            font-family: Source Han Sans CN-Regular, Source Han Sans CN;
            font-weight: 400;
            color: #333333;
            align-items: center;

            .item_system {
              box-sizing: border-box;
              display: flex;

              .item_system_conternt {
                box-sizing: border-box;
                flex-grow: 4;
              }

              .item_menu {
                box-sizing: border-box;
                flex-grow: 8;
              }
            }
          }
        }
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

:deep(.el-textarea__inner) {
  min-height: 70px !important;
}

:deep(.el-tree) {
  margin: 3px 0;

  .el-tree-node {
    margin: 3px 0;
  }

  .el-tree-node__content {
    margin: 3px 0;

  }


  .el-tree-node.is-current>.el-tree-node__content {
    background-color: #f2f6f5;
    color: var(--default-main-color);
    border-right: 2px solid var(--default-main-color);

  }

  // 给第一层改样式
  // >.el-tree-node{
  //   >.el-tree-node__content{
  //     >.custom_tree_node{
  //       >span{
  //         font-weight: 600;
  //       }
  //     }
  //   }
  // }

}

.add_dialog_content {
  min-height: 240px;

  .add_dialog_body {
    box-sizing: border-box;
    padding: 16px 32px;
    min-height: 344px;
    display: flex;

    .item_content_box {
      width: 382px;

      .role_father_select_box {
        box-sizing: border-box;
        box-shadow: 0 0 0 1px #dcdfe6 inset;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &:hover {
          box-shadow: 0 0 0 1px #c0c4cc inset;
          
        }

        .role_father_content {
          width: 382px;
          height: 32px;
          box-sizing: border-box;
          padding: 0 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .role_father_select_placeholder {
          font-size: 14px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
        }
      }
    }

    :deep(.el-form-item__label) {
      width: 80px;
    }
  }

  .add_dialog_footer {
    height: 96px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

:deep(.el-table__header) {
  th {
    background-color: #f2f2f2;
  }
}

:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: var(--default-main-color);
}

:deep(.el-dialog__header) {
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

.org_role_down_menu_box {
  min-width: 180px;
  // max-height: 300px;
  display: flex;

  .role_down_menu_list {
    min-width: 180px;
    max-height: 176px;
    box-sizing: border-box;
    padding: 8px 0;
    overflow-y: auto;

    .role_down_menu_list_item {
      width: 180px;
      height: 32px;
      padding: 0 12px 0 28px;
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &:hover {
        // opacity: 0.7;
        color:var(--default-main-color)
      }
    }
  }
}

:deep(.el-dialog__body) {
  padding: 0;
}
.operate{
  font-size: 14px;
  font-family: Source Han Sans CN-Medium, Source Han Sans CN;
  font-weight: 500;
  margin-bottom: 15px; 
  color: #333333;
  cursor: pointer;
}
</style>
