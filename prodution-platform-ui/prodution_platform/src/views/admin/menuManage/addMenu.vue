<template>
    <div class="addMenu">
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
                        <el-form-item label="父级"  v-if="isAdd">
                            <div class="item_content_box">
                                <div class="role_father_select_box">
                                    <el-cascader ref="cascaderBox" :options="options" :props="props1" clearable v-model="addRoleForm.level" 
                                        placeholder="未选择父级，则新增菜单为系统" @change="selectFater" />
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="系统" prop="orgCode" v-if="menuLeve1 ==0">
                            <div class="item_content_box">
                                <el-select v-model="addRoleForm.orgCode" clearable placeholder="请选择系统" :disabled="!isAdd">
                                    <el-option v-for="item in orgData" :key="item.itemCode" :label="item.itemValue"
                                    :value="item.itemCode" />
                                </el-select>
                            </div>
                        </el-form-item>
                        <el-form-item label="系统名称" prop="name" v-if="menuLeve1 ==0">
                            <div class="item_content_box">
                                <el-input v-model="addRoleForm.name" maxlength="10" placeholder="请输入系统名称，不超过10个字" />
                            </div>
                        </el-form-item>
                        <el-form-item label="名称" prop="name" v-if="menuLeve1 >=1">
                            <div class="item_content_box">
                                <el-input v-model="addRoleForm.name" maxlength="10" placeholder="请输入名称，不超过10个字" />
                            </div>
                        </el-form-item>
                        <el-form-item label="功能类型" prop="functionType" v-if="menuLeve1 >=3 && isAdd" >
                            <div class="item_content_box">
                                <el-select v-model="addRoleForm.functionType" clearable placeholder="请选择功能类型" @change="selectType">
                                    <el-option v-for="item in functionType" :key="item.value" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </div>
                        </el-form-item>
                        <el-form-item label="权限编码" prop="permission" v-if="isAdd" >
                            <div class="item_content_box">
                                <el-input v-model="addRoleForm.permission" placeholder="请输入权限编码" :disabled="menuLeve1 >= 3">
                                    <template v-if="menuLeve1 >0 && isAdd" #prefix>{{definePermission}} : </template>
                                </el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="路由url" prop="routeUrl" v-if="menuLeve1 ==2">
                            <div class="item_content_box">
                                <el-input v-model="addRoleForm.routeUrl" placeholder="请输入url" />
                            </div>
                        </el-form-item>
                        <el-form-item  v-for="(item, i) in addRoleForm.urls" :key="i" :label="`资源url${i+1}`" :prop="'urls.' + i + '.url'" :rules="rules.urlRuls" v-if="menuLeve1 >=3">
                            <div class="item_content_box">
                                <el-input v-model="item.url" placeholder="请输入" />
                                
                            </div>
                            <P class="addUrl" @click="addurl" v-show="i=== addRoleForm.urls.length -1"><el-icon size="16"><CirclePlus /></el-icon>添加</P>
                            
                            <P class="delUrl" @click="delUrl(item,i)" v-show="addRoleForm.urls.length !==1"><span></span>删除</P> 
                        </el-form-item>
                        <el-form-item label="排序" prop="sort">
                            <div class="item_content_box">
                                <el-input-number v-model="addRoleForm.sort" controls-position="right" placeholder="请输入正整数数字"  :step="1" step-strictly/>
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
    </div>
</template>
<script name='addMenu' setup>
import api from "@/api";
import { watch,onMounted } from 'vue';

const props = defineProps({
    isShowDialog: {
        type: Boolean,
        default: false
    },
    isAdd :{
        type: Boolean,
        default: true
    },
    editParams: {
        type: Object,
        default:() => {}
    }
});
onMounted(() => {
    getTableData()
    getMapData()
})
/********************************************** 新增弹窗逻辑 **********************************************/

const isShowAddDialog = ref(false);
const addRoleFormRef = ref(null);
const props1 = {
    checkStrictly: true,
    emitPath:false
}

const addRoleForm = reactive({
    isShow	: 1,
    level: null,
    name: "",
    orgCode: "",
    permission: null,
    pid: '-1',
    type: 1,
    sort:0,
    value: '',
    urls:[{url:'',id:Math.random() + new Date().getTime()}],
    functionType: '',
    routeUrl:''
});

