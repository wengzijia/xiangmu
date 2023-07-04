<template>
    <div class="addOperate">
        <el-dialog v-model="isShowAddDialog" width="1500" :show-close="false" :destroy-on-close="true"
            :close-on-click-modal="false" :close-on-press-escape="false">
            <template #header>
                <div class="dialog_header">
                    <div class="dialog_header_title">编辑操作权限</div>
                    <div class="dialog_close_btn" @click="closeAddDialog">
                        <Close style="width: 24px; height: 24px" />
                    </div>
                </div>
            </template>
            <div class="add_dialog_content">
                <div class="add_dialog_body">
                    <ul class="tHead">
                        <li class="moduleOperate">系统</li>
                        <li class="moduleOperate">模块权限</li>
                        <li class="childOperate">子模块权限</li>
                        <li class="functionOperate">功能权限</li>
                    </ul>
                    <div class="tBody">
                        <ul class="trBox" v-for="item in options">
                            <li class="moduleOperate"><el-checkbox v-if="item.type === 1" v-model="item.currChecked"
                                    :key="item.id" :value="item.id" :label="item.id" :indeterminate="item.isIndeterminate"
                                    @change="handleCheckedItemChild(item)">{{ item.name }}</el-checkbox></li>
                            <li class="moduleOperate"><el-checkbox v-if="item.type === 2" v-model="item.currChecked"
                                    :key="item.id" :value="item.id" :label="item.id" :indeterminate="item.isIndeterminate"
                                    @change="handleCheckedItemChild(item)">{{ item.name }}</el-checkbox></li>
                            <li class="childOperate"><el-checkbox v-model="item.currChecked"
                                    @change="checkItemFunction(item)" v-if="item.type === 3" :key="item.id" :label="item.id"
                                    :indeterminate="item.isIndeterminate">{{ item.name }}</el-checkbox></li>
                            <!-- <li class="functionOperate" ><el-checkbox-group :value="ids"  v-if="item.type ===3"><el-checkbox @change="handleCheckedFunction(i)"  v-for="i in item.children" :key="item.id"  :label="i.id"  >{{ i.name }}</el-checkbox></el-checkbox-group></li> -->
                            <li class="functionOperate">
                                <div v-if="item.type === 3">
                                    <span v-for="(v, i) in item.children" :key="v.id">
                                        <el-checkbox class="itemCheck" v-model="v.currChecked" v-if="v.name !== '查询'"
                                            @change="handleCheckedFunction(item, i)" :label="v.id">{{ v.name
                                            }}</el-checkbox>
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="add_dialog_footer">
                    <CommonSureBtn style="margin-right: 80px" @click="suerAddRole" />
                    <CommonCancelBtn @click="closeAddDialog" />
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script name='addOperate' setup>
import api from "@/api";

import { watch, onMounted, getCurrentInstance } from 'vue';

const props = defineProps({
    isShowDialog: {
        type: Boolean,
        default: false
    },
    editReqData: {
        type: Object,
        default: () => { }
    },
    selectIds: {
        type: Array,
        default: () => []
    }
});
onMounted(() => {
    getTableData()
})
/********************************************** 新增弹窗逻辑 **********************************************/

const isShowAddDialog = ref(false);


const ids = ref([])

const fitterArr2 = (data) => {
    let arr = []
    let spread = (data) => {
        data.forEach((item) => {
            arr.push(item)
            if (item.children) {
                spread(item.children)
                // delete item.children
            }
        })
    }
    spread(data)
    return arr
}
const handleCheckedItemChild = (val) => {

    let arr = fitterArr2([val])
    if (val.currChecked) {
        arr.map(item => {
            item.currChecked = true
            item.isIndeterminate = false
            ids.value.push(item.id)
        })
    } else {
        arr.map(item => {
            if (ids.value.includes(item.id)) {
                ids.value.splice(ids.value.indexOf(item.id), 1)
                item.currChecked = false

            }
        })
    }
    searchId(val.pid)
    slectCheck(val)
    ids.value = [...new Set(ids.value)]
    // console.log(ids.value);
}
// 子模块
const checkItemFunction = (val) => {
    let arr = options.value.filter((item => item.id === val.id))
   
    if (val.currChecked) {
        ids.value.push(val.id)
        val.isIndeterminate = false
        if (arr[0].children.length) {
            arr[0].children.map(item => {
                item.currChecked = true
                ids.value.push(item.id)
            })
        }
    } else {
        if (ids.value.includes(val.id)) {
            // console.log(ids.value, val.id)
            ids.value.splice(ids.value.indexOf(val.id), 1)
        }
        if (arr[0].children.length) {
            arr[0].children.map(item => {
                if (ids.value.includes(item.id)) {
                    ids.value.splice(ids.value.indexOf(item.id), 1)
                    item.currChecked = false
                }
            })
        }
       
    }
    searchId(val.pid)
    slectCheck(val) 
    ids.value = [...new Set(ids.value)]
}
//当子级全部选中时，父级状态为选中
const slectCheck = (val) => {
  let parent = options.value.filter((item => item.id === val.pid))[0]
  if (val.currChecked) {
    parent.checkList.push(val.id)
    parent.checkList = [...new Set(parent.checkList)]
        if(parent.checkList.length === parent.children.length) {
          parent.isIndeterminate = false
          parent.currChecked = true
        }
    } else {
      parent.checkList = [...new Set(parent.checkList)]
        if(parent.checkList.includes(val.id)) {
          parent.checkList.splice(parent.checkList.indexOf(val.id), 1)
          parent.isIndeterminate = true
          parent.currChecked = false
        }
    }
}
// 查询父id
const searchId = (id) =>{
    let str = []
    let filterStr = (id) => {
        options.value.forEach(item => {
            if (item.id === id) {
                item.isIndeterminate = true
                ids.value.push(id)
                filterStr(item.pid)
            }
        })
        return str
    }
    return filterStr(id)
}
// 功能模块
const handleCheckedFunction = (val, i) => {
    val.children.forEach(item => {
        if (item.name == '查询') {
            item.currChecked = true
            ids.value.push(item.id)
            val.checkList.push(item.id)
        }
    })
    ids.value.push(val.id)
    if (val.children[i].currChecked) {
        ids.value.push(val.children[i].id)
        val.checkList.push(val.children[i].id)
    } else {
        ids.value.splice(ids.value.indexOf(val.children[i].id), 1)
        val.checkList.splice(val.checkList.indexOf(val.children[i].id), 1)
    }
    val.checkList = [...new Set(val.checkList)]

    if (val.checkList.length === val.children.length) {
        val.isIndeterminate = false
        val.currChecked = true
        ids.value.push(val.id)
    } else {
        val.isIndeterminate = true
        val.currChecked = false
        if (!val.checkList.length) {
            val.isIndeterminate = false
        }
        // if (ids.value.includes(val.id)) {
        //     ids.value.splice(ids.value.indexOf(val.id), 1)
        // }
    }
    searchId(val.pid)
    ids.value = [...new Set(ids.value)]
    // console.log(val.children, val.checkList)
}
const options = ref([])

