<template>
  <!-- 上传正稿弹窗 -->
  <div class="uploadOutwork">
    <el-drawer
      :model-value="drawerType"
      title="上传结构文件"
      size="600px"
      :before-close="cancel"
    >
      <div class="units">
        <!-- :rules="FileRules" -->
        <el-form :model="inputList" ref="formFile">
          <el-form-item label="文件来源:" v-if="drawerData.dataVal.hasProof&&bulk">
            <div>
              <el-radio-group
                v-model="radioText"
                size="large"
                @change="changeType"
              >
                <el-radio-button label="anew">重新上传</el-radio-button>
                <el-radio-button label="copyFile"
                  >复制打样结构文件</el-radio-button
                >
              </el-radio-group>
            </div>
          </el-form-item>
          <div v-for="(item, index) in fileData.fileListLen" :key="index">
            <el-form-item :label="`部件${index + 1}:`"> </el-form-item>
            <el-form-item
              label="上传结构:"
              label-width="140px"
              :rules="{
                required: true,
                message: '请上传结构文件',
                trigger: 'change',
              }"
            >
              <!-- :rules="{required: true,message: '请上传结构文件',trigger: 'change',}" -->
              <div class="upload">
                <FileUpload
                  :fileType="['jpg', 'jpeg', 'png', 'pdf', 'docx', 'doc','dxf','tif','ard','zip','rar']"
                  :fileSize="200"
                  type=""
                  name="上传结构"
                  v-model:modelValue="fileList[index]"
                  replace
                  del
                />
              </div>
            </el-form-item>
            <!-- <el-form-item
              label="刀线长度(mm):"
              :prop="`[${index}]`"
              label-width="140px"
              class="font textleft"
              :rules="{
                required: true,
                message: '请输入刀线长度',
                trigger: 'blur',
              }"
            >
              <el-input-number
                v-model="inputList[index]"
                :precision="1"
                :min="0"
                style="width: 90%"
                :controls="controls"
                @mousewheel.prevent
              />
            </el-form-item> -->
          </div>
          <el-form-item label="结构备注:"></el-form-item>
          <el-form-item label="结构备注:" label-width="140px" class="font">
            <el-input
              v-model.trim="fileData.remark"
              type="textarea"
              placeholder="请输入结构备注"
              autocomplete="off"
              show-word-limit
              maxlength="300"
              resize="none"
              rows="6"
              style="width: 90%"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div>
          <el-button @click="cancel()">取消</el-button>
          <el-button type="primary" @click="saveFileList">保存</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { copyProofAnnex, saveFile } from "@/api/structural/selfWork";
import { ElMessage, ElLoading } from "element-plus";
import { getFileName } from '@/utils/index'
// token
let MyHeader = reactive({
  token: localStorage.getItem("Access-Token"),
});
const { proxy } = getCurrentInstance();
const isUploadShow = ref(false);
const data = reactive({
  //上传结构参数
  fileData: {
    fileListLen: "",
    selectList: [],
    fileArr: [],
    remark: "",
    originalId: "",
    length: [],
  },
});
const imgShow = ref(false);
const controls = ref(false);
let fileList = ref([]);
let inputList = ref([]);
const { fileData } = toRefs(data);
const radioText = ref("anew");
const props = defineProps({
  drawerData: {
    type: Object,
    default: {},
  },
  drawerType: {
    type: Boolean,
    default: false,
  },
  //是否大货
  bulk: {
    type: Boolean,
    default: false,
  }
});
defineEmits(["update:drawerType"]);
const { drawerData } = toRefs(props, "drawerData");
const drawerType = toRef(props, "drawerType");
function changeType() {
  let val = {};
  if (radioText.value == "anew") {
    resetFiles(drawerData.value);
  } else {
    getCopyProofAnnex();
  }
}
// 上传正稿保存
function saveFileList() {
  let val = fileList.value;
  let arr = val.filter((item) => item); // 返回真的数据
  if (arr.length < fileData.value.fileListLen) {
    ElMessage.error("请上传所需文件");
    return;
  }
  proxy.$refs["formFile"].validate(async (valid) => {
    if (valid) {
      val = val.map((item, index) => {
        if (!item[0].name) {
          item = [
            {
              name: item,
              fileAddress: item,
              sort: Number(index) + 1,
            },
          ];
        }
        return item;
      });
      fileData.value.fileArr = val.map((item, index) => {
        return {
          fileName: getFileName(item[0].name),
          fileAddress: item[0].fileAddress,
          sort: item[0].sort,
          length: inputList.value[index],
        };
      });
      let fileDto = {
        files: fileData.value.fileArr,
        id: drawerData.value.originalId,
        remark: fileData.value.remark,
      };
      saveFile(fileDto).then((res) => {
        if (res.code == 200) {
          ElMessage.success(res.msg);
          proxy.$emit("update:drawerType", false);
          proxy.$emit("changelist");
          
        } else {
          ElMessage.error(res.msg);
        }
      }).finally(()=>{
        proxy.$emit("update:drawerType", false);
      })
    } else {
    }
  });
}