const selectOptions = ref([])
const functionType =reactive([
    {label: '删除',value:'del'},
    {label: '编辑',value:'edit'},
    {label: '查询',value:'get'},
    {label: '详情',value:'dtl'},
    {label: '启用',value:'en'},
    {label: '禁用',value:'dis'},
    {label: '导入',value:'imp'},
    {label: '导出',value:'exp'},
    {label: '上传',value:'upd'},
    {label: '绑定',value:'bid'},
    {label: '审核',value:'chk'},
    {label: '审核通过',value:'chk_y'},
    {label: '审核失败',value:'chk_n'},
    {label: '保存草稿',value:'save_draft'},
    {label: '编辑角色描述',value:'edit_role_desc'},
    {label: '更换手机号',value:'chg_ph'},
    {label: '关联加工商',value:'relation'},
])
const selectType = (val) => {
    if(val === 'get') {
        addRoleForm.isShow = 2
    }
    // console.log(val,addRoleForm.permission,'121')
    addRoleForm.permission =  val    
}
//系统
const orgData = ref([]);
const getMapData = () => {
  const reqData = {
    itemType: "org",
  };
  api.getMapData(reqData).then((res) => {
    orgData.value = res.data;
  });
};

// 父级
const options =ref([])

const getTableData = () => {
  const reqData = {
    orgCodes:['head_office','industrial_park','manufacturer'],
    pageNumber:100000,
    pageSize:1,
  };

  api.getMenuTreeList(reqData).then((res) => {
    if (res.code !== "000000") {
      return ElMessage.error(res.message);
    }
    const { head_office, industrial_park,manufacturer} = res.data || {}
    const fitterArr = (data) => {
        data.forEach((item) => {
            item.label = item.name
            item.value = item.type
            if(item.type == 3) {
              item.children = []
            }  
            if(item.children) {
                fitterArr(item.children)
            }
        })
      
        return data
    }
    const newArr = fitterArr(head_office).concat(fitterArr(industrial_park)).concat(fitterArr(manufacturer))
    options.value = newArr || []
    selectOptions.value = head_office || []
  });
};
// 
const menuLeve1 = ref(0)
const definePermission=ref('')
const cascaderBox = ref()
const selectFater = (val) =>{
    addRoleForm.name = ''
    addRoleForm.permission = ''
    if(cascaderBox._rawValue.getCheckedNodes().length) {
        definePermission.value =  cascaderBox._rawValue.getCheckedNodes()[0].data.permission
        addRoleForm.orgCode = cascaderBox._rawValue.getCheckedNodes()[0].data.orgCode
        addRoleForm.pid = cascaderBox._rawValue.getCheckedNodes()[0].data.id
        addRoleForm.sort = cascaderBox._rawValue.getCheckedNodes()[0].data.children.length + 1
    } else {
        definePermission.value = ''
        addRoleForm.orgCode = "head_office"
        addRoleForm.pid = '-1'
        addRoleForm.sort = 0
    }
    menuLeve1.value = val ? val : 0
   
}
const addurl = () => {
    addRoleForm.urls.push({url:'',id:Math.random() + new Date().getTime()})
}
const delUrl = (val,i) => {
    // addRoleForm.urls.splice(i,1)
    addRoleForm.urls.map((item,i) => {
        if(val.id === item.id ) {
            addRoleForm.urls.splice(i,1)
        }
    })
    if(addRoleForm.urls.length === 0) {
        addRoleForm.urls.push({url:'',id:Math.random() + new Date().getTime()})
    }
}

const rules = ref({
    urlRuls:[
        { required: true, message: "资源URL不能为空", trigger: 'blur'  }
    ]
})


const addRoleFormRule = ref({
    name: [{ required: true, message: "名称不能为空",trigger: 'blur' }],
    routeUrl: [{ required: true, message: "路由url不能为空", trigger: 'blur'}],
    permission: [{ required: true, message: "权限编码不能为空", trigger: 'blur'}],
    orgCode: [{ required: true, message: "系统不能为空", trigger: 'blur'}],
    sort:[{ required: true, message: "请输入正整数数字", trigger: 'blur'}]
});



