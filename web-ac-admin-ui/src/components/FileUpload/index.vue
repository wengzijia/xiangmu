<template>
  <div class="upload-file">
    <el-upload
	  v-if="!showFile"
      :action="uploadFileUrl"
      :before-upload="handleBeforeUpload"
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
      <el-button :type="type" :style="txtgrey?'color:#a8abb2;':''">{{fileList.length==0?name:replace?'重新上传':name}}</el-button>
    </el-upload>
    <!-- 上传提示 -->
    <div class="el-upload__tip" v-if="showTip&&!showFile">
      请上传<template v-if="fileType">格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b></template><template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
      的文件
    </div>
    <!-- 文件列表 -->
    <transition-group  class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul" style="display: inline-block;" v-if="fileListShow"> 
      <li :key="file.uid" class="el-upload-list__item ele-upload-list__item-content" v-for="(file, index) in fileList">
		<el-link :href="senseUrl(fileUrl(file.fileAddress||file.url))" :underline="false" target="_blank">
			<span class="el-icon-document text-overflow" style="width:230px;"> {{getFileName(file.name) }} </span>
		</el-link>
        <div class="ele-upload-list__item-content-action">
          	<el-link v-if="del" :underline="false" @click="handleDelete(index)" type="danger">删除</el-link>
			<el-link v-if="down" :underline="false" @click="downFile(file.fileAddress||file.url)" class="down"><el-icon><Download /></el-icon></el-link>
        </div>
      </li>
    </transition-group>
	<transition-group  class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul" style="display: inline-block;" v-if="newstyle"> 
      <li :key="file.uid" class="el-upload-list__item ele-upload-list__item-content" style="border:none;" v-for="(file) in fileList">
		<el-link :href="senseUrl(fileUrl(file.fileAddress||file.url))" :underline="false" target="_blank">
			<span class="el-icon-document" style="white-space: pre-line;width:180px;color: rgb(64, 158, 255);text-decoration: underline;"> {{getFileName(file.name) }} </span>
		</el-link>
        <!-- <div class="ele-upload-list__item-content-action">
          	<el-link v-if="del" :underline="false" @click="handleDelete(index)" type="danger">删除</el-link>
        </div> -->
      </li>
    </transition-group>
	<template v-if="fileListShow">
		<div v-for="(file, index) in fileList" class="el-upload__tip" style="margin-top:0;color:rgb(20 86 233);font-weight:600;">
			<span> {{getFileName(file.name) }} </span>
		</div>
	</template>
  </div>
</template>

<script setup>
import { getToken } from "@/utils/auth";
import {BASE_FILE_URL,BASE_UPLOAD_FILE_URL} from "@/store/global-constant";
import {downPrepressFile,senseUrl,getFileName} from "@/utils/index"
import {parseTime} from '@/utils/ruoyi'
import useUserStore from '@/store/modules/user'
import { watch } from "vue";
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
	fileListShow:{
		type: Boolean,
		default: true,
	},
	txtgrey:{
		type: Boolean,
        default: false,
	},
	newstyle:{
		type: Boolean,
        default: false,
	}
})

const { proxy } = getCurrentInstance();
const emit = defineEmits();
const number = ref(0);
const uploadList = ref([]);
// const uploadFileUrl = ref(import.meta.env.VITE_APP_BASE_API + "/file/upload"); // 上传文件服务器地址
const store = useUserStore()

const uploadFileUrl = BASE_UPLOAD_FILE_URL() // 上传文件服务器地址
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
	// 校检文件类型
	if (props.fileType.length) {
		let fileExtension = ''
		if (file.name.lastIndexOf('.') > -1) {
			fileExtension = file.name
				.slice(file.name.lastIndexOf('.') + 1)
				.toLowerCase()
		}
		const isTypeOk = props.fileType.some((type) => {
			// if (file.type.indexOf(type) > -1) return true;
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
	if(file.name.lastIndexOf(',') > -1){
		proxy.$modal.msgError(`文件名称不能包含特殊符号`)
		return false
	}
	
	proxy.$modal.loading('正在上传文件，请稍候...')
	number.value++
	
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
		console.log('callwen');
		emit('callBack')
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
//下载文件
function downFile(url){
	downPrepressFile([url],getFileName(url))
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
