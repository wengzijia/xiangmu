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
          <span>变更PO:</span><span
            class="cor_po mar_30">{{ formParams.poSn }}</span><span>订单状态：{{ formParams.orderStatusName || "无" }}</span>
        </div>
        <div v-if="formParams.isMakeUpGroup">
        <div class="title mar_60">大版文件处理</div>
        <div class="bg">
          <span>变更订单号为:</span><span class="cor_po mar_30">{{ formParams.poSn }}</span><span>关联大版单号:</span><span
            class="cor_po">{{ formParams.groupSn }}</span>({{ orderChange_makeUp_status[formParams.makeUpType]?.label }})
        </div>
        </div>
        <el-form :model="formParams" :rules="changeRules" ref="changeRef" >
          <div v-if="isCheck == 'reexamine'">
            <el-form-item class="pad">
              <el-form-item>
                <span class="mar_30 dis_inl"><span class="cor">*</span>生产结论</span>
              </el-form-item>
              <el-form-item prop="produceGroupFileHandler">
                <el-radio-group v-model="formParams.produceGroupFileHandler" class="ml-4">
                  <el-radio :label="item.value" :key="item.value" size="large" v-for="item in orderChange_groupFile_type"
                    disabled>{{ item.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form-item>
          </div>
          <el-form-item class="pad"  v-if="formParams.isMakeUpGroup">
              <el-form-item>
                <span class="mar_30 dis_inl"><span class="cor">*</span>{{isCheck=="reexamine"?"印前复核":"本次变更"}}</span>
              </el-form-item>
              <el-form-item prop="groupFileHandler">
                <el-radio-group v-model="formParams.groupFileHandler" class="ml-4" @change="ChangeCheck">
                  <el-radio :label="item.value" :key="item.value" size="large"
                    v-for="item in orderChange_groupFile_type"  :disabled="allDisabled()">{{ item.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form-item>
          <div class="title mar_60">印前文件处理</div>
          <el-form-item>
            <el-form-item>
              <span class="mar_30 dis_inl"><span class="cor">*</span>本次变更</span>
            </el-form-item>
            <el-form-item prop="pressFileHandler">
              <el-radio-group v-model="formParams.pressFileHandler" class="ml-4">
                <el-radio :label="item.value" :key="item.value" size="large" v-for="item in orderChange_pressFile_type"
                  :disabled="isDisabled(item.value) || allDisabled()">{{ item.label }}</el-radio>
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
import editTable from "./componentsConfirm/editTable.vue";
import { getById,approve } from "@/api/orderChange/detail";
import { ElMessage,ElMessageBox } from "element-plus";
const { proxy } = getCurrentInstance();
const { orderChange_groupFile_type, orderChange_makeUp_status, orderChange_pressFile_type } = proxy.useDict("orderChange_groupFile_type", "orderChange_makeUp_status", "orderChange_pressFile_type");
const route = useRoute();
const router = useRouter();
let {  id } = route.query;
const isCheck = ref('examine')
const IsPsssText = ref();
const redoDisabled = ref(false)
const replaceDisabled = ref(false)
const originDisabled = ref(false)
const changeRef = ref();
const isOperate = ref(false)
const loading = ref(true)
const validateNumber = (rule, value, callback) => {
  let reg2 = /^([0-9][0-9]*)$/; //正整数
  if (value === "" || value === null) {
    callback(new Error("请输入费用金额"));
  } else {
    if (!reg2.test(value)) {
      callback(new Error("请输入正整数"));
    } else {
      callback();
    }
  }
};
const data = reactive({
  tableData: [{ type: "变更损耗费用", item: "1", pay: "120" }],
  formParams: {
  },
  changeRules: {
    groupFileHandler: [{ required: true, message: "请选择本次变更", trigger: "blur" }],
    pressFileHandler: [{ required: true, message: "请选择本次变更", trigger: "blur" }],
    // checkRadio1: [{ required: true, message: "请选择生产结论", trigger: "change" }],
    // checkRadio2: [{ required: true, message: "请选择印前复核", trigger: "change" }],
    auditInstructions: [{ required: true, message: "请输入意见", trigger: "blur" }],
  },
  changeObject: {
    title: '变更损耗费用',
    describe: '填报印前制作变更带来的损耗费用'
  },
  changeRadio: [{ name: '需拆除大版重拼大版文件', val: 1 }, { name: '不拆大版需要替换大版文件', val: 2 }, { name: '不拆大版按原大版文件', val: 3 }],
  pressChangeRadio: [{ name: '重做印前文件', val: 1 }, { name: '替换印前文件', val: 2 }, { name: '按原印前文件', val: 3 },]
});
const { tableData, formParams, changeRules, changeObject, changeRadio, pressChangeRadio } = toRefs(data);
const changeCancelClick = (order) => {
  // if (!changeRef.value) return;
  // changeRef.value.resetFields();
  router.push({
    path: "orderChangeDetail",
    query: {
      changeNo:order,
     },
  });
};
const ChangeCheck = (val) => {
  isDisabled()
  formParams.value.pressFileHandler = ''
}
const isDisabled = (row, index) => {
  if (orderChange_groupFile_type.value.length < 3) {
    return false
  }
  let changeName1 = orderChange_groupFile_type?.value[0].value;
  let changeName2 = orderChange_groupFile_type?.value[1].value;
  let changeName3 = orderChange_groupFile_type?.value[2].value;
  let groupFileHandler = formParams.value.groupFileHandler;
  if (groupFileHandler == changeName1) {
    if (row != 1) {
      return true
    } else {
      return false
    }
  }
  if (groupFileHandler == changeName2 ) {
    if (row == 1) {
      return true
    } else {
      return false
    }
  }
  if (groupFileHandler == changeName3) {
    if (row != 3) {
      return true
    } else {
      return false
    }
  }
  return false
}
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
        formParams.value.orderStatusName = formParams.value.orderStatusName.replace('null','')
        formParams.value.produceGroupFileHandler =formParams.value.produceGroupFileHandler|| res.data.produceGroupFileHandler?.toString()
        formParams.value.groupFileHandler =formParams.value.groupFileHandler|| res.data.groupFileHandler?.toString()
        formParams.value.pressFileHandler =formParams.value.pressFileHandler|| res.data.pressFileHandler?.toString()
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
        let ArrNode = res.data.node.split(",")
        if (ArrNode.indexOf("3") !== -1 || ArrNode.indexOf("4") !== -1) {
          isCheck.value = 'reexamine'
        } else {
          isCheck.value = 'examine'
        }
       
      }
    })
    .catch(() => {  loading.value = false})
    .finally(() => {  loading.value = false});
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
          console.log(34321);
          let obj = {
            "groupFileHandler": formParams.value.groupFileHandler,
            "groupSn": formParams.value.groupSn,
            "id": formParams.value.id,
            "auditInstructions": formParams.value.auditInstructions,
            "status": type,
            "pressFileHandler": formParams.value.pressFileHandler
          }
          console.log(obj);
          approve(obj)
            .then((res) => {
              if (res.code == 200) {
                ElMessage({
                  type: "success",
                  message: res.data,
                });
                console.log("___153", res);
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
  padding: 10px 20px 0px;
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
<style>
:deep(.el-table__fixed){
  height: 100% !important;
}
:deep(.el-table__fixed-right ){
  height: 100% !important;
}

</style>
  