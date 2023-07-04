<template>
  <div class="add_new_user_page">

    <CommonBreadCrumb :first="'用户管理'" :marginBottom="'16px'" />
    <div class="add_new_user_container">
      <div class="add_new_user_info_box">
        <div class="add_new_info_container">
          <div class="user_info_box">
            <div class="blank_title_box">用户基础信息</div>
            <el-form ref="ruleFormRef" :model="userInfoData" :rules="userInfoDataRules">
              <div class="info_box">
                <div class="info_item_group">
                  <el-form-item class="info_item_content_box" label="姓名" prop="userName">
                    <div class="info_item">
                      <div class="info_item_content">
                        <div class="info_item_input_box">
                          <el-input v-model.trim="userInfoData.userName" maxlength="5" placeholder="最多可输入5个字" />
                        </div>
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item class="info_item_content_box" label="手机号" prop="userMobile">
                    <div class="info_item">
                      <div class="info_item_content">
                        <div class="info_item_input_box">
                          <el-input v-model.trim="userInfoData.userMobile" maxlength="11" placeholder="最多可输入11位数字" />
                        </div>
                      </div>
                    </div>
                  </el-form-item>
                </div>
                <div class="info_item_group">
                  <div class="info_item">
                    <div class="info_item_label">
                      <span class="info_item_require">*</span>
                      是否启用
                    </div>
                    <div class="info_item_content">
                      <div class="info_item_radio_box">
                        <el-radio-group v-model="userInfoData.userState" :text-color="'#338f7a'" :fill="'#338f7a'">
                          <el-radio :label="1">启用</el-radio>
                          <el-radio :label="2">禁用</el-radio>
                        </el-radio-group>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-form>
          </div>
          <div class="user_role_box">
            <div class="blank_title_box">用户角色</div>
            <div class="addOrg">
              <span class="submitIcon addIcon" v-if="orgList.length <= orgData.length" @click="handleAddOrg">
                <SvgIcon name="add" color="white" w="16px" h="16px" />新增组织
              </span>
            </div>
            <div class="user_roles_wrap">
              <div class="user_roles_list">
                <div class="user_roles_box" v-for="(par, pIndex) in orgList">
                  <div class="leftBox">
                    <div class="user_roles_box_top">
                      <div class="roles_label role_item_label">
                        <span class="roles_label_require">*</span>
                        所属组织
                      </div>
                      <div class="roles_content">
                        <el-select v-model="par.orgValue" class="m-2" placeholder="请选择组织" @change="orgChange($event, par)">
                          <el-option v-for="item in orgData" :key="item.itemCode" :label="item.itemValue"
                            :disabled="isSelectOrg(item.itemCode)" :value="item.itemCode" />
                        </el-select>
                      </div>
                    </div>
                    <div v-if="par.orgValue === 'head_office'" class="user_roles_box_bottom head_office_box">
                      <div class="role_item">
                        <div class="roles_label role_item_label">
                          <span class="roles_label_require">*</span>
                          所属角色
                        </div>
                        <div class="roles_content">
                          <el-dropdown trigger="click" placement="bottom-start" max-height="176" :teleported="false">
                            <div class="org_role_down_box">
                              <div class="select_content">
                                <div v-for="item in par.headOfficeSelectArr" :key="item.id" class="select_tag"
                                  @click.stop="handleRemoveTag(item, par)">
                                  {{ item.name }}
                                  <Close style="width: 14px; height: 14px; margin-left: 4px" />
                                </div>
                              </div>
                              <div class="down_menu_icon">
                                <arrow-down style="width: 14px; height: 14px" />
                              </div>
                            </div>
                            <template #dropdown>
                              <div class="org_role_down_menu_box">
                                <div class="role_down_menu_list">
                                  <div v-for="item in headOfficeData" :key="item.id" class="role_down_menu_list_item"
                                    @click="handleSelectRoleView(item)">
                                    {{ item.name }}
                                    <arrow-right style="width: 14px; height: 14px" />
                                  </div>
                                </div>
                                <div class="role_down_menu_list">
                                  <div v-for="item in headOfficeChildrenData" :key="item.id"
                                    class="role_down_menu_list_item" @click="handleSelectNode(item, par)">
                                    <div class="role_down_menu_select_box">
                                      <span class="custom_checked_box" :class="{
                                          checked: headOfficeSelectData.includes(item.id),
                                        }">
                                        <Check v-show="headOfficeSelectData.includes(item.id)"
                                          style="width: 13px; height: 13px; color: #fff" />
                                      </span>
                                      <span>{{ item.name }}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </template>
                          </el-dropdown>
                        </div>
                      </div>
                    </div>
                    <!-- 产业园模块 -->
                    <div v-if="par.orgValue === 'industrial_park'" class="user_roles_box_bottom industrial_park_box">
                      <div v-for="(industrialPark, index) in par.industrialParkListArr" :key="industrialPark.id"
                        class="role_blank">
                        <div class="role_blank_left">
                          <div class="user_roles_box_top">
                            <div class="roles_label role_item_label">
                              <span class="roles_label_require">*</span>
                              {{ getSortByLetterText("所属产业园", index) }}
                            </div>
                            <div class="roles_content">
                              <el-select v-model="industrialPark.currentSelect" class="m-2" placeholder="请选择产业园" @change="currentSelectChange(industrialPark, industrialParkList)
                                ">
                                <el-option v-for="item in industrialParkList" :key="item.id" :label="item.parkName"
                                  :value="item.id" :disabled="isParkSelected(item, par)" />
                              </el-select>
                            </div>
                          </div>
                          <div class="role_item">
                            <div class="roles_label role_item_label">
                              <span class="roles_label_require">*</span>
                              {{ getSortByLetterText("所属角色", index) }}
                            </div>
                            <div class="roles_content">
                              <el-dropdown :ref="(el) => parkRef(el, index, par)" trigger="contextmenu"
                                placement="bottom-start" max-height="176" :teleported="false"
                                @visible-change="isShowindustrialParkDownMenu">
                                <div class="org_role_down_box" @click="handleShowParkRoleMenu(
                                    index,
                                    industrialPark,
                                    industrialParkList,
                                    par
                                  )
                                  ">
                                  <div class="select_content">
                                    <div v-for="item in industrialPark.selectedArr" :key="item.id" class="select_tag"
                                      @click.stop="handleParkRemoveTag(item, industrialPark)">
                                      {{ item.name }}
                                      <Close style="width: 14px;height: 14px;margin-left: 4px;" />
                                    </div>
                                  </div>
                                  <div class="down_menu_icon">
                                    <arrow-down style="width: 14px; height: 14px" />
                                  </div>
                                </div>
                                <template #dropdown>
                                  <div class="org_role_down_menu_box">
                                    <div class="role_down_menu_list">
                                      <div v-for="item in industrialPark.children" :key="item.id"
                                        class="role_down_menu_list_item" @click="handleSelectParkNode(item)">
                                        {{ item.name }}
                                        <arrow-right style="width: 14px; height: 14px" />
                                      </div>
                                    </div>
                                    <div class="role_down_menu_list">
                                      <div v-for="item in industrialParkRoleArr" :key="item.id"
                                        class="role_down_menu_list_item" @click="handleSelectParkRole(item, par)">
                                        <div class="role_down_menu_select_box">
                                          <span class="custom_checked_box"
                                            :class="{ checked: industrialParkChecked(item, industrialPark), }">
                                            <Check v-show="industrialParkChecked(item, industrialPark)"
                                              style="width: 13px;height: 13px;color: #fff;" />
                                          </span>
                                          <span>{{ item.name }}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </template>
                              </el-dropdown>
                            </div>
                          </div>
                        </div>
                        <div class="role_blank_right">
                          <span v-if="par.industrialParkListArr.length > 1" class="submitIcon"
                            @click="handleRemovePark(index, par)">
                            <SvgIcon color="var(--default-main-color)" name="del" w="20px" h="20px" />
                          </span>
                          <span v-if="index == par.industrialParkListArr.length - 1" class="submitIcon addIcon"
                            @click="handleAddPark(par)">
                            <!-- <SvgIcon name="add" color="white" w="20px" h="20px" /> -->
                            +
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- 加工商模块 -->
                    <div v-if="par.orgValue === 'manufacturer'" class="user_roles_box_bottom user_roles_box_top_box">
                      <div v-for="(manufacturer, index) in par.manufacturerListArr" :key="manufacturer.id"
                        class="role_blank">
                        <div class="role_blank_left">
                          <div class="user_roles_box_top">
                            <div class="roles_label role_item_label">
                              <span class="roles_label_require">*</span>
                              {{ getSortByLetterText("所属加工商", index) }}
                            </div>
                            <div class="roles_content">
                              <el-select v-model="manufacturer.currentSelect" class="m-2" placeholder="请选择加工商" @change="currentmanufacturerSelectChange(
                                  manufacturer,
                                  manufacturerList
                                )
                                ">
                                <el-option v-for="item in manufacturerList" :key="item.manufacturerId"
                                  :label="item.manufacturerName" :value="item.manufacturerId"
                                  :disabled="isManufacturerSelected(item, par) || item.enableStatus == 2" />
                              </el-select>
                            </div>
                          </div>
                          <div class="role_item">
                            <div class="roles_label role_item_label">
                              <span class="roles_label_require">*</span>
                              {{ getSortByLetterText("所属角色", index) }}
                            </div>
                            <div class="roles_content">
                              <el-dropdown :ref="(el) => manufacturerRef(el, index, par)" trigger="contextmenu"
                                placement="bottom-start" max-height="176" :teleported="false"
                                @visible-change="isShowmanufacturerDownMenu">
                                <div class="org_role_down_box" @click="handleShowManufacturerRoleMenu(
                                    index,
                                    manufacturer,
                                    manufacturerList,
                                    par
                                  )
                                  ">
                                  <div class="select_content">
                                    <div v-for="item in manufacturer.selectedArr" :key="item.id" class="select_tag"
                                      @click.stop="handleManufacturerRemoveTag(item, manufacturer)">
                                      {{ item.name }}
                                      <!-- <Close v-if="item.id !== '32'" style=" width: 14px;height: 14px;margin-left: 4px;" /> -->
                                      <Close style=" width: 14px;height: 14px;margin-left: 4px;" />
                                    </div>
                                  </div>
                                  <div class="down_menu_icon">
                                    <arrow-down style="width: 14px; height: 14px" />
                                  </div>
                                </div>
                                <template #dropdown>
                                  <div class="org_role_down_menu_box">
                                    <div class="role_down_menu_list">
                                      <div v-for="item in manufacturer.children" :key="item.id"
                                        class="role_down_menu_list_item" @click="handleSelectManufacturerNode(item)">
                                        {{ item.name }}
                                        <arrow-right style="width: 14px; height: 14px" />
                                      </div>
                                    </div>
                                    <div class="role_down_menu_list">
                                      <div v-for="item in manufacturerRoleArr" :key="item.id"
                                        class="role_down_menu_list_item" @click="handleSelectManufacturerRole(item, manufacturer)
                                          ">
                                        <div class="role_down_menu_select_box">
                                          <span class="custom_checked_box" :class="{
                                              checked: industrialManufacturerChecked(
                                                item,
                                                manufacturer
                                              ),
                                              // deisable: item.id === '32',
                                              // deisable: hasBoss() && item.id === '32',
                                            }">
                                            <Check v-show="industrialManufacturerChecked(item, manufacturer)"
                                              style="width: 13px;height: 13px;color: #fff;" />
                                          </span>
                                          <span>{{ item.name }}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </template>
                              </el-dropdown>
                            </div>
                          </div>
                        </div>
                        <div class="role_blank_right">
                          <!-- <span v-if="par.manufacturerListArr.length > 1" class="submitIcon"
                            @click="handleRemoveManufacturer(index,par)">
                            <SvgIcon name="del" w="16px" h="16px" />删除
                          </span>
                          <span v-if="index == par.manufacturerListArr.length - 1" class="submitIcon addIcon"
                            @click="handleAddManufacturer(par)">
                            <SvgIcon name="add" color="white" w="16px" h="16px" />新增
                          </span> -->
                          <span v-if="par.manufacturerListArr.length > 1" class="submitIcon"
                            @click="handleRemoveManufacturer(index, par)">
                            <SvgIcon color="var(--default-main-color)" name="del" w="20px" h="20px" />
                          </span>
                          <span v-if="index == par.manufacturerListArr.length - 1" class="submitIcon addIcon"
                            @click="handleAddManufacturer(par)">
                            +
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="btns" v-if="orgList.length > 1">
                    <span class="submitIcon" @click="handleRemoveOrg(pIndex)">
                      <SvgIcon name="del" w="16px" h="16px" />删除
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div class="bottom_box">
            <div class="submitBox">
              <el-button type="primary" class="search_button" @click="handleSave">确认</el-button>
              <el-button class="reset_button" @click="handleCancelSave()">取消</el-button>
            </div>
          </div>
        </div>
      </div>


    </div>
    <el-dialog v-model="isShowSaveDialog" width="500" :show-close="false" :destroy-on-close="true"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <template #header>
        <div class="dialog_header">
          <div class="dialog_header_title">提示</div>
          <div class="dialog_close_btn" @click="closeSaveDialog">
            <Close style="width: 24px; height: 24px" />
          </div>
        </div>
      </template>
      <div class="save_dialog_content">
        <div class="save_dialog_body">
          <p class="tips_text">确定保存？</p>
        </div>
        <div class="save_dialog_footer">
          <CommonSureBtn style="margin-right: 80px" @click="suerSaveRole" />
          <CommonCancelBtn @click="closeSaveDialog" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script name="AddNewUser" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import api from "@/api";