const getTableData = () => {
    const reqData = {
        orgCodes: ['head_office'],
        pageNumber: 100000,
        pageSize: 1,
    };

    api.getMenuTreeList(reqData).then((res) => {
        if (res.code !== "000000") {
            return ElMessage.error(res.message);
        }
        const { head_office } = res.data || {}

        const fitterArr = (data) => {
            let arr = []
            let spread = (data) => {
                data.forEach((item) => {
                    item.isIndeterminate = false
                    item.currChecked = false
                    item.checkList = []
                    if (item.type > 3) {
                        return
                    }
                    if(item.isShow!==1) {return}
                    arr.push(item)

                    if (item.children) {
                        spread(item.children)
                    }
                })
            }

            spread(data)
            return arr
        }
        const newArr = fitterArr(head_office)
        // console.log(newArr)
        options.value = newArr || []
    });
};

const emit = defineEmits(['closeDialog'])
// 关闭弹窗
const closeAddDialog = () => {
    options.value.forEach(item => {
                // item.currChecked = false
                item.isIndeterminate = false
                if (item.type >= 3) {
                    // console.log(item)
                    item.children.forEach(j => {
                        // j.currChecked = false
                        item.isIndeterminate = false
                    })
                }
            })
    emit('closeDialog', false)

};

// 确定添加
const suerAddRole = () => {
    let param = { ...props.editReqData, menuIds: ids.value }
    console.log(param)
    api.saveOrUpdateRoleMenuList(param).then((res) => {
        console.log("确定添加", res);

        if (res.code !== "000000") {
            return ElMessage.error(res.message);
        }
        ElMessage.success("新增成功");
        closeAddDialog();
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
    () => props.selectIds,
    (newVal) => {
        ids.value = []
        if (newVal) {
            // console.log(props.selectIds,1112133)
            let selctArr = fitterArr2(props.selectIds)
            options.value.forEach(item => {
                item.currChecked = false
                if (item.type >= 3) {
                    // console.log(item)
                    item.children.forEach(j => {
                        j.currChecked = false
                    })
                }
            })
            //    console.log(selctArr)

            if (!selctArr.length) return

            options.value.forEach(item => {
                selctArr.forEach(v => {
                    if (v.type < 3) {
                        if (item.id == v.id) {
                            item.currChecked = true
                            ids.value.push(item.id)
        
                             options.value.forEach((m => {
                              if(m.id === item.pid) {
                                m.checkList.push(item.id)
                              }
                             }))
                        }
                    } else {
                        item.children.forEach(j => {
                            if (j.id == v.id) {
                                j.currChecked = true
                                ids.value.push(j.id)
                                item.checkList.push(j.id)
                            }
                        })
                    }
                })
            })
            console.log(ids.value)
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
        max-height: 600px;
        display: flex;
        flex-direction: column;
        width: 100%;
        .tHead,
        .trBox {
            display: flex;
            width: 100%;
            height: 37px;
            background: #F2F2F2;
            padding: 0;
            margin: 0;

            li {
                line-height: 37px;
                padding-left: 20px;
                // text-align: center;
            }

            .moduleOperate {
                width: 188px;
            }

            .childOperate {
                width: 286px;
            }

            .functionOperate {
                flex: 1;

                .itemCheck {
                    margin-right: 16px;
                }
            }
        }

        .tBody {
            flex: 1;
            overflow: auto;

            .trBox {
                background-color: transparent;
                height: 48px;

                li {
                    border: 1px solid #E0E0E0;
                    border-top: none;
                    border-left: none;
                    height: 48px;
                    line-height: 48px;

                }

                .moduleOperate {
                    border-left: 1px solid #E0E0E0;
                }
            }
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