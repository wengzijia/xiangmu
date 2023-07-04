<template>
  <!-- 启动核算弹出框 -->
  <ACDialog title="审核" width="40%" v-model="accountingVisible" @close="accountingVisible = false"
    @bottom-btn-click="handleAccounting">
    <template #default>
      <div class="ac-dialog-title dialog-title">已选择{{ dialogParams.selectRowCount }}条账单，请确认核算结果：</div>
      <auditAndRemark ref="auditAndRemarkRef"></auditAndRemark>
    </template>
  </ACDialog>
</template>

<script setup name="auditDialog">
import { ref } from 'vue';
import ACDialog from '@/components/ACDialog.vue'
import auditAndRemark from "./components/auditAndRemark.vue";
import { billAudit } from "@/api/modules/accountChecking"
import {useBroadcast} from '@/hooks/component/useBroadcast'
let {postRefreshPendingListMessage}  = useBroadcast()

//启动核算弹出框
const accountingVisible = ref(false);
let dialogParams = reactive({
  selectRowCount: 1,//选择的行数
});
//打开弹出框（供父级界面调用）
const openDialog = (type, params) => {
  Object.assign(dialogParams, params)
  accountingVisible.value = true
  auditAndRemarkRef.value?.resetForm()
}
defineExpose({
  openDialog
})

const emit = defineEmits(['complete'])
const auditAndRemarkRef = ref()
const handleAccounting = ({ confirm }) => {
  if (confirm) {
    auditAndRemarkRef.value.handleValid().then(e =>  {
      if(!e) return console.warn(e);
      let payload = {
        isErrorPage: true,
        chooseIds: dialogParams.selectRowIds,
        manufacturerId: dialogParams.manufacturerId,
        auditStatus: e.conclusion,
        remark: e.remark
      }
      billAudit(payload).then(res => {
        let { code, message = '服务错误' } = res
        if (code !== window.HTTP_SUCCESS) {
            return ElMessage.error(message)
        } else {
          accountingVisible.value = false
          auditAndRemarkRef.value.resetForm()
          postRefreshPendingListMessage()
          emit("complete", true)
        }
      })
    })
  } else {
    auditAndRemarkRef.value.resetForm()
  }
}
</script>

<style lang="scss" scoped>
.dialog-title {
  font-size: 14px;
  color: #333;
  line-height: 21px;
  margin-top: 0;
  margin-bottom: 16px;
}

.ac-dialog-title {
  &.center {
    text-align: center;
  }
}
</style>