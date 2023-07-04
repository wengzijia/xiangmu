<template>
  <div class="drawer">
    <div>
      <div>
        <el-form :model="listData" label-width="110px" class="approval">
          <el-form-item label="基础数据表名:" >
            <template v-for="item in basic_database" >
              <div :key="item.value" v-if="listData.baseDateTable==item.value">{{item.label}}</div>
            </template>
          </el-form-item>
          <el-form-item>
            <div class="flex_r">变更前</div>
            <div class="flex_l" v-show="NotShow">变更后</div>
          </el-form-item>
          <el-form-item label="物料名称:">
            <div class="flex_r">
              {{listData.before.materialInfoName||'-'}}
            </div>
            <div :class="{'flex_l':true,'red_text':materialColor.materialInfoName}" v-show="NotShow">
              {{listData.after.materialInfoName||'-'}}
            </div>
          </el-form-item>
          <el-form-item label="物料编码:">
            <div class="flex_r">
              {{listData.before.materialInfoNo||'-'}}
            </div>
            <div :class="{'flex_l':true,'red_text':materialColor.materialInfoNo}" v-show="NotShow">
              {{listData.after.materialInfoNo||'-'}}
            </div>
          </el-form-item>
          <el-form-item label="材质类别:">
            <div class="flex_r">
              {{listData.before.materialTypeName||'-'}}
            </div>
            <div :class="{'flex_l':true,'red_text':materialColor.materialTypeName}" v-show="NotShow">
              {{listData.after.materialTypeName||'-'}}
            </div>
          </el-form-item>
          <el-form-item label="材质小类:">
            <div class="flex_r">
              {{listData.before.materialSubclassName||'-'}}
            </div>
            <div :class="{'flex_l':true,'red_text':materialColor.materialSubclassName}" v-show="NotShow">
              {{listData.after.materialSubclassName||'-'}}
            </div>
          </el-form-item>
          <el-form-item label="材质规格名称:">
            <div class="flex_r">
              {{listData.before.materialSpecName||'-'}}
            </div>
            <div :class="{'flex_l':true,'red_text':materialColor.materialSpecName}" v-show="NotShow">
              {{listData.after.materialSpecName||'-'}}
            </div>
          </el-form-item>
          <el-form-item label="纸品牌:">
            <div class="flex_r">
              {{listData.before.brand||'-'}}
            </div>
            <div :class="{'flex_l':true,'red_text':materialColor.brand}" v-show="NotShow">
              {{listData.after.brand||'-'}}
            </div>
          </el-form-item>
          <el-form-item label="含水量:">
            <div class="flex_r">
              {{listData.before.waterContent||'-'}}
            </div>
            <div :class="{'flex_l':true,'red_text':materialColor.waterContent}" v-show="NotShow">
              {{listData.after.waterContent||'-'}}
            </div>
          </el-form-item>
          <el-form-item label="挺度:">
            <div class="flex_r">
              {{listData.before.stiffness||'-'}}
            </div>
            <div :class="{'flex_l':true,'red_text':materialColor.stiffness}" v-show="NotShow">
              {{listData.after.stiffness||'-'}}
            </div>
          </el-form-item>
          <el-form-item label="纸白度:">
            <div class="flex_r">
              {{listData.before.paperWhiteness||'-'}}
            </div>
            <div :class="{'flex_l':true,'red_text':materialColor.paperWhiteness}" v-show="NotShow">
              {{listData.after.paperWhiteness||'-'}}
            </div>
          </el-form-item>
          <el-form-item label="抗压程度:">
            <div class="flex_r">
              {{listData.before.compressiveStrength||'-'}}
            </div>
            <div :class="{'flex_l':true,'red_text':materialColor.compressiveStrength}" v-show="NotShow">
              {{listData.after.compressiveStrength||'-'}}
            </div>
          </el-form-item>
          <el-form-item label="计价单位:">
            <div class="flex_r">
              {{listData.before.priceUnit||'-'}}
            </div>
            <div :class="{'flex_l':true,'red_text':materialColor.priceUnit}" v-show="NotShow">
              {{listData.after.priceUnit||'-'}}
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
  materialInfoId,
  baseApproval,
} from "@/api/basicDatabase/approval";
import { Picture as IconPicture } from "@element-plus/icons-vue";
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
      spec: {},
    },
    after: {
      spec: {},
    },
    major: true,
  }
});
const {materialColor, listData } = toRefs(data);
watch(drawerData, (val) => {
  getMaterialInfoId(val)
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
getMaterialInfoId(drawerData.value)
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
  if (val.major) {
    for (const key in val.before) {
      if (val.before[key]!= val.after[key]) {
        console.log(123);
        materialColor.value[key] = true;
      }else{
        console.log(456);
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

function getMaterialInfoId(val) {
let drdata=val
recordId.value=val.id
if(drdata){
  materialInfoId(drdata.id).then((res) => {
    emit("ChangeLoading");
    if (res.code === 200) {
      listData.value = { ...res.data, baseDateTable: drdata.baseDateTable };
      contrast(listData.value)
    }
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
