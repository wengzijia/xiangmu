<template>
  <div>
    <el-link :underline="false" type="primary" @click="getLog">详情</el-link>
    <el-dialog v-model="isLogsShow" title="备注" width="1000px" append-to-body destroy-on-close>
      <el-scrollbar :style="'margin-right: 20px;height:' + height + 'px;'" v-loading="loading">
        <div v-if="showButton">
          <span style="margin-right: 16px;margin-bottom: 10px;">文件历史领取信息确认</span>
          <el-button type="primary" size="small" @click="agree">授权备注</el-button>
        </div>
          <el-menu
              :default-active="'1'"
              mode="horizontal"
            >
              <el-menu-item index="1">客户文件变更历史</el-menu-item>
            </el-menu>
        <div v-for="item in fileList" :key="item.id" class="mar_all2">
          <el-form label-width="90px" ref="dialogForm">
          
            <el-form-item label="时间:">
              <div>{{ item.opsTime || '-' }}</div>
            </el-form-item>
            <el-form-item label="添加人:">
              <div>{{ item.opsName || '-' }}</div>
            </el-form-item>
            <el-form-item label="类型:">
              <DictTag  :value="item.type" :options="perperss_remark_type" />
            </el-form-item>
            <el-form-item label="已阅读:">
              <div>-</div>
            </el-form-item>
            <!-- <el-form-item label="备注内容:">
              <div v-html="item.remark" class="remark-body"></div>
              <div v-if="!item.remark">-</div>
              <template v-if="item.remarkImageUrl?.length">
                <el-image
                  v-for="(items, index) in item.remarkImageUrl"
                  :key="index"
                  :src="items"
                  fit="cover"
                  :preview-src-list="item.remarkImageUrl"
                  append-to-body="true"
                  :initial-index="index"
                  class="wid_100"
                >
                </el-image>
              </template>
            </el-form-item> -->
          </el-form>
        </div>
          <el-menu
              :default-active="'1'"
              mode="horizontal"
            >
              <el-menu-item index="1">备注变更历史</el-menu-item>
            </el-menu>
        <div v-for="item in logs" :key="item.id" class="mar_all2">
          <el-form label-width="90px" ref="dialogForm">
          
            <el-form-item label="时间:">
              <!-- <div>{{ item.opsTime || '-' }}</div> -->
              <span>{{parseDate(item.opsTime)}}</span>
            </el-form-item>
            <el-form-item label="添加人:">
              <div>{{ item.opsName || '-' }}</div>
            </el-form-item>
            <el-form-item label="类型:">
              <DictTag  :value="item.type" :options="perperss_remark_type" />
            </el-form-item>
            <el-form-item label="已阅读:">
              <div>-</div>
            </el-form-item>
            <el-form-item label="备注内容:">
             <!-- <div v-html="item.remark" @click="imgViewer" class="remark-body"></div> -->
              <div>
                <HtmlImaagePriview :html='item.remark'></HtmlImaagePriview>
                <div v-if="!item.remark">-</div>
                <template v-if="item.remarkImageUrl?.length">
                  <el-image
                    v-for="(items, index) in item.remarkImageUrl"
                    :key="index"
                    :src="items"
                    fit="cover"
                    :preview-src-list="item.remarkImageUrl"
                    append-to-body="true"
                    :initial-index="index"
                    class="wid_100"
                  >
                  </el-image>
                </template>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
    </el-dialog>
    <el-image-viewer :url-list="previewList" v-if='isPreviewImgShow' @close="closeImgViewer" ></el-image-viewer>
  </div>
</template>

<script setup>
import { getPrepressLogs, agreePrepressModifyRemark } from '@/api/prepress';
import { getDigitalLogs, agreeDigitalModifyRemark, getCuttingLogs, agreeCuttingModifyRemark } from "@/api/proofDigital/index";
import { ElMessage, ElLoading } from 'element-plus';
import { BASE_FILE_URL } from "@/store/global-constant";
import { toRefs, watch } from 'vue';
import { parseDate } from "@/utils/index";
const { proxy } = getCurrentInstance();
// const { perperss_remark_type, } = proxy.useDict("perperss_remark_type");