import { useRouter } from "vue-router";
import {
  isMobile,
  isLegitimateString,
  getSortByLetterText,
} from "@/utils/commonUtils";

onMounted(() => {
  getRolesTreeData();
  getMapData();
  getIndustrialParkList();
  getAllManufacturerList();
});

const router = useRouter();
const isShowSaveDialog = ref(false); // 保存之前弹窗
const ruleFormRef = ref(null);

const orgList = ref([
  {
    orgValue: 'head_office',
    headOfficeSelectArr: [],
    industrialParkListArr: [],
    manufacturerListArr: []
  }
])
const userInfoData = reactive({
  roleIds: [],
  userMobile: "",
  userName: "",
  userState: 1,
});

const mobileValidator = (rule, value, callback) => {
  if (!isMobile(value)) {
    return callback(new Error("请输入正确的手机号"));
  }

  return callback();
};

const userNameValidator = (rule, value, callback) => {
  if (!isLegitimateString(value)) {
    return callback(new Error("只能输入中文、英文、数字及下划线"));
  }

  return callback();
};

const userInfoDataRules = reactive({
  userMobile: [
    {
      required: true,
      message: "手机号码不能为空",
      trigger: ["blur"],
    },
    {
      validator: mobileValidator,
      trigger: ["blur"],
    },
  ],
  userName: [
    {
      required: true,
      message: "姓名不能为空",
    },
    {
      validator: userNameValidator,
      trigger: ["blur"],
    },
  ],
});

