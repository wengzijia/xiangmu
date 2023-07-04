<template>
  <!-- 上传弹窗 -->
  <div class="uploadOutwork">
      <div class="units">
        <el-form :model="fdata" ref="formFile">
            <div v-if="drawerData?.annexUploadVO?.annexVOS">
              <p v-for="item in drawerData?.annexUploadVO?.annexVOS" :key="item">
                <FileShow title="结构文件：" :filename="item?.fileName" :fileurl="BASE_FILE_URL + item?.fileAddress"/>
              </p>
            </div>
            <div class="upload">
              <FileUpload
                :fileType="['jpg', 'jpeg', 'png', 'pdf', 'docx', 'doc','dxf','tif','ard','zip','rar']"
                :fileSize="200"
                :isShowTip="false"
                type=""
                name="上传结构"
                :fileListShow="false"
                v-model:modelValue="fileList"
                replace
                del
                cover
              />
            </div>
            <div v-if="drawerData.annexUploadVO.positionFlag != 2">
              <div style="color:red;">卡纸盒提交冻结之前需选择涂胶水位置</div>
              <el-select
                v-model="inputList"
                placeholder="请选择涂胶水位置"
                style="width: 90%"
                @change="positionchange"
                :disabled="drawerData.annexUploadVO.positionFlag == 2"
              >
                <template v-if="drawerData.annexUploadVO.positionFlag==0">
                  <el-option
                    v-for="item in position"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </template>
                <template v-if="drawerData.annexUploadVO.positionFlag==1">
                  <el-option
                    label="不粘"
                    value="不粘"
                  />
                </template>
              </el-select>
            </div>
        </el-form>
      </div>
      <!-- <div>
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="saveFileList">保存</el-button>
      </div> -->
  </div>
</template>

<script setup>
import { copyProofAnnex, saveFile } from "@/api/structural/selfWork";
import { ref } from "@vue/reactivity";
import { getFileName } from '@/utils/index'
import { ElMessage } from "element-plus";
import { onMounted } from "vue";
import {BASE_FILE_URL,BASE_UPLOAD_FILE_URL} from "@/store/global-constant";
// token
let MyHeader = reactive({
  token: localStorage.getItem("Access-Token"),
});
const { proxy } = getCurrentInstance();
const isUploadShow = ref(false);
let fdata=null
const data = reactive({
  //上传结构参数
  fileData: {
    fileListLen: "",
    selectList: [],
    fileArr: [],
    // remark: "",
    originalId: "",
    length: [],
  },
});
const imgShow = ref(false);
const controls = ref(false);
const isShow = ref(false)
let fileList = ref(null);
let inputList = ref('');
const { fileData } = toRefs(data);
const radioText = ref("anew");
//涂胶水位置:
const position = ref([
  {
    value: "粘左边",
    label: "粘左边",
  },
  {
    value: "粘右边",
    label: "粘右边",
  },
  {
    value: "异型盒",
    label: "异型盒",
  },
]);
const props = defineProps({
  drawerData: {
    type: Object,
    default: {},
  },
  //是否大货
  bulk: {
    type: Boolean,
    default: false,
  },

});
// defineEmits(["update:drawerType"]);
const emit = defineEmits(["changelist","doneclick"]);
const { drawerData } = toRefs(props);
onMounted(()=>{
  getCopyProofAnnex()
})

const positionchange = () => {
  console.log("1",props.drawerData?.annexUploadVO?.annexVOS)
  // console.log("2",fileList.value)
  // emit("changeList")
  if((props.drawerData?.annexUploadVO?.annexVOS&&props.drawerData?.annexUploadVO?.annexVOS[0].fileAddress)||fileList.value){
    saveFileList()
  }
}
// 上传保存
function saveFileList() {
  // let val = fileList.value;
  // let arr = val.filter((item) => item); 
  // if (arr.length < fileData.value.fileListLen) {
  //   ElMessage.error("请上传所需文件");
  //   return;
  // }

    let data=null
    if(fileList.value){
      data=[{
          fileAddress: fileList.value,
          fileName: getFileName(fileList.value),
          position: inputList.value,
      }]
    }else{
      if(props.drawerData?.annexUploadVO?.annexVOS){
        data=[{
          fileAddress: props.drawerData?.annexUploadVO?.annexVOS[0].fileAddress,
          fileName: props.drawerData?.annexUploadVO?.annexVOS[0].fileName,
          position: inputList.value,
        }]
      }

    }
    let fileDto = {
      files: data,
      id: props.drawerData.id,
      // remark: fileData.value.remark,
    };
    saveFile(fileDto).then((res) => {
      if (res.code == 200) {
        ElMessage.success(res.msg);
        if(fileList.value){
          fileList.value=null
        }
        emit("changeList")
        if(inputList.value){
          emit("doneclick",props.drawerData)
        }
        // proxy.$emit("update:drawerType", false);
      } else {
        ElMessage.error(res.msg);
      }
    }).finally(()=>{
      // proxy.$emit("update:drawerType", false);
    })
    
}

// watch(
//   [drawerData,drawerType],
//   (val) => {
//     nextTick(() => {
//       getFilesList(val[0]);
//     });
//   },
//   {immediate: true }
// );
watch(fileList,val=>{
  if(val){
    saveFileList()
    console.log(val);
  }
})

function getCopyProofAnnex() {
  if(props.drawerData.annexUploadVO){
    console.log(props.drawerData.annexUploadVO.positionFlag);
    if(props.drawerData?.annexUploadVO?.annexVOS){
      inputList.value=props.drawerData?.annexUploadVO?.annexVOS[0]?.position
    }
    
  }
  
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
:deep(.el-upload-list__item) {
  -webkit-transition: none !important;
  -moz-transition: none !important;
  -ms-transition: none !important;
  -o-transition: none !important;
  transition: none !important;
}
</style>
