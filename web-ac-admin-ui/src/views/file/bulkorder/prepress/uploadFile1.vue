<template>
  <el-card style="font-size: 14px;margin:10px;">
    <div style="font-size: 18px;">
      上传印前文件
    </div>
    <div class="prepress-tips">
      <el-icon >
        <Warning />
      </el-icon>&nbsp;所有纸质材质的面板、芯板、内衬零件的PDF文件为必传
    </div>
    <h3>PO号:{{ orderDetails.poNo }}</h3>
    <div v-for="(item1, index1) in partsList" :key="index1">
      <div class="main-file">
        <div class="prepressfile-remark">
          <span>PDF文件:</span>
          <PrepressUpload v-model:modelValue="item1.pdfFile.fileAddress" :productAttr="orderDetails.productAttr" :poNo="orderDetails.poNo" :orderDetails="orderDetails" :orderType="1" del @callBack="url=>{setReport(url,item1)}"></PrepressUpload>
        </div>
        <div class="prepressfile-remark">
          <span>3D视频文件:</span>
          <FileUpload :fileType="['pdf', 'mp4', 'gif','dxf','tif','ard']" :fileSize="200" replace down
            v-model:modelValue="item1.videofile.fileAddress" />
        </div>
        <div class="prepressfile-remark">
          <span>report文件:</span>
          <FileUpload :fileType="['png', 'jpg', 'jpeg','dxf','tif','ard']" :fileSize="200" replace down
            v-model:modelValue="item1.reportFile.fileAddress" />
        </div>
      </div>
      <div v-for="(parts, index3) in item1.modules" :key="index3">
        <div>
          <span>部件{{parts.partNumber}}: {{parts.partName}}</span>
        </div>
        <div style="overflow: hidden;display: flex;">
          <div >po编号:{{ parts.poNo }}</div>
          <div style="margin-left:20px;display: flex;overflow: hidden;flex: 1;">
            <div style="width:80px">
            部件属性:
            </div>
          <div @click="showAttr(parts.partProperties)"  class="text-ov">{{ parts.partProperties }}</div></div>
        </div>
        <el-table :data="parts.components" style="width: 100%">
          <el-table-column label="零件名称" prop="name" width="80px" />
          <el-table-column label="PO编号" prop="poNo">
            <template #default="scope">
            <el-link :underline="false" v-copyText="scope.row.poNo" v-copyText:callback="copyTextSuccess">{{ scope.row.poNo}}</el-link>
            </template>

          </el-table-column>
          <el-table-column label="零件属性" width="460">
            <template #default="scope">
              <!-- <OrderAttrShow :attr="scope.row.properties" :line="1"></OrderAttrShow> -->
              <el-link :underline="false" @click="showAttr(scope.row.properties)">
                <div style="-webkit-line-clamp: 1;">{{scope.row.properties}}</div>
              </el-link>
              <!-- <div>{{ scope.row.properties }}</div> -->
            </template>
          </el-table-column>
          <el-table-column label="结构文件" width="120px">
            <template #default="scope">
              <el-link v-if="item1.modules[index3].components[scope.$index].structureFile.fileAddress" :underline='false' title="下载结构文件" :href="'/api/consumer/certifyFree/alibaba/oss/getDownloadFile?fileName='+item1.modules[index3].components[scope.$index].structureFile.fileAddress"> 下载文件 <el-icon style=" font-size:16px;font-weight: bold;"><Download /></el-icon></el-link>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="PDF文件" width="340px">
            <template #default="scope">
              <PrepressUpload :fileSize="200" v-model:modelValue="item1.modules[index3].components[scope.$index].pdfFile.fileAddress" isPart :productAttr="scope.row.properties" :poNo="scope.row.poNo" :orderDetails="orderDetails" @callBack="url=>{setReport(url,item1.modules[index3].components[scope.$index])}"></PrepressUpload>
            </template>
          </el-table-column>
          <!-- <el-table-column label="3D视频文件" width="340px">
            <template #default="scope">
              <FileUpload :fileType="['pdf', 'mp4', 'gif']" :fileSize="200" :limit="5" replace down
                v-model:modelValue="item1.modules[index3].components[scope.$index].videofile.fileAddress" />
            </template>
          </el-table-column> -->
          <el-table-column label="Report文件" width="340px">
            <template #default="scope">
              <FileUpload :fileType="['png', 'jpg', 'jpeg','dxf','tif','ard']" :fileSize="200" :limit="5" replace down
                v-model:modelValue="item1.modules[index3].components[scope.$index].reportFile.fileAddress" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="prepressfile-remark" style="width: 1200px;">
      <span>印前备注:</span>
      <div>
        <el-input v-model.trim="remark" :rows="5" maxlength="300" show-word-limit type="textarea" placeholder="请输入印前备注"
        style="width: 500px;margin-right:20px;" />
      </div>
      <FileUpload :fileType="['png', 'jpg', 'jpeg','dxf','tif','ard']" :fileSize="200" down del
          v-model:modelValue="remarkImageUrl"/>
    </div>
    <div class="prepressfile-remark" style="width: 1200px;">
      <span>PDF备注:</span>
      <Editor v-model:html="pdfRemark" placeholder="请输入PDF备注内容"></Editor>
    </div>
    <div class="form-tool-bar" style="margin-top:20px;">
      <div style="min-width:160px;width:160px;">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { watch } from 'vue';