/********************************************** 获取角色树 **********************************************/
const rolesTreeData = reactive({
  head_office: [],
  industrial_park: [],
  manufacturer: [],
});

const getRolesTreeData = () => {
  const reqData = {
    roleName: "",
    orgCodes: ["head_office", "industrial_park", "manufacturer"],
  };

  api.getRoleTreeList(reqData).then((res) => {
    if (res.code !== "000000") {
      return ElMessage.error(res.message);
    }

    Object.assign(rolesTreeData, res.data);
  });
};

/********************************************** 获取角色树 **********************************************/

/********************************************** 获取组织数据 **********************************************/
const orgValue = ref("head_office");
const orgData = ref([]);

const headOfficeSelectData = ref([]);
const headOfficeSelectArr = ref([]);
const headOfficeData = computed(() => {
  if (orgValue.value === "head_office") {
    if (rolesTreeData[orgValue.value].length) {
      return rolesTreeData[orgValue.value][0].children;
    } else {
      return [];
    }
  }

  return [];
});
const headOfficeChildrenData = ref([]);

const handleSelectRoleView = (data) => {
  headOfficeChildrenData.value = data.children;
};

// 获取组织列表
const getMapData = () => {
  const reqData = {
    itemType: "org",
  };
  api.getMapData(reqData).then((res) => {
    orgData.value = res.data;
  });
};

