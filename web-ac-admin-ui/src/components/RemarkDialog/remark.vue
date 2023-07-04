<template>
  <div>
    <el-link :underline="false" type="primary" @click="getLog">{{
      showVal
    }}</el-link>
    <el-dialog
      v-model="isLogsShow"
      title="备注"
      width="800px"
      append-to-body
      class="remark"
      v-if="isLogsShow"
      destroy-on-close
    >
      <el-scrollbar
        :style="'margin-right: 20px;height:' + height + 'px;'"
        v-loading="loading"
      >
        <div class="margin-t">
          <span class="mar_in">文件历史领取信息确认</span>
          <el-button type="primary" @click="agree()" v-if="isShow"
            >授权备注</el-button
          >
        </div>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
        >
          <el-menu-item index="1">客户文件变更历史</el-menu-item>
        </el-menu>
        <div class="mar_all" v-if="logs.customerFileRemarks">
          <div class="mar_t40">
            <span>时间:</span
            >{{ parseDate(logs.customerFileRemarks?.remarkTime) }}
          </div>
          <div class="mar_t40">
            <span>添加人:</span
            >{{ logs.customerFileRemarks?.operatorName || "-" }}
          </div>
          <div class="mar_t40"><span>已阅读:</span>{{ "-" }}</div>
          <div class="mar_t40">
            <span>类型:</span
            ><DictTag
              :value="logs.customerFileRemarks?.type"
              :options="proxyType"
              style="display: inline-block"
            />
          </div>
          <!-- <div
            v-for="(item, index) in logs.customerFileRemarks?.file"
            :key="index"
          >
            <img :src="item" />
          </div> -->
          <template
            v-for="(item, index) in array(logs.customerFileRemarks.files)"
            :key="index"
          >
            <el-image
              :src="item"
              fit="cover"
              :preview-src-list="array(logs.customerFileRemarks.files)"
              append-to-body="true"
              :initial-index="index"
              class="wid_100"
            >
            </el-image>
          </template>
        </div>
        <div v-else class="empty">暂无数据</div>
        <el-menu
          :default-active="activeIndex2"
          class="el-menu-demo2"
          mode="horizontal"
        >
          <el-menu-item index="1">备注变更历史</el-menu-item>
        </el-menu>
        <template v-if="logs.remarkHistory && logs.remarkHistory.length > 0">
          <div v-for="(item, index) in logs.remarkHistory" :key="index">
            <div class="mar_all2">
              <div class="mar_t40">
                <span>时间:</span>{{ parseDate(item.remarkTime) }}
              </div>
              <div class="mar_t40">
                <span>添加人:</span>{{ item.operatorName || "-" }}
              </div>
              <div class="mar_t40">
                <span>类型:</span
                ><DictTag
                  :value="item.type"
                  :options="proxyType"
                  style="display: inline-block"
                />
              </div>
              <div class="mar_t40"><span>已阅读:</span>{{ "-" }}</div>
              <div class="mar_t40">
                <span>备注内容:</span>
                <HtmlImaagePriview :html='item.remarkContent' style="display:inline-block" class="remarkIndex"></HtmlImaagePriview>
              </div>
              <template
                v-for="(items, index) in array(item.files)"
                :key="index"
              >
                <el-image
                  :src="items"
                  fit="cover"
                  :preview-src-list="array(item.files)"
                  append-to-body="true"
                  :initial-index="index"
                  class="wid_100"
                >
                </el-image>
              </template>
            </div>
          </div>
        </template>
        <div v-else class="empty">暂无数据</div>
      </el-scrollbar>
    </el-dialog>
    
  </div>
</template>