watch(
  [drawerData,drawerType],
  (val) => {
    nextTick(() => {
      getFilesList(val[0]);
    });
  },
  {  immediate: true }
);
//获取组件的文件
function getFilesList(val) {
  if (val) {
    if (val.dataVal) {
      fileData.value.remark = val.dataVal.remark;
      fileData.value.fileListLen = val.dataVal.annexCount;
    }
    fileData.value.originalId = val.originalId;
    fileData.value.poNo = val.poNo;
    fileList.value = val.uploadsFile;
    // if (val.inputVal && val.inputVal.length > 0) {
    //   inputList.value = val.inputVal.map((item) => {
    //     return item.length;
    //   });
    // }
  }
  proxy.resetForm("formFile");
}
function resetFiles(val) {
  fileList.value = val.uploadsFile;
}

function getCopyProofAnnex() {
  copyProofAnnex({ poNo: fileData.value.poNo }).then((res) => {
    if (res.code == 200) {
      ElMessage.success(res.msg);
      if (res.data) {
        fileList.value = res.data.map((item) => {
          return [
            {
              name: item.fileName,
              fileAddress: item.fileAddress,
              sort: item.sort,
            },
          ];
        });
        inputList.value = res.data.map((item) => {
          return item.length;
        });
      }
    } else {
    }
  });
}
function cancel() {
  proxy.resetForm("formFile");
  proxy.$emit("update:drawerType", false);
}
</script>

<style lang="scss" scoped>
.uploadOutwork {
  :deep(.el-drawer__header) {
    margin-bottom: 20px !important;
  }
  .units {
    // margin: 20px 0;
    font-size: 14px;
    .unitsOne,
    .unitsTwo {
      .outwork {
        display: flex;
        .file {
          line-height: 32px;
          width: 70px;
          flex-shrink: 0;
          margin-right: 8px;
          &::before {
            content: "*";
            color: red;
            margin-right: 4px;
          }
        }
        .upload {
          :deep(.el-upload-list__item-name) {
            display: inline-block;
            width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
          }
        }
      }
    }
    .fileInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .fileInfo {
      margin: 10px 0;
    }
  }
  .echoFileData {
    .file {
      margin: 20px 0;
      .content {
        display: flex;
        // justify-content: space-between;
        align-items: center;
        .name {
          max-width: 300px;
        }
        .time {
          margin: 0 20px;
        }
        a {
          color: #1890ff;
        }
      }
    }
  }
  .btnBox {
    text-align: right;
  }
}
</style>
<style scoped>
:deep(.el-drawer__header) {
  margin-bottom: 10px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color);
}
:deep(.el-drawer__body) {
  padding-right: 2px;
  padding-top: 0px;
}

.font :deep(label) {
  font-weight: normal;
}
.textleft :deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