// 选择组织
const orgChange = (value, item) => {
  console.log(value, item)
  item.headOfficeSelectArr = [];
  item.industrialParkListArr = [];
  item.manufacturerListArr = [];

  if (value === "industrial_park") {
    item.industrialParkListArr.push({
      el: null,
      currentSelect: "",
      id: "",
      parkName: "",
      children: [], // 从产业园里获取默认对应产业园的角色数据
      selectedArr: [],
    });
  }

  if (value === "manufacturer") {
    item.manufacturerListArr.push({
      el: null,
      currentSelect: "",
      manufacturerId: "",
      manufacturerName: "",
      children: [],
      selectedArr: [],
    });
  }
};

// 选择角色
const handleSelectNode = (data, par) => {
  let flag = headOfficeSelectData.value.find((item) => item === data.id);

  if (flag) {
    headOfficeSelectData.value = headOfficeSelectData.value.filter(
      (item) => item !== data.id
    );
    par.headOfficeSelectArr = par.headOfficeSelectArr.filter(
      (item) => item.id !== data.id
    );
  } else {
    headOfficeSelectData.value.push(data.id);
    par.headOfficeSelectArr.push(data);
  }
};

// 移除角色标签
const handleRemoveTag = (data, par) => {
  headOfficeSelectData.value = headOfficeSelectData.value.filter(
    (item) => item !== data.id
  );
  par.headOfficeSelectArr = par.headOfficeSelectArr.filter(
    (item) => item.id !== data.id
  );
};
/********************************************** 获取组织数据 **********************************************/

/********************************************** 选择产业园逻辑 **********************************************/
const industrialParkList = ref([]);
const industrialParkRoleArr = ref([]);
let industrialParkListArr = reactive([]);
const parkRef = (el, index, par) => {
  if (el) {
    par.industrialParkListArr[index].el = el;
  }
};

// 获取产业园列表
const getIndustrialParkList = () => {
  api.getIndustrialParkList().then((res) => {
    industrialParkList.value = res.data;
  });
};

// 产业园下拉选择变更事件
const currentSelectChange = (industrialPark, industrialParkList) => {
  industrialPark.selectedArr = [];
  industrialPark.children = [];
  const valData = industrialParkList.find(
    (item) => item.id === industrialPark.currentSelect
  );

  Object.assign(industrialPark, {
    id: valData.id,
    parkName: valData.parkName,
  });
};

// 产业园点击节点
const handleSelectParkNode = (item) => {
  industrialParkRoleArr.value = item.children;
};

// 移除对应产业园选中角色
const handleParkRemoveTag = (val, industrialPark) => {
  industrialPark.selectedArr = industrialPark.selectedArr.filter(
    (item) => item.id !== val.id
  );
};

// 角色是否被选择
const industrialParkChecked = computed(() => (val, industrialPark) => {
  let selectItem = industrialPark.selectedArr.find(
    (item) => item.id === val.id
  );
  if (selectItem) {
    return true;
  }

  return false;
});

// 产业园是否被选择
const isParkSelected = computed(() => (val, par) => {
  let selectItem = par.industrialParkListArr.find((item) => item.id === val.id);
  if (selectItem) {
    return true;
  }

  return false;
});

// 选择产业园角色
const handleSelectParkRole = (item, par) => {
  const currentPark = par.industrialParkListArr.find(
    (currentItem) => item.orgId === currentItem.id
  );

  let hasItem = currentPark.selectedArr.find(
    (selectedItem) => selectedItem.id === item.id
  );

  if (hasItem) {
    currentPark.selectedArr = currentPark.selectedArr.filter(
      (selectedItem) => selectedItem.id !== item.id
    );
  } else {
    currentPark.selectedArr = [...currentPark.selectedArr, item];
  }
};

