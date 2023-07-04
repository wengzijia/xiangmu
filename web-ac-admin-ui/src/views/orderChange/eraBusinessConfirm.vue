<template>
    <div  v-loading="loading">
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
            ><span>订单状态：{{ formParams.orderStatusName || "无"}}</span>
          </div>
       
          <el-form
            :model="formParams"
            class="pad"
            :rules="changeRules"
            ref="changeRef"
          >
          <el-form-item>
              <el-form-item>
                <span class="mar_30 dis_inl"
                  ><span class="cor">*</span>确认接受变更</span
                >
              </el-form-item>
              <el-form-item prop="type">
                <el-radio-group v-model="formParams.type" class="ml-4" :disabled="allDisabled()">
                  <el-radio label="2" size="large">确认接变变更</el-radio>
                  <el-radio label="3" size="large">不接受，撤销变更</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form-item>
            <div>
              <div class="title mar_60">
                <span class="cor">*</span>代客户确认说明
              </div>
              <el-form-item prop="auditInstructions">
                <Editor v-model:html="formParams.auditInstructions" placeholder="请输入" :edit="isOperate"   :style="!isOperate ? 'cursor: not-allowed;' : ''" style="width: 100%;" ></Editor>
              </el-form-item>
              <el-form-item>
                <div class="btn_mar">
                  <el-button class="addCost" size="large" @click="submit()"  v-if="!allDisabled()"
                    >提交</el-button
                  >
                  <el-button size="large" @click="changeCancelClick(formParams.changeNo)"
                    >取消</el-button
                  >
                </div>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  // 接受参数
  import { useRouter } from "vue-router";
  const route = useRoute();
  const { proxy } = getCurrentInstance();
  import { getById, salesmanConfirmation } from "@/api/orderChange/detail";
  import Editor from "@/components/Editor"
  import { ElMessage,ElMessageBox } from "element-plus";
  const router = useRouter();
  const changeRef = ref();
  let { id,stepsType } = route.query;
  const title = ref('结构制作');
  const loading = ref(true)
  const aa = ref(true)
  const isOperate = ref(false)
  const data = reactive({
    formParams: {
    },
    changeRules: {
      auditInstructions: [{ required: true, message: "请输入意见", trigger: "blur" }],
      type: [{ required: true, message: "请选择接受变更", trigger: "blur" }],
    },
  });
  const { formParams, changeRules } = toRefs(data);
  const changeCancelClick = (order) => {
    router.push({
    path: "orderChangeDetail",
    query: {
      changeNo:order,
     },
  });
  };
  const getList = () => {
    console.log(id);
  let obj = {
    id: id,
    stepsType:stepsType
  };
  getById(obj)
    .then((res) => {
      if (res.code == 200) {
        console.log('被调用', res.data);
        formParams.value = res.data
        formParams.value.orderStatusName = formParams.value.orderStatusName.replace('null','')
        if (formParams.value.status == 1) {
          isOperate.value = true
        } else {
          formParams.value.type = formParams.value.status?.toString()
          isOperate.value = false
        }
        loading.value = false
      }
    })
    .catch(() => {   loading.value = false })
    .finally(() => {    loading.value = false});
};
getList();
const allDisabled = () => {
  if (isOperate.value) {
    return false
  } else {
    return true
  }
}
const submit = () => {
  proxy.$refs.changeRef.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm("确认" + "提交吗" + "?")
        .then(() => {
          console.log(34321);
          let obj = {
            "auditInstructions": formParams.value.auditInstructions,
            "status": formParams.value.type,
            "changeNo":formParams.value.changeNo
          }
          salesmanConfirmation(obj)
            .then((res) => {
              if (res.code == 200) {
                ElMessage({
                  type: "success",
                  message:res.data,
                });
                getList()
              }
            })
            .catch(() => { })
            .finally(() => { });
          console.log(obj);

        }).catch(() => { });
    }
  });
};
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
  </style>
  