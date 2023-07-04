<template>
  <div>
  <el-card style="font-size: 14px;margin:10px;">
    <div style="font-size: 18px;">
      上传印前文件
    </div>
    <div class="prepress-tips">
      <el-icon >
        <Warning />
      </el-icon>&nbsp;每个部件至少上传一个文件才允许保存
    </div>
    <h3>PO号:{{ orderDetails.poNo }}</h3>
    <div class="file-list-box">
      <div class="prepressfile-remark" style="width: 800px;">
        <span><span style="color:red;display: none;margin-right: 2px;line-height: 16px;">*</span>结构文件:</span>
        <div v-if="structureFlag">
            <div v-for="(item,index) in structureFlag" :key="index">
              <el-link :href="BASE_FILE_URL + item.fileAddress" :underline="false" target="_blank">
                {{ item.fileName }}
              </el-link>
            </div>
        </div>
        <FileUpload v-else :fileType="['jpg', 'jpeg', 'png', 'pdf', 'docx', 'doc','dxf','tif','ard','zip','rar']" :fileSize="200" replace down v-model:modelValue="structureFile"/>
      </div>
      <div class="prepressfile-remark">
        <span><span style="color:red;display: none;margin-right: 2px;line-height: 16px;">*</span>切割文件:</span>
        <FileUpload :fileType="['jpg', 'jpeg', 'png', 'pdf', 'docx', 'doc','dxf','tif','ard','zip','rar']" :fileSize="200" replace down v-model:modelValue="cuttingFile"/>
      </div>
      <div class="prepressfile-remark">
        <span>PO适配图:</span>
        <FileUpload :fileType="['png','jpg','jpeg','dxf','tif','ard','zip','rar']" :fileSize="200" replace down v-model:modelValue="poFile"/>
      </div>
      <div class="prepressfile-remark">
        <span>印前文件:</span>
        <FileUpload :fileType="['png','jpg','jpeg','pdf','dxf','tif','ard','zip','rar']" :fileSize="200" replace down v-model:modelValue="prepressFile"/>
      </div>
    </div>
    <template v-if="partsList.length>0">
    <div  v-for="(parts,index) in partsList" :key="parts.id">
      <div>部件{{parts.partNumber}}: {{parts.partName}}</div>
      <!-- <div class="text-ov">
        <span>po编号:{{parts.poNo}}</span>
        <span style="margin-left:20px;">部件属性:{{parts.partProperties}}</span>
      </div> -->
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
        <el-table-column label="零件属性" width="260">
          <template #default="scope">
            <!-- <OrderAttrShow :attr="scope.row.properties" :activityId="scope.row.activityId" :line="1"></OrderAttrShow> -->
              <el-link :underline="false" @click="showAttr(scope.row.properties)">
              <div class="overflow-tooltip">{{scope.row.properties}}</div>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="结构文件" width="340px">
          <template #default="scope">
            <FileUpload :fileType="['png','jpg','jpeg','pdf','dxf','tif','ard','zip','rar']" :fileSize="200" :limit="5" replace down
              v-model:modelValue="partsList[index].components[scope.$index].structureFile.fileAddress" />
          </template>
        </el-table-column>
        <el-table-column label="印前文件" width="340px">
          <template #default="scope">
            <FileUpload :fileType="['png','jpg','jpeg','pdf','dxf','tif','ard','zip','rar']" :fileSize="200" :limit="5" replace down
              v-model:modelValue="partsList[index].components[scope.$index].prepressFile.fileAddress" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="调色文件" width="340px">
          <template #default="scope">
            <FileUpload :fileType="['png','jpg','jpeg','pdf']" :fileSize="200" :limit="5" replace down
              v-model:modelValue="partsList[index].components[scope.$index].toningFile.fileAddress" />
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="打样文件" width="340px">
          <template #default="scope">
            <FileUpload :fileType="['png','jpg','jpeg','pdf','dxf','tif','ard','zip','rar']" :fileSize="200" :limit="5" replace down
              v-model:modelValue="partsList[index].components[scope.$index].proofingFile.fileAddress" />
          </template>
        </el-table-column> -->
      </el-table>
      <div class="prepressfile-remark" style="width: 600px;display: flex;">
        <span><span style="color:red;display: inline;margin-right: 2px;line-height: 16px;">*</span>PO适配图:</span>
        <FileUpload :fileType="['png','jpg','jpeg','pdf','dxf','tif','ard','zip','rar']" :fileSize="200" :limit="1" del down v-model:modelValue="partsList[index].poFileAddress"/>
      </div>
    </div>
    </template>
    <div class="prepressfile-remark" style="width: 600px;display: flex;">
      <span>印前备注:</span>
      <div>
        <el-input v-model="remark" :rows="5" maxlength="300" show-word-limit type="textarea" placeholder="请输入印前备注"
        style="min-width: 300px;position: relative;" />
      </div>
      <div style="margin-left: 20px;">
        <FileUpload :fileType="['png', 'jpg', 'jpeg','dxf','tif','ard','zip','rar']" :fileSize="200" down del
        v-model:modelValue="remarkImageUrl" />
      </div>
      
    </div>
    <div class="form-tool-bar" style="margin-top:20px;">
      <div style="min-width:160px;width:160px;">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
  </el-card>
