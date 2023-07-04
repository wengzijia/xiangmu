<template>
	<div class="upload-file">
		<el-upload :file-list="fileList" :limit="limit" :auto-upload="false" :on-change="upload" :show-file-list="false"
			:headers="headers" class="upload-file-uploader" ref="fileUpload">
			<!-- 上传按钮 -->
			<el-button :type="type" v-if="dldbtn">{{ fileList.length == 0 ? name : replace ? '重新上传' : name }}</el-button>
		</el-upload>
		<!-- 上传提示 -->
		<div class="el-upload__tip" v-if="showTip">
			请上传
			<template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b> </template>
			<template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
			的文件
		</div>
		<!-- 文件列表 -->
		<transition-group  class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear"
			tag="ul">
			<li :key="file.uid" class="el-upload-list__item ele-upload-list__item-content"
				:style="newstyle?'border:none;':''"
				v-for="(file, index) in fileList">
				<el-link :href="BASE_FILE_URL + senseUrl((file.fileAddress || file.url))" :style="newstyle?'color: #409eff;text-decoration: underline;':''" :underline="false" target="_blank">
					<span class="el-icon-document text-overflow" :style="newstyle?'white-space: break-spaces;width:180px;':'width:230px;'"> {{ getFileName(file.name) }}
					</span>
				</el-link>
				<div class="ele-upload-list__item-content-action">
					<template v-if="del">
						<el-button v-if="newstyle" size="small" @click="handleDelete(index)">删除</el-button>
						<el-link v-else :underline="false" @click="handleDelete(index)" type="danger">删除</el-link>
					</template>
					<el-link v-if="down" :underline="false" @click="downFile(file.fileAddress || file.url)"
						class="down"><el-icon>
							<Download />
						</el-icon></el-link>
				</div>
			</li>
		</transition-group>
		<template v-if="!newstyle">
			<div v-for="(file, index) in fileList" class="el-upload__tip" style="margin-top:0;color:rgb(20 86 233);font-weight:600;">
				<span> {{getFileName(file.name) }} </span>
			</div>
		</template>
	</div>
</template>

<script setup>
import { getToken } from "@/utils/auth";
import { BASE_FILE_URL, BASE_UPLOAD_FILE_URL } from "@/store/global-constant";
import { selfworkUploadFile, upLoadedPofile, getPdfPagesInfo, getPdfPagesDetail } from '@/api/prepress';
import { toRefs } from "vue";
import { useRoute } from 'vue-router';
import { downPrepressFile,senseUrl,getFileName } from "@/utils/index"
import { ElMessage, ElMessageBox } from "element-plus";
const route = useRoute();

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
		default: 50,
	},
	// 文件类型, 例如['png', 'jpg', 'jpeg']
	fileType: {
		type: Array,
		default: () => ['pdf'],
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
		default: true,
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
	orderDetails: {
		type: Object,
		default: {}
	},
	orderType: {
		type: Number,
		default: 0
	},
	//零件属性
	productAttr: {
		type: String,
		default: ''
	},
	//零件po
	poNo: {
		type: String,
		default: ''
	},
	//下载按钮
	down: {
		type: Boolean,
		default: true,
	},
	//是否零件
	isPart: {
		type: Boolean,
		default: false
	},
	queryData:{
		type: Object,
		default: {}
	},
	newstyle:{
		type: Boolean,
		default: false
	},
	dldbtn:{
		type: Boolean,
		default: true
	}
})

const { proxy } = getCurrentInstance();
const emit = defineEmits();
const number = ref(0);
const uploadFileUrl = BASE_UPLOAD_FILE_URL() // 上传文件服务器地址
const headers = ref({
	Authorization: 'Bearer ' + getToken(),
	token: localStorage.getItem('Access-Token'),
})
const fileList = ref([])
const showTip = computed(
	() => props.isShowTip && (props.fileType || props.fileSize)
)
const { orderDetails, orderType, isPart } = toRefs(props)

