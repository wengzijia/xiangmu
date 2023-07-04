<template>
	<div class="upload-file">
	  <el-upload
		v-if="!showFile"
		:action="uploadFileUrl"
		:before-upload="handleBeforeUpload"
		:disabled="disabled"
		:file-list="fileList"
		:limit="limit"
		:on-error="handleUploadError"
		:on-exceed="handleExceed"
		:on-success="handleUploadSuccess"
		:show-file-list="false"
		:headers="headers"
		class="upload-file-uploader"
		ref="fileUpload"
	  >
		<!-- 上传按钮 -->
		<el-button :type="type">{{fileList.length==0?name:replace?'重新上传':name}}</el-button>
	  </el-upload>
	  <!-- 上传提示 -->
	  <div class="el-upload__tip" v-if="showTip&&!showFile">
		请上传
		<template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b> </template>
		<template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
		的文件
	  </div>
	  <!-- 文件列表 -->
	  <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul" style="width: 320px;">
		<li :key="file.uid" class="el-upload-list__item ele-upload-list__item-content" v-for="(file, index) in fileList">
		  <el-link :href="senseUrl(fileUrl(file.fileAddress||file.url))" :underline="false" target="_blank">
			  <span class="el-icon-document text-overflow" style="width:230px;"> {{getFileName(file.name) }} </span>
		  </el-link>
		  <div class="ele-upload-list__item-content-action">
				<el-link v-if="del&&!showFile" :underline="false" @click="handleDelete(index)" type="danger">删除</el-link>
			  <el-link v-if="down" :underline="false" @click="downFile(file.fileAddress||file.url)" class="down"><el-icon><Download /></el-icon></el-link>
		  </div>
		</li>
	  </transition-group>
	</div>
  </template>
  
  <script setup>
  import { getToken } from "@/utils/auth";
  import {BASE_FILE_URL,BASE_UPLOAD_FILE_URL} from "@/store/global-constant";
  import {downPrepressFile,senseUrl,getFileName} from "@/utils/index"
  import {parseTime} from '@/utils/ruoyi'
  import useUserStore from '@/store/modules/user'
  import { watch } from "vue";
  import { singleDownload } from '@/api/download'
import { ElMessage, ElLoading } from 'element-plus'
  const props = defineProps({
	  // 上传文件的双向绑定的filelist的值
	  modelValue: [String, Object, Array],
	  // 数量限制
	  limit: {
		  type: Number,
		  default: 5,
	  },
	  // 大小限制(MB)
	  fileSize: {
		  type: Number,
		  default: 5,
	  },
	  // 文件类型, 例如['png', 'jpg', 'jpeg']
	  fileType: {
		  type: Array,
		  default: () => ['pdf', 'png', 'jpg', 'jpeg'],
	  },
	  // 是否显示提示
	  isShowTip: {
		  type: Boolean,
		  default: true,
	  },
	  //按钮文本
	  name: {
		  type: String,
		  default: '选取文件',
	  },
	  //是否替换原文件，传这个不要传limit=1
	  replace: {
		  type: Boolean,
		  default: false,
	  },
	  //按钮类型，同elementUI的按钮
	  type: {
		  type: String,
		  default: '',
	  },
	  //是否显示删除按钮
	  del: {
		  type: Boolean,
		  default: false,
	  },
	  //下载按钮
	  down:{
		  type: Boolean,
		  default: false,
	  },
	  showFile:{
		  type: Boolean,
		  default: false,
	  },
	  //是否禁用
	  disabled:{
		type: Boolean,
		default: false
	  }
  })
  
  const { proxy } = getCurrentInstance();
  const emit = defineEmits();
  const number = ref(0);
  const uploadList = ref([]);
  const store = useUserStore()
  const uploadFileUrl = ref('')