// 添加产业园
const handleAddPark = (par) => {
  if (industrialParkList.value.length === par.industrialParkListArr.length) {
    return ElMessage.warning(
      `当前只有${industrialParkList.value.length}个产业园`
    );
  }

  par.industrialParkListArr.push({
    el: null,
    currentSelect: "",
    id: "",
    manufacturerName: "",
    children: [],
    selectedArr: [],
  });
};

// 移除产业园
const handleRemovePark = (index, par) => {
  if (industrialParkListArr.length === 1) {
    return ElMessage.warning("至少保持一项");
  }

  par.industrialParkListArr.splice(index, 1);
};

// 产业园下拉菜单显示隐藏事件
const isShowindustrialParkDownMenu = (val) => {
  if (!val) {
    industrialParkRoleArr.value = [];
  }
};

// 点击展开产业园角色菜单
const handleShowParkRoleMenu = (index, industrialPark, industrialParkList, par) => {
  const valData = industrialParkList.find(
    (item) => item.id === industrialPark.currentSelect
  );

  if (!valData) {
    return ElMessage.warning("请先选择产业园");
  }

  Object.assign(industrialPark, {
    id: valData.id,
    parkName: valData.parkName,
  });
  // 根据变更的产业园id获取其子集角色
  const reqData = {
    orgCode: "industrial_park",
    orgId: valData.id,
  };

  api.getRoleTreeByOrg(reqData).then((res) => {
    industrialPark.children = res.data[0] && res.data[0].children;
    console.log(industrialPark)
    par.industrialParkListArr[index].el.handleOpen();
  });
};
/********************************************** 选择产业园逻辑 **********************************************/

/********************************************** 选择加工商逻辑 **********************************************/
const manufacturerList = ref([]);
const manufacturerRoleArr = ref([]);
let manufacturerListArr = reactive([]);
const manufacturerRef = (el, index, par) => {
  if (el) {
    par.manufacturerListArr[index].el = el;
  }
};

// 获取加工商列表
const getAllManufacturerList = () => {
  api.getAllManufacturerList().then((res) => {
    manufacturerList.value = res.data;

    // 1、根据加工商列表查询对应加工商数据
    // 2、生产渲染数据
  });
};

// 加工商下拉选择变更事件
const currentmanufacturerSelectChange = (manufacturer, manufacturerList) => {
  // // 根据变更的加工商id获取其子集角色
  manufacturer.selectedArr = [];
  manufacturer.children = [];

  const valData = manufacturerList.find(
    (item) => item.manufacturerId === manufacturer.currentSelect
  );

  Object.assign(manufacturer, {
    manufacturerId: valData.manufacturerId,
    manufacturerName: valData.manufacturerName,
  });
};

// 加工商点击节点
const handleSelectManufacturerNode = (item) => {
  manufacturerRoleArr.value = item.children;
};

// 移除对应加工商选中角色
const handleManufacturerRemoveTag = (val, manufacturer) => {
  // if (val.id === "32") {
  //   return;
  // }

  manufacturer.selectedArr = manufacturer.selectedArr.filter(
    (item) => item.id !== val.id
  );
};

// 加工商角色是否被选择
const industrialManufacturerChecked = computed(() => (val, manufacturer) => {
  let selectItem = manufacturer.selectedArr.find((item) => item.id === val.id);
  if (selectItem) {
    return true;
  }

  return false;
});

// 加工商是否被选择
const isManufacturerSelected = computed(() => (val, par) => {
  let selectItem = par.manufacturerListArr.find(
    (item) => item.manufacturerId === val.manufacturerId
  );
  if (selectItem) {
    return true;
  }

  return false;
});

// 选择加工商角色
const handleSelectManufacturerRole = (item, currentManufacturer) => {
  // if (item.id === "32") {
  //   return;
  // }
  if (hasBoss() && item.id === "32") {
    return ElMessage.warning("该加工商已有老板角色的用户，请先解绑");
  }
  let hasItem = currentManufacturer.selectedArr.find(
    (selectedItem) => selectedItem.id === item.id
  );

  if (hasItem) {
    currentManufacturer.selectedArr = currentManufacturer.selectedArr.filter(
      (selectedItem) => selectedItem.id !== item.id
    );
  } else {
    currentManufacturer.selectedArr = [
      ...currentManufacturer.selectedArr,
      item,
    ];
  }
};

// 添加加工商
const handleAddManufacturer = (par) => {
  if (manufacturerList.value.length === par.manufacturerListArr.length) {
    return ElMessage.warning(
      `当前只有${manufacturerList.value.length}个加工商`
    );
  }

  par.manufacturerListArr.push({
    el: null,
    currentSelect: "",
    manufacturerId: "",
    manufacturerName: "",
    children: [],
    selectedArr: [],
  });
};

// 移除加工商
const handleRemoveManufacturer = (index, par) => {
  if (par.manufacturerListArr.length === 1) {
    return ElMessage.warning("至少保持一项");
  }

  par.manufacturerListArr.splice(index, 1);
};