watch(
	() => props.modelValue,
	(val) => {
		if (val) {
			let temp = 1
			// 首先将值转为数组
			const list = Array.isArray(val) ? val : props.modelValue.split(',')
			// 然后将数组转为对象数组

			fileList.value = list.map((item) => {
				if (typeof item === 'string') {
					item = { name: item, url: item }
				}
				item.uid = item.uid || new Date().getTime() + temp++
				return item
			})
		} else {
			fileList.value = []
			return []
		}
	},
	{ deep: true, immediate: true }
)
async function upload(file) {
	let flag = handleBeforeUpload(file.raw)
	if (!flag) {
		return
	}
	console.log('orderDetails.value',orderDetails.value);
	if (!orderDetails.value?.productAttr) {
		proxy.$modal.msgError(
			`文件详情获取失败!请刷新页面!`
		)
		return
	}
	const formData = new FormData()
	formData.append('Filedata', file.raw, orderDetails.value.poNo+'.pdf')
	upLoadedPofile(formData, { mark: orderDetails.value.poNo })
	.then(res => {
		if (res.msg == 'SUCCESS') {
			getPdfPagesInfo({ pdfFile: res.data.pdfPath })
			.then(resp => {
				if (resp.msg == 'SUCCESS') {
					// console.log('props',props.queryData);
					getPdfPagesDetail({
						goodsId:route.query?.goodsId||orderDetails.value?.goodsId,
						goodsTag:orderDetails.value.goodsTag,
						info: JSON.stringify(resp.data),
						productAttr:props.productAttr || orderDetails.value.productAttr,
					}).then(response=>{
						if (response.code == 200) {
							if (response.data){
								proxy.$modal.closeLoading()
								ElMessageBox.confirm(response.data, '提示', {
									confirmButtonText: '重传',
									cancelButtonText: '忽略',
									type: 'warning'
								}).then(() => {
									fileList.value = []
								}).catch(() => {
									proxy.$modal.loading('正在上传文件，请稍候...')
									uploadPdfFiles(res.data.pdfPath)
								});
							}else{
								uploadPdfFiles(res.data.pdfPath)
							}
						} else {
							uploadFail()
						}
					}).catch(err => {
						console.log('pdf文件上传失败', err);
						uploadFail()
					})
				} else {
					uploadFail()
				}
			}).catch(err => {
				console.log('pdf文件上传失败', err);
				uploadFail()
			})
		} else {
			uploadFail()
		}
	}).catch(err => {
		console.log('pdf文件上传失败', err);
		uploadFail()
	})
}
function uploadFail() {
	// ElMessage.error('文件上传失败，请稍后重试！')
	fileList.value = []
	proxy.$modal.closeLoading()
}
function uploadPdfFiles(pdfFile) {
	if (!orderDetails.value?.productAttr) {
		proxy.$modal.msgError(
			`文件详情获取失败!请刷新页面!`
		)
		return
	}
	let obj = {
		"activityId": route.query.id || orderDetails.value?.activityId,
		"productAttr": props.productAttr || orderDetails.value.productAttr,
		"goodsId": route.query.goodsId || orderDetails.value?.goodsId,
		"productNumber": route.query.num || orderDetails.value?.productNumber,
		"poNo": props.poNo || orderDetails.value.poNo,
		orderType: orderType.value,//0普通盒型，1精装盒,2双驳盒
		isPart: isPart.value ? 0 : 1,//是否零件 0是 1否
		poxmlUrl: orderDetails.value.poxmlUrl,
		pdfFile:pdfFile
	}
	// formData.append('multipartFile', file.raw)
	// formData.append('data', JSON.stringify(obj))
	selfworkUploadFile(obj).then(res => {
		if (res.code == 200) {
			fileList.value = [
				{
					name: res.data.pdfFile.slice(res.data.pdfFile.lastIndexOf('/') + 1),
					url: res.data.pdfFile,
				}
			]

			if (!!res.data.reportFile) {
				emit('callBack', res.data.reportFile)
			}
			emit('update:modelValue', listToString(fileList.value))
		}
	}).finally(() => {
		proxy.$modal.closeLoading()
	})
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
	if (file.name.lastIndexOf(',') > -1) {
		proxy.$modal.msgError(`文件名称不能包含特殊符号`)
		return false
	}
	// if (file.name.indexOf(orderDetails.value.poNo)==-1) {
	// 	proxy.$modal.msgError(
	// 		`文件名错误，请重新上传！`
	// 	)
	// 	return
	// }
	proxy.$modal.loading('正在上传文件，请稍候...')
	number.value++
	return true
}


// 删除文件
function handleDelete(index) {
	fileList.value.splice(index, 1)
	emit('update:modelValue', listToString(fileList.value))
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
function downFile(url) {
	downPrepressFile([url], getFileName(url))
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

.down {
	line-height: 16px;
	font-size: 20px;
	margin-right: 10px;
	cursor: pointer;

	&:hover {
		color: #409EFF;
	}
}
</style>