//   const uploadFileUrl = BASE_UPLOAD_FILE_URL('crm') // 上传文件服务器地址
  const headers = ref({
	  Authorization: 'Bearer ' + getToken(),
	  token: localStorage.getItem('Access-Token'),
  })
  const fileList = ref([])
  const showTip = computed(
	  () => props.isShowTip && (props.fileType || props.fileSize)
  )
  
  watch(
	  () => props.modelValue,
	  (val) => {
		  if (val) {
			  let temp = 1
			  // 首先将值转为数组
			  let list = Array.isArray(val) ? val : props.modelValue.split(',')
			  // 然后将数组转为对象数组
			  if(list.length==fileList.value.length){
				  return 
			  }
			  fileList.value = list.map((item) => {
				  if (typeof item === 'string') {
					  item = { name: item, url: item }
				  }
				  item.uid = item.uid || new Date().getTime() + temp++
				  return item
			  })
		  } else {
			  fileList.value = []
		  }
	  },
	  { deep: true, immediate: true }
  )
  
  function fileUrl(url) {
	  if (url.indexOf('http')!=-1) {
		  return url
	  }else{
		  return BASE_FILE_URL+url
	  }
  }
  // 上传前校检格式和大小
  function handleBeforeUpload(file) {
	let arr = fileList.value.map(item=>{
		return getFileName(item.name)
	})
	if (arr.includes(file.name)) {
		proxy.$modal.msgError(
			`不能上传同名文件!`
		)
		return false
	}
	  // 校检文件类型
	  
	  if (props.fileType.length) {
		  let fileExtension = ''
		  if (file.name.lastIndexOf('.') > -1) {
			  fileExtension = file.name
				  .slice(file.name.lastIndexOf('.') + 1)
				  .toLowerCase()
		  }
		  const isTypeOk = props.fileType.some((item) => {
			  // if (file.type.indexOf(type) > -1) return true;
			  let type = item
			  if (item=='word') {
				type = 'doc'
			  }
			  if (fileExtension && fileExtension.indexOf(type) > -1) return true
			  return false
		  })
		  if (!isTypeOk) {
			  proxy.$modal.msgError(
				  `文件格式不正确, 请上传${props.fileType.join('/')}格式文件!`
			  )
			  return false
		  }
	  }
	  // 校检文件大小
	  if (props.fileSize) {
		  const isLt = file.size / 1024 / 1024 < props.fileSize
		  if (!isLt) {
			  proxy.$modal.msgError(`上传文件大小不能超过 ${props.fileSize} MB!`)
			  return false
		  }
	  }
	  let reg = new RegExp("[`~!@#$^&*=|{}':;',\\[\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
	  if(reg.test(file.name)||file.name.lastIndexOf(',') > -1){
		  proxy.$modal.msgError(`文件名称不能包含特殊符号`)
		  return false
	  }
	  proxy.$modal.loading('正在上传文件，请稍候...')
	  number.value++
	  uploadFileUrl.value = BASE_UPLOAD_FILE_URL('crm')
	  return true
  }
  
  // 文件个数超出
  function handleExceed(files) {
	  proxy.$modal.msgError(`上传文件数量不能超过 ${props.limit} 个!`)
  }
  
  // 上传失败
  function handleUploadError(err) {
	  proxy.$modal.msgError('上传文件失败')
  }
  
  // 上传成功回调
  function handleUploadSuccess(res, file) {
	  
	  if (res.code === 200 || res.success) {
		  uploadList.value.push({
			  name: res.data.slice(res.data.lastIndexOf('/') + 1),
			  url: res.data,
		  })
		  if (props.replace && fileList.value.length > 0) {
			  handleDelete(0)
		  }
		  uploadedSuccessfully()
	  } else {
		  number.value--
		  proxy.$modal.closeLoading()
		  proxy.$modal.msgError(res.msg || res.message)
		  proxy.$refs.fileUpload.handleRemove(file)
		  uploadedSuccessfully()
	  }
  }
  
  // 删除文件
  function handleDelete(index) {
	  fileList.value.splice(index, 1)
	  emit('update:modelValue', listToString(fileList.value))
  }
  
  // 上传结束处理
  function uploadedSuccessfully() {
	  if (number.value > 0 && uploadList.value.length === number.value) {
		  fileList.value = fileList.value
			  .filter((f) => f.url !== undefined)
			  .concat(uploadList.value)
		  uploadList.value = []
		  number.value = 0
		  
		  emit('update:modelValue', listToString(fileList.value))
		  proxy.$modal.closeLoading()
	  }
  }
  

  
  // 对象转成指定字符串分隔
  function listToString(list, separator) {
	  let strs = ''
	  separator = separator || ','
	  for (let i in list) {
		  if (list[i].url) {
			  strs += list[i].url + separator
		  }
	  }
	  return strs != '' ? strs.substr(0, strs.length - 1) : ''
  }
let downloadLoadingInstance;
  //下载文件
  function downFile(url){
	//   window.open(BASE_FILE_URL+url,'_blank')
    // downloadLoadingInstance = ElLoading.service({ text: "正在下载数据，请稍候", background: "rgba(0, 0, 0, 0.7)", })
    singleDownload({fileName:url})
	// .then(res=>{
    //     const blob = new Blob([res.data])
    //     saveAs(blob, getFileName(url))
    //     downloadLoadingInstance.close();
    // }).catch((r)=>{
    //     console.error(r)
    //     ElMessage.error('下载文件出现错误，请联系管理员！')
    //     downloadLoadingInstance.close();
    // })
  }
  </script>
  
  <style scoped lang="scss">
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
	  align-items: center;
  }
  
  // 公共类
  /* 单行文字溢出时出现省略号，需设定宽度 */
  .text-overflow {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
  }
  .down{
	  line-height: 16px;
	  font-size: 20px;
	  margin-right: 10px;
	  cursor: pointer;
	  &:hover{
		  color: #409EFF;
	  }
  }
  </style>
  <style>
.el-upload-list{
	margin-top: 0;
}
</style>
  