</div>
</template>

<script setup>
import { getPrepressFile,saveProofFile,selfworkUploadFile } from '@/api/prepress';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { BASE_FILE_URL } from "@/store/global-constant";
import OrderAttrShow from "@/components/OrderAttrShow"
const route = useRoute();
const router = useRouter();
const remark = ref('')
const remarkImageUrl = ref('')
var partsList = ref([])
const fileGroup = ref(null)
if (route.query.id) {
  getInfo(route.query.id)
}
const orderDetails = ref('')
//获取上传文件详情
function getInfo(id) {
  getPrepressFile(id).then(res => {
    if (res.code == 200) {
      remark.value = res.data.remark
      remarkImageUrl.value = res.data.remarkImageUrl||''
      let fileObj = 	{
        "fileAddress": "",
        "fileName": "",
      }
      // if(!structureFlag.value){
      //   structureFile.value = res.data.parts[0].annexFiles.find(e=> e.fileType==='结构文件')?.fileAddress || ''
      // }
      prepressFile.value = res.data.parts[0].annexFiles.find(e=> e.fileType==='印前文件')?.fileAddress || ''
      poFile.value = res.data.parts[0].annexFiles.find(e=> e.fileType==='PO适配图')?.fileAddress || ''
      cuttingFile.value = res.data.parts[0].annexFiles.find(e=> e.fileType==='切割文件')?.fileAddress || ''
      fileGroup.value = res.data.parts[0].fileGroup
      partsList.value = res.data.parts[0].modules.map(e => {
        e.components = e.components.map(item => {
            item.structureFile = item.files.find(e=> e.fileType==='结构文件') || { ...fileObj, fileType: '结构文件', componentsNo:item.id}
            item.prepressFile = item.files.find(e=> e.fileType==='印前文件') || { ...fileObj, fileType: '印前文件', componentsNo:item.id}
            // item.toningFile = item.files.find(e=> e.fileType==='调色文件') || { ...fileObj, fileType: '调色文件', componentsNo:item.id}
            // item.proofingFile = item.files.find(e=> e.fileType==='打样文件') || { ...fileObj, fileType: '打样文件', componentsNo:item.id}
            if (!item.structureFile?.componentsNo) {
              item.structureFile = {...item.structureFile,componentsNo:item.id}
            }
            if (!item.prepressFile?.componentsNo) {
              // item.prepressFile.componentsNo = item.id
              item.prepressFile = {...item.prepressFile,componentsNo:item.id}
            }
            if (!item.toningFile?.componentsNo) {
              // item.toningFile.componentsNo = item.id
              item.toningFile = {...item.toningFile,componentsNo:item.id}
            }
            // if (!item.proofingFile?.componentsNo) {
            //   // item.proofingFile.componentsNo = item.id
            //   item.proofingFile = {...item.proofingFile,componentsNo:item.id}
            // }
          return item
        })
        return e
      })
      orderDetails.value = res.data
    }
  })
}
var structureFile = ref('')
const structureFlag = ref(false)
if (!!route.query.structuralFile) {
  structureFlag.value = JSON.parse(route.query.structuralFile)
  structureFile.value = JSON.parse(route.query.structuralFile).map(item=>{return item.fileAddress}).join(',')
}else{
  structureFlag.value = false
}
const prepressFile = ref('')
const poFile = ref('')
const cuttingFile = ref('')
//保存上传文件
function save() {
  //把所有文件存到componentsFiles里面
  let componentsFiles = []
  let component = [];
  let flag = 0
  partsList.value.map((item,index)=>{
    if (!item.poFileAddress&&flag == 0) {
      flag = (index+1)+item.partName
    }
    component.push({id:item.id,poFileAddress:item.poFileAddress})
    item.components.map(e=>{
      componentsFiles.push(e.structureFile)
      componentsFiles.push(e.prepressFile)
      componentsFiles.push(e.toningFile)
      // componentsFiles.push(e.proofingFile)
    })
  })
  componentsFiles = componentsFiles.filter(item=>{return item.fileAddress})

  componentsFiles = componentsFiles.map((item,index)=>{
    if (item.fileAddress) {
      item.fileName = undefined
    }
    return item
  }) 
  // if (flag) {
  //   ElMessage({
  //     type: 'error',
  //     message: `请上传部件${flag}的PO适配图`,
  //   })
  //   return
  // }
  component = component.filter(item=>{return item?.poFileAddress})
  // if (!prepressFile.value&&!poFile.value) {
  //   ElMessage({
  //     type: 'error',
  //     message: '请上传主文件',
  //   })
  //   return
  // }
  // if (!cuttingFile.value) {
  //   ElMessage({
  //     type: 'error',
  //     message: '请上传切割文件',
  //   })
  //   return
  // }
  // if (!structureFlag.value&&!structureFile.value) {
  //   ElMessage({
  //     type: 'error',
  //     message: '请上传结构文件',
  //   })
  //   return
  // }
  if (!prepressFile.value&&!poFile.value&&!cuttingFile.value&&!structureFlag.value&&!structureFile.value) {
    ElMessage({
      type: 'error',
      message: `至少上传1个文件`,
    })
    return
  }
  let data = {
    activityId:route.query.id,
    remark:remark.value,
    remarkImageUrl:Array.isArray(remarkImageUrl.value)?remarkImageUrl.value:remarkImageUrl.value.split(',').filter(a=>a),
    uploadFiles: [
      {
        component:component,
        componentsFiles: componentsFiles,
        fileGroup: fileGroup.value,
        structureFile: structureFile.value,
        prepressFile: prepressFile.value,
        poFile: poFile.value,
        cuttingFile:cuttingFile.value
      }
    ]
  }
  saveProofFile(data).then(res=>{
    if (res.code==200) {
      ElMessage({
        type: 'success',
        message: '保存成功',
      })
      router.go(-1)
    }
  })
}
function goBack(){
  router.go(-1)
}
//弹窗展示商品属性
function showAttr(text) {
  ElMessageBox.alert(text, '属性详情', {
    confirmButtonText: '关闭',
    callback: () => { }
  })
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
  -webkit-line-clamp: 1;
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
  min-width: 600px;
  // flex: 1;
  display: flex;
  margin-top: 20px;
  width: 800px;

  span {
    display: inline-block;
    width: 86px;
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