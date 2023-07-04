<template>
    <div>
      <el-card style="margin: 10px">
        <template #header>
          <div class="card-header">
            <span>审核确认</span>
          </div>
        </template>
        <div style="max-width: 1200px">
          <div>
            <span>变更PO:</span
            ><span class="cor_po mar_30">PO2022102743924951</span
            ><span>订单状态：订料（暂停中）</span>
          </div>
          <div class="title mar_60">结构文件处理</div>
          <el-form
            :model="formParams"
            class="pad"
            :rules="changeRules"
            ref="changeRef"
          >
            <el-form-item>
              <el-form-item>
                <span class="mar_30 dis_inl"
                  ><span class="cor">*</span>本次变更</span
                >
              </el-form-item>
              <el-form-item prop="structureFileHandler">
                <el-radio-group v-model="formParams.structureFileHandler" class="ml-4" >
                  <el-radio :label="item.value" :key="item.value" size="large" v-for="item in orderChange_structureFile_type" :disabled="allDisabled()"
                    >{{ item.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form-item>
            <div style="overflow: visible !important;" v-if="Object.values(formParams).length>0">
            <editTable :table-val="formParams || {}" :change-object="changeObject" @changeList="getList" ></editTable>
          </div>
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
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  // 接受参数
  import { useRouter } from "vue-router";
  import { getById,approve } from "@/api/orderChange/detail";
import { ElMessage,ElMessageBox } from "element-plus";
const { proxy } = getCurrentInstance();
const { orderChange_structureFile_type } = proxy.useDict("orderChange_structureFile_type");
const route = useRoute();
const router = useRouter();
let {  id } = route.query;
  import editTable from "./componentsConfirm/editTable.vue";
  const changeRef = ref();
  const IsPsssText = ref();
  const isOperate = ref(false)
  const loading = ref(true)
  const data = reactive({
    formParams: {
    },
    changeRules: {
      structureFileHandler: [{ required: true, message: "请选择本次变更", trigger: "blur" }],
      auditInstructions: [{ required: true, message: "请输入意见", trigger: "blur" }],
    },
    changeObject:{
    title:'变更损耗费用',
    describe:'填报结构制作变更带来的损耗费用'
  }
  });
  const {formParams, changeRules,changeObject } = toRefs(data);
  const changeCancelClick = (order) => {
  router.push({
    path: "orderChangeDetail",
    query: {
      changeNo:order,
     },
  });
};
  const getList = () => {
  let obj = {
    id: id,
  };
  getById(obj)
    .then((res) => {
      if (res.code == 200) {
        if(allDisabled()){
          formParams.value = res.data
        }else{
          formParams.value.changeCostDetailList = res.data.changeCostDetailList
        }
        formParams.value.structureFileHandler =formParams.value.structureFileHandler|| res.data.structureFileHandler?.toString()
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
        loading.value = false
      }
    })
    .catch(() => { })
    .finally(() => { });
};
getList();
const allDisabled = () => {
  if (isOperate.value) {
    return false
  } else {
    return true
  }
}
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
            "structureFileHandler": formParams.value.structureFileHandler
          }
          console.log(obj);
          approve(obj)
            .then((res) => {
              if (res.code == 200) {
                ElMessage({
                  type: "success",
                  message: res.data,
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
  