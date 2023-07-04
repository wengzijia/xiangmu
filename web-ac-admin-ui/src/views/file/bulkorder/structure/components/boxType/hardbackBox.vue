<template>
  <div class="hardback-box-drawer">
    <el-dialog
      :model-value="drawerType"
      title="上传结构文件"
      width="1000px"
      :before-close="cancel"
    >
    <el-scrollbar style="height:calc(70vh)">
      <div style="display: flex;border:4px solid #E4E5EB;">
        <div style="width:380px">
          <div class="divsn2" v-if="fileDetail.poNo">
            <span class="span">PO号：</span>
            <poView :po-no="fileDetail.poNo" type="2" :copy="false"></poView>
            <el-tag v-if="fileDetail.isAgain" style="background:#169BD5;color:#fff;margin:5px 0 0 15px;">翻单订单</el-tag>
          </div>
          <div class="divsn2" v-if="fileDetail.originalBulkOrderNumber">
            <span class="span">原大货订单号：</span>
            <poView :po-no="fileDetail.originalBulkOrderNumber" type="2" :copy="false"></poView>
          </div>
          <div class="divsn2" v-if="fileDetail.associatedTrackingNumber">
            <span class="span">关联打样订单号：</span>
            <poView :po-no="fileDetail.associatedTrackingNumber" :copy="false"></poView>
          </div>
          
        </div>
        <div style="width:580px;margin-right: 10px;">
            <template v-if="fileDetail.proofFiles">
              <div class="divsn2" v-for="(item,index) in fileDetail.proofFiles" :key="index">
                <span class="span2">{{ item.fileType+'：' }}</span>
                <FileShow title="" :filename="item.fileName" :fileurl="BASE_FILE_URL + item.fileAddress"/>
              </div>
            </template>
  
            <template v-if="fileDetail.customerFiles">
              <div class="divsn2" v-for="(item,index) in JSON.parse(fileDetail.customerFiles)" :key="index">
                <span class="span2">客户文件：</span>
                <FileShow title="" :filename="item.fileName" :fileurl="BASE_FILE_URL + item.fileAddress"/>
              </div>
            </template>
        </div>
      </div>

      <div style="border:4px solid #E4E5EB;margin-top: 20px;">
        <!-- <h3 class="tabtitle" style="margin: 10px 0 -5px 25px;">
          主体品类：{{ pname||'' }}
        </h3> -->
        <div class="divsn2" v-if="fileDetail.productAttr" style="padding: 10px;">
          <span class="span" style="width:77px;">成品外尺寸:</span>{{fileDetail.productAttr.replace('成品外尺寸:','')}}
        </div>
      </div>

    <el-form label-width='96px' label-position='top'>
      <!-- <el-form-item v-for="(item,index) in fileDetail.parts" :key="item.id"> -->
      <div class="tabborder">
        <h3 class="tabtitle">
          零部件信息
        </h3>
        <el-table :data="partList" :span-method="objectSpanMethod" border style="width: 100%; margin-top: 2px">
          <el-table-column prop="poNo" label="PO号"   width='250px'>
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
          <el-table-column label="操作" width='210px'>
            <template #default='scope'>
              <div v-if="scope.row.structureFileInfo">
              <div>
                <el-upload
                  ref="uploadRef"
                  action=""
                  :fileType="fileTypeList"
                  :auto-upload="false"
                  :show-file-list='false'
                  multiple
                  :on-change="(file)=> {fileChange({file,item:scope.row}) }"
                >
                  <template #trigger>
                    <div>
                      <el-link :underline='false' type="primary">上传文件</el-link>
                    </div>
                  </template>
                </el-upload>
              </div>
              <!-- <p>{{scope.row.id}}</p> -->
              <div v-if="upLoadFlieList.length">
                <div v-for="(c,index) in upLoadFlieList" :key="c">
                  <span v-if="c?.file&&c?.item.id===scope.row.id">
                   结构文件：<a class="imgurl" target="_blank" @click="handlePreview(c)">{{c.file.name}}</a>
                    <el-button @click="delimg(index,0,scope.$index)" size="small">删除</el-button>
                  </span>
                </div>
              </div>
              <div v-if="scope.row.files.length">
                <div v-for="(c,index) in scope.row.files" :key="c">
                  结构文件：<a class="imgurl" :href="BASE_FILE_URL+c.fileAddress" target="_blank">{{c.fileName}}</a>
                  <el-button @click="delimg(index,2,scope.$index)" size="small">删除</el-button>
                </div>
              </div>
               <!-- <div v-if="scope.row.structureFileInfo&&scope.row.structureFileInfo.fileAddress">
                <el-link :underline='false' type="primary" title="下载结构文件" :href="'/api/consumer/certifyFree/alibaba/oss/getDownloadFile?fileName='+scope.row.structureFileInfo.fileAddress">   <el-icon style=" font-size:16px;font-weight: bold;margin-left: 10px;"><Download /></el-icon></el-link>
              </div> -->
              </div>
              <div v-if="scope.row.structureFileInfo" style="line-height: 16px;color:cornflowerblue">
                <span>
                  {{scope.row.structureFileInfo.notLoadFileName}}
                </span>
              </div>
            
            </template>
          </el-table-column>
          <!-- <el-table-column prop="properties" label="零件工艺参数"  /> -->
          <el-table-column prop="properties" label="零件工艺参数" >
            <template #default="scope">
              <div style="white-space:break-spaces;">{{ addLineFeed(scope.row.properties) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="其他工艺参数" >
            <template #default="scope">
              <div style="white-space:break-spaces;">{{ addLineFeed(scope.row.data.partProperties) }}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="materialName" label="物料名称"  width='100px'/> -->
          <!-- <el-table-column prop="specification" label="规格"  width='70px'/> -->
          <!-- <el-table-column prop="size" label="采购尺寸" width='100px'/> -->
         
        </el-table>
      </div>
      <el-form-item v-if="accessoryList?.length">
        <!-- <div style="line-height: 20px;">
          部件属性：{{item.partProperties}}
        </div> -->
        <h3 class="tabtitle">
          配件信息
        </h3>
        <el-table :data="accessoryList" border style="width: 100%; margin-top: 2px">
          <el-table-column prop="poNo" label="PO号"   width='250px'>
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
          <el-table-column label="操作" width='210px'>
     
          </el-table-column>
          <!-- <el-table-column prop="properties" label="零件工艺参数"  /> -->
          <el-table-column prop="properties" label="零件工艺参数" >
            <template #default="scope">
              <div style="white-space:break-spaces;">{{ addLineFeed(scope.row.properties) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="其他工艺参数" >
            <!-- <template #default="scope">
              <div style="white-space:pre;">{{ addLineFeed(scope.row.data.partProperties) }}</div>
            </template> -->
          </el-table-column>
          <!-- <el-table-column prop="materialName" label="物料名称"  width='100px'/> -->
          <!-- <el-table-column prop="specification" label="规格"  width='70px'/> -->
          <!-- <el-table-column prop="size" label="采购尺寸" width='100px'/> -->
         
        </el-table>
      </el-form-item>

      <el-form-item v-if="kitList?.length">
        <!-- <div style="line-height: 20px;">
          部件属性：{{item.partProperties}}
        </div> -->
        <h3 class="tabtitle">
          套件信息
        </h3>
        <el-table :data="kitList" border style="width: 100%; margin-top: 2px">
          <el-table-column prop="poNo" label="PO号"   width='250px'>
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
          <el-table-column label="操作" width='210px'>
     
          </el-table-column>
          <!-- <el-table-column prop="properties" label="零件工艺参数"  /> -->
          <el-table-column prop="properties" label="零件工艺参数" >
            <template #default="scope">
              <div style="white-space:break-spaces;">{{ addLineFeed(scope.row.properties) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="其他工艺参数" >
            <!-- <template #default="scope">
              <div style="white-space:pre;">{{ addLineFeed(scope.row.data.partProperties) }}</div>
            </template> -->
          </el-table-column>
          <!-- <el-table-column prop="materialName" label="物料名称"  width='100px'/> -->
          <!-- <el-table-column prop="specification" label="规格"  width='70px'/> -->
          <!-- <el-table-column prop="size" label="采购尺寸" width='100px'/> -->
         
        </el-table>
      </el-form-item>
      <!-- <el-form-item label='结构备注:'> -->
        <!-- <template #default='scope'> -->
        <!-- <Editor v-model:html="fileDetail.remark" ></Editor> -->
        <!-- </template> -->
      
      <!-- </el-form-item> -->
    </el-form>
    <div style="text-align: right;  position: sticky;  bottom: 0; width: 100%;  background: #fff;z-index: 99;margin-top: 15px;">
        <el-button @click="save(0)">保存本次编辑</el-button>
        <el-button @click="save(1)" type='primary'>完成并冻结</el-button>
    </div>
  </el-scrollbar>
  </el-dialog>
  </div>
</template>

<script setup>
import { getHardBoundBoxFileDetail,saveHardBoundFile } from '@/api/structural/selfWork';
import { uploadefile } from '@/api/upload';
import { ElLoading, ElMessage,ElDrawer } from 'element-plus';
import { singleDownload } from '@/api/download';
import { getFileName,getText } from '@/utils/index'
import Editor from "@/components/Editor"
import { BASE_FILE_URL} from "@/store/global-constant";
import poView from "../../../../../proof/components/poView.vue"
const props = defineProps({
  drawerData: {
    type: Object,
    default: {},
  },
  drawerType: {
    type: Boolean,
    default: ()=> false,
  },
  //是否大货
  bulk: {
    type: Boolean,
    default: false,
  },
  orderId:{
    type:String,
    default: '',
  },
  pname:{
    type:String,
    default: '',
  }
});
let emits = defineEmits(["update:drawerType","update:orderId",'changelist','CompleteCallback']);
let fileDetail= ref({})
let upLoadFlieList = ref([])
let saveData = ref({
	"files": [],
	// "remark": "",
	"taskId": 0
})
const part = ['面料','芯板','内衬']
let partList=ref(null)
let accessoryList = ref(null)
let kitList = ref(null)
let isupdate=ref(false)
/** 获取精装盒结构文件信息 */
const getDetail = function (id=''){
  upLoadFlieList.value = []
  getHardBoundBoxFileDetail({id}).then(res=>{
    if(res.code==200){
      res.data.parts = res.data.parts.map((e1,index) =>{
        e1.components = e1.components.map((e2,$index)=>{
          let structureFileInfo = e2.files.find(e => e.fileType=='1')
          if(!structureFileInfo){
            structureFileInfo = {
              fileText:'上传'
            }
          }else{
            structureFileInfo.fileText = '重新上传'
          }
          e2.structureFileInfo = structureFileInfo
          upLoadFlieList.value.push({
            item:e2,
            index,$index
          })
          return e2
        })
        return e1
      })
      fileDetail.value = res.data
      let clist=[]
      let farr=[]
      let kit=[]
      let p=res.data.parts
      p.forEach(e => {
        let len=e.components.filter((e1)=>{
          return part.includes(e1.name)
        })
        e.components.forEach((c,i)=>{
          c.data={
            id:e.id,
            partName:e.partName,
            partNumber:e.partNumber,
            partProperties:e.partProperties,
            rowNum: i == 0 && len.length > 1 ? len.length : 0, //合并的行数等同于数组长度
            isRow: len.length > 1, //判断这组数据是否是合并的数据
          }
          if(part.includes(c.name)){
            clist.push(c)
          }else if (c.properties.indexOf('部件:整体配件')>-1){
            kit.push(c)
          }else{
            farr.push(c)
          }
        })
        // console.log(len.length);
        // clist.push(...e.components)

        
      });
      partList.value=clist
      accessoryList.value=farr
      kitList.value=kit
      // console.log('farr',partList.value);
      // saveData.value.remark = res.data.remark
      // console.log('getHardBoundBoxFileDetail',partList.value )
    }else{
      ElMessage.error(res.msg)
      cancel()
    }
  })

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
watch(()=> props.drawerType,(newVal)=>{
  console.log('newVal',newVal)
  if(newVal){
    getDetail(props.orderId)
  }
})
getDetail(props.orderId)
const cancel = function(){
  emits("update:drawerType",false)
}
let fileTypeList = ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'doc','dxf','tif','ard','zip','rar']
const delimg = (index,num,tindex)=>{
  if(num===2) {
    if(!isupdate.value) isupdate.value=true
    partList.value[tindex].files.splice(index,1)
  }
  upLoadFlieList.value.splice(index,1)
}

/** 点击上传文件按钮 */
let fileChange = function(data){
  console.log('data',data)
  let fileNameArr = data.file.name.split('.')
  let fileType = fileTypeList.find(e => e===fileNameArr[fileNameArr.length-1].toLowerCase())
  if(!fileType){
    ElMessage.error('不支持此类型文件上传！')
    return 
  }
  // let index = upLoadFlieList.value.findIndex(e => e.item.id==data.item.id)
  // data.item.structureFileInfo.fileText = '重新上传'
  // data.item.structureFileInfo.notLoadFileName = data.file.name
  // if(index==-1){
  //   console.log('data',data)
  //   console.log('index',index)
  //   console.log('upLoadFlieList',upLoadFlieList)
  //   ElMessage.error('文件获取失败，请联系管理员！')
    // upLoadFlieList.value.push(data)
  // }else{
  upLoadFlieList.value.push(data) 
    // console.log('2222',upLoadFlieList.value);
  // }
}

const uploadeList = function(upLoadFlieList){
  return upLoadFlieList.map(e =>{
    return new Promise((resolve,reject)=>{
    let formData = new FormData();
    formData.append('file',e.file.raw);
    uploadefile(formData,'structural').then(res =>{
        resolve({
          res,
          ...e
        })
      }).catch(err=>{
        reject({
          err,
          ...e
        })
      })
    })
  })
}
const handlePreview = (data)=>{
  let link =document.createElement('a')
  link.href=window.URL.createObjectURL(data.file.raw)
  link.target='_blank'
  document.body.appendChild(link);
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(file.raw)
}
let loading = ref(null)
const save = function(num){
  // console.log('idarr',idarr);
  // console.log('uidarr',uidarr);
  let list = upLoadFlieList.value.filter(e => e.file)
  if(num){
    let idarr=partList.value.map(e=>e.poNo)
    let farr=[...new Set([...oldimglist('po').map(e=>e.poNo),...list.map(e=>e.item.poNo)])]
    for(let i=0;i<idarr.length;i++){
      if(farr.indexOf(idarr[i])===-1){
        ElMessage.error(`子${idarr[i]}的结构文件未上传`)
        return
      }
    }
  }

  if(list.length==0){
    // console.log('saveData?.value?.remark',saveData?.value?.remark);
    // console.log('fileDetail?.value?.remark',saveData?.value?.remark);
    // if(getText(saveData?.value?.remark)!=getText(fileDetail?.value?.remark)||isupdate.value){
    if(isupdate.value){
      loading = ElLoading.service({
        lock: true,
        text: '保存文件中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      saveHardBoundFileFun(oldimglist(),num)
    }else{
      if(num){
        emits("CompleteCallback");
      }else{
        ElMessage.info('数据未修改')
      }
    }
    return
  }
  loading = ElLoading.service({
    lock: true,
    text: '保存文件中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  Promise.all(uploadeList(list)).then(res=>{
    let files = res.map(e => {
      return {
        "componentId": e.item.id,
        "fileAddress": e.res.data,
        "fileName": getFileName(e.file.name)
      }
    })
    files.push(...oldimglist())
    saveHardBoundFileFun(files,num)
  }).catch(()=>{
    loading.close()
    ElMessage.error('文件保存失败，请联系管理员')
  })
}
const oldimglist = (po) =>{
  let arr=[]
  partList.value.forEach(e=>{
    e.files.forEach(c=>{
      if(po){
        arr.push({
          componentId:e.id,
          fileAddress: c.fileAddress,
          fileName: c.fileName,
          poNo:e.poNo
        })
      }else{
        arr.push({
          componentId:e.id,
          fileAddress: c.fileAddress,
          fileName: c.fileName,
        })
      }
    })
  })
  return arr
}
const saveHardBoundFileFun = function(files,num){
  // console.log({
  //     files,
  //     "remark": fileDetail.value.remark,
  //     "taskId": fileDetail.value.taskId
  //   });
  saveHardBoundFile({
      files,
      // "remark": fileDetail.value.remark,
      "taskId": fileDetail.value.taskId
    }).then(res2=>{
      console.log('res2',res2)
      loading.close()
      if(res2.code==200){
        ElMessage.success('保存成功！')
         emits("changelist");
         cancel()
        if(num){
          emits("CompleteCallback");
        }
      }else{
        ElMessage.error(res2.msg)
      }
    }).catch(err=>{
      loading.close()
      console.log('err',err)
      ElMessage.error('数据保存失败，请联系管理员')
    })
}

/** 复制代码成功 */
function copyTextSuccess() {
 ElMessage.success("PO号已复制");
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
</script>

<style>
.el-form-item__label{
  font-size: 14px;
  color: #606266;
  font-weight:700;
}
.hardback-box-drawer .el-drawer__header{
  margin-bottom:0;
}
.gesture {
  cursor: pointer;
}
.imgurl{
  color: #409eff;
  text-decoration: underline;
}
</style>
