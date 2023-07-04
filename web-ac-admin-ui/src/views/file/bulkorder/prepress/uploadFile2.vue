<template>
  <div v-if="partsList">
    <!-- <div style="font-size: 18px;">
      上传印前文件
    </div>
    <div class="prepress-tips">
      <el-icon >
        <Warning />
      </el-icon>&nbsp;每个部件至少上传一个文件才允许保存
    </div>
    <h3>PO号:{{ orderDetails.poNo }}</h3> -->
    <!-- <div v-for="(item,index) in partsList" :key="index"> -->
    <div>
      <!-- <div>部件{{index+1}}</div> -->
      <div class="file-list-box">
        <div class="prepressfile-remark">
          <span>印前文件:</span>
          <!-- {{item.pdfFile.fileAddress}} -->
          <PrepressUpload v-model:modelValue="partsList.pdfFile.fileAddress" :down="false" :orderDetails="orderDetails" newstyle :isShowTip="false" replace :orderType="0" @callBack="url=>{setReport(url)}"></PrepressUpload>
        </div>
        <!-- {{fileobj?.orderFrom}} -->
        <!-- <div class="prepressfile-remark" v-if="fileobj?.orderFrom&&(fileobj?.orderFrom==2||fileobj?.orderFrom==8||fileobj?.orderFrom==14)"> -->
        <div class="prepressfile-remark">
          <template v-if="isvideo(fileobj.productName)">
            <span>3D视频文件:</span>
            <FileUpload :fileType="['pdf','mp4','gif','dxf','tif','ard']" newstyle :fileListShow="false" :txtgrey="fileobj.orderFrom&&(fileobj.orderFrom==10||fileobj.orderFrom==15)" :isShowTip="false" :fileSize="200" replace v-model:modelValue="partsList.videofile.fileAddress" @callBack="videocb"/>
          </template>
        </div>
        <!-- <div class="prepressfile-remark">
          <span>report文件:</span>
          <FileUpload :fileType="['png','jpg','jpeg','dxf','tif','ard']" :fileSize="200" replace down v-model:modelValue="item.reportFile.fileAddress"/>
        </div> -->
      </div>
    </div>
    <!-- <div class="prepressfile-remark" style="width: 1200px;">
      <span>印前备注:</span>
      <div>
        <el-input v-model.trim="remark" :rows="5" maxlength="300" show-word-limit type="textarea" placeholder="请输入印前备注"
        style="width: 500px;margin-right:20px;" />
      </div>
      
      <FileUpload :fileType="['png', 'jpg', 'jpeg','dxf','tif','ard']" :fileSize="200" down del
        v-model:modelValue="remarkImageUrl" />
    </div>
    <div class="prepressfile-remark" style="width: 1200px;">
      <span>PDF备注:</span>
      <Editor v-model:html="pdfRemark" placeholder="请输入PDF备注内容"></Editor>
    </div> -->
    <!-- <div class="form-tool-bar" style="margin-top:20px;">
      <div style="min-width:160px;width:160px;">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { getPrepressFile,saveUploadFile,getPrepressDetailById } from '@/api/prepress';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import PrepressUpload from '@/components/FileUpload/prepressUpload.vue';
import Editor from "@/components/Editor"
import {getFileName} from "@/utils/index"
import {nextTick} from "vue"
let emits = defineEmits(["changeList","doneclick"]);
const route = useRoute();
const router = useRouter();
const props = defineProps({
  fileobj: {
    type: Object,
    default: {},
  }
});
let videostr='卡纸盒/微坑盒/卡纸内托/坑纸内托/定制尺寸手提袋/固定尺寸手提袋/外箱/平口箱/全封口箱/飞机盒箱/天地盖箱/扣底箱/刀卡/平卡'
const orderDetails = ref('')
const fileList = ref([])
var pdfRemark = ref('')
const remarkImageUrl = ref('')
let partsList = ref({
  pdfFile:{},
  videofile:{},
  reportFile:{}
})
// if (route.query.id) {
getInfo()
  // getDetails(route.query.id)