const emit = defineEmits(['closeDialog'])
// 关闭添加弹窗
const closeAddDialog = () => {
    //   isShowAddDialog.value = false;
    menuLeve1.value = 0
    emit('closeDialog', false)
    Object.assign(addRoleForm, {
        isShow	: 1,
        level: null,
        name: "",
        orgCode: "",
        permission: null,
        pid: '-1',
        type: 1,
        sort:0,
        value: '',
        urls:[{url:'',id:Math.random() + new Date().getTime()}],
        functionType: '',
        routeUrl:''
    });
};

// 确定添加菜单
const suerAddRole = () => {
    console.log("确定添加菜单", addRoleForm);
    addRoleFormRef.value.validate((valid) => {
        console.log(valid);
        if (!valid) {
            return;
        }

        console.log("确定添加菜单", addRoleForm);
        addRoleForm.level = (addRoleForm.level+ 1 <=4) ? addRoleForm.level+1 : 4
        addRoleForm.type = addRoleForm.level 
        let permission = ''
        if(props.isAdd) {
            if(addRoleForm.level >= 1) {
                permission = definePermission.value + (definePermission.value !== '' ? ":": '') + addRoleForm.permission
            } else {
                permission = addRoleForm.permission
            }
        } else {
            permission = addRoleForm.permission
        }
        if(addRoleForm.type < 4) {
            addRoleForm.urls = []
            // if(addRoleForm.type == 3) {
            //     addRoleForm.urls = [ addRoleForm.routeUrl]
            // }
        } else {
            let arr = []
            addRoleForm.urls.map(item => {
                arr.push(item.url)
            }) 
            addRoleForm.urls = arr
        }
        let params = {...addRoleForm, permission}
        
        // return
        if(props.isAdd) {
            // 添加菜单
            api.saveMenu(params).then((res) => {
                console.log("确定添加角色", res);

                if (res.code !== "000000") {
                    closeAddDialog();
                    return ElMessage.error(res.message);
                }
                ElMessage.success("新增成功");
                closeAddDialog();
            });
        } else {
            // 修改菜单
        api.updateMenu(params).then((res) => {
            console.log("确定添加角色", res);

            if (res.code !== "000000") {
                return ElMessage.error(res.message);
            }
            ElMessage.success("修改成功");
            closeAddDialog();
        });
        }
        
    });
};
watch(
    () => props.isShowDialog,
    (newVal, oldVal) => {
        isShowAddDialog.value = newVal
        console.log(newVal, '121', isShowAddDialog.value);
    }
)
watch(
    () => props.isAdd,
    (newVal) => {
        if(!newVal) {
            api.getMenuDetail({id:props.editParams.id}).then(res => {
                let urls = []
                if(res.data && res.data.sysUrls && res.data.sysUrls.length) {
                    res.data.sysUrls.map(item => {
                        urls.push({url:item.methodUrl,id:item.id })
                    })

                    
                } else {
                    urls=[{url:'',id:Math.random() + new Date().getTime()}]
                }
                Object.assign(addRoleForm,{...res.data,level: props.editParams.level -1, urls })
                console.log(addRoleForm)
                menuLeve1.value = res.data.type -1
            })
        //     console.log(props.editParams)
        //    Object.assign(addRoleForm,props.editParams,{level: props.editParams.level -1 })
        //    menuLeve1.value = props.editParams.type -1
        }
    }
)
/********************************************** 新增弹窗逻辑 **********************************************/
</script>
<style lang="scss" scoped>
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

                :deep(.el-cascader) {
                    width: 100%;
                }

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

            :deep(.el-select) {
                width: 100%;
            }
            :deep(.el-input-number) {
                width: 100%;
            }
        }

        .addUrl {
            i {
                display: inline-block;
                width: 16px;
                height: 16px;
                // background: url(@/assets/images/add.png);
                vertical-align: sub;
                background-size: 100% 100%;
                margin-right: 5px;
                // background-color: var(--default-main-color);
            }
            color: var(--default-main-color);
            margin-left: 10px;
            cursor: pointer;
        }
        .delUrl{
            span {
                display: inline-block;
                width: 16px;
                height: 16px;
                background: url(@/assets/images/delete.png);
                vertical-align: sub;
                background-size: 100% 100%;
                margin-right: 5px;
            }
            margin-left: 10px;
            cursor: pointer;
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
</style>