<script setup>
import {
  getRemark,
  agreeModifyRemark,
} from "@/api/outworkManage/outworkFileBench";
import { getStrRemark, agreeStrModifyRemark } from "@/api/structural/selfWork";
import { getDelRemark, agreeDelModifyRemark } from "@/api/deliver/index";
import { ElMessage, ElLoading } from "element-plus";
import { nextTick } from "@vue/runtime-core";
import { parseDate } from "@/utils/index";
const { proxy } = getCurrentInstance();
const ossBaseUrl = "http://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/";
const prop = defineProps({
  order: {
    type: Object,
    default: {},
  },
  height: {
    type: Number,
    default: 550,
  },
  type: {
    type: String,
    default: "",
  },
 proxyType:{
  type:Array,
  default:[]
 }
});
const { order, type,proxyType} = toRefs(prop);
const logs = ref([]);
const isLogsShow = ref(false);
const loading = ref(false);
const activeIndex = ref("1");
const activeIndex2 = ref("1");
const showVal = ref("详情");

const isShow = ref(true);
const InterfaceName = ref(""); //接口名称
const BtnInterfaceName = ref(""); //按钮接口名称
// console.log(333,proxyType.value);
function getLog() {
 
  isLogsShow.value = true;
  loading.value = true;
  switch (type.value) {
    case "artwork":
      InterfaceName.value = getRemark;
        if(order.value.remarkFlag==2){
        isShow.value = true
      }else{
        isShow.value = false
      }
      break;
    case "structure":
      InterfaceName.value = getStrRemark;
      if(order.value.remarkFlag==2){
        isShow.value = true
      }else{
        isShow.value = false
      }
      break;
    case "proofDeliver":
      isShow.value = false
      InterfaceName.value = getDelRemark;
      break;
    default:
      loading.value = false;
      return;
      break;
  }
  InterfaceName.value({ taskId: order.value.id })
    .then((res) => {
      if (res.code == 200) {
        if (res.data.customerFileRemarks || res.data.remarkHistory.length > 0) {
          logs.value = res.data;
          loading.value = false;
        } else {
        }
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
function agree() {
  switch (type.value) {
    case "artwork":
      BtnInterfaceName.value = agreeModifyRemark;
      break;
    case "structure":
      BtnInterfaceName.value = agreeStrModifyRemark;
      break;
    default:
      isLogsShow.value = false;
      return;
      break;
  }
  BtnInterfaceName.value({
    originalId: order.value.id,
    orderNo: order.value?.orderNo || "",
    poNo: order.value?.poNo || "",
    proofNo: order.value?.proofNo || "",
  })
    .then((res) => {
      if (res.code == 200) {
        ElMessage.success("成功!");
        nextTick(() => {
          proxy.$emit("changeRemark");
        });
      }
    })
    .finally(() => {
      isLogsShow.value = false;
    });
}
function array(val) {
  if (val) {
    let imgs =  val.map((item) => {
      return ossBaseUrl + item;
    });
    return imgs
  }
}



</script>

<style lang="scss">
.remark .el-dialog__header {
  border-bottom: 1px solid rgba(215, 215, 215, 1);
}
</style>
<style scoped lang="scss">
.margin-t {
  margin-top: 10px;
}
.mar_in {
  margin-right: 22px;
  color: #333;
  display: inline-block;
}
.mar_all {
  margin-left: 70px;

  div span {
    margin-top: 40px;
    width: 60px;
    text-align: right;
    display: inline-block;
    font-size: 14px;
  }
}
.el-menu-demo2 {
  margin-top: 40px;
}
.mar_all2 {
  padding-left: 30px;
  border-left: 4px solid #409eff;
  margin-top: 40px;
  margin-left: 40px;
  div span {
    width: 60px;
    text-align: right;
    display: inline-block;
    font-size: 14px;
  }
  div:not(:first-child) span {
    margin-top: 40px;
  }
}
.wid_100 {
  width: 140px;
  /* margin-right: 30px; */
  margin-top: 20px;
  margin-left: 40px;
}
.empty {
  color: #909399;
  line-height: 60px;
  text-align: center;
}
.remarkIndex img{
  width: 200px;
}
.remarkIndex{
  word-break: break-all;
}

</style>