// }
function isvideo(str){
  if(!str)return false
  let name=''
  if(str.indexOf('-')>-1){
    name=str.split("-")[0]
  }else{
    name=str
  }
  if(videostr.indexOf(name)>-1){
    return true
  }else{
    return false
  }
}
//获取要上传的PO文件详情
function getInfo() {
  // getPrepressFile(id).then(res => {
  //   if (res.code == 200) {
      // remark.value = res.data.remark
      // pdfRemark.value = res.data.pdfRemark||''
      let fObj = {
        fileAddress: '',
        fileName: '',
      }

      console.log('props.fileobj',props.fileobj);
      // return
      if(props.fileobj?.annexs&&props.fileobj?.annexs.length){
        partsList.value.pdfFile = { ...fObj, fileType: 'PDF文件' }
        partsList.value.videofile = { ...fObj, fileType: '3D视频文件' }
        partsList.value.reportFile = { ...fObj, fileType: 'report文件' }
        props.fileobj.annexs.forEach(item=>{
          if(item?.fileType&&item?.fileType=='PDF文件') partsList.value.pdfFile=item
          if(item?.fileType&&item?.fileType=='3D视频文件') partsList.value.videofile=item
          if(item?.fileType&&item?.fileType=='report文件') partsList.value.reportFile=item
          // partsList.value.pdfFile = item?.fileType&&item?.fileType=='PDF文件'?item
          // partsList.value.videofile = item?.fileType&&item?.fileType=='3D视频文件'?item
          // partsList.value.reportFile = item?.fileType&&item?.fileType=='report文件'?item
        })
      }
      // console.log('partsList.value',partsList.value);
      // remarkImageUrl.value = res.data.remarkImageUrl||''
    // }
    orderDetails.value = props.fileobj
  // })
}
//获取订单详情
function getDetails(id){
  // getPrepressDetailById(id).then(res=>{
  //   if (res.code==200) {
  //     orderDetails.value = res.data
  //     remark.value = res.data.remark
  //   }
  // })
}
var remark = ref('')
function videocb(){
  // console.log('jscall');
  save(props.fileobj?.productName)
}
//保存上传文件
function save(name='') {
  let flag = 0
  let str = ''
  nextTick(()=>{
    // let arr = partsList.value.map((item,index)=>{
      // if (!item.pdfFile.fileAddress || !item.reportFile.fileAddress&&!item.videofile.fileAddress) {
      //   if (flag==0) {
      //     if (!item.pdfFile.fileAddress) {
      //       str = 'PDF'
      //     }else{
      //       str = ''
      //     }
      //     flag = index+1
      //   }
      // }
      // return {
      //   fileGroup: item.fileGroup,
      //   pdfFile: item.pdfFile.fileAddress,
      //   reportFile: item.reportFile.fileAddress,
      //   videofile: item.videofile.fileAddress
      // }
    // })
    let data = {
      activityId:props.fileobj?.activityId,
      // remark:remark.value,
      // pdfRemark:pdfRemark.value,
      // remarkImageUrl:Array.isArray(remarkImageUrl.value)?remarkImageUrl.value:remarkImageUrl.value.split(',').filter(a=>a),
      uploadFiles: [{
        pdfFile: partsList.value?.pdfFile?.fileAddress,
        videofile: partsList.value?.videofile?.fileAddress,
        reportFile: partsList.value?.reportFile?.fileAddress,
        fileGroup:'1'
      }]
    } 
    console.log('data',data);
    saveUploadFile(data).then(res=>{
      if (res.code==200) {
        ElMessage({
          type: 'success',
          message: '保存成功',
        })
        if(name&&isvideo(name)&&partsList.value?.pdfFile?.fileAddress&&partsList.value?.videofile?.fileAddress){
          emits("doneclick",props.fileobj)
        }
        emits("changeList")
        // router.go(-1)
      }
    })
    
    // console.log('data',data);
  })
  
  // if (flag) {
  //   ElMessage({
  //     type: 'error',
  //     message: `请上传部件${flag}的${str}文件`,
  //   })
  //   return
  // }
  
  
}
function goBack(){
  router.go(-1)
}

function setReport(data) {
  save()
  partsList.value.reportFile.fileAddress = data 
  partsList.value.reportFile.fileName = getFileName(data)
}
</script>

<style lang="scss" scoped>
@import './style.css';
.prepress-tips {
  margin: 10px 0;
  padding: 6px;
  background-color: rgba(233,233,233,0.7);
  display: flex;
  align-items: center;
}

.prepressfile-remark {
  min-width: 600px;
  flex: 1;
  display: flex;
  margin-top: 20px;
  width: 600px;
  span {
    display: inline-block;
    width: 80px;
    min-width: 80px;
    max-width: 80px;
    margin-right: 10px;
    text-align: right;
  }
}

.file-list-box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
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
</style>