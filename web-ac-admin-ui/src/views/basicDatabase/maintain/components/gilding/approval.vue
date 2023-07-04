<template>
  <div class="drawer">
    <div>
      <div>
        <el-form :model="listData" label-width="110px" class="approval">
          <el-form-item label="基础数据表名:" >
            <template #default="scope">
            <template v-for="item in basic_database" >
              <div :key="item.value" v-if="listData.baseDateTable==item.value">{{item.label}}</div>
            </template>
          </template>
          </el-form-item>
          <el-form-item>
            <div class="flex_r">变更前</div>
            <div class="flex_l" v-show="NotShow">变更后</div>
          </el-form-item>
          <el-form-item label="示例图片:">
            <div class="flex_r">
              <el-image v-if="listData.before.imageUrl" fit="cover" class="img_wid"  :src="ossBaseUrl+listData.before.imageUrl" :preview-src-list="[ossBaseUrl+listData.before.imageUrl]">
                <template #error >
                  <div class="image-slot">
                    <el-icon>
                      <icon-picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
              <div v-else >
                暂无图片
              </div>
            </div>
            <div class="flex_l" v-show="NotShow">
              <el-image  v-if="listData.after.imageUrl" fit="cover" class="img_wid"  :src="ossBaseUrl+listData.after.imageUrl" :preview-src-list="[ossBaseUrl+listData.after.imageUrl]">
                <template #error>
                  <div class="image-slot">
                    <el-icon>
                      <icon-picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
              <div v-else >
                暂无图片
              </div>
            </div>
          </el-form-item>
          <el-form-item label="烫金颜色名称:">
            <div class="flex_r">
              {{listData.before.bronzeColorName||'-'}}
            </div>
            <div :class="{'flex_l':true,'red_text':materialColor.bronzeColorName}" v-show="NotShow">
              {{listData.after.bronzeColorName||'-'}}
            </div>
          </el-form-item>
          <el-form-item label="颜色编码:">
            <div class="flex_r">
              {{listData.before.bronzeColorNo||'-'}}
            </div>
            <div :class="{'flex_l':true,'red_text':materialColor.bronzeColorNo}" v-show="NotShow">
              {{listData.after.bronzeColorNo||'-'}}
            </div>
          </el-form-item>
          <el-form-item label="烫金颜色代码:">
            <div class="flex_r">
              {{listData.before.bronzeColorCode||'-'}}
            </div>
            <div :class="{'flex_l':true,'red_text':materialColor.bronzeColorCode}" v-show="NotShow">
              {{listData.after.bronzeColorCode||'-'}}
            </div>
          </el-form-item>
          <el-form-item label="适用工艺:">
            <div class="flex_r">
              {{listData.before.suitedCraftStr||'-'}}
            </div>
            <div :class="{'flex_l':true,'red_text':materialColor.suitedCraftStr}" v-show="NotShow">
              {{listData.after.suitedCraftStr||'-'}}
            </div>
          </el-form-item>
          <!-- <div class="btn_padtb" v-show="disabled">
            <el-button @click="goBack">退回</el-button>
            <el-button type="primary" @click="confirmChange">审批通过</el-button>
          </div> -->
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import {
  bronzeColorId,
  baseApproval,
} from "@/api/basicDatabase/approval";
import { Picture as IconPicture } from "@element-plus/icons-vue";
const ossBaseUrl = 'http://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/'
const { proxy } = getCurrentInstance();
const { basic_database } =  proxy.useDict( "basic_database" );
const props = defineProps({
  drawerData: {
    type: Object,
  },
  drawerType: {
    type: String,
    default: "look",
  },
});
const emit = defineEmits();
const { drawerData } = toRefs(props, "drawerData");
const drawerType = toRef(props, "drawerType");
const disabled = ref(true);
const NotShow = ref(true);
const addShow = ref(false);
const flag = ref(true);
const recordId = ref('')
const data = reactive({
  materialColor: {
    spec: {},
  },
  listData:{
    before: {
    },
    after: {
    },
    major: true,
  }
});
const {materialColor,listData } = toRefs(data);
watch(drawerData, (val) => {
  getBronzeColorId(val)
});
watch(drawerType, (val) => {
  changeDisabled(val);
});
function changeDisabled(val) {
  let spli = val.split("-");
  switch (spli[0]) {
    case "查看":
      disabled.value = false;
      break;
    case "审批":
      disabled.value = true;
      break;
    default:
      disabled.value = false;
  }
  switch (spli[1]) {
    case "1":
      NotShow.value = false;
      addShow.value = true;
      break;
    case "2":
      NotShow.value = true;
      addShow.value = false;
      break;
    case "3":
      NotShow.value = false;
      addShow.value = false;
      break;
    default:
      NotShow.value = true;
      addShow.value = false;
  }
}
changeDisabled(drawerType.value);
getBronzeColorId(drawerData.value)
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
function contrast(listData) {
  let val = listData;
  let arr = [];
  if (val.major) {
    for (const key in val.before) {
      if (val.before[key]!= val.after[key]) {
        materialColor.value[key] = true;
      }else{
        materialColor.value[key] = false;
      }
    }
  } 
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
    });
  }
  setTimeout(() => {
      proxy.$router.go(0);
    }, 1500);
    }
  });
 
}

function getBronzeColorId(val) {
let drdata=val
recordId.value=val.id
if(drdata){
  bronzeColorId(drdata.id).then((res) => {
    if (res.code === 200) {
      listData.value = { ...res.data, baseDateTable: drdata.baseDateTable };
      contrast(listData.value)
    }
    emit("ChangeLoading");
  });
}
}
</script>
<style lang="scss" scoped>
.drawer {
  div{
      word-break: break-all;
    }
  .dis_flex {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .flex_r {
    flex: 1;
  }
  .flex_l {
    width: 48%;
    margin-left: 4%;
  }
  .drawer-upload {
    :deep(.el-upload--picture-card) {
      width: 80px;
      height: 80px;
    }

    :deep(.el-upload-list--picture-card .el-upload-list__item) {
      width: 80px;
      height: 80px;
    }
  }

  .confirm-dialog {
    :deep(.el-dialog) {
      margin-top: 30vh;
    }
  }
}
.marl_10 {
  margin: 0 0px;
}
.image-slot {
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
}
.img_wid {
  width: 120px;
  height: 100px;
}
.btn_padtb {
  text-align: right;
  padding: 10px 0;
}
.red_text {
  color: #ff0036;
}
.add_flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
   color: #ff0036;
}
.add_flex div {
  min-width: 46%;
}
</style>
<style>
.approval .el-form-item__content {
  justify-content: space-between;
  align-items: flex-start;
}
</style>