import { getPrepressFile, saveUploadFile, getPrepressDetailById } from '@/api/prepress';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import PrepressUpload from '@/components/FileUpload/prepressUpload.vue';
import OrderAttrShow from "@/components/OrderAttrShow"
import Editor from "@/components/Editor"
import {getFileName} from "@/utils/index"
const route = useRoute();
const router = useRouter();
const fileGroup = ref('')
const remarkImageUrl = ref('')
var remark = ref('')
var pdfRemark = ref('')
const orderDetails = ref({})
var partsList = ref([])
const { proxy } = getCurrentInstance();
if (route.query.id) {
  getInfo(route.query.id)
  getDetails(route.query.id)
}
//根据ID获取要上传的文件详情
function getInfo(id) {
  proxy.$modal.loading('数据加载中...')
  getPrepressFile(id).then(res => {
    let fileObj = {
      fileAddress: '',
      fileName: '',
    }
    if (res.code == 200) {
      //fileGroup保存时候要用,因为精装盒只有1个parts，所以直接保存
      fileGroup.value = res.data.parts[0].fileGroup
      remark.value = res.data.remark
      pdfRemark.value = res.data.pdfRemark||''
      remarkImageUrl.value = res.data.remarkImageUrl||''
      //遍历把数据转换成前端展示对应的格式
      partsList.value = res.data.parts.map(e => {
        e.pdfFile = e.annexFiles.find(e => e.fileType == 'PDF文件') || { ...fileObj, fileType: 'PDF文件' }
        e.videofile = e.annexFiles.find(e => e.fileType == '3D视频文件') || { ...fileObj, fileType: '3D视频文件' }
        e.reportFile = e.annexFiles.find(e => e.fileType == 'report文件') || { ...fileObj, fileType: 'report文件' }
        e.modules = e.modules.map(s => {
          s.components = s.components.map(c => {
            let c2 = {
              ...c,
              pdfFile: c.files.find(e => e.fileType == 'PDF文件') || { ...fileObj, fileType: 'PDF文件',componentsNo:c.id },
              // videofile: c.files.find(e => e.fileType == '3D视频文件') || { ...fileObj, fileType: '3D视频文件',componentsNo:c.id },
              reportFile: c.files.find(e => e.fileType == 'report文件') || { ...fileObj, fileType: 'report文件',componentsNo:c.id },
              structureFile :c.files.find(e => e.fileType == '结构文件') || { ...fileObj, fileType: '结构文件',componentsNo:c.id },
            }
            if (!c2.pdfFile.componentsNo||c2.pdfFile.componentsNo) {
              c2.pdfFile.componentsNo = c.id
            }
            // if (!c2.videofile.componentsNo||c2.videofile.componentsNo) {
            //   c2.videofile.componentsNo = c.id
            // }
            if (!c2.reportFile.componentsNo||c2.reportFile.componentsNo) {
              c2.reportFile.componentsNo = c.id
            }
            return c2
          })
          return s
        })
        return e
      })
      orderDetails.value = res.data
    }
  }).finally(()=>{
    proxy.$modal.closeLoading()
  })
}
//获取订单详情,上传pdf的接口要订单的productAttr和poNo.一开始后端没有在getInfo里面返回，后面才加的，但是我懒得改了
function getDetails(id) {
  // getPrepressDetailById(id).then(res => {
  //   if (res.code == 200) {
  //     orderDetails.value = res.data
  //     remark.value = res.data.remark
  //   }
  // })
}
//保存上传文件
function save() {
  //把所有文件存到componentsFiles里面,保存的时候要用
  let componentsFiles = []
  partsList.value[0].modules.map(item => {
    item.components.map(e => {
      componentsFiles.push(e.pdfFile)
      componentsFiles.push(e.videofile)
      componentsFiles.push(e.reportFile)
      componentsFiles.push(e.structureFile)
    })
  })
  //过滤掉没有上传文件的
  componentsFiles = componentsFiles.filter(item => {
    return item?.fileAddress
  })
  // if (!partsList.value[0].pdfFile?.fileAddress || !partsList.value[0].reportFile?.fileAddress && !partsList.value[0].videofile?.fileAddress) {
  //   ElMessage({
  //     type: 'error',
  //     message: '请上传主文件',
  //   })
  //   return
  // }
  let data = {
    activityId: route.query.id,
    pdfRemark:pdfRemark.value,
    remark: remark.value,
    remarkImageUrl:Array.isArray(remarkImageUrl.value)?remarkImageUrl.value:remarkImageUrl.value.split(',').filter(a=>a),
    uploadFiles: [
      {
        componentsFiles: componentsFiles,
        fileGroup: fileGroup.value,
        pdfFile: partsList.value[0].pdfFile?.fileAddress,
        reportFile: partsList.value[0].reportFile?.fileAddress,
        videofile: partsList.value[0].videofile?.fileAddress
      }
    ]
  }
  proxy.$modal.loading('正在上传文件，请稍候...')
  saveUploadFile(data).then(res => {
    if (res.code == 200) {
      ElMessage({
        type: 'success',
        message: '保存成功',
      })
      proxy.$modal.closeLoading()
      router.go(-1)
    }
  }).finally(()=>{
		proxy.$modal.closeLoading()
  })
}
function goBack() {
  router.go(-1)
}
//上传PDF文件的时候会一起生成report文件，有返回report文件的话要回写
function setReport(data,i) {
  i.reportFile.fileAddress = data 
  i.reportFile.fileName = getFileName(data)
}
//弹窗展示商品属性
function showAttr(text) {
  ElMessageBox.alert(text, '属性详情', {
    confirmButtonText: '关闭',
    callback: () => { }
  })
}
/** 复制代码成功 */
function copyTextSuccess() {
  ElMessage.success("PO号复制成功");
}
</script>

<style lang="scss" scoped>
@import './style.css';

.prepress-tips {
  margin: 10px 0;
  padding: 6px;
  background-color: rgb(255, 251, 232);
  color: #ed6a0c;
  display: flex;
  align-items: center;
}
.main-file{
  display: flex;
  flex-wrap: wrap;
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
    min-width: 86px;
    max-width: 86px;
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
  width: 93%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  cursor: pointer;
  &:hover{
    color: #409EFF;
  }
}
</style>