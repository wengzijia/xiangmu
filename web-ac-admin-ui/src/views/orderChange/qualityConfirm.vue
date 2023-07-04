<template>
  <div v-loading="loading"> 
    <el-card style="margin: 10px">
      <template #header>
        <div class="card-header">
          <span>审核确认</span>
        </div>
      </template>
      <div style="max-width: 1200px">
        <div>
          <span>变更PO:</span
          ><span class="cor_po mar_30">{{ formParams.poSn }}</span
          ><span>订单状态:{{formParams.orderStatusName || "无"}}</span>
        </div>
        <div class="title mar_60">订单参数</div>
        <div>
          {{ formParams?.updateInfo?.oldGoodsAttr }}
          <el-button type="success" class="btn_marRl" @click="ShowSmart()"
            >规格Smart</el-button
          >
        </div>
        <div class="title mar_60">客户文件</div>
        <div>
        <el-button @click="downFile(formParams?.updateInfo.oldFile)">下载客户文件</el-button>
        </div>
        <el-form :model="formParams" :rules="changeRules" ref="changeRef">
          <div class="mar_60">
            <div class="title ">
              <span class="cor">*</span>审核{{ IsPsssText }}原因
            </div>
            <el-form-item prop="auditInstructions">
              <el-input v-model="formParams.auditInstructions" :autosize="{ minRows: 4, maxRows: 8 }" type="textarea"
                placeholder="请输入" maxlength="240" show-word-limit :disabled="allDisabled()" />
            </el-form-item>
            <el-form-item>
              <div class="btn_mar">
                <el-button class="addCost" size="large" @click="submit(2, '审核通过')"
                v-if="!allDisabled()">审核通过</el-button>
                <el-button size="large" @click="submit(3, '审核不通过')" type="info"
                v-if="!allDisabled()">审核不通过</el-button>
                <el-button size="large" @click="changeCancelClick(formParams.changeNo)">取消</el-button>
              </div>
            </el-form-item>
          </div>
        </el-form>
        <el-dialog
          v-model="dialogTableVisible"
          title="规格显示美化"
          style="width: 600px"
          destroy-on-close
        >
          <el-descriptions :title="formParams?.updateInfo?.oldGoodsAttr" :column="2"  border>
            <template v-for="item in SmartSpecs" :key="item.id">
              <el-descriptions-item :label="item.name" label-align="right" align="left">{{
                item.val
              }}</el-descriptions-item></template
            >
          </el-descriptions>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script setup>
// 接受参数
import { useRouter } from "vue-router";
import { getById, approve } from "@/api/orderChange/detail";
import { singleDownload } from '@/api/download'
import { ElMessage, ElMessageBox } from "element-plus";
const IsPsssText = ref();
const router = useRouter();
const route = useRoute();
let { id } = route.query;
const loading = ref(true)
const { proxy } = getCurrentInstance();
const changeRef = ref();
const dialogTableVisible = ref(false);
const isOperate = ref(false)
const title = ref("结构制作");
const SmartSpecs = ref([]);
const data = reactive({
  formParams: {
    auditInstructions: "",
  },
  changeRules: {
    auditInstructions: [{ required: true, message: "请输入意见", trigger: "blur" }],
  },
});
const {  formParams, changeRules } = toRefs(data);
const ShowSmart = () => {
  let arr = formParams.value?.updateInfo?.oldGoodsAttr.split(";").filter(Boolean);
  SmartSpecs.value = arr.map((item) => {
    if(!item.split(":")[1]){
        item = { name: '', val: item.split(":")[0] };
    }else{
        item = { name: item.split(":")[0]+':', val: item.split(":")[1] };
    }
    return item;
  });
  dialogTableVisible.value = true;
};
const getList = () => {
  let obj = {
    id: id,
  };
  getById(obj)
    .then((res) => {
      if (res.code == 200) {
        console.log('被调用', res.data.produceGroupFileHandler);
        formParams.value = res.data
        formParams.value.orderStatusName = formParams.value.orderStatusName.replace('null','')
        formParams.value.produceGroupFileHandler = res.data.produceGroupFileHandler?.toString()
        formParams.value.groupFileHandler = res.data.groupFileHandler?.toString()
        formParams.value.pressFileHandler = res.data.pressFileHandler?.toString()
        if(formParams.value.updateInfo.goodsAttr){
          formParams.value.updateInfo.oldGoodsAttr = formParams.value.updateInfo.goodsAttr
        }else{
          formParams.value.updateInfo.oldGoodsAttr = formParams.value.updateInfo.oldGoodsAttr
        }
        if(formParams.value.updateInfo.file){
          formParams.value.updateInfo.oldFile = formParams.value.updateInfo.file
        }else{
          formParams.value.updateInfo.oldFile = formParams.value.updateInfo.oldFile
        }
        if (formParams.value.status == 1) {
          isOperate.value = true
        } else {
          isOperate.value = false
          if (formParams.value.status == 2) {
            IsPsssText.value = '通过'
          } else if (formParams.value.status == 3) {
            IsPsssText.value = '不通过'
          }
        }
      
      }
    })
    .catch(() => {        loading.value = false })
    .finally(() => {         loading.value = false});
};
getList();
const submit = (type, judgeType) => {
  proxy.$refs.changeRef.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm("确认" + judgeType + "?")
        .then(() => {
          let obj = {
            "groupSn": formParams.value.groupSn,
            "id": formParams.value.id,
            "auditInstructions": formParams.value.auditInstructions,
            "status": type,
          }
          console.log(obj);
          approve(obj)
            .then((res) => {
              if (res.code == 200) {
                ElMessage({
                  type: "success",
                  message:res.data,
                });
                console.log("___153", res);
                getList()
              }
            })
            .catch(() => { })
            .finally(() => { });
        }).catch(() => { });
    }
  });
};
const allDisabled = () => {
  if (isOperate.value) {
    return false
  } else {
    return true
  }
}
const changeCancelClick = (order) => {
  router.push({
    path: "orderChangeDetail",
    query: {
      changeNo:order,
     },
  });
};
function downFile(url){
    singleDownload({fileName:url})
  }
</script>

<style lang="scss" scoped>
.cor_po {
  color: #02a7f0;
  display: inline-block;
}
.mar_30 {
  margin-right: 30px;
}
.title {
  padding: 10px 0px;
  font-weight: bold;
  font-size: 15px;
}
.mar_60 {
  margin-top: 30px;
}
.bg {
  background-color: rgba(250, 205, 145, 0.168627450980392);
  padding: 20px;
}
.pad {
  padding: 10px 20px;
}
.dis_inl {
  display: inline-block;
  margin-right: 30px;
}
.addCost {
  background-color: $bgColor;
  color: $color;
  border: $borColor;
}
.btn_mar {
  text-align: center;
  margin: 20px auto;
}
.cor {
  color: var(--el-color-danger);
}
.btn_marRl {
  margin: 10px 20px;
}
</style>