// 点击展开加工商角色菜单
const handleShowManufacturerRoleMenu = (index, manufacturer, manufacturerList, par) => {
  const valData = manufacturerList.find(
    (item) => item.manufacturerId === manufacturer.currentSelect
  );

  if (!valData) {
    return ElMessage.warning("请先选择加工商");
  }

  Object.assign(manufacturer, {
    manufacturerId: valData.manufacturerId,
    manufacturerName: valData.manufacturerName,
  });

  // 根据变更的加工商id获取其子集角色
  const reqData = {
    orgCode: "manufacturer",
    orgId: null,
  };

  api.getRoleTreeByOrg(reqData).then((res) => {
    manufacturer.children = res.data[0].children;
    par.manufacturerListArr[index].el.handleOpen();
  });
};

// 加工商下拉菜单显示隐藏事件
const isShowmanufacturerDownMenu = (val) => {
  if (!val) {
    manufacturerRoleArr.value = [];
  }
};
/********************************************** 选择加工商逻辑 **********************************************/

/********************************************** 保存逻辑 **********************************************/
// 处理角色表
/**
 * @param { String } orgValue
 * @describe 接受 组织类型-orgValue，根据类型返回对应提交的角色信息，若存在空角色则返回false
 */
const getOrgRoleList = () => {
  // let flag = true;
  // if (orgValue === "head_office") {
  //   flag = headOfficeSelectArr.value.length ? true : false;
  //   const userOrgRoleList = {
  //     orgCode: "head_office",
  //     orgId: -1,
  //     userRoleList: headOfficeSelectArr.value.map((item) => {
  //       const roleData = {
  //         roleId: item.id,
  //       };

  //       return roleData;
  //     }),
  //   };

  //   return flag ? [userOrgRoleList] : false;
  // }

  // if (orgValue === "industrial_park") {
  //   const userOrgRoleList = industrialParkListArr.map((item) => {
  //     flag = item.selectedArr.length ? true : false;
  //     const itemData = {
  //       orgCode: "industrial_park",
  //       orgId: item.id,
  //       userRoleList: item.selectedArr.map((role) => {
  //         const roleData = {
  //           roleId: role.id,
  //         };

  //         return roleData;
  //       }),
  //     };

  //     return itemData;
  //   });

  //   return flag ? userOrgRoleList : flag;
  // }

  // if (orgValue === "manufacturer") {
  //   const userOrgRoleList = manufacturerListArr.map((item) => {
  //     flag = item.selectedArr.length ? true : false;
  //     const itemData = {
  //       orgCode: "manufacturer",
  //       orgId: item.manufacturerId,
  //       userRoleList: item.selectedArr.map((role) => {
  //         const roleData = {
  //           roleId: role.id,
  //         };

  //         return roleData;
  //       }),
  //     };

  //     return itemData;
  //   });

  //   return flag ? userOrgRoleList : flag;
  // }

  // return false;
  let flag = true;
  let reqData = []
  orgList.value.map(item => {
    if (item.orgValue === 'head_office') {
      //这里由于产业园财务的orgId不同，所以要按照orgId分组统计角色列表
      let orgList = {}
      item.headOfficeSelectArr.forEach(p => {
        if (!orgList[p.orgId]) orgList[p.orgId] = []
        orgList[p.orgId].push(p)
      })

      for (let key in orgList) {
        reqData.push({
          orgCode: "head_office",
          orgId: key,
          userRoleList: orgList[key].map((item) => ({
            roleId: item.id,
            orgId: item.orgId,
          })),
        });
      }
    }
    if (item.orgValue === 'industrial_park') {
      const industrialList = item.industrialParkListArr.map((item) => {
        // flag = item.selectedArr.length ? true : false;
        const itemData = {
          orgCode: "industrial_park",
          orgId: item.id,
          userRoleList: item.selectedArr.map((role) => {
            const roleData = {
              roleId: role.id,
            };

            return roleData;
          }),
        };
        return itemData;
      });
      reqData.push(...industrialList)
    }
    if (item.orgValue === 'manufacturer') {
      const manufacturerList = item.manufacturerListArr.map((item) => {
        // flag = item.selectedArr.length ? true : false;
        const itemData = {
          orgCode: "manufacturer",
          orgId: item.manufacturerId,
          userRoleList: item.selectedArr.map((role) => {
            const roleData = {
              roleId: role.id,
            };

            return roleData;
          }),
        };

        return itemData;
      });
      reqData.push(...manufacturerList)
    }
  })
  // console.log(reqData)
  reqData.map(item => {
    if (!item.userRoleList.length) {
      flag = false
    }
  })
  return flag ? reqData : flag;
};

const hasBoss = () => {
  let flag = false
  if (orgList.value) {
    orgList.value.map(item => {
      if (item.orgValue == "manufacturer") {
        if (item.manufacturerListArr.length) {
          item.manufacturerListArr.map(v => {
            v.selectedArr.map(m => {
              if (m.id == '32') {
                flag = true
              }
            })
          })
        }
      }
      console.log(flag, '12354')
    })
  }
  return flag
}

