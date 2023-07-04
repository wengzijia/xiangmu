<template>
  <el-dialog v-model="isShow" title="上传印前文件" :close-on-click-modal="false" destroy-on-close align-center
      width="1000px" @close="closefn">
    <!-- <div style="font-size: 18px;">
      上传印前文件
    </div> -->
    <!-- <div class="prepress-tips">
      <el-icon >
        <Warning />
      </el-icon>&nbsp;每个部件至少上传一个文件才允许保存
    </div> -->
    <!-- <h3>PO号:{{ orderDetails.poNo }}</h3> -->
    <div style="font-size:15px;padding:10px 0;"> <b>PO号:{{ orderDetails.poNo }}</b></div>
    <div v-for="(item,index) in partsList" :key="index">
      <!-- <div>部件{{index+1}}</div> -->
      <div class="file-list-box">
        <div class="prepressfile-remark inline">
          <span><span style="color:red;display: none;margin-right: 2px;line-height: 16px;">*</span>结构文件</span>
          <el-link v-if="structureFlag" :href="BASE_FILE_URL + item.structureFile.fileAddress" type="primary" :underline="false" target="_blank">{{ getFileName(item.structureFile.fileAddress) }}</el-link>
          <blueStyleFileUpload v-else :fileType="['jpg','jpeg','png','pdf','docx', 'doc','dxf','tif','ard','zip','rar']" :fileSize="200" replace del down v-model:modelValue="item.structureFile.fileAddress"/>
        </div>
        <div class="prepressfile-remark">
          <span><span style="color:red;display: none;margin-right: 2px;line-height: 16px;">*</span>切割文件</span>
          <blueStyleFileUpload :fileType="['jpg', 'jpeg', 'png', 'pdf', 'docx', 'doc','dxf','tif','ard','zip','rar']" :fileSize="200" del replace v-model:modelValue="item.cuttingFile.fileAddress"/>
        </div>
        <div class="prepressfile-remark">
          <span>印前文件</span>
          <blueStyleFileUpload :fileType="['png','jpg','jpeg','pdf','dxf','tif','ard','zip','rar']" :fileSize="200" replace del  v-model:modelValue="item.prepressFile.fileAddress"/>
        </div>
        <!-- <div class="prepressfile-remark">
          <span>调色文件:</span>
          <FileUpload :fileType="['png','jpg','jpeg']" :fileSize="200" :limit="1" v-model:modelValue="item.toningFile.fileAddress"/>
        </div> -->
        <!-- <div class="prepressfile-remark">
          <span>打样文件:</span>
          <FileUpload :fileType="['png','jpg','jpeg','dxf','tif','ard','zip','rar']" :fileSize="200" replace v-model:modelValue="item.proofingFile.fileAddress"/>
        </div> -->
      </div>
    </div>
    <div style="font-size:15px;padding:10px 0;"> <b>备注</b></div>
    <div class="prepressfile-remark">
      <span>印前备注</span>
      <div>
        <el-input v-model="remark" :rows="2" maxlength="300" show-word-limit type="textarea" placeholder="请输入印前备注"
        style="width: 650px;" />
      </div>
    </div>
    <div class="prepressfile-remark"> 
      <span>备注文件</span>
      <blueStyleFileUpload :fileType="['png', 'jpg', 'jpeg','dxf','tif','ard','zip','rar']" :fileSize="200" down del
        v-model:modelValue="remarkImageUrl" />
    </div>
    <!-- <div class="form-tool-bar" style="margin-top:20px;">
      <div style="min-width:160px;width:160px;">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div> -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closefn">取消</el-button>
        <el-button type="primary" @click="save">
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { watch } from 'vue';
import { getPrepressFile,saveProofFile,getPrepressDetailById } from '@/api/prepress';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { BASE_FILE_URL } from "@/store/global-constant";
import {getFileName} from "@/utils/index"
import blueStyleFileUpload from "@/components/FileUpload/blueStyle.vue"
const route = useRoute();
const router = useRouter();
const props = defineProps({
    data:{
        type:String,
        default:''
    },
    isShow:{
        type:Boolean,
        default:false
    },
    dialogId:{
        type:String,
        default:''
    }
})
const emits = defineEmits(['update:isShow','saveCallback']);
var partsList = ref([])
if (props.dialogId) {
  getInfo(props.dialogId)
  getDetails(props.dialogId)
}
const structureFlag = ref(false)
const structureFile = ref([])
const remarkImageUrl = ref('')
if (props.data) {
  structureFlag.value = true
  structureFile.value = JSON.parse(props.data)
}
function closefn(){
  emits("update:isShow", false);
}
//获取上传文件详情
function getInfo(id) {
  getPrepressFile(id).then(res => {
    if (res.code == 200) {
      let fileObj = 	{
        "fileAddress": "",
        "fileName": "",
      }
      partsList.value = res.data.parts.map((item,i)=>{
        if (item.annexFiles.length>0) {
          item.structureFile = item.annexFiles.find(e=> e.fileType==='结构文件') || null
          item.prepressFile = item.annexFiles.find(e=> e.fileType==='印前文件') || { ...fileObj, fileType: '印前文件', }
          // item.toningFile = item.annexFiles.find(e=> e.fileType==='调色文件') || { ...fileObj, fileType: '调色文件', }
          // item.proofingFile = item.annexFiles.find(e=> e.fileType==='打样文件') || { ...fileObj, fileType: '打样文件', }
          item.cuttingFile = item.annexFiles.find(e=> e.fileType==='切割文件') || { ...fileObj, fileType: '切割文件', }
          if (!item.structureFile) {
            if (structureFile.value.length>0) {
              item.structureFile = structureFile.value.find(a=>{return a.sort==item.fileGroup})
            }else{
              item.structureFile = { ...fileObj, fileType: '印前文件', }
            }
          }
        }
        return item
      })
      remarkImageUrl.value = res.data.remarkImageUrl||''
    }
  })
}
const orderDetails = ref('')
//获取订单详情
function getDetails(id){
  getPrepressDetailById(id).then(res=>{
    if (res.code==200) {
      orderDetails.value = res.data
      remark.value = res.data.remark
    }
  })
}
var remark = ref('')
//保存上传文件
function save() {
  let flag = 0
  let str = ''
  let arr = partsList.value.map((item,index)=>{
    // if (!item.cuttingFile.fileAddress) {//||!item.structureFile.fileAddress||(!item.prepressFile.fileAddress&&!item.proofingFile.fileAddress)
    if (!item.cuttingFile.fileAddress&&!item.structureFile.fileAddress&&!item.prepressFile.fileAddress) {//||!item.structureFile.fileAddress||(!item.prepressFile.fileAddress&&!item.proofingFile.fileAddress)&&!item.proofingFile.fileAddress
      if (flag==0) {
        flag = index+1
        // if(!item.cuttingFile.fileAddress){
        //   str = '切割'
        // }else{
        //   str = ''
        // }
        // if (!item.structureFile.fileAddress) {
        //   str = '结构'
        // }else{
        //   str = ''
        // }
      }
    }
    return {
      fileGroup: item.fileGroup,
			prepressFile: item.prepressFile.fileAddress,
			// proofingFile: item.proofingFile.fileAddress,
			structureFile: item.structureFile.fileAddress,
			// toningFile: item.toningFile.fileAddress,
			cuttingFile: item.cuttingFile.fileAddress,
    }
  })
  // if (flag) {
  //   ElMessage({
  //     type: 'error',
  //     message: `请上传部件${flag}的${str}文件`,
  //   })
  //   return
  // }
  if (flag) {
    ElMessage({
      type: 'error',
      message: `至少上传1个文件`,
    })
    return
  }
  let data = {
    activityId:props.dialogId,
    remark:remark.value,
    remarkImageUrl:Array.isArray(remarkImageUrl.value)?remarkImageUrl.value:remarkImageUrl.value.split(',').filter(a=>a),
    uploadFiles: arr
  }
  saveProofFile(data).then(res=>{
    if (res.code==200) {
      ElMessage({
        type: 'success',
        message: '保存成功',
      })
      emits("saveCallback")
      closefn()
    }
  })
}
function goBack(){
  router.go(-1)
}

</script>

<style lang="scss" scoped>
.form-tool-bar {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 20px;
}
.overflow-tooltip{
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
}
.prepress-tips {
  margin: 10px 0;
  padding: 6px;
  background-color: rgba(233,233,233,0.7);
  display: flex;
  align-items: center;
}

.prepressfile-remark {
  // min-width: 800px;
  // flex: 1;
  display: flex;
  margin-top: 20px;
  width: 480px;
  span {
    display: inline-block;
    width: 60px;
    min-width: 60px;
    max-width: 60px;
    margin-right: 10px;
    text-align: right;
  }
}

.file-list-box {
  width: 100%;
  display: flex;
  flex-flow: wrap;
  // flex-wrap: wrap;
}

.text-ov {
  margin: 10px 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
}
.upload-file-uploader {
  margin-bottom: 5px;
}
.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
  padding-left: 8px;
}
.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}
.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
:deep(.inline .el-link){
  display: inline;
}
</style>