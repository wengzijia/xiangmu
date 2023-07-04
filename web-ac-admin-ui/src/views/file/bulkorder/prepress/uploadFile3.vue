<template>
  <el-dialog
      :model-value="preileDialog"
      :title="dld?'精装盒文件下载':'上传印前文件'"
      width="1000px"
      :before-close="cancel"
    >
    <!-- <div class="prepress-tips">
      <el-icon >
        <Warning />
      </el-icon>&nbsp;所有纸质材质的面板、芯板、内衬零件的PDF文件为必传
    </div> -->
    <!-- <h3>PO号:{{ orderDetails.poNo }}</h3> -->
    <el-scrollbar style="height:calc(68vh)">
    <div style="display: flex;border:4px solid #E4E5EB;">
        <div style="width:380px;">
            <div>
              <div class="divsn2" v-if="orderDetails.poNo">
                  <span class="span">po号：</span>
                  <poView :po-no="orderDetails.poNo" type="2" :copy="false"></poView>
                  <el-tag v-if="orderDetails.isAgain" style="background:#169BD5;color:#fff;margin-left:15px;">翻单订单</el-tag>
              </div>
              <div class="divsn2" v-if="orderDetails.originalBulkOrderNumber" style="margin-top:10px">
                <span class="span">原大货订单号：</span>
                <poView :po-no="orderDetails.originalBulkOrderNumber" type="2" :copy="false"></poView>
              </div>
              <div class="divsn2" v-if="orderDetails.associatedTrackingNumber" style="margin-top:10px">
                <span class="span">关联打样订单号：</span>
                <!-- {{orderDetails.associatedTrackingNumber}} -->
                <poView :po-no="orderDetails.associatedTrackingNumber" :copy="false"></poView>
              </div>
              <!-- <div class="divsn2" v-if="orderDetails.productAttr" style="margin-top:10px">
                <span class="span">成品外尺寸:</span>{{orderDetails.productAttr.replace('成品外尺寸:','')}}
              </div> -->
            </div>
            
            
        </div>

        <div style="width:580px">
          <el-form label-width='110px'>
            <el-form-item label='客户文件:'  v-if="orderDetails.customerFile" style="margin-bottom:0">
              <div>
                <div v-for="(item,index) in JSON.parse(orderDetails.customerFile)" :key="index">
                  <FileShow title="" :filename="item.fileName" :fileurl="BASE_FILE_URL + item.fileAddress"/>
                </div>
              </div>
            </el-form-item>
            
          </el-form>
        </div>
    </div>

    <div style="border:4px solid #E4E5EB;margin-top: 20px;">
      <!-- <h3 class="tabtitle" style="margin: 10px 0 -5px 25px;">
        主体品类：{{ pname||'' }}
      </h3> -->
      <div class="divsn2" v-if="orderDetails.productAttr" style="padding: 10px;">
        <span class="span" style="width:77px;">成品外尺寸:</span>{{orderDetails.productAttr.replace('成品外尺寸:','')}}
      </div>
    </div>

    <div>
      <!-- <div class="main-file">
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
      </div> -->
      <div class="tabborder">
      <!-- <div v-for="(parts, index3) in item1.modules" :key="index3"> -->
        <!-- <div>
          <span>部件{{parts.partNumber}}: {{parts.partName}}</span>
        </div>
        <div style="overflow: hidden;display: flex;">
          <div >po编号:{{ parts.poNo }}</div>
          <div style="margin-left:20px;display: flex;overflow: hidden;flex: 1;">
            <div style="width:80px">
            部件属性:
            </div>
          <div @click="showAttr(parts.partProperties)"  class="text-ov">{{ parts.partProperties }}</div></div>
        </div> -->
        <h3 class="tabtitle">
          零部件信息
        </h3>
        <el-table :data="partList" style="width: 100%" border :span-method="objectSpanMethod">
          <el-table-column label="PO号" prop="poNo" width='220px'>
            <template #default="scope">
            <el-link :underline="false" v-copyText="scope.row.poNo" v-copyText:callback="copyTextSuccess">{{ scope.row.poNo}}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="零件名称" prop="name" width="90px">
            <template #default="scope">
              {{scope.row.data.partName}}{{scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250px">
            <template #default="scope">
              <PrepressUpload  v-model:modelValue="scope.row.pdfFile.fileAddress" :dldbtn="!dld" name="上传文件" :down="false" newstyle :isShowTip="false" isPart :productAttr="scope.row.properties" :del="!dld" :poNo="scope.row.poNo" :orderDetails="orderDetails" @callBack="url=>{setReport(url,scope.row)}" :queryData="queryData"></PrepressUpload>
              <div><el-tag effect="dark" style="cursor: pointer;" @click="hbthreeDownFile(scope.row)">一键三连下载</el-tag></div>
            </template>
          </el-table-column>
          <el-table-column label="零件工艺参数" width="200">
            <template #default="scope">
              <!-- <OrderAttrShow :attr="scope.row.properties" :line="1"></OrderAttrShow> -->
              <!-- <el-link :underline="false" @click="showAttr(scope.row.properties)"> -->
                <!-- <div style="-webkit-line-clamp: 1;">{{scope.row.properties}}</div> -->
                <div style="white-space:break-spaces;">{{ addLineFeed(scope.row.properties) }}</div>
              <!-- </el-link> -->
              <!-- <div>{{ scope.row.properties }}</div> -->
            </template>
          </el-table-column>
          <el-table-column label="其他工艺参数" width="200">
            <template #default="scope">
              <div style="white-space:break-spaces;">{{ addLineFeed(scope.row?.data?.partProperties||'') }}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="结构文件" width="120px">
            <template #default="scope">
              <el-link v-if="item1.modules[index3].components[scope.$index].structureFile.fileAddress" :underline='false' title="下载结构文件" :href="'/api/consumer/certifyFree/alibaba/oss/getDownloadFile?fileName='+item1.modules[index3].components[scope.$index].structureFile.fileAddress"> 下载文件 <el-icon style=" font-size:16px;font-weight: bold;"><Download /></el-icon></el-link>
              <span v-else>-</span>
            </template>
          </el-table-column> -->
          
          <!-- <el-table-column label="3D视频文件" width="340px">
            <template #default="scope">
              <FileUpload :fileType="['pdf', 'mp4', 'gif']" :fileSize="200" :limit="5" replace down
                v-model:modelValue="item1.modules[index3].components[scope.$index].videofile.fileAddress" />
            </template>
          </el-table-column> -->
          
          <!-- <el-table-column label="Report文件" width="340px">
            <template #default="scope">
              <FileUpload :fileType="['png', 'jpg', 'jpeg','dxf','tif','ard']" :fileSize="200" :limit="5" replace down
                v-model:modelValue="item1.modules[index3].components[scope.$index].reportFile.fileAddress" />
            </template>
          </el-table-column> -->
        </el-table>
      </div>

      <div class="tabborder" v-if="accessoryList?.length">
        <h3 class="tabtitle">
          配件信息
        </h3>
        <el-table :data="accessoryList" border style="width: 100%; margin-top: 2px">
          <el-table-column prop="poNo" label="PO号"   width='220px'>
            <template #default='scope'>
              <span>{{ scope.row.poNo }}</span>
              <el-icon
                  v-copyText="scope.row.poNo"
                  v-copyText:callback="copyTextSuccess"
                  v-if="scope.row.poNo"
                  class="gesture"
                >
                  <CopyDocument />
                </el-icon>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="零件名称"  width='90px'>
            <template #default='scope'>
              {{scope.row?.data?.partName}}{{scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width='250px'>
     
          </el-table-column>
          <!-- <el-table-column prop="properties" label="零件工艺参数"  /> -->
          <el-table-column prop="properties" label="零件工艺参数" >
            <template #default="scope">
              <div style="white-space:break-spaces;">{{ addLineFeed(scope.row.properties) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="其他工艺参数" >
            <template #default="scope">
              <div style="white-space:break-spaces;">{{ addLineFeed(scope.row?.data?.partProperties||'') }}</div>
            </template>
          </el-table-column>
         
        </el-table>
      </div>

      <div class="tabborder" v-if="kitList?.length">
        <h3 class="tabtitle">
          套件信息
        </h3>
        <el-table :data="kitList" border style="width: 100%; margin-top: 2px">
          <el-table-column prop="poNo" label="PO号"   width='220px'>
            <template #default='scope'>
              <span>{{ scope.row.poNo }}</span>
              <!-- <el-icon
                  v-copyText="scope.row.poNo"
                  v-copyText:callback="copyTextSuccess"
                  v-if="scope.row.poNo"
                  class="gesture"
                >
                  <CopyDocument />
                </el-icon> -->
            </template>
          </el-table-column>
          <el-table-column prop="name" label="零件名称"  width='90px'>
            <template #default='scope'>
              {{scope.row?.data?.partName}}{{scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width='250px'>
     
          </el-table-column>
          <el-table-column prop="properties" label="零件工艺参数" >
            <template #default="scope">
              <div style="white-space:break-spaces;">{{ addLineFeed(scope.row.properties) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="其他工艺参数" >
            <template #default="scope">
              <div style="white-space:break-spaces;">{{ addLineFeed(scope.row?.data?.partProperties||'') }}</div>
            </template>
          </el-table-column>
         
        </el-table>
      </div>
    </div>
    <!-- <div class="prepressfile-remark" style="width: 950px;">
      <span>印前备注:</span>
      <div>
        <el-input v-model.trim="remark" :rows="5" maxlength="300" show-word-limit type="textarea" placeholder="请输入印前备注"
        style="width: 500px;margin-right:20px;" />
      </div>
      <FileUpload :fileType="['png', 'jpg', 'jpeg','dxf','tif','ard']" :fileSize="200" down del
          v-model:modelValue="remarkImageUrl"/>
    </div> -->
    <template v-if="!dld">
      <div class="prepressfile-remark" style="width: 950px;">
        <span>印前备注:</span>
        <Editor v-model:html="pdfRemark" placeholder="请输入PDF备注内容"></Editor>
      </div>
    </template>
  </el-scrollbar>
  <div class="form-tool-bar" style="margin-top:20px;">
    <div style="min-width:240px;width:240px;">
      <el-button @click="save(0)">保存本次编辑</el-button>
      <el-button type="primary" @click="combtn">完成并冻结</el-button>
    </div>
  </div>
  </el-dialog>
</template>

<script setup>
import { watch } from 'vue';
import { getPrepressFile, saveUploadFile, getPrepressDetailById,downloadComponentPoXml } from '@/api/prepress';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import PrepressUpload from '@/components/FileUpload/prepressUpload.vue';
import OrderAttrShow from "@/components/OrderAttrShow"
import Editor from "@/components/Editor"
import {getFileName} from "@/utils/index"
import poView from "../../../proof/components/poView.vue"
import { BASE_FILE_URL} from "@/store/global-constant";
const route = useRoute();
const router = useRouter();
const fileGroup = ref('')
const remarkImageUrl = ref('')
var remark = ref('')
var pdfRemark = ref('')
const orderDetails = ref({})
var partsList = ref([])
let partList=ref([])
let accessoryList = ref([])
let kitList = ref([])
const part = ['面料','芯板','内衬']
const { proxy } = getCurrentInstance();
let emits = defineEmits(["update:preileDialog","complete","updatelist"]);
// if (route.query.id) {
getInfo()
  // getDetails(route.query.id)
// }
const props = defineProps({
  DialogData: {
    type: Object,
    default: {},
  },
  preileDialog: {
    type: Boolean,
    default: ()=> false,
  },
  queryData:{
    type: Object,
    default: null,
  },
  dld:{
    type: Boolean,
    default: false,
  }
});
//根据ID获取要上传的文件详情
function getInfo() {
  // proxy.$modal.loading('数据加载中...')
  // getPrepressFile(id).then(res => {
    let fileObj = {
      fileAddress: '',
      fileName: '',
    }
    let parr=[]
    // if (res.code == 200) {
      //fileGroup保存时候要用,因为精装盒只有1个parts，所以直接保存
      // console.log(props.DialogData);
      fileGroup.value = props.DialogData?.parts?.length&&props.DialogData.parts[0].fileGroup
      // remark.value = props.DialogData.remark
      pdfRemark.value = props.DialogData.remark||''
      // console.log('fileGroup.value',fileGroup.value);
      // remarkImageUrl.value = props.DialogData.remarkImageUrl||''
      //遍历把数据转换成前端展示对应的格式
      partsList.value = props.DialogData.parts.map(e => {
        e.pdfFile = e.annexFiles.find(e => e.fileType == 'PDF文件') || { ...fileObj, fileType: 'PDF文件' }
        e.videofile = e.annexFiles.find(e => e.fileType == '3D视频文件') || { ...fileObj, fileType: '3D视频文件' }
        e.reportFile = e.annexFiles.find(e => e.fileType == 'report文件') || { ...fileObj, fileType: 'report文件' }
        e.modules = e.modules.map(s => {
          let len=s.components.filter((e1)=>{
            return part.includes(e1.name)
          })
          s.components = s.components.map((c,i) => {
            console.log('ccc',c);
            
            let c2 = {
              ...c,
              pdfFile: c.files.find(e => e.fileType == 'PDF文件') || { ...fileObj, fileType: 'PDF文件',componentsNo:c.id },
              // videofile: c.files.find(e => e.fileType == '3D视频文件') || { ...fileObj, fileType: '3D视频文件',componentsNo:c.id },
              reportFile: c.files.find(e => e.fileType == 'report文件') || { ...fileObj, fileType: 'report文件',componentsNo:c.id },
              structureFile :c.files.find(e => e.fileType == '结构文件') || { ...fileObj, fileType: '结构文件',componentsNo:c.id },
              data:{
                id:s.id,
                partGroup: s.partGroup,
                partName: s.partName,
                partNumber: s.partNumber,
                partProperties: s.partProperties,
                poFileAddress: s.poFileAddress,
                poNo: s.poNo,
                uploadTime: s.uploadTime,
                rowNum: i == 0 && len.length > 1 ? len.length : 0, //合并的行数等同于数组长度
                isRow: len.length > 1, //判断这组数据是否是合并的数据
              }
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
            if(part.includes(c.name)){
              partList.value.push(c2)
            }else if (c.properties.indexOf('部件:整体配件')>-1){
              kitList.value.push(c)
            }else{
              accessoryList.value.push(c)
            }
            return c2
          })
          return s
        })
        return e
      })
      console.log('partsList',partsList.value);
      console.log('parr',partList.value);
      orderDetails.value = props.DialogData
    // }
  // }).finally(()=>{
  //   proxy.$modal.closeLoading()
  // })
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
function hbthreeDownFile(data) {
  // let arr = []
  // try {
  //   JSON.parse(data.structuralFileUrl).forEach((item) => {
  //     if (item.fileAddress) {
  //       arr.push(item.fileAddress)
  //     }
  //   });
  // } catch (error) {}
  // try {
  //   JSON.parse(data.customerFile).forEach((item) => {
  //     if (item.fileAddress) {
  //       arr.push(item.fileAddress)
  //     }
  //   });
  // } catch (error) {}
  // try {
  //   data?.annexs.forEach((e) => {
  //     if (e?.fileType&&e?.fileType == '印前文件') {
  //       arr.push(e?.fileAddress)
  //     }
  //   });
  // } catch (error) {
  //   console.log('添加印前文件错误',error);
  // }
  
  // data?.poxmlUrl && arr.push(data.poxmlUrl)
  // let str = '一键三连'+parseTime(new Date(),'{y}{m}{d}{h}{i}')
  // var newArr = [...new Set(arr)]
  // console.log(data);
  // console.log('props?.queryData?.activityId',props?.DialogData);
  downloadComponentPoXml({
    activityId: props?.queryData?.activityId,
    associatedTrackingNumber: props?.DialogData?.associatedTrackingNumber,
    componentId: data.id,
    poNo: data.poNo
  },'精装盒一键三连').then(res=>{
    console.log(res);
  })
}
const cancel = function(){
  emits("update:preileDialog",false)
}
const combtn = () => {
  save(1)
}
//保存上传文件
function save(num=0) {
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
    activityId: props?.queryData?.activityId,
    remark:pdfRemark.value,
    // remark: remark.value,
    // remarkImageUrl:Array.isArray(remarkImageUrl.value)?remarkImageUrl.value:remarkImageUrl.value.split(',').filter(a=>a),
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
  if(num){
    let list = data.uploadFiles[0].componentsFiles.filter(e => e?.componentsNo)
    let idarr=partList.value.map(e=>e.id)
    let farr=[...new Set([...list.map(e=>e.componentsNo)])]
    // console.log('idarr',idarr);
    // console.log('farr',farr);
    for(let i=0;i<idarr.length;i++){
      if(farr.indexOf(idarr[i])===-1){
        let arr=partList.value.filter(a=>a.id==idarr[i])
        if(arr.length){
          ElMessage.error(`子${arr[0].poNo}的印前文件未上传`)
        }
        return
      }
    }
  }
  proxy.$modal.loading('正在上传文件，请稍候...')
  saveUploadFile(data).then(res => {
    if (res.code == 200) {
      ElMessage({
        type: 'success',
        message: '保存成功',
      })
      proxy.$modal.closeLoading()
      cancel()
      if(num){
        emits("complete",props?.queryData?.activityId)
      }
      emits("updatelist")
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
  console.log('partList',partList.value);
}
//弹窗展示商品属性
function showAttr(text) {
  ElMessageBox.alert(text, '属性详情', {
    confirmButtonText: '关闭',
    callback: () => { }
  })
}
function addLineFeed(str) {
  let newStr = "";
  if (str) {
    newStr = str.replace(/;/g, ";\n");
  } else {
    newStr = str;
  }
  return newStr;
}
/** 复制代码成功 */
function copyTextSuccess() {
  ElMessage.success("PO号复制成功");
}
const objectSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}) => {
 
   if (columnIndex === 4) {
    if(partList.value[rowIndex].data.isRow){
      let rowNum = partList.value[rowIndex].data.rowNum
      if(rowNum){
        return  {
          rowspan: rowNum,
          colspan: 1,
        }
      }else{
        return  {
          rowspan: 0,
          colspan: 0,
        }
      }
    }
  }
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