const handleSave = () => {
  ruleFormRef.value.validate((valid) => {
    if (!valid) {
      return false;
    }
    let flag = false
    orgList.value.map(item => {
      if (item.orgValue == '') {
        flag = true
      }
    })
    if (flag) {
      return ElMessage.warning("请选择所属组织");
    }
    const userOrgRoleList = getOrgRoleList();
    console.log(orgList.value, userOrgRoleList, 'uuuuuu')
    if (!userOrgRoleList) {
      return ElMessage.warning("角色信息不能为空");
    }
    isShowSaveDialog.value = true
  });
};
const suerSaveRole = () => {
  const { userMobile, userName, userState } = userInfoData;

  const userOrgRoleList = getOrgRoleList();
  console.log(orgList)
  if (!userOrgRoleList) {
    return ElMessage.warning("角色信息不能为空");
  }

  const reqData = {
    userMobile,
    userName,
    userState,
    // orgCode: orgValue.value,
    userOrgRoleList,
  };
  console.log(reqData)
  // return
  api.saveUser(reqData).then((res) => {
    if (res.code !== "000000") {
      return ElMessage.error(res.message);
    }

    ElMessage.success("用户新增成功");

    router.push({
      name: "UserManage",
    });
  });
}

const closeSaveDialog = () => {
  isShowSaveDialog.value = false;
};

const handleCancelSave = () => {
  router.push({
    name: "UserManage",
  });
};
const handleAddOrg = () => {
  if (orgList.value.length >= orgData.value.length) {
    return ElMessage.warning(`当前只有${orgData.value.length}个组织`);
  }
  orgList.value.push({
    orgValue: '',
    headOfficeSelectArr: [],
    industrialParkListArr: [],
    manufacturerListArr: []
  })
}
const handleRemoveOrg = (index) => {
  if (orgList.value.length === 1) {
    return ElMessage.warning("至少保持一项");
  }

  orgList.value.splice(index, 1);

}
// 组织是否被选中
const isSelectOrg = computed(() => (val) => {
  let selectItem = orgList.value.find(item => item.orgValue === val);
  if (selectItem) {
    return true;
  }

  return false;
});

/********************************************** 保存逻辑 **********************************************/
</script>