const prop = defineProps({
  order: {
    type: Object,
    default: {}
  },
  height: {
    type: Number,
    default: 550
  },
  type: {
    type: String,
    default: ''
  },
  showButton: {
    type: Boolean,
    default: false
  },
  perperss_remark_type: {
    type: Array,
    default:[]
  }
})
const emit = defineEmits()
const { order, type, perperss_remark_type} = toRefs(prop)
const logs = ref([])
const fileList = ref([]);
const isLogsShow = ref(false)
const loading = ref(false)

function getLog() {
  isLogsShow.value = true
  loading.value = true
  switch (type.value) {
    case 'prepress':
      getPrepressLogs(order.value.activityId).then(res => {
        if (res.code == 200) {
          logs.value = res.data.map(item=>{
            if (item.remarkImageUrl?.length) {
              item.remarkImageUrl = item.remarkImageUrl.map(url=>{if(url) return (BASE_FILE_URL + url)})
            }
            return item
          })
          fileList.value = res.data.filter((item)=>{return item.type == 5})
        }
      }).finally(() => {
        loading.value = false
      })
      break;
    case 'digital':
      getDigitalLogs(order.value.activityId).then(res => {
        if (res.code == 200) {
          logs.value = res.data.map(item=>{
            if (item.remarkImages?.length) {
              item.remarkImageUrl = item.remarkImages.map(url=>{if(url) return (BASE_FILE_URL + url)})
            }
            return item
          })
          fileList.value = res.data.filter((item)=>{return item.type == 5})
        }
      }).finally(() => {
        loading.value = false
      })
      break;
    case 'cutting':
      getCuttingLogs(order.value.activityId).then(res => {
        if (res.code == 200) {
          logs.value = res.data.map(item=>{
            if (item.remarkImages?.length) {
              item.remarkImageUrl = item.remarkImages.map(url=>{if(url) return (BASE_FILE_URL + url)})
            }
            return item
          })
          fileList.value = res.data.filter((item)=>{return item.type == 5})
        }
      }).finally(() => {
        loading.value = false
      })
      break;

    default:
      break;
  }

}
function agree() {
  switch (type.value) {
    case 'prepress':
      agreePrepressModifyRemark({
        "activityId": order.value.activityId,
        "orderNo": order.value?.orderNo || '',
        "poNo": order.value?.poNo || '',
        "proofNo": order.value?.proofNo || ''
      }).then(res => {
        if (res.code == 200) {
          ElMessage.success('成功!')
          emit('getList',true)
        }
      })
      break;
    case 'digital':
      agreeDigitalModifyRemark({
        "activityId": order.value.activityId,
        "orderNo": order.value?.orderNo || '',
        "poNo": order.value?.poNo || '',
        "proofNo": order.value?.proofNo || ''
      }).then(res => {
        if (res.code == 200) {
          ElMessage.success('成功!')
          emit('getList',true)
        }
      })
      break;
    case 'cutting':
      agreeCuttingModifyRemark({
        "activityId": order.value.activityId,
        "orderNo": order.value?.orderNo || '',
        "poNo": order.value?.poNo || '',
        "proofNo": order.value?.proofNo || ''
      }).then(res => {
        if (res.code == 200) {
          ElMessage.success('成功!')
          emit('getList',true)
        }
      })
      break;

    default:
      break;
  }
}

// 富文本内容图片放大
let isPreviewImgShow = ref(false)
let previewList = ref([])
function imgViewer(e){
  if (e.target.tagName == 'IMG') {
    previewList.value = [e.target.src]
    isPreviewImgShow.value = true
  }
}
function closeImgViewer(){
  isPreviewImgShow.value = false
}


</script>

<style lang="scss" scoped>
.mar_all2 {
  padding-left: 30px;
  border-left: 4px solid #409eff;
  margin-top: 40px;
  margin-left: 40px;

}
</style>
<style>
.remark-body img{
  width: 200px;
}
</style>