<style lang="scss" scoped>
.add_new_user_page {
  background-color: #F7F7F7;
  height: 100%;
  overflow: auto;
  width: 100%;
  padding: 16px 0 40px 24px;
  box-sizing: border-box;


  .bottom_box {
    position: fixed;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 48px);
    background-color: #fff;
    height: 72px;
    z-index: 99;

    .submitBox {
      position: absolute;
      left: 50%;
      bottom: 20px;
      transform: translateX(-50%);

      button {
        margin: 0 40px;
      }
    }
  }

  .add_new_user_container {
    width: 100%;
    box-sizing: border-box;
    height: calc(100% - 30px);
    overflow: auto;
    background-color: #F7F7F7;
    position: relative;
  }

  .add_new_user_info_box {
    width: calc(100% - 18px);
    background-color: #fff;
    padding: 10px 0 150px 32px;
    box-sizing: border-box;
    min-height: 100%;
  }

  .blank_title_box {
    padding: 0 32px 16px;
    font-size: 16px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333;
    // border-bottom: 1px solid #f2f2f2;
  }

  .user_info_box {
    // margin-bottom: 16px;
    padding: 24px 0;
    background-color: #fff;
    border-radius: 4px;


    .info_box {
      padding: 0 20px;

      .info_item_group {
        display: flex;

        &:last-child {
          margin-bottom: 0;
        }

        .info_item_content_box {
          margin-right: 100px;

          &:last-child {
            margin-right: 0;
          }

          :deep(.el-form-item__label) {
            width: 106px;
          }
        }

        .info_item {
          // margin-right: 100px;
          display: flex;
          align-items: center;

          .info_item_label {
            width: 106px;
            padding: 0 12px;
            box-sizing: border-box;
            font-size: 14px;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #666;
            user-select: none;
            display: flex;
            justify-content: flex-end;
            align-items: center;

            .info_item_require {
              margin-right: 4px;
              color: red;
              display: flex;
              align-items: center;
            }
          }

          .info_item_content {
            .info_item_input_box {
              width: 272px;
            }
          }
        }
      }
    }
  }

  .user_role_box {
    padding: 24px 0px;
    background-color: #fff;
    border-radius: 4px;
    position: relative;

    .addOrg {
      position: absolute;
      top: 20px;
      left: 756px;
      cursor: pointer;
    }

    .user_roles_wrap {
      display: flex;
      flex-direction: row;

      .btns {
        border: 1px solid transparent;

        .submitIcon {
          font-size: 14px;
          font-family: Source Han Sans CN-Regular, Source Han Sans CN;
          font-weight: 400;
          color: #666;
          padding-left: 24px;
          padding-top: 8px;
          display: inline-block;
          cursor: pointer;

          .el-icon {
            color: var(--default-main-color);
          }
        }

        .addIcon {
          color: var(--default-main-color);
        }
      }
    }

    .user_roles_box {
      // min-height: 278px;
      padding: 0 32px;
      display: flex;
      margin-bottom: 15px;
      align-items: center;

      // background-color: #f8f8f8;
      .leftBox {
        background-color: #f7f7f7;
        padding: 14px;
        width: 700px;
        box-sizing: border-box;
      }

      .user_roles_box_top {
        margin-bottom: 18px;
        display: flex;
        align-items: center;
      }

      .user_roles_box_bottom {
        .role_item {
          margin-bottom: 18px;
          display: flex;
          align-items: center;
        }

        .role_blank {
          margin-bottom: 12px;
          display: flex;
          align-items: flex-start;
          border-top: 2px solid #fff;

          &:last-child {
            margin-bottom: 0;
          }

          .role_blank_left {
            width: 520px;
            min-height: 106px;
            box-sizing: border-box;
            padding: 14px 0 0 0;
            background: #f8f8f8;
            position: relative;

            .submitIcon {
              position: absolute;
              right: -52px;
              bottom: 0;
              font-size: 14px;
              font-family: Source Han Sans CN-Regular, Source Han Sans CN;
              font-weight: 400;
              color: #666;
              padding-left: 34px;
              cursor: pointer;

              .svg-icon-spin {
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
              }

              .el-icon {
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--default-main-color);
              }
            }

            .addIcon {
              color: var(--default-main-color)
            }

            span:nth-of-type(2) {
              right: -114px;
            }
          }

          .role_blank_right {
            position: relative;
            margin-left: 16px;
            margin-top: 14px;

            .submitIcon {

              font-size: 14px;
              font-family: Source Han Sans CN-Regular, Source Han Sans CN;
              font-weight: 400;
              color: #666;
              padding-left: 14px;
              cursor: pointer;

              .el-icon {
                color: var(--default-main-color);
              }
            }

            .addIcon {
              color: var(--default-main-color);
              font-size: 30px;
              vertical-align: sub;
            }



          }
        }
      }

      .roles_label {
        width: 106px;
        height: 32px;
        padding: 0 12px;
        box-sizing: border-box;
        font-size: 14px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #666;
        user-select: none;
        flex-shrink: 0;
        align-self: flex-start;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        &.role_item_label {
          width: 140px;
        }

        .roles_label_require {
          margin-right: 4px;
          color: red;
          display: flex;
          align-items: center;
        }
      }
    }

    .roles_content {
      width: 354px;

      .org_role_down_box {
        width: 354px;
        min-height: 32px;
        box-sizing: border-box;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        background-color: #fff;
        display: flex;
        align-items: center;
        cursor: pointer;

        &:hover {
          border-color: var(--default-main-color);
        }

        .select_content {
          width: 314px;
          min-height: 32px;
          padding: 4px 12px 0;
          box-sizing: border-box;
          display: flex;
          flex-wrap: wrap;

          .select_tag {
            height: 24px;
            margin-bottom: 4px;
            margin-right: 4px;
            padding: 0 10px;
            display: flex;
            align-items: center;
            background-color: #f4f4f5;
            border-radius: 2px;
            font-size: 12px;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            flex-shrink: 0;

            &:hover {
              opacity: 0.7;
            }
          }
        }

        .down_menu_icon {
          width: 38px;
          height: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .role_tag {
        height: 32px;
        border-radius: 0;
        color: var(--default-main-color);
        border-color: var(--default-main-color);
      }

      .role_item {
        margin-right: 14px;
        margin-bottom: 14px;
      }

      .add_role_btn {
        height: 32px;
        border-radius: 0;
        color: #333333;
        border: 1px solid #999999;
        position: relative;
        top: 2px;

        &:hover {
          opacity: 0.7;
        }

        .add_role_btn_content {
          height: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
      }
    }
  }
}

.el-select-dropdown__item.hover {
  background-color: #f2f6f5 !important;
  color: var(--default-main-color);
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 0;
}

:deep(.el-dialog__body) {
  margin: 0;
  padding: 0;
}

.custom_dialog_header {
  height: 40px;
  padding: 0 24px;
  background-color: var(--default-main-color);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .dialog_label {
    font-size: 16px;
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    font-weight: 500;
    color: #ffffff;
  }

  .dialog_closeble_btn {
    width: 24px;
    height: 24px;
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }
  }
}

.custom_tree_node {
  display: flex;
  align-items: center;
}

.custom_checked_box {
  width: 14px;
  height: 14px;
  box-sizing: border-box;
  margin-right: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  &.checked {
    background-color: var(--default-main-color);
    border: 1px solid var(--default-main-color);
  }

  &.deisable {
    background-color: #f5f7fa;
    color: #aeb1b8;
  }
}

.dialog_container {
  .dialog_body {
    height: 472px;
    padding: 16px 70px;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
  }

  .dialog_footer {
    height: 64px;
    padding-top: 12px;
    box-shadow: inset 0px 1px 0px 0px #f2f2f2;
    background-color: #fff;
    display: flex;
    justify-content: center;

    .cancel_btn {
      margin-left: 80px;
      border-color: #e0e0e0;

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

    &:last-child {
      border-left: 1px solid #e0e0e0;
    }

    .role_down_menu_list_item {
      min-width: 180px;
      height: 32px;
      padding: 0 12px 0 28px;
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #333;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      white-space: nowrap;

      &:hover {
        // opacity: 0.7;
        color: var(--default-main-color);
      }

      .role_down_menu_select_box {
        display: flex;
        align-items: center;
      }
    }
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

.save_dialog_content {
  min-height: 240px;

  .save_dialog_body {
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

  .save_dialog_footer {
    height: 96px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}</style>
